import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import storeData from './data/storeData.json';

function Navbar({ isTransparent = false }) {
  const [activeNav, setActiveNav] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navigation = storeData.navigation || [];

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
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.3rem' }}>🔍</button>
        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.3rem' }}>🛍️</button>
        
        {/* AUTH SECTION */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>👤 {user.email.split('@')[0]}</span>
            <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Logout</button>
          </div>
        ) : (
          <Link to="/login" style={{ padding: '8px 20px', background: '#000', color: '#fff', textDecoration: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '0.9rem' }}>Login</Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
