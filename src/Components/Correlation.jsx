import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  Tooltip,
  Paper,
} from '@mui/material';
import { HeatMapGrid } from 'react-grid-heatmap';

export default function CorrelationPage() {
  const [minutes, setMinutes] = useState(30);
  const [stocks, setStocks] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);

  useEffect(() => {
    fetch(`http://20.244.56.144/evaluation-service/stocks`)
      .then((res) => res.json())
      .then((json) => {
        const symbols = Object.values(json);
        setStocks(symbols);
        const pairs = symbols.flatMap((a) => symbols.map((b) => [a, b]));

        Promise.all(
          pairs.map(([a, b]) =>
            fetch(
              `http://20.244.56.144/evaluation-service/stockcorrelation?minutes=${minutes}&ticker=${a}&ticker=${b}`
            )
              .then((res) => res.json())
              .then((json) => ({ a, b, value: json.correlation }))
          )
        ).then((results) => {
          const matrix = symbols.map((row) =>
            symbols.map((col) => {
              const match = results.find((x) => x.a === row && x.b === col);
              return match ? match.value : 0;
            })
          );
          setCorrelationData(matrix);
        });
      });
  }, [minutes]);

  const colors = [
    '#d73027',
    '#f46d43',
    '#fdae61',
    '#fee08b',
    '#d9ef8b',
    '#a6d96a',
    '#66bd63',
    '#1a9850',
  ];

  // Map correlation (-1 to 1) to color index (0 to colors.length-1)
  function getColor(value) {
    const idx = Math.floor(((value + 1) / 2) * (colors.length - 1));
    // Clamp index within array bounds
    return colors[Math.min(Math.max(idx, 0), colors.length - 1)];
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Correlation Heatmap (last {minutes} minutes)
      </Typography>
      <Select
        value={minutes}
        onChange={(e) => setMinutes(Number(e.target.value))}
        sx={{ mb: 3, minWidth: 150 }}
      >
        {[5, 15, 30, 60, 120].map((m) => (
          <MenuItem key={m} value={m}>
            Last {m} minutes
          </MenuItem>
        ))}
      </Select>
      {correlationData.length > 0 && stocks.length > 0 ? (
        <Box mt={4} overflow="auto">
          <HeatMapGrid
            data={correlationData}
            xLabels={stocks}
            yLabels={stocks}
            cellRender={(x, y, value) => (
              <Tooltip title={`Correlation: ${value.toFixed(2)}`} placement="top" key={`${x}-${y}`}>
                <Paper
                  elevation={1}
                  sx={{
                    backgroundColor: getColor(value),
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: '#fff',
                    cursor: 'default',
                    userSelect: 'none',
                  }}
                >
                  {value.toFixed(2)}
                </Paper>
              </Tooltip>
            )}
            cellHeight="2rem"
            xLabelsPos="bottom"
            yLabelsPos="left"
          />
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
