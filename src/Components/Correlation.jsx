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
  }, []);

  return (
    <div>
      <h2>Correlation Heatmap</h2>
      <table>
        <thead>
          <tr><th></th>{tickers.map(t => <th key={t}>{t}</th>)}</tr>
        </thead>
        <tbody>
          {tickers.map((t, i) => (
            <tr key={t}>
              <td>{t}</td>
              {matrix[i]?.map((val, j) => <td key={j}>{val}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}