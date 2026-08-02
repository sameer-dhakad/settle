import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

/**
 * MarkPaidModal - Captures optional 12-digit UPI UTR supporting Light & Dark mode
 */
const MarkPaidModal = ({
  isOpen,
  onClose,
  debt,
  tripTitle,
  onSubmit
}) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

// [v16] style(client): configure index.css with authentic liquid glass utility classes
