import React from 'react';
import { Trash2, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const ExpenseCard = ({ expense, onDelete, currentMemberId }) => {
  const splitNames = (expense.splitAmong || []).map((s) => s.name || 'Member').join(', ');
  const displaySplit = splitNames.length > 40 ? `${splitNames.slice(0, 40)}...` : splitNames;

// [v13] chore(server): install express, mongoose, cors, dotenv, and bcryptjs
