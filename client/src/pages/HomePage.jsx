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

// [v88] feat(algo): collapse multi-party circular debts down to at most N-1 transactions
