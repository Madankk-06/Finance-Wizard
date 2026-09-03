// Mock data for Finance Wizard - 74 live-calibrated records with complete reconciliation metadata

export const KPI_DATA = {
  matchRate: 85.1,
  matchRateLabel: "Matched transactions",
  approveCount: 55,
  approveLabel: "Auto-cleared",
  holdCount: 8,
  holdLabel: "Needs glance",
  escalateCount: 11,
  escalateLabel: "Needs human",
  throughput: "74 in 0.24s",
  throughputLabel: "Records processed",
  batchDate: "28 Aug 2026",
  batchTime: "10:32 AM",
  totalRecords: 74,
  processingTime: "0.24s",
  healthStatus: "Healthy"
};

export const CASH_POSITION_DATA = {
  settled: 232799.31,
  settledFormatted: "₹2,32,799",
  pendingAtRisk: 18640.00,
  pendingFormatted: "₹18,640",
  forecast: 221159.00,
  forecastFormatted: "₹2,21,159",
  counterfactual: {
    optimistic: 251439.31,
    optimisticFormatted: "₹2,51,439",
    pessimistic: 232799.31,
    pessimisticFormatted: "₹2,32,799",
    cashAtRisk: 18640.00,
    cashAtRiskFormatted: "₹18,640"
  },
  footnote: "Projection from pending exceptions and historical cycle — not a guarantee."
};

