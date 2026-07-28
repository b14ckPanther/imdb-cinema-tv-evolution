# IMDb Cinema & TV Evolution Explorer (1920–2025)

## Course Context
- **Course**: Information Visualization (תשפ״ו)
- **Selected Dataset**: IMDb Non-Commercial Datasets (Official dump from IMDb)

## Project Overview
An interactive web application built with **Vite, Vanilla JavaScript (ES Modules), D3.js (v7), and Vanilla CSS** to visualize rating, runtime, popularity, and genre dynamics across 58,990 feature movies and TV series (1920–2025).

## Current Project Status
- **Source Control**: Copied into local GitHub Desktop repository (`/Users/zangeel/Documents/GitHub/imdb-cinema-tv-evolution`).
- **Build Status**: Local Vite 8.1.5 production build **PASSED** (`npm run build`).
- **Functional Readiness**: 18 / 18 functional workflows verified on local preview (`npm run preview`).
- **Deployment Status**: **NOT YET DEPLOYED — VERCEL DEPLOYMENT PENDING**.
- **Live Production URL**: **None currently active** (Vercel deployment pending user approval).

---

## Directory Structure
```
imdb-cinema-tv-evolution/
├── index.html                  # HTML5 application shell & controls
├── package.json                # Dependencies (vite ^8.1.5, d3 ^7.9.0)
├── package-lock.json           # Deterministic dependency lockfile
├── vite.config.js              # Vite configuration (base: '/')
├── README.md                   # Project overview & status
├── .gitignore                  # Git rules ignoring node_modules, dist, .venv, raw TSVs
├── docs/                       # Project documentation reports (Stages 1 through 6)
│   ├── requirements_checklist.md
│   ├── stage_1_summary.md
│   ├── stage_1_verification.md
│   ├── stage_2a_web_architecture_decision.md
│   ├── stage_2b_research_question_decision.md
│   ├── stage_3_prototype_validation.md
│   ├── stage_4_implementation_report.md
│   ├── stage_5_final_verification_report.md
│   └── stage_6_deployment_readiness_report.md
├── scripts/                    # Python preprocessing & audit scripts
│   ├── preprocess_data.py      # Reproducible dataset extraction pipeline
│   └── audit_imdb_data.py      # IMDb TSV streaming auditor
├── src/                        # Web application source code
│   ├── assets/                 # CSS design system (main.css, components.css)
│   ├── charts/                 # D3 chart modules (scatterplot, timeline, breakdown, tooltip)
│   ├── data/                   # Preprocessed JSON analytical extracts
│   │   ├── summary_titles.json # 58,990 analytical titles (5.16 MiB / 5.40 MB)
│   │   ├── genres_summary.json # Genre lookup & decade metrics
│   │   └── data_metrics.json   # Pipeline metrics
│   ├── state/                  # Central event-driven store (store.js)
│   ├── ui/                     # UI control panel & modal handlers
│   └── main.js                 # App entry point with Vite asset URL imports
└── outputs/                    # Audit logs & machine-readable outputs
```

---

## Local Development & Build Execution

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build production bundle locally
npm run build

# 4. Preview static production build
npm run preview
```
