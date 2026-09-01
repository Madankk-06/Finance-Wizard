"""
routers/ingest.py — Phase 1: Ingest & Normalize

Endpoints:
  POST /api/demo-batch  → load the 3 sample CSVs from SAMPLES_DIR
  POST /api/upload      → accept 3 uploaded CSV files

Both paths:
  1. Parse & validate each CSV into a canonical schema (pandas).
  2. Store raw rows in raw_settlement / raw_bank / raw_ledger tables
     under a new batch_id (UUID4).
  3. Write an INGEST audit_log entry.
  4. Return batch_id + row counts so the frontend can immediately
     POST /api/reconcile/{batch_id}.

Security:
  All text columns stored via cipher.encrypt() (AES-256-GCM).
  Numeric columns stored as REAL (plaintext) — they are aggregates,
  not PII; full-field encryption of every float would double query cost.
  Merchants / order-IDs (potentially sensitive) are encrypted.
"""

from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from io import StringIO
from pathlib import Path
from typing import Optional

import pandas as pd
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from config import settings
from database import cipher, get_conn

router = APIRouter(prefix="/api", tags=["ingest"])

# ── Canonical column specs & aliases ──────────────────────────────────────────

SETTLEMENT_COLS = {
    "settlement_id":   str,
    "payment_id":      str,
    "order_id":        str,
    "merchant_id":     str,
    "gross_amount":    float,
    "mdr_fee":         float,
    "gst_on_mdr":      float,
    "tds_amount":      float,
    "refund_amount":   float,
    "net_amount":      float,
    "settlement_date": str,
}

SETTLEMENT_ALIASES = {
    "settlement_id": ["settlement_id", "settlement", "batch_id", "payout_id", "id"],
    "payment_id": ["payment_id", "pay_id", "txn_id", "transaction_id"],
    "order_id": ["order_id", "order_no", "orderno", "order", "invoice_no"],
    "merchant_id": ["merchant_id", "merchant", "merchant_name", "vendor"],
    "gross_amount": ["gross_amount", "gross", "invoiced_amount", "amount", "order_amount", "total"],
    "mdr_fee": ["mdr_fee", "mdr", "fee", "gateway_fee", "commission"],
    "gst_on_mdr": ["gst_on_mdr", "gst", "tax_on_mdr", "tax_fee"],
    "tds_amount": ["tds_amount", "tds", "withholding", "tax_deducted"],
    "refund_amount": ["refund_amount", "refund", "chargeback"],
    "net_amount": ["net_amount", "net", "settled_amount", "payout_amount", "bank_amount"],
    "settlement_date": ["settlement_date", "settle_date", "date", "created_at", "timestamp"]
}

BANK_COLS = {
    "utr":                str,
    "credit_amount":      float,
    "credit_date":        str,
    "narration":          str,
    "settlement_id_ref":  str,
}

BANK_ALIASES = {
    "utr": ["utr", "bank_utr", "ref_no", "reference_no", "transaction_id", "txn_id", "journal_no"],
    "credit_amount": ["credit_amount", "credit", "amount", "deposit", "net_credit"],
    "credit_date": ["credit_date", "value_date", "txn_date", "date", "posting_date"],
    "narration": ["narration", "description", "remarks", "particulars", "reference"],
    "settlement_id_ref": ["settlement_id_ref", "settlement_id", "ref_id", "settlement_ref"]
}

LEDGER_COLS = {
    "order_id":                   str,
    "merchant_id":                str,
    "invoice_amount":             float,
    "expected_settlement_amount": float,
    "recorded_date":              str,
    "status":                     str,
}

LEDGER_ALIASES = {
    "order_id": ["order_id", "order_no", "orderno", "order", "invoice_no", "bill_no"],
    "merchant_id": ["merchant_id", "merchant", "merchant_name", "store"],
    "invoice_amount": ["invoice_amount", "invoice_val", "gross_amount", "amount", "total"],
    "expected_settlement_amount": ["expected_settlement_amount", "expected_amount", "expected_net", "net_amount"],
    "recorded_date": ["recorded_date", "invoice_date", "order_date", "date", "created_date"],
    "status": ["status", "order_status", "payment_status", "state"]
}

# ── Schema bootstrap (called once at startup by main.py) ─────────────────────

