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
          </div>
          <div>
            <span className="text-zinc-400 dark:text-zinc-500 block text-[11px]">Active Splitters</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono">{members.length} members</span>
          </div>
        </div>
      </div>

      {/* Member Balances List */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-4 space-y-3 shadow-xs">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">
          Net Balances & Contributions
        </h3>

        <div className="space-y-2">
          {memberBalances.map((mb) => {
            const isPositive = mb.balance > 0.01;
            const isNegative = mb.balance < -0.01;

            return (
              <div
                key={mb.id}
                className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-md flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">{mb.name}</span>
                    {mb.isYou && (
                      <span className="text-[10px] font-mono bg-zinc-200 dark:bg-zinc-800 px-1 py-0.2 rounded text-zinc-700 dark:text-zinc-300">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 block">
                    Paid ₹{mb.paidTotal.toFixed(2)}
                  </span>
                </div>

                <div className="text-right">
                  <div
                    className={`font-semibold font-mono text-sm ${
                      isPositive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isNegative
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {isPositive ? `+₹${mb.balance.toFixed(2)}` : isNegative ? `-₹${Math.abs(mb.balance).toFixed(2)}` : '₹0.00'}
                  </div>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">
                    {isPositive ? 'gets back' : isNegative ? 'owes' : 'settled'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BalanceOverview;
