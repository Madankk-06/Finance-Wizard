import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useRecon } from '../context/ReconContext';
import { ALL_74_RECORDS } from '../data/mockData';

export default function ExceptionsList({ limit = 3, showHeaderLink = true }) {
  const { openOrderDrawer, resolvedOrders, transactions = [] } = useRecon();

  // Filter only ESCALATE items
  const dataPool = transactions || [];
  const escalateOrders = dataPool.filter(r => r.status === "ESCALATE");
  const displayOrders = limit ? escalateOrders.slice(0, limit) : escalateOrders;

  return (
    <div className="card-base" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--status-escalate-bg)',
            border: '1px solid var(--status-escalate-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--status-escalate)'
          }}>
            <AlertOctagon size={18} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Exceptions needing human (ESCALATE only)
          </h3>
        </div>

        {showHeaderLink && (
          <Link
            to="/escalation"
            style={{
              fontSize: '14px',
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            <span>View all escalations (7)</span>
            <ArrowUpRight size={15} />
          </Link>
        )}
      </div>

      {/* Exceptions Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '10px 12px', fontWeight: 700 }}>Order ID</th>
              <th style={{ padding: '10px 12px', fontWeight: 700 }}>Reason</th>
              <th style={{ padding: '10px 12px', fontWeight: 700 }}>Difference (₹)</th>
              <th style={{ padding: '10px 12px', fontWeight: 700 }}>Confidence</th>
              <th style={{ padding: '10px 12px', fontWeight: 700 }}>First seen</th>
              <th style={{ padding: '10px 6px', width: '20px' }}></th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No escalated exceptions pending review.
                </td>
              </tr>
            ) : (
              displayOrders.map((order) => {
              const isResolved = Boolean(resolvedOrders[order.orderId]);

              return (
                <tr
                  key={order.orderId}
                  onClick={() => openOrderDrawer(order)}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'background-color 0.12s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--status-escalate-bg)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Order ID */}
                  <td style={{ padding: '12px 12px', fontWeight: 800, color: isResolved ? 'var(--status-approve)' : 'var(--status-escalate)' }}>
                    {order.orderId}
                  </td>

                  {/* Reason */}
                  <td style={{ padding: '12px 12px', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                      {order.orderId === 'ORD1055' ? '₹350.87 gap with no fee/tax/timing pattern' :
                       order.orderId === 'ORD1063' ? 'Rounding difference beyond tolerance' :
                       order.orderId === 'ORD1072' ? 'Amount present in bank only' :
                       order.alertSummary.replace('One-line: ', '')}
                    </div>
                  </td>

                  {/* Difference */}
                  <td style={{ padding: '12px 12px', fontWeight: 800, color: 'var(--status-escalate)' }}>
                    ₹{order.difference.toFixed(2)}
                  </td>

                  {/* Confidence */}
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{
                      backgroundColor: 'var(--status-escalate-bg)',
                      color: 'var(--status-escalate)',
                      border: '1px solid var(--status-escalate-border)',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 800
                    }}>
                      {order.confidence}%
                    </span>
                  </td>

                  {/* First seen */}
                  <td style={{ padding: '12px 12px', color: 'var(--text-muted)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {order.firstSeen}
                  </td>

                  {/* Chevron */}
                  <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                    <ChevronRight size={16} color="var(--text-dim)" />
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
