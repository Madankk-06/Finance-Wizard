import React, { useState, useMemo } from 'react';
import HeaderChrome from '../components/HeaderChrome';
import StatusBar from '../components/StatusBar';
import { 
  History, 
  Search, 
  Calendar, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowUpDown, 
  FileSpreadsheet, 
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useRecon } from '../context/ReconContext';

export default function MemoryPage() {
  const { theme, transactions = [], isReconciled, openOrderDrawer } = useRecon();
  const isDark = theme === 'dark';

  // Filter States
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-08-31');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Quick Preset Handlers
  const handlePreset = (preset) => {
    if (preset === 'ALL') {
      setFromDate('');
      setToDate('');
    } else if (preset === 'JULY') {
      setFromDate('2026-07-01');
      setToDate('2026-07-31');
    } else if (preset === 'AUG') {
      setFromDate('2026-08-01');
      setToDate('2026-08-31');
    } else if (preset === 'LAST30') {
      setFromDate('2026-08-01');
      setToDate('2026-08-31');
    }
  };

  // Filter Transactions by Date Range, Search Query, and Status
  const filteredRecords = useMemo(() => {
    return transactions.filter(tx => {
      // Date filter
      const txDate = tx.settleDate || tx.orderDate || '';
      if (fromDate && txDate && txDate < fromDate) return false;
      if (toDate && txDate && txDate > toDate) return false;

      // Status filter
      if (statusFilter !== 'ALL' && tx.status !== statusFilter) return false;

      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = (tx.orderId || '').toLowerCase().includes(q);
        const matchUtr = (tx.bankUtr || '').toLowerCase().includes(q);
        const matchSettle = (tx.settlementId || '').toLowerCase().includes(q);
        const matchMerch = (tx.merchant || '').toLowerCase().includes(q);
        const matchCat = (tx.category || '').toLowerCase().includes(q);
        if (!matchId && !matchUtr && !matchSettle && !matchMerch && !matchCat) return false;
      }

      return true;
    });
  }, [transactions, fromDate, toDate, statusFilter, searchQuery]);

  // Aggregate Metrics for Filtered Historical Records
  const summaryMetrics = useMemo(() => {
    let gross = 0;
    let net = 0;
    let approved = 0;
    let held = 0;
    let escalated = 0;
    let variance = 0;

    filteredRecords.forEach(r => {
      gross += Number(r.grossAmount || 0);
      net += Number(r.actualBank || 0);
      variance += Math.abs(Number(r.difference || 0));
      if (r.status === 'APPROVE') approved++;
      else if (r.status === 'HOLD') held++;
      else if (r.status === 'ESCALATE') escalated++;
    });

    return {
      totalCount: filteredRecords.length,
      gross,
      net,
      approved,
      held,
      escalated,
      variance
    };
  }, [filteredRecords]);

  // Export Filtered Historical CSV
  const handleDownloadHistoricalReport = () => {
    if (filteredRecords.length === 0) return;

    const headers = [
      "Order ID",
      "Merchant Name",
      "Settlement Date",
      "Order Recorded Date",
      "Bank UTR",
      "Settlement ID",
      "Gross Invoiced Amount (INR)",
      "MDR Processing Fee (INR)",
      "GST on Fee (INR)",
      "TDS Withholding (INR)",
      "Expected Net Bank (INR)",
      "Actual Bank Realized (INR)",
      "Variance Shortfall (INR)",
      "Reconciliation Status",
      "Audit Category Pattern",
      "Audit Explanation / Notes"
    ];

    const rows = filteredRecords.map(r => [
      `"${r.orderId || ''}"`,
      `"${r.merchant || ''}"`,
      `"${r.settleDate || ''}"`,
      `"${r.orderDate || ''}"`,
      `"${r.bankUtr || ''}"`,
      `"${r.settlementId || ''}"`,
      (r.grossAmount || 0).toFixed(2),
      (r.mdrFee || 0).toFixed(2),
      (r.gstOnMdr || 0).toFixed(2),
      (r.tdsAmount || 0).toFixed(2),
      (r.expectedNet || 0).toFixed(2),
      (r.actualBank || 0).toFixed(2),
      (r.difference || 0).toFixed(2),
      `"${r.status || ''}"`,
      `"${r.category || ''}"`,
      `"${(r.fullExplanation || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const fromStr = fromDate || 'Start';
    const toStr = toDate || 'End';
    link.setAttribute("download", `Historical_Reconciliation_Report_${fromStr}_to_${toStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeaderChrome 
        title="Financial Memory & Historical Archives" 
        subtitle="Search historical settlement batches, filter records by date range, and export audited historical reports" 
      />

      <div className="content-body" style={{ flex: 1, maxWidth: '1350px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px', padding: '32px 40px' }}>
        
        {/* Search & Filter Header Card */}
        <div className="card-base" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <History size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Historical Audit Search & Date Range Filter
              </h3>
            </div>

            {/* Quick Date Range Preset Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Presets:</span>
              <button 
                onClick={() => handlePreset('ALL')}
                className="btn-secondary" 
                style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '20px' }}
              >
                All Dates
              </button>
              <button 
                onClick={() => handlePreset('JULY')}
                className="btn-secondary" 
                style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '20px' }}
              >
                July 2026
              </button>
              <button 
                onClick={() => handlePreset('AUG')}
                className="btn-secondary" 
                style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '20px' }}
              >
                August 2026
              </button>
              <button 
                onClick={() => handlePreset('LAST30')}
                className="btn-secondary" 
                style={{ padding: '4px 12px', fontSize: '12px', borderRadius: '20px' }}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          {/* Filter Input Controls Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
            
            {/* From Date */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                From Date
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date" 
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="input-base" 
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '13.5px', border: '1px solid var(--border-strong)' }}
                />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                To Date
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="date" 
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="input-base" 
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '13.5px', border: '1px solid var(--border-strong)' }}
                />
              </div>
            </div>

            {/* Search Term */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                Search Keyword
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Order ID, UTR, Merchant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-base" 
                  style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '8px', fontSize: '13.5px', border: '1px solid var(--border-strong)' }}
                />
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Decision Status Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                Status Filter
              </label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-base" 
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '13.5px', border: '1px solid var(--border-strong)' }}
              >
                <option value="ALL">All Decisions</option>
                <option value="APPROVE">APPROVE (Auto-Cleared)</option>
                <option value="HOLD">HOLD (Timing Delay)</option>
                <option value="ESCALATE">ESCALATE (Discrepancy)</option>
              </select>
            </div>

            {/* Export Download Button */}
            <div>
              <button 
                onClick={handleDownloadHistoricalReport}
                disabled={filteredRecords.length === 0}
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  padding: '9px 16px', 
                  fontSize: '13.5px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px' 
                }}
              >
                <Download size={15} />
                <span>Export Report ({filteredRecords.length})</span>
              </button>
            </div>

          </div>
        </div>

        {/* ── HISTORICAL SUMMARY KPI STRIP ─────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="card-base" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Filtered Historical Records</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 2px 0' }}>
              {summaryMetrics.totalCount} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>Orders</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              From {fromDate || 'Earliest'} to {toDate || 'Latest'}
            </div>
          </div>

          <div className="card-base" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Historical Gross Invoiced</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#3B82F6', margin: '4px 0 2px 0' }}>
              ₹{summaryMetrics.gross.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>100% Invoiced Value</div>
          </div>

          <div className="card-base" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Bank Realized Cash</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--status-approve)', margin: '4px 0 2px 0' }}>
              ₹{summaryMetrics.net.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--status-approve)', fontWeight: 600 }}>
              {summaryMetrics.approved} Auto-Approved
            </div>
          </div>

          <div className="card-base" style={{ padding: '18px 22px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Escalated Shortfall</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#EC4899', margin: '4px 0 2px 0' }}>
              ₹{summaryMetrics.variance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: '12px', color: '#EC4899', fontWeight: 600 }}>
              {summaryMetrics.escalated} Escalations • {summaryMetrics.held} Held
            </div>
          </div>
        </div>

        {/* ── HISTORICAL AUDIT RECORDS TABLE ───────────────────────────────── */}
        <div className="card-base" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={18} color="var(--primary)" />
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Historical Settlement Ledger
              </h4>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {filteredRecords.length} records
            </span>
          </div>

          {filteredRecords.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <History size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)' }}>No Historical Records Found</div>
              <p style={{ fontSize: '13.5px', marginTop: '4px' }}>Try adjusting your date range or search keyword.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-input)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Order ID</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Merchant</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Settle Date</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Bank UTR</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'right' }}>Gross</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'right' }}>Realized Net</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'center' }}>Decision</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700 }}>Pattern Category</th>
                    <th style={{ padding: '12px 18px', fontWeight: 700, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r, idx) => (
                    <tr 
                      key={r.orderId || idx}
                      style={{ 
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--bg-hover)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '14px 18px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
                        {r.orderId}
                      </td>
                      <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--text-main)' }}>
                        {r.merchant}
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                        {r.settleDate || r.orderDate || '—'}
                      </td>
                      <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '12.5px' }}>
                        {r.bankUtr || '—'}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>
                        ₹{(r.grossAmount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: 800, color: 'var(--status-approve)' }}>
                        ₹{(r.actualBank || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <span className={
                          r.status === 'APPROVE' ? 'badge-approve' :
                          r.status === 'HOLD' ? 'badge-hold' : 'badge-escalate'
                        } style={{ fontSize: '11.5px', padding: '3px 8px', fontWeight: 700 }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', color: 'var(--text-secondary)', fontSize: '12.5px', fontFamily: 'monospace' }}>
                        {r.category}
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <button 
                          onClick={() => openOrderDrawer(r)}
                          className="btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <span>Inspect</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <StatusBar />
    </div>
  );
}
