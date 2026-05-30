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
const Order = require('./models/Order');

// API Endpoint to save orders after payment
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error saving order", error: error.message });
  }
});

// API Endpoint to get user orders
app.get('/api/orders/:email', async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

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

// RAZORPAY INTEGRATION
const Razorpay = require('razorpay');
const crypto = require('crypto');

app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Amount is in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: "receipt_order_" + Math.floor(Math.random() * 1000000),
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).send("Some error occured");
    }
    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: "Error creating Razorpay order", error: error.message });
  }
});

app.post('/api/razorpay/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // Create the expected signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is fully verified!
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
