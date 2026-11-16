#!/usr/bin/env python3
"""Generate src/content.json from ../content.yaml (the single source of truth).
Run from the web/ folder:  python3 scripts/yaml_to_json.py
"""
import json
import pathlib

import yaml

HERE = pathlib.Path(__file__).resolve()
YAML_PATH = HERE.parents[2] / "content.yaml"
OUT_PATH = HERE.parents[1] / "src" / "content.json"


def main() -> None:
    with YAML_PATH.open(encoding="utf-8") as f:
        data = yaml.safe_load(f)
    OUT_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUT_PATH} from {YAML_PATH}")


if __name__ == "__main__":
    main()
