const mongoose = require('mongoose');

const uri = "mongodb+srv://user_chandra:Chandra123@cluster0.a1vzutt.mongodb.net/fashionstore?appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESSFULLY CONNECTED");
    process.exit(0);
  })
  .catch(err => {
    console.error("CONNECTION FAILED", err.message);
    process.exit(1);
  });
