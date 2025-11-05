import React from 'react';
import useStore from '../store/useStore';
import './Statistics.css';

const Statistics = () => {
  const getStatistics = useStore(state => state.getStatistics);
  const stats = getStatistics();

  return (
    <div className="statistics">
      <h3>Statistics</h3>

      <div className="stat-grid">
        <div className="stat-item">
          <span className="stat-label">Packages:</span>
          <span className="stat-value">{stats.packageCount}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Total Weight:</span>
          <span className={`stat-value ${stats.isOverweight ? 'warning' : ''}`}>
            {stats.totalWeight.toFixed(1)} lbs
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Max Weight:</span>
          <span className="stat-value">{stats.maxWeight.toFixed(0)} lbs</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Weight Utilization:</span>
          <span className={`stat-value ${stats.isOverweight ? 'warning' : ''}`}>
            {stats.weightUtilization.toFixed(1)}%
          </span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Space Utilization:</span>
          <span className="stat-value">{stats.spaceUtilization.toFixed(1)}%</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Center of Gravity:</span>
          <span className="stat-value stat-small">
            X: {stats.centerOfGravity.x.toFixed(2)}
            <br />
            Y: {stats.centerOfGravity.y.toFixed(2)}
            <br />
            Z: {stats.centerOfGravity.z.toFixed(2)}
          </span>
        </div>
      </div>

      {stats.isOverweight && (
        <div className="warning-banner">
          ⚠️ Weight limit exceeded!
        </div>
      )}

      <div className="weight-bar">
        <div
          className={`weight-fill ${stats.isOverweight ? 'overweight' : ''}`}
          style={{ width: `${Math.min(stats.weightUtilization, 100)}%` }}
        />
      </div>

      <div className="space-bar">
        <div
          className="space-fill"
          style={{ width: `${Math.min(stats.spaceUtilization, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default Statistics;
