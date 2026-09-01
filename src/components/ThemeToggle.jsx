import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useRecon } from '../context/ReconContext';

export default function ThemeToggle({ compact = false, showLabel = true }) {
  const { theme, toggleTheme } = useRecon();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: compact ? '8px' : '9px 16px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-strong)',
        borderRadius: '8px',
        color: 'var(--text-main)',
        fontSize: '13.5px',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
        userSelect: 'none'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.transform = 'none';
      }}
    >
      {isDark ? (
        <>
          <Sun size={17} color="#FBBF24" style={{ flexShrink: 0 }} />
          {showLabel && <span>Light Mode</span>}
        </>
      ) : (
        <>
          <Moon size={17} color="#6366F1" style={{ flexShrink: 0 }} />
          {showLabel && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );
}
