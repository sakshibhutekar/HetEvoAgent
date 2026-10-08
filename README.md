HetEvoAgent

Hyper-Local AQI Prediction & Self-Evolving Agentic AI System

HetEvoAgent is an AI-powered, hyper-local Air Quality Index (AQI) prediction and monitoring system designed for Chhatrapati Sambhajinagar, Maharashtra, India.

The system combines heterogeneous environmental data, machine learning, geospatial information, an agent-based feedback mechanism, and a modern web dashboard to generate zone-wise AQI predictions across six representative urban zones.

The system is designed around a continuous feedback concept:

Data Collection → Preprocessing → Feature Engineering → AQI Prediction → Evaluation → Reward/Penalty → Agent Learning → Improved Decision Making

---

Introduction

Air pollution is not uniformly distributed across a city.

Industrial areas, commercial centers, residential regions, and developing peripheral regions can experience significantly different air-quality conditions at the same time.

However, conventional monitoring infrastructure generally depends on a limited number of ground-based monitoring stations. This creates a spatial gap between measured AQI and the actual conditions experienced across different parts of a city.

HetEvoAgent addresses this problem by combining weather, ground AQI observations, satellite-derived environmental information, temporal patterns, and geographic context to provide localized AQI predictions.

---

 Problem Statement

Chhatrapati Sambhajinagar has diverse industrial, commercial, residential, and developing regions. A limited number of monitoring stations cannot provide complete hyper-local coverage of air-quality conditions across the city.

This creates several challenges:

- Limited spatial coverage of ground monitoring stations
- Difficulty estimating AQI in areas without monitoring stations
- Dependence on heterogeneous environmental data sources
- Difficulty integrating weather and satellite information
- Static prediction models can become less effective as environmental patterns change
- Lack of a unified prediction and visualization platform
- Limited access to zone-specific AQI information
- Difficulty identifying changes in prediction performance

HetEvoAgent is designed to address these challenges through environmental data integration, machine learning, geospatial modeling, and an agent-based feedback mechanism.

---

Our Solution

HetEvoAgent provides a complete pipeline for hyper-local AQI intelligence.

The system collects environmental information from multiple sources and transforms it into structured features for machine-learning-based AQI prediction.

The prediction system currently operates across six predefined zones of Chhatrapati Sambhajinagar.

The generated predictions are exposed through a FastAPI backend and visualized through a React/Next.js frontend containing:

- Live AQI monitoring
- Zone-wise predictions
- AQI heatmaps
- Historical information
- Weather information
- Prediction insights
- Zone-level visualization

The system also contains an agent/self-evolution layer that evaluates prediction performance and maintains feedback information through evaluation, reward/penalty, learning, strategy, and memory components.

---

Project Objectives

1. Generate hyper-local AQI predictions for Chhatrapati Sambhajinagar.
2. Divide the city into representative prediction zones.
3. Integrate heterogeneous environmental datasets.
4. Combine weather, AQI, satellite, temporal, and geographic information.
5. Engineer meaningful features for AQI prediction.
6. Build a machine-learning-based AQI regression model.
7. Provide predictions through a REST API.
8. Store prediction information using Firebase Firestore.
9. Visualize AQI information through an interactive frontend.
10. Evaluate prediction performance against actual AQI observations.
11. Implement an agent-based feedback mechanism.
12. Use reward/penalty concepts to represent prediction performance.
13. Maintain learning and evolution information for future model improvement.
14. Provide a foundation for autonomous environmental intelligence.


What Makes HetEvoAgent Different?

Traditional AQI systems mainly answer:

"What is the AQI at the monitoring station?"

HetEvoAgent aims to answer:

"What is the expected AQI in this specific zone of the city?"

The system therefore focuses on:

 Hyper-local prediction

Instead of representing the entire city with a single AQI value, the city is divided into six prediction zones.

### Heterogeneous data

Multiple environmental and geographic data sources contribute to the overall system.

### Machine learning

A Gradient Boosting Regressor is used for the current deployed AQI prediction pipeline.

### Agent-based feedback

Prediction performance can be evaluated and passed into the agent layer through evaluation, reward/penalty, learning, memory, and strategy components.

