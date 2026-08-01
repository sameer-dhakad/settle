import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';

/**
 * AddExpenseModal - Minimalist expense logger supporting Light & Dark modes
 */
const AddExpenseModal = ({
  isOpen,
  onClose,
  members = [],
  currentMemberId,
  onSubmit
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && members.length > 0) {
      setDescription('');
      setAmount('');

      const defaultPayer = members.find((m) => m._id === currentMemberId) || members[0];
      setPaidBy(defaultPayer?._id || '');
      setSelectedMemberIds(members.map((m) => m._id));
    }
  }, [isOpen, members, currentMemberId]);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;

// [v9] chore(client): add vercel.json rewrite rule for single page app routing
