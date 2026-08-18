import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  X,
  CheckCircle2,
  ShieldCheck,
  Hash
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * PaymentModal - Two-Tier UPI Payment Engine supporting Light & Dark modes
 */
const PaymentModal = ({
  isOpen,
  onClose,
  debt,
  tripTitle = 'Trip',
  onMarkPaid
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [awaitingMobileReturn, setAwaitingMobileReturn] = useState(false);
  const [showReturnSheet, setShowReturnSheet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
      const mobileMatch = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(mobileMatch || isSmallScreen);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && awaitingMobileReturn) {
        setShowReturnSheet(true);
        setAwaitingMobileReturn(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [awaitingMobileReturn]);

  if (!isOpen || !debt) return null;

  const toName = debt.toMember?.name || 'Receiver';
  const toUpiId = debt.toMember?.upiId || '';
  const fromMemberId = debt.fromMember?._id?.toString();
  const toMemberId = debt.toMember?._id?.toString();
  const amount = (parseFloat(debt.amount) || 0).toFixed(2);
  const note = `Settle ${tripTitle}`.trim();

  const upiUri = toUpiId
    ? `upi://pay?pa=${encodeURIComponent(toUpiId)}&pn=${encodeURIComponent(toName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
    : '';

  const copyUpiId = () => {
    if (!toUpiId) return;
    navigator.clipboard.writeText(toUpiId);
    setCopiedUpi(true);
    toast.success(`Copied UPI ID: ${toUpiId}`);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleMobileLaunch = () => {
    if (!toUpiId) {
      toast.error(`${toName} has not set a UPI ID yet`);
      return;
    }
    setAwaitingMobileReturn(true);
    window.location.href = upiUri;
  };

  const handleCompletePayment = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    try {
      if (onMarkPaid) {
        await onMarkPaid(fromMemberId, toMemberId, amount, utrNumber.trim());
      }
      setShowReturnSheet(false);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to log payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-xs p-4">
      {/* 1. MOBILE APP-SWITCH RETURN CONFIRMATION */}
      {isMobile && showReturnSheet ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 w-full max-w-sm shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-emerald-50 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Confirm Payment</h3>
            </div>
            <button
              onClick={() => {
                setShowReturnSheet(false);
                onClose();
              }}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Did your payment of <span className="font-mono text-emerald-600 dark:text-emerald-400">₹{amount}</span> complete?
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Transferred to <span className="font-medium text-zinc-800 dark:text-zinc-200">{toName}</span>
            </p>
          </div>

          <form onSubmit={handleCompletePayment} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                12-digit UPI Reference / UTR <span className="text-zinc-400 dark:text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 412345678901"
                className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:border-zinc-500 focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Updating...' : 'Yes, Mark as Paid'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReturnSheet(false)}
                className="w-full py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 font-medium text-xs rounded-md transition-colors"
              >
                Cancel / Try Again
              </button>
            </div>
          </form>
        </motion.div>
      ) : isMobile ? (
        /* 2. MOBILE LAUNCH SHEET */
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 w-full max-w-sm shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Pay via UPI
            </span>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Paying To {toName}</span>
            <div className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-100">
              ₹{amount}
            </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-md p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Receiving UPI:</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-300 truncate max-w-[180px]">{toUpiId || 'Not Set'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Note:</span>
              <span className="text-zinc-700 dark:text-zinc-400">{note}</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={handleMobileLaunch}
              className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Launch UPI App (GPay / PhonePe)</span>
            </button>

            <button
              onClick={copyUpiId}
              className="w-full py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUpi ? 'UPI ID Copied' : 'Copy UPI ID & Pay Manually'}</span>
            </button>

            <button
              onClick={() => setShowReturnSheet(true)}
              className="w-full text-center text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 pt-1 font-mono transition-colors"
            >
              Already paid? Enter UTR & Mark Done →
            </button>
          </div>
        </motion.div>
      ) : (

// [v242] feat(client): add fetchTrip, addExpense, and recordPayment actions in TripContext
