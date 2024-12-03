const express = require('express');
const app = express();

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(3050, () => {
  console.log('Backend listening on port https://localhost:3050');
});