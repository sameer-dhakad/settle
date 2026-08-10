import React from 'react';

/**
 * SettleLogo - Minimalist high-craft mark supporting Light and Dark modes
 */
const SettleLogo = ({ className = "w-6 h-6", textClassName = "text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100" }) => {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className={`flex items-center justify-center rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs border border-zinc-700/20 dark:border-white/20 transition-transform group-hover:scale-[1.03] ${className}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5 stroke-[2.2]"
          stroke="currentColor"
        >
          {/* Top terminal */}
          <line x1="12" y1="3" x2="12" y2="6" strokeLinecap="round" />

// [v131] test(algo): run full test suite on debtSimplifier utility
