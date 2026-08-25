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
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard')
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/create"
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                    isActive('/create')
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/60 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Trip</span>
                </Link>
              </>
            ) : null}
          </nav>

          {/* Right: Theme Toggle & Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Moon className="w-4 h-4 text-zinc-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 pl-2 pr-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-xs font-mono text-zinc-700 dark:text-zinc-300">
                  <div className="w-4 h-4 rounded-sm bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center text-[10px] font-semibold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[100px] hidden sm:inline">{user?.name}</span>
                </div>

                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 rounded-md text-xs font-medium transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-1.5 text-zinc-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth"
                  className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  Log In
                </Link>

                <Link
                  to="/create"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 rounded-md text-xs font-medium transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Trip</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 relative">
        <Outlet />
      </main>

      {/* Minimalist Staff-Grade Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 py-8 text-xs text-zinc-500 dark:text-zinc-500 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-800 dark:text-zinc-300">Settle</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span>Minimalist debt engine & instant UPI payments</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>All systems normal</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <Link to="/trip/live" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-[11px]">
              Live Demo
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <Link to="/how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-[11px]">
              Min-Flow Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
