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
    default: 'PENDING'
  },
  utrNumber: {
    type: String,
    trim: true,
    default: ''
  },
  markedPaidAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  }
}, { timestamps: true });

settlementSchema.index({ tripId: 1, fromMemberId: 1, toMemberId: 1, status: 1 });

module.exports = mongoose.model('Settlement', settlementSchema);
