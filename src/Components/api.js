export const fetchStocks = () => fetch('http://localhost:5000/stocks').then(res => res.json());

export const fetchStockHistory = (ticker, minutes) =>
  fetch(`http://localhost:5000/stocks/${ticker}?minutes=${minutes}`).then(res => res.json());
