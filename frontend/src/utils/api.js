// src/utils/api.js

const API_BASE_URL = 'http://localhost:8000';

export const createWill = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/create-will`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create will');
  }

  return response.json();
};

export const getWills = async (address) => {
  const response = await fetch(`${API_BASE_URL}/wills/${address}`);
  if (!response.ok) {
    throw new Error('Failed to fetch wills');
  }
  return response.json();
};

// NEW: Claim assets function
export const claimAssets = async (willId, claimerAddress) => {
  const response = await fetch(`${API_BASE_URL}/claim-assets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      will_id: willId,
      claimer_address: claimerAddress,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to claim assets');
  }

  return response.json();
};
// Add this function to your existing api.js file

export const getUserStats = async (address) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-stats/${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      total_assets: 0,
      active_wills: 0,
      beneficiaries: 0
    };
  }
};
