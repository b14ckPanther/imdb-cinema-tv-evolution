# Stage 1 — Executive Summary & Decision Brief

---

## 1. What Was Completed in Stage 1
- **Full Specification Extraction**: Read [Instructions.pdf](file:///Users/zangeel/Downloads/FInalProject_Visualization/Instructions.pdf) in full and created [requirements_checklist.md](file:///Users/zangeel/Downloads/FInalProject_Visualization/docs/requirements_checklist.md).
- **Data Inspection**: Executed [inspect_imdb_files.py](file:///Users/zangeel/Downloads/FInalProject_Visualization/scripts/inspect_imdb_files.py) to inspect schemas, formats, missing value conventions (`\N`), and sample records.
- **Empirical Data Audit & Verification**: Executed [audit_imdb_data.py](file:///Users/zangeel/Downloads/FInalProject_Visualization/scripts/audit_imdb_data.py) using memory-safe streaming. Generated canonical [verification_report.json](file:///Users/zangeel/Downloads/FInalProject_Visualization/outputs/audit/verification_report.json) and [stage_1_verification.md](file:///Users/zangeel/Downloads/FInalProject_Visualization/docs/stage_1_verification.md).
- **Schema & Relational Modeling**: Documented complete column definitions in [imdb_data_dictionary.md](file:///Users/zangeel/Downloads/FInalProject_Visualization/docs/imdb_data_dictionary.md) and mapped ERD relationship cardinalities in [imdb_relationships.md](file:///Users/zangeel/Downloads/FInalProject_Visualization/docs/imdb_relationships.md).
- **Repository Setup**: Created project foundation (`docs/`, `scripts/`, `data/`, `outputs/`, `README.md`, `requirements.txt`, `.gitignore`).

---

## 2. Reconciled Authoritative Discoveries from Audit
1. **Total Dataset Volume**: The 7 IMDb files contain **212,027,848 rows** totaling **9.76 GB** (uncompressed TSV).
2. **Title Composition (`title.basics.tsv`)**: Out of 12,674,027 total titles:
   - `tvEpisode`: **9,795,762 rows (77.29%)** — Dominates raw title count.
   - `short`: **1,146,546 rows (9.05%)**.
   - `movie`: **753,166 rows (5.94%)**.
   - `tvSeries`: **302,885 rows (2.39%)**.
3. **Rated Titles & Terminology**:
   - `title.ratings.tsv` contains **1,699,786 physical data rows**.
   - **1,699,783 of those rows (99.9998%)** successfully match a `tconst` in `title.basics.tsv`.
   - **3 rows** are orphans relative to `title.basics.tsv`.
   - The matched rating rows represent **13.4115%** of the 12,674,027 `title.basics.tsv` rows.
4. **Vote Distribution & Maximum**: Maximum votes is **3,213,685 votes** (*The Shawshank Redemption*).
5. **Threshold Counts Across Scopes**:
   - `movie` (Joined to `title.basics`) with `numVotes >= 100`: **145,949 titles**.
   - `movie` (Joined to `title.basics`) with `numVotes >= 1000`: **48,808 titles**.
   - `movie + tvSeries` (Joined to `title.basics`) with `numVotes >= 1000`: **59,007 titles**.
   - `All Rated Titles` (Joined to `title.basics`) with `numVotes >= 1000`: **106,288 titles**.

---

## 3. Recommended Core Dataset for Stage 2
- **`title.basics.tsv` + `title.ratings.tsv`**
- **Justification**:
  - Provides rich dimensions: time (`startYear`), format (`titleType`), categories (`genres`), and metrics (`averageRating`, `numVotes`, `runtimeMinutes`).
  - Guarantees 1-to-1 join without row explosion.
  - Preprocessing filter (`isAdult=0`, `titleType IN ('movie', 'tvSeries')`, `numVotes >= 1000`) produces an ideal analytical extract (~50K to 100K rows).

---

## 4. Optional Dataset Extensions
- **`title.crew.tsv` + `name.basics.tsv`**: Recommended if research question explores director/writer track record.
- **`title.episode.tsv`**: Recommended if research question explores TV series episode rating dynamics.
- **`title.principals.tsv`**: Optional extension for actor collaboration network analysis.
- **`title.akas.tsv`**: Optional extension for regional market distribution analysis.

---

## 5. Key Technical Risks
- **Memory Overhead**: Large files (`title.principals` at 4.5 GB) must be streamed using chunked processing.
- **Row Duplication**: Unfiltered joins on `title.akas` or `title.principals` multiply title rows up to 10x–50x.
- **Visualization Performance**: Interactive dashboards perform best with datasets under 100K rows.

---

## 6. Questions to Align Upon Before Stage 2

Before proceeding to Stage 2 (Research Question & Preprocessing Implementation), please review and confirm:

1. **Implementation Technology Track**:
   - **Option A**: Tableau Workbook (requires at least 2 Dashboards OR 1 Dashboard + 1 Story).
   - **Option B**: Web-Based App (JavaScript / D3 / Three.js hosted on GitHub & deployed live).
2. **Target Domain Focus**:
   - **Option 1 (Film Analytics)**: Evolution of cinema, genre trends, rating drivers, and runtime shifts over decades (Movies & TV Series).
   - **Option 2 (Director / Creative Impact)**: Director track records, collaboration networks, and star power influence.
   - **Option 3 (TV Series Trajectories)**: Golden age of TV series, season-by-season rating dynamics.
3. **Data Scope Boundaries**:
   - Confirm filtering criteria (e.g. `numVotes >= 500` or `>= 1000`, non-adult content).

---

## 7. Official Stage 1 Status

**Stage 1 final consistency check is ready for user approval.**
