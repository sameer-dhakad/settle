import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import DebtCard from '../components/DebtCard';
import { ArrowLeft, Sparkles, CheckCircle2, History, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const SettlePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const {
    settlements,
    loadTrip,
    trip,
    currentMemberId,
    markPaymentAsPaid,
    confirmPaymentReceived,
    reopenPaymentDebt,
    updateMemberUpi,
    auditLog
  } = useTrip();

  useEffect(() => {
    if (id && token && !trip) {
      loadTrip(id, token);
    }
  }, [id, token, trip, loadTrip]);

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">Calculating settlements...</p>
      </div>
    );
  }

  const handleMarkPaid = async (fromId, toId, amount) => {
    await markPaymentAsPaid(id, token, fromId, toId, amount);
  };

  const handleConfirmReceived = async (fromId, toId, amount) => {
    await confirmPaymentReceived(id, token, fromId, toId, amount);
  };

  const handleReopen = async (fromId, toId) => {
    await reopenPaymentDebt(id, token, fromId, toId);
  };

  const handleUpdateUpi = async (member) => {
    const upi = prompt(`Enter UPI ID for ${member.name}:`, member.upiId || '');
    if (upi !== null) {
      await updateMemberUpi(id, token, member.memberId || member._id || member.id, upi);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => navigate(`/trip/${id}?token=${token}`)}
          className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200/80 rounded-2xl transition-colors text-slate-600 shadow-sm"
          title="Back to trip"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settle Up</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {trip.name} • {settlements.length} {settlements.length === 1 ? 'transfer' : 'transfers'} required
          </p>
        </div>
      </div>

      {/* Algorithm Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-100 rounded-3xl p-5 text-xs text-indigo-950 flex items-start gap-3.5">
        <div className="p-2 bg-indigo-600 text-white rounded-2xl shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <strong className="font-bold block text-sm text-indigo-900 mb-0.5">
            Greedy Min-Cash-Flow Simplification Active
          </strong>
          <span className="text-slate-600 leading-relaxed">
            All group expenses have been collapsed into the fewest direct transfers. Pay directly via mobile UPI deep-link or desktop QR code.
          </span>
        </div>
      </div>

      {/* Active Settlements */}
      <div className="space-y-3">
        {settlements.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">All Settled Up! 🎉</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              No pending debts in this trip. Every member's balance is clean!
            </p>
            <button
              onClick={() => navigate(`/trip/${id}?token=${token}`)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Back to Expenses
            </button>
          </div>
        ) : (
          settlements.map((debt, index) => (
            <DebtCard
              key={index}
              debt={debt}
              tripName={trip.name}
              currentMemberId={currentMemberId}
              onMarkPaid={handleMarkPaid}
              onConfirmReceived={handleConfirmReceived}
              onReopen={handleReopen}
              onUpdateUpi={handleUpdateUpi}
            />
          ))
        )}
      </div>

      {/* Permanent Settlement Audit Log */}
      {auditLog && auditLog.length > 0 && (
        <div className="pt-6 border-t border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <History className="w-4 h-4" />
            <span>Settled Payment Audit Log ({auditLog.length})</span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {auditLog.map((log) => (
              <div key={log._id || log.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      <span>{log.from?.name}</span>
                      <span className="text-slate-400 font-normal"> paid </span>
                      <span>{log.to?.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Confirmed on {new Date(log.confirmedAt || log.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="font-bold text-slate-900 text-sm">
                  {formatCurrency(log.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettlePage;
