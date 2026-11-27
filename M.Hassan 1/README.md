# M.Hassan 1 — Wedding Venues (Petal & Promise)

A standalone, accessible HTML5, CSS3, and vanilla JavaScript implementation of the **Wedding Venues** page (`M.Hassan 1`) for the 15-page **Petal & Promise** wedding planner project.

> **Illustrative Data Notice:** All venue capacities, PKR pricing, and notes on this page are illustrative sample data only.

## Folder Structure

```text
M.Hassan 1/
├── index.html               # Main Wedding Venues page
├── css/
│   └── style.css            # Shared Petal & Promise responsive stylesheet
├── js/
│   └── app.js               # Vanilla JS venue renderer, positive guest filter, localStorage state
├── images/
│   ├── floral-crest.svg     # Brand emblem (local SVG)
│   ├── floral-divider.svg   # Decorative botanical divider (local SVG)
│   ├── venue-garden.svg     # Garden Pavilion illustration (local SVG)
│   ├── venue-banquet.svg    # Rose Banquet illustration (local SVG)
│   └── venue-ivory.svg      # Ivory Hall illustration (local SVG)
├── pages/
│   └── shortlist.html       # Subpage displaying saved shortlist from same-origin localStorage
├── docs/
│   ├── architecture.md      # Palette, JSON storage contract, and sibling link notes
│   ├── session-log.md       # Markdown export generated from genuine Antigravity transcript.jsonl
│   └── transcript.jsonl     # Genuine Antigravity CLI session log copy
└── README.md                # This file
```

## Theme Palette

- Ivory: `#FFF9F5`
- Blush: `#F3D7DF`
- Rose: `#D49AA8`
- Sage: `#A3AC96`
- Mocha: `#554A45`

## Sample Venue Data

Rendered dynamically from the `VENUES` array in `js/app.js`:

| Venue | Capacity | Illustrative Estimate |
| --- | --- | --- |
| Garden Pavilion | 250 guests | PKR 250,000 |
| Rose Banquet | 500 guests | PKR 400,000 |
| Ivory Hall | 150 guests | PKR 180,000 |

## Features & Controls

- **Positive Guest Count Filter:** Accepts blank (all venues) or a positive whole integer (`>= 1`). Rejects `0`, negative numbers, decimals, and non-numeric strings with inline `aria-invalid="true"` and `role="alert"` error messages.
- **Empty Results State:** Displays `#empty-state` clearly when the requested guest count exceeds available capacities (e.g., `600` guests) along with a **Show All Venues** reset button.
- **JSON `localStorage` Persistence:** Saves under `petalPromise_mHassan1_venues` on the same HTTP origin using ordinary form fields (`guestCount`, `eventDate`, `preferredStyle`, `plannerNotes`) plus a `selected` array of checked venue IDs (`["garden-pavilion", "rose-banquet"]`). Restores on reload and on `pages/shortlist.html`.
- **Keyboard & Accessibility:** Skip-to-content link, semantic landmarks (`header`, `nav`, `main`, `section`, `aside`, `footer`), explicit `<label>` associations, `aria-live="polite"` status/count updates, `Escape` to clear the guest input or close the mobile menu, and `:focus-visible` outlines.
- **Relative Navigation:** Includes relative links to `../index.html` (Planner Home), `pages/shortlist.html`, and `../M.Hassan%202/index.html` (`M.Hassan 2`).

## Observed Verification Results

Tested over a local HTTP server (`127.0.0.1`) using headless Microsoft Edge (`msedge.exe` via Chrome DevTools Protocol):

- **HTTP Assets:** All 10 local assets (`index.html`, `css/style.css`, `js/app.js`, 5 SVGs, `pages/shortlist.html`, `docs/architecture.md`) returned HTTP `200`.
- **Initial Render & SVGs:** All 3 sample venues rendered with exact capacities and PKR estimates; all 6 `<img>` tags reported `hasAlt: true`, `complete: true`, and non-zero `naturalWidth`.
- **Theme Computed Styles:** `document.body` computed `backgroundColor` was `rgb(255, 249, 245)` (`#FFF9F5`) and `color` was `rgb(85, 74, 69)` (`#554A45`).
- **Valid & Empty Filters:** Filtering by `200` showed `Garden Pavilion` and `Rose Banquet` (`Showing 2 of 3 venues`); `400` showed `Rose Banquet` (`Showing 1 of 3 venues`); `600` showed `Showing 0 of 3 venues` with `#empty-state` visible, and clicking `#empty-reset-btn` restored all 3 venues.
- **Invalid Inputs:** Entering `0`, `-25`, `abc`, and `12.5` each set `aria-invalid="true"` and displayed `#guest-error`; clicking `#reset-filter-btn` cleared the error and restored all 3 cards.
- **Saved `localStorage` & Subpage:** Saving form fields and checking `Garden Pavilion` + `Rose Banquet` wrote valid JSON containing `selected: ["garden-pavilion","rose-banquet"]`, persisted across `Page.reload`, and rendered on `pages/shortlist.html` on the same HTTP origin.
- **Responsive Mobile Layout (`375x812`):** `scrollWidth` equaled `innerWidth` (`375px`, no horizontal overflow); `#nav-toggle` became visible (`display: flex`), toggled `#primary-nav` open (`aria-expanded="true"`), and closed on `Escape`.
- **Sibling Folder Links Scope:** No parent 15-page repository was present on the machine, so `M.Hassan 1` was created standalone in `C:\Users\FINE\M.Hassan 1`; relative links to `../index.html` and `../M.Hassan%202/index.html` were verified in the DOM (`resolved` URLs), while their target sibling pages do not exist locally yet.

## Genuine Antigravity Session Log

Preserved inside `docs/`:
- `docs/transcript.jsonl` (genuine raw session transcript)
- `docs/session-log.md` (Markdown export generated from `transcript.jsonl`)
