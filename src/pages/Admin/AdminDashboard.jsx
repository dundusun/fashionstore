import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [newProduct, setNewProduct] = useState({
    name: "", price: "", category: "", stock: "", image: "", description: ""
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const ADMIN_EMAIL = "chandragottipati3@gmail.com";

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) {
      navigate("/");
      return;
    }
    fetchProducts();
    fetchOrders();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/admin/products");
      setProducts(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders");
      setOrders(res.data);
    } catch (e) { console.error(e); }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("/api/admin/products", newProduct);
      fetchProducts();
      setNewProduct({ name: "", price: "", category: "", stock: "", image: "", description: "" });
      alert("Product added successfully!");
    } catch (e) { console.error(e); }
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete("/api/admin/products", { data: { id } });
        fetchProducts();
      } catch (e) { console.error(e); }
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await axios.patch("/api/orders", { id, status });
      fetchOrders();
    } catch (e) { console.error(e); }
  };

  const inputStyle = {
    width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px',
    fontSize: '1rem', outline: 'none', marginBottom: '16px', fontFamily: 'inherit'
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#f5f5f5', minHeight: '100vh', color: '#111' }}>
      <Navbar isTransparent={false} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '40px' }}>
          🛠️ Admin Dashboard
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', borderBottom: '2px solid #ddd', paddingBottom: '15px' }}>
          <button onClick={() => setActiveTab("products")} style={{
            background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer',
            fontWeight: activeTab === "products" ? 800 : 500,
            color: activeTab === "products" ? '#000' : '#888',
            position: 'relative'
          }}>
            Products 📦
            {activeTab === "products" && <div style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '4px', background: '#000', borderRadius: '4px' }} />}
          </button>
          
          <button onClick={() => setActiveTab("orders")} style={{
            background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer',
            fontWeight: activeTab === "orders" ? 800 : 500,
            color: activeTab === "orders" ? '#000' : '#888',
            position: 'relative'
          }}>
            Orders 🛒
            {activeTab === "orders" && <div style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '4px', background: '#000', borderRadius: '4px' }} />}
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            
            {/* Add Product Form */}
            <div style={{ flex: '1 1 400px', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '25px' }}>Add New Product</h3>
              <input style={inputStyle} placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
              <div style={{ display: 'flex', gap: '16px' }}>
                <input style={{...inputStyle, flex: 1}} placeholder="Price ($)" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                <input style={{...inputStyle, flex: 1}} placeholder="Stock Qty" type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
              </div>
              <input style={inputStyle} placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
              <input style={inputStyle} placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
              <textarea style={{...inputStyle, minHeight: '100px', resize: 'vertical'}} placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
              
              <button onClick={handleAddProduct} style={{
                width: '100%', padding: '16px', background: '#000', color: '#fff',
                border: 'none', borderRadius: '50px', fontWeight: 800, fontSize: '1.1rem',
                cursor: 'pointer', textTransform: 'uppercase', marginTop: '10px'
              }}>
                Add Product ✅
              </button>
            </div>

            {/* Products List */}
            <div style={{ flex: '1 1 600px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '25px' }}>All Products ({products.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {products.map((product) => (
                  <div key={product._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div>
                        <p style={{ margin: '0 0 5px 0', fontWeight: 700, fontSize: '1.1rem' }}>{product.name}</p>
                        <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>${product.price} • Stock: {product.stock} • {product.category}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProduct(product._id)} style={{
                      background: 'transparent', color: '#e00000', border: '1px solid #e00000',
                      padding: '8px 16px', borderRadius: '50px', fontWeight: 600, cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}>
                      Delete 🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '25px' }}>All Orders ({orders.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map((order) => (
                <div key={order._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#888', fontSize: '0.85rem' }}>Order ID: #{order._id.slice(-8).toUpperCase()}</p>
                    <p style={{ margin: '0 0 5px 0', fontWeight: 700, fontSize: '1.1rem' }}>{order.userEmail || order.userId}</p>
                    <p style={{ margin: 0, color: '#555', fontSize: '0.9rem' }}>{order.items.length} Items • Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div style={{ fontWeight: 900, fontSize: '1.5rem', flex: '1 1 100px' }}>
                    ${order.totalPrice.toFixed(2)}
                  </div>
                  
                  <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontWeight: 600, color: '#666' }}>Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      style={{
                        padding: '10px 15px', borderRadius: '50px', border: '1px solid #ccc',
                        fontSize: '0.9rem', fontWeight: 600, outline: 'none', cursor: 'pointer',
                        background: '#f9f9f9', flex: 1
                      }}
                    >
                      <option value="pending">🟡 Pending</option>
                      <option value="confirmed">🔵 Confirmed</option>
                      <option value="shipped">🟣 Shipped</option>
                      <option value="delivered">🟢 Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
