import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({

// [v8] chore(client): configure vite.config.js with react plugin and port 3000
