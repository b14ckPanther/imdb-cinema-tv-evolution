# IMDb Dataset Data Dictionary

This document provides a comprehensive data dictionary for all seven official IMDb non-commercial dataset files included in the project under `IMDb/`.

---

## Missing-Value Convention
Across all IMDb dataset TSV files, missing, unrecorded, or inapplicable values are explicitly represented by the two-character string:
`\N` (Backslash followed by capital N).

---

## 1. `title.basics.tsv`
- **Granularity**: One row per unique title (movie, TV show, short, episode, video game, etc.).
- **Primary Key**: `tconst`
- **File Role**: Core title metadata entity table.

| Column Name | Data Type | Key Role | Missing Marker | Directly Useful for Viz? | Description & Important Cautions |
|---|---|---|---|---|---|
| `tconst` | String | **PK** | None | Indirect (Join key) | Unique alphanumeric identifier for the title (e.g., `tt0000001`). Format: `tt` + 7-8 digits. |
| `titleType` | Categorical String | Attribute | None | **YES** | Type/format of title (e.g., `movie`, `short`, `tvSeries`, `tvEpisode`, `video`, `tvMiniSeries`). Critical for domain filtering. |
| `primaryTitle` | String | Attribute | None | **YES** | The main title used by IMDb for display (localized or international standard in UTF-8). |
| `originalTitle` | String | Attribute | None | No | Original title in original language/script. Useful for multilingual analysis. |
| `isAdult` | Integer (0/1) | Attribute | None | **YES** | Binary flag: `0` = non-adult, `1` = adult content. Can be filtered out for general audience visualisations. |
| `startYear` | Integer / String | Attribute | `\N` | **YES** | Release year for movies, or start year for TV series. Format: YYYY (4 digits). Essential for temporal trend analysis. |
| `endYear` | Integer / String | Attribute | `\N` | **YES** (TV only) | End year for TV series. `\N` for movies or ongoing series. |
| `runtimeMinutes` | Integer / String | Attribute | `\N` | **YES** | Duration of title in minutes. Contains extreme outliers (e.g. 0 to 14,000+ mins). Requires clean numeric parsing. |
| `genres` | Comma-separated String | Attribute | `\N` | **YES** | Up to 3 comma-separated genres per title (e.g., `Action,Adventure,Sci-Fi`). Requires multi-label splitting for genre analysis. |

---

## 2. `title.ratings.tsv`
- **Granularity**: One row per rated title.
- **Primary Key**: `tconst` (1-to-1 or 1-to-0 relation with `title.basics`).
- **File Role**: Core performance metric table.

| Column Name | Data Type | Key Role | Missing Marker | Directly Useful for Viz? | Description & Important Cautions |
|---|---|---|---|---|---|
| `tconst` | String | **PK / FK** | None | Indirect | Foreign key referencing `title.basics.tconst`. |
| `averageRating` | Float (1.0 to 10.0) | Attribute | None | **YES** | Weighted mean user rating on IMDb. Range: 1.0 to 10.0 (1 decimal place). Main quality metric. |
| `numVotes` | Integer | Attribute | None | **YES** | Number of vote ratings submitted on IMDb. Highly skewed distribution (from 5 votes to >2.7 million votes). Crucial credibility weight. |

---

## 3. `name.basics.tsv`
- **Granularity**: One row per unique person (actor, director, writer, crew member, etc.).
- **Primary Key**: `nconst`
- **File Role**: Core individual / cast / crew person entity table.

| Column Name | Data Type | Key Role | Missing Marker | Directly Useful for Viz? | Description & Important Cautions |
|---|---|---|---|---|---|
| `nconst` | String | **PK** | None | Indirect (Join key) | Unique alphanumeric identifier for person (e.g., `nm0000001`). Format: `nm` + 7-8 digits. |
| `primaryName` | String | Attribute | None | **YES** | Full name of the individual in UTF-8 display format. |
| `birthYear` | Integer / String | Attribute | `\N` | **YES** | Birth year (YYYY). Useful for age distribution at time of movie release. |
| `deathYear` | Integer / String | Attribute | `\N` | **YES** | Death year (YYYY), or `\N` if living/unknown. |
| `primaryProfession` | Comma-separated String | Attribute | `\N` | **YES** | Top 3 professions (e.g., `actor,producer,director`). |
| `knownForTitles` | Comma-separated String | Foreign Keys | `\N` | **YES** | Up to 4 comma-separated `tconst` values representing the person's most famous titles. |

