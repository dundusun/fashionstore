import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../Navbar";
import { API_URL } from "../config";

const STATUS_COLORS = {
  pending: { bg: "#fff3cd", text: "#856404" },
  confirmed: { bg: "#cce5ff", text: "#004085" },
  shipped: { bg: "#e2e3e5", text: "#383d41" },
  delivered: { bg: "#d4edda", text: "#155724" },
};

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      axios.get(`${API_URL}/api/orders/${user.email}`)
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif", background: '#fff', minHeight: '100vh', color: '#111' }}>
        <Navbar isTransparent={false} />
        <div style={{ textAlign: "center", padding: "100px 20px", fontSize: "1.2rem" }}>
          Loading your orders... ⏳
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#fafafa', minHeight: '100vh', color: '#111' }}>
      <Navbar isTransparent={false} />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '40px', borderBottom: '2px solid #eaeaea', paddingBottom: '20px' }}>
          My Orders 📦
        </h2>

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '20px' }}>No Orders Yet!</h2>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>You haven't placed any orders. Time to go shopping!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {orders.map((order) => (
              <div key={order._id} style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</p>
                    <p style={{ margin: 0, fontWeight: 700, fontFamily: 'monospace', fontSize: '1.1rem' }}>#{order._id.slice(-8).toUpperCase()}</p>
                    <p style={{ margin: '8px 0 0 0', color: '#555', fontSize: '0.9rem' }}>Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      background: STATUS_COLORS[order.status]?.bg || '#eee', 
                      color: STATUS_COLORS[order.status]?.text || '#333', 
                      padding: '6px 12px', borderRadius: '50px', fontWeight: 700, 
                      fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' 
                    }}>
                      {order.status}
                    </span>
                    <h3 style={{ margin: '15px 0 0 0', fontSize: '1.8rem', fontWeight: 900 }}>${order.totalPrice.toFixed(2)}</h3>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {order.items.map((item) => (
                    <div key={item.productId || item._id} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 700, fontSize: '1.1rem' }}>{item.name}</p>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Qty: {item.quantity} × ${item.price}</p>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