_INGEST_SCHEMA = """
CREATE TABLE IF NOT EXISTS batches (
    batch_id     TEXT PRIMARY KEY,
    created_at   TEXT NOT NULL DEFAULT (datetime('now')),
    source       TEXT NOT NULL,           -- 'demo' | 'upload'
    settlement_rows INTEGER NOT NULL,
    bank_rows       INTEGER NOT NULL,
    ledger_rows     INTEGER NOT NULL,
    status       TEXT NOT NULL DEFAULT 'INGESTED'  -- INGESTED | RECONCILED | EVAL_DONE
);

CREATE TABLE IF NOT EXISTS raw_settlement (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id        TEXT NOT NULL REFERENCES batches(batch_id),
    settlement_id   TEXT NOT NULL,   -- encrypted
    payment_id      TEXT NOT NULL,   -- encrypted
    order_id        TEXT NOT NULL,   -- encrypted
    merchant_id     TEXT NOT NULL,   -- encrypted
    gross_amount    REAL NOT NULL,
    mdr_fee         REAL NOT NULL,
    gst_on_mdr      REAL NOT NULL,
    tds_amount      REAL NOT NULL,
    refund_amount   REAL NOT NULL,
    net_amount      REAL NOT NULL,
    settlement_date TEXT NOT NULL    -- encrypted (YYYY-MM-DD)
);

CREATE TABLE IF NOT EXISTS raw_bank (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id            TEXT NOT NULL REFERENCES batches(batch_id),
    utr                 TEXT NOT NULL,  -- encrypted
    credit_amount       REAL NOT NULL,
    credit_date         TEXT NOT NULL,  -- encrypted (YYYY-MM-DD)
    narration           TEXT NOT NULL,  -- encrypted
    settlement_id_ref   TEXT NOT NULL   -- encrypted (may be blank)
);

CREATE TABLE IF NOT EXISTS raw_ledger (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id                    TEXT NOT NULL REFERENCES batches(batch_id),
    order_id                    TEXT NOT NULL,  -- encrypted
    merchant_id                 TEXT NOT NULL,  -- encrypted
    invoice_amount              REAL NOT NULL,
    expected_settlement_amount  REAL NOT NULL,
    recorded_date               TEXT NOT NULL,  -- encrypted (YYYY-MM-DD)
    status                      TEXT NOT NULL   -- encrypted
);
"""


def bootstrap_ingest_schema() -> None:
    with get_conn() as conn:
        conn.executescript(_INGEST_SCHEMA)


# ── Flexible Parse & Normalization helpers ────────────────────────────────────

def _normalize_df(df: pd.DataFrame, col_aliases: dict[str, list[str]], required_cols: dict[str, type]) -> pd.DataFrame:
    # 1. Clean existing column headers (lowercase, strip, replace spaces/dashes)
    clean_cols = {}
    for orig in df.columns:
        normalized = str(orig).lower().strip().replace(" ", "_").replace("-", "_")
        clean_cols[orig] = normalized
    df = df.rename(columns=clean_cols)

    # 2. Map aliases to canonical names
    mapped = {}
    for target_col, aliases in col_aliases.items():
        if target_col in df.columns:
            continue
        for col in df.columns:
            if col in aliases or any(a == col for a in aliases):
                mapped[col] = target_col
                break
    if mapped:
        df = df.rename(columns=mapped)

    # 3. Ensure required columns exist with valid types
    for col, typ in required_cols.items():
        if col not in df.columns:
            if typ is str:
                df[col] = ""
            elif typ is float:
                df[col] = 0.0
        else:
            if typ is float:
                df[col] = pd.to_numeric(
                    df[col].astype(str).str.replace(r'[₹,$,\s]', '', regex=True),
                    errors='coerce'
                ).fillna(0.0)
            else:
                df[col] = df[col].fillna("").astype(str)

    return df[list(required_cols.keys())]


def _parse_settlement(raw: str | Path) -> pd.DataFrame:
    df = pd.read_csv(raw if isinstance(raw, Path) else StringIO(raw))
    df = _normalize_df(df, SETTLEMENT_ALIASES, SETTLEMENT_COLS)
    
    # Auto-calculate fees/net if user provided raw gross without fee breakdown
    for idx, row in df.iterrows():
        g = float(row["gross_amount"])
        if g > 0 and float(row["net_amount"]) == 0.0:
            mdr = round(g * 0.02, 2)
            gst = round(mdr * 0.18, 2)
            tds = round(g * 0.01, 2)
            df.at[idx, "mdr_fee"] = mdr
            df.at[idx, "gst_on_mdr"] = gst
            df.at[idx, "tds_amount"] = tds
            df.at[idx, "net_amount"] = round(g - mdr - gst - tds, 2)
        if not str(row["settlement_id"]).strip():
            df.at[idx, "settlement_id"] = f"SETTLE_{idx+1:04d}"
        if not str(row["payment_id"]).strip():
            df.at[idx, "payment_id"] = f"pay_{idx+1:04d}"
        if not str(row["merchant_id"]).strip():
            df.at[idx, "merchant_id"] = "MERCH_DEFAULT"
            
    return df


