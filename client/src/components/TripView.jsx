import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getTrip,
  joinTrip,
  addExpense,
  deleteExpense,
  markSettlementPaid,
  confirmSettlement,
  rejectSettlement
} from '../api';
import { useAuth } from '../context/AuthContext';
import PaymentModal from './PaymentModal';
import AddExpenseModal from './AddExpenseModal';
import JoinTripModal from './JoinTripModal';
import {
  Plus,
  Share2,
  Check,
  MessageCircle,
  Clock,
  CheckCircle2,
  Smartphone,
  Trash2,
  Users,
  Wallet,
  Receipt,
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';

const spring = { type: 'spring', stiffness: 320, damping: 26 };

/**
 * TripView - Minimalist, high-craft Linear-standard workspace
 * Zero subheadings, zero subtext slop. Direct data density and clear financial ledger.
 */
const TripView = () => {
  const { accessToken } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses' | 'settlements' | 'history'
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePaymentDebt, setActivePaymentDebt] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  const loadTripData = async () => {
    try {
      setLoading(true);
      const res = await getTrip(accessToken);
      const data = res.data;
      setTripData(data);

      const tripId = data.trip?._id;
      const storedMemberId = localStorage.getItem(`settle_${tripId}_member`);

      if (user && data.trip?.members) {
        const matchingMember = data.trip.members.find(
          (m) =>
            (m.userId && m.userId.toString() === user._id.toString()) ||
            (m.isHost && data.trip.creatorUserId && data.trip.creatorUserId.toString() === user._id.toString())
        );
        if (matchingMember) {
          setCurrentMemberId(matchingMember._id);
          localStorage.setItem(`settle_${tripId}_member`, matchingMember._id);
          return;
        }
      }

      if (storedMemberId && data.trip?.members?.some((m) => m._id === storedMemberId)) {
        setCurrentMemberId(storedMemberId);
      } else if (!storedMemberId) {
        setIsJoinModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadTripData();
    }
  }, [accessToken, user]);

  const handleJoin = async (name, upiId) => {
    const res = await joinTrip(accessToken, { name, upiId });
    const data = res.data;
    setTripData(data);
    const assignedId = data.joinedMemberId;
    if (assignedId && data.trip?._id) {
      localStorage.setItem(`settle_${data.trip._id}_member`, assignedId);
      setCurrentMemberId(assignedId);
    }
    setIsJoinModalOpen(false);
  };

  const handleAddExpense = async (expensePayload) => {
    const res = await addExpense(accessToken, expensePayload);
    setTripData(res.data);
    toast.success('Expense recorded');
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Delete this expense?')) {
      const res = await deleteExpense(accessToken, expenseId);
      setTripData(res.data);
      toast.success('Expense removed');
    }
  };

  const handleMarkPaid = async (fromMemberId, toMemberId, amount, utrNumber) => {
    const res = await markSettlementPaid(accessToken, { fromMemberId, toMemberId, amount, utrNumber });
    setTripData(res.data);
    toast.success('Payment recorded');
  };

  const handleConfirmReceived = async (fromMemberId, toMemberId, amount) => {
    setProcessingAction(true);
    try {
      const res = await confirmSettlement(accessToken, { fromMemberId, toMemberId, amount });
      setTripData(res.data);
      toast.success('Payment confirmed');
    } catch (err) {
      console.error(err);
      toast.error('Failed to confirm payment');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRejectSettlement = async (fromMemberId, toMemberId) => {
    if (window.confirm('Reject payment claim?')) {
      setProcessingAction(true);
      try {
        const res = await rejectSettlement(accessToken, { fromMemberId, toMemberId });
        setTripData(res.data);
        toast.info('Payment claim rejected');
      } catch (err) {
        console.error(err);
        toast.error('Failed to reject payment claim');
      } finally {
        setProcessingAction(false);
      }
    }
  };

  const handleSwitchMember = (member) => {
    if (tripData?.trip?._id) {
      localStorage.setItem(`settle_${tripData.trip._id}_member`, member._id);
      setCurrentMemberId(member._id);
      toast.success(`Active user: ${member.name}`);
    }
  };

  const handleWhatsAppShare = () => {
    if (!tripData) return;
    const { trip, settlements = [], totalSpent = 0 } = tripData;
    const tripUrl = window.location.href;

    let message = `*${trip.title}*\nTotal: ₹${totalSpent.toFixed(2)}\n\n`;
    if (settlements.length === 0) {
      message += `All settled up.\n\n`;
    } else {
      settlements.forEach((s) => {
        const upiPart = s.toMember?.upiId ? ` (${s.toMember.upiId})` : '';
        message += `• ${s.fromMember?.name} pays ${s.toMember?.name} ₹${s.amount.toFixed(2)}${upiPart}\n`;
      });
      message += `\n`;
    }
    message += `${tripUrl}`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    navigator.clipboard.writeText(message);
    toast.success('Summary copied');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Link copied');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading && !tripData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-2">
        <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-zinc-500">Loading...</span>
      </div>
    );
  }

  if (!tripData?.trip) {
    return (
      <div className="max-w-sm mx-auto py-12 text-center bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Trip not found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 rounded-md text-xs font-medium transition-colors"
        >
          Return home
        </button>
      </div>
    );
  }

  const { trip, expenses = [], settlements = [], balances = [], auditLog = [], totalSpent = 0 } = tripData;
  const members = trip.members || [];
  const activeMember = members.find((m) => m._id === currentMemberId);
  const activeMemberBalance = balances.find((b) => b.memberId === currentMemberId)?.netBalance || 0;

  const debtsToPay = settlements.filter(
    (s) => s.fromMember?._id?.toString() === currentMemberId?.toString()
  );

  const paymentsToConfirm = settlements.filter(
    (s) => s.toMember?._id?.toString() === currentMemberId?.toString() && s.status === 'PENDING'
  );

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* ───────────────────────────────────────────────────────────
          1. MINIMAL COMMAND BAR (Title, Stats, Member Chips, Actions)
         ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {trip.title}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
              ₹{totalSpent.toFixed(2)}
            </span>
          </div>

          {/* Member chips selector */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-mono text-zinc-400 mr-1">You:</span>
            {members.map((m) => {
              const isSelected = m._id === currentMemberId;
              return (
                <button
                  key={m._id}
                  onClick={() => handleSwitchMember(m)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors font-medium ${
                    isSelected
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  {m.name}
                </button>
              );
            })}
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              title="Add member"
            >
              <UserPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add expense</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-emerald-500" />
          </button>

          <button
            onClick={copyShareLink}
            className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            title="Copy invite link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────
          2. TWO-COLUMN MASTER-DETAIL LAYOUT (Ledger + Balances Sidebar)
         ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / MAIN COLUMN (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Action Items (if user owes or needs to sign off) */}
          {(debtsToPay.length > 0 || paymentsToConfirm.length > 0) && (
            <div className="space-y-2.5">
              {/* Payments to confirm */}
              {paymentsToConfirm.map((debt, idx) => {
                const fromName = debt.fromMember?.name || 'Friend';
                const formattedAmt = (parseFloat(debt.amount) || 0).toFixed(2);
                return (
                  <motion.div
                    key={`confirm-${idx}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring}
                    className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {fromName} paid you <span className="font-mono font-semibold">₹{formattedAmt}</span>
                      </span>
                      {debt.utrNumber && (
                        <span className="block text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                          UTR: {debt.utrNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConfirmReceived(debt.fromMember._id, debt.toMember._id, debt.amount)}
                        disabled={processingAction}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] rounded transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleRejectSettlement(debt.fromMember._id, debt.toMember._id)}
                        disabled={processingAction}
                        className="px-2.5 py-1 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 text-[11px] transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {/* Debts current user owes */}
              {debtsToPay.map((debt, idx) => {
                const toName = debt.toMember?.name || 'Friend';
                const formattedAmt = (parseFloat(debt.amount) || 0).toFixed(2);
                const isMarked = debt.status === 'PENDING';

                return (
                  <motion.div
                    key={`pay-${idx}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={spring}
                    className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs shadow-2xs"
                  >
                    <div>
                      <span className="text-zinc-500 dark:text-zinc-400">Pay </span>
                      <strong className="text-zinc-900 dark:text-zinc-100">{toName}</strong>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100 ml-1.5">
                        ₹{formattedAmt}
                      </span>
                      {debt.toMember?.upiId && (
                        <span className="block text-[11px] font-mono text-zinc-400">
                          {debt.toMember.upiId}
                        </span>
                      )}
                    </div>

                    {isMarked ? (
                      <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60">
                        Awaiting confirmation
                      </span>
                    ) : (
                      <button
                        onClick={() => setActivePaymentDebt(debt)}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Pay via UPI</span>

// [v190] feat(routes): scaffold trips.js routes with full group expense operations
