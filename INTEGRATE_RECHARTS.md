PROMPT: Integrate Recharts Visualization into Water Quality Treatment Software MVP

OBJECTIVE:
Add interactive charts (bar, radar, donut) to the React frontend for visualizing chemical dosages, predicted water quality, and confidence index. Complete the integration, test locally, and prepare for production deployment.

EXECUTE ALL STEPS IN ORDER:

## 1. INSTALL RECHARTS DEPENDENCY
```bash
cd frontend && npm install recharts
```
- Verify installation: `npm list recharts`
- Check package.json updated with recharts version

## 2. CREATE CHART CONTAINER COMPONENT
Create `frontend/src/components/ChartContainer.tsx` with:
- Bar chart: Alum, Soda Ash, Chlorine, Calcium Hypochlorite dosages
- Radar chart: Predicted water quality (Turbidity, Iron, Manganese, Ammonia, pH)
- Donut chart: Confidence index visualization
- Tooltips showing exact formula text on hover
- Responsive container for all charts

## 3. UPDATE APP.TO REPLACE PLAIN RESULT BLOCK
In `frontend/src/App.tsx`:
- Import ChartContainer: `import { ChartContainer } from './components/ChartContainer'`
- Replace the compliance/confidence section with: `<ChartContainer data={results} showDonut={true} />`
- Keep existing export buttons (they already work)

## 4. ADD FORMULA TOOLTIPS
Each bar/radar point should show formula on hover:
- Alum: "Alum = 15 + 0.40×Turbidity (clamped 10-150 mg/L)"
- Soda Ash: "Soda Ash = 1.01×(20 - Alkalinity Remaining)"
- Chlorine: "Cl₂ = Oxidation + Demand + Residual"
- Radar points: WHO limits reference

## 5. RUN LOCAL TESTS
```bash
# Test 1: Build succeeds
cd frontend && npm run build

# Test 2: Dev server starts
cd frontend && npm run dev &
# Verify: http://localhost:3000 loads with charts

# Test 3: Backend integration
cd .. && python -m uvicorn src.main:app --reload --port 8000
# Test full flow: input values -> calculate -> see charts -> export PDF/Excel

# Test 4: Run MVP validation script
python test_mvp.py
# Should show all 4 scenarios PASS

# Test 5: Check sample data API
curl http://localhost:8000/api/sample-data
# Should return 4 test scenarios
```

## 6. VERIFY CHART FUNCTIONALITY
- [ ] Bar chart renders 4 chemicals with correct values
- [ ] Radar chart shows 5 water quality parameters
- [ ] Donut shows confidence % with color coding
- [ ] Hover tooltips display exact formulas
- [ ] Charts resize on window resize
- [ ] Export buttons still download PDF/Excel
- [ ] Mobile responsive layout works

## 7. PRODUCTION READINESS CHECKLIST
- [ ] `npm run build` produces dist/ without errors
- [ ] All TypeScript types valid (`npx tsc --noEmit`)
- [ ] ESLint passes: `npx eslint src/`
- [ ] No console errors in browser dev tools
- [ ] FastAPI serves React build in production mode

## 8. COMMIT CHANGES
```bash
git add frontend/package.json frontend/package-lock.json
git add frontend/src/components/ChartContainer.tsx
git add frontend/src/App.tsx
git commit -m "feat: add recharts visualizations for dosage, quality, confidence"
```

## FILES TO CREATE/MODIFY:
1. `frontend/package.json` (add recharts dependency)
2. `frontend/src/components/ChartContainer.tsx` (NEW - chart component)
3. `frontend/src/App.tsx` (modify - import and use ChartContainer)

## SUCCESS CRITERIA:
✅ Charts render with real calculation data
✅ Tooltips show exact formulas from PDF
✅ All 4 test scenarios produce correct visual output
✅ Export functionality unchanged
✅ Production build succeeds
✅ No regressions in existing functionality

## POST-INTEGRATION:
After successful local testing, ready for:
- Vercel deployment (frontend)
- Fly.io/Render deployment (FastAPI backend)
- Production URL configuration