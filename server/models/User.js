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
  }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {

// [v274] style(client): add delicate backdrop blur filters on glass panels
