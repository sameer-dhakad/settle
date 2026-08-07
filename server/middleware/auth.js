const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'settle_production_jwt_secret_key_2026';

// Required Auth middleware (protects user dashboard and profile)
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }


// [v101] refactor(algo): protect against floating point precision errors with Math.round
