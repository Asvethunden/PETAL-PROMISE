(function () {
  "use strict";

  var STORAGE_KEY = "petalPromise_mHassan1_venues";

  // Sample illustrative venue data required for M.Hassan 1
  var VENUES = [
    {
      id: "garden-pavilion",
      name: "Garden Pavilion",
      capacity: 250,
      pricePkr: 250000,
      ambience: "Outdoor Garden",
      image: "images/venue-garden.svg",
      alt: "Botanical illustration of Garden Pavilion floral arch and sage lawn",
      description: "Open-air lawn framed by rose trellises and evening fairy-light canopies."
    },
    {
      id: "rose-banquet",
      name: "Rose Banquet",
      capacity: 500,
      pricePkr: 400000,
      ambience: "Grand Banquet Hall",
      image: "images/venue-banquet.svg",
      alt: "Illustration of Rose Banquet ballroom with chandeliers and round dining tables",
      description: "Spacious air-conditioned ballroom suited for large receptions and formal dining."
    },
    {
      id: "ivory-hall",
      name: "Ivory Hall",
      capacity: 150,
      pricePkr: 180000,
      ambience: "Intimate Heritage Hall",
      image: "images/venue-ivory.svg",
      alt: "Illustration of Ivory Hall arched interior with blush floral accents",
      description: "Warm indoor hall tailored for intimate nikah, mehndi, and family gatherings."
    }
  ];

  function formatPkr(amount) {
    return "PKR " + Number(amount).toLocaleString("en-PK");
  }

  function createDefaultState() {
    return {
      guestCount: "",
      eventDate: "",
      preferredStyle: "any",
      plannerNotes: "",
      selected: []
    };
  }

  function loadSavedState() {
    var fallback = createDefaultState();
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return fallback;
      }
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") {
        return fallback;
      }
      var validIds = VENUES.map(function (v) { return v.id; });
      var cleanSelected = Array.isArray(parsed.selected)
        ? parsed.selected.filter(function (id) { return validIds.indexOf(id) !== -1; })
        : [];

      return {
        guestCount: typeof parsed.guestCount === "string" ? parsed.guestCount : "",
        eventDate: typeof parsed.eventDate === "string" ? parsed.eventDate : "",
        preferredStyle: typeof parsed.preferredStyle === "string" ? parsed.preferredStyle : "any",
        plannerNotes: typeof parsed.plannerNotes === "string" ? parsed.plannerNotes : "",
        selected: cleanSelected
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

  function validateGuestCount(rawValue) {
    var trimmed = String(rawValue || "").trim();
    if (trimmed === "") {
      return { valid: true, minGuests: null, error: "" };
    }
    if (!/^\d+$/.test(trimmed)) {
      return {
        valid: false,
        minGuests: null,
        error: "Please enter a valid positive whole number of guests (e.g., 150)."
      };
    }
    var count = Number(trimmed);
    if (!Number.isSafeInteger(count) || count <= 0) {
      return {
        valid: false,
        minGuests: null,
        error: "Guest count must be greater than 0."
      };
    }
    return { valid: true, minGuests: count, error: "" };
  }

  function initVenuesPage() {
    var form = document.getElementById("venue-filter-form");
    var guestInput = document.getElementById("guest-count");
    var guestError = document.getElementById("guest-error");
    var dateInput = document.getElementById("event-date");
    var styleSelect = document.getElementById("preferred-style");
    var notesInput = document.getElementById("planner-notes");
    var resetBtn = document.getElementById("reset-filter-btn");
    var emptyResetBtn = document.getElementById("empty-reset-btn");
    var clearStorageBtn = document.getElementById("clear-storage-btn");
    var storageStatus = document.getElementById("storage-status");
    var venueList = document.getElementById("venue-list");
    var emptyState = document.getElementById("empty-state");
    var emptyStateMessage = document.getElementById("empty-state-message");
    var resultsCount = document.getElementById("results-count");
    var shortlistSummaryText = document.getElementById("shortlist-summary-text");
    var navToggle = document.getElementById("nav-toggle");
    var primaryNav = document.getElementById("primary-nav");

    if (!venueList || !form) {
      return;
    }

    var state = loadSavedState();

    function showStatus(message) {
      if (!storageStatus) {
        return;
      }
      storageStatus.textContent = message;
      storageStatus.hidden = false;
    }

    function setValidationError(message) {
      if (message) {
        guestInput.setAttribute("aria-invalid", "true");
        guestError.textContent = message;
        guestError.hidden = false;
      } else {
        guestInput.removeAttribute("aria-invalid");
        guestError.textContent = "";
        guestError.hidden = true;
      }
    }

    function syncFormFromState() {
      guestInput.value = state.guestCount;
      dateInput.value = state.eventDate;
      styleSelect.value = state.preferredStyle;
      notesInput.value = state.plannerNotes;
    }

    function updateSummaryText() {
      if (!shortlistSummaryText) {
        return;
      }
      if (state.selected.length === 0) {
        shortlistSummaryText.textContent = "0 venues selected. Check any venue card to save it.";
        return;
      }
      var selectedVenues = VENUES.filter(function (v) {
        return state.selected.indexOf(v.id) !== -1;
      });
      var names = selectedVenues.map(function (v) { return v.name; }).join(", ");
      var totalEstimate = selectedVenues.reduce(function (sum, v) { return sum + v.pricePkr; }, 0);
      shortlistSummaryText.textContent =
        selectedVenues.length +
        (selectedVenues.length === 1 ? " venue selected: " : " venues selected: ") +
        names +
        " (Combined estimate: " + formatPkr(totalEstimate) + ").";
    }

    function buildVenueCard(venue, isSelected) {
      var article = document.createElement("article");
      article.className = "venue-card" + (isSelected ? " venue-card--selected" : "");
      article.setAttribute("role", "listitem");

      var media = document.createElement("div");
      media.className = "venue-media";
      var img = document.createElement("img");
      img.src = venue.image;
      img.alt = venue.alt;
      img.width = 320;
      img.height = 180;
      media.appendChild(img);

      var body = document.createElement("div");
      body.className = "venue-body";

      var top = document.createElement("div");
      top.className = "venue-top";

      var title = document.createElement("h3");
      title.className = "venue-title";
      title.textContent = venue.name;

      var tag = document.createElement("span");
      tag.className = "venue-tag";
      tag.textContent = venue.ambience;

      top.appendChild(title);
      top.appendChild(tag);

      var specs = document.createElement("ul");
      specs.className = "venue-specs";

      var capItem = document.createElement("li");
      var capLabel = document.createElement("strong");
      capLabel.textContent = "Capacity: ";
      capItem.appendChild(capLabel);
      capItem.appendChild(document.createTextNode(venue.capacity + " guests"));

      var priceItem = document.createElement("li");
      var priceLabel = document.createElement("strong");
      priceLabel.textContent = "Estimate: ";
      priceItem.appendChild(priceLabel);
      priceItem.appendChild(document.createTextNode(formatPkr(venue.pricePkr)));

      specs.appendChild(capItem);
      specs.appendChild(priceItem);

      var desc = document.createElement("p");
      desc.className = "venue-desc";
      desc.textContent = venue.description;

      var selectLabel = document.createElement("label");
      selectLabel.className = "venue-select-label";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "venue-checkbox";
      checkbox.value = venue.id;
      checkbox.checked = isSelected;
      checkbox.setAttribute("aria-label", "Select " + venue.name + " for venue shortlist");

      checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
          if (state.selected.indexOf(venue.id) === -1) {
            state.selected.push(venue.id);
          }
          article.classList.add("venue-card--selected");
        } else {
          state.selected = state.selected.filter(function (id) { return id !== venue.id; });
          article.classList.remove("venue-card--selected");
        }
        saveState(state);
        updateSummaryText();
        showStatus("Saved shortlist selection (" + state.selected.length + " selected).");
      });

      var selectText = document.createElement("span");
      selectText.textContent = isSelected ? "Shortlisted" : "Select Venue";

      checkbox.addEventListener("change", function () {
        selectText.textContent = checkbox.checked ? "Shortlisted" : "Select Venue";
      });

      selectLabel.appendChild(checkbox);
      selectLabel.appendChild(selectText);

      body.appendChild(top);
      body.appendChild(specs);
      body.appendChild(desc);
      body.appendChild(selectLabel);

      article.appendChild(media);
      article.appendChild(body);
      return article;
    }

    function renderVenues(minGuests) {
      var filtered = minGuests === null
        ? VENUES.slice()
        : VENUES.filter(function (venue) {
            return venue.capacity >= minGuests;
          });

      venueList.innerHTML = "";

      if (filtered.length === 0) {
        emptyState.hidden = false;
        emptyStateMessage.textContent =
          "No sample venues can accommodate " + minGuests + " guests. Maximum capacity available is 500 guests (Rose Banquet).";
        resultsCount.textContent = "Showing 0 of " + VENUES.length + " venues";
        return;
      }

      emptyState.hidden = true;
      resultsCount.textContent = "Showing " + filtered.length + " of " + VENUES.length + " venues";

      filtered.forEach(function (venue) {
        var isSelected = state.selected.indexOf(venue.id) !== -1;
        venueList.appendChild(buildVenueCard(venue, isSelected));
      });
    }

    function applyFilterAndPersist(persistEvenIfUnchanged) {
      var validation = validateGuestCount(guestInput.value);
      if (!validation.valid) {
        setValidationError(validation.error);
        resultsCount.textContent = "Filter paused — enter a positive guest count";
        return false;
      }

      setValidationError("");
      state.guestCount = guestInput.value.trim();
      state.eventDate = dateInput.value;
      state.preferredStyle = styleSelect.value;
      state.plannerNotes = notesInput.value;

      renderVenues(validation.minGuests);
      updateSummaryText();

      if (persistEvenIfUnchanged) {
        var saved = saveState(state);
        if (saved) {
          showStatus(
            validation.minGuests === null
              ? "Venue plan saved to localStorage (showing all venues)."
              : "Filtered for " + validation.minGuests + "+ guests and saved to localStorage."
          );
        }
      }
      return true;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var ok = applyFilterAndPersist(true);
      if (!ok) {
        guestInput.focus();
      }
    });

    guestInput.addEventListener("input", function () {
      var validation = validateGuestCount(guestInput.value);
      if (!validation.valid) {
        setValidationError(validation.error);
        return;
      }
      setValidationError("");
      state.guestCount = guestInput.value.trim();
      renderVenues(validation.minGuests);
      saveState(state);
    });

    guestInput.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        guestInput.value = "";
        setValidationError("");
        state.guestCount = "";
        renderVenues(null);
        saveState(state);
        showStatus("Guest filter cleared.");
      }
    });

    [dateInput, styleSelect, notesInput].forEach(function (el) {
      el.addEventListener("change", function () {
        state.eventDate = dateInput.value;
        state.preferredStyle = styleSelect.value;
        state.plannerNotes = notesInput.value;
        saveState(state);
        showStatus("Updated venue planning details in localStorage.");
      });
    });

    function resetFilterOnly() {
      guestInput.value = "";
      setValidationError("");
      state.guestCount = "";
      renderVenues(null);
      saveState(state);
      showStatus("Guest filter reset to show all 3 venues.");
      guestInput.focus();
    }

    resetBtn.addEventListener("click", resetFilterOnly);
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener("click", resetFilterOnly);
    }

    clearStorageBtn.addEventListener("click", function () {
      state = createDefaultState();
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (_err) {
        // Ignore storage removal errors in restricted environments
      }
      syncFormFromState();
      setValidationError("");
      renderVenues(null);
      updateSummaryText();
      showStatus("Cleared saved venue data from localStorage.");
    });

    if (navToggle && primaryNav) {
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

    // Initial render
    syncFormFromState();
    var initialValidation = validateGuestCount(state.guestCount);
    if (initialValidation.valid) {
      renderVenues(initialValidation.minGuests);
    } else {
      state.guestCount = "";
      syncFormFromState();
      renderVenues(null);
    }
    updateSummaryText();
  }

  function initShortlistSubpage() {
    var container = document.getElementById("shortlist-details");
    if (!container) {
      return;
    }
    var state = loadSavedState();
    var navToggle = document.getElementById("nav-toggle");
    var primaryNav = document.getElementById("primary-nav");

    if (navToggle && primaryNav) {
      navToggle.addEventListener("click", function () {
        var expanded = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!expanded));
        primaryNav.classList.toggle("is-open", !expanded);
      });
    }

    var selectedVenues = VENUES.filter(function (v) {
      return state.selected.indexOf(v.id) !== -1;
    });

    container.innerHTML = "";

    var metaList = document.createElement("ul");
    metaList.className = "venue-specs";
    var items = [
      ["Minimum Guest Filter", state.guestCount ? state.guestCount + " guests" : "Not specified (all capacities)"],
      ["Target Event Date", state.eventDate || "Not selected yet"],
      ["Preferred Ambience", state.preferredStyle || "any"],
      ["Planner Notes", state.plannerNotes || "None added yet"]
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
    heading.textContent = "Checked Venues (" + selectedVenues.length + ")";
    container.appendChild(heading);

    if (selectedVenues.length === 0) {
      var emptyMsg = document.createElement("p");
      emptyMsg.className = "panel-note";
      emptyMsg.textContent = "No venues are currently shortlisted. Return to the Wedding Venues page to select venues.";
      container.appendChild(emptyMsg);
      return;
    }

    var grid = document.createElement("div");
    grid.className = "venue-grid";
    selectedVenues.forEach(function (v) {
      var card = document.createElement("article");
      card.className = "venue-card venue-card--selected";

      var body = document.createElement("div");
      body.className = "venue-body";

      var title = document.createElement("h4");
      title.className = "venue-title";
      title.textContent = v.name;

      var specs = document.createElement("p");
      specs.className = "venue-desc";
      specs.textContent = v.capacity + " guests · " + formatPkr(v.pricePkr) + " · " + v.ambience;

      body.appendChild(title);
      body.appendChild(specs);
      card.appendChild(body);
      grid.appendChild(card);
    });
    container.appendChild(grid);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initVenuesPage();
    initShortlistSubpage();
  });
})();
