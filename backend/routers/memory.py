"""
routers/memory.py — Phase 6: Financial Memory Router

Endpoints:
  GET    /api/memory                      → list all active institutional rules
  POST   /api/memory                      → create / update a rule
  DELETE /api/memory/{rule_id}            → delete a rule
  POST   /api/memory/sync-batch/{batch_id} → sync rule application stats with a batch
"""

from __future__ import annotations

import json
from typing import Any
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from database import get_conn
from engine.memory import (
    get_all_memory_rules,
    add_or_update_memory_rule,
    sync_batch_memory_counts,
)

router = APIRouter(prefix="/api/memory", tags=["memory"])


class MemoryRulePayload(BaseModel):
    pattern_key: str = Field(..., description="Unique slug for the pattern")
    category:    str = Field(..., description="Target category (e.g. FEE_DEDUCTION)")
    description: str = Field(..., description="Human-readable rule explanation")
    confidence:  float = Field(1.0, ge=0.0, le=1.0)


@router.get("")
async def list_memory_rules() -> JSONResponse:
    """
    List all active financial memory rules with application counts.
    """
    rules = get_all_memory_rules()
    total_applications = sum(r["applied_count"] for r in rules)

    return JSONResponse({
        "total_rules": len(rules),
        "total_applications": total_applications,
        "rules": rules,
    })


@router.post("")
async def create_or_update_rule(payload: MemoryRulePayload) -> JSONResponse:
    """
    Save a new or updated financial memory rule.
    """
    rule = add_or_update_memory_rule(
        pattern_key=payload.pattern_key.strip().upper(),
        category=payload.category.strip().upper(),
        description=payload.description.strip(),
        confidence=payload.confidence,
    )

    with get_conn() as conn:
        conn.execute(
            "INSERT INTO audit_log (event_type, detail) VALUES (?, ?)",
            (
                "MEMORY_RULE_UPDATE",
                json.dumps({
                    "pattern_key": payload.pattern_key,
                    "category": payload.category,
                }),
            ),
        )

    return JSONResponse({
        "status": "success",
        "rule": rule,
    })


@router.delete("/{rule_id}")
async def delete_memory_rule(rule_id: int) -> JSONResponse:
    """
    Remove a financial memory rule by ID.
    """
    with get_conn() as conn:
        res = conn.execute("DELETE FROM financial_memory WHERE id = ?", (rule_id,))
        if res.rowcount == 0:
            raise HTTPException(404, f"Rule id {rule_id} not found")

        conn.execute(
            "INSERT INTO audit_log (event_type, detail) VALUES (?, ?)",
            ("MEMORY_RULE_DELETE", json.dumps({"rule_id": rule_id})),
        )

    return JSONResponse({"status": "deleted", "rule_id": rule_id})


@router.post("/sync-batch/{batch_id}")
async def sync_batch_rules(batch_id: str) -> JSONResponse:
    """
    Sync memory rule application statistics with a specific reconciled batch.
    """
    sync_batch_memory_counts(batch_id)
    rules = get_all_memory_rules()
    return JSONResponse({
        "status": "synced",
        "batch_id": batch_id,
        "rules": rules,
    })
