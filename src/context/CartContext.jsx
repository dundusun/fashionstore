import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { API_URL } from "../config";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("fashion_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const isSyncing = useRef(false);

  // Sync Down: When user logs in, fetch their cart from DB
  useEffect(() => {
    if (user && user.email) {
      isSyncing.current = true;
      fetch(`${API_URL}/api/cart/${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setCart(data);
          }
          setTimeout(() => { isSyncing.current = false; }, 500);
        })
        .catch(console.error);
    } else if (user === null) {
      // User logged out, optionally clear cart or keep local
      // For privacy, we clear it when they log out
      setCart([]);
    }
  }, [user]);

  // Sync Up: When cart changes, save to localStorage and DB
  useEffect(() => {
    localStorage.setItem("fashion_cart", JSON.stringify(cart));
    
    if (user && user.email && !isSyncing.current) {
      fetch(`${API_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, items: cart })
      }).catch(console.error);
    }
  }, [cart, user]);
  const [toast, setToast] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const showToast = (message) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast(current => current?.id === id ? null : current);
    }, 3000);
  };

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(`Added ${qty} ${product.name} to cart`);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item._id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  return (
    <CartContext.Provider value={{ 
      cart,
      setCart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      totalPrice,
      totalItems,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
      
      {/* Toast Notification UI */}
      {toast && (
        <div className="fixed top-24 right-6 z-[999] bg-black text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 transform translate-y-0 opacity-100" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          <span className="text-xl">✨</span>
          <span className="font-bold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
