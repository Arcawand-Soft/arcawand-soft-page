(function initSurfaceBoot() {
  const script = document.currentScript;
  const surface = String(script?.dataset?.surface || "");
  const entryBySurface = {
    popup: "popup/popup.js",
    manager: "sidepanel/sidepanel.js",
    options: "options/options.js",
    welcome: "welcome/welcome.js",
    premium: "welcome/premiumHost.js"
  };
  const entry = entryBySurface[surface];
  if (!entry) return;

  const supportedLanguages = new Set([
    "en", "fr", "de", "es", "it", "ro", "pt", "ar",
    "zh", "ja", "ru", "nl", "pl", "tr", "ko", "hi"
  ]);
  const scriptLoads = new Map();
  const loadedLanguages = new Set();
  const loadScript = (path) => {
    if (scriptLoads.has(path)) return scriptLoads.get(path);
    const task = new Promise((resolve, reject) => {
    const node = document.createElement("script");
    node.src = chrome.runtime.getURL(path);
    node.async = true;
    node.addEventListener("load", resolve, { once: true });
    node.addEventListener("error", () => reject(new Error(`Unable to load ${path}`)), { once: true });
    document.head.appendChild(node);
    });
    scriptLoads.set(path, task);
    return task;
  };

  const ensureLocaleLoaded = async (requestedLanguage = "en") => {
    const normalized = String(requestedLanguage || "en").toLowerCase();
    const language = supportedLanguages.has(normalized) ? normalized : "en";
    if (!loadedLanguages.has("en")) {
      await loadScript("shared/locales/en.js");
      loadedLanguages.add("en");
    }
    if (!loadedLanguages.has(language)) {
      await loadScript(`shared/locales/${language}.js`);
      loadedLanguages.add(language);
    }
    globalThis.MCP?.applyCryptoWarningLocales?.();
    globalThis.MCP?.applyToolUpgradeLocales?.();
    return language;
  };

  const boot = async () => {
    performance.mark(`ucp-${surface}-boot-start`);
    const stored = await chrome.storage.local.get("mcp_settings").catch(() => ({}));
    const requestedLanguage = String(stored?.mcp_settings?.language || "en").toLowerCase();
    const language = supportedLanguages.has(requestedLanguage) ? requestedLanguage : "en";
    document.documentElement.dataset.bootLanguage = language;

    await loadScript("shared/constants.js");
    await loadScript("shared/utils.js");
    await loadScript("shared/previewAutoScroll.js");
    await loadScript("shared/metaOverflowMarquee.js");
    await loadScript("shared/security.js");
    await loadScript("shared/textVisuals.js");
    if (surface === "welcome") await loadScript("shared/backup.js");
    await ensureLocaleLoaded(language);
    await loadScript("shared/cryptoWarningLocales.js");
    await loadScript("shared/locales/categorySlugs.js");
    await loadScript("shared/i18n.js");
    await loadScript("shared/licenseActivationErrors.js");
    await loadScript("shared/dialogKeyboard.js");
    if (surface !== "welcome" && surface !== "premium") await loadScript("shared/guidedTourLoader.js");
    globalThis.MCP.ensureLocaleLoaded = ensureLocaleLoaded;

    await loadScript("shared/dodoConfig.js");
    await loadScript("shared/vendor/tweetnacl/nacl.min.js");
    await loadScript("shared/licenseConfig.js");
    await loadScript("shared/licenseToken.js");

    if (surface === "premium") {
      await Promise.all([
        loadScript("shared/premiumPricing.js"),
        loadScript("shared/featureGate.js")
      ]);
      await loadScript("shared/managerPremium.js");
      await loadScript(entry);
      document.documentElement.dataset.surfaceReady = "true";
      performance.mark(`ucp-${surface}-boot-ready`);
      performance.measure(`ucp-${surface}-boot`, `ucp-${surface}-boot-start`, `ucp-${surface}-boot-ready`);
      return;
    }

    if (surface === "welcome") {
      // The presentation uses the real floating-panel renderer. Declare preview
      // mode and hydrate that renderer before welcome.js can expose any slide;
      // otherwise its slot remains visibly empty until the 1.2 MB engine arrives.
      window.__UCP_WELCOME_FLOATING_PREVIEW__ = true;
      window.__UCP_WELCOME_FLOATING_PREVIEW_VISIBLE__ = false;
      await Promise.all([
        loadScript("shared/defaultCategories.js"),
        loadScript("shared/defaultImageCategories.js"),
        loadScript("shared/defaultDevCategories.js")
      ]);
      await loadScript("welcome/welcomeLocales.js");
      await loadScript("welcome/welcomeTourLocales.js");
      await Promise.all([
        loadScript("welcome/welcomeTourLocalesA.js"),
        loadScript("welcome/welcomeTourLocalesB.js"),
        loadScript("welcome/welcomeTourLocalesC.js")
      ]);
      await loadScript("welcome/welcomeFidelityLocales.js");
      await loadScript("welcome/licenseActivationErrorLocales.js");
      await loadScript("welcome/welcomeFeatureDemoData.js");
      await loadScript("shared/welcomePreview.js");
      await Promise.all([
        loadScript("shared/aiCopyAdapters.js"),
        loadScript("shared/captureDedupe.js"),
        loadScript("shared/pageMarkdownCapture.js"),
        loadScript("shared/quickSettingsMenu.js")
      ]);
      await loadScript("content/contentScript.js");
      await loadScript(entry);
      await loadScript("shared/driveLiveSyncClient.js");
      document.documentElement.dataset.surfaceReady = "true";
      performance.mark(`ucp-${surface}-boot-ready`);
      performance.measure(`ucp-${surface}-boot`, `ucp-${surface}-boot-start`, `ucp-${surface}-boot-ready`);
      return;
    }

    await Promise.all([
      loadScript("shared/premiumPricing.js"),
      loadScript("shared/featureGate.js"),
      loadScript("shared/search.js"),
      surface === "options" ? loadScript("shared/backup.js") : Promise.resolve(),
      loadScript("shared/defaultCategories.js"),
      loadScript("shared/defaultImageCategories.js"),
      loadScript("shared/defaultDevCategories.js"),
      loadScript("shared/codeDetector.js"),
      loadScript("shared/cryptoSensitiveDetector.js"),
      loadScript("shared/sourceLocators.js"),
      loadScript("shared/settingsRepository.js"),
      loadScript("shared/snippetTemplateRepository.js"),
      surface !== "options" ? loadScript("shared/quickSettingsMenu.js") : Promise.resolve()
    ]);
    if (globalThis.__UCP_DEMO_FORCE_PRO__) globalThis.UCP_DEMO_RUNTIME?.forceDemoProRuntime?.();
    if (surface === "manager") await loadScript("shared/classifier.js");
    await loadScript("shared/storage.js");
    if (surface === "options") {
      await loadScript("shared/localStorageInsights.js");
      await loadScript("shared/driveWorkspace.js");
      await loadScript("shared/driveSync.js");
    }
    await loadScript("shared/licenseManager.js");
    if (surface === "popup" || surface === "manager") await loadScript("shared/toolMetadata.js");
    await loadScript("shared/driveQuickSyncControl.js");
    if (surface !== "options") await loadScript("shared/clipboard.js");
    if (surface === "manager") await loadScript("shared/pageMarkdownCapture.js");
    if (surface === "manager") {
      await loadScript("shared/extensionPageImageTextCapture.js");
      await loadScript("shared/managerPremium.js");
      await loadScript("shared/managerToolsCatalog.js");
      await loadScript("shared/managerToolHistory.js");
      await loadScript("shared/managerToolState.js");
      await loadScript("shared/managerToolLayout.js");
      await loadScript("shared/managerToolWorkspaceView.js");
      await loadScript("shared/managerToolCommands.js");
      await loadScript("shared/managerToolCollectionRenderers.js");
    }
    await loadScript(entry);
    await loadScript("shared/driveLiveSyncClient.js");
    document.documentElement.dataset.surfaceReady = "true";
    window.setTimeout(() => globalThis.MCP?.startGuidedTour?.(surface), 0);
    performance.mark(`ucp-${surface}-boot-ready`);
    performance.measure(`ucp-${surface}-boot`, `ucp-${surface}-boot-start`, `ucp-${surface}-boot-ready`);
  };

  boot().catch((error) => {
    console.error("[Ultimate Clipboard Pro] Surface boot failed", error);
    document.documentElement.dataset.surfaceBootFailed = "true";
  });
})();
