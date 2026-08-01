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

// [v12] docs: create initial README outline with fintech architecture overview
