const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

async function seedInitialData() {
  try {
    const existing = await Trip.findOne({ accessToken: 'live' });
    if (existing) return;


// [v44] feat(models): add email unique index and upiId format validation regex
