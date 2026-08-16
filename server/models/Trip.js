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

// [v217] feat(server): add graceful shutdown handlers for mongodb connection
