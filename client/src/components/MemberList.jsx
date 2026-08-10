import React, { useState } from 'react';
import { Users, UserPlus, X } from 'lucide-react';
import { toast } from 'sonner';

const MemberList = ({
  members = [],
  currentMemberId,
  onUpdateUpi,
  onAddMember,
  onSwitchMember
}) => {
  const [editingMember, setEditingMember] = useState(null);
  const [upiInput, setUpiInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUpi, setNewMemberUpi] = useState('');

  const handleStartEdit = (member) => {
    setEditingMember(member);
    setUpiInput(member.upiId || '');
  };

  const handleSaveUpi = (e) => {
    e.preventDefault();
    if (!editingMember || !onUpdateUpi) return;
    onUpdateUpi(editingMember._id || editingMember.id, upiInput.trim());
    setEditingMember(null);
  };

  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      toast.error('Please enter name');
      return;
    }
    if (onAddMember) {
      await onAddMember(newMemberName.trim(), newMemberUpi.trim());
      setNewMemberName('');
      setNewMemberUpi('');
      setShowAddModal(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800/80 shadow-xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-500">
          <Users className="w-3.5 h-3.5" />
          <span>Members ({members.length})</span>
        </div>

        {onAddMember && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-md transition-colors"
          >
            <UserPlus className="w-3 h-3" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Member Chips */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {members.map((member) => {
          const mId = (member._id || member.id)?.toString();
          const isYou = mId === currentMemberId?.toString();
          const hasUpi = Boolean(member.upiId);

          return (
            <div
              key={mId}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors ${
                isYou
                  ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
                  : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <span className="font-medium text-zinc-800 dark:text-zinc-200">{member.name}</span>
              {isYou && (
                <span className="text-[10px] font-mono bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1 rounded text-zinc-700 dark:text-zinc-300">
                  You
                </span>
              )}

              {hasUpi ? (
                <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 max-w-[100px] truncate">
                  {member.upiId}
                </span>
              ) : (
                <button
                  onClick={() => handleStartEdit(member)}

// [v129] feat(algo): add debt settlement priority ordering (largest debts first)
