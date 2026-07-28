"""
inspect_imdb_files.py

Inspects IMDb dataset files in the specified directory without loading entire files into memory.
Outputs file sizes, schemas, missing value representations, and sample records.
"""

import json
import gzip
import logging
import pathlib
from typing import Dict, List, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)


def infer_column_type(sample_values: List[str]) -> str:
    """Helper function to infer column data type from sample values."""
    non_null_vals = [v for v in sample_values if v != "\\N" and v != ""]
    if not non_null_vals:
        return "string (all nulls in sample)"

    all_ints = True
    all_floats = True
    for val in non_null_vals:
        try:
            int(val)
        except ValueError:
            all_ints = False
        try:
            float(val)
        except ValueError:
            all_floats = False

    if all_ints:
        return "integer"
    elif all_floats:
        return "float"
    else:
        return "string"


def inspect_file(file_path: pathlib.Path, sample_size: int = 5) -> Dict[str, Any]:
    """
    Inspects a single TSV or TSV.GZ file safely.

    Args:
        file_path: Path to the file to inspect.
        sample_size: Number of sample data rows to extract.

    Returns:
        Dict containing file metadata, columns, and sample rows.
    """
    logger.info(f"Inspecting file: {file_path.name}")
    size_bytes = file_path.stat().st_size
    size_mb = size_bytes / (1024 * 1024)
    size_gb = size_bytes / (1024 * 1024 * 1024)

    is_gz = file_path.suffix.lower() == ".gz" or file_path.name.lower().endswith(".tsv.gz")

    lines: List[str] = []
    try:
        if is_gz:
            with gzip.open(file_path, "rt", encoding="utf-8", errors="replace") as f:
                for _ in range(sample_size + 1):
                    line = f.readline()
                    if not line:
                        break
                    lines.append(line.rstrip("\r\n"))
        else:
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                for _ in range(sample_size + 1):
                    line = f.readline()
                    if not line:
                        break
                    lines.append(line.rstrip("\r\n"))
    except Exception as e:
        logger.error(f"Error reading {file_path.name}: {e}")
        return {"file_name": file_path.name, "error": str(e)}

    if not lines:
        return {"file_name": file_path.name, "error": "File is empty"}

    header = lines[0].split("\t")
    sample_rows = [line.split("\t") for line in lines[1:]]

    # Inferred schema based on headers & sample values
    schema: Dict[str, str] = {}
    for col_idx, col_name in enumerate(header):
        sample_vals = [row[col_idx] if col_idx < len(row) else "" for row in sample_rows]
        schema[col_name] = infer_column_type(sample_vals)

    return {
        "file_name": file_path.name,
        "is_compressed": is_gz,
        "size_bytes": size_bytes,
        "size_mb": round(size_mb, 2),
        "size_gb": round(size_gb, 4),
        "missing_value_notation": "\\N",
        "num_columns": len(header),
        "columns": header,
        "inferred_schema": schema,
        "sample_rows": sample_rows
    }


def main() -> None:
    project_root = pathlib.Path(__file__).resolve().parent.parent
    imdb_dir = project_root / "IMDb"
    output_dir = project_root / "outputs" / "audit"
    output_dir.mkdir(parents=True, exist_ok=True)

    if not imdb_dir.exists():
        logger.error(f"IMDb directory not found at {imdb_dir}")
        return

    tsv_files = sorted(list(imdb_dir.glob("*.tsv")) + list(imdb_dir.glob("*.tsv.gz")))
    tsv_files = [f for f in tsv_files if not f.name.startswith(".")]

    logger.info(f"Found {len(tsv_files)} IMDb TSV files to inspect.")

    inspection_results = {}
    for file_path in tsv_files:
        info = inspect_file(file_path)
        inspection_results[file_path.name] = info

        print("\n" + "=" * 60)
        print(f"File: {info['file_name']}")
        print(f"Size: {info['size_mb']} MB ({info['size_gb']} GB)")
        print(f"Columns ({info['num_columns']}): {', '.join(info['columns'])}")
        print(f"Missing Value Notation: {info['missing_value_notation']}")
        print("Inferred Schema:")
        for col, col_type in info.get("inferred_schema", {}).items():
            print(f"  - {col}: {col_type}")
        print(f"Sample Rows (First {len(info.get('sample_rows', []))} rows):")
        for idx, row in enumerate(info.get("sample_rows", []), 1):
            print(f"  Row {idx}: {row}")

    json_output_path = output_dir / "file_inspection.json"
    with open(json_output_path, "w", encoding="utf-8") as f:
        json.dump(inspection_results, f, indent=2)
    logger.info(f"Inspection summary saved to {json_output_path}")


if __name__ == "__main__":
    main()
