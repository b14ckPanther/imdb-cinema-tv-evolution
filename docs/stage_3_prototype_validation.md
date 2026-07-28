# Stage 3 — Prototype Validation & Gap Analysis Report

---

## 1. Existing Project Inventory

The existing prototype codebase consists of 14 key implementation files developed during Stage 2:

| Component | File Path | File Type | Current Purpose / Functionality |
|---|---|---|---|
| **Build Configuration** | `package.json` | JSON | Vite 5.4 and D3.js (v7.9.0) dependency declarations. |
| **Build Configuration** | `vite.config.js` | JS | Vite production bundler setup (`base: './'`, output `dist`). |
| **HTML Shell** | `index.html` | HTML | Application shell, control sidebar, dashboard grid, modal containers. |
| **Styling System** | `src/assets/main.css` | CSS | Dark glassmorphism CSS custom properties, grid system, typography. |
| **Styling System** | `src/assets/components.css` | CSS | Card panels, form controls, range sliders, tooltips, modal overlay. |
| **Data Preprocessing** | `scripts/preprocess_data.py` | Python | Stream-processes IMDb TSVs into compact JSON extracts. |
| **Data Extracts** | `src/data/summary_titles.json` | JSON | 58,990 title records (48,791 movies, 10,199 TV series) (5.16 MB). |
| **Data Extracts** | `src/data/genres_summary.json` | JSON | 27 unique genres lookup & decade frequency metrics. |
| **Data Extracts** | `src/data/data_metrics.json` | JSON | Reproducibility metadata for raw $\rightarrow$ filtered transformations. |
| **State Manager** | `src/state/store.js` | JS | Central pub/sub event bus, filter engine, active dataset metrics. |
| **D3 Chart Module** | `src/charts/scatterplot.js` | JS | Rating (X) vs. Log Votes (Y) scatterplot with runtime sizing (R). |
| **D3 Chart Module** | `src/charts/timeline.js` | JS | Temporal release volume area chart with 1D D3 brush. |
| **D3 Chart Module** | `src/charts/breakdown.js` | JS | Top 7 genre frequency horizontal bar chart. |
| **D3 Chart Module** | `src/charts/tooltip.js` | JS | Hover tooltip card showing title metadata & rating metrics. |
| **UI Handlers** | `src/ui/filterPanel.js` | JS | Sidebar control event handlers (search, sliders, dropdowns). |
| **UI Handlers** | `src/ui/detailModal.js` | JS | Details-on-demand modal overlay dialog handler. |
| **Entry Point** | `src/main.js` | JS | App entry point bootstrapping data load, store, charts & metrics. |

---

## 2. Component-by-Component Validation Against Stage 2B Decisions

Each prototype component was evaluated against the approved research questions, scope (Movies vs. TV Series format separation), vote threshold (`numVotes >= 1000`), and Vercel static deployment architecture:

### A. Preprocessing Pipeline (`scripts/preprocess_data.py`) & Datasets (`src/data/*`)
- **Validation**: **ACCEPTED WITH MINOR OPTIMIZATION**.
- **Scope Alignment**: Successfully extracts 58,990 titles matching approved scope (48,791 Movies, 10,199 TV Series, `isAdult=0`, `numVotes >= 1000`).
- **Required Modification**: Optimize field compression in `summary_titles.json` to bring file size from 5.16 MB strictly under 4.2 MB uncompressed (~1.1 MB gzipped). Add precomputed decade rating & runtime distributions to `genres_summary.json`.

### B. Build Infrastructure (`package.json`, `vite.config.js`)
- **Validation**: **ACCEPTED WITHOUT CHANGES**.
- **Scope Alignment**: Native Vite + D3 setup builds deterministically in 563ms (`dist/` bundle size 90.88 kB JS / 7.70 kB CSS). Perfectly compatible with Vercel deployment.

