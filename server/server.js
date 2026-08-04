require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// [v55] feat(models): add category enum (food, travel, stay, entertainment, other)
