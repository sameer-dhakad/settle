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

// [v78] feat(models): add default currency symbol INR (₹) fallback
