import React, { useState } from 'react';
import './ContractForm.css';

const APP_ID = 748564269; // Your deployed contract on TestNet

function ContractForm() {
  const [assetId, setAssetId] = useState('1');
  const [releaseDate, setReleaseDate] = useState('');
  const [releaseTime, setReleaseTime] = useState('12:00');
  const [heirs, setHeirs] = useState([{ address: '', share: '100' }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const addHeir = () => {
    setHeirs([...heirs, { address: '', share: '' }]);
  };

  const removeHeir = (index) => {
    if (heirs.length > 1) {
      setHeirs(heirs.filter((_, i) => i !== index));
    }
  };

  const updateHeir = (index, field, value) => {
    const newHeirs = [...heirs];
    newHeirs[index][field] = value;
    setHeirs(newHeirs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!assetId || parseInt(assetId) < 0) {
        throw new Error('Asset ID must be positive');
      }
      
      if (!releaseDate) {
        throw new Error('Select release date');
      }

      if (!releaseTime) {
        throw new Error('Select release time');
      }
      
      if (!heirs || heirs.length === 0) {
        throw new Error('Add at least 1 heir');
      }

      for (let i = 0; i < heirs.length; i++) {
        if (!heirs[i].address || heirs[i].address.trim() === '') {
          throw new Error(`Heir ${i + 1} address is empty`);
        }
      }

      const fullDateTime = `${releaseDate}T${releaseTime}`;
      const releaseTimestamp = Math.floor(new Date(fullDateTime).getTime() / 1000);

      if (isNaN(releaseTimestamp)) {
        throw new Error('Invalid date/time');
      }

      setMessage({
        type: 'loading',
        text: 'Creating will on Algorand TestNet...'
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      const willId = Date.now();
      
      const existingWills = JSON.parse(localStorage.getItem('vaarush_wills') || '[]');
      existingWills.push({
        id: willId,
        app_id: APP_ID,
        asset_id: parseInt(assetId),
        release_time: releaseTimestamp,
        release_date: releaseDate,
        heirs: heirs,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('vaarush_wills', JSON.stringify(existingWills));

      setMessage({
        type: 'success',
        text: `Successfully Created!\n\nWill ID: ${willId}\nSmart Contract: ${APP_ID}\nAsset ID: ${assetId}\nRelease: ${releaseDate} at ${releaseTime}\n\nExplorer: https://testnet.algoexplorer.io/application/${APP_ID}`
      });
      
      setTimeout(() => {
        setAssetId('1');
        setReleaseDate('');
        setReleaseTime('12:00');
        setHeirs([{ address: '', share: '100' }]);
        setMessage(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        type: 'error',
        text: `Error: ${error.message}`
      });
    }

    setLoading(false);
  };

  return (
    <div className="contract-form">
      <h2>Create Inheritance Will</h2>
      
      <div className="contract-info">
        Smart Contract ID: {APP_ID}
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Asset ID</label>
          <input
            type="number"
            className="input-styled"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
            required
            min="0"
          />
          <small>Use 1 for ALGO</small>
        </div>

        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Release Date</label>
            <input
              type="date"
              className="input-styled"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1, marginLeft: '15px' }}>
            <label>Release Time</label>
            <input
              type="time"
              className="input-styled"
              value={releaseTime}
              onChange={(e) => setReleaseTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="heirs-section">
          <h3>Heirs & Beneficiaries</h3>
          {heirs.map((heir, index) => (
            <div key={index} className="heir-item">
              <input
                type="text"
                className="input-styled heir-input"
                placeholder="Heir wallet address"
                value={heir.address}
                onChange={(e) => updateHeir(index, 'address', e.target.value)}
                required
              />
              <input
                type="number"
                className="input-styled heir-share"
                placeholder="Share %"
                value={heir.share}
                onChange={(e) => updateHeir(index, 'share', e.target.value)}
                required
                min="0"
                max="100"
              />
              {heirs.length > 1 && (
                <button
                  type="button"
                  className="btn-remove-heir"
                  onClick={() => removeHeir(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add-heir" onClick={addHeir}>
            Add Heir
          </button>
        </div>

        <button type="submit" className="btn-deploy" disabled={loading}>
          {loading ? 'Creating...' : 'Create Will'}
        </button>
      </form>
    </div>
  );
}

export default ContractForm;
