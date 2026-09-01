import React from 'react';
import { CheckCircle2, ShieldCheck, AlertCircle, AlertOctagon, Zap } from 'lucide-react';
import { KPI_DATA } from '../data/mockData';
import { useRecon } from '../context/ReconContext';

export default function KpiRow() {
  const { theme, kpiData, isReconciled } = useRecon();
  const isDark = theme === 'dark';
  const activeKpi = kpiData || {
    matchRate: '—',
    matchRateLabel: "Matched transactions",
    approveCount: 0,
    approveLabel: "Auto-cleared",
    holdCount: 0,
    holdLabel: "Needs glance",
    escalateCount: 0,
    escalateLabel: "Needs human",
    throughput: '—',
    throughputLabel: "Records processed"
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
      gap: '20px',
      marginBottom: '28px'
    }}>
      {/* 1. Match Rate */}
      <div className="card-base" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderLeft: '5px solid var(--primary)',
        padding: '22px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          backgroundColor: isDark ? 'rgba(125, 211, 252, 0.15)' : '#E0F2FE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          flexShrink: 0
        }}>
          <ShieldCheck size={28} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Match rate
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.15, marginTop: '2px' }}>
            {activeKpi.matchRate}%
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 500 }}>
            {activeKpi.matchRateLabel}
          </div>
        </div>
      </div>

      {/* 2. APPROVE */}
      <div className="card-base" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderLeft: '5px solid var(--status-approve)',
        padding: '22px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          backgroundColor: 'var(--status-approve-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--status-approve)',
          flexShrink: 0
        }}>
          <CheckCircle2 size={28} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--status-approve)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
            APPROVE
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.15, marginTop: '2px' }}>
            {activeKpi.approveCount}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 500 }}>
            {activeKpi.approveLabel}
          </div>
        </div>
      </div>

      {/* 3. HOLD */}
      <div className="card-base" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderLeft: '5px solid var(--status-hold)',
        padding: '22px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          backgroundColor: 'var(--status-hold-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--status-hold)',
          flexShrink: 0
        }}>
          <AlertCircle size={28} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--status-hold)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
            HOLD
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.15, marginTop: '2px' }}>
            {activeKpi.holdCount}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 500 }}>
            {activeKpi.holdLabel}
          </div>
        </div>
      </div>

      {/* 4. ESCALATE */}
      <div className="card-base" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderLeft: '5px solid var(--status-escalate-badge)',
        padding: '22px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          backgroundColor: 'var(--status-escalate-badge-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--status-escalate-badge)',
          flexShrink: 0
        }}>
          <AlertOctagon size={28} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--status-escalate-badge)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
            ESCALATE
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.15, marginTop: '2px' }}>
            {activeKpi.escalateCount}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 500 }}>
            {activeKpi.escalateLabel}
          </div>
        </div>
      </div>

      {/* 5. Throughput */}
      <div className="card-base" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderLeft: '5px solid var(--secondary)',
        padding: '22px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          backgroundColor: isDark ? 'rgba(136, 180, 204, 0.15)' : '#EEF2FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--secondary)',
          flexShrink: 0
        }}>
          <Zap size={28} />
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
            Throughput
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.15, marginTop: '2px' }}>
            {activeKpi.throughput}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 500 }}>
            {activeKpi.throughputLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
