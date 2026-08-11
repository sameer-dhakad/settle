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

// [v141] feat(middleware): allow frictionless read access for guests with valid token
