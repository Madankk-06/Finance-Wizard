"""
engine/memory.py — Phase 6: Financial Memory Engine

Institutional knowledge repository that tracks learned variance patterns,
applies them across reconciliation runs, and exposes rules to the UI without duplicate tabs.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Optional, Any
from database import get_conn


DEFAULT_MEMORY_RULES = [
    {
        "pattern_key": "MULTI_ORDER_LUMPED_SETTLEMENT",
        "category": "LUMPED_BATCH_MATCHED",
        "description": "Consolidated gateway payout batch covering multiple individual orders under a single NEFT UTR.",
        "confidence": 1.0,
        "applied_count": 15,
    },
    {
        "pattern_key": "MDR_GST_STANDARD_OMISSION",
        "category": "FEE_DEDUCTION",
        "description": "Standard 2% MDR fee plus 18% GST on MDR omitted from merchant ERP sales invoices.",
        "confidence": 1.0,
        "applied_count": 10,
    },
    {
        "pattern_key": "TDS_SECTION_194O_WITHHOLDING",
        "category": "TAX_DEDUCTION",
        "description": "1% TDS statutory withholding under Income Tax Act Section 194-O deducted at payment source.",
        "confidence": 1.0,
        "applied_count": 8,
    },
    {
        "pattern_key": "TIMING_DELAY_LATENCY",
        "category": "TIMING_DELAY",
        "description": "Cross-bank holiday and weekend settlement clearance latency exceeding normal T+1 day window.",
        "confidence": 1.0,
        "applied_count": 8,
    },
    {
        "pattern_key": "GATEWAY_ROUNDING_TOLERANCE",
        "category": "ROUNDING",
        "description": "Floating-point precision rounding discrepancies under ₹5.00 auto-cleared per risk threshold policy.",
        "confidence": 0.85,
        "applied_count": 7,
    },
    {
        "pattern_key": "PARTIAL_PAYMENT_SHORTFALL",
        "category": "PARTIAL_PAYMENT",
        "description": "Partial payment tranche disbursement from gateway requiring manual review before balance credit.",
        "confidence": 0.90,
        "applied_count": 5,
    },
    {
        "pattern_key": "UNEXPLAINED_VARIANCE_INVESTIGATION",
        "category": "UNEXPLAINED",
        "description": "Discrepancies not matching statutory fee rates; routed to investigative agent for line-item audit.",
        "confidence": 0.95,
        "applied_count": 5,
    },
    {
        "pattern_key": "POST_SETTLEMENT_CUSTOMER_REFUND",
        "category": "EDGE_DELAYED_REFUND",
        "description": "Delayed customer return debit matched to previously reconciled original order transaction.",
        "confidence": 0.95,
        "applied_count": 2,
    },
    {
        "pattern_key": "TRANCHE_SPLIT_DISBURSEMENT",
        "category": "EDGE_SPLIT_SETTLEMENT",
        "description": "High-ticket payment disbursed by gateway across multiple partial bank credits summing to net invoice.",
        "confidence": 1.0,
        "applied_count": 1,
    },
]


def seed_default_memory_rules() -> None:
    """
    Seed initial organizational memory rules if table is empty.
    """
    with get_conn() as conn:
        count = conn.execute("SELECT COUNT(*) FROM financial_memory").fetchone()[0]
        if count == 0:
            for rule in DEFAULT_MEMORY_RULES:
                conn.execute(
                    """
                    INSERT INTO financial_memory (pattern_key, category, description, confidence, applied_count)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (
                        rule["pattern_key"],
                        rule["category"],
                        rule["description"],
                        rule["confidence"],
                        rule["applied_count"],
                    ),
                )


def get_all_memory_rules() -> list[dict[str, Any]]:
    """
    Return all active financial memory rules, strictly deduplicated by category.
    """
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, pattern_key, category, description, confidence, applied_count, created_at, updated_at 
            FROM financial_memory 
            GROUP BY category
            ORDER BY applied_count DESC, id ASC
            """
        ).fetchall()

    return [dict(r) for r in rows]


def add_or_update_memory_rule(
    pattern_key: str,
    category: str,
    description: str,
    confidence: float = 1.0,
) -> dict[str, Any]:
    """
    Create or update a financial memory rule for a category without creating duplicate tabs.
    """
    now = datetime.now(timezone.utc).isoformat()
    with get_conn() as conn:
        existing = conn.execute(
            "SELECT id, applied_count FROM financial_memory WHERE category = ?", (category,)
        ).fetchone()

        if existing:
            conn.execute(
                """
                UPDATE financial_memory 
                SET description = ?, confidence = ?, updated_at = ?
                WHERE id = ?
                """,
                (description, confidence, now, existing["id"]),
            )
            row = conn.execute("SELECT * FROM financial_memory WHERE id = ?", (existing["id"],)).fetchone()
        else:
            conn.execute(
                """
                INSERT INTO financial_memory (pattern_key, category, description, confidence, applied_count, created_at, updated_at)
                VALUES (?, ?, ?, ?, 1, ?, ?)
                """,
                (pattern_key, category, description, confidence, now, now),
            )
            row = conn.execute("SELECT * FROM financial_memory WHERE pattern_key = ?", (pattern_key,)).fetchone()

    return dict(row)


def sync_batch_memory_counts(batch_id: str) -> None:
    """
    Recalculate exact application counts for financial memory rules based on the latest batch.
    Overwrites the count to exact matched occurrences rather than compounding.
    """
    with get_conn() as conn:
        cat_counts = conn.execute(
            "SELECT category, COUNT(*) as cnt FROM classified_results WHERE batch_id = ? GROUP BY category",
            (batch_id,),
        ).fetchall()

        cat_map = {r["category"]: r["cnt"] for r in cat_counts}

        rules = conn.execute("SELECT id, pattern_key, category FROM financial_memory").fetchall()
        for r in rules:
            cnt = cat_map.get(r["category"], 0)
            conn.execute(
                "UPDATE financial_memory SET applied_count = ? WHERE id = ?",
                (cnt, r["id"]),
            )
