import React, { useState } from 'react';

function HomePage({ data }) {
  const [activeNav, setActiveNav] = useState(null);

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ fontSize: '1.2rem', opacity: 0.6 }}>No page data received from AEM.</p>
      </div>
    );
  }

  const hero = data.hero || {};
  let navigation = data.navigation || [];
  const pageTitle = data.pageTitle || 'Fashion Store';
  const categories = data.featuredCategories || [];
  const products = data.trendingProducts || [];
  const newsletter = data.newsletter || {};

  if (navigation.length === 1 && navigation[0].children && navigation[0].children.length > 0) {
    navigation = [
      { title: navigation[0].title, url: navigation[0].url },
      ...navigation[0].children
    ];
  }

  const alignmentMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
  const heroJustify = alignmentMap[hero.contentAlignment] || 'flex-start';
  const heroTextAlign = hero.contentAlignment || 'left';
  const heroImage = hero.imageSrc || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80';

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#fafafa', minHeight: '100vh', color: '#111' }}>
      
      {/* ─── HEADER ─── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 60px', height: '70px',
        background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', color: '#000' }}>
          {pageTitle}
        </div>
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '24px' }}>
            {navigation.map((item, idx) => (
              <li key={idx} style={{ position: 'relative' }} onMouseEnter={() => setActiveNav(idx)} onMouseLeave={() => setActiveNav(null)}>
                <a href={item.url || '#'} style={{
                  color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
                  textTransform: 'uppercase', letterSpacing: '1px', transition: 'color 0.2s ease'
                }}>
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button style={iconBtnStyle}>🔍</button>
          <button style={iconBtnStyle}>🛍️</button>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section style={{
        position: 'relative', height: '90vh', display: 'flex', alignItems: 'center',
        justifyContent: heroJustify, overflow: 'hidden', paddingTop: '70px',
      }}>
        <div style={{
          position: 'absolute', inset: 0, backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1 }} />
        
        <div style={{
          position: 'relative', zIndex: 2, padding: '0 80px',
          maxWidth: '700px', textAlign: heroTextAlign, margin: hero.contentAlignment === 'center' ? '0 auto' : undefined,
        }}>
          {hero.pretitle && <p style={{ textTransform: 'uppercase', letterSpacing: '4px', fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>{hero.pretitle}</p>}
          <h1 style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 24px 0', color: '#fff' }}>{hero.title}</h1>
          {hero.description && <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', margin: '0 0 40px 0', maxWidth: '500px' }}>{hero.description}</p>}
          <div style={{ display: 'flex', gap: '16px', justifyContent: heroTextAlign === 'center' ? 'center' : 'flex-start' }}>
            {hero.ctaLabel && <a href={hero.ctaUrl || '#'} style={primaryCtaStyle}>{hero.ctaLabel}</a>}
          </div>
        </div>
      </section>

      {/* ─── FEATURED CATEGORIES ─── */}
      {categories.length > 0 && (
        <section style={{ padding: '80px 60px', background: '#fff' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '50px', textTransform: 'uppercase', letterSpacing: '1px' }}>Shop by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {categories.map((cat, i) => (
              <a href={cat.link} key={i} style={{ position: 'relative', height: '400px', borderRadius: '12px', overflow: 'hidden', display: 'block', textDecoration: 'none' }} className="cat-card">
                <img src={cat.image} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="cat-img" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }} />
                <h3 style={{ position: 'absolute', bottom: '30px', left: '30px', color: '#fff', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{cat.title}</h3>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ─── TRENDING PRODUCTS ─── */}
      {products.length > 0 && (
        <section style={{ padding: '80px 60px', background: '#fafafa' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Trending Now</h2>
            <a href="/shop" style={{ color: '#000', fontWeight: 600, textDecoration: 'underline' }}>View All</a>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
            {products.map(prod => (
              <div key={prod.id} style={{ cursor: 'pointer' }} className="product-card">
                <div style={{ position: 'relative', height: '380px', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', background: '#eee' }}>
                  <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="prod-img" />
                  {prod.badge && (
                    <span style={{ position: 'absolute', top: '16px', left: '16px', background: '#000', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {prod.badge}
                    </span>
                  )}
                  <div className="add-to-cart" style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: '#fff', color: '#000', textAlign: 'center', padding: '12px', fontWeight: 700, borderRadius: '6px', opacity: 0, transform: 'translateY(10px)', transition: 'all 0.3s ease' }}>
                    Quick Add +
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0', color: '#222' }}>{prod.name}</h3>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#000', margin: 0 }}>{prod.price}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── NEWSLETTER ─── */}
      {newsletter.title && (
        <section style={{ padding: '100px 60px', background: '#111', color: '#fff', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>{newsletter.title}</h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px auto' }}>{newsletter.description}</p>
          
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;
              const btn = e.target.submitBtn;
              const originalText = btn.innerText;
              
              btn.innerText = 'Subscribing...';
              btn.disabled = true;

              try {
                // Call our Vercel Serverless Backend!
                const res = await fetch('/api/subscribe', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email })
                });
                
                const data = await res.json();
                
                if (res.ok) {
                  btn.innerText = 'Subscribed! ✓';
                  btn.style.background = '#4CAF50';
                  btn.style.color = '#fff';
                  e.target.reset();
                } else {
                  alert(data.error);
                  btn.innerText = originalText;
                  btn.disabled = false;
                }
              } catch (err) {
                alert('Something went wrong!');
                btn.innerText = originalText;
                btn.disabled = false;
              }
            }}
            style={{ display: 'flex', justifyContent: 'center', gap: '10px', maxWidth: '500px', margin: '0 auto' }}
          >
            <input name="email" type="email" required placeholder="Enter your email address" style={{ flex: 1, padding: '16px 24px', borderRadius: '50px', border: 'none', fontSize: '1rem', outline: 'none' }} />
            <button name="submitBtn" type="submit" style={{ padding: '16px 40px', borderRadius: '50px', border: 'none', background: '#fff', color: '#000', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.3s ease' }}>Subscribe</button>
          </form>
        </section>
      )}

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: '40px 60px', background: '#000', color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.9rem' }}>
        <p>© 2026 {pageTitle}. All rights reserved. Zero-Cost Architecture.</p>
      </footer>

      {/* ─── STYLES ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        
        .cat-card:hover .cat-img { transform: scale(1.05); }
        .product-card:hover .prod-img { transform: scale(1.05); }
        .product-card:hover .add-to-cart { opacity: 1; transform: translateY(0); }
      `}</style>
    </div>
  );
}

const iconBtnStyle = { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: '#000' };
const primaryCtaStyle = { display: 'inline-block', padding: '16px 40px', background: '#fff', color: '#000', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase', borderRadius: '50px', transition: 'all 0.3s ease' };

export default HomePage;
