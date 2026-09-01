"""
routers/classify.py — Phase 3: Classification API

Integrates classifier into the reconcile pipeline and exposes:

  GET  /api/batch/{id}/transactions          paginated classified results
  GET  /api/batch/{id}/transactions/{oid}    single order drill-down
  GET  /api/batch/{id}/exceptions            ESCALATE rows only
  GET  /api/batch/{id}/cash                  cash-position waterfall

The reconcile endpoint now also runs the classifier so the full pipeline is:
  POST /api/demo-batch  →  POST /api/reconcile  →  GET /api/batch/{id}/summary
"""

from __future__ import annotations

import json
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from database import cipher, get_conn
from engine.classifier import ClassifiedResult, classify
from engine.explainer import generate_explanation, validate_rupee_amounts
from engine.matcher import MatchResult

router = APIRouter(prefix="/api", tags=["classify"])

# ── Schema ────────────────────────────────────────────────────────────────────

_CLASSIFY_SCHEMA = """
CREATE TABLE IF NOT EXISTS classified_results (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    batch_id             TEXT NOT NULL,
    order_id             TEXT NOT NULL,   -- encrypted
    settlement_id        TEXT NOT NULL,   -- encrypted
    payment_id           TEXT NOT NULL,   -- encrypted
    merchant_id          TEXT NOT NULL,   -- encrypted
    utr                  TEXT,            -- encrypted
    match_type           TEXT NOT NULL,
    category             TEXT NOT NULL,
    decision             TEXT NOT NULL,
    confidence           REAL NOT NULL,
    gross_amount         REAL NOT NULL,
    mdr_fee              REAL NOT NULL,
    gst_on_mdr           REAL NOT NULL,
    tds_amount           REAL NOT NULL,
    settlement_net       REAL NOT NULL,
    bank_credit          REAL NOT NULL,
    effective_bank       REAL NOT NULL,
    ledger_expected      REAL NOT NULL,
    difference           REAL NOT NULL,
    delay_days           INTEGER NOT NULL,
    settlement_date      TEXT NOT NULL,   -- encrypted
    bank_credit_date     TEXT NOT NULL,   -- encrypted
    ledger_recorded_date TEXT NOT NULL,   -- encrypted
    resolved             INTEGER NOT NULL DEFAULT 0,   -- 0=open 1=resolved by analyst
    resolved_note        TEXT,            -- encrypted analyst note
    agent_reasoning_log  TEXT             -- JSON array of automated agent tool steps
);
"""


def bootstrap_classify_schema() -> None:
    with get_conn() as conn:
        conn.executescript(_CLASSIFY_SCHEMA)
        try:
            conn.execute("ALTER TABLE classified_results ADD COLUMN agent_reasoning_log TEXT")
        except Exception:
            pass


# ── Persist ───────────────────────────────────────────────────────────────────

