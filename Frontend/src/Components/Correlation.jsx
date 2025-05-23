import React, { useEffect, useState } from 'react';

const StockTableDisplay = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const responses = await Promise.all([
        fetch('http://localhost:5000/stocks/PYPL?minutes=50').then(res => res.json()),
        fetch('http://localhost:5000/stocks/NVDA?minutes=50').then(res => res.json()),
        fetch('http://localhost:5000/stocks/AAPL?minutes=50').then(res => res.json()),
      ]);

      setData({
        PYPL: responses[0],
        NVDA: responses[1],
        AAPL: responses[2],
      });
    }

    fetchData();
  }, []);

  const renderTable = (symbol, records) => (
    <div key={symbol} style={{ marginBottom: '40px' }}>
      <h2 style={{ color: '#fff' }}>{symbol}</h2>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#111',
        color: '#0f0',
        fontFamily: 'monospace'
      }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #0f0' }}>
            <th style={{ padding: '10px' }}>Price</th>
            <th style={{ padding: '10px' }}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {records.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '10px' }}>{item.price.toFixed(2)}</td>
              <td style={{ padding: '10px' }}>{new Date(item.lastUpdatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#000', padding: '30px', minHeight: '100vh' }}>
      {data ? (
        Object.entries(data).map(([symbol, records]) =>
          renderTable(symbol, records)
        )
      ) : (
        <p style={{ color: '#0f0', fontFamily: 'monospace' }}>Loading stock data...</p>
      )}
    </div>
  );
};

export default StockTableDisplay;
