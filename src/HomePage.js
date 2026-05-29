import React, { useState } from 'react';

/**
 * HomePage — consumes the flat JSON exported by HomePageModel Sling Model.
 *
 * Expected shape from /content/fashionstore/us/en/home.model.json:
 * {
 *   pageTitle: "Home",
 *   pageDescription: "...",
 *   hero: {
 *     pretitle: "New Collection",
 *     title: "Summer 2025",
 *     description: "...",
 *     contentAlignment: "left" | "center" | "right",
 *     imageSrc: "/content/dam/fashionstore/hero.jpg",
 *     ctaLabel: "Shop Now",
 *     ctaUrl: "/content/fashionstore/us/en/women.html"
 *   },
 *   navigation: [
 *     { title: "Women", url: "/content/fashionstore/us/en/women.html", children: [...] },
 *     ...
 *   ]
 * }
 */

const BASE_URL = process.env.REACT_APP_AEM_BASE_URL || "";

function HomePage({ data }) {
  const [activeNav, setActiveNav] = useState(null);

  // ── Guard ────────────────────────────────────────────────────────────────────
  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ fontSize: '1.2rem', opacity: 0.6 }}>No page data received from AEM.</p>
      </div>
    );
  }

  // ── Extract from flat HomePageModel JSON ─────────────────────────────────────
  const hero       = data.hero       || {};
  let navigation   = data.navigation || [];
  const pageTitle  = data.pageTitle  || 'Fashion Store';

  // In AEM, the Navigation component often returns the root page ("Home") 
  // as the single top-level item, and all actual menu pages (Men, Women, etc.) as its children.
  // We can flatten this so they all display horizontally in the React header.
  if (navigation.length === 1 && navigation[0].children && navigation[0].children.length > 0) {
    navigation = [
      { title: navigation[0].title, url: navigation[0].url },
      ...navigation[0].children
    ];
  }

  // Alignment → CSS justify-content mapping for hero content
  const alignmentMap = {
    left:   'flex-start',
    center: 'center',
    right:  'flex-end',
  };
  const heroJustify = alignmentMap[hero.contentAlignment] || 'flex-start';
  const heroTextAlign = hero.contentAlignment || 'left';

  const heroImage = hero.imageSrc || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80';

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>

      {/* ─── HEADER ─────────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 60px',
        height: '70px',
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        {/* Logo */}
        <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>
          {pageTitle}
        </div>

        {/* Nav */}
        <nav>
          {navigation.length > 0 ? (
            <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '8px' }}>
              {navigation.map((item, idx) => (
                <li
                  key={idx}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setActiveNav(idx)}
                  onMouseLeave={() => setActiveNav(null)}
                >
                  <a
                    href={item.url || '#'}
                    style={{
                      color: activeNav === idx ? '#fff' : 'rgba(255,255,255,0.75)',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      letterSpacing: '0.5px',
                      padding: '6px 16px',
                      borderRadius: '6px',
                      display: 'block',
                      transition: 'all 0.2s ease',
                      background: activeNav === idx ? 'rgba(255,255,255,0.1)' : 'transparent',
                    }}
                  >
                    {item.title}
                    {item.children && item.children.length > 0 && (
                      <span style={{ marginLeft: '4px', fontSize: '0.65rem', opacity: 0.7 }}>▾</span>
                    )}
                  </a>

                  {/* Dropdown */}
                  {item.children && item.children.length > 0 && activeNav === idx && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: '180px',
                      background: 'rgba(20,20,20,0.97)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      padding: '8px 0',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                      animation: 'fadeIn 0.15s ease',
                    }}>
                      {item.children.map((child, cIdx) => (
                        <a
                          key={cIdx}
                          href={child.url || '#'}
                          style={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.75)',
                            textDecoration: 'none',
                            padding: '10px 20px',
                            fontSize: '0.875rem',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {child.title}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Loading nav…</span>
          )}
        </nav>

        {/* Right icons (static) */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button style={iconBtnStyle} aria-label="Search">🔍</button>
          <button style={iconBtnStyle} aria-label="Cart">🛍️</button>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: heroJustify,
        overflow: 'hidden',
        paddingTop: '70px',
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          transition: 'opacity 0.5s ease',
        }} />

        {/* Overlay gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: hero.contentAlignment === 'center'
            ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)',
          zIndex: 1,
        }} />

        {/* Hero Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          padding: '0 80px',
          maxWidth: hero.contentAlignment === 'center' ? '700px' : '600px',
          textAlign: heroTextAlign,
          margin: hero.contentAlignment === 'center' ? '0 auto' : undefined,
        }}>
          {hero.pretitle && (
            <p style={{
              textTransform: 'uppercase',
              letterSpacing: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '16px',
              margin: '0 0 16px 0',
            }}>
              {hero.pretitle}
            </p>
          )}

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            margin: '0 0 24px 0',
            letterSpacing: '-1px',
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            {hero.title || pageTitle}
          </h1>

          {hero.description && (
            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.8)',
              margin: '0 0 36px 0',
              maxWidth: '480px',
            }}>
              {hero.description}
            </p>
          )}

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: hero.contentAlignment === 'center' ? 'center' : 'flex-start' }}>
            {hero.ctaLabel && (
              <a href={hero.ctaUrl || '#'} style={primaryCtaStyle}>
                {hero.ctaLabel}
              </a>
            )}
            <a href="#collections" style={secondaryCtaStyle}>
              Explore Collections
            </a>
          </div>
        </div>
      </section>

      {/* ─── GLOBAL STYLES (keyframes) ──────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── Style constants ────────────────────────────────────────────────────────────

const iconBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.1rem',
  padding: '4px',
  opacity: 0.8,
  transition: 'opacity 0.2s',
};

const primaryCtaStyle = {
  display: 'inline-block',
  padding: '14px 36px',
  background: '#fff',
  color: '#000',
  textDecoration: 'none',
  fontWeight: 700,
  fontSize: '0.9rem',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  borderRadius: '50px',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 30px rgba(255,255,255,0.25)',
};

const secondaryCtaStyle = {
  display: 'inline-block',
  padding: '14px 36px',
  background: 'transparent',
  color: '#fff',
  border: '2px solid rgba(255,255,255,0.6)',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  borderRadius: '50px',
  transition: 'all 0.3s ease',
};

export default HomePage;
