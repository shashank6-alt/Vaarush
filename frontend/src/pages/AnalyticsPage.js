// src/pages/AnalyticsPage.js

import React from 'react';
import AnalyticsChart from '../components/AnalyticsChart';
import './AnalyticsPage.css';

export default function AnalyticsPage() {
  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Contracts Deployed',
        data: [5, 8, 12, 10, 15, 18],
        backgroundColor: 'rgba(57,255,20,0.7)',
        borderColor: '#39FF14',
        borderWidth: 2,
      },
    ],
  };

  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Assets Claimed',
        data: [3, 7, 5, 12],
        borderColor: '#39FF14',
        backgroundColor: 'rgba(57,255,20,0.1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: ['Claimed', 'Pending', 'Expired'],
    datasets: [
      {
        label: 'Contract Status',
        data: [30, 45, 25],
        backgroundColor: ['#39FF14', '#FF9500', '#FF4C4C'],
        borderColor: '#121212',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>
      <p className="subtitle">
        Monitor your inheritance platform's performance and insights.
      </p>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h2>Contracts Deployed Over Time</h2>
          <AnalyticsChart
            data={barChartData}
            options={{ type: 'bar', settings: {} }}
          />
        </div>

        <div className="analytics-card">
          <h2>Assets Claimed Trend</h2>
          <AnalyticsChart
            data={lineChartData}
            options={{ type: 'line', settings: {} }}
          />
        </div>

        <div className="analytics-card">
          <h2>Contract Status Distribution</h2>
          <AnalyticsChart
            data={pieChartData}
            options={{ type: 'pie', settings: {} }}
          />
        </div>
      </div>

      <section className="metrics-section">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Total Value Locked</div>
            <div className="metric-value">$2.5M</div>
            <div className="metric-change positive">+12% this month</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Avg. Claim Time</div>
            <div className="metric-value">45 Days</div>
            <div className="metric-change neutral">Stable</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Success Rate</div>
            <div className="metric-value">98.2%</div>
            <div className="metric-change positive">+2.1% vs last month</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Active Users</div>
            <div className="metric-value">1,240</div>
            <div className="metric-change positive">+18% growth</div>
          </div>
        </div>
      </section>

      <section className="insights-section">
        <h2>Insights & Recommendations</h2>
        <div className="insights-list">
          <div className="insight-item">
            <span className="insight-icon">📊</span>
            <div className="insight-content">
              <p className="insight-title">Peak Activity</p>
              <p className="insight-desc">
                Contract deployments peak on Tuesday & Wednesday mornings.
              </p>
            </div>
          </div>
          <div className="insight-item">
            <span className="insight-icon">⚡</span>
            <div className="insight-content">
              <p className="insight-title">Performance</p>
              <p className="insight-desc">
                Average transaction speed: 2.3 seconds (excellent).
              </p>
            </div>
          </div>
          <div className="insight-item">
            <span className="insight-icon">🎯</span>
            <div className="insight-content">
              <p className="insight-title">User Growth</p>
              <p className="insight-desc">
                New users increased 18% month-over-month.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
