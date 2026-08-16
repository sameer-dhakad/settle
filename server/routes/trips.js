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
router.post('/:accessToken/join', optionalAuth, async (req, res) => {
  try {
    const { accessToken } = req.params;
    const { name, upiId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required to join' });
    }

    const trip = await Trip.findOne({ accessToken });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const cleanName = name.trim();
    const userId = req.user ? req.user._id : null;

    let member = trip.members.find(
      (m) => m.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (!member) {
      trip.members.push({
        name: cleanName,
        upiId: upiId ? upiId.trim() : (req.user?.defaultUpiId || ''),
        userId,
        isHost: false
      });
      await trip.save();
      member = trip.members[trip.members.length - 1];
    } else {
      if (upiId && !member.upiId) member.upiId = upiId.trim();
      if (userId && !member.userId) member.userId = userId;
      await trip.save();
    }

    // Link trip to user account if logged in
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { trips: trip._id } });
    }

    const payload = await getFullTripPayload(trip);
    res.json({
      ...payload,
      joinedMemberId: member._id
    });
  } catch (error) {
    console.error('Join trip error:', error);
    res.status(500).json({ error: 'Failed to join trip' });
  }
});

// 4. POST /api/trips/:accessToken/expenses - Log new expense
router.post('/:accessToken/expenses', async (req, res) => {
  try {
    const { accessToken } = req.params;
    const { description, amount, paidBy, splitType, splitMemberIds, customSplits } = req.body;

    const trip = await Trip.findOne({ accessToken });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (!description || !amount || !paidBy) {
      return res.status(400).json({ error: 'Description, amount, and payer are required' });
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const payer = trip.members.find((m) => m._id.toString() === paidBy.toString());
    if (!payer) {
      return res.status(400).json({ error: 'Invalid paidBy member' });
    }

    let calculatedSplits = [];

    if (splitType === 'EXACT' && Array.isArray(customSplits) && customSplits.length > 0) {
      let sum = 0;
      for (const s of customSplits) {
        const amt = parseFloat(s.owedAmount) || 0;
        sum += amt;
        calculatedSplits.push({
          memberId: s.memberId,
          owedAmount: amt
        });
      }
      if (Math.abs(sum - numAmount) > 0.05) {
        return res.status(400).json({
          error: `Split sum (₹${sum.toFixed(2)}) must equal total (₹${numAmount.toFixed(2)})`
        });
      }
    } else {
      // Default EQUAL split
      const selectedIds = Array.isArray(splitMemberIds) && splitMemberIds.length > 0
        ? splitMemberIds
        : trip.members.map((m) => m._id.toString());

      const perPerson = Math.round((numAmount / selectedIds.length) * 100) / 100;
      calculatedSplits = selectedIds.map((mId) => ({
        memberId: mId,
        owedAmount: perPerson
      }));
    }

    const expense = new Expense({
      tripId: trip._id,
      description: description.trim(),
      amount: numAmount,
      paidBy,
      splitType: splitType || 'EQUAL',
      splits: calculatedSplits
    });


// [v222] test(routes): test recordSettlement with 12-digit UTR reference
