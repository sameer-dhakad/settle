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
      const toId = s.toMemberId?.toString();

      if (fromId && balances[fromId]) {
        balances[fromId].netBalance += s.amount;
        balances[fromId].settledPaid += s.amount;
      }
      if (toId && balances[toId]) {
        balances[toId].netBalance -= s.amount;
        balances[toId].settledReceived += s.amount;
      }
    }
  });

  return Object.values(balances);
}

function simplifyDebts(members = [], expenses = [], settlements = []) {
  const netBalances = calculateNetBalances(members, expenses, settlements);

  const creditors = [];
  const debtors = [];

  netBalances.forEach((entry) => {
    const rounded = Math.round(entry.netBalance * 100) / 100;
    if (rounded > 0.01) {
      creditors.push({ ...entry, amount: rounded });
    } else if (rounded < -0.01) {
      debtors.push({ ...entry, amount: Math.abs(rounded) });
    }
  });

  // Sort descending by magnitude
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const simplified = [];

  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0];
    const debtor = debtors[0];

    const transferAmount = Math.min(creditor.amount, debtor.amount);
    const roundedTransfer = Math.round(transferAmount * 100) / 100;

    if (roundedTransfer > 0) {
      // Check if there is an active PENDING settlement in DB
      const pendingSettlement = settlements.find(
        (s) =>
          s.status === 'PENDING' &&
          s.fromMemberId?.toString() === debtor.memberId &&
          s.toMemberId?.toString() === creditor.memberId
      );

      simplified.push({
        fromMember: {
          _id: debtor.memberId,
          name: debtor.name,
          userId: debtor.userId
        },
        toMember: {
          _id: creditor.memberId,
          name: creditor.name,
          upiId: creditor.upiId || '',
          userId: creditor.userId
        },
        amount: roundedTransfer,
        status: pendingSettlement ? 'PENDING' : 'UNPAID',
        settlementId: pendingSettlement ? pendingSettlement._id : null,
        utrNumber: pendingSettlement ? pendingSettlement.utrNumber : '',
        markedPaidAt: pendingSettlement ? pendingSettlement.markedPaidAt : null
      });
    }

    creditor.amount -= transferAmount;
    debtor.amount -= transferAmount;

    if (creditor.amount < 0.01) creditors.shift();
    if (debtor.amount < 0.01) debtors.shift();
  }

  // Audit log of confirmed transactions
  const membersMap = {};
  members.forEach((m) => {
    membersMap[m._id.toString()] = m.name;
  });

  const auditLog = settlements
    .filter((s) => s.status === 'CONFIRMED')
    .map((s) => ({
      _id: s._id,
      fromMember: {
        _id: s.fromMemberId,
        name: membersMap[s.fromMemberId?.toString()] || 'Member'
      },
      toMember: {
        _id: s.toMemberId,
        name: membersMap[s.toMemberId?.toString()] || 'Member'
      },
      amount: s.amount,
      status: 'CONFIRMED',
      utrNumber: s.utrNumber || '',
      confirmedAt: s.confirmedAt || s.updatedAt || s.createdAt
    }))
    .sort((a, b) => new Date(b.confirmedAt) - new Date(a.confirmedAt));

  return {
    settlements: simplified,
    balances: netBalances,
    auditLog
  };
}

module.exports = { simplifyDebts, calculateNetBalances };
