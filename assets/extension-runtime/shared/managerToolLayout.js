(function initManagerToolLayout(global) {
  "use strict";

  const TRANSFORM_FOOTER = Object.freeze([
    "copy-tool-output",
    "use-tool-output",
    "export-tool-output",
    "capture-tool-output"
  ]);
  const REPORT_FOOTER = Object.freeze([
    "copy-tool-output",
    "export-tool-output",
    "capture-tool-output"
  ]);

  function actionPolicy(overrides = {}) {
    return Object.assign({
      paste: false,
      example: false,
      smart: false,
      swap: false,
      history: false,
      reset: false
    }, overrides);
  }

  const TOOL_PROFILES = Object.freeze({
    imageText: Object.freeze({ family: "capture", specialStage: true, showInput: false, showOutput: true, showInsights: true, actions: actionPolicy(), footerActions: REPORT_FOOTER }),
    snippetLibrary: Object.freeze({ family: "builder", showInput: true, showOutput: true, showInsights: true, wideSettings: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    promptTemplateManager: Object.freeze({ family: "builder", showInput: true, showOutput: true, showInsights: true, wideSettings: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    emojiPicker: Object.freeze({ family: "collection", showEmoji: true, showInsights: true, actions: actionPolicy(), footerActions: [] }),
    informationExtractor: Object.freeze({ family: "analysis", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: REPORT_FOOTER }),
    duplicateDetector: Object.freeze({ family: "dedupe", showInput: true, showOutput: true, showVisual: false, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: REPORT_FOOTER }),
    longTextSplitter: Object.freeze({ family: "collection", showEmoji: true, showInsights: true, actions: actionPolicy(), footerActions: [] }),
    textCleaner: Object.freeze({ family: "transform", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    typographyNormalizer: Object.freeze({ family: "transform", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    caseConverter: Object.freeze({ family: "transform", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    advancedCounter: Object.freeze({ family: "analysis", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: REPORT_FOOTER }),
    universalEncoder: Object.freeze({ family: "developer", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    colorPicker: Object.freeze({ family: "picker", specialStage: true, showInput: false, showOutput: false, showInsights: true, actions: actionPolicy(), footerActions: [] }),
    listTransformer: Object.freeze({ family: "transform", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    localAnonymizer: Object.freeze({ family: "analysis", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: REPORT_FOOTER }),
    variableInjector: Object.freeze({ family: "replace", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    loremGenerator: Object.freeze({ family: "generator", showInput: false, showOutput: true, showInsights: true, actions: actionPolicy({ smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    jsonFormatter: Object.freeze({ family: "developer", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    markdownToolkit: Object.freeze({ family: "developer", showInput: true, showOutput: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, history: true, reset: true }), footerActions: TRANSFORM_FOOTER }),
    textComparator: Object.freeze({ family: "compare", showInput: true, showCompare: true, showOutput: false, showVisual: true, showInsights: true, actions: actionPolicy({ example: true, smart: true, swap: true, history: true, reset: true }), footerActions: REPORT_FOOTER })
  });

  function createManagerToolLayoutController(options = {}) {
    const { t = (key) => key } = options;

    function describe(toolId) {
      const stored = TOOL_PROFILES[toolId] || {
        family: "transform",
        showInput: true,
        showOutput: true,
        showInsights: true,
        actions: actionPolicy({ history: true, reset: true }),
        footerActions: TRANSFORM_FOOTER
      };
      return Object.assign({
        id: toolId,
        specialStage: false,
        showInput: false,
        showCompare: false,
        showOutput: false,
        showEmoji: false,
        showVisual: false,
        showInsights: false,
        wideSettings: false,
        comparator: toolId === "textComparator",
        duplicateDetector: toolId === "duplicateDetector",
        emojiPicker: toolId === "emojiPicker",
        specialCharacters: toolId === "longTextSplitter",
        colorPicker: toolId === "colorPicker",
        imageText: toolId === "imageText",
        visual: Boolean(stored.showVisual)
      }, stored, {
        id: toolId,
        actions: Object.assign({}, stored.actions),
        footerActions: [...stored.footerActions]
      });
    }

    function setButtonVisibility(modal, action, visible) {
      const button = modal.querySelector(`[data-manager-action='${action}']`);
      if (button) button.hidden = !visible;
    }

    function reset(modal, toolId) {
      const layout = describe(toolId);
      const card = modal.querySelector(".manager-tool-workspace-card");
      const inputLabel = modal.querySelector("[data-role='tool-input-label']");
      const inputPanel = modal.querySelector("[data-role='tool-input']")?.closest("label");
      const compareLabel = modal.querySelector("[data-role='tool-compare-label']");
      const comparePanel = modal.querySelector("[data-role='tool-compare-panel']");
      const areas = modal.querySelector(".manager-tool-areas");
      const outputPanel = modal.querySelector("[data-role='tool-output']")?.closest("label");
      const settingsRail = modal.querySelector("[data-role='tool-settings-rail']");
      const optionsHost = modal.querySelector("[data-role='tool-options']");
      const specialStage = modal.querySelector("[data-role='tool-special-stage']");
      const compareVisual = modal.querySelector("[data-role='tool-compare-visual']");
      const emojiBrowser = modal.querySelector("[data-role='emoji-browser']");
      const insights = modal.querySelector("[data-role='tool-insights']");
      const commandDeck = modal.querySelector("[data-role='tool-command-deck']");
      const footer = modal.querySelector(".manager-tool-workspace-card > footer");
      const status = modal.querySelector("[data-role='tool-status']");

      card?.setAttribute("data-tool-family", layout.family);
      card?.toggleAttribute("data-wide-settings", layout.wideSettings);

      if (specialStage) {
        specialStage.replaceChildren();
        const specialPanel = optionsHost?.querySelector(".manager-color-picker-panel, .manager-image-text-panel");
        if (layout.specialStage && specialPanel) specialStage.appendChild(specialPanel);
        specialStage.hidden = !specialStage.children.length;
      }

      const hasSettings = Boolean(optionsHost?.children.length);
      if (optionsHost) optionsHost.hidden = !hasSettings;
      if (settingsRail) settingsRail.hidden = !hasSettings;

      if (inputLabel) inputLabel.textContent = layout.comparator ? t("tools.compareLeft") : t("tools.input");
      if (compareLabel) compareLabel.textContent = layout.comparator ? t("tools.compareRight") : t("tools.options.compareText");
      if (inputPanel) inputPanel.hidden = !layout.showInput;
      if (comparePanel) comparePanel.hidden = !layout.showCompare;
      if (outputPanel) outputPanel.hidden = !layout.showOutput;
      if (outputPanel && layout.imageText) outputPanel.querySelector("span").textContent = t("tools.imageText.extracted");
      if (areas) areas.hidden = !(layout.showInput || layout.showCompare || layout.showOutput);
      if (insights) insights.hidden = !layout.showInsights;

      if (emojiBrowser) {
        emojiBrowser.hidden = !layout.showEmoji;
        const search = emojiBrowser.querySelector("[data-role='emoji-search']");
        if (search) {
          const placeholder = layout.specialCharacters ? t("tools.specialCharacters.search") : t("tools.emojiSearch");
          search.placeholder = placeholder;
          search.setAttribute("aria-label", placeholder);
        }
      }

      setButtonVisibility(modal, "tool-example", layout.actions.example);
      setButtonVisibility(modal, "tool-smart", layout.actions.smart);
      setButtonVisibility(modal, "tool-swap", layout.actions.swap);
      setButtonVisibility(modal, "tool-undo", layout.actions.history);
      setButtonVisibility(modal, "tool-redo", layout.actions.history);
      setButtonVisibility(modal, "tool-reset", layout.actions.reset);
      if (commandDeck) commandDeck.hidden = !commandDeck.querySelector("button:not([hidden])");

      ["copy-tool-output", "use-tool-output", "export-tool-output", "capture-tool-output"].forEach((action) => {
        setButtonVisibility(modal, action, layout.footerActions.includes(action));
      });
      if (footer) footer.hidden = layout.footerActions.length === 0;
      if (status) status.hidden = layout.family === "collection" || layout.family === "picker";

      const duplicateHighlight = modal.querySelector("[data-role='duplicate-source-highlight']");
      if (duplicateHighlight && !layout.duplicateDetector) duplicateHighlight.remove();
      const wordReplacerHighlight = modal.querySelector("[data-role='word-replacer-highlight']");
      if (wordReplacerHighlight && toolId !== "variableInjector") wordReplacerHighlight.remove();
      inputPanel?.classList.toggle("is-word-replacer-source", toolId === "variableInjector");

      if (!compareVisual) return layout;
      compareVisual.hidden = !layout.showVisual;
      const leftRender = compareVisual.querySelector("[data-role='compare-left-render']");
      if (leftRender) {
        leftRender.contentEditable = "false";
        delete leftRender.dataset.duplicateBound;
        leftRender.removeAttribute("role");
        leftRender.removeAttribute("aria-multiline");
        leftRender.removeAttribute("tabindex");
        leftRender.removeAttribute("data-placeholder");
      }
      if (layout.comparator) {
        compareVisual.querySelector("[data-role='compare-left-title']").textContent = t("tools.compareLeft");
        compareVisual.querySelector("[data-role='compare-right-title']").textContent = t("tools.compareRight");
      }
      if (!layout.showVisual) {
        compareVisual.querySelector("[data-role='compare-left-render']")?.replaceChildren();
        compareVisual.querySelector("[data-role='compare-right-render']")?.replaceChildren();
      }
      return layout;
    }

    return { describe, reset };
  }

  global.MCP = global.MCP || {};
  global.MCP.createManagerToolLayoutController = createManagerToolLayoutController;
})(globalThis);
