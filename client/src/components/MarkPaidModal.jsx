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

  if (!isOpen || !debt) return null;

  const toName = debt.toMember?.name || 'Receiver';
  const toUpiId = debt.toMember?.upiId || '';
  const amount = (parseFloat(debt.amount) || 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(utrNumber.trim());
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);

// [v72] test(models): verify trip accessToken nanoid generation
