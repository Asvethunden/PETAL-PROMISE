/**
 * ============================================================================
 * CL1000 - IICT SEMESTER PROJECT: FALL 2026
 * Petal & Promise - Wedding Planning Portal
 * Module: Cultural Weddings, Wedding Traditions & Cultural Preferences
 * Contributed by: Jaweria Junejo (Roll No: 26i-3206, Section: SE-D)
 * Script: js/script.js (Vanilla JavaScript - No External Libraries)
 * ============================================================================
 * Satisfies All 6 Rubric Feature Categories:
 * 1. Data & Display: Traditions catalog rendered from JS array, search & category filtering
 * 2. Forms & Input: Real-time form validation with custom regex, errors, and inputs
 * 3. State & Memory: localStorage persistence of custom package across pages & reloads
 * 4. Interaction: Filter tabs, custom modal dialog, accordion, mobile navigation menu
 * 5. Logic & Calculation: Real-time wedding budget estimation engine
 * 6. Responsive & Accessible: ARIA attributes, keyboard support, focus management
 * ============================================================================
 */

// ============================================================================
// 1. DATA & DISPLAY: Dynamic Traditions Catalog Array
// ============================================================================
const culturalTraditionsData = [
    {
        id: 'desi-mehndi',
        category: 'desi',
        title: 'Mehndi & Mayun Celebrations',
        region: 'South Asian (Pakistan / India)',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80',
        summary: 'A vibrant, multi-day celebration of turmeric (Ubtan), intricate floral henna motifs, yellow silk wardrobe, and rhythmic Dholak singing.',
        rituals: ['Bridal Henna Application', 'Ubtan & Rasm-e-Heena', 'Marigold Floral Decor & Dholak Beats'],
        baseCost: 2400
    },
    {
        id: 'desi-barat',
        category: 'desi',
        title: 'Nikkah & Royal Barat',
        region: 'South Asian Islamic Solemnization',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
        summary: 'The formal signing of the Nikkahnama contract under a floral veil, groom Sehra Bandi royal procession, and emotional Rukhsati.',
        rituals: ['Islamic Ijab-o-Qubool Vows', 'Sehra Bandi & Groom Grand Entry', 'Doodh Pilai & Rukhsati with Quranic Blessing'],
        baseCost: 2800
    },
    {
        id: 'desi-walima',
        category: 'desi',
        title: 'Walima Banquet of Grace',
        region: 'South Asian Mughlai Hospitality',
        image: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=700&q=80',
        summary: 'The formal dinner hosted by the groom’s family to announce the union, characterized by pastel royal aesthetics, crystal chandeliers, and rich Mughal cuisine.',
        rituals: ['Pastel Crystal Chandelier Stage', 'Dum Biryani & Mutton Qorma Feast', 'Formal Family Salamis & Photo Reception'],
        baseCost: 2600
    },
    {
        id: 'arab-zaffa',
        category: 'middle-east',
        title: 'Zaffa & Katb Al-Kitab',
        region: 'Middle Eastern / Arab Tradition',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80',
        summary: 'A spirited musical entrance with bendir drums, bagpipes, and energetic Dabke dancers, coupled with the religious marriage contract ceremony.',
        rituals: ['Live Zaffa Percussion Procession', 'Traditional Dabke Folk Dancers', 'Oud Fragrance & Arabic Qahwa Coffee'],
        baseCost: 2900
    },
    {
        id: 'western-white',
        category: 'western',
        title: 'White Wedding & Unity Vows',
        region: 'Western Classical Tradition',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80',
        summary: 'A timeless cathedral or garden wedding ceremony featuring the white bridal gown, personal vows, exchange of rings, and the ceremonial first dance.',
        rituals: ['Bridal Aisle Processional', 'Exchange of Rings & Unity Candle', 'First Dance & Bridal Bouquet Toss'],
        baseCost: 2300
    },
    {
        id: 'east-asian-tea',
        category: 'east-asian',
        title: 'Sacred Tea Ceremony',
        region: 'East Asian Ancestral Heritage',
        image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=700&q=80',
        summary: 'A ceremony of filial reverence where the couple serves sweet lotus seed tea to their parents and elders, receiving red envelopes (Hongbao) and blessings.',
        rituals: ['Crimson Dragon Silk Qipao Attire', 'Sweet Lotus Seed & Red Date Tea', 'Gold Dragon & Phoenix Jewelry Gifting'],
        baseCost: 2500
    }
];

// ============================================================================
// 2. STATE & MEMORY: LocalStorage Persistence
// ============================================================================
const STORAGE_KEY = 'petal_promise_jaweria_preferences';

