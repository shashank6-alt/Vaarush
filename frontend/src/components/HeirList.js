// src/components/HeirList.js

import React from 'react';
import PropTypes from 'prop-types';
import './HeirList.css';

export default function HeirList({ heirs }) {
  if (!heirs || heirs.length === 0) {
    return <div className="heir-list--empty">No heirs registered.</div>;
  }

  return (
    <table className="heir-list">
      <thead>
        <tr>
          <th>Address</th>
          <th>Share (%)</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {heirs.map(({ address, share, claimed }, idx) => (
          <tr key={idx}>
            <td className="heir-list__address">{address}</td>
            <td className="heir-list__share">{share ?? '—'}</td>
            <td>
              <span
                className={
                  claimed
                    ? 'badge badge--claimed'
                    : 'badge badge--unclaimed'
                }
              >
                {claimed ? 'Claimed' : 'Unclaimed'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

HeirList.propTypes = {
  heirs: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
      share: PropTypes.number,
      claimed: PropTypes.bool
    })
  ).isRequired
};
