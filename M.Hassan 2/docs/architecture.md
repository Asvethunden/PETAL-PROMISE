# M.Hassan 2 — Architecture & Shared Contract Notes

## 1. Design Palette (Petal & Promise)
Defined in `css/style.css` using CSS custom properties:
- **Ivory**: `#FFF9F5` (`--ivory`) — page canvas and form control backgrounds
- **Blush**: `#F3D7DF` (`--blush`) — soft accents, category tags, secondary buttons
- **Rose**: `#D49AA8` (`--rose`) — borders, dividers, and floral accents
- **Sage**: `#A3AC96` (`--sage`) — selected service card borders and clear action
- **Mocha**: `#554A45` (`--mocha`) — primary body copy, headings, focus rings, primary buttons

## 2. Folder Structure
- `index.html` — Main Wedding Services selection page (`M.Hassan 2`)
- `css/style.css` — Shared responsive CSS3 layout and accessible focus/error states
- `js/app.js` — Vanilla JS dynamic service card renderer, input validation, and JSON `localStorage` persistence
- `images/` — Local floral and service SVGs (`floral-crest.svg`, `floral-divider.svg`, `service-catering.svg`, `service-photography.svg`, `service-decoration.svg`, `service-makeup.svg`, `service-music.svg`)
- `pages/summary.html` — Subpage reading saved `services` JSON state (plus read-only sibling context) from same-origin `localStorage`
- `docs/` — Architecture notes and genuine Antigravity CLI session log (`docs/session-log.md`, `docs/transcript.jsonl`)
- `README.md` — Module documentation and verified test results

## 3. Shared `localStorage` JSON Format
Stored under key `services` on the same HTTP origin:

```json
{
  "packageTier": "signature",
  "serviceBudget": "600000",
  "contactEmail": "couple@example.com",
  "serviceNotes": "Vegetarian starters and acoustic welcome music",
  "selected": ["Catering", "Photography"]
}
```

- Ordinary form fields (`packageTier`, `serviceBudget`, `contactEmail`, `serviceNotes`) are stored alongside the `selected` array of checked service names (`"Catering"`, `"Photography"`, `"Decoration"`, `"Makeup"`, `"Music"`).
- Existing shared keys such as `wedding` and `petalPromise_mHassan1_venues` are never overwritten or modified by `M.Hassan 2`; `pages/summary.html` reads them strictly in read-only mode.
- Corrupted or malformed `localStorage` values fall back safely to defaults via `try/catch` and allow-list normalization.

## 4. Relative Sibling Links
- `index.html` links to `../index.html` (Planner Home), `../M.Hassan%201/index.html` (`M.Hassan 1`), `pages/summary.html`, and `../M.Hassan%203/index.html` (`M.Hassan 3`).
- `pages/summary.html` links to `../../index.html`, `../../M.Hassan%201/index.html`, `../index.html`, and `../../M.Hassan%203/index.html`.
