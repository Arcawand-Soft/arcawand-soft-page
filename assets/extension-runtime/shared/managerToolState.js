(function initManagerToolState(global) {
  "use strict";

  function createManagerToolStateController(options = {}) {
    const {
      getSettings = () => ({}),
      updateSettings = () => {},
      loadSettings = async () => getSettings(),
      persistSettings = async () => {},
      clearTimer = (timer) => global.clearTimeout(timer),
      scheduleTimer = (callback, delay) => global.setTimeout(callback, delay),
      debounceMs = 280
    } = options;
    let saveTimer = null;

    function get(toolId) {
      const states = getSettings()?.toolStates;
      return states && typeof states === "object" && states[toolId] && typeof states[toolId] === "object"
        ? states[toolId]
        : {};
    }

    function restore(modal, toolId) {
      const saved = get(toolId);
      const input = modal.querySelector("[data-role='tool-input']");
      const compare = modal.querySelector("[data-role='tool-compare-input']");
      const emojiSearch = modal.querySelector("[data-role='emoji-search']");
      if (input && typeof saved.input === "string") input.value = saved.input;
      if (compare && typeof saved.compare === "string") compare.value = saved.compare;
      if (emojiSearch && typeof saved.emojiSearch === "string") emojiSearch.value = saved.emojiSearch;
      const savedOptions = saved.options && typeof saved.options === "object" ? saved.options : {};
      modal.querySelectorAll("[data-tool-option]").forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(savedOptions, field.dataset.toolOption)) {
          field.value = savedOptions[field.dataset.toolOption];
        }
      });
    }

    function collect(modal) {
      const collectedOptions = {};
      modal.querySelectorAll("[data-tool-option]").forEach((field) => {
        collectedOptions[field.dataset.toolOption] = field.value;
      });
      return {
        input: modal.querySelector("[data-role='tool-input']")?.value || "",
        compare: modal.querySelector("[data-role='tool-compare-input']")?.value || "",
        emojiSearch: modal.querySelector("[data-role='emoji-search']")?.value || "",
        options: collectedOptions
      };
    }

    function schedule(modal) {
      if (!modal || modal.hidden || !modal.dataset.toolId) return;
      clearTimer(saveTimer);
      saveTimer = scheduleTimer(() => save(modal), debounceMs);
    }

    async function save(modal) {
      if (!modal || !modal.dataset.toolId) return;
      const toolId = modal.dataset.toolId;
      const nextToolState = collect(modal);
      const currentSettings = await loadSettings().catch(() => getSettings() || {});
      const nextToolStates = Object.assign({}, currentSettings.toolStates || {}, { [toolId]: nextToolState });
      const nextSettings = Object.assign({}, currentSettings, { toolStates: nextToolStates });
      updateSettings({ toolStates: nextToolStates });
      await persistSettings(nextSettings).catch(() => {});
    }

    return { get, restore, collect, schedule, save };
  }

  global.MCP = global.MCP || {};
  global.MCP.createManagerToolStateController = createManagerToolStateController;
})(globalThis);
