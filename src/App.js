import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import HomePage from './HomePage';
import ShopPage from './ShopPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductDetailsPage from './pages/ProductDetailsPage';
import storeData from './data/storeData.json';
import CartDrawer from './CartDrawer';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage data={storeData} />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/women/*" element={<ShopPage defaultCategory="Women" />} />
            <Route path="/men/*" element={<ShopPage defaultCategory="Men" />} />
            <Route path="/kids/*" element={<ShopPage defaultCategory="Kids" />} />
            <Route path="/accessories/*" element={<ShopPage defaultCategory="Accessories" />} />
            <Route path="/sale/*" element={<ShopPage defaultCategory="Sale" />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<HomePage data={storeData} />} />
          </Routes>
          <CartDrawer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;