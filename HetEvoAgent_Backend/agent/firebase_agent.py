from pathlib import Path
import sys

# Add the backend project folder to Python path
PROJECT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_DIR))

# Use the Firebase configuration already used by HetEvoAgent
from firebase.firebase_config import db


def get_predictions():
    """
    Read all AQI predictions from Firebase.
    """

    docs = db.collection("predictions").stream()

    predictions = []

    for doc in docs:
        data = doc.to_dict()

        prediction = {
            "document_id": doc.id,
            "zone_id": data.get("zone_id"),
            "zone_name": data.get("zone_name"),
            "predicted_aqi": data.get("predicted_aqi"),
            "prediction_date": data.get("prediction_date"),
            "model_version": data.get("model_version"),
        }

        predictions.append(prediction)

    return predictions


if __name__ == "__main__":

    print()
    print("=" * 60)
    print("HETEVOAGENT - FIREBASE PREDICTIONS")
    print("=" * 60)

    predictions = get_predictions()

    print(f"\nTotal predictions found: {len(predictions)}")

    for prediction in predictions:
        print()
        print("-" * 60)
        print(f"Zone ID: {prediction['zone_id']}")
        print(f"Zone Name: {prediction['zone_name']}")
        print(f"Predicted AQI: {prediction['predicted_aqi']}")
        print(f"Prediction Date: {prediction['prediction_date']}")
        print(f"Model Version: {prediction['model_version']}")

    print()
    print("=" * 60)
    print("PREDICTION READING COMPLETED")
    print("=" * 60)