export const MOCK_ORDERS = [
  {
    "orderId": "ORD1050",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "PARTIAL_PAYMENT",
    "difference": 1144.07,
    "confidence": 90,
    "matchedTo": "Bank UTR 471723",
    "settleDate": "2026-07-10",
    "orderDate": "2026-07-08",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 2484.08,
    "mdrFee": 49.68,
    "gstOnMdr": 8.94,
    "tdsAmount": 24.84,
    "expectedNet": 2400.62,
    "actualBank": 1256.55,
    "settlementId": "stl_MXFIPEKA",
    "paymentId": "pay_TMHTTMKBOQ",
    "bankUtr": "UTR5515471723",
    "settlementRow": "#1",
    "ledgerEntry": "INV #10000",
    "alertSummary": "Partial tranche payout: Received \u20b91,256.55 (52.3%) against expected net of \u20b92,400.62. Unsettled balance of \u20b91,144.07 escalated for merchant support follow-up.",
    "reasoning": [
      "Partial tranche payout: Received \u20b91,256.55 (52.3%) against expected net of \u20b92,400.62. Unsettled balance of \u20b91,144.07 escalated for merchant support follow-up."
    ],
    "fullExplanation": "Partial tranche payout: Received \u20b91,256.55 (52.3%) against expected net of \u20b92,400.62. Unsettled balance of \u20b91,144.07 escalated for merchant support follow-up.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b92,484.08, Expected Net: \u20b92,400.62, Actual Bank Credit: \u20b91,256.55."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b949.68) + GST 18% (\u20b98.94) + TDS 1% (\u20b924.84). Target Net: \u20b92,400.62."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 52.3%. Shortfall is \u20b91,144.07 (Partial payout detected)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Partial tranches require active gateway representment."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Diagnosed incomplete payout. Shortfall of \u20b91,144.07 confirmed. Action drafted for Razorpay support."
      }
    ],
    "history": [
      {
        "time": "2026-07-08 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-10 02:30 PM",
        "text": "Settlement processed under stl_MXFIPEKA",
        "type": "info"
      },
      {
        "time": "2026-07-10 05:00 PM",
        "text": "Bank deposit verified via UTR5515471723",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (PARTIAL_PAYMENT)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1055",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "UNEXPLAINED",
    "difference": 386.97,
    "confidence": 70,
    "matchedTo": "Bank UTR 691118",
    "settleDate": "2026-07-03",
    "orderDate": "2026-07-01",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 5205.82,
    "mdrFee": 104.12,
    "gstOnMdr": 18.74,
    "tdsAmount": 52.06,
    "expectedNet": 5030.9,
    "actualBank": 4643.93,
    "settlementId": "stl_QZPEUQXI",
    "paymentId": "pay_GZDESGHPIT",
    "bankUtr": "UTR6923691118",
    "settlementRow": "#2",
    "ledgerEntry": "INV #10001",
    "alertSummary": "Unreconciled discrepancy of \u20b9386.97 on Gross \u20b95,205.82. Calculated standard fees (MDR \u20b9104.12, GST \u20b918.74, TDS \u20b952.06) do not account for this gap.",
    "reasoning": [
      "Unreconciled discrepancy of \u20b9386.97 on Gross \u20b95,205.82. Calculated standard fees (MDR \u20b9104.12, GST \u20b918.74, TDS \u20b952.06) do not account for this gap."
    ],
    "fullExplanation": "Unreconciled discrepancy of \u20b9386.97 on Gross \u20b95,205.82. Calculated standard fees (MDR \u20b9104.12, GST \u20b918.74, TDS \u20b952.06) do not account for this gap.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b95,205.82, Expected Net: \u20b95,030.90, Actual Bank Credit: \u20b94,643.93."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b9104.12) + GST 18% (\u20b918.74) + TDS 1% (\u20b952.06). Target Net: \u20b95,030.90."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 92.3%. Shortfall is \u20b9386.97 (Full tranche)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Unexplained variance requires human review."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Unexplained deduction of \u20b9386.97 flagged. Standard fee rates do not account for gap. Line-item annexure requested."
      }
    ],
    "history": [
      {
        "time": "2026-07-01 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-03 02:30 PM",
        "text": "Settlement processed under stl_QZPEUQXI",
        "type": "info"
      },
      {
        "time": "2026-07-03 05:00 PM",
        "text": "Bank deposit verified via UTR6923691118",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (UNEXPLAINED)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1057",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "EDGE_DELAYED_REFUND",
    "difference": 0.0,
    "confidence": 95,
    "matchedTo": "Bank UTR 576123",
    "settleDate": "2026-07-20",
    "orderDate": "2026-07-18",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 1838.68,
    "mdrFee": 36.77,
    "gstOnMdr": 6.62,
    "tdsAmount": 18.39,
    "expectedNet": 1776.9,
    "actualBank": 1776.9,
    "settlementId": "stl_OPMDPGTU",
    "paymentId": "pay_UWEBLOSJMI",
    "bankUtr": "UTR5462576123",
    "settlementRow": "#3",
    "ledgerEntry": "INV #10002",
    "alertSummary": "Delayed customer refund: Primary settlement of \u20b91,776.90 was clean. A linked post-settlement refund adjustment debit was subsequently recorded in bank records.",
    "reasoning": [
      "Delayed customer refund: Primary settlement of \u20b91,776.90 was clean. A linked post-settlement refund adjustment debit was subsequently recorded in bank records."
    ],
    "fullExplanation": "Delayed customer refund: Primary settlement of \u20b91,776.90 was clean. A linked post-settlement refund adjustment debit was subsequently recorded in bank records.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-18 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-20 02:30 PM",
        "text": "Settlement processed under stl_OPMDPGTU",
        "type": "info"
      },
      {
        "time": "2026-07-20 05:00 PM",
        "text": "Bank deposit verified via UTR5462576123",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (EDGE_DELAYED_REFUND)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1008",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 152758",
    "settleDate": "2026-07-22",
    "orderDate": "2026-07-20",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 5404.42,
    "mdrFee": 108.09,
    "gstOnMdr": 19.46,
    "tdsAmount": 54.04,
    "expectedNet": 5222.83,
    "actualBank": 5222.83,
    "settlementId": "stl_RACPDCLS",
    "paymentId": "pay_PNNERNNVBE",
    "bankUtr": "UTR5892152758",
    "settlementRow": "#4",
    "ledgerEntry": "INV #10003",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b95,404.42 less MDR fee (\u20b9108.09), GST (\u20b919.46), and TDS (\u20b954.04) perfectly matches bank deposit of \u20b95,222.83 under UTR UTR5892152758 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b95,404.42 less MDR fee (\u20b9108.09), GST (\u20b919.46), and TDS (\u20b954.04) perfectly matches bank deposit of \u20b95,222.83 under UTR UTR5892152758 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b95,404.42 less MDR fee (\u20b9108.09), GST (\u20b919.46), and TDS (\u20b954.04) perfectly matches bank deposit of \u20b95,222.83 under UTR UTR5892152758 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-20 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-22 02:30 PM",
        "text": "Settlement processed under stl_RACPDCLS",
        "type": "info"
      },
      {
        "time": "2026-07-22 05:00 PM",
        "text": "Bank deposit verified via UTR5892152758",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1051",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "UNEXPLAINED",
    "difference": 148.69,
    "confidence": 70,
    "matchedTo": "Bank UTR 981706",
    "settleDate": "2026-07-19",
    "orderDate": "2026-07-17",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 1279.59,
    "mdrFee": 25.59,
    "gstOnMdr": 4.61,
    "tdsAmount": 12.8,
    "expectedNet": 1236.59,
    "actualBank": 1087.9,
    "settlementId": "stl_MJHASRXP",
    "paymentId": "pay_KIIJEJQKVV",
    "bankUtr": "UTR9522981706",
    "settlementRow": "#5",
    "ledgerEntry": "INV #10004",
    "alertSummary": "Unreconciled discrepancy of \u20b9148.69 on Gross \u20b91,279.59. Calculated standard fees (MDR \u20b925.59, GST \u20b94.61, TDS \u20b912.80) do not account for this gap.",
    "reasoning": [
      "Unreconciled discrepancy of \u20b9148.69 on Gross \u20b91,279.59. Calculated standard fees (MDR \u20b925.59, GST \u20b94.61, TDS \u20b912.80) do not account for this gap."
    ],
    "fullExplanation": "Unreconciled discrepancy of \u20b9148.69 on Gross \u20b91,279.59. Calculated standard fees (MDR \u20b925.59, GST \u20b94.61, TDS \u20b912.80) do not account for this gap.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b91,279.59, Expected Net: \u20b91,236.59, Actual Bank Credit: \u20b91,087.90."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b925.59) + GST 18% (\u20b94.61) + TDS 1% (\u20b912.80). Target Net: \u20b91,236.59."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 88.0%. Shortfall is \u20b9148.69 (Partial payout detected)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Unexplained variance requires human review."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Unexplained deduction of \u20b9148.69 flagged. Standard fee rates do not account for gap. Line-item annexure requested."
      }
    ],
    "history": [
      {
        "time": "2026-07-17 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-19 02:30 PM",
        "text": "Settlement processed under stl_MJHASRXP",
        "type": "info"
      },
      {
        "time": "2026-07-19 05:00 PM",
        "text": "Bank deposit verified via UTR9522981706",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (UNEXPLAINED)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1012",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 532275",
    "settleDate": "2026-07-09",
    "orderDate": "2026-07-07",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 3803.98,
    "mdrFee": 76.08,
    "gstOnMdr": 13.69,
    "tdsAmount": 38.04,
    "expectedNet": 3676.17,
    "actualBank": 3676.17,
    "settlementId": "stl_QMOBZZWM",
    "paymentId": "pay_KWVQCFPUZQ",
    "bankUtr": "UTR3639532275",
    "settlementRow": "#6",
    "ledgerEntry": "INV #10005",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b93,803.98 less MDR fee (\u20b976.08), GST (\u20b913.69), and TDS (\u20b938.04) perfectly matches bank deposit of \u20b93,676.17 under UTR UTR3639532275 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b93,803.98 less MDR fee (\u20b976.08), GST (\u20b913.69), and TDS (\u20b938.04) perfectly matches bank deposit of \u20b93,676.17 under UTR UTR3639532275 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b93,803.98 less MDR fee (\u20b976.08), GST (\u20b913.69), and TDS (\u20b938.04) perfectly matches bank deposit of \u20b93,676.17 under UTR UTR3639532275 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-07 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-09 02:30 PM",
        "text": "Settlement processed under stl_QMOBZZWM",
        "type": "info"
      },
      {
        "time": "2026-07-09 05:00 PM",
        "text": "Bank deposit verified via UTR3639532275",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1035",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "ROUNDING",
    "difference": 1.09,
    "confidence": 85,
    "matchedTo": "Bank UTR 423555",
    "settleDate": "2026-07-17",
    "orderDate": "2026-07-15",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 647.38,
    "mdrFee": 12.95,
    "gstOnMdr": 2.33,
    "tdsAmount": 6.47,
    "expectedNet": 625.63,
    "actualBank": 624.54,
    "settlementId": "stl_TXAETNQM",
    "paymentId": "pay_UFIFBKKFRD",
    "bankUtr": "UTR1475423555",
    "settlementRow": "#7",
    "ledgerEntry": "INV #10006",
    "alertSummary": "Gateway floating-point rounding variance of \u20b91.09 detected on Gross \u20b9647.38. Within automatic approval threshold (\u2264 \u20b95.00).",
    "reasoning": [
      "Gateway floating-point rounding variance of \u20b91.09 detected on Gross \u20b9647.38. Within automatic approval threshold (\u2264 \u20b95.00)."
    ],
    "fullExplanation": "Gateway floating-point rounding variance of \u20b91.09 detected on Gross \u20b9647.38. Within automatic approval threshold (\u2264 \u20b95.00).",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-15 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-17 02:30 PM",
        "text": "Settlement processed under stl_TXAETNQM",
        "type": "info"
      },
      {
        "time": "2026-07-17 05:00 PM",
        "text": "Bank deposit verified via UTR1475423555",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (ROUNDING)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1036",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "ROUNDING",
    "difference": 2.94,
    "confidence": 85,
    "matchedTo": "Bank UTR 056963",
    "settleDate": "2026-07-12",
    "orderDate": "2026-07-10",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 533.51,
    "mdrFee": 10.67,
    "gstOnMdr": 1.92,
    "tdsAmount": 5.34,
    "expectedNet": 515.58,
    "actualBank": 512.64,
    "settlementId": "stl_ZTDUOZUH",
    "paymentId": "pay_HUTCKMRRCH",
    "bankUtr": "UTR3155056963",
    "settlementRow": "#8",
    "ledgerEntry": "INV #10007",
    "alertSummary": "Gateway floating-point rounding variance of \u20b92.94 detected on Gross \u20b9533.51. Within automatic approval threshold (\u2264 \u20b95.00).",
    "reasoning": [
      "Gateway floating-point rounding variance of \u20b92.94 detected on Gross \u20b9533.51. Within automatic approval threshold (\u2264 \u20b95.00)."
    ],
    "fullExplanation": "Gateway floating-point rounding variance of \u20b92.94 detected on Gross \u20b9533.51. Within automatic approval threshold (\u2264 \u20b95.00).",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-10 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-12 02:30 PM",
        "text": "Settlement processed under stl_ZTDUOZUH",
        "type": "info"
      },
      {
        "time": "2026-07-12 05:00 PM",
        "text": "Bank deposit verified via UTR3155056963",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (ROUNDING)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1010",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 465697",
    "settleDate": "2026-07-09",
    "orderDate": "2026-07-07",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 946.63,
    "mdrFee": 18.93,
    "gstOnMdr": 3.41,
    "tdsAmount": 9.47,
    "expectedNet": 914.82,
    "actualBank": 914.82,
    "settlementId": "stl_ANQYYLAM",
    "paymentId": "pay_WFREEAYBFK",
    "bankUtr": "UTR1111465697",
    "settlementRow": "#9",
    "ledgerEntry": "INV #10008",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b9946.63 less MDR fee (\u20b918.93), GST (\u20b93.41), and TDS (\u20b99.47) perfectly matches bank deposit of \u20b9914.82 under UTR UTR1111465697 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b9946.63 less MDR fee (\u20b918.93), GST (\u20b93.41), and TDS (\u20b99.47) perfectly matches bank deposit of \u20b9914.82 under UTR UTR1111465697 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b9946.63 less MDR fee (\u20b918.93), GST (\u20b93.41), and TDS (\u20b99.47) perfectly matches bank deposit of \u20b9914.82 under UTR UTR1111465697 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-07 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-09 02:30 PM",
        "text": "Settlement processed under stl_ANQYYLAM",
        "type": "info"
      },
      {
        "time": "2026-07-09 05:00 PM",
        "text": "Bank deposit verified via UTR1111465697",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1001",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 096792",
    "settleDate": "2026-07-20",
    "orderDate": "2026-07-18",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 3892.85,
    "mdrFee": 77.86,
    "gstOnMdr": 14.01,
    "tdsAmount": 38.93,
    "expectedNet": 3762.05,
    "actualBank": 3762.05,
    "settlementId": "stl_GEONYLGC",
    "paymentId": "pay_CJXDCGLMLZ",
    "bankUtr": "UTR4218096792",
    "settlementRow": "#10",
    "ledgerEntry": "INV #10009",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b93,892.85 less MDR fee (\u20b977.86), GST (\u20b914.01), and TDS (\u20b938.93) perfectly matches bank deposit of \u20b93,762.05 under UTR UTR4218096792 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b93,892.85 less MDR fee (\u20b977.86), GST (\u20b914.01), and TDS (\u20b938.93) perfectly matches bank deposit of \u20b93,762.05 under UTR UTR4218096792 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b93,892.85 less MDR fee (\u20b977.86), GST (\u20b914.01), and TDS (\u20b938.93) perfectly matches bank deposit of \u20b93,762.05 under UTR UTR4218096792 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-18 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-20 02:30 PM",
        "text": "Settlement processed under stl_GEONYLGC",
        "type": "info"
      },
      {
        "time": "2026-07-20 05:00 PM",
        "text": "Bank deposit verified via UTR4218096792",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1024",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "TAX_DEDUCTION",
    "difference": 80.07,
    "confidence": 100,
    "matchedTo": "Bank UTR 685639",
    "settleDate": "2026-07-11",
    "orderDate": "2026-07-09",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 8006.6,
    "mdrFee": 160.13,
    "gstOnMdr": 28.82,
    "tdsAmount": 80.07,
    "expectedNet": 7817.65,
    "actualBank": 7737.58,
    "settlementId": "stl_GLDIRDEW",
    "paymentId": "pay_EJMLHNLKSR",
    "bankUtr": "UTR1567685639",
    "settlementRow": "#11",
    "ledgerEntry": "INV #10010",
    "alertSummary": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b980.07). Expected payout was \u20b97,817.65, and bank deposit received was \u20b97,737.58.",
    "reasoning": [
      "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b980.07). Expected payout was \u20b97,817.65, and bank deposit received was \u20b97,737.58."
    ],
    "fullExplanation": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b980.07). Expected payout was \u20b97,817.65, and bank deposit received was \u20b97,737.58.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-09 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-11 02:30 PM",
        "text": "Settlement processed under stl_GLDIRDEW",
        "type": "info"
      },
      {
        "time": "2026-07-11 05:00 PM",
        "text": "Bank deposit verified via UTR1567685639",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (TAX_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1046",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "PARTIAL_PAYMENT",
    "difference": 1295.52,
    "confidence": 90,
    "matchedTo": "Bank UTR 615449",
    "settleDate": "2026-07-22",
    "orderDate": "2026-07-20",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 3798.87,
    "mdrFee": 75.98,
    "gstOnMdr": 13.68,
    "tdsAmount": 37.99,
    "expectedNet": 3671.22,
    "actualBank": 2375.7,
    "settlementId": "stl_YIVTVWZJ",
    "paymentId": "pay_DXAZUNNJSO",
    "bankUtr": "UTR1433615449",
    "settlementRow": "#12",
    "ledgerEntry": "INV #10011",
    "alertSummary": "Partial tranche payout: Received \u20b92,375.70 (64.7%) against expected net of \u20b93,671.22. Unsettled balance of \u20b91,295.52 escalated for merchant support follow-up.",
    "reasoning": [
      "Partial tranche payout: Received \u20b92,375.70 (64.7%) against expected net of \u20b93,671.22. Unsettled balance of \u20b91,295.52 escalated for merchant support follow-up."
    ],
    "fullExplanation": "Partial tranche payout: Received \u20b92,375.70 (64.7%) against expected net of \u20b93,671.22. Unsettled balance of \u20b91,295.52 escalated for merchant support follow-up.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b93,798.87, Expected Net: \u20b93,671.22, Actual Bank Credit: \u20b92,375.70."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b975.98) + GST 18% (\u20b913.68) + TDS 1% (\u20b937.99). Target Net: \u20b93,671.22."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 64.7%. Shortfall is \u20b91,295.52 (Partial payout detected)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Partial tranches require active gateway representment."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Diagnosed incomplete payout. Shortfall of \u20b91,295.52 confirmed. Action drafted for Razorpay support."
      }
    ],
    "history": [
      {
        "time": "2026-07-20 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-22 02:30 PM",
        "text": "Settlement processed under stl_YIVTVWZJ",
        "type": "info"
      },
      {
        "time": "2026-07-22 05:00 PM",
        "text": "Bank deposit verified via UTR1433615449",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (PARTIAL_PAYMENT)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1059",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "EDGE_POST_RECON_CHARGEBACK",
    "difference": 0.0,
    "confidence": 95,
    "matchedTo": "Bank UTR 848882",
    "settleDate": "2026-07-18",
    "orderDate": "2026-07-16",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 1254.78,
    "mdrFee": 25.1,
    "gstOnMdr": 4.52,
    "tdsAmount": 12.55,
    "expectedNet": 1212.61,
    "actualBank": 1212.61,
    "settlementId": "stl_LYAFDLEJ",
    "paymentId": "pay_UJBLYJCNDW",
    "bankUtr": "UTR5570848882",
    "settlementRow": "#13",
    "ledgerEntry": "INV #10012",
    "alertSummary": "Post-reconciliation chargeback: Primary invoice was settled cleanly at \u20b91,212.61, followed by an automated dispute clawback debit requiring immediate representment.",
    "reasoning": [
      "Post-reconciliation chargeback: Primary invoice was settled cleanly at \u20b91,212.61, followed by an automated dispute clawback debit requiring immediate representment."
    ],
    "fullExplanation": "Post-reconciliation chargeback: Primary invoice was settled cleanly at \u20b91,212.61, followed by an automated dispute clawback debit requiring immediate representment.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b91,254.78, Expected Net: \u20b91,212.61, Actual Bank Credit: \u20b91,212.61."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b925.10) + GST 18% (\u20b94.52) + TDS 1% (\u20b912.55). Target Net: \u20b91,212.61."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 100.0%. Shortfall is \u20b90.00 (Full tranche)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Post-recon dispute clawback matches known bank debit pattern."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Identified customer dispute clawback UTR UTR4134238445 for \u20b9682.78. Representment action generated."
      }
    ],
    "history": [
      {
        "time": "2026-07-16 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-18 02:30 PM",
        "text": "Settlement processed under stl_LYAFDLEJ",
        "type": "info"
      },
      {
        "time": "2026-07-18 05:00 PM",
        "text": "Bank deposit verified via UTR5570848882",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (EDGE_POST_RECON_CHARGEBACK)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1031",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "ROUNDING",
    "difference": 0.97,
    "confidence": 85,
    "matchedTo": "Bank UTR 965824",
    "settleDate": "2026-07-16",
    "orderDate": "2026-07-14",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 2753.0,
    "mdrFee": 55.06,
    "gstOnMdr": 9.91,
    "tdsAmount": 27.53,
    "expectedNet": 2660.5,
    "actualBank": 2659.53,
    "settlementId": "stl_DWHJHXCI",
    "paymentId": "pay_PMTHDNADHN",
    "bankUtr": "UTR6794965824",
    "settlementRow": "#14",
    "ledgerEntry": "INV #10013",
    "alertSummary": "Gateway floating-point rounding variance of \u20b90.97 detected on Gross \u20b92,753.00. Within automatic approval threshold (\u2264 \u20b95.00).",
    "reasoning": [
      "Gateway floating-point rounding variance of \u20b90.97 detected on Gross \u20b92,753.00. Within automatic approval threshold (\u2264 \u20b95.00)."
    ],
    "fullExplanation": "Gateway floating-point rounding variance of \u20b90.97 detected on Gross \u20b92,753.00. Within automatic approval threshold (\u2264 \u20b95.00).",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-14 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-16 02:30 PM",
        "text": "Settlement processed under stl_DWHJHXCI",
        "type": "info"
      },
      {
        "time": "2026-07-16 05:00 PM",
        "text": "Bank deposit verified via UTR6794965824",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (ROUNDING)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1045",
    "status": "HOLD",
    "decision": "HOLD",
    "category": "TIMING_DELAY",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 673491",
    "settleDate": "2026-07-17",
    "orderDate": "2026-07-09",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 3415.49,
    "mdrFee": 68.31,
    "gstOnMdr": 12.3,
    "tdsAmount": 34.15,
    "expectedNet": 3300.73,
    "actualBank": 3300.73,
    "settlementId": "stl_XERIGQZR",
    "paymentId": "pay_UTZEJTDQTE",
    "bankUtr": "UTR7170673491",
    "settlementRow": "#15",
    "ledgerEntry": "INV #10014",
    "alertSummary": "Extended settlement delay: Funds arrived on T+8 days (expected T+2). Disbursed amount of \u20b93,300.73 matches invoice net perfectly; held pending cycle verification.",
    "reasoning": [
      "Extended settlement delay: Funds arrived on T+8 days (expected T+2). Disbursed amount of \u20b93,300.73 matches invoice net perfectly; held pending cycle verification."
    ],
    "fullExplanation": "Extended settlement delay: Funds arrived on T+8 days (expected T+2). Disbursed amount of \u20b93,300.73 matches invoice net perfectly; held pending cycle verification.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-09 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-17 02:30 PM",
        "text": "Settlement processed under stl_XERIGQZR",
        "type": "info"
      },
      {
        "time": "2026-07-17 05:00 PM",
        "text": "Bank deposit verified via UTR7170673491",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as HOLD (TIMING_DELAY)",
        "type": "hold"
      }
    ]
  },
  {
    "orderId": "ORD1007",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 212378",
    "settleDate": "2026-07-15",
    "orderDate": "2026-07-13",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 4965.77,
    "mdrFee": 99.32,
    "gstOnMdr": 17.88,
    "tdsAmount": 49.66,
    "expectedNet": 4798.91,
    "actualBank": 4798.91,
    "settlementId": "stl_GQPVTZQA",
    "paymentId": "pay_RYEMFADGGC",
    "bankUtr": "UTR9748212378",
    "settlementRow": "#16",
    "ledgerEntry": "INV #10015",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b94,965.77 less MDR fee (\u20b999.32), GST (\u20b917.88), and TDS (\u20b949.66) perfectly matches bank deposit of \u20b94,798.91 under UTR UTR9748212378 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b94,965.77 less MDR fee (\u20b999.32), GST (\u20b917.88), and TDS (\u20b949.66) perfectly matches bank deposit of \u20b94,798.91 under UTR UTR9748212378 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b94,965.77 less MDR fee (\u20b999.32), GST (\u20b917.88), and TDS (\u20b949.66) perfectly matches bank deposit of \u20b94,798.91 under UTR UTR9748212378 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-13 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-15 02:30 PM",
        "text": "Settlement processed under stl_GQPVTZQA",
        "type": "info"
      },
      {
        "time": "2026-07-15 05:00 PM",
        "text": "Bank deposit verified via UTR9748212378",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1037",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "ROUNDING",
    "difference": 0.86,
    "confidence": 85,
    "matchedTo": "Bank UTR 940619",
    "settleDate": "2026-07-21",
    "orderDate": "2026-07-19",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 756.89,
    "mdrFee": 15.14,
    "gstOnMdr": 2.73,
    "tdsAmount": 7.57,
    "expectedNet": 731.45,
    "actualBank": 730.59,
    "settlementId": "stl_LFWDSZBO",
    "paymentId": "pay_VKXZYIJLKL",
    "bankUtr": "UTR8082940619",
    "settlementRow": "#17",
    "ledgerEntry": "INV #10016",
    "alertSummary": "Gateway floating-point rounding variance of \u20b90.86 detected on Gross \u20b9756.89. Within automatic approval threshold (\u2264 \u20b95.00).",
    "reasoning": [
      "Gateway floating-point rounding variance of \u20b90.86 detected on Gross \u20b9756.89. Within automatic approval threshold (\u2264 \u20b95.00)."
    ],
    "fullExplanation": "Gateway floating-point rounding variance of \u20b90.86 detected on Gross \u20b9756.89. Within automatic approval threshold (\u2264 \u20b95.00).",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-19 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-21 02:30 PM",
        "text": "Settlement processed under stl_LFWDSZBO",
        "type": "info"
      },
      {
        "time": "2026-07-21 05:00 PM",
        "text": "Bank deposit verified via UTR8082940619",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (ROUNDING)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1053",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "UNEXPLAINED",
    "difference": 291.93,
    "confidence": 70,
    "matchedTo": "Bank UTR 964776",
    "settleDate": "2026-07-21",
    "orderDate": "2026-07-19",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 4941.59,
    "mdrFee": 98.83,
    "gstOnMdr": 17.79,
    "tdsAmount": 49.42,
    "expectedNet": 4775.55,
    "actualBank": 4483.62,
    "settlementId": "stl_UQYJZFMG",
    "paymentId": "pay_HIQPKVDPYC",
    "bankUtr": "UTR7569964776",
    "settlementRow": "#18",
    "ledgerEntry": "INV #10017",
    "alertSummary": "Unreconciled discrepancy of \u20b9291.93 on Gross \u20b94,941.59. Calculated standard fees (MDR \u20b998.83, GST \u20b917.79, TDS \u20b949.42) do not account for this gap.",
    "reasoning": [
      "Unreconciled discrepancy of \u20b9291.93 on Gross \u20b94,941.59. Calculated standard fees (MDR \u20b998.83, GST \u20b917.79, TDS \u20b949.42) do not account for this gap."
    ],
    "fullExplanation": "Unreconciled discrepancy of \u20b9291.93 on Gross \u20b94,941.59. Calculated standard fees (MDR \u20b998.83, GST \u20b917.79, TDS \u20b949.42) do not account for this gap.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b94,941.59, Expected Net: \u20b94,775.55, Actual Bank Credit: \u20b94,483.62."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b998.83) + GST 18% (\u20b917.79) + TDS 1% (\u20b949.42). Target Net: \u20b94,775.55."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 93.9%. Shortfall is \u20b9291.93 (Full tranche)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Unexplained variance requires human review."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Unexplained deduction of \u20b9291.93 flagged. Standard fee rates do not account for gap. Line-item annexure requested."
      }
    ],
    "history": [
      {
        "time": "2026-07-19 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-21 02:30 PM",
        "text": "Settlement processed under stl_UQYJZFMG",
        "type": "info"
      },
      {
        "time": "2026-07-21 05:00 PM",
        "text": "Bank deposit verified via UTR7569964776",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (UNEXPLAINED)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1042",
    "status": "HOLD",
    "decision": "HOLD",
    "category": "TIMING_DELAY",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 757369",
    "settleDate": "2026-08-01",
    "orderDate": "2026-07-21",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 1539.92,
    "mdrFee": 30.8,
    "gstOnMdr": 5.54,
    "tdsAmount": 15.4,
    "expectedNet": 1488.18,
    "actualBank": 1488.18,
    "settlementId": "stl_IZZYHYHX",
    "paymentId": "pay_VQJXFEOZDN",
    "bankUtr": "UTR4030757369",
    "settlementRow": "#19",
    "ledgerEntry": "INV #10018",
    "alertSummary": "Extended settlement delay: Funds arrived on T+11 days (expected T+2). Disbursed amount of \u20b91,488.18 matches invoice net perfectly; held pending cycle verification.",
    "reasoning": [
      "Extended settlement delay: Funds arrived on T+11 days (expected T+2). Disbursed amount of \u20b91,488.18 matches invoice net perfectly; held pending cycle verification."
    ],
    "fullExplanation": "Extended settlement delay: Funds arrived on T+11 days (expected T+2). Disbursed amount of \u20b91,488.18 matches invoice net perfectly; held pending cycle verification.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-21 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-08-01 02:30 PM",
        "text": "Settlement processed under stl_IZZYHYHX",
        "type": "info"
      },
      {
        "time": "2026-08-01 05:00 PM",
        "text": "Bank deposit verified via UTR4030757369",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as HOLD (TIMING_DELAY)",
        "type": "hold"
      }
    ]
  },
  {
    "orderId": "ORD1004",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 783266",
    "settleDate": "2026-07-08",
    "orderDate": "2026-07-06",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 5224.12,
    "mdrFee": 104.48,
    "gstOnMdr": 18.81,
    "tdsAmount": 52.24,
    "expectedNet": 5048.59,
    "actualBank": 5048.59,
    "settlementId": "stl_HIPTGADD",
    "paymentId": "pay_XRRVFTVAAW",
    "bankUtr": "UTR7283783266",
    "settlementRow": "#20",
    "ledgerEntry": "INV #10019",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b95,224.12 less MDR fee (\u20b9104.48), GST (\u20b918.81), and TDS (\u20b952.24) perfectly matches bank deposit of \u20b95,048.59 under UTR UTR7283783266 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b95,224.12 less MDR fee (\u20b9104.48), GST (\u20b918.81), and TDS (\u20b952.24) perfectly matches bank deposit of \u20b95,048.59 under UTR UTR7283783266 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b95,224.12 less MDR fee (\u20b9104.48), GST (\u20b918.81), and TDS (\u20b952.24) perfectly matches bank deposit of \u20b95,048.59 under UTR UTR7283783266 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-06 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-08 02:30 PM",
        "text": "Settlement processed under stl_HIPTGADD",
        "type": "info"
      },
      {
        "time": "2026-07-08 05:00 PM",
        "text": "Bank deposit verified via UTR7283783266",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1027",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "TAX_DEDUCTION",
    "difference": 32.17,
    "confidence": 100,
    "matchedTo": "Bank UTR 901913",
    "settleDate": "2026-07-06",
    "orderDate": "2026-07-04",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 3217.49,
    "mdrFee": 64.35,
    "gstOnMdr": 11.58,
    "tdsAmount": 32.17,
    "expectedNet": 3141.56,
    "actualBank": 3109.39,
    "settlementId": "stl_QZKLIEYG",
    "paymentId": "pay_WONDORQTVN",
    "bankUtr": "UTR7316901913",
    "settlementRow": "#21",
    "ledgerEntry": "INV #10020",
    "alertSummary": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b932.17). Expected payout was \u20b93,141.56, and bank deposit received was \u20b93,109.39.",
    "reasoning": [
      "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b932.17). Expected payout was \u20b93,141.56, and bank deposit received was \u20b93,109.39."
    ],
    "fullExplanation": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b932.17). Expected payout was \u20b93,141.56, and bank deposit received was \u20b93,109.39.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-04 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-06 02:30 PM",
        "text": "Settlement processed under stl_QZKLIEYG",
        "type": "info"
      },
      {
        "time": "2026-07-06 05:00 PM",
        "text": "Bank deposit verified via UTR7316901913",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (TAX_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1018",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "FEE_DEDUCTION",
    "difference": 124.76,
    "confidence": 100,
    "matchedTo": "Bank UTR 288497",
    "settleDate": "2026-07-06",
    "orderDate": "2026-07-04",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 5286.71,
    "mdrFee": 105.73,
    "gstOnMdr": 19.03,
    "tdsAmount": 52.87,
    "expectedNet": 5233.84,
    "actualBank": 5109.08,
    "settlementId": "stl_JOKHGJQT",
    "paymentId": "pay_LSFWOCHJSU",
    "bankUtr": "UTR6934288497",
    "settlementRow": "#22",
    "ledgerEntry": "INV #10021",
    "alertSummary": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9105.73) and GST on MDR (18% = \u20b919.03) totaling \u20b9124.76. Bank credit of \u20b95,109.08 matches net payout.",
    "reasoning": [
      "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9105.73) and GST on MDR (18% = \u20b919.03) totaling \u20b9124.76. Bank credit of \u20b95,109.08 matches net payout."
    ],
    "fullExplanation": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9105.73) and GST on MDR (18% = \u20b919.03) totaling \u20b9124.76. Bank credit of \u20b95,109.08 matches net payout.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-04 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-06 02:30 PM",
        "text": "Settlement processed under stl_JOKHGJQT",
        "type": "info"
      },
      {
        "time": "2026-07-06 05:00 PM",
        "text": "Bank deposit verified via UTR6934288497",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (FEE_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1005",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 095461",
    "settleDate": "2026-07-07",
    "orderDate": "2026-07-05",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 3849.45,
    "mdrFee": 76.99,
    "gstOnMdr": 13.86,
    "tdsAmount": 38.49,
    "expectedNet": 3720.11,
    "actualBank": 3720.11,
    "settlementId": "stl_NLZMPKGC",
    "paymentId": "pay_HZANARZLTB",
    "bankUtr": "UTR2374095461",
    "settlementRow": "#23",
    "ledgerEntry": "INV #10022",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b93,849.45 less MDR fee (\u20b976.99), GST (\u20b913.86), and TDS (\u20b938.49) perfectly matches bank deposit of \u20b93,720.11 under UTR UTR2374095461 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b93,849.45 less MDR fee (\u20b976.99), GST (\u20b913.86), and TDS (\u20b938.49) perfectly matches bank deposit of \u20b93,720.11 under UTR UTR2374095461 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b93,849.45 less MDR fee (\u20b976.99), GST (\u20b913.86), and TDS (\u20b938.49) perfectly matches bank deposit of \u20b93,720.11 under UTR UTR2374095461 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-05 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-07 02:30 PM",
        "text": "Settlement processed under stl_NLZMPKGC",
        "type": "info"
      },
      {
        "time": "2026-07-07 05:00 PM",
        "text": "Bank deposit verified via UTR2374095461",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1023",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "TAX_DEDUCTION",
    "difference": 47.78,
    "confidence": 100,
    "matchedTo": "Bank UTR 008989",
    "settleDate": "2026-07-21",
    "orderDate": "2026-07-19",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 4778.12,
    "mdrFee": 95.56,
    "gstOnMdr": 17.2,
    "tdsAmount": 47.78,
    "expectedNet": 4665.36,
    "actualBank": 4617.58,
    "settlementId": "stl_XHTGOWVG",
    "paymentId": "pay_ZORZBGMKRW",
    "bankUtr": "UTR3171008989",
    "settlementRow": "#24",
    "ledgerEntry": "INV #10023",
    "alertSummary": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b947.78). Expected payout was \u20b94,665.36, and bank deposit received was \u20b94,617.58.",
    "reasoning": [
      "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b947.78). Expected payout was \u20b94,665.36, and bank deposit received was \u20b94,617.58."
    ],
    "fullExplanation": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b947.78). Expected payout was \u20b94,665.36, and bank deposit received was \u20b94,617.58.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-19 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-21 02:30 PM",
        "text": "Settlement processed under stl_XHTGOWVG",
        "type": "info"
      },
      {
        "time": "2026-07-21 05:00 PM",
        "text": "Bank deposit verified via UTR3171008989",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (TAX_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1054",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "UNEXPLAINED",
    "difference": 373.26,
    "confidence": 70,
    "matchedTo": "Bank UTR 913173",
    "settleDate": "2026-07-18",
    "orderDate": "2026-07-16",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 4539.25,
    "mdrFee": 90.78,
    "gstOnMdr": 16.34,
    "tdsAmount": 45.39,
    "expectedNet": 4386.74,
    "actualBank": 4013.48,
    "settlementId": "stl_BUDSUNBU",
    "paymentId": "pay_BHKHHVHHBA",
    "bankUtr": "UTR6954913173",
    "settlementRow": "#25",
    "ledgerEntry": "INV #10024",
    "alertSummary": "Unreconciled discrepancy of \u20b9373.26 on Gross \u20b94,539.25. Calculated standard fees (MDR \u20b990.78, GST \u20b916.34, TDS \u20b945.39) do not account for this gap.",
    "reasoning": [
      "Unreconciled discrepancy of \u20b9373.26 on Gross \u20b94,539.25. Calculated standard fees (MDR \u20b990.78, GST \u20b916.34, TDS \u20b945.39) do not account for this gap."
    ],
    "fullExplanation": "Unreconciled discrepancy of \u20b9373.26 on Gross \u20b94,539.25. Calculated standard fees (MDR \u20b990.78, GST \u20b916.34, TDS \u20b945.39) do not account for this gap.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b94,539.25, Expected Net: \u20b94,386.74, Actual Bank Credit: \u20b94,013.48."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b990.78) + GST 18% (\u20b916.34) + TDS 1% (\u20b945.39). Target Net: \u20b94,386.74."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 91.5%. Shortfall is \u20b9373.26 (Full tranche)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Unexplained variance requires human review."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Unexplained deduction of \u20b9373.26 flagged. Standard fee rates do not account for gap. Line-item annexure requested."
      }
    ],
    "history": [
      {
        "time": "2026-07-16 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-18 02:30 PM",
        "text": "Settlement processed under stl_BUDSUNBU",
        "type": "info"
      },
      {
        "time": "2026-07-18 05:00 PM",
        "text": "Bank deposit verified via UTR6954913173",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (UNEXPLAINED)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1047",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "PARTIAL_PAYMENT",
    "difference": 2144.51,
    "confidence": 90,
    "matchedTo": "Bank UTR 113021",
    "settleDate": "2026-07-05",
    "orderDate": "2026-07-03",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 4054.05,
    "mdrFee": 81.08,
    "gstOnMdr": 14.59,
    "tdsAmount": 40.54,
    "expectedNet": 3917.84,
    "actualBank": 1773.33,
    "settlementId": "stl_GIROTLLM",
    "paymentId": "pay_EUOVCYFGJN",
    "bankUtr": "UTR6079113021",
    "settlementRow": "#26",
    "ledgerEntry": "INV #10025",
    "alertSummary": "Partial tranche payout: Received \u20b91,773.33 (45.3%) against expected net of \u20b93,917.84. Unsettled balance of \u20b92,144.51 escalated for merchant support follow-up.",
    "reasoning": [
      "Partial tranche payout: Received \u20b91,773.33 (45.3%) against expected net of \u20b93,917.84. Unsettled balance of \u20b92,144.51 escalated for merchant support follow-up."
    ],
    "fullExplanation": "Partial tranche payout: Received \u20b91,773.33 (45.3%) against expected net of \u20b93,917.84. Unsettled balance of \u20b92,144.51 escalated for merchant support follow-up.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b94,054.05, Expected Net: \u20b93,917.84, Actual Bank Credit: \u20b91,773.33."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b981.08) + GST 18% (\u20b914.59) + TDS 1% (\u20b940.54). Target Net: \u20b93,917.84."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 45.3%. Shortfall is \u20b92,144.51 (Partial payout detected)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Partial tranches require active gateway representment."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Diagnosed incomplete payout. Shortfall of \u20b92,144.51 confirmed. Action drafted for Razorpay support."
      }
    ],
    "history": [
      {
        "time": "2026-07-03 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-05 02:30 PM",
        "text": "Settlement processed under stl_GIROTLLM",
        "type": "info"
      },
      {
        "time": "2026-07-05 05:00 PM",
        "text": "Bank deposit verified via UTR6079113021",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (PARTIAL_PAYMENT)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1009",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 785025",
    "settleDate": "2026-07-19",
    "orderDate": "2026-07-17",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 5173.46,
    "mdrFee": 103.47,
    "gstOnMdr": 18.62,
    "tdsAmount": 51.73,
    "expectedNet": 4999.64,
    "actualBank": 4999.64,
    "settlementId": "stl_BMOEEEUT",
    "paymentId": "pay_LILCBEWSTC",
    "bankUtr": "UTR5211785025",
    "settlementRow": "#27",
    "ledgerEntry": "INV #10026",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b95,173.46 less MDR fee (\u20b9103.47), GST (\u20b918.62), and TDS (\u20b951.73) perfectly matches bank deposit of \u20b94,999.64 under UTR UTR5211785025 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b95,173.46 less MDR fee (\u20b9103.47), GST (\u20b918.62), and TDS (\u20b951.73) perfectly matches bank deposit of \u20b94,999.64 under UTR UTR5211785025 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b95,173.46 less MDR fee (\u20b9103.47), GST (\u20b918.62), and TDS (\u20b951.73) perfectly matches bank deposit of \u20b94,999.64 under UTR UTR5211785025 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-17 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-19 02:30 PM",
        "text": "Settlement processed under stl_BMOEEEUT",
        "type": "info"
      },
      {
        "time": "2026-07-19 05:00 PM",
        "text": "Bank deposit verified via UTR5211785025",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1052",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "UNEXPLAINED",
    "difference": 98.44,
    "confidence": 70,
    "matchedTo": "Bank UTR 619625",
    "settleDate": "2026-07-17",
    "orderDate": "2026-07-15",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 1553.15,
    "mdrFee": 31.06,
    "gstOnMdr": 5.59,
    "tdsAmount": 15.53,
    "expectedNet": 1500.97,
    "actualBank": 1402.53,
    "settlementId": "stl_LOZWBKMA",
    "paymentId": "pay_LYQITWQVYN",
    "bankUtr": "UTR7028619625",
    "settlementRow": "#28",
    "ledgerEntry": "INV #10027",
    "alertSummary": "Unreconciled discrepancy of \u20b998.44 on Gross \u20b91,553.15. Calculated standard fees (MDR \u20b931.06, GST \u20b95.59, TDS \u20b915.53) do not account for this gap.",
    "reasoning": [
      "Unreconciled discrepancy of \u20b998.44 on Gross \u20b91,553.15. Calculated standard fees (MDR \u20b931.06, GST \u20b95.59, TDS \u20b915.53) do not account for this gap."
    ],
    "fullExplanation": "Unreconciled discrepancy of \u20b998.44 on Gross \u20b91,553.15. Calculated standard fees (MDR \u20b931.06, GST \u20b95.59, TDS \u20b915.53) do not account for this gap.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b91,553.15, Expected Net: \u20b91,500.97, Actual Bank Credit: \u20b91,402.53."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b931.06) + GST 18% (\u20b95.59) + TDS 1% (\u20b915.53). Target Net: \u20b91,500.97."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 93.4%. Shortfall is \u20b998.44 (Full tranche)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Unexplained variance requires human review."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Unexplained deduction of \u20b998.44 flagged. Standard fee rates do not account for gap. Line-item annexure requested."
      }
    ],
    "history": [
      {
        "time": "2026-07-15 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-17 02:30 PM",
        "text": "Settlement processed under stl_LOZWBKMA",
        "type": "info"
      },
      {
        "time": "2026-07-17 05:00 PM",
        "text": "Bank deposit verified via UTR7028619625",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (UNEXPLAINED)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1038",
    "status": "HOLD",
    "decision": "HOLD",
    "category": "TIMING_DELAY",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 857655",
    "settleDate": "2026-07-17",
    "orderDate": "2026-07-12",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 782.2,
    "mdrFee": 15.64,
    "gstOnMdr": 2.82,
    "tdsAmount": 7.82,
    "expectedNet": 755.92,
    "actualBank": 755.92,
    "settlementId": "stl_UFBOPJGV",
    "paymentId": "pay_ITYIFVFRVG",
    "bankUtr": "UTR6337857655",
    "settlementRow": "#29",
    "ledgerEntry": "INV #10028",
    "alertSummary": "Soft settlement delay: Funds arrived on T+5 days (expected T+2). Disbursed amount of \u20b9755.92 matches invoice net perfectly; held pending cycle verification.",
    "reasoning": [
      "Soft settlement delay: Funds arrived on T+5 days (expected T+2). Disbursed amount of \u20b9755.92 matches invoice net perfectly; held pending cycle verification."
    ],
    "fullExplanation": "Soft settlement delay: Funds arrived on T+5 days (expected T+2). Disbursed amount of \u20b9755.92 matches invoice net perfectly; held pending cycle verification.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-12 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-17 02:30 PM",
        "text": "Settlement processed under stl_UFBOPJGV",
        "type": "info"
      },
      {
        "time": "2026-07-17 05:00 PM",
        "text": "Bank deposit verified via UTR6337857655",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as HOLD (TIMING_DELAY)",
        "type": "hold"
      }
    ]
  },
  {
    "orderId": "ORD1025",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "TAX_DEDUCTION",
    "difference": 17.84,
    "confidence": 100,
    "matchedTo": "Bank UTR 993895",
    "settleDate": "2026-07-13",
    "orderDate": "2026-07-11",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 1784.3,
    "mdrFee": 35.69,
    "gstOnMdr": 6.42,
    "tdsAmount": 17.84,
    "expectedNet": 1742.19,
    "actualBank": 1724.35,
    "settlementId": "stl_VXZMMKGG",
    "paymentId": "pay_XAOSCMLADX",
    "bankUtr": "UTR0516993895",
    "settlementRow": "#30",
    "ledgerEntry": "INV #10029",
    "alertSummary": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b917.84). Expected payout was \u20b91,742.19, and bank deposit received was \u20b91,724.35.",
    "reasoning": [
      "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b917.84). Expected payout was \u20b91,742.19, and bank deposit received was \u20b91,724.35."
    ],
    "fullExplanation": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b917.84). Expected payout was \u20b91,742.19, and bank deposit received was \u20b91,724.35.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-11 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-13 02:30 PM",
        "text": "Settlement processed under stl_VXZMMKGG",
        "type": "info"
      },
      {
        "time": "2026-07-13 05:00 PM",
        "text": "Bank deposit verified via UTR0516993895",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (TAX_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1014",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "FEE_DEDUCTION",
    "difference": 144.69,
    "confidence": 100,
    "matchedTo": "Bank UTR 851337",
    "settleDate": "2026-07-17",
    "orderDate": "2026-07-15",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 6130.82,
    "mdrFee": 122.62,
    "gstOnMdr": 22.07,
    "tdsAmount": 61.31,
    "expectedNet": 6069.51,
    "actualBank": 5924.82,
    "settlementId": "stl_MBXRPXJY",
    "paymentId": "pay_WTPYKBPIZD",
    "bankUtr": "UTR0171851337",
    "settlementRow": "#31",
    "ledgerEntry": "INV #10030",
    "alertSummary": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9122.62) and GST on MDR (18% = \u20b922.07) totaling \u20b9144.69. Bank credit of \u20b95,924.82 matches net payout.",
    "reasoning": [
      "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9122.62) and GST on MDR (18% = \u20b922.07) totaling \u20b9144.69. Bank credit of \u20b95,924.82 matches net payout."
    ],
    "fullExplanation": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9122.62) and GST on MDR (18% = \u20b922.07) totaling \u20b9144.69. Bank credit of \u20b95,924.82 matches net payout.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-15 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-17 02:30 PM",
        "text": "Settlement processed under stl_MBXRPXJY",
        "type": "info"
      },
      {
        "time": "2026-07-17 05:00 PM",
        "text": "Bank deposit verified via UTR0171851337",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (FEE_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1028",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "TAX_DEDUCTION",
    "difference": 15.39,
    "confidence": 100,
    "matchedTo": "Bank UTR 718906",
    "settleDate": "2026-07-18",
    "orderDate": "2026-07-16",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 1539.04,
    "mdrFee": 30.78,
    "gstOnMdr": 5.54,
    "tdsAmount": 15.39,
    "expectedNet": 1502.72,
    "actualBank": 1487.33,
    "settlementId": "stl_GQQRVJIG",
    "paymentId": "pay_QCZGDWMPYA",
    "bankUtr": "UTR6891718906",
    "settlementRow": "#32",
    "ledgerEntry": "INV #10031",
    "alertSummary": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b915.39). Expected payout was \u20b91,502.72, and bank deposit received was \u20b91,487.33.",
    "reasoning": [
      "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b915.39). Expected payout was \u20b91,502.72, and bank deposit received was \u20b91,487.33."
    ],
    "fullExplanation": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b915.39). Expected payout was \u20b91,502.72, and bank deposit received was \u20b91,487.33.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-16 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-18 02:30 PM",
        "text": "Settlement processed under stl_GQQRVJIG",
        "type": "info"
      },
      {
        "time": "2026-07-18 05:00 PM",
        "text": "Bank deposit verified via UTR6891718906",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (TAX_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1041",
    "status": "HOLD",
    "decision": "HOLD",
    "category": "TIMING_DELAY",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 887476",
    "settleDate": "2026-07-28",
    "orderDate": "2026-07-20",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 5514.65,
    "mdrFee": 110.29,
    "gstOnMdr": 19.85,
    "tdsAmount": 55.15,
    "expectedNet": 5329.36,
    "actualBank": 5329.36,
    "settlementId": "stl_MTEMGOCL",
    "paymentId": "pay_ZCUGMLWNLP",
    "bankUtr": "UTR4624887476",
    "settlementRow": "#33",
    "ledgerEntry": "INV #10032",
    "alertSummary": "Extended settlement delay: Funds arrived on T+8 days (expected T+2). Disbursed amount of \u20b95,329.36 matches invoice net perfectly; held pending cycle verification.",
    "reasoning": [
      "Extended settlement delay: Funds arrived on T+8 days (expected T+2). Disbursed amount of \u20b95,329.36 matches invoice net perfectly; held pending cycle verification."
    ],
    "fullExplanation": "Extended settlement delay: Funds arrived on T+8 days (expected T+2). Disbursed amount of \u20b95,329.36 matches invoice net perfectly; held pending cycle verification.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-20 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-28 02:30 PM",
        "text": "Settlement processed under stl_MTEMGOCL",
        "type": "info"
      },
      {
        "time": "2026-07-28 05:00 PM",
        "text": "Bank deposit verified via UTR4624887476",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as HOLD (TIMING_DELAY)",
        "type": "hold"
      }
    ]
  },
  {
    "orderId": "ORD1017",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "FEE_DEDUCTION",
    "difference": 114.68,
    "confidence": 100,
    "matchedTo": "Bank UTR 728877",
    "settleDate": "2026-07-03",
    "orderDate": "2026-07-01",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 4859.52,
    "mdrFee": 97.19,
    "gstOnMdr": 17.49,
    "tdsAmount": 48.6,
    "expectedNet": 4810.92,
    "actualBank": 4696.24,
    "settlementId": "stl_FBNZEBZC",
    "paymentId": "pay_WGFCCVJAXR",
    "bankUtr": "UTR2852728877",
    "settlementRow": "#34",
    "ledgerEntry": "INV #10033",
    "alertSummary": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b997.19) and GST on MDR (18% = \u20b917.49) totaling \u20b9114.68. Bank credit of \u20b94,696.24 matches net payout.",
    "reasoning": [
      "Ledger omitted payment gateway processing charges: MDR (2% = \u20b997.19) and GST on MDR (18% = \u20b917.49) totaling \u20b9114.68. Bank credit of \u20b94,696.24 matches net payout."
    ],
    "fullExplanation": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b997.19) and GST on MDR (18% = \u20b917.49) totaling \u20b9114.68. Bank credit of \u20b94,696.24 matches net payout.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-01 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-03 02:30 PM",
        "text": "Settlement processed under stl_FBNZEBZC",
        "type": "info"
      },
      {
        "time": "2026-07-03 05:00 PM",
        "text": "Bank deposit verified via UTR2852728877",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (FEE_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1056",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "EDGE_DELAYED_REFUND",
    "difference": 0.0,
    "confidence": 95,
    "matchedTo": "Bank UTR 304075",
    "settleDate": "2026-07-12",
    "orderDate": "2026-07-10",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 3670.06,
    "mdrFee": 73.4,
    "gstOnMdr": 13.21,
    "tdsAmount": 36.7,
    "expectedNet": 3546.75,
    "actualBank": 3546.75,
    "settlementId": "stl_TBULECCH",
    "paymentId": "pay_YIHIKDASPU",
    "bankUtr": "UTR6259304075",
    "settlementRow": "#35",
    "ledgerEntry": "INV #10034",
    "alertSummary": "Delayed customer refund: Primary settlement of \u20b93,546.75 was clean. A linked post-settlement refund adjustment debit was subsequently recorded in bank records.",
    "reasoning": [
      "Delayed customer refund: Primary settlement of \u20b93,546.75 was clean. A linked post-settlement refund adjustment debit was subsequently recorded in bank records."
    ],
    "fullExplanation": "Delayed customer refund: Primary settlement of \u20b93,546.75 was clean. A linked post-settlement refund adjustment debit was subsequently recorded in bank records.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-10 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-12 02:30 PM",
        "text": "Settlement processed under stl_TBULECCH",
        "type": "info"
      },
      {
        "time": "2026-07-12 05:00 PM",
        "text": "Bank deposit verified via UTR6259304075",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (EDGE_DELAYED_REFUND)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1026",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "TAX_DEDUCTION",
    "difference": 96.77,
    "confidence": 100,
    "matchedTo": "Bank UTR 154710",
    "settleDate": "2026-07-06",
    "orderDate": "2026-07-04",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 9676.69,
    "mdrFee": 193.53,
    "gstOnMdr": 34.84,
    "tdsAmount": 96.77,
    "expectedNet": 9448.32,
    "actualBank": 9351.55,
    "settlementId": "stl_IVISXXBW",
    "paymentId": "pay_ZWQRHVVXKZ",
    "bankUtr": "UTR2632154710",
    "settlementRow": "#36",
    "ledgerEntry": "INV #10035",
    "alertSummary": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b996.77). Expected payout was \u20b99,448.32, and bank deposit received was \u20b99,351.55.",
    "reasoning": [
      "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b996.77). Expected payout was \u20b99,448.32, and bank deposit received was \u20b99,351.55."
    ],
    "fullExplanation": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b996.77). Expected payout was \u20b99,448.32, and bank deposit received was \u20b99,351.55.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-04 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-06 02:30 PM",
        "text": "Settlement processed under stl_IVISXXBW",
        "type": "info"
      },
      {
        "time": "2026-07-06 05:00 PM",
        "text": "Bank deposit verified via UTR2632154710",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (TAX_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1021",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "FEE_DEDUCTION",
    "difference": 54.63,
    "confidence": 100,
    "matchedTo": "Bank UTR 838389",
    "settleDate": "2026-07-04",
    "orderDate": "2026-07-02",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 2314.76,
    "mdrFee": 46.3,
    "gstOnMdr": 8.33,
    "tdsAmount": 23.15,
    "expectedNet": 2291.61,
    "actualBank": 2236.98,
    "settlementId": "stl_SHBBYOAH",
    "paymentId": "pay_GFULHGNQTM",
    "bankUtr": "UTR9283838389",
    "settlementRow": "#37",
    "ledgerEntry": "INV #10036",
    "alertSummary": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b946.30) and GST on MDR (18% = \u20b98.33) totaling \u20b954.63. Bank credit of \u20b92,236.98 matches net payout.",
    "reasoning": [
      "Ledger omitted payment gateway processing charges: MDR (2% = \u20b946.30) and GST on MDR (18% = \u20b98.33) totaling \u20b954.63. Bank credit of \u20b92,236.98 matches net payout."
    ],
    "fullExplanation": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b946.30) and GST on MDR (18% = \u20b98.33) totaling \u20b954.63. Bank credit of \u20b92,236.98 matches net payout.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-02 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-04 02:30 PM",
        "text": "Settlement processed under stl_SHBBYOAH",
        "type": "info"
      },
      {
        "time": "2026-07-04 05:00 PM",
        "text": "Bank deposit verified via UTR9283838389",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (FEE_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1016",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "FEE_DEDUCTION",
    "difference": 153.79,
    "confidence": 100,
    "matchedTo": "Bank UTR 148540",
    "settleDate": "2026-07-13",
    "orderDate": "2026-07-11",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 6516.38,
    "mdrFee": 130.33,
    "gstOnMdr": 23.46,
    "tdsAmount": 65.16,
    "expectedNet": 6451.22,
    "actualBank": 6297.43,
    "settlementId": "stl_DUPNGUZP",
    "paymentId": "pay_MOAYJKPGYV",
    "bankUtr": "UTR1336148540",
    "settlementRow": "#38",
    "ledgerEntry": "INV #10037",
    "alertSummary": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9130.33) and GST on MDR (18% = \u20b923.46) totaling \u20b9153.79. Bank credit of \u20b96,297.43 matches net payout.",
    "reasoning": [
      "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9130.33) and GST on MDR (18% = \u20b923.46) totaling \u20b9153.79. Bank credit of \u20b96,297.43 matches net payout."
    ],
    "fullExplanation": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9130.33) and GST on MDR (18% = \u20b923.46) totaling \u20b9153.79. Bank credit of \u20b96,297.43 matches net payout.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-11 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-13 02:30 PM",
        "text": "Settlement processed under stl_DUPNGUZP",
        "type": "info"
      },
      {
        "time": "2026-07-13 05:00 PM",
        "text": "Bank deposit verified via UTR1336148540",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (FEE_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1032",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "ROUNDING",
    "difference": 3.96,
    "confidence": 85,
    "matchedTo": "Bank UTR 338300",
    "settleDate": "2026-07-21",
    "orderDate": "2026-07-19",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 501.65,
    "mdrFee": 10.03,
    "gstOnMdr": 1.81,
    "tdsAmount": 5.02,
    "expectedNet": 484.79,
    "actualBank": 480.83,
    "settlementId": "stl_WRRNRUKS",
    "paymentId": "pay_UIPEHGTYGN",
    "bankUtr": "UTR9343338300",
    "settlementRow": "#39",
    "ledgerEntry": "INV #10038",
    "alertSummary": "Gateway floating-point rounding variance of \u20b93.96 detected on Gross \u20b9501.65. Within automatic approval threshold (\u2264 \u20b95.00).",
    "reasoning": [
      "Gateway floating-point rounding variance of \u20b93.96 detected on Gross \u20b9501.65. Within automatic approval threshold (\u2264 \u20b95.00)."
    ],
    "fullExplanation": "Gateway floating-point rounding variance of \u20b93.96 detected on Gross \u20b9501.65. Within automatic approval threshold (\u2264 \u20b95.00).",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-19 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-21 02:30 PM",
        "text": "Settlement processed under stl_WRRNRUKS",
        "type": "info"
      },
      {
        "time": "2026-07-21 05:00 PM",
        "text": "Bank deposit verified via UTR9343338300",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (ROUNDING)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1029",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "TAX_DEDUCTION",
    "difference": 71.39,
    "confidence": 100,
    "matchedTo": "Bank UTR 844003",
    "settleDate": "2026-07-09",
    "orderDate": "2026-07-07",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 7138.7,
    "mdrFee": 142.77,
    "gstOnMdr": 25.7,
    "tdsAmount": 71.39,
    "expectedNet": 6970.23,
    "actualBank": 6898.84,
    "settlementId": "stl_FASHZMTX",
    "paymentId": "pay_KYEKFINMDB",
    "bankUtr": "UTR8474844003",
    "settlementRow": "#40",
    "ledgerEntry": "INV #10039",
    "alertSummary": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b971.39). Expected payout was \u20b96,970.23, and bank deposit received was \u20b96,898.84.",
    "reasoning": [
      "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b971.39). Expected payout was \u20b96,970.23, and bank deposit received was \u20b96,898.84."
    ],
    "fullExplanation": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b971.39). Expected payout was \u20b96,970.23, and bank deposit received was \u20b96,898.84.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-07 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-09 02:30 PM",
        "text": "Settlement processed under stl_FASHZMTX",
        "type": "info"
      },
      {
        "time": "2026-07-09 05:00 PM",
        "text": "Bank deposit verified via UTR8474844003",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (TAX_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1043",
    "status": "HOLD",
    "decision": "HOLD",
    "category": "TIMING_DELAY",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 221549",
    "settleDate": "2026-07-23",
    "orderDate": "2026-07-13",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 4340.96,
    "mdrFee": 86.82,
    "gstOnMdr": 15.63,
    "tdsAmount": 43.41,
    "expectedNet": 4195.1,
    "actualBank": 4195.1,
    "settlementId": "stl_OVNRHIDJ",
    "paymentId": "pay_KAKXUJQZHI",
    "bankUtr": "UTR9203221549",
    "settlementRow": "#41",
    "ledgerEntry": "INV #10040",
    "alertSummary": "Extended settlement delay: Funds arrived on T+10 days (expected T+2). Disbursed amount of \u20b94,195.10 matches invoice net perfectly; held pending cycle verification.",
    "reasoning": [
      "Extended settlement delay: Funds arrived on T+10 days (expected T+2). Disbursed amount of \u20b94,195.10 matches invoice net perfectly; held pending cycle verification."
    ],
    "fullExplanation": "Extended settlement delay: Funds arrived on T+10 days (expected T+2). Disbursed amount of \u20b94,195.10 matches invoice net perfectly; held pending cycle verification.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-13 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-23 02:30 PM",
        "text": "Settlement processed under stl_OVNRHIDJ",
        "type": "info"
      },
      {
        "time": "2026-07-23 05:00 PM",
        "text": "Bank deposit verified via UTR9203221549",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as HOLD (TIMING_DELAY)",
        "type": "hold"
      }
    ]
  },
  {
    "orderId": "ORD1022",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "FEE_DEDUCTION",
    "difference": 87.12,
    "confidence": 100,
    "matchedTo": "Bank UTR 166823",
    "settleDate": "2026-07-25",
    "orderDate": "2026-07-23",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 3691.44,
    "mdrFee": 73.83,
    "gstOnMdr": 13.29,
    "tdsAmount": 36.91,
    "expectedNet": 3654.53,
    "actualBank": 3567.41,
    "settlementId": "stl_UMNXMGIP",
    "paymentId": "pay_LIOVOZWLUM",
    "bankUtr": "UTR2146166823",
    "settlementRow": "#42",
    "ledgerEntry": "INV #10041",
    "alertSummary": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b973.83) and GST on MDR (18% = \u20b913.29) totaling \u20b987.12. Bank credit of \u20b93,567.41 matches net payout.",
    "reasoning": [
      "Ledger omitted payment gateway processing charges: MDR (2% = \u20b973.83) and GST on MDR (18% = \u20b913.29) totaling \u20b987.12. Bank credit of \u20b93,567.41 matches net payout."
    ],
    "fullExplanation": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b973.83) and GST on MDR (18% = \u20b913.29) totaling \u20b987.12. Bank credit of \u20b93,567.41 matches net payout.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-23 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-25 02:30 PM",
        "text": "Settlement processed under stl_UMNXMGIP",
        "type": "info"
      },
      {
        "time": "2026-07-25 05:00 PM",
        "text": "Bank deposit verified via UTR2146166823",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (FEE_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1049",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "PARTIAL_PAYMENT",
    "difference": 1243.44,
    "confidence": 90,
    "matchedTo": "Bank UTR 598829",
    "settleDate": "2026-07-09",
    "orderDate": "2026-07-07",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 3961.54,
    "mdrFee": 79.23,
    "gstOnMdr": 14.26,
    "tdsAmount": 39.62,
    "expectedNet": 3828.43,
    "actualBank": 2584.99,
    "settlementId": "stl_VYSGNTKQ",
    "paymentId": "pay_MVTPCGJYNG",
    "bankUtr": "UTR8483598829",
    "settlementRow": "#43",
    "ledgerEntry": "INV #10042",
    "alertSummary": "Partial tranche payout: Received \u20b92,584.99 (67.5%) against expected net of \u20b93,828.43. Unsettled balance of \u20b91,243.44 escalated for merchant support follow-up.",
    "reasoning": [
      "Partial tranche payout: Received \u20b92,584.99 (67.5%) against expected net of \u20b93,828.43. Unsettled balance of \u20b91,243.44 escalated for merchant support follow-up."
    ],
    "fullExplanation": "Partial tranche payout: Received \u20b92,584.99 (67.5%) against expected net of \u20b93,828.43. Unsettled balance of \u20b91,243.44 escalated for merchant support follow-up.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b93,961.54, Expected Net: \u20b93,828.43, Actual Bank Credit: \u20b92,584.99."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b979.23) + GST 18% (\u20b914.26) + TDS 1% (\u20b939.62). Target Net: \u20b93,828.43."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 67.5%. Shortfall is \u20b91,243.44 (Partial payout detected)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Partial tranches require active gateway representment."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Diagnosed incomplete payout. Shortfall of \u20b91,243.44 confirmed. Action drafted for Razorpay support."
      }
    ],
    "history": [
      {
        "time": "2026-07-07 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-09 02:30 PM",
        "text": "Settlement processed under stl_VYSGNTKQ",
        "type": "info"
      },
      {
        "time": "2026-07-09 05:00 PM",
        "text": "Bank deposit verified via UTR8483598829",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (PARTIAL_PAYMENT)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1011",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 542938",
    "settleDate": "2026-07-17",
    "orderDate": "2026-07-15",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 4997.14,
    "mdrFee": 99.94,
    "gstOnMdr": 17.99,
    "tdsAmount": 49.97,
    "expectedNet": 4829.24,
    "actualBank": 4829.24,
    "settlementId": "stl_FEBOSHFX",
    "paymentId": "pay_CDIFHWGBTM",
    "bankUtr": "UTR9740542938",
    "settlementRow": "#44",
    "ledgerEntry": "INV #10043",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b94,997.14 less MDR fee (\u20b999.94), GST (\u20b917.99), and TDS (\u20b949.97) perfectly matches bank deposit of \u20b94,829.24 under UTR UTR9740542938 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b94,997.14 less MDR fee (\u20b999.94), GST (\u20b917.99), and TDS (\u20b949.97) perfectly matches bank deposit of \u20b94,829.24 under UTR UTR9740542938 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b94,997.14 less MDR fee (\u20b999.94), GST (\u20b917.99), and TDS (\u20b949.97) perfectly matches bank deposit of \u20b94,829.24 under UTR UTR9740542938 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-15 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-17 02:30 PM",
        "text": "Settlement processed under stl_FEBOSHFX",
        "type": "info"
      },
      {
        "time": "2026-07-17 05:00 PM",
        "text": "Bank deposit verified via UTR9740542938",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1034",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "ROUNDING",
    "difference": 2.91,
    "confidence": 85,
    "matchedTo": "Bank UTR 265917",
    "settleDate": "2026-07-21",
    "orderDate": "2026-07-19",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 3985.43,
    "mdrFee": 79.71,
    "gstOnMdr": 14.35,
    "tdsAmount": 39.85,
    "expectedNet": 3851.52,
    "actualBank": 3848.61,
    "settlementId": "stl_VQYZJXJP",
    "paymentId": "pay_ZHCZNXXNCB",
    "bankUtr": "UTR9548265917",
    "settlementRow": "#45",
    "ledgerEntry": "INV #10044",
    "alertSummary": "Gateway floating-point rounding variance of \u20b92.91 detected on Gross \u20b93,985.43. Within automatic approval threshold (\u2264 \u20b95.00).",
    "reasoning": [
      "Gateway floating-point rounding variance of \u20b92.91 detected on Gross \u20b93,985.43. Within automatic approval threshold (\u2264 \u20b95.00)."
    ],
    "fullExplanation": "Gateway floating-point rounding variance of \u20b92.91 detected on Gross \u20b93,985.43. Within automatic approval threshold (\u2264 \u20b95.00).",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-19 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-21 02:30 PM",
        "text": "Settlement processed under stl_VQYZJXJP",
        "type": "info"
      },
      {
        "time": "2026-07-21 05:00 PM",
        "text": "Bank deposit verified via UTR9548265917",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (ROUNDING)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1013",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "FEE_DEDUCTION",
    "difference": 140.24,
    "confidence": 100,
    "matchedTo": "Bank UTR 049049",
    "settleDate": "2026-07-18",
    "orderDate": "2026-07-16",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 5942.48,
    "mdrFee": 118.85,
    "gstOnMdr": 21.39,
    "tdsAmount": 59.42,
    "expectedNet": 5883.06,
    "actualBank": 5742.82,
    "settlementId": "stl_AYOHFRUT",
    "paymentId": "pay_CTERKHCERN",
    "bankUtr": "UTR9751049049",
    "settlementRow": "#46",
    "ledgerEntry": "INV #10045",
    "alertSummary": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9118.85) and GST on MDR (18% = \u20b921.39) totaling \u20b9140.24. Bank credit of \u20b95,742.82 matches net payout.",
    "reasoning": [
      "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9118.85) and GST on MDR (18% = \u20b921.39) totaling \u20b9140.24. Bank credit of \u20b95,742.82 matches net payout."
    ],
    "fullExplanation": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b9118.85) and GST on MDR (18% = \u20b921.39) totaling \u20b9140.24. Bank credit of \u20b95,742.82 matches net payout.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-16 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-18 02:30 PM",
        "text": "Settlement processed under stl_AYOHFRUT",
        "type": "info"
      },
      {
        "time": "2026-07-18 05:00 PM",
        "text": "Bank deposit verified via UTR9751049049",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (FEE_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1040",
    "status": "HOLD",
    "decision": "HOLD",
    "category": "TIMING_DELAY",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 207097",
    "settleDate": "2026-07-14",
    "orderDate": "2026-07-06",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 5292.59,
    "mdrFee": 105.85,
    "gstOnMdr": 19.05,
    "tdsAmount": 52.93,
    "expectedNet": 5114.76,
    "actualBank": 5114.76,
    "settlementId": "stl_NYBHSRDE",
    "paymentId": "pay_AJPVKOYRKU",
    "bankUtr": "UTR4142207097",
    "settlementRow": "#47",
    "ledgerEntry": "INV #10046",
    "alertSummary": "Extended settlement delay: Funds arrived on T+8 days (expected T+2). Disbursed amount of \u20b95,114.76 matches invoice net perfectly; held pending cycle verification.",
    "reasoning": [
      "Extended settlement delay: Funds arrived on T+8 days (expected T+2). Disbursed amount of \u20b95,114.76 matches invoice net perfectly; held pending cycle verification."
    ],
    "fullExplanation": "Extended settlement delay: Funds arrived on T+8 days (expected T+2). Disbursed amount of \u20b95,114.76 matches invoice net perfectly; held pending cycle verification.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-06 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-14 02:30 PM",
        "text": "Settlement processed under stl_NYBHSRDE",
        "type": "info"
      },
      {
        "time": "2026-07-14 05:00 PM",
        "text": "Bank deposit verified via UTR4142207097",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as HOLD (TIMING_DELAY)",
        "type": "hold"
      }
    ]
  },
  {
    "orderId": "ORD1044",
    "status": "HOLD",
    "decision": "HOLD",
    "category": "TIMING_DELAY",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 868724",
    "settleDate": "2026-07-11",
    "orderDate": "2026-07-04",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 2933.72,
    "mdrFee": 58.67,
    "gstOnMdr": 10.56,
    "tdsAmount": 29.34,
    "expectedNet": 2835.15,
    "actualBank": 2835.15,
    "settlementId": "stl_GTBYMAMR",
    "paymentId": "pay_THGESDFVLI",
    "bankUtr": "UTR1730868724",
    "settlementRow": "#48",
    "ledgerEntry": "INV #10047",
    "alertSummary": "Extended settlement delay: Funds arrived on T+7 days (expected T+2). Disbursed amount of \u20b92,835.15 matches invoice net perfectly; held pending cycle verification.",
    "reasoning": [
      "Extended settlement delay: Funds arrived on T+7 days (expected T+2). Disbursed amount of \u20b92,835.15 matches invoice net perfectly; held pending cycle verification."
    ],
    "fullExplanation": "Extended settlement delay: Funds arrived on T+7 days (expected T+2). Disbursed amount of \u20b92,835.15 matches invoice net perfectly; held pending cycle verification.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-04 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-11 02:30 PM",
        "text": "Settlement processed under stl_GTBYMAMR",
        "type": "info"
      },
      {
        "time": "2026-07-11 05:00 PM",
        "text": "Bank deposit verified via UTR1730868724",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as HOLD (TIMING_DELAY)",
        "type": "hold"
      }
    ]
  },
  {
    "orderId": "ORD1019",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "FEE_DEDUCTION",
    "difference": 33.43,
    "confidence": 100,
    "matchedTo": "Bank UTR 766437",
    "settleDate": "2026-07-12",
    "orderDate": "2026-07-10",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 1416.33,
    "mdrFee": 28.33,
    "gstOnMdr": 5.1,
    "tdsAmount": 14.16,
    "expectedNet": 1402.17,
    "actualBank": 1368.74,
    "settlementId": "stl_CHZIZKHF",
    "paymentId": "pay_MAIHGAMYBI",
    "bankUtr": "UTR1218766437",
    "settlementRow": "#49",
    "ledgerEntry": "INV #10048",
    "alertSummary": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b928.33) and GST on MDR (18% = \u20b95.10) totaling \u20b933.43. Bank credit of \u20b91,368.74 matches net payout.",
    "reasoning": [
      "Ledger omitted payment gateway processing charges: MDR (2% = \u20b928.33) and GST on MDR (18% = \u20b95.10) totaling \u20b933.43. Bank credit of \u20b91,368.74 matches net payout."
    ],
    "fullExplanation": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b928.33) and GST on MDR (18% = \u20b95.10) totaling \u20b933.43. Bank credit of \u20b91,368.74 matches net payout.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-10 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-12 02:30 PM",
        "text": "Settlement processed under stl_CHZIZKHF",
        "type": "info"
      },
      {
        "time": "2026-07-12 05:00 PM",
        "text": "Bank deposit verified via UTR1218766437",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (FEE_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1048",
    "status": "ESCALATE",
    "decision": "ESCALATE",
    "category": "PARTIAL_PAYMENT",
    "difference": 1503.09,
    "confidence": 90,
    "matchedTo": "Bank UTR 398045",
    "settleDate": "2026-07-22",
    "orderDate": "2026-07-20",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 3598.77,
    "mdrFee": 71.98,
    "gstOnMdr": 12.96,
    "tdsAmount": 35.99,
    "expectedNet": 3477.84,
    "actualBank": 1974.75,
    "settlementId": "stl_XJSYEVAN",
    "paymentId": "pay_BAXEVBGIPN",
    "bankUtr": "UTR0695398045",
    "settlementRow": "#50",
    "ledgerEntry": "INV #10049",
    "alertSummary": "Partial tranche payout: Received \u20b91,974.75 (56.8%) against expected net of \u20b93,477.84. Unsettled balance of \u20b91,503.09 escalated for merchant support follow-up.",
    "reasoning": [
      "Partial tranche payout: Received \u20b91,974.75 (56.8%) against expected net of \u20b93,477.84. Unsettled balance of \u20b91,503.09 escalated for merchant support follow-up."
    ],
    "fullExplanation": "Partial tranche payout: Received \u20b91,974.75 (56.8%) against expected net of \u20b93,477.84. Unsettled balance of \u20b91,503.09 escalated for merchant support follow-up.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [
      {
        "step": "1. Source Verification",
        "detail": "Retrieved source records. Gross: \u20b93,598.77, Expected Net: \u20b93,477.84, Actual Bank Credit: \u20b91,974.75."
      },
      {
        "step": "2. Fee Recalculation",
        "detail": "Recalculated standard rates: MDR 2% (\u20b971.98) + GST 18% (\u20b912.96) + TDS 1% (\u20b935.99). Target Net: \u20b93,477.84."
      },
      {
        "step": "3. Timing & Date Window",
        "detail": "Settlement arrived on T+2 days (Normal window)."
      },
      {
        "step": "4. Partial Settlement Check",
        "detail": "Fulfillment ratio is 56.8%. Shortfall is \u20b91,503.09 (Partial payout detected)."
      },
      {
        "step": "5. Memory & Bank Narration Scan",
        "detail": "Bank scan: REFUND debit of \u20b9682.78. Memory: Partial tranches require active gateway representment."
      },
      {
        "step": "6. Auto-Investigation Outcome",
        "detail": "Diagnosed incomplete payout. Shortfall of \u20b91,503.09 confirmed. Action drafted for Razorpay support."
      }
    ],
    "history": [
      {
        "time": "2026-07-20 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-22 02:30 PM",
        "text": "Settlement processed under stl_XJSYEVAN",
        "type": "info"
      },
      {
        "time": "2026-07-22 05:00 PM",
        "text": "Bank deposit verified via UTR0695398045",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as ESCALATE (PARTIAL_PAYMENT)",
        "type": "escalate"
      }
    ]
  },
  {
    "orderId": "ORD1002",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 746814",
    "settleDate": "2026-07-21",
    "orderDate": "2026-07-19",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 3888.74,
    "mdrFee": 77.77,
    "gstOnMdr": 14.0,
    "tdsAmount": 38.89,
    "expectedNet": 3758.08,
    "actualBank": 3758.08,
    "settlementId": "stl_XDUCLMHO",
    "paymentId": "pay_NAHEDCMPMB",
    "bankUtr": "UTR4701746814",
    "settlementRow": "#51",
    "ledgerEntry": "INV #10050",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b93,888.74 less MDR fee (\u20b977.77), GST (\u20b914.00), and TDS (\u20b938.89) perfectly matches bank deposit of \u20b93,758.08 under UTR UTR4701746814 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b93,888.74 less MDR fee (\u20b977.77), GST (\u20b914.00), and TDS (\u20b938.89) perfectly matches bank deposit of \u20b93,758.08 under UTR UTR4701746814 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b93,888.74 less MDR fee (\u20b977.77), GST (\u20b914.00), and TDS (\u20b938.89) perfectly matches bank deposit of \u20b93,758.08 under UTR UTR4701746814 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-19 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-21 02:30 PM",
        "text": "Settlement processed under stl_XDUCLMHO",
        "type": "info"
      },
      {
        "time": "2026-07-21 05:00 PM",
        "text": "Bank deposit verified via UTR4701746814",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1033",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "ROUNDING",
    "difference": 0.58,
    "confidence": 85,
    "matchedTo": "Bank UTR 355721",
    "settleDate": "2026-07-08",
    "orderDate": "2026-07-06",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 3992.66,
    "mdrFee": 79.85,
    "gstOnMdr": 14.37,
    "tdsAmount": 39.93,
    "expectedNet": 3858.51,
    "actualBank": 3857.93,
    "settlementId": "stl_REWFRKJP",
    "paymentId": "pay_ARQBBNCGOI",
    "bankUtr": "UTR5775355721",
    "settlementRow": "#52",
    "ledgerEntry": "INV #10051",
    "alertSummary": "Gateway floating-point rounding variance of \u20b90.58 detected on Gross \u20b93,992.66. Within automatic approval threshold (\u2264 \u20b95.00).",
    "reasoning": [
      "Gateway floating-point rounding variance of \u20b90.58 detected on Gross \u20b93,992.66. Within automatic approval threshold (\u2264 \u20b95.00)."
    ],
    "fullExplanation": "Gateway floating-point rounding variance of \u20b90.58 detected on Gross \u20b93,992.66. Within automatic approval threshold (\u2264 \u20b95.00).",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-06 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-08 02:30 PM",
        "text": "Settlement processed under stl_REWFRKJP",
        "type": "info"
      },
      {
        "time": "2026-07-08 05:00 PM",
        "text": "Bank deposit verified via UTR5775355721",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (ROUNDING)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1015",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "FEE_DEDUCTION",
    "difference": 93.4,
    "confidence": 100,
    "matchedTo": "Bank UTR 166277",
    "settleDate": "2026-07-20",
    "orderDate": "2026-07-18",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 3957.62,
    "mdrFee": 79.15,
    "gstOnMdr": 14.25,
    "tdsAmount": 39.58,
    "expectedNet": 3918.04,
    "actualBank": 3824.64,
    "settlementId": "stl_ORXWISHG",
    "paymentId": "pay_QLTAWEITCL",
    "bankUtr": "UTR9263166277",
    "settlementRow": "#53",
    "ledgerEntry": "INV #10052",
    "alertSummary": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b979.15) and GST on MDR (18% = \u20b914.25) totaling \u20b993.40. Bank credit of \u20b93,824.64 matches net payout.",
    "reasoning": [
      "Ledger omitted payment gateway processing charges: MDR (2% = \u20b979.15) and GST on MDR (18% = \u20b914.25) totaling \u20b993.40. Bank credit of \u20b93,824.64 matches net payout."
    ],
    "fullExplanation": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b979.15) and GST on MDR (18% = \u20b914.25) totaling \u20b993.40. Bank credit of \u20b93,824.64 matches net payout.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-18 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-20 02:30 PM",
        "text": "Settlement processed under stl_ORXWISHG",
        "type": "info"
      },
      {
        "time": "2026-07-20 05:00 PM",
        "text": "Bank deposit verified via UTR9263166277",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (FEE_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1030",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "TAX_DEDUCTION",
    "difference": 55.8,
    "confidence": 100,
    "matchedTo": "Bank UTR 308172",
    "settleDate": "2026-07-07",
    "orderDate": "2026-07-05",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 5579.79,
    "mdrFee": 111.6,
    "gstOnMdr": 20.09,
    "tdsAmount": 55.8,
    "expectedNet": 5448.1,
    "actualBank": 5392.3,
    "settlementId": "stl_VZDLUUEZ",
    "paymentId": "pay_LCOKAWRYDU",
    "bankUtr": "UTR3674308172",
    "settlementRow": "#54",
    "ledgerEntry": "INV #10053",
    "alertSummary": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b955.80). Expected payout was \u20b95,448.10, and bank deposit received was \u20b95,392.30.",
    "reasoning": [
      "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b955.80). Expected payout was \u20b95,448.10, and bank deposit received was \u20b95,392.30."
    ],
    "fullExplanation": "Ledger omitted Section 194-O statutory TDS deduction (1% = \u20b955.80). Expected payout was \u20b95,448.10, and bank deposit received was \u20b95,392.30.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-05 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-07 02:30 PM",
        "text": "Settlement processed under stl_VZDLUUEZ",
        "type": "info"
      },
      {
        "time": "2026-07-07 05:00 PM",
        "text": "Bank deposit verified via UTR3674308172",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (TAX_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1003",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 666193",
    "settleDate": "2026-07-19",
    "orderDate": "2026-07-17",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 1884.95,
    "mdrFee": 37.7,
    "gstOnMdr": 6.79,
    "tdsAmount": 18.85,
    "expectedNet": 1821.61,
    "actualBank": 1821.61,
    "settlementId": "stl_ZGSYEBRA",
    "paymentId": "pay_UWOGSBEKXG",
    "bankUtr": "UTR3307666193",
    "settlementRow": "#55",
    "ledgerEntry": "INV #10054",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b91,884.95 less MDR fee (\u20b937.70), GST (\u20b96.79), and TDS (\u20b918.85) perfectly matches bank deposit of \u20b91,821.61 under UTR UTR3307666193 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b91,884.95 less MDR fee (\u20b937.70), GST (\u20b96.79), and TDS (\u20b918.85) perfectly matches bank deposit of \u20b91,821.61 under UTR UTR3307666193 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b91,884.95 less MDR fee (\u20b937.70), GST (\u20b96.79), and TDS (\u20b918.85) perfectly matches bank deposit of \u20b91,821.61 under UTR UTR3307666193 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-17 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-19 02:30 PM",
        "text": "Settlement processed under stl_ZGSYEBRA",
        "type": "info"
      },
      {
        "time": "2026-07-19 05:00 PM",
        "text": "Bank deposit verified via UTR3307666193",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1069",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 653282",
    "settleDate": "2026-07-05",
    "orderDate": "2026-07-03",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 2687.46,
    "mdrFee": 53.75,
    "gstOnMdr": 9.67,
    "tdsAmount": 26.87,
    "expectedNet": 2597.17,
    "actualBank": 2597.17,
    "settlementId": "stl_VKSLLDZN",
    "paymentId": "pay_NRGXDJUXXI",
    "bankUtr": "UTR6603653282",
    "settlementRow": "#56",
    "ledgerEntry": "INV #10055",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b92,597.17 (Gross \u20b92,687.46) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b92,597.17 (Gross \u20b92,687.46) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b92,597.17 (Gross \u20b92,687.46) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-03 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-05 02:30 PM",
        "text": "Settlement processed under stl_VKSLLDZN",
        "type": "info"
      },
      {
        "time": "2026-07-05 05:00 PM",
        "text": "Bank deposit verified via UTR6603653282",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1070",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 653282",
    "settleDate": "2026-07-05",
    "orderDate": "2026-07-03",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 2293.34,
    "mdrFee": 45.87,
    "gstOnMdr": 8.26,
    "tdsAmount": 22.93,
    "expectedNet": 2216.28,
    "actualBank": 2216.28,
    "settlementId": "stl_VKSLLDZN",
    "paymentId": "pay_FYUQXHQDTZ",
    "bankUtr": "UTR6603653282",
    "settlementRow": "#57",
    "ledgerEntry": "INV #10056",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b92,216.28 (Gross \u20b92,293.34) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b92,216.28 (Gross \u20b92,293.34) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b92,216.28 (Gross \u20b92,293.34) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-03 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-05 02:30 PM",
        "text": "Settlement processed under stl_VKSLLDZN",
        "type": "info"
      },
      {
        "time": "2026-07-05 05:00 PM",
        "text": "Bank deposit verified via UTR6603653282",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1072",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 653282",
    "settleDate": "2026-07-05",
    "orderDate": "2026-07-03",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 2311.1,
    "mdrFee": 46.22,
    "gstOnMdr": 8.32,
    "tdsAmount": 23.11,
    "expectedNet": 2233.45,
    "actualBank": 2233.45,
    "settlementId": "stl_VKSLLDZN",
    "paymentId": "pay_YJNRITCZIY",
    "bankUtr": "UTR6603653282",
    "settlementRow": "#58",
    "ledgerEntry": "INV #10057",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b92,233.45 (Gross \u20b92,311.10) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b92,233.45 (Gross \u20b92,311.10) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b92,233.45 (Gross \u20b92,311.10) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-03 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-05 02:30 PM",
        "text": "Settlement processed under stl_VKSLLDZN",
        "type": "info"
      },
      {
        "time": "2026-07-05 05:00 PM",
        "text": "Bank deposit verified via UTR6603653282",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1067",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 653282",
    "settleDate": "2026-07-05",
    "orderDate": "2026-07-03",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 2062.45,
    "mdrFee": 41.25,
    "gstOnMdr": 7.42,
    "tdsAmount": 20.62,
    "expectedNet": 1993.16,
    "actualBank": 1993.16,
    "settlementId": "stl_VKSLLDZN",
    "paymentId": "pay_ENZNMDWTEC",
    "bankUtr": "UTR6603653282",
    "settlementRow": "#59",
    "ledgerEntry": "INV #10058",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,993.16 (Gross \u20b92,062.45) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,993.16 (Gross \u20b92,062.45) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,993.16 (Gross \u20b92,062.45) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-03 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-05 02:30 PM",
        "text": "Settlement processed under stl_VKSLLDZN",
        "type": "info"
      },
      {
        "time": "2026-07-05 05:00 PM",
        "text": "Bank deposit verified via UTR6603653282",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1071",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 653282",
    "settleDate": "2026-07-05",
    "orderDate": "2026-07-03",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 1409.93,
    "mdrFee": 28.2,
    "gstOnMdr": 5.08,
    "tdsAmount": 14.1,
    "expectedNet": 1362.55,
    "actualBank": 1362.55,
    "settlementId": "stl_VKSLLDZN",
    "paymentId": "pay_ICNTABEISI",
    "bankUtr": "UTR6603653282",
    "settlementRow": "#60",
    "ledgerEntry": "INV #10059",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,362.55 (Gross \u20b91,409.93) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,362.55 (Gross \u20b91,409.93) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,362.55 (Gross \u20b91,409.93) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-03 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-05 02:30 PM",
        "text": "Settlement processed under stl_VKSLLDZN",
        "type": "info"
      },
      {
        "time": "2026-07-05 05:00 PM",
        "text": "Bank deposit verified via UTR6603653282",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1068",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 653282",
    "settleDate": "2026-07-05",
    "orderDate": "2026-07-03",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 2982.64,
    "mdrFee": 59.65,
    "gstOnMdr": 10.74,
    "tdsAmount": 29.83,
    "expectedNet": 2882.42,
    "actualBank": 2882.42,
    "settlementId": "stl_VKSLLDZN",
    "paymentId": "pay_AEDSRXRNBH",
    "bankUtr": "UTR6603653282",
    "settlementRow": "#61",
    "ledgerEntry": "INV #10060",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b92,882.42 (Gross \u20b92,982.64) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b92,882.42 (Gross \u20b92,982.64) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b92,882.42 (Gross \u20b92,982.64) was consolidated into batch UTR UTR6603653282 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-03 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-05 02:30 PM",
        "text": "Settlement processed under stl_VKSLLDZN",
        "type": "info"
      },
      {
        "time": "2026-07-05 05:00 PM",
        "text": "Bank deposit verified via UTR6603653282",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1075",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 416167",
    "settleDate": "2026-07-17",
    "orderDate": "2026-07-15",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 1807.25,
    "mdrFee": 36.15,
    "gstOnMdr": 6.51,
    "tdsAmount": 18.07,
    "expectedNet": 1746.52,
    "actualBank": 1746.52,
    "settlementId": "stl_WVTQQENJ",
    "paymentId": "pay_PHFVVBZJEL",
    "bankUtr": "UTR5153416167",
    "settlementRow": "#62",
    "ledgerEntry": "INV #10061",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,746.52 (Gross \u20b91,807.25) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,746.52 (Gross \u20b91,807.25) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,746.52 (Gross \u20b91,807.25) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-15 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-17 02:30 PM",
        "text": "Settlement processed under stl_WVTQQENJ",
        "type": "info"
      },
      {
        "time": "2026-07-17 05:00 PM",
        "text": "Bank deposit verified via UTR5153416167",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1077",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 416167",
    "settleDate": "2026-07-17",
    "orderDate": "2026-07-15",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 1737.78,
    "mdrFee": 34.76,
    "gstOnMdr": 6.26,
    "tdsAmount": 17.38,
    "expectedNet": 1679.38,
    "actualBank": 1679.38,
    "settlementId": "stl_WVTQQENJ",
    "paymentId": "pay_XKTQQLPEYN",
    "bankUtr": "UTR5153416167",
    "settlementRow": "#63",
    "ledgerEntry": "INV #10062",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,679.38 (Gross \u20b91,737.78) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,679.38 (Gross \u20b91,737.78) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,679.38 (Gross \u20b91,737.78) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-15 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-17 02:30 PM",
        "text": "Settlement processed under stl_WVTQQENJ",
        "type": "info"
      },
      {
        "time": "2026-07-17 05:00 PM",
        "text": "Bank deposit verified via UTR5153416167",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1076",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 416167",
    "settleDate": "2026-07-17",
    "orderDate": "2026-07-15",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 1748.61,
    "mdrFee": 34.97,
    "gstOnMdr": 6.29,
    "tdsAmount": 17.49,
    "expectedNet": 1689.86,
    "actualBank": 1689.86,
    "settlementId": "stl_WVTQQENJ",
    "paymentId": "pay_XEZRDYFLTE",
    "bankUtr": "UTR5153416167",
    "settlementRow": "#64",
    "ledgerEntry": "INV #10063",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,689.86 (Gross \u20b91,748.61) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,689.86 (Gross \u20b91,748.61) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,689.86 (Gross \u20b91,748.61) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-15 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-17 02:30 PM",
        "text": "Settlement processed under stl_WVTQQENJ",
        "type": "info"
      },
      {
        "time": "2026-07-17 05:00 PM",
        "text": "Bank deposit verified via UTR5153416167",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1074",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 416167",
    "settleDate": "2026-07-17",
    "orderDate": "2026-07-15",
    "merchant": "MERCH_GADGETBAY",
    "grossAmount": 1602.82,
    "mdrFee": 32.06,
    "gstOnMdr": 5.77,
    "tdsAmount": 16.03,
    "expectedNet": 1548.96,
    "actualBank": 1548.96,
    "settlementId": "stl_WVTQQENJ",
    "paymentId": "pay_DFYVSFTROK",
    "bankUtr": "UTR5153416167",
    "settlementRow": "#65",
    "ledgerEntry": "INV #10064",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,548.96 (Gross \u20b91,602.82) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,548.96 (Gross \u20b91,602.82) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,548.96 (Gross \u20b91,602.82) was consolidated into batch UTR UTR5153416167 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-15 10:00 AM",
        "text": "Order recorded in ledger (MERCH_GADGETBAY)",
        "type": "info"
      },
      {
        "time": "2026-07-17 02:30 PM",
        "text": "Settlement processed under stl_WVTQQENJ",
        "type": "info"
      },
      {
        "time": "2026-07-17 05:00 PM",
        "text": "Bank deposit verified via UTR5153416167",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1061",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 687401",
    "settleDate": "2026-07-18",
    "orderDate": "2026-07-16",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 1889.3,
    "mdrFee": 37.79,
    "gstOnMdr": 6.8,
    "tdsAmount": 18.89,
    "expectedNet": 1825.82,
    "actualBank": 1825.82,
    "settlementId": "stl_MTDKCLUJ",
    "paymentId": "pay_HLKOILYUPN",
    "bankUtr": "UTR9097687401",
    "settlementRow": "#66",
    "ledgerEntry": "INV #10065",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,825.82 (Gross \u20b91,889.30) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,825.82 (Gross \u20b91,889.30) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,825.82 (Gross \u20b91,889.30) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-16 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-18 02:30 PM",
        "text": "Settlement processed under stl_MTDKCLUJ",
        "type": "info"
      },
      {
        "time": "2026-07-18 05:00 PM",
        "text": "Bank deposit verified via UTR9097687401",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1062",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 687401",
    "settleDate": "2026-07-18",
    "orderDate": "2026-07-16",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 2024.9,
    "mdrFee": 40.5,
    "gstOnMdr": 7.29,
    "tdsAmount": 20.25,
    "expectedNet": 1956.86,
    "actualBank": 1956.86,
    "settlementId": "stl_MTDKCLUJ",
    "paymentId": "pay_VHXQWLFFPG",
    "bankUtr": "UTR9097687401",
    "settlementRow": "#67",
    "ledgerEntry": "INV #10066",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,956.86 (Gross \u20b92,024.90) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,956.86 (Gross \u20b92,024.90) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,956.86 (Gross \u20b92,024.90) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-16 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-18 02:30 PM",
        "text": "Settlement processed under stl_MTDKCLUJ",
        "type": "info"
      },
      {
        "time": "2026-07-18 05:00 PM",
        "text": "Bank deposit verified via UTR9097687401",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1064",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 687401",
    "settleDate": "2026-07-18",
    "orderDate": "2026-07-16",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 1914.97,
    "mdrFee": 38.3,
    "gstOnMdr": 6.89,
    "tdsAmount": 19.15,
    "expectedNet": 1850.63,
    "actualBank": 1850.63,
    "settlementId": "stl_MTDKCLUJ",
    "paymentId": "pay_JVDHVCAPAH",
    "bankUtr": "UTR9097687401",
    "settlementRow": "#68",
    "ledgerEntry": "INV #10067",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,850.63 (Gross \u20b91,914.97) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,850.63 (Gross \u20b91,914.97) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,850.63 (Gross \u20b91,914.97) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-16 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-18 02:30 PM",
        "text": "Settlement processed under stl_MTDKCLUJ",
        "type": "info"
      },
      {
        "time": "2026-07-18 05:00 PM",
        "text": "Bank deposit verified via UTR9097687401",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1065",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 687401",
    "settleDate": "2026-07-18",
    "orderDate": "2026-07-16",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 1983.05,
    "mdrFee": 39.66,
    "gstOnMdr": 7.14,
    "tdsAmount": 19.83,
    "expectedNet": 1916.42,
    "actualBank": 1916.42,
    "settlementId": "stl_MTDKCLUJ",
    "paymentId": "pay_CRTWUNOSQH",
    "bankUtr": "UTR9097687401",
    "settlementRow": "#69",
    "ledgerEntry": "INV #10068",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,916.42 (Gross \u20b91,983.05) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,916.42 (Gross \u20b91,983.05) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,916.42 (Gross \u20b91,983.05) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-16 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-18 02:30 PM",
        "text": "Settlement processed under stl_MTDKCLUJ",
        "type": "info"
      },
      {
        "time": "2026-07-18 05:00 PM",
        "text": "Bank deposit verified via UTR9097687401",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1063",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "LUMPED_BATCH_MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 687401",
    "settleDate": "2026-07-18",
    "orderDate": "2026-07-16",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 1394.07,
    "mdrFee": 27.88,
    "gstOnMdr": 5.02,
    "tdsAmount": 13.94,
    "expectedNet": 1347.23,
    "actualBank": 1347.23,
    "settlementId": "stl_MTDKCLUJ",
    "paymentId": "pay_MYDDUADXSN",
    "bankUtr": "UTR9097687401",
    "settlementRow": "#70",
    "ledgerEntry": "INV #10069",
    "alertSummary": "Lumped settlement match: Order's net share of \u20b91,347.23 (Gross \u20b91,394.07) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit.",
    "reasoning": [
      "Lumped settlement match: Order's net share of \u20b91,347.23 (Gross \u20b91,394.07) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit."
    ],
    "fullExplanation": "Lumped settlement match: Order's net share of \u20b91,347.23 (Gross \u20b91,394.07) was consolidated into batch UTR UTR9097687401 and fully reconciled against shared bank deposit.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-16 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-18 02:30 PM",
        "text": "Settlement processed under stl_MTDKCLUJ",
        "type": "info"
      },
      {
        "time": "2026-07-18 05:00 PM",
        "text": "Bank deposit verified via UTR9097687401",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (LUMPED_BATCH_MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1058",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "EDGE_SPLIT_SETTLEMENT",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 009948",
    "settleDate": "2026-07-13",
    "orderDate": "2026-07-11",
    "merchant": "MERCH_FRESHCART",
    "grossAmount": 7966.33,
    "mdrFee": 159.33,
    "gstOnMdr": 28.68,
    "tdsAmount": 79.66,
    "expectedNet": 7698.66,
    "actualBank": 7698.66,
    "settlementId": "stl_ORIOQFDE",
    "paymentId": "pay_ZQHHLHOTLQ",
    "bankUtr": "UTR7818009948",
    "settlementRow": "#71",
    "ledgerEntry": "INV #10070",
    "alertSummary": "Split settlement transfer: Total payout of \u20b97,698.66 was disbursed across multiple tranches and successfully matched to the single order invoice of \u20b97,966.33.",
    "reasoning": [
      "Split settlement transfer: Total payout of \u20b97,698.66 was disbursed across multiple tranches and successfully matched to the single order invoice of \u20b97,966.33."
    ],
    "fullExplanation": "Split settlement transfer: Total payout of \u20b97,698.66 was disbursed across multiple tranches and successfully matched to the single order invoice of \u20b97,966.33.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-11 10:00 AM",
        "text": "Order recorded in ledger (MERCH_FRESHCART)",
        "type": "info"
      },
      {
        "time": "2026-07-13 02:30 PM",
        "text": "Settlement processed under stl_ORIOQFDE",
        "type": "info"
      },
      {
        "time": "2026-07-13 05:00 PM",
        "text": "Bank deposit verified via UTR7818009948",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (EDGE_SPLIT_SETTLEMENT)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1020",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "FEE_DEDUCTION",
    "difference": 25.2,
    "confidence": 100,
    "matchedTo": "Bank UTR 455397",
    "settleDate": "2026-07-03",
    "orderDate": "2026-07-01",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 1068.03,
    "mdrFee": 21.36,
    "gstOnMdr": 3.84,
    "tdsAmount": 10.68,
    "expectedNet": 1057.35,
    "actualBank": 1032.15,
    "settlementId": "stl_NBQISXBC",
    "paymentId": "pay_FIVBEHUGMA",
    "bankUtr": "UTR3230455397",
    "settlementRow": "#72",
    "ledgerEntry": "INV #10071",
    "alertSummary": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b921.36) and GST on MDR (18% = \u20b93.84) totaling \u20b925.20. Bank credit of \u20b91,032.15 matches net payout.",
    "reasoning": [
      "Ledger omitted payment gateway processing charges: MDR (2% = \u20b921.36) and GST on MDR (18% = \u20b93.84) totaling \u20b925.20. Bank credit of \u20b91,032.15 matches net payout."
    ],
    "fullExplanation": "Ledger omitted payment gateway processing charges: MDR (2% = \u20b921.36) and GST on MDR (18% = \u20b93.84) totaling \u20b925.20. Bank credit of \u20b91,032.15 matches net payout.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-01 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-03 02:30 PM",
        "text": "Settlement processed under stl_NBQISXBC",
        "type": "info"
      },
      {
        "time": "2026-07-03 05:00 PM",
        "text": "Bank deposit verified via UTR3230455397",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (FEE_DEDUCTION)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1006",
    "status": "APPROVE",
    "decision": "APPROVE",
    "category": "MATCHED",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 933283",
    "settleDate": "2026-07-25",
    "orderDate": "2026-07-23",
    "merchant": "MERCH_URBANKART",
    "grossAmount": 4540.2,
    "mdrFee": 90.8,
    "gstOnMdr": 16.34,
    "tdsAmount": 45.4,
    "expectedNet": 4387.66,
    "actualBank": 4387.66,
    "settlementId": "stl_NDILEKIY",
    "paymentId": "pay_EFNLOPAMXX",
    "bankUtr": "UTR2243933283",
    "settlementRow": "#73",
    "ledgerEntry": "INV #10072",
    "alertSummary": "Clean 3-way reconciliation: Gross invoice \u20b94,540.20 less MDR fee (\u20b990.80), GST (\u20b916.34), and TDS (\u20b945.40) perfectly matches bank deposit of \u20b94,387.66 under UTR UTR2243933283 with zero discrepancy.",
    "reasoning": [
      "Clean 3-way reconciliation: Gross invoice \u20b94,540.20 less MDR fee (\u20b990.80), GST (\u20b916.34), and TDS (\u20b945.40) perfectly matches bank deposit of \u20b94,387.66 under UTR UTR2243933283 with zero discrepancy."
    ],
    "fullExplanation": "Clean 3-way reconciliation: Gross invoice \u20b94,540.20 less MDR fee (\u20b990.80), GST (\u20b916.34), and TDS (\u20b945.40) perfectly matches bank deposit of \u20b94,387.66 under UTR UTR2243933283 with zero discrepancy.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-23 10:00 AM",
        "text": "Order recorded in ledger (MERCH_URBANKART)",
        "type": "info"
      },
      {
        "time": "2026-07-25 02:30 PM",
        "text": "Settlement processed under stl_NDILEKIY",
        "type": "info"
      },
      {
        "time": "2026-07-25 05:00 PM",
        "text": "Bank deposit verified via UTR2243933283",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as APPROVE (MATCHED)",
        "type": "approve"
      }
    ]
  },
  {
    "orderId": "ORD1039",
    "status": "HOLD",
    "decision": "HOLD",
    "category": "TIMING_DELAY",
    "difference": 0.0,
    "confidence": 100,
    "matchedTo": "Bank UTR 085016",
    "settleDate": "2026-07-24",
    "orderDate": "2026-07-19",
    "merchant": "MERCH_STYLEHIVE",
    "grossAmount": 1374.27,
    "mdrFee": 27.49,
    "gstOnMdr": 4.95,
    "tdsAmount": 13.74,
    "expectedNet": 1328.09,
    "actualBank": 1328.09,
    "settlementId": "stl_TNCAWQWA",
    "paymentId": "pay_ZVRIFFIZUE",
    "bankUtr": "UTR6178085016",
    "settlementRow": "#74",
    "ledgerEntry": "INV #10073",
    "alertSummary": "Soft settlement delay: Funds arrived on T+5 days (expected T+2). Disbursed amount of \u20b91,328.09 matches invoice net perfectly; held pending cycle verification.",
    "reasoning": [
      "Soft settlement delay: Funds arrived on T+5 days (expected T+2). Disbursed amount of \u20b91,328.09 matches invoice net perfectly; held pending cycle verification."
    ],
    "fullExplanation": "Soft settlement delay: Funds arrived on T+5 days (expected T+2). Disbursed amount of \u20b91,328.09 matches invoice net perfectly; held pending cycle verification.",
    "firstSeen": "28 Aug 2026 10:32 AM",
    "resolved": false,
    "resolvedNote": null,
    "agentReasoningLog": [],
    "history": [
      {
        "time": "2026-07-19 10:00 AM",
        "text": "Order recorded in ledger (MERCH_STYLEHIVE)",
        "type": "info"
      },
      {
        "time": "2026-07-24 02:30 PM",
        "text": "Settlement processed under stl_TNCAWQWA",
        "type": "info"
      },
      {
        "time": "2026-07-24 05:00 PM",
        "text": "Bank deposit verified via UTR6178085016",
        "type": "success"
      },
      {
        "time": "Today",
        "text": "Classified as HOLD (TIMING_DELAY)",
        "type": "hold"
      }
    ]
  }
];

