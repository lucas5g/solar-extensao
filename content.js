(() => {
  "use strict";

  const TARGET_PATH = "/processo/peticionamento/buscar/";
  const STORAGE_KEY = "solarAjudaEnabled";
  const HIDDEN_CLASS = "solar-error-filter-hidden";
  const tableStates = new WeakMap();
  let updateScheduled = false;
  let enabled = false;

  if (window.location.pathname !== TARGET_PATH) {
    return;
  }

  function normalizeDescription(value) {
    return value.trim().replace(/\s+/g, " ");
  }

  function getErrorRows(table) {
    return Array.from(table.querySelectorAll("tbody > tr.error")).filter(
      (row) =>
        row.closest("table") === table &&
        row.querySelector('input[type="checkbox"][name="sel"]')
    );
  }

  function getDescription(row) {
    const badge = row.querySelector(
      '.label.label-important[data-original-title]'
    );

    if (!badge) {
      return null;
    }

    const description = normalizeDescription(
      badge.getAttribute("data-original-title") || ""
    );

    return description ? { badge, description } : null;
  }

  function addDescription(row) {
    const error = getDescription(row);

    if (!error) {
      delete row.dataset.solarErrorDescription;
      return null;
    }

    row.dataset.solarErrorDescription = error.description;
    const container = error.badge.parentElement;
    container.classList.add("solar-error-status");

    let descriptionElement = container.querySelector(
      ":scope > .solar-error-description"
    );

    if (!descriptionElement) {
      descriptionElement = document.createElement("small");
      descriptionElement.className = "solar-error-description";
      container.append(descriptionElement);
    }

    if (descriptionElement.textContent !== error.description) {
      descriptionElement.textContent = error.description;
    }

    return error.description;
  }

  function getDetailsRow(row) {
    const nextRow = row.nextElementSibling;
    const firstCell = nextRow?.firstElementChild;

    return firstCell?.matches("td.hiddenRow") ? nextRow : null;
  }

  function createToolbar(table) {
    const toolbar = document.createElement("div");
    toolbar.className = "solar-error-filter";

    const label = document.createElement("label");
    label.className = "solar-error-filter__label";
    label.textContent = "Tipo de erro";

    const select = document.createElement("select");
    select.className = "solar-error-filter__select";
    select.setAttribute("aria-label", "Filtrar por tipo de erro");
    label.append(select);

    const count = document.createElement("span");
    count.className = "solar-error-filter__count";
    count.setAttribute("aria-live", "polite");

    const empty = document.createElement("span");
    empty.className = "solar-error-filter__empty";
    empty.textContent = "Nenhum registro encontrado para este erro.";
    empty.hidden = true;

    toolbar.append(label, count, empty);
    table.before(toolbar);

    const state = { toolbar, select, count, empty, optionsSignature: "" };
    select.addEventListener("change", () => applyFilter(table, state));
    tableStates.set(table, state);

    return state;
  }

  function updateOptions(state, descriptions) {
    const counts = new Map();

    descriptions.forEach((description) => {
      if (description) {
        counts.set(description, (counts.get(description) || 0) + 1);
      }
    });

    const entries = Array.from(counts.entries()).sort(([first], [second]) =>
      first.localeCompare(second, "pt-BR")
    );
    const signature = JSON.stringify(entries);

    if (signature === state.optionsSignature) {
      return;
    }

    const currentValue = state.select.value;
    const allOption = new Option(`Todos os erros (${descriptions.length})`, "");
    const options = entries.map(
      ([description, quantity]) =>
        new Option(`${description} (${quantity})`, description)
    );

    state.select.replaceChildren(allOption, ...options);
    state.select.value = counts.has(currentValue) ? currentValue : "";
    state.optionsSignature = signature;
  }

  function applyFilter(table, state) {
    const rows = getErrorRows(table);
    const selectedDescription = state.select.value;
    let visibleCount = 0;

    rows.forEach((row) => {
      const visible =
        !selectedDescription ||
        row.dataset.solarErrorDescription === selectedDescription;
      const detailsRow = getDetailsRow(row);

      row.classList.toggle(HIDDEN_CLASS, !visible);
      detailsRow?.classList.toggle(HIDDEN_CLASS, !visible);

      if (visible) {
        visibleCount += 1;
      }
    });

    const countText = `${visibleCount} de ${rows.length} registros`;

    if (state.count.textContent !== countText) {
      state.count.textContent = countText;
    }

    state.empty.hidden = visibleCount !== 0;
  }

  function processTable(table) {
    const rows = getErrorRows(table);

    if (!rows.length) {
      return;
    }

    const existingState = tableStates.get(table);
    const state = existingState?.toolbar.isConnected
      ? existingState
      : createToolbar(table);
    const descriptions = rows.map(addDescription);
    updateOptions(state, descriptions);
    applyFilter(table, state);
  }

  function processPage() {
    if (!enabled) {
      return;
    }

    document.querySelectorAll(".solar-error-filter").forEach((toolbar) => {
      const table = toolbar.nextElementSibling;
      const state = table instanceof HTMLTableElement && tableStates.get(table);

      if (!state || state.toolbar !== toolbar) {
        toolbar.remove();
      }
    });

    const tables = new Set(
      Array.from(
        document.querySelectorAll('tr.error input[type="checkbox"][name="sel"]')
      )
        .map((input) => input.closest("table"))
        .filter(Boolean)
    );

    tables.forEach(processTable);
  }

  function scheduleUpdate() {
    if (updateScheduled) {
      return;
    }

    updateScheduled = true;
    window.requestAnimationFrame(() => {
      updateScheduled = false;
      processPage();
    });
  }

  function removeEnhancements() {
    document
      .querySelectorAll(".solar-error-filter")
      .forEach((toolbar) => toolbar.remove());
    document
      .querySelectorAll(".solar-error-description")
      .forEach((description) => description.remove());
    document.querySelectorAll(".solar-error-status").forEach((container) => {
      container.classList.remove("solar-error-status");
    });
    document.querySelectorAll("[data-solar-error-description]").forEach((row) => {
      delete row.dataset.solarErrorDescription;
    });
    document.querySelectorAll(`.${HIDDEN_CLASS}`).forEach((row) => {
      row.classList.remove(HIDDEN_CLASS);
    });
  }

  function setEnabled(nextEnabled) {
    enabled = nextEnabled;
    observer.disconnect();

    if (enabled) {
      processPage();
      observer.observe(document.body, { childList: true, subtree: true });
      return;
    }

    updateScheduled = false;
    removeEnhancements();
  }

  const observer = new MutationObserver(scheduleUpdate);

  chrome.storage.local.get({ [STORAGE_KEY]: true }, (result) => {
    setEnabled(result[STORAGE_KEY]);
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && STORAGE_KEY in changes) {
      setEnabled(changes[STORAGE_KEY].newValue !== false);
    }
  });
})();
