import os
import firebase_admin
from firebase_admin import credentials, firestore


# Get the directory where this file is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Path to Firebase service account JSON
CREDENTIALS_PATH = os.path.join(
    BASE_DIR,
    "hetevoagent-2a10e-firebase-adminsdk-fbsvc-77ecc11f80.json"
)


# Initialize Firebase only once
if not firebase_admin._apps:

    cred = credentials.Certificate(
        CREDENTIALS_PATH
    )

    firebase_admin.initialize_app(cred)


# Connect to Firestore
db = firestore.client()