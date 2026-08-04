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

// [v56] feat(models): add receiptUrl and notes fields to Expense schema
