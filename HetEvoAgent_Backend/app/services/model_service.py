from pathlib import Path
import json
import sys
import joblib

# Workaround for unpickling scikit-learn models saved with module alias '_loss'
try:
    import sklearn._loss._loss as _sklearn_loss
    sys.modules['_loss'] = _sklearn_loss
except Exception:
    pass


BASE_DIR = Path(__file__).resolve().parents[2]

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "gradient_boosting_aqi_model.pkl"
)

FEATURES_PATH = (
    BASE_DIR
    / "models"
    / "gradient_boosting_features.json"
)


class ModelService:

    def __init__(self):

        self.model = None
        self.features = None


    def load_model(self):

        """Load the trained AQI model and its feature configuration."""

        if not MODEL_PATH.exists():

            raise FileNotFoundError(
                f"Model file not found: {MODEL_PATH}"
            )


        if not FEATURES_PATH.exists():

            raise FileNotFoundError(
                f"Feature file not found: {FEATURES_PATH}"
            )


        # Load trained model
        self.model = joblib.load(
            MODEL_PATH
        )


        # Load feature list
        with open(
            FEATURES_PATH,
            "r"
        ) as file:

            self.features = json.load(file)


        print("[SUCCESS] AQI model loaded successfully")

        print(
            f"[INFO] Model: {MODEL_PATH.name}"
        )

        print(
            f"[INFO] Features: {len(self.features)}"
        )

        return self.model


    def get_model(self):

        """Return the trained model."""

        if self.model is None:

            self.load_model()

        return self.model


    def get_features(self):

        """Return the exact feature order used during training."""

        if self.features is None:

            self.load_model()

        return self.features


    def get_model_version(self):

        """
        Return a stable identifier for the
        currently loaded model.
        """

        return MODEL_PATH.stem


    def predict(self, input_data):

        """Generate AQI prediction."""

        model = self.get_model()

        prediction = model.predict(
            input_data
        )

        return prediction


model_service = ModelService()