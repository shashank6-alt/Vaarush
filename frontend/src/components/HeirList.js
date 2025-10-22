// src/components/HeirList.js

import React from 'react';
import PropTypes from 'prop-types';
import './HeirList.css';
import './ContractForm.css';
import { formatAddress, getRelativeTime } from '../utils/helpers';

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
          <th>Last Updated</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {heirs.map(({ address, share, timestamp, claimed }, idx) => (
          <tr key={idx}>
            <td className="heir-list__address">
              {formatAddress(address, 5)}  {/* Shortens to ABC...XYZ */}
            </td>
            <td className="heir-list__share">{share}%</td>
            <td>{getRelativeTime(timestamp)}</td>  {/* Shows "2 hours ago" */}
            <td>
              <span
                className={
                  claimed ? 'badge badge--claimed' : 'badge badge--unclaimed'
                }
              >
                {claimed ? 'Claimed' : 'Pending'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}