import React from 'react';

interface ConfidenceIndexProps {
  score: number;
  factors?: string[];
}

export const ConfidenceIndex: React.FC<ConfidenceIndexProps> = ({ score, factors = [] }) => {
  const getColor = (score: number) => {
    if (score >= 90) return '#27ae60';
    if (score >= 70) return '#f39c12';
    if (score >= 50) return '#e67e22';
    return '#c0392b';
  };

  const getLabel = (score: number) => {
    if (score >= 90) return 'High';
    if (score >= 70) return 'Moderate';
    if (score >= 50) return 'Low';
    return 'Preliminary';
  };

  const color = getColor(score);
  const label = getLabel(score);

  return (
    <div className="confidence-index">
      <h3>Model Confidence Index</h3>
      <div className="confidence-bar-container">
        <div
          className="confidence-bar"
          style={{
            width: `${Math.min(score, 100)}%`,
            backgroundColor: color,
          }}
        />
        <span className="confidence-value" style={{ color }}>
          {score.toFixed(1)}% - {label}
        </span>
      </div>

      {factors.length > 0 && (
        <div className="confidence-factors">
          <h4>Contributing Factors:</h4>
          <ul>
            {factors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="confidence-legend">
        <span className="legend-item high">High: ≥90%</span>
        <span className="legend-item moderate">Moderate: 70-89%</span>
        <span className="legend-item low">Low: 50-69%</span>
        <span className="legend-item preliminary">Preliminary: {'<50%'}</span>
      </div>
    </div>
  );
};