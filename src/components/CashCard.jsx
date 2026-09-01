import React from 'react';
import { Landmark, TrendingUp, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { CASH_POSITION_DATA } from '../data/mockData';
import { useRecon } from '../context/ReconContext';

export default function CashCard({ detailed = false }) {
  const { theme, cashData } = useRecon();
  const isDark = theme === 'dark';
  const activeCash = cashData || {
    settledFormatted: "₹0.00",
    pendingFormatted: "₹0.00",
    forecastFormatted: "₹0.00",
    counterfactual: {
      optimisticFormatted: "₹0.00",
      pessimisticFormatted: "₹0.00",
      cashAtRiskFormatted: "₹0.00"
    },
    footnote: "Run reconciliation to calculate cash positions from multi-source feeds."
  };
  const { settledFormatted, pendingFormatted, forecastFormatted, counterfactual, footnote } = activeCash;

  return (
    <div className="card-base" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: isDark ? 'rgba(125, 211, 252, 0.15)' : '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Landmark size={18} />
          </div>
          <span>Cash position</span>
        </h3>
        <span style={{ fontSize: '12px', color: 'var(--primary)', backgroundColor: 'var(--bg-active-nav)', padding: '3px 10px', borderRadius: '6px', fontWeight: 700, border: '1px solid var(--border-subtle)' }}>
          INR (₹)
        </span>
      </div>

      {/* Main Cash Metrics */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
        {/* Settled */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14.5px',
          padding: '8px 12px',
          backgroundColor: 'var(--status-approve-bg)',
          borderRadius: '8px',
          border: '1px solid var(--status-approve-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-approve)', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-approve)' }} />
            <span>Settled (APPROVE)</span>
          </div>
          <span style={{ fontWeight: 800, color: 'var(--status-approve)', fontSize: '16px' }}>
            {settledFormatted}
          </span>
        </div>

        {/* Pending / At Risk */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14.5px',
          padding: '8px 12px',
          backgroundColor: 'var(--status-escalate-bg)',
          borderRadius: '8px',
          border: '1px solid var(--status-escalate-border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-escalate)', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-escalate)' }} />
            <span>Pending / at risk</span>
          </div>
          <span style={{ fontWeight: 800, color: 'var(--status-escalate)', fontSize: '16px' }}>
            {pendingFormatted}
          </span>
        </div>

        {/* Forecast */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14.5px',
          padding: '8px 12px',
          backgroundColor: isDark ? 'rgba(125, 211, 252, 0.12)' : '#EFF6FF',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
            <span>Forecast (next ~5d)</span>
          </div>
          <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '16px' }}>
            {forecastFormatted}
          </span>
        </div>
      </div>

      {/* Counterfactual Box */}
      <div style={{
        backgroundColor: 'var(--bg-card-alt)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '16px',
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 800,
          color: 'var(--tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px'
        }}>
          <TrendingUp size={16} color="var(--tertiary)" />
          <span>Counterfactual Projection</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>• Optimistic</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{counterfactual.optimisticFormatted}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>• Pessimistic</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{counterfactual.pessimisticFormatted}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--status-escalate)', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontWeight: 600 }}>• Cash at risk</span>
            <span style={{ fontWeight: 800, color: 'var(--status-escalate)' }}>{counterfactual.cashAtRiskFormatted}</span>
          </div>
        </div>
      </div>

      {/* Footnote */}
      <div style={{
        marginTop: '14px',
        fontSize: '12px',
        color: 'var(--text-dim)',
        lineHeight: 1.4,
        fontStyle: 'italic'
      }}>
        {footnote}
      </div>
    </div>
  );
}
