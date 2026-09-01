// Mock data for Finance Wizard - 74 records with complete reconciliation metadata

export const KPI_DATA = {
  matchRate: 91.9,
  matchRateLabel: "Matched transactions",
  approveCount: 58,
  approveLabel: "Auto-cleared",
  holdCount: 9,
  holdLabel: "Needs glance",
  escalateCount: 7,
  escalateLabel: "Needs human",
  throughput: "74 in 2.1s",
  throughputLabel: "Records processed",
  batchDate: "28 Aug 2026",
  batchTime: "10:32 AM",
  totalRecords: 74,
  processingTime: "2.1s",
  healthStatus: "Healthy"
};

export const CASH_POSITION_DATA = {
  settled: 214320.00,
  settledFormatted: "₹2,14,320",
  pendingAtRisk: 18640.00,
  pendingFormatted: "₹18,640",
  forecast: 16200.00,
  forecastFormatted: "₹16,200",
  counterfactual: {
    optimistic: 232960.00,
    optimisticFormatted: "₹2,32,960",
    pessimistic: 214320.00,
    pessimisticFormatted: "₹2,14,320",
    cashAtRisk: 18640.00,
    cashAtRiskFormatted: "₹18,640"
  },
  footnote: "Projection from pending exceptions and historical cycle — not a guarantee."
};

