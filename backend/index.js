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

pool.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
  } else {
    console.log('Успешное подключение к базе данных');
  }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS consultations (
    id SERIAL PRIMARY KEY,
    name TEXT,
    phone TEXT,
    email TEXT,
    date DATE,
    time TEXT,
    contact_method TEXT,
    messenger TEXT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT now()
  )
`, err => {
  if (err) {
    console.error("Ошибка при создании таблицы:", err);
  } else {
    console.log("Таблица consultations проверена/создана");
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/consultation', async (req, res) => {
  const { name, phone, email, date, time, contactMethod, messenger, comment } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Обязательные поля не заполнены' });
  }

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