import React from 'react';
import { useRecon } from '../context/ReconContext';

export default function AuthorConnectCard() {
  const { theme } = useRecon();
  const isDark = theme === 'dark';

  return (
    <div
      className="card-base"
      style={{
        padding: '28px 32px',
        background: isDark
          ? 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(16,185,129,0.06) 100%)'
          : 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(16,185,129,0.04) 100%)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Space+Grotesk:wght@400;500;600&display=swap');

        .author-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 0 4px 0;
          text-align: center;
        }

        .author-name {
          font-family: 'Orbitron', 'Inter', sans-serif;
          font-size: 32px;
          font-weight: 900;
          letter-spacing: 3px;
          color: var(--text-main);
          margin-bottom: 0px;
          text-transform: uppercase;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary, #8B5CF6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .author-title {
          font-family: 'Space Grotesk', 'Inter', sans-serif;
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 24px;
          letter-spacing: 0.5px;
          font-weight: 500;
        }

        .author-social-list {
          display: flex;
          gap: 18px;
          justify-content: center;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .author-social-list li {
          list-style: none;
        }

        .author-social-list li a {
          width: 66px;
          height: 66px;
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
          border: 3px solid #e5e7eb;
          z-index: 1;
          transition: border-color 0.4s, transform 0.2s, box-shadow 0.3s;
          text-decoration: none;
          box-shadow: 0 2px 12px rgba(0,0,0,0.10);
        }

        .author-social-list li a:before {
          content: "";
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 100%;
          transition: top 0.4s ease;
          z-index: 2;
        }

        .author-social-list li a:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          border-color: transparent;
        }

        .author-social-list li a:hover:before {
          top: 0;
        }

        .author-social-list li.soc-linkedin a:before { background: #0077b5; }
        .author-social-list li.soc-gmail    a:before { background: #dd4b39; }
        .author-social-list li.soc-github   a:before { background: #24292e; }
        .author-social-list li.soc-instagram a:before {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
        }
        .author-social-list li.soc-portfolio a:before {
          background: linear-gradient(135deg, #6366F1 0%, #3B82F6 50%, #10B981 100%);
        }

        .author-social-list li a .social-icon {
          position: relative;
          z-index: 3;
          width: 28px;
          height: 28px;
          fill: #374151;
          transition: fill 0.4s ease-out, transform 0.5s ease-out;
        }

        .author-social-list li a:hover .social-icon {
          fill: #fff;
          transform: rotateY(360deg);
        }

        .author-divider {
          width: 48px;
          height: 3px;
          border-radius: 99px;
          background: linear-gradient(90deg, var(--primary), var(--secondary, #8B5CF6));
          margin: 0 auto 20px auto;
        }
      `}</style>

      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
          Connect with the Author
        </h3>
      </div>
      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
        Reach out for collaboration, feedback, or just to say hello.
      </p>

      {/* Content */}
      <div className="author-card-content">
        <div className="author-name">MADAN KK</div>
        <div className="author-title">Product Developer | Finance Wizard</div>

        <ul className="author-social-list">
          {/* LinkedIn */}
          <li className="soc-linkedin">
            <a href="https://www.linkedin.com/in/madankk04122004/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </li>

          {/* Gmail */}
          <li className="soc-gmail">
            <a href="mailto:madankk2004@gmail.com" title="Gmail">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.39l-9 5.86-9-5.86V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.85.65-1.5 1.5-1.5H3l9 6.2 9-6.2h1.5c.85 0 1.5.65 1.5 1.5z"/>
              </svg>
            </a>
          </li>

          {/* GitHub */}
          <li className="soc-github">
            <a href="https://github.com/Madankk-06" target="_blank" rel="noopener noreferrer" title="GitHub">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </li>

          {/* Instagram */}
          <li className="soc-instagram">
            <a href="https://www.instagram.com/__.madan___?igsh=NThiOGZvMndlZG9x" target="_blank" rel="noopener noreferrer" title="Instagram">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </li>

          {/* Portfolio Website */}
          <li className="soc-portfolio">
            <a href="https://madan-portfolio-orcin.vercel.app/" target="_blank" rel="noopener noreferrer" title="Personal Portfolio">
              <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
