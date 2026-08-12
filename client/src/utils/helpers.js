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

// [v149] feat(middleware): add request rate limiting for auth endpoints
