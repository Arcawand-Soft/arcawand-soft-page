(function initManagerToolHistory(global) {
  "use strict";

  function createManagerToolHistoryController(options = {}) {
    const {
      getWorkspaceModal = () => document.getElementById("managerToolWorkspaceModal"),
      runActiveTool = () => {},
      renderEmojiPicker = () => {},
      renderSpecialCharacters = () => {},
      clearTimer = (timer) => global.clearTimeout(timer),
      schedule = (callback, delay) => global.setTimeout(callback, delay),
      maxEntries = 30,
      debounceMs = 420
    } = options;
    const histories = new Map();

    function snapshot(modal) {
      return {
        input: modal.querySelector("[data-role='tool-input']")?.value || "",
        compare: modal.querySelector("[data-role='tool-compare-input']")?.value || "",
        emojiSearch: modal.querySelector("[data-role='emoji-search']")?.value || "",
        options: [...modal.querySelectorAll("[data-tool-option]")].reduce((result, field) => {
          result[field.dataset.toolOption] = field.value;
          return result;
        }, {})
      };
    }

    function reset(modal) {
      histories.set(modal.dataset.toolId, { entries: [snapshot(modal)], index: 0 });
      updateButtons(modal);
    }

    function record(modal, { immediate = false } = {}) {
      if (!modal || modal.hidden || !modal.dataset.toolId) return;
      clearTimer(modal._toolHistoryTimer);
      const commit = () => {
        const state = histories.get(modal.dataset.toolId) || { entries: [], index: -1 };
        const nextSnapshot = snapshot(modal);
        const signature = JSON.stringify(nextSnapshot);
        if (state.index >= 0 && JSON.stringify(state.entries[state.index]) === signature) return;
        state.entries = state.entries.slice(0, state.index + 1);
        state.entries.push(nextSnapshot);
        if (state.entries.length > maxEntries) state.entries.shift();
        state.index = state.entries.length - 1;
        histories.set(modal.dataset.toolId, state);
        updateButtons(modal);
      };
      if (immediate) commit();
      else modal._toolHistoryTimer = schedule(commit, debounceMs);
    }

    function restore(direction) {
      const modal = getWorkspaceModal();
      if (!modal || modal.hidden) return;
      const state = histories.get(modal.dataset.toolId);
      if (!state) return;
      const nextIndex = Math.max(0, Math.min(state.entries.length - 1, state.index + direction));
      if (nextIndex === state.index) return;
      state.index = nextIndex;
      apply(modal, state.entries[nextIndex]);
      updateButtons(modal);
    }

    function apply(modal, nextSnapshot = {}) {
      const input = modal.querySelector("[data-role='tool-input']");
      const compare = modal.querySelector("[data-role='tool-compare-input']");
      const emojiSearch = modal.querySelector("[data-role='emoji-search']");
      if (input) input.value = nextSnapshot.input || "";
      if (compare) compare.value = nextSnapshot.compare || "";
      if (emojiSearch) emojiSearch.value = nextSnapshot.emojiSearch || "";
      modal.querySelectorAll("[data-tool-option]").forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(nextSnapshot.options || {}, field.dataset.toolOption)) {
          field.value = nextSnapshot.options[field.dataset.toolOption];
        }
      });
      if (modal.dataset.toolId === "emojiPicker") renderEmojiPicker(modal);
      else if (modal.dataset.toolId === "longTextSplitter") renderSpecialCharacters(modal);
      else runActiveTool({ silent: true, recordHistory: false });
    }

    function updateButtons(modal) {
      const state = histories.get(modal.dataset.toolId) || { entries: [], index: 0 };
      const undo = modal.querySelector("[data-manager-action='tool-undo']");
      const redo = modal.querySelector("[data-manager-action='tool-redo']");
      if (undo) undo.disabled = state.index <= 0;
      if (redo) redo.disabled = state.index >= state.entries.length - 1;
    }

    return { snapshot, reset, record, restore, apply, updateButtons };
  }

  global.MCP = global.MCP || {};
  global.MCP.createManagerToolHistoryController = createManagerToolHistoryController;
})(globalThis);
