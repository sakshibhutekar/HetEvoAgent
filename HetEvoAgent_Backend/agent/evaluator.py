from agent.reward import calculate_reward


def evaluate_prediction(predicted_aqi, actual_aqi, zone_id):
    """
    Evaluate an AQI prediction for a specific zone.

    If actual AQI is unavailable, the prediction remains pending.
    """

    result = calculate_reward(
        predicted_aqi=predicted_aqi,
        actual_aqi=actual_aqi
    )

    evaluation = {
        "zone_id": zone_id,
        "predicted_aqi": predicted_aqi,
        "actual_aqi": actual_aqi,
        "status": result["status"],
        "error": result["error"],
        "reward": result["reward"],
        "message": result["message"]
    }

    return evaluation