# Abdul Rafay 1 — Architecture & Data Contract

## Folder Scope
All files for the Wedding Events module live strictly inside `Abdul Rafay 1/`:
- `index.html` — Primary Wedding Events page (signature cards + event itinerary form + live summary)
- `pages/etiquette-guide.html` — Ceremony sequencing & etiquette subpage reading shared `events` storage
- `css/style.css` — Responsive Petal & Promise stylesheet
- `js/app.js` — Vanilla JavaScript state sync, validation, and `localStorage` persistence
- `images/` — Local floral SVGs (`floral-crest.svg`, `floral-divider.svg`, `nikkah-blossom.svg`, `mehndi-marigold.svg`, `walima-rose.svg`)
- `docs/architecture.md` — Module design & storage documentation
- `README.md` — Module overview, setup, verification results, and session log reference

## Petal & Promise Theme Tokens
Defined as CSS custom properties in `css/style.css`:
- Ivory: `#FFF9F5`
- Blush: `#F3D7DF`
- Rose: `#D49AA8`
- Sage: `#A3AC96`
- Mocha: `#554A45`

## Shared `localStorage` Schema (`events`)
Data is stored on the same HTTP origin under `localStorage.getItem("events")` as JSON:

```json
{
  "selected": ["Nikkah", "Mehndi", "Baraat", "Walima"],
  "coupleNames": "Amina & Zaid (Illustrative)",
  "weddingCity": "Lahore",
  "startDate": "2027-02-12",
  "guestEstimate": "250",
  "eventNotes": "Garden Nikkah in ivory and blush, festive Mehndi, formal Baraat, and candlelit Walima.",
  "updatedAt": "2027-02-01T12:00:00.000Z"
}
```

### Compatibility & Preservation Rules
- At least one value in `selected` (`Nikkah`, `Mehndi`, `Baraat`, `Walima`, `Reception`) is required before saving.
- If `localStorage.getItem("events")` already holds a JSON object with extra keys from another module, `safeWriteEvents()` and the clear handler preserve non-managed keys.
- Legacy plain-array values (`["Nikkah", "Walima"]`) are read gracefully into `{ selected: [...] }`.

## Relative Links
- From `index.html` to subpage: `pages/etiquette-guide.html`
- From `index.html` to sibling module: `../Abdul%20Rafay%202/index.html`
- From `pages/etiquette-guide.html` to home: `../index.html`
- From `pages/etiquette-guide.html` to sibling module: `../../Abdul%20Rafay%202/index.html`

## Accessibility & Keyboard Support
- Skip-to-content link (`#main-content`)
- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
- Explicit `<label for="...">` bindings, `<fieldset>` + `<legend>`, `aria-describedby` hints
- Visible `:focus-visible` outlines
- Live feedback regions (`role="alert"`, `role="status"`, `aria-live`)
- `Escape` key closes the mobile navigation drawer and dismisses active status/error banners
- Descriptive `alt` text on informative SVGs and `alt=""` with `aria-hidden="true"` on decorative dividers
