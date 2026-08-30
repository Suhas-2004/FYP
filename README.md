# ICLAS — Intelligent Corporate & Leadership Advisory System

<div align="center">

![ICLAS Banner](https://img.shields.io/badge/ICLAS-Corporate%20Intelligence%20%26%20Turnaround%20System-06b6d4?style=for-the-badge&logo=shield&logoColor=white)

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/Alternative%20Backend-Python%20FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Transforming historical corporate crisis playbooks and 6-year longitudinal financial intelligence into structured, empirical decision heuristics for founders, corporate leaders, and investors.**

[Explore Modules](#-core-intelligence-modules) • [Quick Start](#-quick-start) • [Architecture](#-system-architecture) • [API Reference](#-api-endpoints)

</div>

---

## 📖 Overview

**ICLAS** (*Intelligent Corporate & Leadership Advisory System*) is a full-stack corporate intelligence, turnaround decision support, and startup-investor matchmaking platform. 

The system analyzes real-world corporate crises, operational bottlenecks, macro shocks, and financial distress patterns, bridging early-stage startup failure modes with proven multinational corporate (MNC) survival playbooks.

---

## 🌟 Core Intelligence Modules

### 1. 💀 Vanished Startups vs. MNC Turnarounds (`Startup Intel`)
- **Empirical Failure Post-Mortems**: 12 iconic real-world startups that collapsed despite groundbreaking futuristic ideas (e.g. *Better Place, Pebble, Quibi, Convoy, Fisker, Webvan, Jawbone, Fast, Solyndra, Katerra, Rdio, Theranos*).
- **MNC Crisis Precedents**: Matches each startup's fatal crisis point directly to established corporations (*Tesla, Apple, Netflix, Block, Ford, Best Buy, LEGO, PayPal, Marvel, Opendoor, Teladoc*) that conquered the identical crisis.
- **Actionable Turnaround Playbooks**: Concrete tactical maneuvers, capital structures, and operational strategies deployed by MNCs to achieve multi-billion-dollar scale.
- **Dual View Modes**: Interactive **Side-by-Side Split Cards** and **Structured Matrix Table** with real-time sector & crisis filtering and deep-dive modal analysis.

### 2. 🏛️ 6-Year Longitudinal Corporate Intelligence (`Companies Intel`)
- **Historical Analysis (2019 – 2024)**: 6-year financial performance, revenue growth, net income, ROE, debt trajectories, and cash flows.
- **Downfalls, Pumps & Rebounds**: Structured narratives dissecting major operational moves, supply chain disruptions, product supercycles, and macro adaptations.
- **Business R&D & Strategic Profiles**: Major ongoing projects, corporate investments, joint ventures, and leadership dossiers.

### 3. 🔍 Case-Based Crisis Similarity Search (`Search Condition`)
- **Vector / Keyword Similarity Matcher**: Input any operational distress condition (e.g., *“High debt with 90 days runway”*, *“Hardware manufacturing automation bottleneck”*, *“Post-pandemic subscriber churn”*).
- **Empirical Benchmarking**: Computes similarity scores against verified historical turnaround precedents and provides instant recommended counter-strategies.

### 4. 📋 3-Phase Tactical Strategy Roadmap (`Strategy Steps`)
- **Structured Execution Phases**:
  - **Phase 1: Immediate Triage (Days 1–30)**: Liquidity preservation, dependency audits, and cash bleed containment.
  - **Phase 2: Structural Transformation (Days 31–90)**: SKU rationalization, contract renegotiations, and headcount / unit economics alignment.
  - **Phase 3: Sustainable Moat & Scale (Days 91–180+)**: High-margin recurring revenue models and long-term defensibility.
- **Executive PDF Export**: Generates client-ready advisory reports with 1-click PDF download via `jsPDF` and `html2canvas`.

### 5. 🤝 Investors & Startups Dealflow Hub (`Investors & Startups`)
- **Pitch Registration**: Form for early-stage founders to submit startup ideas, problem statements, target market sizing, and capital requirements.
- **Dealflow Curation**: Real-time filtering by industry vertical and potential rating.
- **Investor Inquiry Dispatch**: Direct contact engine routing investor inquiries and ticket proposals to startup founders.

### 6. 📈 Graph Analysis & Predictive Signals (`Graph Analysis`)
- Interactive multi-dimensional financial metrics, revenue vs. net income growth trajectory visualizations, and market trend forecasts.

---

## 🛠️ System Architecture & Tech Stack

```
FYP (Root)
├── backend/                  # API Services & Corporate Data
│   ├── data/                 # 6-Year Longitudinal Data & Startups Repositories
│   │   ├── companies_data.json
│   │   ├── startups_data.json
│   │   └── investor_inquiries.json
│   ├── routers/              # Modular API Route Handlers (Node.js & Python)
│   │   ├── startups.js / startups.py
│   │   ├── companies.js / companies.py
│   │   ├── crisis.js / crisis.py
│   │   ├── overview.js / overview.py
│   │   └── market.js / market.py
│   ├── services/             # Similarity Engine & Financial Modelers
│   └── server.js             # Express API Server (Port 8000)
│
├── frontend/                 # Reactive SPA UI
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, Logo, MotionReveal, Header)
│   │   ├── pages/            # 8 Core Platform Intelligence Views
│   │   │   ├── About.jsx
│   │   │   ├── Overview.jsx
│   │   │   ├── Companies.jsx
│   │   │   ├── StartupIntel.jsx
│   │   │   ├── SearchCondition.jsx
│   │   │   ├── StrategySteps.jsx
│   │   │   ├── InvestorsStartups.jsx
│   │   │   └── GraphAnalysis.jsx
│   │   └── services/         # API Service Client (`api.js`)
│   └── vite.config.js        # Vite Build Configuration
│
└── run_project.ps1           # 1-Click Dual-Server Launcher Script
```

### Technology Highlights:
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, jsPDF, html2canvas.
- **Backend (Node.js / Express)**: Express.js, CORS, File-backed JSON persistence, RESTful routing.
- **Alternative Backend (Python / FastAPI)**: FastAPI, Pydantic schemas, Uvicorn ASGI server.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [Python 3.10+](https://www.python.org/) *(optional, if using FastAPI backend)*

### 1-Click Launch (Windows PowerShell)
Run the automated launcher script from the root directory:
```powershell
./run_project.ps1
```
This automatically starts:
- **Backend Server**: `http://127.0.0.1:8000`
- **Frontend Client**: `http://localhost:5173`

---

### Manual Launch

#### 1. Start the Backend:
```bash
cd backend
npm install
npm run dev
```

#### 2. Start the Frontend:
```bash
cd frontend
npm install
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/startups/intel/evidence-matrix` | Returns the 12 vanished startups vs. MNC turnaround dataset |
| `GET` | `/api/companies` | List all 6-year company intelligence dossiers with sector filtering |
| `GET` | `/api/companies/:companyId` | Retrieve complete 6-year longitudinal financial data for a company |
| `GET` | `/api/crisis/search?q={query}` | Search similar historical corporate crises using cosine similarity |
| `GET` | `/api/crisis/strategy/:companyId` | Retrieve phased 3-stage turnaround roadmap for an MNC |
| `GET` | `/api/startups` | Retrieve registered startup pitches with industry & rating filters |
| `POST` | `/api/startups/submit` | Register a new startup pitch into the repository |
| `POST` | `/api/startups/contact` | Dispatch an investor inquiry to a startup founder |
| `GET` | `/api/overview/metrics` | Retrieve aggregate platform turnaround and market statistics |

---

## 📊 Empirical Case Study Matrix Preview

| Vanished Visionary Startup | Futuristic Breakthrough | Fatal Crisis Mechanism | Matched MNC Precedent | Turnaround Strategy Deployed |
|---|---|---|---|---|
| **Better Place** | Robotic 3-min EV battery swapping | High CapEx burn without OEM standardization | **Tesla, Inc. (2018)** | Proprietary Supercharger network & agile manual tent assembly |
| **Pebble** | First open e-paper smartwatch (7-day battery) | Platform giant entry & channel margin squeeze | **Apple Inc. (1997)** | Steve Jobs 2x2 matrix pruning & $150M Microsoft bridge |
| **Quibi** | $100k/min mobile quick bites with Turnstyle | Rigid paywall with zero viral social sharing | **Netflix (2011 & 2022)** | In-house studio IP moat, paid sharing & $6.99 ad tier |
| **Convoy** | "Uber for Trucking" algorithmic broker | Freight spot rate crash against bloated payroll | **Block, Inc. (2023)** | Rigid 12k headcount ceiling & Rule of 40 GAAP discipline |
| **Fisker** | Solar-roof luxury eco-EVs | Contract manufacturing quality bugs & inventory debt | **Ford (2008 & 2023)** | Preemptive $23.6B mortgage buffer & Ford Pro hybrid cash cows |
| **Webvan** | Automated robotic 30-min grocery delivery | Geo-expansion before proving local unit economics | **Best Buy (2012)** | "Renew Blue" price matching & store-within-a-store leasing |
| **Fast** | Universal 1-click passwordless checkout | $10M/mo vanity sponsorship burn on $600k ARR | **PayPal (2022)** | Killed referral cash bounties & scaled B2B unbranded checkout |
| **Solyndra** | Cylindrical 360-degree CIGS thin-film solar | Silicon price crash rendered custom tubes obsolete | **Marvel (1996)** | Merged with Toy Biz, non-recourse studio film facility & MCU |

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Built with ❤️ for Founders, Corporate Turnaround Strategists, and Investors.<br />
© 2026 ICLAS Platform • Intelligent Corporate & Leadership Advisory System
</div>
