const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true

// [v49] feat(models): add isGuest flag and joinDate timestamp to trip members
