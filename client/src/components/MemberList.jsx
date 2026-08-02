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

// [v17] style(client): define backdrop-filter blur variables and gradient masks
