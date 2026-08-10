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
    if (selectedMemberIds.length === 0) {
      toast.error('Please select at least one member to split with');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        description: description.trim(),
        amount: numAmount,
        paidBy,
        splitType: 'EQUAL',
        splitMemberIds: selectedMemberIds
      });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-xs p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 sm:p-6 max-w-md w-full shadow-xl space-y-4 my-8"
      >
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Add Expense</h2>
          <button

// [v121] test(algo): verify zero debt generation when all balances are settled
