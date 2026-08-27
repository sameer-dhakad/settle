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
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  splitType: {
    type: String,
    enum: ['EQUAL', 'EXACT'],
    default: 'EQUAL'
  },
  splits: [splitSchema]
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
