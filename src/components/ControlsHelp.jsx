import React, { useState } from 'react';
import './ControlsHelp.css';

const ControlsHelp = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`controls-help ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button
        className="toggle-help"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '−' : '?'} Controls
      </button>
      {isExpanded && (
        <div className="controls-content">
          <div className="control-item">
            <strong>Left Click + Drag:</strong> Move package horizontally
          </div>
          <div className="control-item">
            <strong>Shift + Drag:</strong> Move package vertically (up/down)
          </div>
          <div className="control-item">
            <strong>Auto-Stacking:</strong> Drag package over another to stack
          </div>
          <div className="control-item">
            <strong>Right Click + Drag:</strong> Rotate camera
          </div>
          <div className="control-item">
            <strong>Scroll Wheel:</strong> Zoom in/out
          </div>
          <div className="control-item note">
            <em>Note: Heavier packages cannot be placed on lighter ones</em>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlsHelp;
