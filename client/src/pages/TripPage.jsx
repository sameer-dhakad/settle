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
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-md mx-auto py-16 text-center bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Receipt className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Trip Not Found</h2>
        <p className="text-sm text-slate-500">
          The link might be invalid or the trip token is missing.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Go to Home
        </Link>
      </div>
    );
  }

  const handleDeleteExpense = async (expenseId) => {
    await deleteExpense(id, token, expenseId);
  };

  const handleAddExpense = async (data) => {
    await addExpense(id, token, data);
  };

  const handleAddMember = async (name, upiId) => {
    await joinTrip(id, token, name, upiId);
  };

  const handleSwitchMember = (member) => {
    const mId = member._id || member.id;
    localStorage.setItem(`settle_${id}_member`, mId);
    if (setCurrentMemberId) setCurrentMemberId(mId);
    toast.success(`Active profile switched to ${member.name}`);
  };

  const handleUpdateUpi = async (memberId, upiId) => {
    await updateMemberUpi(id, token, memberId, upiId);
  };

  const handleMarkPaid = async (fromId, toId, amount) => {
    await markPaymentAsPaid(id, token, fromId, toId, amount);
  };

  const handleConfirmReceived = async (fromId, toId, amount) => {
    await confirmPaymentReceived(id, token, fromId, toId, amount);
  };

  const handleReopen = async (fromId, toId) => {
    await reopenPaymentDebt(id, token, fromId, toId);
  };

  // Demo auto-filler to test full multi-person UPI payment flow with 1 click
  const handleLoadDemoData = async () => {
    setLoadingDemo(true);
    try {
      // 1. Add friends if not present
      const memberNames = (trip.members || []).map(m => m.name.toLowerCase());
      if (!memberNames.includes('aman')) {

// [v92] feat(algo): return optimized settlement plan with from, to, and amount
