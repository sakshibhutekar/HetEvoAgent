def calculate_reward(predicted_aqi, actual_aqi):
    """
    Calculate prediction error and reward/penalty.

    If actual AQI is not available, no reward is calculated.
    """

    # Actual AQI is not available
    if actual_aqi is None:
        return {
            "status": "pending",
            "error": None,
            "reward": None,
            "message": "Actual AQI is not available yet."
        }

    # Calculate absolute prediction error
    error = abs(predicted_aqi - actual_aqi)

    # Reward based on prediction accuracy
    if error <= 10:
        reward = 1.0
    elif error <= 20:
        reward = 0.5
    elif error <= 30:
        reward = 0.0
    else:
        reward = -1.0

    return {
        "status": "evaluated",
        "error": round(error, 2),
        "reward": reward,
        "message": "Prediction evaluated successfully."
    }


if __name__ == "__main__":

    # Test 1: Good prediction
    result = calculate_reward(78, 82)

    print("Test 1")
    print(result)

    # Test 2: Poor prediction
    result = calculate_reward(78, 120)

    print("\nTest 2")
    print(result)

    # Test 3: Actual AQI unavailable
    result = calculate_reward(78, None)

    print("\nTest 3")
    print(result)