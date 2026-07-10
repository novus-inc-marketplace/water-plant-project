import React from 'react';

export default function ReportsPage() {
  return (
    <div className="reports-page">
      <header>
        <h1>Report Gallery</h1>
        <p>Generated water quality reports and analysis results</p>
      </header>

      <div className="reports-grid">
        {/* Sample Report Cards */}
        <div className="report-card">
          <div className="report-header">
            <div>
              <h3>High Flow - Daily Report</h3>
              <span className="report-date">Jan 08, 2026</span>
            </div>
            <div className="report-actions">
              <button>View →</button>
              <button>Download PDF</button>
            </div>
          </div>
          <div className="report-content">
            <div className="report-stats">
              <span>Turbidity: 85.2 NTU</span>
              <span>Alum: 49.0 mg/L</span>
              <span>Compliance: ✓ PASS</span>
            </div>
          </div>
        </div>

        <div className="report-card">
          <div className="report-header">
            <div>
              <h3>Low Flow - Weekly Report</h3>
              <span className="report-date">Jan 01, 2026</span>
            </div>
            <div className="report-actions">
              <button>View →</button>
              <button>Download Excel</button>
            </div>
          </div>
          <div className="report-content">
            <div className="report-stats">
              <span>Turbidity: 12.8 NTU</span>
              <span>Alum: 24.0 mg/L</span>
              <span>Compliance: ✓ PASS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}