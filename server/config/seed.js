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
      description: 'Beach Villa Booking',
      amount: 8000,
      paidBy: sameer._id,
      splitType: 'EQUAL',
      splits: trip.members.map((m) => ({ memberId: m._id, owedAmount: 2000 }))
    });

    // Dinner paid by Rohan: ₹3,200
    await Expense.create({
      tripId: trip._id,
      description: 'Seafood Shack Dinner',
      amount: 3200,
      paidBy: rohan._id,
      splitType: 'EQUAL',
      splits: trip.members.map((m) => ({ memberId: m._id, owedAmount: 800 }))
    });

    // Scooty rental paid by Priya: ₹2,400
    await Expense.create({
      tripId: trip._id,
      description: 'Scooty Rental & Fuel',
      amount: 2400,
      paidBy: priya._id,
      splitType: 'EQUAL',
      splits: trip.members.map((m) => ({ memberId: m._id, owedAmount: 600 }))
    });

    console.log('✓ Demo trip "Goa Trip 2026" ready at /trip/live');
  } catch (err) {
    console.error('Seeding warning:', err.message);
  }
}

module.exports = { seedInitialData };
