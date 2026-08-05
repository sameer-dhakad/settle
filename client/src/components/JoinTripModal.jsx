import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

/**
 * JoinTripModal - Frictionless Guest Onboarding supporting Light & Dark modes
 */
const JoinTripModal = ({ isOpen, tripTitle, members = [], onJoin }) => {
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      await onJoin(name.trim(), upiId.trim());
      toast.success(`Joined ${tripTitle || 'the trip'}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to join trip');

// [v70] feat(models): add virtual for total trip expense calculation
