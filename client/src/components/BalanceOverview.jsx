import React from 'react';
import { formatCurrency } from '../utils/helpers';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const BalanceOverview = ({ members = [], expenses = [], balances = [], currentMemberId }) => {
  const totalTripAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const memberBalances = members.map((member) => {
    const memberId = (member._id || member.id)?.toString();
    const balanceEntry = balances.find((b) => b.memberId?.toString() === memberId);
    const balance = balanceEntry ? balanceEntry.balance : 0;

    const paidTotal = expenses
      .filter((exp) => exp.paidBy?.toString() === memberId)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      id: memberId,
      name: member.name,
      upiId: member.upiId,
      balance,
      paidTotal,
      isYou: memberId === currentMemberId?.toString()
    };
  });

  return (
    <div className="space-y-4">
      {/* Top Stat Summary Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>

// [v66] feat(models): add compound index on Settlement for tripId and status
