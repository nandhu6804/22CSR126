import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

const PORT = 9876;
const WINDOW_SIZE = 10;
const VALID_IDS = {
  p: 'primes',
  f: 'fibo',
  e: 'even',
  r: 'rand'
};

let windowData = [];

function getAverage(arr) {
  if (arr.length === 0) return 0;
  return parseFloat((arr.reduce((sum, n) => sum + n, 0) / arr.length).toFixed(2));
}

app.get('/numbers/:id', async (req, res) => {
  const id = req.params.id;
  const endpoint = VALID_IDS[id];

  if (!endpoint) {
    return res.status(400).json({ error: 'Invalid ID. Use one of p, f, e, r' });
  }

  const url = `http://20.244.56.144/evaluation-service/${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 500);

  let newNumbers = [];

  try {
    const headers = {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MDMyNTUyLCJpYXQiOjE3NDcwMzIyNTIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjJhMmFlYWJkLWIwZDMtNGNiNC1iZDViLTMwOWUxM2YxMGZjZiIsInN1YiI6Im5hbmRoaXRoYXAuMjJjc2VAa29uZ3UuZWR1In0sImVtYWlsIjoibmFuZGhpdGhhcC4yMmNzZUBrb25ndS5lZHUiLCJuYW1lIjoibmFuZGhpdGhhIHAiLCJyb2xsTm8iOiIyMmNzcjEyNiIsImFjY2Vzc0NvZGUiOiJqbXBaYUYiLCJjbGllZW50SUQiOiIyYTFkYmNhZC0wNzMwLTFkMjgtOWFjMy1mZDQzLTA1ZDgyYzg0M2ZjYSJ9'
    };
    const response = await fetch(url, {
      signal: controller.signal,
      headers: headers
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    const data = await response.json();
    console.log('Fetched data from external API:', data);

    if (data.message) {
      console.log('Authorization Error:', data.message); // Log the error message
      return res.status(401).json({ error: data.message });
    }

    newNumbers = data.numbers || [];
  } catch (err) {
    console.error('Error fetching from external API:', err);
    return res.status(500).json({ error: 'Failed to fetch from external API within 500ms' });
  } finally {
    clearTimeout(timeout);
  }

  if (newNumbers.length === 0) {
    return res.status(500).json({ error: 'No numbers found in the response from external API' });
  }

  const windowPrevState = [...windowData];
  const uniqueNewNumbers = newNumbers.filter(num => !windowData.includes(num));

  for (const num of uniqueNewNumbers) {
    if (windowData.length >= WINDOW_SIZE) {
      windowData.shift();
    }
    windowData.push(num);
  }

  const avg = getAverage(windowData);

  res.json({
    windowPrevState,
    windowCurrState: [...windowData],
    numbers: newNumbers,
    avg
  });
});

app.listen(PORT, () => {
  console.log(`Average Calculator Microservice running at http://localhost:${PORT}`);
});
