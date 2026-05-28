import React from 'react';

// Helper function to recursively find a component by type
const findComponentByType = (node, type) => {
  if (!node) return null;
  if (node[':type'] === type) return node;
  
  if (node[':items']) {
    for (const key in node[':items']) {
      const result = findComponentByType(node[':items'][key], type);
      if (result) return result;
    }
  }
  return null;
};

function HomePage({ data }) {
  if (!data) return null;

  // Extract Hero component data
  const heroData = findComponentByType(data, 'fashionstore/components/content/hero');

  // Hardcoding base url for image since AEM might return relative path
  const BASE_URL = "https://spellbind-bacterium-sternness.ngrok-free.dev";

  const headerData = findComponentByType(data, 'fashionstore/components/content/header');
  const navigationData = findComponentByType(headerData, 'fashionstore/components/content/navigation') || findComponentByType(data, 'fashionstore/components/content/navigation') || findComponentByType(data, 'fashionstore/components/navigation');
  
  // AEM navigation items from the custom Sling Model
  const navItems = navigationData?.items || headerData?.items || [];

  const renderNavItems = (items) => {
    if (!items || items.length === 0) return null;
    return (
      <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, gap: '20px', alignItems: 'center' }}>
        {items.map((item, index) => renderSingleNavItem(item, index))}
      </ul>
    );
  };

  const renderSingleNavItem = (item, index) => (
    <li key={index} style={{ position: 'relative' }} className="nav-item group">
      <a href={item.url || item.path || "#"} style={{ color: '#fff', textDecoration: 'none', fontWeight: '500', padding: '10px 0', display: 'block' }}>
        {item.title || item.name}
      </a>
      {/* Subpages (Dropdown) */}
      {item.children && item.children.length > 0 && (
        <div className="sub-menu" style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          backgroundColor: '#222', 
          minWidth: '150px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
          zIndex: 10,
          display: 'none', // We'll rely on hover via CSS
          flexDirection: 'column'
        }}>
          {item.children.map((child, cIndex) => (
            <a key={cIndex} href={child.url || child.path || "#"} style={{
              color: '#ccc',
              padding: '12px 16px',
              textDecoration: 'none',
              borderBottom: '1px solid #333',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#444'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {child.title || child.name}
            </a>
          ))}
        </div>
      )}
    </li>
  );

  // Debugging: Log what components we found
  console.log("Found Hero Data:", heroData);
  console.log("Found Header Data:", headerData);

  return (
    <div className="home-page-container" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>
        {`
          .nav-item:hover .sub-menu {
            display: flex !important;
          }
        `}
      </style>
      {/* Header Placeholder */}
      <header style={{ 
        padding: '20px 50px', 
        backgroundColor: '#111', 
        color: '#fff', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h2 style={{ margin: 0, letterSpacing: '1px' }}>FASHION STORE</h2>
        <nav>
          {navItems && navItems.length > 0 ? (
            renderNavItems(navItems)
          ) : (
            <div style={{color: '#888', fontSize: '14px'}}>Navigation data not found in JSON</div>
          )}
        </nav>
      </header>


      {/* Hero Section */}
      {heroData && (
        <section style={{ 
          position: 'relative', 
          height: '85vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          {/* Background Image Setup */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${BASE_URL}${heroData.imagePath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
          </div>

          <div style={{ zIndex: 1, padding: '20px', maxWidth: '800px' }}>
            <span style={{ 
              textTransform: 'uppercase', 
              letterSpacing: '3px', 
              fontSize: '14px', 
              marginBottom: '15px', 
              display: 'block',
              fontWeight: '600'
            }}>
              {heroData.pretitle}
            </span>
            <h1 style={{ 
              fontSize: '4.5rem', 
              fontWeight: 'bold', 
              margin: '0 0 30px 0',
              textShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}>
              {heroData.title}
            </h1>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              {heroData.actions?.map((action, idx) => (
                <a key={idx} href={action.link.url} style={{
                  padding: '14px 35px',
                  backgroundColor: idx === 0 ? '#fff' : 'rgba(255,255,255,0.1)',
                  color: idx === 0 ? '#000' : '#fff',
                  border: idx === 0 ? 'none' : '2px solid #fff',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  borderRadius: '50px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  {action.title}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
