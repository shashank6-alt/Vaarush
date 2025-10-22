// src/utils/helpers.js

/**
 * Format Algorand address (truncate)
 */
export const formatAddress = (address, chars = 6) => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

/**
 * Validate Algorand address format
 */
export const isValidAlgorandAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  return /^[A-Z2-7]{58}$/.test(address);
};

/**
 * Format currency (USD)
 */
export const formatCurrency = (amount, symbol = '$') => {
  if (typeof amount !== 'number') return `${symbol}0.00`;
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format large numbers
 */
export const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toString();
};

/**
 * Format date & time
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000 || timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000 || timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000 || timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Calculate relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const now = Math.floor(Date.now() / 1000);
  const seconds = now - (typeof timestamp === 'number' ? timestamp : Math.floor(timestamp / 1000));

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(timestamp);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate required fields
 */
export const validateForm = (formData, requiredFields) => {
  const errors = {};
  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].toString().trim() === '') {
      errors[field] = `${field} is required`;
    }
  });
  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Convert percentage to decimal
 */
export const percentToDecimal = (percent) => {
  if (!percent) return 0;
  return percent / 100;
};

/**
 * Convert decimal to percentage
 */
export const decimalToPercent = (decimal) => {
  if (!decimal) return 0;
  return (decimal * 100).toFixed(2);
};

/**
 * Calculate sum of array values
 */
export const sum = (array, property = null) => {
  return array.reduce((acc, item) => {
    return acc + (property ? item[property] : item);
  }, 0);
};

/**
 * Group array by property
 */
export const groupBy = (array, property) => {
  return array.reduce((grouped, item) => {
    const key = item[property];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
    return grouped;
  }, {});
};

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Convert Algo to microAlgo
 */
export const algoToMicroAlgo = (algo) => {
  return algo * 1000000;
};

/**
 * Convert microAlgo to Algo
 */
export const microAlgoToAlgo = (microAlgo) => {
  return microAlgo / 1000000;
};

/**
 * Sleep/delay utility
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
