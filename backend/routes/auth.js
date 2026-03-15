const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const getAuthConfig = () => ({
  email: process.env.AUTH_EMAIL || 'admin@reelradar.local',
  password: process.env.AUTH_PASSWORD || 'ReelRadar@123',
  jwtSecret: process.env.JWT_SECRET || 'change_this_to_a_long_random_secret',
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const auth = getAuthConfig();

  if (email !== auth.email || password !== auth.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ email }, auth.jwtSecret, { expiresIn: '1d' });

  return res.json({
    token,
    user: {
      email,
      name: 'ReelRadar User',
    },
  });
});

module.exports = router;
