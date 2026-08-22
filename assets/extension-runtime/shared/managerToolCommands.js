(function initManagerToolCommands(global) {
  "use strict";

  function createManagerToolCommands(options = {}) {
    const {
      t = (key) => key, getLanguage = () => "en", getModal = () => document.getElementById("managerToolWorkspaceModal"),
      toolApi = global.MCP || {}, collectOptions = () => ({}), run = () => {}, record = () => {},
      updateWordReplacerHighlight = () => {}, renderEmojiPicker = () => {}, renderSpecialCharacters = () => {},
      showToast = () => {}, getHistory = () => null, readClipboard = () => navigator.clipboard.readText()
    } = options;

    async function paste() {
      const modal = getModal();
      if (!modal || modal.hidden) return;
      const input = modal.querySelector("[data-role='tool-input']");
      if (!input || input.closest("label")?.hidden) return;
      const value = await readClipboard().catch(() => "");
      if (!value) return showToast(t("tools.workbench.clipboardEmpty"));
      input.value = value; run({ silent: true }); record(modal, { immediate: true }); input.focus();
    }

    function example() {
      const modal = getModal();
      if (!modal || modal.hidden) return;
      const currentOptions = collectOptions(modal);
      const modeOptions = Object.fromEntries(Object.entries(currentOptions).filter(([key]) => !["locale", "compareText", "replaceFind", "replaceWith", "replaceCaseSensitive", "replaceWholeWord", "replaceRegex"].includes(key)));
      const signature = JSON.stringify([modal.dataset.toolId, modeOptions]);
      const index = modal.dataset.exampleSignature === signature ? Number(modal.dataset.exampleIndex || 0) : 0;
      const value = toolApi.toolExample?.(modal.dataset.toolId, currentOptions, getLanguage(), index);
      if (!value) return;
      modal.dataset.exampleSignature = signature; modal.dataset.exampleIndex = String(index + 1);
      modal.querySelectorAll("[data-tool-option]").forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(value.options || {}, field.dataset.toolOption)) field.value = value.options[field.dataset.toolOption];
      });
      const input = modal.querySelector("[data-role='tool-input']");
      const compare = modal.querySelector("[data-role='tool-compare-input']");
      if (input) input.value = value.input || "";
      if (compare) compare.value = value.compareText || "";
      if (modal.dataset.toolId === "variableInjector") updateWordReplacerHighlight(modal);
      run({ silent: true }); record(modal, { immediate: true });
    }

    function smartPreset() {
      const modal = getModal();
      if (!modal || modal.hidden) return;
      if (["emojiPicker", "longTextSplitter"].includes(modal.dataset.toolId)) {
        const search = modal.querySelector("[data-role='emoji-search']");
        if (search) search.value = "";
        if (modal.dataset.toolId === "emojiPicker") renderEmojiPicker(modal); else renderSpecialCharacters(modal);
        showToast(t("tools.workbench.smartApplied")); return;
      }
      const preset = toolApi.toolSmartPreset?.(modal.dataset.toolId) || {};
      modal.querySelectorAll("[data-tool-option]").forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(preset, field.dataset.toolOption)) field.value = preset[field.dataset.toolOption];
      });
      run({ silent: true }); record(modal, { immediate: true }); showToast(t("tools.workbench.smartApplied"));
    }

    function swap() {
      const modal = getModal();
      if (!modal || modal.dataset.toolId !== "textComparator") return;
      const input = modal.querySelector("[data-role='tool-input']"); const compare = modal.querySelector("[data-role='tool-compare-input']");
      [input.value, compare.value] = [compare.value, input.value]; run({ silent: true }); record(modal, { immediate: true });
    }

    function reset() {
      const modal = getModal();
      if (!modal || modal.hidden) return;
      modal.querySelectorAll("textarea").forEach((field) => { field.value = ""; });
      const search = modal.querySelector("[data-role='emoji-search']"); if (search) search.value = "";
      const preset = toolApi.toolSmartPreset?.(modal.dataset.toolId) || {};
      modal.querySelectorAll("[data-tool-option]").forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(preset, field.dataset.toolOption)) field.value = preset[field.dataset.toolOption];
      });
      const history = getHistory(); history?.apply(modal, history.snapshot(modal)); record(modal, { immediate: true });
    }

    function useOutput() {
      const modal = getModal(); const input = modal?.querySelector("[data-role='tool-input']"); const output = modal?.querySelector("[data-role='tool-output']")?.value || "";
      if (!input || !output) return; input.value = output; run({ silent: true }); record(modal, { immediate: true });
    }

    function exportOutput() {
      const modal = getModal(); const output = modal?.querySelector("[data-role='tool-output']")?.value || "";
      if (!output) return showToast(t("tools.workbench.emptyResult"));
      const blob = new Blob([output], { type: "text/plain;charset=utf-8" }); const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); link.download = `ultimate-clipboard-${modal.dataset.toolId}-${new Date().toISOString().slice(0, 10)}.txt`; link.click();
      global.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }

    return { paste, example, smartPreset, swap, reset, useOutput, exportOutput };
  }
  global.MCP = global.MCP || {}; global.MCP.createManagerToolCommands = createManagerToolCommands;
})(globalThis);
