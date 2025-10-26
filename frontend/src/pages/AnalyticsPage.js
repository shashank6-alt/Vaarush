import React, { useState, useEffect } from 'react';
import './AnalyticsPage.css';

function AnalyticsPage() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalWills: 0,
    totalAssets: 0,
    totalHeirs: 0,
    lastActivity: null
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    // Get data from localStorage
    const willsData = JSON.parse(localStorage.getItem('vaarush_wills') || '[]');
    
    setStats({
      totalWills: willsData.length,
      totalAssets: willsData.reduce((acc, w) => acc + (w.asset_id || 0), 0),
      totalHeirs: willsData.reduce((acc, w) => acc + (w.heirs?.length || 0), 0),
      lastActivity: willsData.length > 0 ? new Date().toLocaleDateString() : null
    });

    // Mock transaction history
    const mockTransactions = willsData.map((will, idx) => ({
      id: idx + 1,
      type: 'Contract Deployed',
      date: new Date(Date.now() - idx * 86400000).toLocaleDateString(),
      status: 'Success',
      appId: will.app_id || (12345 + idx)
    }));

    setTransactions(mockTransactions);
  };

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics & Insights</h1>
        <p>Track your digital inheritance activity</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Total Wills</h3>
            <p className="metric-value">{stats.totalWills}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💎</div>
          <div className="metric-content">
            <h3>Total Assets</h3>
            <p className="metric-value">{stats.totalAssets}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Total Heirs</h3>
            <p className="metric-value">{stats.totalHeirs}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h3>Last Activity</h3>
            <p className="metric-value">{stats.lastActivity || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="transactions-section">
        <h2>Transaction History</h2>
        
        {transactions.length === 0 ? (
          <div className="empty-transactions">
            <p>No transactions yet. Create your first will!</p>
          </div>
        ) : (
          <div className="transactions-table">
            <div className="table-header">
              <span>ID</span>
              <span>Type</span>
              <span>Date</span>
              <span>App ID</span>
              <span>Status</span>
            </div>
            {transactions.map(tx => (
              <div key={tx.id} className="table-row">
                <span>#{tx.id}</span>
                <span>{tx.type}</span>
                <span>{tx.date}</span>
                <span className="app-id">{tx.appId}</span>
                <span className="status-success">{tx.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;
