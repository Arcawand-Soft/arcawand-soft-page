(function initQuickSettingsMenu(global) {
  "use strict";

  const QUICK_SETTINGS_DEFINITIONS = Object.freeze([
    Object.freeze({ key: "floatingPanelAfterCapture", labelKey: "quickSettings.autoOpenPanel", defaultValue: true }),
    Object.freeze({ key: "copyAfterSave", labelKey: "quickSettings.autoCopy", defaultValue: true }),
    Object.freeze({ key: "captureAiCopyButtons", labelKey: "quickSettings.aiCopyButtons", defaultValue: true }),
    Object.freeze({ key: "confirmBeforeDelete", labelKey: "quickSettings.confirmDelete", defaultValue: true })
  ]);
  const QUICK_SETTINGS_KEYS = new Set(["theme", ...QUICK_SETTINGS_DEFINITIONS.map(({ key }) => key)]);
  const QUICK_SETTINGS_SAVE_METADATA_KEYS = new Set(["settingsUpdatedAt"]);

  function isQuickSettingsOnlyChange(previousSettings = {}, nextSettings = {}) {
    const changedKeys = new Set([...Object.keys(previousSettings), ...Object.keys(nextSettings)]);
    const differences = [...changedKeys].filter((key) => !settingsValuesEqual(previousSettings[key], nextSettings[key]));
    return differences.some((key) => QUICK_SETTINGS_KEYS.has(key))
      && differences.every((key) => QUICK_SETTINGS_KEYS.has(key) || QUICK_SETTINGS_SAVE_METADATA_KEYS.has(key));
  }

  function settingsValuesEqual(previousValue, nextValue) {
    if (Object.is(previousValue, nextValue)) return true;
    if (!previousValue || !nextValue || typeof previousValue !== "object" || typeof nextValue !== "object") return false;
    try {
      return JSON.stringify(previousValue) === JSON.stringify(nextValue);
    } catch {
      return false;
    }
  }

  function createQuickSettingsMenu(options = {}) {
    const {
      classPrefix = "ucp",
      actionAttribute = "menuAction",
      actionValue = "quick-settings",
      t = (key) => key,
      getSettings = () => ({}),
      persistSetting = async () => getSettings(),
      onPersistError = () => {}
    } = options;
    const wrapper = document.createElement("div");
    wrapper.className = `${classPrefix}-quick-settings ucp-quick-settings`;

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = `${classPrefix}-quick-settings-trigger ucp-quick-settings-trigger`;
    trigger.dataset[actionAttribute] = actionValue;
    trigger.setAttribute("role", "menuitem");
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    const title = document.createElement("span");
    title.textContent = t("quickSettings.title");
    const arrow = document.createElement("span");
    arrow.className = "ucp-quick-settings-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "\u203A";
    trigger.append(title, arrow);

    const submenu = document.createElement("div");
    submenu.className = `${classPrefix}-quick-settings-submenu ucp-quick-settings-submenu`;
    submenu.hidden = true;
    submenu.setAttribute("role", "menu");
    submenu.setAttribute("aria-label", t("quickSettings.title"));

    const themeSwitch = document.createElement("div");
    themeSwitch.className = "ucp-quick-settings-theme-switch";
    themeSwitch.setAttribute("role", "group");
    themeSwitch.setAttribute("aria-label", t("quickSettings.theme"));
    const themeButtons = [
      { theme: "dark", labelKey: "quickSettings.darkMode", icon: "\u263E" },
      { theme: "light", labelKey: "quickSettings.lightMode", icon: "\u2600" }
    ].map(({ theme, labelKey, icon }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ucp-quick-settings-theme-button";
      button.setAttribute("data-theme", theme);
      button.setAttribute("aria-pressed", "false");
      const symbol = document.createElement("span");
      symbol.className = "ucp-quick-settings-theme-icon";
      symbol.setAttribute("aria-hidden", "true");
      symbol.textContent = icon;
      const label = document.createElement("span");
      label.textContent = t(labelKey);
      button.append(symbol, label);
      button.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (button.disabled) return;
        button.disabled = true;
        try {
          const nextSettings = await persistSetting("theme", theme);
          global.MCP?.applyThemeSettings?.(nextSettings || getSettings());
          sync();
        } catch (error) {
          sync();
          onPersistError(error, "theme");
        } finally {
          button.disabled = false;
        }
      });
      themeSwitch.appendChild(button);
      return button;
    });
    submenu.appendChild(themeSwitch);

    const rows = QUICK_SETTINGS_DEFINITIONS.map((definition) => {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "ucp-quick-settings-option";
      row.dataset.quickSettingKey = definition.key;
      row.setAttribute("role", "menuitemcheckbox");
      const check = document.createElement("span");
      check.className = "ucp-quick-settings-check";
      check.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.className = "ucp-quick-settings-label";
      label.textContent = t(definition.labelKey);
      row.append(check, label);
      row.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (row.disabled) return;
        const current = getSettings() || {};
        const checked = current[definition.key] !== false;
        row.disabled = true;
        try {
          await persistSetting(definition.key, !checked);
          sync();
        } catch (error) {
          sync();
          onPersistError(error, definition.key);
        } finally {
          row.disabled = false;
        }
      });
      submenu.appendChild(row);
      return row;
    });
    const interactiveRows = [...themeButtons, ...rows];
    interactiveRows.forEach((row) => row.addEventListener("keydown", (event) => handleOptionKeydown(event, interactiveRows, trigger, setOpen)));

    const setOpen = (open, focusFirst = false) => {
      submenu.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
      wrapper.classList.toggle("is-open", open);
      if (open) sync();
      if (open && focusFirst) interactiveRows[0]?.focus();
    };
    const sync = () => {
      const settings = getSettings() || {};
      const configuredTheme = settings.theme === "light" || settings.theme === "dark"
        ? settings.theme
        : global.document?.documentElement?.dataset?.resolvedTheme || "dark";
      themeButtons.forEach((button) => {
        const active = button.getAttribute("data-theme") === configuredTheme;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("is-active", active);
      });
      QUICK_SETTINGS_DEFINITIONS.forEach((definition, index) => {
        const checked = settings[definition.key] !== false;
        rows[index].setAttribute("aria-checked", String(checked));
        rows[index].classList.toggle("is-checked", checked);
      });
    };

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setOpen(submenu.hidden);
    });
    trigger.addEventListener("keydown", (event) => {
      if (!["Enter", " ", "ArrowRight", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(true, true);
    });
    wrapper.append(trigger, submenu);
    sync();
    wrapper.refreshQuickSettings = sync;
    wrapper.closeQuickSettings = () => setOpen(false);
    return wrapper;
  }

  function handleOptionKeydown(event, rows, trigger, setOpen) {
    const index = rows.indexOf(event.currentTarget);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      rows[(index + delta + rows.length) % rows.length]?.focus();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      trigger.focus();
    }
  }

  global.MCP = Object.assign(global.MCP || {}, {
    QUICK_SETTINGS_DEFINITIONS,
    createQuickSettingsMenu,
    isQuickSettingsOnlyChange
  });
})(globalThis);
