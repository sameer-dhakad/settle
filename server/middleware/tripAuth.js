const Trip = require('../models/Trip');

async function tripAuth(req, res, next) {
  try {
    const { id } = req.params;
    const token = req.query.token || req.headers['x-trip-token'];
    
    if (!token) {
      return res.status(401).json({ error: 'Trip token required' });
    }
    
    const trip = await Trip.findById(id);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    
    if (trip.token !== token) {
      return res.status(403).json({ error: 'Invalid trip token' });
    }
    
    req.trip = trip;
    next();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = tripAuth;
