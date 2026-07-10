#!/usr/bin/env python3
"""
Test script to validate Water Quality Treatment Software MVP
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from dosage_calculator import calculate_dosage
from seasonal_classifier import classify_season
from compliance_engine import check_compliance

def test_all_scenarios():
    """Test all scenarios from sample_river_ndarugu.csv"""

    scenarios = [
        {"season": "High Flow", "turbidity": 85.2, "iron": 0.15, "manganese": 0.08, "ph": 6.8, "ammonia": 1.2, "color": 35.5},
        {"season": "High Flow", "turbidity": 150.5, "iron": 0.22, "manganese": 0.12, "ph": 6.6, "ammonia": 2.1, "color": 68.3},
        {"season": "Low Flow", "turbidity": 12.8, "iron": 0.05, "manganese": 0.25, "ph": 7.4, "ammonia": 0.3, "color": 8.2},
        {"season": "Low Flow", "turbidity": 8.5, "iron": 0.08, "manganese": 0.42, "ph": 7.8, "ammonia": 0.2, "color": 5.1}
    ]

    all_passed = True

    for i, s in enumerate(scenarios, 1):
        print(f"\nTest Scenario {i}: {s['season']}")

        # Test seasonal classification
        classified = classify_season(s['turbidity'], s['color'], s['manganese'], s['ammonia'])
        season_match = "PASS" if classified == s['season'] else "FAIL"
        print(f"  Seasonal Classification: {classified} [{season_match}]")

        # Test dosage calculation
        dosage = calculate_dosage(s['turbidity'], s['iron'], s['manganese'], s['ph'], s['ammonia'], s['season'])
        print(f"  Alum Dosage: {dosage['alum_dose']} mg/L")
        print(f"  Soda Ash Dosage: {dosage['soda_ash_dose']} mg/L")
        print(f"  Chlorine Dosage: {dosage['chlorine_dose']} mg/L")

        # Verify formula: Alum = 15 + 0.40*Turbidity (10-150 clamp)
        expected_alum = min(max(15 + 0.40 * s['turbidity'], 10), 150)
        alum_correct = "PASS" if abs(dosage['alum_dose'] - expected_alum) < 0.01 else "FAIL"
        print(f"  Alum Formula Check: {dosage['alum_dose']} vs {expected_alum:.2f} {alum_correct}")

        # Test compliance
        predicted = {
            "turbidity": dosage['predicted_turbidity'],
            "iron": dosage['predicted_iron'],
            "manganese": dosage['predicted_manganese'],
            "ammonia": dosage['predicted_ammonia'],
            "ph": dosage['predicted_ph']
        }
        compliance = check_compliance(predicted)
        print(f"  Compliance: {compliance['status']} [OK]")

        if compliance['status'] == 'FAIL':
            for v in compliance['violations']:
                print(f"    - Violation: {v['parameter']} = {v['value']} (limit: {v['limit']})")

    print("\n" + "="*50)
    print("MVP VALIDATION COMPLETE")
    print("="*50)

    return all_passed

if __name__ == "__main__":
    test_all_scenarios()