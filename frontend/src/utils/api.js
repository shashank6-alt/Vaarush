// src/utils/api.js

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Generic fetch wrapper with error handling
 */
const fetchWrapper = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    throw new Error(err.message || 'Network error');
  }
};

/**
 * Will & Inheritance Contract APIs
 */

export const createWill = async (payload) => {
  return fetchWrapper('/wills/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getContractStatus = async (appId) => {
  return fetchWrapper(`/wills/${appId}/status`);
};

export const claimAsset = async (appId) => {
  return fetchWrapper(`/wills/${appId}/claim`, {
    method: 'POST',
  });
};

export const listUserWills = async (userAddress) => {
  return fetchWrapper(`/wills/user/${userAddress}`);
};

export const updateWillHeirs = async (appId, heirs) => {
  return fetchWrapper(`/wills/${appId}/heirs`, {
    method: 'PUT',
    body: JSON.stringify({ heirs }),
  });
};

/**
 * Analytics & Stats APIs
 */

export const getUserStats = async (userAddress) => {
  return fetchWrapper(`/stats/user/${userAddress}`);
};

export const getPlatformStats = async () => {
  return fetchWrapper('/stats/platform');
};

export const getAnalytics = async (timeframe = '30d') => {
  return fetchWrapper(`/analytics?timeframe=${timeframe}`);
};

/**
 * Profile & Settings APIs
 */

export const updateUserProfile = async (userAddress, profileData) => {
  return fetchWrapper(`/users/${userAddress}/profile`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};

export const getUserProfile = async (userAddress) => {
  return fetchWrapper(`/users/${userAddress}/profile`);
};

/**
 * Health & System APIs
 */

export const checkBackendHealth = async () => {
  return fetchWrapper('/health');
};

export const getSystemConfig = async () => {
  return fetchWrapper('/config');
};
