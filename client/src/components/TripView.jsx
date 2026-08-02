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

// [v22] docs: document client environment variables in client/.env.example