### Interactive visualization

Predictions are presented through a modern web interface with zone-wise visualization and AQI heatmaps.

### Persistent prediction storage

Firebase Firestore is integrated with the backend for storing prediction information and supporting the application's data flow.

---

# System Architecture

The overall system can be represented as:

1. Environmental Data
2. Data Collection
3. Data Preprocessing
4. Feature Engineering
5. 21 Model Features
6. Gradient Boosting AQI Prediction
7. Agent Evaluation
8. Reward / Penalty
9. Learning / Strategy / Memory
10. Firebase Firestore
11. FastAPI Backend
12. React / Next.js Frontend
13. Live AQI / Predictions / Heatmaps / Insights

---

# How HetEvoAgent Works

## 1. Data Collection

Environmental information is collected from multiple sources.

The backend contains integration components for external environmental services and data providers.

These include:

- AQI / ground monitoring data
- Weather data
- ERA5 data
- Satellite-derived information
- Other API-based environmental information

---

## 2. Data Preprocessing

Raw environmental data cannot directly be passed into a machine-learning model.

The preprocessing stage performs operations such as:

- Date conversion
- Data validation
- Missing-value handling
- Dataset merging
- Station matching
- Geographic mapping
- Feature preparation
- Data consistency checks

Weather data is transformed into a structured dataset containing:

- `date`
- `zone`
- `zone_type`
- `latitude`
- `longitude`
- `T2M`
- `T2M_MAX`
- `T2M_MIN`
- `RH2M`
- `WS10M`
- `WD10M`
- `PRECTOTCORR`
- `PS`
- `T2MDEW`

---

# Feature Engineering

One of the most important components of HetEvoAgent is feature engineering.

The current deployed Gradient Boosting AQI model uses 21 features.

These features combine meteorological, temporal, cyclic, and geographic information.

---

# The 21 Model Features

| No. | Feature | Description |
|---:|---|---|
| 1 | T2M | Air temperature at 2 meters |
| 2 | T2M_MAX | Maximum 2-meter temperature |
| 3 | T2M_MIN | Minimum 2-meter temperature |
| 4 | RH2M | Relative humidity at 2 meters |
| 5 | WS10M | Wind speed at 10 meters |
| 6 | WD10M | Wind direction at 10 meters |
| 7 | PRECTOTCORR | Corrected precipitation |
| 8 | PS | Surface pressure |
| 9 | T2MDEW | Dew-point temperature |
| 10 | year | Year extracted from the prediction date |
| 11 | month | Month extracted from the prediction date |
| 12 | day | Day of the month |
| 13 | day_of_week | Day of the week |
| 14 | day_of_year | Day number within the year |
| 15 | month_sin | Cyclic representation of month |
| 16 | month_cos | Cyclic representation of month |
| 17 | day_of_year_sin | Cyclic representation of day of year |
| 18 | day_of_year_cos | Cyclic representation of day of year |
| 19 | latitude | Geographic latitude of the prediction zone |
| 20 | longitude | Geographic longitude of the prediction zone |
| 21 | distance_km | Distance-related geographic feature |

---

# Why Cyclic Features Are Used

Time is naturally cyclical.

For example:

December → January

Sunday → Monday

If month numbers are represented simply as:

December = 12
January = 1

the model may incorrectly treat them as very far apart.

Sine and cosine transformations allow the model to represent cyclical relationships more naturally.

---

# AQI Prediction Model

The current deployed AQI prediction model is:

## Gradient Boosting Regressor

The model predicts AQI as a continuous numerical value using the 21 engineered features.

The serialized model is stored as:

models/
```text
└── gradient_boosting_aqi_model.pkl
```

The backend loads this model through the model service and uses it during prediction requests.

---
# Model Configuration

| Parameter | Value |
|---|---:|
| Algorithm | Gradient Boosting Regressor |
| Number of Estimators | 200 |
| Learning Rate | 0.05 |
| Loss | Huber |
| Criterion | friedman_mse |
| Minimum Samples Split | 2 |
| Minimum Samples Leaf | 5 |
| Maximum Depth | 3 |
| Subsample | 1.0 |
| Alpha | 0.9 |
| Random State | 42 |
| Number of Input Features | 21 |

