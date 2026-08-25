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

          <div className="text-sm font-semibold font-mono text-zinc-900 dark:text-zinc-100">
            {formatCurrency(amount)}
          </div>
        </div>

        {upiId && (
          <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-2.5 py-1 flex items-center justify-between text-[11px]">
            <span className="font-mono text-zinc-600 dark:text-zinc-400 truncate">{upiId}</span>
            <button
              onClick={copyUpiId}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5"
            >
              {copiedUpi ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}

        <div className="pt-1 flex gap-2">
          {upiId ? (
            <button
              onClick={handlePayClick}
              className="flex-1 py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Pay UPI</span>
            </button>
          ) : (
            <button
              onClick={copyUpiId}
              className="flex-1 py-1.5 px-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs rounded-md"
            >
              Copy
            </button>
          )}

          {onMarkPaid && status === 'pending' && (
            <button
              onClick={() => onMarkPaid(debt)}
              className="py-1.5 px-3 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs rounded-md transition-colors"
            >
              Mark Paid
            </button>
          )}
        </div>
      </div>

      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 max-w-xs w-full shadow-xl text-center space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase">UPI QR Code</span>
              <button onClick={() => setShowQrModal(false)} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="bg-white p-3 rounded-md inline-block border border-zinc-200 dark:border-zinc-700">
              <QRCodeSVG value={upiLink} size={160} level="M" />
            </div>
            <div className="text-xs font-mono text-zinc-800 dark:text-zinc-300">
              {toName}: {formatCurrency(amount)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DebtCard;
