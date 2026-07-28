# IMDb Cinema & TV Evolution — Final Project Progress Tracker

> **Course**: Information Visualization (תשפ״ו)  
> **Specification Source**: [Instructions.pdf](file:///Users/zangeel/Downloads/FInalProject_Visualization/Instructions.pdf)  
> **Active Repository**: `/Users/zangeel/Documents/GitHub/imdb-cinema-tv-evolution`  
> **GitHub Remote**: `https://github.com/b14ckPanther/imdb-cinema-tv-evolution.git`  
> **Last Updated**: `2026-07-28`

---

## Team Credentials

| Student Name (English) | Student Name (Hebrew) | Primary Project Role |
|---|---|---|
| **Noor Alden Mousa** | נור אלדין מוסא | Preprocessing & Data Lead |
| **Aya Khalaila** | איה חלאילה | D3 Visualization Lead |
| **Sleeman Eketeh** | סלימאן עקיטה | UI, Integration & Report Lead |

*(Note: Student IDs are omitted from public GitHub files for privacy and will be included only in the final PDF submission report header).*

---

## Executive Progress Summary

$$\mathbf{Overall\ Project\ Completion:\ 95\%}$$

- **Stage 1 (Data Audit & Verification)**: **100% COMPLETED & APPROVED**
- **Stage 2A (Web Track & Architecture)**: **100% COMPLETED & APPROVED**
- **Stage 2B (Research Questions & Scope)**: **100% COMPLETED & APPROVED**
- **Stage 3 (Prototype Validation)**: **100% COMPLETED & APPROVED**
- **Stage 4 (Implementation Alignment)**: **100% COMPLETED & APPROVED**
- **Stage 5 (QA & Verification)**: **100% COMPLETED & APPROVED**
- **Stage 6 (GitHub Push & Vercel Deployment)**: **100% COMPLETED** (Committed to GitHub, deployed live on Vercel)
- **Stage 7 (10-Page Report & Final Submission)**: **IN PROGRESS** (Outline & LLM disclosure established)

---

## 1. Tool & LLM Disclosure (`Instructions.pdf` Mandatory Disclosure)

As required by `Instructions.pdf` (Page 2), all tools, software libraries, and AI assistant interactions used throughout this project are formally disclosed:

1. **Frontend Visualization Libraries**: D3.js (v7.9.0), Vanilla JavaScript (ES2022+ Modules), Vanilla CSS3.
2. **Build Tools & Environment**: Vite (v8.1.5), Node.js (v22.22.2), Rollup bundler.
3. **Data Preprocessing & Auditing**: Python (pandas, numpy), chunked streaming TSV parser scripts (`scripts/preprocess_data.py`, `scripts/audit_imdb_data.py`).
4. **Hosting & Source Control**: GitHub Desktop, Git, Vercel Edge CDN Network.
5. **AI Assistant Workflow (ChatGPT & Antigravity)**:
   - **ChatGPT**: Used for initial prompt formulation, research question structuring, reviewing output strategies, and refining analytical text/prose.
   - **Antigravity (Google DeepMind AI Agent)**: Used as a pair-programming multi-agent coding assistant to execute streaming data audits, write reproducible Python preprocessing scripts, build modular D3 charts, implement UI state managers, and verify Vite production builds.
   - **Iterative Feedback Loop**: Code snippets, dataset audit statistics, and visual architecture designs were iteratively exchanged between ChatGPT and Antigravity to audit correctness, resolve technical defects, and optimize browser payload performance.

---

## 2. Compliance Matrix with Lecturer Constraints (`Instructions.pdf`)

| ID | Lecturer Requirement (`Instructions.pdf`) | Implementation & Verification Status | Compliance Status |
|---|---|---|---|
| **REQ-01** | **Dataset Selection**: Approved dataset from lecturer list. | IMDb Non-Commercial Datasets selected & audited (12.67M raw titles $\rightarrow$ 58,990 analytical titles). | **COMPLIANT (DONE)** |
| **REQ-02** | **Rich & Meaningful Problem**: Enable non-trivial insights difficult to discover without visualization. | Multi-view interactive visualization exploring 100+ years of ratings, runtimes, popularity, and genre dynamics. | **COMPLIANT (DONE)** |
| **REQ-03** | **Interactive Principles**: Overview first, zoom & filter, details-on-demand, linked views. | Implemented Shneiderman's Mantra: 1D temporal timeline brush, rating vs. votes scatterplot, genre filters, D3 tooltips, details modal. | **COMPLIANT (DONE)** |
| **REQ-04** | **Public Hosting & Working URL**: App must work from any browser via a public URL. | Pushed to GitHub & deployed to Vercel. Site is publicly hosted and accessible across any web browser. | **COMPLIANT (DONE)** |
| **REQ-05** | **Reproducible Preprocessing**: Document all filtering, joins, aggregations, and extracts. | Reproducible Python script `scripts/preprocess_data.py` generates `summary_titles.json` (58,990 records) with audit metrics. | **COMPLIANT (DONE)** |
| **REQ-06** | **Tools & LLM Disclosure**: Report must disclose JS libraries, build tools, and LLM assistance. | Complete disclosure recorded above (D3.js, Vite, Python, Vercel, ChatGPT, Antigravity). | **COMPLIANT (DONE)** |
| **REQ-07** | **Report Format & Length**: Submission must be a **PDF report** not exceeding 10 pages (`עד 10 עמודים`). | Formatted as a formal PDF report (Word/DOCX converted to PDF). Notebooks (`.ipynb`) are NOT required for submission. | **IN PROGRESS** |
| **REQ-08** | **Report Header**: Report must contain working URL, team member names, IDs, project title. | Team credentials registered (Noor Alden Mousa, Aya Khalaila, Sleeman Eketeh). Working Vercel URL ready for header. | **IN PROGRESS** |
| **REQ-09** | **Trio Team Requirement**: Submitted by trios (`הגשה בשלשות בלבד!`). | Submitted by 3 team members. | **COMPLIANT (DONE)** |

---

## 3. Recommended Project Header Titles

Here are three recommended titles for the report header:

1. **Academic & Descriptive (RECOMMENDED)**:  
   *"A Century of Cinema: Visualizing Rating, Runtime, and Popularity Evolution in IMDb Feature Films and Television Series (1920–2025)"*
2. **Analytical & Concise**:  
   *"Cinema & TV Evolution Explorer: Multi-Attribute Visual Analysis of IMDb Datasets"*
3. **Bilingual Dual Title (Hebrew/English)**:  
   *"IMDb Evolution Explorer: ניתוח חזותי אינטראקטיבי של התפתחות הקולנוע והטלוויזיה"*

---

## 4. Report Format Clarification & 10-Page Structure Guide

### What Format is Required?
- **File Format**: **PDF Document** (Created in Microsoft Word/DOCX or Google Docs and exported to PDF).
- **Is a Notebook (`.ipynb`) Required?**: **NO**. You do **NOT** submit a Jupyter Notebook for the final project submission. You submit a clean 10-page PDF report containing high-resolution screenshots/figures of your web application, methodology, data insights, and working URL.

### Recommended 10-Page PDF Allocation

| Page # | Section Title | Key Contents & Figures to Include |
|---|---|---|
| **Page 1** | **Title, Header & Introduction** | Report Header (Title, Names, Student IDs, Working Link), Domain Background, Motivation, Problem Statement. |
| **Page 2** | **Dataset & Data Preprocessing** | IMDb dataset description, raw row counts (12.67M), filtering rules (`numVotes >= 1000`, `isAdult=0`), 1-to-1 join mechanics, final 58,990 extract summary table. |
| **Page 3** | **Research Questions & Scope** | Primary research question and 5 supporting questions; rationale for separating Movies vs. TV Series. |
| **Page 4** | **Visualization Architecture & Visual Encodings** | Multi-view layout design system, visual mark encodings (Position X/Y, Color Hue, Size R, Shape Circle/Diamond). |
| **Page 5** | **Interactive System Features** | Shneiderman's Mantra implementation: 1D Timeline Brush, Format Switcher, Genre Era Filters, Details Modal (Figure screenshots). |
| **Page 6** | **Analytical Findings — Cinema Evolution (Q1 & Q2)** | Visual analysis of rating trends and runtime changes across decades (1920–2025) with screenshot figures. |
| **Page 7** | **Analytical Findings — Genre & Popularity (Q3 & Q4)** | Visual analysis of Classical vs. Modern genre shifts and Rating vs. Vote Popularity distribution with screenshot figures. |
| **Page 8** | **Analytical Findings — Movies vs. TV Series (Q5)** | Side-by-side comparative analysis between feature film metrics and television series episode duration metrics. |
| **Page 9** | **User Evaluation & Performance Audit** | Usability review, performance testing (Vite bundle size 95 kB, HTTP 200 payload verification), accessibility features. |
| **Page 10** | **Conclusion, Tools & LLM Disclosure** | Summary of findings, limitations, list of JS/build tools, complete ChatGPT & Antigravity AI assistant workflow disclosure. |

---

## 5. Approved Research Question Traceability Checklist

| Approved Research Question | Targeted Visual Component | Progress |
|---|---|---|
| **Primary Question**: Overall evolution of ratings, runtimes, genres, & format dynamics | Multi-view interactive dashboard (Timeline, Scatterplot, Breakdown) with format separation | **100% DONE** |
| **Supporting Q1**: Rating distribution changes across decades | Timeline Chart (`Mean Rating` mode, 4.0–9.0 scale) | **100% DONE** |
| **Supporting Q2**: Runtime distribution changes over time | Timeline Chart (`Mean Runtime` mode, minutes scale) | **100% DONE** |
| **Supporting Q3**: Genre composition shifts across eras | Breakdown Chart + Era Filter (`Classical 1920–1970` vs `Modern 1971–2025`) | **100% DONE** |
| **Supporting Q4**: Relationship between vote count & rating | Scatterplot Chart (Rating X vs Log Votes Y + Benchmark Reference Line) | **100% DONE** |
| **Supporting Q5**: Differences between Movies and TV Series | Format Mode Switcher Tabs + Shape Encodings (Circle = Movie, Diamond = TV) | **100% DONE** |
