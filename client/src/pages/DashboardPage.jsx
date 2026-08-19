import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api';
import {
  Plus,
  ArrowRight,
  Share2,
  Check,
  TrendingUp,
  TrendingDown,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  }
};

/**
 * DashboardPage - Production-grade fintech dashboard supporting Light & Dark mode
 */
const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/dashboard');
      return;
    }

    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await getDashboardStats();
        setData(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [isAuthenticated, navigate]);

  const copyTripLink = (e, accessToken) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/trip/${accessToken}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(accessToken);
    toast.success('Trip invite link copied');
    setTimeout(() => setCopiedToken(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-zinc-500">Loading metrics...</p>
      </div>
    );
  }

  const { stats = {}, trips = [] } = data || {};
  const netStanding = (stats.totalToCollect || 0) - (stats.totalToPay || 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-16"
    >
      {/* Header */}
      <motion.div variants={cardVariants} className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Dashboard
        </h1>

        <Link
          to="/create"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium rounded-md text-xs transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New trip</span>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={cardVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Net Balance */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-4 space-y-1 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Net Standing
          </span>
          <div
            className={`text-2xl font-semibold font-mono ${
              netStanding > 0.01
                ? 'text-emerald-600 dark:text-emerald-400'
                : netStanding < -0.01
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {netStanding > 0.01
              ? `+ ₹${netStanding.toFixed(2)}`
              : netStanding < -0.01
              ? `- ₹${Math.abs(netStanding).toFixed(2)}`
              : '₹0.00'}
          </div>
        </motion.div>

        {/* To Collect */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-4 space-y-1 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            To Collect
          </span>
          <div className="text-2xl font-semibold font-mono text-emerald-600 dark:text-emerald-400">
            ₹{(stats.totalToCollect || 0).toFixed(2)}
          </div>
        </motion.div>

        {/* To Pay */}
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-4 space-y-1 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            To Pay
          </span>
          <div className="text-2xl font-semibold font-mono text-rose-600 dark:text-rose-400">
            ₹{(stats.totalToPay || 0).toFixed(2)}
          </div>
        </motion.div>
      </motion.div>

      {/* Active Trips Section */}
      <motion.div variants={cardVariants} className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Active Trips ({trips.length})
            </h2>
          </div>
        </div>


// [v254] style(client): create custom button gradients and glowing border utilities
