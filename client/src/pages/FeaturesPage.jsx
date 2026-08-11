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

// [v143] feat(middleware): add guest identity cookie support for persistent sessions
