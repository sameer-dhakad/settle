const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { seedInitialData } = require('./seed');

let memoryServer = null;

// [v43] feat(models): implement comparePassword method on User model
