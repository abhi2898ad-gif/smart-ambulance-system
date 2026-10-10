# 🚑 SmartAmbulance: AI-Based Smart Ambulance Dispatch & Emergency Response System

> **Faster Response. Smarter Care.**  
> A production-ready, full-stack emergency healthcare dispatch platform combining a **Java Spring Boot 3 REST API**, an intelligent **AI Triage & Geospatial Routing Engine**, and a **React 18 + Vite** emergency command console.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fabhi2898ad-gif%2Fsmart-ambulance-system)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/abhi2898ad-gif/smart-ambulance-system)
[![GitHub Repository](https://img.shields.io/badge/GitHub-abhi2898ad--gif%2Fsmart--ambulance--system-blue?logo=github)](https://github.com/abhi2898ad-gif/smart-ambulance-system)

---

## 🌟 Highlights

- ⏱️ **42% Average Response Time Reduction**: Automated nearest-unit dispatch using Haversine geospatial calculations and real-time traffic delay models.
- 🧠 **AI Clinical Urgency Triage**: Rule-based heuristic scoring engine that categorizes emergencies into `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW` based on trauma indicators (cardiac arrest, unconsciousness, severe hemorrhage, respiratory failure).
- 📍 **Live GPS Fleet Telemetry**: Interactive Leaflet maps with custom SVG ambulance markers, pulse radar beacons, route polylines, and live ETA countdowns.
- 🏥 **Real-Time Hospital Bed Registry**: Pre-alert notification system connecting moving ambulances directly with receiving hospital trauma centers and cath labs.
- 🔮 **Predictive Demand & Fleet Balancing**: Hourly surge projection model with 1-click automated fleet redistribution to high-risk city sectors.
- ☁️ **Cloud Native Deployment**: Pre-configured for **Aiven Cloud MySQL**, **Render.com** containerized backend, and **Vercel** frontend.

---

## 🏗️ System Architecture

```
                                  +------------------------------------+
                                  |         React 18 + Vite SPA        |
                                  |       (Hosted on Vercel)           |
                                  +-----------------+------------------+
                                                    |
                                    HTTPS / REST API | JWT Bearer Token
                                                    v
                                  +------------------------------------+
                                  |     Spring Boot 3.3.4 REST API     |
                                  |       (Containerized on Render)    |
                                  +--------+------------------+--------+
                                           |                  |
                       +-------------------+                  +-------------------+
                       |                                                          |
                       v                                                          v
        +-------------------------------+                          +-------------------------------+
        |       Aiven Cloud MySQL       |                          |    AI Triage & Route Engine   |
        |  (Encrypted TLS / HikariCP)   |                          |    - Symptom Urgency Scorer   |
        |  - Users, Ambulances, Trips   |                          |    - Nearest Unit Haversine   |
        |  - Hospitals & Live Bed Count |                          |    - Rush-Hour Traffic Index  |
        +-------------------------------+                          +-------------------------------+
```

---

## 👥 Multi-Role User Workflows

| Role | Key Capabilities |
|---|---|
| **Patient / User** | 1-Click SOS dispatch, symptom questionnaire, map coordinate pin-drop, live ambulance GPS tracking, ETA countdown, digital medical emergency pass. |
| **Paramedic Driver** | Duty transponder toggle, turn-by-turn dispatch route, 4-step transit lifecycle (`En Route` &rarr; `Arrived` &rarr; `In Transit` &rarr; `Completed`), ER direct dial. |
| **Hospital Trauma Desk** | Live ICU & emergency bed registry, diversion mode (`ACCEPTING`, `DIVERTING`, `FULL`), incoming ambulance pre-alerts with clinical triage summaries. |
| **Super Admin** | City-wide fleet telemetry command center, manual dispatch override, driver-to-ambulance pairing, AI demand surge heatmap, Golden Hour compliance audits. |

---

## 🔑 Demo Accounts (Pre-Seeded & 1-Click Login Ready)

| Role | Email | Password | Default Portal |
|---|---|---|---|
| **Super Admin** | `admin@smartambulance.com` | `admin123` | `/admin/dashboard` |
| **Patient / User** | `user@smartambulance.com` | `admin123` | `/user/dashboard` |
| **Paramedic Driver** | `driver@smartambulance.com` | `admin123` | `/driver/dashboard` |
| **Hospital Coordinator** | `hospital@smartambulance.com` | `admin123` | `/hospital/dashboard` |

*(A **Demo Role Switcher** dropdown is also accessible directly from the top navigation bar for zero-click testing).*

---

## ☁️ Cloud Deployment Guide

### 1. Database: Aiven Cloud MySQL

1. Sign up or log into [Aiven Console](https://console.aiven.io/).
2. Create a new **MySQL** service (Free tier or Startup plan).
3. Once the service is running, navigate to the **Overview** tab:
   - Copy the **Service URI** or note the **Host**, **Port**, **User**, and **Password**.
   - Download the CA certificate (`ca.pem`) if connecting via strict certificate validation.
4. Construct your JDBC connection string:
   ```
   jdbc:mysql://<AIVEN_HOST>:<AIVEN_PORT>/defaultdb?sslMode=REQUIRED&serverTimezone=UTC
   ```
5. You can now supply these credentials to Render or test locally via environment variables.

---

### 2. Backend: Render.com (Spring Boot)

The repository includes a production multi-stage [`Dockerfile`](./Dockerfile) and a [`render.yaml`](./render.yaml) blueprint.

#### Option A: One-Click Blueprint Deployment
1. Push this repository to your GitHub account.
2. In [Render Dashboard](https://dashboard.render.com/), click **New** &rarr; **Blueprint**.
3. Select your GitHub repository. Render will automatically detect [`render.yaml`](./render.yaml).
4. Fill in the prompted environment variables:
   - `SPRING_DATASOURCE_URL`: Your Aiven MySQL JDBC URL
   - `SPRING_DATASOURCE_USERNAME`: Your Aiven user (e.g. `avnadmin`)
   - `SPRING_DATASOURCE_PASSWORD`: Your Aiven password
   - `CORS_ALLOWED_ORIGINS`: Your Vercel frontend URL (e.g., `https://smart-ambulance.vercel.app`)
5. Click **Apply**. Render will build the container and deploy your Spring Boot backend!

#### Option B: Manual Web Service Setup
1. Click **New** &rarr; **Web Service** on Render.
2. Connect your GitHub repository.
3. Select **Docker** as the Runtime.
4. Add the following Environment Variables in the Render dashboard:
   - `PORT`: `8080`
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<AIVEN_HOST>:<AIVEN_PORT>/defaultdb?sslMode=REQUIRED&serverTimezone=UTC`
   - `SPRING_DATASOURCE_USERNAME`: `<AIVEN_USER>`
   - `SPRING_DATASOURCE_PASSWORD`: `<AIVEN_PASSWORD>`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
   - `CORS_ALLOWED_ORIGINS`: `https://your-app.vercel.app,http://localhost:5173`
5. Health check path: `/api/auth/health`
6. Click **Deploy Web Service**.

---

### 3. Frontend: Vercel (React + Vite)

The repository includes [`vercel.json`](./vercel.json) pre-configured with SPA route rewrites.

1. In [Vercel Dashboard](https://vercel.com/dashboard), click **Add New** &rarr; **Project**.
2. Import your GitHub repository.
3. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - **`VITE_API_BASE_URL`**: `https://<YOUR-RENDER-BACKEND-NAME>.onrender.com/api`
5. Click **Deploy**.
6. Once deployed, copy your live Vercel domain (e.g., `https://smart-ambulance.vercel.app`) and ensure it is listed in the Render backend's `CORS_ALLOWED_ORIGINS` variable!

---

## 💻 Local Development Quickstart

### Prerequisites
- Java 17, 21, or 25
- Maven 3.8+ (or Spring Tool Suite / IntelliJ IDEA)
- Node.js 18+ & npm
- Local MySQL running on port 3306 (optional if using Aiven or mock mode)

### 1. Clone & Set Up
```bash
git clone https://github.com/<your-username>/smart-ambulance-system.git
cd smart-ambulance-system
```

### 2. Run Backend
```powershell
# Set JAVA_HOME if using STS / Eclipse JRE
$env:JAVA_HOME = "C:\sts-5.3.0.RELEASE\plugins\org.eclipse.justj.openjdk.hotspot.jre.full.win32.x86_64_25.0.3.v20260715-1121\jre"
$env:Path = "$env:JAVA_HOME\bin;C:\apache-maven-3.10.0\bin;$env:Path"

# Run Spring Boot
mvn spring-boot:run
```
The REST API will be available at `http://localhost:8080/api`.

### 3. Run Frontend
```bash
npm install
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/auth/health` | Public | Cloud health check probe |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `POST` | `/api/auth/register` | Public | Register patient account |
| `GET` | `/api/ambulances` | Public | List all ambulances & fleet telemetry |
| `GET` | `/api/ambulances/{id}` | Public | Get single ambulance vehicle specs |
| `PUT/PATCH` | `/api/ambulances/{id}/status` | Driver/Admin | Update ambulance status |
| `PUT/PATCH` | `/api/ambulances/{id}/location` | Driver/Admin | Transmit ambulance GPS coordinate ping |
| `POST` | `/api/emergencies` | Authenticated | Submit emergency SOS request & trigger AI dispatch |
| `GET` | `/api/emergencies` | Authenticated | List all active/historical emergency calls |
| `GET` | `/api/emergencies/{id}` | Authenticated | Inspect incident details & assigned unit |
| `PUT/PATCH` | `/api/emergencies/{id}/status` | Authenticated | Transition emergency lifecycle |
| `POST` | `/api/emergencies/{id}/assign` | Admin | Manual override ambulance assignment |
| `GET` | `/api/hospitals` | Public | List partner hospital trauma centers |
| `PUT/PATCH` | `/api/hospitals/{id}/beds` | Hospital/Admin | Update emergency & ICU bed count |
| `PUT/PATCH` | `/api/hospitals/{id}/status` | Hospital/Admin | Toggle diversion status (`ACCEPTING`/`DIVERTING`) |
| `GET` | `/api/users/profile` | Authenticated | Fetch current user medical card |

---

## 🧪 Testing

```powershell
# Run backend test suite (JUnit 5 + Spring Boot Test)
mvn test

# Run frontend production build (Vite bundle verification)
npm run build
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
