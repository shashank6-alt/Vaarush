// src/pages/ProfilePage.js

import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaBell, FaLock, FaCheck } from 'react-icons/fa';
import './ProfilePage.css';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@algorand.com',
    walletAddress: 'AAAA...XXXX',
    notifications: true,
    twoFactorAuth: false,
  });

  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSave = async () => {
    try {
      // Mock API call - replace with real backend
      // await updateProfile(profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleLogout = () => {
    // Mock logout - replace with real auth logic
    window.location.href = '/';
  };

  return (
    <div className="profile-page">
      <h1>Profile Settings</h1>

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <FaUser />
            </div>
            <div className="profile-info">
              <h2>{profile.name}</h2>
              <p className="profile-address">{profile.walletAddress}</p>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="settings-card">
          <div className="settings-header">
            <FaUser className="settings-icon" />
            <h3>Personal Information</h3>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>
              <FaEnvelope /> Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Wallet Address</label>
            <input
              type="text"
              name="walletAddress"
              value={profile.walletAddress}
              disabled
            />
            <small>Wallet address cannot be changed</small>
          </div>

          <div className="button-group">
            {!editing ? (
              <button className="btn-edit" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            ) : (
              <>
                <button className="btn-save" onClick={handleSave}>
                  Save Changes
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Preferences Card */}
        <div className="settings-card">
          <div className="settings-header">
            <FaBell className="settings-icon" />
            <h3>Preferences</h3>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="notifications"
                checked={profile.notifications}
                onChange={handleChange}
                disabled={!editing}
              />
              <span>Email Notifications</span>
            </label>
            <p className="checkbox-desc">
              Receive updates on contract deployment and claims.
            </p>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="twoFactorAuth"
                checked={profile.twoFactorAuth}
                onChange={handleChange}
                disabled={!editing}
              />
              <span>Two-Factor Authentication</span>
            </label>
            <p className="checkbox-desc">
              Add an extra layer of security to your account.
            </p>
          </div>
        </div>

        {/* Security Card */}
        <div className="settings-card">
          <div className="settings-header">
            <FaLock className="settings-icon" />
            <h3>Security</h3>
          </div>

          <div className="security-item">
            <div className="security-info">
              <p className="security-title">Password</p>
              <p className="security-desc">Change your account password</p>
            </div>
            <button className="btn-action">Change</button>
          </div>

          <div className="security-item">
            <div className="security-info">
              <p className="security-title">Active Sessions</p>
              <p className="security-desc">Manage your active sessions</p>
            </div>
            <button className="btn-action">Manage</button>
          </div>

          <div className="security-item">
            <div className="security-info">
              <p className="security-title">Account Status</p>
              <p className="security-desc">
                <FaCheck className="status-icon" /> Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="logout-section">
        <button className="btn-logout" onClick={handleLogout}>
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}