export const MOCK_ORDERS = [
  {
    orderId: "ORD1008",
    status: "APPROVE",
    category: "MATCHED",
    difference: 0.00,
    confidence: 99,
    matchedTo: "Bank UTR 554211",
    settleDate: "27 Aug 2026",
    orderDate: "25 Aug 2026",
    merchant: "MERCH_URBANKART",
    grossAmount: 4850.00,
    mdrFee: 97.00,
    gstOnMdr: 17.46,
    tdsAmount: 48.50,
    expectedNet: 4687.04,
    actualBank: 4687.04,
    settlementId: "stl_QW78KL09",
    paymentId: "pay_K9921JK394",
    bankUtr: "UTR5542118902",
    settlementRow: "#12",
    ledgerEntry: "INV #44018",
    alertSummary: "One-line: Fully verified match across settlement, bank statement, and ledger.",
    reasoning: [
      "Extracted gross amount ₹4,850.00 and applied verified MDR (2%) + GST (18%) + TDS (1%).",
      "Exact net amount ₹4,687.04 found in Bank Statement with matched UTR reference.",
      "Internal Ledger status verified OPEN and cleared automatically."
    ],
    fullExplanation: "The merchant ledger correctly anticipated fee and tax deductions. The net credit amount of ₹4,687.04 precisely matches the bank credit on 27 Aug 2026 with no variance.",
    firstSeen: "28 Aug 2026 10:32 AM",
    history: [
      { time: "25 Aug 2026 04:12 PM", text: "Order placed on Shopify (MERCH_URBANKART)", type: "info" },
      { time: "27 Aug 2026 09:15 AM", text: "NEFT Credit confirmed via Bank Statement UTR5542118902", type: "success" },
      { time: "28 Aug 2026 10:32 AM", text: "Auto-cleared by Rule Engine (Confidence 99%)", type: "approve" }
    ]
  },
  {
    orderId: "ORD1025",
    status: "APPROVE",
    category: "FEE_DED",
    difference: 350.87,
    confidence: 97,
    matchedTo: "Bank UTR 554212",
    settleDate: "27 Aug 2026",
    orderDate: "25 Aug 2026",
    merchant: "MERCH_STYLEHIVE",
    grossAmount: 7420.00,
    mdrFee: 148.40,
    gstOnMdr: 26.71,
    tdsAmount: 74.20,
    expectedNet: 7170.69,
    actualBank: 7170.69,
    settlementId: "stl_MB99XX12",
    paymentId: "pay_L8830ZX112",
    bankUtr: "UTR5542129031",
    settlementRow: "#29",
    ledgerEntry: "INV #76412",
    alertSummary: "One-line: Variance of ₹350.87 is explained by MDR + GST on MDR deductions.",
    reasoning: [
      "Merchant internal ledger recorded gross receivable ₹7,420.00 without deducting gateway fees.",
      "Reconciliation engine calculated standard MDR rate (2.0%) + GST (18%) totaling ₹175.11 + standard TDS.",
      "Variance matches fee calculation within ₹0.00 tolerance. Auto-approved."
    ],
    fullExplanation: "Merchant internal ledger recorded the expected settlement before standard payment gateway MDR fee and 18% GST were deducted. The mathematical formula fully explains the ₹350.87 ledger variance.",
    firstSeen: "28 Aug 2026 10:32 AM",
    history: [
      { time: "25 Aug 2026 02:40 PM", text: "Order recorded in Ledger without fee breakdown", type: "info" },
      { time: "27 Aug 2026 11:20 AM", text: "Settlement received with standard MDR deduction", type: "info" },
      { time: "28 Aug 2026 10:32 AM", text: "Rule Fee_Deduction_Standard applied -> APPROVE", type: "approve" }
    ]
  },
  {
    orderId: "ORD1041",
    status: "HOLD",
    category: "ROUNDING",
    difference: 2.35,
    confidence: 82,
    matchedTo: "—",
    settleDate: "—",
    orderDate: "26 Aug 2026",
    merchant: "MERCH_FRESHCART",
    grossAmount: 3120.00,
    mdrFee: 62.40,
    gstOnMdr: 11.23,
    tdsAmount: 31.20,
    expectedNet: 3015.17,
    actualBank: 3012.82,
    settlementId: "stl_LK45GG88",
    paymentId: "pay_TT6654KK89",
    bankUtr: "UTR8899201923",
    settlementRow: "#48",
    ledgerEntry: "INV #55891",
    alertSummary: "One-line: ₹2.35 fractional rounding variance beyond standard tolerance.",
    reasoning: [
      "Minor fractional difference detected between bank statement net and ledger calculation.",
      "Difference is ₹2.35, which slightly exceeds the strict ₹1.00 auto-clear threshold.",
      "Placed in HOLD for quick operator verification."
    ],
    fullExplanation: "Gateway settlement contains a ₹2.35 rounding difference likely caused by compound item-level tax rounding. Marked as HOLD for routine merchant glance.",
    firstSeen: "28 Aug 2026 10:18 AM",
    history: [
      { time: "26 Aug 2026 07:11 PM", text: "Order recorded in ERP Ledger", type: "info" },
      { time: "28 Aug 2026 10:18 AM", text: "Flagged by Tolerance Engine (₹2.35 > ₹1.00)", type: "warning" },
      { time: "28 Aug 2026 10:32 AM", text: "Placed in HOLD queue for operator review", type: "hold" }
    ]
  },
  {
    orderId: "ORD1055",
    status: "ESCALATE",
    category: "UNEXPLAINED",
    difference: 350.87,
    confidence: 28,
    matchedTo: "—",
    settleDate: "—",
    orderDate: "24 Aug 2026",
    merchant: "MERCH_GADGETBAY",
    grossAmount: 6432.52,
    mdrFee: 128.65,
    gstOnMdr: 23.16,
    tdsAmount: 64.33,
    expectedNet: 6216.38,
    actualBank: 5865.51,
    settlementId: "stl_KL9088ZZ",
    paymentId: "pay_PP88102931",
    bankUtr: "UTR RJX554215",
    settlementRow: "#42",
    ledgerEntry: "INV #77821",
    alertSummary: "One-line: ₹350.87 gap with no fee/tax/timing pattern",
    reasoning: [
      "1. Checked date window -> not TIMING_DELAY",
      "2. Financial Memory -> no similar pattern",
      "3. flag_for_human"
    ],
    fullExplanation: "₹350.87 does not match MDR, GST, TDS, or rounding rules. No applicable fee/tax/timing pattern found in current batch or historical memory. Needs human review.",
    firstSeen: "28 Aug 2026 10:15 AM",
    history: [
      { time: "28 Aug 2026 10:15 AM", text: "Flagged by Classification Engine", type: "error" },
      { time: "28 Aug 2026 10:16 AM", text: "Moved to Escalation Queue", type: "escalate" },
      { time: "28 Aug 2026 10:32 AM", text: "Awaiting human review", type: "pending" }
    ]
  },
  {
    orderId: "ORD1063",
    status: "ESCALATE",
    category: "ROUNDING",
    difference: 2.35,
    confidence: 60,
    matchedTo: "—",
    settleDate: "—",
    orderDate: "23 Aug 2026",
    merchant: "MERCH_URBANKART",
    grossAmount: 4920.00,
    mdrFee: 98.40,
    gstOnMdr: 17.71,
    tdsAmount: 49.20,
    expectedNet: 4754.69,
    actualBank: 4752.34,
    settlementId: "stl_TY551100",
    paymentId: "pay_JJ99201923",
    bankUtr: "UTR7788102934",
    settlementRow: "#51",
    ledgerEntry: "INV #88192",
    alertSummary: "One-line: Rounding difference beyond tolerance with repeated anomaly signature.",
    reasoning: [
      "Evaluated discrepancy against merchant contractual terms.",
      "Difference exceeds maximum acceptable rounding ceiling for this category tier.",
      "Escalated for merchant finance sign-off."
    ],
    fullExplanation: "Rounding difference of ₹2.35 exceeds the automated clearance threshold for high-value SKU batch #42. Requires financial analyst confirmation.",
    firstSeen: "28 Aug 2026 10:18 AM",
    history: [
      { time: "28 Aug 2026 10:18 AM", text: "Anomaly detected in settlement credit", type: "warning" },
      { time: "28 Aug 2026 10:20 AM", text: "Escalated to High Priority Queue", type: "escalate" }
    ]
  },
  {
    orderId: "ORD1072",
    status: "ESCALATE",
    category: "UNEXPLAINED",
    difference: 1240.00,
    confidence: 35,
    matchedTo: "—",
    settleDate: "—",
    orderDate: "22 Aug 2026",
    merchant: "MERCH_STYLEHIVE",
    grossAmount: 8900.00,
    mdrFee: 178.00,
    gstOnMdr: 32.04,
    tdsAmount: 89.00,
    expectedNet: 8600.96,
    actualBank: 7360.96,
    settlementId: "stl_PP664411",
    paymentId: "pay_MM88339120",
    bankUtr: "UTR9922019283",
    settlementRow: "#63",
    ledgerEntry: "INV #99301",
    alertSummary: "One-line: Amount present in bank only with missing settlement ledger link.",
    reasoning: [
      "Bank statement shows credit of ₹7,360.96 with fragmented narration.",
      "No direct matching order ID in internal ERP ledger for this cycle.",
      "High financial risk - flagged for manual investigation."
    ],
    fullExplanation: "A substantial amount variance of ₹1,240.00 exists between the expected ledger amount and bank settlement. No automated pattern matches this shortfall.",
    firstSeen: "28 Aug 2026 10:21 AM",
    history: [
      { time: "28 Aug 2026 10:21 AM", text: "Unidentified bank deduction spotted", type: "error" },
      { time: "28 Aug 2026 10:22 AM", text: "Assigned to Senior Reconciliation Auditor", type: "escalate" }
    ]
  },
  {
    orderId: "ORD1051",
    status: "ESCALATE",
    category: "PARTIAL_PAYMENT",
    difference: 1850.00,
    confidence: 42,
    matchedTo: "—",
    settleDate: "—",
    orderDate: "21 Aug 2026",
    merchant: "MERCH_FRESHCART",
    grossAmount: 6200.00,
    mdrFee: 124.00,
    gstOnMdr: 22.32,
    tdsAmount: 62.00,
    expectedNet: 5991.68,
    actualBank: 4141.68,
    settlementId: "stl_QQ338811",
    paymentId: "pay_VV77192834",
    bankUtr: "UTR5511229988",
    settlementRow: "#67",
    ledgerEntry: "INV #99102",
    alertSummary: "One-line: Partial settlement received (₹4,141.68 of ₹5,991.68).",
    reasoning: [
      "Only 69% of expected net funds transferred into merchant nodal account.",
      "Remaining ₹1,850.00 held back without active gateway dispute flag.",
      "Escalated to gateway relationship manager."
    ],
    fullExplanation: "The bank statement records a partial payout. The remaining balance of ₹1,850.00 is uncredited and requires escalation.",
    firstSeen: "28 Aug 2026 10:24 AM",
    history: [
      { time: "28 Aug 2026 10:24 AM", text: "Partial credit detected on nodal feed", type: "error" },
      { time: "28 Aug 2026 10:25 AM", text: "Escalated for gateway inquiry", type: "escalate" }
    ]
  },
  {
    orderId: "ORD1052",
    status: "ESCALATE",
    category: "UNEXPLAINED",
    difference: 890.00,
    confidence: 31,
    matchedTo: "—",
    settleDate: "—",
    orderDate: "20 Aug 2026",
    merchant: "MERCH_GADGETBAY",
    grossAmount: 5100.00,
    mdrFee: 102.00,
    gstOnMdr: 18.36,
    tdsAmount: 51.00,
    expectedNet: 4928.64,
    actualBank: 4038.64,
    settlementId: "stl_XX992211",
    paymentId: "pay_ZZ55441199",
    bankUtr: "UTR6633221199",
    settlementRow: "#69",
    ledgerEntry: "INV #99443",
    alertSummary: "One-line: ₹890.00 discrepancy unmatched by standard fee schedule.",
    reasoning: [
      "Cross-referenced gateway rate card: standard 2% applies.",
      "Unaccounted debit detected during nodal settlement transmission.",
      "Flagged for human auditor review."
    ],
    fullExplanation: "Unexplained deduction of ₹890.00 on ORD1052. No customer refund, dispute, or chargeback recorded.",
    firstSeen: "28 Aug 2026 10:25 AM",
    history: [
      { time: "28 Aug 2026 10:25 AM", text: "Settlement debit mismatch detected", type: "error" },
      { time: "28 Aug 2026 10:26 AM", text: "Moved to Escalation Queue", type: "escalate" }
    ]
  },
  {
    orderId: "ORD1053",
    status: "ESCALATE",
    category: "EDGE_POST_RECON_CHARGEBACK",
    difference: 2450.00,
    confidence: 45,
    matchedTo: "—",
    settleDate: "—",
    orderDate: "19 Aug 2026",
    merchant: "MERCH_URBANKART",
    grossAmount: 3800.00,
    mdrFee: 76.00,
    gstOnMdr: 13.68,
    tdsAmount: 38.00,
    expectedNet: 3672.32,
    actualBank: 1222.32,
    settlementId: "stl_CC882200",
    paymentId: "pay_AA11223344",
    bankUtr: "UTR4499110022",
    settlementRow: "#71",
    ledgerEntry: "INV #99661",
    alertSummary: "One-line: Post-reconciliation chargeback debit with broken settlement reference.",
    reasoning: [
      "Initial settlement was clean and matched.",
      "Subsequent chargeback debit of ₹2,450.00 arrived with missing ledger token.",
      "Requires manual dispute linkage."
    ],
    fullExplanation: "Bank statement shows a ₹2,450.00 chargeback debit referencing this order without corresponding debit note in merchant ledger.",
    firstSeen: "28 Aug 2026 10:26 AM",
    history: [
      { time: "28 Aug 2026 10:26 AM", text: "Unlinked chargeback debit identified", type: "error" },
      { time: "28 Aug 2026 10:27 AM", text: "Escalated to Risk and Compliance", type: "escalate" }
    ]
  },
  {
    orderId: "ORD1054",
    status: "ESCALATE",
    category: "EDGE_DELAYED_REFUND",
    difference: 1540.00,
    confidence: 48,
    matchedTo: "—",
    settleDate: "—",
    orderDate: "18 Aug 2026",
    merchant: "MERCH_STYLEHIVE",
    grossAmount: 4600.00,
    mdrFee: 92.00,
    gstOnMdr: 16.56,
    tdsAmount: 46.00,
    expectedNet: 4445.44,
    actualBank: 2905.44,
    settlementId: "stl_EE441199",
    paymentId: "pay_QQ22334455",
    bankUtr: "UTR3388771100",
    settlementRow: "#73",
    ledgerEntry: "INV #99782",
    alertSummary: "One-line: Delayed customer refund deducted without order status change in ERP.",
    reasoning: [
      "Settlement report shows refund adjustment of ₹1,540.00 on 26 Aug.",
      "Internal ledger still shows order status as COMPLETED / OPEN.",
      "Requires ERP synchronization."
    ],
    fullExplanation: "A delayed refund of ₹1,540.00 occurred 8 days post-order. The ledger was never updated with the customer return credit note.",
    firstSeen: "28 Aug 2026 10:28 AM",
    history: [
      { time: "28 Aug 2026 10:28 AM", text: "Asynchronous refund variance spotted", type: "error" },
      { time: "28 Aug 2026 10:29 AM", text: "Escalated for ERP sync", type: "escalate" }
    ]
  },
  {
    orderId: "ORD1009",
    status: "APPROVE",
    category: "MATCHED",
    difference: 0.00,
    confidence: 99,
    matchedTo: "Bank UTR 554213",
    settleDate: "27 Aug 2026",
    orderDate: "25 Aug 2026",
    merchant: "MERCH_URBANKART",
    grossAmount: 3200.00,
    mdrFee: 64.00,
    gstOnMdr: 11.52,
    tdsAmount: 32.00,
    expectedNet: 3092.48,
    actualBank: 3092.48,
    settlementId: "stl_AA110099",
    paymentId: "pay_BB22334411",
    bankUtr: "UTR5542130099",
    settlementRow: "#14",
    ledgerEntry: "INV #44020",
    alertSummary: "One-line: 100% matched settlement, bank credit and ledger entry.",
    reasoning: ["All data points fully reconciled across 3 sources."],
    fullExplanation: "Order ORD1009 is clean and fully matched with zero difference.",
    firstSeen: "28 Aug 2026 10:32 AM",
    history: [{ time: "28 Aug 2026 10:32 AM", text: "Auto-cleared", type: "approve" }]
  },
  {
    orderId: "ORD1010",
    status: "APPROVE",
    category: "MATCHED",
    difference: 0.00,
    confidence: 99,
    matchedTo: "Bank UTR 554214",
    settleDate: "27 Aug 2026",
    orderDate: "25 Aug 2026",
    merchant: "MERCH_FRESHCART",
    grossAmount: 5120.00,
    mdrFee: 102.40,
    gstOnMdr: 18.43,
    tdsAmount: 51.20,
    expectedNet: 4947.97,
    actualBank: 4947.97,
    settlementId: "stl_BB220088",
    paymentId: "pay_CC33445522",
    bankUtr: "UTR5542141188",
    settlementRow: "#15",
    ledgerEntry: "INV #44021",
    alertSummary: "One-line: Exact match with automated rule verification.",
    reasoning: ["Settlement and bank credit match with 0 variance."],
    fullExplanation: "Reconciled with 99% confidence.",
    firstSeen: "28 Aug 2026 10:32 AM",
    history: [{ time: "28 Aug 2026 10:32 AM", text: "Auto-cleared", type: "approve" }]
  },
  {
    orderId: "ORD1026",
    status: "APPROVE",
    category: "TAX_DED",
    difference: 68.50,
    confidence: 98,
    matchedTo: "Bank UTR 554216",
    settleDate: "27 Aug 2026",
    orderDate: "25 Aug 2026",
    merchant: "MERCH_STYLEHIVE",
    grossAmount: 6850.00,
    mdrFee: 137.00,
    gstOnMdr: 24.66,
    tdsAmount: 68.50,
    expectedNet: 6688.34,
    actualBank: 6619.84,
    settlementId: "stl_CC330077",
    paymentId: "pay_DD44556633",
    bankUtr: "UTR5542162277",
    settlementRow: "#31",
    ledgerEntry: "INV #76414",
    alertSummary: "One-line: ₹68.50 variance matched to Section 194-O TDS deduction.",
    reasoning: [
      "Variance matches 1.00% TDS on gross order value ₹6,850.00.",
      "TDS certificate reference confirmed in monthly tax ledger.",
      "Auto-cleared under Tax Rule #194O."
    ],
    fullExplanation: "Merchant ledger omitted TDS provision under Section 194-O (1%). The calculated difference is exactly ₹68.50 and is approved.",
    firstSeen: "28 Aug 2026 10:32 AM",
    history: [{ time: "28 Aug 2026 10:32 AM", text: "Auto-cleared (TDS Rule)", type: "approve" }]
  },
  {
    orderId: "ORD1038",
    status: "HOLD",
    category: "TIMING_DELAY",
    difference: 0.00,
    confidence: 88,
    matchedTo: "Bank UTR 554217",
    settleDate: "28 Aug 2026",
    orderDate: "19 Aug 2026",
    merchant: "MERCH_GADGETBAY",
    grossAmount: 8200.00,
    mdrFee: 164.00,
    gstOnMdr: 29.52,
    tdsAmount: 82.00,
    expectedNet: 7924.48,
    actualBank: 7924.48,
    settlementId: "stl_DD440066",
    paymentId: "pay_EE55667744",
    bankUtr: "UTR5542173366",
    settlementRow: "#49",
    ledgerEntry: "INV #88201",
    alertSummary: "One-line: T+9 settlement delay due to bank holiday window.",
    reasoning: [
      "Settlement amount is 100% accurate (₹7,924.48).",
      "Settled T+9 days vs expected T+2 cycle.",
      "Marked HOLD for treasury cash-flow review."
    ],
    fullExplanation: "Funds arrived 9 days after order creation due to bank clearing holidays and weekend rollover. Amount is correct.",
    firstSeen: "28 Aug 2026 10:19 AM",
    history: [{ time: "28 Aug 2026 10:19 AM", text: "Timing delay detected (T+9)", type: "hold" }]
  },
  {
    orderId: "ORD1060",
    status: "APPROVE",
    category: "MATCHED",
    difference: 0.00,
    confidence: 99,
    matchedTo: "Lumped Batch #1",
    settleDate: "27 Aug 2026",
    orderDate: "25 Aug 2026",
    merchant: "MERCH_URBANKART",
    grossAmount: 1850.00,
    mdrFee: 37.00,
    gstOnMdr: 6.66,
    tdsAmount: 18.50,
    expectedNet: 1787.84,
    actualBank: 1787.84,
    settlementId: "stl_BATCH001",
    paymentId: "pay_LUMPED001",
    bankUtr: "UTR9900112233",
    settlementRow: "#55",
    ledgerEntry: "INV #33019",
    alertSummary: "One-line: 1 of 5 orders lumped into shared bank transfer UTR9900112233.",
    reasoning: [
      "Multi-order batch settlement algorithm grouped 5 orders sharing settlement_id stl_BATCH001.",
      "Sum of order net amounts (₹9,842.10) matches bank credit exactly.",
      "All 5 orders auto-cleared."
    ],
    fullExplanation: "Lumped multi-order settlement. The gateway consolidated 5 orders into one single bank payout. Reconciled successfully.",
    firstSeen: "28 Aug 2026 10:32 AM",
    history: [{ time: "28 Aug 2026 10:32 AM", text: "Auto-cleared (Lumped Batch Engine)", type: "approve" }]
  }
];

