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

// [v90] feat(algo): sort net creditors and net debtors for greedy matching
