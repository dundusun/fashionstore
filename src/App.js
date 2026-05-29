import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './HomePage';
import ShopPage from './ShopPage';
import Login from './pages/Login';
import Register from './pages/Register';
import storeData from './data/storeData.json';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage data={storeData} />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<HomePage data={storeData} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;