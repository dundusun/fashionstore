import { connectDB } from "./db";
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }
  ],
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered"],
    default: "pending"
  },
  address: {
    name: String,
    phone: String,
    street: String,
    city: String,
    pincode: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const { userId } = req.query;
    if (userId) {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 });
      return res.status(200).json(orders);
    } else {
      // If no userId, assume admin fetch all orders
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }
  }

  if (req.method === "POST") {
    const order = await Order.create(req.body);
    return res.status(201).json(order);
  }

  if (req.method === "PATCH") {
    const { id, status } = req.body;
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return res.status(200).json(order);
  }
}
