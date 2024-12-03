import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(3050, () => {
  console.log('Backend listening on port http://localhost:3050');
});