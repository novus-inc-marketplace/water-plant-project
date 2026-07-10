import React, { useState } from 'react';

interface ComplianceDashboardProps {
  complianceStatus: string;
  predictedValues: {
    turbidity: number;
    iron: number;
    manganese: number;
    ammonia: number;
    ph: number;
  };
}

const WHO_LIMITS = {
  turbidity: 1.0,
  iron: 0.3,
  manganese: 0.1,
  ammonia: 1.5,
  ph: { min: 6.5, max: 8.5 }
};

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ complianceStatus, predictedValues }) => {
  const [isOpen, setIsOpen] = useState(false);

  const violations = [];
  if (predictedValues.turbidity > WHO_LIMITS.turbidity) violations.push('Turbidity exceeds WHO limit (< 1.0 NTU)');
  if (predictedValues.iron > WHO_LIMITS.iron) violations.push('Iron exceeds WHO limit (< 0.3 mg/L)');
  if (predictedValues.manganese > WHO_LIMITS.manganese) violations.push('Manganese exceeds WHO limit (< 0.1 mg/L)');
  if (predictedValues.ammonia > WHO_LIMITS.ammonia) violations.push('Ammonia exceeds WHO limit (< 1.5 mg/L)');
  if (predictedValues.ph < WHO_LIMITS.ph.min || predictedValues.ph > WHO_LIMITS.ph.max) violations.push('pH outside WHO range (6.5-8.5)');

  return (
    <div className="compliance-dashboard">
      <button
        className={`compliance-toggle ${complianceStatus.toLowerCase()}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {complianceStatus === 'PASS' ? '✓ Compliance Passed' : '✗ Non-Compliant'} ({violations.length} violations)
      </button>

      {isOpen && (
        <div className="compliance-details">
          <h4>Estimated Violations:</h4>
          <ul>
            {violations.length > 0 ? (
              violations.map((v, i) => <li key={i}>⚠ {v}</li>)
            ) : (
              <li>No violations detected</li>
            )}
          </ul>
          <h4>Suggested Adjustments:</h4>
          <ul>
            <li>{predictedValues.turbidity > WHO_LIMITS.turbidity ? 'Consider increasing alum dose' : ''}</li>
            <li>{predictedValues.iron > WHO_LIMITS.iron ? 'Check for iron removal inefficiency' : ''}</li>
            <li>{predictedValues.manganese > WHO_LIMITS.manganese ? 'Review manganese oxidation chemistry' : ''}</li>
            <li>{predictedValues.ph < WHO_LIMITS.ph.min ? 'Add soda ash to increase pH' : predictedValues.ph > WHO_LIMITS.ph.max ? 'Reduce alkalinity' : ''}</li>
          </ul>
        </div>
      )}
    </div>
  );
};