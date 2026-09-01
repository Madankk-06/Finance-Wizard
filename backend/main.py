"""
main.py — Finance Wizard backend entry point.

Phase 0 responsibilities:
  • Start FastAPI with CORS configured for the React dev server.
  • Bootstrap the encrypted SQLite schema on startup.
  • Expose GET /api/health → confirms server is alive and DB is reachable.
  • Write a startup audit log entry.

Run with:
    cd backend
    uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import platform
import sys
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from database import (
    bootstrap_schema,
    check_db_connection,
    ENCRYPTION_MODE,
    get_conn,
    cipher,
)
from routers.ingest import bootstrap_ingest_schema, router as ingest_router
from routers.reconcile import bootstrap_reconcile_schema, router as reconcile_router
from routers.classify import bootstrap_classify_schema, router as classify_router
from routers.investigate import router as investigate_router
from routers.memory import router as memory_router
from routers.cash import router as cash_router
from routers.ask import router as ask_router
from routers.eval import router as eval_router
from engine.memory import seed_default_memory_rules

# ── App factory ───────────────────────────────────────────────────────────────

app = FastAPI(
    title="Finance Wizard API",
    description="Multi-source payment reconciliation engine — Razorpay Buildathon Track 04",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS — allow the Vite React dev server ────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup: bootstrap DB schema + audit entry ────────────────────────────────

@app.on_event("startup")
async def on_startup() -> None:
    # 1. Create base tables (idempotent)
    bootstrap_schema()

    # 2. Create Phase 1 ingest tables (idempotent)
    bootstrap_ingest_schema()

    # 3. Create Phase 2 reconcile tables (idempotent)
    bootstrap_reconcile_schema()

    # 4. Create Phase 3 classify tables (idempotent)
    bootstrap_classify_schema()

    # 5. Seed default financial memory rules if empty
    seed_default_memory_rules()

    # 6. Write a startup event to the audit log
    with get_conn() as conn:
        conn.execute(
            """
            INSERT INTO audit_log (event_type, detail)
            VALUES (?, ?)
            """,
            (
                "SERVER_START",
                f'{{"encryption_mode":"{ENCRYPTION_MODE}",'
                f'"python":"{sys.version.split()[0]}",'
                f'"platform":"{platform.platform()}"}}',
            ),
        )

    print(f"✅ Finance Wizard backend started  (encryption={ENCRYPTION_MODE})")
    print(f"   DB path : {settings.db_full_path}")
    print(f"   Samples : {settings.samples_full_path}")
    print(f"   Docs    : http://{settings.app_host}:{settings.app_port}/docs")


# ── Register routers ──────────────────────────────────────────────────────────

app.include_router(ingest_router)
app.include_router(reconcile_router)
app.include_router(classify_router)
app.include_router(investigate_router)
app.include_router(memory_router)
app.include_router(cash_router)
app.include_router(ask_router)
app.include_router(eval_router)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/api/health", tags=["system"])
async def health_check() -> JSONResponse:
    """
    Returns server liveness + DB connectivity.

    Response fields:
      status          "ok" | "degraded"
      db              "connected" | "error"
      db_path         absolute path to the SQLite file
      db_encrypted    true = full-file SQLCipher | field-level AES-256-GCM
      encryption_mode "sqlcipher" | "aes256gcm-fields"
      samples_ready   true if the three sample CSVs are accessible
      timestamp       ISO-8601 UTC
    """
    db_ok = check_db_connection()

    # Check that sample CSVs are in place
    samples_dir = settings.samples_full_path
    required_samples = [
        "settlement_report.csv",
        "bank_statement.csv",
        "ledger.csv",
    ]
    samples_ready = all((samples_dir / f).exists() for f in required_samples)

    return JSONResponse(
        status_code=200 if db_ok else 503,
        content={
            "status": "ok" if db_ok else "degraded",
            "db": "connected" if db_ok else "error",
            "db_path": str(settings.db_full_path),
            "db_encrypted": True,
            "encryption_mode": ENCRYPTION_MODE,
            "samples_ready": samples_ready,
            "samples_dir": str(samples_dir),
            "missing_samples": [
                f for f in required_samples if not (samples_dir / f).exists()
            ],
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


@app.get("/", include_in_schema=False)
async def root() -> JSONResponse:
    return JSONResponse({"message": "Finance Wizard API — see /docs"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
