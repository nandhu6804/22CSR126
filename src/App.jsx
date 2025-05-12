/*import React, { useState } from 'react';
import axios from 'axios';
function App() {
  const [numberType, setNumberType] = useState('e');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchNumbers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:9876/numbers/${numberType}`);
      setResponse(res.data);
    } catch (err) {
      console.error('Failed to fetch:', err);
      alert("Error fetching numbers.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={styles.container}>
      <h1>Average Calculator</h1>
      <div style={styles.controls}>
        <label htmlFor="numberType">Select Type:</label>
        <select
          id="numberType"
          value={numberType}
          onChange={(e) => setNumberType(e.target.value)}
        >
          <option value="e">Even</option>
          <option value="p">Prime</option>
          <option value="f">Fibonacci</option>
          <option value="r">Random</option>
        </select><br></br><br></br>
        <button onClick={fetchNumbers} disabled={loading}>
          {loading ? 'Loading...' : 'Get Numbers'}
        </button>
      </div>
      {response && (
        <div style={styles.response}>
          <h3>Results</h3>
          <p><strong>Previous Window:</strong> {JSON.stringify(response.windowPrevState)}</p>
          <p><strong>Current Window:</strong> {JSON.stringify(response.windowCurrState)}</p>
          <p><strong>Fetched Numbers:</strong> {JSON.stringify(response.numbers)}</p>
          <p><strong>Average:</strong> {response.avg.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
const styles = {
  container: {
    padding: 10,
    fontFamily: 'Times New Roman',
    maxWidth: 700,
    margin: '200px',
  },
  controls: {
    marginBottom: 20,
  },
  response: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    border: '1px solid #ddd',
  },
};
export default App;
*/
// App.jsx
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [numberType, setNumberType] = useState('e');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNumbers = async () => {
    setLoading(true);
    try {
      console.log(`Fetching numbers from: http://localhost:9876/numbers/${numberType}`);
      const res = await axios.get(`http://localhost:9876/numbers/${numberType}`);
      console.log('Response:', res.data);
      setResponse(res.data);
    } catch (err) {
      console.error('Failed to fetch:', err);
      alert("Error fetching numbers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Average Calculator</h1>
      <div style={styles.controls}>
        <label htmlFor="numberType">Select Type:</label>
        <select
          id="numberType"
          value={numberType}
          onChange={(e) => setNumberType(e.target.value)}
        >
          <option value="even">Even</option>
          <option value="prime">Prime</option>
          <option value="fibo">Fibonacci</option>
          <option value="random">Random</option>
        </select><br /><br />
        <button onClick={fetchNumbers} disabled={loading}>
          {loading ? 'Loading...' : 'Get Numbers'}
        </button>
      </div>
      {response && (
        <div style={styles.response}>
          <h3>Results</h3>
          <p><strong>Previous Window:</strong> {JSON.stringify(response.windowPrevState)}</p>
          <p><strong>Current Window:</strong> {JSON.stringify(response.windowCurrState)}</p>
          <p><strong>Fetched Numbers:</strong> {JSON.stringify(response.numbers)}</p>
          <p><strong>Average:</strong> {response.avg.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 10,
    fontFamily: 'Times New Roman',
    maxWidth: 700,
    margin: '200px',
  },
  controls: {
    marginBottom: 20,
  },
  response: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    border: '1px solid #ddd',
  },
};

export default App;