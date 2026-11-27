# PETAL & PROMISE — Wedding Planning Portal
*A website where people can go and plan their dream cultural and luxury weddings.*

**Course:** Introduction to Information and Communication Technologies (IICT) - Fall 2026  
**Assignment:** Project + Assignment 3 (SE)  
**Assigned Student:** Jaweria Junejo  
**Roll Number:** 26i-3206  
**Section:** SE-D  
**Assigned Module:** Cultural Weddings, Wedding Traditions & Cultural Preferences  

---

## 📋 Contribution Table

| Member Name | Roll Number | Section | Pages Built | Features Built |
| :--- | :--- | :--- | :--- | :--- |
| **Jaweria Junejo** | **26i-3206** | **SE-D** | 1. `pages/cultural-weddings.html`<br>2. `pages/wedding-traditions.html`<br>3. `pages/cultural-preferences.html`<br>*(also contributed `index.html`, `css/style.css`, `js/script.js`)* | • Dynamic Traditions Catalog & Live Search<br>• Real-time Preferences Validation Form<br>• LocalStorage State Persistence<br>• Interactive Filter Tabs & Customs Accordion<br>• Real-time Dynamic Budget Calculation<br>• Responsive Mobile Drawer & ARIA Accessibility |

---

## 🎯 Feature Table (Covering All 6 Mandatory Rubric Categories)

| Feature | Category | Page | Member | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Interactive Traditions Catalog & Search** | **1. Data & Display** | `wedding-traditions.html` | Jaweria Junejo | Traditions rendered dynamically from a JavaScript array (`culturalTraditionsData`) with instant text search and cultural category filtering. |
| **Cultural Preferences Validation Form** | **2. Forms & Input** | `cultural-preferences.html` | Jaweria Junejo | Form with real-time validation for name (min 3 chars), email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), phone format, and guest count with live error hints. |
| **Package Memory & Persistence** | **3. State & Memory** | `cultural-preferences.html` | Jaweria Junejo | Saves selected cultural tradition, custom rituals, wardrobe styling, and guest counts to `localStorage` so selections persist across page reloads and visits. |
| **Cultural Customs Accordion & Modal Dialog** | **4. Interaction** | `cultural-weddings.html`<br>`cultural-preferences.html` | Jaweria Junejo | Collapsible FAQ accordion exploring cultural customs and interactive animated modal dialog confirming reserved packages (supports Escape key close). |
| **Real-time Dynamic Budget Estimator** | **5. Logic & Calculation** | `cultural-preferences.html` | Jaweria Junejo | Algorithmic calculator computing package cost based on base tradition price + ($6 × guest count) + ($125 × selected rituals) with a seasonal multiplier. |
| **Mobile Drawer & Accessible ARIA Elements** | **6. Responsive & Accessible** | All Pages | Jaweria Junejo | Fully responsive across mobile, tablet, and desktop viewports; includes hamburger navigation drawer, visible focus outlines, and semantic HTML5 elements. |

---

## 📂 Project Architecture

```
IICT/
├── index.html                           # Main Landing Portal
├── README.md                            # Feature & Contribution Tables
├── pages/
│   ├── cultural-weddings.html           # Page 1: Cultural Weddings Overview & Heritage
│   ├── wedding-traditions.html          # Page 2: Wedding Traditions Catalog with Live Filter & Search
│   └── cultural-preferences.html        # Page 3: Cultural Preferences Form with Live Budget Estimator
├── css/
│   └── style.css                        # Shared Modular & Responsive Stylesheet
└── js/
    └── script.js                        # Vanilla JavaScript (All 6 Feature Categories)
```

---

## 📅 3-Day Git Commit Roadmap

Per the rubric: *"Each student must have visible commits in the repository history throughout a span of at least 3 days. Overnight bulk commits will result in a 50% deduction in Git component."*

### **Day 1: Semantic HTML Structure & Prototype Implementation**
- `feat(day1): implement semantic HTML5 structure for Cultural Weddings overview`
- `feat(day1): add wedding traditions catalog and cultural preferences customizer form`
- `feat(day1): establish responsive CSS design, vanilla JS logic and milestone structure`

### **Day 2: CSS Styling, Responsive Design & Layouts**
- Continue styling enhancements and visual polish

### **Day 3: JavaScript Interactivity, LocalStorage & Dynamic Calculation**
- Dynamic features, tests, and final presentation

---

## 🌐 Live Server Local Preview
- Home Portal: `http://localhost:5500/index.html`
- Page 1 (Cultural Weddings): `http://localhost:5500/pages/cultural-weddings.html`
- Page 2 (Wedding Traditions): `http://localhost:5500/pages/wedding-traditions.html`
- Page 3 (Cultural Preferences): `http://localhost:5500/pages/cultural-preferences.html`
