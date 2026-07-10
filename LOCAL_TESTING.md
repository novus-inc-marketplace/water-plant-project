# Local Testing Guide - Water Quality Treatment Software

A simple, step-by-step guide to test the application locally before deployment.

---

## 📋 What You'll Test

| Feature | How to Test |
|---------|-------------|
| API Health | Visit `/health` endpoint |
| Calculate | Enter water data → Get dosages |
| Charts | See Bar, Line, Radar, Pie charts |
| Export | Download PDF/Excel reports |
| Audit Trail | View calculation steps |
| Compliance | See PASS/FAIL indicators |

---

## 🛠️ Setup (5 Minutes)

### 1. Start the Backend
```bash
cd src
python -m venv venv           # Create virtual environment
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload     # Starts on http://localhost:8000
```

**Keep this terminal open!**

### 2. Start the Frontend
```bash
cd frontend
npm install                   # Install dependencies
npm run dev                   # Starts on http://localhost:5173
```

---

## 🧪 Testing Checklist

### ✅ Test 1: API Health Check
1. Open browser → go to: http://localhost:8000/health
2. **Expected**: `{"status":"healthy","version":"1.0.0"}`

### ✅ Test 2: Calculate Endpoint
1. Open browser → go to: http://localhost:8000/api/sample-data
2. **Expected**: JSON with test water scenarios

### ✅ Test 3: Full UI Flow
1. Open browser → go to: http://localhost:5173
2. Enter test data:
   - Turbidity: `85.2`
   - Iron: `0.15`
   - Manganese: `0.08`
   - pH: `6.8`
   - Ammonia: `1.2`
   - Color: `35.5`
3. Click **"Calculate Dosages"**
4. **Expected**: All fields show values instantly

### ✅ Test 4: Charts Display
1. Scroll down after calculation
2. **Expected to see**:
   - Chemical Dosages Bar Chart
   - Predicted Water Quality Line Chart
   - Compliance Radar Chart
   - Confidence Index Pie Chart

### ✅ Test 5: Export PDF
1. Click **"Export PDF"** button
2. **Expected**: PDF downloads with:
   - Input values
   - Calculated dosages
   - WHO limit references

### ✅ Test 6: Export Excel
1. Click **"Export Excel"** button
2. **Expected**: Excel file downloads with same data

### ✅ Test 7: Audit Trail
1. Click the **"Audit Trail"** toggle
2. **Expected**: Step-by-step calculation breakdown

### ✅ Test 8: Seasonal Selector
1. Change dropdown from "High Flow" to "Low Flow"
2. Click **"Calculate Dosages"** again
3. **Expected**: Different dosage values

---

## 📍 Quick Reference URLs

| Purpose | URL |
|---------|-----|
| Frontend UI | http://localhost:5173 |
| Backend Health | http://localhost:8000/health |
| API Calculate | http://localhost:8000/api/calculate |
| Sample Data | http://localhost:8000/api/sample-data |
| API Docs | http://localhost:8000/docs |

---

## 🐛 Troubleshooting

| Problem | Fix |
|---------|-----|
| "Cannot connect to localhost:8000" | Backend not running – start `uvicorn main:app --reload` |
| "Cannot connect to localhost:5173" | Frontend not running – start `npm run dev` |
| Charts not loading | Check browser console for errors |
| Export buttons not working | Verify backend is running on port 8000 |
| Zero values not accepted | Input should show placeholder when empty |

---

## 🎉 All Tests Passed?

If everything works, you're ready to deploy!

```bash
# Quick test with curl
curl -X POST http://localhost:8000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"turbidity":85.2,"iron":0.15,"manganese":0.08,"ph":6.8,"ammonia":1.2,"color":35.5}'
```

**Expected output**:
```json
{
  "alum_dose": 49.08,
  "soda_ash_dose": 20.2,
  "chlorine_dose": 10.52,
  "compliance_status": "PASS",
  "confidence_index": 100.0
}
```