import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
ZONES_PATH = BASE_DIR / "config" / "zones_config.json"


class ZoneService:

    def __init__(self):
        self.zones = self._load_zones()

    def _load_zones(self):
        if not ZONES_PATH.exists():
            raise FileNotFoundError(
                f"Zones configuration not found: {ZONES_PATH}"
            )

        with open(ZONES_PATH, "r", encoding="utf-8") as file:
            data = json.load(file)

        return data["zones"]

    def get_all_zones(self):
        return self.zones

    def get_zone(self, zone_name):

        for zone in self.zones:

            if zone["zone_name"].lower() == zone_name.lower():
                return zone

        return None


zone_service = ZoneService()