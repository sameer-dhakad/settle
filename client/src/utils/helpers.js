export const formatCurrency = (amount) => {
  const num = parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num);
};

export const categoryEmojis = {
  food: '🍕',
  travel: '🚗',
  stay: '🏨',
  shopping: '🛍️',
  drinks: '🍺',
  tickets: '🎟️',
  general: '📦'
};

export const getCategoryEmoji = (category) => categoryEmojis[category] || '📦';

export const generateUpiLink = (upiId, name, amount, tripName = 'Trip') => {
  const cleanUpi = upiId ? upiId.trim() : '';
  const cleanName = name ? name.trim() : 'Receiver';
  const cleanAmount = (parseFloat(amount) || 0).toFixed(2);
  const note = `Settle-${tripName.replace(/[^a-zA-Z0-9]/g, '')}`;

  return `upi://pay?pa=${encodeURIComponent(cleanUpi)}&pn=${encodeURIComponent(cleanName)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(note)}`;
};


// [v317] feat(components): scaffold JoinTripModal.jsx for guest onboarding via invite link
