import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createTrip } from '../api';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

/**
 * CreateTripPage - Ultra-minimalist Linear-standard creation flow
 * No subheadings, no subtexts, pure craft and velocity.
 */
const CreateTripPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = useState(searchParams.get('title') || '');
  const [hostName, setHostName] = useState('');
  const [hostUpiId, setHostUpiId] = useState('');
  const [currency] = useState('INR');
  const [loading, setLoading] = useState(false);
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('settle_recent_trips') || '[]');
      setRecentTrips(saved);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleCreateTrip(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, hostName, hostUpiId]);

  const handleCreateTrip = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      toast.error('Enter a trip title');
      return;
    }
    if (!hostName.trim()) {
      toast.error('Enter your name');
      return;
    }

    setLoading(true);
    try {
      const res = await createTrip({
        title: title.trim(),
        hostName: hostName.trim(),
        hostUpiId: hostUpiId.trim(),
        currency
      });

      const data = res.data;
      const trip = data.trip || data;
      const accessToken = trip.accessToken;
      const hostMemberId = trip.members?.[0]?._id;

      if (hostMemberId && trip._id) {
        localStorage.setItem(`settle_${trip._id}_member`, hostMemberId);
      }

      const updatedRecent = [
        {
          id: trip._id,
          accessToken,
          title: trip.title,
          updatedAt: new Date().toISOString()
        },
        ...recentTrips.filter((r) => r.accessToken !== accessToken)
      ].slice(0, 3);

      localStorage.setItem('settle_recent_trips', JSON.stringify(updatedRecent));
      toast.success('Trip created');
      navigate(`/trip/${accessToken}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="max-w-md mx-auto py-6 sm:py-12 space-y-4"
    >
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-400">Esc</span>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-5 sm:p-6 shadow-xs space-y-5 transition-colors">
        <h1 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          New trip

// [v197] feat(routes): implement deleteExpense with recalculation of balances
