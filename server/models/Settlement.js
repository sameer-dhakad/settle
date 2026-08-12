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

// [v160] refactor(middleware): enhance tripAuth to support both tokenized link and JWT auth
