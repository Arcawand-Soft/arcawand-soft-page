(function initGuidedTour(global) {
  const STORAGE_KEY = "ucp_guided_tours_v2";
  const WAIT_TIMEOUT = 12000;
  const ONE_SHOT_SURFACES = new Set([
    "popup", "panel", "manager", "options", "advancedSearch",
    "montage", "toolsCatalog", "toolWorkspace", "sourceTimeline"
  ]);
  const COPY = { switcher: 5, search: 6, library: 7, tools: 8, drive: 9, menu: 10, settings: 11, categories: 12, create: 13, view: 14, montage: 15, language: 16, appearance: 17, behavior: 18, license: 19, backup: 20, privacy: 21, categorySettings: 22, finish: 23, shortcut: 25, manager: 26, screens: 27, confirmations: 28, excluded: 29, localData: 30, captureControls: 31, searchResults: 32, preview: 33, actions: 34, montageSource: 35, montageOrder: 36, toolStage: 37 };
  const DETAIL_GROUPS = {
    switcher: "navigation", search: "navigation", library: "navigation", tools: "navigation", menu: "navigation", manager: "navigation", searchResults: "navigation", preview: "navigation", actions: "navigation", toolStage: "navigation",
    shortcut: "capture", captureControls: "capture", create: "capture",
    categories: "organization", view: "organization", montage: "organization", categorySettings: "organization", montageSource: "organization", montageOrder: "organization",
    drive: "sync", backup: "sync",
    settings: "personalization", language: "personalization", appearance: "personalization", behavior: "personalization", screens: "personalization", confirmations: "personalization", excluded: "personalization", privacy: "personalization",
    license: "account", localData: "account", finish: "account"
  };
  const surfaceSteps = {
    popup: [
      [".popup-shortcut-card", "shortcut"], [".popup-stats", "library"],
      [".popup-recent-tools", "tools"], ["#openPopupSearch", "search"], ["#popupDriveSync", "drive"], ["#openPopupMenu", "menu"], ["#openSidePanel", "manager"]
    ],
    panel: [
      [".mcp-tabs", "switcher"], ["[data-role='search']", "search"], ["[data-role='list']", "library"],
      ["[data-role='drive-quick-sync-host']", "drive"], [".mcp-header-tools-button", "tools"], ["[data-role='floating-menu-button']", "menu"], ["#openSidePanel", "manager"]
    ],
    manager: [
      [".media-tabs", "switcher"], [".category-pane", "categories"], ["#searchInput", "search"],
      ["#textViewModes", "view"], ["#openCreateItemFloating", "create"], ["#openMontage", "montage"], ["#managerDriveQuickSync", "drive"],
      ["#openManagerMenu", "menu", true], ["#managerMoreMenu [data-manager-menu-action='settings']", "settings", true, true]
    ],
    options: [
      [".language-section", "language"], [".appearance-section", "appearance"], ["#behaviorSettingsSection", "behavior"], [".multi-screen-field", "screens"],
      [".license-section", "license"], [".backup-drive-shell", "backup"], ["#editingSettingsTitle", "confirmations"], ["#excludedDomainsTitle", "excluded"],
      ["#textCategoriesTitle", "categorySettings"], [".local-data-section", "localData"]
    ],
    advancedSearch: [
      ["#managerSearchInput", "search"], [".manager-search-results-pane", "searchResults"], [".manager-search-preview-pane", "preview"], ["#managerSearchDetail", "actions"]
    ],
    montage: [
      [".manager-montage-source", "montageSource"], [".manager-montage-chain", "montageOrder"], ["[data-manager-action='open-montage-final-editor']", "montage"]
    ],
    toolsCatalog: [
      [".manager-tools-grid", "tools"]
    ],
    toolWorkspace: [
      [".manager-tool-stage", "toolStage"], [".manager-tool-workspace-card > footer", "actions"]
    ],
    sourceTimeline: [
      [".manager-source-timeline-tabs", "switcher"], [".manager-source-timeline-list", "searchResults"], [".manager-source-timeline-detail", "preview"]
    ]
  };

  const sleep = (ms, signal) => new Promise((resolve) => {
    if (signal?.aborted) {
      resolve();
      return;
    }
    const finish = () => {
      signal?.removeEventListener("abort", cancel);
      resolve();
    };
    const timer = setTimeout(finish, ms);
    const cancel = () => {
      clearTimeout(timer);
      finish();
    };
    signal?.addEventListener("abort", cancel, { once: true });
  });
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
  const currentLanguage = () => String(document.documentElement.dataset.bootLanguage || document.documentElement.lang || "en").toLowerCase();
  const rootFor = (surface) => surface === "panel" ? document.getElementById("mcp-floating-host")?.shadowRoot : document;
  const queryTarget = (surface, selector) => rootFor(surface)?.querySelector(selector) || null;

  async function waitForTarget(surface, selector, signal) {
    const started = Date.now();
    while (!signal?.aborted && Date.now() - started < WAIT_TIMEOUT) {
      const target = queryTarget(surface, selector);
      if (target && !target.hidden && target.getBoundingClientRect().width > 0 && target.getBoundingClientRect().height > 0) return target;
      await sleep(100, signal);
    }
    return null;
  }

  async function completionState() {
    const stored = await chrome.storage.local.get(STORAGE_KEY).catch(() => ({}));
    return stored?.[STORAGE_KEY] || { version: 2, completed: {}, progress: {} };
  }

  async function saveProgress(surface, index) {
    const state = await completionState();
    state.version = 2;
    state.progress = Object.assign({}, state.progress || {}, { [surface]: index });
    await chrome.storage.local.set({ [STORAGE_KEY]: state });
  }

  async function markCompleted(surface) {
    const state = await completionState();
    state.version = 2;
    state.completed = Object.assign({}, state.completed || {}, { [surface]: Date.now() });
    state.progress = Object.assign({}, state.progress || {});
    delete state.progress[surface];
    await chrome.storage.local.set({ [STORAGE_KEY]: state });
  }

  function buildStep(raw) {
    const key = raw[1] || "library";
    return { selector: raw[0], key, copy: COPY[key] ?? COPY.library, detailGroup: DETAIL_GROUPS[key] || "navigation", clickToAdvance: raw[2] === true, preventAction: raw[3] === true };
  }

  function targetLabel(target, fallback) {
    const explicit = target.getAttribute("aria-label") || target.getAttribute("title") || target.getAttribute("placeholder");
    if (String(explicit || "").trim()) return String(explicit).trim();
    const heading = target.matches("h1, h2, h3, strong") ? target : target.querySelector("h1, h2, h3, strong, [data-role$='title']");
    if (String(heading?.textContent || "").trim()) return String(heading.textContent).trim().replace(/\s+/g, " ").slice(0, 72);
    return String(fallback || "").trim() || "Ultimate Clipboard Pro";
  }

  function scrollContainerFor(target) {
    let current = target?.parentElement || target?.getRootNode?.()?.host || null;
    while (current && current !== document.body && current !== document.documentElement) {
      const style = getComputedStyle(current);
      if (/(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight + 2) return current;
      current = current.parentElement || current.getRootNode?.()?.host || null;
    }
    return document.scrollingElement || document.documentElement;
  }

  class GuidedTour {
    constructor(surface) {
      this.surface = surface;
      this.steps = (surfaceSteps[surface] || []).map(buildStep);
      this.index = 0;
      this.target = null;
      this.targetPulse = null;
      this.lifecycleController = new AbortController();
      this.renderToken = 0;
      this.transitionInProgress = false;
      this.onInteraction = this.onInteraction.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
      this.reposition = this.reposition.bind(this);
    }

    locale() { return global.MCP.guidedTourLocale?.(currentLanguage()) || global.MCP.guidedTourLocale?.("en") || []; }

    mount() {
      const l = this.locale();
      this.spotlight = document.createElement("div");
      this.spotlight.id = "ucpGuidedTourSpotlight";
      this.spotlight.className = "ucp-tour-spotlight";
      this.spotlight.setAttribute("aria-hidden", "true");
      this.card = document.createElement("section");
      this.card.id = "ucpGuidedTourCard";
      this.card.className = "ucp-tour-card";
      this.card.setAttribute("role", "dialog");
      this.card.setAttribute("aria-modal", "true");
      this.card.setAttribute("aria-labelledby", "ucpTourTitle");
      this.card.innerHTML = `<div class="ucp-tour-card-head"><span class="ucp-tour-progress"></span><div class="ucp-tour-card-controls"><button type="button" class="ucp-tour-info" data-tour-action="info"><span aria-hidden="true"></span></button><button type="button" class="ucp-tour-exit" data-tour-action="exit"></button></div></div><h2 id="ucpTourTitle" class="ucp-tour-title"></h2><p class="ucp-tour-copy"></p><div class="ucp-tour-actions"><button type="button" data-tour-action="previous"></button><button type="button" class="ucp-tour-primary" data-tour-action="next"></button></div>`;
      this.card.querySelector("[data-tour-action='previous']").textContent = l[1];
      this.card.querySelector("[data-tour-action='exit']").textContent = global.MCP.guidedTourExitLabel?.(currentLanguage()) || "Exit tour";
      const infoLocale = global.MCP.guidedTourInfoLocale?.(currentLanguage()) || global.MCP.guidedTourInfoLocale?.("en");
      this.card.querySelector("[data-tour-action='info']").setAttribute("aria-label", infoLocale?.infoLabel || "More information");
      this.card.querySelector("[data-tour-action='info']").setAttribute("title", infoLocale?.infoLabel || "More information");
      this.card.addEventListener("click", (event) => {
        const action = event.target.closest("[data-tour-action]")?.dataset.tourAction;
        if (action === "previous") this.previous();
        if (action === "next") this.next();
        if (action === "info") this.openInfo();
        if (action === "exit") this.exit();
      });
      document.documentElement.append(this.spotlight, this.card);
      if (this.surface === "options") {
        this.scrollBufferStart = document.createElement("div");
        this.scrollBuffer = document.createElement("div");
        this.scrollBufferStart.setAttribute("aria-hidden", "true");
        this.scrollBuffer.setAttribute("aria-hidden", "true");
        this.scrollBufferStart.style.height = `${Math.max(480, Math.round(innerHeight * 0.7))}px`;
        this.scrollBuffer.style.height = `${Math.max(480, Math.round(innerHeight * 0.7))}px`;
        this.scrollBufferStart.style.pointerEvents = "none";
        this.scrollBuffer.style.pointerEvents = "none";
        document.body.prepend(this.scrollBufferStart);
        document.body.append(this.scrollBuffer);
      }
      document.documentElement.dataset.guidedTourActive = this.surface;
      document.addEventListener("pointerdown", this.onInteraction, true);
      document.addEventListener("click", this.onInteraction, true);
      document.addEventListener("wheel", this.onInteraction, { capture: true, passive: false });
      document.addEventListener("touchmove", this.onInteraction, { capture: true, passive: false });
      document.addEventListener("keydown", this.onKeyDown, true);
      window.addEventListener("resize", this.reposition, { passive: true });
      window.addEventListener("scroll", this.reposition, { passive: true, capture: true });
    }

    async show(index) {
      const renderToken = ++this.renderToken;
      this.transitionInProgress = true;
      this.index = Math.max(0, Math.min(index, this.steps.length - 1));
      const step = this.steps[this.index];
      const target = await waitForTarget(this.surface, step.selector, this.lifecycleController.signal);
      if (renderToken !== this.renderToken) return;
      if (!target) {
        this.transitionInProgress = false;
        if (this.index < this.steps.length - 1) return this.show(this.index + 1);
        return this.finish();
      }
      this.stopTargetPulse();
      this.target?.classList.remove("ucp-tour-target");
      this.target?.style.removeProperty("--ucp-tour-scroll-margin");
      this.target = target;
      await saveProgress(this.surface, this.index);
      if (renderToken !== this.renderToken) return;
      this.target.classList.add("ucp-tour-target");
      const l = this.locale();
      const title = global.MCP.guidedTourTitleLocale?.(currentLanguage(), step.key) || targetLabel(target, l[step.copy]);
      const targetName = targetLabel(target, title);
      this.currentTitle = title;
      this.currentLabel = targetName;
      this.card.querySelector(".ucp-tour-progress").textContent = `${l[0]} · ${this.index + 1}/${this.steps.length}`;
      this.card.querySelector(".ucp-tour-title").textContent = title || l[0];
      this.card.querySelector(".ucp-tour-copy").textContent = step.clickToAdvance ? `${l[step.copy]} ${l[4]}` : l[step.copy];
      this.card.classList.add("has-pointer");
      const previous = this.card.querySelector("[data-tour-action='previous']");
      const next = this.card.querySelector("[data-tour-action='next']");
      previous.hidden = this.index === 0;
      next.hidden = step.clickToAdvance;
      next.textContent = this.index === this.steps.length - 1 ? l[3] : l[2];
      await this.scrollTargetIntoStableView(renderToken);
      if (renderToken !== this.renderToken) return;
      this.reposition();
      await nextFrame();
      await nextFrame();
      if (renderToken !== this.renderToken) return;
      this.reposition();
      this.startTargetPulse();
      if (step.clickToAdvance && typeof target.focus === "function") target.focus({ preventScroll: true });
      else next.focus({ preventScroll: true });
      this.transitionInProgress = false;
    }

    startTargetPulse() {
      this.stopTargetPulse();
      if (!this.target || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      this.target.style.setProperty("will-change", "scale");
      this.targetPulse = this.target.animate(
        [{ scale: "1" }, { scale: "1.014" }, { scale: "1" }],
        { duration: 860, iterations: Infinity, easing: "ease-in-out" }
      );
    }

    stopTargetPulse() {
      this.targetPulse?.cancel();
      this.targetPulse = null;
      this.target?.style.removeProperty("will-change");
    }

    async scrollTargetIntoStableView(renderToken) {
      if (!this.target || renderToken !== this.renderToken) return;
      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (this.surface === "options") {
        const cardRect = this.card.getBoundingClientRect();
        const desiredTop = Math.min(innerHeight - 36, (innerHeight + cardRect.height) / 2 + 34);
        this.target.style.setProperty("--ucp-tour-scroll-margin", `${Math.round(desiredTop)}px`);
        this.target.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
      } else {
        this.target.scrollIntoView({
          block: "center",
          inline: "nearest",
          behavior: reducedMotion ? "auto" : "smooth"
        });
      }
      if (this.surface !== "options") {
        await sleep(reducedMotion ? 40 : 180, this.lifecycleController.signal);
        return;
      }
      await nextFrame();
      await nextFrame();
      if (renderToken !== this.renderToken) return;
      const targetRect = this.target.getBoundingClientRect();
      const cardRect = this.card.getBoundingClientRect();
      const desiredTop = Math.min(innerHeight - 36, (innerHeight + cardRect.height) / 2 + 34);
      const delta = targetRect.top - desiredTop;
      const scroller = scrollContainerFor(this.target);
      if (Math.abs(delta) > 1) {
        if (scroller === document.scrollingElement || scroller === document.documentElement || scroller === document.body) {
          window.scrollBy({ top: delta, behavior: "auto" });
        } else {
          scroller.scrollTop += delta;
        }
      }
      await nextFrame();
      await nextFrame();
    }

    openInfo() {
      if (this.infoOverlay) return;
      const step = this.steps[this.index];
      const l = this.locale();
      const info = global.MCP.guidedTourInfoLocale?.(currentLanguage()) || global.MCP.guidedTourInfoLocale?.("en");
      if (!info) return;
      const targetName = this.currentLabel || targetLabel(this.target, l[step.copy]);
      this.infoReturnFocus = document.activeElement;
      this.infoOverlay = document.createElement("div");
      this.infoOverlay.id = "ucpGuidedTourInfoOverlay";
      this.infoOverlay.className = "ucp-tour-info-overlay";
      this.infoOverlay.innerHTML = `<section id="ucpGuidedTourInfoDialog" class="ucp-tour-info-dialog" role="dialog" aria-modal="true" aria-labelledby="ucpTourInfoTitle"><div class="ucp-tour-info-header"><div class="ucp-tour-info-heading"><span class="ucp-tour-info-emblem" aria-hidden="true"></span><div><span class="ucp-tour-info-eyebrow"></span><h2 id="ucpTourInfoTitle"></h2></div></div><button type="button" class="ucp-tour-info-close" data-tour-info-close>&times;</button></div><div class="ucp-tour-info-content"><section><strong data-tour-info-label="what"></strong><p data-tour-info-copy="what"></p></section><section><strong data-tour-info-label="why"></strong><p data-tour-info-copy="why"></p></section><section><strong data-tour-info-label="how"></strong><p data-tour-info-copy="how"></p></section><aside><strong data-tour-info-label="tip"></strong><p data-tour-info-copy="tip"></p></aside></div></section>`;
      this.infoOverlay.querySelector(".ucp-tour-info-eyebrow").textContent = info.eyebrow;
      this.infoOverlay.querySelector("#ucpTourInfoTitle").textContent = this.currentTitle || targetName;
      const close = this.infoOverlay.querySelector("[data-tour-info-close]");
      close.setAttribute("aria-label", info.closeLabel);
      close.setAttribute("title", info.closeLabel);
      for (const key of ["what", "why", "how", "tip"]) this.infoOverlay.querySelector(`[data-tour-info-label="${key}"]`).textContent = info[`${key}Label`];
      const detail = info.details?.[step.key];
      this.infoOverlay.querySelector('[data-tour-info-copy="what"]').textContent = detail?.what || l[step.copy];
      this.infoOverlay.querySelector('[data-tour-info-copy="why"]').textContent = detail?.why || info.groups?.[step.detailGroup] || info.groups?.navigation;
      this.infoOverlay.querySelector('[data-tour-info-copy="how"]').textContent = detail?.how || targetName;
      this.infoOverlay.querySelector('[data-tour-info-copy="tip"]').textContent = detail?.tip || info.tipText;
      this.infoOverlay.addEventListener("click", (event) => {
        if (event.target.closest("[data-tour-info-close]")) this.closeInfo();
      });
      this.card.setAttribute("aria-hidden", "true");
      document.documentElement.append(this.infoOverlay);
      close.focus({ preventScroll: true });
    }

    closeInfo() {
      if (!this.infoOverlay) return;
      this.infoOverlay.remove();
      this.infoOverlay = null;
      this.card?.removeAttribute("aria-hidden");
      this.infoReturnFocus?.focus?.({ preventScroll: true });
      this.infoReturnFocus = null;
    }

    reposition() {
      if (!this.target?.isConnected || !this.card) return;
      const r = this.target.getBoundingClientRect();
      const pad = 7;
      Object.assign(this.spotlight.style, { left: `${Math.max(4, r.left - pad)}px`, top: `${Math.max(4, r.top - pad)}px`, width: `${Math.max(20, Math.min(innerWidth - 8, r.width + pad * 2))}px`, height: `${Math.max(20, Math.min(innerHeight - 8, r.height + pad * 2))}px` });
      const cardRect = this.card.getBoundingClientRect();
      const gap = 18;
      const fitsBottom = r.bottom + gap + cardRect.height <= innerHeight - 12;
      const fitsTop = r.top - gap - cardRect.height >= 12;
      const fitsRight = r.right + gap + cardRect.width <= innerWidth - 12;
      const fitsLeft = r.left - gap - cardRect.width >= 12;
      let placement = fitsBottom ? "bottom" : fitsTop ? "top" : fitsRight ? "right" : fitsLeft ? "left" : (r.top > innerHeight - r.bottom ? "top" : "bottom");
      let top = placement === "bottom" ? r.bottom + gap : placement === "top" ? r.top - cardRect.height - gap : r.top + (r.height - cardRect.height) / 2;
      let left = placement === "right" ? r.right + gap : placement === "left" ? r.left - cardRect.width - gap : r.left + (r.width - cardRect.width) / 2;
      if (this.surface === "options") {
        top = Math.round((innerHeight - cardRect.height) / 2);
        left = r.left + (r.width - cardRect.width) / 2;
        placement = r.top >= top + cardRect.height / 2 ? "top" : "bottom";
      }
      left = Math.max(12, Math.min(innerWidth - cardRect.width - 12, left));
      top = Math.max(12, Math.min(innerHeight - cardRect.height - 12, top));
      this.card.dataset.placement = placement;
      this.card.style.left = `${left}px`;
      this.card.style.top = `${top}px`;
      const arrowOffset = placement === "left" || placement === "right"
        ? Math.max(18, Math.min(cardRect.height - 30, r.top + r.height / 2 - top - 9))
        : Math.max(18, Math.min(cardRect.width - 30, r.left + r.width / 2 - left - 12));
      this.card.style.setProperty("--tour-arrow", `${arrowOffset}px`);
    }

    onInteraction(event) {
      if (this.infoOverlay?.contains(event.target)) return;
      if (this.card?.contains(event.target)) {
        if (event.type === "wheel" || event.type === "touchmove") event.preventDefault();
        return;
      }
      const step = this.steps[this.index];
      const insideTarget = this.target && (event.composedPath?.().includes(this.target) || this.target.contains?.(event.target));
      if (insideTarget && step.clickToAdvance && event.type === "pointerdown") return;
      if (insideTarget && step.clickToAdvance && event.type === "click") {
        if (step.preventAction) { event.preventDefault(); event.stopImmediatePropagation(); }
        void sleep(60, this.lifecycleController.signal).then(() => {
          if (!this.lifecycleController.signal.aborted) this.next();
        });
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    onKeyDown(event) {
      if (this.infoOverlay) {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.closeInfo();
          return;
        }
        if (event.key === "Tab") {
          event.preventDefault();
          this.infoOverlay.querySelector("[data-tour-info-close]")?.focus({ preventScroll: true });
        }
        event.stopImmediatePropagation();
        return;
      }
      const step = this.steps[this.index];
      const insideTarget = this.target && (event.composedPath?.().includes(this.target) || this.target.contains?.(event.target));
      if (insideTarget && step.clickToAdvance && (event.key === "Enter" || event.key === " ")) return;
      if (event.key === "Tab") {
        const controls = Array.from(this.card.querySelectorAll("button:not([hidden])"));
        const current = controls.indexOf(document.activeElement);
        event.preventDefault();
        controls[(current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus();
        return;
      }
      if (!this.card.contains(event.target)) { event.preventDefault(); event.stopImmediatePropagation(); }
    }

    previous() { if (!this.transitionInProgress && this.index > 0) void this.show(this.index - 1); }
    next() { if (this.transitionInProgress) return; if (this.index >= this.steps.length - 1) return this.finish(); void this.show(this.index + 1); }

    async exit() {
      await markCompleted(this.surface);
      this.destroy();
    }

    async finish() {
      await markCompleted(this.surface);
      this.destroy();
    }

    destroy() {
      this.lifecycleController.abort();
      this.renderToken += 1;
      this.transitionInProgress = false;
      this.closeInfo();
      this.stopTargetPulse();
      this.target?.classList.remove("ucp-tour-target");
      this.target?.style.removeProperty("--ucp-tour-scroll-margin");
      this.spotlight?.remove();
      this.card?.remove();
      this.scrollBufferStart?.remove();
      this.scrollBuffer?.remove();
      delete document.documentElement.dataset.guidedTourActive;
      document.removeEventListener("pointerdown", this.onInteraction, true);
      document.removeEventListener("click", this.onInteraction, true);
      document.removeEventListener("wheel", this.onInteraction, true);
      document.removeEventListener("touchmove", this.onInteraction, true);
      document.removeEventListener("keydown", this.onKeyDown, true);
      window.removeEventListener("resize", this.reposition);
      window.removeEventListener("scroll", this.reposition, true);
      global.MCP.releaseGuidedTourRuntime?.(this.surface);
    }
  }

  async function startGuidedTour(surface) {
    if (!surfaceSteps[surface]?.length || document.documentElement.dataset.guidedTourActive || document.documentElement.dataset.guidedTourStarting) return null;
    document.documentElement.dataset.guidedTourStarting = surface;
    try {
      const state = await completionState();
      if (state.completed?.[surface] || document.documentElement.dataset.guidedTourActive) return null;
      if (Number.isInteger(state.progress?.[surface])) {
        await markCompleted(surface);
        return null;
      }
      if (ONE_SHOT_SURFACES.has(surface)) await markCompleted(surface);
      const tour = new GuidedTour(surface);
      tour.mount();
      await tour.show(Number.isInteger(state.progress?.[surface]) ? state.progress[surface] : 0);
      return tour;
    } finally {
      delete document.documentElement.dataset.guidedTourStarting;
    }
  }

  global.MCP = global.MCP || {};
  global.MCP.__startGuidedTourRuntime = startGuidedTour;
  global.MCP.GUIDED_TOUR_STORAGE_KEY = STORAGE_KEY;
})(globalThis);
