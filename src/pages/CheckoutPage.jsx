import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";

function CheckoutPage() {
  const { cart, totalPrice, setCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (cart.length === 0) return;

    setLoading(true);

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on our backend
      const result = await axios.post("/api/razorpay/create-order", { amount: totalPrice });
      if (!result.data) {
        alert("Server error. Are you online?");
        setLoading(false);
        return;
      }

      const { amount, id: order_id, currency } = result.data;

      // 2. Setup Razorpay options
      const options = {
        key: "rzp_test_SvRi5qjnF7GiKx", // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: "Dundusun Fashion Store",
        description: "Test Transaction",
        image: "https://i.ibb.co/3kX9qX6/logo.png",
        order_id: order_id,
        handler: async function (response) {
          // 3. Payment Successful -> Save order in our DB
          const data = {
            userId: user.uid,
            userEmail: user.email,
            items: cart,
            totalPrice,
            address,
            status: "paid",
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
          };
          
          await axios.post("/api/orders", data);
          setSuccess(true);
          setCart([]); // clear cart
          setTimeout(() => navigate("/orders"), 2000);
        },
        prefill: {
          name: address.name || user.displayName || "Test User",
          email: user.email,
          contact: address.phone || "9999999999",
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar isTransparent={false} />
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Payment Successful!</h2>
          <p className="text-gray-500 text-lg font-medium">Your order has been placed securely via Razorpay.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar isTransparent={false} />
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black mb-12 tracking-tight uppercase">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT COL - Address Form */}
          <div className="flex-1 bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-black mb-8 border-b border-gray-100 pb-4">Delivery Details</h2>
            
            <form className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <input 
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-black focus:border-black block p-4 font-medium outline-none transition-all" 
                    placeholder="John Doe" 
                    onChange={(e) => setAddress({ ...address, name: e.target.value })} 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number</label>
                  <input 
                    type="tel"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-black focus:border-black block p-4 font-medium outline-none transition-all" 
                    placeholder="+1 (555) 000-0000" 
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })} 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Street Address</label>
                <input 
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-black focus:border-black block p-4 font-medium outline-none transition-all" 
                  placeholder="123 Fashion Ave, Suite 100" 
                  onChange={(e) => setAddress({ ...address, street: e.target.value })} 
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">City</label>
                  <input 
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-black focus:border-black block p-4 font-medium outline-none transition-all" 
                    placeholder="New York" 
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} 
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Postal Code</label>
                  <input 
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-black focus:border-black block p-4 font-medium outline-none transition-all" 
                    placeholder="10001" 
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })} 
                  />
                </div>
              </div>
            </form>
          </div>

          {/* RIGHT COL - Order Summary */}
          <div className="w-full lg:w-[450px] bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 h-fit sticky top-24">
            <h3 className="text-xl font-black mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
            
            <div className="flex flex-col gap-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-4 group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 leading-tight mb-1">{item.name}</h4>
                    <p className="text-gray-500 text-sm font-medium">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-black text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-center mb-2 text-gray-500 font-medium">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-gray-500 font-medium">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">Free</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-6">
                <span className="text-xl font-black uppercase tracking-wide">Total</span>
                <span className="text-4xl font-black">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleOrder} 
              disabled={loading || cart.length === 0} 
              className={`w-full py-5 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-xl ${
                loading || cart.length === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1'
              }`}
            >
              {loading ? "Processing..." : "Place Order →"}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-6 font-medium">
              🔒 Secure encrypted checkout.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
