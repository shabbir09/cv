# CV Design Spec v1.2 — "Forge & Scholar"

One source (`content.yaml`) → three renders:
1. **ATS twin** — RenderCV (already live; unchanged).
2. **Premium PDF** — React print render (this spec).
3. **Web CV** — same React components, screen layout, at the /cv share page.

Decision (16 Nov 2026): React route chosen over Typst — the CV is a sales
asset and proof of engineering; Typst remains the fallback if the React
print render fails verification twice in Block 2.

Revision v1.2 (16 Nov 2026) — Gemini screenshot review of the Block 2
render incorporated (approved by Shabbir as the "full fix package"):
- Founder rail becomes a subtle tinted side panel (token `panel` below)
  so it reads as one designed sidebar, not stacked mini-sections.
- Founder page split rebalanced: Experience splits after RFGI, so
  Urban Haven opens page 2; target fill ≈85% / ≈65%, and page 2 below
  ~55% full is a verification defect.

Revision v1.1 (16 Nov 2026) — Gemini independent review incorporated:
- Header redesigned: asymmetric, flush-left name block with contact details
  in an offset column. No centered metadata anywhere (template signal).
- Full-width horizontal rules removed. Grouping is done by whitespace and
  short accent segments only (24–40px), never a line across the page.
- Founder rail hardened against overflow/imbalance (atomic rail blocks,
  content caps, page-2 full-width fallback) — see Variant A layout rules.

---

## Shared DNA (both CVs)

- Body font: **Inter** (400/500/600) — screen and print. All faces are
  Fontsource variable packages; the CSS families are "Inter Variable",
  "Space Grotesk Variable" and "Fraunces Variable".
- One accent per document, used sparingly: section ticks, short accent
  segments, links.
- No full-width rule lines, no boxes, no centered blocks. Whitespace and
  short accent segments do the grouping.
- Header is always asymmetric and flush-left: name block on the left,
  contact details in a narrow offset column on the right.
- No skill bars, no photo, no icon sets, no shadows, no gradients on paper.
- Contact details always present: location · email · phone · LinkedIn ·
  GitHub.
- Footer on every PDF page: name · variant · page x/y · "current version at
  shabbir09.github.io/cv".

## Variant A — FOUNDER ("Forge")

Mood: forged metal — dark ink, one hot accent, engineered grid.
Aligns with the MagniForge parent brand (motif: Spark Field).

| Token | Value | Use |
|---|---|---|
| ink | #11151C | name, headings, body |
| ember | #E4572E | accent only: eyebrow, section ticks, links |
| slate | #5A6472 | dates, locations, secondary text |
| hairline | #E4E1D8 | short segments only, never full-width |
| paper | #FAF8F3 | PDF background tint (prints as near-white) |
| panel | #F0EBDF | rail side-panel tint (one shade deeper than paper) |
| hero (web) | #0E1218 | dark header band on the web CV |

- Display font: **Space Grotesk** 600/700 — name at 40pt, tight tracking.
- Eyebrow above name: "FOUNDER — ORION AI · DHAKA" in 8.5pt uppercase,
  letter-spaced, ember.
- Header block: name + eyebrow flush-left in a ~67% column; contact
  details stacked in the remaining ~33% column, small (9pt), slate, each
  on its own line. Nothing centered.
- Layout (PDF, A4): margins 17mm; two columns — main 67% (Experience,
  Research Background, Publications), rail 33% (Profile summary, Skills,
  Education, Languages, QR + links card).
- Layout safety rules (from Gemini review):
  - Publications and all dense lists live in the MAIN column only; the
    rail holds short-form content with hard caps (Skills ≤ 8 lines per
    group, Education ≤ 3 entries, Languages 1 line).
  - Every rail block is atomic — it never splits across a page break;
    blocks flow in fixed order and stop when the page's rail space ends.
  - Page 2 rule: if the rail is exhausted on page 1, page 2 renders the
    main column at full width. A half-empty rail on page 2 is a defect.
  - Column balance is an explicit Block 2 verification check.
  - The rail renders on a `panel` tint background with modest inner
    padding, as one continuous side panel (page 1 only; page 2 is
    full-width with no panel).
  - Page split: Experience breaks after RFGI; page 2 opens with
    "Experience — Continued" (Urban Haven), then NSU, Research
    Background, Publications at full width.
