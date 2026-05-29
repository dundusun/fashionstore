import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* LEFT HALF - IMAGE (Hidden on mobile) */}
      <div 
        className="hidden lg:flex flex-1 items-center justify-center relative bg-black overflow-hidden"
      >
        <img 
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=80" 
          alt="Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <Link to="/" className="relative z-10 text-white text-6xl font-black uppercase tracking-[0.2em] hover:scale-105 transition-transform drop-shadow-2xl">
          DUNDUSUN
        </Link>
      </div>

      {/* RIGHT HALF - FORM */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24 bg-white relative">
        <Link to="/" className="lg:hidden text-black text-2xl font-black uppercase tracking-widest absolute top-8 left-8">
          DUNDUSUN
        </Link>

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-4xl font-black mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 font-medium mb-10 text-lg">Please enter your details to sign in.</p>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 font-medium text-sm border border-red-100 flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-black focus:border-black block p-4 font-medium outline-none transition-all"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Password</label>
                <span className="text-xs font-bold text-gray-400 hover:text-black cursor-pointer transition-colors">Forgot Password?</span>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl focus:ring-black focus:border-black block p-4 font-medium outline-none transition-all"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 mt-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-xl ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 hover:-translate-y-1'
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center my-8">
            <hr className="flex-1 border-t border-gray-200" />
            <span className="px-4 text-gray-400 text-xs font-bold uppercase tracking-widest">OR</span>
            <hr className="flex-1 border-t border-gray-200" />
          </div>

          <button 
            onClick={handleGoogle} 
            className="w-full py-4 bg-white text-black border-2 border-gray-200 rounded-xl font-bold text-base cursor-pointer flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5" />
            Sign In with Google
          </button>

          <p className="text-center mt-12 text-gray-500 font-medium">
            Don't have an account? <Link to="/register" className="text-black font-black underline hover:text-gray-700 transition-colors">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
