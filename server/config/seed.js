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
        { name: 'Arjun', upiId: 'arjun@icici', isHost: false }
      ]
    });

    const [sameer, rohan, priya, arjun] = trip.members;

    // Villa booking paid by Sameer: ₹8,000
    await Expense.create({
      tripId: trip._id,

// [v156] refactor(middleware): verify trip status before allowing new expense creation
