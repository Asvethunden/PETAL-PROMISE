(function () {
  "use strict";

  var STORAGE_KEY = "services";
  var ALLOWED_TIERS = ["essential", "signature", "royal"];
  var TIER_LABELS = {
    essential: "Essential Elegance (Standard)",
    signature: "Signature Celebration (Curated)",
    royal: "Royal Floral Suite (Full Custom)"
  };

  // Illustrative wedding services data rendered dynamically into checkboxes
  var SERVICES = [
    {
      id: "catering",
      name: "Catering",
      category: "Culinary",
      estimatePkr: 320000,
      image: "images/service-catering.svg",
      alt: "Botanical dining cloche illustration representing Wedding Catering",
      description: "Multi-course banquet dining with live grill stations, welcome drinks, and seasonal dessert table.",
      inclusions: ["Custom tasting menu", "Uniformed service staff"]
    },
    {
      id: "photography",
      name: "Photography",
      category: "Visuals",
      estimatePkr: 160000,
      image: "images/service-photography.svg",
      alt: "Vintage camera framed by blush petals and sage leaves for Wedding Photography",
      description: "Full-event candid storytelling, couple portraits, and curated digital highlight gallery.",
      inclusions: ["2 lead photographers", "Edited online gallery"]
    },
    {
      id: "decoration",
      name: "Decoration",
      category: "Floral & Stage",
      estimatePkr: 210000,
      image: "images/service-decoration.svg",
      alt: "Blush rose and sage floral wedding stage arch for Decoration",
      description: "Bespoke stage backdrop, aisle florals, candlelit centerpieces, and ambient fairy lighting.",
      inclusions: ["Fresh floral arch", "Coordinated table linens"]
    },
    {
      id: "makeup",
      name: "Makeup",
      category: "Bridal Studio",
      estimatePkr: 85000,
      image: "images/service-makeup.svg",
      alt: "Botanical vanity mirror and brush illustration for Bridal Makeup",
      description: "Soft-glam or traditional bridal styling with pre-event consultation and hair-setting.",
      inclusions: ["Pre-wedding trial look", "Touch-up beauty kit"]
    },
    {
      id: "music",
      name: "Music",
      category: "Sound & Stage",
      estimatePkr: 95000,
      image: "images/service-music.svg",
      alt: "Music notes in a floral wreath representing Wedding Music",
      description: "Curated ceremony entrance tracks, acoustic dinner ambience, and celebration DJ sound setup.",
      inclusions: ["PA & wireless mics", "Custom event playlist"]
    }
  ];

  var SERVICE_NAMES = SERVICES.map(function (service) {
    return service.name;
  });

  function formatPkr(amount) {
    return "PKR " + Number(amount).toLocaleString("en-PK");
  }

  function createDefaultState() {
    return {
      packageTier: "signature",
      serviceBudget: "",
      contactEmail: "",
      serviceNotes: "",
      selected: []
    };
  }

  function normalizeSelectedArray(rawSelected) {
    if (!Array.isArray(rawSelected)) {
      return [];
    }
    var normalized = [];
    rawSelected.forEach(function (entry) {
      if (typeof entry !== "string") {
        return;
      }
      var lower = entry.trim().toLowerCase();
      var match = SERVICES.find(function (service) {
        return service.name.toLowerCase() === lower || service.id === lower;
      });
      if (match && normalized.indexOf(match.name) === -1) {
        normalized.push(match.name);
      }
    });
    return normalized;
  }

  function loadSavedState() {
    var fallback = createDefaultState();
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return fallback;
      }
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        fallback.selected = normalizeSelectedArray(parsed);
        return fallback;
      }
      if (!parsed || typeof parsed !== "object") {
        return fallback;
      }

      var tier = typeof parsed.packageTier === "string" && ALLOWED_TIERS.indexOf(parsed.packageTier) !== -1
        ? parsed.packageTier
        : fallback.packageTier;

      return {
        packageTier: tier,
        serviceBudget: typeof parsed.serviceBudget === "string" ? parsed.serviceBudget : "",
        contactEmail: typeof parsed.contactEmail === "string" ? parsed.contactEmail : "",
        serviceNotes: typeof parsed.serviceNotes === "string" ? parsed.serviceNotes : "",
        selected: normalizeSelectedArray(parsed.selected)
      };
    } catch (_err) {
      return fallback;
    }
  }

  function saveState(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (_err) {
      return false;
    }
  }

  function readOptionalJsonKey(key) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) {
        return null;
      }
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (_err) {
      return null;
    }
  }

  function validateBudget(rawValue) {
    var trimmed = String(rawValue || "").trim();
    if (trimmed === "") {
      return { valid: true, cap: null, error: "" };
    }
    if (!/^\d+$/.test(trimmed)) {
      return {
        valid: false,
        cap: null,
        error: "Please enter a valid positive whole number in PKR (e.g., 600000)."
      };
    }
    var amount = Number(trimmed);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      return {
        valid: false,
        cap: null,
        error: "Service budget cap must be greater than 0."
      };
    }
    return { valid: true, cap: amount, error: "" };
  }

  function validateEmail(rawValue) {
    var trimmed = String(rawValue || "").trim();
    if (trimmed === "") {
      return { valid: true, email: "", error: "" };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return {
        valid: false,
        email: trimmed,
        error: "Please enter a valid email address (e.g., couple@example.com) or leave blank."
      };
    }
    return { valid: true, email: trimmed, error: "" };
  }

  function setupMobileNav() {
    var navToggle = document.getElementById("nav-toggle");
    var primaryNav = document.getElementById("primary-nav");
    if (!navToggle || !primaryNav) {
      return;
    }

    navToggle.addEventListener("click", function () {
      var expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      primaryNav.classList.toggle("is-open", !expanded);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
        navToggle.setAttribute("aria-expanded", "false");
        primaryNav.classList.remove("is-open");
        navToggle.focus();
      }
    });
  }

  function getSelectedServices(selectedNames) {
    return SERVICES.filter(function (service) {
      return selectedNames.indexOf(service.name) !== -1;
    });
  }

  function initServicesPage() {
    var form = document.getElementById("services-form");
    var tierSelect = document.getElementById("package-tier");
    var budgetInput = document.getElementById("service-budget");
    var budgetError = document.getElementById("budget-error");
    var emailInput = document.getElementById("contact-email");
    var emailError = document.getElementById("email-error");
    var notesInput = document.getElementById("service-notes");
    var selectAllBtn = document.getElementById("select-all-btn");
    var clearSelectionBtn = document.getElementById("clear-selection-btn");
    var clearStorageBtn = document.getElementById("clear-storage-btn");
    var storageStatus = document.getElementById("storage-status");
    var serviceList = document.getElementById("service-list");
    var servicesFieldset = document.getElementById("services-fieldset");
    var servicesError = document.getElementById("services-error");
    var selectionCount = document.getElementById("selection-count");
    var summaryText = document.getElementById("services-summary-text");
    var budgetComparisonText = document.getElementById("budget-comparison-text");

    if (!form || !serviceList) {
      return;
    }

    setupMobileNav();
    var state = loadSavedState();

    function showStatus(message, isError) {
      if (!storageStatus) {
        return;
      }
      storageStatus.textContent = message;
      storageStatus.classList.toggle("status-banner--error", Boolean(isError));
      storageStatus.hidden = false;
    }

    function setFieldError(inputEl, errorEl, message) {
      if (!inputEl || !errorEl) {
        return;
      }
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

    function syncFormFromState() {
      tierSelect.value = state.packageTier;
      budgetInput.value = state.serviceBudget;
      emailInput.value = state.contactEmail;
      notesInput.value = state.serviceNotes;
    }

    function updateSummary() {
      var selectedServices = getSelectedServices(state.selected);
      selectionCount.textContent = selectedServices.length + " of " + SERVICES.length + " selected";

      if (selectedServices.length === 0) {
        summaryText.textContent = "0 services selected. Check any service card to begin.";
        budgetComparisonText.hidden = true;
        budgetComparisonText.textContent = "";
        return;
      }

      var names = selectedServices.map(function (s) { return s.name; }).join(", ");
      var totalEstimate = selectedServices.reduce(function (sum, s) { return sum + s.estimatePkr; }, 0);

      summaryText.textContent =
        selectedServices.length +
        (selectedServices.length === 1 ? " service selected: " : " services selected: ") +
        names +
        " (Illustrative total: " + formatPkr(totalEstimate) + ").";

      var budgetCheck = validateBudget(budgetInput.value);
      if (budgetCheck.valid && budgetCheck.cap !== null) {
        budgetComparisonText.hidden = false;
        if (totalEstimate <= budgetCheck.cap) {
          var remaining = budgetCheck.cap - totalEstimate;
          budgetComparisonText.className = "budget-note budget-note--ok";
          budgetComparisonText.textContent =
            "Within budget cap (" + formatPkr(budgetCheck.cap) + ") — " + formatPkr(remaining) + " remaining.";
        } else {
          var over = totalEstimate - budgetCheck.cap;
          budgetComparisonText.className = "budget-note budget-note--warn";
          budgetComparisonText.textContent =
            "Exceeds budget cap (" + formatPkr(budgetCheck.cap) + ") by " + formatPkr(over) + ".";
        }
      } else {
        budgetComparisonText.hidden = true;
        budgetComparisonText.textContent = "";
      }
    }

    function buildServiceCard(service, isSelected) {
      var article = document.createElement("article");
      article.className = "service-card" + (isSelected ? " service-card--selected" : "");
      article.setAttribute("role", "listitem");

      var media = document.createElement("div");
      media.className = "service-media";
      var img = document.createElement("img");
      img.src = service.image;
      img.alt = service.alt;
      img.width = 320;
      img.height = 180;
      media.appendChild(img);

      var body = document.createElement("div");
      body.className = "service-body";

      var top = document.createElement("div");
      top.className = "service-top";

      var title = document.createElement("h3");
      title.className = "service-title";
      title.textContent = service.name;

      var tag = document.createElement("span");
      tag.className = "service-tag";
      tag.textContent = service.category;

      top.appendChild(title);
      top.appendChild(tag);

      var specs = document.createElement("ul");
      specs.className = "service-specs";
      var priceItem = document.createElement("li");
      var priceLabel = document.createElement("strong");
      priceLabel.textContent = "Illustrative Estimate: ";
      priceItem.appendChild(priceLabel);
      priceItem.appendChild(document.createTextNode(formatPkr(service.estimatePkr)));
      specs.appendChild(priceItem);

      var desc = document.createElement("p");
      desc.className = "service-desc";
      desc.textContent = service.description;

      var incList = document.createElement("ul");
      incList.className = "service-inclusions";
      service.inclusions.forEach(function (inc) {
        var li = document.createElement("li");
        li.textContent = inc;
        incList.appendChild(li);
      });

      var selectLabel = document.createElement("label");
      selectLabel.className = "service-select-label";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "services";
      checkbox.id = "service-" + service.id;
      checkbox.className = "service-checkbox";
      checkbox.value = service.name;
      checkbox.checked = isSelected;
      checkbox.setAttribute("aria-label", "Select " + service.name + " service");

      var selectText = document.createElement("span");
      selectText.textContent = isSelected ? "Selected" : "Select Service";

      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          if (state.selected.indexOf(service.name) === -1) {
            state.selected.push(service.name);
          }
          setFieldError(servicesFieldset, servicesError, "");
        } else {
          state.selected = state.selected.filter(function (name) {
            return name !== service.name;
          });
        }
        // Keep selected array in canonical service order
        state.selected = SERVICE_NAMES.filter(function (name) {
          return state.selected.indexOf(name) !== -1;
        });

        article.classList.toggle("service-card--selected", checkbox.checked);
        selectText.textContent = checkbox.checked ? "Selected" : "Select Service";

        if (validateBudget(budgetInput.value).valid && validateEmail(emailInput.value).valid) {
          saveState(state);
          showStatus(
            "Updated saved services (" + state.selected.length + " selected) in localStorage[\"services\"].",
            false
          );
        }
        updateSummary();
      });

      selectLabel.appendChild(checkbox);
      selectLabel.appendChild(selectText);

      body.appendChild(top);
      body.appendChild(specs);
      body.appendChild(desc);
      body.appendChild(incList);
      body.appendChild(selectLabel);

      article.appendChild(media);
      article.appendChild(body);
      return article;
    }

    function renderServices() {
      serviceList.innerHTML = "";
      SERVICES.forEach(function (service) {
        var isSelected = state.selected.indexOf(service.name) !== -1;
        serviceList.appendChild(buildServiceCard(service, isSelected));
      });
    }

    function validateAndSaveAll() {
      var budgetCheck = validateBudget(budgetInput.value);
      var emailCheck = validateEmail(emailInput.value);
      var hasServices = state.selected.length > 0;

      setFieldError(budgetInput, budgetError, budgetCheck.valid ? "" : budgetCheck.error);
      setFieldError(emailInput, emailError, emailCheck.valid ? "" : emailCheck.error);
      setFieldError(
        servicesFieldset,
        servicesError,
        hasServices ? "" : "Please select at least one wedding service (Catering, Photography, Decoration, Makeup, or Music)."
      );

      if (!budgetCheck.valid) {
        showStatus("Could not save: fix the budget cap field.", true);
        budgetInput.focus();
        return false;
      }
      if (!emailCheck.valid) {
        showStatus("Could not save: fix the coordinator contact email field.", true);
        emailInput.focus();
        return false;
      }
      if (!hasServices) {
        showStatus("Could not save: select at least one wedding service.", true);
        var firstCheckbox = serviceList.querySelector(".service-checkbox");
        if (firstCheckbox) {
          firstCheckbox.focus();
        }
        return false;
      }

      state.packageTier = ALLOWED_TIERS.indexOf(tierSelect.value) !== -1 ? tierSelect.value : "signature";
      state.serviceBudget = budgetInput.value.trim();
      state.contactEmail = emailCheck.email;
      state.serviceNotes = notesInput.value;

      var saved = saveState(state);
      updateSummary();
      if (saved) {
        showStatus(
          "Saved " + state.selected.length + " service" + (state.selected.length === 1 ? "" : "s") + " under localStorage[\"services\"].",
          false
        );
      } else {
        showStatus("Unable to write to localStorage in this browser context.", true);
      }
      return saved;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      validateAndSaveAll();
    });

    budgetInput.addEventListener("input", function () {
      var check = validateBudget(budgetInput.value);
      setFieldError(budgetInput, budgetError, check.valid ? "" : check.error);
      if (check.valid) {
        state.serviceBudget = budgetInput.value.trim();
        saveState(state);
      }
      updateSummary();
    });

    budgetInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        budgetInput.value = "";
        setFieldError(budgetInput, budgetError, "");
        state.serviceBudget = "";
        saveState(state);
        updateSummary();
        showStatus("Service budget cap cleared.", false);
      }
    });

    emailInput.addEventListener("input", function () {
      var check = validateEmail(emailInput.value);
      setFieldError(emailInput, emailError, check.valid ? "" : check.error);
      if (check.valid) {
        state.contactEmail = check.email;
        saveState(state);
      }
    });

    [tierSelect, notesInput].forEach(function (el) {
      el.addEventListener("change", function () {
        state.packageTier = ALLOWED_TIERS.indexOf(tierSelect.value) !== -1 ? tierSelect.value : "signature";
        state.serviceNotes = notesInput.value;
        if (validateBudget(budgetInput.value).valid && validateEmail(emailInput.value).valid) {
          saveState(state);
          showStatus("Updated service plan details in localStorage[\"services\"].", false);
        }
      });
    });

    selectAllBtn.addEventListener("click", function () {
      state.selected = SERVICE_NAMES.slice();
      setFieldError(servicesFieldset, servicesError, "");
      renderServices();
      updateSummary();
      if (validateBudget(budgetInput.value).valid && validateEmail(emailInput.value).valid) {
        saveState(state);
        showStatus("Selected all 5 wedding services and saved to localStorage[\"services\"].", false);
      }
    });

    clearSelectionBtn.addEventListener("click", function () {
      state.selected = [];
      renderServices();
      updateSummary();
      if (validateBudget(budgetInput.value).valid && validateEmail(emailInput.value).valid) {
        saveState(state);
      }
      showStatus("Unchecked all services. Select at least one before saving.", false);
    });

    clearStorageBtn.addEventListener("click", function () {
      state = createDefaultState();
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (_err) {
        // Ignore storage removal errors in restricted environments
      }
      syncFormFromState();
      setFieldError(budgetInput, budgetError, "");
      setFieldError(emailInput, emailError, "");
      setFieldError(servicesFieldset, servicesError, "");
      renderServices();
      updateSummary();
      showStatus("Cleared saved data from localStorage[\"services\"].", false);
    });

    // Initial render & restore
    syncFormFromState();
    var initialBudget = validateBudget(state.serviceBudget);
    if (!initialBudget.valid) {
      state.serviceBudget = "";
      budgetInput.value = "";
    }
    var initialEmail = validateEmail(state.contactEmail);
    if (!initialEmail.valid) {
      state.contactEmail = "";
      emailInput.value = "";
    }
    renderServices();
    updateSummary();
  }

  function initSummarySubpage() {
    var container = document.getElementById("services-summary-details");
    var siblingContainer = document.getElementById("sibling-context-details");
    if (!container) {
      return;
    }

    setupMobileNav();
    var state = loadSavedState();
    var selectedServices = getSelectedServices(state.selected);
    var totalEstimate = selectedServices.reduce(function (sum, s) { return sum + s.estimatePkr; }, 0);

    container.innerHTML = "";

    var metaList = document.createElement("ul");
    metaList.className = "service-specs";
    var items = [
      ["Package Tier", TIER_LABELS[state.packageTier] || state.packageTier],
      ["Service Budget Cap", state.serviceBudget ? formatPkr(state.serviceBudget) : "No cap specified"],
      ["Coordinator Email", state.contactEmail || "Not provided"],
      ["Customization Notes", state.serviceNotes || "None added yet"],
      ["Combined Illustrative Estimate", selectedServices.length > 0 ? formatPkr(totalEstimate) : "PKR 0"]
    ];

    items.forEach(function (pair) {
      var li = document.createElement("li");
      var strong = document.createElement("strong");
      strong.textContent = pair[0] + ": ";
      li.appendChild(strong);
      li.appendChild(document.createTextNode(pair[1]));
      metaList.appendChild(li);
    });
    container.appendChild(metaList);

    var heading = document.createElement("h3");
    heading.textContent = "Checked Services (" + selectedServices.length + ")";
    container.appendChild(heading);

    if (selectedServices.length === 0) {
      var emptyMsg = document.createElement("p");
      emptyMsg.className = "panel-note";
      emptyMsg.textContent = "No services are currently saved under localStorage[\"services\"]. Return to Wedding Services to select options.";
      container.appendChild(emptyMsg);
    } else {
      var grid = document.createElement("div");
      grid.className = "service-grid";
      selectedServices.forEach(function (service) {
        var card = document.createElement("article");
        card.className = "service-card service-card--selected";

        var body = document.createElement("div");
        body.className = "service-body";

        var title = document.createElement("h4");
        title.className = "service-title";
        title.textContent = service.name;

        var specs = document.createElement("p");
        specs.className = "service-desc";
        specs.textContent = service.category + " · " + formatPkr(service.estimatePkr);

        body.appendChild(title);
        body.appendChild(specs);
        card.appendChild(body);
        grid.appendChild(card);
      });
      container.appendChild(grid);
    }

    if (siblingContainer) {
      siblingContainer.innerHTML = "";
      var weddingData = readOptionalJsonKey("wedding");
      var venueData = readOptionalJsonKey("petalPromise_mHassan1_venues");

      var contextList = document.createElement("ul");
      contextList.className = "service-specs";

      var weddingItem = document.createElement("li");
      var weddingLabel = document.createElement("strong");
      weddingLabel.textContent = "Shared wedding key: ";
      weddingItem.appendChild(weddingLabel);
      if (weddingData) {
        var styleText = weddingData.style || "Unset";
        var eventsText = Array.isArray(weddingData.events) && weddingData.events.length > 0
          ? weddingData.events.join(", ")
          : "None";
        weddingItem.appendChild(document.createTextNode(styleText + " (" + eventsText + ")"));
      } else {
        weddingItem.appendChild(document.createTextNode("No saved data found on this origin."));
      }

      var venueItem = document.createElement("li");
      var venueLabel = document.createElement("strong");
      venueLabel.textContent = "M.Hassan 1 venues key: ";
      venueItem.appendChild(venueLabel);
      if (venueData && Array.isArray(venueData.selected) && venueData.selected.length > 0) {
        venueItem.appendChild(document.createTextNode(venueData.selected.join(", ")));
      } else {
        venueItem.appendChild(document.createTextNode("No shortlisted venues found on this origin."));
      }

      contextList.appendChild(weddingItem);
      contextList.appendChild(venueItem);
      siblingContainer.appendChild(contextList);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var pageType = document.body ? document.body.getAttribute("data-page") : "";
    if (pageType === "services") {
      initServicesPage();
    } else if (pageType === "summary") {
      initSummarySubpage();
    }
  });
})();
