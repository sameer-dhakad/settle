require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const tripRoutes = require('./routes/trips');
const authRoutes = require('./routes/auth');

const app = express();

// [v111] docs(algo): add visual ASCII diagram of debt simplification in comments
