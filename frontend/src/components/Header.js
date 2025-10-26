import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import './Header.css';

export default function Header({ walletConnected, walletAddress, onConnect }) {
  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <Link to="/" className="header__logo">
          <span className="logo-text">VAARUSH</span>
          <span className="logo-tagline">Digital Inheritance Platform</span>
        </Link>

        {/* Navigation */}
        <nav className="header__nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/create" className="nav-link">Create Will</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
        </nav>

        {/* Wallet Section */}
        <div className="header__actions">
          {walletConnected ? (
            <div className="wallet-connected">
              <span className="wallet-indicator"></span>
              <span className="wallet-address">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          ) : (
            <button className="btn-connect" onClick={onConnect}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
