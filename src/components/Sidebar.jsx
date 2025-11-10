import React, { useState } from 'react';
import useStore from '../store/useStore';
import { getTruckById } from '../config/truckTypes';
import './Sidebar.css';

const Sidebar = () => {
  const availablePackages = useStore(state => state.availablePackages);
  const addPackage = useStore(state => state.addPackage);
  const addAvailablePackage = useStore(state => state.addAvailablePackage);
  const removeAvailablePackage = useStore(state => state.removeAvailablePackage);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    orderNumber: '',
    weight: '',
    length: '',
    width: '',
    height: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToAvailable = (e) => {
    e.preventDefault();
    const newPackage = {
      productName: formData.productName,
      orderNumber: formData.orderNumber,
      weight: parseFloat(formData.weight),
      dimensions: {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height)
      }
    };

    addAvailablePackage(newPackage);
    setFormData({
      productName: '',
      orderNumber: '',
      weight: '',
      length: '',
      width: '',
      height: ''
    });
    setShowAddForm(false);
  };

  const handleLoadToTruck = (pkg) => {
    // Get current truck dimensions
    const selectedTruckType = useStore.getState().selectedTruckType;
    const truck = getTruckById(selectedTruckType);
    const { length: truckLength, width: truckWidth } = truck.dimensions;

    const packages = useStore.getState().packages;
    const spacing = 0.5; // 0.5 foot spacing between packages

    // Calculate safe starting position (back of truck with padding)
    // Truck X range is [0, length], Z range is [-width/2, +width/2]
    const startX = pkg.dimensions.length / 2 + 0.5;

    let xPosition = startX;
    let zPosition = 0;

    if (packages.length > 0) {
      // Calculate how many packages fit per row
      const maxPackageWidth = Math.max(...packages.map(p => p.dimensions.width), pkg.dimensions.width);
      const packagesPerRow = Math.max(1, Math.floor((truckWidth - 1) / (maxPackageWidth + spacing)));

      const index = packages.length;
      const row = Math.floor(index / packagesPerRow);
      const col = index % packagesPerRow;

      // Place in rows along the length of the truck
      xPosition = startX + (row * (pkg.dimensions.length + spacing));

      // Distribute across the width
      const colOffset = (col - (packagesPerRow - 1) / 2) * (maxPackageWidth + spacing);
      zPosition = colOffset;
    }

    // Clamp to truck bounds with safety margin
    const halfLength = pkg.dimensions.length / 2;
    const halfWidth = pkg.dimensions.width / 2;

    xPosition = Math.max(halfLength + 0.1, Math.min(xPosition, truckLength - halfLength - 0.1));
    zPosition = Math.max(-truckWidth/2 + halfWidth + 0.1, Math.min(zPosition, truckWidth/2 - halfWidth - 0.1));

    addPackage({
      ...pkg,
      position: [xPosition, pkg.dimensions.height / 2, zPosition]
    });
    removeAvailablePackage(pkg.id);
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const packages = Array.isArray(data) ? data : [data];

        packages.forEach(pkg => {
          addAvailablePackage({
            productName: pkg.productName || pkg.product || 'Unknown',
            orderNumber: pkg.orderNumber || pkg.order || 'N/A',
            weight: parseFloat(pkg.weight) || 0,
            dimensions: {
              length: parseFloat(pkg.length || pkg.dimensions?.length) || 1,
              width: parseFloat(pkg.width || pkg.dimensions?.width) || 1,
              height: parseFloat(pkg.height || pkg.dimensions?.height) || 1
            }
          });
        });
      } catch (error) {
        alert('Error parsing file. Please ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="sidebar">
      <h2>Available Packages</h2>

      <div className="sidebar-actions">
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Package'}
        </button>
        <label className="import-button">
          Import JSON
          <input
            type="file"
            accept=".json"
            onChange={handleImportFile}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {showAddForm && (
        <form className="add-package-form" onSubmit={handleAddToAvailable}>
          <input
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleInputChange}
            required
          />
          <input
            name="orderNumber"
            placeholder="Order Number"
            value={formData.orderNumber}
            onChange={handleInputChange}
            required
          />
          <input
            name="weight"
            type="number"
            step="0.1"
            placeholder="Weight (lbs)"
            value={formData.weight}
            onChange={handleInputChange}
            required
          />
          <div className="dimension-inputs">
            <input
              name="length"
              type="number"
              step="0.1"
              placeholder="L (ft)"
              value={formData.length}
              onChange={handleInputChange}
              required
            />
            <input
              name="width"
              type="number"
              step="0.1"
              placeholder="W (ft)"
              value={formData.width}
              onChange={handleInputChange}
              required
            />
            <input
              name="height"
              type="number"
              step="0.1"
              placeholder="H (ft)"
              value={formData.height}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Add to List</button>
        </form>
      )}

      <div className="package-list">
        {availablePackages.length === 0 ? (
          <p className="empty-message">No packages available. Add or import packages.</p>
        ) : (
          availablePackages.map(pkg => (
            <div key={pkg.id} className="package-item">
              <div className="package-info">
                <strong>{pkg.productName}</strong>
                <span>Order: {pkg.orderNumber}</span>
                <span>{pkg.weight} lbs</span>
                <span>
                  {pkg.dimensions.length}×{pkg.dimensions.width}×{pkg.dimensions.height} ft
                </span>
              </div>
              <button onClick={() => handleLoadToTruck(pkg)}>
                Load →
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
