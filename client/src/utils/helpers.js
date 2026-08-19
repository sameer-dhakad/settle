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

// [v261] feat(client): add useAuth, useTheme, and useTrip custom hooks
