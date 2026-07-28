# Stage 2B — Analytical Research Direction & Scope Decision Report (APPROVED)

---

## 1. Approved Project Decisions & Parameters

The user has officially reviewed and **APPROVED** Stage 2B with the following explicit decisions:

- **Approved Research Direction**: **Direction A — Cinema Evolution & Format Dynamics**
- **Approved Analytical Scope**: **Movies and TV Series analyzed separately within the same application** (Format separation prevents runtime/vote distribution distortion).
- **Approved Vote Threshold**: **`numVotes >= 1000`** (Guarantees rating stability, removes low-vote noise, yields 58,990 titles, payload ~5.16 MB).
- **Approved Primary Research Question**:
  > *"How have audience ratings, runtime distributions, and genre composition evolved for feature movies and TV series over time, and what relationships exist between rating, vote count, and runtime across different eras?"*
- **Approved Supporting Research Questions**:
  1. How have rating distributions changed across decades?
  2. How have runtime distributions changed over time?
  3. Which genres became more or less common across different eras?
  4. What relationship exists between vote count and average rating?
  5. How do these patterns differ between movies and TV series?

> [!NOTE]
> **Prototype Classification**: All existing draft code (`src/`, `package.json`, `vite.config.js`, `scripts/preprocess_data.py`) remains classified as an **UNAPPROVED PROTOTYPE** as documented in [unapproved_prototype_notice.md](file:///Users/zangeel/Downloads/FInalProject_Visualization/docs/unapproved_prototype_notice.md). Implementation will be reviewed and approved in later explicit stages.

---

## 2. Stage-Boundary Audit & Recovery Log

1. **Retrospective Audit**: Exceeded authorized Stage 2B scope during an earlier turn by writing implementation code prior to research question approval.
2. **Action Taken**: Frozen all implementation files. Created formal notice in `docs/unapproved_prototype_notice.md`.
3. **Status**: Stage 2B analytical analysis and research questions are now officially approved.

---

## 3. Comparative Evaluation of Research Directions

### Direction A: Cinema Evolution & Format Dynamics (APPROVED)
- **Central Problem**: Evolution of production volume, ratings, runtimes, and genre distribution across eras.
- **Unit of Analysis**: Media title (`tconst`).
- **Required Files**: `title.basics.tsv`, `title.ratings.tsv`.
- **Joins**: 1-to-1 inner join on `tconst`. Zero row multiplication risk.
- **Weighted Score**: **9.35 / 10** (Selected & Approved).

### Evaluated Alternatives
- **Direction B**: Genre Success & Audience Engagement (Score: 8.40 / 10)
- **Direction D**: TV Series & Episode Dynamics (Score: 7.60 / 10)
- **Direction C**: Director Career Trajectories (Score: 7.40 / 10)

---

## 4. Analytical Scope & Threshold Specifications

- **Scope Option**: Movies (`movie`) and TV Series (`tvSeries`) analyzed separately.
- **Title Count**: **58,990 analytical titles** (48,791 feature movies, 10,199 TV series).
- **Vote Threshold**: `numVotes >= 1000`.
- **Filter Assertions**: `isAdult == '0'`, `1880 <= startYear <= 2030`, valid `averageRating`.

### Mathematical Reconciliation of 17 Removed Rows
- Stage 1 `movie + tvSeries` with `numVotes >= 1000` joined total: **59,007**.
- Filtered `isAdult == '0'` (Adult content removed): **-17 rows**.
- Final Approved analytical extract: **58,990 titles** ($59,007 - 17 = 58,990$).

---

## 5. Official Stage 2B Status

**Stage 2B is approved and complete. The project is waiting for explicit approval to begin the next stage.**
