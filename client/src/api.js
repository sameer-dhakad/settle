import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach JWT token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('settle_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

// [v120] feat(algo): add reverse lookup for member settlement status
