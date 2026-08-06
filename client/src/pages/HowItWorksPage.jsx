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

// [v89] feat(algo): handle zero-balance members and filter out negligible cents
