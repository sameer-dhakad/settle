import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Smartphone,
  ShieldCheck,
  Users,
  MessageCircle,
  LayoutDashboard,
  CheckCircle2,
  GitCommit
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
 * FeaturesPage - Technical feature grid supporting Light & Dark mode
 */
const FeaturesPage = () => {
  const featureList = [
    {
      title: 'Greedy Min-Cash-Flow Algorithm',
      description: 'Calculates net balances (∑Paid - ∑Owed) across all members and matches largest debtors with largest creditors, collapsing debts down to at most N-1 transfers.',
      icon: <GitCommit className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
    },
    {
      title: 'Two-Tier UPI Deep-Linking',
      description: 'On phones, launches Google Pay, PhonePe, Paytm, or Cred with pre-filled NPCI parameters. On desktops, renders dynamic high-contrast QR codes.',
      icon: <Smartphone className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
    },
    {
      title: 'App-Switch Visibility Detection',
      description: 'Leverages the browser visibilitychange API to detect return from banking apps, immediately prompting confirmation with optional UTR entry.',
      icon: <Zap className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
    },
    {
      title: '12-Digit UTR Bank Reference Logging',
      description: 'Debtors can optionally paste their 12-digit bank reference number. Creditors verify the transaction reference before signing off.',
      icon: <ShieldCheck className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
    },
    {
      title: '1-Click WhatsApp Summary Broadcast',
      description: 'Formats your entire group settlement status into an emoji-rich, structured summary message that you can copy or open in WhatsApp with a single tap.',
      icon: <MessageCircle className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
    },
    {
      title: 'Lifetime User Dashboard & Auth',
      description: 'Optional JWT-authenticated dashboard tracking total group spending, pending money to collect, and active trips across multiple friend circles.',
      icon: <LayoutDashboard className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
    },
    {
      title: 'Zero Login Friction Onboarding',
      description: 'Friends do not need to download an app from the App Store or sign up with a password. They click your link and start splitting bills in 2 seconds.',
      icon: <Users className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
    },
    {
      title: 'Permanent Settlement Audit Trail',
      description: 'Every confirmed transfer is permanently logged with timestamps, participant names, and reference IDs, providing a transparent financial record for the group.',
      icon: <CheckCircle2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 py-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400">
          <span>Fintech Capabilities</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Features
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
          Engineered for speed, privacy, and frictionless group settlement without proprietary wallet locks.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {featureList.map((f, idx) => (
          <motion.div
            key={idx}
            variants={cardMotion}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-4 space-y-2.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                {f.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Start using Settle today
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Create your first trip or test with sample data in under 10 seconds.
          </p>

// [v311] feat(components): implement desktop browser dynamic high-contrast QR code modal in PaymentModal
