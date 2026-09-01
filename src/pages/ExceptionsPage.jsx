import React from 'react';
import HeaderChrome from '../components/HeaderChrome';
import ExceptionsList from '../components/ExceptionsList';
import StatusBar from '../components/StatusBar';
import { CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { useRecon } from '../context/ReconContext';

export default function ExceptionsPage() {
  const { markOrderResolved, resolvedOrders, openOrderDrawer, transactions = [], isReconciled } = useRecon();
  
  const escalateOrders = isReconciled ? transactions.filter(r => r.status === "ESCALATE") : [];
  const totalDiscrepancy = escalateOrders.reduce((sum, o) => sum + (o.difference || 0), 0);
  const merchantCount = new Set(escalateOrders.map(o => o.merchant)).size;

  const handleResolveAll = () => {
    escalateOrders.forEach(o => markOrderResolved(o.orderId));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeaderChrome 
        title="Exceptions & Escalations" 
        subtitle={isReconciled ? `${escalateOrders.length} high-priority items requiring investigation` : "Awaiting reconciliation run"} 
      />

      <div className="content-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '28px', padding: '32px 40px' }}>
        
        {/* Banner with Action */}
        <div className="card-base" style={{
          backgroundColor: escalateOrders.length > 0 ? 'var(--status-escalate-bg)' : 'var(--bg-card)',
          border: `1px solid ${escalateOrders.length > 0 ? 'var(--status-escalate-border)' : 'var(--border-subtle)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: escalateOrders.length > 0 ? 'var(--status-escalate-bg)' : 'var(--bg-input)',
              border: `1px solid ${escalateOrders.length > 0 ? 'var(--status-escalate-border)' : 'var(--border-strong)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: escalateOrders.length > 0 ? 'var(--status-escalate)' : 'var(--text-muted)'
            }}>
              <ShieldAlert size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: escalateOrders.length > 0 ? 'var(--status-escalate)' : 'var(--text-main)' }}>
                {isReconciled ? `${escalateOrders.length} Unreconciled Exceptions Active` : 'No Active Reconciliation Batch'}
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0', fontWeight: 500 }}>
                {isReconciled ? (
                  <>Total discrepancy at risk: <strong style={{ color: 'var(--status-escalate)' }}>₹{totalDiscrepancy.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> across {merchantCount} merchants.</>
                ) : (
                  <>Upload source CSV files and run reconciliation to detect exceptions and fee discrepancies.</>
                )}
              </p>
            </div>
          </div>

          {escalateOrders.length > 0 && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleResolveAll}
                className="btn-tertiary"
                style={{ backgroundColor: 'var(--status-escalate-badge)', color: '#FFFFFF' }}
              >
                <CheckCircle2 size={16} />
                <span>Bulk Approve Verified</span>
              </button>
            </div>
          )}
        </div>

        {/* Full Exceptions List Component */}
        <ExceptionsList limit={0} showHeaderLink={false} />

        {/* Detailed Cards for Each Exception */}
        {escalateOrders.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {escalateOrders.map((order) => {
              const isResolved = Boolean(resolvedOrders[order.orderId]);

              return (
                <div
                  key={order.orderId}
                  className="card-base"
                  style={{
                    borderLeft: `5px solid ${isResolved ? 'var(--status-approve)' : 'var(--status-escalate)'}`,
                    cursor: 'pointer',
                    padding: '22px',
                    backgroundColor: 'var(--bg-card)',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => openOrderDrawer(order)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 800, color: isResolved ? 'var(--status-approve)' : 'var(--text-main)' }}>
                      {order.orderId}
                    </span>
                    <span className={`badge ${isResolved ? 'badge-approve' : 'badge-escalate'}`}>
                      {isResolved ? 'RESOLVED' : order.category}
                    </span>
                  </div>

                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', minHeight: '42px', lineHeight: 1.5 }}>
                    {order.alertSummary ? order.alertSummary.replace('One-line: ', '') : `Variance ₹${order.difference?.toFixed(2)}`}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '13.5px'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>Diff: <strong style={{ color: 'var(--status-escalate)' }}>₹{order.difference?.toFixed(2)}</strong></span>
                    <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <span>Inspect</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <StatusBar />
    </div>
  );
}
