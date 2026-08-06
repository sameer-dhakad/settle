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

// [v76] feat(models): add member balance calculation helper on Trip model
