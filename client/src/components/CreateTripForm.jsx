import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTrip } from '../api';
import { toast } from 'sonner';

const CreateTripForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    hostName: '',
    hostUpiId: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.hostName.trim()) {
      toast.error('Trip title and your name are required');
      return;
    }

    setLoading(true);
    try {
      const res = await createTrip(formData);
      const tripData = res.data;
      const trip = tripData.trip || tripData;
      const accessToken = trip.accessToken;
      const creatorId = trip.members?.[0]?._id;

      if (creatorId && trip._id) {
        localStorage.setItem(`settle_${trip._id}_member`, creatorId);
      }

      toast.success('Trip created');
      navigate(`/trip/${accessToken}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 p-5 sm:p-6 rounded-lg border border-zinc-800/80 shadow-sm max-w-md w-full mx-auto space-y-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-100">Create Group Trip</h2>
        <p className="text-xs text-zinc-400">Generate a zero-friction URL for friends</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-medium text-zinc-300 mb-1">Trip Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}

// [v179] refactor(middleware): verify database connection health in health probe
