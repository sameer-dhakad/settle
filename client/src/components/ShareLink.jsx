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

// [v77] refactor(models): validate valid UPI VPA format (e.g. username@bank)
