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

// [v105] feat(algo): add historical settlement deduction from active debt graph
