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
    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json();
    newNumbers = data.numbers;
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from external API within 500ms' });
  } finally {
    clearTimeout(timeout);
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
