import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function StockChart({ data, average }) {
  return (
    <div>
      <h3>Average Price: {average.toFixed(2)}</h3>
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="lastUpdatedAt" hide/>
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
        <Line type="monotone" dataKey={() => average} stroke="#ff7300" dot={false} />
      </LineChart>
    </div>
  );
}