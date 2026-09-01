"""
database.py — encrypted SQLite connection factory.

Encryption strategy (two-tier):
─────────────────────────────────────────────────────────────────────────────
Tier 1 (preferred): SQLCipher via sqlcipher3
  — Full-file AES-256-CBC encryption; every page on disk is ciphertext.
  — Requires: brew install sqlcipher && pip install sqlcipher3
  — Detected at import time; used if available.

Tier 2 (fallback): stdlib sqlite3 + AES-256-GCM field encryption
  — Plain SQLite file, but every string/decimal value written to the DB
    is encrypted individually using AES-256-GCM (cryptography library).
  — The raw .db file contains only ciphertext blobs in sensitive columns.
  — Works on any platform with: pip install cryptography

The health check reports which tier is active so the user knows at a glance.
─────────────────────────────────────────────────────────────────────────────

Usage:
    from database import get_conn, cipher, ENCRYPTION_MODE

    with get_conn() as conn:
        conn.execute("SELECT ...")

For encrypted field storage (Tier 2):
    from database import cipher
    blob = cipher.encrypt("some sensitive value")
    plain = cipher.decrypt(blob)
"""

from __future__ import annotations

import sqlite3
import json
import os
import base64
import threading
from contextlib import contextmanager
from typing import Generator

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag

from config import settings

# ── Determine which SQLite driver is available ────────────────────────────────

try:
    import sqlcipher3  # type: ignore
    _sqlcipher_available = True
except ImportError:
    _sqlcipher_available = False

ENCRYPTION_MODE: str = "sqlcipher" if _sqlcipher_available else "aes256gcm-fields"

# ── AES-256-GCM field cipher (always constructed; used in Tier-2 fallback) ───

class _FieldCipher:
    """
    Thin wrapper around AES-256-GCM for encrypting individual string values.

    encrypt(value) → base64-encoded string  (nonce || ciphertext || tag)
    decrypt(blob)  → original string
    """

    def __init__(self, key: bytes) -> None:
        assert len(key) == 32, "AES-256 requires a 32-byte key"
        self._aesgcm = AESGCM(key)

    def encrypt(self, value: str | float | int | None) -> str:
        if value is None:
            return ""
        plaintext = str(value).encode()
        nonce = os.urandom(12)           # 96-bit nonce per NIST recommendation
        ct = self._aesgcm.encrypt(nonce, plaintext, None)
        return base64.b64encode(nonce + ct).decode()

    def decrypt(self, blob: str | None) -> str:
        if not blob:
            return ""
        try:
            raw = base64.b64decode(blob.encode())
            nonce, ct = raw[:12], raw[12:]
            return self._aesgcm.decrypt(nonce, ct, None).decode()
        except (InvalidTag, Exception):
            return "[DECRYPT_ERROR]"


cipher = _FieldCipher(settings.db_key_bytes)

# ── Thread-local connection pool (one connection per thread) ──────────────────

_local = threading.local()


def _open_connection() -> sqlite3.Connection:
    """Open (and configure) a new DB connection using the available driver."""
    db_path = str(settings.db_full_path)

    if _sqlcipher_available:
        conn = sqlcipher3.connect(db_path)                        # type: ignore
        # Set the passphrase — must be the very first statement after connect.
        key_hex = settings.db_key_bytes.hex()
        conn.execute(f"PRAGMA key = \"x'{key_hex}'\";")
        conn.execute("PRAGMA cipher_page_size = 4096;")
        conn.execute("PRAGMA kdf_iter = 64000;")
        conn.execute("PRAGMA cipher_hmac_algorithm = HMAC_SHA512;")
    else:
        conn = sqlite3.connect(db_path)

    conn.row_factory = sqlite3.Row                                # dict-like rows
    conn.execute("PRAGMA journal_mode=WAL;")                      # safe concurrent reads
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


@contextmanager
def get_conn() -> Generator[sqlite3.Connection, None, None]:
    """
    Context manager that yields a per-thread SQLite connection.
    Commits on clean exit, rolls back on exception.
    """
    if not hasattr(_local, "conn") or _local.conn is None:
        _local.conn = _open_connection()

    conn = _local.conn
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise


def check_db_connection() -> bool:
    """Smoke-test: can we open the DB and run a trivial query?"""
    try:
        with get_conn() as conn:
            conn.execute("SELECT 1")
        return True
    except Exception:
        return False


# ── Schema bootstrap (called once at startup) ─────────────────────────────────

_BOOTSTRAP_SQL = """
-- Append-only audit log (written by every phase)
CREATE TABLE IF NOT EXISTS audit_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    event_time  TEXT    NOT NULL DEFAULT (datetime('now')),
    event_type  TEXT    NOT NULL,   -- INGEST | RECONCILE | RESOLVE | EVAL | ASK
    batch_id    TEXT,
    detail      TEXT                -- JSON blob (plaintext summary only)
);

-- Financial memory: approved variance patterns (Phase 6)
CREATE TABLE IF NOT EXISTS financial_memory (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern_key  TEXT NOT NULL UNIQUE,
    category     TEXT NOT NULL,
    description  TEXT NOT NULL,
    confidence   REAL NOT NULL DEFAULT 1.0,
    applied_count INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
"""


def bootstrap_schema() -> None:
    """Create base tables if they don't already exist.  Idempotent."""
    with get_conn() as conn:
        conn.executescript(_BOOTSTRAP_SQL)
