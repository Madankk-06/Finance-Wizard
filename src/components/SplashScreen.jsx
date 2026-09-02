import React, { useState } from 'react';
import TextType from './TextType';
import { ShieldCheck, Zap } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [showSubHeading, setShowSubHeading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Trigger title typing after track heading finishes
  const handleTrackHeadingComplete = () => {
    setShowSubHeading(true);
  };

  // Auto-proceed into application once the full text animation completes
  const handleTitleComplete = () => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 600);
    }, 1200);
    return () => clearTimeout(timer);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#FFFFFF',
        backgroundImage: `
          radial-gradient(circle at 50% 25%, rgba(2, 132, 199, 0.08) 0%, transparent 60%),
          radial-gradient(circle at 85% 85%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 15% 75%, rgba(14, 165, 233, 0.06) 0%, transparent 50%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#0F172A',
        fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.02)' : 'scale(1)',
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
          background: #E0F2FE;
          border: 1px solid #BAE6FD;
          box-shadow: 0 2px 12px rgba(2, 132, 199, 0.12);
          margin-bottom: 26px;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #0284C7;
        }

        .splash-track {
          font-family: 'Orbitron', 'Space Grotesk', sans-serif;
          font-size: clamp(18px, 2.5vw, 26px);
          font-weight: 800;
          letter-spacing: 2px;
          color: #0284C7;
          text-transform: uppercase;
          margin-bottom: 14px;
          text-align: center;
          min-height: 1.4em;
        }

        .splash-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(38px, 6.5vw, 72px);
          font-weight: 900;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0284C7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          margin: 0;
          line-height: 1.15;
          min-height: 1.2em;
        }

        .cursor-light-primary {
          color: #0284C7 !important;
          font-weight: 900;
        }
      `}</style>

      {/* Center Container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '900px', width: '100%', textAlign: 'center' }}>
        
        {/* Badge */}
        <div className="splash-glow-badge">
          <Zap size={15} color="#0284C7" />
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
            cursorClassName="cursor-light-primary"
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
              cursorClassName="cursor-light-primary"
              onSentenceComplete={handleTitleComplete}
            />
          </h1>
        ) : (
          <div style={{ minHeight: '1.2em' }} />
        )}

        {/* Subtitle Tagline */}
        <p
          style={{
            fontSize: '15.5px',
            color: '#64748B',
            marginTop: '20px',
            marginBottom: '0',
            fontWeight: 500,
            letterSpacing: '0.4px',
            opacity: showSubHeading ? 1 : 0,
            transform: showSubHeading ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          Autonomous 4-Pass Settlement Reconciliation &amp; AI Cash Controller
        </p>

      </div>

      {/* Bottom Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '26px',
          fontSize: '13px',
          color: '#94A3B8',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 500,
        }}
      >
        <ShieldCheck size={15} color="#0284C7" />
        <span>Enterprise AES-256 Multi-Source Audit Engine</span>
      </div>
    </div>
  );
}
