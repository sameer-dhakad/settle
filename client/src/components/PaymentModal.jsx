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

// [v18] chore(server): configure nodemon dev script in server package.json
