# Stage 2A — Web-Based Technology Track Validation & Architecture Decision Report

---

## 1. Decision Context

This document records the Stage 2A validation pass for the custom **Web-based implementation track** (HTML/CSS/JavaScript + D3.js), which is the explicit preference of the user over the Tableau track.

The purpose of Stage 2A is to:
1. Validate that a custom Web-based information visualization application is an appropriate, feasible, and responsible choice for this IMDb course project.
2. Establish a concrete, implementation-neutral frontend architecture, data delivery strategy, performance guardrails, deployment pipeline, and team workflow before any coding or preprocessing begins.
3. Incorporate the user's explicit deployment decision: **GitHub for source control and collaboration**, connected directly to **Vercel for production deployment**.
4. Ensure 100% compliance with all lecturer constraints set forth in [Instructions.pdf](file:///Users/zangeel/Downloads/FInalProject_Visualization/Instructions.pdf) and [requirements_checklist.md](file:///Users/zangeel/Downloads/FInalProject_Visualization/docs/requirements_checklist.md).

> [!NOTE]
> **Stage 2A Scope Boundary**: This document does NOT select the final research question, does NOT preprocess analytical data, does NOT write code, does NOT initialize frameworks, and does NOT deploy software. Stage 2A establishes the architecture, deployment pipeline, and risk management plan for final user review.

---

## 2. Approved Technology Preferences

The following core technology stack and infrastructure preferences have been explicitly approved:

- **Preferred Implementation Track**: Web-Based Interactive Visualization (HTML/CSS/JavaScript + D3.js).
- **Frontend Architecture**: Vite + Vanilla JavaScript (ES Modules) + D3.js (v7) + Vanilla CSS.
- **Source Control & Collaboration Repository**: **GitHub**.
- **Production Host & Deployment Platform**: **Vercel** (Connected directly to GitHub repository).

---

## 3. Web Compliance Checklist

The table below maps the proposed Web-based track directly against the lecturer's authoritative requirements from `Instructions.pdf`:

| # | Lecturer Requirement (`Instructions.pdf`) | Web Track Compliance Plan | Compliance Status |
|---|---|---|---|
| **1** | **Public Hosting & Working Link**: Application must be hosted on a server and work from any browser on any computer via a working URL. | Deploy production build artifact to **Vercel** connected to the GitHub `main` branch. Provide public live Vercel URL in final report. Test across Chrome, Firefox, Safari, and Edge. | **COMPLIANT** |
| **2** | **Non-Trivial Visualization Problem**: Expose trends, patterns, relationships, or outliers difficult to discover without visualization. | Implement a multi-view interactive dashboard with linked selections, temporal trends, and multi-attribute distribution analysis using D3.js. | **COMPLIANT** |
| **3** | **Interactive Visualization Principles**: Support interaction, multiple views, and meaningful linking between views where appropriate. | Implement Shneiderman's Information Seeking Mantra ("Overview first, zoom and filter, details on demand"), 2D brushing, cross-filtering, and hover highlights. | **COMPLIANT** |
| **4** | **Tools & Libraries Disclosure**: Report must explicitly list all tools, JS libraries, and LLM usage. | Document D3.js (v7), Vite, Vanilla JS (ESM), Python (pandas/numpy for preprocessing), GitHub, Vercel, and AI assistant interactions in the final report. | **COMPLIANT** |
| **5** | **Preprocessing Documentation**: All preprocessing steps must be documented precisely. | Maintain reproducible Python script (`scripts/preprocess_data.py`) and detail all filtering, join, aggregation, and export steps in `docs/` and final report. | **COMPLIANT** |
| **6** | **Report Length Constraint**: Final project report must not exceed 10 pages. | Structure report concisely with clear figures, diagrams, and evaluation metrics within the 10-page limit. | **COMPLIANT** |
| **7** | **Evaluation Criteria Alignment**: Evaluated on effectiveness, correctness, creativity/scope, aesthetics, and report quality. | Design a bespoke, high-aesthetic dark/glassmorphic visual theme with curated HSL color schemes, responsive SVG/Canvas layouts, and clean typographic hierarchy. | **COMPLIANT** |

---

## 4. Architecture Comparison & Evaluation

Four candidate frontend architectures were evaluated specifically for this IMDb visualization project using eight weighted criteria:

### Evaluation Criteria & Weights
1. **Compliance with Lecturer Requirements (15%)**: Ability to produce an interactive, hosted, working web link.
2. **D3 & Interaction Suitability (20%)**: Ease of integrating D3 selections, transitions, scales, axes, brushing, and zoom without DOM control conflicts.
3. **Maintainability for 3-Student Team (15%)**: Code modularity, readability, and ease of collaborative Git development.
4. **Implementation Feasibility (15%)**: Setup friction, learning curve, and dev server speed within project deadlines.
5. **Performance Suitability (10%)**: Bundle size, minification, tree-shaking, and rendering efficiency.
6. **Aesthetic & UI Control (10%)**: Precision styling control over control panels, layout grids, tooltips, and themes.
7. **Deployment Reliability (10%)**: Predictable build output and seamless automated Vercel CI/CD deployment.
8. **Risk of Over-Engineering (5%)**: Minimizing unnecessary abstractions and boilerplate.

---

### Architecture Evaluation Matrix

| Criterion (Weight) | Option 1: Plain HTML/CSS/JS + D3 | Option 2: Vite + JavaScript + D3 (RECOMMENDED) | Option 3: Vite + TypeScript + D3 | Option 4: React + D3 |
|---|---|---|---|---|
| **Lecturer Compliance (15%)** | **9 / 10** — Simple static files deploy cleanly to Vercel/GitHub Pages. | **10 / 10** — Produces optimized static bundle for instant Vercel production deployment. | **10 / 10** — Produces optimized static bundle for instant Vercel production deployment. | **10 / 10** — Standard static React SPA build on Vercel. |
| **D3 & Interaction (20%)** | **9 / 10** — Direct D3 DOM ownership without framework interference. | **10 / 10** — Direct D3 DOM ownership with ES module scope isolation. | **9 / 10** — Direct D3 DOM ownership, but D3 type definitions can be verbose. | **6 / 10** — React Virtual DOM and D3 DOM manipulation frequently conflict over node ownership. |
| **Team Maintainability (15%)** | **6 / 10** — Lacks bundler; global scope scripts make multi-developer Git merges messy. | **9 / 10** — Clean ES module imports make team feature branching easy. | **8 / 10** — Excellent type safety, but team members must all master TypeScript syntax. | **7 / 10** — Component model is clean, but state sync between React & D3 adds friction. |
| **Implementation Feasibility (15%)** | **8 / 10** — No build setup required, but manual script-tag management. | **9 / 10** — Instant dev server with HMR (`npx create-vite`) and zero initial config. | **7 / 10** — Upfront type definitions for IMDb schemas and D3 selections take setup time. | **6 / 10** — High complexity managing `useRef`/`useEffect` lifecycles for D3 updates. |
| **Performance (10%)** | **7 / 10** — No bundler optimization, minification, or tree-shaking. | **9 / 10** — Rollup bundling and tree-shaking yield minimal JS payload. | **9 / 10** — Identical compiled bundle performance to Vite + JS. | **8 / 10** — React re-render overhead can slow down dense D3 DOM updates. |
| **Aesthetic & UI Control (10%)** | **7 / 10** — Manual CSS layout without hot-reloading tooling. | **9 / 10** — Modern CSS modules / Vanilla CSS with instant HMR style feedback. | **9 / 10** — Identical styling capabilities to Vite + JS. | **9 / 10** — Access to rich UI component ecosystem. |
| **Deployment Reliability (10%)** | **10 / 10** — Static site deploys cleanly to Vercel. | **10 / 10** — Zero-config native Vite preset on Vercel (`npm run build` $\rightarrow$ `dist`). | **9 / 10** — Strict type checking during build can block quick Vercel deployments on minor type bugs. | **9 / 10** — Native Vercel deployment. |
| **Over-Engineering Risk (5%)** | **10 / 10** — Zero over-engineering risk. | **9 / 10** — Minimal tooling overhead; keeps focus on D3 visualization. | **7 / 10** — TypeScript typing for complex D3 selection chains can feel over-engineered. | **4 / 10** — High risk of over-engineering and fighting React vs D3 state lifecycles. |
| **WEIGHTED TOTAL SCORE** | **8.15 / 10** | **9.45 / 10** | **8.60 / 10** | **7.45 / 10** |

---

## 5. Recommended Architecture & Directory Structure

### Primary Recommendation: Vite + Vanilla JavaScript (ES Modules) + D3.js (v7) + Vanilla CSS

- **Frontend Build Tool**: **Vite** (Instant HMR dev server, ES module resolution, Rollup production bundler, native Vercel framework preset).
- **Language**: **Vanilla JavaScript (ES2022+ Modules)**. Avoids TypeScript overhead while retaining clean module boundaries (`import`/`export`).
- **Visualization Library**: **D3.js (v7)**. Responsible for SVG/Canvas rendering, scales, axes, shapes, zoom/brush behaviors, and color interpolations.
- **UI Shell & Controls**: **Vanilla HTML5 & CSS3** (Flexbox/Grid, CSS custom properties for dark mode design tokens, custom range sliders, dropdowns, tooltips, and detail modals).
- **State Management**: **Lightweight Event-Driven Store (`src/state/store.js`)**.
  - Centralized pub/sub event bus.
  - Stores global active filter state (e.g. `selectedYears`, `selectedGenres`, `minVotes`, `selectedTitleId`).
  - Emits `stateChanged` events when controls update; subscribed D3 chart modules re-render or update highlights efficiently without full page reloads.

### Proposed Folder-Level Architecture

```
FinalProject_Visualization/
├── index.html                  # Main application HTML shell
├── package.json                # Project dependencies (vite, d3)
├── vite.config.js              # Vite configuration
├── public/                     # Static assets (favicon, images)
└── src/
    ├── assets/                 # CSS design system & typography
    │   ├── main.css            # Base styles, CSS tokens, resets
    │   └── components.css      # Controls, tooltips, modal, layout grid
    ├── data/                   # Preprocessed analytical JSON/CSV extracts
    │   ├── summary_titles.json # Primary analytical dataset extract
    │   └── genres_lookup.json  # Precomputed category aggregations
    ├── state/                  # State management & event bus
    │   └── store.js            # Central state & subscription management
    ├── charts/                 # D3 chart modules (Pure D3 rendering)
    │   ├── scatterplot.js      # Main multivariate distribution chart
    │   ├── timeline.js         # Temporal trend / volume chart
    │   ├── breakdown.js        # Categorical genre / rating breakdown chart
    │   └── tooltip.js          # Shared D3 hover tooltip handler
    ├── ui/                     # Control panel & DOM handlers
    │   ├── filterPanel.js      # Year, genre, and vote sliders/dropdowns
    │   └── detailModal.js      # Details-on-demand modal dialog
    └── main.js                 # Entry point: loads data, initializes store & charts
```

> [!IMPORTANT]
> **No Implementation Yet**: This directory structure represents the architectural plan. No files or packages will be created until explicit user approval of Stage 2A is granted.

---

## 6. Primary Deployment Architecture & Git Workflow (GitHub + Vercel)

### Deployment Configuration Parameters

- **Source Control Repository**: GitHub (`FinalProject_Visualization`).
- **Production Host Platform**: **Vercel** (Connected directly via Vercel GitHub Integration).
- **Production Deployment Branch**: `main`.
- **Framework Preset**: **Vite**.
- **Build Command**: `npm run build`.
- **Output Directory**: `dist`.
- **Install Command**: `npm install`.

---

### Expected Collaboration & CI/CD Deployment Workflow

```
[Student Feature Branch] 
      │
      ▼  (Push to GitHub)
[GitHub Pull Request against main]
      │
      ├──> Vercel GitHub Integration detects PR
      ├──> Vercel automatically builds Preview Deployment (Unique Preview URL)
      └──> Team reviews PR functionality & visual layout on Vercel Preview URL
      │
      ▼  (Code Review & Approval)
[Merge Pull Request into main]
      │
      ├──> Vercel automatically triggers Production Deployment
      └──> Live Production URL updated (https://finalproject-visualization.vercel.app)
```

1. **Feature Branch Development**: Team members work on isolated feature branches (`feature/data-pipeline`, `feature/d3-scatterplot`, `feature/ui-controls`).
2. **Pull Requests & Vercel Preview Deployments**: Opening a Pull Request against `main` automatically triggers a Vercel Preview Build. Vercel generates a unique preview URL for testing across browsers and team members before merging.
3. **Production Deployment on Merge**: Merging an approved PR into `main` automatically triggers the production build on Vercel.
4. **Final Public URL**: The production Vercel URL will be embedded directly in the final project report. A custom domain is optional and not required.

---

## 7. Data Delivery Strategy

1. **Processed Data Format**:
   - Primary title dataset: **Compact JSON** array of objects with shortened key names (e.g., `t` for title, `y` for startYear, `r` for averageRating, `v` for numVotes, `g` for genre indices) to minimize file size on wire.
   - Categorical lookups: Separate small JSON files for genre indices and precomputed decade summaries.
2. **Browser Payload Budget**:
   - **Target Total Data Payload**: **< 5 MB uncompressed** (< 1.5 MB gzipped).
   - **Target Title Count in Web Extract**: **50,000 to 100,000 rows** max (filtered in Python during Stage 2B by `isAdult=0`, `numVotes >= 1000`, `titleType IN ('movie', 'tvSeries')`).
3. **Pre-Aggregation vs. Client-Side Filtering**:
   - **Pre-Aggregated**: Overall genre counts, decade distributions, and global min/max bounds precomputed during Python preprocessing in Stage 2B.
   - **Client-Side Filtered**: Filtering by year range, vote count slider, and genre multi-selection performed in browser memory over the filtered extract (`src/state/store.js`).
4. **Backend Requirement**:
   - **ZERO Backend / API Required**: Application is a 100% client-side static web application. Vercel serves pure static files over global CDN edge nodes.
5. **Reproducible Data Pipeline**:
   ```
   Raw IMDb TSVs (IMDb/) 
     ──> Python Preprocessor (scripts/preprocess_data.py) 
     ──> Processed JSON (src/data/summary_titles.json) 
     ──> Vite Static Bundle (dist/) 
     ──> Production Vercel Host
   ```

---

## 8. Performance Guardrails

To guarantee 60 FPS interactive performance across all desktop browsers, the application will enforce the following provisional guardrails:

- **SVG Mark Limit**: Maximum **5,000 active SVG DOM elements** rendered simultaneously in interactive scatterplots.
- **Canvas Fallback Threshold**: If visual representation requires rendering > 5,000 individual data marks simultaneously, D3 will render data points onto a `<canvas>` element, while rendering axes and overlays in SVG.
- **Density Aggregation / Binning**: Continuous scatterplots with dense overlaps will support dynamic hexbinning or 2D density contours when viewing global datasets (> 20,000 points).
- **Initial Page Load Budget**:
  - Total JS bundle size: < 300 KB (gzipped).
  - Total Initial Data load: < 2.0 MB.
  - Initial DOM render time: < 1.0 second.
- **Debounced Interaction**: Slider dragging and text search inputs will be debounced by 50ms to prevent unnecessary re-rendering during rapid drag operations.

---

## 9. Interaction Principles & Course Alignment

The Web/D3 implementation will directly apply core Information Visualization course principles:

1. **Shneiderman's Information Seeking Mantra**:
   - **Overview First**: Primary macro view showing overall rating distribution, volume trends across decades, and top genres.
   - **Zoom & Filter**: Interactive range sliders (Year, Vote Threshold), multi-select dropdowns (Genres, Formats), and D3 zoom/pan on dense scatterplots.
   - **Details-on-Demand**: Hovering a data mark displays a rich D3 tooltip card; clicking a mark opens a detailed modal with full title metrics, runtime, and crew information.
2. **Linked Views & Cross-Filtering**:
   - Selecting a region in the **Temporal Timeline Chart** automatically filters and highlights titles in the **Rating vs. Votes Scatterplot** and updates the **Genre Breakdown Chart**.
3. **Visual Encoding & Perception**:
   - Use color palette schemes tailored for accessibility (e.g. Viridis, ColorBrewer perceptually uniform palettes).
   - Use position and length as primary quantitative encodings (highest perceptual accuracy); use color hue strictly for categorical dimensions (Genres/Format).
   - Maintain clear legend keys, axis ticks, gridlines, and unit labels on every chart.

---

## 10. Comprehensive Deployment Risk Register & Mitigations

| Risk ID | Deployment / Technical Risk | Likelihood | Impact | Trigger Condition | Mandatory Mitigation Strategy |
|---|---|---|---|---|---|
| **R1** | Incorrect Vercel Root Directory setting. | Low | High | Project root misconfigured in Vercel project settings. | Leave Root Directory blank (`./`) as Vite configuration is located at repository root. |
| **R2** | Incorrect Vite build command or output folder. | Low | High | Vercel configured with non-standard build settings. | Specify explicit Vercel settings: Build Command = `npm run build`, Output Directory = `dist`. |
| **R3** | Case-sensitive asset path failures on Vercel. | Med | High | File imports with incorrect casing (e.g. `Main.css` vs `main.css`). | Enforce strict case sensitivity testing in local environment and build scripts. |
| **R4** | Oversized static IMDb data files breaking Git/Vercel. | Low | High | Data JSON payload > 15 MB pushed to repository. | Keep browser dataset extract < 5 MB via Python preprocessing (`numVotes >= 1000`, `isAdult=0`). Store ONLY public static analytical data in frontend. |
| **R5** | Failed Vercel production build despite passing locally. | Med | High | Missing dependencies in `package.json` or uncommitted files. | Always run `npm run build` and `npm run preview` locally to test static build output before merging PRs. |
| **R6** | Accidental exposure of secrets or API keys. | Low | High | Committing API keys or private env vars to repo. | Never place secrets or private API keys in client code or Vite env vars. Application is 100% static & public. |
| **R7** | Broken deep links / 404 on refresh with SPA routing. | Med | Med | Client-side router added without Vercel rewrites. | Use standard single-page layout without routing; if routing is later introduced, add `vercel.json` rewrite rule (`"source": "/(.*)", "destination": "/index.html"`). |
| **R8** | SVG rendering lag (< 20 FPS) during brush interactions. | Med | Med | SVG DOM element count > 5,000 points. | Implement Canvas fallback or 2D hexbinning for dense scatterplot views. |
| **R9** | Row multiplication / duplicate titles from bad joins. | Low | High | Unfiltered join on `title.akas` or `title.principals`. | Base primary dataset strictly on 1-to-1 join between `title.basics` and `title.ratings`. |
| **R10** | Over-engineering and running out of time for report writing. | Med | High | 7 days remaining before deadline with incomplete UI. | Freeze feature development 10 days before deadline; allocate Student 3 to lead report drafting early. |

---

## 11. Three-Person Team Plan

| Team Member | Primary Role & Responsibilities | Key Deliverables | Integration Checkpoints |
|---|---|---|---|
| **Student 1** | **Data & Preprocessing Lead** | Python reproducible preprocessing pipeline (`scripts/preprocess_data.py`), data cleaning, quality filtering, JSON extract generation, schema documentation. | Sprint 1: Export verified `summary_titles.json` extract matching Stage 1 specs. |
| **Student 2** | **D3 Visualization Lead** | Core D3 chart modules (`scatterplot.js`, `timeline.js`, `breakdown.js`), SVG/Canvas rendering, scale/axis mapping, brush/zoom behaviors, cross-chart linking. | Sprint 2: Deliver interactive, linked D3 chart views responding to state events. |
| **Student 3** | **UI, Integration & Deployment Lead** | Vite setup, HTML/CSS design system, UI control panels (`filterPanel.js`), tooltip/modal components, Vercel GitHub deployment pipeline, report coordination. | Sprint 3: Complete UI integration, Vercel preview testing, live hosting deployment, and lead report writing. |

---

## 12. Brief Tableau Fallback Plan

While custom Web/D3 on Vercel is the primary approved track, Tableau Public serves as an emergency fallback to guarantee project completion if catastrophic technical failures occur on the Web track.

### Trigger Conditions to Switch to Tableau:
1. Team is unable to achieve linked cross-chart filtering 14 days before project deadline.
2. Unresolvable browser rendering performance crashes occur that block demonstration.

If triggered, the team will import the Stage 2B preprocessed extract into **Tableau Desktop/Public**, build 2 interactive dashboards with native Tableau actions/filters, and publish to Tableau Public. 

> [!NOTE]
> Tableau is listed strictly for risk management. Custom Web/D3 hosted on Vercel remains the primary track.

---

## 13. Hosting Recommendations & Ranking Summary

1. **PRIMARY HOST**: **Vercel** (Connected directly to GitHub repository `main` branch).
2. **REPOSITORY & COLLABORATION**: **GitHub** (Feature branches, PRs, automated Vercel preview URLs).
3. **FIRST FALLBACK HOST**: **GitHub Pages** (Deploys static build artifact via `gh-pages` branch).
4. **SECOND FALLBACK HOST**: **Netlify** (Alternative static CI/CD host).

---

## 14. Official Stage 2A Status

**Stage 2A Web architecture validation is ready for final user approval.**
