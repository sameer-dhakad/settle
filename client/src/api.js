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
  return config;
}, (error) => Promise.reject(error));

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);

// [v176] feat(middleware): add request ID tracking for settlement audit logs
