# Shabbir Ahmed — CV System

One source file. Two CVs, three renders. One permanent link.

## How it works

- **`content.yaml`** — the ONLY file you ever edit. Every job, publication and
  skill lives here once. Each entry has a `show_on` tag: `academic`, `founder`,
  or both.
- **GitHub Actions** (`.github/workflows/build.yml`) — on every push, runs the
  full pipeline below and republishes the site, so the link below always
  serves the latest version.

### The three renders

1. **ATS twin** — `build.py` (RenderCV + Typst) renders the machine-readable
   PDFs (`dist/Shabbir_Ahmed_Founder_CV.pdf`, `dist/Shabbir_Ahmed_Academic_CV.pdf`)
   and the LinkedIn QR code (`dist/qr_linkedin.png`).
2. **Premium PDFs** — the React app in `web/` (the Forge + Scholar designs in
   `DESIGN.md`) is printed to PDF with Playwright/Chromium:
   `Shabbir_Ahmed_Founder_CV_premium.pdf`, `Shabbir_Ahmed_Academic_CV_premium.pdf`.
3. **Web CV** — the same React app *is* the share page, with download buttons
   for all four PDFs.

### Publish assembly

CI collects the web build (`web/dist/`) plus the two ATS PDFs, the two
premium PDFs and `qr_linkedin.png` into a `publish/` folder and deploys that
to GitHub Pages. Fonts (Inter, Space Grotesk, Fraunces) ship as Fontsource
npm packages bundled by Vite — **no font or image binaries live in this
repo**; the QR is generated fresh by `build.py` on every run. The print
step hard-fails if a real font face fails to load, so a fallback-font PDF
can never ship silently.

## Your permanent share link

This repo is `cv` (public) with Settings → Pages → Source = "GitHub Actions",
so your CVs live at:

**https://shabbir09.github.io/cv/**

Share that one link everywhere — WhatsApp, LinkedIn Featured section, email
signature. It never changes and never goes stale.

## Editing (phone-friendly)

1. Open `content.yaml` in the GitHub app or browser.
2. Edit the text, commit.
3. Wait ~2 minutes. All renders are rebuilt and the link above serves the
   new versions.

## Local build

```bash
pip install "rendercv[full]" segno pyyaml
python3 build.py                  # ATS PDFs + QR -> dist/

cd web
python3 scripts/yaml_to_json.py   # content.yaml -> src/content.json
npm ci && npm run build
npx playwright install chromium   # first time only
node scripts/print.mjs founder    # premium PDFs -> ../premium/
node scripts/print.mjs academic
```

## Facts policy baked into v1

- No "MS — Studying" line (admitted to NSU MS, never attended — excluded).
- Teaching shown in the past tense (Lab Instructor ended April 2025).
- No unverified revenue/client claims anywhere.
- Dates for the 2026 founder roles are marked from when the ventures are
  documented; adjust in `content.yaml` if a start date differs.
