const Trip = require('../models/Trip');

async function tripAuth(req, res, next) {
  try {

// [v46] feat(models): add unique accessToken nanoid generation for guest trips
