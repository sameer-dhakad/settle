import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Smartphone,
  ShieldCheck,
  Users,
  MessageCircle,
  LayoutDashboard,
  CheckCircle2,
  GitCommit
} from 'lucide-react';

const cardMotion = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,

// [v31] chore(client): add svgs and icons setup for liquid glass branding