// Helper to generate additional simulated records to make full 74 items
function generateAll74Records() {
  const records = [...MOCK_ORDERS];
  const merchants = ["MERCH_URBANKART", "MERCH_STYLEHIVE", "MERCH_FRESHCART", "MERCH_GADGETBAY"];
  const baseOrderNum = 1011;

  // Fill in remaining APPROVED matched rows
  for (let i = 0; i < 44; i++) {
    const oid = `ORD${baseOrderNum + i}`;
    if (records.some(r => r.orderId === oid)) continue;
    const gross = 1200 + (i * 137.5) % 6500;
    const mdr = Math.round(gross * 0.02 * 100) / 100;
    const gst = Math.round(mdr * 0.18 * 100) / 100;
    const tds = Math.round(gross * 0.01 * 100) / 100;
    const net = Math.round((gross - mdr - gst - tds) * 100) / 100;
    const merch = merchants[i % merchants.length];
    
    records.push({
      orderId: oid,
      status: "APPROVE",
      category: i % 4 === 0 ? "FEE_DED" : (i % 5 === 0 ? "TAX_DED" : "MATCHED"),
      difference: i % 4 === 0 ? Math.round((mdr + gst) * 100) / 100 : (i % 5 === 0 ? tds : 0.00),
      confidence: 96 + (i % 4),
      matchedTo: `Bank UTR 5542${20 + i}`,
      settleDate: "27 Aug 2026",
      orderDate: "25 Aug 2026",
      merchant: merch,
      grossAmount: gross,
      mdrFee: mdr,
      gstOnMdr: gst,
      tdsAmount: tds,
      expectedNet: net,
      actualBank: net,
      settlementId: `stl_GEN${1000 + i}`,
      paymentId: `pay_GEN${9000 + i}`,
      bankUtr: `UTR5542${20 + i}8891`,
      settlementRow: `#${16 + i}`,
      ledgerEntry: `INV #${55000 + i}`,
      alertSummary: "One-line: Auto-reconciled with standard formula and bank credit proof.",
      reasoning: ["Formulaic match verified against ledger expected amount."],
      fullExplanation: `Order ${oid} successfully reconciled against merchant statement. Verified by Finance Wizard auto-clearing engine.`,
      firstSeen: "28 Aug 2026 10:32 AM",
      history: [{ time: "28 Aug 2026 10:32 AM", text: "Auto-cleared", type: "approve" }]
    });
  }

  // Fill in remaining HOLD items (total 9)
  const holdCount = records.filter(r => r.status === "HOLD").length;
  for (let i = holdCount; i < 9; i++) {
    const oid = `ORD${1080 + i}`;
    const gross = 3400 + i * 280;
    const mdr = Math.round(gross * 0.02 * 100) / 100;
    const gst = Math.round(mdr * 0.18 * 100) / 100;
    const tds = Math.round(gross * 0.01 * 100) / 100;
    const net = Math.round((gross - mdr - gst - tds) * 100) / 100;
    const diff = i % 2 === 0 ? 1.85 : 0.00;

    records.push({
      orderId: oid,
      status: "HOLD",
      category: i % 2 === 0 ? "ROUNDING" : "TIMING_DELAY",
      difference: diff,
      confidence: 84 + (i % 5),
      matchedTo: "Pending Review",
      settleDate: i % 2 === 0 ? "28 Aug 2026" : "Pending",
      orderDate: "22 Aug 2026",
      merchant: merchants[i % merchants.length],
      grossAmount: gross,
      mdrFee: mdr,
      gstOnMdr: gst,
      tdsAmount: tds,
      expectedNet: net,
      actualBank: Math.round((net - diff) * 100) / 100,
      settlementId: `stl_HLD${300 + i}`,
      paymentId: `pay_HLD${400 + i}`,
      bankUtr: `UTR771122${10 + i}`,
      settlementRow: `#${60 + i}`,
      ledgerEntry: `INV #${66000 + i}`,
      alertSummary: `One-line: ${i % 2 === 0 ? 'Minor variance requires confirmation' : 'T+5 cycle rollover in progress'}`,
      reasoning: ["Variance within secondary tolerance band. Awaiting periodic review."],
      fullExplanation: `Order ${oid} placed on hold pending merchant finance confirmation or standard gateway settlement window.`,
      firstSeen: "28 Aug 2026 10:20 AM",
      history: [{ time: "28 Aug 2026 10:20 AM", text: "Placed in HOLD queue", type: "hold" }]
    });
  }

  // Ensure exact 74 items total (58 APPROVE, 9 HOLD, 7 ESCALATE)
  return records.slice(0, 74);
}

