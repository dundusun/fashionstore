import { useState, useEffect } from "react";
import axios from "axios";
import HomePage from "./HomePage";

function App() {
  const [aemData, setAemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In production (Vercel): use the Vercel serverless proxy (/api/homepage)
    // In development: use local AEM proxy (setupProxy.js handles it)
    const url = process.env.NODE_ENV === "production"
      ? "/api/homepage"
      : "/content/fashionstore/us/en/home.homedata";

    axios.get(url)
      .then((res) => {
        setAemData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#fff' }}>
        <p>Loading dynamic data from AEM...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0a', color: '#ff4444' }}>
        <p>Error: {error}. Please ensure AEM/ngrok is running.</p>
      </div>
    );
  }

  return (
    <div>
      <HomePage data={aemData} />
    </div>
  );
}

export default App;