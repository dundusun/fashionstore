import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from './context/CartContext';
import storeData from './data/storeData.json';
import Footer from './Footer';
import { API_URL } from './config';

function HomePage({ data }) {
  const [liveProducts, setLiveProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  React.useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error("API did not return an array. Probably a backend error.");
        }
        setLiveProducts(data);
        setLoadingProducts(false);
      })
      .catch(err => {
        console.error("Error fetching live products, falling back to static data:", err);
        const fallbackData = storeData.trendingProducts.map(p => ({
          _id: p.id,
          name: p.name,
          price: parseFloat(p.price.replace('$', '')),
          image: p.image,
          category: 'Trending'
        }));
        setLiveProducts(fallbackData);
        setLoadingProducts(false);
      });
  }, []);

  const hero = {
    title: data?.hero?.pretitle || "New Season Arrivals",
    subtitle: data?.hero?.title || "Spring Summer 2026",
    description: data?.hero?.description || "Embrace the new season with our latest collection of premium, sustainable fashion designed to make you stand out.",
    ctaText: data?.hero?.ctaLabel || "Shop Collection",
    imageSrc: data?.hero?.imageSrc || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <Navbar isTransparent={true} />

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={hero.imageSrc} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-24">
          <h2 className="text-sm md:text-lg font-bold tracking-[0.3em] uppercase text-white/80 mb-4 animate-fade-in-up" style={{ animationDelay: '0ms' }}>
            {hero.title}
          </h2>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-6 tracking-tight drop-shadow-xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {hero.subtitle}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            {hero.description}
          </p>
          <button 
            onClick={() => navigate('/shop')}
            className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 shadow-2xl animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            {hero.ctaText}
          </button>
        </div>
      </div>

      {/* Featured Categories Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight mb-4">Shop by Category</h2>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto">Explore our curated collections designed for every occasion.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {storeData.featuredCategories.map((cat, idx) => (
            <div key={idx} onClick={() => navigate(cat.link || '/shop')} className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer shadow-xl">
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-3xl font-black text-white mb-2">{cat.title}</h3>
                <span className="inline-block bg-white text-black px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider group-hover:bg-black group-hover:text-white transition-colors">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Trending Now</h2>
            <p className="text-gray-500 font-medium">Discover our most popular premium pieces</p>
          </div>
          <button onClick={() => navigate('/shop')} className="hidden md:block font-bold uppercase tracking-wider text-sm border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
            View All →
          </button>
        </div>

        {loadingProducts ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {liveProducts.slice(0, 4).map(prod => (
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
                      className="w-full bg-white/80 backdrop-blur-md hover:bg-black hover:text-white text-black font-bold py-4 rounded-xl transition-colors shadow-lg"
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
      </div>

      {/* Promotional Parallax Banner */}
      <div className="relative h-[60vh] flex items-center justify-center bg-fixed bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Summer Essentials</h2>
          <p className="text-xl md:text-2xl mb-10 font-medium max-w-2xl mx-auto opacity-90">Discover the pieces you'll wear on repeat all season long.</p>
          <button onClick={() => navigate('/shop')} className="bg-white text-black px-12 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-transform hover:scale-105 shadow-2xl">
            Shop The Edit
          </button>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-white py-24 px-6 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-4 block">Stay Updated</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6">{storeData.newsletter.title}</h2>
          <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto">{storeData.newsletter.description}</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!'); }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="px-6 py-4 w-full sm:w-96 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-black outline-none transition-all"
              required
            />
            <button type="submit" className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-lg">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
