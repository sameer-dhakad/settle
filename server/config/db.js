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
      });
      console.log(`✓ MongoDB connected successfully: ${conn.connection.host}`);
      await seedInitialData();
      return;
    } catch (error) {
      console.warn(`⚠️ Cloud MongoDB connection failed (${error.message}).`);
      console.log('⚡ Starting local embedded MongoMemoryServer for reliable offline development...');
    }
  }

  try {
    memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✓ Embedded MongoDB active at: ${memoryUri}`);
    await seedInitialData();
  } catch (memError) {
    console.error('Critical DB Failure:', memError.message);
    process.exit(1);
  }
};

module.exports = connectDB;
