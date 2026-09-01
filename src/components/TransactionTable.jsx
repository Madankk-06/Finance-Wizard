import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  AlertOctagon,
  Check
} from 'lucide-react';
import { useRecon } from '../context/ReconContext';
import { ALL_74_RECORDS } from '../data/mockData';

export default function TransactionTable({ fullPage = false, initialFilter = "ALL" }) {
  const { openOrderDrawer, activeFilter, setActiveFilter, searchQuery, setSearchQuery, resolvedOrders, theme, transactions = [] } = useRecon();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(fullPage ? 12 : 7);

  const isDark = theme === 'dark';

  const dataToFilter = transactions || [];

  // Dynamic filter tab list
  const filters = [
    { id: "ALL", label: "All", count: dataToFilter.length },
    { id: "APPROVE", label: "APPROVE", count: dataToFilter.filter(t => t.status === 'APPROVE').length },
    { id: "HOLD", label: "HOLD", count: dataToFilter.filter(t => t.status === 'HOLD').length },
    { id: "ESCALATE", label: "ESCALATE", count: dataToFilter.filter(t => t.status === 'ESCALATE').length }
  ];

  // Filtered & searched data
  const filteredData = useMemo(() => {
    return dataToFilter.filter(item => {
      // Status filter
      if (activeFilter !== "ALL" && item.status !== activeFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesOid = item.orderId.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesRef = item.matchedTo.toLowerCase().includes(q) || (item.bankUtr && item.bankUtr.toLowerCase().includes(q));
        const matchesMerch = item.merchant.toLowerCase().includes(q);
        const matchesDiff = item.difference.toString().includes(q);
        if (!matchesOid && !matchesCat && !matchesRef && !matchesMerch && !matchesDiff) {
          return false;
        }
      }
      return true;
    });
  }, [activeFilter, searchQuery, dataToFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const formatDifference = (diff) => {
    if (diff === 0) return "₹0.00";
    return `₹${diff.toFixed(2)}`;
  };

  return (
    <div className="card-base" style={{ padding: '24px' }}>
      {/* Table Top Controls: Title, Filter Chips, Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '18px',
        marginBottom: '20px'
      }}>
        {/* Left: Section title & Filter chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Transactions
          </h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'var(--bg-input)',
            padding: '4px',
            borderRadius: '9px',
            border: '1px solid var(--border-subtle)'
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '0 8px', fontWeight: 700 }}>Filter:</span>
            {filters.map(tab => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleFilterChange(tab.id)}
                  style={{
                    backgroundColor: active ? 'var(--primary)' : 'transparent',
                    color: active ? (isDark ? '#0F172A' : '#FFFFFF') : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: active ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    boxShadow: active ? '0 2px 6px var(--primary-glow)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Search Box */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search orders, refs, amounts..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-strong)',
              borderRadius: '8px',
              padding: '8px 14px 8px 36px',
              color: 'var(--text-main)',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.15s'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-glow)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-strong)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Table Component */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14.5px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Order ID</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Category</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Difference (₹)</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Confidence</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Matched To</th>
              <th style={{ padding: '12px 14px', fontWeight: 700 }}>Settle Date</th>
              <th style={{ padding: '12px 8px', width: '30px' }}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '15px' }}>
                  {dataToFilter.length === 0 ? 'No transactions reconciled yet. Upload files and click Run Reconciliation.' : 'No transactions match the selected filters.'}
                </td>
              </tr>
            ) : (
              paginatedData.map((order) => {
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
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--table-hover)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {/* Status Icon */}
                    <td style={{ padding: '13px 14px' }}>
                      {isResolved ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--status-approve)', fontSize: '12px', fontWeight: 800 }}>
                          <Check size={16} color="var(--status-approve)" />
                          <span>RESOLVED</span>
                        </span>
                      ) : order.status === "APPROVE" ? (
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--status-approve)' }} title="APPROVE - Auto-cleared">
                          <CheckCircle2 size={19} />
                        </div>
                      ) : order.status === "HOLD" ? (
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--status-hold)' }} title="HOLD - Needs glance">
                          <AlertCircle size={19} />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--status-escalate)' }} title="ESCALATE - Needs human">
                          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--status-escalate)', boxShadow: '0 0 6px var(--status-escalate)' }} />
                        </div>
                      )}
                    </td>

                    {/* Order ID */}
                    <td style={{ padding: '13px 14px', fontWeight: 700, color: order.status === "ESCALATE" && !isResolved ? 'var(--status-escalate)' : 'var(--text-main)' }}>
                      {order.orderId}
                    </td>

                    {/* Category Badge */}
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{
                        fontSize: '13px',
                        color: order.category === 'UNEXPLAINED' ? 'var(--status-escalate-badge)' : 'var(--text-secondary)',
                        fontWeight: 600,
                        backgroundColor: order.category === 'UNEXPLAINED' ? 'var(--status-escalate-badge-bg)' : 'var(--bg-input)',
                        padding: '3px 8px',
                        borderRadius: '5px'
                      }}>
                        {order.category}
                      </span>
                    </td>

                    {/* Difference */}
                    <td style={{
                      padding: '13px 14px',
                      fontWeight: 700,
                      color: order.difference > 0 ? 'var(--status-escalate)' : 'var(--text-muted)'
                    }}>
                      {formatDifference(order.difference)}
                    </td>

                    {/* Confidence */}
                    <td style={{ padding: '13px 14px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        backgroundColor: order.confidence >= 90 ? 'var(--status-approve-bg)' : order.confidence >= 70 ? 'var(--status-hold-bg)' : 'var(--status-escalate-bg)',
                        color: order.confidence >= 90 ? 'var(--status-approve)' : order.confidence >= 70 ? 'var(--status-hold)' : 'var(--status-escalate)',
                        border: `1px solid ${order.confidence >= 90 ? 'var(--status-approve-border)' : order.confidence >= 70 ? 'var(--status-hold-border)' : 'var(--status-escalate-border)'}`
                      }}>
                        {order.confidence}%
                      </span>
                    </td>

                    {/* Matched To */}
                    <td style={{ padding: '13px 14px', color: 'var(--text-secondary)', fontSize: '13.5px' }}>
                      {order.matchedTo}
                    </td>

                    {/* Settle Date */}
                    <td style={{ padding: '13px 14px', color: 'var(--text-muted)', fontSize: '13.5px' }}>
                      {order.settleDate}
                    </td>

                    {/* Chevron icon */}
                    <td style={{ padding: '13px 8px', textAlign: 'right' }}>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Summary Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '13.5px',
        color: 'var(--text-muted)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} records
        </div>

        {/* Pagination controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: currentPage === 1 ? 'var(--text-dim)' : 'var(--text-secondary)',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={15} />
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            const active = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  backgroundColor: active ? 'var(--primary)' : 'var(--bg-card)',
                  color: active ? (isDark ? '#0F172A' : '#FFFFFF') : 'var(--text-secondary)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '6px',
                  width: '32px',
                  height: '32px',
                  fontSize: '13px',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: active ? '0 2px 6px var(--primary-glow)' : 'none'
                }}
              >
                {pageNum}
              </button>
            );
          })}

          {totalPages > 5 && (
            <>
              <span style={{ padding: '0 4px', color: 'var(--text-dim)' }}>...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                style={{
                  backgroundColor: currentPage === totalPages ? 'var(--primary)' : 'var(--bg-card)',
                  color: currentPage === totalPages ? (isDark ? '#0F172A' : '#FFFFFF') : 'var(--text-secondary)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '6px',
                  width: '32px',
                  height: '32px',
                  fontSize: '13px',
                  fontWeight: currentPage === totalPages ? 700 : 500,
                  cursor: 'pointer'
                }}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: currentPage === totalPages ? 'var(--text-dim)' : 'var(--text-secondary)',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronRight size={15} />
          </button>

          {/* Page size dropdown */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-strong)',
              borderRadius: '6px',
              padding: '5px 8px',
              fontSize: '13px',
              marginLeft: '8px',
              outline: 'none',
              fontWeight: 600
            }}
          >
            <option value={7}>7 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
