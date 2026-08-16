const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  owedAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true

// [v215] feat(server): assemble express app mounting auth and trips routes
