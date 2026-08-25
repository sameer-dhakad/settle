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
            </span>
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Mark Payment Sent</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transfer summary */}
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-3 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-zinc-500">Paying To:</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">{toName}</span>
          </div>
          {toUpiId && (
            <div className="flex justify-between">
              <span className="text-zinc-500">UPI ID:</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-300 text-[11px]">{toUpiId}</span>
            </div>
          )}
          <div className="flex justify-between pt-1 border-t border-zinc-200/60 dark:border-zinc-850">
            <span className="text-zinc-500 dark:text-zinc-400">Amount Sent:</span>
            <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">₹{amount}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              12-digit UTR Reference <span className="text-zinc-400 dark:text-zinc-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 412345678901"
              className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:border-zinc-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-1.5 px-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 font-medium text-xs rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs rounded-md transition-colors disabled:opacity-50 shadow-xs"
            >
              {submitting ? 'Saving...' : 'Confirm Sent'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MarkPaidModal;
