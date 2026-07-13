import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { ChartContainer } from './components/ChartContainer';
import { ConfidenceIndex } from './components/ConfidenceIndex';
import { SeasonalSelector } from './components/SeasonalSelector';
import { Navbar } from './components/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ToolPage from './pages/ToolPage';
import ReportPage from './pages/ReportsPage';
import APIDocsPage from './pages/APIDocsPage';
import { AuditTrail } from './components/AuditTrail';
import { ComplianceDashboard } from './components/ComplianceDashboard';

interface WaterQualityInput {
  turbidity: number;
  iron: number;
  manganese: number;
  ph: number;
  ammonia: number;
  color: number;
  flow_rate?: number;
  season?: string;
}

interface ChemicalDosage {
  alum_dose: number;
  soda_ash_dose: number;
  chlorine_dose: number;
  disc_dose?: number;
  predicted_turbidity: number;
  predicted_iron: number;
  predicted_manganese: number;
  predicted_ammonia: number;
  predicted_ph: number;
  compliance_status: string;
  confidence_index: number;
}

// Formula definitions from Water Quality Model.pdf
const formulas = {
  alum: `Alum = 15 + 0.40 × Turbidity (clamped 10-150 mg/L)`,
  soda_ash: 'Soda Ash = 1.01 × (20 - Alkalinity Remaining)',
  chlorine: 'Cl₂ = Oxidation (0.64×Fe + 1.29×Mn) + Demand (7.6×NH3-N + 0.01×Turbidity) + Residual',
  thermolysis: 'Total Chlorine = Oxidation + Demand + Residual',
  hypochlorite: 'Calcium Hypochlorite = Total Cl / 0.70 (available chlorine)',
  reliability: 'Reliability based on input completeness and data quality checks'
};

const parseNum = (v: string): number => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

