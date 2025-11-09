import React from 'react';

const StatCard = ({ title, value, change, positive = true, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-title">
        <i className={icon}></i> {title}
      </div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${positive ? 'positive' : 'negative'}`}>
        <i className={`fas fa-arrow-${positive ? 'up' : 'down'}`}></i> {change}
      </div>
    </div>
  );
};

export default StatCard;