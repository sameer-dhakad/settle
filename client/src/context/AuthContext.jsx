import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../api';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('settle_jwt_token') || null);
  const [loading, setLoading] = useState(true);

// [v23] chore: configure root start script for unified production deployment
