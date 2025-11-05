import React from 'react';
import useStore from '../store/useStore';
import { TRUCK_TYPES } from '../config/truckTypes';
import './Toolbar.css';

const Toolbar = () => {
  const selectedTruckType = useStore(state => state.selectedTruckType);
  const setSelectedTruckType = useStore(state => state.setSelectedTruckType);
  const colorMode = useStore(state => state.colorMode);
  const toggleColorMode = useStore(state => state.toggleColorMode);
  const clearAllPackages = useStore(state => state.clearAllPackages);
  const saveConfiguration = useStore(state => state.saveConfiguration);
  const loadConfiguration = useStore(state => state.loadConfiguration);

  const handleLoadConfig = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target.result);
        loadConfiguration(config);
      } catch (error) {
        alert('Error loading configuration. Please ensure it is a valid truck configuration file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <label>Truck Type:</label>
        <select
          value={selectedTruckType}
          onChange={(e) => setSelectedTruckType(e.target.value)}
        >
          {Object.values(TRUCK_TYPES).map(truck => (
            <option key={truck.id} value={truck.id}>
              {truck.name}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbar-section">
        <button onClick={toggleColorMode} className="color-toggle">
          Color by: {colorMode === 'order' ? 'Order Number' : 'Weight'}
        </button>
      </div>

      <div className="toolbar-section">
        <button onClick={saveConfiguration} className="save-btn">
          💾 Save Config
        </button>
        <label className="load-btn">
          📂 Load Config
          <input
            type="file"
            accept=".json"
            onChange={handleLoadConfig}
            style={{ display: 'none' }}
          />
        </label>
        <button onClick={clearAllPackages} className="clear-btn">
          🗑️ Clear All
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
