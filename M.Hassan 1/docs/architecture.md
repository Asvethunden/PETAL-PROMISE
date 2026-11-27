# M.Hassan 1 — Architecture & Shared Contract Notes

## 1. Design Palette (Petal & Promise)
Defined in `css/style.css` using CSS custom properties:
- **Ivory**: `#FFF9F5` (`--ivory`) — page and card backgrounds
- **Blush**: `#F3D7DF` (`--blush`) — soft accents, tags, secondary buttons
- **Rose**: `#D49AA8` (`--rose`) — borders and floral highlights
- **Sage**: `#A3AC96` (`--sage`) — selected card highlights and clear action
- **Mocha**: `#554A45` (`--mocha`) — primary body copy, headings, focus rings, primary buttons

## 2. Folder Structure
- `index.html` — Primary Wedding Venues page
- `css/style.css` — Shared responsive CSS3 layout and accessible focus/error states
- `js/app.js` — Vanilla JS venue rendering, positive guest-count filtering, and JSON `localStorage` persistence
- `images/` — Local floral and venue SVGs (`floral-crest.svg`, `floral-divider.svg`, `venue-garden.svg`, `venue-banquet.svg`, `venue-ivory.svg`)
- `pages/shortlist.html` — Subpage displaying saved shortlist state from the same HTTP origin
- `docs/` — Architecture notes and genuine Antigravity session log (`docs/session-log.md`)
- `README.md` — Module documentation and verified test results

## 3. Shared `localStorage` JSON Format
Stored under key `petalPromise_mHassan1_venues` on the same HTTP origin:

```json
{
  "guestCount": "200",
  "eventDate": "2026-12-20",
  "preferredStyle": "outdoor",
  "plannerNotes": "Evening floral arch",
  "selected": ["garden-pavilion", "rose-banquet"]
}
```

- Ordinary form fields (`guestCount`, `eventDate`, `preferredStyle`, `plannerNotes`) are stored as strings alongside the `selected` array of checked venue IDs (`"garden-pavilion"`, `"rose-banquet"`, `"ivory-hall"`).
- Corrupted or unexpected `localStorage` values fall back safely to defaults via `try/catch` and ID allow-list filtering.

## 4. Relative Sibling Links
- `../index.html` (and `../../index.html` from `pages/shortlist.html`) — Planner Home
- `../M.Hassan%202/index.html` (and `../../M.Hassan%202/index.html` from `pages/shortlist.html`) — Next module (`M.Hassan 2`)
