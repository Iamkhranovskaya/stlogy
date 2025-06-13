const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const EMAIL_FROM = process.env.EMAIL_LOGIN;
const EMAIL_PASS = process.env.EMAIL_PASSWORD;
const SMTP_HOST = process.env.SMTP_HOST;
const JWT_SECRET = process.env.JWT_SECRET;

if (!EMAIL_FROM || !EMAIL_PASS || !SMTP_HOST || !JWT_SECRET || !process.env.DATABASE_URL) {
  console.error('❌ Не заданы обязательные переменные окружения');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASS
  }
});

pool.connect(err => {
  if (err) {
    console.error('❌ Ошибка подключения к базе данных:', err);
  } else {
    console.log('✅ Подключение к базе данных установлено');
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

app.post('/api/send-email-code', async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const existing = await pool.query(`SELECT * FROM email_codes WHERE email = $1 AND expires_at > NOW()`, [email]);
    if (existing.rowCount > 0) {
      return res.status(429).json({ error: 'Код уже отправлен, подождите' });
    }

    await pool.query(`
      INSERT INTO email_codes (email, code, expires_at)
      VALUES ($1, $2, NOW() + interval '5 minutes')
    `, [email, code]);

    await transporter.sendMail({
      from: `Stlogy <${EMAIL_FROM}>`,
      to: email,
      subject: 'Код для входа',
      text: `Ваш код подтверждения: ${code}`
    });

    console.log(`📧 Код ${code} отправлен на ${email}`);
    res.json({ message: 'Код отправлен на email' });
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error.message);
    res.status(500).json({ error: 'Ошибка при отправке письма' });
  }
});

app.post('/api/verify-email-code', async (req, res) => {
  const { email, code } = req.body;

  try {
    const result = await pool.query(`
      SELECT * FROM email_codes
      WHERE email = $1 AND code = $2 AND expires_at > NOW()
    `, [email, code]);

    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: 'Неверный или просроченный код' });
    }

    await pool.query('DELETE FROM email_codes WHERE email = $1 AND code = $2', [email, code]);

    let user = (await pool.query('SELECT id, role, is_blocked FROM users WHERE email = $1', [email])).rows[0];
    if (!user) {
      await pool.query(`
        INSERT INTO users (email, role, last_login, registration_date)
        VALUES ($1, 'user', NOW(), NOW())
      `, [email]);
      user = (await pool.query('SELECT id, role, is_blocked FROM users WHERE email = $1', [email])).rows[0];
    } else {
      await pool.query(`UPDATE users SET last_login = NOW() WHERE email = $1`, [email]);
    }

    if (user.is_blocked) {
      return res.status(403).json({ success: false, message: 'Пользователь заблокирован' });
    }

    const token = jwt.sign({ id: user.id, email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error('❌ Ошибка при авторизации:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Нет токена' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // теперь доступен req.user.id, req.user.email, req.user.role
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role, last_login FROM users WHERE id = $1', [req.user.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Пользователь не найден' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при получении профиля:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Очистка устаревших кодов каждые 5 минут
setInterval(() => {
  pool.query('DELETE FROM email_codes WHERE expires_at < NOW()')
    .then(() => console.log('✅ Очистка устаревших кодов выполнена'))
    .catch(err => console.error('❌ Ошибка при очистке кодов:', err));
}, 5 * 60 * 1000); 