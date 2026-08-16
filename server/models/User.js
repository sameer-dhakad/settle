const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  defaultUpiId: {
    type: String,
    trim: true,
    default: ''
  },
  trips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'

// [v218] refactor(server): configure dynamic PORT binding with fallback to 5001
