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

// [v85] feat(algo): create debtSimplifier.js utility in server/utils
