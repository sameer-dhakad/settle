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
        </h1>

        <form onSubmit={handleCreateTrip} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Trip name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Goa 2026"
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-zinc-400 dark:focus:border-zinc-600 focus:outline-none transition-colors"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Your name
              </label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Sameer"
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-zinc-400 dark:focus:border-zinc-600 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  UPI ID
                </label>
                <span className="text-[10px] font-mono text-zinc-400">optional</span>
              </div>
              <input
                type="text"
                value={hostUpiId}
                onChange={(e) => setHostUpiId(e.target.value)}
                placeholder="name@upi"
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm font-mono focus:border-zinc-400 dark:focus:border-zinc-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <span>{loading ? 'Creating...' : 'Create trip'}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 dark:bg-zinc-200 dark:text-zinc-700">⌘↵</kbd>
            </button>
          </div>
        </form>
      </div>

      {recentTrips.length > 0 && (
        <div className="space-y-1.5 pt-2">
          {recentTrips.map((rt) => (
            <Link
              key={rt.accessToken}
              to={`/trip/${rt.accessToken}`}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors text-xs text-zinc-700 dark:text-zinc-300 group"
            >
              <span className="font-medium truncate group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                {rt.title}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CreateTripPage;