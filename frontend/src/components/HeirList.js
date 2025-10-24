import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './HeirList.css';
import { formatAddress, getRelativeTime } from '../utils/helpers';
import { claimAssets } from '../utils/api';

export default function HeirList({ heirs }) {
  const [claiming, setClaiming] = useState(null);
  const [message, setMessage] = useState(null);

  if (!heirs || heirs.length === 0) {
    return <div className="heir-list--empty">No heirs registered.</div>;
  }

  const handleClaim = async (index, heirAddress) => {
    setClaiming(index);
    setMessage(null);
    
    try {
      const result = await claimAssets('will_123', heirAddress); // Replace 'will_123' with actual will ID
      setMessage({ 
        type: 'success', 
        text: `✅ Assets claimed successfully! Tx ID: ${result.transaction_id || 'pending'}` 
      });
      
      // Refresh after 2 seconds
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `❌ Claim failed: ${error.message}` 
      });
    }
    
    setClaiming(null);
  };

  return (
    <div>
      <table className="heir-list">
        <thead>
          <tr>
            <th>Address</th>
            <th>Share (%)</th>
            <th>Last Updated</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {heirs.map(({ address, share, timestamp, claimed }, idx) => (
            <tr key={idx}>
              <td className="heir-list__address">{formatAddress(address, 5)}</td>
              <td className="heir-list__share">{share}%</td>
              <td>{getRelativeTime(timestamp)}</td>
              <td>
                <span 
                  className={claimed ? 'badge badge--claimed' : 'badge badge--unclaimed'}
                >
                  {claimed ? 'Claimed' : 'Pending'}
                </span>
              </td>
              <td>
                {!claimed && (
                  <button
                    className="btn-claim"
                    onClick={() => handleClaim(idx, address)}
                    disabled={claiming === idx}
                  >
                    {claiming === idx ? '⏳ Claiming...' : '📥 Claim'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {message && (
        <div className={`claim-message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

HeirList.propTypes = {
  heirs: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
      share: PropTypes.number,
      claimed: PropTypes.bool,
      timestamp: PropTypes.number,
    })
  ).isRequired
};
