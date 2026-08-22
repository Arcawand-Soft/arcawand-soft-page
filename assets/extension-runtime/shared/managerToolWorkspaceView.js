(function initManagerToolWorkspaceView(global) {
  "use strict";

  function createManagerToolWorkspaceView(options = {}) {
    const {
      runActiveTool = () => {},
      syncColorFields = () => {},
      updateWordReplacerHighlight = () => {},
      scheduleStateSave = () => {},
      renderSpecialCharacters = () => {},
      renderEmojiPicker = () => {}
    } = options;

    function ensure() {
      let modal = document.getElementById("managerToolWorkspaceModal");
      if (modal) {
        modal._managerToolReturnFocus = document.activeElement;
        return modal;
      }
      modal = document.createElement("div");
      modal.id = "managerToolWorkspaceModal";
      modal.className = "manager-modal manager-tool-workspace-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-tool-workspace\"></div>",
        "<section class=\"manager-tool-workspace-card\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"managerToolWorkspaceTitle\" aria-describedby=\"managerToolWorkspaceDescription\">",
        "<header class=\"manager-tool-workspace-head\"><div class=\"manager-tool-identity\"><span class=\"manager-tool-icon-shell\"><img data-role=\"tool-icon\" alt=\"\" aria-hidden=\"true\"></span><div><strong id=\"managerToolWorkspaceTitle\" data-role=\"tool-title\"></strong><p id=\"managerToolWorkspaceDescription\" data-role=\"tool-description\"></p></div></div><div class=\"manager-tool-head-actions\"><button type=\"button\" class=\"manager-tool-info-button\" data-manager-action=\"open-tool-info\">?</button><button type=\"button\" class=\"manager-tool-close-button\" data-manager-action=\"close-tool-workspace\"></button></div></header>",
        "<section class=\"manager-tool-command-deck\" data-role=\"tool-command-deck\"><div class=\"manager-tool-command-actions is-primary-actions\"><button type=\"button\" data-manager-action=\"tool-example\"></button><button type=\"button\" class=\"is-smart\" data-manager-action=\"tool-smart\"></button><button type=\"button\" data-manager-action=\"tool-swap\"></button></div><div class=\"manager-tool-command-actions is-history-actions\"><button type=\"button\" data-manager-action=\"tool-undo\">&#8630;</button><button type=\"button\" data-manager-action=\"tool-redo\">&#8631;</button><button type=\"button\" data-manager-action=\"tool-reset\"></button></div></section>",
        "<div class=\"manager-tool-stage\"><aside class=\"manager-tool-settings-rail\" data-role=\"tool-settings-rail\"><strong data-role=\"tool-settings-title\"></strong><div class=\"manager-tool-options\" data-role=\"tool-options\"></div></aside><main class=\"manager-tool-canvas\"><section class=\"manager-tool-special-stage\" data-role=\"tool-special-stage\" hidden></section><section class=\"manager-emoji-browser\" data-role=\"emoji-browser\" data-emoji-category=\"all\" hidden><div class=\"manager-emoji-toolbar\"><label class=\"manager-emoji-search\"><span aria-hidden=\"true\">⌕</span><input data-role=\"emoji-search\" type=\"search\"></label><output data-role=\"emoji-count\" aria-live=\"polite\"></output></div><div class=\"manager-emoji-atlas-body\" data-role=\"emoji-atlas-body\"><nav class=\"manager-emoji-categories\" data-role=\"emoji-categories\"></nav><div class=\"manager-emoji-viewport\"><div class=\"manager-emoji-grid\" data-role=\"emoji-grid\"></div><div class=\"manager-emoji-empty\" data-role=\"emoji-empty\" role=\"status\" hidden><span aria-hidden=\"true\">⌕</span><strong></strong></div></div></div></section><div class=\"manager-tool-areas\"><label><span data-role=\"tool-input-label\"></span><textarea data-role=\"tool-input\"></textarea></label><label data-role=\"tool-compare-panel\"><span data-role=\"tool-compare-label\"></span><textarea data-role=\"tool-compare-input\"></textarea></label><label><span data-role=\"tool-output-label\"></span><textarea data-role=\"tool-output\" readonly></textarea></label></div><section class=\"manager-tool-compare-visual\" data-role='tool-compare-visual' hidden><div class=\"manager-tool-compare-visual-grid\"><article><strong data-role=\"compare-left-title\"></strong><div class=\"manager-tool-compare-render\" data-role=\"compare-left-render\"></div></article><article><strong data-role=\"compare-right-title\"></strong><div class=\"manager-tool-compare-render\" data-role=\"compare-right-render\"></div></article></div></section><div class=\"manager-tool-insights\" data-role=\"tool-insights\"></div></main></div>",
        "<div class=\"manager-tool-live-status\" data-role=\"tool-status\" aria-live=\"polite\"></div>",
        "<footer><button type=\"button\" class=\"primary\" data-manager-action=\"copy-tool-output\"></button><button type=\"button\" data-manager-action=\"use-tool-output\"></button><button type=\"button\" data-manager-action=\"export-tool-output\"></button><button type=\"button\" data-manager-action=\"capture-tool-output\"></button></footer>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
      modal._managerToolReturnFocus = document.activeElement;
      bind(modal);
      return modal;
    }

    function bind(modal) {
      modal.querySelector("[data-role='tool-input']").addEventListener("input", () => handlePrimaryInput(modal));
      modal.querySelector("[data-role='tool-compare-input']").addEventListener("input", () => runActiveTool({ silent: true }));
      const optionContainer = modal.querySelector("[data-role='tool-options']");
      const specialStage = modal.querySelector("[data-role='tool-special-stage']");
      ["input", "change"].forEach((eventName) => {
        optionContainer.addEventListener(eventName, (event) => handleOptionInput(modal, event.target));
        specialStage.addEventListener(eventName, (event) => handleOptionInput(modal, event.target));
      });
      modal.querySelector("[data-role='emoji-search']").addEventListener("input", () => {
        if (modal.dataset.toolId === "longTextSplitter") renderSpecialCharacters(modal);
        else renderEmojiPicker(modal);
        scheduleStateSave(modal);
      });
      modal.querySelector(".manager-tool-workspace-card").addEventListener("keydown", (event) => {
        if (!(event.ctrlKey || event.metaKey) || event.key !== "Enter") return;
        event.preventDefault();
        runActiveTool({ silent: false });
      });
    }

    function handlePrimaryInput(modal) {
      if (modal.dataset.toolId === "variableInjector") {
        updateWordReplacerHighlight(modal);
        scheduleStateSave(modal);
        return;
      }
      runActiveTool({ silent: true });
    }

    function handleOptionInput(modal, target) {
      syncColorFields(modal, target);
      handlePrimaryInput(modal);
    }

    function close() {
      const modal = document.getElementById("managerToolWorkspaceModal");
      if (!modal) return;
      modal.hidden = true;
      const returnFocus = modal._managerToolReturnFocus;
      if (returnFocus?.isConnected && typeof returnFocus.focus === "function") {
        requestAnimationFrame(() => returnFocus.focus({ preventScroll: true }));
      }
    }

    return { ensure, close };
  }

  global.MCP = global.MCP || {};
  global.MCP.createManagerToolWorkspaceView = createManagerToolWorkspaceView;
})(globalThis);
