import React, { useState, useEffect } from 'react';
import TextType from './TextType';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [showSubHeading, setShowSubHeading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Trigger subheading after track heading starts/finishes
  const handleTrackHeadingComplete = () => {
    setShowSubHeading(true);
  };

  const handleTitleComplete = () => {
    setShowButton(true);
    // Auto-proceed into application 1.4s after typing finishes
    const timer = setTimeout(() => {
      handleProceed();
    }, 1400);
    return () => clearTimeout(timer);
  };

  const handleProceed = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#070B14',
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 20% 70%, rgba(59, 130, 246, 0.10) 0%, transparent 50%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#FFFFFF',
        fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFadingOut ? 'none' : 'all',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .splash-glow-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 999px;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.3);
          box-shadow: 0 0 24px rgba(99, 102, 241, 0.2);
          margin-bottom: 24px;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #A5B4FC;
          animation: pulseGlow 3s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); border-color: rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 35px rgba(16, 185, 129, 0.35); border-color: rgba(16, 185, 129, 0.4); color: #6EE7B7; }
        }

        .splash-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(36px, 6vw, 68px);
          font-weight: 900;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #FFFFFF 0%, #E0E7FF 40%, #10B981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          margin: 0;
          line-height: 1.15;
          min-height: 1.2em;
          filter: drop-shadow(0 4px 20px rgba(16, 185, 129, 0.25));
        }

        .splash-track {
          font-family: 'Orbitron', 'Space Grotesk', sans-serif;
          font-size: clamp(18px, 2.5vw, 26px);
          font-weight: 800;
          letter-spacing: 2px;
          color: #38BDF8;
          text-transform: uppercase;
          margin-bottom: 14px;
          text-align: center;
          min-height: 1.4em;
          filter: drop-shadow(0 2px 10px rgba(56, 189, 248, 0.3));
        }

        .splash-btn {
          margin-top: 36px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          border-radius: 12px;
          background: linear-gradient(135deg, #4F46E5 0%, #10B981 100%);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          border: none;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(79, 70, 229, 0.4);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .splash-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 36px rgba(16, 185, 129, 0.5);
        }

        .splash-skip {
          position: absolute;
          top: 28px;
          right: 32px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #94A3B8;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .splash-skip:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
        }
      `}</style>

      {/* Top Skip Button */}
      <button onClick={handleProceed} className="splash-skip">
        Skip Intro &rarr;
      </button>

      {/* Center Container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '850px', width: '100%', textAlign: 'center' }}>
        
        {/* Glow Badge */}
        <div className="splash-glow-badge">
          <Zap size={15} color="#38BDF8" />
          <span>Razorpay AI Buildathon 2026</span>
        </div>

        {/* Track Heading: Razorpay - Buildathon Track 04 */}
        <div className="splash-track">
          <TextType
            text="Razorpay - Buildathon Track 04"
            typingSpeed={40}
            initialDelay={200}
            loop={false}
            showCursor={!showSubHeading}
            cursorCharacter="|"
            cursorClassName="text-cyan-400"
            onSentenceComplete={handleTrackHeadingComplete}
          />
        </div>

        {/* Main Title: Finance Wizard */}
        {showSubHeading ? (
          <h1 className="splash-title">
            <TextType
              text="Finance Wizard"
              typingSpeed={55}
              initialDelay={150}
              loop={false}
              showCursor={true}
              cursorCharacter="▍"
              onSentenceComplete={handleTitleComplete}
            />
          </h1>
        ) : (
          <div style={{ minHeight: '1.2em' }} />
        )}

        {/* Tagline */}
        <p
          style={{
            fontSize: '15px',
            color: '#94A3B8',
            marginTop: '18px',
            marginBottom: '0',
            fontWeight: 500,
            letterSpacing: '0.5px',
            opacity: showButton ? 1 : 0,
            transform: showButton ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          Autonomous 4-Pass Settlement Reconciliation &amp; AI Cash Controller
        </p>

        {/* Enter Button */}
        <div
          style={{
            opacity: showButton ? 1 : 0,
            transform: showButton ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <button onClick={handleProceed} className="splash-btn">
            <span>Enter Finance Wizard</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>

      {/* Bottom Footer Credits */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          fontSize: '12.5px',
          color: '#64748B',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <ShieldCheck size={14} color="#10B981" />
        <span>Enterprise AES-256 Multi-Source Audit Engine</span>
      </div>
    </div>
  );
}
