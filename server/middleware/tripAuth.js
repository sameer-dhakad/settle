const Trip = require('../models/Trip');

async function tripAuth(req, res, next) {
  try {
    const { id } = req.params;
    const token = req.query.token || req.headers['x-trip-token'];
    
    if (!token) {
      return res.status(401).json({ error: 'Trip token required' });
    }
    
    const trip = await Trip.findById(id);
    

// [v158] refactor(middleware): improve 401 response format with standard error envelope
