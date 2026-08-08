/**
 * Greedy Min-Cash-Flow Debt Simplification Engine with UTR Reference Tracking
 */
function calculateNetBalances(members = [], expenses = [], settlements = []) {
  const balances = {};

  // Initialize all members with 0
  members.forEach((m) => {
    const id = m._id.toString();
    balances[id] = {
      memberId: id,
      name: m.name,
      upiId: m.upiId || '',
      userId: m.userId || null,
      isHost: Boolean(m.isHost),
      netBalance: 0,
      totalPaid: 0,
      totalOwed: 0,
      settledPaid: 0,
      settledReceived: 0
    };
  });

  // 1. Process Expenses
  expenses.forEach((expense) => {
    const payerId = expense.paidBy?.toString();
    if (payerId && balances[payerId]) {
      balances[payerId].netBalance += expense.amount;
      balances[payerId].totalPaid += expense.amount;
    }

    (expense.splits || []).forEach((split) => {
      const memberId = split.memberId?.toString();
      if (memberId && balances[memberId]) {
        balances[memberId].netBalance -= split.owedAmount;
        balances[memberId].totalOwed += split.owedAmount;
      }
    });
  });

  // 2. Process Confirmed Settlements (Adjusts net balance)
  settlements.forEach((s) => {
    if (s.status === 'CONFIRMED') {
      const fromId = s.fromMemberId?.toString();

// [v112] refactor(algo): streamline creditor/debtor queue sorting
