import sys
from pathlib import Path
from datetime import datetime, timezone

PROJECT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_DIR))

from firebase.firebase_config import db


def save_agent_learning(
    evaluation,
    prediction_date=None,
    model_version=None
):
    """
    Save an agent evaluation to Firebase.

    One Firestore document is maintained for each
    zone + prediction date + model version.
    """

    zone_id = evaluation["zone_id"]
    predicted_aqi = evaluation["predicted_aqi"]

    date_part = str(prediction_date or "unknown_date")
    model_part = str(model_version or "unknown_model")

    document_id = (
        f"{zone_id}_"
        f"{date_part}_"
        f"{model_part}"
    )

    document_id = (
        document_id
        .replace("/", "_")
        .replace(" ", "_")
        .replace(":", "-")
    )

    doc_ref = db.collection("agent_learning").document(document_id)

    data = {
        "zone_id": zone_id,
        "predicted_aqi": predicted_aqi,
        "actual_aqi": evaluation["actual_aqi"],
        "status": evaluation["status"],
        "error": evaluation["error"],
        "reward": evaluation["reward"],
        "message": evaluation["message"],
        "prediction_date": prediction_date,
        "model_version": model_version,
        "updated_at": datetime.now(timezone.utc)
    }

    existing_doc = doc_ref.get()

    if existing_doc.exists:

        doc_ref.update(data)

        print()
        print("Existing agent learning record updated.")
        print(f"Document ID: {document_id}")

    else:

        data["created_at"] = datetime.now(timezone.utc)

        doc_ref.set(data)

        print()
        print("New agent learning record saved.")
        print(f"Document ID: {document_id}")

    return document_id