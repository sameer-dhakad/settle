import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CreateTripPage from './pages/CreateTripPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FeaturesPage from './pages/FeaturesPage';
import TripView from './components/TripView';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider } from './context/AuthContext';

// [v63] refactor(models): add toJSON transform to strip sensitive fields
