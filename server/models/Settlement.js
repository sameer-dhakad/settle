const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
    index: true
  },
  fromMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  toMemberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED'],

// [v216] feat(server): add root /api status ping endpoint in server.js
