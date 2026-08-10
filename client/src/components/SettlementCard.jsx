import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import MarkPaidModal from './MarkPaidModal';
import {
  Smartphone,
  QrCode,
  Copy,
  Check,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Hash,
  X
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * SettlementCard - Minimalist two-tier UPI card supporting Light & Dark mode
 */
const SettlementCard = ({
  settlement,
  tripTitle = 'Trip',
  currentMemberId,
  onMarkPaid,
  onConfirmReceived,
  onUpdateUpi
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const fromMemberId = settlement.fromMember?._id?.toString();
  const toMemberId = settlement.toMember?._id?.toString();
  const fromName = settlement.fromMember?.name || 'Debtor';
  const toName = settlement.toMember?.name || 'Creditor';
  const toUpiId = settlement.toMember?.upiId || '';
  const amount = settlement.amount;
  const status = settlement.status || 'UNPAID';
  const utrNumber = settlement.utrNumber || '';

  const isDebtor = currentMemberId && currentMemberId.toString() === fromMemberId;
  const isCreditor = currentMemberId && currentMemberId.toString() === toMemberId;

  const formattedAmount = (parseFloat(amount) || 0).toFixed(2);
  const note = `Settle ${tripTitle}`.trim();
  const upiUri = toUpiId
    ? `upi://pay?pa=${encodeURIComponent(toUpiId)}&pn=${encodeURIComponent(toName)}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(note)}`
    : '';

  const handlePayClick = () => {
    if (!toUpiId) {
      toast.error(`${toName} has not set a UPI ID yet`);
      return;
    }

    if (isMobile) {
      window.location.href = upiUri;
    } else {
      setShowQrModal(true);
    }
  };

  const copyUpiId = (e) => {
    e?.stopPropagation();
    if (!toUpiId) return;
    navigator.clipboard.writeText(toUpiId);
    setCopiedUpi(true);
    toast.success(`Copied UPI ID: ${toUpiId}`);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleMarkPaidSubmit = async (utr) => {
    if (onMarkPaid) {
      await onMarkPaid(fromMemberId, toMemberId, amount, utr);
    }
  };

  const handleConfirmReceivedSubmit = async () => {
    setSubmitting(true);
    try {
      if (onConfirmReceived) {
        await onConfirmReceived(fromMemberId, toMemberId, amount);
      }
      toast.success(`Settlement with ${fromName} confirmed`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to confirm settlement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`bg-white dark:bg-zinc-900 rounded-lg p-4 border transition-colors shadow-2xs ${
          status === 'PENDING'
            ? 'border-amber-300 dark:border-amber-900/50 bg-amber-50/20 dark:bg-zinc-900'
            : 'border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
        }`}
      >
        {/* Top: Transfer Participants & Amount */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-7 h-7 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] flex items-center justify-center shrink-0">
              {fromName.slice(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs truncate">{fromName}</span>
                {isDebtor && (
                  <span className="text-[10px] font-mono bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 px-1 py-0.2 rounded">
                    You
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">owes</span>
            </div>

            <div className="text-zinc-400 dark:text-zinc-600 shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            <div className="w-7 h-7 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] flex items-center justify-center shrink-0">
              {toName.slice(0, 2).toUpperCase()}
            </div>


// [v132] docs(algo): add API documentation for debt simplification response schema
