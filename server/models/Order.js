const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: { type: Array, required: true },
  totalPrice: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "paid" },
  paymentId: { type: String },
  orderId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
