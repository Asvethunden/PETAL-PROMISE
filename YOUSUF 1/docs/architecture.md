# Yusuf 1 — Architecture & Shared Contract

## Folder Structure

```text
Yusuf 1/
├── index.html                 # Main Wedding Customization page
├── css/
│   └── style.css              # Petal & Promise shared theme and responsive layout
├── js/
│   └── app.js                 # Validation, state restoration, and localStorage persistence
├── images/
│   ├── floral-crest.svg       # Hero botanical crest
│   ├── floral-divider.svg     # Section floral divider
│   └── floral-sprig.svg       # Header monogram & card floral accent
├── pages/
│   └── ceremony-guide.html    # Illustrative companion page reading saved wedding data
├── docs/
│   └── architecture.md        # This technical reference
└── README.md                  # Page overview, usage, and verification notes
```

## Shared Theme Tokens

Defined as CSS custom properties in `css/style.css`:

| Token | Hex | Role |
| --- | --- | --- |
| `--pp-ivory` | `#FFF9F5` | Primary page canvas and light button text |
| `--pp-blush` | `#F3D7DF` | Selected card fill, badges, pills, alert surfaces |
| `--pp-rose` | `#D49AA8` | Borders, floral accents, active markers |
| `--pp-sage` | `#A3AC96` | Botanical stems/leaves, success borders, secondary nav accent |
| `--pp-mocha` | `#554A45` | High-contrast body text, headings, primary buttons, focus rings |

## `localStorage` Contract

- **Key:** `wedding`
- **Format (JSON):**
  ```json
  {
    "style": "Fusion",
    "events": ["Nikkah", "Mehndi", "Reception"]
  }
  ```
- **Allowed `style` values:** `"Eastern"`, `"Western"`, `"Fusion"`
- **Allowed `events` values:** Non-empty subset of `["Nikkah", "Mehndi", "Baraat", "Walima", "Reception"]`
- **Preservation Guarantee:** When writing `wedding`, `js/app.js` reads any existing JSON object stored under `wedding` and merges `{ ...existing, style, events }` so properties added by sibling pages are never discarded.

## Relative Navigation

- `index.html` links to `pages/ceremony-guide.html` and `../Yusuf 2/index.html`.
- `pages/ceremony-guide.html` links to `../index.html` and `../../Yusuf 2/index.html`.
