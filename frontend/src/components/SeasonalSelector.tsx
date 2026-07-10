import React from 'react';

interface SeasonalSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const SeasonalSelector: React.FC<SeasonalSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="seasonal-selector">
      <h3>Seasonal Mode</h3>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="High Flow">High Flow</option>
        <option value="Low Flow">Low Flow</option>
      </select>
    </div>
  );
};