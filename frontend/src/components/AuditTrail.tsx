import React, { useState, useEffect } from 'react';

interface AuditTrailProps {
  formData: {
    turbidity: number;
    iron: number;
    manganese: number;
    ph: number;
    ammonia: number;
    color: number;
    season: string;
  };
  results: {
    alum_dose: number;
    soda_ash_dose: number;
    chlorine_dose: number;
    predicted_turbidity: number;
    predicted_iron: number;
    predicted_manganese: number;
    predicted_ammonia: number;
    predicted_ph: number;
    compliance_status: string;
    confidence_index: number;
  } | null;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ formData, results }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!results) return null;

  // Calculate step-by-step audit trail
  const steps = [
    {
      step: 1,
      title: "Input Validation",
      details: [
        `Turbidity: ${formData.turbidity} NTU`,
        `Iron: ${formData.iron} mg/L`,
        `Manganese: ${formData.manganese} mg/L`,
        `pH: ${formData.ph}`,
        `Ammonia: ${formData.ammonia} mg/L`,
        `Color: ${formData.color} APHA`,
        `Seasonal Mode: ${formData.season}`
      ]
    },
    {
      step: 2,
      title: "Seasonal Classification",
      details: [
        `Season: ${formData.season}`,
        `Seasonal multipliers applied to base formulas`
      ]
    },
    {
      step: 3,
      title: "Alum Dose Calculation",
      formula: "Alum = 15 + 0.40 × Turbidity (clamped 10-150 mg/L)",
      calculation: `Alum = 15 + 0.40 × ${formData.turbidity} = ${(15 + 0.40 * formData.turbidity).toFixed(2)} mg/L`,
      result: `${results.alum_dose.toFixed(2)} mg/L`
    },
    {
      step: 4,
      title: "Soda Ash Dose Calculation",
      formula: "Soda Ash = 1.01 × (20 - Alkalinity Remaining)",
      calculation: `Alkalinity Consumed = 0.5 × ${results.alum_dose.toFixed(2)} = ${(0.5 * results.alum_dose).toFixed(2)} mg/L`,
      result: `${results.soda_ash_dose.toFixed(2)} mg/L`
    },
    {
      step: 5,
      title: "Chlorine Dose Calculation",
      formula: "Cl₂ = Oxidation (0.64×Fe + 1.29×Mn) + Demand (7.6×NH₃-N + 0.01×Turbidity) + Residual",
      calculation: [
        `Oxidation = 0.64×${formData.iron} + 1.29×${formData.manganese} = ${(0.64 * formData.iron + 1.29 * formData.manganese).toFixed(3)} mg/L`,
        `Demand = 7.6×${formData.ammonia} + 0.01×${formData.turbidity} = ${(7.6 * formData.ammonia + 0.01 * formData.turbidity).toFixed(3)} mg/L`,
        `Total Chlorine = Oxidation + Demand + Residual (0.5) = ${results.chlorine_dose.toFixed(2)} mg/L`
      ].join(" → "),
      result: `${results.chlorine_dose.toFixed(2)} mg/L`
    },
    {
      step: 6,
      title: "Predicted Water Quality",
      details: [
        `Turbidity: 95% removal → ${results.predicted_turbidity.toFixed(2)} NTU (WHO: <1.0 NTU)`,
        `Iron: 95% removal → ${results.predicted_iron.toFixed(3)} mg/L (WHO: <0.3 mg/L)`,
        `Manganese: 90% removal → ${results.predicted_manganese.toFixed(3)} mg/L (WHO: <0.1 mg/L)`,
        `Ammonia: 80% removal → ${results.predicted_ammonia.toFixed(2)} mg/L (WHO: <1.5 mg/L)`,
        `pH: ${results.predicted_ph.toFixed(2)} (WHO: 6.5-8.5)`
      ]
    },
    {
      step: 7,
      title: "Compliance Assessment",
      details: [
        `Overall Status: ${results.compliance_status}`,
        `Confidence Index: ${results.confidence_index.toFixed(1)}%`
      ]
    }
  ];

  const handleCopy = () => {
    const text = steps.map(s =>
      `${s.step}. ${s.title}\n${s.details ? s.details.join('\n') : ''}${s.formula ? '\nFormula: ' + s.formula : ''}${s.calculation ? '\nCalculation: ' + s.calculation : ''}${s.result ? '\nResult: ' + s.result : ''}`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    alert('Audit trail copied to clipboard!');
  };

  return (
    <div className="audit-trail">
      <button
        className="audit-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '▼' : '▶'} Audit Trail & Calculation Steps
      </button>

      {isOpen && (
        <div className="audit-content">
          <div className="audit-header">
            <h4>Calculation Audit Trail</h4>
            <button onClick={handleCopy} className="copy-btn">
              Copy to Clipboard
            </button>
          </div>
          <div className="audit-steps">
            {steps.map((step) => (
              <div key={step.step} className="audit-step">
                <div className="step-number">{step.step}</div>
                <div className="step-content">
                  <h5>{step.title}</h5>
                  {step.formula && <p className="step-formula">Formula: {step.formula}</p>}
                  {step.calculation && <p className="step-calculation">Calculation: {step.calculation}</p>}
                  {step.result && <p className="step-result">Result: {step.result}</p>}
                  {step.details && (
                    <ul>
                      {step.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};