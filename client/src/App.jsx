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
              <Route path="features" element={<FeaturesPage />} />
              <Route path="trip/:accessToken" element={<TripView />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>
          </Routes>

// [v287] feat(components): add user profile badge and quick logout trigger in Layout.jsx
