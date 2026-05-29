import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function HomePage({ data }) {
  const [activeNav, setActiveNav] = useState(null);
  const [liveProducts, setLiveProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setLiveProducts(data);
        setLoadingProducts(false);
      })
      .catch(err => {
        console.error("Error fetching live products:", err);
        setLoadingProducts(false);
      });
  }, []);

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ fontSize: '1.2rem', opacity: 0.6 }}>Loading Store Data...</p>
      </div>
    );
  }

  const hero = data.hero || {};
  let navigation = data.navigation || [];
  const pageTitle = data.pageTitle || 'Fashion Store';
  const categories = data.featuredCategories || [];
  const newsletter = data.newsletter || {};

  const alignmentMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
  const heroJustify = alignmentMap[hero.contentAlignment] || 'flex-start';
  const heroTextAlign = hero.contentAlignment || 'left';
  const heroImage = hero.imageSrc || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80';

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: '#fafafa', minHeight: '100vh', color: '#111' }}>
      
      {/* ─── HEADER ─── */}
      <Navbar isTransparent={true} />

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
            {hero.ctaLabel && <Link to={hero.ctaUrl || '#'} style={primaryCtaStyle}>{hero.ctaLabel}</Link>}
          </div>
        </div>
      </section>

      {/* ─── FEATURED CATEGORIES ─── */}
      {categories.length > 0 && (
        <section style={{ padding: '80px 60px', background: '#fff' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', marginBottom: '50px', textTransform: 'uppercase', letterSpacing: '1px' }}>Shop by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {categories.map((cat, i) => (
              <Link to={cat.link} key={i} style={{ position: 'relative', height: '400px', borderRadius: '12px', overflow: 'hidden', display: 'block', textDecoration: 'none' }} className="cat-card">
                <img src={cat.image} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="cat-img" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }} />
                <h3 style={{ position: 'absolute', bottom: '30px', left: '30px', color: '#fff', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{cat.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── LIVE PRODUCTS FROM MONGODB ─── */}
      <section style={{ padding: '80px 60px', background: '#fafafa' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Latest Drops</h2>
            <span style={{ background: '#4CAF50', color: '#fff', fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>LIVE DB</span>
          </div>
          <Link to="/shop" style={{ color: '#000', fontWeight: 600, textDecoration: 'underline' }}>View All</Link>
        </div>
        
        {loadingProducts ? (
          <div style={{ textAlign: 'center', padding: '50px 0', fontSize: '1.2rem', color: '#666' }}>Fetching from MongoDB... ⏳</div>
        ) : liveProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: '#999' }}>No products found in database.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
            {liveProducts.map(prod => (
              <div key={prod._id} style={{ cursor: 'pointer' }} className="product-card">
                <div style={{ position: 'relative', height: '380px', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px', background: '#eee' }}>
                  <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="prod-img" />
                  <span style={{ position: 'absolute', top: '16px', left: '16px', background: '#000', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {prod.category}
                  </span>
                  <div className="add-to-cart" style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: '#fff', color: '#000', textAlign: 'center', padding: '12px', fontWeight: 700, borderRadius: '6px', opacity: 0, transform: 'translateY(10px)', transition: 'all 0.3s ease' }}>
                    Quick Add +
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0', color: '#222' }}>{prod.name}</h3>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: '#000', margin: 0 }}>${prod.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </section>

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
                // Mocking the backend response since we removed Vercel/Netlify functions
                await new Promise(resolve => setTimeout(resolve, 800));
                
                btn.innerText = 'Subscribed! ✓';
                btn.style.background = '#4CAF50';
                btn.style.color = '#fff';
                e.target.reset();
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
