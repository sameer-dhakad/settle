const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true

// [v47] feat(models): add creator reference pointing to User model in Trip
