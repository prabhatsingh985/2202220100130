import React, { useEffect, useState } from 'react';
import { fetchStocks, fetchStockHistory } from './api';
import StockChart from './StockChart';
import { useNavigate } from 'react-router-dom';

export default function StockPage() {
  const [ticker, setTicker] = useState('NVDA');
  const [minutes, setMinutes] = useState(50);
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const json = await fetchStockHistory(ticker, minutes);
        const history = Array.isArray(json)
          ? json
          : json?.priceHistory ?? (json?.stock ? [json.stock] : []);
        const prices = history.map(p => p?.price).filter(price => typeof price === 'number');

        setData(history);
        setAverage(prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0);
      } catch (error) {
        console.error('Failed to fetch stock history:', error);
        setData([]);
        setAverage(0);
      }
    };

    getData();
  }, [ticker, minutes]);

  // Inline CSS styles object
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '20px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
      color: '#222',
    },
    heading: {
      textAlign: 'center',
      color: '#fff',
      textShadow: '1px 1px 4px #0047b3',
      marginBottom: '1.5rem',
      fontWeight: '700',
      fontSize: '2rem',
    },
    label: {
      display: 'inline-block',
      marginRight: '1rem',
      fontWeight: '600',
      color: '#003d99',
      fontSize: '1rem',
    },
    select: {
      marginLeft: '0.5rem',
      padding: '6px 10px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      color: '#0047b3',
      backgroundColor: '#e0f0ff',
      boxShadow: '0 1px 5px rgba(0, 71, 179, 0.2)',
    },
    input: {
      marginLeft: '0.5rem',
      padding: '6px 10px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '1rem',
      width: '70px',
      fontWeight: '600',
      color: '#0047b3',
      backgroundColor: '#e0f0ff',
      boxShadow: '0 1px 5px rgba(0, 71, 179, 0.2)',
    },
    labelMinutes: {
      display: 'inline-block',
      fontWeight: '600',
      color: '#003d99',
      fontSize: '1rem',
      marginLeft: '2rem',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Stock Page</h2>

      <label style={styles.label}>
        Select Ticker:
        <select
          style={styles.select}
          value={ticker}
          onChange={e => setTicker(e.target.value)}
        >
          <option value="NVDA">NVDA</option>
          <option value="PYPL">PYPL</option>
          <option value="AAPL">AAPL</option>
        </select>
      </label>

      <label style={styles.labelMinutes}>
        Minutes:
        <input
          type="number"
          min="1"
          style={styles.input}
          value={minutes}
          onChange={e => setMinutes(parseInt(e.target.value, 10) || 1)}
        />
      </label>

      <StockChart data={data} average={average} />
      <button
        onClick={() => navigate('/correlation')}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '5px',
          backgroundColor: '#007acc',
          color: 'white',
          border: 'none',
        }}
      >Go to Correlation Page
      </button>
    </div>
  );
}
