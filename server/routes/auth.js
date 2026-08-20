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

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        error: 'No account found with this email. Please sign up first.',
        code: 'USER_NOT_FOUND'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Incorrect password. Please try again.',
        code: 'INVALID_PASSWORD'
      });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        defaultUpiId: user.defaultUpiId
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// 3. GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

// 4. GET /api/auth/dashboard - User lifetime overview across all trips with activity logs
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all trips where user is creator OR linked as a member
    const trips = await Trip.find({
      $or: [
        { creatorUserId: userId },
        { 'members.userId': userId },
        { _id: { $in: req.user.trips || [] } }
      ]
    }).sort({ updatedAt: -1 }).lean();

    let totalLifetimeSpend = 0;
    let totalPendingCollect = 0;
    let totalPendingPay = 0;

    const tripsSummary = [];
    const allRecentActivities = [];

    for (const trip of trips) {
      const [expenses, settlements] = await Promise.all([
        Expense.find({ tripId: trip._id }).lean(),
        Settlement.find({ tripId: trip._id }).lean()
      ]);

      const tripTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
      totalLifetimeSpend += tripTotal;

      const { settlements: activeDebts, balances, auditLog } = simplifyDebts(
        trip.members,
        expenses,
        settlements
      );

      // Find user's member entry in this trip
      const userMember = trip.members.find(
        (m) =>
          (m.userId && m.userId.toString() === userId.toString()) ||
          (trip.creatorUserId && trip.creatorUserId.toString() === userId.toString() && m.isHost)
      );

      let userNet = 0;
      if (userMember) {
        const balEntry = balances.find((b) => b.memberId === userMember._id.toString());
        userNet = balEntry ? balEntry.netBalance : 0;
      }

      if (userNet > 0.01) {
        totalPendingCollect += userNet;
      } else if (userNet < -0.01) {
        totalPendingPay += Math.abs(userNet);
      }

      // Collect recent activity
      auditLog.forEach((log) => {
        allRecentActivities.push({
          ...log,
          tripTitle: trip.title,
          tripAccessToken: trip.accessToken

// [v277] style(client): refine liquid glass border reflection and shadow gradients
