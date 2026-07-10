import React from 'react';

export default function APIDocsPage() {
  return (
    <div className="api-docs-page">
      <header>
        <h1>API Documentation</h1>
        <p>Developer guides and integration examples</p>
      </header>

      <section>
        <h2>Endpoints</h2>
        <div className="endpoint">
          <h3>POST /api/calculate</h3>
          <p>Calculate chemical dosages based on water quality parameters.</p>
          <pre>{`{
  "turbidity": 85.2,
  "iron": 0.15,
  "manganese": 0.08,
  "ph": 6.8,
  "ammonia": 1.2,
  "color": 35.5
}`}</pre>
          <h4>Response:</h4>
          <pre>{`{
  "alum_dose": 49.08,
  "soda_ash_dose": 20.2,
  "chlorine_dose": 10.52,
  "predicted_turbidity": 4.26,
  "predicted_iron": 0.008,
  "predicted_manganese": 0.008,
  "predicted_ammonia": 0.24,
  "predicted_ph": 6.713,
  "compliance_status": "PASS",
  "confidence_index": 100.0
}`}</pre>
        </div>

        <div className="endpoint">
          <h3>GET /api/sample-data</h3>
          <p>Retrieve sample water quality scenarios for testing.</p>
          <h4>Response:</h4>
          <pre>{`{
  "samples": [
    {"scenario": "High Flow - Rainy", "turbidity": 85.2, ...},
    {"scenario": "High Flow - Storm", "turbidity": 150.5, ...}
  ]
}`}</pre>
        </div>

        <div className="endpoint">
          <h3>GET /api/export-pdf</h3>
          <p>Generate and download a PDF report with formula references.</p>
        </div>

        <div className="endpoint">
          <h3>GET /api/export-excel</h3>
          <p>Generate and download an Excel report with all data.</p>
        </div>
      </section>

      <section>
        <h2>Code Examples</h2>
        <h3>JavaScript (Fetch)</h3>
        <pre>{`
fetch('/api/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    turbidity: 85.2,
    iron: 0.15,
    manganese: 0.08,
    ph: 6.8,
    ammonia: 1.2,
    color: 35.5
  })
}).then(res => res.json()).then(data => console.log(data));
        `}</pre>

        <h3>Python (Requests)</h3>
        <pre>{`
import requests

response = requests.post('http://localhost:8000/api/calculate', json={
    'turbidity': 85.2,
    'iron': 0.15,
    'manganese': 0.08,
    'ph': 6.8,
    'ammonia': 1.2,
    'color': 35.5
})

print(response.json())
        `}</pre>
      </section>
    </div>
  );
}