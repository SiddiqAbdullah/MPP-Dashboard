import React from 'react';
import { Download, SlidersHorizontal } from 'lucide-react';
import Papa from 'papaparse';

const ActionPanel = ({ sensitivity, setSensitivity, data }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            <SlidersHorizontal size={12} style={{ marginRight: '4px' }} />
            Cost Sensitivity
          </label>
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: 700, 
            color: sensitivity > 0 ? '#f97316' : '#ffffff' 
          }}>
            +{sensitivity}%
          </span>
        </div>
        <input 
          type="range" 
          className={`sensitivity-slider ${sensitivity > 0 ? 'active' : ''}`}
          min="0" 
          max="30" 
          value={sensitivity} 
          onChange={(e) => setSensitivity(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ActionPanel;
