from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.predictions import router as prediction_router
from app.api.routes.zones import router as zone_router
from app.api.routes.weather import router as weather_router


app = FastAPI(
    title="HetEvoAgent Backend",
    version="1.0.0"
)


# ---------------------------------------------------------
# CORS CONFIGURATION
# Allows the Next.js frontend to communicate with FastAPI
# ---------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# API ROUTES
# ---------------------------------------------------------
app.include_router(prediction_router)
app.include_router(zone_router)
app.include_router(weather_router)


# ---------------------------------------------------------
# HEALTH CHECK
# ---------------------------------------------------------
@app.get("/api/v1/health")
def health():
    return {
        "status": "ok",
        "service": "HetEvoAgent Backend"
    }