import React from 'react';
import './Header.css';

interface HeaderProps {
  walletConnected: boolean;
  walletAddress: string;
  onConnect: () => void;
  onNavigate: (page: 'home' | 'create' | 'dashboard') => void;
}

const Header: React.FC<HeaderProps> = ({ 
  walletConnected, 
  walletAddress, 
  onConnect,
  onNavigate 
}) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => onNavigate('home')}>
          🔐 VAARUSH
        </div>
        <nav className="nav">
          <button onClick={() => onNavigate('home')}>Home</button>
          <button onClick={() => onNavigate('create')}>Create Will</button>
          <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
        </nav>
        <button className="connect-wallet-btn" onClick={onConnect}>
          {walletConnected 
            ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
            : 'Connect Wallet'}
        </button>
      </div>
    </header>
  );
};

export default Header;
