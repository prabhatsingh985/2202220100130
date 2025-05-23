import React, { useEffect, useState } from 'react';
import { fetchStocks, fetchStockHistory } from './api';
import StockChart from '../Components/StockChart';

export default function StockPage() {
  const [ticker, setTicker] = useState('NVDA');
  const [minutes, setMinutes] = useState(50);
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const json = await fetchStockHistory(ticker, minutes);
        const history = json?.priceHistory ?? (json?.stock ? [json.stock] : []);
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

  return (
    <div>
      <h2>Stock Page</h2>
      <label>
        Select Ticker:
        <select value={ticker} onChange={e => setTicker(e.target.value)}>
          <option value="NVDA">NVDA</option>
          <option value="PYPL">PYPL</option>
          <option value="AAPL">AAPL</option>
        </select>
      </label>
      <label style={{ marginLeft: '1rem' }}>
        Minutes:
        <input
          type="number"
          value={minutes}
          min="1"
          onChange={e => setMinutes(parseInt(e.target.value, 10) || 1)}
        />
      </label>
      <StockChart data={data} average={average} />
    </div>
  );
}
