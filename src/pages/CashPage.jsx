import React from 'react';
import HeaderChrome from '../components/HeaderChrome';
import CashCard from '../components/CashCard';
import StatusBar from '../components/StatusBar';
import { CASH_POSITION_DATA, KPI_DATA } from '../data/mockData';
import { Landmark, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';
import { useRecon } from '../context/ReconContext';

export default function CashPage() {
  const { theme, cashData, kpiData, isReconciled } = useRecon();
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
    footnote: "Run reconciliation to compute cash waterfall from your uploaded files."
  };
  const activeKpi = kpiData || { approveCount: 0, holdCount: 0, escalateCount: 0 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <HeaderChrome 
        title="Cash Position & Projections" 
        subtitle="Treasury liquidity, settled funds & counterfactual settlement models" 
      />

      <div className="content-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '28px', padding: '32px 40px' }}>
        
        {/* Top 4 Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          <div className="card-base" style={{ borderLeft: '5px solid var(--status-approve)', padding: '22px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Settled to Bank</div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--status-approve)', margin: '4px 0' }}>{activeCash.settledFormatted}</div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 500 }}>{activeKpi.approveCount} auto-cleared transactions</div>
          </div>

          <div className="card-base" style={{ borderLeft: '5px solid var(--status-escalate)', padding: '22px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pending / Cash at Risk</div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--status-escalate)', margin: '4px 0' }}>{activeCash.pendingFormatted}</div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 500 }}>{activeKpi.escalateCount} escalated + {activeKpi.holdCount} hold exceptions</div>
          </div>

          <div className="card-base" style={{ borderLeft: '5px solid var(--primary)', padding: '22px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>5-Day Forecast</div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>{activeCash.forecastFormatted}</div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 500 }}>Projected cycle completions</div>
          </div>

          <div className="card-base" style={{ borderLeft: '5px solid var(--tertiary)', padding: '22px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Batch Invoiced Value</div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>₹2,49,837.08</div>
            <div style={{ fontSize: '12.5px', color: 'var(--tertiary)', fontWeight: 700 }}>{activeKpi.totalRecords} total invoiced orders</div>
          </div>
        </div>

        {/* 2-Column Section: Detailed Flow & Counterfactuals */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.35fr) minmax(360px, 1fr)',
          gap: '28px',
          alignItems: 'start'
        }}>
          {/* Left: Settlement Waterfall */}
          <div className="card-base" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '19px', fontWeight: 800, margin: '0 0 20px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(125, 211, 252, 0.15)' : '#E0F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <Landmark size={20} />
              </div>
              <span>Settlement Waterfall Breakdown</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--bg-card-alt)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14.5px' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>1. Gross Invoiced Revenue</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>₹2,49,837.08</span>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--bg-card-alt)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14.5px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>2. Payment Gateway MDR (2.00%)</span>
                <span style={{ color: 'var(--status-escalate)', fontWeight: 700 }}>- ₹4,996.75</span>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--bg-card-alt)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14.5px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>3. GST on MDR (18%)</span>
                <span style={{ color: 'var(--status-escalate)', fontWeight: 700 }}>- ₹899.41</span>
              </div>

              {/* Step 4 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: 'var(--bg-card-alt)', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '14.5px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>4. TDS Withholding (Section 194-O, 1.00%)</span>
                <span style={{ color: 'var(--status-hold)', fontWeight: 700 }}>- ₹2,498.38</span>
              </div>

              {/* Step 5 - Net */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 18px',
                backgroundColor: 'var(--status-approve-bg)',
                border: '1px solid var(--status-approve-border)',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '15px'
              }}>
                <span style={{ color: 'var(--status-approve)' }}>5. Actual Bank Realized Credit</span>
                <span style={{ color: 'var(--status-approve)', fontSize: '18px' }}>{activeCash.settledFormatted}</span>
              </div>

              {/* Step 6 - Exceptions */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: 'var(--status-escalate-bg)',
                border: '1px solid var(--status-escalate-border)',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px'
              }}>
                <span style={{ color: 'var(--status-escalate)' }}>6. Unsettled Variance / Disputed Amount</span>
                <span style={{ color: 'var(--status-escalate)' }}>{activeCash.pendingFormatted}</span>
              </div>
            </div>
          </div>

          {/* Right: Counterfactual Models */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <CashCard />
          </div>
        </div>

      </div>

      <StatusBar />
    </div>
  );
}
