from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Any
import json
import os
import sys
from reports import generate_pdf_report, generate_excel_report

# Add src to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import our modules
from dosage_calculator import calculate_dosage, predict_water_quality
from seasonal_classifier import classify_season
from compliance_engine import check_compliance

app = FastAPI(title="Water Quality Treatment Software",
              description="Predicts chemical dosages and validates water quality",
              version="1.0.0")

# CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WaterQualityInput(BaseModel):
    turbidity: float  # NTU
    iron: float       # mg/L
    manganese: float  # mg/L
    ph: float         # pH units
    ammonia: float    # mg/L as N
    color: float      # TCU (True Color Units)
    flow_rate: Optional[float] = None  # MGD (Million Gallons per Day)

class ChemicalDosage(BaseModel):
    alum_dose: float          # mg/L
    soda_ash_dose: float      # mg/L
    chlorine_dose: float      # mg/L
    predicted_turbidity: float
    predicted_iron: float
    predicted_manganese: float
    predicted_ammonia: float
    predicted_ph: float
    compliance_status: str    # PASS/FAIL
    confidence_index: float   # 0-100%

def confidence_index_calculator(water_data: WaterQualityInput) -> float:
    """Calculate confidence index based on input data completeness and quality"""
    required_fields = ['turbidity', 'iron', 'manganese', 'ph', 'ammonia', 'color']
    provided_fields = sum(1 for field in required_fields if getattr(water_data, field) is not None)
    completeness = (provided_fields / len(required_fields)) * 100

    quality_score = 100.0

    if water_data.turbidity > 1000:
        quality_score -= 20
    if water_data.ph < 0 or water_data.ph > 14:
        quality_score -= 30

    return max(0, min(100, (completeness + quality_score) / 2))

@app.post("/api/calculate", response_model=ChemicalDosage)
async def calculate_chemical_dosage(water_data: WaterQualityInput):
    """
    Calculate chemical dosages and predict water quality after treatment
    """
    try:
        season = classify_season(
            water_data.turbidity,
            water_data.color,
            water_data.manganese,
            water_data.ammonia
        )

        dosage = calculate_dosage(
            water_data.turbidity,
            water_data.iron,
            water_data.manganese,
            water_data.ph,
            water_data.ammonia,
            season
        )

        predicted_quality = predict_water_quality(water_data, dosage)
        compliance = check_compliance(predicted_quality)
        confidence = confidence_index_calculator(water_data)

        return ChemicalDosage(
            alum_dose=dosage["alum_dose"],
            soda_ash_dose=dosage["soda_ash_dose"],
            chlorine_dose=dosage["chlorine_dose"],
            predicted_turbidity=predicted_quality["turbidity"],
            predicted_iron=predicted_quality["iron"],
            predicted_manganese=predicted_quality["manganese"],
            predicted_ammonia=predicted_quality["ammonia"],
            predicted_ph=predicted_quality["ph"],
            compliance_status=compliance["status"],
            confidence_index=confidence
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    """Serve the frontend index.html"""
    index_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "index.html")
    if os.path.exists(index_path):
        with open(index_path, 'r') as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>Water Quality Treatment Software</h1><p>API is running. Frontend not found.</p>")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Mount static files
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "static")), name="static")

@app.get("/api/sample-data")
async def get_sample_data():
    """Return sample data for testing"""
    samples = [
        {"scenario": "High Flow - Rainy", "turbidity": 85.2, "iron": 0.15, "manganese": 0.08, "ph": 6.8, "ammonia": 1.2, "color": 35.5},
        {"scenario": "High Flow - Storm", "turbidity": 150.5, "iron": 0.22, "manganese": 0.12, "ph": 6.6, "ammonia": 2.1, "color": 68.3},
        {"scenario": "Low Flow - Dry", "turbidity": 12.8, "iron": 0.05, "manganese": 0.25, "ph": 7.4, "ammonia": 0.3, "color": 8.2},
        {"scenario": "Low Flow - Groundwater", "turbidity": 8.5, "iron": 0.08, "manganese": 0.42, "ph": 7.8, "ammonia": 0.2, "color": 5.1}
    ]
    return {"samples": samples}

@app.get("/api/export-pdf")
async def export_pdf_report():
    """Generate and return a PDF report with formula references and source page citations."""
    test_input = {
        "turbidity": 85.2, "iron": 0.15, "manganese": 0.08,
        "ph": 6.8, "ammonia": 1.2, "color": 35.5, "flow_rate": None
    }
    season = classify_season(
        test_input["turbidity"], test_input["color"],
        test_input["manganese"], test_input["ammonia"]
    )
    dosage = calculate_dosage(
        test_input["turbidity"], test_input["iron"], test_input["manganese"],
        test_input["ph"], test_input["ammonia"], season
    )
    predicted_quality = predict_water_quality(test_input, dosage)
    compliance = check_compliance(predicted_quality)
    confidence = confidence_index_calculator(WaterQualityInput(**test_input))

    try:
        # Check if reports module is available
        pdf_bytes = generate_pdf_report(
            input_data=test_input,
            dosage_data=dosage,
            compliance_data=compliance,
            confidence_index=confidence
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="water_quality_report.pdf"'}
        )
    except Exception as e:
        # Fallback to JSON response with formula references
        return JSONResponse({
            "error": "PDF generation unavailable",
            "formula_references": {
                "alum": "Water Quality Model.pdf, p.25",
                "soda_ash": "Water Quality Model.pdf, p.32",
                "chlorine": "Water Quality Model.pdf, p.30",
                "hypochlorite": "Water Quality Model.pdf, p.33"
            },
            "data": {
                "input": test_input,
                "dosage": dosage,
                "predicted": predicted_quality,
                "compliance": compliance,
                "confidence": confidence
            }
        })

@app.get("/api/export-excel")
async def export_excel_report():
    """Generate and return an Excel report with formula references."""
    test_input = {
        "turbidity": 85.2, "iron": 0.15, "manganese": 0.08,
        "ph": 6.8, "ammonia": 1.2, "color": 35.5, "flow_rate": None
    }
    season = classify_season(
        test_input["turbidity"], test_input["color"],
        test_input["manganese"], test_input["ammonia"]
    )
    dosage = calculate_dosage(
        test_input["turbidity"], test_input["iron"], test_input["manganese"],
        test_input["ph"], test_input["ammonia"], season
    )
    predicted_quality = predict_water_quality(test_input, dosage)
    compliance = check_compliance(predicted_quality)
    confidence = confidence_index_calculator(
        WaterQualityInput(**test_input)
    )

    try:
        excel_bytes = generate_excel_report(
            input_data=test_input,
            dosage_data=dosage,
            compliance_data=compliance,
            confidence_index=confidence
        )
        return Response(
            content=excel_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": 'attachment; filename="water_quality_report.xlsx"'}
        )
    except Exception as e:
        # Fallback to JSON response if report dependencies are unavailable
        return JSONResponse({
            "error": "Excel generation unavailable",
            "data": {
                "input": test_input,
                "dosage": dosage,
                "predicted": predicted_quality,
                "compliance": compliance,
                "confidence": confidence
            }
        })