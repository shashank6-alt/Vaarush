import React, { useState } from 'react';
import DashboardWidget from '../components/DashboardWidget';
import HeirList from '../components/HeirList';
import AnalyticsChart from '../components/AnalyticsChart';
import { FaCoins, FaUsers, FaFileContract } from 'react-icons/fa';

export default function DashboardPage() {
  const [heirs] = useState([
    { 
      address: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEF', 
      share: 50, 
      claimed: false, 
      timestamp: Date.now() - 3600000 
    },
    { 
      address: 'EFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGH', 
      share: 30, 
      claimed: false, 
      timestamp: Date.now() - 7200000 
    },
    { 
      address: 'IJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJ', 
      share: 20, 
      claimed: true, 
      timestamp: Date.now() - 86400000 
    },
  ]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Asset Distribution',
        data: [12, 19, 8, 15, 11],
        backgroundColor: 'rgba(57,255,20,0.6)',
        borderColor: 'rgba(57,255,20,1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    type: 'bar',
    settings: {},
  };

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Your Dashboard</h1>
      
      <div className="dashboard-grid">
        <DashboardWidget title="Total Assets" value="5" icon={FaCoins} />
        <DashboardWidget title="Active Wills" value="2" icon={FaFileContract} />
        <DashboardWidget title="Beneficiaries" value="3" icon={FaUsers} />
      </div>

      <div className="dashboard-grid">
        <div style={{
          background: '#1a1f3a',
          padding: '30px',
          borderRadius: '15px',
          border: '2px solid #39FF14',
          gridColumn: '1 / -1'
        }}>
          <h2 style={{ color: '#39FF14', marginBottom: '20px', fontSize: '24px' }}>
            👥 Heirs & Beneficiaries
          </h2>
          <HeirList heirs={heirs} />
        </div>

        <div style={{
          background: '#1a1f3a',
          padding: '30px',
          borderRadius: '15px',
          border: '2px solid #39FF14',
          gridColumn: '1 / -1'
        }}>
          <h2 style={{ color: '#39FF14', marginBottom: '20px', fontSize: '24px' }}>
            📈 Analytics
          </h2>
          <AnalyticsChart data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
