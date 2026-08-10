import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

/**
 * JoinTripModal - Frictionless Guest Onboarding supporting Light & Dark modes
 */
const JoinTripModal = ({ isOpen, tripTitle, members = [], onJoin }) => {
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await onJoin(name.trim(), upiId.trim());
      toast.success(`Joined ${tripTitle || 'the trip'}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to join trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-xs p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 sm:p-6 max-w-sm w-full shadow-xl space-y-4"
      >
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">

// [v126] test(algo): test single payer with all equal consumers
