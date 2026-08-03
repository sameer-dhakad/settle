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

// [v34] chore: configure clean git ignore patterns for macos .DS_Store files
