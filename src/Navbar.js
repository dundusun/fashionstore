import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import storeData from './data/storeData.json';
import { API_URL } from './config';

function Navbar({ isTransparent = false }) {
  const [activeNav, setActiveNav] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchProducts, setSearchProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeProfile, setActiveProfile] = useState(false);
  
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const navigation = storeData.navigation || [];

  useEffect(() => {
    if (isSearchOpen && searchProducts.length === 0) {
      fetch(`${API_URL}/api/products`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setSearchProducts(data);
        })
        .catch(console.error);
    }
  }, [isSearchOpen, searchProducts.length]);

  const suggestions = searchQuery.trim() 
    ? searchProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const headerStyle = {
    position: isTransparent ? 'fixed' : 'sticky',
    top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 60px', height: '70px',
    background: isTransparent ? 'rgba(255, 255, 255, 0.9)' : '#fff',
    backdropFilter: isTransparent ? 'blur(12px)' : 'none',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  };

  return (
    <header style={headerStyle}>
      <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', color: '#000' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>{storeData.pageTitle || 'Dundusun'}</Link>
      </div>
      
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '24px' }}>
          {navigation.map((item, idx) => (
            <li key={idx} style={{ position: 'relative' }} onMouseEnter={() => setActiveNav(idx)} onMouseLeave={() => setActiveNav(null)}>
              <Link to={item.url || '#'} style={{
                color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
                textTransform: 'uppercase', letterSpacing: '1px', transition: 'color 0.2s ease',
                padding: '24px 0'
              }}>
                {item.title} {item.children && '▾'}
              </Link>
              
              {/* Dropdown Menu */}
              {item.children && activeNav === idx && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, marginTop: '20px',
                  background: '#fff', minWidth: '200px', padding: '10px 0',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '8px',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  {item.children.map((child, cIdx) => (
                    <Link key={cIdx} to={child.url} style={{
                      display: 'block', padding: '10px 20px', color: '#333',
                      textDecoration: 'none', fontSize: '0.9rem', transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/shop" style={{ color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Shop</Link>
        
        {/* SEARCH BAR WITH SUGGESTIONS */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {isSearchOpen ? (
            <input 
              type="text" 
              autoFocus
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => { 
                // Delay hiding suggestions so click event can fire
                setTimeout(() => setShowSuggestions(false), 200); 
                if(!searchQuery) setIsSearchOpen(false); 
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                  setIsSearchOpen(false);
                  setShowSuggestions(false);
                  setSearchQuery('');
                }
              }}
              style={{
                padding: '8px 30px 8px 15px', borderRadius: '20px', border: '1px solid #ddd',
                outline: 'none', fontSize: '0.9rem', width: '220px', transition: 'width 0.3s'
              }}
            />
          ) : (
            <button onClick={() => setIsSearchOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.3rem' }}>🔍</button>
          )}
          {isSearchOpen && (
            <button 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); setShowSuggestions(false); }}
              style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#888' }}
            >
              ✖
            </button>
          )}

          {/* AUTO-SUGGESTION DROPDOWN */}
          {isSearchOpen && showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, width: '300px', marginTop: '10px',
              background: '#fff', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden', zIndex: 1000
            }}>
              {suggestions.map(prod => (
                <div 
                  key={prod._id}
                  onClick={() => {
                    navigate(`/product/${prod._id}`);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 15px',
                    cursor: 'pointer', borderBottom: '1px solid #f0f0f0', transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <img src={prod.image} alt={prod.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>${prod.price}</div>
                  </div>
                </div>
              ))}
              <div 
                onClick={() => {
                  navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                style={{
                  padding: '12px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, 
                  cursor: 'pointer', color: '#000', background: '#f5f5f5'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e5e5e5'}
                onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}
              >
                View all results ➔
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setIsCartOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.3rem', position: 'relative' }}>
          🛍️
          {totalItems > 0 && (
            <span style={{ position: 'absolute', top: '-8px', right: '-10px', background: '#e00000', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '50%' }}>
              {totalItems}
            </span>
          )}
        </button>
        
        {/* AUTH SECTION */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {user?.email === "chandragottipati3@gmail.com" && (
              <button onClick={() => navigate("/admin")} style={{ 
                background: '#e00000', color: '#fff', border: 'none', padding: '6px 14px', 
                borderRadius: '20px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '1px'
              }}>
                Admin 🛠️
              </button>
            )}
            
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setActiveProfile(true)}
              onMouseLeave={() => setActiveProfile(false)}
            >
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                padding: '5px', borderRadius: '30px', transition: 'background 0.2s',
                background: activeProfile ? '#f5f5f5' : 'transparent'
              }}>
                <div style={{ 
                  width: '35px', height: '35px', borderRadius: '50%', background: '#000', 
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '1.2rem'
                }}>
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#000' }}>
                  {user.email.split('@')[0]}
                </span>
                <span style={{ fontSize: '0.6rem', color: '#888' }}>▼</span>
              </div>

              {/* Profile Dropdown */}
              {activeProfile && (
                <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '10px', zIndex: 1000 }}>
                  <div style={{
                    background: '#fff', minWidth: '200px', padding: '10px 0',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)', borderRadius: '12px',
                    animation: 'fadeIn 0.2s ease', overflow: 'hidden', border: '1px solid #eee'
                  }}>
                    <div style={{ padding: '10px 20px', borderBottom: '1px solid #f0f0f0', marginBottom: '5px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '3px' }}>Signed in as</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000', wordBreak: 'break-all' }}>{user.email}</div>
                    </div>
                    
                    <Link to="/orders" style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', 
                      color: '#333', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: '1.1rem' }}>📦</span> My Orders
                    </Link>

                    <div 
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', 
                        color: '#e00000', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fff0f0'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: '1.1rem' }}>🚪</span> Logout
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login" style={{ padding: '8px 20px', background: '#000', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '0.9rem' }}>Login</Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
