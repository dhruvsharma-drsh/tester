'use client';

import React, { useState, useEffect } from 'react';

export default function WidgetTester() {
  const [scriptInput, setScriptInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('frosty_test_script');
    if (saved) {
      setScriptInput(saved);
      setIsActive(true);
      injectScript(saved);
    }
  }, []);

  const injectScript = (htmlStr: string) => {
    try {
      const matchSrc = htmlStr.match(/src=["'](.*?)['"]/);
      const dataRegex = /data-([a-zA-Z0-9-]+)=["'](.*?)['"]/g;
      const dataset: Record<string, string> = {};
      let match;
      while ((match = dataRegex.exec(htmlStr)) !== null) {
        dataset[match[1]] = match[2];
      }
      if (!matchSrc) {
        setError('Could not find a valid src attribute in the script tag.');
        return;
      }
      const script = document.createElement('script');
      script.src = matchSrc[1];
      script.async = true;
      Object.keys(dataset).forEach((key) => {
        const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        script.dataset[camelKey] = dataset[key];
      });
      document.body.appendChild(script);
      setError('');
    } catch (e) {
      console.error('Failed to parse script', e);
      setError('Invalid script format. Please check your syntax.');
    }
  };

  const handleLoad = () => {
    if (!scriptInput.trim()) return;
    localStorage.setItem('frosty_test_script', scriptInput);
    window.location.reload();
  };

  const handleClear = () => {
    localStorage.removeItem('frosty_test_script');
    window.location.reload();
  };

  const handleCopy = () => {
    if (!scriptInput) return;
    navigator.clipboard.writeText(scriptInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#080808',
        color: '#f0f0f0',
        fontFamily: "'Inter', 'Geist Sans', system-ui, sans-serif",
      }}
    >

      {/* LEFT PANEL */}
      <aside
        style={{
          width: 380,
          minWidth: 380,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0c0c0c',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.7)',
          overflowY: 'auto',
        }}
      >
        {/* Brand header */}
        <div
          style={{
            padding: '28px 28px 22px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36, height: 36,
                background: 'linear-gradient(135deg, #c9a84c 0%, #7a5c1e 100%)',
                borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 800, color: '#080808',
                boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
                flexShrink: 0,
              }}
            >
              F
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.01em', color: '#f0f0f0' }}>
                Frosty Tester
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em', marginTop: 2 }}>
                Widget Sandbox
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div
          style={{
            padding: '10px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.01)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6, height: 6,
              borderRadius: '50%',
              background: isActive ? '#4ade80' : 'rgba(255,255,255,0.15)',
              boxShadow: isActive ? '0 0 8px #4ade80' : 'none',
            }}
          />
          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
            {isActive ? 'Widget active' : 'No widget loaded'}
          </span>
          {isActive && (
            <span
              style={{
                marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.1em', color: '#4ade80',
                background: 'rgba(74,222,128,0.07)',
                padding: '2px 8px', borderRadius: 4,
                border: '1px solid rgba(74,222,128,0.14)',
                textTransform: 'uppercase' as const,
              }}
            >
              LIVE
            </span>
          )}
        </div>

        {/* Controls */}
        <div style={{ padding: '24px 28px', flex: 1 }}>
          {/* Description */}
          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.33)', lineHeight: 1.75, marginBottom: 20 }}>
            Paste your HTML widget{' '}
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(201,168,76,0.65)', fontSize: 11 }}>
              &lt;script&gt;
            </code>{' '}
            tag below to inject and preview it on the mock page.
          </p>

          {/* Section label */}
          <div
            style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' as const,
              marginBottom: 8,
            }}
          >
            Embed Script
          </div>

          {/* Code editor box */}
          <div
            style={{
              background: '#111',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 14,
            }}
          >
            {/* Editor titlebar */}
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.025)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
                  <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.65 }} />
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', fontFamily: 'JetBrains Mono, monospace' }}>
                  widget.html
                </span>
                <button
                  onClick={handleCopy}
                  style={{
                    fontSize: 10, fontWeight: 700,
                    color: copied ? '#c9a84c' : 'rgba(255,255,255,0.25)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    letterSpacing: '0.08em', transition: 'color 0.2s',
                    fontFamily: 'inherit',
                    padding: 0,
                  }}
                >
                  {copied ? '✓ COPIED' : 'COPY'}
                </button>
              </div>
            </div>
            {/* Textarea */}
            <textarea
              id="script-input"
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              placeholder={`<script\n  src="https://cdn.example.com/widget.js"\n  data-key="your-api-key"\n></script>`}
              spellCheck={false}
              style={{
                width: '100%', height: 190,
                background: 'transparent', border: 'none', resize: 'none',
                padding: '14px 16px',
                fontSize: 12.5,
                fontFamily: 'JetBrains Mono, monospace',
                color: '#d4a853', lineHeight: 1.7,
                outline: 'none', caretColor: '#c9a84c',
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: '10px 14px', borderRadius: 8, marginBottom: 12,
                background: 'rgba(238,85,85,0.06)',
                border: '1px solid rgba(238,85,85,0.14)',
                color: '#f87171', fontSize: 12,
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}
            >
              <span style={{ flexShrink: 0 }}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <button
              id="load-widget-btn"
              onClick={handleLoad}
              disabled={!scriptInput.trim()}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 10, border: 'none',
                background: scriptInput.trim()
                  ? 'linear-gradient(135deg, #c9a84c 0%, #9a7a30 100%)'
                  : 'rgba(255,255,255,0.05)',
                color: scriptInput.trim() ? '#080808' : 'rgba(255,255,255,0.18)',
                fontWeight: 700, fontSize: 13, cursor: scriptInput.trim() ? 'pointer' : 'not-allowed',
                letterSpacing: '0.03em',
                boxShadow: scriptInput.trim() ? '0 4px 20px rgba(201,168,76,0.22)' : 'none',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              {isActive ? '↻  Reload Widget' : '▶  Load Widget'}
            </button>

            {isActive && (
              <button
                id="remove-widget-btn"
                onClick={handleClear}
                style={{
                  padding: '12px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                ✕  Remove
              </button>
            )}
          </div>

          {/* How it works */}
          <div
            style={{
              padding: '14px 16px',
              background: 'rgba(201,168,76,0.03)',
              border: '1px solid rgba(201,168,76,0.09)',
              borderRadius: 10,
            }}
          >
            <div
              style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                color: 'rgba(201,168,76,0.45)', textTransform: 'uppercase' as const, marginBottom: 8,
              }}
            >
              How it works
            </div>
            {[
              'Paste your <script> embed tag above',
              'Click Load Widget to inject it',
              'Interact with the preview on the right',
              'Script persists across page refreshes',
            ].map((step, i) => (
              <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', lineHeight: 1.9, display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ color: 'rgba(201,168,76,0.35)', fontWeight: 700, fontSize: 10, flexShrink: 0 }}>{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 28px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>Frosty Agent © 2025</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.12)' }}>v0.1.0</span>
        </div>
      </aside>

      {/* RIGHT PANEL: Mock Website */}
      <main
        style={{
          flex: 1, overflowY: 'auto', position: 'relative',
          background: '#0a0a0a',
        }}
      >
        {/* Subtle gold ambient glow */}
        <div
          style={{
            position: 'fixed', top: 0, right: 0, width: '50%', height: '40vh',
            background: 'radial-gradient(ellipse at 80% 0%, rgba(201,168,76,0.035) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px 120px' }}>

          {/* Nav */}
          <nav
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '28px 0',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              marginBottom: 68,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 26, height: 26,
                  background: 'linear-gradient(135deg, #c9a84c, #7a5c1e)',
                  borderRadius: 6,
                }}
              />
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '0.14em', color: '#f0f0f0' }}>
                LUMIÈRE
              </span>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {['Shop', 'Collections', 'Editorial', 'About'].map((link) => (
                <span
                  key={link}
                  style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.32)',
                    cursor: 'pointer', letterSpacing: '0.04em',
                    fontWeight: 500, transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLSpanElement).style.color = '#f0f0f0'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLSpanElement).style.color = 'rgba(255,255,255,0.32)'; }}
                >
                  {link}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                style={{
                  padding: '8px 18px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 8, color: 'rgba(255,255,255,0.45)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  letterSpacing: '0.05em', fontFamily: 'inherit',
                }}
              >
                Sign in
              </button>
              <button
                style={{
                  padding: '8px 18px',
                  background: 'linear-gradient(135deg, #c9a84c, #9a7a30)',
                  border: 'none', borderRadius: 8,
                  color: '#080808', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.05em',
                  boxShadow: '0 4px 16px rgba(201,168,76,0.18)',
                  fontFamily: 'inherit',
                }}
              >
                Shop Now
              </button>
            </div>
          </nav>

          {/* Hero */}
          <header style={{ marginBottom: 80 }}>
            <div
              style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                color: '#c9a84c', textTransform: 'uppercase' as const,
                marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <span style={{ display: 'inline-block', width: 28, height: 1, background: '#c9a84c', opacity: 0.6 }} />
              New Collection 2025
            </div>
            <h1
              style={{
                fontSize: 'clamp(38px, 5.5vw, 68px)',
                fontWeight: 800, lineHeight: 1.07,
                letterSpacing: '-0.025em', color: '#f0f0f0', marginBottom: 22,
              }}
            >
              Elevate your<br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #e6c76a 0%, #c9a84c 50%, #9e7c2c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                everyday style.
              </span>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.36)', maxWidth: 500, lineHeight: 1.82, marginBottom: 34 }}>
              Discover our latest collection of premium minimalist accessories designed for the modern professional.
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              <button
                style={{
                  padding: '13px 30px',
                  background: 'linear-gradient(135deg, #c9a84c, #9a7a30)',
                  border: 'none', borderRadius: 10,
                  color: '#080808', fontWeight: 700, fontSize: 14,
                  cursor: 'pointer', letterSpacing: '0.04em',
                  boxShadow: '0 6px 24px rgba(201,168,76,0.22)',
                  fontFamily: 'inherit',
                }}
              >
                Explore Collection →
              </button>
              <button
                style={{
                  padding: '13px 30px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 10, color: 'rgba(255,255,255,0.45)',
                  fontWeight: 600, fontSize: 14,
                  cursor: 'pointer', letterSpacing: '0.04em',
                  fontFamily: 'inherit',
                }}
              >
                Watch Film
              </button>
            </div>
          </header>

          {/* Products header */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 26,
            }}
          >
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' as const, marginBottom: 4 }}>
                Featured Products
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#f0f0f0' }}>New Arrivals</div>
            </div>
            <span style={{ fontSize: 12, color: '#c9a84c', cursor: 'pointer', fontWeight: 600 }}>View all →</span>
          </div>

          {/* Product cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 56 }}>
            {[
              { name: 'Onyx Minimalist Watch', price: '$299.00', tag: 'New' },
              { name: 'Carbon Leather Wallet', price: '$89.00', tag: 'Best Seller' },
              { name: 'Obsidian Sunglasses', price: '$189.00', tag: 'Limited' },
            ].map((item, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    aspectRatio: '4/5',
                    background: 'linear-gradient(145deg, #141414 0%, #0f0f0f 100%)',
                    position: 'relative', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 72, height: 72,
                      background: 'rgba(201,168,76,0.05)',
                      borderRadius: '50%',
                      border: '1px solid rgba(201,168,76,0.1)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute', top: 12, left: 12,
                      padding: '3px 9px',
                      background: 'rgba(201,168,76,0.1)',
                      border: '1px solid rgba(201,168,76,0.18)',
                      borderRadius: 4, fontSize: 10, fontWeight: 700,
                      color: '#c9a84c', letterSpacing: '0.09em',
                      textTransform: 'uppercase' as const,
                    }}
                  >
                    {item.tag}
                  </div>
                </div>
                <div style={{ padding: '14px 16px 18px' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#f0f0f0', marginBottom: 10 }}>
                    {item.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#c9a84c' }}>{item.price}</span>
                    <button
                      style={{
                        padding: '5px 12px',
                        background: 'rgba(201,168,76,0.07)',
                        border: '1px solid rgba(201,168,76,0.14)',
                        borderRadius: 6, color: '#c9a84c',
                        fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        letterSpacing: '0.04em', fontFamily: 'inherit',
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Promo strip */}
          <div
            style={{
              padding: '32px 36px',
              background: 'rgba(201,168,76,0.03)',
              border: '1px solid rgba(201,168,76,0.08)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 24, marginBottom: 80,
            }}
          >
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#f0f0f0', marginBottom: 5 }}>
                Free shipping on orders over{' '}
                <span style={{ color: '#c9a84c' }}>$150</span>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                Worldwide delivery · 30-day returns · Premium packaging
              </div>
            </div>
            <button
              style={{
                padding: '11px 26px', flexShrink: 0,
                background: 'linear-gradient(135deg, #c9a84c, #9a7a30)',
                border: 'none', borderRadius: 10,
                color: '#080808', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', letterSpacing: '0.04em', fontFamily: 'inherit',
              }}
            >
              Learn More
            </button>
          </div>

          <div style={{ height: 200 }} />
        </div>
      </main>
    </div>
  );
}
