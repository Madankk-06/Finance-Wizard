"""
routers/reconcile.py — Phase 2: Reconcile endpoint

POST /api/reconcile
  Body: {"batch_id": "<uuid>"}
  1. Load decrypted DataFrames from DB (via ingest.load_batch_dataframes)
  2. Run the four-pass deterministic matcher (engine.matcher.run_matching)
  3. Persist MatchResults → match_pairs table (encrypted IDs)
  4. Write RECONCILE audit entry
  5. Return match summary

GET /api/batch/{batch_id}/summary  → KPIs (filled here, extended in Phase 3)
"""

from __future__ import annotations

import json
import time
from typing import Any

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from database import cipher, get_conn
from engine.classifier import classify
from engine.matcher import run_matching, MatchSummary
from routers.ingest import load_batch_dataframes

router = APIRouter(prefix="/api", tags=["reconcile"])

# ── Schema ────────────────────────────────────────────────────────────────────

_MATCH_SCHEMA = """
CREATE TABLE IF NOT EXISTS match_pairs (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id              TEXT NOT NULL,
    order_id              TEXT NOT NULL,   -- encrypted
    settlement_id         TEXT NOT NULL,   -- encrypted
    payment_id            TEXT NOT NULL,   -- encrypted
    merchant_id           TEXT NOT NULL,   -- encrypted
    utr                   TEXT,            -- encrypted (NULL if UNMATCHED)
    match_type            TEXT NOT NULL,   -- DIRECT | LUMPED | SPLIT | FUZZY | UNMATCHED_SETTLEMENT
    gross_amount          REAL NOT NULL,
    mdr_fee               REAL NOT NULL,
    gst_on_mdr            REAL NOT NULL,
    tds_amount            REAL NOT NULL,
    refund_amount         REAL NOT NULL,
    settlement_net        REAL NOT NULL,
    bank_credit           REAL NOT NULL,
    ledger_expected       REAL NOT NULL,
    settlement_date       TEXT NOT NULL,   -- encrypted
    bank_credit_date      TEXT NOT NULL,   -- encrypted
    ledger_recorded_date  TEXT NOT NULL,   -- encrypted
    narration             TEXT NOT NULL    -- encrypted
);

CREATE TABLE IF NOT EXISTS unmatched_bank (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id      TEXT NOT NULL,
    utr           TEXT NOT NULL,     -- encrypted
    credit_amount REAL NOT NULL,
    credit_date   TEXT NOT NULL,     -- encrypted
    narration     TEXT NOT NULL,     -- encrypted
    match_type    TEXT NOT NULL      -- DEBIT_ADJUSTMENT | BANK_ONLY
);
"""


def bootstrap_reconcile_schema() -> None:
    with get_conn() as conn:
        conn.executescript(_MATCH_SCHEMA)


# ── Request model ─────────────────────────────────────────────────────────────

class ReconcileRequest(BaseModel):
    batch_id: str


# ── Persist helpers ───────────────────────────────────────────────────────────

