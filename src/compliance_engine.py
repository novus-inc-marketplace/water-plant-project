"""Compliance engine module - validates water quality against WHO standards"""

from typing import Dict, List, Any

def check_compliance(
    predicted_quality: Dict[str, float]
) -> Dict[str, Any]:
    """
    Check if predicted water quality meets WHO drinking water standards.

    Args:
        predicted_quality: Dict with keys 'turbidity', 'iron', 'manganese', 'ammonia', 'ph'

    Returns:
        Dict with compliance status and details
    """
    # WHO drinking water guidelines (simplified)
    WHO_STANDARDS = {
        "turbidity": {"max": 5.0, "unit": "NTU", "note": "Ideal < 1 NTU for effective disinfection"},
        "iron": {"max": 0.3, "unit": "mg/L", "note": "Aesthetic limit"},
        "manganese": {"max": 0.1, "unit": "mg/L", "note": "Aesthetic limit"},
        "ammonia": {"max": 1.5, "unit": "mg/L as N", "note": "Disinfection interference limit"},
        "ph": {"min": 6.5, "max": 8.5, "unit": "pH units", "note": "Disinfection effectiveness"}
    }

    # Additional preferred standards
    PREFERRED_STANDARDS = {
        "turbidity": {"max": 1.0, "unit": "NTU"},  # Preferred for effective disinfection
        "iron": {"max": 0.1, "unit": "mg/L"},
        "manganese": {"max": 0.05, "unit": "mg/L"}
    }

    violations = []
    preferred_violations = []

    # Check each parameter against WHO standards
    for param, value in predicted_quality.items():
        if param in WHO_STANDARDS:
            std = WHO_STANDARDS[param]
            if "min" in std and value < std["min"]:
                violations.append({
                    "parameter": param,
                    "value": value,
                    "limit": std["min"],
                    "type": "minimum",
                    "unit": std["unit"],
                    "note": std.get("note", "")
                })
            elif "max" in std and value > std["max"]:
                violations.append({
                    "parameter": param,
                    "value": value,
                    "limit": std["max"],
                    "type": "maximum",
                    "unit": std["unit"],
                    "note": std.get("note", "")
                })

    # Check preferred standards (stricter)
    for param, value in predicted_quality.items():
        if param in PREFERRED_STANDARDS:
            std = PREFERRED_STANDARDS[param]
            if "max" in std and value > std["max"]:
                preferred_violations.append({
                    "parameter": param,
                    "value": value,
                    "limit": std["max"],
                    "type": "preferred",
                    "unit": std["unit"]
                })

    # Determine overall compliance status
    if len(violations) == 0:
        compliance_status = "PASS"
    else:
        compliance_status = "FAIL"

    return {
        "status": compliance_status,
        "violations": violations,
        "preferred_violations": preferred_violations,
        "compliant_parameters": [p for p in predicted_quality.keys() if p in WHO_STANDARDS and p not in [v["parameter"] for v in violations]],
        "total_parameters_checked": len(WHO_STANDARDS)
    }

class ComplianceEngine:
    """API class for compliance checking"""

    @staticmethod
    def check_compliance(predicted_quality):
        return check_compliance(predicted_quality)

    @staticmethod
    def get_who_standards():
        return {
            "turbidity": {"max": 5.0, "unit": "NTU"},
            "iron": {"max": 0.3, "unit": "mg/L"},
            "manganese": {"max": 0.1, "unit": "mg/L"},
            "ammonia": {"max": 1.5, "unit": "mg/L as N"},
            "ph": {"min": 6.5, "max": 8.5, "unit": "pH units"}
        }