import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getTrip as fetchTripInfo,
  addExpense as apiAddExpense,
  deleteExpense as apiDeleteExpense,
  joinTrip as apiJoinTrip,
  getSettlements as fetchSettlements,
  updateMemberUpi as apiUpdateMemberUpi,
  markPaymentPaid as apiMarkPaymentPaid,
  confirmPayment as apiConfirmPayment,
  reopenPayment as apiReopenPayment
} from '../api';
import { toast } from 'sonner';

const TripContext = createContext(null);

export const useTrip = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [token, setToken] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [balances, setBalances] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  const loadTrip = useCallback(async (id, urlToken) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchTripInfo(id, urlToken);
      const data = res.data;
      setTrip(data);
      setToken(urlToken);
      setSettlements(data.settlements || []);
      setBalances(data.balances || []);
      setAuditLog(data.auditLog || []);

      // Check stored member ID
      const storedMemberId = localStorage.getItem(`settle_${id}_member`);
      if (storedMemberId) {
        setCurrentMemberId(storedMemberId);
      }

      // Save to recent trips
      try {
        const recent = JSON.parse(localStorage.getItem('settle_recent_trips') || '[]');
        const existingIndex = recent.findIndex(r => r.id === id);
        const tripSummary = {
          id,
          token: urlToken,
          name: data.name,
          membersCount: data.members?.length || 1,
          totalExpenses: data.totalExpenses || 0,
          updatedAt: new Date().toISOString()
        };
        if (existingIndex >= 0) {
          recent[existingIndex] = tripSummary;
        } else {
          recent.unshift(tripSummary);
        }
        localStorage.setItem('settle_recent_trips', JSON.stringify(recent.slice(0, 10)));
      } catch (e) {
        console.error('Failed to update recent trips', e);
      }


// [v81] refactor(models): prevent duplicate member names within single trip
