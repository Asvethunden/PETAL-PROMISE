# Abdul Rafay 1 — Wedding Events (Petal & Promise)

The **Wedding Events** module for the 15-page **Petal & Promise** wedding planner project. Built with HTML5, CSS3, and vanilla JavaScript only, following the shared Petal & Promise palette (`#FFF9F5`, `#F3D7DF`, `#D49AA8`, `#A3AC96`, `#554A45`).

## Features
- **Signature Ceremony Cards**: Displays **Nikkah**, **Mehndi**, and **Walima** cards with local floral SVG illustrations and interactive selection toggles synchronized with the form checkboxes.
- **Event Selection & Itinerary Form**: Provides accessible checkboxes for **Nikkah**, **Mehndi**, **Baraat**, **Walima**, and **Reception**, plus optional planning fields (`coupleNames`, `weddingCity`, `startDate`, `guestEstimate`, `eventNotes`).
- **Validation & Persistence**: Requires at least one event before saving JSON to `localStorage` under the `events` key on the same HTTP origin, preserving any existing non-managed keys.
- **Illustrative Data Only**: Includes a one-click **Load Illustrative Example** action with clearly labeled sample data.
- **Etiquette & Timeline Subpage**: `pages/etiquette-guide.html` reads `localStorage.events` and highlights saved ceremonies.
- **Relative Navigation**: Links cleanly to `pages/etiquette-guide.html` and the sibling folder `../Abdul%20Rafay%202/index.html`.

## Directory Structure
```text
Abdul Rafay 1/
├── index.html
├── README.md
├── css/
│   └── style.css
├── docs/
│   └── architecture.md
├── images/
│   ├── floral-crest.svg
│   ├── floral-divider.svg
│   ├── mehndi-marigold.svg
│   ├── nikkah-blossom.svg
│   └── walima-rose.svg
├── js/
│   └── app.js
└── pages/
    └── etiquette-guide.html
```

## Running Locally over HTTP
Serve the `PETAL-PROMISE` root directory over a local HTTP server so relative sibling links and `localStorage` share the same HTTP origin (for example, `http://127.0.0.1:8080/Abdul%20Rafay%201/index.html`).

## Verification & Test Results
Verified via a local PowerShell `HttpListener` server and headless Google Chrome (DevTools Protocol) over `http://127.0.0.1:<port>/`:
- **Assets & Links**: All 9 local files (`index.html`, `pages/etiquette-guide.html`, `css/style.css`, `js/app.js`, and 5 SVGs in `images/`) returned HTTP `200`; all 6 rendered `<img>` elements loaded (`naturalWidth > 0`) with `alt` attributes; relative links to `../Abdul%20Rafay%202/index.html` (from `index.html`) and `../../Abdul%20Rafay%202/index.html` (from `pages/etiquette-guide.html`) are present (`Abdul Rafay 2/` is not yet present in the repo working tree, so its target page was not HTTP-fetched).
- **Invalid Inputs**: Submitting with 0 events checked displayed the `role="alert"` error banner, marked `#events-fieldset` `aria-invalid="true"`, and left `localStorage.events` untouched; entering `-5` for estimated guests triggered the guest count validation error and marked `#guest-estimate` `aria-invalid="true"`.
- **Valid Inputs & Storage Preservation**: Pre-seeding `{ "sharedMeta": "keep-me", "selected": ["Walima"] }`, toggling `Nikkah` via the signature card button, checking `Baraat` and `Reception`, filling form fields, and submitting saved `selected: ["Nikkah", "Baraat", "Reception"]` plus form fields under `localStorage.events` while preserving `sharedMeta`. Navigating to `pages/etiquette-guide.html` on the same origin highlighted `Nikkah`, `Baraat`, and `Reception` (`Mehndi` unhighlighted). Reloading `index.html` restored saved values; clicking **Clear Selection** removed managed fields while preserving `sharedMeta`.
- **Mobile Layout & Keyboard**: At `375x812` viewport, `scrollWidth <= innerWidth` (`375 <= 375`), `#nav-toggle` was visible, toggled `aria-expanded="true"` on click, and closed cleanly on `Escape`.

## Antigravity Session Log
- Conversation ID: `7659af9e-447b-4c71-b72b-f07b0ded0936`
- Retained at the genuine Antigravity conversation log path (`C:\Users\izzaa\.gemini\antigravity-cli\brain\7659af9e-447b-4c71-b72b-f07b0ded0936\.system_generated\logs\transcript.jsonl`).
