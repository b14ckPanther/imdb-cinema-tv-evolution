# Project Requirements & Grading Checklist

This document is derived directly from [Instructions.pdf](file:///Users/zangeel/Downloads/FInalProject_Visualization/Instructions.pdf), serving as the authoritative requirements specification for the Information Visualization Final Project (תשפ״ו).

---

## 1. Team & Submission Requirements
| ID | Type | Requirement Description | Source Reference | Status / Notes |
|---|---|---|---|---|
| TS-01 | **MUST** | Work strictly in trios (הגשה בשלשות בלבד!). | Instructions.pdf p.1 | Mandatory |
| TS-02 | **MUST** | Submission must be submitted in the course submission box by one team member. | Instructions.pdf p.2 | Mandatory |
| TS-03 | **MUST** | Final report length must not exceed 10 pages (`אורך הדו״ח לא יעלה על 10 עמודים`). | Instructions.pdf p.2 | Mandatory |
| TS-04 | **MUST** | Report header must include: Working project link, team member names, student IDs, project topic. | Instructions.pdf p.2 | Mandatory |

---

## 2. Dataset Requirements
| ID | Type | Requirement Description | Source Reference | Status / Notes |
|---|---|---|---|---|
| DS-01 | **MUST** | Select a dataset from the lecturer-approved list (or obtain explicit approval for another). | Instructions.pdf p.1 | Approved: IMDb selected |
| DS-02 | **MUST** | The dataset must be rich and meaningful to enable a high-level project. | Instructions.pdf p.1 | IMDb contains ~11M titles |
| DS-03 | **SHOULD** | At least 100 rows, ~5 or more distinct attributes. | Instructions.pdf p.1 | Recommendation |
| DS-04 | **SHOULD** | Include temporal (time) or spatial (place) data dimensions. | Instructions.pdf p.1 | IMDb includes years (`startYear`, `endYear`) & regions (`region`) |
| DS-05 | **MUST** | The visualization must help the viewer reach insights/patterns/trends/outliers impossible or time-consuming to find without visualization. | Instructions.pdf p.1 | Core evaluation metric |

---

## 3. Visualization Implementation Requirements
| ID | Type | Requirement Description | Source Reference | Status / Notes |
|---|---|---|---|---|
| VI-01 | **MUST** | Choose one of two implementation tracks: **Tableau** OR **Web-Based**. | Instructions.pdf p.1 | Decision pending (Stage 2) |
| VI-02 (Tableau) | **MUST** | If Tableau is used: Create a Workbook application built from scratch containing at least 2 Dashboards OR 1 Dashboard + 1 Story. | Instructions.pdf p.1 | Track Option A |
| VI-03 (Web) | **MUST** | If Web-based (D3, 3D, JS) is used: Source code must be hosted on GitHub, and app deployed on a public server accessible via browser link on any PC. | Instructions.pdf p.1 | Track Option B |
| VI-04 | **SHOULD** | Use multiple views with interaction (linking and brushing) rather than isolated simple charts. | Instructions.pdf p.2 | Key for Creativity/Scope (20%) |
| VI-05 | **MUST** | Include proper titles, clear axis labels, correct legends, and intentional color usage. | Instructions.pdf p.2 | Key for Correctness (25%) |

---

## 4. Preprocessing Requirements
| ID | Type | Requirement Description | Source Reference | Status / Notes |
|---|---|---|---|---|
| PP-01 | **MUST** | Preprocessing is allowed and expected (Python, Excel, SQL, etc.). | Instructions.pdf p.1 | Allowed |
| PP-02 | **MUST** | Any data preprocessing, filtering, imputation, normalization, reshaping (pivot), or dataset merging MUST be fully documented in the report. | Instructions.pdf p.1, p.2 | Mandatory documentation |
| PP-03 | **MUST** | Link to external/processed datasets must be included in the report. | Instructions.pdf p.2 | Mandatory |

---

## 5. Report Requirements (Max 10 Pages)
| ID | Type | Section | Required Content | Status |
|---|---|---|---|---|
| RP-01 | **MUST** | 1. Header | Working project link, team names, student IDs, project topic. | Pending |
| RP-02 | **MUST** | 2. Introduction | Problem/topic description, target audience, importance, main research question. | Pending |
| RP-03 | **MUST** | 3. Dataset Description | Dataset files description, line counts, important columns, data source link. | Stage 1 provides this |
| RP-04 | **MUST** | 4. Preprocessing | Step-by-step description of transformations, normalization, cleaning, merging. | Pending |
| RP-05 | **MUST** | 5. Tools & Libraries | Complete list of all tools, JS libraries, and LLMs used (if Web track). | Pending |
| RP-06 | **MUST** | 6. Solution & Interaction | Main graph explanation, user navigation guide, interactions, rationale, pros & cons. | Pending |

---

## 6. Deployment Requirements
| ID | Type | Requirement Description | Source Reference | Status / Notes |
|---|---|---|---|---|
| DP-01 | **MUST** | Working link provided at the top of the report. | Instructions.pdf p.1, p.2 | Mandatory |
| DP-02 | **MUST** | Tableau: Working Tableau Public / Server link. Web: Publicly accessible URL (e.g. GitHub Pages, Vercel, Netlify). | Instructions.pdf p.1 | Mandatory |

---

## 7. Grading Criteria & Weighting (100% Total)
- **Effectiveness (25%)**:
  - Non-trivial, interesting research questions?
  - Does the visualization directly answer the stated questions?
  - Does it successfully explore the target domain/problem?
- **Correctness (25%)**:
  - Correct visual encoding of data variables?
  - Adherence to visualization design rules taught in class?
  - Correct color choices (avoiding misleading palettes)?
  - Well-designed interaction, correct axes, clear legends, descriptive titles?
- **Creativity & Scope (20%)**:
  - Originality in topic, presentation, or local interaction techniques?
  - Scope: Non-trivial multi-view setup with interactive linking and brushing?
- **Aesthetics (15%)**:
  - Professional, polished, clean, and visually striking interface.
- **Report Quality (15%)**:
  - Comprehensive, well-structured 6-section report (max 10 pages). Missing details incur point deductions.

---

## 8. Important Dates
- **Early Submission Deadline**: `19.07.2026` (Grades returned before August upon request/email).
- **Regular Submission Deadline**: `20.08.2026` (Grades returned around September).

---

## 9. Unresolved & Ambiguous Items
| Item | Description | Impact & Mitigation |
|---|---|---|
| UN-01 | Track Selection (Tableau vs. Web/D3) | Grading expectations differ slightly: Tableau expects broader scope/interactions, Web requires full code deployment & JS library documentation. Must align with team preferences in Stage 2. |
| UN-02 | Dataset Subsetting Boundaries | The raw IMDb dataset contains ~11M titles and ~15.5M names (over 9.7 GB). Tableau Public has file/row limits (15M rows max per extract, usually 1GB limit), and Web apps need responsive loading. Stage 2 must define clear spatial/temporal/genre filtering boundaries. |
