const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  upiId: {
    type: String,
    trim: true,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isHost: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  accessToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  creatorUserId: {
    type: mongoose.Schema.Types.ObjectId,

// [v329] style(components): refine mobile responsiveness for PaymentModal QR code container
