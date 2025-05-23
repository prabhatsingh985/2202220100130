import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StockPage from './Components/StockPage';
import CorrelationPage from './Components/CorrelationPage';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Stock Analytics
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Stock Page
          </Button>
          <Button color="inherit" component={Link} to="/correlation">
            Correlation Heatmap
          </Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<StockPage />} />
        <Route path="/correlation" element={<CorrelationPage />} />
      </Routes>
    </Router>
  );
}