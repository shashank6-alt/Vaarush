// src/components/ContractForm.js

import React, { useState } from 'react';
import './ContractForm.css';
import { createWill } from '../utils/api';  // real API call

export default function ContractForm() {
  const [owner, setOwner] = useState('');
  const [assetId, setAssetId] = useState('');
  const [releaseTime, setReleaseTime] = useState('');
  const [heirs, setHeirs] = useState([{ address: '', share: '' }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleHeirChange = (index, field, value) => {
    const updated = [...heirs];
    updated[index][field] = value;
    setHeirs(updated);
  };

  const addHeir = () => {
    setHeirs([...heirs, { address: '', share: '' }]);
  };

  const removeHeir = index => {
    setHeirs(heirs.filter((_, i) => i !== index));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        owner_address: owner,
        asset_id: parseInt(assetId, 10),
        release_time: Math.floor(new Date(releaseTime).getTime() / 1000),
        heirs: heirs.map(h => ({
          address: h.address,
          share: parseInt(h.share, 10) || undefined
        }))
      };
      const resp = await createWill(payload);
      setMessage({ type: 'success', text: `Contract deployed: App ID ${resp.app_id}` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Deployment failed' });
    }
    setLoading(false);
  };

  return (
    <form className="contract-form" onSubmit={handleSubmit}>
      <h2>Create Inheritance Contract</h2>

      <label>
        Owner Address
        <input
          type="text"
          value={owner}
          onChange={e => setOwner(e.target.value)}
          required
        />
      </label>

      <label>
        Asset ID
        <input
          type="number"
          value={assetId}
          onChange={e => setAssetId(e.target.value)}
          required
        />
      </label>

      <label>
        Release Date & Time
        <input
          type="datetime-local"
          value={releaseTime}
          onChange={e => setReleaseTime(e.target.value)}
          required
        />
      </label>

      <div className="heirs-section">
        <h3>Heirs</h3>
        {heirs.map((heir, idx) => (
          <div className="heir-row" key={idx}>
            <input
              type="text"
              placeholder="Heir Address"
              value={heir.address}
              onChange={e => handleHeirChange(idx, 'address', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Share (%)"
              value={heir.share}
              onChange={e => handleHeirChange(idx, 'share', e.target.value)}
            />
            {idx > 0 && (
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeHeir(idx)}
              >
                &times;
              </button>
            )}
          </div>
        ))}
        <button type="button" className="btn-add" onClick={addHeir}>
          + Add Heir
        </button>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <button type="submit" className="btn-submit" disabled={loading}>
        {loading ? 'Deploying…' : 'Deploy Contract'}
      </button>
    </form>
  );
}
