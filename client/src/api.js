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
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const getDashboardStats = () => api.get('/auth/dashboard');
export const getDashboardOverview = () => api.get('/auth/dashboard');
export const claimTrip = (accessToken, data) => api.post(`/auth/claim-trip/${accessToken}`, data);

// Trip APIs
export const createTrip = (data) => api.post('/trips', data);
export const getTrip = (accessToken) => api.get(`/trips/${accessToken}`);
export const joinTrip = (accessToken, data) => api.post(`/trips/${accessToken}/join`, data);
export const addExpense = (accessToken, data) => api.post(`/trips/${accessToken}/expenses`, data);
export const deleteExpense = (accessToken, expenseId) => api.delete(`/trips/${accessToken}/expenses/${expenseId}`);

// [v288] feat(components): add guest session indicator pill in Layout header
