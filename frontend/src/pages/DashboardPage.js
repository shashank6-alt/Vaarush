// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaCheckDouble, FaUsers, FaChartLine } from 'react-icons/fa';
import { getUserStats } from '../utils/api';
import { formatCurrency, formatNumber, formatDate } from '../utils/helpers';
import DashboardWidget from '../components/DashboardWidget';
import './DashboardPage.css';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace 'ALGO_ADDRESS_HERE' with actual user address from wallet
        const userAddress = localStorage.getItem('vaarush_account') || 'ALGO_ADDRESS_HERE';
        const data = await getUserStats(userAddress);
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div className="dashboard-page"><p className="loading">Loading dashboard...</p></div>;

  if (error) return <div className="dashboard-page"><p className="error">Error: {error}</p></div>;

  if (!stats) return <div className="dashboard-page"><p className="no-data">No data available</p></div>;

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p className="subtitle">Overview of your inheritance contracts and activity.</p>

      <div className="widgets-grid">
        <DashboardWidget
          title="Total Contracts"
          value={stats.totalContracts || 0}
          icon={FaFileAlt}
        />
        <DashboardWidget
          title="Claimed Contracts"
          value={stats.claimedContracts || 0}
          icon={FaCheckDouble}
        />
        <DashboardWidget
          title="Total Heirs"
          value={stats.totalHeirs || 0}
          icon={FaUsers}
        />
        <DashboardWidget
          title="Pending Claims"
          value={stats.pendingClaims || 0}
          icon={FaChartLine}
        />
      </div>

      {stats.totalValue !== undefined && (
        <div className="tvl-banner">
          <p className="tvl-label">Total Value Locked</p>
          <p className="tvl-value">{formatCurrency(stats.totalValue)}</p>
        </div>
      )}

      <section className="contracts-section">
        <h2>Recent Contracts</h2>
        {stats.contracts && stats.contracts.length > 0 ? (
          <div className="contracts-table-wrapper">
            <table className="contracts-table">
              <thead>
                <tr>
                  <th>App ID</th>
                  <th>Owner</th>
                  <th>Created</th>
                  <th>Release Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td className="app-id">{contract.appId}</td>
                    <td className="address">
                      {contract.owner?.slice(0, 6)}...{contract.owner?.slice(-4)}
                    </td>
                    <td>{formatDate(contract.createdAt)}</td>
                    <td>{formatDate(contract.releaseTime)}</td>
                    <td>
                      <span
                        className={
                          contract.claimed
                            ? 'status claimed'
                            : 'status pending'
                        }
                      >
                        {contract.claimed ? 'Claimed' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <a href={`/contract/${contract.appId}`} className="link">
                        View →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-contracts">No contracts yet</p>
        )}
      </section>

      <section className="activity-section">
        <h2>Recent Activity</h2>
        {stats.activity && stats.activity.length > 0 ? (
          <div className="activity-list">
            {stats.activity.map((item, idx) => (
              <div className="activity-item" key={idx}>
                <div className={`activity-icon ${item.type}`}>
                  {item.type === 'success' ? '✓' : 'ℹ'}
                </div>
                <div className="activity-content">
                  <p className="activity-title">{item.title}</p>
                  <p className="activity-time">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-activity">No recent activity</p>
        )}
      </section>
    </div>
  );
}