def _persist_match_pairs(summary: MatchSummary) -> None:
    with get_conn() as conn:
        # Clear any existing pairs for this batch (idempotent re-run)
        conn.execute("DELETE FROM match_pairs WHERE batch_id = ?", (summary.batch_id,))
        conn.execute("DELETE FROM unmatched_bank WHERE batch_id = ?", (summary.batch_id,))

        conn.executemany(
            """INSERT INTO match_pairs
               (batch_id, order_id, settlement_id, payment_id, merchant_id, utr,
                match_type, gross_amount, mdr_fee, gst_on_mdr, tds_amount,
                refund_amount, settlement_net, bank_credit, ledger_expected,
                settlement_date, bank_credit_date, ledger_recorded_date, narration)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            [
                (
                    r.batch_id if hasattr(r, "batch_id") else summary.batch_id,
                    cipher.encrypt(r.order_id),
                    cipher.encrypt(r.settlement_id),
                    cipher.encrypt(r.payment_id),
                    cipher.encrypt(r.merchant_id),
                    cipher.encrypt(r.utr) if r.utr else None,
                    r.match_type,
                    r.gross_amount,
                    r.mdr_fee,
                    r.gst_on_mdr,
                    r.tds_amount,
                    r.refund_amount,
                    r.settlement_net,
                    r.bank_credit,
                    r.ledger_expected,
                    cipher.encrypt(r.settlement_date),
                    cipher.encrypt(r.bank_credit_date),
                    cipher.encrypt(r.ledger_recorded_date),
                    cipher.encrypt(r.narration),
                )
                for r in summary.results
            ],
        )

        conn.executemany(
            """INSERT INTO unmatched_bank
               (batch_id, utr, credit_amount, credit_date, narration, match_type)
               VALUES (?,?,?,?,?,?)""",
            [
                (
                    summary.batch_id,
                    cipher.encrypt(b.utr),
                    b.credit_amount,
                    cipher.encrypt(b.credit_date),
                    cipher.encrypt(b.narration),
                    b.match_type,
                )
                for b in summary.unmatched_bank
            ],
        )

        # Update batch status
        conn.execute(
            "UPDATE batches SET status = 'RECONCILED' WHERE batch_id = ?",
            (summary.batch_id,),
        )


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/reconcile")
async def reconcile(req: ReconcileRequest) -> JSONResponse:
    """
    Run the deterministic matching engine on an ingested batch.
    Idempotent — safe to call multiple times on the same batch_id.
    """
    # Check batch exists
    with get_conn() as conn:
        row = conn.execute(
            "SELECT batch_id, status FROM batches WHERE batch_id = ?",
            (req.batch_id,),
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail=f"batch_id not found: {req.batch_id}")

    t0 = time.perf_counter()

    # Load & decrypt
    df_s, df_b, df_l = load_batch_dataframes(req.batch_id)

    # Pass 1-4: deterministic matching
    summary = run_matching(req.batch_id, df_s, df_b, df_l)

    # Persist match_pairs
    _persist_match_pairs(summary)

    # Pass 5: classify each matched pair
    from routers.classify import persist_classified, _row_to_dict
    from engine.investigator import run_automated_investigation
    classified = classify(summary.results)
    persist_classified(req.batch_id, classified)

    # Pass 6: Phase 4 Automated Investigative Agent (runs automatically before human review)
    with get_conn() as conn:
        all_rows = conn.execute("SELECT * FROM classified_results WHERE batch_id=?", (req.batch_id,)).fetchall()
        debit_rows = conn.execute("SELECT * FROM unmatched_bank WHERE batch_id=? AND match_type='DEBIT_ADJUSTMENT'", (req.batch_id,)).fetchall()

    debits_list = [{
        "utr": cipher.decrypt(d["utr"]),
        "credit_amount": d["credit_amount"],
        "credit_date": cipher.decrypt(d["credit_date"]),
        "narration": cipher.decrypt(d["narration"]),
    } for d in debit_rows]

    investigated_count = 0
    with get_conn() as conn:
        for r in all_rows:
            rec = _row_to_dict(r)
            if rec["decision"] == "ESCALATE":
                report = run_automated_investigation(rec, linked_debits=debits_list)
                conn.execute(
                    "UPDATE classified_results SET agent_reasoning_log=? WHERE id=?",
                    (json.dumps(report.agent_reasoning_log), r["id"]),
                )
                investigated_count += 1

    elapsed = round(time.perf_counter() - t0, 3)

    # Decision summary
    from collections import Counter
    decisions  = dict(Counter(c.decision  for c in classified))
    categories = dict(Counter(c.category  for c in classified))

    # Write audit entry
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO audit_log (event_type, batch_id, detail) VALUES (?,?,?)",
            (
                "CLASSIFY_AND_AUTO_INVESTIGATE",
                req.batch_id,
                json.dumps({
                    "elapsed_s":          elapsed,
                    "decisions":          decisions,
                    "categories":         categories,
                    "auto_investigated":  investigated_count,
                }),
            ),
        )

    return JSONResponse({
        "batch_id":       req.batch_id,
        "status":         "CLASSIFIED",
        "elapsed_s":      elapsed,
        "total_orders":   summary.total_orders,
        "matched":        summary.matched,
        "unmatched":      summary.unmatched,
        "by_match_type":  summary.by_match_type,
        "decisions":      decisions,
        "by_category":    categories,
        "lumped_batches": summary.lumped_batches,
        "unmatched_bank": [
            {"utr": b.utr, "credit_amount": b.credit_amount, "match_type": b.match_type}
            for b in summary.unmatched_bank
        ],
        "next_step": f"GET /api/batch/{req.batch_id}/summary",
    })


@router.get("/batch/{batch_id}/summary")
async def batch_summary(batch_id: str) -> JSONResponse:
    """Return match-level KPIs for a reconciled batch (Phase 3 will extend with classification KPIs)."""
    with get_conn() as conn:
        batch = conn.execute(
            "SELECT * FROM batches WHERE batch_id = ?", (batch_id,)
        ).fetchone()
        if not batch:
            raise HTTPException(status_code=404, detail="batch not found")

        if batch["status"] == "INGESTED":
            raise HTTPException(
                status_code=409,
                detail="Batch has not been reconciled yet. POST /api/reconcile first.",
            )

        # Aggregate from match_pairs
        totals = conn.execute(
            """SELECT match_type, COUNT(*) as cnt,
                      SUM(gross_amount) as gross,
                      SUM(settlement_net) as net,
                      SUM(bank_credit) as bank,
                      SUM(ledger_expected) as ledger_exp
               FROM match_pairs WHERE batch_id = ?
               GROUP BY match_type""",
            (batch_id,),
        ).fetchall()

        overall = conn.execute(
            """SELECT COUNT(*) as n,
                      SUM(gross_amount) as gross,
                      SUM(settlement_net) as net,
                      SUM(ledger_expected) as ledger_exp
               FROM match_pairs WHERE batch_id = ?""",
            (batch_id,),
        ).fetchone()

        unmatched_bank_rows = conn.execute(
            "SELECT match_type, COUNT(*) as cnt, SUM(credit_amount) as total FROM unmatched_bank WHERE batch_id = ? GROUP BY match_type",
            (batch_id,),
        ).fetchall()

    by_type = {
        r["match_type"]: {
            "count": r["cnt"],
            "gross": round(r["gross"], 2),
            "settlement_net": round(r["net"], 2),
        }
        for r in totals
    }

    matched_count = sum(
        r["cnt"] for r in totals if r["match_type"] != "UNMATCHED_SETTLEMENT"
    )
    total = overall["n"]
    match_rate = round(matched_count / total * 100, 1) if total else 0.0

    return JSONResponse({
        "batch_id":    batch_id,
        "status":      batch["status"],
        "created_at":  batch["created_at"],
        "source":      batch["source"],
        "total_orders": total,
        "matched":     matched_count,
        "unmatched":   total - matched_count,
        "match_rate_pct": match_rate,
        "by_match_type": by_type,
        "gross_total":    round(overall["gross"] or 0, 2),
        "settlement_net": round(overall["net"] or 0, 2),
        "ledger_expected": round(overall["ledger_exp"] or 0, 2),
        "unmatched_bank": [
            {"match_type": r["match_type"], "count": r["cnt"],
             "total_amount": round(r["total"], 2)}
            for r in unmatched_bank_rows
        ],
    })
