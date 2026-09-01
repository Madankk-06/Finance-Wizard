"""
engine/cash_simulator.py — Phase 7: Cash Position & Counterfactual Simulator

Provides:
  1. Detailed cash waterfall breakdown
  2. Counterfactual "What-If" scenario simulator (fee rates, dispute recoveries, tax changes)
  3. Cash velocity & daily liquidity timeline forecasting
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import date, timedelta
from typing import Any, Optional
import pandas as pd


@dataclass
class SimulationScenario:
    mdr_rate_override: Optional[float] = None     # e.g., 0.0175 for 1.75%
    gst_rate_override: Optional[float] = None     # e.g., 0.18 for 18%
    tds_rate_override: Optional[float] = None     # e.g., 0.02 for 2%
    recover_escalated: bool = False               # simulate 100% recovery of escalated shortfalls
    resolve_timing_delays: bool = False           # simulate instant T+2 settlement without delays


def compute_baseline_waterfall(records: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Calculate the actual realized cash waterfall from classified records.
    """
    gross = sum(r["gross_amount"] for r in records)
    mdr = sum(r["mdr_fee"] for r in records)
    gst = sum(r["gst_on_mdr"] for r in records)
    tds = sum(r["tds_amount"] for r in records)
    expected_net = sum(r["ledger_expected"] for r in records)
    actual_net = sum(r["effective_bank"] for r in records)
    variance = expected_net - actual_net

    return {
        "gross_inflow": round(gross, 2),
        "mdr_fee": round(mdr, 2),
        "gst_on_mdr": round(gst, 2),
        "tds_withholding": round(tds, 2),
        "total_deductions": round(mdr + gst + tds, 2),
        "expected_net": round(expected_net, 2),
        "shortfall_variance": round(variance, 2),
        "realized_cash": round(actual_net, 2),
        "realization_rate_pct": round((actual_net / gross) * 100, 2) if gross > 0 else 0.0,
    }


def run_counterfactual_simulation(
    records: list[dict[str, Any]],
    scenario: SimulationScenario,
) -> dict[str, Any]:
    """
    Simulate impact of fee changes, tax policies, and dispute recovery on bottom-line cash.
    """
    baseline = compute_baseline_waterfall(records)

    simulated_gross = baseline["gross_inflow"]
    
    # Calculate simulated fees
    total_sim_mdr = 0.0
    total_sim_gst = 0.0
    total_sim_tds = 0.0
    total_sim_bank = 0.0

    for r in records:
        g = r["gross_amount"]
        m_rate = scenario.mdr_rate_override if scenario.mdr_rate_override is not None else 0.02
        g_rate = scenario.gst_rate_override if scenario.gst_rate_override is not None else 0.18
        t_rate = scenario.tds_rate_override if scenario.tds_rate_override is not None else 0.01

        sim_mdr = round(g * m_rate, 2)
        sim_gst = round(sim_mdr * g_rate, 2)
        sim_tds = round(g * t_rate, 2)

        total_sim_mdr += sim_mdr
        total_sim_gst += sim_gst
        total_sim_tds += sim_tds

        # Cash received
        if scenario.recover_escalated and r["decision"] == "ESCALATE":
            # Recover the shortfall
            sim_bank = round(g - sim_mdr - sim_gst - sim_tds, 2)
        else:
            # Baseline net adjusted for new fee rate
            sim_bank = round(g - sim_mdr - sim_gst - sim_tds - max(0, r["difference"]), 2)

        total_sim_bank += sim_bank

    total_sim_deductions = total_sim_mdr + total_sim_gst + total_sim_tds
    sim_expected_net = simulated_gross - total_sim_deductions
    sim_variance = sim_expected_net - total_sim_bank

    net_cash_delta = round(total_sim_bank - baseline["realized_cash"], 2)
    fee_savings = round(baseline["total_deductions"] - total_sim_deductions, 2)

    return {
        "scenario": asdict(scenario),
        "baseline": baseline,
        "simulated": {
            "gross_inflow": round(simulated_gross, 2),
            "mdr_fee": round(total_sim_mdr, 2),
            "gst_on_mdr": round(total_sim_gst, 2),
            "tds_withholding": round(total_sim_tds, 2),
            "total_deductions": round(total_sim_deductions, 2),
            "expected_net": round(sim_expected_net, 2),
            "shortfall_variance": round(sim_variance, 2),
            "realized_cash": round(total_sim_bank, 2),
            "realization_rate_pct": round((total_sim_bank / simulated_gross) * 100, 2) if simulated_gross > 0 else 0.0,
        },
        "impact": {
            "net_cash_delta": net_cash_delta,
            "fee_savings": fee_savings,
            "pct_cash_improvement": round((net_cash_delta / baseline["realized_cash"]) * 100, 2) if baseline["realized_cash"] > 0 else 0.0,
        },
    }


def compute_cash_forecast_timeline(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Generate daily cash inflow curve across all recorded settlement dates.
    """
    from collections import defaultdict

    daily_data = defaultdict(lambda: {"date": "", "disbursed_net": 0.0, "order_count": 0, "hold_amount": 0.0})

    for r in records:
        s_date = r.get("settlement_date") or "2026-07-01"
        entry = daily_data[s_date]
        entry["date"] = s_date
        entry["order_count"] += 1
        if r["decision"] == "HOLD":
            entry["hold_amount"] += r["effective_bank"]
        else:
            entry["disbursed_net"] += r["effective_bank"]

    # Sort chronologically
    timeline = sorted(daily_data.values(), key=lambda x: x["date"])
    running_cumulative = 0.0

    for item in timeline:
        item["disbursed_net"] = round(item["disbursed_net"], 2)
        item["hold_amount"] = round(item["hold_amount"], 2)
        running_cumulative += item["disbursed_net"]
        item["cumulative_cash"] = round(running_cumulative, 2)

    return timeline
