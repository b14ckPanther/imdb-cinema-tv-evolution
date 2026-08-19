# IMDb Cinema & TV Evolution Explorer (1920–2025)

Interactive information visualization project exploring long-term patterns in IMDb movies and TV series between 1920 and 2025.

## Live Project

**Interactive Visualization:**  
https://imdb-cinema-tv-evolution.vercel.app/

**GitHub Repository:**  
https://github.com/b14ckPanther/imdb-cinema-tv-evolution

---

## Course & Team

- **Course:** Information Visualization (2025-2026)
- **Dataset:** IMDb Non-Commercial Datasets
- **Team Members:**
  1. **Noor Alden Mousa**
  2. **Aya Khalaila**
  3. **Sleeman Eketeh**

> Student IDs are intentionally omitted from the public repository for privacy and are included in the final submission report.

---

## Project Overview

The **IMDb Cinema & TV Evolution Explorer** is a web-based interactive visualization designed to examine how movies and TV series represented in IMDb have changed over time.

The project focuses on several related questions:

- How has the volume of movies and TV series changed between 1920 and 2025?
- How have IMDb audience ratings changed over time?
- Which genres are most frequently represented, and how does genre composition differ across periods?
- What is the relationship between audience rating and popularity?
- How do movies and TV series compare within the same rating-popularity space?
- How do different historical periods and popularity thresholds affect the observed patterns?

The dashboard combines temporal, categorical, and multivariate views within a coordinated interactive interface.

---

## Dataset

The project uses two files from the official **IMDb Non-Commercial Datasets**:

- `title.basics.tsv.gz` — title type, primary title, release year, runtime, and genres.
- `title.ratings.tsv.gz` — average IMDb audience rating and number of user votes.

Source:

https://datasets.imdbws.com/

Direct source files:

- https://datasets.imdbws.com/title.basics.tsv.gz
- https://datasets.imdbws.com/title.ratings.tsv.gz

The source datasets are substantially larger than the final analytical subset:

- `title.basics.tsv` contains approximately **12.67 million** title records.
- `title.ratings.tsv` contains approximately **1.70 million** rated-title records.

After preprocessing, the final analytical dataset contains **58,288 movies and TV series** satisfying the following criteria:

- Title type is `movie` or `tvSeries`
- Release/start year is between **1920 and 2025**
- At least **1,000 IMDb votes**
- Required analytical values are valid after preprocessing

---

## Data Preparation

The raw IMDb datasets were processed in Python before being used by the interactive application.

The main preprocessing steps were:

1. **Title selection** — retained only movies and TV series.
2. **Time filtering** — retained titles from 1920–2025 with a valid start year.
3. **Ratings integration** — joined title metadata with IMDb ratings using the `tconst` identifier.
4. **Vote threshold** — removed titles with fewer than 1,000 IMDb votes.
5. **Data cleaning** — handled missing or invalid analytical values and excluded implausible runtime values from runtime-based calculations.
6. **Genre preparation** — prepared genre information for consistent filtering and aggregation.
7. **Web optimization** — exported the processed data as compact JSON files for efficient browser loading and interaction.

The resulting **58,288-title analytical dataset** serves as the common data source for the visualizations and interactive analyses in the application.

---

## Visualization Design

The dashboard contains three main coordinated visualizations:

### Temporal Cinema Timeline

A time-series visualization showing changes between 1920 and 2025.

Users can switch between:

- Release Volume
- Mean Audience Rating
- Mean Runtime

The timeline also supports brushing to select a specific year range.

### Top Genre Distribution

A horizontal bar chart showing the most frequent genres within the current selection.

The chart updates according to the active filters and supports genre isolation through interaction.

### Multivariate Rating & Popularity Distribution

A scatterplot combining multiple title-level attributes:

- **X-axis:** IMDb audience rating
- **Y-axis:** IMDb vote count on a logarithmic scale
- **Color:** Genre
- **Point size:** Runtime
- **Point shape:** Movie or TV series when distinct shapes are enabled

The scatterplot supports simultaneous exploration of rating, popularity, genre, runtime, and format.

---

## Interactive Features

The application provides coordinated filtering and exploration through:

- Release-year range filtering
- Minimum vote threshold
- Genre filtering
- Movie / TV-series format selection
- Historical-era selection
- Title search
- Timeline brushing
- Genre-bar interaction
- Quick presets
- Movie vs. TV-series comparison
- Side-by-Side Compare mode
- Distinct point shapes
- Benchmark guide
- Interactive tooltips
- Exportable visualization images

All relevant views and summary measures update according to the active selection.

---

## Tools and Technologies

### Web Visualization

- **Vite**
- **D3.js**
- **Vanilla JavaScript (ES Modules)**
- **Vanilla CSS3**

### Data Processing

- **Python**
- **Pandas**
- **PyArrow**
- **NumPy**

### Development and Deployment

- **Git**
- **GitHub**
- **Vercel**

---

## AI-Assisted Development

AI-assisted tools were used during the development process.

### ChatGPT

ChatGPT supported:

- Research planning
- Visualization design decisions
- Review of analytical interpretations
- Documentation and report preparation
- Development-related reasoning and troubleshooting

### Antigravity

Antigravity was used as a multi-agent development environment to support:

- Data auditing
- Python preprocessing scripts
- D3 visualization implementation
- Debugging
- Build verification

The final visualization design, implementation decisions, analytical interpretation, and submitted project were reviewed and validated as part of the project development process.

---

## Performance

The full filtered dataset is retained for filtering and summary calculations.

When a filtered selection is large, the multivariate scatterplot displays up to **3,500 sampled titles** to maintain responsive browser performance. Summary measures continue to use the complete filtered dataset.

This approach reduces rendering cost while preserving the broader analytical context of the selected data.

---

## Directory Structure

```text
imdb-cinema-tv-evolution/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── README.md
├── .gitignore
├── docs/
├── scripts/
│   ├── preprocess_data.py
│   └── audit_imdb_data.py
├── src/
│   ├── assets/
│   ├── charts/
│   ├── data/
│   ├── state/
│   ├── ui/
│   └── main.js
└── outputs/
```

---

## Local Development

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Project Resources

**Live Visualization:**  
https://imdb-cinema-tv-evolution.vercel.app/

**Source Code:**  
https://github.com/b14ckPanther/imdb-cinema-tv-evolution

**IMDb Non-Commercial Datasets:**  
https://developer.imdb.com/non-commercial-datasets/