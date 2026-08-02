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

// [v20] refactor(config): configure client dev proxy to route api requests to port 5001
