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

// [v124] feat(algo): add debt simplification performance telemetry timer
