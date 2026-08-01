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


// [v10] style(client): configure tailwind css v4 directives and custom theme colors
