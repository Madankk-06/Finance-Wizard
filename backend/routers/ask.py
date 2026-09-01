"""
routers/ask.py — Phase 8: Natural Language (NL) Copilot API

Endpoints:
  POST /api/ask            → execute an NL query against a batch
  GET  /api/ask/suggestions → get recommended questions for the UI
"""

from __future__ import annotations

import json
from typing import Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from database import get_conn
from engine.nl_agent import answer_natural_language_query, ASK_SUGGESTIONS

router = APIRouter(prefix="/api/ask", tags=["ask"])


class AskRequest(BaseModel):
    query:    str = Field(..., min_length=1, description="Natural language question")
    batch_id: Optional[str] = Field(None, description="Target reconciliation batch ID (optional)")


@router.post("")
async def ask_financial_copilot(req: AskRequest) -> JSONResponse:
    """
    Query the reconciliation dataset using natural language.
    """
    res = answer_natural_language_query(req.query, req.batch_id)

    # Log to audit trail
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO audit_log (event_type, batch_id, detail) VALUES (?, ?, ?)",
            (
                "ASK_QUERY",
                req.batch_id or "LATEST",
                json.dumps({"query": req.query[:120], "intent": res.get("intent")}),
            ),
        )

    return JSONResponse(res)


@router.get("/suggestions")
async def get_query_suggestions() -> JSONResponse:
    """
    Return curated starter suggestions for the NL Ask UI panel.
    """
    return JSONResponse({
        "suggestions": ASK_SUGGESTIONS,
    })