Gradient Boosting is suitable for this problem because AQI depends on nonlinear relationships between environmental variables.

---

# Prediction Zones

HetEvoAgent currently operates on six representative prediction zones within Chhatrapati Sambhajinagar.

| Zone ID | Zone | Zone Type | Latitude | Longitude |
|---|---|---|---:|---:|
| Z1 | Chikalthana MIDC | Industrial | 19.864981 | 75.411001 |
| Z2 | Waluj / More Chowk | Industrial + Urban | 19.840930 | 75.241890 |
| Z3 | Gulmandi / Central City | Commercial | 19.885817 | 75.331858 |
| Z4 | CIDCO | Residential + Urban | 19.892808 | 75.363114 |
| Z5 | Shendra | Industrial + Developing | 19.873282 | 75.491805 |
| Z6 | Deolai | Peripheral Residential | 19.842209 | 75.365579 |

These zones represent different urban characteristics and environmental contexts.

---

# Why Zone-Based Prediction?

A city-wide AQI value can hide important local differences.

For example:

- Industrial Zone → Industrial activity → Different pollution pattern
- Commercial Zone → Traffic and activity → Different pollution pattern
- Residential Zone → Different emission sources → Different AQI pattern

Therefore, HetEvoAgent treats each zone as a separate geographic context while using a common prediction pipeline.

Latitude, longitude, and distance-related features allow geographic information to be incorporated into prediction.

---

# Environmental Data Sources

HetEvoAgent is designed around heterogeneous environmental data.

## Ground AQI Data

Ground-based AQI observations are used as reference/target information for model development and evaluation.

The project includes AQI observations associated with monitoring stations such as:

- MIDC Chikalthana
- More Chowk / Waluj
- Rachnakar Colony

## Weather Data

Weather information is used to represent atmospheric conditions affecting air pollution.

Important variables include:

- Temperature
- Maximum temperature
- Minimum temperature
- Relative humidity
- Wind speed
- Wind direction
- Precipitation
- Surface pressure
- Dew point

## Satellite Data

Satellite-derived environmental information is part of the heterogeneous data pipeline.

The project has worked with satellite-derived variables including:

- Aerosol Optical Depth
- NO2
- CO
- HCHO

Satellite data provides additional spatial information where ground monitoring coverage is limited.

## ERA5 / Atmospheric Data

ERA5-based atmospheric information is integrated into the backend data pipeline for current prediction workflows.

When a requested date is not available from the latest atmospheric dataset, the backend can fall back to the latest available date rather than immediately failing the prediction request.

---

# Data Integration Pipeline

1. **Data Collection** — Ground AQI, weather, and satellite data
2. **Data Alignment** — Align datasets by date and location
3. **Station Matching** — Match AQI observations with corresponding stations
4. **Geographic Mapping** — Map data to the six prediction zones
5. **Feature Engineering** — Generate relevant environmental features
6. **Feature Preparation** — Prepare 21 model features
7. **AQI Prediction** — Apply the Gradient Boosting model
8. **Output** — Generate zone-wise predicted AQI
---

# Agent-Based Self-Evolution

One of the central ideas behind HetEvoAgent is the use of an agent-based feedback mechanism.

It is important to distinguish two components:

### Prediction Model

The Gradient Boosting Regressor is responsible for generating the numerical AQI prediction.

### Agent Layer

The agent layer is responsible for evaluating prediction behavior and managing feedback, learning, reward/penalty concepts, strategy, and memory.

Therefore:

Prediction Model ≠ Entire Agent

- Prediction Model → Generates AQI
- Agent Layer → Evaluates prediction → Calculates feedback → Reward / Penalty → Learning / Strategy → Memory / Evolution

---

# Self-Evolution Feedback Loop

1. Prediction
2. Actual AQI becomes available
3. Prediction vs Actual
4. Error Evaluation
5. Performance Evaluation
6. Reward / Penalty
7. Feedback Controller
8. Learning
9. Strategy
10. Agent Memory
11. Future Decision / Evolution

