import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import DebtCard from '../components/DebtCard';
import { ArrowLeft, Sparkles, CheckCircle2, History, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const SettlePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const {
    settlements,
    loadTrip,
    trip,
    currentMemberId,
    markPaymentAsPaid,
    confirmPaymentReceived,
    reopenPaymentDebt,
    updateMemberUpi,
    auditLog
  } = useTrip();

  useEffect(() => {
    if (id && token && !trip) {
      loadTrip(id, token);
    }
  }, [id, token, trip, loadTrip]);

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Calculating settlements...</p>
      </div>
    );
  }

  const handleMarkPaid = async (fromId, toId, amount) => {
    await markPaymentAsPaid(id, token, fromId, toId, amount);
  };

  const handleConfirmReceived = async (fromId, toId, amount) => {
    await confirmPaymentReceived(id, token, fromId, toId, amount);
  };

// [v91] feat(algo): handle rounding discrepancies in split amount calculations
