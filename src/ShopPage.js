import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useCart } from './context/CartContext';
import storeData from './data/storeData.json';
import Footer from './Footer';

import { API_URL } from './config';

function ShopPage({ defaultCategory = 'All' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(defaultCategory);
  const [sort, setSort] = useState('newest');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Effect to update filter if defaultCategory prop changes
  useEffect(() => {
    setFilter(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return res.json();
        } else {
          throw new Error("API not available, fallback to static");
        }
      })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error("API did not return an array.");
        }
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        // Fallback to static trending products to simulate a full catalog
        // We will duplicate them to look like a full shop page
        const staticData = storeData.trendingProducts.map(p => ({
          _id: p.id,
          name: p.name,
          price: typeof p.price === 'string' ? parseFloat(p.price.replace('$', '')) : p.price,
          image: p.image,
          category: 'Women' // Defaulting for visual testing
        }));
        
        // Add more mock data for Men and Kids to make filters work
        const extraData = [
          { _id: 'm1', name: "Men's Urban Jacket", price: 149.99, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80", category: "Men" },
          { _id: 'm2', name: "Classic Oxford Shirt", price: 59.99, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80", category: "Men" },
          { _id: 'k1', name: "Kids Denim Overalls", price: 45.00, image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=600&q=80", category: "Kids" },
          { _id: 'a1', name: "Designer Sunglasses", price: 199.00, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80", category: "Accessories" }
        ];

        setProducts([...staticData, ...extraData]);
        setLoading(false);
      });
  }, []);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  
  const pathParts = location.pathname.split('/').filter(Boolean);
  const subcategoryFromUrl = pathParts.length > 1 ? pathParts[1] : null;

  // Filter Logic
  let displayedProducts = products;
  
  if (filter !== 'All') {
    displayedProducts = displayedProducts.filter(p => p.category === filter);
  }

  if (subcategoryFromUrl) {
    const formattedSub = subcategoryFromUrl.charAt(0).toUpperCase() + subcategoryFromUrl.slice(1).toLowerCase();
    // Some routes might use dashes, e.g. ethnic-wear -> Ethnic Wear, but we'll do simple matching for now
    displayedProducts = displayedProducts.filter(p => 
      p.subcategory && p.subcategory.toLowerCase() === subcategoryFromUrl.toLowerCase().replace('-', ' ')
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    displayedProducts = displayedProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q))
    );
  }

  // Sort Logic
  displayedProducts = [...displayedProducts]; // Clone array to prevent mutating original state
  if (sort === 'price-low') {
    displayedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    displayedProducts.sort((a, b) => b.price - a.price);
  }

  const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories', 'Unisex'];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar isTransparent={false} />

      {/* PAGE TITLE */}
      <div className="bg-gray-50 py-20 px-6 text-center border-b border-gray-200">
        <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">The Collection</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">Explore our complete range of premium fashion, curated just for you.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* SIDEBAR (FILTERS) */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b-2 border-black pb-4">Categories</h3>
          <ul className="flex flex-row lg:flex-col gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <li key={cat} className="flex-shrink-0">
                <button 
                  onClick={() => cat === 'All' ? navigate('/shop') : navigate(`/${cat.toLowerCase()}`)}
                  className={`text-sm md:text-base transition-colors ${filter === cat ? 'font-black text-black' : 'font-medium text-gray-500 hover:text-black'}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN PRODUCT GRID */}
        <main className="flex-1">
          
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <p className="font-bold text-gray-400">Showing {displayedProducts.length} results</p>
            <div className="flex items-center gap-3">
              <label className="font-bold text-sm uppercase tracking-wider text-gray-500">Sort By:</label>
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 font-medium outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-32 bg-gray-50 rounded-3xl border border-gray-100">
              <span className="text-4xl mb-4 block">🔍</span>
              <h3 className="text-2xl font-black mb-2">No products found</h3>
              <p className="text-gray-500">Try changing your category filter.</p>
              <button onClick={() => navigate('/shop')} className="mt-6 font-bold text-black border-b-2 border-black pb-1">View All Products</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProducts.map(prod => (
                <div key={prod._id} className="group cursor-pointer" onClick={() => navigate('/product/' + prod._id)}>
                  <div className="relative h-[450px] overflow-hidden rounded-2xl bg-gray-100 mb-4">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                      {prod.category}
                    </div>
                    
                    {/* Glassmorphism Add to Cart Button */}
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(prod); }}
                        className="w-full bg-white/90 backdrop-blur-md hover:bg-black hover:text-white text-black font-bold py-4 rounded-xl transition-colors shadow-lg"
                      >
                        Add to Cart 🛒
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{prod.name}</h3>
                  <p className="font-bold text-gray-500">${prod.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default ShopPage;
