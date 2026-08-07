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

// [v104] refactor(algo): format simplified transactions with clean human readable labels
