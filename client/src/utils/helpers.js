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

// [v205] refactor(routes): validate all incoming expense split sums against total amount