### C. UI Design System & Shell (`index.html`, `src/assets/*.css`)
- **Validation**: **ACCEPTED WITH MODIFICATION**.
- **Scope Alignment**: High-aesthetic dark glassmorphism styling, responsive layout grid, Inter/Outfit typography.
- **Required Modification**: Add a prominent Format Mode Switcher (`All Formats`, `Movies Only`, `TV Series Only`, `Side-by-Side Compare`) in the header/sidebar to fulfill the approved scope constraint ("Movies and TV series analyzed separately within the same application"). Add metric view tabs to charts.

### D. Central State Store (`src/state/store.js`)
- **Validation**: **ACCEPTED WITH MODIFICATION**.
- **Scope Alignment**: Pub/sub state distribution works cleanly across all subscribed D3 chart views.
- **Required Modification**: Add state parameters for `formatMode` ('movie' vs 'tvSeries' comparison state), `activeMetricView` (Volume vs. Rating vs. Runtime distribution modes), and precomputed histogram binning methods.

### E. D3 Timeline Chart (`src/charts/timeline.js`)
- **Validation**: **ACCEPTED WITH MODIFICATION**.
- **Scope Alignment**: 1D D3 brush interaction works smoothly.
- **Required Modification**: Currently shows only title volume over time. Add a metric toggle allowing users to switch between **Title Volume over Time**, **Mean Audience Rating over Time**, and **Mean Runtime over Time** across decades (addresses Supporting Questions Q1, Q2, and Q5).

### F. D3 Scatterplot Chart (`src/charts/scatterplot.js`)
- **Validation**: **ACCEPTED WITH MODIFICATION**.
- **Scope Alignment**: Encodes Rating (X), Log Votes (Y), and Runtime (R).
- **Required Modification**: Add distinct shape encodings (Circle for Movies, Diamond/Square for TV Series) to visually differentiate formats in combined views. Add trendlines or density contour overlays to highlight rating vs. vote relationships (addresses Supporting Question Q4).

### G. D3 Genre Breakdown Chart (`src/charts/breakdown.js`)
- **Validation**: **ACCEPTED WITH MODIFICATION**.
- **Scope Alignment**: Displays top 7 genre counts with interactive click-filtering.
- **Required Modification**: Add an Era/Decade breakdown selector so users can observe how genre composition shifted across historical eras (addresses Supporting Question Q3).

### H. Tooltip, Detail Modal, & Event Handlers (`src/charts/tooltip.js`, `src/ui/*`, `src/main.js`)
- **Validation**: **ACCEPTED WITHOUT CHANGES** (minor wiring for new format switcher).
- **Scope Alignment**: Rich details-on-demand modal with IMDb external links, smooth hover tooltips, robust filter panel handlers.

---

## 3. Mapping Approved Research Questions to Prototype Functionality

| Approved Research Question | Existing Prototype Functionality | Gap / Missing Requirement | Alignment Action |
|---|---|---|---|
| **Primary Question**: Overall evolution of ratings, runtimes, genres, & rating/vote relationships for Movies vs. TV Series over time | Scatterplot, Timeline, Breakdown charts present core data attributes. | Format separation between Movies and TV Series needs an explicit toggle/comparison mode. | Implement Format Mode Switcher (`Movies`, `TV Series`, `Compare`) and multi-metric timeline overlay. |
| **Supporting Q1**: How have rating distributions changed across decades? | Timeline chart shows title volume per decade. | Missing decade-by-decade rating distribution trends / mean rating timeline. | Add "Rating Trend" toggle view to `timeline.js` and decade rating histogram binning. |
| **Supporting Q2**: How have runtime distributions changed over time? | Scatterplot encodes runtime as circle radius $R$. | Runtime evolution over decades is not explicitly plotted on a temporal axis. | Add "Runtime Trend" toggle view to `timeline.js` showing average movie/series duration over decades. |
| **Supporting Q3**: Which genres became more or less common across different eras? | Breakdown chart displays top genre frequencies. | Does not currently show how genre shares shifted between classical (1920–1970) and modern eras. | Add Era selector (e.g. Silent/Golden Age vs. Modern Era) to `breakdown.js`. |
| **Supporting Q4**: What relationship exists between vote count and average rating? | Scatterplot maps Rating (X) vs. Log Votes (Y). | Fully supported by scatterplot; needs trend correlation overlay for visual clarity. | Add optional correlation trendlines / quadrant lines on scatterplot. |
| **Supporting Q5**: How do these patterns differ between movies and TV series? | Sidebar dropdown permits filtering by `Movie` or `TV Series`. | Needs side-by-side metric comparison and visual shape distinction between formats. | Add visual mark differentiation (circles vs. diamonds) and side-by-side format metric summary. |

