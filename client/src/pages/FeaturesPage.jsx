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

// [v87] feat(algo): implement greedy min-cash-flow algorithm for debt netting
