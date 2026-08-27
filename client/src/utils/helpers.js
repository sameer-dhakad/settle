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

export const getInitials = (name = '') => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};