function Dashboard() {
  // Store raw strings so intermediate input like "0." is preserved while typing
  const [inputs, setInputs] = useState<Record<string, string>>({
    turbidity: '0',
    iron: '0',
    manganese: '0',
    ph: '7.0',
    ammonia: '0',
    color: '0',
    season: 'High Flow'
  });

  const [results, setResults] = useState<ChemicalDosage | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Keep the raw string so zeros and decimals (e.g. 0.5) work correctly
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSeasonChange = (season: string) => {
    setInputs(prev => ({ ...prev, season }));
  };

  const parsed: WaterQualityInput = {
    turbidity: parseNum(inputs.turbidity),
    iron: parseNum(inputs.iron),
    manganese: parseNum(inputs.manganese),
    ph: parseNum(inputs.ph),
    ammonia: parseNum(inputs.ammonia),
    color: parseNum(inputs.color),
    season: inputs.season
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      if (!response.ok) throw new Error('Calculation failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert('Error calculating dosages');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await fetch('/api/export-pdf');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'water_quality_report.pdf';
        a.click();
      }
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch('/api/export-excel');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'water_quality_report.xlsx';
        a.click();
      }
    } catch (err) {
      console.error('Excel export failed:', err);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Water Quality Treatment Software</h1>
        <p className="subtitle">Professional chemical dosing calculator for River Ndarugu water treatment</p>
        <p className="subtitle-description">
          Calculate alum, soda ash, and chlorine dosages based on WHO water quality standards.
          Input water parameters and get real-time treatment recommendations with compliance checking.
        </p>
      </header>

      <main className="container">
        <form onSubmit={handleSubmit} className="water-form">
          <div className="form-section">
            <h2>Water Quality Parameters</h2>
            <p className="section-help">Enter turbidity, iron, manganese, pH, ammonia, and color values (all values are required for accurate dosing)</p>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="turbidity">Turbidity (NTU)</label>
                <input
                  type="number"
                  id="turbidity"
                  name="turbidity"
                  value={inputs.turbidity}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  placeholder="e.g., 85.2"
                />
                {parseNum(inputs.turbidity) === 0 && <span className="input-note">(water clarity baseline)</span>}
              </div>
              <div className="form-group">
                <label htmlFor="iron">Iron (mg/L)</label>
                <input
                  type="number"
                  id="iron"
                  name="iron"
                  value={inputs.iron}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  placeholder="e.g., 0.15"
                />
              </div>
              <div className="form-group">
                <label htmlFor="manganese">Manganese (mg/L)</label>
                <input
                  type="number"
                  id="manganese"
                  name="manganese"
                  value={inputs.manganese}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  placeholder="e.g., 0.08"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ph">pH</label>
                <input
                  type="number"
                  id="ph"
                  name="ph"
                  value={inputs.ph}
                  onChange={handleChange}
                  min="0"
                  max="14"
                  step="any"
                  placeholder="e.g., 6.8"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ammonia">Ammonia-N (mg/L)</label>
                <input
                  type="number"
                  id="ammonia"
                  name="ammonia"
                  value={inputs.ammonia}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  placeholder="e.g., 0.5"
                />
              </div>
              <div className="form-group">
                <label htmlFor="color">Color (APHA)</label>
                <input
                  type="number"
                  id="color"
                  name="color"
                  value={inputs.color}
                  onChange={handleChange}
                  min="0"
                  step="any"
                  placeholder="e.g., 5.2"
                />
              </div>
              <div className="form-group seasonal-group">
                <label htmlFor="season">Seasonal Mode</label>
                <SeasonalSelector value={inputs.season} onChange={handleSeasonChange} />
              </div>
            </div>

            {/* Formula Display */}
            <div className="form-section formula-section">
              <h2>Formula Details</h2>
              {Object.entries(formulas).map(([key, formula]) => (
                <div key={key} className="formula-item">
                  <strong>{key.toUpperCase()}:</strong> {formula} <span className="formula-source">(Source: Water Quality Model.pdf)</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Dosages'}
          </button>
        </form>

        {/* Results Section */}
        {results && (
          <div className="results-section">
            <div className="export-buttons">
              <button onClick={handleExportPDF}>Export PDF</button>
              <button onClick={handleExportExcel}>Export Excel</button>
            </div>

            <div className="dosage-summary">
              <div className="summary-title">💧 Calculated Dosage Summary</div>
              <div className="dosage-stat">
                <div className="stat-label">Alum</div>
                <div className="stat-value">{results.alum_dose.toFixed(2)} <span className="stat-unit">mg/L</span></div>
              </div>
              <div className="dosage-stat">
                <div className="stat-label">Soda Ash</div>
                <div className="stat-value">{results.soda_ash_dose.toFixed(2)} <span className="stat-unit">mg/L</span></div>
              </div>
              <div className="dosage-stat">
                <div className="stat-label">Chlorine</div>
                <div className="stat-value">{results.chlorine_dose.toFixed(2)} <span className="stat-unit">mg/L</span></div>
              </div>
              <div className="dosage-stat">
                <div className="stat-label">Compliance</div>
                <div
                  className="stat-value"
                  style={{ color: results.compliance_status === 'PASS' ? 'var(--success)' : 'var(--danger)' }}
                >
                  {results.compliance_status}
                </div>
              </div>
            </div>

            <ChartContainer data={results} />
            <ComplianceDashboard
              complianceStatus={results.compliance_status}
              predictedValues={{
                turbidity: results.predicted_turbidity,
                iron: results.predicted_iron,
                manganese: results.predicted_manganese,
                ammonia: results.predicted_ammonia,
                ph: results.predicted_ph
              }}
            />
            <ConfidenceIndex
              score={results.confidence_index || 0}
              factors={[
                `Inputs: ${results.confidence_index.toFixed(1)}% complete`,
                `Data quality: ${results.confidence_index >= 90 ? 'High' : 'Moderate'}`,
                `Historical accuracy: ${results.confidence_index >= 70 ? 'Validated' : 'Preliminary'}`
              ]}
            />
            <AuditTrail formData={parsed} results={results} />
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/tools" element={<ToolPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/docs" element={<APIDocsPage />} />
        <Route path="*" element={<div className="page"><h1>404 - Page Not Found</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;