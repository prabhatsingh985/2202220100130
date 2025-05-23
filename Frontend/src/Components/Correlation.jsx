import React, { useEffect, useState } from 'react';

function correlation(x, y) {
  const meanX = x.reduce((a, b) => a + b, 0) / x.length;
  const meanY = y.reduce((a, b) => a + b, 0) / y.length;
  const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
  const denominator = Math.sqrt(
    x.reduce((sum, xi) => sum + (xi - meanX) ** 2, 0) *
    y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0)
  );
  return denominator !== 0 ? (numerator / denominator).toFixed(4) : 'N/A';
}

export default function CorrelationPage() {
  const [matrix, setMatrix] = useState([]);
  const tickers = ['Stock 1', 'Stock 2', 'Stock 3'];

  // Static price data
  const data1 = [
    { price: 95.53192 }, { price: 698.0434 }, { price: 623.58716 },
    { price: 626.07544 }, { price: 857.7693 }
  ];
  const data2 = [
    { price: 165.07721 }, { price: 732.75507 }, { price: 624.6393 },
    { price: 0.23993772 }, { price: 869.61566 }
  ];
  const data3 = [
    { price: 500.53992 }, { price: 826.6228 },
    { price: 237.6364 }, { price: 605.842 }
  ];

  useEffect(() => {
    const prices1 = data1.map(p => p.price);
    const prices2 = data2.map(p => p.price);
    const prices3 = data3.map(p => p.price);

    const minLen = Math.min(prices1.length, prices2.length, prices3.length);

    const p1 = prices1.slice(0, minLen);
    const p2 = prices2.slice(0, minLen);
    const p3 = prices3.slice(0, minLen);

    const prices = [p1, p2, p3];

    const corrs = prices.map((x, i) =>
      prices.map((y, j) => correlation(x, y))
    );

    setMatrix(corrs);
  }, []);

  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: '600px',
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
