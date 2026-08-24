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

// [v327] style(components): enhance liquid glass card blur and frosted borders in TripView