---

## 4. `title.crew.tsv`
- **Granularity**: One row per title containing directors and writers lists.
- **Primary Key**: `tconst`
- **File Role**: High-level director/writer relational link table.

| Column Name | Data Type | Key Role | Missing Marker | Directly Useful for Viz? | Description & Important Cautions |
|---|---|---|---|---|---|
| `tconst` | String | **PK / FK** | None | Indirect | Foreign key referencing `title.basics.tconst`. |
| `directors` | Comma-separated String | FKs (`nconst`) | `\N` | **YES** | Comma-separated list of director `nconst` IDs for the title. |
| `writers` | Comma-separated String | FKs (`nconst`) | `\N` | **YES** | Comma-separated list of writer `nconst` IDs for the title. |

---

## 5. `title.principals.tsv`
- **Granularity**: One row per principal cast/crew member role per title (ordered 1..10 per title).
- **Composite Primary Key**: (`tconst`, `ordering`)
- **File Role**: Detailed cast and crew role assignment link table.

| Column Name | Data Type | Key Role | Missing Marker | Directly Useful for Viz? | Description & Important Cautions |
|---|---|---|---|---|---|
| `tconst` | String | **FK** | None | Indirect | References `title.basics.tconst`. |
| `ordering` | Integer (1 to 10) | Attribute | None | **YES** | Order of billing / importance for this principal on the title (1 = lead). |
| `nconst` | String | **FK** | None | Indirect | References `name.basics.nconst`. |
| `category` | String | Attribute | None | **YES** | Role category (e.g. `actor`, `actress`, `director`, `writer`, `producer`, `cinematographer`, `composer`, `editor`, `self`). |
| `job` | String | Attribute | `\N` | Optional | Specific job title if applicable (e.g. "executive producer"). High missing percentage. |
| `characters` | JSON array String | Attribute | `\N` | **YES** | Character name(s) played (e.g. `["Self"]` or `["Luke Skywalker"]`). |

---

## 6. `title.akas.tsv`
- **Granularity**: One row per localized title variation / region release per title.
- **Composite Primary Key**: (`titleId`, `ordering`)
- **File Role**: Internationalization and regional distribution table.

| Column Name | Data Type | Key Role | Missing Marker | Directly Useful for Viz? | Description & Important Cautions |
|---|---|---|---|---|---|
| `titleId` | String | **FK** | None | Indirect | References `title.basics.tconst`. |
| `ordering` | Integer | Attribute | None | No | Sequence number of the title variant for this `titleId`. |
| `title` | String | Attribute | None | **YES** | Localized title string in local language/script. |
| `region` | Categorical String (2-letter ISO) | Attribute | `\N` | **YES** | Country/region code (e.g. `US`, `GB`, `FR`, `DE`, `JP`). Key for spatial distribution analysis. |
| `language` | Categorical String | Attribute | `\N` | **YES** | Language code (e.g. `en`, `fr`, `es`). High missing value count in IMDb. |
| `types` | Comma-separated String | Attribute | `\N` | Optional | Type of alternative title (e.g. `alternative`, `dvd`, `festival`, `tv`, `working`, `original`). |
| `attributes` | String | Attribute | `\N` | No | Additional notes/attributes (e.g. "informal title"). |
| `isOriginalTitle` | Integer (0/1) | Attribute | `\N` | **YES** | Binary flag: `1` if this entry is the original title in local region. |

---

## 7. `title.episode.tsv`
- **Granularity**: One row per TV episode.
- **Primary Key**: `tconst` (episode title ID)
- **File Role**: Hierarchy mapping for TV series and season/episode numbers.

| Column Name | Data Type | Key Role | Missing Marker | Directly Useful for Viz? | Description & Important Cautions |
|---|---|---|---|---|---|
| `tconst` | String | **PK / FK** | None | Indirect | Foreign key referencing `title.basics.tconst` for the specific episode title. |
| `parentTconst` | String | **FK** | None | **YES** | Foreign key referencing `title.basics.tconst` of the parent TV Series. |
| `seasonNumber` | Integer / String | Attribute | `\N` | **YES** | Season index number of the episode. |
| `episodeNumber` | Integer / String | Attribute | `\N` | **YES** | Episode index number within the season. |
