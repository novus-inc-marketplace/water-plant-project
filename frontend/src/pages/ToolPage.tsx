import React from 'react';

export default function ToolPage() {
  return (
    <div className="tool-page">
      <header>
        <h1>Tools & Formulas</h1>
        <p>Integration with Water Quality Model.pdf and technical components</p>
      </header>

      <section>
        <h2>Primary Tools</h2>
        <div className="tool-grid">
          <div className="tool-card">
            <h3>🧪 Chemical Dosage Calculator</h3>
            <p>Implements formulas from Water Quality Model.pdf to compute alum, soda ash, and chlorine dosages.</p>
          </div>
          <div className="tool-card">
            <h3>🌊 Seasonal Classifier</h3>
            <p>Matches raw inputs to High Flow / Low Flow seasonal variations for accurate scaling.</p>
          </div>
          <div className="tool-card">
            <h3>✅ Compliance Engine</h3>
            <p>Validates predicted values against WHO and local drinking-water standards.</p>
          </div>
          <div className="tool-card">
            <h3>📄 PDF Report Generator</h3>
            <p>Creates exportable documentation with full formula references.</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Mathematical Foundations</h2>
        <h3>Core Formulas</h3>
        <div className="formula-box">
          <span className="formula-title">Alum Dose (p.25)</span>
          Alum = 15 + 0.40 × Turbidity
        </div>
        <div className="formula-box">
          <span className="formula-title">Chlorine Dose (p.30)</span>
          Cl₂ = Oxidation (0.64×Fe + 1.29×Mn) + Demand + Residual
        </div>
        <div className="formula-box">
          <span className="formula-title">Seasonal Adjustment</span>
          Values scaled by flow rate conditions
        </div>
      </section>

      <section>
        <h2>Validation References</h2>
        <div className="tool-grid">
          <div className="tool-card">
            <h3>📘 PDF Source</h3>
            <p>Formulas verified against <em>Water Quality Model.pdf, p.25–p.32</em>.</p>
          </div>
          <div className="tool-card">
            <h3>🧬 Sample Data</h3>
            <p>Tested with real River Ndarugu conditions across seasons.</p>
          </div>
        </div>
      </section>
    </div>
  );
}