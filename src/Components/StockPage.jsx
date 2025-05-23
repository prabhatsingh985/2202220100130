import React, { useEffect, useState } from 'react';
import { MenuItem, Select, Typography, CircularProgress, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function StockPage() {
    const [ticker, setTicker] = useState('AAPL');
    const [minutes, setMinutes] = useState(30);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(
            `http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}&aggregation=average`,
            {
                headers: {
                    Authorization: 'Bearer ',
                },
            }
        )
            .then((res) => res.json())
            .then((json) => setData(json))
            .catch((err) => console.error('Error fetching stock data:', err));
    }, [ticker, minutes]);


    const options = [5, 15, 30, 60, 120];

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Stock Price for {ticker}
            </Typography>
            <Select value={minutes} onChange={(e) => setMinutes(e.target.value)}>
                {options.map((m) => (
                    <MenuItem key={m} value={m}>
                        Last {m} minutes
                    </MenuItem>
                ))}
            </Select>
            {data ? (
                <>
                    <Typography variant="h6" color="secondary">
                        Average: {data.averageStockPrice.toFixed(2)}
                    </Typography>
                    <Line
                        data={{
                            labels: data.priceHistory.map((p) => new Date(p.lastUpdatedAt).toLocaleTimeString()),
                            datasets: [
                                {
                                    label: 'Price',
                                    data: data.priceHistory.map((p) => p.price),
                                    borderColor: 'blue',
                                    fill: false,
                                },
                                {
                                    label: 'Average Price',
                                    data: data.priceHistory.map(() => data.averageStockPrice),
                                    borderColor: 'red',
                                    borderDash: [10, 5],
                                    fill: false,
                                },
                            ],
                        }}
                    />
                </>
            ) : (
                <CircularProgress />
            )}
        </Box>
    );
}