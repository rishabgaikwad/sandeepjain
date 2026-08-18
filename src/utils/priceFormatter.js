import storeConfig from '../config/storeConfig';

/**
  Formats price according to storeConfig currency setting.
  @param {number} amount
  @returns {string} e.g. "₹1,499"
*/
export const formatPrice = (amount) => {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const formatted = new Intl.NumberFormat('en-IN').format(numericAmount);
  return `${storeConfig.currency}${formatted}`;
};
