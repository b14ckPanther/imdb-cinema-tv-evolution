# IMDb Comprehensive Data Audit & Verification Report

This report presents empirical findings from auditing all seven IMDb non-commercial datasets in `IMDb/`.

---

## 1. File Inventory & Storage Summary

*Snapshot Timestamp: Files extracted on 2026-07-28 between 10:42 UTC and 10:49 UTC.*

| File Name | Format | Byte Size | Size (MB/GB) | Data-Row Count | Columns | Modification Timestamp (UTC) |
|---|---|---|---|---|---|---|
| `name.basics.tsv` | Uncompressed TSV | 959,606,480 | 915.15 MB (0.8937 GB) | 15,526,439 | 6 | `2026-07-28T10:46:57.925978+00:00` |
| `title.akas.tsv` | Uncompressed TSV | 2,969,225,875 | 2831.67 MB (2.7653 GB) | 58,673,613 | 8 | `2026-07-28T10:46:59.906638+00:00` |
| `title.basics.tsv` | Uncompressed TSV | 1,099,639,925 | 1048.7 MB (1.0241 GB) | 12,674,027 | 9 | `2026-07-28T10:42:52.846616+00:00` |
| `title.crew.tsv` | Uncompressed TSV | 417,723,905 | 398.37 MB (0.389 GB) | 12,675,173 | 3 | `2026-07-28T10:48:02.540697+00:00` |
| `title.episode.tsv` | Uncompressed TSV | 257,459,493 | 245.53 MB (0.2398 GB) | 9,796,655 | 4 | `2026-07-28T10:48:00.313263+00:00` |
| `title.principals.tsv` | Uncompressed TSV | 4,504,528,838 | 4295.85 MB (4.1952 GB) | 100,782,155 | 6 | `2026-07-28T10:49:17.895172+00:00` |
| `title.ratings.tsv` | Uncompressed TSV | 29,676,539 | 28.3 MB (0.0276 GB) | 1,699,786 | 3 | `2026-07-28T10:42:34.053656+00:00` |
| **TOTAL** | **Uncompressed TSV** | **9,795,733,743** | **9,795.73 MB (9.566 GB)** | **212,027,848** | — | — |

---

## 2. Title Composition & Ratings Threshold Matrix

### A. Composition by `titleType` (Denominator = 12,674,027 rows)

| `titleType` | Exact Row Count | Share of All Titles |
|---|---|---|
| `tvEpisode` | 9,795,762 | `9,795,762 / 12,674,027 (77.29%)` |
| `short` | 1,146,546 | `1,146,546 / 12,674,027 (9.05%)` |
| `movie` | 753,166 | `753,166 / 12,674,027 (5.94%)` |
| `video` | 328,764 | `328,764 / 12,674,027 (2.59%)` |
| `tvSeries` | 302,885 | `302,885 / 12,674,027 (2.39%)` |
| `tvMovie` | 155,515 | `155,515 / 12,674,027 (1.23%)` |
| `tvMiniSeries` | 71,825 | `71,825 / 12,674,027 (0.57%)` |
| `tvSpecial` | 58,808 | `58,808 / 12,674,027 (0.46%)` |
| `videoGame` | 49,720 | `49,720 / 12,674,027 (0.39%)` |
| `tvShort` | 11,035 | `11,035 / 12,674,027 (0.09%)` |
| `tvPilot` | 1 | `1 / 12,674,027 (0.00%)` |

### B. Vote Thresholds Matrix Across 4 Analytical Scopes

| Scope Name | Total Scope Titles | Matched Rated Titles (No Vote Filter) | `numVotes >= 100` | `numVotes >= 500` | `numVotes >= 1000` | `numVotes >= 5000` | `numVotes >= 10000` |
|---|---|---|---|---|---|---|---|
| **All Rated Titles Joined to title.basics** | 1,699,786 (File Rows) | 1,699,783 (1,699,783 Joined) | 426,076 | 167,463 | 106,288 | 31,320 | 17,871 |
| **Movie Only (Joined to title.basics)** | 753,166 | 348,542 | 145,949 | 70,311 | 48,808 | 18,949 | 12,489 |
| **tvSeries Only (Joined to title.basics)** | 302,885 | 113,491 | 34,679 | 14,951 | 10,199 | 3,848 | 2,345 |
| **Movie + tvSeries (Joined to title.basics)** | 1,056,051 | 462,033 | 180,628 | 85,262 | 59,007 | 22,797 | 14,834 |

---

## 3. Scope Field Validity (`movie` vs `tvSeries`)

| Metric / Field | `movie` Scope (Total: 753,166) | `tvSeries` Scope (Total: 302,885) |
|---|---|---|
| **Valid `startYear` Count** | 639,767 | 277,228 |
| **`startYear` Range** | 1894 - 2032 | 1908 - 2030 |
| **Missing `startYear` Count (%)** | 113,399 (15.06%) | 25,657 (8.47%) |
| **Valid `runtimeMinutes` Count** | 474,911 | 111,635 |
| **`runtimeMinutes` Range** | 1.0 - 51420.0 mins | 1.0 - 3692080.0 mins |
| **Missing `runtimeMinutes` Count (%)** | 278,255 (36.94%) | 191,250 (63.14%) |
| **Missing `genres` Count (%)** | 77,966 (10.35%) | 23,955 (7.91%) |
| **`averageRating` Range** | 1.0 - 10.0 | 1.0 - 10.0 |
| **`numVotes` Range** | 5 - 3,213,685 | 5 - 2,648,744 |

---

## 4. Join Integrity & Relational Architecture

- **`title.basics` <-> `title.ratings`**:
  - `title.ratings.tsv` contains **1,699,786 physical data rows**.
  - **1,699,783 of those rows (99.9998%)** match a `tconst` in `title.basics.tsv`.
  - **3 rows** are orphans relative to `title.basics.tsv`.
  - The matched rating rows represent **13.4115%** of all 12,674,027 `title.basics.tsv` rows.
  - Zero duplicate `tconst`s in either file.

- **`title.crew` <-> `title.basics` Investigation**:
  - `title.crew` row count: **12,675,173** (0 duplicate `tconst`s).
  - `title.basics` row count: **12,674,027** (0 duplicate `tconst`s).
  - Net row count difference: **1,146 rows**.
  - Cause: 1,160 orphan `tconst` IDs present in `title.crew` that do not exist in `title.basics`, minus 14 `tconst` IDs in `title.basics` not in `title.crew`.
