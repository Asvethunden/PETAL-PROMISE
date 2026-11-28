/*
=============================================================================
  CL1000 - IICT SEMESTER PROJECT: FALL 2026
  Student: Jaweria Junejo | Roll: 26i-3206 | Section: SE-D
  Day 3: Vanilla JavaScript — Petal & Promise (Cultural Weddings Module)
  File: js/script.js
  Covers all 6 rubric categories:
    1. Data & Display (Traditions catalog array + dynamic DOM rendering)
    2. Forms & Input (Real-time validation + submission handling)
    3. State & Memory (localStorage persistence across reloads)
    4. Interaction (Mobile nav drawer, accordion, filter chips, modal)
    5. Logic & Calculation (Dynamic wedding package budget formula)
    6. Responsive & Accessible (Keyboard Escape, ARIA attributes, focus)
=============================================================================
*/

"use strict";

/* =====================================================================
   1. DATA & DISPLAY — Cultural Traditions Catalog
   ===================================================================== */
const culturalTraditionsData = [
    {
        id: "desi-mehndi",
        title: "Bridal Mehndi & Dholki Night",
        culture: "desi",
        cultureLabel: "Desi (South Asian)",
        emoji: "🌿",
        image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
        description: "A vibrant pre-wedding celebration featuring intricate herbal henna art, folk dholak songs, marigold garlands, and synchronized family dances."
    },
    {
        id: "desi-nikkah",
        title: "Sacred Nikkah & Barat Procession",
        culture: "desi",
        cultureLabel: "Desi (South Asian)",
        emoji: "🕌",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
        description: "The solemnization of the marital contract with Ijab-o-Qubool, chaddar blessings, royal groom Sehra Bandi, and celebratory Walima feast."
    },
    {
        id: "arab-zaffa",
        title: "Grand Arab Zaffa & Dabke Entrance",
        culture: "middle-east",
        cultureLabel: "Middle Eastern (Arab)",
        emoji: "🥁",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80",
        description: "An energetic musical procession led by bendir drummers, mizmar horns, candle bearers, and Dabke folk dancers welcoming the couple."
    },
    {
        id: "arab-henna",
        title: "Laylat Al-Henna & Oud Majlis",
        culture: "middle-east",
        cultureLabel: "Middle Eastern (Arab)",
        emoji: "✨",
        image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=600&q=80",
        description: "An intimate evening steeped in aromatic oud incense, cardamom Arabic coffee, embroidered kaftans, and traditional henna blessings."
    },
    {
        id: "western-vows",
        title: "Classic White Vows & Unity Candle",
        culture: "western",
        cultureLabel: "Western Classic",
        emoji: "🕯️",
        image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
        description: "Timeless aisle procession with classical strings, exchanged handwritten vows, ring ceremony, and lighting of the central unity flame."
    },
    {
        id: "east-asian-tea",
        title: "Ancestral Tea Ceremony & Hongbao",
        culture: "east-asian",
        cultureLabel: "East Asian",
        emoji: "🍵",
        image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80",
        description: "Couple kneels before parents and elders serving lotus-seed and red-date tea in Double Happiness porcelain to receive blessings and heirloom gifts."
    }
];

let activeCategoryFilter = "all";
let activeSearchQuery = "";

/**
 * Render filtered tradition cards into #dynamicTraditionsGrid on Page 2.
 */
function renderTraditionsCatalog() {
    const grid = document.getElementById("dynamicTraditionsGrid");
    if (!grid) return;

    const query = activeSearchQuery.trim().toLowerCase();
    const filtered = culturalTraditionsData.filter((item) => {
        const matchesCategory = activeCategoryFilter === "all" || item.culture === activeCategoryFilter;
        const matchesSearch =
            !query ||
            item.title.toLowerCase().includes(query) ||
            item.cultureLabel.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="no-results-msg">
                No traditions matched "<strong>${escapeHtml(activeSearchQuery)}</strong>". Try clearing the search or choosing another culture filter.
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered
        .map(
            (item) => `
            <article class="tradition-detail-card">
                <div class="tradition-img-area" style="background-image: url('${item.image}');">
                    <span class="culture-badge">${escapeHtml(item.cultureLabel)}</span>
                </div>
                <div class="tradition-info">
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.description)}</p>
                    <div class="tradition-emoji" aria-hidden="true">${item.emoji}</div>
                </div>
            </article>
        `
        )
        .join("");
}

/**
 * Handle culture filter chip click on Page 2.
 */
function handleCategoryFilter(category, btnEl) {
    activeCategoryFilter = category;
    const chips = document.querySelectorAll(".filter-chip");
    chips.forEach((chip) => chip.classList.remove("active"));
    if (btnEl) {
        btnEl.classList.add("active");
    }
    renderTraditionsCatalog();
}

/**
 * Handle live search input on Page 2.
 */
function handleSearchInput(value) {
    activeSearchQuery = value || "";
    renderTraditionsCatalog();
}


/* =====================================================================
   2. INTERACTION — Mobile Navigation Drawer & Accordion
   ===================================================================== */
function initMobileNavigation() {
    const toggleBtn = document.querySelector(".hamburger-toggle");
    const navMenu = document.querySelector(".nav-menu");
    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("nav-open");
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close drawer when a nav link is clicked on mobile
    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("nav-open");
            toggleBtn.setAttribute("aria-expanded", "false");
        });
    });
}

