import React from 'react';
import useStore from '../store/useStore';
import { getColorByWeight, getColorByOrder } from '../config/truckTypes';
import './LoadedPackages.css';

const LoadedPackages = () => {
  const packages = useStore(state => state.packages);
  const selectedPackageId = useStore(state => state.selectedPackageId);
  const setSelectedPackageId = useStore(state => state.setSelectedPackageId);
  const removePackage = useStore(state => state.removePackage);
  const colorMode = useStore(state => state.colorMode);

  if (packages.length === 0) {
    return (
      <div className="loaded-packages">
        <h3>Loaded Packages</h3>
        <p className="empty-message">No packages loaded yet.</p>
      </div>
    );
  }

  return (
    <div className="loaded-packages">
      <h3>Loaded Packages ({packages.length})</h3>
      <div className="loaded-list">
        {packages.map((pkg) => {
          const color = colorMode === 'weight'
            ? getColorByWeight(pkg.weight)
            : getColorByOrder(pkg.orderNumber);

          const isSelected = selectedPackageId === pkg.id;

          return (
            <div
              key={pkg.id}
              className={`loaded-item ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedPackageId(pkg.id)}
            >
              <div
                className="color-indicator"
                style={{ backgroundColor: color }}
              />
              <div className="loaded-info">
                <strong>{pkg.productName}</strong>
                <span className="loaded-meta">
                  Order: {pkg.orderNumber} | {pkg.weight} lbs
                </span>
              </div>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removePackage(pkg.id);
                }}
                title="Remove from truck"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadedPackages;