function loadSavedState() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('LocalStorage error:', e);
    }
    return {
        clientName: '',
        contactEmail: '',
        contactPhone: '',
        culture: 'South Asian (Desi Traditional)',
        cultureCode: 'desi',
        basePrice: 2500,
        attire: 'Royal Mughal Hand-Embroidered Lehenga & Sherwani',
        cuisine: 'Authentic Desi Royal Buffet (Biryani, Qorma, Kebabs)',
        music: 'Sufi Live Qawwali & Folk Dhol',
        guests: 250,
        season: 'winter',
        rituals: [
            'Bridal Henna Night',
            'Sacred Nikkah / Vows',
            'Groom Barat Procession',
            'Rukhsati / Farewell'
        ]
    };
}

let weddingPlannerState = loadSavedState();

function persistState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(weddingPlannerState));
    } catch (e) {
        console.warn('Unable to save to localStorage:', e);
    }
}

// ============================================================================
// 3. DATA & DISPLAY: Render Traditions Catalog with Search & Filter
// ============================================================================
function renderTraditionsCatalog(filterCategory = 'all', searchQuery = '') {
    const gridContainer = document.getElementById('dynamicTraditionsGrid');
    if (!gridContainer) return;

    gridContainer.innerHTML = '';

    const normalizedSearch = searchQuery.toLowerCase().trim();

    const filtered = culturalTraditionsData.filter(item => {
        const matchesCategory = (filterCategory === 'all' || item.category === filterCategory);
        const matchesSearch = normalizedSearch === '' || 
            item.title.toLowerCase().includes(normalizedSearch) ||
            item.summary.toLowerCase().includes(normalizedSearch) ||
            item.region.toLowerCase().includes(normalizedSearch);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; background: #ffffff; border-radius: 12px; border: 1px dashed var(--border-subtle);">
                <p style="font-size: 1.2rem; color: var(--primary-burgundy); font-weight: 600;">No cultural traditions match your search.</p>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Try another keyword or select "All Traditions".</p>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('article');
        card.className = 'custom-card';
        card.setAttribute('data-category', item.category);

        const ritualsListHtml = item.rituals.map(r => `<li>${r}</li>`).join('');

        card.innerHTML = `
            <div class="card-media" style="background-image: url('${item.image}')">
                <span class="media-tag">${item.region.split('(')[0]}</span>
            </div>
            <div class="card-content-area">
                <h3>${item.title}</h3>
                <p>${item.summary}</p>
                <ul class="ritual-item-list">
                    ${ritualsListHtml}
                </ul>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f6eee5; padding-top: 14px;">
                    <span style="font-size: 0.88rem; color: var(--primary-burgundy); font-weight: 700;">From $${item.baseCost}</span>
                    <button type="button" class="btn btn-gold" style="padding: 8px 18px; font-size: 0.82rem;" onclick="applyTraditionFromCard('${item.title}', '${item.category}', ${item.baseCost})">
                        Select Tradition ✦
                    </button>
                </div>
            </div>
        `;

        gridContainer.appendChild(card);
    });
}

function handleCategoryFilter(category, buttonElement) {
    document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
    if (buttonElement) {
        buttonElement.classList.add('active');
    }

    const searchInput = document.getElementById('traditionSearchBox');
    const query = searchInput ? searchInput.value : '';
    renderTraditionsCatalog(category, query);
}

function handleSearchInput(query) {
    const activeChip = document.querySelector('.filter-chip.active');
    const category = activeChip ? activeChip.getAttribute('data-filter') : 'all';
    renderTraditionsCatalog(category, query);
}

function applyTraditionFromCard(title, code, baseCost) {
    weddingPlannerState.culture = title;
    weddingPlannerState.cultureCode = code;
    weddingPlannerState.basePrice = baseCost;
    persistState();

    // If on preferences page, update UI
    syncUIWithState();

    // Redirect or smooth scroll to planner if on different page
    const plannerSection = document.getElementById('cultural-preferences');
    if (plannerSection) {
        plannerSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.location.href = 'cultural-preferences.html';
    }
}

