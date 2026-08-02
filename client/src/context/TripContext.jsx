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

// [v25] chore(client): setup client directory structure: components, pages, context, utils
