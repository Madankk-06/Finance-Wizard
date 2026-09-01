import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  LayoutDashboard, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  ShieldAlert,
  BrainCircuit,
  Bot,
  FileBarChart,
  Settings,
  LogOut,
  BookOpen
} from 'lucide-react';
import { useRecon } from '../context/ReconContext';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearFiles, theme, kpiData, isReconciled } = useRecon();
  const [dashboardOpen, setDashboardOpen] = useState(true);

  const isDashboardActive = location.pathname.startsWith('/dashboard');
  const escalateCount = isReconciled ? (kpiData?.escalateCount || 0) : 0;

  const handleLogout = () => {
    if (window.confirm("Do you want to reset the reconciliation session and return to Upload?")) {
      clearFiles();
      navigate('/upload');
    }
  };

  return (
    <aside style={{
      width: '290px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      flexShrink: 0,
      userSelect: 'none',
      boxShadow: '2px 0 12px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '28px 24px 22px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-sidebar)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid var(--border-strong)',
            backgroundColor: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src="/logo.png" alt="Finance Wizard Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '19px', fontWeight: 700, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Finance Wizard
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0', fontWeight: 500 }}>
              Close the reconciliation loop
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav style={{ flex: 1, padding: '20px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Upload & Start */}
        <NavLink
          to="/upload"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '9px',
            color: isActive ? 'var(--active-nav-text)' : 'var(--text-secondary)',
            backgroundColor: isActive ? 'var(--bg-active-nav)' : 'transparent',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive ? 700 : 600,
            borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          {({ isActive }) => (
            <>
              <UploadCloud size={20} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>Upload & Start</span>
            </>
          )}
        </NavLink>

        {/* Dashboard Parent + Sub-routes */}
        <div style={{ marginTop: '2px' }}>
          <div
            onClick={() => setDashboardOpen(!dashboardOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '9px',
              cursor: 'pointer',
              color: isDashboardActive ? 'var(--active-nav-text)' : 'var(--text-secondary)',
              backgroundColor: isDashboardActive && !dashboardOpen ? 'var(--bg-active-nav)' : 'transparent',
              fontSize: '15px',
              fontWeight: 700,
              transition: 'background-color 0.15s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <LayoutDashboard size={20} color={isDashboardActive ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>Dashboard</span>
            </div>
            {dashboardOpen ? <ChevronDown size={17} color="var(--text-muted)" /> : <ChevronRight size={17} color="var(--text-muted)" />}
          </div>

          {/* Sub Navigation Items */}
          {dashboardOpen && (
            <div style={{ paddingLeft: '28px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <NavLink
                to="/dashboard"
                end
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '7px',
                  color: isActive ? 'var(--active-nav-text)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-active-subnav)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                })}
              >
                <span>Overview</span>
              </NavLink>

              <NavLink
                to="/dashboard/transactions"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '7px',
                  color: isActive ? 'var(--active-nav-text)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-active-subnav)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                })}
              >
                <span>Transactions</span>
              </NavLink>

              <NavLink
                to="/dashboard/cash"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '7px',
                  color: isActive ? 'var(--active-nav-text)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-active-subnav)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                })}
              >
                <span>Cash Position</span>
              </NavLink>

              <NavLink
                to="/dashboard/exceptions"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '7px',
                  color: isActive ? 'var(--active-nav-text)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-active-subnav)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                })}
              >
                <span>Exceptions & Escalations</span>
              </NavLink>

              {/* <NavLink
                to="/dashboard/ask"
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  borderRadius: '7px',
                  color: isActive ? 'var(--active-nav-text)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-active-subnav)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                })}
              >
                <span>Ask Finance Wizard</span>
              </NavLink> */}
            </div>
          )}
        </div>

        {/* Escalation Queue */}
        <NavLink
          to="/escalation"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '9px',
            color: isActive ? 'var(--status-escalate-badge)' : 'var(--text-secondary)',
            backgroundColor: isActive ? 'var(--status-escalate-badge-bg)' : 'transparent',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive ? 700 : 600,
            borderLeft: isActive ? '4px solid var(--status-escalate-badge)' : '4px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldAlert size={20} color="var(--status-escalate-badge)" />
            <span>Escalation Queue</span>
          </div>
          {escalateCount > 0 && (
            <span style={{
              backgroundColor: 'var(--status-escalate-bg)',
              color: 'var(--status-escalate)',
              border: '1px solid var(--status-escalate-border)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800
            }}>{escalateCount}</span>
          )}
        </NavLink>

        {/* Financial Memory */}
        <NavLink
          to="/memory"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '9px',
            color: isActive ? 'var(--active-nav-text)' : 'var(--text-secondary)',
            backgroundColor: isActive ? 'var(--bg-active-nav)' : 'transparent',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive ? 700 : 600,
            borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          <BrainCircuit size={20} color="var(--secondary)" />
          <span>Financial Memory</span>
        </NavLink>

        {/* Finance Agent */}
        <NavLink
          to="/finance-agent"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '9px',
            color: isActive ? 'var(--active-nav-text)' : 'var(--text-secondary)',
            backgroundColor: isActive ? 'var(--bg-active-nav)' : 'transparent',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive ? 700 : 600,
            borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bot size={20} color="var(--primary)" />
            <span>Finance Agent</span>
          </div>
          <span className="badge-beta">Beta</span>
        </NavLink>

        {/* Reports & Analytics */}
        <NavLink
          to="/reports"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '9px',
            color: isActive ? 'var(--active-nav-text)' : 'var(--text-secondary)',
            backgroundColor: isActive ? 'var(--bg-active-nav)' : 'transparent',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive ? 700 : 600,
            borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          {({ isActive }) => (
            <>
              <FileBarChart size={20} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>Reports</span>
            </>
          )}
        </NavLink>

        {/* Guide */}
        <NavLink
          to="/guide"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '9px',
            color: isActive ? 'var(--active-nav-text)' : 'var(--text-secondary)',
            backgroundColor: isActive ? 'var(--bg-active-nav)' : 'transparent',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive ? 700 : 600,
            borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          {({ isActive }) => (
            <>
              <BookOpen size={20} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>Guide</span>
            </>
          )}
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '9px',
            color: isActive ? 'var(--active-nav-text)' : 'var(--text-secondary)',
            backgroundColor: isActive ? 'var(--bg-active-nav)' : 'transparent',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: isActive ? 700 : 600,
            borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
            transition: 'all 0.15s ease'
          })}
        >
          {({ isActive }) => (
            <>
              <Settings size={20} color={isActive ? 'var(--primary)' : 'var(--text-muted)'} />
              <span>Settings</span>
            </>
          )}
        </NavLink>
      </nav>

      {/* Footer with Theme Toggle & Logout */}
      <div style={{
        padding: '18px 20px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Theme Toggle Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%' }}>
            <ThemeToggle showLabel={true} />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '14.5px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '6px 4px',
            textAlign: 'left',
            transition: 'color 0.15s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--status-escalate)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
