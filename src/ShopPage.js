import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  // Filter Logic
  let displayedProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  // Sort Logic
  if (sort === 'price-low') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    displayedProducts.sort((a, b) => b.price - a.price);
  } else {
    // newest - assuming _id or createdAt sorting, let's just keep original array order (which is sorted by backend)
  }

  const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories', 'Unisex'];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#fff', minHeight: '100vh', color: '#111' }}>
      
      {/* ─── SIMPLE HEADER ─── */}
      <Navbar isTransparent={false} />

      {/* ─── PAGE TITLE ─── */}
      <div style={{ background: '#f8f8f8', padding: '60px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: '0 0 10px 0', textTransform: 'uppercase' }}>All Collection</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Explore our complete range of premium fashion fetched directly from your MongoDB database.</p>
      </div>

      <div style={{ display: 'flex', padding: '60px', gap: '40px' }}>
        
        {/* ─── SIDEBAR (FILTERS) ─── */}
        <aside style={{ width: '250px', flexShrink: 0 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>Categories</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {categories.map(cat => (
              <li key={cat}>
                <button 
                  onClick={() => setFilter(cat)}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', 
                    color: filter === cat ? '#000' : '#888', 
                    fontWeight: filter === cat ? 700 : 500,
                    textAlign: 'left', padding: 0, transition: 'color 0.2s'
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ─── MAIN PRODUCT GRID ─── */}
        <main style={{ flex: 1 }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <p style={{ margin: 0, fontWeight: 600, color: '#666' }}>Showing {displayedProducts.length} results</p>
            <div>
              <label style={{ fontWeight: 600, marginRight: '10px' }}>Sort By:</label>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.5rem', color: '#888' }}>
              Loading products from MongoDB... ⏳
            </div>
          ) : displayedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.5rem', color: '#888' }}>
              No products found in this category.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
              {displayedProducts.map(prod => (
                <div key={prod._id} style={{ cursor: 'pointer' }} className="product-card">
                  <div style={{ position: 'relative', height: '380px', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px', background: '#f5f5f5' }}>
                    <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="prod-img" />
                    <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.9)', color: '#000', fontSize: '0.75rem', fontWeight: 800, padding: '6px 12px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {prod.category}
                    </span>
                    <div className="add-to-cart" style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: '#000', color: '#fff', textAlign: 'center', padding: '14px', fontWeight: 700, borderRadius: '4px', opacity: 0, transform: 'translateY(10px)', transition: 'all 0.3s ease' }}>
                      Add to Cart
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px 0', color: '#111' }}>{prod.name}</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: 500, color: '#555', margin: 0 }}>${prod.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .product-card:hover .prod-img { transform: scale(1.05); }
        .product-card:hover .add-to-cart { opacity: 1; transform: translateY(0); }
      `}</style>
    </div>
  );
}

export default ShopPage;
