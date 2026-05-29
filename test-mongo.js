require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB Atlas:", err);
    process.exit(1);
  });
