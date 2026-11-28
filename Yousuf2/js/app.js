(function () {
  "use strict";

  const WEDDING_KEY = "wedding";
  const BUDGET_KEY = "budget";

  const PRIORITY_PROFILES = {
    Balanced: [
      { key: "catering", label: "Catering", percentage: 40 },
      { key: "venue", label: "Venue", percentage: 25 },
      { key: "decoration", label: "Decoration", percentage: 15 },
      { key: "photography", label: "Photography", percentage: 10 },
      { key: "emergency", label: "Emergency reserve", percentage: 10 }
    ],
    Catering: [
      { key: "catering", label: "Catering", percentage: 50 },
      { key: "venue", label: "Venue", percentage: 20 },
      { key: "decoration", label: "Decoration", percentage: 12 },
      { key: "photography", label: "Photography", percentage: 8 },
      { key: "emergency", label: "Emergency reserve", percentage: 10 }
    ],
    Venue: [
      { key: "catering", label: "Catering", percentage: 32 },
      { key: "venue", label: "Venue", percentage: 38 },
      { key: "decoration", label: "Decoration", percentage: 12 },
      { key: "photography", label: "Photography", percentage: 8 },
      { key: "emergency", label: "Emergency reserve", percentage: 10 }
    ],
    Decoration: [
      { key: "catering", label: "Catering", percentage: 34 },
      { key: "venue", label: "Venue", percentage: 22 },
      { key: "decoration", label: "Decoration", percentage: 26 },
      { key: "photography", label: "Photography", percentage: 8 },
      { key: "emergency", label: "Emergency reserve", percentage: 10 }
    ],
    Photography: [
      { key: "catering", label: "Catering", percentage: 35 },
      { key: "venue", label: "Venue", percentage: 22 },
      { key: "decoration", label: "Decoration", percentage: 13 },
      { key: "photography", label: "Photography", percentage: 20 },
      { key: "emergency", label: "Emergency reserve", percentage: 10 }
    ]
  };

  const navToggle = document.getElementById("nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  const ctxStyle = document.getElementById("ctx-style");
  const ctxEvents = document.getElementById("ctx-events");
  const ctxCeremonies = document.getElementById("ctx-ceremonies");
  const missingWeddingNotice = document.getElementById("missing-wedding-notice");

  const form = document.getElementById("budget-form");
  const formAlert = document.getElementById("form-alert");
  const budgetInput = document.getElementById("total-budget");
  const guestInput = document.getElementById("guest-count");
  const prioritySelect = document.getElementById("spending-priority");
  const budgetError = document.getElementById("budget-error");
  const guestsError = document.getElementById("guests-error");

  const backBtn = document.getElementById("back-btn");
  const resetBtn = document.getElementById("reset-btn");

  const activePriorityBadge = document.getElementById("active-priority-badge");
  const outTotalBudget = document.getElementById("out-total-budget");
  const outPerGuest = document.getElementById("out-per-guest");
  const resultsPlaceholder = document.getElementById("results-placeholder");
  const allocationList = document.getElementById("allocation-list");

  function setupMobileNav() {
    if (!navToggle || !primaryNav) return;
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      primaryNav.classList.toggle("is-open", !expanded);
    });
  }

  function formatPKR(amount) {
    const rounded = Math.round(amount);
    return "PKR " + rounded.toLocaleString("en-US");
  }

  function formatPerGuest(amount) {
    const isWhole = Math.abs(amount - Math.round(amount)) < 0.005;
    if (isWhole) {
      return "PKR " + Math.round(amount).toLocaleString("en-US");
    }
    return "PKR " + amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function loadWeddingContext() {
    let wedding = null;
    try {
      const raw = localStorage.getItem(WEDDING_KEY);
      if (raw) wedding = JSON.parse(raw);
    } catch (err) {
      wedding = null;
    }

    const hasValidWedding =
      wedding &&
      typeof wedding === "object" &&
      Boolean(wedding.style) &&
      Array.isArray(wedding.ceremonies) &&
      wedding.ceremonies.length > 0;

    if (!hasValidWedding) {
      ctxStyle.textContent = "Not selected";
      ctxEvents.textContent = "0";
      ctxCeremonies.innerHTML = "";
      const empty = document.createElement("span");
      empty.className = "empty-pill";
      empty.textContent = "None selected yet";
      ctxCeremonies.appendChild(empty);
      missingWeddingNotice.hidden = false;
      return;
    }

    missingWeddingNotice.hidden = true;
    ctxStyle.textContent = wedding.style;
    ctxEvents.textContent = String(wedding.ceremonies.length);
    ctxCeremonies.innerHTML = "";
    wedding.ceremonies.forEach((ceremony) => {
      const pill = document.createElement("span");
      pill.className = "ceremony-pill";
      pill.textContent = ceremony;
      ctxCeremonies.appendChild(pill);
    });
  }

  function setFieldError(inputEl, errorEl, message) {
    if (message) {
      inputEl.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      inputEl.removeAttribute("aria-invalid");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  function validateInputs(showErrors) {
    const rawBudget = budgetInput.value.trim();
    const rawGuests = guestInput.value.trim();

    let budgetErr = "";
    let guestsErr = "";

    const budgetNum = Number(rawBudget);
    if (rawBudget === "") {
      budgetErr = "Please enter your total wedding budget in PKR.";
    } else if (!Number.isFinite(budgetNum) || budgetNum <= 0) {
      budgetErr = "Wedding budget must be a positive number greater than 0 PKR.";
    }

    const guestsNum = Number(rawGuests);
    const hasDecimal = rawGuests.includes(".");
    if (rawGuests === "") {
      guestsErr = "Please enter the expected number of guests.";
    } else if (!Number.isFinite(guestsNum) || guestsNum <= 0) {
      guestsErr = "Guest count must be at least 1 guest (zero or negative counts are not allowed).";
    } else if (hasDecimal || !Number.isInteger(guestsNum)) {
      guestsErr = "Guest count must be a whole number without fractions or decimals.";
    }

    if (showErrors) {
      setFieldError(budgetInput, budgetError, budgetErr);
      setFieldError(guestInput, guestsError, guestsErr);
    }

    const isValid = !budgetErr && !guestsErr;
    return {
      isValid: isValid,
      totalBudget: budgetNum,
      guests: guestsNum,
      priority: prioritySelect.value,
      budgetErr: budgetErr,
      guestsErr: guestsErr
    };
  }

  function computeAllocations(totalBudget, priority) {
    const profile = PRIORITY_PROFILES[priority] || PRIORITY_PROFILES.Balanced;
    const allocations = profile.map((item) => ({
      key: item.key,
      label: item.label,
      percentage: item.percentage,
      amount: Math.round((totalBudget * item.percentage) / 100)
    }));

    // Keep exact sum equal to totalBudget if rounding shifted by 1-2 PKR
    const sum = allocations.reduce((acc, item) => acc + item.amount, 0);
    const diff = Math.round(totalBudget) - sum;
    if (diff !== 0 && allocations.length > 0) {
      allocations[allocations.length - 1].amount += diff;
    }
    return allocations;
  }

  function renderResults(totalBudget, guests, priority, allocations) {
    const perGuest = totalBudget / guests;
    activePriorityBadge.textContent = priority;
    outTotalBudget.textContent = formatPKR(totalBudget);
    outPerGuest.textContent = formatPerGuest(perGuest);

    resultsPlaceholder.hidden = true;
    allocationList.hidden = false;
    allocationList.innerHTML = "";

    allocations.forEach((item) => {
      const li = document.createElement("li");
      li.className = "allocation-item";

      const top = document.createElement("div");
      top.className = "allocation-top";

      const nameSpan = document.createElement("span");
      nameSpan.className = "allocation-name";
      nameSpan.textContent = item.label;

      const metaSpan = document.createElement("span");
      metaSpan.className = "allocation-meta";

      const pctSpan = document.createElement("span");
      pctSpan.className = "allocation-pct";
      pctSpan.textContent = item.percentage + "%";

      const amountSpan = document.createElement("span");
      amountSpan.className = "allocation-amount";
      amountSpan.textContent = formatPKR(item.amount);

      metaSpan.appendChild(pctSpan);
      metaSpan.appendChild(amountSpan);
      top.appendChild(nameSpan);
      top.appendChild(metaSpan);

      const track = document.createElement("div");
      track.className = "progress-track";
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", item.label + " budget share");
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", "100");
      track.setAttribute("aria-valuenow", String(item.percentage));

      const fill = document.createElement("div");
      fill.className = "progress-fill progress-fill--" + item.key;
      fill.style.width = item.percentage + "%";

      track.appendChild(fill);
      li.appendChild(top);
      li.appendChild(track);
      allocationList.appendChild(li);
    });
  }

  function clearResultsPreview() {
    activePriorityBadge.textContent = prioritySelect.value;
    outTotalBudget.textContent = "PKR 0";
    outPerGuest.textContent = "PKR 0";
    allocationList.hidden = true;
    allocationList.innerHTML = "";
    resultsPlaceholder.hidden = false;
  }

  function saveBudgetData(totalBudget, guests, priority, allocations) {
    const budgetPerGuest = totalBudget / guests;
    const payload = {
      totalBudget: totalBudget,
      guests: guests,
      priority: priority,
      budgetPerGuest: budgetPerGuest,
      allocations: allocations,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(BUDGET_KEY, JSON.stringify(payload));
    return payload;
  }

  function restoreSavedBudget() {
    try {
      const raw = localStorage.getItem(BUDGET_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object") return;

      if (Number.isFinite(Number(saved.totalBudget)) && Number(saved.totalBudget) > 0) {
        budgetInput.value = String(saved.totalBudget);
      }
      if (Number.isInteger(Number(saved.guests)) && Number(saved.guests) > 0) {
        guestInput.value = String(saved.guests);
      }
      if (saved.priority && PRIORITY_PROFILES[saved.priority]) {
        prioritySelect.value = saved.priority;
      }

      const check = validateInputs(false);
      if (check.isValid) {
        const allocations = computeAllocations(check.totalBudget, check.priority);
        renderResults(check.totalBudget, check.guests, check.priority, allocations);
      }
    } catch (err) {
      // Ignore malformed stored budget
    }
  }

  function handleLiveUpdate() {
    const hasTouchedBudget = budgetInput.value.trim() !== "";
    const hasTouchedGuests = guestInput.value.trim() !== "";
    const check = validateInputs(false);

    if (hasTouchedBudget) {
      setFieldError(budgetInput, budgetError, check.budgetErr);
    } else {
      setFieldError(budgetInput, budgetError, "");
    }

    if (hasTouchedGuests) {
      setFieldError(guestInput, guestsError, check.guestsErr);
    } else {
      setFieldError(guestInput, guestsError, "");
    }

    activePriorityBadge.textContent = prioritySelect.value;

    if (check.isValid) {
      formAlert.hidden = true;
      formAlert.textContent = "";
      const allocations = computeAllocations(check.totalBudget, check.priority);
      renderResults(check.totalBudget, check.guests, check.priority, allocations);
      saveBudgetData(check.totalBudget, check.guests, check.priority, allocations);
    } else {
      clearResultsPreview();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const check = validateInputs(true);

    if (!check.isValid) {
      formAlert.textContent = "Please fix the highlighted budget or guest count errors before continuing.";
      formAlert.hidden = false;
      if (check.budgetErr) {
        budgetInput.focus();
      } else if (check.guestsErr) {
        guestInput.focus();
      }
      clearResultsPreview();
      return;
    }

    formAlert.hidden = true;
    formAlert.textContent = "";
    const allocations = computeAllocations(check.totalBudget, check.priority);
    renderResults(check.totalBudget, check.guests, check.priority, allocations);
    saveBudgetData(check.totalBudget, check.guests, check.priority, allocations);
    window.location.href = "../Yousuf3/index.html";
  }

  function handleReset() {
    form.reset();
    prioritySelect.value = "Balanced";
    setFieldError(budgetInput, budgetError, "");
    setFieldError(guestInput, guestsError, "");
    formAlert.hidden = true;
    formAlert.textContent = "";
    localStorage.removeItem(BUDGET_KEY);
    clearResultsPreview();
    budgetInput.focus();
  }

  function init() {
    setupMobileNav();
    loadWeddingContext();
    restoreSavedBudget();

    budgetInput.addEventListener("input", handleLiveUpdate);
    guestInput.addEventListener("input", handleLiveUpdate);
    prioritySelect.addEventListener("change", handleLiveUpdate);
    form.addEventListener("submit", handleSubmit);
    resetBtn.addEventListener("click", handleReset);
    backBtn.addEventListener("click", function () {
      window.location.href = "../Yousuf1/index.html";
    });
  }

  init();
})();
