"""
preprocess_data.py

Reproducible Python Data Preprocessing Pipeline for Stage 4.
Extracts, cleans, filters, joins, and exports browser-ready compact JSON files
from raw IMDb source TSVs matching approved Stage 2B decisions.

Scope: Movies & TV Series with numVotes >= 1000 and isAdult == '0'
Exact Extracted Record Target: 58,990 titles
Target Payload Size: < 4.5 MB uncompressed (< 1.2 MB gzipped)

Outputs:
  - src/data/summary_titles.json
  - src/data/genres_summary.json
  - src/data/data_metrics.json
"""

import json
import logging
import pathlib
import datetime
from typing import Dict, Any, List
import pandas as pd
import numpy as np

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


def run_preprocessing(imdb_dir: pathlib.Path, output_dir: pathlib.Path) -> Dict[str, Any]:
    logger.info("Starting Stage 4 data preprocessing pipeline...")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # 1. LOAD TITLE.BASICS.TSV
    logger.info("Loading IMDb/title.basics.tsv...")
    basics_df = pd.read_csv(
        imdb_dir / "title.basics.tsv",
        sep="\t",
        dtype=str,
        keep_default_na=False,
        quoting=3
    )
    raw_basics_count = len(basics_df)

    filtered_basics = basics_df[
        (basics_df["isAdult"] == "0") &
        (basics_df["titleType"].isin(["movie", "tvSeries"]))
    ].copy()

    filtered_basics["startYear_num"] = pd.to_numeric(filtered_basics["startYear"].replace("\\N", np.nan), errors="coerce")
    filtered_basics["runtime_num"] = pd.to_numeric(filtered_basics["runtimeMinutes"].replace("\\N", np.nan), errors="coerce")
    
    filtered_basics = filtered_basics[
        filtered_basics["startYear_num"].notna() &
        (filtered_basics["startYear_num"] >= 1880) &
        (filtered_basics["startYear_num"] <= 2030)
    ].copy()

    # 2. LOAD TITLE.RATINGS.TSV
    logger.info("Loading IMDb/title.ratings.tsv...")
    ratings_df = pd.read_csv(
        imdb_dir / "title.ratings.tsv",
        sep="\t",
        dtype={"tconst": str, "averageRating": float, "numVotes": int},
        keep_default_na=False,
        quoting=3
    )
    raw_ratings_count = len(ratings_df)

    VOTE_THRESHOLD = 1000
    filtered_ratings = ratings_df[ratings_df["numVotes"] >= VOTE_THRESHOLD].copy()

    # 3. INNER JOIN
    logger.info("Joining filtered title.basics and title.ratings on tconst...")
    joined_df = pd.merge(filtered_basics, filtered_ratings, on="tconst", how="inner")
    joined_count = len(joined_df)

    assert joined_count == 58990, f"Expected 58,990 rows, but got {joined_count}"
    assert joined_df["tconst"].duplicated().sum() == 0, "Duplicate tconst detected in join output!"

    joined_df.sort_values(by="numVotes", ascending=False, inplace=True)

    # 4. ENCODE & COMPACT FOR FRONTEND (< 4.5 MB Payload Target)
    genre_set = set()
    for g_str in joined_df["genres"]:
        if g_str and g_str != "\\N":
            for g in g_str.split(","):
                genre_set.add(g.strip())
    
    genre_list = sorted(list(genre_set))
    genre_to_idx = {g: i for i, g in enumerate(genre_list)}

    compact_records = []
    for _, row in joined_df.iterrows():
        g_indices = []
        if row["genres"] and row["genres"] != "\\N":
            g_indices = [genre_to_idx[g.strip()] for g in row["genres"].split(",") if g.strip() in genre_to_idx]
        
        # Omit null keys to shrink payload size
        rec = {
            "i": row["tconst"],
            "t": row["primaryTitle"],
            "y": int(row["startYear_num"]),
            "r": round(float(row["averageRating"]), 1),
            "v": int(row["numVotes"]),
            "g": g_indices,
            "k": 0 if row["titleType"] == "movie" else 1
        }
        if pd.notna(row["runtime_num"]):
            rec["m"] = int(row["runtime_num"])
            
        compact_records.append(rec)

    # 5. PRECOMPUTE DECADE METRICS (Volume, Mean Rating, Mean Runtime)
    decade_data: Dict[int, Dict[str, Any]] = {}

    for rec in compact_records:
        decade = (rec["y"] // 10) * 10
        if decade not in decade_data:
            decade_data[decade] = {
                "decade": decade,
                "movie_count": 0, "tv_count": 0, "total_count": 0,
                "movie_rating_sum": 0.0, "tv_rating_sum": 0.0, "total_rating_sum": 0.0,
                "movie_runtime_sum": 0, "movie_runtime_cnt": 0,
                "tv_runtime_sum": 0, "tv_runtime_cnt": 0
            }
        
        d = decade_data[decade]
        d["total_count"] += 1
        d["total_rating_sum"] += rec["r"]
        
        if rec["k"] == 0:
            d["movie_count"] += 1
            d["movie_rating_sum"] += rec["r"]
            if "m" in rec:
                d["movie_runtime_sum"] += rec["m"]
                d["movie_runtime_cnt"] += 1
        else:
            d["tv_count"] += 1
            d["tv_rating_sum"] += rec["r"]
            if "m" in rec:
                d["tv_runtime_sum"] += rec["m"]
                d["tv_runtime_cnt"] += 1

    decades_summary = []
    for d_year, d in sorted(decade_data.items()):
        total_cnt = d["total_count"]
        m_cnt = d["movie_count"]
        tv_cnt = d["tv_count"]

        decades_summary.append({
            "decade": d_year,
            "total_count": total_cnt,
            "movie_count": m_cnt,
            "tv_count": tv_cnt,
            "avg_rating_all": round(d["total_rating_sum"] / total_cnt, 2) if total_cnt > 0 else 0,
            "avg_rating_movie": round(d["movie_rating_sum"] / m_cnt, 2) if m_cnt > 0 else 0,
            "avg_rating_tv": round(d["tv_rating_sum"] / tv_cnt, 2) if tv_cnt > 0 else 0,
            "avg_runtime_movie": round(d["movie_runtime_sum"] / d["movie_runtime_cnt"], 1) if d["movie_runtime_cnt"] > 0 else 0,
            "avg_runtime_tv": round(d["tv_runtime_sum"] / d["tv_runtime_cnt"], 1) if d["tv_runtime_cnt"] > 0 else 0
        })

    # Genre stats
    genre_summary = []
    for g_name in genre_list:
        g_idx = genre_to_idx[g_name]
        g_titles = [r for r in compact_records if g_idx in r["g"]]
        cnt = len(g_titles)
        m_cnt = sum(1 for r in g_titles if r["k"] == 0)
        tv_cnt = sum(1 for r in g_titles if r["k"] == 1)
        avg_r = round(sum(r["r"] for r in g_titles) / cnt, 2) if cnt > 0 else 0.0

        classical_cnt = sum(1 for r in g_titles if 1920 <= r["y"] <= 1970)
        modern_cnt = sum(1 for r in g_titles if r["y"] >= 1971)

        genre_summary.append({
            "name": g_name,
            "id": g_idx,
            "count": cnt,
            "movie_count": m_cnt,
            "tv_count": tv_cnt,
            "avg_rating": avg_r,
            "classical_count": classical_cnt,
            "modern_count": modern_cnt
        })

    genre_summary.sort(key=lambda x: x["count"], reverse=True)

    # 6. WRITE JSON OUTPUT FILES
    titles_json_path = output_dir / "summary_titles.json"
    with open(titles_json_path, "w", encoding="utf-8") as f:
        json.dump(compact_records, f, separators=(",", ":"))
    
    genres_json_path = output_dir / "genres_summary.json"
    with open(genres_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "genres": genre_summary,
            "genre_list": genre_list,
            "decades": decades_summary
        }, f, indent=2)

    titles_file_size_mb = round(titles_json_path.stat().st_size / (1024 * 1024), 2)

    metrics = {
        "pipeline_timestamp_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "raw_title_basics_rows": raw_basics_count,
        "raw_title_ratings_rows": raw_ratings_count,
        "vote_threshold": VOTE_THRESHOLD,
        "final_extracted_titles": joined_count,
        "movies_count": int(sum(1 for r in compact_records if r["k"] == 0)),
        "tv_series_count": int(sum(1 for r in compact_records if r["k"] == 1)),
        "genres_count": len(genre_list),
        "titles_json_file_size_mb": titles_file_size_mb,
        "output_directory": str(output_dir.resolve())
    }

    metrics_json_path = output_dir / "data_metrics.json"
    with open(metrics_json_path, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    logger.info(f"Successfully exported {joined_count:,} titles to {titles_json_path} ({titles_file_size_mb} MB)")
    return metrics


if __name__ == "__main__":
    project_root = pathlib.Path(__file__).resolve().parent.parent
    run_preprocessing(project_root / "IMDb", project_root / "src" / "data")
