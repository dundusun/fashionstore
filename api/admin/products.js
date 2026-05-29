import { connectDB } from "../db";
import Product from "../models/Product";

export default async function handler(req, res) {
  await connectDB();

  // GET — All products
  if (req.method === "GET") {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.status(200).json(products);
  }

  // POST — Add product
  if (req.method === "POST") {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  }

  // PUT — Update product
  if (req.method === "PUT") {
    const { id, ...data } = req.body;
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    return res.status(200).json(product);
  }

  // DELETE — Delete product
  if (req.method === "DELETE") {
    const { id } = req.body;
    await Product.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted!" });
  }
}
