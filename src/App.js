import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import storeData from './data/storeData.json';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage data={storeData} />} />
        {/* We will add more routes like /men, /women later as needed */}
        <Route path="*" element={<HomePage data={storeData} />} />
      </Routes>
    </Router>
  );
}

export default App;