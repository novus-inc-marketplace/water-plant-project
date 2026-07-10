CONTINUE WATER QUALITY TREATMENT SOFTWARE MVP — BUILD COMPLETE WEB APP

Goal: Build a complete, functional web application (MVP) that covers ALL planned features from comprehensive_plan.md. Keep it simple but complete - a working web app with backend + frontend.

PREFERENCE: Web app direction (not CLI-only). Single-page application with FastAPI backend.

EXECUTE ALL IN ORDER:

## 1. FRONTEND - Single Page Application (frontend/)
Create `frontend/index.html` with:
- Clean, responsive HTML5 layout (mobile-friendly)
- Input form for all water quality parameters:
  - Turbidity (NTU), Iron (mg/L), Manganese (mg/L)
  - pH, Ammonia-N (mg/L), Color (TCU)
  - Optional: Flow rate (MGD)
- Season selector (Auto-detect / High Flow / Low Flow)
- Real-time dosage preview (updates as user types - debounced)
- Results display: All chemical dosages + predicted quality + compliance PASS/FAIL
- Confidence index indicator (visual: High/Moderate/Low/Preliminary)
- Export buttons: Download PDF, Download Excel
- Loading states, error handling, validation feedback
- Clean CSS (embedded or separate file) - professional water treatment theme

## 2. FASTAPI BACKEND ENHANCEMENTS (src/main.py)
- Serve static files from `frontend/` directory
- Add CORS middleware for local development
- Add `/` route serving `frontend/index.html`
- Add `/api/health` endpoint
- Ensure all existing endpoints work with frontend

## 3. SAMPLE DATA (data/)
Create `data/sample_river_ndarugu.csv` with realistic test cases:
- 5 High Flow scenarios (rainy season - high turbidity, color)
- 5 Low Flow scenarios (dry season - lower turbidity, higher Mn)
- 2 Edge cases (extreme values for validation testing)
Columns: turbidity, iron, manganese, ph, ammonia, color, season, notes

## 4. STARTUP SCRIPT
Create `run.py` or `start.sh` that:
- Installs dependencies (pip install -r requirements.txt)
- Starts uvicorn with reload for development
- Prints access URLs (http://localhost:8000)

## 5. QUICK VALIDATION TEST
Create `test_mvp.py` that:
- Tests all dosage formulas against known values
- Verifies compliance engine PASS/FAIL logic
- Confirms PDF/Excel generation works
- Prints "MVP READY" on success

## KEY FEATURES FROM COMPREHENSIVE_PLAN.MD TO IMPLEMENT:
✅ Alum = 15 + 0.40*Turbidity (10-150 mg/L clamp)
✅ Soda Ash based on alkalinity remaining
✅ Chlorine: Oxidation (0.64*Fe + 1.29*Mn) + Demand + Residual
✅ Calcium Hypochlorite = Total_Cl / 0.70
✅ Seasonal classification (Auto: turbidity/color/Mn/ammonia)
✅ Compliance: Iron<0.3, Mn<0.1, Turbidity<1.0(preferred), pH 6.5-8.5
✅ Confidence Index: 90-100=High, 70-89=Moderate, 50-69=Low, <50=Preliminary
✅ PDF Report (tables: raw water, dosages, predicted quality, compliance)
✅ Excel Report (same data, multi-sheet)
✅ Performance: <2 seconds for full calculation

## TECH STACK (already in requirements.txt):
- Backend: FastAPI + uvicorn
- Frontend: Vanilla HTML/CSS/JS (no framework - keeps it simple)
- Reports: Jinja2 + WeasyPrint (PDF), pandas + xlsxwriter (Excel)
- Data: pandas for CSV handling

DELIVERABLE: A single command (`python run.py`) that starts the complete web app accessible at http://localhost:8000 with all features working.