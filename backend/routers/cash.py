"""
routers/cash.py — Phase 7: Cash Position & Counterfactual Simulator API

Endpoints:
  GET  /api/batch/{batch_id}/cash/waterfall → detailed baseline cash waterfall
  POST /api/batch/{batch_id}/cash/simulate  → counterfactual simulation ("What-If")
  GET  /api/batch/{batch_id}/cash/forecast  → daily cash velocity and cumulative inflow curve
"""

from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from database import cipher, get_conn
from engine.cash_simulator import (
    SimulationScenario,
    compute_baseline_waterfall,
    run_counterfactual_simulation,
    compute_cash_forecast_timeline,
)
from routers.classify import _row_to_dict

router = APIRouter(prefix="/api/batch/{batch_id}/cash", tags=["cash"])


class SimulationRequest(BaseModel):
    mdr_rate_override: Optional[float] = Field(None, description="Override MDR fee rate (e.g. 0.0175 for 1.75%)")
    gst_rate_override: Optional[float] = Field(None, description="Override GST rate (e.g. 0.18)")
    tds_rate_override: Optional[float] = Field(None, description="Override TDS rate (e.g. 0.02)")
    recover_escalated: bool = Field(False, description="Simulate 100% recovery of escalated shortfalls")
    resolve_timing_delays: bool = Field(False, description="Simulate instant settlement of held transactions")


def _get_batch_records(batch_id: str) -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM classified_results WHERE batch_id=?", (batch_id,)
        ).fetchall()
    if not rows:
        raise HTTPException(404, f"No classified transactions found for batch {batch_id}")
    return [_row_to_dict(r) for r in rows]


@router.get("/waterfall")
async def get_waterfall(batch_id: str) -> JSONResponse:
    """
    Get the detailed cash waterfall breakdown for a reconciled batch.
    """
    records = _get_batch_records(batch_id)
    waterfall = compute_baseline_waterfall(records)
    return JSONResponse({
        "batch_id": batch_id,
        "waterfall": waterfall,
    })


@router.post("/simulate")
async def simulate_scenario(batch_id: str, req: SimulationRequest) -> JSONResponse:
    """
    Run a counterfactual "What-If" scenario simulation against this batch.
    """
    records = _get_batch_records(batch_id)
    scenario = SimulationScenario(
        mdr_rate_override=req.mdr_rate_override,
        gst_rate_override=req.gst_rate_override,
        tds_rate_override=req.tds_rate_override,
        recover_escalated=req.recover_escalated,
        resolve_timing_delays=req.resolve_timing_delays,
    )
    result = run_counterfactual_simulation(records, scenario)
    return JSONResponse(result)


@router.get("/forecast")
async def get_forecast(batch_id: str) -> JSONResponse:
    """
    Get the daily cash trajectory timeline and cumulative inflow projection.
    """
    records = _get_batch_records(batch_id)
    timeline = compute_cash_forecast_timeline(records)
    return JSONResponse({
        "batch_id": batch_id,
        "timeline": timeline,
    })
