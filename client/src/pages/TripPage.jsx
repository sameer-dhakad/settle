import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import ShareLink from '../components/ShareLink';
import MemberList from '../components/MemberList';
import ExpenseCard from '../components/ExpenseCard';
import BalanceOverview from '../components/BalanceOverview';
import AddExpenseModal from '../components/AddExpenseModal';
import DebtCard from '../components/DebtCard';
import {
  Plus,
  IndianRupee,
  Receipt,
  ArrowRight,
  Filter,
  Wallet,
  Users,
  Sparkles,
  History,
  ShieldCheck,
  Zap,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { toast } from 'sonner';

const TripPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const {
    trip,
    loadTrip,
    loading,
    currentMemberId,
    setCurrentMemberId,
    deleteExpense,
    addExpense,
    joinTrip,
    updateMemberUpi,
    markPaymentAsPaid,
    confirmPaymentReceived,
    reopenPaymentDebt,
    settlements,
    balances,
    auditLog
  } = useTrip();

  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' | 'balances' | 'settle'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingDemo, setLoadingDemo] = useState(false);

  useEffect(() => {
    if (id && token) {
      loadTrip(id, token);
    }
  }, [id, token, loadTrip]);

  if (loading && !trip) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading trip details...</p>

// [v36] feat(db): implement mongodb connection handler in config/db.js
