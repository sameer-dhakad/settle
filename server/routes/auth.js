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

// [v53] feat(models): add splitType enum (equal, exact, percentage) on Expense
