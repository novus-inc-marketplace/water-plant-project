import React from 'react';

export default function ToolPage() {
  return (
    <div className="tool-page">
      <header>
        <h1>Key Tools & References</h1>
        <p>Integration with Water Quality Model.pdf and technical components</p>
      </header>
      <section>
        <h2>Primary Tools</h2>
        <ul>
          <li><strong>Chemical Dosage Calculator</strong>: Implements formulas from Water Quality Model.pdf</li>
          <li><strong>Seasonal Classifier</strong>: Matches inputs to seasonal variations</li>
          <li><strong>Compliance Engine</strong>: Validates against WHO/local drinking water standards</li>
          <li><strong>PDF Report Generator</strong>: Creates exportable documentation</li>
        </ul>
      </section>
      <section>
        <h2>Mathematical Foundations</h2>
        <h3>Core Formulas</h3>
        <ul>
          <li><strong>Alum Dose (p.25):</strong> `Alum = 15 + 0.40 × Turbidity`</li>
          <li><strong>Chlorine Dose (p.30):</strong> `Cl₂ = Oxidation (0.64×Fe + 1.29×Mn) + Demand + Residual`</li>
          <li><strong>Seasonal Adjustment:</strong> Values scaled by flow rate conditions</li>
        </ul>
      </section>
      <section>
        <h2>Validation References</h2>
        <ul>
          <li><strong>PDF Source:</strong> Formulas verified against <em>Water Quality Model.pdf, p.25-p.32</em></li>
          <li><strong>Sample Data:</strong> Tested with real River Ndarugu conditions</li>
        </ul>
      </section>
    </div>
  );
}