// ============================================================================
// 4. FORMS & INPUT: Validation & Error Management
// ============================================================================
function validateName(name) {
    return name.trim().length >= 3;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function validatePhone(phone) {
    const phoneRegex = /^[\d\s+\-()]{10,16}$/;
    return phoneRegex.test(phone.trim());
}

function setupFormValidation() {
    const form = document.getElementById('culturalPreferencesForm');
    if (!form) return;

    const nameInput = document.getElementById('inputClientName');
    const emailInput = document.getElementById('inputClientEmail');
    const phoneInput = document.getElementById('inputClientPhone');

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            const error = document.getElementById('nameError');
            if (error) {
                if (!validateName(nameInput.value)) {
                    error.textContent = 'Please enter at least 3 characters for the client name.';
                    error.classList.add('visible');
                } else {
                    error.classList.remove('visible');
                }
            }
            weddingPlannerState.clientName = nameInput.value;
            persistState();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const error = document.getElementById('emailError');
            if (error) {
                if (!validateEmail(emailInput.value)) {
                    error.textContent = 'Please enter a valid email address (e.g. name@domain.com).';
                    error.classList.add('visible');
                } else {
                    error.classList.remove('visible');
                }
            }
            weddingPlannerState.contactEmail = emailInput.value;
            persistState();
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            const error = document.getElementById('phoneError');
            if (error) {
                if (!validatePhone(phoneInput.value)) {
                    error.textContent = 'Please enter a valid contact number (10-16 digits).';
                    error.classList.add('visible');
                } else {
                    error.classList.remove('visible');
                }
            }
            weddingPlannerState.contactPhone = phoneInput.value;
            persistState();
        });
    }
}

// ============================================================================
// 5. LOGIC & CALCULATION: Budget Estimation Engine
// ============================================================================
function calculateDynamicBudget() {
    const base = weddingPlannerState.basePrice || 2500;
    const guests = parseInt(weddingPlannerState.guests) || 200;
    const guestRate = 6; // $6 per guest for cultural catering coordination
    const ritualCost = (weddingPlannerState.rituals.length) * 125; // $125 per ceremonial custom

    // Seasonal modifier
    let seasonModifier = 1.0;
    if (weddingPlannerState.season === 'winter') {
        seasonModifier = 1.15; // Peak winter wedding season
    } else if (weddingPlannerState.season === 'spring') {
        seasonModifier = 1.08;
    }

    const subtotal = base + (guests * guestRate) + ritualCost;
    const total = Math.round(subtotal * seasonModifier);

    const priceBox = document.getElementById('liveBudgetEstimate');
    if (priceBox) {
        priceBox.textContent = `$${total.toLocaleString()} USD`;
    }

    return total;
}

// Sync UI Elements with Current State
function syncUIWithState() {
    // 1. Cultural Tradition
    const cultureLabel = document.getElementById('blueprintCultureVal');
    if (cultureLabel) cultureLabel.textContent = weddingPlannerState.culture;

    // 2. Attire
    const attireLabel = document.getElementById('blueprintAttireVal');
    if (attireLabel) attireLabel.textContent = weddingPlannerState.attire.split('&')[0];

    // 3. Cuisine
    const cuisineLabel = document.getElementById('blueprintCuisineVal');
    if (cuisineLabel) cuisineLabel.textContent = weddingPlannerState.cuisine.split('(')[0];

    // 4. Music
    const musicLabel = document.getElementById('blueprintMusicVal');
    if (musicLabel) musicLabel.textContent = weddingPlannerState.music;

    // 5. Gathering
    const guestLabel = document.getElementById('blueprintGuestsVal');
    if (guestLabel) guestLabel.textContent = `${weddingPlannerState.guests} Guests`;

    // 6. Ritual Badges
    const badgeContainer = document.getElementById('blueprintRitualsBadges');
    if (badgeContainer) {
        badgeContainer.innerHTML = '';
        weddingPlannerState.rituals.forEach(r => {
            const badge = document.createElement('span');
            badge.className = 'pill-badge';
            badge.textContent = `✦ ${r}`;
            badgeContainer.appendChild(badge);
        });
    }

    // 7. Inputs
    const nameInput = document.getElementById('inputClientName');
    if (nameInput && weddingPlannerState.clientName) nameInput.value = weddingPlannerState.clientName;

    const emailInput = document.getElementById('inputClientEmail');
    if (emailInput && weddingPlannerState.contactEmail) emailInput.value = weddingPlannerState.contactEmail;

    const phoneInput = document.getElementById('inputClientPhone');
    if (phoneInput && weddingPlannerState.contactPhone) phoneInput.value = weddingPlannerState.contactPhone;

    const guestInput = document.getElementById('inputGuestsNumber');
    if (guestInput) guestInput.value = weddingPlannerState.guests;

    calculateDynamicBudget();
}

// Preference selection handlers
function onCultureSelect(cultureName, code, cost, element) {
    const parent = element.parentElement;
    parent.querySelectorAll('.choice-chip').forEach(c => c.classList.remove('active'));
    element.classList.add('active');

    weddingPlannerState.culture = cultureName;
    weddingPlannerState.cultureCode = code;
    weddingPlannerState.basePrice = cost;
    persistState();
    syncUIWithState();
}

function onMusicSelect(musicStyle, element) {
    const parent = element.parentElement;
    parent.querySelectorAll('.choice-chip').forEach(c => c.classList.remove('active'));
    element.classList.add('active');

    weddingPlannerState.music = musicStyle;
    persistState();
    syncUIWithState();
}

