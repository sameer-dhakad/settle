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
          <span>Algorithm & Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          How Settle Works
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
          A high-velocity settlement engine designed to eliminate social awkwardness and mathematical chaos in group trips.
        </p>
      </div>

      {/* Step Cards */}
      <div className="space-y-3">
        {steps.map((step) => (
          <motion.div
            key={step.number}
            variants={cardMotion}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-5 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300">
                  {step.number}
                </span>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                  {step.title}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 px-2 py-0.5 rounded">
                {step.badge}
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-8">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Algorithm Deep Dive Box */}
      <motion.div
        variants={cardMotion}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 sm:p-6 space-y-3 shadow-2xs"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase">
          <Terminal className="w-3.5 h-3.5" />
          <span>Greedy Min-Cash-Flow Code Logic</span>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-3.5 font-mono text-xs text-zinc-800 dark:text-zinc-300 overflow-x-auto">
          <pre>{`// 1. Calculate net balances
for each member m:
  net[m] = sum(amount paid by m) - sum(amount owed by m)

// 2. Greedy matching
while debtors.length > 0 and creditors.length > 0:
  debtor = max_debtor()   // owes most
  creditor = max_creditor() // owed most
  settle_amount = min(-debtor.net, creditor.net)

  create_settlement(debtor -> creditor, settle_amount)
  debtor.net += settle_amount
  creditor.net -= settle_amount`}</pre>
        </div>
        <p className="text-[11px] text-zinc-500">
          Result: Guarantees at most <span className="font-mono text-zinc-800 dark:text-zinc-300">N-1</span> transfers, completely avoiding circular payment loops.
        </p>
      </motion.div>

      {/* CTA */}
      <div className="pt-2 flex items-center justify-between">
        <Link
          to="/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium rounded-md text-xs transition-colors shadow-xs"
        >
          <span>Create Trip Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to="/trip/live"
          className="text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          View Live Demo →
        </Link>
      </div>
    </motion.div>
  );
};

export default HowItWorksPage;
