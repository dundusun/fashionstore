import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { useCart } from '../context/CartContext';
import storeData from '../data/storeData.json';
import Footer from '../Footer';
import { API_URL } from '../config';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Scroll to top when loading a new product
    window.scrollTo(0, 0);
    setQuantity(1); // Reset quantity when product changes
    
    fetch(`${API_URL}/api/products/${id}`)
      .then(res => {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          if (!res.ok) throw new Error("Product not found");
          return res.json();
        } else {
          throw new Error("API not available, fallback to static");
        }
      })
      .then(data => {
        if (data && data._id) {
          setProduct(data);
        } else {
          throw new Error("Invalid product data");
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback to static data
        const staticProduct = storeData.trendingProducts.find(p => p.id === id || p._id === id);
        
        if (staticProduct) {
          setProduct({
            _id: staticProduct.id,
            name: staticProduct.name,
            price: typeof staticProduct.price === 'string' ? parseFloat(staticProduct.price.replace('$', '')) : staticProduct.price,
            image: staticProduct.image,
            category: 'Trending',
            stock: 4, // Mock low stock for demo
            description: "Experience premium quality with this meticulously crafted piece. Designed for the modern aesthetic, it blends comfort with effortless style."
          });
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h1 className="text-4xl font-black mb-4">Product Not Found</h1>
          <button onClick={() => navigate('/shop')} className="bg-black text-white px-8 py-3 rounded-full font-bold">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Calculate available stock (mocking it to be between 2-8 if not provided by DB)
  const availableStock = product.stock !== undefined ? product.stock : ((id.length % 7) + 2);

  const handleQuantityChange = (type) => {
    if (type === 'decrease' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'increase' && quantity < availableStock) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row gap-12">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <div className="relative rounded-3xl overflow-hidden bg-gray-200 aspect-[4/5] shadow-2xl group">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="mb-2 text-sm font-bold tracking-widest text-gray-500 uppercase">
            {product.category || 'Premium Collection'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
            {product.name}
          </h1>
          <div className="text-2xl font-bold text-gray-900 mb-6">
            ${Number(product.price || 0).toFixed(2)}
          </div>
          
          {/* Low Stock Indicator */}
          {availableStock < 5 && (
            <div className="mb-6 inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg font-bold text-sm border border-red-100">
              <span className="animate-pulse">🔥</span> 
              Hurry! Only {availableStock} left in stock
            </div>
          )}

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            {product.description || "Experience premium quality with this meticulously crafted piece. Designed for the modern aesthetic, it blends comfort with effortless style."}
          </p>

          {/* Quantity Selector */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Quantity</label>
            <div className="flex items-center border-2 border-gray-200 rounded-xl w-36 overflow-hidden bg-white">
              <button 
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
                className="w-12 h-12 flex items-center justify-center font-bold text-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >-</button>
              <div className="flex-1 h-12 flex items-center justify-center font-bold text-gray-900 border-x border-gray-200">
                {quantity}
              </div>
              <button 
                onClick={() => handleQuantityChange('increase')}
                disabled={quantity >= availableStock}
                className="w-12 h-12 flex items-center justify-center font-bold text-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >+</button>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => addToCart(product, quantity)}
              className="flex-1 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1"
            >
              Add to Cart 🛒
            </button>
            <button 
              onClick={() => {
                addToCart(product, quantity);
                navigate('/checkout');
              }}
              className="px-6 py-4 rounded-xl font-bold uppercase tracking-wider border-2 border-black hover:bg-gray-100 transition-colors"
            >
              Buy Now
            </button>
          </div>
          
          {/* Perks */}
          <div className="mt-12 grid grid-cols-2 gap-6 border-t border-gray-200 pt-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <span className="text-sm font-bold text-gray-700">Free Worldwide Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">↩️</span>
              <span className="text-sm font-bold text-gray-700">30-Day Free Returns</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <span className="text-sm font-bold text-gray-700">Premium Materials</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <span className="text-sm font-bold text-gray-700">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetailsPage;
