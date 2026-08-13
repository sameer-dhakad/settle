require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const tripRoutes = require('./routes/trips');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// [v167] refactor(middleware): verify payee authorization before settling debt
