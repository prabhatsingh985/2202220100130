import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StockPage from './Components/StockPage';
import CorrelationPage from './Components/Correlation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StockPage />} />
        <Route path="/correlation" element={<CorrelationPage />} />
      </Routes>
    </Router>
  );
}

export default App;