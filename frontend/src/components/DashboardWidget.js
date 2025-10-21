// src/components/DashboardWidget.js

import React from 'react';
import PropTypes from 'prop-types';
import './DashboardWidget.css';

export default function DashboardWidget({ title, value, icon: Icon }) {
  return (
    <div className="dashboard-widget">
      <div className="widget-icon">
        <Icon />
      </div>
      <div className="widget-content">
        <div className="widget-value">{value}</div>
        <div className="widget-title">{title}</div>
      </div>
    </div>
  );
}

DashboardWidget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
};
