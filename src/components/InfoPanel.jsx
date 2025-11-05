import React from 'react';
import useStore from '../store/useStore';
import './InfoPanel.css';

const InfoPanel = () => {
  const packages = useStore(state => state.packages);
  const selectedPackageId = useStore(state => state.selectedPackageId);
  const removePackage = useStore(state => state.removePackage);
  const updatePackage = useStore(state => state.updatePackage);

  const selectedPackage = packages.find(pkg => pkg.id === selectedPackageId);

  if (!selectedPackage) {
    return (
      <div className="info-panel">
        <p className="no-selection">Select a package to view details</p>
      </div>
    );
  }

  const handleRotate = (axis) => {
    const currentRotation = selectedPackage.rotation || [0, 0, 0];
    const newRotation = [...currentRotation];

    if (axis === 'y') {
      newRotation[1] = (newRotation[1] + Math.PI / 2) % (Math.PI * 2);
    }

    updatePackage(selectedPackageId, { rotation: newRotation });
  };

  const handleRemove = () => {
    removePackage(selectedPackageId);
  };

  return (
    <div className="info-panel">
      <h3>Package Details</h3>

      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Product:</span>
          <span className="info-value">{selectedPackage.productName}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Order Number:</span>
          <span className="info-value">{selectedPackage.orderNumber}</span>
        </div>

        <div className="info-item">
          <span className="info-label">Weight:</span>
          <span className="info-value">{selectedPackage.weight} lbs</span>
        </div>

        <div className="info-item">
          <span className="info-label">Dimensions:</span>
          <span className="info-value">
            {selectedPackage.dimensions.length} × {selectedPackage.dimensions.width} × {selectedPackage.dimensions.height} ft
          </span>
        </div>

        <div className="info-item">
          <span className="info-label">Position:</span>
          <span className="info-value">
            X: {selectedPackage.position[0].toFixed(2)}<br />
            Y: {selectedPackage.position[1].toFixed(2)}<br />
            Z: {selectedPackage.position[2].toFixed(2)}
          </span>
        </div>
      </div>

      <div className="info-actions">
        <button onClick={() => handleRotate('y')} className="rotate-btn">
          ↻ Rotate 90°
        </button>
        <button onClick={handleRemove} className="remove-btn">
          Remove
        </button>
      </div>
    </div>
  );
};

export default InfoPanel;
