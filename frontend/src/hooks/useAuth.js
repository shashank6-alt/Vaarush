import { useState } from 'react';

export default function useAuth() {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // Check if AlgoSigner is installed
      if (typeof window !== 'undefined' && window.AlgoSigner) {
        await window.AlgoSigner.connect();
        const accounts = await window.AlgoSigner.accounts({
          ledger: 'TestNet'
        });
        if (accounts && accounts.length > 0) {
          setAccount(accounts[0].address);
        }
      } else {
        // Demo mode if AlgoSigner not installed
        setAccount('RQZKSEKU2YFRVZHZYQPXOZI57LXWA67XTUUCULPAV23H4Q0Q6365CYIHII');
        alert('AlgoSigner not detected. Using demo mode.');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect wallet');
    }
    setIsLoading(false);
  };

  const isConnected = () => {
    return account !== null;
  };

  return {
    account,
    connectWallet,
    isConnected,
    isLoading
  };
}
