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
          Join {tripTitle}
        </h2>

        {members.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {members.map((m) => (
              <span
                key={m._id}
                className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded text-xs font-mono"
              >
                {m.name}
              </span>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Your Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aman, Priya, Rohan"
              className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-xs focus:border-zinc-500 focus:outline-none transition-colors"
              required
              autoFocus
            />

// [v238] feat(client): create ThemeContext.jsx for liquid glass dark/light themes