def persist_classified(batch_id: str, results: list[ClassifiedResult]) -> None:
    with get_conn() as conn:
        conn.execute(
            "DELETE FROM classified_results WHERE batch_id=?", (batch_id,)
        )
        conn.executemany(
            """INSERT INTO classified_results
               (batch_id, order_id, settlement_id, payment_id, merchant_id, utr,
                match_type, category, decision, confidence,
                gross_amount, mdr_fee, gst_on_mdr, tds_amount,
                settlement_net, bank_credit, effective_bank, ledger_expected,
                difference, delay_days,
                settlement_date, bank_credit_date, ledger_recorded_date, narration)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            [
                (
                    batch_id,
                    cipher.encrypt(c.order_id),
                    cipher.encrypt(c.settlement_id),
                    cipher.encrypt(c.payment_id),
                    cipher.encrypt(c.merchant_id),
                    cipher.encrypt(c.utr) if c.utr else None,
                    c.match_type,
                    c.category,
                    c.decision,
                    c.confidence,
                    c.gross_amount,
                    c.mdr_fee,
                    c.gst_on_mdr,
                    c.tds_amount,
                    c.settlement_net,
                    c.bank_credit,
                    c.effective_bank,
                    c.ledger_expected,
                    c.difference,
                    c.delay_days,
                    cipher.encrypt(c.settlement_date),
                    cipher.encrypt(c.bank_credit_date),
                    cipher.encrypt(c.ledger_recorded_date),
                    cipher.encrypt(c.narration),
                )
                for c in results
            ],
        )
        conn.execute(
            "UPDATE batches SET status='CLASSIFIED' WHERE batch_id=?", (batch_id,)
        )


# ── Load match_pairs → MatchResult list (for classifier input) ────────────────

def load_match_results(batch_id: str) -> list[MatchResult]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM match_pairs WHERE batch_id=?", (batch_id,)
        ).fetchall()
    results = []
    for r in rows:
        results.append(MatchResult(
            order_id=cipher.decrypt(r["order_id"]),
            settlement_id=cipher.decrypt(r["settlement_id"]),
            payment_id=cipher.decrypt(r["payment_id"]),
            merchant_id=cipher.decrypt(r["merchant_id"]),
            utr=cipher.decrypt(r["utr"]) if r["utr"] else None,
            match_type=r["match_type"],
            gross_amount=r["gross_amount"],
            mdr_fee=r["mdr_fee"],
            gst_on_mdr=r["gst_on_mdr"],
            tds_amount=r["tds_amount"],
            refund_amount=r["refund_amount"],
            settlement_net=r["settlement_net"],
            bank_credit=r["bank_credit"],
            ledger_expected=r["ledger_expected"],
            settlement_date=cipher.decrypt(r["settlement_date"]),
            bank_credit_date=cipher.decrypt(r["bank_credit_date"]),
            ledger_recorded_date=cipher.decrypt(r["ledger_recorded_date"]),
            narration=cipher.decrypt(r["narration"]),
        ))
    return results


# ── Serialise a single DB row → dict (decrypts on the fly) ───────────────────

def _row_to_dict(r) -> dict:
    d = {
        "order_id":            cipher.decrypt(r["order_id"]),
        "settlement_id":       cipher.decrypt(r["settlement_id"]),
        "payment_id":          cipher.decrypt(r["payment_id"]),
        "merchant_id":         cipher.decrypt(r["merchant_id"]),
        "utr":                 cipher.decrypt(r["utr"]) if r["utr"] else None,
        "match_type":          r["match_type"],
        "category":            r["category"],
        "decision":            r["decision"],
        "confidence":          r["confidence"],
        "gross_amount":        r["gross_amount"],
        "mdr_fee":             r["mdr_fee"],
        "gst_on_mdr":          r["gst_on_mdr"],
        "tds_amount":          r["tds_amount"],
        "settlement_net":      r["settlement_net"],
        "bank_credit":         r["bank_credit"],
        "effective_bank":      r["effective_bank"],
        "ledger_expected":     r["ledger_expected"],
        "difference":          r["difference"],
        "delay_days":          r["delay_days"],
        "settlement_date":     cipher.decrypt(r["settlement_date"]),
        "bank_credit_date":    cipher.decrypt(r["bank_credit_date"]),
        "ledger_recorded_date": cipher.decrypt(r["ledger_recorded_date"]),
        "narration":           cipher.decrypt(r["narration"]),
        "resolved":            bool(r["resolved"]),
        "resolved_note":       cipher.decrypt(r["resolved_note"]) if r["resolved_note"] else None,
    }
    try:
        log_raw = r["agent_reasoning_log"]
        d["agent_reasoning_log"] = json.loads(log_raw) if log_raw else []
    except Exception:
        d["agent_reasoning_log"] = []

    explanation = generate_explanation(d)
    d["explanation"] = explanation
    d["explanation_valid"] = validate_rupee_amounts(explanation, d)
    return d


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/batch/{batch_id}/transactions")
async def list_transactions(
    batch_id: str,
    page:     int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=2000),
    decision: Optional[str] = Query(None, description="APPROVE|HOLD|ESCALATE"),
    category: Optional[str] = Query(None),
    search:   Optional[str] = Query(None, description="order_id prefix filter"),
) -> JSONResponse:
    """Paginated classified results for a batch."""
    with get_conn() as conn:
        batch = conn.execute(
            "SELECT status FROM batches WHERE batch_id=?", (batch_id,)
        ).fetchone()
    if not batch:
        raise HTTPException(404, "batch not found")
    if batch["status"] == "INGESTED":
        raise HTTPException(409, "Batch not yet reconciled/classified")

    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM classified_results WHERE batch_id=? ORDER BY id",
            (batch_id,),
        ).fetchall()

    # Decrypt filter fields and apply filters
    items = [_row_to_dict(r) for r in rows]
    if decision:
        items = [i for i in items if i["decision"] == decision.upper()]
    if category:
        items = [i for i in items if i["category"] == category.upper()]
    if search:
        items = [i for i in items if i["order_id"].startswith(search)]

    total = len(items)
    start = (page - 1) * page_size
    page_items = items[start: start + page_size]

    return JSONResponse({
        "batch_id": batch_id,
        "total":    total,
        "page":     page,
        "page_size": page_size,
        "pages":    (total + page_size - 1) // page_size,
        "items":    page_items,
    })


@router.get("/batch/{batch_id}/transactions/{order_id}")
async def get_transaction(batch_id: str, order_id: str) -> JSONResponse:
    """Full detail for a single order — powers the order drawer."""
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM classified_results WHERE batch_id=?", (batch_id,)
        ).fetchall()

    # Scan (decrypt each row) — safe for demo-scale 74 rows
    for r in rows:
        if cipher.decrypt(r["order_id"]) == order_id:
            item = _row_to_dict(r)
            # Attach audit trail for this order
            item["audit_events"] = _order_audit_events(batch_id, order_id)
            return JSONResponse(item)

    raise HTTPException(404, f"order_id {order_id} not found in batch {batch_id}")


@router.get("/batch/{batch_id}/exceptions")
async def list_exceptions(batch_id: str) -> JSONResponse:
    """ESCALATE rows only — powers the Exceptions page."""
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM classified_results WHERE batch_id=? AND decision='ESCALATE' ORDER BY ABS(difference) DESC",
            (batch_id,),
        ).fetchall()

    items = [_row_to_dict(r) for r in rows]
    total_exposure = round(sum(i["difference"] for i in items if i["difference"] > 0), 2)

    return JSONResponse({
        "batch_id":       batch_id,
        "count":          len(items),
        "total_exposure": total_exposure,
        "items":          items,
    })


@router.get("/batch/{batch_id}/cash")
async def cash_position(batch_id: str) -> JSONResponse:
    """
    Cash-position waterfall for the batch:
      gross_inflow → deduct_mdr → deduct_gst → deduct_tds → expected_net
      → variance (ledger_expected − effective_bank across all orders)
      → actual_net (sum of effective_bank)
    """
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM classified_results WHERE batch_id=?", (batch_id,)
        ).fetchall()

    if not rows:
        raise HTTPException(404, "No classified results for this batch")

    gross        = round(sum(r["gross_amount"]    for r in rows), 2)
    total_mdr    = round(sum(r["mdr_fee"]         for r in rows), 2)
    total_gst    = round(sum(r["gst_on_mdr"]      for r in rows), 2)
    total_tds    = round(sum(r["tds_amount"]      for r in rows), 2)
    expected_net = round(sum(r["ledger_expected"] for r in rows), 2)
    actual_net   = round(sum(r["effective_bank"]  for r in rows), 2)
    variance     = round(expected_net - actual_net, 2)

    # Category-level breakdown
    from collections import defaultdict
    by_cat: dict[str, dict] = defaultdict(lambda: {"count": 0, "gross": 0.0, "variance": 0.0})
    by_dec: dict[str, int]  = defaultdict(int)
    for r in rows:
        cat = r["category"]
        by_cat[cat]["count"]   += 1
        by_cat[cat]["gross"]   = round(by_cat[cat]["gross"]   + r["gross_amount"], 2)
        by_cat[cat]["variance"]= round(by_cat[cat]["variance"] + r["difference"],  2)
        by_dec[r["decision"]]  += 1

    return JSONResponse({
        "batch_id":    batch_id,
        "waterfall": {
            "gross_inflow":   gross,
            "minus_mdr":      -total_mdr,
            "minus_gst":      -total_gst,
            "minus_tds":      -total_tds,
            "expected_net":   expected_net,
            "variance":       -variance,          # negative = shortfall
            "actual_net":     actual_net,
        },
        "decisions":   dict(by_dec),
        "by_category": {
            cat: {"count": v["count"], "gross": v["gross"],
                  "variance": round(v["variance"], 2)}
            for cat, v in sorted(by_cat.items())
        },
    })


@router.post("/batch/{batch_id}/resolve")
async def resolve_order(batch_id: str, body: dict) -> JSONResponse:
    """
    Mark an order as manually resolved by an analyst.
    Body: {"order_id": "ORD1055", "note": "Confirmed with gateway team — duplicate fee"}
    """
    order_id = body.get("order_id", "")
    note     = body.get("note", "")
    if not order_id:
        raise HTTPException(400, "order_id required")

    with get_conn() as conn:
        rows = conn.execute(
            "SELECT id, order_id FROM classified_results WHERE batch_id=?", (batch_id,)
        ).fetchall()

    target_id = None
    for r in rows:
        if cipher.decrypt(r["order_id"]) == order_id:
            target_id = r["id"]
            break

    if target_id is None:
        raise HTTPException(404, f"order_id {order_id} not found")

    with get_conn() as conn:
        target_row = conn.execute("SELECT * FROM classified_results WHERE id=?", (target_id,)).fetchone()
        conn.execute(
            "UPDATE classified_results SET resolved=1, resolved_note=? WHERE id=?",
            (cipher.encrypt(note), target_id),
        )
        conn.execute(
            "INSERT INTO audit_log (event_type, batch_id, detail) VALUES (?,?,?)",
            ("RESOLVE", batch_id, json.dumps({"order_id": order_id, "note": note[:120]})),
        )

    # Phase 10: Financial Memory Engine — Index user resolution for future batches
    from engine.memory import add_or_update_memory_rule
    if target_row:
        cat = target_row["category"]
        diff = target_row["difference"]
        merch = cipher.decrypt(target_row["merchant_id"])
        rule_key = f"MEM_{merch}_{cat}".upper()
        rule_desc = f"Analyst manual approval for {merch} ({cat}, diff ₹{diff:.2f}): {note}"
        add_or_update_memory_rule(
            pattern_key=rule_key,
            category=cat,
            description=rule_desc,
            confidence=1.0,
        )

    return JSONResponse({"status": "resolved", "order_id": order_id})


# ── Internal helpers ──────────────────────────────────────────────────────────

def _order_audit_events(batch_id: str, order_id: str) -> list[dict]:
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT event_time, event_type, detail FROM audit_log WHERE batch_id=? ORDER BY id",
            (batch_id,),
        ).fetchall()
    events = []
    for r in rows:
        detail = r["detail"] or "{}"
        try:
            d = json.loads(detail)
        except Exception:
            d = {"raw": detail}
        if d.get("order_id", "") == order_id or r["event_type"] in ("INGEST", "RECONCILE", "CLASSIFY"):
            events.append({
                "time":       r["event_time"],
                "event_type": r["event_type"],
                "detail":     d,
            })
    return events