/**
 * Toggle FAQ / Customs accordion item on Page 1.
 */
function toggleAccordion(triggerEl) {
    if (!triggerEl) return;
    const item = triggerEl.closest(".accordion-item");
    if (!item) return;
    item.classList.toggle("open");
}


/* =====================================================================
   3. STATE & MEMORY — Cultural Preferences Planner (Page 3)
   ===================================================================== */
const STORAGE_KEY = "petalPromiseCulturalPrefs_v1";

const defaultPlannerState = {
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    cultureLabel: "South Asian (Desi Traditional)",
    cultureCode: "desi",
    cultureBaseCost: 2500,
    rituals: [
        "Bridal Henna Night",
        "Sacred Nikkah / Vows",
        "Groom Barat Procession",
        "Rukhsati / Farewell"
    ],
    attire: "Royal Mughal Hand-Embroidered Lehenga & Velvet Sherwani",
    cuisine: "Authentic Desi Royal Buffet (Dum Biryani, Qorma, Kebabs)",
    music: "Sufi Live Qawwali & Folk Dhol",
    guests: 250,
    season: "winter"
};

let plannerState = { ...defaultPlannerState };

function loadPlannerState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
            plannerState = { ...defaultPlannerState, ...parsed };
            if (!Array.isArray(plannerState.rituals)) {
                plannerState.rituals = [...defaultPlannerState.rituals];
            }
        }
    } catch (_err) {
        plannerState = { ...defaultPlannerState };
    }
}

function savePlannerState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plannerState));
    } catch (_err) {
        // Ignore storage quota errors in restricted browser contexts
    }
}


/* =====================================================================
   4. LOGIC & CALCULATION — Real-Time Budget Formula & Blueprint Sync
   ===================================================================== */
const SEASON_MULTIPLIER = {
    winter: 1.15,
    spring: 1.05,
    autumn: 1.0
};

const RITUAL_COST_EACH = 180;
const PER_GUEST_BASE_RATE = 4.2;

/**
 * Compute estimated USD budget from current plannerState.
 */
function calculateEstimatedBudget() {
    const base = Number(plannerState.cultureBaseCost) || 2500;
    const guests = Math.max(50, Math.min(2500, Number(plannerState.guests) || 250));
    const ritualsCount = plannerState.rituals.length;
    const multiplier = SEASON_MULTIPLIER[plannerState.season] || 1.0;

    const rawTotal = (base + ritualsCount * RITUAL_COST_EACH + guests * PER_GUEST_BASE_RATE) * multiplier;
    return Math.round(rawTotal / 10) * 10;
}

/**
 * Update the live Blueprint Sidebar DOM from plannerState.
 */
function syncBlueprintUI() {
    const cultureEl = document.getElementById("blueprintCultureVal");
    const attireEl = document.getElementById("blueprintAttireVal");
    const cuisineEl = document.getElementById("blueprintCuisineVal");
    const musicEl = document.getElementById("blueprintMusicVal");
    const guestsEl = document.getElementById("blueprintGuestsVal");
    const badgesEl = document.getElementById("blueprintRitualsBadges");
    const budgetEl = document.getElementById("liveBudgetEstimate");

    if (!cultureEl) return;

    cultureEl.textContent = plannerState.cultureLabel;
    attireEl.textContent = shortenLabel(plannerState.attire, 28);
    cuisineEl.textContent = shortenLabel(plannerState.cuisine, 28);
    musicEl.textContent = plannerState.music;
    guestsEl.textContent = `${plannerState.guests} Guests`;

    if (badgesEl) {
        if (plannerState.rituals.length === 0) {
            badgesEl.innerHTML = `<span class="ritual-badge">No rituals selected</span>`;
        } else {
            badgesEl.innerHTML = plannerState.rituals
                .map((ritual) => `<span class="ritual-badge">${escapeHtml(ritual)}</span>`)
                .join("");
        }
    }

    if (budgetEl) {
        const total = calculateEstimatedBudget();
        budgetEl.textContent = `$${total.toLocaleString("en-US")} USD`;
    }
}

