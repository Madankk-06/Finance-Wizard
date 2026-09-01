import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertOctagon, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  Plus, 
  Receipt, 
  Building2, 
  Layers, 
  ShieldCheck, 
  TrendingUp,
  FileText
} from 'lucide-react';
import { useRecon } from '../context/ReconContext';

export default function OrderDrawer() {
  const { selectedOrder, closeOrderDrawer, closeDrawer, resolvedOrders, markOrderResolved, customNotes, addOrderNote, theme } = useRecon();
  const [noteInput, setNoteInput] = useState("");
  const [showNoteField, setShowNoteField] = useState(false);

  const isDark = theme === 'dark';

  const handleClose = () => {
    if (typeof closeOrderDrawer === 'function') {
      closeOrderDrawer();
    } else if (typeof closeDrawer === 'function') {
      closeDrawer();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!selectedOrder) return null;

  const order = selectedOrder;
  const isResolved = Boolean(resolvedOrders[order.orderId]);
  const orderCustomNotes = customNotes[order.orderId] || [];

  const handleResolve = () => {
    markOrderResolved(order.orderId);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addOrderNote(order.orderId, noteInput);
    setNoteInput("");
    setShowNoteField(false);
  };

  const formatINR = (num) => {
    if (num === undefined || num === null) return "₹0.00";
    return `₹ ${Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'var(--modal-backdrop)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.18s ease'
    }}>
      {/* Backdrop Click */}
      <div 
        onClick={handleClose} 
        style={{ flex: 1, height: '100%', cursor: 'pointer' }} 
        title="Click to close"
      />

      {/* Drawer Panel */}
      <div 
        className="slide-in-right"
        style={{
          width: '560px',
          maxWidth: '94vw',
          height: '100vh',
          backgroundColor: 'var(--bg-sidebar)',
          borderLeft: '1px solid var(--border-strong)',
          boxShadow: 'var(--shadow-drawer)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '24px 28px 20px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg-sidebar)',
          zIndex: 10,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Order {order.orderId}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
              {/* Decision Badge */}
              <span className={`badge ${
                isResolved ? 'badge-approve' :
                order.status === 'APPROVE' ? 'badge-approve' :
                order.status === 'HOLD' ? 'badge-hold' : 'badge-escalate'
              }`} style={{ fontSize: '13px', padding: '4px 12px' }}>
                {isResolved ? 'RESOLVED' : order.status}
              </span>

              {/* Category Badge */}
              <span style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-input)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-strong)',
                fontWeight: 600
              }}>
                {order.category}
              </span>

              {/* Confidence */}
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
                • {order.confidence}% confidence
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            aria-label="Close Order Details"
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--status-escalate-bg)';
              e.currentTarget.style.color = 'var(--status-escalate)';
              e.currentTarget.style.borderColor = 'var(--status-escalate-border)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-input)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* One-Line Alert Box */}
          <div style={{
            backgroundColor: order.status === 'ESCALATE' && !isResolved ? 'var(--status-escalate-bg)' :
                             order.status === 'HOLD' && !isResolved ? 'var(--status-hold-bg)' : 'var(--status-approve-bg)',
            border: `1px solid ${
              order.status === 'ESCALATE' && !isResolved ? 'var(--status-escalate-border)' :
              order.status === 'HOLD' && !isResolved ? 'var(--status-hold-border)' : 'var(--status-approve-border)'
            }`,
            borderRadius: '10px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            {order.status === 'ESCALATE' && !isResolved ? (
              <AlertOctagon size={22} color="var(--status-escalate)" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : order.status === 'HOLD' && !isResolved ? (
              <AlertCircle size={22} color="var(--status-hold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <CheckCircle2 size={22} color="var(--status-approve)" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div style={{
              fontSize: '14.5px',
              color: order.status === 'ESCALATE' && !isResolved ? (isDark ? '#FCA5A5' : '#991B1B') :
                     order.status === 'HOLD' && !isResolved ? (isDark ? '#FDE68A' : '#92400E') : (isDark ? '#A7F3D0' : '#065F46'),
              fontWeight: 600,
              lineHeight: 1.5
            }}>
              {order.alertSummary}
            </div>
          </div>

          {/* Breakdown Section */}
          <div>
            <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 800 }}>
              Financial Breakdown
            </h4>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '14.5px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Gross (from ledger)</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatINR(order.grossAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Expected net (MDR+GST+TDS)</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatINR(order.expectedNet)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Actual bank (UTR {order.bankUtr?.slice(0, 10)}...)</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatINR(order.actualBank)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '2px solid var(--border-subtle)',
                fontWeight: 800,
                color: order.difference > 0 ? 'var(--status-escalate)' : 'var(--status-approve)'
              }}>
                <span>Difference</span>
                <span style={{ fontSize: '16px' }}>{formatINR(order.difference)}</span>
              </div>
            </div>
          </div>

          {/* Sources Section */}
          <div>
            <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 800 }}>
              Matched Data Sources
            </h4>
            <div style={{
              backgroundColor: 'var(--bg-card-alt)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Settlement row</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{order.settlementRow}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Bank statement</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{order.bankUtr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ledger entry</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{order.ledgerEntry}</span>
              </div>
            </div>
          </div>

          {/* Reasoning & Investigative Agent Log */}
          <div>
            <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 800 }}>
              Automated Investigation & Rule Steps
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-card-alt)',
              padding: '16px 18px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)'
            }}>
              {order.agentReasoningLog && order.agentReasoningLog.length > 0 ? (
                order.agentReasoningLog.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: idx < order.agentReasoningLog.length - 1 ? '8px' : '0', borderBottom: idx < order.agentReasoningLog.length - 1 ? '1px dashed var(--border-subtle)' : 'none' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '12.5px' }}>{step.step}</span>
                    <span style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '13.5px' }}>{step.detail}</span>
                  </div>
                ))
              ) : (
                order.reasoning.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{idx + 1}.</span>
                    <span style={{ fontWeight: 500 }}>{step.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Full Explanation */}
          <div>
            <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 800 }}>
              Full Explanation
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, backgroundColor: 'var(--bg-card-alt)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              {order.fullExplanation}
            </p>
          </div>

          {/* Actions */}
          <div>
            <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 800 }}>
              Resolution Actions
            </h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleResolve}
                disabled={isResolved}
                className="btn-tertiary"
                style={{
                  backgroundColor: isResolved ? 'var(--status-approve)' : undefined,
                  color: '#FFFFFF',
                  cursor: isResolved ? 'default' : 'pointer'
                }}
              >
                {isResolved ? (
                  <>
                    <Check size={16} />
                    <span>Resolved</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Mark Resolved</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowNoteField(!showNoteField)}
                className="btn-secondary"
              >
                <Plus size={16} />
                <span>Add Note</span>
              </button>
            </div>

            {/* Note input field */}
            {showNoteField && (
              <form onSubmit={handleAddNote} style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Enter audit note for this order..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  autoFocus
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--primary)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: 'var(--text-main)',
                    fontSize: '13.5px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '10px 18px' }}
                >
                  Save
                </button>
              </form>
            )}
          </div>

          {/* History Timeline */}
          <div style={{ paddingBottom: '30px' }}>
            <h4 style={{ fontSize: '13.5px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: 800 }}>
              Audit History Timeline
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', paddingLeft: '10px' }}>
              {order.history.map((hist, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '13.5px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: hist.type === 'error' ? 'var(--status-escalate)' :
                                     hist.type === 'warning' ? 'var(--status-hold)' :
                                     hist.type === 'approve' || hist.type === 'success' ? 'var(--status-approve)' :
                                     hist.type === 'escalate' ? 'var(--status-escalate-badge)' : 'var(--primary)',
                    marginTop: '5px',
                    flexShrink: 0
                  }} />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>{hist.time}</div>
                    <div style={{ color: 'var(--text-main)', marginTop: '2px', fontWeight: 500 }}>{hist.text}</div>
                  </div>
                </div>
              ))}

              {/* Resolved event if marked */}
              {isResolved && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '13.5px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--status-approve)',
                    marginTop: '5px',
                    flexShrink: 0
                  }} />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>Today at {resolvedOrders[order.orderId]?.resolvedAt}</div>
                    <div style={{ color: 'var(--status-approve)', fontWeight: 700 }}>Marked Resolved by {resolvedOrders[order.orderId]?.resolvedBy}</div>
                  </div>
                </div>
              )}

              {/* Custom notes added by user */}
              {orderCustomNotes.map((note, nIdx) => (
                <div key={`n-${nIdx}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', fontSize: '13.5px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    marginTop: '5px',
                    flexShrink: 0
                  }} />
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600 }}>{note.time} • {note.author}</div>
                    <div style={{ color: 'var(--primary)', marginTop: '2px', fontStyle: 'italic', fontWeight: 600 }}>"{note.text}"</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
