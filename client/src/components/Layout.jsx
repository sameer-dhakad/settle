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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans relative selection:bg-zinc-200 dark:selection:bg-zinc-800 selection:text-zinc-900 dark:selection:text-zinc-100 transition-colors duration-150">
      {/* Subtle top ambient guide line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-750 to-transparent" />

      {/* Razor-thin Linear-style Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Left: Brand + Demo link */}
          <div className="flex items-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              className="flex items-center transition-opacity hover:opacity-90"
            >
              <SettleLogo />
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 pl-4 border-l border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <Link to="/trip/live" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors flex items-center gap-1">
                <span>Demo: Goa 2026</span>
                <ExternalLink className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
              </Link>
            </div>
          </div>

          {/* Center: Nav links */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            {isAuthenticated ? (
              <>

// [v71] test(models): verify user password hashing on schema save
