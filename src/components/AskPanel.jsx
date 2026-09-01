import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';
import { useRecon } from '../context/ReconContext';
import { ASK_SUGGESTIONS } from '../data/mockData';

export default function AskPanel({ compact = false }) {
  const { chatMessages, askQuestion, openOrderDrawer, theme, isReconciled } = useRecon();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const activeSuggestions = isReconciled ? [
    "What is our total gross inflow and net bank realization?",
    "Why was ORD1055 escalated and how much is missing?",
    "How much money is locked in partial payments and disputes?",
    "Show me a breakdown of all fee and tax deductions.",
    "Which orders experienced settlement delays greater than 5 days?",
    "How many orders were matched via lumped batch settlements?"
  ] : [
    "What files do I need to upload?",
    "How does the deterministic match engine work?",
    "What is the 11-priority classification rule hierarchy?",
    "How does Finance Wizard protect sensitive banking data?"
  ];

  const isDark = theme === 'dark';

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    askQuestion(inputText);
    setInputText("");
  };

  const handleChipClick = (suggestion) => {
    askQuestion(suggestion);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="card-base" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      height: compact ? '100%' : 'auto',
      minHeight: compact ? '400px' : 'auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: '#0F172A',
            border: '1px solid var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src="/logo.png" alt="Finance Wizard" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
            Ask Finance Wizard
          </h3>
        </div>
        <span className="badge-beta">Beta</span>
      </div>

      {/* Suggestion Chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
        {activeSuggestions.slice(0, compact ? 4 : 6).map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-strong)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              textAlign: 'left'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-active-nav)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-input)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <div style={{
        flex: 1,
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '16px',
        maxHeight: compact ? '200px' : '380px',
        overflowY: 'auto',
        marginBottom: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '92%',
              backgroundColor: msg.sender === 'user' ? (isDark ? '#1E2B45' : '#E0F2FE') : (isDark ? '#162032' : '#FFFFFF'),
              border: msg.sender === 'user' ? '1px solid var(--border-strong)' : '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '14px',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '12.5px',
                fontWeight: 800,
                color: msg.sender === 'user' ? 'var(--primary)' : 'var(--tertiary)'
              }}>
                {msg.sender === 'user' ? 'You' : 'Finance Wizard'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{msg.time}</span>
            </div>
            
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
              {msg.text}
            </div>

            {msg.relatedOrder && (
              <button
                onClick={() => openOrderDrawer(msg.relatedOrder)}
                style={{
                  marginTop: '10px',
                  backgroundColor: 'var(--bg-active-nav)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Drill down into {msg.relatedOrder.orderId}</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Ask about this batch…"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-strong)',
            borderRadius: '8px',
            padding: '10px 16px',
            color: 'var(--text-main)',
            fontSize: '14px',
            outline: 'none'
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
        <button
          type="submit"
          disabled={!inputText.trim()}
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            width: '46px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'not-allowed',
            opacity: inputText.trim() ? 1 : 0.45,
            boxShadow: '0 2px 8px var(--primary-glow)'
          }}
        >
          <Send size={17} />
        </button>
      </form>
    </div>
  );
}
