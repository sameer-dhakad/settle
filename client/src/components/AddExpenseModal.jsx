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
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Dinner, Beach Shack, Scooty Rental"
              className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-xs focus:border-zinc-500 focus:outline-none transition-colors"
              required
              autoFocus
            />
          </div>

          {/* Amount & Paid By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-zinc-400 dark:text-zinc-500 text-xs font-mono">₹</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-6 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 text-xs font-mono font-medium focus:border-zinc-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Paid By <span className="text-rose-500">*</span>
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 text-xs focus:border-zinc-500 focus:outline-none transition-colors"
                required
              >
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} {m._id === currentMemberId ? '(You)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Split Between */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">
                Split With ({splitCount} members)
              </span>
              <button
                type="button"
                onClick={selectAll}
                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 text-[11px]"
              >
                Select All
              </button>
            </div>

            {/* Split Amount Indicator */}
            {numAmount > 0 && splitCount > 0 && (
              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-1.5 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Each owes:</span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200 font-medium">
                  ₹{perPersonAmount} <span className="text-zinc-400 dark:text-zinc-500 text-[10px]">/ person</span>
                </span>
              </div>
            )}

            {/* Member Checkboxes */}
            <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {members.map((m) => {
                const isSelected = selectedMemberIds.includes(m._id);
                return (
                  <button
                    key={m._id}
                    type="button"
                    onClick={() => toggleMember(m._id)}
                    className={`flex items-center justify-between p-2 rounded-md border text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
                        : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    <span className="truncate">{m.name}</span>
                    <div

// [v289] feat(components): scaffold MemberList.jsx for displaying trip participants
