(() => {
  "use strict";

  const BUDGET_STORAGE_KEY = "budget";
  const WEDDING_STORAGE_KEY = "wedding";
  const VALID_PRIORITIES = new Set(["Catering", "Venue", "Decor"]);
  const NEXT_PAGE_URL = "../Yusuf 3/index.html";

  const ILLUSTRATIVE_SHARES = {
    Catering: { Catering: 50, Venue: 30, Decor: 20 },
    Venue: { Catering: 30, Venue: 50, Decor: 20 },
    Decor: { Catering: 30, Venue: 25, Decor: 45 }
  };

  function readJsonStorage(key) {
    try {
      const raw = window.localStorage.getItem(key);
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

  function writeBudgetStorage(budget, guests, priority) {
    const existing = readJsonStorage(BUDGET_STORAGE_KEY) || {};
    const payload = {
      ...existing,
      budget,
      guests,
      priority
    };

    try {
      window.localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(payload));
      return { ok: true, payload };
    } catch (err) {
      return {
        ok: false,
        payload,
        error: err && err.message ? err.message : "Unable to access localStorage."
      };
    }
  }

  function parsePositiveFiniteBudget(rawValue) {
    const trimmed = String(rawValue ?? "").trim();
    if (!trimmed) {
      return { valid: false, value: null, error: "Please enter a total wedding budget in PKR." };
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return {
        valid: false,
        value: null,
        error: "Budget must be a positive finite PKR number greater than 0."
      };
    }
    return { valid: true, value: parsed, error: "" };
  }

  function parsePositiveIntegerGuests(rawValue) {
    const trimmed = String(rawValue ?? "").trim();
    if (!trimmed) {
      return { valid: false, value: null, error: "Please enter the expected number of guests." };
    }
    if (!/^[+]?\d+$/.test(trimmed)) {
      return {
        valid: false,
        value: null,
        error: "Guests must be a positive whole integer (no decimals or letters)."
      };
    }
    const parsed = Number(trimmed);
    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
      return {
        valid: false,
        value: null,
        error: "Guests must be a positive whole integer greater than 0."
      };
    }
    return { valid: true, value: parsed, error: "" };
  }

  function formatPkr(amount, allowDecimals) {
    const options = allowDecimals
      ? { minimumFractionDigits: 0, maximumFractionDigits: 2 }
      : { maximumFractionDigits: 0 };
    return `PKR ${new Intl.NumberFormat("en-US", options).format(amount)}`;
  }

  function formatInteger(count) {
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(count);
  }

  function getSelectedPriority(form) {
    const checked = form.querySelector('input[name="priority"]:checked');
    return checked ? checked.value : "";
  }

  function syncChoiceCards(form) {
    form.querySelectorAll(".choice-input").forEach((input) => {
      const card = input.closest(".choice-card");
      if (card) {
        card.classList.toggle("is-selected", input.checked);
      }
    });
  }

  function applyFieldError(containerEl, inputOrFieldset, errorEl, message) {
    if (message) {
      containerEl.classList.add("has-error");
      inputOrFieldset.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      containerEl.classList.remove("has-error");
      inputOrFieldset.removeAttribute("aria-invalid");
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

  function validateAll(budgetRaw, guestsRaw, priority) {
    const budgetCheck = parsePositiveFiniteBudget(budgetRaw);
    const guestsCheck = parsePositiveIntegerGuests(guestsRaw);
    const priorityError = VALID_PRIORITIES.has(priority)
      ? ""
      : "Please select a top priority: Catering, Venue, or Decor.";

    return {
      valid: budgetCheck.valid && guestsCheck.valid && !priorityError,
      budgetCheck,
      guestsCheck,
      priorityError
    };
  }

  function initCalculatorPage() {
    const form = document.getElementById("budget-calculator-form");
    if (!form) {
      return;
    }

    const els = {
      budgetGroup: document.getElementById("budget-group"),
      guestsGroup: document.getElementById("guests-group"),
      priorityFieldset: document.getElementById("priority-fieldset"),
      budgetInput: document.getElementById("budget-input"),
      guestsInput: document.getElementById("guests-input"),
      budgetError: document.getElementById("budget-error"),
      guestsError: document.getElementById("guests-error"),
      priorityError: document.getElementById("priority-error"),
      feedbackBanner: document.getElementById("form-feedback"),
      perGuestValue: document.getElementById("per-guest-value"),
      perGuestFormula: document.getElementById("per-guest-formula"),
      summaryBudget: document.getElementById("summary-budget"),
      summaryGuests: document.getElementById("summary-guests"),
      summaryPriority: document.getElementById("summary-priority"),
      summaryStatus: document.getElementById("summary-status"),
      storageJson: document.getElementById("storage-json"),
      weddingContextRow: document.getElementById("wedding-context-row"),
      weddingContext: document.getElementById("wedding-context"),
      saveContinueBtn: document.getElementById("save-continue-btn"),
      resetBtn: document.getElementById("reset-btn"),
      yusuf3Link: document.getElementById("yusuf3-link")
    };

    function renderWeddingContext() {
      const wedding = readJsonStorage(WEDDING_STORAGE_KEY);
      if (!wedding || (!wedding.style && (!Array.isArray(wedding.events) || wedding.events.length === 0))) {
        els.weddingContextRow.hidden = true;
        return;
      }

      const parts = [];
      if (typeof wedding.style === "string" && wedding.style) {
        parts.push(wedding.style);
      }
      if (Array.isArray(wedding.events) && wedding.events.length > 0) {
        parts.push(wedding.events.join(", "));
      }

      els.weddingContext.textContent = parts.join(" · ");
      els.weddingContextRow.hidden = false;
    }

    function refreshSummary(statusText) {
      const budgetCheck = parsePositiveFiniteBudget(els.budgetInput.value);
      const guestsCheck = parsePositiveIntegerGuests(els.guestsInput.value);
      const priority = getSelectedPriority(form);
      const existing = readJsonStorage(BUDGET_STORAGE_KEY) || {};

      if (budgetCheck.valid && guestsCheck.valid) {
        const perGuest = budgetCheck.value / guestsCheck.value;
        els.perGuestValue.textContent = formatPkr(perGuest, true);
        els.perGuestFormula.textContent =
          `${formatPkr(budgetCheck.value, true)} ÷ ${formatInteger(guestsCheck.value)} guests = ${formatPkr(perGuest, true)} / guest`;
      } else {
        els.perGuestValue.textContent = "--";
        els.perGuestFormula.textContent = "Enter a valid PKR budget and whole-number guest count to calculate.";
      }

      els.summaryBudget.textContent = budgetCheck.valid ? formatPkr(budgetCheck.value, true) : "Not entered";
      els.summaryGuests.textContent = guestsCheck.valid ? `${formatInteger(guestsCheck.value)} guests` : "Not entered";
      els.summaryPriority.textContent = priority || "None selected";

      const previewPayload = {
        ...existing,
        budget: budgetCheck.valid ? budgetCheck.value : null,
        guests: guestsCheck.valid ? guestsCheck.value : null,
        priority: VALID_PRIORITIES.has(priority) ? priority : null
      };
      els.storageJson.textContent = JSON.stringify(previewPayload, null, 2);

      if (statusText) {
        els.summaryStatus.textContent = statusText;
      }
    }

    function restoreSavedBudget() {
      const saved = readJsonStorage(BUDGET_STORAGE_KEY);
      if (!saved) {
        syncChoiceCards(form);
        refreshSummary("Not yet saved");
        return;
      }

      const hasBudget = Number.isFinite(saved.budget) && saved.budget > 0;
      const hasGuests = Number.isSafeInteger(saved.guests) && saved.guests > 0;
      const hasPriority = typeof saved.priority === "string" && VALID_PRIORITIES.has(saved.priority);

      if (hasBudget) {
        els.budgetInput.value = String(saved.budget);
      }
      if (hasGuests) {
        els.guestsInput.value = String(saved.guests);
      }
      if (hasPriority) {
        const radio = form.querySelector(`input[name="priority"][value="${saved.priority}"]`);
        if (radio) {
          radio.checked = true;
        }
      }

      syncChoiceCards(form);
      refreshSummary(hasBudget && hasGuests && hasPriority ? "Restored from localStorage" : "Loaded partial profile");
    }

    function runSave() {
      const priority = getSelectedPriority(form);
      const validation = validateAll(els.budgetInput.value, els.guestsInput.value, priority);

      applyFieldError(els.budgetGroup, els.budgetInput, els.budgetError, validation.budgetCheck.error);
      applyFieldError(els.guestsGroup, els.guestsInput, els.guestsError, validation.guestsCheck.error);
      applyFieldError(els.priorityFieldset, els.priorityFieldset, els.priorityError, validation.priorityError);

      if (!validation.valid) {
        const messages = [
          validation.budgetCheck.error,
          validation.guestsCheck.error,
          validation.priorityError
        ].filter(Boolean);
        setBanner(els.feedbackBanner, "error", messages.join(" "));

        if (!validation.budgetCheck.valid) {
          els.budgetInput.focus();
        } else if (!validation.guestsCheck.valid) {
          els.guestsInput.focus();
        } else {
          const firstPriority = form.querySelector('input[name="priority"]');
          if (firstPriority) {
            firstPriority.focus();
          }
        }
        return false;
      }

      const budget = validation.budgetCheck.value;
      const guests = validation.guestsCheck.value;
      const result = writeBudgetStorage(budget, guests, priority);
      if (!result.ok) {
        setBanner(els.feedbackBanner, "error", `Could not save budget: ${result.error}`);
        return false;
      }

      const perGuest = budget / guests;
      setBanner(
        els.feedbackBanner,
        "success",
        `Saved ${formatPkr(budget, true)} for ${formatInteger(guests)} guests (${formatPkr(perGuest, true)} / guest, priority: ${priority}) under localStorage["budget"].`
      );
      refreshSummary("Saved to localStorage");
      return true;
    }

    form.addEventListener("input", (event) => {
      if (event.target === els.budgetInput) {
        const check = parsePositiveFiniteBudget(els.budgetInput.value);
        if (check.valid) {
          applyFieldError(els.budgetGroup, els.budgetInput, els.budgetError, "");
        }
      }
      if (event.target === els.guestsInput) {
        const check = parsePositiveIntegerGuests(els.guestsInput.value);
        if (check.valid) {
          applyFieldError(els.guestsGroup, els.guestsInput, els.guestsError, "");
        }
      }
      refreshSummary("Unsaved changes");
    });

    form.addEventListener("change", (event) => {
      syncChoiceCards(form);
      if (event.target && event.target.name === "priority" && VALID_PRIORITIES.has(event.target.value)) {
        applyFieldError(els.priorityFieldset, els.priorityFieldset, els.priorityError, "");
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

    if (els.yusuf3Link) {
      els.yusuf3Link.addEventListener("click", () => {
        const validation = validateAll(els.budgetInput.value, els.guestsInput.value, getSelectedPriority(form));
        if (validation.valid) {
          writeBudgetStorage(
            validation.budgetCheck.value,
            validation.guestsCheck.value,
            getSelectedPriority(form)
          );
        }
      });
    }

    form.querySelectorAll(".budget-preset").forEach((btn) => {
      btn.addEventListener("click", () => {
        els.budgetInput.value = btn.getAttribute("data-budget") || "";
        applyFieldError(els.budgetGroup, els.budgetInput, els.budgetError, "");
        refreshSummary("Unsaved changes");
      });
    });

    form.querySelectorAll(".guests-preset").forEach((btn) => {
      btn.addEventListener("click", () => {
        els.guestsInput.value = btn.getAttribute("data-guests") || "";
        applyFieldError(els.guestsGroup, els.guestsInput, els.guestsError, "");
        refreshSummary("Unsaved changes");
      });
    });

    els.resetBtn.addEventListener("click", () => {
      els.budgetInput.value = "";
      els.guestsInput.value = "";
      form.querySelectorAll('input[name="priority"]').forEach((radio) => {
        radio.checked = false;
      });
      syncChoiceCards(form);
      applyFieldError(els.budgetGroup, els.budgetInput, els.budgetError, "");
      applyFieldError(els.guestsGroup, els.guestsInput, els.guestsError, "");
      applyFieldError(els.priorityFieldset, els.priorityFieldset, els.priorityError, "");
      setBanner(els.feedbackBanner, "", "");
      refreshSummary("Form cleared (not saved)");
    });

    renderWeddingContext();
    restoreSavedBudget();
  }

  function initBreakdownPage() {
    const perGuestEl = document.getElementById("breakdown-per-guest");
    const formulaEl = document.getElementById("breakdown-formula");
    const priorityEl = document.getElementById("breakdown-priority");
    const emptyNotice = document.getElementById("breakdown-empty-notice");
    const listEl = document.getElementById("allocation-list");
    if (!perGuestEl || !formulaEl || !priorityEl || !listEl) {
      return;
    }

    const saved = readJsonStorage(BUDGET_STORAGE_KEY);
    const hasBudget = saved && Number.isFinite(saved.budget) && saved.budget > 0;
    const hasGuests = saved && Number.isSafeInteger(saved.guests) && saved.guests > 0;
    const hasPriority = saved && typeof saved.priority === "string" && VALID_PRIORITIES.has(saved.priority);

    if (!hasBudget || !hasGuests || !hasPriority) {
      if (emptyNotice) {
        emptyNotice.hidden = false;
      }
      return;
    }

    const perGuest = saved.budget / saved.guests;
    perGuestEl.textContent = formatPkr(perGuest, true);
    formulaEl.textContent =
      `${formatPkr(saved.budget, true)} ÷ ${formatInteger(saved.guests)} guests = ${formatPkr(perGuest, true)} / guest`;
    priorityEl.textContent = saved.priority;

    const weights = ILLUSTRATIVE_SHARES[saved.priority];
    listEl.querySelectorAll(".allocation-card").forEach((card) => {
      const category = card.getAttribute("data-category");
      const pct = weights[category] || 0;
      const amount = (saved.budget * pct) / 100;
      const isPriority = category === saved.priority;

      card.classList.toggle("is-priority", isPriority);
      const amtEl = card.querySelector("[data-amount]");
      const barEl = card.querySelector("[data-bar]");
      const shareEl = card.querySelector("[data-share]");

      if (amtEl) {
        amtEl.textContent = formatPkr(amount, true);
      }
      if (barEl) {
        barEl.style.width = `${pct}%`;
      }
      if (shareEl) {
        shareEl.textContent = `Illustrative share: ${pct}%${isPriority ? " (Top Priority)" : ""}`;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const pageType = document.body ? document.body.getAttribute("data-page") : "";
    if (pageType === "calculator") {
      initCalculatorPage();
    } else if (pageType === "breakdown") {
      initBreakdownPage();
    }
  });
})();
