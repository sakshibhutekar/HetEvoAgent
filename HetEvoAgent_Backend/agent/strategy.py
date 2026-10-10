from agent.learning import calculate_learning_summary


def generate_strategy(current_evaluated_count=0):
    """
    Generate the agent's strategy.

    The current evaluation cycle takes priority.
    Historical performance is used only when there
    is evaluated data available for analysis.
    """

    summary = calculate_learning_summary()

    # ---------------------------------------------------------
    # No actual AQI available in the CURRENT cycle
    # ---------------------------------------------------------

    if current_evaluated_count == 0:

        return {
            "action": "WAIT_FOR_ACTUAL_AQI",
            "message": (
                "Actual AQI is not available for the current "
                "predictions. Keep them pending until ground-truth "
                "AQI data becomes available."
            ),
            "adjustment": 0.0,
            "summary": summary
        }

    # ---------------------------------------------------------
    # Current predictions have been evaluated
    # ---------------------------------------------------------

    average_error = summary["average_error"]

    if average_error is None:

        return {
            "action": "WAIT_FOR_ACTUAL_AQI",
            "message": (
                "There is not enough evaluated AQI data "
                "to determine a strategy."
            ),
            "adjustment": 0.0,
            "summary": summary
        }

    # ---------------------------------------------------------
    # Low prediction error
    # ---------------------------------------------------------

    if average_error <= 10:

        return {
            "action": "MAINTAIN",
            "message": (
                "Prediction error is within the acceptable "
                "range. Maintain the current model strategy."
            ),
            "adjustment": 0.0,
            "summary": summary
        }

    # ---------------------------------------------------------
    # Moderate prediction error
    # ---------------------------------------------------------

    if average_error <= 20:

        return {
            "action": "MONITOR",
            "message": (
                "Prediction error is moderate. "
                "Continue monitoring future predictions."
            ),
            "adjustment": 0.05,
            "summary": summary
        }

    # ---------------------------------------------------------
    # High prediction error
    # ---------------------------------------------------------

    return {
        "action": "REVIEW_MODEL",
        "message": (
            "Prediction error is high. "
            "Review features, data quality, and model performance."
        ),
        "adjustment": 0.10,
        "summary": summary
    }