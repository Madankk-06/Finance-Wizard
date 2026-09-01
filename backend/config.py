"""
config.py — loads .env and exposes a typed Settings object.

All other modules import `settings` from here — no direct os.environ access anywhere else.
"""

from __future__ import annotations

import os
import secrets
import base64
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).parent / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Database ──────────────────────────────────────────────────────────────
    # 32-byte key encoded as base64-url-safe.  On first run we auto-generate
    # one and warn the user to persist it in .env so re-opens work.
    db_encryption_key: str = Field(default="", alias="DB_ENCRYPTION_KEY")
    db_path: str = Field(default="recon.db", alias="DB_PATH")

    # ── Samples ───────────────────────────────────────────────────────────────
    samples_dir: str = Field(default="../public/samples", alias="SAMPLES_DIR")

    # ── Server ────────────────────────────────────────────────────────────────
    app_host: str = Field(default="0.0.0.0", alias="APP_HOST")
    app_port: int = Field(default=8000, alias="APP_PORT")

    # ── CORS ──────────────────────────────────────────────────────────────────
    cors_origins: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000",
        alias="CORS_ORIGINS",
    )

    # ── Optional LLM / Groq ──────────────────────────────────────────────────
    groq_api_key: str = Field(default="", alias="GROQ_API_KEY")
    groq_model: str = Field(default="llama-3.3-70b-versatile", alias="GROQ_MODEL")
    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")
    llm_model: str = Field(default="gpt-4o-mini", alias="LLM_MODEL")

    # ── Derived helpers ───────────────────────────────────────────────────────
    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def db_key_bytes(self) -> bytes:
        """Return the raw 32-byte AES key, auto-generating if blank."""
        if not self.db_encryption_key or self.db_encryption_key.startswith("REPLACE"):
            key = secrets.token_bytes(32)
            encoded = base64.urlsafe_b64encode(key).decode()
            print(
                "\n⚠️  DB_ENCRYPTION_KEY not set.  Auto-generated for this session:\n"
                f"   DB_ENCRYPTION_KEY={encoded}\n"
                "   Add this to backend/.env to keep the same key across restarts.\n"
            )
            return key
        return base64.urlsafe_b64decode(self.db_encryption_key.encode())

    @property
    def db_full_path(self) -> Path:
        return Path(__file__).parent / self.db_path

    @property
    def samples_full_path(self) -> Path:
        return (Path(__file__).parent / self.samples_dir).resolve()


# Singleton — import this everywhere
settings = Settings()
