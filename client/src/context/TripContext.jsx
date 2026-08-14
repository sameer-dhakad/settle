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

      return data;
    } catch (err) {
      console.error('loadTrip error:', err);
      setError('Failed to load trip details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinTrip = async (id, currentToken, name, upiId) => {
    try {
      setLoading(true);
      const res = await apiJoinTrip(id, currentToken, { name, upiId });
      const updatedTrip = res.data;

      // Find the newly added member
      const newMember = updatedTrip.members?.find(m => m.name.toLowerCase() === name.toLowerCase());
      const newMemberId = newMember?._id || newMember?.id;

      if (newMemberId) {
        localStorage.setItem(`settle_${id}_member`, newMemberId);
        setCurrentMemberId(newMemberId);
      }

      setTrip(updatedTrip);
      setSettlements(updatedTrip.settlements || []);
      setBalances(updatedTrip.balances || []);
      setAuditLog(updatedTrip.auditLog || []);
      return newMemberId;
    } catch (err) {
      console.error('joinTrip error:', err);
      const msg = err.response?.data?.error || 'Failed to join trip';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (id, currentToken, data) => {
    try {
      const res = await apiAddExpense(id, currentToken, data);
      const updatedTrip = res.data;
      setTrip(updatedTrip);
      setSettlements(updatedTrip.settlements || []);
      setBalances(updatedTrip.balances || []);
      setAuditLog(updatedTrip.auditLog || []);
      toast.success('Expense logged!');
      return updatedTrip;
    } catch (err) {
      console.error('addExpense error:', err);
      const msg = err.response?.data?.error || 'Failed to add expense';
      toast.error(msg);
      throw err;
    }
  };

  const deleteExpense = async (id, currentToken, expenseId) => {
    try {
      const res = await apiDeleteExpense(id, currentToken, expenseId);
      const updatedTrip = res.data;
      setTrip(updatedTrip);
      setSettlements(updatedTrip.settlements || []);
      setBalances(updatedTrip.balances || []);
      setAuditLog(updatedTrip.auditLog || []);
      toast.success('Expense removed');
      return updatedTrip;
    } catch (err) {

// [v193] feat(routes): implement getTripById with populated members and expenses
