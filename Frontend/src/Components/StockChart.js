import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function StockChart({ data, average }) {
  const dataWithAverage = data.map(item => ({
    ...item,
    average: average,
  }));

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <h3 style={{ color: '#333' }}>Average Price: {average.toFixed(2)}</h3>
      <LineChart width={600} height={300} data={dataWithAverage} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="lastUpdatedAt" hide />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={{ r: 3 }} />
        <Line type="monotone" dataKey="average" stroke="#ff7300" dot={false} strokeDasharray="5 5" />
      </LineChart>
    </div>
  );
}
