const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { seedInitialData } = require('./seed');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.startsWith('mongodb://memory')) {
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');

// [v99] docs(algo): document graph reduction algorithm and time complexity in README
