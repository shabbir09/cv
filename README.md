# Shabbir Ahmed — CV System

One source file. Two CVs. One permanent link.

## How it works

- **`content.yaml`** — the ONLY file you ever edit. Every job, publication and
  skill lives here once. Each entry has a `show_on` tag: `academic`, `founder`,
  or both.
- **`build.py`** — renders both PDFs (RenderCV + Typst), a QR code to the
  LinkedIn profile, and the share page (`index.html`).
- **GitHub Actions** (`.github/workflows/build.yml`) — on every push, rebuilds
  everything and republishes the share page, so the link below always serves
  the latest version.

## Your permanent share link

Once this folder is pushed to a GitHub repo named `cv` (public) with
Settings → Pages → Source = "GitHub Actions", your CVs live at:

**https://shabbir09.github.io/cv/**

Share that one link everywhere — WhatsApp, LinkedIn Featured section, email
signature. It never changes and never goes stale.

## Editing (phone-friendly)

1. Open `content.yaml` in the GitHub app or browser.
2. Edit the text, commit.
3. Wait ~1 minute. Both PDFs are rebuilt and the link above serves the new
   versions.

## Local build

```bash
pip install rendercv segno pyyaml
python3 build.py
# PDFs land in dist/
```

## Facts policy baked into v1

- No "MS — Studying" line (admitted to NSU MS, never attended — excluded).
- Teaching shown in the past tense (Lab Instructor ended April 2025).
- No unverified revenue/client claims anywhere.
- Dates for the 2026 founder roles are marked from when the ventures are
  documented; adjust in `content.yaml` if a start date differs.
