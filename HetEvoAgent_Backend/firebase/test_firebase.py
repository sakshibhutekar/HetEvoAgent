from firebase_config import db

# Test data
test_data = {
    "location": "Chhatrapati Sambhajinagar",
    "aqi": 142,
    "status": "Unhealthy",
    "source": "HetEvoAgent"
}

# Save data to Firestore
db.collection("test_predictions").add(test_data)

print("Data successfully added to Firestore!")