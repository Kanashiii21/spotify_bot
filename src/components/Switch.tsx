import React from 'react';

import '../styles/Switch.css';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  return (
    <label className="switch">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
      />
      <span className="slider"></span>
      {label && <span className="switch-label">{label}</span>}
    </label>
  );
};