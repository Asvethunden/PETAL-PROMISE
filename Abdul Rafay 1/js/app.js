(function () {
  "use strict";

  var STORAGE_KEY = "events";
  var ALLOWED_EVENTS = ["Nikkah", "Mehndi", "Baraat", "Walima", "Reception"];
  var MANAGED_KEYS = {
    selected: true,
    coupleNames: true,
    weddingCity: true,
    startDate: true,
    guestEstimate: true,
    eventNotes: true,
    updatedAt: true
  };

  var ILLUSTRATIVE_SAMPLE = {
    selected: ["Nikkah", "Mehndi", "Baraat", "Walima"],
    coupleNames: "Amina & Zaid (Illustrative)",
    weddingCity: "Lahore",
    startDate: "2027-02-12",
    guestEstimate: "250",
    eventNotes: "Garden Nikkah in ivory and blush, festive Mehndi, formal Baraat, and candlelit Walima."
  };

  function safeReadEvents() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return { selected: filterValidEvents(parsed) };
      }
      if (parsed && typeof parsed === "object") {
        var normalized = {};
        Object.keys(parsed).forEach(function (key) {
          normalized[key] = parsed[key];
        });
        normalized.selected = filterValidEvents(Array.isArray(parsed.selected) ? parsed.selected : []);
        return normalized;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  function filterValidEvents(list) {
    var seen = {};
    return list.filter(function (item) {
      if (typeof item !== "string") {
        return false;
      }
      if (ALLOWED_EVENTS.indexOf(item) === -1 || seen[item]) {
        return false;
      }
      seen[item] = true;
      return true;
    });
  }

  function safeWriteEvents(payload) {
    var existing = safeReadEvents();
    var merged = {};

    if (existing && typeof existing === "object") {
      Object.keys(existing).forEach(function (key) {
        if (!MANAGED_KEYS[key]) {
          merged[key] = existing[key];
        }
      });
    }

    Object.keys(payload).forEach(function (key) {
      merged[key] = payload[key];
    });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  function initNavigation() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  function initEventsPage() {
    var form = document.getElementById("events-form");
    if (!form) {
      return;
    }

    var fieldset = document.getElementById("events-fieldset");
    var checkboxes = Array.prototype.slice.call(form.querySelectorAll('input[name="eventOption"]'));
    var cardButtons = Array.prototype.slice.call(document.querySelectorAll("[data-card-toggle]"));
    var coupleInput = document.getElementById("couple-names");
    var cityInput = document.getElementById("wedding-city");
    var dateInput = document.getElementById("start-date");
    var guestInput = document.getElementById("guest-estimate");
    var notesInput = document.getElementById("event-notes");
    var errorBanner = document.getElementById("form-error");
    var statusBanner = document.getElementById("save-status");
    var loadExampleBtn = document.getElementById("load-example-btn");
    var clearBtn = document.getElementById("clear-events-btn");

    var heroPill = document.getElementById("hero-saved-pill");
    var summaryCount = document.getElementById("summary-count");
    var summaryTags = document.getElementById("summary-tags");
    var summaryCouple = document.getElementById("summary-couple");
    var summaryCity = document.getElementById("summary-city");
    var summaryDate = document.getElementById("summary-date");
    var summaryGuests = document.getElementById("summary-guests");
    var summaryUpdated = document.getElementById("summary-updated");
    var jsonPreview = document.getElementById("json-preview");

    function getCheckedEvents() {
      return checkboxes
        .filter(function (box) {
          return box.checked;
        })
        .map(function (box) {
          return box.value;
        });
    }

    function syncSignatureCards() {
      var checked = getCheckedEvents();
      cardButtons.forEach(function (btn) {
        var eventName = btn.getAttribute("data-card-toggle");
        var isSelected = checked.indexOf(eventName) !== -1;
        var card = btn.closest("[data-event-card]");

        btn.setAttribute("aria-pressed", String(isSelected));
        btn.textContent = isSelected ? "Selected: " + eventName : "Include " + eventName;

        if (card) {
          card.classList.toggle("is-selected", isSelected);
        }
      });

      if (heroPill) {
        var count = checked.length;
        heroPill.textContent = count === 1 ? "1 event selected" : count + " events selected";
      }
    }

    function clearMessages() {
      errorBanner.hidden = true;
      errorBanner.textContent = "";
      statusBanner.hidden = true;
      statusBanner.textContent = "";
      fieldset.classList.remove("has-error");
      fieldset.removeAttribute("aria-invalid");
      guestInput.removeAttribute("aria-invalid");
    }

    function showError(message, focusTarget) {
      statusBanner.hidden = true;
      statusBanner.textContent = "";
      errorBanner.textContent = message;
      errorBanner.hidden = false;
      if (focusTarget && typeof focusTarget.focus === "function") {
        focusTarget.focus();
      }
    }

    function showStatus(message) {
      errorBanner.hidden = true;
      errorBanner.textContent = "";
      statusBanner.textContent = message;
      statusBanner.hidden = false;
    }

    function renderSummary(data) {
      var selected = data && Array.isArray(data.selected) ? data.selected : [];
      summaryCount.textContent = String(selected.length);
      summaryTags.innerHTML = "";

      if (selected.length === 0) {
        var emptyItem = document.createElement("li");
        var hint = document.createElement("span");
        hint.className = "fieldset-hint";
        hint.textContent = "No events saved yet.";
        emptyItem.appendChild(hint);
        summaryTags.appendChild(emptyItem);
      } else {
        selected.forEach(function (evName) {
          var li = document.createElement("li");
          li.className = "summary-tag";
          li.textContent = evName;
          summaryTags.appendChild(li);
        });
      }

      summaryCouple.textContent = data && data.coupleNames ? data.coupleNames : "Not set";
      summaryCity.textContent = data && data.weddingCity ? data.weddingCity : "Not set";
      summaryDate.textContent = data && data.startDate ? data.startDate : "Not set";
      summaryGuests.textContent = data && data.guestEstimate ? String(data.guestEstimate) : "Not set";

      if (data && data.updatedAt) {
        var parsedDate = new Date(data.updatedAt);
        summaryUpdated.textContent = isNaN(parsedDate.getTime())
          ? data.updatedAt
          : parsedDate.toLocaleString();
      } else {
        summaryUpdated.textContent = "Not saved yet";
      }

      jsonPreview.textContent = data ? JSON.stringify(data, null, 2) : "{}";
    }

    function applyDataToForm(data) {
      var selected = data && Array.isArray(data.selected) ? data.selected : [];
      checkboxes.forEach(function (box) {
        box.checked = selected.indexOf(box.value) !== -1;
      });
      coupleInput.value = data && data.coupleNames ? data.coupleNames : "";
      cityInput.value = data && data.weddingCity ? data.weddingCity : "";
      dateInput.value = data && data.startDate ? data.startDate : "";
      guestInput.value = data && data.guestEstimate ? String(data.guestEstimate) : "";
      notesInput.value = data && data.eventNotes ? data.eventNotes : "";
      syncSignatureCards();
    }

    checkboxes.forEach(function (box) {
      box.addEventListener("change", function () {
        if (getCheckedEvents().length > 0) {
          fieldset.classList.remove("has-error");
          fieldset.removeAttribute("aria-invalid");
          errorBanner.hidden = true;
        }
        syncSignatureCards();
      });
    });

    cardButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var eventName = btn.getAttribute("data-card-toggle");
        var matchingBox = checkboxes.find(function (box) {
          return box.value === eventName;
        });
        if (!matchingBox) {
          return;
        }
        matchingBox.checked = !matchingBox.checked;
        matchingBox.dispatchEvent(new Event("change", { bubbles: true }));
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearMessages();

      var selected = getCheckedEvents();
      if (selected.length === 0) {
        fieldset.classList.add("has-error");
        fieldset.setAttribute("aria-invalid", "true");
        showError("Please select at least one wedding event (for example Nikkah, Mehndi, Baraat, Walima, or Reception) before saving.", checkboxes[0]);
        return;
      }

      var rawGuests = guestInput.value.trim();
      if (rawGuests !== "") {
        var guestNum = Number(rawGuests);
        if (!Number.isInteger(guestNum) || guestNum < 1 || guestNum > 50000) {
          guestInput.setAttribute("aria-invalid", "true");
          showError("Estimated guests must be a whole number between 1 and 50,000.", guestInput);
          return;
        }
      }

      var payload = {
        selected: selected,
        coupleNames: coupleInput.value.trim(),
        weddingCity: cityInput.value.trim(),
        startDate: dateInput.value,
        guestEstimate: rawGuests,
        eventNotes: notesInput.value.trim(),
        updatedAt: new Date().toISOString()
      };

      var saved = safeWriteEvents(payload);
      renderSummary(saved);
      showStatus("Saved " + selected.length + " event(s) to localStorage under \"events\".");
    });

    if (loadExampleBtn) {
      loadExampleBtn.addEventListener("click", function () {
        clearMessages();
        applyDataToForm(ILLUSTRATIVE_SAMPLE);
        showStatus("Illustrative example loaded into the form. Click \"Save Events\" to store it.");
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        clearMessages();
        try {
          var existing = safeReadEvents();
          var preserved = {};
          var hasPreserved = false;
          if (existing && typeof existing === "object") {
            Object.keys(existing).forEach(function (key) {
              if (!MANAGED_KEYS[key]) {
                preserved[key] = existing[key];
                hasPreserved = true;
              }
            });
          }
          if (hasPreserved) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preserved));
          } else {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        } catch (err) {
          // Ignore storage removal errors in restricted environments
        }
        applyDataToForm(null);
        renderSummary(null);
        showStatus("Cleared saved wedding event selections.");
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && (!errorBanner.hidden || !statusBanner.hidden)) {
        clearMessages();
      }
    });

    var initialData = safeReadEvents();
    applyDataToForm(initialData);
    renderSummary(initialData);
  }

  function initGuidePage() {
    var summaryEl = document.getElementById("guide-saved-summary");
    if (!summaryEl) {
      return;
    }

    var saved = safeReadEvents();
    var selected = saved && Array.isArray(saved.selected) ? saved.selected : [];
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-guide-event]"));

    cards.forEach(function (card) {
      var evName = card.getAttribute("data-guide-event");
      var badge = card.querySelector(".planned-badge");
      var isPlanned = selected.indexOf(evName) !== -1;

      card.classList.toggle("is-planned", isPlanned);
      if (badge) {
        badge.hidden = !isPlanned;
      }
    });

    if (selected.length > 0) {
      summaryEl.textContent = "Currently planned events (" + selected.length + "): " + selected.join(", ") + ".";
    } else {
      summaryEl.textContent = "No events saved yet. Return to Wedding Events to select at least one celebration.";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initEventsPage();
    initGuidePage();
  });
})();
