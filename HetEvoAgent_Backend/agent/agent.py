from pathlib import Path
import sys
from datetime import datetime, date

# Add main API project folder to Python path
PROJECT_DIR = Path(__file__).resolve().parent.parent
SCRIPT_DIR = Path(__file__).resolve().parent

if str(SCRIPT_DIR) in sys.path:
    sys.path.remove(str(SCRIPT_DIR))

if str(PROJECT_DIR) not in sys.path:
    sys.path.insert(0, str(PROJECT_DIR))

from firebase.firebase_config import db

from agent.firebase_agent import get_predictions
from agent.evaluator import evaluate_prediction
from agent.agent_memory import save_agent_learning
from agent.strategy import generate_strategy


def normalize_date(value):
    """
    Convert different Firebase/date formats into YYYY-MM-DD.
    """

    if value is None:
        return None

    if isinstance(value, datetime):
        return value.date().isoformat()

    if isinstance(value, date):
        return value.isoformat()

    # Firestore Timestamp objects
    if hasattr(value, "date"):
        try:
            return value.date().isoformat()
        except Exception:
            pass

    value = str(value)

    # Handle ISO datetime strings
    if "T" in value:
        return value.split("T")[0]

    if " " in value:
        return value.split(" ")[0]

    return value


def get_actual_aqi(zone_id, prediction_date):
    """
    Get actual AQI for the SAME zone and SAME prediction date.

    The agent must not compare a prediction with AQI
    from a different date.
    """

    target_date = normalize_date(prediction_date)

    if zone_id is None or target_date is None:
        return None

    docs = (
        db.collection("aqi_history")
        .where("zone_id", "==", zone_id)
        .stream()
    )

    for doc in docs:

        data = doc.to_dict()

        actual_date = (
            data.get("date")
            or data.get("aqi_date")
            or data.get("prediction_date")
            or data.get("record_date")
        )

        actual_date = normalize_date(actual_date)

        if actual_date == target_date:
            return data.get("aqi")

    return None


def run_complete_agent():
    """
    Run the complete HetEvoAgent cycle.

    Prediction
        ↓
    Firebase
        ↓
    Actual AQI
        ↓
    Evaluation
        ↓
    Reward / Penalty
        ↓
    Agent Memory
        ↓
    Learning
        ↓
    Strategy
    """

    print()
    print("=" * 60)
    print("HETEVOAGENT - COMPLETE AGENT CYCLE")
    print("=" * 60)

    # ---------------------------------------------------------
    # STEP 1: READ PREDICTIONS
    # ---------------------------------------------------------

    print()
    print("STEP 1: Reading predictions from Firebase...")

    predictions = get_predictions()

    print(f"Predictions found: {len(predictions)}")

    evaluated_count = 0
    pending_count = 0
    skipped_count = 0

    # ---------------------------------------------------------
    # STEP 2: EVALUATE PREDICTIONS
    # ---------------------------------------------------------

    print()
    print("STEP 2: Evaluating predictions...")

    for prediction in predictions:

        zone_id = prediction.get("zone_id")
        predicted_aqi = prediction.get("predicted_aqi")
        prediction_date = prediction.get("prediction_date")
        model_version = prediction.get("model_version")

        # Ignore old/incomplete Firebase records
        if (
            zone_id is None
            or predicted_aqi is None
            or prediction_date is None
            or model_version is None
        ):
            skipped_count += 1

            print()
            print("-" * 50)
            print("Skipping incomplete prediction record.")
            print(f"Document ID: {prediction.get('document_id')}")
            print(f"Zone ID: {zone_id}")
            print(f"Prediction Date: {prediction_date}")
            print(f"Model Version: {model_version}")

            continue

        # -----------------------------------------------------
        # Get actual AQI for SAME zone + SAME date
        # -----------------------------------------------------

        actual_aqi = get_actual_aqi(
            zone_id=zone_id,
            prediction_date=prediction_date
        )

        evaluation = evaluate_prediction(
            predicted_aqi=predicted_aqi,
            actual_aqi=actual_aqi,
            zone_id=zone_id
        )

        print()
        print("-" * 50)
        print(f"Zone: {zone_id}")
        print(f"Predicted AQI: {predicted_aqi}")
        print(f"Actual AQI: {actual_aqi}")
        print(f"Prediction Date: {prediction_date}")
        print(f"Model Version: {model_version}")
        print(f"Status: {evaluation['status']}")
        print(f"Error: {evaluation['error']}")
        print(f"Reward: {evaluation['reward']}")

        # Save evaluation result
        save_agent_learning(
            evaluation=evaluation,
            prediction_date=prediction_date,
            model_version=model_version
        )

        if evaluation["status"] == "evaluated":
            evaluated_count += 1
        else:
            pending_count += 1

    # ---------------------------------------------------------
    # STEP 3: LEARNING + STRATEGY
    # ---------------------------------------------------------

    print()
    print("STEP 3: Analyzing agent learning and strategy...")

    strategy = generate_strategy(current_evaluated_count=evaluated_count)

    # ---------------------------------------------------------
    # STEP 4: FINAL RESULT
    # ---------------------------------------------------------

    print()
    print("=" * 60)
    print("FINAL AGENT DECISION")
    print("=" * 60)

    print(f"Predictions found: {len(predictions)}")
    print(f"Evaluated: {evaluated_count}")
    print(f"Pending: {pending_count}")
    print(f"Skipped: {skipped_count}")
    print(f"Agent action: {strategy['action']}")
    print(f"Agent message: {strategy['message']}")
    print(f"Adjustment: {strategy['adjustment']}")

    print("=" * 60)

    return strategy


if __name__ == "__main__":
    run_complete_agent()