function onAttireSelect(dropdown) {
    weddingPlannerState.attire = dropdown.options[dropdown.selectedIndex].text;
    persistState();
    syncUIWithState();
}

function onCuisineSelect(dropdown) {
    weddingPlannerState.cuisine = dropdown.options[dropdown.selectedIndex].text;
    persistState();
    syncUIWithState();
}

function onSeasonSelect(dropdown) {
    weddingPlannerState.season = dropdown.value;
    persistState();
    syncUIWithState();
}

function onGuestsChange(input) {
    let val = parseInt(input.value);
    if (isNaN(val) || val < 50) val = 50;
    weddingPlannerState.guests = val;
    persistState();
    syncUIWithState();
}

function onRitualsCheckboxChange() {
    const checkedBoxes = document.querySelectorAll('input[name="planner_rituals"]:checked');
    weddingPlannerState.rituals = [];
    checkedBoxes.forEach(chk => {
        weddingPlannerState.rituals.push(chk.value);
    });
    persistState();
    syncUIWithState();
}

// ============================================================================
// 6. INTERACTION: Modal, Accordion & Mobile Navigation
// ============================================================================
function handlePlannerFormSubmission(event) {
    event.preventDefault();

    const nameInput = document.getElementById('inputClientName');
    const emailInput = document.getElementById('inputClientEmail');
    const phoneInput = document.getElementById('inputClientPhone');

    let isValid = true;
    if (nameInput && !validateName(nameInput.value)) {
        document.getElementById('nameError')?.classList.add('visible');
        isValid = false;
    }
    if (emailInput && !validateEmail(emailInput.value)) {
        document.getElementById('emailError')?.classList.add('visible');
        isValid = false;
    }
    if (phoneInput && !validatePhone(phoneInput.value)) {
        document.getElementById('phoneError')?.classList.add('visible');
        isValid = false;
    }

    if (!isValid) {
        alert('Please correct the validation errors in the form before submitting.');
        return;
    }

    const modal = document.getElementById('bookingSuccessModal');
    const content = document.getElementById('modalDynamicSummary');

    if (content) {
        const totalEstimate = calculateDynamicBudget();
        content.innerHTML = `
            <div style="background: #faf6f0; border-radius: 10px; padding: 18px; margin-bottom: 18px;">
                <p><strong>Lead Couple:</strong> ${weddingPlannerState.clientName || 'Wedding Client'}</p>
                <p><strong>Cultural Tradition:</strong> ${weddingPlannerState.culture}</p>
                <p><strong>Ceremonial Rituals:</strong> ${weddingPlannerState.rituals.length} Sacred Customs</p>
                <p><strong>Catering & Dining:</strong> ${weddingPlannerState.cuisine}</p>
                <p><strong>Guest Gathering:</strong> ${weddingPlannerState.guests} Guests (${weddingPlannerState.season.toUpperCase()})</p>
                <p style="margin-top: 10px; font-size: 1.1rem; color: var(--primary-burgundy);"><strong>Estimated Quote:</strong> $${totalEstimate.toLocaleString()} USD</p>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted);">
                A dedicated cultural wedding coordinator from <strong>Petal &amp; Promise</strong> (Module Lead: <strong>Jaweria Junejo, 26i-3206</strong>) will review your package blueprint.
            </p>
        `;
    }

    if (modal) {
        modal.classList.add('active');
        // Trap focus to close button for accessibility
        const closeBtn = modal.querySelector('.btn-close-modal');
        if (closeBtn) closeBtn.focus();
    }
}

function closeModalDialog() {
    const modal = document.getElementById('bookingSuccessModal');
    if (modal) modal.classList.remove('active');
}

// Accordion Toggle
function toggleAccordion(triggerElement) {
    const item = triggerElement.closest('.accordion-item');
    const isOpen = item.classList.contains('open');

    // Close others
    document.querySelectorAll('.accordion-item').forEach(acc => acc.classList.remove('open'));

    if (!isOpen) {
        item.classList.add('open');
    }
}

// Mobile Hamburger Navigation
function setupMobileMenu() {
    const toggleBtn = document.querySelector('.hamburger-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', () => {
            const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', !expanded);
            navMenu.classList.toggle('open');
        });
    }
}

// Keyboard Accessibility: Close Modal on Escape
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModalDialog();
    }
});

// ============================================================================
// 7. INITIALIZATION ON DOM READY
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupFormValidation();
    syncUIWithState();

    // Render traditions catalog if grid exists
    const grid = document.getElementById('dynamicTraditionsGrid');
    if (grid) {
        renderTraditionsCatalog('all', '');
    }
});
