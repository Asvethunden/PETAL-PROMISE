# Yusuf 1 — Wedding Customization (Petal & Promise)

The **Wedding Customization** page (`Yusuf 1`) is the opening step of the 15-page **Petal & Promise** wedding planner project. It lets couples choose their wedding aesthetic and select which ceremonies to include, persisting their selections to `localStorage` for downstream planner pages such as `Yusuf 2`.

## Features Implemented

- **Wedding Style Selector:** Accessible radio group with three options:
  - `Eastern`
  - `Western`
  - `Fusion`
- **Event Checkboxes (at least one required):**
  - `Nikkah`
  - `Mehndi`
  - `Baraat`
  - `Walima`
  - `Reception`
- **Validation & Accessibility:**
  - Enforces selection of a valid wedding style and at least one wedding event before saving.
  - Inline error alerts (`role="alert"`), live selection count (`aria-live="polite"`), `aria-invalid` fieldset state, skip-to-content link, keyboard navigation, and visible `:focus-visible` outlines.
  - Local floral SVG graphics in `images/` with descriptive `alt` text.
- **Persistence (`localStorage`):**
  - Saves `{ style, events }` as JSON under the `wedding` key on the same HTTP origin.
  - Preserves any existing properties stored in the `wedding` JSON object by merging rather than overwriting unrelated keys.
  - Restores previously saved selections automatically on page reload.
- **Navigation & Companion Page:**
  - Consistent header and footer navigation with relative links (`pages/ceremony-guide.html`, `../Yusuf 2/index.html`).
  - `pages/ceremony-guide.html` reads `localStorage["wedding"]` and highlights the selected events with illustrative ambiance notes.

## Theme Palette

- Ivory: `#FFF9F5`
- Blush: `#F3D7DF`
- Rose: `#D49AA8`
- Sage: `#A3AC96`
- Mocha: `#554A45`

## Running Locally

Serve the parent project folder over HTTP (so `localStorage` is shared across sibling folders on the same origin), then open `Yusuf 1/index.html`.

## Notes on Sibling Inspection

When this folder was created, no existing `Yusuf 1` or sibling project folders were present in the workspace, so `Yusuf 1` was built from scratch following the shared Petal & Promise specification and preserving any pre-existing `wedding` keys if present in `localStorage`.
