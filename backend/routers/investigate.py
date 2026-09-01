"""
routers/investigate.py — Phase 4: Investigative Agent Router

Endpoints:
  GET /api/batch/{batch_id}/investigate/{order_id}  → full diagnostic report for an order
  GET /api/batch/{batch_id}/investigate             → batch-level escalation diagnostic summary
"""

from __future__ import annotations

import json
from dataclasses import asdict
from typing import Any

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse

from database import cipher, get_conn
from engine.investigator import run_automated_investigation
from routers.classify import _row_to_dict

router = APIRouter(prefix="/api", tags=["investigate"])


def _get_linked_debits(batch_id: str) -> list[dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM unmatched_bank WHERE batch_id=? AND match_type='DEBIT_ADJUSTMENT'",
            (batch_id,),
        ).fetchall()
    
    debits = []
    for r in rows:
        debits.append({
            "utr": cipher.decrypt(r["utr"]),
            "credit_amount": r["credit_amount"],
            "credit_date": cipher.decrypt(r["credit_date"]),
            "narration": cipher.decrypt(r["narration"]),
        })
    return debits


@router.get("/batch/{batch_id}/investigate/{order_id}")
async def investigate_single_order(batch_id: str, order_id: str) -> JSONResponse:
    """
    Run deep forensic investigation on a single order.
    """
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM classified_results WHERE batch_id=?", (batch_id,)
        ).fetchall()

    target_record = None
    for r in rows:
        if cipher.decrypt(r["order_id"]) == order_id:
            target_record = _row_to_dict(r)
            break

    if not target_record:
        raise HTTPException(404, f"Order {order_id} not found in batch {batch_id}")

    debits = _get_linked_debits(batch_id)
    report = run_automated_investigation(target_record, linked_debits=debits)

    return JSONResponse(asdict(report))


@router.get("/batch/{batch_id}/investigate")
async def investigate_batch_summary(batch_id: str) -> JSONResponse:
    """
    Produce structured investigation reports for all ESCALATE orders in a batch.
    Powers the Escalation Queue UI with AI-driven root cause and action cards.
    """
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM classified_results WHERE batch_id=? AND decision='ESCALATE' ORDER BY ABS(difference) DESC",
            (batch_id,),
        ).fetchall()

    if not rows:
        return JSONResponse({
            "batch_id": batch_id,
            "escalated_count": 0,
            "reports": [],
            "summary": "No escalated transactions found in this batch.",
        })

    debits = _get_linked_debits(batch_id)
    reports = []
    total_exposure = 0.0

    for r in rows:
        rec = _row_to_dict(r)
        report = run_automated_investigation(rec, linked_debits=debits)
        reports.append(asdict(report))
        if rec["difference"] > 0:
            total_exposure += rec["difference"]

    return JSONResponse({
        "batch_id": batch_id,
        "escalated_count": len(reports),
        "total_exposure": round(total_exposure, 2),
        "reports": reports,
    })
