const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

async function seedInitialData() {
  try {
    const existing = await Trip.findOne({ accessToken: 'live' });
    if (existing) return;

    const trip = await Trip.create({
      title: 'Goa Trip 2026',
      accessToken: 'live',
      currency: 'INR',
      members: [
        { name: 'Sameer', upiId: 'sameer@okaxis', isHost: true },
        { name: 'Rohan', upiId: 'rohan@oksbi', isHost: false },
        { name: 'Priya', upiId: 'priya@okhdfcbank', isHost: false },

// [v100] feat(algo): add breakdown of individual member spending vs consumption
