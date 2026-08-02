import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SettleLogo from '../components/SettleLogo';
import {
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * AuthPage - Minimalist authentication supporting Light & Dark mode
 */
const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const initialMode = searchParams.get('mode') === 'signup' ? 'register' : 'login';

  const { login, register, isAuthenticated } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [defaultUpiId, setDefaultUpiId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  useEffect(() => {

// [v28] chore(server): create server entry point stub in server/server.js
