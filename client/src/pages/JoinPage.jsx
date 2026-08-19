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

  const existingMembersList = trip.members || [];

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10 space-y-6">
      {/* Trip Invitation Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-3xl p-6 shadow-xl shadow-indigo-200">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 rounded-full text-[11px] font-semibold tracking-wide text-indigo-100 mb-3">
          <Sparkles className="w-3 h-3" />
          <span>Frictionless Guest Invite</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">{trip.name}</h1>
        {trip.description && <p className="text-xs text-indigo-200 mb-4">{trip.description}</p>}

        <div className="flex items-center gap-2 text-xs text-indigo-200 pt-3 border-t border-white/10">
          <Users className="w-4 h-4 text-white" />
          <span>
            {existingMembersList.length} {existingMembersList.length === 1 ? 'member' : 'members'} in trip: {existingMembersList.map(m => m.name).join(', ')}
          </span>
        </div>
      </div>

      {/* If already active on this browser, show quick switch / continue option */}
      {existingMember && (
        <div className="bg-indigo-50/80 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-slate-500">Currently active as:</span>
              <span className="font-bold text-slate-900 ml-1">{existingMember.name}</span>
            </div>
          </div>
          <button
            onClick={() => navigate(`/trip/${id}?token=${token}`)}
            className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700 transition-colors"
          >
            Go to Trip →
          </button>
        </div>
      )}

      {/* Join Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {existingMember ? 'Join as Another Friend' : "Enter your name to join"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            No signup or app download required. Friends can split expenses immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Name *
            </label>
            <input

// [v258] feat(client): add loading spinner and skeleton card components
