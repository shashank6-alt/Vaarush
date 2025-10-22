// src/pages/ContractPage.js

import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaHourglassEnd, FaClipboardList } from 'react-icons/fa';
import HeirList from '../components/HeirList';
import './ContractPage.css';
import { getContractStatus, claimAsset } from '../utils/api';

export default function ContractPage() {
  const [appId, setAppId] = useState('');
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [claiming, setClaiming] = useState(false);

  const handleLoadContract = async () => {
    if (!appId.trim()) {
      setMessage({ type: 'error', text: 'Please enter an App ID' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const data = await getContractStatus(appId);
      setContract(data);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to load contract' });
      setContract(null);
    }
    setLoading(false);
  };

  const handleClaim = async () => {
    setClaiming(true);
    setMessage(null);
    try {
      const resp = await claimAsset(appId);
      setMessage({ type: 'success', text: `Claimed successfully! TxID: ${resp.txid}` });
      setContract({ ...contract, claimed: true });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Claim failed' });
    }
    setClaiming(false);
  };

  const isClaimable = contract && !contract.claimed && new Date() >= new Date(contract.release_time * 1000);

  return (
    <div className="contract-page">
      <h1>Manage Your Contract</h1>

      <div className="loader-section">
        <div className="loader-input">
          <input
            type="text"
            placeholder="Enter App ID..."
            value={appId}
            onChange={e => setAppId(e.target.value)}
          />
          <button onClick={handleLoadContract} disabled={loading}>
            {loading ? 'Loading...' : 'Load Contract'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {contract && (
        <div className="contract-details">
          <div className="status-panel">
            <div className="status-header">
              <FaClipboardList className="status-icon" />
              <h2>Contract Summary</h2>
            </div>

            <div className="status-row">
              <span className="label">Owner Address</span>
              <span className="value">{contract.owner_address}</span>
            </div>

            <div className="status-row">
              <span className="label">Asset ID</span>
              <span className="value">{contract.asset_id}</span>
            </div>

            <div className="status-row">
              <span className="label">Release Time</span>
              <span className="value">
                {new Date(contract.release_time * 1000).toLocaleString()}
              </span>
            </div>

            <div className="status-row">
              <span className="label">Status</span>
              <span className={`badge ${contract.claimed ? 'badge--claimed' : 'badge--unclaimed'}`}>
                {contract.claimed ? (
                  <>
                    <FaCheckCircle /> Claimed
                  </>
                ) : (
                  <>
                    <FaHourglassEnd /> Pending
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="heirs-panel">
            <h3>Registered Heirs</h3>
            <HeirList heirs={contract.heirs || []} />
          </div>

          {!contract.claimed && (
            <div className="claim-panel">
              <h3>Claim Asset</h3>
              {isClaimable ? (
                <button
                  className="btn-claim"
                  onClick={handleClaim}
                  disabled={claiming}
                >
                  {claiming ? 'Processing...' : 'Claim Now'}
                </button>
              ) : (
                <div className="claim-disabled">
                  <p>Available after: {new Date(contract.release_time * 1000).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!contract && !loading && appId && (
        <div className="no-contract">
          Click "Load Contract" to retrieve contract details.
        </div>
      )}
    </div>
  );
}
