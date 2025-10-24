// src/components/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Header.css';

const navItems = [
  { name: 'Home', to: '/' },
  { name: 'Create Will', to: '/create' },
  { name: 'Dashboard', to: '/dashboard' },
];

export default function Header() {
  const { connectWallet, account } = useAuth();
  const location = useLocation();

  return (
    <header className="header">
      <div className="header__content">
        <div className="logo">
          <span className="logo--accent">V</span>AARUSH
        </div>
        
        <nav className="nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav__link ${location.pathname === item.to ? 'nav__link--active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="header__right">
          {!account ? (
            <button className="btn-connect" onClick={connectWallet}>
              Connect Wallet
            </button>
          ) : (
            <div className="wallet-status">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
