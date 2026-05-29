require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const dummyProducts = [
  {
    name: "Classic Linen Blazer",
    description: "A lightweight, breathable linen blazer perfect for summer and smart-casual occasions.",
    price: 129.00,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    category: "Men",
    stock: 15
  },
  {
    name: "Silk Evening Dress",
    description: "Elegant silk slip dress featuring a draped neckline, ideal for evening events.",
    price: 189.00,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    category: "Women",
    stock: 8
  },
  {
    name: "Casual Cotton T-Shirt",
    description: "Premium 100% organic cotton basic tee. Extremely soft and durable for daily wear.",
    price: 34.00,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    category: "Unisex",
    stock: 50
  },
  {
    name: "Leather Crossbody Bag",
    description: "Handcrafted genuine leather bag with adjustable strap and multiple compartments.",
    price: 89.00,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    category: "Accessories",
    stock: 20
  },
  {
    name: "Denim Trucker Jacket",
    description: "Classic vintage wash denim jacket with a relaxed fit.",
    price: 95.00,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80",
    category: "Men",
    stock: 12
  },
  {
    name: "Floral Summer Skirt",
    description: "A breezy midi skirt with floral prints, perfect for sunny days.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?w=600&q=80",
    category: "Women",
    stock: 25
  }
];

const seedDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding!');

    // Clear existing products first
    await Product.deleteMany({});
    console.log('🗑️  Cleared old products.');

    // Insert new products
    await Product.insertMany(dummyProducts);
    console.log('🌱 Successfully seeded database with awesome products!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
