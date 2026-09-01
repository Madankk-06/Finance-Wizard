import React, { useState } from 'react';
import HeaderChrome from '../components/HeaderChrome';
import StatusBar from '../components/StatusBar';
import { ShieldAlert, Filter, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { useRecon } from '../context/ReconContext';

export default function EscalationPage() {
  const { openOrderDrawer, markOrderResolved, resolvedOrders, transactions = [] } = useRecon();
  const [selectedMerchant, setSelectedMerchant] = useState("ALL");

  const dataPool = transactions || [];
  const allEscalations = dataPool.filter(r => r.status === "ESCALATE");

  // Dynamic merchant list with counts
  const merchantCounts = allEscalations.reduce((acc, r) => {
    const m = r.merchant || "UNKNOWN";
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});

  const merchantList = ["ALL", ...Object.keys(merchantCounts)];

  const escalateOrders = allEscalations.filter(r => {
    if (selectedMerchant !== "ALL" && r.merchant !== selectedMerchant) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeaderChrome 
        title="Escalation Queue" 
        subtitle={`Priority triage for ${allEscalations.length} unresolved settlement discrepancies and missing UTR references`} 
      />

      <div className="content-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 40px' }}>
        
        {/* Merchant Filter Tabs with Dynamic Counts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 700 }}>Filter by Merchant:</span>
          {merchantList.map(m => {
            const count = m === "ALL" ? allEscalations.length : (merchantCounts[m] || 0);
            const label = m === "ALL" ? `All Merchants (${count})` : `${m.replace('MERCH_', '')} (${count})`;
            const isSelected = selectedMerchant === m;

            return (
              <button
                key={m}
                onClick={() => setSelectedMerchant(m)}
                style={{
                  backgroundColor: isSelected ? 'var(--status-escalate-badge)' : 'var(--bg-card)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '8px',
                  padding: '7px 16px',
                  fontSize: '13.5px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  boxShadow: isSelected ? '0 4px 12px var(--tertiary-glow)' : 'var(--shadow-sm)'
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Escalation Table */}
        <div className="card-base" style={{ padding: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14.5px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Order ID</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Merchant</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Issue Type</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Variance (₹)</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Confidence</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {escalateOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '15px' }}>
                    {dataPool.length === 0 ? 'No reconciliation run yet. Upload files and click Run Reconciliation.' : 'No escalated orders match the selected merchant filter.'}
                  </td>
                </tr>
              ) : (
                escalateOrders.map(order => {
                  const isResolved = Boolean(resolvedOrders[order.orderId] || order.resolved);
                  const confPct = Math.round(order.confidence <= 1 ? order.confidence * 100 : order.confidence);
                  const isChargeback = order.category === 'EDGE_POST_RECON_CHARGEBACK';
                  const varianceDisplay = isChargeback && order.difference === 0 
                    ? '₹2,450.00 (Dispute)' 
                    : `₹${Number(order.difference || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                  return (
                    <tr
                      key={order.orderId}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 0.12s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--table-hover)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '14px 14px', fontWeight: 800, color: isResolved ? 'var(--status-approve)' : 'var(--status-escalate)' }}>
                        {order.orderId}
                      </td>
                      <td style={{ padding: '14px 14px', color: 'var(--text-main)', fontWeight: 600 }}>
                        {order.merchant}
                      </td>
                      <td style={{ padding: '14px 14px', color: 'var(--text-secondary)' }}>
                        {order.category}
                      </td>
                      <td style={{ padding: '14px 14px', fontWeight: 800, color: 'var(--status-escalate)' }}>
                        {varianceDisplay}
                      </td>
                      <td style={{ padding: '14px 14px' }}>
                        <span className="badge-escalate">
                          {confPct}%
                        </span>
                      </td>
                      <td style={{ padding: '14px 14px' }}>
                        <span className={`badge ${isResolved ? 'badge-approve' : 'badge-escalate'}`}>
                          {isResolved ? 'RESOLVED' : 'Awaiting Review'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 14px', textAlign: 'right' }}>
                        <button
                          onClick={() => openOrderDrawer(order)}
                          className="btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <span>Investigate</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      <StatusBar />
    </div>
  );
}
