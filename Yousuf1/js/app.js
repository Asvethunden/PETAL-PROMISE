(function () {
  "use strict";

  const STORAGE_KEY = "wedding";

  const form = document.getElementById("customization-form");
  const styleRadios = Array.from(document.querySelectorAll('input[name="weddingStyle"]'));
  const ceremonyCheckboxes = Array.from(document.querySelectorAll('input[name="ceremonies"]'));
  const summaryStyle = document.getElementById("summary-style");
  const summaryCount = document.getElementById("summary-count");
  const summaryCeremonies = document.getElementById("summary-ceremonies");
  const validationBanner = document.getElementById("validation-banner");
  const clearBtn = document.getElementById("clear-selection-btn");
  const navToggle = document.getElementById("nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  function setupMobileNav() {
    if (!navToggle || !primaryNav) return;
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      primaryNav.classList.toggle("is-open", !expanded);
    });
  }

  function getSelectedStyle() {
    const checked = styleRadios.find((radio) => radio.checked);
    return checked ? checked.value : "";
  }

  function getSelectedCeremonies() {
    return ceremonyCheckboxes.filter((box) => box.checked).map((box) => box.value);
  }

  function updateCardStates() {
    styleRadios.forEach((radio) => {
      const card = radio.closest(".style-card");
      if (card) {
        card.classList.toggle("is-selected", radio.checked);
      }
    });

    ceremonyCheckboxes.forEach((box) => {
      const card = box.closest(".ceremony-card");
      if (card) {
        card.classList.toggle("is-selected", box.checked);
      }
    });
  }

  function renderSummary() {
    const style = getSelectedStyle();
    const ceremonies = getSelectedCeremonies();

    if (style) {
      summaryStyle.textContent = style;
      summaryStyle.classList.remove("is-placeholder");
    } else {
      summaryStyle.textContent = "Not selected yet";
      summaryStyle.classList.add("is-placeholder");
    }

    summaryCount.textContent = String(ceremonies.length);

    summaryCeremonies.innerHTML = "";
    if (ceremonies.length === 0) {
      const emptySpan = document.createElement("span");
      emptySpan.className = "empty-pill";
      emptySpan.textContent = "No ceremonies selected yet";
      summaryCeremonies.appendChild(emptySpan);
    } else {
      ceremonies.forEach((ceremony) => {
        const pill = document.createElement("span");
        pill.className = "ceremony-pill";
        pill.textContent = ceremony;
        summaryCeremonies.appendChild(pill);
      });
    }
  }

  function saveWeddingData() {
    const style = getSelectedStyle();
    const ceremonies = getSelectedCeremonies();
    const payload = {
      style: style,
      ceremonies: ceremonies,
      totalEvents: ceremonies.length,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload;
  }

  function restoreSavedWedding() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && typeof saved === "object") {
        if (saved.style) {
          const matchingRadio = styleRadios.find((r) => r.value === saved.style);
          if (matchingRadio) matchingRadio.checked = true;
        }
        if (Array.isArray(saved.ceremonies)) {
          ceremonyCheckboxes.forEach((box) => {
            box.checked = saved.ceremonies.includes(box.value);
          });
        }
      }
    } catch (err) {
      // Ignore malformed storage entry and allow fresh selection
    }
  }

  function showValidationError(message, targetElement) {
    validationBanner.textContent = message;
    validationBanner.hidden = false;
    if (targetElement && typeof targetElement.focus === "function") {
      targetElement.focus();
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function clearValidationError() {
    validationBanner.hidden = true;
    validationBanner.textContent = "";
  }

  function handleSelectionChange() {
    updateCardStates();
    renderSummary();
    if (getSelectedStyle() && getSelectedCeremonies().length > 0) {
      clearValidationError();
    }
    saveWeddingData();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const style = getSelectedStyle();
    const ceremonies = getSelectedCeremonies();

    if (!style && ceremonies.length === 0) {
      showValidationError(
        "Please select a wedding style and at least one wedding ceremony before continuing to budget planning.",
        styleRadios[0]
      );
      return;
    }

    if (!style) {
      showValidationError(
        "Please select a wedding style (Eastern, Western, or Fusion) before continuing.",
        styleRadios[0]
      );
      return;
    }

    if (ceremonies.length === 0) {
      showValidationError(
        "Please select at least one wedding ceremony (such as Nikkah, Mehndi, Baraat, Walima, or Reception).",
        ceremonyCheckboxes[0]
      );
      return;
    }

    clearValidationError();
    saveWeddingData();
    window.location.href = "../Yousuf2/index.html";
  }

  function handleClear() {
    styleRadios.forEach((radio) => {
      radio.checked = false;
    });
    ceremonyCheckboxes.forEach((box) => {
      box.checked = false;
    });
    localStorage.removeItem(STORAGE_KEY);
    clearValidationError();
    updateCardStates();
    renderSummary();
  }

  function init() {
    setupMobileNav();
    restoreSavedWedding();
    updateCardStates();
    renderSummary();

    styleRadios.forEach((radio) => {
      radio.addEventListener("change", handleSelectionChange);
    });

    ceremonyCheckboxes.forEach((box) => {
      box.addEventListener("change", handleSelectionChange);
    });

    form.addEventListener("submit", handleSubmit);
    clearBtn.addEventListener("click", handleClear);
  }

  init();
})();