/**
 * Restore form inputs on Page 3 from saved plannerState.
 */
function hydratePlannerFormFromState() {
    const form = document.getElementById("culturalPreferencesForm");
    if (!form) return;

    const nameInput = document.getElementById("inputClientName");
    const emailInput = document.getElementById("inputClientEmail");
    const phoneInput = document.getElementById("inputClientPhone");
    const attireSelect = document.getElementById("selectAttire");
    const cuisineSelect = document.getElementById("selectCuisine");
    const guestsInput = document.getElementById("inputGuestsNumber");
    const seasonSelect = document.getElementById("selectSeason");

    if (nameInput && plannerState.clientName) nameInput.value = plannerState.clientName;
    if (emailInput && plannerState.clientEmail) emailInput.value = plannerState.clientEmail;
    if (phoneInput && plannerState.clientPhone) phoneInput.value = plannerState.clientPhone;
    if (attireSelect) attireSelect.value = plannerState.attire;
    if (cuisineSelect) cuisineSelect.value = plannerState.cuisine;
    if (guestsInput) guestsInput.value = String(plannerState.guests);
    if (seasonSelect) seasonSelect.value = plannerState.season;

    // Restore checkboxes
    const checkboxes = document.querySelectorAll('input[name="planner_rituals"]');
    checkboxes.forEach((cb) => {
        cb.checked = plannerState.rituals.includes(cb.value);
    });

    // Restore culture & music active chips by matching onclick attribute text
    const fieldSets = form.querySelectorAll(".form-field-set");
    fieldSets.forEach((fs) => {
        const chips = fs.querySelectorAll(".choice-chip");
        if (chips.length === 4) {
            chips.forEach((chip) => {
                const handler = chip.getAttribute("onclick") || "";
                chip.classList.toggle("active", handler.includes(`'${plannerState.cultureCode}'`));
            });
        } else if (chips.length === 3) {
            chips.forEach((chip) => {
                const handler = chip.getAttribute("onclick") || "";
                chip.classList.toggle("active", handler.includes(plannerState.music));
            });
        }
    });

    // Live input persistence & validation listeners
    if (nameInput) {
        nameInput.addEventListener("input", () => {
            plannerState.clientName = nameInput.value;
            validateNameField();
            savePlannerState();
        });
    }
    if (emailInput) {
        emailInput.addEventListener("input", () => {
            plannerState.clientEmail = emailInput.value;
            validateEmailField();
            savePlannerState();
        });
    }
    if (phoneInput) {
        phoneInput.addEventListener("input", () => {
            plannerState.clientPhone = phoneInput.value;
            validatePhoneField();
            savePlannerState();
        });
    }

    syncBlueprintUI();
}


/* =====================================================================
   5. PLANNER EVENT HANDLERS (Referenced inline in cultural-preferences.html)
   ===================================================================== */
function onCultureSelect(label, code, baseCost, chipEl) {
    plannerState.cultureLabel = label;
    plannerState.cultureCode = code;
    plannerState.cultureBaseCost = baseCost;

    if (chipEl && chipEl.parentElement) {
        chipEl.parentElement.querySelectorAll(".choice-chip").forEach((c) => c.classList.remove("active"));
        chipEl.classList.add("active");
    }
    savePlannerState();
    syncBlueprintUI();
}

function onRitualsCheckboxChange() {
    const checked = Array.from(document.querySelectorAll('input[name="planner_rituals"]:checked'));
    plannerState.rituals = checked.map((cb) => cb.value);
    savePlannerState();
    syncBlueprintUI();
}

function onAttireSelect(selectEl) {
    if (!selectEl) return;
    plannerState.attire = selectEl.value;
    savePlannerState();
    syncBlueprintUI();
}

function onCuisineSelect(selectEl) {
    if (!selectEl) return;
    plannerState.cuisine = selectEl.value;
    savePlannerState();
    syncBlueprintUI();
}

function onMusicSelect(label, chipEl) {
    plannerState.music = label;
    if (chipEl && chipEl.parentElement) {
        chipEl.parentElement.querySelectorAll(".choice-chip").forEach((c) => c.classList.remove("active"));
        chipEl.classList.add("active");
    }
    savePlannerState();
    syncBlueprintUI();
}

