from pathlib import Path
import sys

PROJECT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_DIR))

from firebase.firebase_config import db


def get_learning_history():
    """
    Retrieve historical agent evaluations from Firebase.
    """

    docs = db.collection("agent_learning").stream()

    history = []

    for doc in docs:
        data = doc.to_dict()
        data["document_id"] = doc.id
        history.append(data)

    return history


def calculate_learning_summary():
    """
    Calculate basic learning statistics from evaluated predictions.
    """

    history = get_learning_history()

    evaluated = [
        item for item in history
        if item.get("status") == "evaluated"
    ]

    pending = [
        item for item in history
        if item.get("status") == "pending"
    ]

    if not evaluated:
        return {
            "total_records": len(history),
            "evaluated": 0,
            "pending": len(pending),
            "average_error": None,
            "average_reward": None
        }

    errors = [
        item["error"]
        for item in evaluated
        if item.get("error") is not None
    ]

    rewards = [
        item["reward"]
        for item in evaluated
        if item.get("reward") is not None
    ]

    average_error = (
        sum(errors) / len(errors)
        if errors
        else None
    )

    average_reward = (
        sum(rewards) / len(rewards)
        if rewards
        else None
    )

    return {
        "total_records": len(history),
        "evaluated": len(evaluated),
        "pending": len(pending),
        "average_error": round(average_error, 2)
        if average_error is not None else None,
        "average_reward": round(average_reward, 2)
        if average_reward is not None else None
    }