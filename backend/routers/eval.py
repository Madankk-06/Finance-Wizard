"""
routers/eval.py — Phase 10: Evaluation & Audit Suite Router

Endpoints:
  GET /api/eval/{batch_id}  → full evaluation metrics vs ground_truth.csv
  GET /api/eval             → evaluation for the latest batch
  GET /api/audit/{batch_id} → audit trail events for a batch
"""

from __future__ import annotations

import json
from dataclasses import asdict
from typing import Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from database import get_conn
from engine.evaluator import evaluate_batch

router = APIRouter(prefix="/api", tags=["evaluation"])


@router.get("/eval/{batch_id}")
async def get_batch_evaluation(batch_id: str) -> JSONResponse:
    """
    Run evaluation against ground_truth.csv for a specific reconciled batch.
    """
    try:
        report = evaluate_batch(batch_id)
        return JSONResponse(asdict(report))
    except Exception as e:
        raise HTTPException(400, str(e))


@router.get("/eval")
async def get_latest_evaluation() -> JSONResponse:
    """
    Run evaluation against ground_truth.csv for the most recent batch.
    """
    with get_conn() as conn:
        row = conn.execute("SELECT batch_id FROM batches ORDER BY created_at DESC LIMIT 1").fetchone()
        if not row:
            raise HTTPException(404, "No batches found to evaluate")
        batch_id = row[0]

    return await get_batch_evaluation(batch_id)


@router.get("/audit/{batch_id}")
async def get_audit_trail(batch_id: str) -> JSONResponse:
    """
    Retrieve all audit events recorded for a given reconciliation batch.
    """
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT id, event_time, event_type, batch_id, detail FROM audit_log WHERE batch_id = ? ORDER BY id ASC",
            (batch_id,),
        ).fetchall()

    events = []
    for r in rows:
        detail_raw = r["detail"]
        try:
            detail = json.loads(detail_raw) if detail_raw else {}
        except Exception:
            detail = {"raw": detail_raw}

        events.append({
            "id": r["id"],
            "event_time": r["event_time"],
            "event_type": r["event_type"],
            "batch_id": r["batch_id"],
            "detail": detail,
        })

    return JSONResponse({
        "batch_id": batch_id,
        "total_events": len(events),
        "events": events,
    })
