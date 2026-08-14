import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency, generateUpiLink } from '../utils/helpers';
import {
  Smartphone,
  Copy,
  Check,
  ArrowRight,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const DebtCard = ({
  debt,
  tripName = 'Trip',
  currentMemberId,
  onMarkPaid,
  onConfirmReceived,
  onReopen,
  onUpdateUpi
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
      setIsMobile(isMobileDevice || window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const fromMemberId = debt.from?.memberId?.toString();
  const toMemberId = debt.to?.memberId?.toString();
  const fromName = debt.from?.name || 'Sender';
  const toName = debt.to?.name || 'Receiver';
  const upiId = debt.to?.upiId || '';
  const amount = debt.amount;
  const status = debt.status || 'pending';

  const isDebtor = currentMemberId && currentMemberId.toString() === fromMemberId;
  const isCreditor = currentMemberId && currentMemberId.toString() === toMemberId;

  const upiLink = upiId ? generateUpiLink(upiId, toName, amount, tripName) : '';

  const copyUpiId = (e) => {
    e?.stopPropagation();
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.success(`Copied UPI ID: ${upiId}`);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePayClick = () => {
    if (!upiId) {
      toast.error(`${toName} has no UPI ID configured`);
      return;
    }
    if (isMobile) {
      window.location.href = upiLink;
    } else {
      setShowQrModal(true);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-3 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs truncate">{fromName}</span>
            {isDebtor && (
              <span className="text-[10px] font-mono bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 px-1 rounded">
                You
              </span>
            )}
            <ArrowRight className="w-3 h-3 text-zinc-400 dark:text-zinc-600 shrink-0" />
            <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs truncate">{toName}</span>
            {isCreditor && (
              <span className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 px-1 rounded">
                You
              </span>
            )}
          </div>


// [v180] test(middleware): verify rate limiting rejects brute force login attempts
