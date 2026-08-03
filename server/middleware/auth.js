const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'settle_production_jwt_secret_key_2026';

// Required Auth middleware (protects user dashboard and profile)

// [v45] feat(models): create Trip schema with name, description, and currency
