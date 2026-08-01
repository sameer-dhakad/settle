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

// [v14] chore(server): install jsonwebtoken, nanoid, and qrcode packages
