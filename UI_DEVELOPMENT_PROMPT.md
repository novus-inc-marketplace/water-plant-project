PROMPT: Complex Data Representation UI Development for Water Quality Treatment Software

OBJECTIVE:
Build a complex yet intuitive UI for the Water Quality Treatment Software MVP that prioritizes precise, clear, and subtle data visualization while ensuring 100% functionality of all chemical dosage formulas and compliance logic from the Water Quality Model.pdf. The UI must support advanced data interactions without sacrificing simplicity in design.

KEY REQUIREMENTS:

1. Complex Data Presentation (Simple Style):
   - Display real-time chemical dosage calculations alongside predicted water quality metrics (turbidity, iron, manganese, pH, ammonia).
   - Use clean, minimalist styles (pastel tones, soft shadows, rounded components) to reduce visual clutter while making data easy to parse.
   - Include conditional formatting:
     - Green/red highlights for compliance status.
     - Subtle progress bars for confidence index (0-100%).
     - Tooltips for explaining complex terms (e.g., "Alum Dose: 15 + 0.40xTurbidity").

2. Formula Accuracy & Trustworthiness:
   - Implement all formulas exactly as in the source PDF, with no deviations.
   - Include dynamic displays of formula logic (e.g., a toggle to show/hide calculation steps).
   - Add traceability badges (e.g., "Formula Source: p.25 of Water Quality Model.pdf").

3. Advanced UI Interactions:
   - Real-time recalculations: Update all fields instantly as users input data.
   - Seasonal filter: Dropdown to switch between "High Flow" and "Low Flow" with instant dose adjustments.
   - Interactive compliance dashboard: Drill down into violation details with expandable sections.
   - Confidence index breakdown: Show factors contributing to confidence score (e.g., "90%: all inputs provided, no extremes").

4. Reliability & Validation:
   - Input validation: Restrict entries to realistic ranges (e.g., turbidity <=200 NTU).
   - Fallback mode: Display default values if inputs are missing.
   - Audit trail: Log all calculations for compliance reporting.

5. Export Enablement:
   - PDF/Excel exports: Preserve formulas and calculations, not just raw numbers.
   - Print-friendly layout: Auto-generate table headers and footers per compliance standards.

DELIVERABLES:
- A fully functional web app (React frontend + FastAPI backend) where all formulas from the PDF are programmatically encoded.
- Subtle but informative visual hierarchy: Prioritize critical data (e.g., compliance status) at a glance.
- Error resilience: Handle edge cases (e.g., extreme toxicity levels) with clear warnings.

DESIGN GUIDELINES:
- Color Palette:
  - Primary: Navy blue (#2c3e50), soft green (#27ae60).
  - Secondary: Light gray (#ecf0f1) for backgrounds.
- Typography: Sans-serif fonts (e.g., Arial, Lato) for clarity.
- Micro-interactions: Subtle animations (e.g., confidence bar filling) to guide user attention.

EXAMPLE USER FLOW:
1. User inputs turbidity = 85 NTU -> instantly see alum dose (15 + 0.40x85 = 49 mg/L).
2. Toggle "High Flow" season -> dosage recalculates with seasonal multipliers.
3. Click compliance status -> expand to see dissolved iron violation and suggested chlorine increase.
4. Export PDF -> see condensed formula references in the report footer.

VALIDATION CHECKS:
- Test with all 5 High Flow + 5 Low Flow scenarios from sample_river_ndarugu.csv.
- Verify PDF exports match formulas in Water Quality Model.pdf.
- Ensure confidence index logic aligns with confidence_index_calculator in dosage_calculator.py.

TOOLS TO USE:
- Frontend: React (Vite) with TypeScript for type safety.
- Backend: FastAPI to serve JS API calls for calculations.
- Data: Pandas for parsing CSV sample data.
- Styling: CSS Modules or Tailwind CSS for clean, maintainable styles.

NEXT STEPS:
1. Extract all formulas from Water Quality Model.pdf and validate against dosage_calculator.py.
2. Build prototype UI components (e.g., compliance dashboard mockup).
3. Integrate formulas into real-time frontend logic.
4. Set up React + Vite + TypeScript project structure.
5. Create reusable components for data tables, confidence indicators, formula displays.
6. Connect React frontend to FastAPI backend via API calls.