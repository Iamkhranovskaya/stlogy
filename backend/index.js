const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/consultation', async (req, res) => {
  const { name, phone, email, date, time, contactMethod, messenger, comment } = req.body;

  try {
    await pool.query(
      'INSERT INTO consultations (name, phone, email, date, time, contact_method, messenger, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [name, phone, email, date, time, contactMethod, messenger, comment]
    );
    res.json({ message: 'Заявка получена' });
  } catch (error) {
    console.error('Ошибка при добавлении в базу:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 