The purpose of this architecture is to maintain feedback about prediction performance and use that information for future decision-making and evolution.

---

# Agent Components

The backend contains dedicated modules for the agent-based architecture.

```text
agent/
```text
├── agent.py
├── agent_memory.py
├── evaluator.py
├── feedback_controller.py
├── firebase_agent.py
├── learning.py
├── reward.py
├── run_agent.py
├── strategy.py
└── __init__.py
```

### Agent

Coordinates the overall agent behavior.

### Agent Memory

Maintains relevant information from previous agent interactions and learning cycles.

### Evaluator

Evaluates prediction performance and provides feedback to the system.

### Feedback Controller

Controls how evaluation feedback is passed into the agent's decision-making process.

### Reward

Represents positive or negative feedback associated with prediction performance.

### Learning

Handles learning-related logic of the agent.

### Strategy

Manages strategy-related decisions within the agent architecture.

### Firebase Agent

Provides integration between the agent layer and Firebase-related persistence.

---

# Prediction Evaluation

The self-evolution concept depends on comparing:

Predicted AQI
      vs.
Actual AQI

Common regression metrics relevant to evaluating AQI prediction include:

### Mean Absolute Error (MAE)

Measures the average absolute difference between predicted and actual values.

### Root Mean Squared Error (RMSE)

Penalizes larger prediction errors more heavily.

### Mean Absolute Percentage Error (MAPE)

Measures prediction error relative to actual values.

### R² Score

Measures how much of the variation in the target variable is explained by the model.

These metrics can be used by the evaluation layer to determine prediction quality and generate feedback.

---

# Firebase / Firestore Integration

HetEvoAgent uses Firebase Firestore as a persistence layer.

Firebase integration allows the backend to store and retrieve application information without requiring a traditional relational database server.

The system can use Firestore for information such as:

- Prediction records
- Zone information
- Environmental records
- Agent-related information
- Historical prediction data
- Feedback/evolution information

The exact collection structure can evolve with the implementation.

---

# Backend Architecture

The backend is built using FastAPI.

The backend acts as the central communication layer between the frontend, machine-learning model, data services, external data sources, and Firebase.

1. Frontend
2. REST API
3. FastAPI
4. Prediction Service and Weather Service
5. Model Service
6. Gradient Boosting Model
7. Predicted AQI
8. Firebase persistence
9. Frontend response and visualization

---

# API Layer

The FastAPI backend exposes APIs under the /api/v1/ structure.

Important backend modules include:

```text
app/
```text
├── main.py
├── api/
│   └── routes/
│       ├── analytics.py
│       ├── health.py
│       ├── predictions.py
│       ├── weather.py
│       └── zones.py
├── integrations/
│   ├── api_collector.py
│   ├── era5_collector.py
│   └── sentinel5p_collector.py
├── schemas/
│   ├── prediction.py
│   ├── weather.py
│   └── zone.py
├── services/
│   ├── data_service.py
│   ├── firebase_service.py
│   ├── model_service.py
│   ├── prediction_service.py
│   ├── weather_service.py
│   └── zone_service.py
└── utils/
    ├── aqi_utils.py
    ├── feature_engineering.py
    ├── geo_utils.py
    └── weather_adapter.py
```

---

# Main Prediction API

The prediction endpoint is:

POST `/api/v1/predictions/predict`

Example request:

```json
{
    "zone_name": "Chikalthana MIDC",
    "date": "2026-09-27"
}
```

The backend then:

1. Validates the requested zone.
2. Processes the requested date.
3. Retrieves the required environmental information.
4. Generates the required model features.
5. Loads the trained Gradient Boosting model.
6. Generates the AQI prediction.
7. Stores the prediction information where configured.
8. Returns the prediction to the frontend.

---

# Zones API

The frontend communicates with:

GET `/api/v1/zones/`

This endpoint provides the configured prediction zones.

The zone information includes:

zone_id
zone_name
zone_type
latitude
longitude

---

# Health Check

The backend provides a health endpoint:

GET `/health`

This can be used to verify whether the FastAPI backend is running.

---

# Frontend Architecture

The frontend is built using:

