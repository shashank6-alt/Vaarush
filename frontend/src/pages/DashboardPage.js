// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaCheckDouble, FaUsers, FaChartLine } from 'react-icons/fa';
import DashboardWidget from '../components/DashboardWidget';
import './DashboardPage.css';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalContracts: 0,
    claimedContracts: 0,
    totalHeirs: 0,
    pendingClaims: 0,
  });

  useEffect(() => {
    // Demo data - replace with real API call
    const fetchStats = async () => {
      try {
        // const data = await getUserStats();
        // setStats(data);
        setStats({
          totalContracts: 12,
          claimedContracts: 5,
          totalHeirs: 28,
          pendingClaims: 7,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p className="subtitle">Overview of your inheritance contracts and activity.</p>

      <div className="widgets-grid">
        <DashboardWidget
          title="Total Contracts"
          value={stats.totalContracts}
          icon={FaFileAlt}
        />
        <DashboardWidget
          title="Claimed Contracts"
          value={stats.claimedContracts}
          icon={FaCheckDouble}
        />
        <DashboardWidget
          title="Total Heirs"
          value={stats.totalHeirs}
          icon={FaUsers}
        />
        <DashboardWidget
          title="Pending Claims"
          value={stats.pendingClaims}
          icon={FaChartLine}
        />
      </div>

      <section className="contracts-section">
        <h2>Recent Contracts</h2>
        <div className="contracts-table">
          <table>
            <thead>
              <tr>
                <th>App ID</th>
                <th>Owner</th>
                <th>Release Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="app-id">1001</td>
                <td className="address">AAAA...XXXX</td>
                <td>2025-12-25</td>
                <td>
                  <span className="status unclaimed">Pending</span>
                </td>
                <td>
                  <a href="/contract/1001" className="link">View</a>
                </td>
              </tr>
              <tr>
                <td className="app-id">1002</td>
                <td className="address">BBBB...YYYY</td>
                <td>2025-11-15</td>
                <td>
                  <span className="status claimed">Claimed</span>
                </td>
                <td>
                  <a href="/contract/1002" className="link">View</a>
                </td>
              </tr>
              <tr>
                <td className="app-id">1003</td>
                <td className="address">CCCC...ZZZZ</td>
                <td>2026-01-10</td>
                <td>
                  <span className="status unclaimed">Pending</span>
                </td>
                <td>
                  <a href="/contract/1003" className="link">View</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">✓</div>
            <div className="activity-content">
              <p className="activity-title">Contract Deployed</p>
              <p className="activity-time">App ID 1001 • 2 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon success">✓</div>
            <div className="activity-content">
              <p className="activity-title">Asset Claimed</p>
              <p className="activity-time">App ID 1002 • 1 day ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon info">ℹ</div>
            <div className="activity-content">
              <p className="activity-title">Heir Registered</p>
              <p className="activity-time">App ID 1003 • 3 days ago</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
