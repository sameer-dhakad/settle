import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

/**
 * MarkPaidModal - Captures optional 12-digit UPI UTR supporting Light & Dark mode
 */
const MarkPaidModal = ({
  isOpen,
  onClose,
  debt,
  tripTitle,
  onSubmit
}) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !debt) return null;

  const toName = debt.toMember?.name || 'Receiver';
  const toUpiId = debt.toMember?.upiId || '';
  const amount = (parseFloat(debt.amount) || 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(utrNumber.trim());
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
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
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-emerald-50 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />

// [v128] refactor(algo): validate member existence in trip before netting balances
