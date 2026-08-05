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

// [v67] refactor(models): validate 12-digit numeric constraint for bank UTR references
