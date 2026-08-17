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
import { ThemeProvider, useTheme } from './context/ThemeContext';

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster position="top-center" richColors theme={theme} />;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ThemedToaster />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="create" element={<CreateTripPage />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />

// [v231] test(routes): verify seed script creates accessible demo trips with valid tokens
