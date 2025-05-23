const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const BASE = 'http://20.244.56.144/evaluation-service';

// Auth credentials
const authPayload = {
  email: "prabhatsinghps_cse22@its.edu.in",
  name: "Prabhat Singh",
  rollNo: "2202220100130",
  accessCode: "gdCUHf",
  clientID: "b4494eaa-8b16-4fec-9c90-b5829972cfcb",
  clientSecret: "mksptZjcWBZpMQGG"
};

// Helper function to get token from auth API
async function getToken() {
  try {
    const response = await axios.post(`${BASE}/auth`, authPayload);
    // Assuming the token is in response.data.token (adjust if different)
    return response.data.access_token;
  } catch (err) {
    console.error('Failed to get token:', err.message);
    throw err;
  }
}

app.get('/stocks', async (req, res) => {
  try {
    const token = await getToken();
    const response = await axios.get(`${BASE}/stocks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/stocks/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { minutes } = req.query;
  let url = `${BASE}/stocks/${ticker}`;
  if (minutes) url += `?minutes=${minutes}`;

  try {
    const token = await getToken();
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/stockcorrelation', async (req, res) => {
  const { minutes, ticker } = req.query;
  if (!minutes || !Array.isArray(ticker) || ticker.length !== 2) {
    return res.status(400).json({ error: 'Invalid query. Provide ?minutes=m&ticker=a&ticker=b' });
  }

  const url = `${BASE}/stockcorrelation?minutes=${minutes}&ticker=${ticker[0]}&ticker=${ticker[1]}`;

  try {
    const token = await getToken();
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Backend proxy running on port 5000'));
