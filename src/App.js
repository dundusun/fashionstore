import { useState, useEffect } from "react";
import axios from "axios";
import HomePage from "./HomePage";


function App() {
  const [aemData, setAemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In production (Vercel): /api/homepage serverless function handles auth
    // In development: setupProxy.js forwards to localhost:4502
    const url = process.env.NODE_ENV === "production"
      ? "/api/homepage"
      : "/content/fashionstore/us/en/home.homedata";

    axios.get(url, {
      headers: {
        // Only needed locally (proxy doesn't forward in production)
        ...(process.env.NODE_ENV !== "production" && {
          "Authorization": "Basic " + btoa("admin:admin"),
        }),
      },
    })
      .then((res) => {
        console.log("AEM Data:", res.data);
        setAemData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading AEM content...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <HomePage data={aemData} />
    </div>
  );
}

export default App;