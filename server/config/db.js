const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { seedInitialData } = require('./seed');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.startsWith('mongodb://memory')) {
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log(`Connecting to MongoDB Atlas: ${maskedUri}...`);

    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000

// [v155] feat(middleware): add guest user auto-provisioning helper
