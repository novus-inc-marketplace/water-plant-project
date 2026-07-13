import React from 'react';

export default function AboutPage() {
  return (
    <div className="about-page">
      <header>
        <h1>About Water Quality Treatment Software</h1>
        <p>Professional chemical dosing calculator for River Ndarugu water treatment</p>
      </header>

      <section className="about-card">
        <h2>Problem Statement</h2>
        <p>Water treatment facilities face challenges in determining accurate chemical dosages for varying water quality conditions. Manual calculations are slow, error-prone, and difficult to audit against drinking-water standards.</p>
      </section>

      <section className="about-card">
        <h2>Solution Overview</h2>
        <p>This software provides real-time calculation of alum, soda ash, and chlorine dosages based on WHO water quality standards, with transparent, step-by-step audit trails for every result.</p>
      </section>

      <section className="about-card">
        <h2>Technical Architecture</h2>
        <ul>
          <li><strong>Frontend:</strong> React (Vite) with TypeScript</li>
          <li><strong>Backend:</strong> FastAPI for chemical dosage calculations</li>
          <li><strong>Data Storage:</strong> In-memory processing with sample data</li>
          <li><strong>Visualization:</strong> Recharts for interactive charts</li>
        </ul>
      </section>
    </div>
  );
}