- React
- Next.js
- TypeScript
- Tailwind CSS
- Leaflet
- React Leaflet
- Recharts
- Lucide React

The frontend communicates with the FastAPI backend through REST APIs.

---

# Frontend Features

### Live AQI Monitoring

Displays current prediction-related information for configured zones.

### AQI Prediction

Allows users to request AQI predictions for a selected zone and date.

### Pollution Heatmap

Visualizes AQI conditions spatially across the prediction zones.

### Reports

Provides historical and analytical information.

### AI Insights

Provides a dedicated interface for interpreting AQI-related information.

### Zone Visualization

Uses geographic coordinates and map components to represent prediction zones.

---

# Heatmap Visualization

The system uses geographic information to visualize AQI conditions.

1. Zone Coordinates + Zone AQI
2. AQI Classification
3. Geographic Visualization
4. Pollution Heatmap

This makes it easier to identify:

- Higher pollution zones
- Lower pollution zones
- Spatial variation
- Industrial vs residential patterns
- Changes in predicted AQI

---

# Project Structure

```text
HetEvoAgent/
```text
├── README.md
├── .gitignore
├── LICENSE
├── HetEvoAgent_Backend/
│   ├── agent/
│   │   ├── agent.py
│   │   ├── agent_memory.py
│   │   ├── evaluator.py
│   │   ├── feedback_controller.py
│   │   ├── firebase_agent.py
│   │   ├── learning.py
│   │   ├── reward.py
│   │   ├── run_agent.py
│   │   └── strategy.py
│   ├── app/
│   │   ├── api/
│   │   ├── integrations/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── config/
│   │   └── zones_config.json
│   ├── firebase/
│   ├── models/
│   │   └── gradient_boosting_aqi_model.pkl
│   ├── predictions/
│   ├── scripts/
│   │   ├── generate_predictions.py
│   │   ├── prepare_data.py
│   │   ├── test_model.py
│   │   └── validate_data.py
│   ├── tests/
│   ├── requirements.txt
│   └── run.py
├── HetEvoAgent_Frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.mjs
│   ├── tailwind.config.js
│   └── tsconfig.json
└── docs/
```

---

# Technology Stack

## Backend

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| FastAPI | Backend REST API |
| Uvicorn | ASGI server |
| Pandas | Data processing |
| NumPy | Numerical computation |
| Scikit-learn | Machine learning |
| Joblib | Model serialization |
| Firebase Admin SDK | Firebase integration |
| Firestore | Persistent data storage |
| Requests | API communication |
| Xarray | Atmospheric/environmental data processing |
| NetCDF4 | NetCDF data handling |
| cftime | Climate/time-series date handling |

## Frontend

| Technology | Purpose |
|---|---|
| React | UI development |
| Next.js | Frontend framework |
| TypeScript | Type-safe development |
| Tailwind CSS | UI styling |
| Leaflet | Geographic visualization |
| React Leaflet | React map integration |
| Recharts | Charts and analytics |
| Lucide React | UI icons |

---

# Environment Variables

Sensitive credentials must never be committed to GitHub.

Backend environment variables include:

```env
CPCB_API_KEY=
OPENWEATHER_API_KEY=
COPERNICUS_CLIENT_ID=
COPERNICUS_CLIENT_SECRET=
ERA5_API_KEY=
CDSE_CLIENT_ID=
CDSE_CLIENT_SECRET=
```

Create the required .env file locally.

Do NOT upload:

.env
.env.local
.env.development.local
Firebase service-account JSON files
API keys
Client secrets
Private credentials

A safe .env.example file can be committed instead.

---

# Local Development Setup

## 1. Prerequisites

Install:

- Python 3.11
- Node.js
- npm
- Git
- Firebase project
- Required API credentials

Python 3.11 is recommended for the current backend environment.

---

## 2. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd HetEvoAgent
```

---

## 3. Backend Setup

cd HetEvoAgent_Backend

Create a Python 3.11 virtual environment:

```bash
py -3.11 -m venv venv
```

Activate it:

```bash
.\venv\Scripts\Activate.ps1
```

Verify Python:

```bash
python --version
```

Expected:

