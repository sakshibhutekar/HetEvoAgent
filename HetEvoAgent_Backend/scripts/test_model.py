from app.services.prediction_service import prediction_service


sample_data = {
    "T2M": 25.0,
    "T2M_MAX": 30.0,
    "T2M_MIN": 20.0,
    "RH2M": 55.0,
    "WS10M": 3.0,
    "WD10M": 180.0,
    "PRECTOTCORR": 0.0,
    "PS": 950.0,
    "T2MDEW": 15.0,
    "year": 2025,
    "month": 1,
    "day": 15,
    "day_of_week": 2,
    "day_of_year": 15,
    "month_sin": 0.5,
    "month_cos": 0.866,
    "day_of_year_sin": 0.25,
    "day_of_year_cos": 0.968,
    "latitude": 19.876,
    "longitude": 75.342,
    "distance_km": 2.9
}


prediction = prediction_service.predict(sample_data)

print()
print("================================")
print("   HetEvoAgent Model Test")
print("================================")
print(f"Predicted AQI: {prediction:.2f}")
print("================================")