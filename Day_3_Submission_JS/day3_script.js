/**
 * ============================================================================
 * IICT SEMESTER PROJECT - SUBMISSION DAY 3: JAVASCRIPT INTERACTIVITY & LOGIC
 * ============================================================================
 * Student Name: Jaweria Junejo
 * Roll Number: 26i-3206
 * Section: SE-D
 * Course: Introduction to Information & Communication Technologies (IICT)
 * Project Name: Petal & Promise - Wedding Planning Portal
 * Assigned Module: Cultural Weddings, Wedding Traditions & Cultural Preferences
 * Day 3 Goal: Client-side DOM manipulation, reactive state, filters & price logic
 * ============================================================================
 */

// 1. Reactive State Object for User Selections
const culturalWeddingState = {
    selectedCulture: 'South Asian (Desi Traditional)',
    cultureCode: 'desi',
    basePrice: 2500,
    attire: 'Royal Mughal Hand-Embroidered Lehenga & Sherwani',
    cuisine: 'Authentic Desi Royal Buffet (Biryani, Qorma, Kebabs)',
    music: 'Sufi Live Qawwali & Folk Dhol',
    season: 'Winter Royale (Nov - Feb)',
    guestCount: 250,
    guestRate: 6,
    rituals: []
};

// 2. Filter Traditions by Category (Day 3 Feature)
function filterTraditions(category, element) {
    // Update active tab button style
    const filterButtons = document.querySelectorAll('.filter-tab-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }

    // Filter card visibility in DOM
    const cards = document.querySelectorAll('.tradition-card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// 3. Culture Chip Selection in Form
function selectCultureTheme(cultureName, code, baseCost, element) {
    const parentContainer = element.closest('.radio-pill-group') || element.parentElement;
    parentContainer.querySelectorAll('.selectable-pill').forEach(pill => pill.classList.remove('active'));
    element.classList.add('active');

    // Update state
    culturalWeddingState.selectedCulture = cultureName;
    culturalWeddingState.cultureCode = code;
    culturalWeddingState.basePrice = baseCost;

    // Update Blueprint UI
    const summaryCulture = document.getElementById('blueprintCulture');
    if (summaryCulture) {
        summaryCulture.textContent = cultureName;
    }

    recalculatePackage();
}

// 4. Music Style Selection
function selectMusicStyle(musicStyle, element) {
    const parentContainer = element.closest('.radio-pill-group') || element.parentElement;
    parentContainer.querySelectorAll('.selectable-pill').forEach(pill => pill.classList.remove('active'));
    element.classList.add('active');

    culturalWeddingState.music = musicStyle;
    const summaryMusic = document.getElementById('blueprintMusic');
    if (summaryMusic) {
        summaryMusic.textContent = musicStyle;
    }
}

// 5. Attire and Dining Dropdown Changes
function onAttireChange(selectElement) {
    const value = selectElement.options[selectElement.selectedIndex].text;
    culturalWeddingState.attire = value;
    const summaryAttire = document.getElementById('blueprintAttire');
    if (summaryAttire) {
        summaryAttire.textContent = value.split('&')[0];
    }
}

function onCuisineChange(selectElement) {
    const value = selectElement.options[selectElement.selectedIndex].text;
    culturalWeddingState.cuisine = value;
    const summaryCuisine = document.getElementById('blueprintCuisine');
    if (summaryCuisine) {
        summaryCuisine.textContent = value.split('(')[0];
    }
}

// 6. Rituals Multi-Checkbox Updates
function onRitualsUpdate() {
    const checkboxes = document.querySelectorAll('input[name="cultural_rituals"]:checked');
    const badgeContainer = document.getElementById('blueprintRitualsContainer');
    
    culturalWeddingState.rituals = [];
    if (badgeContainer) {
        badgeContainer.innerHTML = '';
    }

    checkboxes.forEach(chk => {
        culturalWeddingState.rituals.push(chk.value);
        if (badgeContainer) {
            const pill = document.createElement('span');
            pill.className = 'ritual-tag-pill';
            pill.innerHTML = `✦ ${chk.value}`;
            badgeContainer.appendChild(pill);
        }
    });

    recalculatePackage();
}

// 7. Dynamic Package Price Recalculation
function recalculatePackage() {
    const guestInput = document.getElementById('inputGuests');
    let guests = parseInt(guestInput ? guestInput.value : 250);
    if (isNaN(guests) || guests < 50) guests = 50;

    culturalWeddingState.guestCount = guests;
    const summaryGuests = document.getElementById('blueprintGuests');
    if (summaryGuests) {
        summaryGuests.textContent = `${guests} Guests`;
    }

    // Formula: Base Culture Price + (Guests * Guest Rate) + (Selected Rituals * $120 each)
    const ritualsCost = culturalWeddingState.rituals.length * 120;
    const guestCost = guests * culturalWeddingState.guestRate;
    const totalEstimatedPrice = culturalWeddingState.basePrice + guestCost + ritualsCost;

    const priceDisplay = document.getElementById('blueprintTotalPrice');
    if (priceDisplay) {
        priceDisplay.textContent = `$${totalEstimatedPrice.toLocaleString()} USD`;
    }
}

// 8. Form Submission & Modal Handling
function handleFormSubmit(event) {
    event.preventDefault();

    const clientNameInput = document.getElementById('clientName');
    const clientName = clientNameInput ? clientNameInput.value.trim() : 'Honored Client';

    const modal = document.getElementById('confirmationModal');
    const modalDetails = document.getElementById('modalDynamicContent');

    if (modalDetails) {
        modalDetails.innerHTML = `
            <p><strong>Client:</strong> ${clientName || 'Wedding Couple'}</p>
            <p><strong>Chosen Tradition:</strong> ${culturalWeddingState.selectedCulture}</p>
            <p><strong>Catering & Dining:</strong> ${culturalWeddingState.cuisine}</p>
            <p><strong>Rituals Included:</strong> ${culturalWeddingState.rituals.length} Sacred Customs</p>
            <p><strong>Estimated Gathering:</strong> ${culturalWeddingState.guestCount} Guests</p>
            <div style="margin-top: 15px; padding: 12px; background: #faf5ee; border-radius: 8px; font-weight: 600; color: #721629;">
                Custom Package Finalized by Jaweria Junejo (Module Lead)
            </div>
        `;
    }

    if (modal) {
        modal.classList.add('visible');
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.classList.remove('visible');
    }
}

// 9. Initial Load Binding
document.addEventListener('DOMContentLoaded', () => {
    onRitualsUpdate();
    recalculatePackage();
});
