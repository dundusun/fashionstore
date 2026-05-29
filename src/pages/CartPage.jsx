import React from 'react';
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

function CartPage() {
  const { cart, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#fff', minHeight: '100vh', color: '#111' }}>
      <Navbar isTransparent={false} />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '40px', borderBottom: '2px solid #eaeaea', paddingBottom: '20px' }}>
          Your Cart <span style={{ color: '#888', fontSize: '1.5rem', fontWeight: 500 }}>({totalItems} items)</span>
        </h2>

        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 20px" }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛒</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '20px' }}>Your cart is empty!</h2>
            <p style={{ color: '#666', marginBottom: '40px' }}>Looks like you haven't added anything to your cart yet.</p>
            <button onClick={() => navigate("/shop")} style={{
              padding: '16px 32px', background: '#000', color: '#fff', border: 'none',
              borderRadius: '50px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map((item) => (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '12px' }}>
                <img src={item.image} alt={item.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>{item.name}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase' }}>{item.category}</p>
                  <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>${item.price} <span style={{ color: '#888', fontWeight: 400, fontSize: '0.9rem' }}>× {item.quantity}</span></p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '15px' }}>${(item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item._id)} style={{
                    background: 'transparent', color: '#e00000', border: '1px solid #e00000',
                    padding: '8px 16px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer',
                    fontSize: '0.8rem', textTransform: 'uppercase'
                  }}>
                    Remove ❌
                  </button>
                </div>
              </div>
            ))}

            <div style={{ marginTop: '40px', background: '#000', color: '#fff', padding: '40px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '1rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Total Amount</p>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 900 }}>${totalPrice.toFixed(2)}</h3>
              </div>
              <button onClick={() => navigate("/checkout")} style={{
                background: '#fff', color: '#000', border: 'none', padding: '18px 40px',
                borderRadius: '50px', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '1px'
              }}>
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
