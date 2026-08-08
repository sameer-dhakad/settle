const express = require('express');
const crypto = require('crypto');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const Settlement = require('../models/Settlement');
const User = require('../models/User');
const { optionalAuth } = require('../middleware/auth');
const { simplifyDebts } = require('../utils/debtSimplifier');

const router = express.Router();

// Helper to bundle and format full trip payload with debt calculations
const getFullTripPayload = async (trip) => {
  const [expenses, settlements] = await Promise.all([
    Expense.find({ tripId: trip._id }).sort({ createdAt: -1 }).lean(),
    Settlement.find({ tripId: trip._id }).lean()
  ]);

  const membersMap = {};
  trip.members.forEach((m) => {
    membersMap[m._id.toString()] = m.name;
  });

  // Attach readable names to expenses
  const populatedExpenses = expenses.map((exp) => ({
    ...exp,
    paidByName: membersMap[exp.paidBy?.toString()] || 'Member',
    splits: (exp.splits || []).map((s) => ({
      ...s,
      memberName: membersMap[s.memberId?.toString()] || 'Member'
    }))
  }));

  const totalSpent = populatedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const { settlements: simplifiedDebts, balances, auditLog } = simplifyDebts(
    trip.members,
    populatedExpenses,
    settlements
  );

  return {
    trip: trip.toObject ? trip.toObject() : trip,
    expenses: populatedExpenses,
    settlements: simplifiedDebts,
    balances,
    auditLog,
    totalSpent
  };
};

// 1. POST /api/trips - Create new trip (attaches user if logged in)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { title, hostName, hostUpiId } = req.body;

    if (!title || !hostName) {
      return res.status(400).json({ error: 'Trip title and your name are required' });
    }

    const accessToken = crypto.randomBytes(12).toString('hex');
    const userId = req.user ? req.user._id : null;

    const trip = new Trip({
      title: title.trim(),
      accessToken,
      currency: 'INR',
      creatorUserId: userId,
      members: [
        {
          name: hostName.trim(),
          upiId: hostUpiId ? hostUpiId.trim() : (req.user?.defaultUpiId || ''),
          userId,
          isHost: true
        }
      ]
    });

    await trip.save();

    // If user is logged in, append trip to their profile
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { trips: trip._id } });
    }

    const payload = await getFullTripPayload(trip);
    res.status(201).json(payload);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// 2. GET /api/trips/:accessToken - Fetch trip details
router.get('/:accessToken', optionalAuth, async (req, res) => {
  try {
    const { accessToken } = req.params;
    const trip = await Trip.findOne({ accessToken });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Auto-link trip if user is logged in
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { trips: trip._id } });
    }

    const payload = await getFullTripPayload(trip);
    res.json(payload);
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Failed to retrieve trip' });
  }
});

// 3. POST /api/trips/:accessToken/join - Frictionless guest onboarding

// [v110] feat(algo): add net balance verification before computing transactions
