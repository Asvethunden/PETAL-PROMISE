# M.Hassan 2 — Wedding Services (Petal & Promise)

A standalone, accessible HTML5, CSS3, and vanilla JavaScript implementation of the **Wedding Services** page (`M.Hassan 2`) for the 15-page **Petal & Promise** wedding planner project.

> **Illustrative Data Notice:** All service packages, descriptions, and PKR estimates on this page are illustrative sample data only.

## Folder Structure

```text
M.Hassan 2/
├── index.html                    # Main Wedding Services page
├── css/
│   └── style.css                 # Shared Petal & Promise responsive stylesheet
├── js/
│   └── app.js                    # Vanilla JS data-driven service renderer, validation, localStorage state
├── images/
│   ├── floral-crest.svg          # Brand emblem (local floral SVG)
│   ├── floral-divider.svg        # Decorative botanical divider (local floral SVG)
│   ├── service-catering.svg      # Catering service illustration (local SVG)
│   ├── service-photography.svg   # Photography service illustration (local SVG)
│   ├── service-decoration.svg    # Decoration service illustration (local SVG)
│   ├── service-makeup.svg        # Makeup service illustration (local SVG)
│   └── service-music.svg         # Music service illustration (local SVG)
├── pages/
│   └── summary.html              # Subpage displaying saved services & read-only sibling context
├── docs/
│   ├── architecture.md           # Palette, JSON storage contract, and sibling link notes
│   ├── session-log.md            # Markdown export generated from genuine Antigravity transcript.jsonl
│   └── transcript.jsonl          # Genuine Antigravity CLI session log copy
└── README.md                     # This file
```

## Theme Palette

- Ivory: `#FFF9F5`
- Blush: `#F3D7DF`
- Rose: `#D49AA8`
- Sage: `#A3AC96`
- Mocha: `#554A45`

## Sample Service Data

Rendered dynamically from the `SERVICES` array in `js/app.js`:

| Service | Category | Illustrative Estimate |
| --- | --- | --- |
| Catering | Culinary | PKR 320,000 |
| Photography | Visuals | PKR 160,000 |
| Decoration | Floral & Stage | PKR 210,000 |
| Makeup | Bridal Studio | PKR 85,000 |
| Music | Sound & Stage | PKR 95,000 |

## Features & Controls

- **Data-Driven Service Checkboxes:** Dynamically renders `Catering`, `Photography`, `Decoration`, `Makeup`, and `Music` cards with accessible `<label>` checkboxes inside a `<fieldset>`.
- **JSON `localStorage` Persistence (`services`):** Saves ordinary form fields (`packageTier`, `serviceBudget`, `contactEmail`, `serviceNotes`) plus a `selected` array of checked service names (e.g. `["Catering", "Photography"]`) under `localStorage["services"]` on the same HTTP origin, and restores them on reload and on `pages/summary.html`.
- **Preserves Existing Shared Keys:** Never alters or overwrites sibling keys (`wedding`, `petalPromise_mHassan1_venues`); `pages/summary.html` displays them read-only if present.
- **Input Validation:**
  - Submitting with zero services checked displays `#services-error` (`role="alert"`) and marks `#services-fieldset` with `aria-invalid="true"`.
  - Entering invalid `serviceBudget` values (`0`, negative numbers, decimals, or non-numeric strings) sets `aria-invalid="true"` and displays `#budget-error`.
  - Entering an invalid email in `contactEmail` sets `aria-invalid="true"` and displays `#email-error`.
- **Keyboard & Accessibility:** Skip-to-content link, semantic landmarks (`header`, `nav`, `main`, `section`, `aside`, `footer`), explicit `<label>` associations, `aria-live="polite"` status/count updates, `Escape` to clear the budget input or close the mobile menu, and `:focus-visible` outlines.
- **Relative Navigation:** Links cleanly to `../index.html`, `../M.Hassan%201/index.html`, `pages/summary.html`, and `../M.Hassan%203/index.html`.

## Observed Verification Results

Tested over a local HTTP server (`127.0.0.1:18792`) using headless Microsoft Edge (`msedge.exe` via Chrome DevTools Protocol):

- **HTTP Assets:** All 13 local files in `M.Hassan 2` (`index.html`, `css/style.css`, `js/app.js`, 7 SVGs, `pages/summary.html`, `docs/architecture.md`, `README.md`) plus sibling `M.Hassan 1/index.html` returned HTTP `200`.
- **Initial Render & SVGs:** All 5 services (`Catering`, `Photography`, `Decoration`, `Makeup`, `Music`) rendered as checkboxes from `SERVICES` data (`0 of 5 selected`); all 8 `<img>` elements reported `complete: true` and non-zero `naturalWidth`.
- **Theme Computed Styles:** `document.body` computed `backgroundColor` was `rgb(255, 249, 245)` (`#FFF9F5`) and `color` was `rgb(85, 74, 69)` (`#554A45`).
- **Invalid Inputs:**
  - Clicking `#save-services-btn` with 0 services checked set `aria-invalid="true"` on `#services-fieldset` and displayed `#services-error`.
  - Entering `0`, `-500`, `12.5`, and `abc` in `#service-budget` each set `aria-invalid="true"` and displayed `#budget-error`; pressing `Escape` cleared the field and error.
  - Entering `not-an-email` in `#contact-email` set `aria-invalid="true"` and displayed `#email-error`.
- **Valid Save, Sibling Key Preservation & Restoration:** Selecting `Catering`, `Photography`, and `Decoration` with `packageTier: "royal"`, `serviceBudget: "750000"`, `contactEmail: "sara@example.com"`, and `serviceNotes: "Blush roses and acoustic set"` saved valid JSON under `localStorage["services"]` (`selected: ["Catering","Photography","Decoration"]`), calculated `PKR 690,000` (`PKR 60,000 remaining`), preserved a pre-seeded `localStorage["wedding"]` object untouched, restored all fields and checkboxes across `Page.reload`, and rendered accurately on `pages/summary.html` on the same HTTP origin.
- **Select All & Clear Saved Data:** `#select-all-btn` checked all 5 services (`5 of 5 selected`), and `#clear-storage-btn` removed `localStorage["services"]` while keeping `localStorage["wedding"]` intact.
- **Responsive Mobile Layout (`375x812`):** `scrollWidth` equaled `innerWidth` (`375px`, zero horizontal overflow); `#nav-toggle` became visible (`display: flex`), toggled `#primary-nav` open (`aria-expanded="true"`), and closed on `Escape` (`aria-expanded="false"`).
- **Relative Links Scope:** All navigation, summary, and footer links resolved to expected same-origin URLs (`../index.html`, `../M.Hassan%201/index.html`, `pages/summary.html`, `../M.Hassan%203/index.html`, `README.md`); `M.Hassan 1/index.html` returned HTTP `200`, while `../index.html` and `../M.Hassan%203/index.html` target folders that do not exist on disk in this branch yet.

## Genuine Antigravity Session Log

Preserved inside `docs/`:
- `docs/transcript.jsonl` (genuine raw Antigravity CLI session transcript)
- `docs/session-log.md` (Markdown export generated from `transcript.jsonl`)
