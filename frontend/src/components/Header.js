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
      <div className="header__left">
        <span className="logo">
          <span className="logo--accent">V</span>aarush
        </span>
        <nav className="nav">
          {navItems.map(({ name, to }) => (
            <Link
              key={to}
              to={to}
              className={
                location.pathname === to
                  ? 'nav__link nav__link--active'
                  : 'nav__link'
              }
            >
              {name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="header__right">
        {account ? (
          <span className="wallet-status">
            {account.slice(0, 6)}…{account.slice(-4)}
          </span>
        ) : (
          <button className="btn-connect" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}
