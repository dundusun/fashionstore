import React from 'react';
import { useCart } from './context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[1001] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Your Cart <span className="text-gray-400 font-medium text-lg">({totalItems})</span>
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-black transition-colors text-2xl font-bold p-2"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
              <span className="text-6xl mb-4">🛒</span>
              <h3 className="text-2xl font-bold mb-2">Cart is empty</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
              <button 
                onClick={() => { setIsCartOpen(false); navigate('/shop'); }}
                className="font-bold border-b-2 border-black pb-1 hover:text-gray-600 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl group">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 leading-tight mb-1">{item.name}</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{item.category}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-black text-lg">${Number(item.price || 0).toFixed(2)}</p>
                    
                    {/* Quantity Controls in Cart */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                      >-</button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => {
                           const maxStock = item.stock !== undefined ? item.stock : ((item._id.length % 7) + 2);
                           if (item.quantity < maxStock) updateQuantity(item._id, item.quantity + 1);
                        }}
                        className="w-8 h-8 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {cart.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Subtotal</span>
              <span className="text-3xl font-black">${totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}
              className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1 block text-center"
            >
              Checkout Now →
            </button>
          </div>
        )}

      </div>
    </>
  );
}

export default CartDrawer;
