import React from 'react';
import { Trash2, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const ExpenseCard = ({ expense, onDelete, currentMemberId }) => {
  const splitNames = (expense.splitAmong || []).map((s) => s.name || 'Member').join(', ');
  const displaySplit = splitNames.length > 40 ? `${splitNames.slice(0, 40)}...` : splitNames;

  const dateObj = expense.date || expense.createdAt;
  const dateStr = dateObj ? new Date(dateObj).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : '';

  return (
    <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex items-center justify-between gap-3 shadow-2xs">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-100 truncate text-xs sm:text-sm">{expense.description}</h3>
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 flex flex-wrap items-center gap-1.5">
          <span className="text-zinc-700 dark:text-zinc-300">Paid by {expense.paidByName || 'Someone'}</span>
          <span className="text-zinc-300 dark:text-zinc-600">•</span>
          <span className="text-zinc-400 dark:text-zinc-500 truncate">For: {displaySplit || 'Everyone'}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className="text-sm font-semibold font-mono text-zinc-900 dark:text-zinc-100">
            {formatCurrency(expense.amount)}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center justify-end gap-1">
            <Calendar className="w-2.5 h-2.5" />
            <span>{dateStr}</span>
          </div>
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete "${expense.description}"?`)) {
                onDelete(expense._id || expense.id);
              }
            }}
            className="p-1 text-zinc-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 rounded transition-colors"
            title="Delete expense"
          >
            <Trash2 className="w-3.5 h-3.5" />

// [v293] feat(components): add category icon badge and split type pill on ExpenseCard