export const ALL_74_RECORDS = MOCK_ORDERS;

export const ASK_SUGGESTIONS = [
  "Why does settlement stl_MB99XX12 have a shortfall?",
  "Show all transactions with delay > 3 days",
  "Which merchant has the highest fee variance?",
  "What is our total cash at risk this week?",
  "List all orders in ESCALATE queue"
];

export const FINANCIAL_MEMORY_RULES = [
  {
    id: "RULE-01",
    name: "MDR Standard Deductions",
    category: "FEE_DEDUCTION",
    pattern_key: "FEE_DEDUCTION",
    confidence: 0.994,
    applied_count: 55,
    status: "Active",
    description: "Auto-clears merchant transactions where difference equals 2% MDR fee."
  },
  {
    id: "RULE-02",
    name: "GST on Merchant Fees",
    category: "TAX_DEDUCTION",
    pattern_key: "TAX_DEDUCTION",
    confidence: 0.998,
    applied_count: 48,
    status: "Active",
    description: "Applies 18% GST calculation on MDR fee deductions across payment gateway settlements."
  },
  {
    id: "RULE-03",
    name: "TDS Section 194-O Withholding",
    category: "TAX_DEDUCTION",
    pattern_key: "TAX_DEDUCTION",
    confidence: 0.995,
    applied_count: 42,
    status: "Active",
    description: "Validates 1% statutory TDS deductions under Section 194-O of the Income Tax Act."
  },
  {
    id: "RULE-04",
    name: "T+2 Settlement Latency",
    category: "TIMING_DELAY",
    pattern_key: "TIMING_DELAY",
    confidence: 0.982,
    applied_count: 8,
    status: "Active",
    description: "Puts on temporary HOLD transactions with clearance latency within ±3 business days."
  },
  {
    id: "RULE-05",
    name: "Post-Recon Chargeback Escalation",
    category: "EDGE_POST_RECON_CHARGEBACK",
    pattern_key: "EDGE_POST_RECON_CHARGEBACK",
    confidence: 0.965,
    applied_count: 11,
    status: "Active",
    description: "Immediately escalates customer chargebacks and missing bank deposits for human triage."
  }
];
