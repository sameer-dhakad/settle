import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SettleLogo from '../components/SettleLogo';
import {
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * AuthPage - Minimalist authentication supporting Light & Dark mode
 */
const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const initialMode = searchParams.get('mode') === 'signup' ? 'register' : 'login';

  const { login, register, isAuthenticated } = useAuth();

  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [defaultUpiId, setDefaultUpiId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackNotice, setFeedbackNotice] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedbackNotice(null);

    const cleanEmail = email.trim();

    try {
      if (mode === 'login') {
        await login(cleanEmail, password);
        navigate(redirectTo);
      } else {
        if (!name.trim()) {
          toast.error('Name is required');
          setLoading(false);
          return;
        }
        await register({
          name: name.trim(),
          email: cleanEmail,
          password,
          defaultUpiId: defaultUpiId.trim()
        });
        navigate(redirectTo);
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Authentication failed';

      if (errMsg.toLowerCase().includes('not found') || errMsg.toLowerCase().includes('no account')) {
        setFeedbackNotice({
          type: 'not_found',
          message: 'No account found with this email. Switch to Register?'
        });
      } else if (errMsg.toLowerCase().includes('already exists')) {
        setFeedbackNotice({
          type: 'exists',
          message: 'An account already exists with this email. Switch to Log in?'
        });
      } else {
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-xs mx-auto py-10 space-y-5"
    >
      {/* Brand header */}
      <div className="text-center space-y-1">
        <div className="flex justify-center pb-1">
          <SettleLogo />
        </div>
        <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </h1>
      </div>

      {/* Segment switcher */}
      <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-0.5 rounded-md flex text-xs">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setFeedbackNotice(null);
          }}
          className={`flex-1 py-1 font-medium rounded transition-colors ${
            mode === 'login'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setFeedbackNotice(null);
          }}
          className={`flex-1 py-1 font-medium rounded transition-colors ${
            mode === 'register'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          Register
        </button>
      </div>

      {feedbackNotice && (
        <div className="p-2.5 rounded-md bg-amber-50 dark:bg-zinc-900 border border-amber-200 dark:border-zinc-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-300 text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{feedbackNotice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode(feedbackNotice.type === 'not_found' ? 'register' : 'login');
              setFeedbackNotice(null);
            }}
            className="text-[11px] font-medium text-zinc-900 dark:text-zinc-100 underline shrink-0"
          >
            Switch
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-lg p-5 shadow-xs space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sameer"
                className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 text-xs focus:border-zinc-500 focus:outline-none"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 text-xs focus:border-zinc-500 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-2.5 py-1.5 pr-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 text-xs focus:border-zinc-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Default UPI ID <span className="text-zinc-400 dark:text-zinc-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={defaultUpiId}
                onChange={(e) => setDefaultUpiId(e.target.value)}
                placeholder="name@okaxis"
                className="w-full px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:border-zinc-500 focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 mt-1 shadow-xs"
          >
            <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <Link
            to="/trip/live"
            className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-mono"
          >
            Skip login and open Demo Trip →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;
