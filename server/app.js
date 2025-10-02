import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send(`Server running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});