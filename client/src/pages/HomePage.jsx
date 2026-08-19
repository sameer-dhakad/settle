import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Smartphone,
  ExternalLink,
  GitCommit,
  QrCode,
  Link2
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.02 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 26 }
  }
};

/**
 * HomePage - Minimalist, high-craft Linear-style landing
 * No subheadings, no wall-of-text subtexts. Pure product focus.
 */
const HomePage = () => {
  const navigate = useNavigate();
  const [quickTitle, setQuickTitle] = useState('');

  const handleQuickCreate = (e) => {
    e.preventDefault();
    if (quickTitle.trim()) {
      navigate(`/create?title=${encodeURIComponent(quickTitle.trim())}`);
    } else {
      navigate('/create');
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 sm:space-y-16 py-6 sm:py-10"
    >
      {/* ───────────────────────────────────────────────────────────
          1. HERO - Minimal, bold, direct
         ─────────────────────────────────────────────────────────── */}
      <section className="text-center max-w-2xl mx-auto space-y-6">
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Split group expenses.<br />Settle instantly on UPI.
        </motion.h1>

        {/* Inline Quick Action Bar */}
        <motion.div variants={itemVariants} className="max-w-md mx-auto pt-1">
          <form
            onSubmit={handleQuickCreate}
            className="flex items-center gap-2 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xs focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors"
          >
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Trip name (e.g. Goa 2026)"
              className="flex-1 px-3 py-1.5 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <span>Start trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <Link
              to="/trip/live"
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors flex items-center gap-1"
            >
              <span>Explore live demo</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </motion.div>

        {/* ───────────────────────────────────────────────────────────
            LIVE PRODUCT LEDGER CARD
           ─────────────────────────────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          className="pt-4 max-w-lg mx-auto text-left"
        >
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">Goa Trip 2026</span>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <span className="text-zinc-400 font-mono text-[11px]">4 members</span>
              </div>
              <Link
                to="/trip/live"
                className="flex items-center gap-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 font-mono text-[11px] transition-colors"
              >
                <span>/trip/live</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/90 rounded-md p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Viewing as Sameer
                </span>
                <div className="text-xl font-semibold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  + ₹4,600.00
                </div>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400">
                Owed to you
              </span>
            </div>

            <div className="bg-zinc-50/60 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-mono text-[10px] font-semibold">
                  R
                </div>
                <div>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium">Rohan pays You</span>
                  <span className="text-zinc-400 font-mono text-[11px] block">sameer@okaxis</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold font-mono text-zinc-900 dark:text-zinc-100">₹2,200.00</span>
                <Link
                  to="/trip/live"

// [v256] feat(client): create Layout.jsx wrapper with responsive container and background
