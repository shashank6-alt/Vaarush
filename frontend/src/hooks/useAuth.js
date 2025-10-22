// src/hooks/useAuth.js

import { useState, useCallback } from 'react';

export default function useAuth() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.algorand) {
        throw new Error('Algorand wallet not found. Please install it.');
      }
      const accounts = await window.algorand.connect();
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        localStorage.setItem('vaarush_account', accounts[0]);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    localStorage.removeItem('vaarush_account');
  }, []);

  const isConnected = () => {
    return account !== null;
  };

  return {
    account,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    isConnected,
  };
}
