# Yusuf 2 — Budget Calculator (Petal & Promise)

The **Budget Calculator** page (`Yusuf 2`) is the second step of the 15-page **Petal & Promise** wedding planner project. It collects a couple's total PKR wedding budget, guest count, and spending priority, calculates **budget divided by guests**, and persists the selections under `localStorage["budget"]`.

## Features Implemented

- **Validated Inputs:**
  - **PKR Budget:** Accepts any positive finite number (`Number.isFinite(budget) && budget > 0`). Rejects empty, zero, negative, non-numeric, and infinite values.
  - **Guests:** Accepts only positive integers (`> 0`, whole numbers only). Rejects zero, negative, fractional/decimal, and non-numeric values.
  - **Priority:** Accessible radio group for `Catering`, `Venue`, or `Decor`.
- **Per-Guest Calculation:**
  - Computes and displays `budget / guests` in PKR (`Budget Divided by Guests`), accompanied by the exact formula readout.
- **Persistence (`localStorage`):**
  - Saves `{ budget, guests, priority }` as JSON under the `budget` key on the same HTTP origin.
  - Preserves any existing unrelated properties on `localStorage["budget"]` when saving, and restores saved inputs on reload.
  - Optionally displays read-only wedding style/events context from `Yusuf 1` (`localStorage["wedding"]`) without modifying it.
- **Navigation & Companion Page:**
  - Consistent header/footer navigation linking back to `../Yusuf 1/index.html`, internally to `pages/budget-breakdown.html`, and forward to `../Yusuf 3/index.html`.
  - `pages/budget-breakdown.html` displays the saved per-guest metric and an illustrative priority-weighted distribution.

## Theme Palette

- Ivory: `#FFF9F5`
- Blush: `#F3D7DF`
- Rose: `#D49AA8`
- Sage: `#A3AC96`
- Mocha: `#554A45`

## Sibling Inspection Notes

Inspected the sibling `Yusuf 1` folder before implementing `Yusuf 2`. No files in `Yusuf 1` were modified; `Yusuf 2` reads `localStorage["wedding"]` strictly read-only for summary context and writes exclusively to `localStorage["budget"]`.
