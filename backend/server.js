const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  ...(process.env.FRONTEND_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const onRenderOriginPattern = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests and safe browser origins.
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        onRenderOriginPattern.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true });
});

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '..', 'frontend', 'dist');
  const clientIndexPath = path.join(clientDistPath, 'index.html');
  const hasClientBuild = fs.existsSync(clientIndexPath);

  if (hasClientBuild) {
    app.use(express.static(clientDistPath));

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/healthz') {
        return next();
      }

      return res.sendFile(clientIndexPath);
    });
  }
}

app.get('/', (req, res) => {
  res.json({ message: 'Movie Search API is running 🎬' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
