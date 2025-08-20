// Entry point utama backend

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { authRouter } = require('./auth/auth.routes');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
  credentials: true,
}));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));

app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));
app.use('/api/v1/auth', authRouter);

// 404 & error handler
app.use((_req, res) => res.status(404).json({ message: 'Not Found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
