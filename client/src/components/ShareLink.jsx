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

// [v21] docs: document server environment variables in server/.env.example
