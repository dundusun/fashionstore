require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,
  category: String,
  subcategory: String,
  stock: Number,
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const products = [
  // WOMEN - Clothing
  {
    name: "Silk Evening Dress",
    price: 189.00,
    description: "Elegant silk evening dress with a beautiful flow. Perfect for special occasions and premium events.",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    category: "Women",
    subcategory: "Clothing",
    stock: 50
  },
  {
    name: "Summer Floral Midi",
    price: 89.99,
    description: "Lightweight and breathable floral midi dress, ideal for warm summer days and beach outings.",
    image: "https://images.unsplash.com/photo-1515347619362-790176378e90?w=600&q=80",
    category: "Women",
    subcategory: "Clothing",
    stock: 75
  },
  {
    name: "Elegant Trench Coat",
    price: 249.50,
    description: "A timeless classic. This elegant trench coat elevates any outfit while keeping you protected from the elements.",
    image: "https://images.unsplash.com/photo-1591369822096-fb14ce694e38?w=600&q=80",
    category: "Women",
    subcategory: "Clothing",
    stock: 30
  },
  // WOMEN - Shoes
  {
    name: "Classic High Heels",
    price: 129.00,
    description: "Premium leather high heels in nude. A staple for any professional or evening wardrobe.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    category: "Women",
    subcategory: "Shoes",
    stock: 45
  },
  
  // MEN - Clothing
  {
    name: "Classic Linen Blazer",
    price: 149.00,
    description: "Sophisticated and comfortable. The classic linen blazer is a staple for the modern man's wardrobe.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    category: "Men",
    subcategory: "Clothing",
    stock: 60
  },
  {
    name: "Premium Leather Jacket",
    price: 399.99,
    description: "Genuine leather jacket with premium stitching and hardware. A statement piece that lasts a lifetime.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    category: "Men",
    subcategory: "Clothing",
    stock: 20
  },
  {
    name: "Casual Oxford Shirt",
    price: 59.99,
    description: "Versatile oxford shirt that perfectly bridges the gap between casual and formal wear.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    category: "Men",
    subcategory: "Clothing",
    stock: 120
  },
  // MEN - Shoes
  {
    name: "Leather Chelsea Boots",
    price: 189.99,
    description: "Classic Chelsea boots crafted from premium suede leather. Perfect for both casual and smart looks.",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=80",
    category: "Men",
    subcategory: "Shoes",
    stock: 40
  },

  // KIDS - Clothing (Boys & Girls)
  {
    name: "Kids Denim Overalls",
    price: 45.00,
    description: "Durable and adorable denim overalls for kids. Designed for comfort and all-day play.",
    image: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=600&q=80",
    category: "Kids",
    subcategory: "Boys",
    stock: 80
  },
  {
    name: "Striped Cotton Tee",
    price: 24.50,
    description: "Soft, breathable cotton tee with playful stripes. Perfect for everyday wear.",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80",
    category: "Kids",
    subcategory: "Girls",
    stock: 150
  },
  
  // ACCESSORIES (Global or Men/Women)
  {
    name: "Designer Sunglasses",
    price: 199.00,
    description: "Premium designer sunglasses with UV protection and a bold, modern frame.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80",
    category: "Women",
    subcategory: "Accessories",
    stock: 40
  },
  {
    name: "Leather Crossbody Bag",
    price: 129.50,
    description: "Sleek and functional leather crossbody bag, perfect for keeping essentials close.",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    category: "Women",
    subcategory: "Accessories",
    stock: 55
  },
  {
    name: "Classic Chronograph Watch",
    price: 249.00,
    description: "Elegant chronograph watch with a genuine leather strap and stainless steel case.",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80",
    category: "Men",
    subcategory: "Accessories",
    stock: 35
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    console.log("Clearing existing products...");
    await Product.deleteMany({});

    console.log("Inserting new products...");
    await Product.insertMany(products);
    
    console.log(`Successfully added ${products.length} products to MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
