import React from 'react';

export default function AboutPage() {
  return (
    <div className="about-page">
      <header>
        <h1>About Water Quality Treatment Software</h1>
        <p>Professional chemical dosing calculator for River Ndarugu water treatment</p>
      </header>
      <section>
        <h2>Problem Statement</h2>
        <p>Water treatment facilities face challenges in determining accurate chemical dosages for varying water quality conditions...</p>
      </section>
      <section>
        <h2>Solution Overview</h2>
        <p>This software provides real-time calculation of alum, soda ash, and chlorine dosages based on WHO water quality standards...</p>
      </section>
      <section>
        <h2>Technical Architecture</h2>
        <ul>
          <li>Frontend: React (Vite) with TypeScript</li>
          <li>Backend: FastAPI for chemical dosage calculations</li>
          <li>Data Storage: In-memory processing with sample data</li>
          <li>Visualization: Recharts for interactive charts</li>
        </ul>
      </section>
    </div>
  );
}