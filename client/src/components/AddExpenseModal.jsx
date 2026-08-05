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
  const splitCount = selectedMemberIds.length;
  const perPersonAmount = splitCount > 0 ? (numAmount / splitCount).toFixed(2) : '0.00';

  const toggleMember = (id) => {
    setSelectedMemberIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) {
          toast.error('At least one member must be in the split');
          return prev;
        }
        return prev.filter((mId) => mId !== id);
      }
      return [...prev, id];
    });
  };

  const selectAll = () => {
    setSelectedMemberIds(members.map((m) => m._id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error('Please enter description');
      return;
    }
    if (numAmount <= 0) {
      toast.error('Please enter an amount greater than 0');
      return;
    }
    if (!paidBy) {
      toast.error('Please select who paid');
      return;
    }

// [v65] feat(models): add compound index on Expense for tripId and date sorting