- Section titles: 10.5pt uppercase Inter 600, letter-spacing 0.12em,
  preceded by a 14×2px ember tick. No rule line under titles.
- Body 10.5pt / 1.5 line-height; bullets with ember middot markers.
- Target: exactly 2 pages. No orphaned section titles (title + at least
  2 lines stay together); verified page by page in Block 2.

## Variant B — ACADEMIC ("Scholar")

Mood: a modern journal — warm paper, ink navy, serif display, restraint.

| Token | Value | Use |
|---|---|---|
| ink | #17263F | headings, body |
| archive blue | #1E3A5F | section titles, links |
| gold | #B98A2F | short accent segments only |
| slate | #5C6672 | dates, affiliations |
| paper | #FBFAF6 | background |

- Display font: **Fraunces** 600 (serif) — name at 32pt, section titles.
- Header: same asymmetric structure as Forge — name flush-left, contact
  details in the offset right column. A single 40px gold segment under
  the name is the only ornament.
- Body: Inter 10.5pt / 1.55. Single column, traditional order:
  About, Education, Experience, Research, Publications, Coursework,
  Skills, Honors and Awards.
- Publications set as hanging-indent references with DOI as a link —
  the visual language of a journal, not a template.
- Target: 2 pages (3 acceptable for academic use; never a mostly-empty
  last page).

## Web CV (screen render of the same components)

- Dark Forge hero band (ink #0E1218, ember accent), then light sections.
  Hero uses the same asymmetric header: name flush-left, contact column
  offset right — no centered hero text.
- Sticky mini-header on scroll: name + buttons [Founder PDF] [Academic PDF]
  [ATS version].
- Subtle reveal-on-scroll (opacity/translate, 300ms, respects
  prefers-reduced-motion). No parallax, no heavy animation.
- Variant switcher: Founder / Academic tabs re-render the same components
  with the Scholar tokens.
- Mobile first check: single column under 720px, tap targets ≥ 44px.

## Pipeline (Block 4, as built — mirrors .github/workflows/build.yml)

1. **ATS twin:** Python 3.12 → `pip install "rendercv[full]" segno pyyaml`
   → `python3 build.py` → `dist/` (both ATS PDFs + `qr_linkedin.png`).
2. **Web build:** Node 20 → `python3 web/scripts/yaml_to_json.py`
   (content.yaml → `web/src/content.json`) → `cd web && npm ci &&
   npm run build` (Vite base `'./'`, so assets resolve under `/cv/`).
3. **Premium PDFs:** `npx playwright install --with-deps chromium`, then
   `node scripts/print.mjs founder|academic` with `CV_PREMIUM_DIR`
   pointing at a staging folder. print.mjs stages `qr_linkedin.png` from
   `dist/` into `web/dist/` first, and hard-fails if any required font
   face is missing.
4. **Assembly:** `publish/` = the web build output + from `dist/` the two
   ATS PDFs and the QR + from staging the two premium PDFs, under the
   exact filenames the app's download buttons link to. Deployed with
   upload-pages-artifact (path `publish/`) → deploy-pages.
- Fonts are Fontsource npm variable packages ("Inter Variable",
  "Space Grotesk Variable", "Fraunces Variable"), bundled by Vite — the
  repo contains zero binary files; every artifact is regenerated on each
  content edit, no hand-built PDFs.

## Verification gates (per Shabbir's modular rule)

- Block 2 gate: Founder PDF inspected page by page (rendered images):
  pagination, no orphans, accent discipline, fonts embedded, column
  balance (rail vs main, both pages).
- Block 3 gate: same for Academic + publications formatting check.
- Block 4 gate: live page + all three PDF links opened and read back,
  same standard as the v1 launch check.
- Gemini second-eye: spec review (Block 1, done — v1.1) and screenshot
  review (Blocks 2–3) via paste-ready prompts from Muse.
