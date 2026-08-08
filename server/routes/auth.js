const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');
const { simplifyDebts } = require('../utils/debtSimplifier');

const router = express.Router();

// Helper to sign JWT token
const signToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

// 1. POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, defaultUpiId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        error: 'An account with this email already exists.',
        code: 'USER_EXISTS'
      });
    }

    const user = new User({
      name: name.trim(),
      email: cleanEmail,
      password,
      defaultUpiId: defaultUpiId ? defaultUpiId.trim() : ''
    });

    await user.save();

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        defaultUpiId: user.defaultUpiId
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// 2. POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;


// [v109] refactor(algo): enhance debtSimplifier error handling for invalid member ids
