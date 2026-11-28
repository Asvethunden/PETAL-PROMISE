# PETAL & PROMISE

A website where people can go and plan their weddings.

---

## Module: Cultural Weddings, Traditions & Cultural Preferences

**Course:** CL1000 — Introduction to Information & Communication Technologies (Fall 2026)  
**Student:** Jaweria Junejo  
**Roll Number:** 26i-3206  
**Section:** SE-D  
**Branch:** `Jaweria-Junejo-26i-3206`

### Pages Implemented

| # | Page | File | Purpose |
|---|---|---|---|
| 0 | Portal Home | `index.html` | Landing page linking all 3 module pages |
| 1 | Cultural Weddings | `pages/cultural-weddings.html` | Heritage overview and interactive cultural customs accordion |
| 2 | Wedding Traditions | `pages/wedding-traditions.html` | Dynamic rituals catalog with live search, culture filters, and symbolism table |
| 3 | Cultural Preferences | `pages/cultural-preferences.html` | Bespoke wedding planner form, live blueprint sidebar, budget calculator, and modal |

### Feature Breakdown (Rubric Categories)

| Rubric Category | Implementation Details |
|---|---|
| **Data & Display** | `culturalTraditionsData` array in `js/script.js` dynamically renders tradition cards into `#dynamicTraditionsGrid` with category badges and search results. |
| **Forms & Input** | Multi-section customizer form (`#culturalPreferencesForm`) with real-time and submit-time validation for name, email, and phone number. |
| **State & Memory** | `localStorage` persistence (`petalPromiseCulturalPrefs_v1`) automatically saves and restores form fields, chips, checkboxes, and selections across reloads. |
| **Interaction** | Mobile hamburger navigation drawer, FAQ/customs accordion (`toggleAccordion`), culture filter chips, music/heritage choice chips, and confirmation modal. |
| **Logic & Calculation** | Real-time estimated USD package calculator (`calculateEstimatedBudget`) combining culture base cost, selected rituals, guest count, and seasonal multiplier. |
| **Responsive & Accessible** | Mobile-first responsive CSS Grid & Flexbox (`css/style.css`) with 1024px / 768px / 480px breakpoints, `aria-expanded` nav state, `focus-visible` outlines, and `Escape` / backdrop modal closing. |

### Contribution Table

| Team Member | Roll Number | Module / Contribution |
|---|---|---|
| Jaweria Junejo | 26i-3206 | Cultural Weddings, Wedding Traditions & Cultural Preferences (`index.html`, `pages/*.html`, `css/style.css`, `js/script.js`, `README.md`) |