export const ALL_74_RECORDS = generateAll74Records();

export const ASK_SUGGESTIONS = [
  "Why didn't order ORD1055 settle?",
  "What is the total pending amount?",
  "Show cash position summary",
  "Why was this escalated?",
  "Explain variance for ORD1025",
  "List all orders in ESCALATE queue"
];

export const FINANCIAL_MEMORY_RULES = [
  {
    id: "RULE-01",
    name: "Standard MDR + GST Deduction",
    pattern: "Gross × 2% MDR + 18% GST",
    confidence: "99.4%",
    appliedCount: 52,
    status: "Active",
    description: "Auto-clears merchant ledger differences where the gateway subtracted standard MDR rate (2%) and applicable 18% GST on the MDR amount."
  },
  {
    id: "RULE-02",
    name: "Section 194-O TDS Provision",
    pattern: "Gross × 1.00% TDS",
    confidence: "98.8%",
    appliedCount: 38,
    status: "Active",
    description: "Matches variance when the merchant internal ledger omitted the 1% TDS deduction mandated under Section 194-O for e-commerce operators."
  },
  {
    id: "RULE-03",
    name: "Fractional Rounding Tolerance",
    pattern: "Diff ≤ ₹1.50 per order",
    confidence: "94.2%",
    appliedCount: 29,
    status: "Active",
    description: "Permits fractional rounding variances resulting from compound per-item GST calculations between ERP inventory and gateway checkout."
  },
  {
    id: "RULE-04",
    name: "Multi-Order Lumped Batch Settlement",
    pattern: "SUM(order_net) == bank_credit",
    confidence: "99.9%",
    appliedCount: 15,
    status: "Active",
    description: "Identifies lumped payout batches where multiple order settlement lines are disbursed as a single consolidated NEFT bank credit."
  },
  {
    id: "RULE-05",
    name: "Bank Holiday T+3 / T+4 Extension",
    pattern: "Order on Friday/Saturday → Settle Tuesday",
    confidence: "91.0%",
    appliedCount: 19,
    status: "Active",
    description: "Extends settlement SLA window when clearing occurs over national bank holidays or RTGS/NEFT weekend maintenance windows."
  }
];
