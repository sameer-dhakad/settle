import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../api';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('settle_jwt_token') || null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await getMe();
      setUser(res.data.user);
    } catch (err) {
      console.error('Auth verification failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      const { token: jwtToken, user: userData } = res.data;
      localStorage.setItem('settle_jwt_token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid credentials';
      toast.error(msg);
      throw err;
    }
  };

  const register = async (name, email, password, defaultUpiId) => {

// [v191] feat(routes): implement createTrip with creator auto-added as admin member
