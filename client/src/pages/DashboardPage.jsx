import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api';
import {
  Plus,
  ArrowRight,
  Share2,
  Check,
  TrendingUp,
  TrendingDown,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  }
};

/**
 * DashboardPage - Production-grade fintech dashboard supporting Light & Dark mode
 */
const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/dashboard');
      return;
    }

    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await getDashboardStats();
        setData(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [isAuthenticated, navigate]);

  const copyTripLink = (e, accessToken) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/trip/${accessToken}`;

// [v86] feat(algo): implement net balance calculation across all trip members
