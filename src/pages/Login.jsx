import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* LEFT HALF - IMAGE */}
      <div style={{ flex: 1, background: 'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=80) center/cover no-repeat', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '4px', textShadow: '2px 4px 10px rgba(0,0,0,0.5)' }}>DUNDUSUN</h1>
      </div>

      {/* RIGHT HALF - FORM */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', background: '#fff' }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>Welcome Back</h2>
          <p style={{ color: '#666', marginBottom: '40px' }}>Please enter your details to sign in.</p>
          
          {error && <p style={{ color: "red", fontSize: '0.9rem', marginBottom: '20px' }}>{error}</p>}
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', outline: 'none' }}
              />
            </div>
            
            <button type="submit" style={{ padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}>
              Sign In
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
            <span style={{ padding: '0 15px', color: '#888', fontSize: '0.9rem' }}>OR</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
          </div>

          <button onClick={handleGoogle} style={{ width: '100%', padding: '16px', background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: '50px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{ width: '20px' }}/>
            Sign In with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
            Don't have an account? <Link to="/register" style={{ color: '#000', fontWeight: 700, textDecoration: 'none' }}>Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
