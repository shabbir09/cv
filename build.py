#!/usr/bin/env python3
"""
Shabbir Ahmed — CV builder.
Reads content.yaml (the single source of truth) and renders:
  dist/Shabbir_Ahmed_Academic_CV.pdf  (+ .html, .md)
  dist/Shabbir_Ahmed_Founder_CV.pdf   (+ .html, .md)
  dist/qr_linkedin.png                (QR to the LinkedIn profile)
  dist/index.html                     (simple local share page — the PUBLISHED
                                       share page is the React app in web/,
                                       assembled by .github/workflows/build.yml)

Usage:  python3 build.py
Requires: rendercv, pyyaml, segno  (pip install "rendercv[full]" segno pyyaml)
"""
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
BUILD = ROOT / "build"
LINKEDIN_URL = "https://www.linkedin.com/in/shabbir-ahmed09"


def pick(items, variant):
    return [i for i in items if variant in i.get("show_on", [])]


def exp_entries(items):
    out = []
    for i in items:
        e = {
            "company": i["company"],
            "position": i["position"],
            "start_date": i["start"],
            "end_date": i["end"],
            "location": i["location"],
            "highlights": i.get("highlights", []),
        }
        out.append(e)
    return out


def edu_entries(items):
    out = []
    for i in items:
        e = {"institution": i["institution"], "area": i["area"]}
        if i.get("degree"):
            e["degree_type"] = i["degree"]
        e["start_date"] = i["start"]
        e["end_date"] = i["end"]
        e["location"] = i["location"]
        if i.get("highlights"):
            e["highlights"] = i["highlights"]
        out.append(e)
    return out


def pub_entries(items):
    out = []
    for i in items:
        e = {
            "title": i["title"],
            "authors": i["authors"],
            "date": i["date"],
            "journal": i["journal"],
        }
        if i.get("doi"):
            e["doi"] = i["doi"]
        out.append(e)
    return out


def oneline_entries(items):
    return [{"label": i["label"], "details": i["details"]} for i in items]


def make_cv(data, variant):
    p = data["personal"]
    headline = p[f"headline_{variant}"]
    if variant == "academic":
        sections = {
            "About": [headline],
            "Education": edu_entries(pick(data["education"], variant)),
            "Experience": exp_entries(pick(data["experience"], variant)),
            "Research Experience": exp_entries(pick(data["research"], variant)),
            "Publications": pub_entries(pick(data["publications"], variant)),
            "Skills": oneline_entries(pick(data["skills"], variant)),
            "Relevant Coursework": oneline_entries(pick(data["coursework"], variant)),
            "Honors and Awards": oneline_entries(pick(data["awards"], variant)),
        }
        theme = "classic"
    else:
        sections = {
            "Profile": [headline],
            "Experience": exp_entries(pick(data["experience"], variant)),
            "Research Background": exp_entries(pick(data["research"], variant)),
            "Publications": pub_entries(pick(data["publications"], variant)),
            "Education": edu_entries(pick(data["education"], variant)),
            "Skills": oneline_entries(pick(data["skills"], variant)),
        }
        theme = "engineeringresumes"
    return {
        "cv": {
            "name": p["name"],
            "location": p["location"],
            "email": p["email"],
            "phone": p["phone"],
            "social_networks": [
                {"network": "LinkedIn", "username": p["linkedin"]},
                {"network": "GitHub", "username": p["github"]},
            ],
            "sections": sections,
        },
        "design": {"theme": theme},
        "locale": {"language": "english"},
        "settings": {
            "render_command": {
                "output_folder": str(DIST),
                "dont_generate_markdown": False,
                "dont_generate_html": False,
                "dont_generate_png": True,
            }
        },
    }


def main():
    data = yaml.safe_load((ROOT / "content.yaml").read_text())
    DIST.mkdir(exist_ok=True)
    BUILD.mkdir(exist_ok=True)

    for variant, label in [("academic", "Academic"), ("founder", "Founder")]:
        cv = make_cv(data, variant)
        ypath = BUILD / f"Shabbir_Ahmed_{label}.yaml"
        ypath.write_text(yaml.safe_dump(cv, sort_keys=False, allow_unicode=True))
        print(f"-> rendering {label} CV ...")
        r = subprocess.run(
            ["rendercv", "render", str(ypath)],
            capture_output=True, text=True, cwd=ROOT,
        )
        if r.returncode != 0:
            print(r.stdout[-3000:])
            print(r.stderr[-3000:])
            sys.exit(f"rendercv failed for {label}")
        # RenderCV names output after cv.name only — rename per variant
        for ext in ["pdf", "html", "md", "typ"]:
            src = DIST / f"Shabbir_Ahmed_CV.{ext}"
            if src.exists():
                src.rename(DIST / f"Shabbir_Ahmed_{label}_CV.{ext}")

    # Normalise output names: rendercv writes <Name>_CV.pdf from the yaml stem's cv.name
    for label in ["Academic", "Founder"]:
        for ext in ["pdf", "html", "md"]:
            for cand in DIST.glob(f"*_{label}_CV.{ext}"):
                pass  # already well-named if stem matched; fall through check below
    pdfs = sorted(DIST.glob("*.pdf"))
    print("PDFs:", [p.name for p in pdfs])

    # QR code -> LinkedIn (stable target; repoint in one line when his domain lands)
    try:
        import segno
        qr = segno.make(LINKEDIN_URL, error="m")
        qr.save(str(DIST / "qr_linkedin.png"), scale=8, border=2)
        print("QR saved: dist/qr_linkedin.png ->", LINKEDIN_URL)
    except ImportError:
        print('segno not installed; skipping QR (pip install "rendercv[full]" segno pyyaml)')

    # Share page for GitHub Pages
    names = {p.name: p for p in pdfs}
    acad = next((n for n in names if "Academic" in n), "")
    found = next((n for n in names if "Founder" in n), "")
    (DIST / "index.html").write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shabbir Ahmed — CV</title>
<style>body{{font-family:system-ui,sans-serif;max-width:640px;margin:3rem auto;padding:0 1rem;line-height:1.5}}
a.btn{{display:block;border:1px solid #222;border-radius:10px;padding:1rem 1.2rem;margin:1rem 0;text-decoration:none;color:#111}}
a.btn:hover{{background:#f4f4f4}} small{{color:#666}}</style></head>
<body><h1>Shabbir Ahmed</h1>
<p>Founder of Orion AI · Computer Science graduate, North South University · Dhaka, Bangladesh</p>
<a class="btn" href="{found}"><strong>Founder CV</strong><br><small>AI systems, consulting and ventures</small></a>
<a class="btn" href="{acad}"><strong>Academic CV</strong><br><small>Teaching, research and publications</small></a>
<p><small>Both PDFs rebuild automatically from one source file whenever it is edited.</small></p>
</body></html>""")
    print("Share page saved: dist/index.html")
    print("DONE")


if __name__ == "__main__":
    main()
