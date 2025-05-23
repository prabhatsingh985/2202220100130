const express = require('express');
const axios = require('axios'); 
const cors = require('cors');

const app = express();
app.use(cors());

const BASE = 'http://20.244.56.144/evaluation-service';
const TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3OTkwNzQwLCJpYXQiOjE3NDc5OTA0NDAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImI0NDk0ZWFhLThiMTYtNGZlYy05YzkwLWI1ODI5OTcyY2ZjYiIsInN1YiI6InByYWJoYXRzaW5naHBzX2NzZTIyQGl0cy5lZHUuaW4ifSwiZW1haWwiOiJwcmFiaGF0c2luZ2hwc19jc2UyMkBpdHMuZWR1LmluIiwibmFtZSI6InByYWJoYXQgc2luZ2giLCJyb2xsTm8iOiIyMjAyMjIwMTAwMTMwIiwiYWNjZXNzQ29kZSI6ImdkQ1VIZiIsImNsaWVudElEIjoiYjQ0OTRlYWEtOGIxNi00ZmVjLTljOTAtYjU4Mjk5NzJjZmNiIiwiY2xpZW50U2VjcmV0IjoibWtzcHRaamNXQlpwTVFHRyJ9.EmOPRBcse4p3UoGlaqEUAPlWslRS7Q2-DNcnJ9QqcFc';
app.get('/stocks', async (req, res) => {
  try {
    const response = await axios.get(`${BASE}/stocks`, {
      headers: { Authorization: TOKEN }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET specific stock or stock history
app.get('/stocks/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { minutes } = req.query;
  let url = `${BASE}/stocks/${ticker}`;
  if (minutes) url += `?minutes=${minutes}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: TOKEN }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET correlation between two stocks
app.get('/stockcorrelation', async (req, res) => {
  const { minutes, ticker } = req.query;
  if (!minutes || !Array.isArray(ticker) || ticker.length !== 2) {
    return res.status(400).json({ error: 'Invalid query. Provide ?minutes=m&ticker=a&ticker=b' });
  }

  const url = `${BASE}/stockcorrelation?minutes=${minutes}&ticker=${ticker[0]}&ticker=${ticker[1]}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: TOKEN }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Backend proxy running on port 5000'));
