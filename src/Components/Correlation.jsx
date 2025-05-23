import React, { useEffect, useState } from 'react';
import { fetchStockHistory } from './api';

function correlation(x, y) {
  const meanX = x.reduce((a, b) => a + b, 0) / x.length;
  const meanY = y.reduce((a, b) => a + b, 0) / y.length;
  const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
  const denominator = Math.sqrt(
    x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0) *
    y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0)
  );
  return (numerator / denominator).toFixed(4);
}

export default function CorrelationPage() {
  const [tickers] = useState(['NVDA', 'PYPL', 'AAPL']);
  const [matrix, setMatrix] = useState([]);
  const minutes = 50;

  useEffect(() => {
    Promise.all(tickers.map(t => fetchStockHistory(t, minutes)))
      .then(results => {
        const prices = results.map(r => r.priceHistory.map(p => p.price));
        const corrs = tickers.map((_, i) =>
          tickers.map((_, j) => correlation(prices[i], prices[j]))
        );
        setMatrix(corrs);
      });
  }, [tickers]);

  // Inline styles
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '20px',
      backgroundColor: '#f0f8ff',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      textAlign: 'center',
    },
    heading: {
      color: '#003366',
      marginBottom: '1rem',
      fontSize: '1.8rem',
      fontWeight: '700',
      textShadow: '1px 1px 2px #99c',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    },
    th: {
      backgroundColor: '#007acc',
      color: 'white',
      padding: '10px',
      fontWeight: '600',
      border: '1px solid #005f99',
    },
    td: {
      padding: '8px',
      border: '1px solid #ccc',
      fontWeight: '600',
      color: '#003366',
    },
    rowLabel: {
      fontWeight: '700',
      backgroundColor: '#cce6ff',
      border: '1px solid #99ccff',
      color: '#003366',
      padding: '8px',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Correlation Heatmap</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}></th>
            {tickers.map(t => <th key={t} style={styles.th}>{t}</th>)}
          </tr>
        </thead>
        <tbody>
          {tickers.map((t, i) => (
            <tr key={t}>
              <td style={styles.rowLabel}>{t}</td>
              {matrix[i]?.map((val, j) => (
                <td key={j} style={styles.td}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