Python 3.11.x

---

## 4. Install Backend Dependencies

```bash
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

---

## 5. Configure Backend Environment Variables

Create:

HetEvoAgent_Backend/.env

Add the required credentials:

```env
CPCB_API_KEY=
OPENWEATHER_API_KEY=
COPERNICUS_CLIENT_ID=
COPERNICUS_CLIENT_SECRET=
ERA5_API_KEY=
CDSE_CLIENT_ID=
CDSE_CLIENT_SECRET=
```

Use the actual values only on your local machine.

---

## 6. Firebase Configuration

Configure the Firebase project according to your environment.

The Firebase service-account credentials must remain local and must not be committed to GitHub.

The backend uses Firebase Admin functionality to communicate with Firestore.

---

## 7. Run the Backend

From HetEvoAgent_Backend:

```bash
python -m uvicorn app.main:app --reload
```

The backend should be available at:

`http://127.0.0.1:8000`

FastAPI documentation:

`http://127.0.0.1:8000`/docs

---

## 8. Verify Backend

Open:

`http://127.0.0.1:8000``/health`

---

## 9. Frontend Setup

Open another terminal:

cd HetEvoAgent_Frontend

Install dependencies:

```bash
npm install
```

---

## 10. Configure Frontend Environment

Create the required local environment file.

Example:

