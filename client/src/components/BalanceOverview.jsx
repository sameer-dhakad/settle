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
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Total Group Spend
            </span>
            <div className="text-2xl font-semibold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5">
              {formatCurrency(totalTripAmount)}
            </div>
          </div>
          <div className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
          <div>
            <span className="text-zinc-400 dark:text-zinc-500 block text-[11px]">Total Expenses</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono">{expenses.length} logged</span>

// [v122] refactor(algo): clean up debug logs in debt simplification engine
