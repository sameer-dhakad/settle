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

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs truncate">{toName}</span>
                {isCreditor && (
                  <span className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 px-1 py-0.2 rounded">
                    You
                  </span>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">receives</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-lg font-semibold font-mono text-zinc-900 dark:text-zinc-100">
              ₹{formattedAmount}
            </div>
          </div>
        </div>

        {/* Receiver UPI Row */}
        {toUpiId ? (
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 mb-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">UPI:</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-300 text-[11px] truncate">{toUpiId}</span>
            </div>
            <button
              onClick={copyUpiId}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5 rounded"
              title="Copy UPI ID"
            >
              {copiedUpi ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-zinc-950 border border-amber-200 dark:border-zinc-800 rounded-md px-3 py-1.5 mb-3 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
            <div className="flex items-center gap-1.5 text-[11px] truncate">
              <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
              <span>{toName} has no UPI ID set</span>
            </div>
            {onUpdateUpi && (
              <button
                onClick={() => onUpdateUpi(settlement.toMember)}
                className="text-zinc-700 dark:text-zinc-300 hover:underline text-[11px] ml-2"
              >
                + Add
              </button>
            )}
          </div>
        )}

        {/* State Indicators & Action Buttons */}
        {status === 'PENDING' ? (
          <div className="bg-amber-50/50 dark:bg-zinc-950 border border-amber-200 dark:border-amber-900/50 rounded-md p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>
                  <strong>{fromName}</strong> marked as paid. Waiting for confirmation.
                </span>
              </div>

              <button
                onClick={handleConfirmReceivedSubmit}
                disabled={submitting}
                className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-md text-xs transition-colors flex items-center gap-1 shrink-0 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Confirm</span>
              </button>
            </div>

            {utrNumber && (
              <div className="pt-1.5 border-t border-amber-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-emerald-500" />
                  <span>UTR Reference: <strong className="text-zinc-800 dark:text-zinc-200">{utrNumber}</strong></span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            {toUpiId ? (
              <button
                onClick={handlePayClick}
                className="flex-1 py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                {isMobile ? <Smartphone className="w-3.5 h-3.5" /> : <QrCode className="w-3.5 h-3.5" />}
                <span>Pay ₹{formattedAmount} via UPI</span>
              </button>
            ) : (
              <button
                onClick={copyUpiId}
                className="flex-1 py-1.5 px-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs rounded-md transition-colors"
              >
                Copy Details
              </button>
            )}

            <button
              onClick={() => setShowMarkPaidModal(true)}
              className="py-1.5 px-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs rounded-md transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Mark Paid</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop Payment QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 sm:p-6 max-w-xs w-full shadow-xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Scan with any UPI App
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-100">
                ₹{formattedAmount}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Pay to <span className="font-medium text-zinc-800 dark:text-zinc-200">{toName}</span>
              </p>
            </div>

            <div className="bg-white p-3 rounded-md inline-block border border-zinc-200 dark:border-zinc-700/60 shadow-xs">
              <QRCodeSVG
                value={upiUri}
                size={180}
                level="M"
                includeMargin={false}
              />

// [v300] feat(components): add 12-digit UTR reference display and verification badge on SettlementCard
