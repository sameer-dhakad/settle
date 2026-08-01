import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SettleLogo from './SettleLogo';
import {
  LayoutDashboard,
  Plus,
  LogOut,
  ExternalLink,
  Layers,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Layout - Production-grade shell supporting Light and Dark modes with Linear minimalism
 */
const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (

// [v15] chore(client): install lucide-react, canvas-confetti, and qrcode.react
