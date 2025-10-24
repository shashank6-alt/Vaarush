import React, { useState } from 'react';
import './ContractForm.css';
import { createWill } from '../utils/api';

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
      // Validate before sending
      if (!owner || owner.toLowerCase() === 'hi') {
        throw new Error('❌ Owner address is invalid. Enter a valid Algorand address (e.g., RQZKSE...)');
      }
      
      if (!assetId || assetId < 0) {
        throw new Error('❌ Asset ID must be a positive number (e.g., 1, 10, 100)');
      }
      
      if (!releaseTime) {
        throw new Error('❌ Release date is required. Select a future date');
      }
      
      if (!heirs || heirs.length === 0) {
        throw new Error('❌ Must add at least 1 heir');
      }
      
      for (let i = 0; i < heirs.length; i++) {
        if (!heirs[i].address || heirs[i].address.toLowerCase() === 'by') {
          throw new Error(`❌ Heir #${i+1} address is invalid. Enter a valid address`);
        }
      }
      
      const totalShare = heirs.reduce((sum, h) => sum + (parseInt(h.share) || 0), 0);
      if (totalShare > 100) {
        throw new Error(`❌ Total heir shares (${totalShare}%) cannot exceed 100%`);
      }

      const payload = {
        owner_address: owner,
        asset_id: parseInt(assetId, 10),
        release_time: Math.floor(new Date(releaseTime).getTime() / 1000),
        heirs: heirs.map(h => ({
          address: h.address,
          share: parseInt(h.share, 10) || 0
        }))
      };

      console.log('📤 Sending payload:', payload);

      const resp = await createWill(payload);
      
      if (resp.status === 'success') {
        setMessage({ 
          type: 'success', 
          text: `✅ ${resp.message}\n📍 App ID: ${resp.app_id}` 
        });
        
        // Clear form
        setTimeout(() => {
          setOwner('');
          setAssetId('');
          setReleaseTime('');
          setHeirs([{ address: '', share: '' }]);
          setMessage(null);
        }, 3000);
      }
      
    } catch (err) {
      console.error('❌ Error:', err);
      setMessage({ 
        type: 'error', 
        text: err.message || 'Failed to create will. Check console for details.' 
      });
    }

    setLoading(false);
  };

  return (
    <div className="contract-form">
      <h2>🔐 Create Inheritance Contract</h2>
      <form onSubmit={handleSubmit}>
        {/* Owner Address */}
        <div className="form-group">
          <label>Owner Address *</label>
          <input
            type="text"
            value={owner}
            onChange={e => setOwner(e.target.value)}
            placeholder="Enter your Algorand wallet address"
            required
          />
          <small>Example: RQZKSEKU2YFRVZHZYQPXOZI57LXWA67XTUUCULPAV23H4Q0Q6365CYIHII</small>
        </div>

        {/* Asset ID */}
        <div className="form-group">
          <label>Asset ID *</label>
          <input
            type="number"
            value={assetId}
            onChange={e => setAssetId(e.target.value)}
            placeholder="Enter asset ID (e.g., 1)"
            required
            min="1"
          />
          <small>The Algorand asset you want to inherit</small>
        </div>

        {/* Release Date */}
        <div className="form-group">
          <label>Release Date & Time *</label>
          <input
            type="datetime-local"
            value={releaseTime}
            onChange={e => setReleaseTime(e.target.value)}
            required
          />
          <small>When beneficiaries can claim the assets</small>
        </div>

        {/* Heirs */}
        <div className="heirs-section">
          <h3>👥 Heirs & Beneficiaries</h3>
          {heirs.map((heir, idx) => (
            <div className="heir-row" key={idx}>
              <div className="heir-input">
                <input
                  type="text"
                  placeholder="Heir wallet address"
                  value={heir.address}
                  onChange={e => handleHeirChange(idx, 'address', e.target.value)}
                  required
                />
              </div>
              <div className="heir-share">
                <input
                  type="number"
                  placeholder="Share %"
                  value={heir.share}
                  onChange={e => handleHeirChange(idx, 'share', e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              {idx > 0 && (
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeHeir(idx)}
                  title="Remove heir"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add-heir" onClick={addHeir}>
            ➕ Add Heir
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="btn-deploy" disabled={loading}>
          {loading ? '⏳ Deploying...' : '🚀 Deploy Contract'}
        </button>
      </form>
    </div>
  );
}
