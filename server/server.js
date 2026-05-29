require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fashionstore";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Temporary Route to test if server is running
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is running and connected to MongoDB!" });
});

// Import Models
const Product = require('./models/Product');
const Cart = require('./models/Cart');

// API Endpoint to get user cart
app.get('/api/cart/:email', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userEmail: req.params.email });
    if (!cart) {
      return res.json([]);
    }
    res.json(cart.items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
});

// API Endpoint to save user cart
app.post('/api/cart', async (req, res) => {
  try {
    const { email, items } = req.body;
    
    // Find and update, or create if doesn't exist (upsert)
    const updatedCart = await Cart.findOneAndUpdate(
      { userEmail: email },
      { items: items, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    
    res.json(updatedCart.items);
  } catch (error) {
    res.status(500).json({ message: "Error saving cart", error: error.message });
  }
});

// API Endpoint to get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// API Endpoint to get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