def _parse_bank(raw: str | Path) -> pd.DataFrame:
    df = pd.read_csv(raw if isinstance(raw, Path) else StringIO(raw))
    df = _normalize_df(df, BANK_ALIASES, BANK_COLS)
    for idx, row in df.iterrows():
        if not str(row["utr"]).strip():
            df.at[idx, "utr"] = f"UTR{idx+1:08d}"
    return df


def _parse_ledger(raw: str | Path) -> pd.DataFrame:
    df = pd.read_csv(raw if isinstance(raw, Path) else StringIO(raw))
    df = _normalize_df(df, LEDGER_ALIASES, LEDGER_COLS)
    for idx, row in df.iterrows():
        inv = float(row["invoice_amount"])
        if inv > 0 and float(row["expected_settlement_amount"]) == 0.0:
            df.at[idx, "expected_settlement_amount"] = round(inv * 0.9664, 2)
        if not str(row["merchant_id"]).strip():
            df.at[idx, "merchant_id"] = "MERCH_DEFAULT"
        if not str(row["status"]).strip():
            df.at[idx, "status"] = "RECORDED"
    return df


# ── Store to DB ───────────────────────────────────────────────────────────────

def _store_batch(
    source: str,
    df_s: pd.DataFrame,
    df_b: pd.DataFrame,
    df_l: pd.DataFrame,
) -> str:
    batch_id = str(uuid.uuid4())

    with get_conn() as conn:
        # 1. batches header row
        conn.execute(
            """INSERT INTO batches
               (batch_id, source, settlement_rows, bank_rows, ledger_rows)
               VALUES (?, ?, ?, ?, ?)""",
            (batch_id, source, len(df_s), len(df_b), len(df_l)),
        )

        # 2. raw_settlement — encrypt string columns
        conn.executemany(
            """INSERT INTO raw_settlement
               (batch_id, settlement_id, payment_id, order_id, merchant_id,
                gross_amount, mdr_fee, gst_on_mdr, tds_amount, refund_amount,
                net_amount, settlement_date)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
            [
                (
                    batch_id,
                    cipher.encrypt(r.settlement_id),
                    cipher.encrypt(r.payment_id),
                    cipher.encrypt(r.order_id),
                    cipher.encrypt(r.merchant_id),
                    float(r.gross_amount),
                    float(r.mdr_fee),
                    float(r.gst_on_mdr),
                    float(r.tds_amount),
                    float(r.refund_amount),
                    float(r.net_amount),
                    cipher.encrypt(r.settlement_date),
                )
                for r in df_s.itertuples(index=False)
            ],
        )

        # 3. raw_bank — encrypt string columns
        conn.executemany(
            """INSERT INTO raw_bank
               (batch_id, utr, credit_amount, credit_date, narration, settlement_id_ref)
               VALUES (?,?,?,?,?,?)""",
            [
                (
                    batch_id,
                    cipher.encrypt(r.utr),
                    float(r.credit_amount),
                    cipher.encrypt(r.credit_date),
                    cipher.encrypt(r.narration),
                    cipher.encrypt(r.settlement_id_ref),
                )
                for r in df_b.itertuples(index=False)
            ],
        )

        # 4. raw_ledger — encrypt string columns
        conn.executemany(
            """INSERT INTO raw_ledger
               (batch_id, order_id, merchant_id, invoice_amount,
                expected_settlement_amount, recorded_date, status)
               VALUES (?,?,?,?,?,?,?)""",
            [
                (
                    batch_id,
                    cipher.encrypt(r.order_id),
                    cipher.encrypt(r.merchant_id),
                    float(r.invoice_amount),
                    float(r.expected_settlement_amount),
                    cipher.encrypt(r.recorded_date),
                    cipher.encrypt(r.status),
                )
                for r in df_l.itertuples(index=False)
            ],
        )

        # 5. Audit log
        conn.execute(
            """INSERT INTO audit_log (event_type, batch_id, detail)
               VALUES (?, ?, ?)""",
            (
                "INGEST",
                batch_id,
                json.dumps({
                    "source": source,
                    "settlement_rows": len(df_s),
                    "bank_rows": len(df_b),
                    "ledger_rows": len(df_l),
                }),
            ),
        )

    return batch_id


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/demo-batch")
async def demo_batch() -> JSONResponse:
    """
    Load the three pre-generated sample CSVs from SAMPLES_DIR.
    ground_truth.csv is intentionally excluded — it is eval-only.
    """
    sd = settings.samples_full_path
    required = {
        "settlement": sd / "settlement_report.csv",
        "bank":       sd / "bank_statement.csv",
        "ledger":     sd / "ledger.csv",
    }
    for label, path in required.items():
        if not path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Sample file not found: {path} ({label})",
            )

    try:
        df_s = _parse_settlement(required["settlement"])
        df_b = _parse_bank(required["bank"])
        df_l = _parse_ledger(required["ledger"])
    except (ValueError, KeyError) as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    batch_id = _store_batch("demo", df_s, df_b, df_l)

    return JSONResponse({
        "batch_id":        batch_id,
        "source":          "demo",
        "settlement_rows": len(df_s),
        "bank_rows":       len(df_b),
        "ledger_rows":     len(df_l),
        "next_step":       f"POST /api/reconcile  body: {{\"batch_id\": \"{batch_id}\"}}",
    })


@router.post("/upload")
async def upload_files(
    settlement: UploadFile = File(..., description="settlement_report.csv"),
    bank:       UploadFile = File(..., description="bank_statement.csv"),
    ledger:     UploadFile = File(..., description="ledger.csv"),
) -> JSONResponse:
    """
    Accept three uploaded CSV files (multipart/form-data).
    Field names must be: settlement, bank, ledger.
    """
    async def _read(f: UploadFile) -> str:
        content = await f.read()
        return content.decode("utf-8-sig")  # handle BOM from Excel exports

    try:
        df_s = _parse_settlement(await _read(settlement))
        df_b = _parse_bank(await _read(bank))
        df_l = _parse_ledger(await _read(ledger))
    except (ValueError, KeyError, Exception) as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    batch_id = _store_batch("upload", df_s, df_b, df_l)

    return JSONResponse({
        "batch_id":        batch_id,
        "source":          "upload",
        "settlement_rows": len(df_s),
        "bank_rows":       len(df_b),
        "ledger_rows":     len(df_l),
        "next_step":       f"POST /api/reconcile  body: {{\"batch_id\": \"{batch_id}\"}}",
    })


# ── Read-back helper (used by later phases & tests) ───────────────────────────

def load_batch_dataframes(batch_id: str) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Decrypt and return (df_settlement, df_bank, df_ledger) for a given batch.
    Called by Phase 2 reconciliation engine.
    """
    with get_conn() as conn:
        # Verify batch exists
        row = conn.execute(
            "SELECT batch_id FROM batches WHERE batch_id = ?", (batch_id,)
        ).fetchone()
        if not row:
            raise ValueError(f"batch_id not found: {batch_id}")

        # --- settlement ---
        rows_s = conn.execute(
            "SELECT * FROM raw_settlement WHERE batch_id = ?", (batch_id,)
        ).fetchall()
        df_s = pd.DataFrame([dict(r) for r in rows_s])
        for col in ["settlement_id", "payment_id", "order_id", "merchant_id", "settlement_date"]:
            df_s[col] = df_s[col].apply(cipher.decrypt)

        # --- bank ---
        rows_b = conn.execute(
            "SELECT * FROM raw_bank WHERE batch_id = ?", (batch_id,)
        ).fetchall()
        df_b = pd.DataFrame([dict(r) for r in rows_b])
        for col in ["utr", "credit_date", "narration", "settlement_id_ref"]:
            df_b[col] = df_b[col].apply(cipher.decrypt)

        # --- ledger ---
        rows_l = conn.execute(
            "SELECT * FROM raw_ledger WHERE batch_id = ?", (batch_id,)
        ).fetchall()
        df_l = pd.DataFrame([dict(r) for r in rows_l])
        for col in ["order_id", "merchant_id", "recorded_date", "status"]:
            df_l[col] = df_l[col].apply(cipher.decrypt)

    return df_s, df_b, df_l