function onGuestsChange(inputEl) {
    if (!inputEl) return;
    const num = parseInt(inputEl.value, 10);
    plannerState.guests = Number.isNaN(num) ? 50 : Math.max(50, Math.min(2500, num));
    savePlannerState();
    syncBlueprintUI();
}

function onSeasonSelect(selectEl) {
    if (!selectEl) return;
    plannerState.season = selectEl.value;
    savePlannerState();
    syncBlueprintUI();
}


/* =====================================================================
   6. FORMS & VALIDATION + ACCESSIBLE MODAL DIALOG
   ===================================================================== */
function setFieldError(inputId, errorId, isValid) {
    const inputEl = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (!inputEl || !errorEl) return isValid;

    inputEl.classList.toggle("input-invalid", !isValid);
    errorEl.classList.toggle("show", !isValid);
    return isValid;
}

function validateNameField() {
    const val = (document.getElementById("inputClientName")?.value || "").trim();
    return setFieldError("inputClientName", "nameError", val.length >= 3);
}

function validateEmailField() {
    const val = (document.getElementById("inputClientEmail")?.value || "").trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return setFieldError("inputClientEmail", "emailError", emailPattern.test(val));
}

function validatePhoneField() {
    const val = (document.getElementById("inputClientPhone")?.value || "").trim();
    const digitsOnly = val.replace(/\D/g, "");
    return setFieldError("inputClientPhone", "phoneError", digitsOnly.length >= 7);
}

function handlePlannerFormSubmission(event) {
    event.preventDefault();

    const nameOk = validateNameField();
    const emailOk = validateEmailField();
    const phoneOk = validatePhoneField();

    if (!nameOk || !emailOk || !phoneOk) {
        const firstInvalid = document.querySelector(".input-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
    }

    plannerState.clientName = document.getElementById("inputClientName").value.trim();
    plannerState.clientEmail = document.getElementById("inputClientEmail").value.trim();
    plannerState.clientPhone = document.getElementById("inputClientPhone").value.trim();
    savePlannerState();

    openBookingModal();
}

function openBookingModal() {
    const modal = document.getElementById("bookingSuccessModal");
    const summaryContainer = document.getElementById("modalDynamicSummary");
    if (!modal || !summaryContainer) return;

    const total = calculateEstimatedBudget();
    const ritualsText = plannerState.rituals.length > 0 ? plannerState.rituals.join(", ") : "None selected";

    summaryContainer.innerHTML = `
        <div class="modal-summary-line">
            <span>Couple / Family</span>
            <span>${escapeHtml(plannerState.clientName)}</span>
        </div>
        <div class="modal-summary-line">
            <span>Contact</span>
            <span>${escapeHtml(plannerState.clientEmail)}</span>
        </div>
        <div class="modal-summary-line">
            <span>Heritage Theme</span>
            <span>${escapeHtml(plannerState.cultureLabel)}</span>
        </div>
        <div class="modal-summary-line">
            <span>Rituals (${plannerState.rituals.length})</span>
            <span>${escapeHtml(ritualsText)}</span>
        </div>
        <div class="modal-summary-line">
            <span>Guest Count</span>
            <span>${plannerState.guests} Guests (${escapeHtml(plannerState.season)})</span>
        </div>
        <div class="modal-price-row">
            <div style="font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted);">
                Estimated Cultural Package
            </div>
            <strong>$${total.toLocaleString("en-US")} USD</strong>
        </div>
    `;

    modal.classList.add("open");
    const closeBtn = modal.querySelector(".btn-close-modal");
    if (closeBtn) closeBtn.focus();
}

function closeModalDialog() {
    const modal = document.getElementById("bookingSuccessModal");
    if (modal) {
        modal.classList.remove("open");
    }
}

function initModalAccessibility() {
    const modal = document.getElementById("bookingSuccessModal");
    if (!modal) return;

    // Close when clicking backdrop outside .modal-window
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModalDialog();
        }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeModalDialog();
        }
    });
}


/* =====================================================================
   7. HELPERS & INITIALIZATION
   ===================================================================== */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function shortenLabel(text, maxLen) {
    if (!text || text.length <= maxLen) return text || "";
    return text.slice(0, maxLen - 1).trimEnd() + "…";
}

document.addEventListener("DOMContentLoaded", () => {
    initMobileNavigation();
    renderTraditionsCatalog();
    loadPlannerState();
    hydratePlannerFormFromState();
    initModalAccessibility();
});
