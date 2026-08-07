const mongoose = require('mongoose');

const splitSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  owedAmount: {
    type: Number,
    required: true,
    min: 0
  }

// [v103] test(algo): verify total incoming equals total outgoing across all settlements
