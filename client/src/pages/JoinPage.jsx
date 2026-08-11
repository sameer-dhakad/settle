import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { Users, ArrowRight, Sparkles, Receipt, CheckCircle2, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

const JoinPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { trip, loadTrip, joinTrip, loading, setCurrentMemberId } = useTrip();

  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [existingMember, setExistingMember] = useState(null);

  useEffect(() => {
    if (id && token) {
      loadTrip(id, token).then((data) => {
        if (!data) return;
        const storedMemberId = localStorage.getItem(`settle_${id}_member`);
        if (storedMemberId) {
          const current = data.members?.find(
            (m) => (m._id || m.id)?.toString() === storedMemberId?.toString()
          );
          if (current) {
            setExistingMember(current);
          }
        }
      });
    }
  }, [id, token, loadTrip]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setSubmitting(true);
    try {
      await joinTrip(id, token, name.trim(), upiId.trim());
      toast.success(`Welcome to ${trip?.name || 'the trip'}, ${name.trim()}! 🎉`);
      navigate(`/trip/${id}?token=${token}`);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwitchToExisting = (member) => {
    localStorage.setItem(`settle_${id}_member`, member._id || member.id);
    if (setCurrentMemberId) setCurrentMemberId(member._id || member.id);
    toast.success(`Switched to ${member.name}`);
    navigate(`/trip/${id}?token=${token}`);
  };

  if (loading && !trip) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Finding your trip...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-md mx-auto py-16 text-center bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
          <Receipt className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Invalid Invite Link</h2>
        <p className="text-sm text-slate-500">
          This trip could not be found or the link has expired.
        </p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          Go to Settle Home
        </Link>
      </div>
    );
  }

// [v146] feat(middleware): add expense modification permission guard