```env
NEXT_PUBLIC_API_URL=`http://127.0.0.1:8000`
```

---

## 11. Run the Frontend

```bash
npm run dev
```

Open the frontend URL shown by Next.js.

---

# Complete Prediction Flow

1. User selects Zone and Prediction Date
2. Frontend
3. POST `/api/v1/predictions/predict`
4. FastAPI
5. Prediction Service
6. Weather / Environmental Data
7. Feature Engineering
8. 21 Features
9. Gradient Boosting Regressor
10. Predicted AQI
11. Firebase
12. FastAPI Response
13. Frontend
14. AQI Display / Map / Insights

---

# Self-Evolution Flow

1. Prediction
2. Actual AQI becomes available
3. Prediction vs Actual
4. Error Calculation
5. Performance Evaluation
6. Reward / Penalty
7. Feedback Controller
8. Learning
9. Strategy
10. Agent Memory
11. Future Decision / Evolution

---

# Important Model Design Decision

The current trained Gradient Boosting model uses exactly these 21 inputs:

- `T2M`
- `T2M_MAX`
- `T2M_MIN`
- `RH2M`
- `WS10M`
- `WD10M`
- `PRECTOTCORR`
- `PS`
- `T2MDEW`
- `year`
- `month`
- `day`
- `day_of_week`
- `day_of_year`
- `month_sin`
- `month_cos`
- `day_of_year_sin`
- `day_of_year_cos`
- `latitude`
- `longitude`
- `distance_km`

This list should remain synchronized between:

1. Training Pipeline
2. Feature Engineering
3. Saved Model
4. Backend Prediction Service

Changing feature names, order, or preprocessing without retraining or updating the model can result in incorrect predictions.

---

# Model Artifact

The trained model is stored locally as:

HetEvoAgent_Backend/models/gradient_boosting_aqi_model.pkl

If the model artifact is excluded from the GitHub repository, developers must place the trained model in the expected models/ directory before running prediction functionality.

The model file should remain synchronized with the 21-feature definition.

---

# Testing

The backend contains testing and validation utilities under:

HetEvoAgent_Backend/tests/

and:

HetEvoAgent_Backend/scripts/

Useful scripts include:

test_model.py
validate_data.py
prepare_data.py
generate_predictions.py

These utilities can be used during development to validate datasets, model behavior, and prediction generation.

---

# Data Preparation

The data preparation pipeline combines relevant environmental datasets and produces structured data suitable for model development.

The workflow includes:

1. Raw Data
2. Validation
3. Cleaning
4. Date Standardization
5. Station / Zone Mapping
6. Dataset Merging
7. Feature Engineering
8. Model Dataset

---

# Frontend ↔ Backend Integration

The frontend communicates with the backend using REST APIs.

The API abstraction is maintained in:

HetEvoAgent_Frontend/lib/api.ts

The frontend uses the backend for:

- Zone information
- AQI predictions
- Weather information
- Health/status checks
- Analytical services

This separation keeps the frontend presentation layer independent from backend prediction logic.

---

#  Data Persistence

The system uses Firebase Firestore to maintain persistent information.

A conceptual Firestore structure can include:

Firestore
```text
│
├── zones
├── predictions
├── actual_data
├── raw_data
└── self_evolution_logs
```

The exact collection structure can evolve as the backend implementation develops.

---

# Design Principles

## 1. Modularity

The backend is divided into:

- APIs
- Services
- Integrations
- Schemas
- Utilities
- Agent components

## 2. Separation of Concerns

Frontend → API → Services → Model / Data / Firebase

## 3. Hyper-Local Intelligence

The system provides zone-level AQI predictions instead of a single city-wide prediction.

## 4. Heterogeneous Data Integration

Different environmental data sources are integrated into a common prediction pipeline.

## 5. Feedback-Driven Intelligence

Prediction performance is fed back into the agent layer to support evaluation and future improvement.

## 6. Extensibility

The architecture allows future additions such as:

- Additional prediction zones
- Additional environmental variables
- Additional ML models
- Advanced model retraining
- More satellite products
- Traffic data
- Additional health-alert logic
- Mobile applications

---

# Current Implementation vs Future Evolution

The current implementation contains:

- Six prediction zones
- Gradient Boosting AQI model
- 21 model features
- FastAPI backend
- React/Next.js frontend
- Firebase integration
- Weather/environmental integrations
- AQI prediction API
- Zone API
- Agent modules
- Evaluation and feedback components
- Heatmap visualization

Future versions can extend the system toward more autonomous model evolution.

---

# Limitations

### Data Dependency

Prediction quality depends on the quality, availability, consistency, and timeliness of external environmental datasets.

### Limited Ground Stations

Ground AQI observations are available only at specific monitoring locations, creating a challenge when validating hyper-local predictions.

### Satellite Data Availability

Satellite observations may contain missing values because of cloud cover, acquisition frequency, spatial limitations, or processing constraints.

### Model Generalization

A model trained using historical environmental conditions may not perfectly represent unusual or previously unseen atmospheric conditions.

### Self-Evolution

The agent/self-evolution architecture is an ongoing component of the project. More historical prediction-versus-observation cycles are required to evaluate long-term autonomous adaptation robustly.

### Internet Dependency

Some data collection and external API functionality requires network connectivity.

---

# Future Scope

## 1. Advanced Autonomous Retraining

Detect performance degradation, trigger retraining, validate the new model, compare models, and deploy an improved model.

## 2. Model Drift Detection

Implement formal concept-drift and data-drift detection.

## 3. Ensemble Models

Compare the current Gradient Boosting model with:

- Random Forest
- XGBoost
- LightGBM
- Neural Networks
- LSTM-based forecasting
- Hybrid models

## 4. More Prediction Zones

Expand from six zones to a finer-grained geographic grid.

## 5. Traffic Data Integration

Integrate traffic density as an additional predictor.

## 6. More Satellite Variables

Integrate additional satellite-derived atmospheric variables.

## 7. Advanced Geospatial Modeling

Investigate:

- Spatial interpolation
- IDW
- Kriging
- Geospatial neural networks
- Spatial-temporal forecasting

## 8. Mobile Application

Develop a lightweight mobile application for citizens.

## 9. Explainable AI

Provide explanations for the main environmental factors influencing predictions.

Example:

Predicted AQI: 91

Potential contributing factors:
- Temperature
- Wind conditions
- Humidity
- Geographic context
- Seasonal pattern

---

# Social & Environmental Impact

Potential applications include:

- Citizen awareness
- Urban planning
- Environmental monitoring
- Public-health awareness
- Industrial monitoring
- Pollution trend analysis
- Academic research
- Smart-city applications

By moving from city-wide AQI toward zone-level AQI intelligence, HetEvoAgent aims to make environmental information more spatially meaningful.

---

# Academic & Research Value

HetEvoAgent combines:

Machine Learning
+ Data Engineering
+ Agentic AI
+ Feature Engineering
+ Geospatial Computing
+ Environmental Data
+ Backend Engineering
+ Frontend Engineering
+ Cloud Database

The project demonstrates the application of AI and software engineering to a real-world environmental problem.

---


# Collaboration Model

The project is maintained as a complete team repository containing:

Backend
+ Frontend
+ Configuration
+ Documentation

Example branches:

feature/model-training
feature/api-scheduler
feature/firebase
feature/frontend
feature/agent-evolution
feature/integration

Team members can contribute through separate branches and pull requests so individual contributions remain transparent.

---

# Repository Guidelines

Before committing code, make sure the repository does not contain:

.env
.env.local
.env.development.local
Firebase service-account credentials
API keys
Client secrets
Private credentials
node_modules
.next
Python virtual environments
Temporary datasets
Local caches

Never commit passwords, API keys, private tokens, or Firebase service-account credentials.

---

# Security

HetEvoAgent uses external services that require credentials.

Credentials should always be stored through environment variables or secure secret-management mechanisms.

Example:

```env
CPCB_API_KEY=your_key
ERA5_API_KEY=your_key
COPERNICUS_CLIENT_SECRET=your_secret
```

The values above are examples only.

Actual credentials must remain outside version control.

---

# Documentation

Recommended documentation structure:

```text
docs/
```text
│
├── architecture/
│   ├── high-level-architecture.md
│   └── low-level-architecture.md
│
├── model/
│   ├── feature-engineering.md
│   └── model-details.md
│
├── api/
│   └── api-reference.md
│
├── data/
│   └── data-pipeline.md
│
└── agent/
    └── self-evolution.md
```

