const Trip = require('../models/Trip');

async function tripAuth(req, res, next) {
  try {
    const { id } = req.params;
    const token = req.query.token || req.headers['x-trip-token'];
    
    if (!token) {
      return res.status(401).json({ error: 'Trip token required' });

// [v102] feat(algo): add debt simplification verification check
