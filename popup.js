(() => {
  "use strict";

  const STORAGE_KEY = "solarAjudaEnabled";
  const toggle = document.querySelector("#enabled");
  const status = document.querySelector("#status");

  function updateStatus(enabled) {
    toggle.checked = enabled;
    status.textContent = enabled
      ? "Recursos habilitados"
      : "Recursos desabilitados";
  }

  chrome.storage.local.get({ [STORAGE_KEY]: true }, (result) => {
    updateStatus(result[STORAGE_KEY]);
    toggle.disabled = false;
  });

  toggle.addEventListener("change", () => {
    const enabled = toggle.checked;
    updateStatus(enabled);
    chrome.storage.local.set({ [STORAGE_KEY]: enabled });
  });
})();
