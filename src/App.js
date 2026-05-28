import { useState, useEffect } from "react";
import axios from "axios";
import HomePage from "./HomePage";


function App() {
  const [aemData, setAemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`/aem/content/fashionstore/us/en/home.model.json`)
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