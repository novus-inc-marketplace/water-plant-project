# Water Quality Treatment Software

A professional water treatment chemical dosing calculator that predicts dosages and validates water quality against WHO standards. Built for River Ndarugu water treatment facilities.

## 🚀 Live Demo
http://localhost:8000 (backend) | http://localhost:5173 (frontend dev)

---

## 📋 Project Overview

This system calculates optimal chemical dosages for water treatment based on:
- **Alum** – Coagulant dose (15 + 0.40 × Turbidity)
- **Soda Ash** – Alkalinity adjustment
- **Chlorine** – Oxidation + demand + residual

All formulas are derived from **Water Quality Model.pdf** and validated against real-world River Ndarugu data.

---

## 🛠️ Running Locally

### Backend (FastAPI)
```bash
cd src
uvicorn main:app --reload
# Server runs on http://localhost:8000
```

### Frontend (Vite + React)
```bash
cd frontend
npm install
npm run dev
# Server runs on http://localhost:5173
```

---

## 📁 Project Structure

```
water_plant_project/
├── src/                    # Backend (FastAPI)
│   ├── main.py            # API routes
│   ├── dosage_calculator.py
│   ├── seasonal_classifier.py
│   ├── compliance_engine.py
│   └── reports.py
├── frontend/               # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page views
│   │   └── App.tsx
│   └── dist/              # Production build
├── data/
│   └── sample_river_ndarugu.csv
└── docs/
    └── comprehensive_plan.md
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/calculate` | POST | Compute chemical dosages |
| `/api/export-pdf` | GET | Download PDF report |
| `/api/export-excel` | GET | Download Excel report |
| `/api/sample-data` | GET | Get test scenarios |
| `/health` | GET | Server health check |

---

## 🚀 Deployment (Vercel + Render)

1. Push to GitHub
2. Connect repository to Vercel
3. Set build command: `npm run build` (in frontend/)
4. Set output directory: `dist`
5. Render backend automatically deploys from the same repo (Docker image built from `Dockerfile`)
   - On Render: create a **Web Service** → use branch `main`, start with `uvicorn src.main:app --host 0.0.0.0 --port 8000`
   - Vercel will proxy all `/api/*` requests to the Render backend via a client-side rewrite.
6. After Render is live, the rendering frontend will show:
   - Visual water‑quality form and **Calculate** button
   - Modern **Audit Trail** toggle with step‑by‑step calculation details
   - Styled **dosage summary** card (Alum / Soda Ash / Chlorine)
   - Dashboard **charts** and **export** actions

---

## 📝 License
MIT