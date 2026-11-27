(() => {
  "use strict";

  const STORAGE_KEY = "wedding";
  const VALID_STYLES = new Set(["Eastern", "Western", "Fusion"]);
  const VALID_EVENTS = ["Nikkah", "Mehndi", "Baraat", "Walima", "Reception"];
  const NEXT_PAGE_URL = "../Yusuf 2/index.html";

  /**
   * Read and parse the shared `wedding` object from localStorage.
   * Returns null if missing, malformed, or unavailable.
   */
  function readWeddingStorage() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return null;
      }
      return parsed;
    } catch (_err) {
      return null;
    }
  }

  /**
   * Persist { style, events } under `wedding` while preserving any
   * existing properties added by sibling planner pages.
   */
  function writeWeddingStorage(style, events) {
    const existing = readWeddingStorage() || {};
    const payload = {
      ...existing,
      style,
      events: [...events]
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return { ok: true, payload };
    } catch (err) {
      return {
        ok: false,
        payload,
        error: err && err.message ? err.message : "Unable to access localStorage."
      };
    }
  }

  function getSelectedStyle(form) {
    const checked = form.querySelector('input[name="style"]:checked');
    return checked ? checked.value : "";
  }

  function getSelectedEvents(form) {
    const checkedBoxes = Array.from(form.querySelectorAll('input[name="events"]:checked'));
    const checkedSet = new Set(checkedBoxes.map((box) => box.value));
    return VALID_EVENTS.filter((eventName) => checkedSet.has(eventName));
  }

  function syncChoiceCards(form) {
    const inputs = form.querySelectorAll(".choice-input");
    inputs.forEach((input) => {
      const card = input.closest(".choice-card");
      if (card) {
        card.classList.toggle("is-selected", input.checked);
      }
    });
  }

  function renderPillList(listElement, items, emptyMessage) {
    listElement.textContent = "";
    if (!items || items.length === 0) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "pill-empty";
      emptyItem.textContent = emptyMessage;
      listElement.appendChild(emptyItem);
      return;
    }

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "pill-item";
      li.textContent = item;
      listElement.appendChild(li);
    });
  }

  function validateCustomization(style, events) {
    const styleError = VALID_STYLES.has(style)
      ? ""
      : "Please choose a wedding style: Eastern, Western, or Fusion.";
    const eventsError =
      events.length > 0
        ? ""
        : "Please select at least one wedding event (Nikkah, Mehndi, Baraat, Walima, or Reception).";

    return {
      valid: !styleError && !eventsError,
      styleError,
      eventsError
    };
  }

  function applyFieldError(fieldset, errorEl, message) {
    if (message) {
      fieldset.classList.add("has-error");
      fieldset.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      fieldset.classList.remove("has-error");
      fieldset.removeAttribute("aria-invalid");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  function setBanner(bannerEl, kind, message) {
    if (!message) {
      bannerEl.hidden = true;
      bannerEl.textContent = "";
      bannerEl.className = "feedback-banner";
      return;
    }

    bannerEl.hidden = false;
    bannerEl.textContent = message;
    bannerEl.className =
      kind === "error"
        ? "feedback-banner feedback-error"
        : "feedback-banner feedback-success";
  }

  function initCustomizationPage() {
    const form = document.getElementById("wedding-customization-form");
    if (!form) {
      return;
    }

    const els = {
      styleFieldset: document.getElementById("style-fieldset"),
      eventsFieldset: document.getElementById("events-fieldset"),
      styleError: document.getElementById("style-error"),
      eventsError: document.getElementById("events-error"),
      feedbackBanner: document.getElementById("form-feedback"),
      eventCount: document.getElementById("event-count"),
      summaryStyle: document.getElementById("summary-style"),
      summaryEvents: document.getElementById("summary-events"),
      summaryStatus: document.getElementById("summary-status"),
      storageJson: document.getElementById("storage-json"),
      selectAllBtn: document.getElementById("select-all-events"),
      clearEventsBtn: document.getElementById("clear-events"),
      saveContinueBtn: document.getElementById("save-continue-btn"),
      resetBtn: document.getElementById("reset-btn"),
      yusuf2Link: document.getElementById("yusuf2-link")
    };

    function refreshSummary(statusText) {
      const style = getSelectedStyle(form);
      const events = getSelectedEvents(form);
      const existing = readWeddingStorage() || {};
      const previewPayload = {
        ...existing,
        style: style || null,
        events
      };

      const countLabel = events.length === 1 ? "1 event selected" : `${events.length} events selected`;
      els.eventCount.textContent = countLabel;
      els.summaryStyle.textContent = style || "None selected";
      renderPillList(els.summaryEvents, events, "No events selected yet");
      els.storageJson.textContent = JSON.stringify(previewPayload, null, 2);

      if (statusText) {
        els.summaryStatus.textContent = statusText;
      }
    }

    function restoreSavedSelections() {
      const saved = readWeddingStorage();
      if (!saved) {
        syncChoiceCards(form);
        refreshSummary("Not yet saved");
        return;
      }

      if (typeof saved.style === "string" && VALID_STYLES.has(saved.style)) {
        const targetRadio = form.querySelector(`input[name="style"][value="${saved.style}"]`);
        if (targetRadio) {
          targetRadio.checked = true;
        }
      }

      if (Array.isArray(saved.events)) {
        const savedEventSet = new Set(saved.events);
        form.querySelectorAll('input[name="events"]').forEach((checkbox) => {
          checkbox.checked = savedEventSet.has(checkbox.value);
        });
      }

      syncChoiceCards(form);
      const hasValidSaved =
        typeof saved.style === "string" &&
        VALID_STYLES.has(saved.style) &&
        Array.isArray(saved.events) &&
        saved.events.length > 0;

      refreshSummary(hasValidSaved ? "Restored from localStorage" : "Loaded partial profile");
    }

    function runSave() {
      const style = getSelectedStyle(form);
      const events = getSelectedEvents(form);
      const validation = validateCustomization(style, events);

      applyFieldError(els.styleFieldset, els.styleError, validation.styleError);
      applyFieldError(els.eventsFieldset, els.eventsError, validation.eventsError);

      if (!validation.valid) {
        const bannerMsg = [validation.styleError, validation.eventsError].filter(Boolean).join(" ");
        setBanner(els.feedbackBanner, "error", bannerMsg);

        if (validation.styleError) {
          const firstStyle = form.querySelector('input[name="style"]');
          if (firstStyle) {
            firstStyle.focus();
          }
        } else if (validation.eventsError) {
          const firstEvent = form.querySelector('input[name="events"]');
          if (firstEvent) {
            firstEvent.focus();
          }
        }
        return false;
      }

      const result = writeWeddingStorage(style, events);
      if (!result.ok) {
        setBanner(els.feedbackBanner, "error", `Could not save preferences: ${result.error}`);
        return false;
      }

      setBanner(
        els.feedbackBanner,
        "success",
        `Saved ${style} style with ${events.length} event${events.length === 1 ? "" : "s"} under localStorage["wedding"].`
      );
      refreshSummary("Saved to localStorage");
      return true;
    }

    form.addEventListener("change", (event) => {
      syncChoiceCards(form);
      const style = getSelectedStyle(form);
      const events = getSelectedEvents(form);

      if (event.target && event.target.name === "style" && VALID_STYLES.has(style)) {
        applyFieldError(els.styleFieldset, els.styleError, "");
      }
      if (event.target && event.target.name === "events" && events.length > 0) {
        applyFieldError(els.eventsFieldset, els.eventsError, "");
      }

      if (VALID_STYLES.has(style) && events.length > 0) {
        setBanner(els.feedbackBanner, "", "");
      }

      refreshSummary("Unsaved changes");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      runSave();
    });

    els.saveContinueBtn.addEventListener("click", () => {
      if (runSave()) {
        window.location.href = NEXT_PAGE_URL;
      }
    });

    if (els.yusuf2Link) {
      els.yusuf2Link.addEventListener("click", () => {
        const style = getSelectedStyle(form);
        const events = getSelectedEvents(form);
        if (validateCustomization(style, events).valid) {
          writeWeddingStorage(style, events);
        }
      });
    }

    els.selectAllBtn.addEventListener("click", () => {
      form.querySelectorAll('input[name="events"]').forEach((box) => {
        box.checked = true;
      });
      syncChoiceCards(form);
      applyFieldError(els.eventsFieldset, els.eventsError, "");
      setBanner(els.feedbackBanner, "", "");
      refreshSummary("Unsaved changes");
    });

    els.clearEventsBtn.addEventListener("click", () => {
      form.querySelectorAll('input[name="events"]').forEach((box) => {
        box.checked = false;
      });
      syncChoiceCards(form);
      refreshSummary("Unsaved changes");
    });

    els.resetBtn.addEventListener("click", () => {
      form.querySelectorAll('input[name="style"], input[name="events"]').forEach((input) => {
        input.checked = false;
      });
      syncChoiceCards(form);
      applyFieldError(els.styleFieldset, els.styleError, "");
      applyFieldError(els.eventsFieldset, els.eventsError, "");
      setBanner(els.feedbackBanner, "", "");
      refreshSummary("Form cleared (not saved)");
    });

    restoreSavedSelections();
  }

  function initGuidePage() {
    const styleEl = document.getElementById("guide-style");
    const eventsEl = document.getElementById("guide-events");
    const emptyNotice = document.getElementById("guide-empty-notice");
    const cardsContainer = document.getElementById("guide-cards");
    if (!styleEl || !eventsEl || !cardsContainer) {
      return;
    }

    const saved = readWeddingStorage();
    const savedStyle = saved && typeof saved.style === "string" && VALID_STYLES.has(saved.style) ? saved.style : "";
    const savedEvents =
      saved && Array.isArray(saved.events)
        ? saved.events.filter((ev) => VALID_EVENTS.includes(ev))
        : [];

    if (!savedStyle || savedEvents.length === 0) {
      if (emptyNotice) {
        emptyNotice.hidden = false;
      }
      styleEl.textContent = savedStyle || "Not saved yet";
      renderPillList(eventsEl, savedEvents, "No events saved yet");
      return;
    }

    styleEl.textContent = savedStyle;
    renderPillList(eventsEl, savedEvents, "No events saved yet");

    const eventSet = new Set(savedEvents);
    cardsContainer.querySelectorAll(".guide-item").forEach((card) => {
      const eventName = card.getAttribute("data-event");
      const active = eventSet.has(eventName);
      card.classList.toggle("is-active", active);
      const tag = card.querySelector(".guide-tag");
      if (tag) {
        tag.hidden = !active;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const pageType = document.body ? document.body.getAttribute("data-page") : "";
    if (pageType === "customization") {
      initCustomizationPage();
    } else if (pageType === "guide") {
      initGuidePage();
    }
  });
})();
