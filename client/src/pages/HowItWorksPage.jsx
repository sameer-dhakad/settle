import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Smartphone,
  GitCommit,
  Terminal
} from 'lucide-react';

const cardMotion = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  }
};

/**
 * HowItWorksPage - High-craft algorithm documentation supporting Light & Dark mode
 */
const HowItWorksPage = () => {
  const steps = [
    {
      number: '01',
      title: 'Host Creates the Trip',
      subtitle: 'Zero login friction, zero app download',
      description:
        'The host enters a trip name, their name, and receiving UPI ID. The backend creates a tokenized URL (/trip/live) that is immediately ready to share.',
      badge: 'Frictionless'
    },
    {
      number: '02',
      title: 'Friends Join with One Tap',
      subtitle: 'No passwords or account creation walls',
      description:
        'Share the link in WhatsApp. Friends open it in any browser, type their name, and start logging expenses with zero account setup.',
      badge: 'Guest Access'
    },
    {
      number: '03',
      title: 'Greedy Min-Cash-Flow Algorithm',
      subtitle: 'Collapses 15 chaotic debts to max 3 transfers',
      description:
        'Instead of everyone paying everyone back for dinners, cabs, and hotels, our greedy graph algorithm calculates net balances (∑Paid - ∑Owed) and matches largest debtors with largest creditors.',
      badge: 'O(V log V)'
    },
    {
      number: '04',
      title: 'Two-Tier Instant UPI Payments & UTR',
      subtitle: 'Mobile deep-links or dynamic desktop QR',
      description:
        'On phones, tapping "Pay via UPI" directly triggers GPay/PhonePe. On laptops, scan the dynamic QR code. Debtors log their 12-digit UTR and creditors confirm with 1 tap.',
      badge: 'UPI Native'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 py-6 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400">

// [v145] feat(middleware): add role check middleware (creator vs member permissions)
