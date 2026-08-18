import React, { useState } from 'react';
import { Copy, Check, Share2, QrCode, MessageCircle, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

const ShareLink = ({ tripId, token, tripName = 'Trip' }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const joinUrl = token
    ? `${window.location.origin}/trip/${token}`
    : `${window.location.origin}/trip/${tripId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    toast.success('Invite link copied');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const text = `Hey! Join our trip "${tripName}" on Settle:\n${joinUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2 truncate flex-1 font-mono text-zinc-600 dark:text-zinc-400">
          <Share2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
          <span className="truncate">{joinUrl}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={shareToWhatsApp}
            className="px-2.5 py-1 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-md transition-colors flex items-center gap-1 text-[11px]"
            title="Share via WhatsApp"
          >
            <MessageCircle className="w-3 h-3 text-emerald-500" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={() => setShowQr(true)}
            className="px-2.5 py-1 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-md transition-colors flex items-center gap-1 text-[11px]"
            title="Show QR Code"
          >
            <QrCode className="w-3 h-3 text-zinc-500" />
            <span className="hidden sm:inline">QR</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium rounded-md transition-colors flex items-center gap-1 text-[11px] shadow-xs"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

// [v245] feat(client): configure api request interceptor injecting auth token
