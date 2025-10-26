import React, { useState, useEffect } from 'react';
import './DashboardPage.css';

function DashboardPage() {
  const [wills, setWills] = useState([]);

  useEffect(() => {
    const savedWills = JSON.parse(localStorage.getItem('vaarush_wills') || '[]');
    setWills(savedWills);
  }, []);

  return (
    <div className="dashboard-page">
      <h1>My Wills Dashboard</h1>
      
      {wills.length === 0 ? (
        <div className="no-wills">
          <p>No wills created yet. Start by creating your first will.</p>
          <a href="/create-will">Create Will</a>
        </div>
      ) : (
        <div className="wills-grid">
          {wills.map(will => (
            <div key={will.id} className="will-card">
              <h3>Will ID: {will.id}</h3>
              <div className="will-details">
                <p><span>Contract:</span> {will.app_id}</p>
                <p><span>Asset:</span> {will.asset_id}</p>
                <p><span>Release:</span> {will.release_date}</p>
                <p><span>Heirs:</span> {will.heirs.length}</p>
                <p><span>Created:</span> {new Date(will.created_at).toLocaleDateString()}</p>
              </div>
              <a 
                href={`https://lora.algokit.io/testnet/account/UOQPLYLEUZT56B2TNIC6RKUP6PKZZKFEUUHCT23GKHTUEN457CA64QHKSQ`}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-link"
              >
                View on Explorer
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;


