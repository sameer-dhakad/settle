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

// [v74] docs(models): add JSDoc documentation to Trip and Expense schemas
