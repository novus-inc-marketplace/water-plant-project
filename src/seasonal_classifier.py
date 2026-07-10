"""Seasonal classifier module - automatically determines season based on water quality indicators"""

from typing import Tuple

def classify_season(
    turbidity: float,
    color: float,
    manganese: float,
    ammonia: float
) -> str:
    """
    Classify the season based on water quality parameters.

    Based on the comprehensive_plan.md specification:
    - High Flow: High turbidity, high color, low manganese
    - Low Flow: Lower turbidity, lower color, higher manganese concentration

    Args:
        turbidity: NTU - turbidity measurement
        color: TCU - True Color Units
        manganese: mg/L - manganese content
        ammonia: mg/L as N - ammonia-nitrogen content

    Returns:
        Season classification: "High Flow" or "Low Flow"
    """
    # Normalize inputs for scoring (these thresholds would be calibrated with local data)
    turbidity_score = min(turbidity / 100.0, 1.0)  # Normalize to 0-1, cap at 100 NTU
    color_score = min(color / 50.0, 1.0)          # Normalize to 0-1, cap at 50 TCU
    mn_score = 1.0 - min(manganese / 0.5, 1.0)    # Inverse: low Mn = high score for high flow
    ammonia_score = min(ammonia / 2.0, 1.0)       # Normalize to 0-1, cap at 2 mg/L as N

    # Weighted scoring for High Flow indicators
    # High turbidity and color indicate high flow/runoff conditions
    # Low manganese indicates less groundwater influence (more surface runoff)
    high_flow_score = (
        turbidity_score * 0.3 +
        color_score * 0.3 +
        mn_score * 0.2 +
        ammonia_score * 0.2
    )

    # Determine season based on score
    # Threshold determined empirically - adjust based on local data
    if high_flow_score >= 0.5:
        return "High Flow"
    else:
        return "Low Flow"

def get_seasonal_multipliers(season: str) -> dict:
    """
    Get seasonal adjustment factors for chemical dosages.

    Args:
        season: "High Flow" or "Low Flow"

    Returns:
        Dictionary of multiplier factors for different chemicals
    """
    multipliers = {
        "High Flow": {
            "alum": 1.2,      # Higher alum needed for turbid water
            "soda_ash": 1.1,  # Slightly more for pH adjustment
            "chlorine": 1.3   # More chlorine for higher organics
        },
        "Low Flow": {
            "alum": 0.9,      # Less alum needed for clearer water
            "soda_ash": 0.9,  # Less for pH adjustment
            "chlorine": 0.8   # Less chlorine for lower organics
        }
    }

    return multipliers.get(season, {"alum": 1.0, "soda_ash": 1.0, "chlorine": 1.0})

def get_seasonal_description(season: str) -> str:
    """
    Get a human-readable description of the season characteristics.

    Args:
        season: "High Flow" or "Low Flow"

    Returns:
        Description string
    """
    descriptions = {
        "High Flow": "High flow conditions typically occur during rainy seasons, characterized by high turbidity, color, and suspended solids from surface runoff.",
        "Low Flow": "Low flow conditions typically occur during dry seasons, characterized by lower turbidity and color but potentially higher concentrations of dissolved constituents like manganese from groundwater influence."
    }

    return descriptions.get(season, "Unknown season classification")

class SeasonalClassifier:
    """API class for seasonal classification"""

    @staticmethod
    def classify_season(turbidity, color, manganese, ammonia):
        return classify_season(turbidity, color, manganese, ammonia)

    @staticmethod
    def get_seasonal_multipliers(season):
        return get_seasonal_multipliers(season)

    @staticmethod
    def get_seasonal_description(season):
        return get_seasonal_description(season)