# Yusuf 2 — Architecture & Shared Contract

## Folder Structure

```text
Yusuf 2/
├── index.html                  # Main Budget Calculator page
├── css/
│   └── style.css               # Petal & Promise shared theme and responsive layout
├── js/
│   └── app.js                  # Input validation, budget/guests calculation, localStorage persistence
├── images/
│   ├── floral-crest.svg        # Hero botanical wreath crest
│   ├── floral-divider.svg      # Section floral divider
│   └── floral-sprig.svg        # Header monogram & summary floral accent
├── pages/
│   └── budget-breakdown.html   # Illustrative allocation preview reading saved budget data
├── docs/
│   └── architecture.md         # This technical reference
└── README.md                   # Page overview, usage, and verification notes
```

## Shared Theme Tokens

Defined in `css/style.css`:

| Token | Hex | Role |
| --- | --- | --- |
| `--pp-ivory` | `#FFF9F5` | Page canvas and light button text |
| `--pp-blush` | `#F3D7DF` | Selected card fill, input prefix, alert surfaces |
| `--pp-rose` | `#D49AA8` | Borders, floral accents, highlight outlines |
| `--pp-sage` | `#A3AC96` | Botanical accents, success borders, secondary nav accent |
| `--pp-mocha` | `#554A45` | Primary text, headings, primary buttons, focus rings |

## Validation & Calculation Rules

- **Budget (`budget`):** Parsed from trimmed input; must satisfy `Number.isFinite(budget) && budget > 0`. Rejects `0`, negative numbers, `NaN`, `Infinity`, and non-numeric strings.
- **Guests (`guests`):** Must represent a strictly positive whole integer (`Number.isSafeInteger(guests) && guests > 0`, no fractional/decimal values).
- **Priority (`priority`):** Must be one of `"Catering"`, `"Venue"`, or `"Decor"`.
- **Per-Guest Calculation:** Strictly `budget / guests` (total PKR budget divided by guests, never a catering-rate estimate).

## `localStorage` Contract

- **Key written:** `budget`
- **Format (JSON):**
  ```json
  {
    "budget": 2500000,
    "guests": 200,
    "priority": "Catering"
  }
  ```
- **Preservation Guarantee:** When writing `budget`, `js/app.js` merges `{ ...existing, budget, guests, priority }` over any pre-existing plain JSON object in `localStorage["budget"]`.
- **Sibling Context (Read-Only):** Reads `localStorage["wedding"]` (written by `Yusuf 1`) solely for display context without mutating `wedding`.

## Relative Navigation

- `index.html` links to `../Yusuf 1/index.html`, `pages/budget-breakdown.html`, and `../Yusuf 3/index.html`.
- `pages/budget-breakdown.html` links to `../../Yusuf 1/index.html`, `../index.html`, and `../../Yusuf 3/index.html`.