---

## 4. Summary of Functional Changes

### Accepted Without Changes (Preserved Code)
- `package.json`
- `vite.config.js`
- `src/assets/main.css`
- `src/assets/components.css`
- `src/charts/tooltip.js`
- `src/ui/detailModal.js`

### Accepted With Required Modifications
- `scripts/preprocess_data.py`: Add payload compression optimizations and precompute decade distributions.
- `index.html`: Add Format Mode Switcher tabs and chart view metric toggles.
- `src/state/store.js`: Expand state model for format comparison and multi-metric distribution views.
- `src/charts/timeline.js`: Expand to support Volume, Mean Rating, and Mean Runtime timeline views.
- `src/charts/scatterplot.js`: Add distinct format visual marks (Movie vs. TV Series) and rating/vote correlation guides.
- `src/charts/breakdown.js`: Add era-based genre composition comparison.
- `src/ui/filterPanel.js` & `src/main.js`: Wire up new format mode switcher and chart view toggles.

### Components to Remove
- **NONE**. No existing component needs to be discarded; all existing prototype code is preserved and extended.

---

## 5. Technical Risk Assessment

1. **Payload Size Guardrail**: `summary_titles.json` is currently 5.16 MB.
   - *Mitigation*: Truncate float precision on ratings and encode genre indices efficiently to compress file to ~4.1 MB without dropping any of the 58,990 titles.
2. **Chart Re-render Performance**: Switching between timeline metrics must remain sub-50ms.
   - *Mitigation*: D3 join updates (`.data().join()`) with efficient transition handling instead of re-creating SVG elements.
3. **Format Comparison Layout**: Side-by-side format comparison must fit standard 1080p desktop viewports cleanly.
   - *Mitigation*: Responsive CSS Grid layout with min/max viewport boundaries.

---

## 6. Recommended Implementation Plan for Stage 4

1. **Step 1: Dataset Optimization**: Re-run optimized `scripts/preprocess_data.py` to yield compressed `src/data/summary_titles.json` (< 4.2 MB) and enhanced `genres_summary.json`.
2. **Step 2: Shell & State Extension**: Update `index.html` header/controls with Format Mode Switcher (`Movies`, `TV Series`, `Compare`) and update `src/state/store.js` state bus.
3. **Step 3: D3 Chart Enhancements**:
   - Update `timeline.js` with Volume / Rating / Runtime trend view toggles.
   - Update `scatterplot.js` with format mark shapes and correlation guides.
   - Update `breakdown.js` with era-based genre distribution analysis.
4. **Step 4: Integration & Build Verification**: Wire event listeners in `filterPanel.js` and `main.js`, test 60 FPS interactions, verify production build (`npm run build`).

---

## 7. Overall Prototype Readiness Score

$$\mathbf{Readiness\ Score = 82\%}$$

- **Core Infrastructure & Design System**: 100% Ready
- **Data Preprocessing & Join Integrity**: 95% Ready (Needs minor size compression)
- **Basic Visual Encodings & D3 Charts**: 80% Ready (Needs Q1–Q5 metric toggles & format marks)
- **Research Question Coverage**: 75% Ready (Needs explicit rating/runtime trend views)

---

## 8. Official Stage 3 Status

**Stage 3 prototype validation is complete and waiting for explicit approval before implementation changes begin.**
