const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const productsData = require('./products.json');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to MongoDB');
  try {
    // Delete existing products to avoid duplicate ID errors if you run it multiple times
    // We will just remove _id to let MongoDB auto-generate clean ObjectIDs
    const cleanData = productsData.map(p => {
      const { _id, __v, ...rest } = p;
      return rest;
    });

    // Option 1: Add without deleting old ones
    await Product.insertMany(cleanData);
    
    // Option 2 (Uncomment if you want to wipe old products first):
    // await Product.deleteMany({});
    // await Product.insertMany(cleanData);

    console.log(`✅ Successfully seeded ${cleanData.length} products to the database!`);
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}).catch(err => console.log(err));
