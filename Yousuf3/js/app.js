(function () {
  "use strict";

  const WEDDING_KEY = "wedding";
  const BUDGET_KEY = "budget";
  const PLAN_KEY = "weddingPlan";

  const CATEGORY_COLORS = {
    catering: "#D49AA8",
    venue: "#A3AC96",
    decoration: "#B98392",
    photography: "#7D8970",
    emergency: "#554A45"
  };

  const navToggle = document.getElementById("nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  const emptyState = document.getElementById("empty-state");
  const dashboardContent = document.getElementById("dashboard-content");
  const overBudgetWarning = document.getElementById("over-budget-warning");
  const saveStatusBanner = document.getElementById("save-status-banner");
  const planStatusBadge = document.getElementById("plan-status-badge");

  const dashStyle = document.getElementById("dash-style");
  const dashEvents = document.getElementById("dash-events");
  const dashGuests = document.getElementById("dash-guests");
  const dashPriority = document.getElementById("dash-priority");
  const dashTotalBudget = document.getElementById("dash-total-budget");
  const dashPerGuest = document.getElementById("dash-per-guest");
  const dashCeremonies = document.getElementById("dash-ceremonies");

  const donutSegments = document.getElementById("donut-segments");
  const donutCenterLabel = document.getElementById("donut-center-label");
  const donutCenterValue = document.getElementById("donut-center-value");
  const donutCenterSub = document.getElementById("donut-center-sub");
  const chartLegend = document.getElementById("chart-legend");

  const allocationRows = document.getElementById("allocation-rows");
  const restoreCalcBtn = document.getElementById("restore-calc-btn");
  const totalsBudget = document.getElementById("totals-budget");
  const totalsAllocated = document.getElementById("totals-allocated");
  const totalsRemaining = document.getElementById("totals-remaining");
  const remainingRow = document.getElementById("remaining-row");

  const savePlanBtn = document.getElementById("save-plan-btn");
  const printPlanBtn = document.getElementById("print-plan-btn");
  const downloadPlanBtn = document.getElementById("download-plan-btn");
  const resetPlanBtn = document.getElementById("reset-plan-btn");

  const resetModal = document.getElementById("reset-modal");
  const cancelResetBtn = document.getElementById("cancel-reset-btn");
  const confirmResetBtn = document.getElementById("confirm-reset-btn");

  let state = {
    wedding: null,
    budget: null,
    allocations: [],
    activeCategoryKey: null,
    isSavedPlan: false,
    savedAt: null
  };

  function setupMobileNav() {
    if (!navToggle || !primaryNav) return;
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      primaryNav.classList.toggle("is-open", !expanded);
    });
  }

  function safeParse(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function formatPKR(amount) {
    const num = Math.round(Number(amount) || 0);
    if (num < 0) {
      return "-PKR " + Math.abs(num).toLocaleString("en-US");
    }
    return "PKR " + num.toLocaleString("en-US");
  }

  function formatPerGuest(amount) {
    const val = Number(amount) || 0;
    const isWhole = Math.abs(val - Math.round(val)) < 0.005;
    if (isWhole) {
      return "PKR " + Math.round(val).toLocaleString("en-US");
    }
    return "PKR " + val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function loadInitialState() {
    const wedding = safeParse(WEDDING_KEY);
    const budget = safeParse(BUDGET_KEY);
    const savedPlan = safeParse(PLAN_KEY);

    const hasValidBudget =
      budget &&
      typeof budget === "object" &&
      Number(budget.totalBudget) > 0 &&
      Number(budget.guests) > 0 &&
      Array.isArray(budget.allocations);

    const hasValidSavedPlan =
      savedPlan &&
      typeof savedPlan === "object" &&
      savedPlan.budget &&
      Number(savedPlan.budget.totalBudget) > 0 &&
      Array.isArray(savedPlan.allocations);

    if (!hasValidBudget && !hasValidSavedPlan) {
      emptyState.hidden = false;
      dashboardContent.hidden = true;
      return false;
    }

    // Prefer savedPlan if it matches or is newer than budget/wedding edits
    let useSavedPlan = false;
    if (hasValidSavedPlan) {
      if (!hasValidBudget) {
        useSavedPlan = true;
      } else {
        const planSourceTime = Date.parse(savedPlan.sourceBudgetUpdatedAt || "") || 0;
        const budgetTime = Date.parse(budget.updatedAt || "") || 0;
        const planWeddingTime = Date.parse(savedPlan.sourceWeddingUpdatedAt || "") || 0;
        const weddingTime = Date.parse((wedding && wedding.updatedAt) || "") || 0;
        if (budgetTime <= planSourceTime && weddingTime <= planWeddingTime) {
          useSavedPlan = true;
        }
      }
    }

    if (useSavedPlan) {
      state.wedding = savedPlan.wedding || wedding || { style: "Not specified", ceremonies: [], totalEvents: 0 };
      state.budget = savedPlan.budget;
      state.allocations = savedPlan.allocations.map((a) => ({ ...a }));
      state.isSavedPlan = true;
      state.savedAt = savedPlan.savedAt || null;
    } else {
      state.wedding = wedding || { style: "Not specified", ceremonies: [], totalEvents: 0 };
      state.budget = budget;
      state.allocations = budget.allocations.map((a) => ({ ...a }));
      state.isSavedPlan = false;
      state.savedAt = null;
    }

    emptyState.hidden = true;
    dashboardContent.hidden = false;
    return true;
  }

  function renderOverview() {
    const ceremonies = Array.isArray(state.wedding.ceremonies) ? state.wedding.ceremonies : [];
    dashStyle.textContent = state.wedding.style || "Not selected";
    dashEvents.textContent = String(ceremonies.length);
    dashGuests.textContent = Number(state.budget.guests).toLocaleString("en-US");
    dashPriority.textContent = state.budget.priority || "Balanced";
    dashTotalBudget.textContent = formatPKR(state.budget.totalBudget);
    dashPerGuest.textContent = formatPerGuest(state.budget.budgetPerGuest);

    dashCeremonies.innerHTML = "";
    if (ceremonies.length === 0) {
      const span = document.createElement("span");
      span.textContent = "No ceremonies selected";
      dashCeremonies.appendChild(span);
    } else {
      ceremonies.forEach((c) => {
        const pill = document.createElement("span");
        pill.className = "ceremony-pill";
        pill.textContent = c;
        dashCeremonies.appendChild(pill);
      });
    }

    if (state.isSavedPlan) {
      planStatusBadge.textContent = "Saved Final Plan";
      planStatusBadge.classList.add("is-saved");
      if (state.savedAt) {
        const formatted = new Date(state.savedAt).toLocaleString();
        saveStatusBanner.textContent = "Saved wedding plan loaded (last saved: " + formatted + ").";
        saveStatusBanner.hidden = false;
      }
    } else {
      planStatusBadge.textContent = "Draft from Calculator";
      planStatusBadge.classList.remove("is-saved");
    }
  }

  function getTotalAllocated() {
    return state.allocations.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }

  function updateCenterReadout() {
    const totalBudget = Number(state.budget.totalBudget) || 0;
    const totalAllocated = getTotalAllocated();

    if (state.activeCategoryKey) {
      const target = state.allocations.find((a) => a.key === state.activeCategoryKey);
      if (target) {
        const pct = totalBudget > 0 ? ((target.amount / totalBudget) * 100).toFixed(1) : "0.0";
        donutCenterLabel.textContent = target.label;
        donutCenterValue.textContent = formatPKR(target.amount);
        donutCenterSub.textContent = pct + "% of total budget";
        return;
      }
    }

    const totalPct = totalBudget > 0 ? ((totalAllocated / totalBudget) * 100).toFixed(1) : "0.0";
    donutCenterLabel.textContent = "Total Allocated";
    donutCenterValue.textContent = formatPKR(totalAllocated);
    donutCenterSub.textContent = totalPct + "% of total budget";
  }

  function setActiveCategory(key) {
    state.activeCategoryKey = key;
    Array.from(donutSegments.querySelectorAll(".donut-segment")).forEach((seg) => {
      seg.classList.toggle("is-active", seg.dataset.key === key);
    });
    Array.from(chartLegend.querySelectorAll(".legend-item")).forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.key === key);
    });
    updateCenterReadout();
  }

  function renderChartAndLegend() {
    const totalAllocated = getTotalAllocated();
    const totalBudget = Number(state.budget.totalBudget) || 0;
    const radius = 88;
    const circumference = 2 * Math.PI * radius;

    donutSegments.innerHTML = "";
    chartLegend.innerHTML = "";

    let offsetAcc = 0;

    state.allocations.forEach((item) => {
      const amount = Math.max(0, Number(item.amount) || 0);
      const shareOfAllocated = totalAllocated > 0 ? amount / totalAllocated : 0;
      const shareOfBudget = totalBudget > 0 ? (amount / totalBudget) * 100 : 0;
      const color = CATEGORY_COLORS[item.key] || "#554A45";

      if (shareOfAllocated > 0) {
        const segLen = shareOfAllocated * circumference;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "130");
        circle.setAttribute("cy", "130");
        circle.setAttribute("r", String(radius));
        circle.setAttribute("class", "donut-segment");
        circle.setAttribute("stroke", color);
        circle.setAttribute("stroke-dasharray", segLen + " " + (circumference - segLen));
        circle.setAttribute("stroke-dashoffset", String(-offsetAcc));
        circle.setAttribute("transform", "rotate(-90 130 130)");
        circle.setAttribute("tabindex", "0");
        circle.setAttribute("role", "button");
        circle.setAttribute(
          "aria-label",
          item.label + ": " + formatPKR(amount) + " (" + shareOfBudget.toFixed(1) + "% of budget)"
        );
        circle.dataset.key = item.key;

        circle.addEventListener("mouseenter", function () {
          setActiveCategory(item.key);
        });
        circle.addEventListener("focus", function () {
          setActiveCategory(item.key);
        });
        circle.addEventListener("mouseleave", function () {
          setActiveCategory(null);
        });
        circle.addEventListener("blur", function () {
          setActiveCategory(null);
        });
        circle.addEventListener("click", function () {
          setActiveCategory(state.activeCategoryKey === item.key ? null : item.key);
        });

        donutSegments.appendChild(circle);
        offsetAcc += segLen;
      }

      // Legend button
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "legend-item";
      btn.dataset.key = item.key;

      const left = document.createElement("span");
      left.className = "legend-left";
      const swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.style.backgroundColor = color;
      const label = document.createElement("span");
      label.textContent = item.label;
      left.appendChild(swatch);
      left.appendChild(label);

      const right = document.createElement("span");
      right.className = "legend-right";
      right.textContent = shareOfBudget.toFixed(1) + "% · " + formatPKR(amount);

      btn.appendChild(left);
      btn.appendChild(right);
      btn.addEventListener("mouseenter", function () {
        setActiveCategory(item.key);
      });
      btn.addEventListener("focus", function () {
        setActiveCategory(item.key);
      });
      btn.addEventListener("mouseleave", function () {
        setActiveCategory(null);
      });
      btn.addEventListener("blur", function () {
        setActiveCategory(null);
      });
      btn.addEventListener("click", function () {
        setActiveCategory(state.activeCategoryKey === item.key ? null : item.key);
      });

      li.appendChild(btn);
      chartLegend.appendChild(li);
    });

    updateCenterReadout();
  }

  function renderTotalsAndWarning() {
    const totalBudget = Number(state.budget.totalBudget) || 0;
    const totalAllocated = getTotalAllocated();
    const remaining = totalBudget - totalAllocated;

    totalsBudget.textContent = formatPKR(totalBudget);
    totalsAllocated.textContent = formatPKR(totalAllocated);
    totalsRemaining.textContent = formatPKR(remaining);

    if (remaining < 0) {
      remainingRow.classList.add("is-over");
      overBudgetWarning.textContent =
        "Warning: Your category allocations exceed your total wedding budget by " +
        formatPKR(Math.abs(remaining)) +
        ". Adjust allocations or increase your budget.";
      overBudgetWarning.hidden = false;
    } else {
      remainingRow.classList.remove("is-over");
      overBudgetWarning.hidden = true;
      overBudgetWarning.textContent = "";
    }
  }

  function updateEditorRowVisuals() {
    const totalBudget = Number(state.budget.totalBudget) || 0;
    state.allocations.forEach((item) => {
      const pctEl = document.getElementById("pct-" + item.key);
      const barEl = document.getElementById("bar-" + item.key);
      const pct = totalBudget > 0 ? (item.amount / totalBudget) * 100 : 0;
      if (pctEl) pctEl.textContent = pct.toFixed(1) + "%";
      if (barEl) {
        barEl.style.width = Math.min(100, Math.max(0, pct)) + "%";
      }
    });
  }

  function renderEditorRows() {
    allocationRows.innerHTML = "";
    const totalBudget = Number(state.budget.totalBudget) || 0;

    state.allocations.forEach((item) => {
      const row = document.createElement("div");
      row.className = "editor-row";

      const top = document.createElement("div");
      top.className = "editor-row-top";

      const labelWrap = document.createElement("div");
      labelWrap.className = "editor-label-wrap";

      const label = document.createElement("label");
      label.className = "editor-label";
      label.setAttribute("for", "edit-" + item.key);
      label.textContent = item.label;

      const pctSpan = document.createElement("span");
      pctSpan.className = "editor-pct";
      pctSpan.id = "pct-" + item.key;
      const pct = totalBudget > 0 ? (item.amount / totalBudget) * 100 : 0;
      pctSpan.textContent = pct.toFixed(1) + "%";

      labelWrap.appendChild(label);
      labelWrap.appendChild(pctSpan);

      const inputWrap = document.createElement("div");
      inputWrap.className = "editor-input-wrap";

      const currency = document.createElement("span");
      currency.className = "editor-currency";
      currency.setAttribute("aria-hidden", "true");
      currency.textContent = "PKR";

      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.step = "1000";
      input.id = "edit-" + item.key;
      input.className = "editor-input";
      input.value = String(item.amount);
      input.setAttribute("aria-describedby", "err-" + item.key);

      inputWrap.appendChild(currency);
      inputWrap.appendChild(input);

      top.appendChild(labelWrap);
      top.appendChild(inputWrap);

      const track = document.createElement("div");
      track.className = "editor-bar-track";
      const fill = document.createElement("div");
      fill.className = "editor-bar-fill";
      fill.id = "bar-" + item.key;
      fill.style.width = Math.min(100, Math.max(0, pct)) + "%";
      fill.style.backgroundColor = CATEGORY_COLORS[item.key] || "#554A45";
      track.appendChild(fill);

      const err = document.createElement("p");
      err.className = "editor-error";
      err.id = "err-" + item.key;
      err.setAttribute("role", "alert");
      err.hidden = true;

      input.addEventListener("input", function () {
        const raw = input.value.trim();
        const val = Number(raw);
        if (raw === "") {
          err.textContent = "Please enter an amount (0 or greater).";
          err.hidden = false;
          input.setAttribute("aria-invalid", "true");
          item.amount = 0;
        } else if (!Number.isFinite(val) || val < 0) {
          err.textContent = "Allocation cannot be negative.";
          err.hidden = false;
          input.setAttribute("aria-invalid", "true");
          return;
        } else {
          err.textContent = "";
          err.hidden = true;
          input.removeAttribute("aria-invalid");
          item.amount = Math.round(val);
        }

        state.isSavedPlan = false;
        planStatusBadge.textContent = "Unsaved Edits";
        planStatusBadge.classList.remove("is-saved");
        saveStatusBanner.hidden = true;

        updateEditorRowVisuals();
        renderChartAndLegend();
        renderTotalsAndWarning();
      });

      row.appendChild(top);
      row.appendChild(track);
      row.appendChild(err);
      allocationRows.appendChild(row);
    });
  }

  function hasInvalidInputs() {
    return Array.from(allocationRows.querySelectorAll(".editor-input")).some(
      (input) => input.getAttribute("aria-invalid") === "true"
    );
  }

  function saveFinalPlan() {
    if (hasInvalidInputs()) {
      saveStatusBanner.hidden = true;
      overBudgetWarning.textContent = "Please correct invalid allocation amounts before saving your wedding plan.";
      overBudgetWarning.hidden = false;
      return;
    }

    const totalBudget = Number(state.budget.totalBudget) || 0;
    const totalAllocated = getTotalAllocated();
    const remainingBudget = totalBudget - totalAllocated;
    const nowIso = new Date().toISOString();

    const normalizedAllocations = state.allocations.map((item) => ({
      key: item.key,
      label: item.label,
      percentage: totalBudget > 0 ? Number(((item.amount / totalBudget) * 100).toFixed(2)) : 0,
      amount: item.amount
    }));

    const weddingPlan = {
      wedding: state.wedding,
      budget: state.budget,
      allocations: normalizedAllocations,
      totalAllocated: totalAllocated,
      remainingBudget: remainingBudget,
      savedAt: nowIso,
      sourceBudgetUpdatedAt: state.budget.updatedAt || "",
      sourceWeddingUpdatedAt: (state.wedding && state.wedding.updatedAt) || ""
    };

    localStorage.setItem(PLAN_KEY, JSON.stringify(weddingPlan));
    state.isSavedPlan = true;
    state.savedAt = nowIso;
    planStatusBadge.textContent = "Saved Final Plan";
    planStatusBadge.classList.add("is-saved");

    saveStatusBanner.textContent =
      "Your final Petal & Promise wedding plan has been saved to this browser (" +
      new Date(nowIso).toLocaleTimeString() +
      ").";
    saveStatusBanner.hidden = false;
  }

  function buildSummaryText() {
    const ceremonies = Array.isArray(state.wedding.ceremonies) ? state.wedding.ceremonies : [];
    const totalBudget = Number(state.budget.totalBudget) || 0;
    const totalAllocated = getTotalAllocated();
    const remaining = totalBudget - totalAllocated;

    const lines = [
      "============================================================",
      "              PETAL & PROMISE - WEDDING BUDGET PLAN         ",
      "============================================================",
      "Prepared via Petal & Promise (M. Yousuf | 26i-3179 | Sec D)",
      "Generated: " + new Date().toLocaleString(),
      "",
      "WEDDING CUSTOMIZATION",
      "---------------------",
      "Wedding Style      : " + (state.wedding.style || "Not selected"),
      "Selected Ceremonies: " + (ceremonies.length ? ceremonies.join(", ") : "None"),
      "Total Events       : " + ceremonies.length,
      "",
      "BUDGET OVERVIEW",
      "---------------",
      "Number of Guests   : " + state.budget.guests,
      "Total Budget       : " + formatPKR(totalBudget),
      "Budget Per Guest   : " + formatPerGuest(state.budget.budgetPerGuest),
      "Spending Priority  : " + state.budget.priority,
      "",
      "CATEGORY-WISE ALLOCATION",
      "------------------------"
    ];

    state.allocations.forEach((item) => {
      const pct = totalBudget > 0 ? ((item.amount / totalBudget) * 100).toFixed(1) : "0.0";
      const paddedName = (item.label + "                    ").slice(0, 20);
      lines.push(paddedName + ": " + formatPKR(item.amount) + " (" + pct + "%)");
    });

    lines.push(
      "",
      "TOTALS",
      "------",
      "Total Allocated    : " + formatPKR(totalAllocated),
      "Remaining Budget   : " + formatPKR(remaining),
      remaining < 0
        ? "Status             : OVER BUDGET by " + formatPKR(Math.abs(remaining))
        : "Status             : Within Budget",
      "============================================================"
    );

    return lines.join("\n");
  }

  function downloadSummaryTxt() {
    const content = buildSummaryText();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "petal-and-promise-wedding-plan.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 500);
  }

  function openResetModal() {
    resetModal.hidden = false;
    cancelResetBtn.focus();
  }

  function closeResetModal() {
    resetModal.hidden = true;
    resetPlanBtn.focus();
  }

  function confirmResetPlan() {
    localStorage.removeItem(WEDDING_KEY);
    localStorage.removeItem(BUDGET_KEY);
    localStorage.removeItem(PLAN_KEY);
    resetModal.hidden = true;
    dashboardContent.hidden = true;
    emptyState.hidden = false;
  }

  function init() {
    setupMobileNav();

    const loaded = loadInitialState();
    if (!loaded) return;

    renderOverview();
    renderEditorRows();
    renderChartAndLegend();
    renderTotalsAndWarning();

    restoreCalcBtn.addEventListener("click", function () {
      const latestBudget = safeParse(BUDGET_KEY);
      if (latestBudget && Array.isArray(latestBudget.allocations)) {
        state.budget = latestBudget;
        state.allocations = latestBudget.allocations.map((a) => ({ ...a }));
        state.isSavedPlan = false;
        planStatusBadge.textContent = "Draft from Calculator";
        planStatusBadge.classList.remove("is-saved");
        saveStatusBanner.hidden = true;
        renderEditorRows();
        renderChartAndLegend();
        renderTotalsAndWarning();
      }
    });

    savePlanBtn.addEventListener("click", saveFinalPlan);
    printPlanBtn.addEventListener("click", function () {
      window.print();
    });
    downloadPlanBtn.addEventListener("click", downloadSummaryTxt);
    resetPlanBtn.addEventListener("click", openResetModal);
    cancelResetBtn.addEventListener("click", closeResetModal);
    confirmResetBtn.addEventListener("click", confirmResetPlan);

    resetModal.addEventListener("click", function (event) {
      if (event.target === resetModal) {
        closeResetModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !resetModal.hidden) {
        closeResetModal();
      }
    });
  }

  init();
})();