The README provides the high-level technical overview, while detailed documents can explain individual components.

---

# Quick Start

## Backend

cd HetEvoAgent_Backend

```bash
py -3.11 -m venv venv
```

```bash
.\venv\Scripts\Activate.ps1
```

python -m pip install --upgrade pip

python -m pip install -r requirements.txt

```bash
python -m uvicorn app.main:app --reload
```

## Frontend

Open another terminal:

cd HetEvoAgent_Frontend

```bash
npm install
```

```bash
npm run dev
```

Then open the frontend URL shown by Next.js.

---

# Example Development Workflow

1. Collect Data
2. Validate Data
3. Clean Data
4. Engineer Features
5. Train / Load Model
6. Generate Prediction
7. Store Result
8. Visualize Result
9. Compare With Actual AQI
10. Evaluate Error
11. Generate Feedback
12. Update Agent State

---

# Conclusion

HetEvoAgent is a hyper-local AQI prediction platform designed for Chhatrapati Sambhajinagar.

The system combines environmental data integration, feature engineering, machine learning, geographic context, agent-based feedback, Firebase persistence, FastAPI services, and a modern web dashboard.

The current prediction pipeline uses a Gradient Boosting Regressor with 21 engineered features and produces zone-wise AQI predictions across six representative areas of the city.

The broader agent architecture adds a layer beyond conventional prediction systems by evaluating prediction behavior and maintaining feedback through evaluation, reward/penalty, learning, strategy, and memory components.

The long-term vision is to evolve HetEvoAgent into a more autonomous environmental intelligence platform capable of detecting changes in environmental patterns, evaluating model performance, and continuously improving its prediction pipeline.

---

# Vision

> From city-wide AQI monitoring to intelligent, hyper-local environmental prediction.

HetEvoAgent aims to demonstrate how modern AI, machine learning, data engineering, geospatial intelligence, and agent-based systems can work together to address real-world environmental challenges.

---

# Project Status

Status: Active Development

Domain: Artificial Intelligence / Machine Learning / Environmental Technology

Application: Hyper-Local AQI Prediction

Location: Chhatrapati Sambhajinagar, Maharashtra, India

Prediction Zones: 6

ML Model: Gradient Boosting Regressor

Model Features: 21

Backend: FastAPI

Frontend: React + Next.js

Database: Firebase Firestore

Languages: Python / TypeScript

Agent Layer: Evaluation + Feedback + Reward/Penalty + Learning + Strategy + Memory

---
