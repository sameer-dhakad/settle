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

// [v54] feat(models): add splits array subdocument detailing member obligations
