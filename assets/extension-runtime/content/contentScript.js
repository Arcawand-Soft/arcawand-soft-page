(function initContentScript() {
  const CONTENT_BOOT_VERSION = "1.0.5";
  if (window.__ULTIMATE_CLIPBOARD_PRO_CONTENT_ACTIVE__ === CONTENT_BOOT_VERSION) return;
  if (window.__ULTIMATE_CLIPBOARD_PRO_CONTENT_ACTIVE__) {
    window.__UCP_CONTENT_LIFECYCLE_CLEANUP__?.();
    document.getElementById("ucp-demo-floating-host")?.remove();
    window.__UCP_GLOBAL_TOOL_SELECTION_CLEANUP__?.();
    document.getElementById("mcp-global-tool-selection-host")?.remove();
  }
  window.__ULTIMATE_CLIPBOARD_PRO_CONTENT_ACTIVE__ = CONTENT_BOOT_VERSION;
  const contentLifecycleCleanups = [];
  let contentContextDisposed = false;

  function listenUntilContentContextEnds(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    contentLifecycleCleanups.push(() => target.removeEventListener(type, listener, options));
  }

  function disposeContentContext() {
    if (contentContextDisposed) return;
    contentContextDisposed = true;
    contentLifecycleCleanups.splice(0).forEach((cleanup) => cleanup());
    window.__UCP_GLOBAL_TOOL_SELECTION_CLEANUP__?.();
    document.getElementById("ucp-demo-floating-host")?.remove();
    document.getElementById("mcp-global-tool-selection-host")?.remove();
    if (window.__UCP_CONTENT_LIFECYCLE_CLEANUP__ === disposeContentContext) {
      delete window.__UCP_CONTENT_LIFECYCLE_CLEANUP__;
    }
  }

  function hasLiveExtensionContext() {
    try {
      return !contentContextDisposed && Boolean(globalThis.chrome?.runtime?.id);
    } catch (error) {
      return false;
    }
  }

  window.__UCP_CONTENT_LIFECYCLE_CLEANUP__ = disposeContentContext;

  const MESSAGE_TYPES = {
    COPY_DETECTED: "MCP_COPY_DETECTED",
    COMMIT_DEV_CAPTURE: "MCP_COMMIT_DEV_CAPTURE",
    FORCE_TEXT_CAPTURE: "MCP_FORCE_TEXT_CAPTURE",
    CONFIRM_CRYPTO_SENSITIVE_CAPTURE: "MCP_CONFIRM_CRYPTO_SENSITIVE_CAPTURE",
    CAPTURE_PAGE_MARKDOWN: "MCP_CAPTURE_PAGE_MARKDOWN",
    PAGE_MARKDOWN_CAPTURED: "MCP_PAGE_MARKDOWN_CAPTURED",
    IMAGE_DETECTED: "MCP_IMAGE_DETECTED",
    IMAGE_CAPTURE_STARTED: "MCP_IMAGE_CAPTURE_STARTED",
    IMAGE_CAPTURE_CANCELLED: "MCP_IMAGE_CAPTURE_CANCELLED",
    ITEM_SAVED: "MCP_ITEM_SAVED",
    GET_STATE: "MCP_GET_STATE",
    GET_PAGE_ZOOM: "MCP_GET_PAGE_ZOOM",
    PAGE_ZOOM_CHANGED: "MCP_PAGE_ZOOM_CHANGED",
    CHECK_DISPLAY_ALLOWED: "MCP_CHECK_DISPLAY_ALLOWED",
    COPY_ITEM: "MCP_COPY_ITEM",
    UPDATE_ITEM: "MCP_UPDATE_ITEM",
    UPDATE_IMAGE_ITEM: "MCP_UPDATE_IMAGE_ITEM",
    DELETE_ITEM: "MCP_DELETE_ITEM",
    DELETE_ITEM_VERSION: "MCP_DELETE_ITEM_VERSION",
    DELETE_IMAGE_ITEM: "MCP_DELETE_IMAGE_ITEM",
    UPDATE_DEV_ITEM: "MCP_UPDATE_DEV_ITEM",
    DELETE_DEV_ITEM: "MCP_DELETE_DEV_ITEM",
    DELETE_DEV_VERSION: "MCP_DELETE_DEV_VERSION",
    CREATE_DEV_CATEGORY: "MCP_CREATE_DEV_CATEGORY",
    CREATE_CATEGORY: "MCP_CREATE_CATEGORY",
    CREATE_IMAGE_CATEGORY: "MCP_CREATE_IMAGE_CATEGORY",
    OPEN_SIDE_PANEL: "MCP_OPEN_SIDE_PANEL",
    OPEN_NATIVE_SIDE_PANEL: "MCP_OPEN_NATIVE_SIDE_PANEL",
    TOGGLE_NATIVE_SIDE_PANEL: "MCP_TOGGLE_NATIVE_SIDE_PANEL",
    CLOSE_NATIVE_SIDE_PANEL: "MCP_CLOSE_NATIVE_SIDE_PANEL",
    OPEN_MANAGER: "MCP_OPEN_MANAGER",
    CLOSE_FLOATING_PANEL: "MCP_CLOSE_FLOATING_PANEL",
    OPEN_OPTIONS: "MCP_OPEN_OPTIONS",
    OPEN_WELCOME_PAGE: "MCP_OPEN_WELCOME_PAGE",
    OPEN_ONBOARDING: "MCP_OPEN_ONBOARDING",
    OPEN_FLOATING_PANEL: "MCP_OPEN_FLOATING_PANEL",
    OPEN_SEARCH_OVERLAY: "MCP_OPEN_SEARCH_OVERLAY",
    OPEN_TOOLS_OVERLAY: "MCP_OPEN_TOOLS_OVERLAY",
    OPEN_IMAGE_INFO: "MCP_OPEN_IMAGE_INFO",
    OPEN_FOREGROUND_SURFACE: "MCP_OPEN_FOREGROUND_SURFACE",
    START_COLOR_PICKER: "MCP_START_COLOR_PICKER",
    START_IMAGE_TEXT_CAPTURE: "MCP_START_IMAGE_TEXT_CAPTURE",
    GET_TOOL_SELECTION_MODE: "MCP_GET_TOOL_SELECTION_MODE",
    TOOL_SELECTION_MODE_CHANGED: "MCP_TOOL_SELECTION_MODE_CHANGED",
    CANCEL_TOOL_SELECTION_MODE: "MCP_CANCEL_TOOL_SELECTION_MODE",
    COMPLETE_TOOL_SELECTION_MODE: "MCP_COMPLETE_TOOL_SELECTION_MODE",
    TOOL_SELECTION_RESULT: "MCP_TOOL_SELECTION_RESULT",
    OPEN_SOURCE_ITEM: "MCP_OPEN_SOURCE_ITEM",
    OPEN_SOURCE_IMAGE: "MCP_OPEN_SOURCE_IMAGE",
    CAPTURE_SOURCE_LOCATOR: "MCP_CAPTURE_SOURCE_LOCATOR",
    OPEN_EDITOR_FOR_ITEM: "MCP_OPEN_EDITOR_FOR_ITEM",
    OPEN_CLASSIFIER_FOR_ITEM: "MCP_OPEN_CLASSIFIER_FOR_ITEM",
    HIGHLIGHT_SOURCE_TEXT: "MCP_HIGHLIGHT_SOURCE_TEXT",
    HIGHLIGHT_SOURCE_IMAGE: "MCP_HIGHLIGHT_SOURCE_IMAGE",
    FETCH_IMAGE_AS_DATA_URL: "MCP_FETCH_IMAGE_AS_DATA_URL",
    CAPTURE_VISIBLE_TAB: "MCP_CAPTURE_VISIBLE_TAB",
    RUN_OCR: "MCP_RUN_OCR",
    ENSURE_BACKUP_RUNTIME: "MCP_ENSURE_BACKUP_RUNTIME",
    DRIVE_GET_STATUS: "MCP_DRIVE_GET_STATUS",
    DRIVE_ANALYZE_RESTORE_FROM_DRIVE: "MCP_DRIVE_ANALYZE_RESTORE_FROM_DRIVE",
    DRIVE_RESTORE_FROM_DRIVE: "MCP_DRIVE_RESTORE_FROM_DRIVE",
    DODO_OPEN_CHECKOUT: "MCP_DODO_OPEN_CHECKOUT",
    STORAGE_REFRESH_REQUIRED: "STORAGE_REFRESH_REQUIRED",
    SHOW_ABOUT: "MCP_SHOW_ABOUT",
    SHOW_FAQ: "MCP_SHOW_FAQ",
    SHOW_PRIVACY: "MCP_SHOW_PRIVACY",
    SHOW_PRO_UPGRADE: "MCP_SHOW_PRO_UPGRADE",
    SHOW_CAPTURE_LIMIT: "MCP_SHOW_CAPTURE_LIMIT"
  };
  const PAGE_ONLY_FOREGROUND_MESSAGE_TYPES = new Set([
    MESSAGE_TYPES.SHOW_ABOUT,
    MESSAGE_TYPES.SHOW_FAQ,
    MESSAGE_TYPES.SHOW_PRIVACY,
    MESSAGE_TYPES.SHOW_PRO_UPGRADE,
    MESSAGE_TYPES.OPEN_SEARCH_OVERLAY,
    MESSAGE_TYPES.OPEN_TOOLS_OVERLAY,
    MESSAGE_TYPES.OPEN_IMAGE_INFO
  ]);
  const REFRESH_EVENTS = new Set([
    "ITEM_CREATED",
    "ITEM_UPDATED",
    "ITEM_DELETED",
    "ITEM_CATEGORY_CHANGED",
    "ITEM_FAVORITE_CHANGED",
    "ITEM_PINNED_CHANGED",
    "ITEM_TAGS_CHANGED",
    "IMAGE_SAVED",
    "IMAGE_CREATED",
    "IMAGE_UPDATED",
    "IMAGE_DELETED",
    "IMAGE_CATEGORY_CHANGED",
    "IMAGE_FAVORITE_CHANGED",
    "IMAGE_PINNED_CHANGED",
    "IMAGE_CATEGORIES_UPDATED",
    "DEV_SAVED",
    "DEV_CREATED",
    "DEV_UPDATED",
    "DEV_DELETED",
    "DEV_CATEGORY_CHANGED",
    "DEV_FAVORITE_CHANGED",
    "DEV_PINNED_CHANGED",
    "DEV_CATEGORIES_UPDATED",
    "CATEGORIES_UPDATED",
    "LANGUAGE_CHANGED",
    "SEARCH_INDEX_UPDATED",
    "STORAGE_REFRESH_REQUIRED"
  ]);
  const LOCAL_STORAGE_KEYS = new Set([
    "mcp_clipboard_items",
    "mcp_categories",
    "mcp_image_items",
    "mcp_image_categories",
    "mcp_dev_items",
    "mcp_dev_categories",
    "mcp_settings",
    "mcp_snippets",
    "mcp_templates",
    "mcp_purge_markers"
  ]);
  const ARCAWAND_SITE_URL = "https://arcawand-soft.com/";
  const DEVELOPER_SUPPORT_URL = "https://buymeacoffee.com/arcawandsoft";
  const IS_WELCOME_FLOATING_PREVIEW = Boolean(window.__UCP_WELCOME_FLOATING_PREVIEW__);
  const IS_NATIVE_SIDE_PANEL = Boolean(window.__UCP_NATIVE_SIDE_PANEL__);
  const IS_WEB_LAUNCHER = !IS_WELCOME_FLOATING_PREVIEW && !IS_NATIVE_SIDE_PANEL;

  let shadowRoot = null;
  let metaOverflowController = null;
  let floatingPanelCssReady = false;
  let floatingDriveQuickSyncController = null;
  let nativeSidePanelClassGuard = null;
  let floatingPanelQueuedSettings = null;
  let lastAppliedVisualSettingsUpdatedAt = 0;
  let state = { items: [], categories: [], imageItems: [], imageCategories: [], devItems: [], devCategories: [], settings: {} };
  let currentDisplayAllowed = false;
  let displayPermissionRefreshInFlight = null;

  async function saveSettingsPatch(patch = {}) {
    const settingsKey = (globalThis.MCP?.STORAGE_KEYS?.SETTINGS) || "mcp_settings";
    const storage = globalThis.chrome?.storage?.local;
    if (!globalThis.chrome?.runtime?.id || !storage?.set) throw new Error("Extension context invalidated.");
    const stored = await storage.get(settingsKey).catch(() => ({}));
    const currentSettings = Object.assign({}, state.settings || {}, stored?.[settingsKey] || {});
    syncFloatingLauncherModelFromSettings(currentSettings);
    const nextSettings = stabilizeFloatingLauncherSettings(Object.assign({}, currentSettings, patch || {}, { settingsUpdatedAt: Date.now() }));
    state.settings = nextSettings;
    await storage.set({ [settingsKey]: nextSettings });
    return nextSettings;
  }

  let vaultSessionUnlocked = false;
  let refreshStateInFlight = null;
  let refreshStateRerunRequested = false;
  let refreshStateDeferredUntilVisible = false;
  let floatingOptimisticRefreshSuppressUntil = 0;
  const floatingOptimisticStorageKeys = new Set();
  let floatingSearchRenderRaf = 0;
  let chooserSearchRenderRaf = 0;
  let lastFloatingPanelManualCloseAt = 0;
  let floatingPanelManualCloseLocked = false;
  let selectedIndex = 0;
  let floatingTextModalReturn = null;
  let pendingChooserItem = null;
  let pendingChooserType = "text";
  let pendingSubcategoryParentId = null;
  let chooserDragState = null;
  let editorCategorySelection = "";
  let editorCategoryDragState = null;
  const editorExpandedCategories = new Set(["general"]);
  let searchOverlayState = { query: "", selectedIndex: 0, filters: {}, mediaType: "text", dateKey: "", calendarMonth: "", results: [] };
  let searchOverlaySelectedRow = null;
  let searchOverlayDetailRenderTimer = 0;
  let searchOverlayDetailRenderRaf = 0;
  let searchOverlayVirtualState = null;
  let editingItem = null;
  let pendingDevSuggestionItem = null;
  let pendingDevSuggestionIsDuplicate = false;
  let devMatchAnimationTimer = 0;
  let lastNativeClassifierRequestId = "";
  let pendingOnboardingShortcut = "";
  let onboardingShortcutModifierOrder = [];
  let onboardingCompletionInProgress = false;
  const requestedNativeTab = IS_NATIVE_SIDE_PANEL ? new URLSearchParams(location.search).get("mediaType") : "";
  let activeFloatingTab = ["text", "dev", "image"].includes(requestedNativeTab) ? requestedNativeTab : "text";
  let lastCaptureSignature = "";
  let lastContextImage = null;
  let lastContextSelection = null;
  let lastScreenshotContext = null;
  let lastContextClipboardImageSignature = "";
  let lastScreenshotClipboardImageSignature = "";
  let lastNativeClipboardSignature = "";
  let lastHandledCopyEventAt = 0;
  let screenshotCaptureArmedUntil = 0;
  let sourceHighlightJobId = 0;
  let activeSourceImageHighlightJob = null;
  let sourceHighlightOverlayCleanupTimer = 0;
  let sourceTargetingCountdownTimer = 0;
  const SOURCE_TARGETING_DURATION_SECONDS = 5;
  const captureDedupe = globalThis.MCP.createCaptureDedupe({ onClear: () => { lastCaptureSignature = ""; } });
  const chooserExpandedCategories = new Set();
  const previewAutoScroller = globalThis.MCP.createPreviewAutoScrollController({ textSelector: ".mcp-preview-text" });
  let activePreviewScrollCard = null;
  let searchOverlayRenderJob = null;
  const SEARCH_OVERLAY_RENDER_CHUNK_SIZE = 54;
  const SEARCH_OVERLAY_IMAGE_RENDER_CHUNK_SIZE = 18;
  const SEARCH_OVERLAY_LARGE_LIST_THRESHOLD = 90;
  const SEARCH_OVERLAY_VIRTUAL_ROW_HEIGHT = 76;
  const SEARCH_OVERLAY_VIRTUAL_OVERSCAN = 8;
  const floatingPanelScrollTops = { text: 0, dev: 0, image: 0 };
let floatingToolStateSaveTimer = null;
const floatingToolHistory = new Map();
  let floatingLauncherDragState = null;
  let floatingLauncherSuppressClickUntil = 0;
  let floatingLauncherPositionWriteQueue = Promise.resolve();
  let floatingLauncherPositionRevision = 0;
  let floatingLauncherPendingPosition = null;
  let floatingLauncherModeWriteQueue = Promise.resolve();
  let floatingLauncherReconcileQueued = false;
  let currentPageZoomFactor = 1;
  const floatingLauncherModel = {
    initialized: false,
    collapsed: false,
    modeUpdatedAt: 0,
    bottom: 94,
    positionUpdatedAt: 0
  };
  const floatingEntryPointUsed = {
    floatingLauncherOpenedOnce: false,
    managerOpenedOnce: false
  };
  let pendingCaptureArrivalSource = null;
  let pendingForegroundCaptureReveal = null;
  let lastFloatingPanelRevealAt = 0;
  let lastRealtimeCaptureAt = 0;
  let lastImmediateLauncherArrival = null;
  const immediateCaptureAnimationIds = new Map();
  let suppressFloatingReadyPasteRefreshUntil = 0;
  const recentCaptureArrivalAnimations = new Map();
  const pendingCaptureArrivalAnimations = new Set();

  if (IS_WEB_LAUNCHER) {
    document.addEventListener("contextmenu", rememberContextImage, true);
    window.addEventListener("blur", () => {
      if (lastContextImage && Date.now() - lastContextImage.time > 15000) lastContextImage = null;
      if (Date.now() <= screenshotCaptureArmedUntil) {
        rememberPossibleScreenshotContext("windows-snip-blur");
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && lastContextImage && Date.now() - lastContextImage.time > 15000) lastContextImage = null;
      if (!document.hidden) {
        flushPendingForegroundCaptureReveal();
        if (refreshStateDeferredUntilVisible) {
          refreshStateDeferredUntilVisible = false;
          scheduleFloatingRefresh(0);
        }
      }
    });
  }
  if (IS_NATIVE_SIDE_PANEL) {
    window.addEventListener("ucp:native-locale-ready", () => scheduleFloatingRefresh(0));
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (IS_WELCOME_FLOATING_PREVIEW) return;
    if (message?.type === MESSAGE_TYPES.CONFIRM_CRYPTO_SENSITIVE_CAPTURE) {
      openCryptoSensitiveCaptureWarning(message).then(confirmed => sendResponse({ confirmed }));
      return true;
    }
    if (IS_WEB_LAUNCHER && message?.type === MESSAGE_TYPES.TOOL_SELECTION_MODE_CHANGED) {
      applyGlobalToolSelectionMode(message.mode || null);
      sendResponse({ ok: true });
      return true;
    }
    if (IS_WEB_LAUNCHER && message?.type === MESSAGE_TYPES.PAGE_ZOOM_CHANGED) {
      applyPageZoomFactor(message.zoomFactor);
      return;
    }
    if (IS_NATIVE_SIDE_PANEL && PAGE_ONLY_FOREGROUND_MESSAGE_TYPES.has(message?.type)) {
      applyNativeSidePanelMode();
      return;
    }
    if (message?.type === MESSAGE_TYPES.IMAGE_CAPTURE_STARTED) {
      if (IS_WEB_LAUNCHER) {
        const captureEffect = message.captureEffect || "image-context";
        rememberCaptureArrivalSource(
          captureEffect,
          "image",
          lastContextImage?.sourceRect || null,
          message.item?.thumbnailUrl || message.item?.imageUrl || ""
        );
        startImmediateLauncherCaptureArrival(
          "image",
          captureEffect,
          message.item?.thumbnailUrl || message.item?.imageUrl || "",
          message.captureRequestId || message.item?.id || ""
        );
      } else if (IS_NATIVE_SIDE_PANEL) {
        applyRealtimeCaptureMessage(message);
      }
      return;
    }
    if (message?.type === MESSAGE_TYPES.IMAGE_CAPTURE_CANCELLED) {
      if (IS_NATIVE_SIDE_PANEL) removeOptimisticImageCapture(message.itemId);
      return;
    }
    if (message?.type === MESSAGE_TYPES.ITEM_SAVED) {
      if (!shouldHandleAutomaticUiMessage(message) || !shouldRevealFloatingPanelAfterCapture()) {
        scheduleFloatingRefresh();
        return;
      }
      activeFloatingTab = "text";
      showToast(tr("clipboard.saved"));
      refreshState().then(() => {
        revealFloatingPanel({ afterCopy: true, itemId: message.item?.id, mediaType: "text", captureEffect: message.captureEffect || "", captureRequestId: message.captureRequestId || "" });
      });
      return;
    }
    if (message?.type === "IMAGE_SAVED") {
      if (!shouldHandleAutomaticUiMessage(message) || !shouldRevealFloatingPanelAfterCapture()) {
        const captureEffect = resolveImageCaptureArrivalEffect(message.item, message.captureEffect || "");
        if (captureEffect) queueForegroundCaptureReveal(message.item?.id, "image", captureEffect, message.captureRequestId || "");
        scheduleFloatingRefresh();
        return;
      }
      activeFloatingTab = "image";
      showToast(message.item?.captureKind === "viewport-screenshot" ? tr("capture.fullPageSaved") : tr("images.saved"));
      const captureEffect = resolveImageCaptureArrivalEffect(message.item, message.captureEffect || "");
      refreshState().then(() => {
        revealFloatingPanel({ afterCopy: true, itemId: message.item?.id, mediaType: "image", captureEffect, captureRequestId: message.captureRequestId || "" });
      });
      return;
    }
    if (message?.type === "DEV_SAVED") {
      if (!shouldHandleAutomaticUiMessage(message) || !shouldRevealFloatingPanelAfterCapture()) {
        scheduleFloatingRefresh();
        return;
      }
      if (message.item?.content) rememberCaptureSignature(`dev:${String(message.item.content || "").trim()}`);
      activeFloatingTab = "dev";
      showToast(tr("dev.detected", {
        language: message.detection?.languageName || message.item.languageName || message.item.categoryName || "Code"
      }));
      refreshState().then(() => {
        showDevSuggestion(message.item, message.detection, { duplicate: message.duplicate });
      });
      return;
    }
    if (message?.type === "SHOW_TOAST") {
      showToast(String(message.text || ""));
      sendResponse({ ok: true });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.DRIVE_SYNC_UPDATED) {
      floatingDriveQuickSyncController?.refresh();
    }
    if (message?.type === MESSAGE_TYPES.SHOW_ABOUT) {
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      openFloatingTextModal("popup.aboutTitle", FLOATING_ABOUT_SECTIONS);
      sendResponse({ ok: true });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.SHOW_FAQ) {
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      openFloatingTextModal("popup.faqTitle", FLOATING_FAQ_KEYS);
      sendResponse({ ok: true });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.SHOW_PRIVACY) {
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      openFloatingTextModal("popup.privacyTitle", FLOATING_PRIVACY_KEYS);
      sendResponse({ ok: true });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.SHOW_CAPTURE_LIMIT) {
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      openFloatingCaptureLimitModal(message.mediaType || "text", message.limit || 5);
      sendResponse({ ok: true });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.CAPTURE_PAGE_MARKDOWN) {
      sendResponse({ ok: true, data: buildPageMarkdownCapture() });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.PAGE_MARKDOWN_CAPTURED) {
      if (!shouldHandleAutomaticUiMessage(message) || !shouldRevealFloatingPanelAfterCapture()) {
        scheduleFloatingRefresh();
        return;
      }
      showToast(tr("markdown.captureSaved"));
      activeFloatingTab = "text";
      refreshState().then(() => {
        revealFloatingPanel({ afterCopy: true, itemId: message.item?.id, mediaType: "text", captureEffect: "text-simple" });
      });
      return;
    }
    if (message?.type === "IMAGE_DELETED") {
      clearImageCaptureDedupe();
    }
    if (message?.type === "ITEM_DELETED") {
      clearTextCaptureDedupe();
    }
    if (message?.type === "DEV_DELETED") {
      clearDevCaptureDedupe();
    }
    if (IS_NATIVE_SIDE_PANEL && applyRealtimeDeletionMessage(message)) return;
    if (IS_NATIVE_SIDE_PANEL && applyRealtimeCaptureMessage(message)) return;
    if (REFRESH_EVENTS.has(message?.type)) {
      if (shouldSuppressFloatingReadyPasteRefresh(message)) return;
      if (shouldSuppressRealtimeCaptureRefresh(message)) return;
      scheduleFloatingRefresh();
    }
    if (message?.type === MESSAGE_TYPES.CLOSE_FLOATING_PANEL) {
      closeFloatingPanelForForegroundWindow();
      sendResponse({ ok: true });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.OPEN_SEARCH_OVERLAY) {
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      safeRuntimeMessage({
        type: MESSAGE_TYPES.OPEN_MANAGER,
        search: true,
        mediaType: message.mediaType || activeFloatingTab
      }).then((response) => sendResponse(response || { opened: false }))
        .catch(() => sendResponse({ opened: false }));
      return true;
    }
    if (message?.type === MESSAGE_TYPES.OPEN_IMAGE_INFO) {
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      refreshState().then(() => {
        const item = state.imageItems.find((current) => current.id === message.itemId);
        if (!item) {
          sendResponse({ ok: false, error: "image_not_found" });
          return;
        }
        openImageInfoModal(item);
        sendResponse({ ok: true });
      }).catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
      return true;
    }
    // Extension-page requests are broadcast to every extension context. Only
    // commands explicitly routed back by the service worker may start a local
    // selector; otherwise the native side panel intercepts the manager request.
    if (message?.type === MESSAGE_TYPES.START_COLOR_PICKER && message?.autoUi === true) {
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      startFloatingColorPick({ returnResult: message.returnResult === true })
        .then((data) => sendResponse({ ok: true, data }))
        .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
      return true;
    }
    if (message?.type === MESSAGE_TYPES.START_IMAGE_TEXT_CAPTURE && message?.autoUi === true) {
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      startFloatingImageTextCapture({ returnResult: message.returnResult === true })
        .then((data) => sendResponse({ ok: true, data }))
        .catch((error) => sendResponse({ ok: false, error: error?.message || String(error) }));
      return true;
    }
    if (message?.type === MESSAGE_TYPES.OPEN_ONBOARDING) {
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      refreshState().then(() => {
        maybeShowOnboarding();
        sendResponse({ ok: true });
      }).catch((error) => sendResponse({ ok: false, error: error.message || String(error) }));
      return true;
    }
    if (message?.type === MESSAGE_TYPES.OPEN_FLOATING_PANEL) {
      refreshState().then(() => {
        if (!shouldHandleForegroundUiRequest(message, sendResponse)) return;
        revealFloatingPanel({ force: true });
        sendResponse({ ok: true });
      }).catch((error) => sendResponse({ ok: false, error: error.message || String(error) }));
      return true;
    }
    if (message?.type === MESSAGE_TYPES.OPEN_EDITOR_FOR_ITEM) {
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      openItemEditorById(message.itemId);
      sendResponse({ ok: true });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.OPEN_CLASSIFIER_FOR_ITEM) {
      if (message.nativeSidePanelOnly && !IS_NATIVE_SIDE_PANEL) {
        sendResponse({ ok: false, ignored: "native-side-panel-only" });
        return true;
      }
      if (message.nativeSidePanelOnly && message.requestId && message.requestId === lastNativeClassifierRequestId) {
        sendResponse({ ok: true, duplicate: true });
        return true;
      }
      if (message.nativeSidePanelOnly && message.requestId) lastNativeClassifierRequestId = message.requestId;
      if (!shouldHandleForegroundUiRequest(message, sendResponse)) return true;
      openItemClassifierById(message.itemId, message.mediaType || "text", message.pendingItem || null);
      sendResponse({ ok: true });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.CAPTURE_SOURCE_LOCATOR) {
      const detectedCode = message.kind !== "image"
        && Boolean(globalThis.MCP?.detectCodeLanguage?.(String(message.content || ""))?.isCode);
      const kind = message.kind === "image" ? "image" : message.kind === "code" || detectedCode ? "code" : "text";
      const cachedImageLocator = kind === "image"
        && lastContextImage?.sourceLocator
        && Date.now() - lastContextImage.time < 30000
        && imageCandidateMatchScore(
          message.imageUrl || "",
          lastContextImage.candidates || [lastContextImage.payload?.imageUrl || ""]
        ) >= 64
        ? lastContextImage.sourceLocator
        : null;
      const locator = kind === "image"
        ? cachedImageLocator || buildImageSourceLocator(message.imageUrl || "", findLikelySourceImageElement(message.imageUrl || ""))
        : buildTextSourceLocator(message.content || "", null, {
          kind,
          codeDetection: kind === "code" ? globalThis.MCP?.detectCodeLanguage?.(String(message.content || "")) : null
        });
      sendResponse({ ok: true, locator });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.HIGHLIGHT_SOURCE_TEXT) {
      sendResponse({ ok: true, found: highlightSourceText(message.content, message.sourceLocator || null) });
      return true;
    }
    if (message?.type === MESSAGE_TYPES.HIGHLIGHT_SOURCE_IMAGE) {
      sendResponse({ ok: true, found: highlightSourceImage(message) });
      return true;
    }
  });
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (IS_WELCOME_FLOATING_PREVIEW) return;
    if (areaName !== "local") return;
    const settingsKey = (globalThis.MCP?.STORAGE_KEYS?.SETTINGS) || "mcp_settings";
    const changedKeys = Object.keys(changes);
    const settingsChange = changes[settingsKey];
    const quickSettingsOnlyChange = Boolean(settingsChange?.newValue)
      && globalThis.MCP.isQuickSettingsOnlyChange(settingsChange.oldValue || {}, settingsChange.newValue || {});
    const themeChanged = Boolean(settingsChange?.newValue)
      && settingsChange.oldValue?.theme !== settingsChange.newValue?.theme;
    if (settingsChange && !settingsChange.newValue) return;
    if (settingsChange?.newValue) {
      const nextSettings = Object.assign({}, state.settings || {}, settingsChange.newValue || {});
      if (shouldForceFloatingPanelClosedFromSettings(settingsChange.oldValue || {}, nextSettings)) {
        const previousClosedAt = Number(settingsChange.oldValue?.floatingPanelManualClosedAt) || Number(state.settings?.floatingPanelManualClosedAt) || Date.now();
        nextSettings.floatingPanelOpen = false;
        nextSettings.floatingPanelManualClosedAt = Math.max(Number(nextSettings.floatingPanelManualClosedAt) || 0, previousClosedAt);
      }
      if (floatingLauncherPendingPosition) {
        Object.assign(nextSettings, floatingLauncherPendingPosition);
      }
      reconcileStaleFloatingLauncherSettings(nextSettings);
      syncFloatingLauncherModelFromSettings(nextSettings);
      state.settings = stabilizeFloatingLauncherSettings(nextSettings);
      globalThis.MCP.configureDateTimeFormatting(state.settings);
      shadowRoot?.querySelector(".ucp-quick-settings")?.refreshQuickSettings?.();
      if (!isWelcomeSetupCompleted(nextSettings)) {
        removeFloatingPanel();
        return;
      }
      if (!shadowRoot && currentDisplayAllowed && !isLauncherSuppressedPage()) {
        injectFloatingPanel({ initialSettings: nextSettings, fastBoot: true });
      }
      applyThemeSettings(nextSettings);
      applyPanelVisibility();
      applyFloatingLauncherState(nextSettings);
      floatingDriveQuickSyncController?.render();
      if (themeChanged && shadowRoot) renderPanel();
    }
    const needsFullRefresh = changedKeys.some((key) => LOCAL_STORAGE_KEYS.has(key) && key !== settingsKey)
      || (settingsChange
        && !quickSettingsOnlyChange
        && !isLightweightSettingsChange(settingsChange.oldValue || {}, settingsChange.newValue || {}));
    if (needsFullRefresh) {
      if (isSourceFaviconOnlyStorageChange(changes, changedKeys, settingsKey)) return;
      if (shouldSuppressFloatingReadyPasteStorageRefresh(changedKeys, settingsKey)) return;
      if (shouldSuppressFloatingOptimisticRefresh(changedKeys, settingsKey)) return;
      scheduleFloatingRefresh();
    }
  });

  function isForegroundDocument() {
    return document.visibilityState === "visible";
  }

  function shouldHandleAutomaticUiMessage(message) {
    return message?.autoUi === true && isForegroundDocument();
  }

  function shouldRevealFloatingPanelAfterCapture() {
    return state.settings?.floatingPanelAfterCapture !== false;
  }

  function isWelcomeSetupCompleted(settings = state.settings || {}) {
    return settings?.welcomePageCompleted === true || settings?.onboardingCompleted === true;
  }

  function requestWelcomePageForIncompleteSetup() {
    if (IS_WELCOME_FLOATING_PREVIEW || isWelcomeSetupCompleted(state.settings)) return;
    safeRuntimeMessage({ type: MESSAGE_TYPES.OPEN_WELCOME_PAGE || "MCP_OPEN_WELCOME_PAGE", focusExisting: false }).catch(() => {});
  }

  function shouldHandleForegroundUiRequest(message, sendResponse) {
    if (!isWelcomeSetupCompleted(state.settings)) {
      removeFloatingPanel();
      requestWelcomePageForIncompleteSetup();
      sendResponse({ ok: false, onboardingRequired: true });
      return false;
    }
    if (!message?.autoUi || isForegroundDocument()) return true;
    sendResponse({ ok: false, ignored: "inactive-tab" });
    return false;
  }

  function isOnboardingBlockedPage() {
    return /^https:\/\/accounts\.google\.com\//i.test(location.href);
  }

  function openArcawandSite() {
    window.open(ARCAWAND_SITE_URL, "_blank", "noopener");
  }

  function wireArcawandLogoLink(logo) {
    if (!logo || logo.dataset.arcawandSiteLink === "true") return logo;
    logo.dataset.arcawandSiteLink = "true";
    logo.tabIndex = 0;
    logo.role = "button";
    logo.style.cursor = "pointer";
    logo.addEventListener("click", openArcawandSite);
    logo.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openArcawandSite();
    });
    return logo;
  }

  if (IS_WEB_LAUNCHER) runSafeAsync(requestCurrentPageZoomFactor);
  if (!IS_WELCOME_FLOATING_PREVIEW) bootstrapFloatingPanelShell();
  if (IS_WEB_LAUNCHER && document.visibilityState !== "visible") {
    refreshStateDeferredUntilVisible = true;
  } else {
    refreshState();
  }
  if (IS_WEB_LAUNCHER) runSafeAsync(syncGlobalToolSelectionMode);
  if (IS_NATIVE_SIDE_PANEL) {
    document.addEventListener("keydown", handleGlobalKeyboard);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) applyNativeSidePanelMode();
    });
    window.addEventListener("unhandledrejection", swallowExtensionInvalidatedError);
    window.addEventListener("error", swallowExtensionInvalidatedError);
    window.addEventListener("resize", applyNativeSidePanelMode);
  } else if (!IS_WELCOME_FLOATING_PREVIEW) {
    const aiCopyController = globalThis.MCP.createAiCopyController({
      getSettings: () => state.settings || {},
      isSensitiveTarget,
      runSafeAsync,
      sendTextCapture,
      readClipboardText: async () => {
        const response = await safeRuntimeMessage({ type: MESSAGE_TYPES.READ_CLIPBOARD_TEXT || "MCP_READ_CLIPBOARD_TEXT" });
        return response?.ok ? String(response.data?.text || "") : "";
      },
      delay,
      markCopyEvent: () => {
        lastHandledCopyEventAt = Date.now();
      }
    });
    listenUntilContentContextEnds(document, "keydown", handleGlobalKeyboard);
    listenUntilContentContextEnds(document, "click", aiCopyController.handleClick, true);
    listenUntilContentContextEnds(document, "keydown", handleTextCaptureShortcut, true);
    listenUntilContentContextEnds(document, "keydown", handleScreenshotShortcut, true);
    listenUntilContentContextEnds(document, "keyup", handleScreenshotShortcut, true);
    listenUntilContentContextEnds(window, "unhandledrejection", swallowExtensionInvalidatedError);
    listenUntilContentContextEnds(window, "error", swallowExtensionInvalidatedError);
    listenUntilContentContextEnds(window, "resize", handleFloatingLauncherResize);
    listenUntilContentContextEnds(window, "pagehide", disposeContentContext, { once: true });
  }

  function handleFloatingLauncherResize() {
    applyFloatingLauncherState(state.settings || {});
  }

  function handleTextCaptureShortcut(event) {
    if (!isConfiguredTextCaptureShortcut(event) || isSensitiveTarget(event.target)) return;
    const content = getCopiedTextFromTarget(event.target) || String(window.getSelection ? window.getSelection() : "").trim();
    if (!content) {
      showToast(tr("capture.noSelection"));
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    lastHandledCopyEventAt = Date.now();
    runSafeAsync(() => sendTextCapture(content, {
      sourceUrl: location.href,
      sourceDomain: location.hostname.replace(/^www\./, ""),
      sourceTitle: document.title,
      captureEffect: "text-simple",
      sourceRect: currentSelectionViewportRect()
    }));
  }


  function isCopyShortcut(event) {
    return (event.ctrlKey || event.metaKey) && !event.shiftKey && !event.altKey && String(event.key || "").toLowerCase() === "c";
  }

  function isConfiguredTextCaptureShortcut(event) {
    return globalThis.MCP?.eventMatchesShortcut
      ? globalThis.MCP.eventMatchesShortcut(event, state.settings?.textCaptureShortcut || "ctrl_alt_c")
      : (event.ctrlKey || event.metaKey) && event.shiftKey && !event.altKey && String(event.key || "").toLowerCase() === "c";
  }

  function captureShortcutLabel() {
    return globalThis.MCP?.configuredCaptureShortcutLabel
      ? globalThis.MCP.configuredCaptureShortcutLabel(state.settings)
      : shortcutLabelFor(state.settings?.textCaptureShortcut || "ctrl_alt_c");
  }

  function shortcutLabelFor(shortcut = "ctrl_alt_c") {
    if (globalThis.MCP?.shortcutLabel) return globalThis.MCP.shortcutLabel(shortcut);
    if (shortcut === "ctrl_alt_c") return isMacPlatformLocal() ? "\u2303 + \u2318 + C" : "Ctrl + Alt + C";
    return isMacPlatformLocal() ? "\u21e7 + \u2318 + C" : "\u21e7 + Ctrl + C";
  }

  function isMacPlatformLocal() {
    const platform = navigator?.userAgentData?.platform || navigator?.platform || navigator?.userAgent || "";
    return /mac|iphone|ipad|ipod/i.test(String(platform));
  }

  const ONBOARDING_ACCENTS = [
    { value: "#2563eb", key: "settings.accentBlue" },
    { value: "#16a34a", key: "settings.accentGreen" },
    { value: "#e50914", key: "settings.accentRed" },
    { value: "#f97316", key: "settings.accentOrange" },
    { value: "#8b5cf6", key: "settings.accentViolet" },
    { value: "#22d3ee", key: "settings.accentCyan" },
    { value: "#f43f5e", key: "settings.accentRose" },
    { value: "#84cc16", key: "settings.accentLime" },
    { value: "#0ea5e9", key: "settings.accentSky" },
    { value: "#979797", key: "settings.accentAmber" },
    { value: "#eab308", key: "settings.accentLightYellow" },
    { value: "#34d399", key: "settings.accentLightMint" },
    { value: "#a78bfa", key: "settings.accentLightLavender" }
  ];
  const ONBOARDING_LANGUAGE_OPTIONS = [
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "es", label: "Español" },
    { value: "it", label: "Italiano" },
    { value: "de", label: "Deutsch" },
    { value: "ro", label: "Română" },
    { value: "pt", label: "Português" },
    { value: "ar", label: "العربية" },
    { value: "zh", label: "中文" },
    { value: "ja", label: "日本語" },
    { value: "ru", label: "Русский" },
    { value: "nl", label: "Nederlands" },
    { value: "pl", label: "Polski" },
    { value: "tr", label: "Türkçe" },
    { value: "ko", label: "한국어" },
    { value: "hi", label: "हिन्दी" }
  ];
  const SUPPORTED_UI_LANGUAGES = ONBOARDING_LANGUAGE_OPTIONS.map((option) => option.value);
  const FLOATING_ABOUT_SECTIONS = [
    { title: "popup.aboutSectionIdentity", keys: ["popup.aboutVersion", "popup.aboutIntro"] },
    { title: "popup.aboutSectionCapture", keys: ["popup.aboutCapture", "popup.aboutImages", "popup.aboutVersioning"] },
    { title: "popup.aboutSectionFind", keys: ["popup.aboutSearch", "popup.aboutMontage"] },
    { title: "popup.aboutSectionControl", keys: ["popup.aboutSecurity", "popup.aboutBackup", "popup.aboutDrive", "popup.aboutMultiDevice"] },
    { title: "popup.aboutSectionTechnical", keys: ["popup.aboutTechnical", "popup.aboutCompatibility", "popup.aboutLicense"] },
    { title: "popup.aboutSectionSupport", keys: ["popup.aboutSupport"] }
  ];
  const FLOATING_PRIVACY_KEYS = [
    "popup.privacyIntro",
    "popup.privacyLocal",
    "popup.privacyData",
    "popup.privacyNoSale",
    "popup.privacyNoAds",
    "popup.privacyPermissions",
    "popup.privacyControl",
    "popup.privacyDodo",
    "popup.privacyMultiDevice",
    "popup.privacyContact"
  ];
  const FLOATING_PRO_KEYS = [
    "popup.proIntro"
  ];
  const FLOATING_FAQ_IDS = [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "76", "77"
  ];
  const FLOATING_FAQ_KEYS = FLOATING_FAQ_IDS.map((id) => [`faq.${id}.q`, `faq.${id}.a`]);
  const FLOATING_PANEL_ITEM_LIMIT = 20;

  function normalizeUiLanguage(value) {
    return globalThis.MCP?.normalizeLanguageCode
      ? globalThis.MCP.normalizeLanguageCode(value, SUPPORTED_UI_LANGUAGES)
      : SUPPORTED_UI_LANGUAGES.includes(value) ? value : "";
  }

  function shouldRespectSavedLanguage(settings = state.settings || {}) {
    return settings.languageSource === "manual" || settings.welcomePageCompleted || settings.onboardingCompleted;
  }

  function resolvePreferredUiLanguage(settings = state.settings || {}) {
    if (globalThis.MCP?.detectPreferredLanguage) {
      return globalThis.MCP.detectPreferredLanguage({
        supportedLanguages: SUPPORTED_UI_LANGUAGES,
        savedLanguage: settings.language,
        preferSaved: shouldRespectSavedLanguage(settings),
        fallback: "en"
      });
    }
    return normalizeUiLanguage(settings.language) || "en";
  }

  async function resolvePreferredUiLanguageAsync(settings = state.settings || {}) {
    if (globalThis.MCP?.detectPreferredLanguageAsync) {
      return globalThis.MCP.detectPreferredLanguageAsync({
        supportedLanguages: SUPPORTED_UI_LANGUAGES,
        savedLanguage: settings.language,
        preferSaved: shouldRespectSavedLanguage(settings),
        fallback: "en"
      });
    }
    return resolvePreferredUiLanguage(settings);
  }

  async function ensureOnboardingDetectedLanguage() {
    if (state.settings?.onboardingCompleted) return;
    const nextLanguage = await resolvePreferredUiLanguageAsync(state.settings);
    if (!nextLanguage || state.settings?.language === nextLanguage) return;
    state.settings = Object.assign({}, state.settings, {
      language: nextLanguage,
      languageSource: shouldRespectSavedLanguage(state.settings) ? state.settings?.languageSource || "manual" : "auto"
    });
  }

  function syncOnboardingAccentButtons(selectedColor = state.settings?.accentColor || "#e50914") {
    const selected = normalizeHexColor(selectedColor || "#e50914");
    shadowRoot?.querySelectorAll("[data-action='select-onboarding-accent']").forEach((button) => {
      const isActive = normalizeHexColor(button.dataset.accentColor || "#e50914") === selected;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-checked", String(isActive));
    });
  }

  function selectedOnboardingAccent() {
    const active = shadowRoot?.querySelector("[data-action='select-onboarding-accent'].is-active");
    return normalizeHexColor(active?.dataset.accentColor || state.settings?.accentColor || "#e50914");
  }

  async function sendTextCapture(content, context = {}) {
    const clean = String(content || "").trim();
    if (!clean) return;
    const captureRequestId = context.captureRequestId || createCaptureRequestId("text");
    const codeDetection = globalThis.MCP?.detectCodeLanguage?.(clean) || null;
    const predictedMediaType = codeDetection?.isCode ? "dev" : "text";
    const rect = context.sourceRect||currentSelectionViewportRect();
    const response = await safeRuntimeMessage({
      type: MESSAGE_TYPES.COPY_DETECTED,
      payload: {
        content: clean,
        sourceUrl: context.sourceUrl || location.href,
        sourceDomain: context.sourceDomain || location.hostname.replace(/^www\./, ""),
        sourceTitle: context.sourceTitle || document.title,
        sourceFaviconUrl: context.sourceFaviconUrl || currentPageFaviconUrl(),
        captureEffect: context.captureEffect || "",
        captureRequestId,
        codeDetection,
        sourceLocator: context.sourceLocator || buildTextSourceLocator(clean, context.sourceElement || null, {
          kind: predictedMediaType === "dev" ? "code" : "text",
          codeDetection
        })
      }
    });
    if(response?.data?.saved){
      const type=response.data.mediaType||predictedMediaType;
      rememberCaptureArrivalSource(context.captureEffect, type, rect, clean);
      startImmediateLauncherCaptureArrival(type,context.captureEffect||"",clean,captureRequestId);
    }
    return handleCaptureResponse(response, "text", { captureRequestId });
  }

  async function sendImageCapture(payload, options = {}) {
    const imageUrl = String(payload?.imageUrl || payload?.dataUrl || "").trim();
    if (!imageUrl) return;
    const captureRequestId = options.captureRequestId || payload?.captureRequestId || createCaptureRequestId("image");
    const captureEffect = resolveImageCaptureArrivalEffect(payload, options.captureEffect);
    const sourceLocator = payload?.sourceLocator
      || lastContextImage?.sourceLocator
      || buildImageSourceLocator(imageUrl, options.sourceElement || findLikelySourceImageElement(imageUrl));
    rememberCaptureArrivalSource(captureEffect, "image", options.sourceRect || lastContextImage?.sourceRect || null, payload?.thumbnailUrl || payload?.imageUrl || payload?.dataUrl || "");
    startImmediateLauncherCaptureArrival("image", captureEffect, payload?.thumbnailUrl || payload?.imageUrl || payload?.dataUrl || "", captureRequestId);

    const response = await safeRuntimeMessage({
      type: MESSAGE_TYPES.IMAGE_DETECTED,
      payload: Object.assign({
        sourceFaviconUrl: currentPageFaviconUrl()
      }, payload, { captureEffect, sourceLocator, captureRequestId })
    });
    return handleCaptureResponse(response, "image", Object.assign({}, options, { captureEffect, captureRequestId }));
  }

  function createCaptureRequestId(mediaType = "capture") {
    return globalThis.MCP?.createId?.(`capture-${mediaType}`)
      || `${mediaType}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function buildPageMarkdownCapture() {
    return pageMarkdownCapture.capture();
  }

  const pageMarkdownCapture = globalThis.MCP.createPageMarkdownCapture({
    document,
    location,
    Node,
    viewport: window,
    faviconUrl: currentPageFaviconUrl,
    onLocated: (rect, preview) => rememberCaptureArrivalSource("text-simple", "text", rect, preview)
  });

  function currentPageFaviconUrl() {
    const selectors = [
      "link[rel~='icon'][href]",
      "link[rel='shortcut icon'][href]",
      "link[rel='apple-touch-icon'][href]",
      "link[rel='apple-touch-icon-precomposed'][href]",
      "link[rel='mask-icon'][href]"
    ];
    const link = selectors.map((selector) => document.querySelector(selector)).find(Boolean);
    const href = link?.getAttribute?.("href") || "";
    try {
      return href ? new URL(href, location.href).href : `${location.origin}/favicon.ico`;
    } catch (error) {
      return "";
    }
  }

  async function captureFullPageScreenshot(target) {
    const panelHost = document.getElementById("ucp-demo-floating-host");
    const previousVisibility = panelHost?.style.visibility || "";

    try {
      target?.classList.add("is-loading");
      showToast(tr("capture.fullPageStarting"));
      if (panelHost) panelHost.style.visibility = "hidden";
      await delay(120);
      const response = await safeRuntimeMessage({ type: MESSAGE_TYPES.CAPTURE_VISIBLE_TAB });
      const dataUrl = response?.data?.dataUrl || response?.dataUrl;
      if (!response?.ok || !dataUrl) throw new Error(response?.error || "capture-failed");
      const metrics = await loadImage(dataUrl).catch(() => null);
      flashPageCapture();

      const success = await sendImageCapture({
        imageUrl: dataUrl,
        thumbnailUrl: dataUrl,
        dataUrl,
        mimeType: "image/png",
        isScreenshot: true,
        captureKind: "viewport-screenshot",
        imagePageTitle: document.title,
        imageElementTitle: tr("capture.fullPageTitle"),
        imageFileName: `ultimate-clipboard-pro-screenshot-${Date.now()}.png`,
        width: metrics?.naturalWidth || null,
        height: metrics?.naturalHeight || null,
        sourceUrl: location.href,
        sourceDomain: location.hostname.replace(/^www\./, ""),
        sourceTitle: document.title
      }, {
        force: true,
        captureEffect: "fullpage-screenshot",
        sourceRect: screenCenterCaptureRect(),
        suppressToast: true
      });
      if (success) showToast(tr("capture.fullPageSaved"));
      return success;
    } catch (error) {
      showToast(tr("capture.fullPageFailed"));
      return false;
    } finally {
      if (panelHost) panelHost.style.visibility = previousVisibility;
      target?.classList.remove("is-loading");
    }
  }

  function loadImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = dataUrl;
    });
  }

  function flashPageCapture() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const flash = document.createElement("div");
    flash.className = "ucp-fullpage-flash";
    flash.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:2147483646",
      "pointer-events:none",
      "background:#fff",
      "opacity:0",
      "animation:ucpFullPageFlash 420ms ease-out"
    ].join(";");
    const style = document.createElement("style");
    style.textContent = "@keyframes ucpFullPageFlash{0%{opacity:0}18%{opacity:.82}100%{opacity:0}}";
    document.documentElement.append(style, flash);
    window.setTimeout(() => {
      flash.remove();
      style.remove();
    }, 460);
  }

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function rememberCaptureSignature(signature) {
    captureDedupe.remember(signature);
  }

  function isRecentCaptureSignature(signature) {
    return captureDedupe.has(signature);
  }

  function clearImageCaptureDedupe() {
    captureDedupe.clear("image");
  }

  function clearTextCaptureDedupe() {
    captureDedupe.clear("text");
  }

  function clearDevCaptureDedupe() {
    captureDedupe.clear("dev");
  }

  function rememberContextImage(event) {
    const image = event.target?.closest?.("img");
    rememberContextSelection(event);
    if (!image) {
      lastContextImage = null;
      return;
    }
    const imageUrl = image.currentSrc || image.src || "";
    if (!imageUrl) return;
    lastContextImage = {
      time: Date.now(),
      payload: imagePayloadFromElement(image),
      candidates: imageUrlCandidatesFromElement(image),
      sourceRect: rectToPlainObject(image.getBoundingClientRect()),
      sourceLocator: buildImageSourceLocator(imageUrl, image)
    };
    lastScreenshotContext = null;
  }

  function rememberContextSelection(event) {
    if (isSensitiveTarget(event.target)) {
      lastContextSelection = null;
      return;
    }
    const selectedText = (getCopiedTextFromTarget(event.target) || String(window.getSelection ? window.getSelection() : "")).trim();
    if (!selectedText) {
      lastContextSelection = null;
      return;
    }
    lastContextSelection = {
      text: selectedText,
      time: Date.now(),
      sourceUrl: location.href,
      sourceDomain: location.hostname.replace(/^www\./, ""),
      sourceTitle: document.title,
      sourceRect: currentSelectionViewportRect() || rectToPlainObject(event.target?.getBoundingClientRect?.())
    };
  }

  function scheduleNativeImageClipboardInspection(reason) {
    if (!hasLiveExtensionContext()) {
      disposeContentContext();
      return;
    }
    const hasImageContext = false;
    const hasScreenshotContext = lastScreenshotContext && Date.now() - lastScreenshotContext.time <= 90000;
    if (!hasImageContext && !hasScreenshotContext) return;
    const delays = reason === "screenshot-context"
      ? [180, 420, 900, 1600, 2800, 4600, 7200, 11000, 14500]
      : reason === "contextmenu"
      ? [180, 650, 1400, 2600, 4200]
      : [80, 220, 520, 1100, 2100, 4200, 7600];
    delays.forEach((delay) => {
      window.setTimeout(() => runSafeAsync(() => inspectNativeImageClipboard(reason)), delay);
    });
  }

  async function inspectNativeImageClipboard() {
    if (!hasLiveExtensionContext()) {
      disposeContentContext();
      return;
    }
    const hasImageContext = lastContextImage && Date.now() - lastContextImage.time <= 15000;
    const hasScreenshotContext = lastScreenshotContext && Date.now() - lastScreenshotContext.time <= 90000;
    if (!hasImageContext && !hasScreenshotContext) return;
    if (isSensitiveTarget(document.activeElement)) return;
    const frozenContext = hasImageContext ? lastContextImage.payload : lastScreenshotContext;
    const context = clipboardContextFromSnapshot(frozenContext);

    const imagePayload = await readImageFromClipboard(context);
    if (imagePayload) {
      const signature = `native-image:${String(imagePayload.dataUrl || imagePayload.imageUrl || "").slice(0, 500)}`;
      if (hasImageContext && lastContextClipboardImageSignature === "__pending__") return;
      if (hasImageContext && signature && signature === lastContextClipboardImageSignature) {
        return;
      }
      if (hasScreenshotContext && lastScreenshotClipboardImageSignature === "__pending__") return;
      if (hasScreenshotContext && signature && signature === lastScreenshotClipboardImageSignature) return;
      if (signature !== lastNativeClipboardSignature) {
        lastNativeClipboardSignature = signature;
        const enriched = hasImageContext
          ? Object.assign({}, imagePayload, {
            imageUrl: lastContextImage.payload.imageUrl,
            thumbnailUrl: imagePayload.dataUrl || lastContextImage.payload.thumbnailUrl || lastContextImage.payload.imageUrl,
            dataUrl: imagePayload.dataUrl || "",
            mimeType: imagePayload.mimeType || "",
            sourceUrl: lastContextImage.payload.sourceUrl || context.sourceUrl,
            sourceDomain: lastContextImage.payload.sourceDomain || context.sourceDomain,
            sourceTitle: lastContextImage.payload.sourceTitle || context.sourceTitle,
            originalImageUrl: lastContextImage.payload.imageUrl,
            candidates: lastContextImage.candidates || lastContextImage.payload.candidates || [],
            altText: lastContextImage.payload.altText || imagePayload.altText || "",
            imagePageTitle: lastContextImage.payload.imagePageTitle || lastContextImage.payload.sourceTitle || "",
            imageElementTitle: lastContextImage.payload.imageElementTitle || "",
            imageFileName: lastContextImage.payload.imageFileName || fileNameFromUrl(lastContextImage.payload.imageUrl),
            isScreenshot: false,
            captureKind: ""
          })
          : Object.assign({}, imagePayload, {
            sourceUrl: context.sourceUrl,
            sourceDomain: context.sourceDomain,
            sourceTitle: context.sourceTitle,
            title: context.sourceTitle,
            altText: context.sourceTitle,
            isScreenshot: true,
            captureKind: "screenshot"
          });
        await sendImageCapture(enriched, hasScreenshotContext
          ? { captureEffect: "screenshot", sourceRect: screenCenterCaptureRect() }
          : {});
        lastContextImage = null;
        lastScreenshotContext = null;
        screenshotCaptureArmedUntil = 0;
      }
      return;
    }

    lastContextImage = null;
  }

  async function rememberCurrentClipboardImageSignature() {
    const context = createClipboardContext();
    const payload = await readImageFromClipboard(context).catch(() => null);
    lastContextClipboardImageSignature = payload
      ? `native-image:${String(payload.dataUrl || payload.imageUrl || "").slice(0, 500)}`
      : "";
  }

  async function rememberCurrentScreenshotClipboardImageSignature() {
    const context = createClipboardContext();
    const payload = await readImageFromClipboard(context).catch(() => null);
    lastScreenshotClipboardImageSignature = payload
      ? `native-image:${String(payload.dataUrl || payload.imageUrl || "").slice(0, 500)}`
      : "";
  }

  function rememberPossibleScreenshotContext(reason = "") {
    if (!hasLiveExtensionContext()) {
      disposeContentContext();
      return;
    }
    const explicitScreenshot = ["printscreen", "windows-snip", "windows-snip-blur", "mac-screenshot", "mac-clipboard-screenshot"].includes(reason);
    if (!explicitScreenshot && lastContextImage && Date.now() - lastContextImage.time <= 15000) return;
    if (explicitScreenshot && lastScreenshotContext?.reason === reason && Date.now() - lastScreenshotContext.time < 700) return;
    if (explicitScreenshot) {
      lastContextImage = null;
      lastContextClipboardImageSignature = "";
    }
    lastScreenshotContext = Object.assign(createClipboardContext(), {
      time: Date.now(),
      reason
    });
    screenshotCaptureArmedUntil = Date.now() + 15000;
    lastScreenshotClipboardImageSignature = "";
    scheduleNativeImageClipboardInspection("screenshot-context");
  }

  function handleScreenshotShortcut(event) {
    if (!hasLiveExtensionContext()) {
      disposeContentContext();
      return;
    }
    const key = String(event.key || "").toLowerCase();
    const code = String(event.code || "").toLowerCase();
    const isPrintScreen = key === "printscreen" || code === "printscreen" || code === "printscrn";
    const isWindowsSnip = event.shiftKey && (event.metaKey || event.getModifierState?.("OS")) && key === "s";
    const isWindowsSnipPrefix = event.shiftKey && (event.metaKey || event.getModifierState?.("OS"));
    const isMacScreenshot = event.metaKey && event.shiftKey && ["3", "4", "5"].includes(key);
    const isMacClipboardScreenshot = isMacScreenshot && event.ctrlKey;
    if (isWindowsSnipPrefix || isPrintScreen || isMacScreenshot) screenshotCaptureArmedUntil = Date.now() + 15000;
    if (!isPrintScreen && !isWindowsSnip && !isMacScreenshot) return;
    rememberPossibleScreenshotContext(
      isPrintScreen
        ? "printscreen"
        : isWindowsSnip
        ? "windows-snip"
        : isMacClipboardScreenshot
        ? "mac-clipboard-screenshot"
        : "mac-screenshot"
    );
  }

  function createClipboardContext() {
    return {
      sourceUrl: location.href,
      sourceDomain: location.hostname.replace(/^www\./, ""),
      sourceTitle: document.title
    };
  }

  function rectToPlainObject(rect) {
    if (!rect || rect.width <= 0 || rect.height <= 0) return null;
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  }

  function currentSelectionViewportRect() {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount) return null;
    const rects = [];
    for (let index = 0; index < selection.rangeCount; index += 1) {
      const range = selection.getRangeAt(index);
      rects.push(...[...range.getClientRects()].filter((rect) => rect.width > 0 && rect.height > 0));
    }
    if (!rects.length) return null;
    const left = Math.min(...rects.map((rect) => rect.left));
    const top = Math.min(...rects.map((rect) => rect.top));
    const right = Math.max(...rects.map((rect) => rect.right));
    const bottom = Math.max(...rects.map((rect) => rect.bottom));
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }

  function screenCenterCaptureRect() {
    const width = Math.min(220, Math.max(96, Math.round(window.innerWidth * 0.18)));
    const height = Math.min(150, Math.max(72, Math.round(window.innerHeight * 0.16)));
    const left = Math.max(0, Math.round((window.innerWidth - width) / 2));
    const top = Math.max(0, Math.round((window.innerHeight - height) / 2));
    return { left, top, right: left + width, bottom: top + height, width, height };
  }

  function rememberCaptureArrivalSource(effect, mediaType, rect, content = "") {
    if (!isArrivalEffectAllowed(effect, mediaType)) return;
    pendingCaptureArrivalSource = {
      effect,
      mediaType,
      rect: rect || null,
      content: String(content || ""),
      time: Date.now()
    };
  }

  function resolveImageCaptureArrivalEffect(itemOrPayload = {}, explicitEffect = "") {
    if (explicitEffect) return explicitEffect;
    const captureKind = String(itemOrPayload?.captureKind || "");
    if (captureKind === "viewport-screenshot") return "fullpage-screenshot";
    if (captureKind === "screenshot" || itemOrPayload?.isScreenshot === true) return "screenshot";
    return String(itemOrPayload?.captureEffect || "");
  }

  function queueForegroundCaptureReveal(itemId, mediaType, captureEffect, captureRequestId = "") {
    if (!itemId || !isArrivalEffectAllowed(captureEffect, mediaType)) return;
    pendingForegroundCaptureReveal = {
      itemId,
      mediaType,
      captureEffect,
      captureRequestId,
      time: Date.now()
    };
  }

  function flushPendingForegroundCaptureReveal() {
    const pending = pendingForegroundCaptureReveal;
    if (!pending || Date.now() - pending.time > 12000 || !isForegroundDocument()) return;
    pendingForegroundCaptureReveal = null;
    activeFloatingTab = pending.mediaType === "image" ? "image" : pending.mediaType === "dev" ? "dev" : "text";
    refreshState().then(() => {
      revealFloatingPanel({
        afterCopy: true,
        itemId: pending.itemId,
        mediaType: pending.mediaType,
        captureEffect: pending.captureEffect,
        captureRequestId: pending.captureRequestId || ""
      });
    }).catch(() => {});
  }

  function clipboardContextFromSnapshot(snapshot) {
    return {
      sourceUrl: snapshot?.sourceUrl || location.href,
      sourceDomain: snapshot?.sourceDomain || location.hostname.replace(/^www\./, ""),
      sourceTitle: snapshot?.sourceTitle || document.title,
      sourceFaviconUrl: snapshot?.sourceFaviconUrl || currentPageFaviconUrl()
    };
  }

  async function readImageFromClipboard(context) {
    try {
      const response = await safeRuntimeMessage({ type: MESSAGE_TYPES.READ_CLIPBOARD_IMAGE || "MCP_READ_CLIPBOARD_IMAGE" });
      const clipboardImage = response?.ok ? response.data : null;
      if (!clipboardImage?.dataUrl || !String(clipboardImage.mimeType || "").startsWith("image/")) return null;
      return {
        imageUrl: clipboardImage.dataUrl,
        thumbnailUrl: clipboardImage.dataUrl,
        dataUrl: clipboardImage.dataUrl,
        mimeType: clipboardImage.mimeType,
        sourceUrl: context.sourceUrl,
        sourceDomain: context.sourceDomain,
        sourceTitle: context.sourceTitle
      };
    } catch (error) {
      return null;
    }
    return null;
  }

  function handleCaptureResponse(response, mediaType = "text", options = {}) {
    if (!response?.ok) {
      showToast(tr("common.error"));
      return false;
    }

    const result = response.data || {};
    if (!result.saved) {
      if (result.reason === "excluded-domain") {
        showToast(tr("capture.excludedDomainNotice"));
      } else if (result.reason === "pro-required") {
        openFloatingProUpgradeModal("pageMarkdownCapture");
        showToast(tr("pro.context.pageMarkdownCapture").replaceAll("**", ""));
      } else if (result.reason === "free-capture-limit") {
        openFloatingCaptureLimitModal(result.mediaType || mediaType, result.limit || 5);
      } else if (["capture-disabled", "image-capture-disabled", "private-mode"].includes(result.reason)) {
        showToast(mediaType === "image" ? tr("capture.imagePaused") : tr("capture.textPaused"));
      }
      return false;
    }

    if (!isForegroundDocument()) {
      const pendingEffect = mediaType === "image"
        ? resolveImageCaptureArrivalEffect(result.item, result.captureEffect || options.captureEffect || "")
        : result.captureEffect || options.captureEffect || "";
      if (pendingEffect) queueForegroundCaptureReveal(
        result.item?.id,
        result.mediaType || mediaType,
        pendingEffect,
        result.captureRequestId || options.captureRequestId || ""
      );
      refreshState().catch(() => {});
      return true;
    }

    const resolvedMediaType = result.mediaType || mediaType;
    if (resolvedMediaType === "dev" && result.item) {
      pendingDevSuggestionItem = result.item;
      if (!options.suppressToast) {
        showToast(tr("dev.detected", {
          language: result.detection?.languageName || result.item.languageName || result.item.categoryName || "Code"
        }));
      }
      showDevSuggestion(result.item, result.detection || {}, { duplicate: result.duplicate });
      return true;
    }

    activeFloatingTab = resolvedMediaType === "image" ? "image" : resolvedMediaType === "dev" ? "dev" : "text";
    if (!options.suppressToast) {
      showToast(resolvedMediaType === "image"
        ? tr("images.saved")
        : resolvedMediaType === "dev"
          ? tr("dev.saved")
        : tr("clipboard.saved"));
    }
    refreshState().then(() => {
      if (!options.suppressAutoReveal) {
        const captureEffect = resolvedMediaType === "image"
          ? resolveImageCaptureArrivalEffect(result.item, result.captureEffect || options.captureEffect || "")
          : result.captureEffect || options.captureEffect || "";
        revealFloatingPanel({
          afterCopy: true,
          itemId: result.item?.id,
          mediaType: resolvedMediaType,
          captureEffect,
          captureRequestId: result.captureRequestId || options.captureRequestId || ""
        });
      }
    }).catch(() => {});
    return true;
  }

  function isSensitiveTarget(target) {
    if (!target) return false;
    const element = target.closest ? target.closest("input, textarea, [contenteditable='true']") : target;
    if (!element) return false;
    const type = String(element.getAttribute?.("type") || "").toLowerCase();
    const autocomplete = String(element.getAttribute?.("autocomplete") || "").toLowerCase();
    const name = String(element.getAttribute?.("name") || "").toLowerCase();
    return type === "password" || autocomplete.includes("password") || name.includes("password");
  }

  function getCopiedTextFromTarget(target) {
    if (!target) return "";
    const element = target.closest ? target.closest("input, textarea") : null;
    if (!element || typeof element.selectionStart !== "number" || typeof element.selectionEnd !== "number") return "";
    return String(element.value || "").slice(element.selectionStart, element.selectionEnd).trim();
  }

  function getCopiedImageFromSelection() {
    const selection = window.getSelection?.();
    if (!selection || !selection.rangeCount) return null;
    const images = [];
    for (let index = 0; index < selection.rangeCount; index += 1) {
      const range = selection.getRangeAt(index);
      const fragment = range.cloneContents();
      fragment.querySelectorAll?.("img").forEach((image) => images.push(image));
      const startElement = range.startContainer?.nodeType === Node.ELEMENT_NODE
        ? range.startContainer
        : range.startContainer?.parentElement;
      if (startElement?.matches?.("img")) images.push(startElement);
    }
    const image = images.find((item) => item.currentSrc || item.src);
    return image ? imagePayloadFromElement(image) : null;
  }

  function imagePayloadFromElement(image) {
    const imageUrl = image.currentSrc || image.src || image.getAttribute("src") || "";
    return {
      imageUrl,
      thumbnailUrl: imageUrl,
      originalImageUrl: imageUrl,
      candidates: imageUrlCandidatesFromElement(image),
      altText: image.alt || image.getAttribute("aria-label") || "",
      imagePageTitle: document.title,
      imageElementTitle: image.title || image.getAttribute("title") || "",
      imageFileName: fileNameFromUrl(imageUrl),
      width: image.naturalWidth || image.width || null,
      height: image.naturalHeight || image.height || null,
      sourceUrl: location.href,
      sourceDomain: location.hostname.replace(/^www\./, ""),
      sourceTitle: document.title
    };
  }

  function imageUrlCandidatesFromElement(image) {
    const candidates = [
      image.currentSrc,
      image.src,
      image.getAttribute("src"),
      image.getAttribute("data-src"),
      image.getAttribute("data-original"),
      image.getAttribute("data-lazy-src"),
      image.getAttribute("data-bg"),
      image.getAttribute("data-background"),
      image.getAttribute("data-full"),
      image.getAttribute("data-image"),
      image.getAttribute("data-url"),
      image.getAttribute("data-src-medium"),
      image.getAttribute("data-src-large"),
      image.getAttribute("data-src-xlarge"),
      image.getAttribute("data-webp"),
      image.getAttribute("data-lazy")
    ];
    const srcset = [image.getAttribute("srcset"), image.getAttribute("data-srcset"), image.getAttribute("data-lazy-srcset")];
    srcset.forEach((value) => {
      if (!value) return;
      splitImageCandidates(value).forEach((candidate) => candidates.push(candidate));
    });
    image.closest?.("picture")?.querySelectorAll?.("source").forEach((source) => {
      ["src", "srcset", "data-src", "data-srcset", "data-lazy-srcset"].forEach((name) => {
        const value = source.getAttribute(name);
        if (!value) return;
        splitImageCandidates(value).forEach((candidate) => candidates.push(candidate));
      });
    });
    [...(image.attributes || [])].forEach((attribute) => {
      if (!/(src|image|img|thumb|photo|url|poster|background)/i.test(attribute.name)) return;
      splitImageCandidates(attribute.value).forEach((candidate) => candidates.push(candidate));
    });
    [image, image.parentElement].filter(Boolean).forEach((element) => {
      const backgroundImage = window.getComputedStyle(element).backgroundImage || "";
      extractCssUrls(backgroundImage).forEach((candidate) => candidates.push(candidate));
    });
    return [...new Set(candidates.map((value) => String(value || "").trim()).filter(Boolean))];
  }

  function normalizeUrlLoose(value) {
    const raw = String(value || "").trim();
    if (!raw) return "";
    try {
      const url = new URL(raw, document.baseURI);
      url.hash = "";
      return decodeURIComponent(url.href).toLowerCase();
    } catch (error) {
      return raw.toLowerCase();
    }
  }

  function fileNameFromUrl(value) {
    try {
      const url = new URL(value, document.baseURI);
      return decodeURIComponent(url.pathname || "").split("/").filter(Boolean).pop()?.toLowerCase() || "";
    } catch (error) {
      return String(value || "").split("?")[0].split("#")[0].split("/").filter(Boolean).pop()?.toLowerCase() || "";
    }
  }

  function isExtensionContextError(error) {
    const message = String(error?.message || error || "");
    return /extension context invalidated|context invalidated|extension context is invalidated/i.test(message);
  }

  function swallowExtensionInvalidatedError(event) {
    const reason = event?.reason || event?.error || event;
    if (!isExtensionContextError(reason)) return;
    event.preventDefault?.();
  }

  async function safeRuntimeMessage(message) {
    try {
      const runtime = globalThis.chrome?.runtime;
      if (!runtime?.id) {
        disposeContentContext();
        return { ok: false, error: "Extension context invalidated." };
      }
      return await runtime.sendMessage(message);
    } catch (error) {
      if (isExtensionContextError(error)) {
        disposeContentContext();
        return { ok: false, error: "Extension context invalidated." };
      }
      return { ok: false, error: String(error?.message || error || "") };
    }
  }

  function runSafeAsync(callback) {
    try {
      Promise.resolve(callback()).catch((error) => {
        if (!isExtensionContextError(error)) {
          console.warn("[Ultimate Clipboard Pro]", error);
        }
      });
    } catch (error) {
      if (!isExtensionContextError(error)) {
        console.warn("[Ultimate Clipboard Pro]", error);
      }
    }
  }

  async function refreshState() {
    if (refreshStateInFlight) {
      refreshStateRerunRequested = true;
      return refreshStateInFlight;
    }
    refreshStateInFlight = refreshStateOnce();
    try {
      await refreshStateInFlight;
    } catch (error) {
      // Content scripts can be unloaded while Chrome refreshes the extension.
    } finally {
      refreshStateInFlight = null;
      if (refreshStateRerunRequested) {
        refreshStateRerunRequested = false;
        await refreshState();
      }
    }
  }

  const buildWelcomeFloatingPreviewState = globalThis.MCP.buildWelcomeFloatingPreviewState;

  async function refreshStateOnce() {
    if (IS_WELCOME_FLOATING_PREVIEW) {
      state = buildWelcomeFloatingPreviewState();
      currentDisplayAllowed = true;
      if (!shadowRoot) injectFloatingPanel({ initialSettings: state.settings, fastBoot: true });
      applyThemeSettings(state.settings);
      applyWelcomeFloatingPreviewMode();
      translateFloatingUi();
      renderPanel();
      return;
    }
    const [response] = await Promise.all([
      IS_NATIVE_SIDE_PANEL
        ? loadNativeSidePanelState()
        : safeRuntimeMessage({ type: MESSAGE_TYPES.GET_STATE }),
      IS_NATIVE_SIDE_PANEL ? Promise.resolve(true) : refreshCurrentDisplayPermission()
    ]);
    if (!response?.ok) return;
    const responseState = response.data || {};
    const currentSettingsUpdatedAt = Number(state.settings?.settingsUpdatedAt) || 0;
    const responseSettingsUpdatedAt = Number(responseState.settings?.settingsUpdatedAt) || 0;
    // GET_STATE is cached for fast panel rendering. A storage event can carry a
    // newer visual preference while an older cached request is still in flight;
    // never let that response roll the live theme back.
    const resolvedSettings = currentSettingsUpdatedAt > responseSettingsUpdatedAt
      ? state.settings
      : responseState.settings;
    state = Object.assign({}, responseState, { settings: resolvedSettings || {} });
    syncFloatingLauncherModelFromSettings(state.settings || {});
    state.settings = stabilizeFloatingLauncherSettings(state.settings || {});
    globalThis.MCP.configureDateTimeFormatting(state.settings);
    rerenderActiveGlobalToolSelectionController();
    if (!isWelcomeSetupCompleted(state.settings)) {
      removeFloatingPanel();
      return;
    }
    if (!IS_NATIVE_SIDE_PANEL && !currentDisplayAllowed) {
      removeFloatingPanel();
      return;
    }
    if (IS_NATIVE_SIDE_PANEL) currentDisplayAllowed = true;
    if (!shadowRoot) injectFloatingPanel();
    applyThemeSettings(state.settings);
    applyPanelVisibility();
    applyFloatingLauncherState(state.settings);
    translateFloatingUi();
    renderPanel();
    if (IS_NATIVE_SIDE_PANEL) {
      applyNativeSidePanelMode();
      openRequestedNativeSidePanelView();
    } else {
      maybeShowOnboarding();
    }
  }

  async function safeStorageGet(keys) {
    try {
      const runtime = globalThis.chrome?.runtime;
      const storage = globalThis.chrome?.storage?.local;
      if (!runtime?.id || !storage?.get) return {};
      return await storage.get(keys);
    } catch (error) {
      if (!isExtensionContextError(error)) {
        console.warn("[Ultimate Clipboard Pro] Storage read failed.", error);
      }
      return {};
    }
  }

  async function loadNativeSidePanelState() {
    const response = await safeRuntimeMessage({ type: MESSAGE_TYPES.GET_STATE });
    if (response?.ok) return response;
    const settings = await globalThis.MCP.getSettings();
    const collections = await globalThis.MCP.getUiStateCollections(settings.language || "en");
    return { ok: true, data: Object.assign({ settings }, collections) };
  }

  function bootstrapFloatingPanelShell() {
    const settingsKey = (globalThis.MCP?.STORAGE_KEYS?.SETTINGS) || "mcp_settings";
    const storage = globalThis.chrome?.storage?.local;
    if (!globalThis.chrome?.runtime?.id || !storage?.get) return;
    storage.get(settingsKey, (stored) => {
      if (chrome.runtime?.lastError) return;
      const settings = Object.assign({}, globalThis.MCP?.DEFAULT_SETTINGS || {}, stored?.[settingsKey] || {});
      syncFloatingLauncherModelFromSettings(settings);
      state.settings = stabilizeFloatingLauncherSettings(Object.assign({}, state.settings || {}, settings));
      globalThis.MCP.configureDateTimeFormatting(state.settings);
      rerenderActiveGlobalToolSelectionController();
      if (!isWelcomeSetupCompleted(settings)) {
        removeFloatingPanel();
        return;
      }
      if (!IS_NATIVE_SIDE_PANEL && isLauncherSuppressedPage()) {
        removeFloatingPanel();
        return;
      }
      if (IS_NATIVE_SIDE_PANEL) {
        currentDisplayAllowed = true;
        if (!shadowRoot) injectFloatingPanel({ initialSettings: settings, fastBoot: true });
        applyThemeSettings(settings);
        applyFloatingLauncherState(settings);
        translateFloatingUi();
        renderPanel();
        applyNativeSidePanelMode();
        return;
      }
      runSafeAsync(async () => {
        const allowed = await refreshCurrentDisplayPermission();
        if (!allowed || shadowRoot) return;
        injectFloatingPanel({ initialSettings: settings, fastBoot: true });
        applyThemeSettings(settings);
        applyPanelVisibility();
        applyFloatingLauncherState(settings);
      });
    });
  }

  async function refreshCurrentDisplayPermission() {
    if (IS_NATIVE_SIDE_PANEL) {
      currentDisplayAllowed = true;
      return true;
    }
    if (displayPermissionRefreshInFlight) return displayPermissionRefreshInFlight;
    displayPermissionRefreshInFlight = (async () => {
      const response = await safeRuntimeMessage({
        type: MESSAGE_TYPES.CHECK_DISPLAY_ALLOWED,
        sourceUrl: location.href,
        sourceDomain: location.hostname.replace(/^www\./, "")
      });
      const displayAllowed = response?.ok === true && response.data?.allowed !== false;
      currentDisplayAllowed = displayAllowed && !isLauncherSuppressedPage();
      return currentDisplayAllowed;
    })();
    try {
      return await displayPermissionRefreshInFlight;
    } finally {
      displayPermissionRefreshInFlight = null;
    }
  }

  function isLauncherSuppressedPage() {
    return Boolean(globalThis.MCP?.isDomainExcluded?.(
      location.hostname.replace(/^www\./, ""),
      globalThis.MCP?.DEFAULT_EXCLUDED_DEMO_URLS || [],
      location.href
    ));
  }

  function removeFloatingPanel() {
    floatingDriveQuickSyncController?.destroy();
    floatingDriveQuickSyncController = null;
    const host = document.getElementById("ucp-demo-floating-host");
    if (host) host.remove();
    removeLauncherShell();
    shadowRoot = null;
    floatingPanelCssReady = false;
    floatingPanelQueuedSettings = null;
  }

  function removeLauncherShell() {
    document.getElementById("mcp-floating-preboot-host")?.remove();
  }

  function scheduleDisplayPermissionRefresh() {
    clearTimeout(scheduleDisplayPermissionRefresh.timer);
    scheduleDisplayPermissionRefresh.timer = window.setTimeout(() => {
      runSafeAsync(async () => {
        await refreshCurrentDisplayPermission();
        applyPanelVisibility();
      });
    }, 220);
  }

  function normalizeHexColor(value, fallback = "#e50914") {
    const raw = String(value || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
    if (/^#[0-9a-f]{3}$/i.test(raw)) return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toLowerCase();
    return fallback;
  }

  function hexToRgbParts(value) {
    const hex = normalizeHexColor(value).slice(1);
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ].join(", ");
  }

  function resolveTheme(theme = "system") {
    if (theme === "light" || theme === "dark") return theme;
    return window.matchMedia?.("(prefers-color-scheme: light)")?.matches ? "light" : "dark";
  }

  function applyThemeSettings(settings = {}) {
    if (!shadowRoot?.host) return;
    applyThemeSettingsToHost(shadowRoot.host, settings);
    forceToolsLauncherGlass();
  }

  function applyFloatingLauncherState(settings = state.settings || {}) {
    const panel = shadowRoot?.querySelector(".mcp-panel");
    if (!panel) return;
    updateLauncherRecentTool(settings);
    if (IS_NATIVE_SIDE_PANEL) {
      applyNativeSidePanelMode();
      return;
    }
    if (floatingLauncherDragState) {
      floatingLauncherDragState.deferredSettings = Object.assign({}, settings || {});
      return;
    }
    if (IS_WEB_LAUNCHER) {
      syncFloatingLauncherModelFromSettings(settings);
      state.settings = stabilizeFloatingLauncherSettings(Object.assign({}, state.settings || {}, settings || {}));
    }
    const effectiveSettings = isFloatingPanelManualCloseGuardActive() || isFloatingPanelPersistentlyClosed(settings)
      ? Object.assign({}, settings || {}, { floatingPanelOpen: false })
      : IS_WEB_LAUNCHER
        ? Object.assign({}, settings || {}, { floatingPanelOpen: false })
        : settings;
    if (IS_WELCOME_FLOATING_PREVIEW) {
      applyWelcomeFloatingPreviewMode();
      return;
    }
    syncFloatingEntryPointUsage(effectiveSettings);
    panel.style.setProperty("--launcher-bottom", `${IS_WEB_LAUNCHER ? floatingLauncherModel.bottom : clampFloatingLauncherBottom(effectiveSettings.floatingLauncherBottom)}px`);
    if (!floatingPanelCssReady || panel.classList.contains("is-launcher-hydrating")) {
      floatingPanelQueuedSettings = Object.assign({}, effectiveSettings || {});
      setElementClass(panel, "is-minimized", true);
      setElementClass(panel, "is-launcher-collapsed", IS_WEB_LAUNCHER ? floatingLauncherModel.collapsed : effectiveSettings.floatingLauncherCollapsed === true);
      return;
    }
    if (IS_WEB_LAUNCHER ? floatingLauncherModel.collapsed : effectiveSettings.floatingLauncherCollapsed) {
      setElementClass(panel, "is-minimized", true);
      setElementClass(panel, "is-launcher-collapsed", true);
      closeFloatingMenu();
    } else {
      setElementClass(panel, "is-launcher-collapsed", false);
      setElementClass(panel, "is-minimized", effectiveSettings.floatingPanelOpen !== true);
    }
    enforceWebLauncherOnlyMode();
    updateFirstUseButtonPrompts();
  }

  function enforceWebLauncherOnlyMode() {
    if (!IS_WEB_LAUNCHER || !shadowRoot) return;
    const panel = shadowRoot.querySelector(".mcp-panel");
    const chooser = shadowRoot.querySelector("[data-role='chooser']");
    if (chooser) chooser.hidden = true;
    panel?.classList.remove("is-classifying");
    panel?.classList.add("is-minimized");
  }

  function applyNativeSidePanelMode() {
    if (!IS_NATIVE_SIDE_PANEL || !shadowRoot) return;
    const host = shadowRoot.host;
    const panel = shadowRoot.querySelector(".mcp-panel");
    if (!host || !panel) return;
    host.classList.add("is-native-side-panel");
    host.style.display = "block";
    panel.hidden = false;
    panel.style.visibility = "";
    panel.classList.remove("is-minimized", "is-launcher-collapsed", "is-launcher-hydrating", "is-launcher-dragging");
    shadowRoot.querySelectorAll("[data-role='tool-workspace']").forEach((node) => node.remove());
    const floatingTextModal = shadowRoot.querySelector("[data-role='floating-text-modal']");
    if (floatingTextModal) {
      floatingTextModal.hidden = true;
      floatingTextModal.querySelector(".mcp-floating-text-card")?.classList.remove("is-pro-upgrade", "is-tool-help");
      floatingTextModal.querySelector("[data-role='floating-text-content']")?.replaceChildren();
    }
    const searchOverlay = shadowRoot.querySelector("[data-role='search-overlay']");
    if (searchOverlay) searchOverlay.hidden = true;
    floatingTextModalReturn = null;
    [
      ".mcp-launcher-collapse",
      ".mcp-launcher-manager",
      ".mcp-launcher-tools",
      ".mcp-launcher-recent-tool",
      ".mcp-fullpage-shot",
      ".mcp-launcher-tab"
    ].forEach((selector) => {
      shadowRoot.querySelectorAll(selector).forEach((node) => node.remove());
    });
    if (!nativeSidePanelClassGuard) {
      nativeSidePanelClassGuard = new MutationObserver(() => {
        if (!IS_NATIVE_SIDE_PANEL || !panel.isConnected) return;
        if (panel.hidden) panel.hidden = false;
        const forbiddenClasses = ["is-minimized", "is-launcher-collapsed", "is-launcher-hydrating", "is-launcher-dragging"];
        if (forbiddenClasses.some((className) => panel.classList.contains(className))) {
          panel.classList.remove(...forbiddenClasses);
        }
      });
      nativeSidePanelClassGuard.observe(panel, {
        attributes: true,
        attributeFilter: ["class", "hidden"]
      });
    }
    let style = shadowRoot.querySelector("[data-role='native-side-panel-style']");
    if (!style) {
      style = document.createElement("style");
      style.dataset.role = "native-side-panel-style";
      style.textContent = `
        :host(.is-native-side-panel) {
          all: initial !important;
          position: fixed !important;
          inset: 0 !important;
          z-index: 1 !important;
          display: block !important;
          width: var(--ucp-ui-viewport-width, 100vw) !important;
          height: var(--ucp-ui-viewport-height, 100vh) !important;
          min-width: 280px !important;
          transform: scale(var(--ucp-ui-zoom-inverse, 1)) !important;
          transform-origin: 0 0 !important;
          overflow: hidden !important;
          color-scheme: dark;
          font-family: "Segoe UI Variable Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
          background: var(--floating-list-bg) !important;
        }
        :host(.is-native-side-panel:not([data-resolved-theme="light"])) {
          --content-workspace-bg: #14181e;
          --bg: var(--content-workspace-bg);
          --floating-list-bg: var(--content-workspace-bg);
          --panel: var(--content-workspace-bg);
          --panel-solid: var(--content-workspace-bg);
          --surface: var(--content-workspace-bg);
          --list-fade-start: rgba(20, 24, 30, 0);
          --list-fade-mid: rgba(20, 24, 30, 0.985);
          --list-fade-stop: var(--content-workspace-bg);
        }
        :host(.is-native-side-panel:not([data-resolved-theme="light"])) .mcp-header {
          background: var(--content-workspace-bg);
        }
        :host(.is-native-side-panel) .mcp-panel {
          position: fixed !important;
          inset: 0 !important;
          width: 100% !important;
          min-width: 0 !important;
          height: 100% !important;
          min-height: 0 !important;
          max-height: none !important;
          overflow: hidden !important;
          border: 0 !important;
          border-radius: 0 !important;
          filter: none !important;
          box-shadow: none !important;
          transform: none !important;
          opacity: 1 !important;
          visibility: visible !important;
          -webkit-mask-image: none !important;
          mask-image: none !important;
          backdrop-filter: none !important;
          background: var(--panel-solid) !important;
          font-family: inherit !important;
          container: native-side-panel / inline-size !important;
        }
        :host(.is-native-side-panel) .mcp-header {
          min-height: 64px !important;
          padding: 10px 12px !important;
          cursor: default !important;
        }
        :host(.is-native-side-panel) .mcp-title {
          min-width: 0 !important;
          width: auto !important;
          flex: 1 1 0 !important;
          overflow: hidden !important;
        }
        :host(.is-native-side-panel) .mcp-title strong {
          display: block !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-overflow: ellipsis !important;
          font-size: 13.5px !important;
          line-height: 1.15 !important;
        }
        :host(.is-native-side-panel) .mcp-title span {
          display: block !important;
          overflow: hidden !important;
          white-space: nowrap !important;
          text-overflow: ellipsis !important;
          font-size: 10.5px !important;
          line-height: 1.15 !important;
        }
        :host(.is-native-side-panel) .mcp-title strong,
        :host(.is-native-side-panel) .mcp-preview-text,
        :host(.is-native-side-panel) .mcp-image-meta,
        :host(.is-native-side-panel) button,
        :host(.is-native-side-panel) input,
        :host(.is-native-side-panel) textarea,
        :host(.is-native-side-panel) select {
          font-family: "Segoe UI Variable Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        }
        :host(.is-native-side-panel) pre,
        :host(.is-native-side-panel) code,
        :host(.is-native-side-panel) .is-code,
        :host(.is-native-side-panel) [data-media-type="dev"] .mcp-preview-text {
          font-family: "Cascadia Mono", Consolas, "Liberation Mono", monospace !important;
        }
        :host(.is-native-side-panel) .mcp-body {
          height: calc(100% - 64px) !important;
          padding-bottom: 0 !important;
        }
        :host(.is-native-side-panel) .mcp-search-overlay,
        :host(.is-native-side-panel) .mcp-editor-modal,
        :host(.is-native-side-panel) .mcp-dev-suggestion,
        :host(.is-native-side-panel) .mcp-floating-text-modal,
        :host(.is-native-side-panel) .mcp-onboarding-modal,
        :host(.is-native-side-panel) .mcp-pro-modal,
        :host(.is-native-side-panel) .mcp-capture-limit-modal,
        :host(.is-native-side-panel) .mcp-vault-modal,
        :host(.is-native-side-panel) .mcp-image-info-modal,
        :host(.is-native-side-panel) .mcp-confirm-modal,
        :host(.is-native-side-panel) .mcp-onboarding-drive-confirm {
          position: fixed !important;
          inset: 0 !important;
          z-index: 2147483647 !important;
        }
        :host(.is-native-side-panel) .mcp-tool-workspace-modal {
          display: none !important;
        }
        @container native-side-panel (max-width: 390px) {
          :host(.is-native-side-panel) .mcp-header {
            gap: 5px !important;
            padding-inline: 8px !important;
          }
          :host(.is-native-side-panel) .mcp-brand {
            width: 38px !important;
            height: 38px !important;
            flex: 0 0 38px !important;
          }
          :host(.is-native-side-panel) .mcp-brand > img {
            width: 29px !important;
            height: 29px !important;
          }
          :host(.is-native-side-panel) .mcp-brand > .brand-pro-badge {
            top: -5px !important;
            right: -5px !important;
            width: 19px !important;
            height: 19px !important;
          }
          :host(.is-native-side-panel) .mcp-brand > .brand-pro-badge > img {
            width: 13px !important;
            height: 13px !important;
            max-width: 13px !important;
            max-height: 13px !important;
          }
          :host(.is-native-side-panel) .mcp-icon {
            width: 30px !important;
            min-width: 30px !important;
            height: 30px !important;
          }
          :host(.is-native-side-panel) .mcp-title span {
            display: block !important;
          }
        }
        @container native-side-panel (max-width: 350px) {
          :host(.is-native-side-panel) .mcp-header {
            gap: 4px !important;
            padding-inline: 6px !important;
          }
          :host(.is-native-side-panel) .mcp-brand {
            display: grid !important;
            width: 34px !important;
            height: 34px !important;
            flex-basis: 34px !important;
          }
          :host(.is-native-side-panel) .mcp-brand > img {
            width: 27px !important;
            height: 27px !important;
          }
          :host(.is-native-side-panel) .mcp-brand > .brand-pro-badge {
            top: -4px !important;
            right: -4px !important;
            width: 18px !important;
            height: 18px !important;
          }
          :host(.is-native-side-panel) .mcp-brand > .brand-pro-badge > img {
            width: 12px !important;
            height: 12px !important;
            max-width: 12px !important;
            max-height: 12px !important;
          }
          :host(.is-native-side-panel) .mcp-icon {
            width: 28px !important;
            min-width: 28px !important;
            height: 28px !important;
            border-radius: 8px !important;
          }
          :host(.is-native-side-panel) .mcp-icon img,
          :host(.is-native-side-panel) .mcp-header-tools-button img {
            width: 18px !important;
            height: 18px !important;
          }
        }
        @container native-side-panel (max-width: 300px) {
          :host(.is-native-side-panel) .mcp-header {
            gap: 3px !important;
            padding-inline: 4px !important;
          }
          :host(.is-native-side-panel) .mcp-brand {
            width: 32px !important;
            height: 32px !important;
            flex-basis: 32px !important;
          }
          :host(.is-native-side-panel) .mcp-brand > img {
            width: 25px !important;
            height: 25px !important;
          }
          :host(.is-native-side-panel) .mcp-brand > .brand-pro-badge {
            top: -3px !important;
            right: -3px !important;
            width: 17px !important;
            height: 17px !important;
          }
          :host(.is-native-side-panel) .mcp-brand > .brand-pro-badge > img {
            width: 11px !important;
            height: 11px !important;
            max-width: 11px !important;
            max-height: 11px !important;
          }
          :host(.is-native-side-panel) .mcp-panel:not(.is-minimized) [data-action="close-panel"] {
            width: 28px !important;
            min-width: 28px !important;
            height: 28px !important;
            min-height: 28px !important;
          }
          :host(.is-native-side-panel) .mcp-panel:not(.is-minimized) [data-action="close-panel"]::before,
          :host(.is-native-side-panel) .mcp-panel:not(.is-minimized) [data-action="close-panel"]::after {
            width: 14px !important;
          }
        }
        :host(.is-native-side-panel) .mcp-header {
          min-height: 60px !important;
          gap: 5px !important;
          padding: 7px 8px !important;
        }
        :host(.is-native-side-panel) .mcp-brand {
          display: grid !important;
          width: 42px !important;
          min-width: 42px !important;
          height: 42px !important;
          min-height: 42px !important;
          flex: 0 0 42px !important;
        }
        :host(.is-native-side-panel) .mcp-brand > img {
          width: 36px !important;
          min-width: 36px !important;
          height: 36px !important;
          min-height: 36px !important;
        }
        :host(.is-native-side-panel) .mcp-brand > .brand-pro-badge {
          top: -4px !important;
          right: -4px !important;
          width: 17px !important;
          min-width: 17px !important;
          height: 17px !important;
          min-height: 17px !important;
        }
        :host(.is-native-side-panel) .mcp-brand > .brand-pro-badge > img {
          width: 11px !important;
          max-width: 11px !important;
          height: 11px !important;
          max-height: 11px !important;
        }
        :host(.is-native-side-panel) .mcp-icon,
        :host(.is-native-side-panel) .mcp-header-tools-button,
        :host(.is-native-side-panel) .mcp-panel:not(.is-minimized) [data-action="close-panel"] {
          width: 30px !important;
          min-width: 30px !important;
          max-width: 30px !important;
          height: 30px !important;
          min-height: 30px !important;
          max-height: 30px !important;
          flex: 0 0 30px !important;
          padding: 0 !important;
        }
        :host(.is-native-side-panel) .mcp-icon img,
        :host(.is-native-side-panel) .mcp-header-tools-button img {
          width: 18px !important;
          min-width: 18px !important;
          max-width: 18px !important;
          height: 18px !important;
          min-height: 18px !important;
          max-height: 18px !important;
        }
        :host(.is-native-side-panel) .mcp-title strong {
          font-size: 12.5px !important;
          line-height: 15px !important;
        }
        :host(.is-native-side-panel) .mcp-title span {
          font-size: 10px !important;
          line-height: 12px !important;
        }
      `;
      shadowRoot.appendChild(style);
    }
    updateFloatingBrandProBadge();
  }

  let nativeRequestedViewOpened = false;
  function openRequestedNativeSidePanelView() {
    if (!IS_NATIVE_SIDE_PANEL || nativeRequestedViewOpened) return;
    const requestedView = new URLSearchParams(location.search).get("view");
    if (requestedView !== "tools") return;
    nativeRequestedViewOpened = true;
    requestAnimationFrame(() => requestAnimationFrame(() => runSafeAsync(requestToolsOverlay)));
  }

  function applyWelcomeFloatingPreviewMode() {
    if (!IS_WELCOME_FLOATING_PREVIEW || !shadowRoot) return;
    const host = shadowRoot.host;
    const panel = shadowRoot.querySelector(".mcp-panel");
    if (!panel) return;
    const welcomePreviewRect = state.settings?.welcomePreviewRect || null;
    const previewRectValue = (key, fallback) => {
      const numeric = Number(welcomePreviewRect?.[key]);
      return Number.isFinite(numeric) ? `${Math.round(numeric)}px` : fallback;
    };
    host.classList.add("is-welcome-floating-preview");
    host.style.setProperty("--ucp-welcome-preview-top", previewRectValue("top", "clamp(42px, 5vh, 56px)"));
    host.style.setProperty("--ucp-welcome-preview-left", previewRectValue("left", "auto"));
    host.style.setProperty("--ucp-welcome-preview-right", String(state.settings?.welcomePreviewRight || "clamp(28px, 4vw, 72px)"));
    host.style.setProperty("--ucp-welcome-preview-width", previewRectValue("width", "min(430px, 32vw)"));
    host.style.setProperty("--ucp-welcome-preview-height", previewRectValue("height", "min(860px, calc(100vh - 114px))"));
    host.classList.toggle("is-preview-hidden", window.__UCP_WELCOME_FLOATING_PREVIEW_VISIBLE__ === false || state.settings?.previewVisible === false);
    host.classList.toggle("is-preview-building", state.settings?.previewMode === "restore-building");
    host.classList.toggle("is-preview-restored", state.settings?.previewMode === "restore-ready");
    host.style.display = "";
    floatingPanelCssReady = true;
    floatingPanelQueuedSettings = null;
    panel.hidden = false;
    panel.style.visibility = "";
    panel.classList.remove("is-minimized", "is-launcher-collapsed", "is-launcher-hydrating");
    [
      "[data-action='open-sidepanel']",
      "[data-action='close-panel']",
      "[data-action='open-floating-menu']",
      "[data-role='floating-menu-button']",
      "[data-action='open-tools']",
      "[data-action='open-launcher-tools']",
      "[data-action='open-launcher-recent-tool']",
      "[data-action='open-launcher-manager']",
      "[data-action='capture-full-page']",
      "[data-action='collapse-launcher']",
      "[data-action='expand-launcher']",
      ".mcp-launcher-tools",
      ".mcp-launcher-recent-tool",
      ".mcp-launcher-manager",
      ".mcp-launcher-collapse",
      ".mcp-launcher-tab",
      ".mcp-fullpage-shot"
    ].forEach((selector) => {
      shadowRoot.querySelectorAll(selector).forEach((node) => { node.hidden = true; });
    });
    let style = shadowRoot.querySelector("[data-role='welcome-floating-preview-style']");
    if (!style) {
      style = document.createElement("style");
      style.dataset.role = "welcome-floating-preview-style";
      const syncGifUrl = chrome.runtime.getURL("assets/icons/sync-in-progess.gif");
      style.textContent = `
        :host(.is-welcome-floating-preview) {
          all: initial !important;
          position: fixed !important;
          top: var(--ucp-welcome-preview-top, clamp(42px, 5vh, 56px)) !important;
          left: var(--ucp-welcome-preview-left, auto) !important;
          right: var(--ucp-welcome-preview-right, clamp(28px, 4vw, 72px)) !important;
          bottom: auto !important;
          z-index: 12 !important;
          display: block !important;
          width: var(--ucp-welcome-preview-width, min(430px, 32vw)) !important;
          transform: none !important;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
          pointer-events: auto !important;
        }
        :host(.is-welcome-floating-preview.is-preview-hidden) {
          display: none !important;
        }
        :host(.is-welcome-floating-preview) .mcp-panel {
          position: relative !important;
          right: auto !important;
          bottom: auto !important;
          width: 100% !important;
          height: var(--ucp-welcome-preview-height, min(860px, calc(100vh - 114px))) !important;
          min-height: var(--ucp-welcome-preview-height, min(720px, calc(100vh - 114px))) !important;
          max-height: var(--ucp-welcome-preview-height, min(860px, calc(100vh - 114px))) !important;
          visibility: visible !important;
          opacity: 1 !important;
          transform: none !important;
          -webkit-mask-image: none !important;
          mask-image: none !important;
          border-radius: 14px !important;
        }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-panel {
          animation: none !important;
        }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-list {
          gap: 10px !important;
          padding-top: 16px !important;
        }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-item,
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-image-card {
          position: absolute !important;
          left: 0 !important;
          right: 0 !important;
          display: block !important;
          min-height: 116px !important;
          height: 116px !important;
          border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent) !important;
          background:
            linear-gradient(115deg, transparent 0%, color-mix(in srgb, var(--accent) 18%, transparent) 38%, color-mix(in srgb, var(--mcp-floating-invert, #fff) 18%, transparent) 48%, color-mix(in srgb, var(--accent) 20%, transparent) 58%, transparent 100%),
            color-mix(in srgb, var(--accent) 8%, var(--floating-list-bg)) !important;
          background-size: 240% 100%, 100% 100% !important;
          box-shadow: none !important;
          opacity: .34 !important;
          transform: translateY(calc(var(--ghost-index, 0) * 128px)) scale(.985) !important;
          pointer-events: none !important;
          animation:
            ucpWelcomeGhostBreathe 1.95s ease-in-out infinite,
            ucpWelcomeGhostSweep 1.55s linear infinite !important;
        }
        :host(.is-welcome-floating-preview.is-preview-building[data-resolved-theme="light"]) .mcp-item,
        :host(.is-welcome-floating-preview.is-preview-building[data-resolved-theme="light"]) .mcp-image-card {
          --mcp-floating-invert: #000;
        }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-item:nth-child(1),
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-image-card:nth-child(1) { --ghost-index: 0; animation-delay: 0ms, 0ms !important; }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-item:nth-child(2),
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-image-card:nth-child(2) { --ghost-index: 1; animation-delay: 120ms, 90ms !important; }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-item:nth-child(3),
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-image-card:nth-child(3) { --ghost-index: 2; animation-delay: 240ms, 180ms !important; }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-item:nth-child(4),
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-image-card:nth-child(4) { --ghost-index: 3; animation-delay: 360ms, 270ms !important; }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-item:nth-child(5),
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-image-card:nth-child(5) { --ghost-index: 4; animation-delay: 480ms, 360ms !important; }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-item:nth-child(6),
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-image-card:nth-child(6) { --ghost-index: 5; animation-delay: 600ms, 450ms !important; }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-item > *,
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-image-card > * {
          opacity: 0 !important;
        }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-item::after,
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-image-card::after {
          content: "" !important;
          position: absolute !important;
          left: 50% !important;
          top: 50% !important;
          width: 34px !important;
          height: 34px !important;
          background: url("${syncGifUrl}") center / contain no-repeat !important;
          transform: translate(-50%, -50%) !important;
          opacity: .92 !important;
          filter: drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 42%, transparent)) !important;
          animation: ucpWelcomeGhostSpinner 1.8s ease-in-out infinite !important;
        }
        :host(.is-welcome-floating-preview.is-preview-building) .mcp-list {
          position: relative !important;
          min-height: 780px !important;
        }
        :host(.is-welcome-floating-preview.is-preview-restored) .mcp-item,
        :host(.is-welcome-floating-preview.is-preview-restored) .mcp-image-card {
          animation: ucpWelcomeRestoredItem 520ms cubic-bezier(.18,.9,.22,1) both !important;
        }
        @keyframes ucpWelcomeGhostBreathe {
          0%, 100% { opacity: .26; filter: saturate(1.1); }
          48% { opacity: .64; filter: saturate(1.4); }
        }
        @keyframes ucpWelcomeGhostSweep {
          0% { background-position: 120% 0, 0 0; }
          100% { background-position: -120% 0, 0 0; }
        }
        @keyframes ucpWelcomeGhostSpinner {
          0%, 100% { opacity: .72; transform: translate(-50%, -50%) scale(.92); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes ucpWelcomeRestoredItem {
          0% { opacity: 0; transform: translateY(18px) scale(.985); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: none; }
        }
        :host(.is-welcome-floating-preview) .mcp-header [hidden],
        :host(.is-welcome-floating-preview) [data-action="open-sidepanel"],
        :host(.is-welcome-floating-preview) [data-action="close-panel"],
        :host(.is-welcome-floating-preview) [data-action="open-floating-menu"],
        :host(.is-welcome-floating-preview) [data-action="open-tools"],
        :host(.is-welcome-floating-preview) [data-action="capture-full-page"],
        :host(.is-welcome-floating-preview) .mcp-floating-menu,
        :host(.is-welcome-floating-preview) .mcp-launcher-tools,
        :host(.is-welcome-floating-preview) .mcp-launcher-collapse,
        :host(.is-welcome-floating-preview) .mcp-launcher-tab,
        :host(.is-welcome-floating-preview) .mcp-fullpage-shot {
          display: none !important;
        }
        :host(.is-welcome-floating-preview) .mcp-header {
          cursor: default !important;
        }
      `;
      shadowRoot.appendChild(style);
    }
  }

  if (IS_WELCOME_FLOATING_PREVIEW) {
    window.__UCP_WELCOME_FLOATING_PREVIEW_UPDATE__ = (settings = {}) => {
      window.__UCP_WELCOME_FLOATING_PREVIEW_SETTINGS__ = Object.assign({}, window.__UCP_WELCOME_FLOATING_PREVIEW_SETTINGS__ || {}, settings || {});
      state = buildWelcomeFloatingPreviewState(settings);
      const welcomePreviewTab = String(settings?.welcomePreviewTab || "");
      if (["text", "dev", "image"].includes(welcomePreviewTab)) activeFloatingTab = welcomePreviewTab;
      currentDisplayAllowed = true;
      if (!shadowRoot) injectFloatingPanel({ initialSettings: state.settings, fastBoot: true });
      applyThemeSettings(state.settings);
      applyWelcomeFloatingPreviewMode();
      translateFloatingUi();
      renderPanel();
    };
  }

  function syncFloatingEntryPointUsage(settings = state.settings || {}) {
    floatingEntryPointUsed.floatingLauncherOpenedOnce = Boolean(floatingEntryPointUsed.floatingLauncherOpenedOnce || settings?.floatingLauncherOpenedOnce);
    floatingEntryPointUsed.managerOpenedOnce = Boolean(floatingEntryPointUsed.managerOpenedOnce || settings?.managerOpenedOnce);
  }

  function clampFloatingLauncherBottom(value) {
    const fallback = 94;
    const numeric = Number(value);
    const viewportHeight = Math.max(320, (window.innerHeight || 720) * (IS_WEB_LAUNCHER ? currentPageZoomFactor : 1));
    const maxBottom = Math.max(80, viewportHeight - 148);
    return Math.round(Math.min(maxBottom, Math.max(24, Number.isFinite(numeric) ? numeric : fallback)));
  }

  function normalizePageZoomFactor(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 1;
    return Math.min(5, Math.max(0.25, numeric));
  }

  async function requestCurrentPageZoomFactor() {
    if (!IS_WEB_LAUNCHER) return 1;
    const response = await safeRuntimeMessage({ type: MESSAGE_TYPES.GET_PAGE_ZOOM });
    const zoomFactor = response?.data?.zoomFactor ?? response?.zoomFactor ?? 1;
    applyPageZoomFactor(zoomFactor);
    return currentPageZoomFactor;
  }

  function applyPageZoomFactor(value) {
    if (!IS_WEB_LAUNCHER) return;
    const nextZoomFactor = normalizePageZoomFactor(value);
    if (floatingLauncherDragState) {
      handleFloatingLauncherPointerEnd({
        pointerId: floatingLauncherDragState.pointerId,
        launcherScreenY: floatingLauncherDragState.pendingY
      });
    }
    currentPageZoomFactor = nextZoomFactor;
    const inverse = String(1 / nextZoomFactor);
    [document.getElementById("ucp-demo-floating-host")].filter(Boolean).forEach((host) => {
      host.dataset.pageZoom = String(nextZoomFactor);
      host.style.setProperty("--mcp-page-zoom", String(nextZoomFactor));
      host.style.setProperty("--mcp-page-zoom-inverse", inverse);
      host.style.setProperty("--mcp-compensated-vw", `calc(100vw * ${nextZoomFactor})`);
      host.style.setProperty("--mcp-compensated-vh", `calc(100vh * ${nextZoomFactor})`);
    });
    if (floatingLauncherModel.initialized) {
      floatingLauncherModel.bottom = clampFloatingLauncherBottom(floatingLauncherModel.bottom);
      applyFloatingLauncherModelToDom();
    }
  }

  function launcherPointerScreenY(event, fallback = 0) {
    const normalized = Number(event?.launcherScreenY);
    if (Number.isFinite(normalized)) return normalized;
    const clientY = Number(event?.clientY);
    return Number.isFinite(clientY) ? clientY * currentPageZoomFactor : fallback;
  }

  function syncFloatingLauncherModelFromSettings(settings = {}, options = {}) {
    if (!IS_WEB_LAUNCHER) return;
    const initialize = options.initialize === true || !floatingLauncherModel.initialized;
    const incomingModeUpdatedAt = Math.max(0, Number(settings.floatingLauncherModeUpdatedAt) || 0);
    const incomingPositionUpdatedAt = Math.max(0, Number(settings.floatingLauncherPositionUpdatedAt) || 0);
    if (initialize) {
      floatingLauncherModel.initialized = true;
      floatingLauncherModel.collapsed = settings.floatingLauncherCollapsed === true;
      floatingLauncherModel.modeUpdatedAt = incomingModeUpdatedAt;
      floatingLauncherModel.bottom = clampFloatingLauncherBottom(settings.floatingLauncherBottom);
      floatingLauncherModel.positionUpdatedAt = incomingPositionUpdatedAt;
      return;
    }
    if (incomingModeUpdatedAt > floatingLauncherModel.modeUpdatedAt) {
      floatingLauncherModel.collapsed = settings.floatingLauncherCollapsed === true;
      floatingLauncherModel.modeUpdatedAt = incomingModeUpdatedAt;
    }
    if (!floatingLauncherDragState
      && !floatingLauncherPendingPosition
      && incomingPositionUpdatedAt > floatingLauncherModel.positionUpdatedAt) {
      floatingLauncherModel.bottom = clampFloatingLauncherBottom(settings.floatingLauncherBottom);
      floatingLauncherModel.positionUpdatedAt = incomingPositionUpdatedAt;
    }
  }

  function stabilizeFloatingLauncherSettings(settings = {}) {
    if (!IS_WEB_LAUNCHER || !floatingLauncherModel.initialized) return settings;
    return Object.assign({}, settings || {}, {
      floatingLauncherCollapsed: floatingLauncherModel.collapsed,
      floatingLauncherModeUpdatedAt: floatingLauncherModel.modeUpdatedAt,
      floatingLauncherBottom: floatingLauncherModel.bottom,
      floatingLauncherPositionUpdatedAt: floatingLauncherModel.positionUpdatedAt
    });
  }

  function reconcileStaleFloatingLauncherSettings(settings = {}) {
    if (!IS_WEB_LAUNCHER || !floatingLauncherModel.initialized || floatingLauncherReconcileQueued) return;
    const incomingModeUpdatedAt = Math.max(0, Number(settings.floatingLauncherModeUpdatedAt) || 0);
    const incomingPositionUpdatedAt = Math.max(0, Number(settings.floatingLauncherPositionUpdatedAt) || 0);
    const staleMode = incomingModeUpdatedAt <= floatingLauncherModel.modeUpdatedAt
      && (settings.floatingLauncherCollapsed === true) !== floatingLauncherModel.collapsed;
    const stalePosition = incomingPositionUpdatedAt <= floatingLauncherModel.positionUpdatedAt
      && clampFloatingLauncherBottom(settings.floatingLauncherBottom) !== floatingLauncherModel.bottom;
    if (!staleMode && !stalePosition) return;
    floatingLauncherReconcileQueued = true;
    Promise.allSettled([floatingLauncherModeWriteQueue, floatingLauncherPositionWriteQueue])
      .then(() => saveSettingsPatch({
        floatingLauncherCollapsed: floatingLauncherModel.collapsed,
        floatingLauncherModeUpdatedAt: floatingLauncherModel.modeUpdatedAt,
        floatingLauncherBottom: floatingLauncherModel.bottom,
        floatingLauncherPositionUpdatedAt: floatingLauncherModel.positionUpdatedAt
      }))
      .catch(() => {})
      .finally(() => {
        floatingLauncherReconcileQueued = false;
      });
  }

  function nextFloatingLauncherRevision(previous = 0) {
    return Math.max(Date.now(), (Number(previous) || 0) + 1);
  }

  function applyFloatingLauncherModelToDom() {
    if (!IS_WEB_LAUNCHER || !floatingLauncherModel.initialized) return;
    const panel = shadowRoot?.querySelector(".mcp-panel");
    const bottom = `${floatingLauncherModel.bottom}px`;
    panel?.style.setProperty("--launcher-bottom", bottom);
    setElementClass(panel, "is-launcher-collapsed", floatingLauncherModel.collapsed);
  }

  function setElementClass(element, className, enabled) {
    if (!element || element.classList.contains(className) === Boolean(enabled)) return;
    element.classList.toggle(className, Boolean(enabled));
  }

  function isLightweightSettingsChange(previousSettings = {}, nextSettings = {}) {
    const lightweightKeys = new Set(["floatingPanelOpen", "floatingPanelOpenedAt", "floatingPanelManualClosedAt", "floatingLauncherBottom", "floatingLauncherPositionUpdatedAt", "floatingLauncherCollapsed", "floatingLauncherModeUpdatedAt", "floatingLauncherOpenedOnce", "managerOpenedOnce", "recentToolIds", "theme", "accentColor", "settingsUpdatedAt"]);
    const keys = new Set([
      ...Object.keys(previousSettings || {}),
      ...Object.keys(nextSettings || {})
    ]);
    for (const key of keys) {
      if (previousSettings?.[key] === nextSettings?.[key]) continue;
      if (!lightweightKeys.has(key)) return false;
    }
    return true;
  }

  async function setFloatingLauncherCollapsed(collapsed) {
    if (IS_WEB_LAUNCHER) {
      syncFloatingLauncherModelFromSettings(state.settings || {});
      floatingLauncherModel.collapsed = Boolean(collapsed);
      floatingLauncherModel.modeUpdatedAt = nextFloatingLauncherRevision(floatingLauncherModel.modeUpdatedAt);
      state.settings = stabilizeFloatingLauncherSettings(Object.assign({}, state.settings || {}));
      applyFloatingLauncherModelToDom();
    }
    syncFloatingEntryPointUsage(state.settings);
    const modeRevision = IS_WEB_LAUNCHER
      ? floatingLauncherModel.modeUpdatedAt
      : nextFloatingLauncherRevision(state.settings?.floatingLauncherModeUpdatedAt);
    const patch = Object.assign({}, floatingEntryPointUsed, {
      floatingLauncherCollapsed: IS_WEB_LAUNCHER ? floatingLauncherModel.collapsed : Boolean(collapsed),
      floatingLauncherModeUpdatedAt: modeRevision
    });
    floatingLauncherModeWriteQueue = floatingLauncherModeWriteQueue
      .catch(() => {})
      .then(() => saveSettingsPatch(patch))
      .then((nextSettings) => {
        if (!IS_WEB_LAUNCHER || modeRevision === floatingLauncherModel.modeUpdatedAt) {
          applyFloatingLauncherState(nextSettings);
        }
        return nextSettings;
      })
      .catch(() => state.settings || {});
    return floatingLauncherModeWriteQueue;
  }

  async function setFloatingPanelOpen(open) {
    const isOpen = !!open;
    if (isOpen && isFloatingPanelManualCloseGuardActive()) {
      const guardedSettings = Object.assign({}, state.settings || {}, floatingEntryPointUsed, {
        floatingPanelOpen: false
      });
      state.settings = guardedSettings;
      applyFloatingLauncherState(guardedSettings);
      return guardedSettings;
    }
    syncFloatingEntryPointUsage(state.settings);
    const changeTime = Date.now();
    const optimisticSettings = Object.assign({}, state.settings || {}, floatingEntryPointUsed, {
      floatingPanelOpen: isOpen,
      floatingPanelOpenedAt: isOpen ? changeTime : Number(state.settings?.floatingPanelOpenedAt) || 0,
      floatingPanelManualClosedAt: isOpen ? 0 : changeTime
    });
    state.settings = optimisticSettings;
    applyFloatingLauncherState(optimisticSettings);
    const nextSettings = await saveSettingsPatch(Object.assign({}, floatingEntryPointUsed, {
      floatingPanelOpen: isOpen,
      floatingPanelOpenedAt: isOpen ? changeTime : Number(state.settings?.floatingPanelOpenedAt) || 0,
      floatingPanelManualClosedAt: isOpen ? 0 : changeTime
    })).catch(() => Object.assign({}, state.settings || {}, floatingEntryPointUsed, {
      floatingPanelOpen: isOpen,
      floatingPanelOpenedAt: isOpen ? changeTime : Number(state.settings?.floatingPanelOpenedAt) || 0,
      floatingPanelManualClosedAt: isOpen ? 0 : changeTime
    }));
    applyFloatingLauncherState(nextSettings);
  }

  function isFloatingPanelManualCloseGuardActive() {
    return floatingPanelManualCloseLocked;
  }

  function isFloatingPanelPersistentlyClosed(settings = state.settings || {}) {
    const closedAt = Number(settings?.floatingPanelManualClosedAt) || 0;
    const openedAt = Number(settings?.floatingPanelOpenedAt) || 0;
    return closedAt > 0 && closedAt >= openedAt;
  }

  function isExplicitFloatingPanelOpenAfterClose(previousSettings = {}, nextSettings = {}) {
    const previousClosedAt = Number(previousSettings?.floatingPanelManualClosedAt) || 0;
    const nextOpenedAt = Number(nextSettings?.floatingPanelOpenedAt) || 0;
    return nextSettings?.floatingPanelOpen === true && nextOpenedAt > previousClosedAt;
  }

  function shouldForceFloatingPanelClosedFromSettings(previousSettings = {}, nextSettings = {}) {
    if (nextSettings?.floatingPanelOpen !== true) return false;
    if (isFloatingPanelManualCloseGuardActive()) return true;
    if (isFloatingPanelPersistentlyClosed(nextSettings)) return true;
    return isFloatingPanelPersistentlyClosed(previousSettings)
      && !isExplicitFloatingPanelOpenAfterClose(previousSettings, nextSettings);
  }

  function clearFloatingPanelManualCloseGuard() {
    lastFloatingPanelManualCloseAt = 0;
    floatingPanelManualCloseLocked = false;
  }

  function markFloatingPanelManuallyClosed() {
    if (IS_NATIVE_SIDE_PANEL) {
      closeFloatingMenu();
      applyNativeSidePanelMode();
      return;
    }
    lastFloatingPanelManualCloseAt = Date.now();
    floatingPanelManualCloseLocked = true;
    lastFloatingPanelRevealAt = 0;
    clearTimeout(scheduleFloatingRefresh.timer);
    closeFloatingMenu();
    const panel = shadowRoot?.querySelector(".mcp-panel");
    panel?.classList.add("is-minimized");
    panel?.classList.remove("is-classifying");
    state.settings = Object.assign({}, state.settings || {}, {
      floatingPanelOpen: false,
      floatingPanelManualClosedAt: lastFloatingPanelManualCloseAt
    });
    applyFloatingLauncherState(state.settings);
  }

  async function markFloatingEntryPointUsed(key) {
    if (!key || !(key in floatingEntryPointUsed)) return;
    floatingEntryPointUsed[key] = true;
    if (state.settings?.[key]) {
      updateFirstUseButtonPrompts();
      return;
    }
    state.settings = Object.assign({}, state.settings || {}, floatingEntryPointUsed, { [key]: true });
    updateFirstUseButtonPrompts();
    const nextSettings = await saveSettingsPatch(Object.assign({}, floatingEntryPointUsed, {
      [key]: true
    })).catch(() => Object.assign({}, state.settings || {}, floatingEntryPointUsed, { [key]: true }));
    updateFirstUseButtonPrompts();
  }

  function commitFloatingLauncherPosition(bottom) {
    const nextBottom = clampFloatingLauncherBottom(bottom);
    const revision = ++floatingLauncherPositionRevision;
    syncFloatingLauncherModelFromSettings(state.settings || {});
    floatingLauncherModel.bottom = nextBottom;
    floatingLauncherModel.positionUpdatedAt = nextFloatingLauncherRevision(floatingLauncherModel.positionUpdatedAt);
    syncFloatingEntryPointUsage(state.settings);
    const patch = Object.assign({}, floatingEntryPointUsed, {
      floatingLauncherBottom: nextBottom,
      floatingLauncherPositionUpdatedAt: floatingLauncherModel.positionUpdatedAt
    });
    floatingLauncherPendingPosition = {
      floatingLauncherBottom: patch.floatingLauncherBottom,
      floatingLauncherPositionUpdatedAt: patch.floatingLauncherPositionUpdatedAt
    };
    state.settings = Object.assign({}, state.settings || {}, patch);
    floatingLauncherPositionWriteQueue = floatingLauncherPositionWriteQueue
      .catch(() => {})
      .then(() => saveSettingsPatch(patch))
      .then((savedSettings) => {
        if (revision !== floatingLauncherPositionRevision || floatingLauncherDragState) return;
        floatingLauncherPendingPosition = null;
        state.settings = Object.assign({}, state.settings || {}, savedSettings || {}, patch);
        applyFloatingLauncherState(state.settings);
      })
      .catch(() => {
        if (revision === floatingLauncherPositionRevision) floatingLauncherPendingPosition = null;
      });
  }

  function shouldSuppressFloatingLauncherClick(action) {
    return [
      "toggle",
      "expand-launcher",
      "collapse-launcher",
      "open-launcher-manager",
      "open-launcher-tools",
      "open-launcher-recent-tool",
      "capture-full-page"
    ].includes(action) && Date.now() < floatingLauncherSuppressClickUntil;
  }

  function markFloatingLauncherDragClickSuppressed() {
    floatingLauncherSuppressClickUntil = Date.now() + 360;
  }

  function applyThemeSettingsToHost(host, settings = {}) {
    if (!host) return;
    const settingsUpdatedAt = Number(settings.settingsUpdatedAt) || 0;
    if (settingsUpdatedAt > 0 && settingsUpdatedAt < lastAppliedVisualSettingsUpdatedAt) return;
    if (settingsUpdatedAt > 0) {
      lastAppliedVisualSettingsUpdatedAt = Math.max(lastAppliedVisualSettingsUpdatedAt, settingsUpdatedAt);
    }
    const accent = normalizeHexColor(settings.accentColor || "#e50914");
    const requestedTheme = settings.theme || "system";
    const resolvedTheme = resolveTheme(requestedTheme);
    host.dataset.theme = requestedTheme;
    host.dataset.resolvedTheme = resolvedTheme;
    host.style.setProperty("--accent", accent);
    host.style.setProperty("--accent-rgb", hexToRgbParts(accent));
    host.style.colorScheme = resolvedTheme;
  }

  function forceToolsLauncherGlass() {
    const button = shadowRoot?.querySelector("button.mcp-tools-launcher");
    if (!button) return;
    button.style.removeProperty("background");
    button.style.removeProperty("background-color");
    const declarations = {
      "border-color": "transparent",
      "background-color": "color-mix(in srgb, var(--panel-soft) 88%, transparent)",
      "-webkit-backdrop-filter": "none",
      "backdrop-filter": "none",
      "color": "#ffffff",
      "isolation": "isolate"
    };
    Object.entries(declarations).forEach(([property, value]) => {
      button.style.setProperty(property, value, "important");
    });
  }

  function updateLauncherRecentTool(settings = state.settings || {}) {
    globalThis.MCP.renderLauncherRecentTool?.(shadowRoot?.querySelector("[data-action='open-launcher-recent-tool']"), settings, tr);
  }

  async function openLauncherRecentTool(button) {
    const toolId = globalThis.MCP.normalizeRecentToolIds?.([button?.dataset.toolId], 1)?.[0];
    if (!toolId) return false;
    if (globalThis.MCP.canUseTool && !globalThis.MCP.canUseTool(toolId, state.settings)) {
      await openFloatingProUpgradeModal({ reason: "tool", toolId, toolName: tr(`tools.${toolId}.title`) });
      return false;
    }
    return safeRuntimeMessage({ type: MESSAGE_TYPES.OPEN_MANAGER, surface: "tools", toolId })
      .then((response) => Boolean(response?.ok && response.data?.opened !== false), () => false);
  }

  function scheduleFloatingRefresh(delay = 80) {
    if (IS_WEB_LAUNCHER && document.visibilityState !== "visible") {
      refreshStateDeferredUntilVisible = true;
      return;
    }
    clearTimeout(scheduleFloatingRefresh.timer);
    scheduleFloatingRefresh.timer = setTimeout(refreshFloatingPanel, Math.max(0, delay));
  }

  function shouldSuppressRealtimeCaptureRefresh(message = {}) {
    return IS_NATIVE_SIDE_PANEL
      && [MESSAGE_TYPES.STORAGE_REFRESH_REQUIRED, "SEARCH_INDEX_UPDATED"].includes(message?.type)
      && Date.now() - lastRealtimeCaptureAt < 1400;
  }

  function realtimeCaptureDescriptor(message = {}) {
    const type = String(message.type || "");
    if (!message.item?.id) return null;
    if (type === "ITEM_CREATED" || type === "ITEM_UPDATED") {
      return { mediaType: "text", collectionKey: "items", storageKey: "mcp_clipboard_items", created: type === "ITEM_CREATED" };
    }
    if (type === "DEV_CREATED" || type === "DEV_UPDATED") {
      return { mediaType: "dev", collectionKey: "devItems", storageKey: "mcp_dev_items", created: type === "DEV_CREATED" };
    }
    if (type === "IMAGE_CREATED" || type === "IMAGE_UPDATED" || type === MESSAGE_TYPES.IMAGE_CAPTURE_STARTED) {
      return {
        mediaType: "image",
        collectionKey: "imageItems",
        storageKey: "mcp_image_items",
        created: type === "IMAGE_CREATED" || type === MESSAGE_TYPES.IMAGE_CAPTURE_STARTED
      };
    }
    return null;
  }

  function removeOptimisticImageCapture(itemId) {
    if (!itemId) return;
    const item = (state.imageItems || []).find((candidate) => candidate.id === itemId);
    if (!item?.optimistic) return;
    state.imageItems = (state.imageItems || []).filter((candidate) => candidate.id !== itemId);
    shadowRoot?.querySelector(`.mcp-image-card[data-item-id="${CSS.escape(String(itemId))}"]`)?.remove();
    updateFloatingItemCount();
  }

  function realtimeDeletionDescriptor(message = {}) {
    if (!message.itemId) return null;
    if (message.type === MESSAGE_TYPES.ITEM_DELETED) return { mediaType: "text", collectionKey: "items" };
    if (message.type === MESSAGE_TYPES.DEV_DELETED) return { mediaType: "dev", collectionKey: "devItems" };
    if (message.type === MESSAGE_TYPES.IMAGE_DELETED) return { mediaType: "image", collectionKey: "imageItems" };
    return null;
  }

  function applyRealtimeDeletionMessage(message = {}) {
    const descriptor = realtimeDeletionDescriptor(message);
    if (!descriptor) return false;
    removeFloatingCaptureImmediately(message.itemId, descriptor.mediaType);
    return true;
  }

  function removeFloatingCaptureImmediately(itemId, mediaType = "text") {
    const collectionKey = mediaType === "image" ? "imageItems" : mediaType === "dev" ? "devItems" : "items";
    const collection = Array.isArray(state[collectionKey]) ? state[collectionKey] : [];
    const previousIndex = collection.findIndex((item) => item.id === itemId);
    const previousItem = previousIndex >= 0 ? collection[previousIndex] : null;
    state[collectionKey] = collection.filter((item) => item.id !== itemId);
    const selector = mediaType === "image" ? ".mcp-image-card" : ".mcp-item";
    const card = shadowRoot?.querySelector(`${selector}[data-item-id="${CSS.escape(String(itemId))}"]`);
    card?.remove();
    updateFloatingItemCount();
    if (activeFloatingTab === mediaType) {
      const list = shadowRoot?.querySelector("[data-role='list']");
      const remainingCards = list?.querySelectorAll(selector).length || 0;
      if (!remainingCards) renderPanel();
    }
    return () => {
      if (!previousItem || (state[collectionKey] || []).some((item) => item.id === itemId)) return;
      const restored = (state[collectionKey] || []).slice();
      restored.splice(Math.min(previousIndex, restored.length), 0, previousItem);
      state[collectionKey] = restored;
      if (activeFloatingTab === mediaType) renderPanel();
      else updateFloatingItemCount();
    };
  }

  function applyRealtimeCaptureMessage(message = {}) {
    if (message.type === MESSAGE_TYPES.IMAGE_CAPTURE_STARTED && message.item) {
      const generalCategory = (state.imageCategories || []).find((category) => category.id === "image-general");
      message = Object.assign({}, message, {
        item: Object.assign({}, message.item, {
          categoryName: generalCategory?.name || message.item.categoryName
        })
      });
    }
    const descriptor = realtimeCaptureDescriptor(message);
    if (!descriptor || !shadowRoot) return false;
    const shouldFocusCaptureTab = IS_NATIVE_SIDE_PANEL
      && message.assetHydration !== true
      && (message.captureArrival === true || descriptor.created);
    const previousActiveTab = activeFloatingTab;
    const search = shadowRoot.querySelector("[data-role='search']");
    const clearedSearch = shouldFocusCaptureTab && Boolean(search?.value);
    if (shouldFocusCaptureTab) {
      if (previousActiveTab !== descriptor.mediaType) rememberFloatingPanelScroll(previousActiveTab);
      activeFloatingTab = descriptor.mediaType;
      floatingPanelScrollTops[descriptor.mediaType] = 0;
      if (search) search.value = "";
    }
    const previous = Array.isArray(state[descriptor.collectionKey]) ? state[descriptor.collectionKey] : [];
    const existingIndex = previous.findIndex((item) => item.id === message.item.id);
    const withoutCurrent = previous.filter((item) => item.id !== message.item.id);
    const pinnedCount = message.item.isPinned ? 0 : withoutCurrent.findIndex((item) => !item.isPinned);
    const insertAt = pinnedCount < 0 ? withoutCurrent.length : pinnedCount;
    const next = withoutCurrent.slice();
    next.splice(insertAt, 0, message.item);
    state[descriptor.collectionKey] = next;
    lastRealtimeCaptureAt = Date.now();
    // Image persistence can rewrite a sizeable local collection and then
    // hydrate the binary asset. Keep the native panel on its incremental DOM
    // path throughout that work so neither storage write causes a full-list
    // repaint or a visible blink.
    suppressFloatingOptimisticRefresh(descriptor.storageKey, descriptor.mediaType === "image" ? 15000 : 1400);
    updateFloatingItemCount();
    if (message.assetHydration === true && descriptor.mediaType === "image") {
      const card = shadowRoot.querySelector(`.mcp-image-card[data-item-id="${CSS.escape(String(message.item.id))}"]`);
      const image = card?.querySelector(".mcp-image-copy-area img");
      if (image) image.src = message.item.thumbnailUrl || message.item.imageUrl;
      return true;
    }
    const switchedTab = shouldFocusCaptureTab && previousActiveTab !== descriptor.mediaType;
    const animateEntry = descriptor.created && existingIndex < 0;
    if (switchedTab || clearedSearch) {
      renderPanel();
      revealFocusedRealtimeCapture(message.item.id, descriptor.mediaType, animateEntry);
      return true;
    }
    if (activeFloatingTab !== descriptor.mediaType) return true;
    insertRealtimeCaptureCard(message.item, descriptor.mediaType, animateEntry);
    return true;
  }

  function revealFocusedRealtimeCapture(itemId, mediaType, animateEntry) {
    requestAnimationFrame(() => {
      const list = shadowRoot?.querySelector("[data-role='list']");
      if (list) list.scrollTop = 0;
      if (!animateEntry || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const selector = mediaType === "image" ? ".mcp-image-card" : ".mcp-item";
      const card = shadowRoot?.querySelector(`${selector}[data-item-id="${CSS.escape(String(itemId))}"]`);
      if (!card) return;
      card.classList.add("mcp-realtime-insert");
      card.addEventListener("animationend", () => card.classList.remove("mcp-realtime-insert"), { once: true });
    });
  }

  function insertRealtimeCaptureCard(item, mediaType, animateEntry) {
    const list = shadowRoot?.querySelector("[data-role='list']");
    if (!list) return;
    const query = shadowRoot.querySelector("[data-role='search']")?.value || "";
    const visible = mediaType === "image"
      ? filterImages([item], query).length > 0
      : filterItems([item], query).length > 0;
    list.querySelector(`[data-item-id="${CSS.escape(String(item.id))}"]`)?.remove();
    if (!visible) return;
    list.querySelector(".mcp-empty")?.remove();
    let card = null;
    if (mediaType === "image") {
      let grid = list.querySelector(".mcp-image-grid");
      if (!grid) {
        grid = document.createElement("div");
        grid.className = "mcp-image-grid";
        list.prepend(grid);
      }
      card = renderImageCard(item);
      grid.prepend(card);
      [...grid.querySelectorAll(".mcp-image-card")].slice(FLOATING_PANEL_ITEM_LIMIT).forEach((node) => node.remove());
    } else {
      const staging = document.createElement("div");
      renderTextLikePanelItems(staging, [item], mediaType);
      card = staging.querySelector(".mcp-item");
      if (!card) return;
      const firstCard = list.querySelector(".mcp-item");
      const footer = list.querySelector(".mcp-list-manager-footer");
      if (firstCard) firstCard.before(card);
      else if (footer) footer.before(card);
      else list.prepend(card);
      [...list.querySelectorAll(".mcp-item")].slice(FLOATING_PANEL_ITEM_LIMIT).forEach((node) => node.remove());
    }
    const visibleCount = mediaType === "image"
      ? filterImages(state.imageItems || [], query).length
      : filterItems(mediaType === "dev" ? visibleDevItems() : state.items || [], query).length;
    if (visibleCount > FLOATING_PANEL_ITEM_LIMIT && !list.querySelector(".mcp-list-manager-footer")) {
      appendFloatingManagerListButton(list, mediaType);
    }
    if (!card || !animateEntry || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    card.classList.add("mcp-realtime-insert");
    card.addEventListener("animationend", () => card.classList.remove("mcp-realtime-insert"), { once: true });
    if ((Number(list.scrollTop) || 0) < 36) list.scrollTop = 0;
  }

  function suppressFloatingOptimisticRefresh(keys = [], duration = 900) {
    const list = Array.isArray(keys) ? keys : [keys];
    list.filter(Boolean).forEach((key) => floatingOptimisticStorageKeys.add(key));
    floatingOptimisticRefreshSuppressUntil = Math.max(floatingOptimisticRefreshSuppressUntil, Date.now() + duration);
    clearTimeout(scheduleFloatingRefresh.timer);
  }

  function shouldSuppressFloatingOptimisticRefresh(changedKeys = [], settingsKey = "mcp_settings") {
    if (Date.now() > floatingOptimisticRefreshSuppressUntil) {
      floatingOptimisticStorageKeys.clear();
      return false;
    }
    const fullRefreshKeys = changedKeys.filter((key) => key !== settingsKey);
    return fullRefreshKeys.length > 0 && fullRefreshKeys.every((key) => floatingOptimisticStorageKeys.has(key));
  }

  function applyFloatingStateResponse(response) {
    const data = response?.data || response;
    if (!data || typeof data !== "object") return false;
    if (!Array.isArray(data.items) && !Array.isArray(data.imageItems) && !Array.isArray(data.devItems)) return false;
    state = Object.assign({}, state, data);
    applyThemeSettings(state.settings || {});
    applyPanelVisibility();
    applyFloatingLauncherState(state.settings || {});
    translateFloatingUi();
    renderPanel();
    return true;
  }

  function applyFloatingMutationResponse(response, mediaType, itemId, updates = {}) {
    const responseItem = response?.data?.item || response?.item || null;
    const collectionKey = mediaType === "image" ? "imageItems" : mediaType === "dev" ? "devItems" : "items";
    const currentItem = (state[collectionKey] || []).find((candidate) => candidate.id === itemId);
    const item = responseItem || (currentItem ? Object.assign({}, currentItem, updates) : null);
    if (!item?.id) return false;
    const type = mediaType === "image"
      ? MESSAGE_TYPES.IMAGE_UPDATED
      : mediaType === "dev"
        ? MESSAGE_TYPES.DEV_UPDATED
        : MESSAGE_TYPES.ITEM_UPDATED;
    if (applyRealtimeCaptureMessage({ type, item, itemId: item.id, updates })) return true;
    const previous = Array.isArray(state[collectionKey]) ? state[collectionKey] : [];
    state[collectionKey] = previous.some((candidate) => candidate.id === item.id)
      ? previous.map((candidate) => candidate.id === item.id ? item : candidate)
      : [item, ...previous];
    return true;
  }

  function markFloatingReadyPasteUsageUpdate() {
    suppressFloatingReadyPasteRefreshUntil = Date.now() + 1800;
    clearTimeout(scheduleFloatingRefresh.timer);
  }

  function isReadyPasteUsageUpdate(updates = {}) {
    const keys = Object.keys(updates || {});
    return keys.length > 0 && keys.every((key) => key === "usageCount" || key === "lastUsedAt");
  }

  function shouldSuppressFloatingReadyPasteRefresh(message) {
    if (Date.now() > suppressFloatingReadyPasteRefreshUntil) return false;
    if (message?.type === MESSAGE_TYPES.STORAGE_REFRESH_REQUIRED || message?.type === "SEARCH_INDEX_UPDATED") return true;
    if (message?.type === "ITEM_UPDATED" || message?.type === "DEV_UPDATED" || message?.type === "IMAGE_UPDATED") {
      return isReadyPasteUsageUpdate(message.updates || {});
    }
    return false;
  }

  function shouldSuppressFloatingReadyPasteStorageRefresh(changedKeys = [], settingsKey = "mcp_settings") {
    if (Date.now() > suppressFloatingReadyPasteRefreshUntil) return false;
    const readyPasteStorageKeys = new Set(["mcp_clipboard_items", "mcp_image_items", "mcp_dev_items"]);
    const fullRefreshKeys = changedKeys.filter((key) => key !== settingsKey);
    return fullRefreshKeys.length > 0 && fullRefreshKeys.every((key) => readyPasteStorageKeys.has(key));
  }

  function isSourceFaviconOnlyStorageChange(changes = {}, changedKeys = [], settingsKey = "mcp_settings") {
    const itemKeys = new Set(["mcp_clipboard_items", "mcp_image_items", "mcp_dev_items"]);
    const fullRefreshKeys = changedKeys.filter((key) => key !== settingsKey);
    const relevantKeys = fullRefreshKeys.filter((key) => itemKeys.has(key));
    if (!relevantKeys.length || relevantKeys.length !== fullRefreshKeys.length) return false;
    return relevantKeys.every((key) => isSourceFaviconOnlyCollectionChange(changes[key]?.oldValue, changes[key]?.newValue));
  }

  function isSourceFaviconOnlyCollectionChange(oldValue = [], newValue = []) {
    if (!Array.isArray(oldValue) || !Array.isArray(newValue) || oldValue.length !== newValue.length) return false;
    return oldValue.every((oldItem, index) => {
      const newItem = newValue[index];
      if (!oldItem || !newItem || oldItem.id !== newItem.id) return false;
      const oldClean = Object.assign({}, oldItem);
      const newClean = Object.assign({}, newItem);
      delete oldClean.sourceFaviconUrl;
      delete newClean.sourceFaviconUrl;
      return JSON.stringify(oldClean) === JSON.stringify(newClean) && oldItem.sourceFaviconUrl !== newItem.sourceFaviconUrl;
    });
  }

  function scheduleFloatingSearchRender() {
    cancelAnimationFrame(floatingSearchRenderRaf);
    floatingSearchRenderRaf = requestAnimationFrame(() => {
      floatingSearchRenderRaf = 0;
      renderPanel();
    });
  }

  function scheduleChooserSearchRender() {
    cancelAnimationFrame(chooserSearchRenderRaf);
    chooserSearchRenderRaf = requestAnimationFrame(() => {
      chooserSearchRenderRaf = 0;
      renderCategoryChooser();
    });
  }

  async function refreshFloatingPanel() {
    const wasMinimized = shadowRoot?.querySelector(".mcp-panel")?.classList.contains("is-minimized");
    const searchValue = shadowRoot?.querySelector("[data-role='search']")?.value || "";
    await refreshState();
    const panel = shadowRoot?.querySelector(".mcp-panel");
    const search = shadowRoot?.querySelector("[data-role='search']");
    if (panel && wasMinimized !== undefined) {
      const keepRecentRevealOpen = Date.now() - lastFloatingPanelRevealAt < 5000
        && lastFloatingPanelManualCloseAt < lastFloatingPanelRevealAt;
      const restoreMinimized = wasMinimized && !keepRecentRevealOpen;
      setElementClass(panel, "is-minimized", restoreMinimized);
      applyFloatingLauncherState(state.settings);
    }
    if (search && search.value !== searchValue) {
      search.value = searchValue;
      renderPanel();
    }
    if (pendingChooserItem) {
      const source = pendingChooserType === "image" ? state.imageItems : pendingChooserType === "dev" ? state.devItems || [] : state.items;
      pendingChooserItem = source.find((item) => item.id === pendingChooserItem.id) || pendingChooserItem;
      renderCategoryChooser();
    }
    if (editingItem && !shadowRoot.querySelector("[data-role='editor']")?.hidden) {
      const source = editingItem.mediaType === "dev" ? state.devItems || [] : state.items;
      editingItem = source.find((item) => item.id === editingItem.id) || editingItem;
      renderEditorCategories(editorCategorySelection || editingItem.categoryId);
    }
    if (IS_NATIVE_SIDE_PANEL) applyNativeSidePanelMode();
    if (isSearchOpen()) renderSearchOverlay();
  }

  function injectFloatingPanel(options = {}) {
    const editorVersion = "unified-text-editor-v5";
    const existingHost = document.getElementById("ucp-demo-floating-host");
    if (existingHost) {
      const existingEditor = existingHost.shadowRoot?.querySelector("[data-role='editor']");
      if (existingEditor?.dataset.editorVersion === editorVersion) {
        shadowRoot = existingHost.shadowRoot;
        return;
      }
      existingHost.remove();
    }
    const host = document.createElement("div");
    host.id = "ucp-demo-floating-host";
    host.classList.toggle("is-web-launcher", IS_WEB_LAUNCHER);
    if (IS_WEB_LAUNCHER) {
      host.dataset.pageZoom = String(currentPageZoomFactor);
      host.style.setProperty("--mcp-page-zoom", String(currentPageZoomFactor));
      host.style.setProperty("--mcp-page-zoom-inverse", String(1 / currentPageZoomFactor));
      host.style.setProperty("--mcp-compensated-vw", `calc(100vw * ${currentPageZoomFactor})`);
      host.style.setProperty("--mcp-compensated-vh", `calc(100vh * ${currentPageZoomFactor})`);
    }
    document.documentElement.appendChild(host);
    shadowRoot = host.attachShadow({ mode: "open" });
    metaOverflowController?.disconnect();
    metaOverflowController = globalThis.MCP.createMetaOverflowMarqueeController(shadowRoot);
    globalThis.MCP.installDialogKeyboardSupport?.(shadowRoot, {
      getLanguage: () => state.settings?.language
    });
    floatingPanelCssReady = false;
    floatingPanelQueuedSettings = null;
    let bootSettings = Object.assign({}, state.settings || {}, options.initialSettings || {});
    syncFloatingLauncherModelFromSettings(bootSettings, { initialize: !floatingLauncherModel.initialized });
    bootSettings = stabilizeFloatingLauncherSettings(bootSettings);
    applyThemeSettingsToHost(host, bootSettings);
    let cssReady = false;
    let visualReady = false;
    let initialSettingsSnapshot = bootSettings;
    const revealHydratedLauncher = (panel) => {
      panel.style.visibility = "";
      removeLauncherShell();
    };
    const revealHostWhenReady = () => {
      if (!cssReady || !visualReady) return;
      const readySettings = floatingPanelQueuedSettings || initialSettingsSnapshot || state.settings || {};
      floatingPanelCssReady = true;
      const panel = shadowRoot?.querySelector(".mcp-panel");
      if (!panel) {
        window.setTimeout(revealHostWhenReady, 0);
        return;
      }
      if (panel?.classList.contains("is-launcher-hydrating")) {
        const finishLauncherHydration = () => {
          if (!panel.classList.contains("is-launcher-hydrating")) return;
          applyFloatingLauncherState(readySettings);
          panel.classList.remove("is-launcher-hydrating");
          revealHydratedLauncher(panel);
          floatingPanelQueuedSettings = null;
        };
        requestAnimationFrame(() => {
          requestAnimationFrame(finishLauncherHydration);
        });
        window.setTimeout(finishLauncherHydration, 120);
      } else {
        applyFloatingLauncherState(readySettings);
        revealHydratedLauncher(panel);
        floatingPanelQueuedSettings = null;
      }
    };
    const applyInitialLauncherShellState = (settings = {}) => {
      const panel = shadowRoot?.querySelector(".mcp-panel");
      if (!panel) return;
      syncFloatingLauncherModelFromSettings(settings);
      panel.style.setProperty("--launcher-bottom", `${IS_WEB_LAUNCHER ? floatingLauncherModel.bottom : clampFloatingLauncherBottom(settings.floatingLauncherBottom)}px`);
      setElementClass(panel, "is-minimized", true);
      setElementClass(panel, "is-launcher-collapsed", IS_WEB_LAUNCHER ? floatingLauncherModel.collapsed : settings.floatingLauncherCollapsed === true);
    };
    const criticalStyle = document.createElement("style");
    criticalStyle.textContent = `
      :host{all:initial;position:fixed;inset:auto 20px var(--launcher-bottom,94px) auto;z-index:2147483646;--mcp-page-zoom:1;--mcp-page-zoom-inverse:1;--mcp-compensated-vw:100vw;--mcp-compensated-vh:100vh;--utility-action-bg:#38475a;--utility-action-hover:#465a72;color-scheme:dark;font-family:"Segoe UI Variable Text","Segoe UI",Roboto,Helvetica,Arial,sans-serif}
      :host([data-resolved-theme="light"]){--utility-action-bg:#43546a;--utility-action-hover:#35465b}
      :host(.is-web-launcher) .mcp-launcher-zoom-layer{position:fixed;inset:auto 0 0 auto;width:0;height:0;z-index:2147483647;overflow:visible;pointer-events:none;transform:scale(var(--mcp-page-zoom-inverse,1));transform-origin:100% 100%}
      :host(.is-web-launcher) .mcp-launcher-zoom-layer>.mcp-panel{pointer-events:auto}
      .mcp-panel{position:fixed;right:20px;bottom:var(--launcher-bottom,94px);width:min(390px,calc(100vw - 32px));max-height:min(720px,calc(100vh - 32px));border-radius:24px;background:#202631;color:#f2f5f8;box-sizing:border-box;overflow:hidden}
      .mcp-panel.is-minimized{width:64px;height:auto;min-height:0;overflow:visible;background:transparent;border-color:transparent;box-shadow:none}
      .mcp-panel.is-minimized.is-launcher-collapsed{right:4px;width:22px;height:82px;transform:none;opacity:1}
      .mcp-panel.is-launcher-hydrating,.mcp-panel.is-launcher-hydrating *{transition:none!important;animation:none!important}
      .mcp-header{display:flex;align-items:center;gap:8px;padding:10px}
      .mcp-panel.is-minimized .mcp-header{position:relative;flex-direction:column;padding:8px;border-radius:17px;background:rgba(42,50,64,.78);-webkit-backdrop-filter:blur(14px) saturate(125%);backdrop-filter:blur(14px) saturate(125%)}
      :host([data-resolved-theme="light"]) .mcp-panel.is-minimized .mcp-header{background:rgba(248,250,252,.78)}
      .mcp-panel.is-minimized.is-launcher-collapsed .mcp-header{width:22px;height:82px;padding:0;gap:0;border-radius:12px 0 0 12px;background:transparent;-webkit-backdrop-filter:none;backdrop-filter:none}
      .mcp-panel.is-minimized .mcp-title,.mcp-panel.is-minimized .mcp-body,.mcp-panel.is-minimized .mcp-chooser,.mcp-panel.is-minimized [data-action="open-search"],.mcp-panel.is-minimized [data-action="open-floating-menu"],.mcp-panel.is-minimized [data-action="open-tools"],.mcp-panel.is-minimized [data-action="open-sidepanel"],.mcp-panel.is-minimized [data-action="close-panel"]{display:none}
      .mcp-brand,.mcp-launcher-manager,.mcp-launcher-tools,.mcp-launcher-recent-tool,.mcp-fullpage-shot,.mcp-launcher-tab,.mcp-launcher-collapse,.mcp-icon{appearance:none;border:0;display:grid;place-items:center;cursor:pointer}
      .mcp-brand,.mcp-launcher-manager,.mcp-launcher-tools,.mcp-launcher-recent-tool,.mcp-fullpage-shot,.mcp-launcher-tab,.mcp-launcher-collapse{width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,.12);color:#fff}
      .mcp-panel.is-minimized .mcp-launcher-manager,.mcp-panel.is-minimized .mcp-launcher-tools,.mcp-panel.is-minimized .mcp-launcher-recent-tool,.mcp-panel.is-minimized .mcp-fullpage-shot{width:46px;min-width:46px;height:34px;min-height:34px;border-radius:10px;background:var(--utility-action-bg);color:#fff}
      .mcp-panel.is-minimized .mcp-launcher-collapse{width:46px;min-width:46px;height:18px;min-height:18px;border-radius:999px;background:rgba(255,255,255,.86);color:#151515;font-size:0;line-height:0}
      .mcp-panel.is-minimized .mcp-launcher-collapse .launcher-collapse-arrow-icon{display:block;width:14px;height:7px;object-fit:contain;pointer-events:none}
      .manager-arrow-glyph{display:block;width:22px;height:22px;pointer-events:none}
      .mcp-panel.is-minimized .mcp-brand>img{width:31px;height:31px;max-width:31px;max-height:31px}
      .mcp-launcher-manager img,.mcp-launcher-tools>img,.mcp-launcher-recent-tool>img,.mcp-fullpage-shot>img{max-width:31px;max-height:31px}
      .mcp-launcher-recent-tool[hidden]{display:none!important}
      .mcp-panel:not(.is-minimized) .mcp-launcher-collapse,.mcp-panel:not(.is-minimized) .mcp-launcher-manager,.mcp-panel:not(.is-minimized) .mcp-launcher-tools,.mcp-panel:not(.is-minimized) .mcp-launcher-recent-tool,.mcp-panel:not(.is-minimized) .mcp-fullpage-shot,.mcp-panel:not(.is-minimized) .mcp-launcher-tab{display:none}
      .mcp-panel.is-minimized.is-launcher-collapsed .mcp-header > :not(.mcp-launcher-tab){display:none}
      .mcp-panel.is-minimized .mcp-launcher-tab{position:absolute;left:-28px;top:50%;width:22px;height:82px;padding:0;border:0;border-radius:12px 0 0 12px;background:var(--accent);box-shadow:none;transform:translateY(-50%)}
      .mcp-panel.is-minimized.is-launcher-collapsed .mcp-launcher-tab{display:grid;left:0;top:0;transform:none}
      .mcp-body{padding:0 12px 12px}
      .mcp-list{min-height:220px}
    `;
    shadowRoot.appendChild(criticalStyle);
    const launcherSurface = IS_WEB_LAUNCHER ? document.createElement("div") : shadowRoot;
    if (IS_WEB_LAUNCHER) {
      launcherSurface.className = "mcp-launcher-zoom-layer";
      launcherSurface.dataset.role = "launcher-zoom-layer";
      shadowRoot.appendChild(launcherSurface);
    }
    const settingsKey = (globalThis.MCP?.STORAGE_KEYS?.SETTINGS) || "mcp_settings";
    if (IS_WELCOME_FLOATING_PREVIEW) {
      initialSettingsSnapshot = bootSettings;
      applyThemeSettingsToHost(host, initialSettingsSnapshot);
      visualReady = true;
      revealHostWhenReady();
    } else chrome.storage?.local?.get?.(settingsKey, (stored) => {
      const initialSettings = stored?.[settingsKey] || {};
      initialSettingsSnapshot = Object.assign({}, globalThis.MCP?.DEFAULT_SETTINGS || {}, initialSettings);
      syncFloatingLauncherModelFromSettings(initialSettingsSnapshot);
      initialSettingsSnapshot = stabilizeFloatingLauncherSettings(initialSettingsSnapshot);
      if (IS_WEB_LAUNCHER) initialSettingsSnapshot.floatingPanelOpen = false;
      applyThemeSettingsToHost(host, initialSettingsSnapshot);
      if (cssReady) applyFloatingLauncherState(initialSettingsSnapshot);
      else applyInitialLauncherShellState(initialSettingsSnapshot);
      visualReady = true;
      revealHostWhenReady();
    });
    window.setTimeout(() => {
      if (!visualReady) {
        initialSettingsSnapshot = state.settings || {};
        syncFloatingLauncherModelFromSettings(initialSettingsSnapshot);
        initialSettingsSnapshot = stabilizeFloatingLauncherSettings(initialSettingsSnapshot);
        if (IS_WEB_LAUNCHER) initialSettingsSnapshot = Object.assign({}, initialSettingsSnapshot, { floatingPanelOpen: false });
        applyThemeSettingsToHost(host, initialSettingsSnapshot);
        applyInitialLauncherShellState(initialSettingsSnapshot);
        visualReady = true;
        revealHostWhenReady();
      }
    }, 1500);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("content/floatingPanel.css");
    link.addEventListener("load", () => {
      cssReady = true;
      revealHostWhenReady();
    }, { once: true });
    link.addEventListener("error", () => {
      window.setTimeout(() => {
        cssReady = true;
        revealHostWhenReady();
      }, 2200);
    }, { once: true });
    shadowRoot.appendChild(link);

    if (IS_NATIVE_SIDE_PANEL) {
      const driveQuickStyle = document.createElement("link");
      driveQuickStyle.rel = "stylesheet";
      driveQuickStyle.href = chrome.runtime.getURL("shared/driveQuickSyncControl.css");
      shadowRoot.appendChild(driveQuickStyle);
    }

    const container = document.createElement("section");
    container.className = [
      "mcp-panel",
      "is-minimized",
      (IS_WEB_LAUNCHER ? floatingLauncherModel.collapsed : initialSettingsSnapshot.floatingLauncherCollapsed === true) ? "is-launcher-collapsed" : "",
      "is-launcher-hydrating"
    ].filter(Boolean).join(" ");
    container.setAttribute("aria-label", "Ultimate Clipboard Pro");
    container.style.visibility = "hidden";
    container.innerHTML = [
      "<header class=\"mcp-header\">",
      `<button class="mcp-launcher-collapse" data-action="collapse-launcher" aria-label="Hide launcher"><img class="launcher-collapse-arrow-icon" src="${chrome.runtime.getURL("assets/icons/arrow_right.png")}" alt=""></button>`,
      `<button class="mcp-brand" data-action="toggle" aria-label="Ultimate Clipboard Pro"><img src="${chrome.runtime.getURL("assets/icons/icon128.png")}" alt="Ultimate Clipboard Pro"><span class="brand-pro-badge" data-role="brand-pro-badge" hidden aria-hidden="true"><img src="${chrome.runtime.getURL("assets/icons/pro-icon.png")}" alt=""></span></button>`,
      IS_WEB_LAUNCHER
        ? `<button class="mcp-launcher-manager" data-action="open-launcher-manager" aria-label="Manager"><svg class="manager-arrow-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M10 7H17V14" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>`
        : "",
      `<button class="mcp-launcher-tools" data-action="open-launcher-tools" aria-label="Tools"><img src="${chrome.runtime.getURL("assets/icons/tootls.png")}" alt="" aria-hidden="true"></button>`,
      `<button class="mcp-launcher-recent-tool" data-action="open-launcher-recent-tool" hidden><img data-role="launcher-recent-tool-icon" alt=""><span class="mcp-launcher-recent-tool-pro" data-role="launcher-recent-tool-pro" hidden aria-hidden="true"><img src="${chrome.runtime.getURL("assets/icons/pro-icon.png")}" alt=""></span></button>`,
      `<button class="mcp-fullpage-shot" data-action="capture-full-page" aria-label="Full page screenshot"><img src="${chrome.runtime.getURL("assets/icons/screen_full_page_png.png")}" alt=""><span class="mcp-fullpage-pro-badge" aria-hidden="true"><img src="${chrome.runtime.getURL("assets/icons/pro-icon.png")}" alt=""></span></button>`,
      "<button class=\"mcp-launcher-tab\" data-action=\"expand-launcher\" aria-label=\"Show launcher\">&lsaquo;</button>",
      "<div class=\"mcp-title\"><strong data-role=\"app-name\" role=\"heading\" aria-level=\"1\">Ultimate Clipboard Pro</strong><span data-role=\"status\"></span></div>",
      `<button class="mcp-icon mcp-header-tools-button" data-action="open-tools" aria-label="Tools"><img src="${chrome.runtime.getURL("assets/icons/tootls.png")}" alt="" aria-hidden="true"></button>`,
      "<button class=\"mcp-icon mcp-floating-menu-button\" data-action=\"open-floating-menu\" data-role=\"floating-menu-button\" aria-label=\"Menu\" aria-haspopup=\"menu\" aria-expanded=\"false\"><svg class=\"menu-glyph\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M5 7h14M5 12h14M5 17h14\"></path></svg></button>",
      IS_NATIVE_SIDE_PANEL
        ? `<button id="openSidePanel" class="manager-button" data-action="open-sidepanel" aria-label="Manager"><img class="manager-arrow-glyph" src="${chrome.runtime.getURL("assets/icons/open-manager-arrow.svg")}" alt="" aria-hidden="true"></button>`
        : "",
      "<button class=\"mcp-icon\" data-action=\"close-panel\" aria-label=\"Close\"></button>",
      "</header>",
      "<div class=\"mcp-floating-menu\" data-role=\"floating-menu\" role=\"menu\" hidden></div>",
      "<div class=\"mcp-body\">",
      "<div class=\"mcp-tabs\" role=\"tablist\">",
      `<button type="button" role="tab" aria-selected="true" data-action="set-floating-tab" data-tab="text" data-role="floating-text-tab" class="is-active" aria-label="Texts" title="Texts"><img class="mcp-tab-icon" src="${chrome.runtime.getURL("assets/icons/text_icon.png")}" alt="" aria-hidden="true"><span class="sr-only mcp-tab-label" data-role="floating-text-label">Texts</span></button>`,
      `<button type="button" role="tab" aria-selected="false" data-action="set-floating-tab" data-tab="dev" data-role="floating-dev-tab" aria-label="Codes" title="Codes"><img class="mcp-tab-icon" src="${chrome.runtime.getURL("assets/icons/dev.png")}" alt="" aria-hidden="true"><span class="sr-only mcp-tab-label" data-role="floating-dev-label">Codes</span></button>`,
      `<button type="button" role="tab" aria-selected="false" data-action="set-floating-tab" data-tab="image" data-role="floating-image-tab" aria-label="Images" title="Images"><img class="mcp-tab-icon" src="${chrome.runtime.getURL("assets/icons/images_icon.png")}" alt="" aria-hidden="true"><span class="sr-only mcp-tab-label" data-role="floating-image-label">Images</span></button>`,
      "</div>",
      "<input class=\"mcp-search\" data-role=\"search\" placeholder=\"Search\" aria-label=\"Search\">",
      "<div class=\"mcp-list\" data-role=\"list\"></div>",
      IS_NATIVE_SIDE_PANEL ? '<div class="mcp-drive-quick-sync-host" data-role="drive-quick-sync-host"></div>' : "",
      "</div>",
      "<div class=\"mcp-chooser\" data-role=\"chooser\" hidden>",
      "<div class=\"mcp-chooser-card\">",
      "<div class=\"mcp-chooser-head\"><strong data-role=\"chooser-title\">Classify</strong><button type=\"button\" data-action=\"close-chooser\" aria-label=\"Close\">&times;</button></div>",
      "<input class=\"mcp-category-search\" data-role=\"category-search\" placeholder=\"Search category\" aria-label=\"Search category\">",
      "<div class=\"mcp-create-sub\" data-role=\"create-sub\" hidden>",
      "<input data-role=\"subcategory-name\" maxlength=\"20\" placeholder=\"Subcategory name\" aria-label=\"Subcategory name\">",
      "<button type=\"button\" data-action=\"confirm-subcategory\" data-role=\"confirm-subcategory-label\" aria-label=\"Create and classify\">OK</button>",
      "</div>",
      "<div class=\"mcp-category-list\" data-role=\"category-list\"></div>",
      "</div>",
      "</div>",
    ].join("");
    launcherSurface.appendChild(container);
    if (IS_NATIVE_SIDE_PANEL && globalThis.MCP?.createDriveQuickSyncControl) {
      floatingDriveQuickSyncController?.destroy();
      floatingDriveQuickSyncController = globalThis.MCP.createDriveQuickSyncControl({
        mount: shadowRoot.querySelector("[data-role='drive-quick-sync-host']"),
        getSettings: () => state.settings || {},
        openPremium: () => openFloatingProUpgradeModal("driveSync"),
        showToast
      });
      floatingDriveQuickSyncController.refresh();
    }
    applyInitialLauncherShellState(initialSettingsSnapshot);
    forceToolsLauncherGlass();
    const toast = document.createElement("div");
    toast.className = "mcp-toast";
    toast.dataset.role = "toast";
    toast.hidden = true;
    shadowRoot.appendChild(toast);
    shadowRoot.appendChild(buildEditorModal());
    shadowRoot.appendChild(buildDevSuggestionModal());
    shadowRoot.appendChild(buildFloatingTextModal());
    shadowRoot.appendChild(buildOnboardingModal());

    shadowRoot.addEventListener("click", handleOnboardingPrimaryClick, true);
    shadowRoot.addEventListener("click", handlePanelClick);
    shadowRoot.addEventListener("change", handlePanelChange);
    shadowRoot.addEventListener("pointerdown", handleFloatingLauncherPointerDown, true);
    window.addEventListener("blur", handleFloatingLauncherWindowBlur);
    shadowRoot.addEventListener("pointerover", handlePreviewPointerOver);
    shadowRoot.addEventListener("pointerout", handlePreviewPointerOut);
    shadowRoot.querySelector("[data-role='search']").addEventListener("input", scheduleFloatingSearchRender);
    shadowRoot.querySelector("[data-role='list']").addEventListener("scroll", () => rememberFloatingPanelScroll(activeFloatingTab), { passive: true });
    shadowRoot.querySelector("[data-role='category-search']").addEventListener("input", scheduleChooserSearchRender);
    shadowRoot.querySelector("[data-role='subcategory-name']").addEventListener("keydown", (event) => {
      if (event.key === "Enter") createAndAssignSubcategory(event.target);
    });
    shadowRoot.querySelector("[data-role='editor-save']").addEventListener("click", saveEditor);
    shadowRoot.querySelector("[data-role='editor-cancel']").addEventListener("click", () => closeEditor());
    shadowRoot.querySelector("[data-role='onboarding-backup-file']")?.addEventListener("change", importOnboardingBackup);
    shadowRoot.querySelector("[data-action='onboarding-restore-drive']")?.addEventListener("click", restoreOnboardingFromDrive);
    shadowRoot.querySelector("[data-role='shortcut-capture-zone']")?.addEventListener("keydown", detectOnboardingShortcut);
  }

  function handleOnboardingPrimaryClick(event) {
    const actionTarget = event.target?.closest?.("[data-action]");
    const action = actionTarget?.dataset?.action || "";
    if (action !== "close-onboarding" && action !== "complete-onboarding") return;
    event.preventDefault();
    event.stopPropagation();
    triggerMicroAnimation(actionTarget);
    runSafeAsync(() => completeOnboarding());
  }

  function buildSearchOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "mcp-search-overlay";
    overlay.dataset.role = "search-overlay";
    overlay.hidden = true;
    overlay.innerHTML = [
      "<div class=\"mcp-search-backdrop\" data-action=\"close-search\"></div>",
      "<section class=\"mcp-search-modal\" data-role=\"search-modal\" aria-label=\"Advanced search\">",
      "<header class=\"mcp-search-head\">",
      "<strong data-role=\"overlay-title\">Advanced search</strong>",
      "<button type=\"button\" data-action=\"close-search\" data-role=\"close-search-button\" aria-label=\"Close\">&times;</button>",
      "</header>",
      "<div class=\"mcp-overlay-tabs\" role=\"tablist\">",
      "<button type=\"button\" data-action=\"set-search-tab\" data-tab=\"text\" data-role=\"overlay-text-tab\">Texts</button>",
      "<button type=\"button\" data-action=\"set-search-tab\" data-tab=\"dev\" data-role=\"overlay-dev-tab\">Codes</button>",
      "<button type=\"button\" data-action=\"set-search-tab\" data-tab=\"image\" data-role=\"overlay-image-tab\">Images</button>",
      "</div>",
      "<input class=\"mcp-overlay-input\" data-role=\"overlay-query\" placeholder=\"Search copied items\" aria-label=\"Search copied items\">",
      "<div class=\"mcp-filter-row\" data-role=\"overlay-filters\"></div>",
      "<div class=\"mcp-overlay-body\">",
      "<div class=\"mcp-overlay-results\" data-role=\"overlay-results\"></div>",
      "<aside class=\"mcp-overlay-detail\" data-role=\"overlay-detail\"></aside>",
      "</div>",
      "<div class=\"mcp-search-date-modal\" data-role=\"overlay-date-modal\" hidden>",
      "<div class=\"mcp-search-date-card\" role=\"dialog\" aria-modal=\"true\">",
      "<header class=\"mcp-search-date-head\"><div><strong data-role=\"overlay-date-title\"></strong><p data-role=\"overlay-date-subtitle\"></p></div><button type=\"button\" data-action=\"close-search-date-calendar\" data-role=\"overlay-date-close\" aria-label=\"Close\">&times;</button></header>",
      "<div class=\"mcp-search-date-controls\"><button type=\"button\" data-action=\"search-date-prev\" data-role=\"overlay-date-prev\"></button><select data-role=\"overlay-date-month\"></select><input type=\"number\" data-role=\"overlay-date-year\" min=\"1970\" max=\"9999\"><button type=\"button\" data-action=\"search-date-next\" data-role=\"overlay-date-next\"></button></div>",
      "<div class=\"mcp-search-calendar-weekdays\" data-role=\"overlay-date-weekdays\"></div>",
      "<div class=\"mcp-search-calendar-grid\" data-role=\"overlay-date-grid\"></div>",
      "</div>",
      "</div>",
      "</section>"
    ].join("");
    return overlay;
  }

  function buildEditorModal() {
    const modal = document.createElement("div");
    modal.className = "mcp-editor-modal";
    modal.dataset.role = "editor";
    modal.dataset.editorVersion = "unified-text-editor-v5";
    modal.hidden = true;
    modal.innerHTML = [
      "<div class=\"mcp-search-backdrop\" data-action=\"close-editor\"></div>",
      "<section class=\"manager-editor-card unified-text-editor-card\" data-role=\"editor-card\" aria-label=\"Edit item\">",
      "<header class=\"mcp-search-head\"><strong data-role=\"editor-heading\">Edit</strong><button type=\"button\" data-action=\"close-editor\" data-role=\"close-editor-button\" aria-label=\"Close\">X</button></header>",
      "<div class=\"manager-editor-layout\">",
      "<aside class=\"manager-editor-category-pane\">",
      "<div class=\"category-pane-head editor-category-pane-head\"><strong data-role=\"editor-category-label\">Category</strong></div>",
      "<div class=\"category-list category-tree manager-editor-category-list\" data-role=\"editor-category-tree\"></div>",
      "</aside>",
      "<div class=\"manager-editor-form-pane\">",
      "<label><span data-role=\"editor-title-label\">Title</span><input data-role=\"editor-title\" type=\"text\" maxlength=\"160\"></label>",
      "<label><span data-role=\"editor-content-label\">Content</span><textarea data-role=\"editor-content\" rows=\"8\"></textarea></label>",
      "<label><span data-role=\"editor-note-label\">Personal note</span><textarea data-role=\"editor-note\" rows=\"3\"></textarea></label>",
      "<p class=\"mcp-editor-error\" data-role=\"editor-error\"></p>",
      "<footer><button type=\"button\" data-role=\"editor-save\">Save changes</button><button type=\"button\" data-role=\"editor-cancel\">Cancel</button></footer>",
      "</div>",
      "</section>"
    ].join("");
    return modal;
  }

  function buildDevSuggestionModal() {
    const modal = document.createElement("div");
    modal.className = "mcp-dev-suggestion";
    modal.dataset.role = "dev-suggestion";
    modal.hidden = true;
    modal.innerHTML = [
      "<div class=\"mcp-search-backdrop\" data-action=\"close-dev-suggestion\"></div>",
      "<section class=\"mcp-dev-suggestion-card\" role=\"dialog\" aria-modal=\"true\">",
      "<header class=\"mcp-search-head\"><strong data-role=\"dev-suggestion-title\"></strong><button type=\"button\" data-action=\"close-dev-suggestion\" aria-label=\"Close\">&times;</button></header>",
      "<div class=\"mcp-dev-match\" data-role=\"dev-match\" role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\"><div class=\"mcp-dev-match-head\"><span data-role=\"dev-match-label\"></span><strong data-role=\"dev-match-value\">0%</strong><span data-role=\"dev-match-language\"></span></div><div class=\"mcp-dev-match-track\"><span data-role=\"dev-match-fill\"></span></div></div>",
      "<p data-role=\"dev-suggestion-text\"></p>",
      "<pre data-role=\"dev-suggestion-preview\"></pre>",
      "<footer><button type=\"button\" class=\"mcp-primary\" data-action=\"accept-dev-suggestion\"></button><button type=\"button\" class=\"mcp-dev-other-language\" data-action=\"choose-dev-language\"></button><button type=\"button\" class=\"mcp-dev-as-text\" data-action=\"capture-dev-as-text\"></button><button type=\"button\" data-action=\"reject-dev-suggestion\"></button></footer>",
      "</section>"
    ].join("");
    return modal;
  }

  function buildFloatingTextModal() {
    const modal = document.createElement("div");
    modal.className = "mcp-floating-text-modal";
    modal.dataset.role = "floating-text-modal";
    modal.hidden = true;
    modal.innerHTML = [
      "<div class=\"mcp-search-backdrop\" data-action=\"close-floating-text-modal\"></div>",
      "<section class=\"mcp-floating-text-card\" role=\"dialog\" aria-modal=\"true\">",
      "<header class=\"mcp-search-head\"><strong data-role=\"floating-text-title\"></strong><button type=\"button\" data-action=\"close-floating-text-modal\" data-role=\"floating-text-close\" aria-label=\"Close\">&times;</button></header>",
      "<div class=\"mcp-floating-text-content\" data-role=\"floating-text-content\"></div>",
      "</section>"
    ].join("");
    return modal;
  }

  function buildOnboardingModal() {
    const modal = document.createElement("div");
    modal.className = "mcp-onboarding-modal";
    modal.dataset.role = "onboarding";
    modal.hidden = true;
    modal.innerHTML = [
      "<div class=\"mcp-search-backdrop\"></div>",
      "<section class=\"mcp-onboarding-card\" role=\"dialog\" aria-modal=\"true\">",
      "<header class=\"mcp-search-head\"><strong data-role=\"onboarding-title\"></strong><button type=\"button\" data-action=\"close-onboarding\" aria-label=\"Close\">X</button></header>",
      "<div class=\"mcp-onboarding-content\" data-role=\"onboarding-content\"></div>",
      "<div class=\"mcp-onboarding-settings\">",
      "<label class=\"mcp-onboarding-language-field\"><span data-role=\"onboarding-language-label\"></span><select data-role=\"onboarding-language\" class=\"mcp-onboarding-native-language\" tabindex=\"-1\" aria-hidden=\"true\"><option value=\"en\">English</option><option value=\"fr\">Français</option><option value=\"es\">Español</option><option value=\"it\">Italiano</option><option value=\"de\">Deutsch</option><option value=\"ro\">Română</option><option value=\"pt\">Português</option><option value=\"ar\">العربية</option><option value=\"zh\">中文</option><option value=\"ja\">日本語</option><option value=\"ru\">Русский</option><option value=\"nl\">Nederlands</option><option value=\"pl\">Polski</option><option value=\"tr\">Türkçe</option><option value=\"ko\">한국어</option><option value=\"hi\">हिन्दी</option></select><div class=\"mcp-onboarding-language-picker\" data-role=\"onboarding-language-picker\"></div></label>",
      "<label><span data-role=\"onboarding-theme-label\"></span><select data-role=\"onboarding-theme\"><option value=\"system\"></option><option value=\"dark\"></option><option value=\"light\"></option></select></label>",
      "<label><span data-role=\"onboarding-shortcut-label\"></span><div class=\"mcp-shortcut-row\"><select data-role=\"onboarding-shortcut\"><option value=\"ctrl_alt_c\">Ctrl + Alt + C</option><option value=\"ctrl_shift_c\">\u21e7 + Ctrl + C</option></select><button type=\"button\" data-action=\"open-onboarding-shortcut\"></button></div></label>",
      "<div class=\"mcp-onboarding-accent\"><span data-role=\"onboarding-accent-label\"></span><div data-role=\"onboarding-accent-swatches\" class=\"mcp-onboarding-accent-swatches\"></div></div>",
      "<div class=\"mcp-onboarding-backup\">",
      "<strong data-role=\"onboarding-backup-title\"></strong>",
      "<p data-role=\"onboarding-backup-help\"></p>",
      "<div class=\"mcp-onboarding-backup-actions\">",
      "<button type=\"button\" data-action=\"onboarding-import-backup\"></button>",
      "<button type=\"button\" data-action=\"onboarding-restore-drive\"></button>",
      "</div>",
      "<input type=\"file\" accept=\"application/zip,application/json,.zip,.json\" data-role=\"onboarding-backup-file\" hidden>",
      "<div class=\"mcp-onboarding-backup-log\" data-role=\"onboarding-backup-log\" aria-live=\"polite\"></div>",
      "</div>",
      "<div class=\"mcp-onboarding-drive-confirm\" data-role=\"onboarding-drive-confirm\" hidden>",
      "<div class=\"mcp-search-backdrop\" data-action=\"cancel-onboarding-drive-restore\"></div>",
      "<section class=\"mcp-onboarding-drive-card\" role=\"dialog\" aria-modal=\"true\">",
      "<header class=\"mcp-search-head\"><strong data-role=\"onboarding-drive-confirm-title\"></strong><button type=\"button\" data-action=\"cancel-onboarding-drive-restore\" aria-label=\"Close\">X</button></header>",
      "<p data-role=\"onboarding-drive-confirm-text\"></p>",
      "<footer><button type=\"button\" class=\"mcp-primary\" data-action=\"confirm-onboarding-drive-restore\"></button><button type=\"button\" data-action=\"cancel-onboarding-drive-restore\"></button></footer>",
      "</section>",
      "</div>",
      "</div>",
      "<footer><button type=\"button\" class=\"mcp-primary\" data-action=\"complete-onboarding\"></button></footer>",
      "<div class=\"mcp-shortcut-dialog\" data-role=\"onboarding-shortcut-dialog\" hidden>",
      "<div class=\"mcp-search-backdrop\" data-action=\"close-onboarding-shortcut\"></div>",
      "<section class=\"mcp-shortcut-card\" role=\"dialog\" aria-modal=\"true\">",
      "<header class=\"mcp-search-head\"><strong data-role=\"shortcut-dialog-title\"></strong><button type=\"button\" data-action=\"close-onboarding-shortcut\" data-role=\"shortcut-dialog-close\">X</button></header>",
      "<p data-role=\"shortcut-dialog-intro\"></p>",
      "<div class=\"mcp-shortcut-capture-wrap\"><button type=\"button\" class=\"mcp-shortcut-capture-zone\" data-role=\"shortcut-capture-zone\"><span data-role=\"shortcut-capture-state\"></span><strong data-role=\"shortcut-capture-value\"></strong></button><button type=\"button\" class=\"mcp-shortcut-reset-button\" data-action=\"reset-onboarding-shortcut\" data-role=\"shortcut-reset-button\"><img src=\"" + chrome.runtime.getURL("assets/icons/" + themedIconName("erase.png")) + "\" alt=\"\"></button></div>",
      "<p data-role=\"shortcut-dialog-hint\"></p>",
      "<p class=\"mcp-editor-error\" data-role=\"shortcut-dialog-error\"></p>",
      "<footer><button type=\"button\" class=\"mcp-primary\" data-action=\"save-onboarding-shortcut\" data-role=\"shortcut-dialog-save\"></button><button type=\"button\" data-action=\"close-onboarding-shortcut\" data-role=\"shortcut-dialog-cancel\"></button></footer>",
      "</section>",
      "</div>",
      "</section>"
    ].join("");
    return modal;
  }

  async function maybeShowOnboarding() {
    return;
    const modal = shadowRoot?.querySelector("[data-role='onboarding']");
    if (isOnboardingBlockedPage()) return;
    if (!modal || state.settings?.onboardingCompleted) return;
    await ensureOnboardingDetectedLanguage();
    translateOnboarding();
    modal.hidden = false;
  }

  function translateOnboarding() {
    const modal = shadowRoot?.querySelector("[data-role='onboarding']");
    if (!modal) return;
    modal.querySelector("[data-role='onboarding-title']").textContent = tr("onboarding.title");
    const content = modal.querySelector("[data-role='onboarding-content']");
    content.replaceChildren();
    [
      "onboarding.stepCaptureText",
      "onboarding.stepCaptureImages",
      "onboarding.stepScreenshots",
      "onboarding.stepPaste",
      "onboarding.stepSecurity",
      "onboarding.stepShortcut",
      "onboarding.stepShortcutWarning"
    ].forEach((key) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = tr(key, {
        shortcut: shortcutLabelFor("ctrl_alt_c"),
        alternativeShortcut: shortcutLabelFor("ctrl_shift_c")
      });
      content.appendChild(paragraph);
    });
    const languageSelect = modal.querySelector("[data-role='onboarding-language']");
    const themeSelect = modal.querySelector("[data-role='onboarding-theme']");
    const shortcutSelect = modal.querySelector("[data-role='onboarding-shortcut']");
    modal.querySelector("[data-role='onboarding-language-label']").textContent = tr("settings.language");
    modal.querySelector("[data-role='onboarding-theme-label']").textContent = tr("settings.theme");
    modal.querySelector("[data-role='onboarding-shortcut-label']").textContent = tr("settings.textCaptureShortcut");
    const customizeShortcut = modal.querySelector("[data-action='open-onboarding-shortcut']");
    if (customizeShortcut) customizeShortcut.textContent = tr("settings.shortcutCustomize");
    modal.querySelector("[data-role='onboarding-accent-label']").textContent = tr("settings.accentColor");
    modal.querySelector("[data-role='onboarding-backup-title']").textContent = tr("backup.onboardingTitle");
    modal.querySelector("[data-role='onboarding-backup-help']").textContent = tr("backup.onboardingHelp");
    modal.querySelector("[data-action='onboarding-import-backup']").textContent = tr("backup.import");
    const driveRestoreButton = modal.querySelector("[data-action='onboarding-restore-drive']");
    if (driveRestoreButton) driveRestoreButton.textContent = tr("backup.restoreFromDrive");
    translateOnboardingDriveConfirm();
    if (languageSelect) {
      languageSelect.value = resolvePreferredUiLanguage(state.settings);
      renderOnboardingLanguagePicker(languageSelect.value);
    }
    if (themeSelect) {
      themeSelect.querySelector("option[value='system']").textContent = tr("settings.themeSystem");
      themeSelect.querySelector("option[value='dark']").textContent = tr("settings.themeDark");
      themeSelect.querySelector("option[value='light']").textContent = tr("settings.themeLight");
      themeSelect.value = state.settings?.theme || "system";
    }
    if (shortcutSelect) {
      const shiftOption = shortcutSelect.querySelector("option[value='ctrl_shift_c']");
      const altOption = shortcutSelect.querySelector("option[value='ctrl_alt_c']");
      if (shiftOption) shiftOption.textContent = shortcutLabelFor("ctrl_shift_c");
      if (altOption) altOption.textContent = shortcutLabelFor("ctrl_alt_c");
      setShortcutSelectValue(shortcutSelect, state.settings?.textCaptureShortcut || "ctrl_alt_c");
    }
    const swatches = modal.querySelector("[data-role='onboarding-accent-swatches']");
    const accentSignature = ONBOARDING_ACCENTS.map((accent) => accent.value).join("|");
    if (swatches && swatches.dataset.accentSignature !== accentSignature) {
      swatches.replaceChildren(...ONBOARDING_ACCENTS.map((accent) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.action = "select-onboarding-accent";
        button.dataset.accentColor = accent.value;
        button.setAttribute("role", "radio");
        button.setAttribute("aria-label", tr(accent.key));
        const dot = document.createElement("span");
        dot.style.background = accent.value;
        button.appendChild(dot);
        return button;
      }));
      swatches.dataset.accentSignature = accentSignature;
    }
    swatches?.querySelectorAll("[data-action='select-onboarding-accent']").forEach((button) => {
      const accent = ONBOARDING_ACCENTS.find((item) => item.value === button.dataset.accentColor);
      if (accent) button.setAttribute("aria-label", tr(accent.key));
    });
    syncOnboardingAccentButtons(state.settings?.accentColor || "#e50914");
    modal.querySelector("[data-action='complete-onboarding']").textContent = tr("onboarding.start");
    translateOnboardingShortcutDialog();
  }

  function setShortcutSelectValue(select, value) {
    if (!select) return;
    const normalized = globalThis.MCP?.normalizeShortcutValue ? globalThis.MCP.normalizeShortcutValue(value || "ctrl_alt_c") : value || "ctrl_alt_c";
    select.querySelectorAll("option[data-custom-shortcut='true']").forEach((option) => option.remove());
    if (normalized.startsWith("custom:")) {
      const option = document.createElement("option");
      option.value = normalized;
      option.dataset.customShortcut = "true";
      option.textContent = shortcutLabelFor(normalized);
      select.appendChild(option);
    }
    select.value = normalized;
  }

  function renderOnboardingLanguagePicker(selectedLanguage) {
    const picker = shadowRoot?.querySelector("[data-role='onboarding-language-picker']");
    const select = shadowRoot?.querySelector("[data-role='onboarding-language']");
    if (!picker || !select) return;
    const currentValue = selectedLanguage || select.value || state.settings?.language || "en";
    const current = ONBOARDING_LANGUAGE_OPTIONS.find((language) => language.value === currentValue) || ONBOARDING_LANGUAGE_OPTIONS[0];
    picker.replaceChildren();
    picker.setAttribute("role", "listbox");
    picker.setAttribute("aria-label", tr("settings.language"));
    ONBOARDING_LANGUAGE_OPTIONS.forEach((language) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "mcp-onboarding-language-option";
      option.dataset.action = "select-onboarding-language";
      option.dataset.languageOption = language.value;
      option.lang = language.value;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(language.value === current.value));
      option.setAttribute("aria-label", language.label);
      option.append(createOnboardingLanguageName(language));
      picker.appendChild(option);
    });
  }

  function createOnboardingLanguageName(language) {
    const name = document.createElement("span");
    name.className = "mcp-onboarding-language-name";
    name.textContent = language.label;
    return name;
  }

  function translateOnboardingShortcutDialog() {
    const modal = shadowRoot?.querySelector("[data-role='onboarding']");
    if (!modal) return;
    const dialog = modal.querySelector("[data-role='onboarding-shortcut-dialog']");
    if (!dialog) return;
    dialog.querySelector("[data-role='shortcut-dialog-title']").textContent = tr("settings.shortcutDialogTitle");
    globalThis.MCP.setSafeRichText(
      dialog.querySelector("[data-role='shortcut-dialog-intro']"),
      tr("settings.shortcutDialogIntro")
    );
    dialog.querySelector("[data-role='shortcut-dialog-hint']").textContent = tr("settings.shortcutDialogHint");
    dialog.querySelector("[data-role='shortcut-capture-state']").textContent = pendingOnboardingShortcut ? tr("settings.shortcutDetected") : tr("settings.shortcutWaiting");
    dialog.querySelector("[data-role='shortcut-capture-value']").textContent = pendingOnboardingShortcut ? shortcutLabelFor(pendingOnboardingShortcut) : tr("settings.shortcutPressKeys");
    dialog.querySelector("[data-role='shortcut-dialog-save']").textContent = tr("common.save");
    dialog.querySelector("[data-role='shortcut-dialog-cancel']").textContent = tr("common.cancel");
    dialog.querySelector("[data-role='shortcut-dialog-close']").setAttribute("aria-label", tr("common.close"));
    dialog.querySelector("[data-role='shortcut-reset-button']")?.setAttribute("aria-label", tr("settings.shortcutReset"));
  }

  function openOnboardingShortcutDialog() {
    const dialog = shadowRoot?.querySelector("[data-role='onboarding-shortcut-dialog']");
    const select = shadowRoot?.querySelector("[data-role='onboarding-shortcut']");
    if (!dialog) return;
    pendingOnboardingShortcut = select?.value?.startsWith("custom:") ? select.value : "";
    onboardingShortcutModifierOrder = [];
    dialog.querySelector("[data-role='shortcut-dialog-error']").textContent = "";
    translateOnboardingShortcutDialog();
    dialog.hidden = false;
    requestAnimationFrame(() => dialog.querySelector("[data-role='shortcut-capture-zone']")?.focus());
  }

  function closeOnboardingShortcutDialog() {
    const dialog = shadowRoot?.querySelector("[data-role='onboarding-shortcut-dialog']");
    if (dialog) dialog.hidden = true;
    pendingOnboardingShortcut = "";
    onboardingShortcutModifierOrder = [];
  }

  function detectOnboardingShortcut(event) {
    const dialog = shadowRoot?.querySelector("[data-role='onboarding-shortcut-dialog']");
    if (!dialog || dialog.hidden) return;
    event.preventDefault();
    event.stopPropagation();
    const modifier = globalThis.MCP?.shortcutModifierFromKey?.(event.key || "");
    const error = dialog.querySelector("[data-role='shortcut-dialog-error']");
    const zone = dialog.querySelector("[data-role='shortcut-capture-zone']");
    if (modifier) {
      if (!onboardingShortcutModifierOrder.includes(modifier)) onboardingShortcutModifierOrder.push(modifier);
      if (error) error.textContent = "";
      dialog.querySelector("[data-role='shortcut-capture-state']").textContent = tr("settings.shortcutWaiting");
      dialog.querySelector("[data-role='shortcut-capture-value']").textContent = onboardingShortcutModifierOrder
        .map((part) => globalThis.MCP?.shortcutPartLabel?.(part) || part)
        .join(" + ");
      return;
    }
    const shortcut = globalThis.MCP?.shortcutFromEvent?.(event, onboardingShortcutModifierOrder) || "";
    if (!shortcut) {
      if (error) error.textContent = tr("settings.shortcutInvalid");
      zone?.classList.remove("is-detected");
      onboardingShortcutModifierOrder = [];
      return;
    }
    pendingOnboardingShortcut = shortcut;
    if (error) error.textContent = "";
    zone?.classList.remove("is-detected");
    void zone?.offsetWidth;
    zone?.classList.add("is-detected");
    translateOnboardingShortcutDialog();
  }

  function resetOnboardingShortcutCapture() {
    const dialog = shadowRoot?.querySelector("[data-role='onboarding-shortcut-dialog']");
    if (!dialog) return;
    pendingOnboardingShortcut = "";
    onboardingShortcutModifierOrder = [];
    dialog.querySelector("[data-role='shortcut-dialog-error']").textContent = "";
    dialog.querySelector("[data-role='shortcut-capture-zone']")?.classList.remove("is-detected");
    translateOnboardingShortcutDialog();
    requestAnimationFrame(() => dialog.querySelector("[data-role='shortcut-capture-zone']")?.focus());
  }

  function saveOnboardingShortcut() {
    const dialog = shadowRoot?.querySelector("[data-role='onboarding-shortcut-dialog']");
    const select = shadowRoot?.querySelector("[data-role='onboarding-shortcut']");
    const error = dialog?.querySelector("[data-role='shortcut-dialog-error']");
    if (!pendingOnboardingShortcut) {
      if (error) error.textContent = tr("settings.shortcutInvalid");
      return;
    }
    const savedShortcut = globalThis.MCP?.normalizeShortcutValue ? globalThis.MCP.normalizeShortcutValue(pendingOnboardingShortcut) : pendingOnboardingShortcut;
    setShortcutSelectValue(select, savedShortcut);
    state.settings = Object.assign({}, state.settings, { textCaptureShortcut: savedShortcut });
    showToast(tr("settings.shortcutSaved", { shortcut: shortcutLabelFor(savedShortcut) }));
    closeOnboardingShortcutDialog();
    translateOnboarding();
  }

  async function completeOnboarding() {
    if (onboardingCompletionInProgress) return;
    const modal = shadowRoot?.querySelector("[data-role='onboarding']");
    if (!modal) return;
    onboardingCompletionInProgress = true;
    const language = modal?.querySelector("[data-role='onboarding-language']")?.value || state.settings?.language || "en";
    const theme = modal?.querySelector("[data-role='onboarding-theme']")?.value || state.settings?.theme || "system";
    const rawShortcut = modal?.querySelector("[data-role='onboarding-shortcut']")?.value || state.settings?.textCaptureShortcut || "ctrl_alt_c";
    const shortcut = globalThis.MCP?.normalizeShortcutValue ? globalThis.MCP.normalizeShortcutValue(rawShortcut) : rawShortcut;
    const settingsPatch = {
      language,
      languageSource: state.settings?.languageSource || "auto",
      theme,
      textCaptureShortcut: shortcut,
      accentColor: selectedOnboardingAccent(),
      onboardingCompleted: true
    };
    let nextSettings = Object.assign({}, state.settings, settingsPatch);
    state.settings = nextSettings;
    try {
      nextSettings = await saveSettingsPatch(settingsPatch);
      safeRuntimeMessage({ type: MESSAGE_TYPES.STORAGE_REFRESH_REQUIRED });
    } catch (error) {
      if (!isExtensionContextError(error)) {
        console.warn("[Ultimate Clipboard Pro] Onboarding settings save failed", error);
      }
    } finally {
      onboardingCompletionInProgress = false;
      try {
        applyThemeSettings(nextSettings);
        modal.hidden = true;
        showToast(tr("onboarding.ready"));
        revealFloatingPanel();
      } catch (error) {
        console.warn("[Ultimate Clipboard Pro] Onboarding close failed", error);
        modal.hidden = true;
      }
    }
  }

  function addOnboardingBackupLog(message, tone = "") {
    const log = shadowRoot?.querySelector("[data-role='onboarding-backup-log']");
    if (!log) return;
    const row = document.createElement("p");
    row.className = tone ? `is-${tone}` : "";
    row.textContent = `${globalThis.MCP.formatLocalizedTime(Date.now(), lang())} - ${message}`;
    log.prepend(row);
  }

  function translateOnboardingDriveConfirm() {
    const dialog = shadowRoot?.querySelector("[data-role='onboarding-drive-confirm']");
    if (!dialog) return;
    dialog.querySelector("[data-role='onboarding-drive-confirm-title']").textContent = tr("drive.restoreConfirmSimpleTitle");
    dialog.querySelector("[data-role='onboarding-drive-confirm-text']").textContent = tr("drive.restoreConfirmSimpleText");
    dialog.querySelector("[data-action='confirm-onboarding-drive-restore']").textContent = tr("drive.restoreConfirmImport");
    dialog.querySelectorAll("[data-action='cancel-onboarding-drive-restore']").forEach((node) => {
      node.setAttribute("aria-label", tr("common.close"));
    });
    dialog.querySelector("footer [data-action='cancel-onboarding-drive-restore']").textContent = tr("common.cancel");
  }

  function setOnboardingDriveButtonLoading(button, isLoading) {
    if (!button) return;
    button.disabled = Boolean(isLoading);
    button.classList.toggle("is-drive-loading", Boolean(isLoading));
    button.classList.remove("is-loading");
    if (isLoading) {
      const image = document.createElement("img");
      image.src = chrome.runtime.getURL("assets/icons/sync-in-progess.gif");
      image.alt = "";
      image.decoding = "async";
      button.replaceChildren(image);
      return;
    }
    button.textContent = tr("backup.restoreFromDrive");
  }

  function openOnboardingDriveConfirm() {
    return new Promise((resolve) => {
      const dialog = shadowRoot?.querySelector("[data-role='onboarding-drive-confirm']");
      if (!dialog) {
        resolve(false);
        return;
      }
      translateOnboardingDriveConfirm();
      const finalize = (value) => {
        dialog.hidden = true;
        dialog.querySelector("[data-action='confirm-onboarding-drive-restore']").onclick = null;
        dialog.querySelectorAll("[data-action='cancel-onboarding-drive-restore']").forEach((node) => {
          node.onclick = null;
        });
        resolve(value);
      };
      dialog.querySelector("[data-action='confirm-onboarding-drive-restore']").onclick = () => finalize(true);
      dialog.querySelectorAll("[data-action='cancel-onboarding-drive-restore']").forEach((node) => {
        node.onclick = () => finalize(false);
      });
      dialog.hidden = false;
    });
  }

  function onboardingDriveRestoreSummaryLines(summary = {}, imageAssetCount = 0, faviconAssetCount = 0) {
    const lines = [
      { text: tr("drive.restoreFromDriveImportedTexts", { count: summary.textItems || 0 }), tone: (summary.textItems || 0) ? "success" : "" },
      { text: tr("drive.restoreFromDriveImportedCodes", { count: summary.devItems || 0 }), tone: (summary.devItems || 0) ? "success" : "" },
      { text: tr("drive.restoreFromDriveImportedImages", { count: summary.imageItems || 0 }), tone: (summary.imageItems || 0) ? "success" : "" },
      { text: tr("drive.restoreFromDriveImportedCategories", { count: (summary.textCategories || 0) + (summary.devCategories || 0) + (summary.imageCategories || 0) }), tone: ((summary.textCategories || 0) + (summary.devCategories || 0) + (summary.imageCategories || 0)) ? "success" : "" },
      { text: tr("drive.restoreFromDriveImagesFolder", { count: imageAssetCount || 0 }), tone: imageAssetCount ? "success" : "" },
      { text: tr("drive.restoreFromDriveFaviconsFolder", { count: faviconAssetCount || 0 }), tone: faviconAssetCount ? "success" : "" }
    ];
    if (!summary.total && !imageAssetCount && !faviconAssetCount) {
      lines.push({ text: tr("drive.restoreFromDriveNoNewData"), tone: "pending" });
    }
    return lines;
  }

  function readableOnboardingDriveError(error) {
    const raw = String(error?.message || error || "");
    if (!raw) return tr("drive.authFailed");
    if (raw === "drive.proRequired") return tr("pro.driveRequired");
    if (raw.startsWith("drive.") || raw.startsWith("backup.") || raw.startsWith("common.")) return tr(raw);
    if (/oauth|auth|token|identity/i.test(raw)) return tr("drive.authFailed");
    return raw;
  }

  async function restoreOnboardingFromDrive() {
    const button = shadowRoot?.querySelector("[data-action='onboarding-restore-drive']");
    if (button?.classList.contains("is-drive-loading")) return;
    setOnboardingDriveButtonLoading(button, true);
    addOnboardingBackupLog(tr("drive.restoreFromDriveStarting"), "pending");
    try {
      const statusResponse = await safeRuntimeMessage({ type: MESSAGE_TYPES.DRIVE_GET_STATUS });
      if (!statusResponse?.data?.connected) {
        addOnboardingBackupLog(tr("drive.restoreFromDriveConnecting"), "pending");
      }
      const analysisResponse = await safeRuntimeMessage({ type: MESSAGE_TYPES.DRIVE_ANALYZE_RESTORE_FROM_DRIVE });
      if (!analysisResponse?.ok) throw new Error(analysisResponse?.error || "drive.authFailed");
      const analysis = analysisResponse.data || {};
      addOnboardingBackupLog(tr("drive.restoreFromDriveConnected"), "success");
      if (!analysis.hasBackup) {
        addOnboardingBackupLog(tr("drive.restoreFromDriveNoJson"), "pending");
        addOnboardingBackupLog(tr("drive.restoreFromDriveNoNewData"), "pending");
        showToast(tr("drive.restoreFromDriveNoJson"));
        return;
      }
      setOnboardingDriveButtonLoading(button, false);
      const confirmed = await openOnboardingDriveConfirm();
      if (!confirmed) {
        addOnboardingBackupLog(tr("drive.restoreFromDriveCancelled"), "pending");
        showToast(tr("drive.restoreFromDriveCancelled"));
        return;
      }
      setOnboardingDriveButtonLoading(button, true);
      addOnboardingBackupLog(tr("drive.restoreFromDriveDecisionAccepted"), "pending");
      const response = await safeRuntimeMessage({
        type: MESSAGE_TYPES.DRIVE_RESTORE_FROM_DRIVE,
        overwrite: true
      });
      if (!response?.ok) throw new Error(response?.error || "drive.authFailed");
      const data = response.data || {};
      addOnboardingBackupLog(tr(data.remoteJsonFound ? "drive.restoreFromDriveJson" : "drive.restoreFromDriveNoJson"), data.remoteJsonFound ? "success" : "pending");
      onboardingDriveRestoreSummaryLines(data.importSummary || {}, data.imageAssetCount || 0, data.faviconAssetCount || 0).forEach(({ text, tone }) => addOnboardingBackupLog(text, tone));
      await refreshState();
      safeRuntimeMessage({ type: MESSAGE_TYPES.STORAGE_REFRESH_REQUIRED });
      addOnboardingBackupLog(tr("drive.restoreFromDriveDone"), "success");
      showToast(tr("drive.restoreFromDriveDone"));
    } catch (error) {
      const message = readableOnboardingDriveError(error);
      addOnboardingBackupLog(message, "error");
      showToast(message);
    } finally {
      setOnboardingDriveButtonLoading(button, false);
    }
  }

  async function importOnboardingBackup(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !globalThis.MCP?.readBackupFile) return;
    const button = shadowRoot?.querySelector("[data-action='onboarding-import-backup']");
    button?.classList.add("is-loading");
    addOnboardingBackupLog(tr("backup.importReading", { filename: file.name }), "pending");
    try {
      const payload = await globalThis.MCP.readBackupFile(file);
      const result = await globalThis.MCP.restoreBackupPayload(payload);
      addOnboardingBackupLog(tr("backup.importApplying"), "pending");
      addOnboardingBackupLog(tr("backup.summaryTexts", { count: result.summary?.textItems || 0 }));
      addOnboardingBackupLog(tr("backup.summaryImages", { count: result.summary?.imageItems || 0 }));
      addOnboardingBackupLog(tr("backup.summaryDev", { count: result.summary?.devItems || 0 }));
      addOnboardingBackupLog(tr("backup.summarySettings", { count: result.summary?.settings || 0 }));
      addOnboardingBackupLog(tr("backup.summaryTextCategories", { count: result.summary?.textCategories || 0 }));
      addOnboardingBackupLog(tr("backup.summaryImageCategories", { count: result.summary?.imageCategories || 0 }));
      addOnboardingBackupLog(tr("backup.summaryDevCategories", { count: result.summary?.devCategories || 0 }));
      addOnboardingBackupLog(tr("backup.summaryHiddenDefaults", { count: (result.summary?.deletedDefaultTextCategories || 0) + (result.summary?.deletedDefaultImageCategories || 0) }));
      addOnboardingBackupLog(tr("backup.summaryTrashText", { count: result.summary?.trashTextItems || 0 }));
      addOnboardingBackupLog(tr("backup.summaryTrashImages", { count: result.summary?.trashImageItems || 0 }));
      addOnboardingBackupLog(tr("backup.summaryTrashDev", { count: result.summary?.trashDevItems || 0 }));
      addOnboardingBackupLog(tr("backup.summaryToolOrder", { count: result.summary?.toolOrder || 0 }));
      addOnboardingBackupLog(tr("backup.summaryToolStates", { count: result.summary?.toolStates || 0 }));
      addOnboardingBackupLog(tr("backup.summaryExtraStorageKeys", { count: result.summary?.extraStorageKeys || 0 }));
      await refreshState();
      addOnboardingBackupLog(tr("backup.importDone", { filename: file.name }), "success");
      showToast(tr("backup.importDone", { filename: file.name }));
    } catch (error) {
      addOnboardingBackupLog(tr("backup.invalid"), "error");
      showToast(tr("backup.invalid"));
    } finally {
      button?.classList.remove("is-loading");
    }
  }

  function handlePanelChange(event) {
    const control = event.target;
    if (!control?.matches?.("[data-role='onboarding-language'], [data-role='onboarding-theme'], [data-role='onboarding-shortcut']")) return;
    const modal = shadowRoot?.querySelector("[data-role='onboarding']");
    if (!modal || modal.hidden) return;
    const nextLanguage = modal.querySelector("[data-role='onboarding-language']")?.value || state.settings?.language || "en";
    state.settings = Object.assign({}, state.settings, {
      language: nextLanguage,
      languageSource: control.matches("[data-role='onboarding-language']") ? "manual" : state.settings?.languageSource || "auto",
      theme: modal.querySelector("[data-role='onboarding-theme']")?.value || state.settings?.theme || "system",
      textCaptureShortcut: globalThis.MCP?.normalizeShortcutValue
        ? globalThis.MCP.normalizeShortcutValue(modal.querySelector("[data-role='onboarding-shortcut']")?.value || state.settings?.textCaptureShortcut || "ctrl_alt_c")
        : modal.querySelector("[data-role='onboarding-shortcut']")?.value || state.settings?.textCaptureShortcut || "ctrl_alt_c",
      accentColor: selectedOnboardingAccent()
    });
    applyThemeSettings(state.settings);
    translateFloatingUi();
    translateOnboarding();
    triggerMicroAnimation(control);
  }

  function renderPanel() {
    if (!shadowRoot) return;
    const panel = shadowRoot.querySelector(".mcp-panel");
    const list = shadowRoot.querySelector("[data-role='list']");
    const status = shadowRoot.querySelector("[data-role='status']");
    const query = shadowRoot.querySelector("[data-role='search']")?.value || "";
    if (!panel || !list || !status) return;
    updateFloatingSearchPlaceholder();
    floatingDriveQuickSyncController?.render();

    updateFloatingItemCount();

    shadowRoot.querySelectorAll("[data-action='set-floating-tab']").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === activeFloatingTab);
      button.setAttribute("aria-selected", String(button.dataset.tab === activeFloatingTab));
      const label = button.dataset.tab === "image" ? tr("images.tab") : button.dataset.tab === "dev" ? tr("tabs.dev") : tr("tabs.text");
      const imageLocked = false;
      button.classList.toggle("is-pro-locked", imageLocked);
      button.dataset.proLocked = imageLocked ? "true" : "false";
      button.setAttribute("aria-label", label);
      button.title = imageLocked ? tr("pro.imageCaptureRequired") : label;
      const labelNode = button.querySelector("[data-role='floating-text-label'], [data-role='floating-dev-label'], [data-role='floating-image-label']");
      if (labelNode) labelNode.textContent = label;
      updateFloatingTabProIcon(button, imageLocked);
    });

    list.replaceChildren();
    if (activeFloatingTab === "image") {
      const images = filterImages(state.imageItems, query);
      renderImagePanelItems(list, images, query);
      if (images.length > FLOATING_PANEL_ITEM_LIMIT) appendFloatingManagerListButton(list, "image");
      scheduleFloatingPanelScrollRestore(activeFloatingTab);
      return;
    }
    if (activeFloatingTab === "dev") {
      const devItems = filterItems(visibleDevItems(), query);
      renderTextLikePanelItems(list, devItems.slice(0, FLOATING_PANEL_ITEM_LIMIT), "dev");
      if (devItems.length > FLOATING_PANEL_ITEM_LIMIT) appendFloatingManagerListButton(list, "dev");
      scheduleFloatingPanelScrollRestore(activeFloatingTab);
      return;
    }

    const textItems = filterItems(state.items, query);
    renderTextLikePanelItems(list, textItems.slice(0, FLOATING_PANEL_ITEM_LIMIT), "text");
    if (textItems.length > FLOATING_PANEL_ITEM_LIMIT) appendFloatingManagerListButton(list, "text");
    scheduleFloatingPanelScrollRestore(activeFloatingTab);
  }

  function updateFloatingItemCount() {
    const status = shadowRoot?.querySelector("[data-role='status']");
    if (!status) return;
    status.textContent = activeFloatingTab === "image"
      ? tr("images.itemCount", { count: (state.imageItems || []).filter((item) => !isTrashCategoryId(item.categoryId) && !isVaultCategoryId(item.categoryId)).length })
      : activeFloatingTab === "dev"
        ? tr("dev.itemCount", { count: visibleDevItems().filter((item) => !isTrashCategoryId(item.categoryId) && !isVaultCategoryId(item.categoryId) && !isVaultCategoryId(item.languageId)).length })
        : tr("clipboard.itemCount", { count: (state.items || []).filter((item) => !isTrashCategoryId(item.categoryId) && !isVaultCategoryId(item.categoryId)).length });
  }

  function normalizeFloatingPanelTab(tab = activeFloatingTab) {
    return ["text", "dev", "image"].includes(tab) ? tab : "text";
  }

  function rememberFloatingPanelScroll(tab = activeFloatingTab) {
    const list = shadowRoot?.querySelector("[data-role='list']");
    if (!list) return;
    floatingPanelScrollTops[normalizeFloatingPanelTab(tab)] = Math.max(0, Number(list.scrollTop) || 0);
  }

  function restoreFloatingPanelScroll(tab = activeFloatingTab) {
    const list = shadowRoot?.querySelector("[data-role='list']");
    if (!list) return;
    const maxScrollTop = Math.max(0, list.scrollHeight - list.clientHeight);
    list.scrollTop = Math.min(Math.max(0, floatingPanelScrollTops[normalizeFloatingPanelTab(tab)] || 0), maxScrollTop);
  }

  function scheduleFloatingPanelScrollRestore(tab = activeFloatingTab) {
    restoreFloatingPanelScroll(tab);
    requestAnimationFrame(() => restoreFloatingPanelScroll(tab));
  }

  function updateFloatingTabProIcon(button, locked) {
    let icon = button.querySelector(".mcp-tab-pro-icon");
    if (!locked) {
      icon?.remove();
      return;
    }
    if (!icon) {
      icon = document.createElement("img");
      icon.className = "mcp-tab-pro-icon";
      icon.src = chrome.runtime.getURL("assets/icons/pro-icon.png");
      icon.alt = tr("license.getPro");
      button.appendChild(icon);
    }
  }

  function floatingSearchPlaceholderKey(tab = activeFloatingTab) {
    if (tab === "image") return "search.placeholderImages";
    if (tab === "dev") return "search.placeholderCode";
    return "search.placeholderTexts";
  }

  function updateFloatingSearchPlaceholder() {
    const quickSearch = shadowRoot?.querySelector("[data-role='search']");
    if (!quickSearch) return;
    const placeholder = tr(floatingSearchPlaceholderKey());
    quickSearch.placeholder = placeholder;
    quickSearch.setAttribute("aria-label", placeholder);
  }

  function visibleDevItems() {
    const pendingId = pendingDevSuggestionItem?.id || "";
    return (state.devItems || []).filter((item) => !pendingId || item.id !== pendingId);
  }

  function renderTextLikePanelItems(list, items, mediaType = "text") {
    const query = shadowRoot.querySelector("[data-role='search']")?.value || "";
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "mcp-empty";
      renderFloatingEmptyState(empty, query ? tr("search.noResults") : floatingEmptyMessage(mediaType));
      list.appendChild(empty);
      return;
    }

    items.forEach((item, index) => {
      const displayItem = floatingItemDisplayVersion(item, mediaType);
      const card = document.createElement("article");
      card.className = `mcp-item ${index === selectedIndex ? "is-selected" : ""} ${item.isPinned ? "is-pinned" : ""}`;
      card.dataset.itemId = item.id;
      card.dataset.mediaType = mediaType;
      card.dataset.activeVersionId = displayItem?.activeVersionId || "";

      const copyButton = document.createElement("button");
      copyButton.className = "mcp-copy-area";
      copyButton.dataset.copyItemId = item.id;
      copyButton.type = "button";
      copyButton.setAttribute("aria-label", tr("common.useCapture"));
      copyButton.title = tr("common.useCapture");

      const preview = document.createElement("div");
      preview.className = "mcp-preview";
      const previewText = document.createElement("div");
      previewText.className = "mcp-preview-text";
      const fullPreviewText = String(displayItem.content || "").trim()
        ? String(displayItem.content || "")
        : stripGeneratedPreviewEllipsis(displayItem.preview || "");
      previewText.textContent = fullPreviewText;
      preview.appendChild(previewText);
      if (shouldScrollPreview(fullPreviewText)) {
        preview.classList.add("is-scrollable");
        preview.style.setProperty("--preview-scroll-offset", `-${Math.min(420, Math.max(92, fullPreviewText.length * 0.42))}px`);
        preview.style.setProperty("--preview-scroll-duration", `${Math.min(12, Math.max(3.4, fullPreviewText.length / 180))}s`);
      }
      preview.dataset.previewLength = String(fullPreviewText.length);

      const meta = document.createElement("span");
      meta.className = "mcp-meta";
      const path = mediaType === "dev" ? devCategoryPath(item) : itemCategoryPath(item);
      renderSourceAwareMeta(meta, item, [
        path || tr("categories.general"),
        globalThis.MCP.formatLocalizedDate(item.createdAt, lang())
      ], { showFavoriteIcon: item.isFavorite });
      const versionBadge = floatingVersionBadge(item, mediaType);
      if (versionBadge) card.classList.add("has-version-badge");

      const actions = document.createElement("div");
      actions.className = "mcp-item-actions";
      const mainActions = document.createElement("div");
      mainActions.className = "mcp-item-main-actions";
      const quickActions = document.createElement("div");
      quickActions.className = "mcp-item-quick-actions";

      const copyAction = document.createElement("button");
      copyAction.type = "button";
      copyAction.className = "mcp-category-badge mcp-text-primary-action";
      copyAction.dataset.copyItemId = item.id;
      copyAction.dataset.mediaType = mediaType;
      decorateUseCaptureButton(copyAction);
      const category = document.createElement("button");
      category.type = "button";
      category.className = "mcp-category-badge mcp-text-primary-action";
      category.dataset.action = "classify-item";
      category.dataset.itemId = item.id;
      category.dataset.mediaType = mediaType;
      category.textContent = tr("categories.classify");
      const favorite = document.createElement("button");
      favorite.type = "button";
      favorite.className = `mcp-mini-action ${item.isFavorite ? "is-active" : ""}`;
      favorite.dataset.action = "toggle-favorite";
      favorite.dataset.itemId = item.id;
      favorite.dataset.mediaType = mediaType;
      favorite.setAttribute("aria-label", item.isFavorite ? tr("common.favoriteRemove") : tr("common.favoriteAdd"));
      favorite.title = item.isFavorite ? tr("common.favoriteRemove") : tr("common.favoriteAdd");
      favorite.appendChild(iconImage(item.isFavorite ? "favorited.png" : "not_yet_favorited.png", favorite.title));
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = `mcp-mini-action ${item.isPinned ? "is-active" : ""}`;
      pin.dataset.action = "toggle-pin";
      pin.dataset.itemId = item.id;
      pin.dataset.mediaType = mediaType;
      pin.setAttribute("aria-label", item.isPinned ? tr("common.unpin") : tr("common.pin"));
      pin.title = item.isPinned ? tr("common.unpin") : tr("common.pin");
      pin.appendChild(iconImage(item.isPinned ? "go_unpin.png" : "go_pin.png", pin.title));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "mcp-mini-action";
      remove.dataset.action = "delete-item";
      remove.dataset.itemId = item.id;
      remove.dataset.mediaType = mediaType;
      remove.setAttribute("aria-label", tr("common.delete"));
      remove.title = tr("common.delete");
      remove.appendChild(iconImage("erase.png", tr("common.delete")));
      const source = document.createElement("button");
      source.type = "button";
      source.className = "mcp-mini-action";
      source.dataset.action = "open-source";
      source.dataset.itemId = item.id;
      source.dataset.mediaType = mediaType;
      source.setAttribute("aria-label", tr("source.open"));
      source.title = tr("source.open");
      source.appendChild(iconImage("reverse.png", tr("source.open")));
      mainActions.append(copyAction, category);
      if ((mediaType === "text" || mediaType === "dev") && isFloatingSourceVersionActive(item, mediaType)) mainActions.append(source);
      quickActions.append(favorite, pin, remove);
      actions.append(mainActions, quickActions);

      copyButton.append(preview, meta);
      card.append(...[versionBadge, copyButton, actions].filter(Boolean));
      list.appendChild(card);
      card.addEventListener("mouseenter", () => startPreviewAutoScroll(preview, previewText));
      card.addEventListener("mouseleave", () => stopPreviewAutoScroll(preview));
      card.addEventListener("focusin", () => startPreviewAutoScroll(preview, previewText));
      card.addEventListener("focusout", () => stopPreviewAutoScroll(preview));
    });
  }

  function floatingEmbeddedVersions(item) {
    return Array.isArray(item?.captureVersions)
      ? item.captureVersions
        .filter((version) => version && version.id && typeof version.content === "string")
        .sort((left, right) => Number(left.createdAt || 0) - Number(right.createdAt || 0) || String(left.id).localeCompare(String(right.id)))
      : [];
  }

  function floatingCurrentVersionId(item, mediaType = "text") {
    const versions = floatingEmbeddedVersions(item);
    if (!versions.length || mediaType === "image") return "";
    if (item.activeVersionId && versions.some((version) => version.id === item.activeVersionId)) return item.activeVersionId;
    return versions[versions.length - 1]?.id || "";
  }

  function isFloatingSourceVersionActive(item, mediaType = "text") {
    const versions = floatingEmbeddedVersions(item);
    if (mediaType === "image" || versions.length <= 1) return true;
    const sourceVersionId = item.sourceVersionId || versions[0]?.id || "";
    return floatingCurrentVersionId(item, mediaType) === sourceVersionId;
  }

  function floatingItemDisplayVersion(item, mediaType = "text", versionId = "") {
    const versions = floatingEmbeddedVersions(item);
    if (!versions.length || mediaType === "image") return item;
    const activeId = versionId && versions.some((version) => version.id === versionId)
      ? versionId
      : floatingCurrentVersionId(item, mediaType);
    const version = versions.find((candidate) => candidate.id === activeId) || versions[versions.length - 1];
    return Object.assign({}, item, {
      title: version.title || "",
      content: version.content || "",
      note: version.note || "",
      createdAt: version.createdAt || item.createdAt,
      updatedAt: version.updatedAt || item.updatedAt || version.createdAt || item.createdAt,
      preview: createFloatingLocalPreview(version.content || item.content || ""),
      activeVersionId: version.id
    });
  }

  function floatingVersionNumber(item, mediaType = "text", versionId = "") {
    const versions = floatingEmbeddedVersions(item);
    if (!versions.length || mediaType === "image") return 0;
    const activeId = versionId && versions.some((version) => version.id === versionId)
      ? versionId
      : floatingCurrentVersionId(item, mediaType);
    const index = versions.findIndex((version) => version.id === activeId);
    return index >= 0 ? index + 1 : 1;
  }

  function createFloatingLocalPreview(content = "") {
    return String(content || "").replace(/\s+/g, " ").trim().slice(0, 220);
  }

  function floatingVersionBadge(item, mediaType = "text") {
    const versions = floatingEmbeddedVersions(item);
    if (mediaType === "image" || versions.length <= 1) return null;
    const number = floatingVersionNumber(item, mediaType);
    const badge = document.createElement("button");
    badge.type = "button";
    badge.className = "mcp-version-badge";
    badge.dataset.action = "cycle-floating-version";
    badge.dataset.itemId = item.id;
    badge.dataset.mediaType = mediaType;
    badge.textContent = tr("versioning.shortLabel", { number });
    badge.setAttribute("aria-label", tr("versioning.showNextVersion"));
    badge.title = tr("versioning.showNextVersion");
    return badge;
  }

  function cycleFloatingItemVersion(button) {
    const mediaType = button.dataset.mediaType || activeFloatingTab;
    if (mediaType === "image") return;
    const item = mediaType === "dev"
      ? (state.devItems || []).find((current) => current.id === button.dataset.itemId)
      : state.items.find((current) => current.id === button.dataset.itemId);
    const versions = floatingEmbeddedVersions(item);
    if (!item || versions.length <= 1) return;
    const card = button.closest(".mcp-item");
    const activeId = card?.dataset.activeVersionId && versions.some((version) => version.id === card.dataset.activeVersionId)
      ? card.dataset.activeVersionId
      : floatingCurrentVersionId(item, mediaType);
    const currentIndex = Math.max(0, versions.findIndex((version) => version.id === activeId));
    const next = versions[(currentIndex + 1) % versions.length] || versions[0];
    item.activeVersionId = next.id;
    if (card) card.dataset.activeVersionId = next.id;
    button.textContent = tr("versioning.shortLabel", { number: ((currentIndex + 1) % versions.length) + 1 });
    const displayItem = floatingItemDisplayVersion(item, mediaType, next.id);
    const preview = card?.querySelector(".mcp-preview");
    const previewText = card?.querySelector(".mcp-preview-text");
    if (previewText) {
      const fullPreviewText = String(displayItem.content || "").trim()
        ? String(displayItem.content || "")
        : stripGeneratedPreviewEllipsis(displayItem.preview || "");
      previewText.textContent = fullPreviewText;
      if (preview) {
        stopPreviewAutoScroll(preview);
        preview.classList.toggle("is-scrollable", shouldScrollPreview(fullPreviewText));
        preview.style.setProperty("--preview-scroll-offset", `-${Math.min(420, Math.max(92, fullPreviewText.length * 0.42))}px`);
        preview.style.setProperty("--preview-scroll-duration", `${Math.min(12, Math.max(3.4, fullPreviewText.length / 180))}s`);
        preview.dataset.previewLength = String(fullPreviewText.length);
      }
    }
    triggerMicroAnimation(button, "mcp-success-pulse", 260);
  }

  function floatingEmptyMessage(mediaType = "text") {
    const shortcut = captureShortcutLabel();
    if (mediaType === "dev") return tr("dev.emptyFloatingHint", { shortcut });
    if (mediaType === "image") return tr("images.emptyFloatingHint");
    return tr("clipboard.emptyFloatingHint", { shortcut });
  }

  function renderSourceAwareMeta(node, item, parts = [], options = {}) {
    if (!node) return;
    node.replaceChildren();
    const cleanParts = parts.filter(Boolean);
    if (options.showFavoriteIcon) {
      const favoriteIcon = document.createElement("img");
      favoriteIcon.className = "mcp-meta-favorite-icon";
      favoriteIcon.src = chrome.runtime.getURL("assets/icons/favorited.png");
      favoriteIcon.alt = "";
      favoriteIcon.setAttribute("aria-hidden", "true");
      node.appendChild(favoriteIcon);
    }
    cleanParts.slice(0, 1).forEach((part) => {
      const token = document.createElement("span");
      token.textContent = part;
      globalThis.MCP.decorateMetaOverflowToken(token, "category");
      node.appendChild(token);
    });
    if (item?.sourceDomain) {
      const source = document.createElement("span");
      source.className = "source-domain-with-favicon";
      const favicon = globalThis.MCP.createSourceFaviconImage?.(item, "source-favicon mcp-source-favicon");
      if (favicon) source.appendChild(favicon);
      source.append(document.createTextNode(item.sourceDomain));
      globalThis.MCP.decorateMetaOverflowToken(source, "source");
      node.appendChild(source);
    }
    cleanParts.slice(1).forEach((part) => {
      const token = document.createElement("span");
      token.textContent = part;
      globalThis.MCP.decorateMetaOverflowToken(token, "date");
      node.appendChild(token);
    });
  }

  function renderFloatingEmptyState(node, message = "") {
    if (!node) return;
    const parts = String(message || "")
      .split(/(?<=\.)\s+(?=\S)/)
      .filter(Boolean);
    if (parts.length < 2) {
      node.textContent = message;
      return;
    }
    node.replaceChildren(...parts.map((part, index) => {
      const line = document.createElement("span");
      line.textContent = part;
      if (index > 0) line.className = "mcp-empty-help";
      return line;
    }));
  }

  function handleFloatingLauncherPointerDown(event) {
    if (IS_NATIVE_SIDE_PANEL) return;
    if (floatingLauncherDragState || event.isPrimary === false) return;
    const panel = shadowRoot?.querySelector(".mcp-panel");
    if (!panel?.classList.contains("is-minimized")) return;
    const launcherTab = event.target?.closest?.(".mcp-launcher-tab");
    if (!launcherTab && !event.target?.closest?.(".mcp-header")) return;
    if (event.button !== 0) return;
    const computedBottom = Number.parseFloat(getComputedStyle(panel).bottom);
    const geometricBottom = Math.max(0, window.innerHeight - panel.getBoundingClientRect().bottom);
    const startBottom = clampFloatingLauncherBottom(
      floatingLauncherModel.initialized
        ? floatingLauncherModel.bottom
        : Number.isFinite(computedBottom)
          ? computedBottom
          : geometricBottom * currentPageZoomFactor
    );
    const pointerScreenY = launcherPointerScreenY(event);
    floatingLauncherDragState = {
      pointerId: event.pointerId,
      startY: pointerScreenY,
      startBottom,
      latestBottom: startBottom,
      pendingY: pointerScreenY,
      moved: false,
      captureTarget: panel,
      pointerCaptured: false,
      frame: 0,
      deferredSettings: null
    };
    panel.style.setProperty("--launcher-drag-offset-y", "0px");
    window.addEventListener("pointermove", handleFloatingLauncherPointerMove, true);
    window.addEventListener("pointerup", handleFloatingLauncherPointerEnd, true);
    window.addEventListener("pointercancel", handleFloatingLauncherPointerEnd, true);
  }

  function handleFloatingLauncherPointerMove(event) {
    const dragState = floatingLauncherDragState;
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    dragState.pendingY = launcherPointerScreenY(event, dragState.pendingY);
    dragState.moved = dragState.moved || Math.abs(dragState.startY - dragState.pendingY) > 4;
    if (dragState.moved) {
      event.preventDefault();
      dragState.captureTarget?.classList.add("is-launcher-dragging");
      if (!dragState.pointerCaptured) {
        try {
          dragState.captureTarget?.setPointerCapture?.(event.pointerId);
          dragState.pointerCaptured = true;
          dragState.captureTarget?.addEventListener("lostpointercapture", handleFloatingLauncherPointerEnd, true);
        } catch {}
      }
    }
    if (!dragState.frame) {
      dragState.frame = requestAnimationFrame(applyFloatingLauncherDragFrame);
    }
  }

  function applyFloatingLauncherDragFrame() {
    const dragState = floatingLauncherDragState;
    if (!dragState) return;
    dragState.frame = 0;
    const deltaY = dragState.startY - dragState.pendingY;
    dragState.latestBottom = clampFloatingLauncherBottom(dragState.startBottom + deltaY);
    const offsetY = dragState.startBottom - dragState.latestBottom;
    const panel = shadowRoot?.querySelector(".mcp-panel");
    panel?.style.setProperty("--launcher-drag-offset-y", `${offsetY}px`);
  }

  function handleFloatingLauncherPointerEnd(event) {
    if (!floatingLauncherDragState || event.pointerId !== floatingLauncherDragState.pointerId) return;
    const dragState = floatingLauncherDragState;
    if (dragState.frame) cancelAnimationFrame(dragState.frame);
    dragState.pendingY = launcherPointerScreenY(event, dragState.pendingY);
    applyFloatingLauncherDragFrame();
    const panel = shadowRoot?.querySelector(".mcp-panel") || dragState.captureTarget;
    panel?.style.setProperty("--launcher-bottom", `${dragState.latestBottom}px`);
    panel?.style.removeProperty("--launcher-drag-offset-y");
    panel?.classList.remove("is-launcher-dragging");
    floatingLauncherModel.bottom = dragState.latestBottom;
    floatingLauncherDragState = null;
    if (dragState.pointerCaptured) {
      try {
        dragState.captureTarget?.releasePointerCapture?.(event.pointerId);
      } catch {}
    }
    dragState.captureTarget?.removeEventListener("lostpointercapture", handleFloatingLauncherPointerEnd, true);
    window.removeEventListener("pointermove", handleFloatingLauncherPointerMove, true);
    window.removeEventListener("pointerup", handleFloatingLauncherPointerEnd, true);
    window.removeEventListener("pointercancel", handleFloatingLauncherPointerEnd, true);
    if (dragState.moved) {
      markFloatingLauncherDragClickSuppressed();
      commitFloatingLauncherPosition(dragState.latestBottom);
      return;
    }
    if (dragState.deferredSettings) applyFloatingLauncherState(dragState.deferredSettings);
  }

  function handleFloatingLauncherWindowBlur() {
    const dragState = floatingLauncherDragState;
    if (!dragState) return;
    handleFloatingLauncherPointerEnd({
      pointerId: dragState.pointerId,
      launcherScreenY: dragState.pendingY
    });
  }

  function handlePreviewPointerOver(event) {
    const card = event.target?.closest?.(".mcp-panel:not(.is-minimized) .mcp-item");
    if (!card || activePreviewScrollCard === card) return;
    stopActivePreviewScroll();
    activePreviewScrollCard = card;
    card.classList.add("is-preview-hovered");
    const preview = card.querySelector(".mcp-preview");
    const previewText = card.querySelector(".mcp-preview-text");
    startPreviewAutoScroll(preview, previewText);
  }

  function handlePreviewPointerOut(event) {
    const card = event.target?.closest?.(".mcp-panel .mcp-item");
    if (!card) return;
    if (event.relatedTarget && card.contains(event.relatedTarget)) return;
    const elementUnderPointer = shadowRoot?.elementFromPoint?.(event.clientX, event.clientY);
    if (elementUnderPointer && card.contains(elementUnderPointer)) return;
    card.classList.remove("is-preview-hovered");
    stopPreviewAutoScroll(card.querySelector(".mcp-preview"));
    if (activePreviewScrollCard === card) activePreviewScrollCard = null;
  }

  function stopActivePreviewScroll() {
    if (!activePreviewScrollCard) return;
    activePreviewScrollCard.classList.remove("is-preview-hovered");
    stopPreviewAutoScroll(activePreviewScrollCard.querySelector(".mcp-preview"));
    activePreviewScrollCard = null;
  }

  function startPreviewAutoScroll(container, inner) {
    if (!container || !inner) return;
    previewAutoScroller.start(container, inner);
  }

  function stopPreviewAutoScroll(container, reset = true) {
    previewAutoScroller.stop(container, reset);
  }

  function shouldScrollPreview(text = "") {
    const value = String(text || "").trim();
    if (value.length > 90) return true;
    if (value.split(/\r?\n/).length > 5) return true;
    return value.split(/\s+/).length > 16;
  }

  function stripGeneratedPreviewEllipsis(value = "") {
    return String(value || "").replace(/(?:\u2026|\.{3})\s*$/, "").trimEnd();
  }

  function renderImagePanelItems(list, sourceImages, query = "") {
    const images = sourceImages.slice(0, FLOATING_PANEL_ITEM_LIMIT);
    if (!images.length) {
      const empty = document.createElement("p");
      empty.className = "mcp-empty";
      renderFloatingEmptyState(empty, query ? tr("search.noResults") : floatingEmptyMessage("image"));
      list.appendChild(empty);
      return;
    }
    const grid = document.createElement("div");
    grid.className = "mcp-image-grid";
    images.forEach((item) => grid.appendChild(renderImageCard(item)));
    list.appendChild(grid);
  }

  function appendFloatingManagerListButton(list, mediaType = activeFloatingTab) {
    if (!list) return;
    const footer = document.createElement("div");
    footer.className = "mcp-list-manager-footer";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mcp-list-manager-button";
    button.dataset.action = "open-manager-tab";
    button.dataset.mediaType = mediaType;
    button.setAttribute("aria-label", tr("ui.manager"));
    button.title = tr("ui.manager");
    button.textContent = "\u2197";
    footer.appendChild(button);
    list.appendChild(footer);
  }

  async function requestManagerOpen(mediaType = activeFloatingTab) {
    const resolvedMediaType = mediaType || activeFloatingTab || "text";
    const response = await safeRuntimeMessage({
      type: MESSAGE_TYPES.OPEN_MANAGER,
      mediaType: resolvedMediaType
    }).catch(() => null);
    if (response?.ok && response.data?.opened !== false) return true;
    const params = new URLSearchParams();
    if (resolvedMediaType) params.set("mediaType", resolvedMediaType);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    window.open(chrome.runtime.getURL(`sidepanel/sidepanel.html${suffix}`), "_blank", "noopener");
    return false;
  }

  async function requestNativeSidePanelOpen(mediaType = activeFloatingTab, view = "") {
    const resolvedMediaType = normalizeFloatingPanelTab(mediaType || activeFloatingTab || "text");
    const response = await safeRuntimeMessage({
      type: MESSAGE_TYPES.OPEN_NATIVE_SIDE_PANEL,
      mediaType: resolvedMediaType,
      view: view === "tools" ? "tools" : ""
    }).catch(() => null);
    return Boolean(response?.ok ? response.data?.opened !== false : response?.opened);
  }

  async function requestNativeSidePanelToggle(mediaType = activeFloatingTab) {
    const resolvedMediaType = normalizeFloatingPanelTab(mediaType || activeFloatingTab || "text");
    const response = await safeRuntimeMessage({
      type: MESSAGE_TYPES.TOGGLE_NATIVE_SIDE_PANEL,
      mediaType: resolvedMediaType
    }).catch(() => null);
    return Boolean(response?.ok);
  }

  async function requestToolsOverlay() {
    const response = await requestForegroundPageSurface(MESSAGE_TYPES.OPEN_TOOLS_OVERLAY);
    return Boolean(response?.ok && response.data?.opened !== false);
  }

  function requestForegroundPageSurface(type, payload = {}) {
    const message = IS_NATIVE_SIDE_PANEL
      ? Object.assign({}, payload, {
          type: MESSAGE_TYPES.OPEN_FOREGROUND_SURFACE,
          surfaceType: type,
          fromNativeSidePanel: true
        })
      : Object.assign({}, payload, { type });
    return safeRuntimeMessage(message).catch(() => null);
  }

  function renderImageCard(item) {
    const card = document.createElement("article");
    card.className = `mcp-image-card ${item.isPinned ? "is-pinned" : ""}`;
    card.dataset.itemId = item.id;
    card.dataset.mediaType = "image";
    const image = document.createElement("img");
    image.src = item.thumbnailUrl || item.imageUrl;
    image.alt = item.altText || item.title || tr("images.image");
    image.loading = "lazy";
    image.decoding = "async";
    image.fetchPriority = "low";
    bindStoredImageFallback(image, item);
    const imageCopyButton = document.createElement("button");
    imageCopyButton.type = "button";
    imageCopyButton.className = "mcp-image-copy-area";
    imageCopyButton.dataset.action = "copy-image";
    imageCopyButton.dataset.itemId = item.id;
    imageCopyButton.setAttribute("aria-label", tr("common.useCapture"));
    imageCopyButton.title = tr("common.useCapture");
    imageCopyButton.appendChild(image);
    if (item.isScreenshot) card.appendChild(screenBadge());
    const overlayActions = document.createElement("div");
    overlayActions.className = "mcp-image-overlay-actions";
    overlayActions.append(
      iconAction("image-info", item.id, "", tr("images.info")),
      iconAction("download-image", item.id, "save_icon.png", tr("images.download")),
      iconAction("toggle-image-favorite", item.id, item.isFavorite ? "favorited.png" : "not_yet_favorited.png", item.isFavorite ? tr("common.favoriteRemove") : tr("common.favoriteAdd"), item.isFavorite, { forceDarkIcon: true }),
      iconAction("toggle-image-pin", item.id, item.isPinned ? "go_unpin.png" : "go_pin.png", item.isPinned ? tr("common.unpin") : tr("common.pin"), item.isPinned, { forceDarkIcon: true }),
      iconAction("delete-image", item.id, "erase.png", tr("common.delete"), false, { forceDarkIcon: true })
    );
    const meta = document.createElement("div");
    meta.className = "mcp-image-meta";
    renderSourceAwareMeta(meta, item, [
      imageCategoryPath(item),
      globalThis.MCP.formatLocalizedDate(item.createdAt, lang())
    ], { showFavoriteIcon: item.isFavorite });
    const actions = document.createElement("div");
    actions.className = "mcp-image-actions";
    actions.append(
      iconAction("copy-image", item.id, "", tr("common.useCapture")),
      iconAction("classify-image", item.id, "", tr("categories.classify")),
      iconAction("open-image-source", item.id, "reverse.png", tr("source.open"))
    );
    card.append(imageCopyButton, overlayActions, meta, actions);
    return card;
  }

  function screenBadge() {
    const badge = document.createElement("span");
    badge.className = "mcp-screen-badge";
    badge.textContent = tr("images.screenshot");
    return badge;
  }

  function iconAction(action, itemId, iconName, label, active = false, options = {}) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mcp-mini-action ${active ? "is-active" : ""}`;
    button.dataset.action = action;
    button.dataset.itemId = itemId;
    button.title = label;
    button.setAttribute("aria-label", label);
    if (action === "copy-image") decorateUseCaptureButton(button);
    else if (iconName) button.appendChild(iconImage(iconName, label, options));
    else button.textContent = action === "image-info" ? "i" : action === "download-image" ? "\u21e9" : label;
    return button;
  }

  function applyPanelVisibility() {
    if (!shadowRoot) return;
    const panel = shadowRoot.querySelector(".mcp-panel");
    if (!panel) return;
    panel.hidden = IS_NATIVE_SIDE_PANEL ? false : !currentDisplayAllowed;
    const screenshotButton = shadowRoot.querySelector("[data-action='capture-full-page']");
    if (screenshotButton) screenshotButton.hidden = state.settings?.showScreenshotFloatingButton === false;
  }

  function revealFloatingPanel(options = {}) {
    if (IS_WEB_LAUNCHER) {
      const mediaType = normalizeFloatingPanelTab(options.mediaType || activeFloatingTab);
      if (options.afterCopy && options.itemId) {
        scheduleLauncherCaptureArrival(options.itemId, mediaType, options.captureEffect || "", options.captureRequestId || "");
      }
      // The capture preference controls opening a closed native side panel,
      // never the realtime tab focus of a panel that is already open. The
      // native panel receives ITEM/DEV/IMAGE_* broadcasts independently and
      // switches to the captured media type in applyRealtimeCaptureMessage().
      if (options.afterCopy && !shouldRevealFloatingPanelAfterCapture()) return;
      runSafeAsync(() => requestNativeSidePanelOpen(mediaType));
      return;
    }
    const panel = shadowRoot?.querySelector(".mcp-panel");
    if (!panel) return;
    if (!currentDisplayAllowed) return;
    if (isFloatingPanelManualCloseGuardActive() && options.force !== true) return;
    if (options.force === true) clearFloatingPanelManualCloseGuard();
    const arrivalMediaType = options.mediaType || activeFloatingTab;
    const arrivalEffect = options.captureEffect || ((arrivalMediaType === "text" || arrivalMediaType === "dev") ? "text-simple" : "");
    const canAnimateCapture = options.afterCopy
      && options.itemId
      && isArrivalEffectAllowed(arrivalEffect, arrivalMediaType);
    panel.classList.remove("is-minimized");
    state.settings = Object.assign({}, state.settings || {}, { floatingPanelOpen: true });
    runSafeAsync(() => setFloatingPanelOpen(true));
    updateFloatingBrandProBadge();
    lastFloatingPanelRevealAt = Date.now();
    if (canAnimateCapture) {
      animateFloatingLauncher();
      scheduleNewCaptureArrival(options.itemId, arrivalMediaType, arrivalEffect);
    }
    if (IS_NATIVE_SIDE_PANEL) applyNativeSidePanelMode();
  }

  function bindStoredImageFallback(image, item) {
    if (!image || !item?.id || image.dataset.storedFallbackBound === "true") return;
    image.dataset.storedFallbackBound = "true";
    image.addEventListener("error", async () => {
      if (image.dataset.storedFallbackTried === "true") return;
      image.dataset.storedFallbackTried = "true";
      const response = await safeRuntimeMessage({
        type: MESSAGE_TYPES.FETCH_IMAGE_AS_DATA_URL,
        itemId: item.id,
        url: item.imageUrl || ""
      });
      if (response?.ok && response.data?.dataUrl) image.src = response.data.dataUrl;
    });
  }

  function scheduleLauncherCaptureArrival(itemId, mediaType = activeFloatingTab, effect = "", captureRequestId = "") {
    if (!itemId || !isArrivalEffectAllowed(effect, mediaType) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    pruneImmediateCaptureAnimationIds();
    if (captureRequestId && immediateCaptureAnimationIds.has(captureRequestId)) return;
    const immediate = lastImmediateLauncherArrival;
    const sameMediaFamily = immediate?.mediaType === mediaType
      || (["text", "dev"].includes(immediate?.mediaType) && ["text", "dev"].includes(mediaType));
    if (immediate && sameMediaFamily && immediate.effect === effect && Date.now() - immediate.time < 2200) return;
    const animationKey = `launcher:${mediaType}:${itemId}:${effect}`;
    const previous = recentCaptureArrivalAnimations.get(animationKey) || 0;
    if (Date.now() - previous < 2400) return;
    if (pendingCaptureArrivalAnimations.has(animationKey)) return;
    pendingCaptureArrivalAnimations.add(animationKey);
    const attempts = [80, 180, 320, 520, 780, 1120];
    let applied = false;
    attempts.forEach((delay) => {
      window.setTimeout(() => {
        if (applied) return;
        const target = findLauncherCaptureTarget();
        if (!target) return;
        applied = true;
        pendingCaptureArrivalAnimations.delete(animationKey);
        recentCaptureArrivalAnimations.set(animationKey, Date.now());
        window.setTimeout(() => recentCaptureArrivalAnimations.delete(animationKey), 3200);
        const source = resolveCaptureArrivalSource(effect, mediaType);
        playCaptureArrivalGhost(target, mediaType, source, effect).then(() => {
          triggerLauncherCaptureGlow(findLauncherCaptureTarget() || target);
        });
      }, delay);
    });
    window.setTimeout(() => {
      if (!applied) pendingCaptureArrivalAnimations.delete(animationKey);
    }, Math.max(...attempts) + 250);
  }

  function startImmediateLauncherCaptureArrival(mediaType = "text", effect = "", content = "", captureRequestId = "") {
    if (!IS_WEB_LAUNCHER || !isArrivalEffectAllowed(effect, mediaType) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const settings = state.settings || {};
    if (settings.privateMode) return;
    if (globalThis.MCP?.isDomainExcluded?.(location.hostname, settings.excludedDomains, location.href)) return;
    const collection = mediaType === "image" ? state.imageItems : mediaType === "dev" ? state.devItems : state.items;
    if (globalThis.MCP?.canCreateCapture && !globalThis.MCP.canCreateCapture(mediaType, settings, collection || [])) return;
    const target = findLauncherCaptureTarget();
    if (!target) return;
    const source = resolveCaptureArrivalSource(effect, mediaType) || {};
    if (!source.content && content) source.content = String(content);
    lastImmediateLauncherArrival = { mediaType, effect, time: Date.now() };
    if (captureRequestId) immediateCaptureAnimationIds.set(captureRequestId, Date.now());
    playCaptureArrivalGhost(target, mediaType, source, effect).then(() => {
      triggerLauncherCaptureGlow(findLauncherCaptureTarget() || target);
    });
  }

  function pruneImmediateCaptureAnimationIds() {
    const cutoff = Date.now() - 60000;
    immediateCaptureAnimationIds.forEach((timestamp, captureRequestId) => {
      if (timestamp < cutoff) immediateCaptureAnimationIds.delete(captureRequestId);
    });
  }

  function findLauncherCaptureTarget() {
    const panel = shadowRoot?.querySelector(".mcp-panel");
    if (!panel || !panel.classList.contains("is-minimized") || panel.hidden) return null;
    if (panel.classList.contains("is-launcher-collapsed")) {
      return shadowRoot.querySelector(".mcp-launcher-tab[data-action='expand-launcher']")
        || shadowRoot.querySelector(".mcp-launcher-tab");
    }
    return shadowRoot.querySelector(".mcp-brand[data-action='toggle']")
      || shadowRoot.querySelector(".mcp-header")
      || panel;
  }

  function triggerLauncherCaptureGlow(target) {
    if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    target.classList.remove("mcp-launcher-capture-glow");
    void target.offsetWidth;
    target.classList.add("mcp-launcher-capture-glow");
    window.setTimeout(() => target.classList.remove("mcp-launcher-capture-glow"), 780);
  }

  function scheduleNewCaptureArrival(itemId, mediaType = activeFloatingTab, effect = "") {
    if (!itemId || !isArrivalEffectAllowed(effect, mediaType) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animationKey = `${mediaType}:${itemId}:${effect}`;
    const previous = recentCaptureArrivalAnimations.get(animationKey) || 0;
    if (Date.now() - previous < 2400) return;
    if (pendingCaptureArrivalAnimations.has(animationKey)) return;
    pendingCaptureArrivalAnimations.add(animationKey);
    const attempts = mediaType === "image"
      ? [180, 360, 620, 940, 1320, 1780, 2380]
      : [300, 560, 900, 1280];
    let applied = false;
    attempts.forEach((delay) => {
      window.setTimeout(() => {
        if (applied) return;
        const card = findFloatingItemCard(itemId, mediaType);
        if (!card) return;
        applied = true;
        pendingCaptureArrivalAnimations.delete(animationKey);
        recentCaptureArrivalAnimations.set(animationKey, Date.now());
        window.setTimeout(() => recentCaptureArrivalAnimations.delete(animationKey), 3200);
        card.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: "smooth" });
        window.setTimeout(() => {
          const currentCard = findFloatingItemCard(itemId, mediaType) || card;
          const source = resolveCaptureArrivalSource(effect, mediaType);
          playCaptureArrivalGhost(currentCard, mediaType, source, effect).then(() => {
            triggerNewCaptureShine(findFloatingItemCard(itemId, mediaType) || currentCard);
          });
        }, mediaType === "image" ? 90 : 70);
      }, delay);
    });
    window.setTimeout(() => {
      if (!applied) pendingCaptureArrivalAnimations.delete(animationKey);
    }, Math.max(...attempts) + 250);
  }

  function isArrivalEffectAllowed(effect = "", mediaType = activeFloatingTab) {
    if ((mediaType === "text" || mediaType === "dev") && effect === "text-simple") return true;
    if (mediaType === "image" && effect === "image-context") return true;
    if (mediaType === "image" && effect === "fullpage-screenshot") return true;
    if (mediaType === "image" && effect === "screenshot") return true;
    return false;
  }

  function resolveCaptureArrivalSource(effect = "", mediaType = activeFloatingTab) {
    const pending = pendingCaptureArrivalSource;
    if (pending && pending.effect === effect && pending.mediaType === mediaType && Date.now() - pending.time < 12000) {
      pendingCaptureArrivalSource = null;
      if (mediaType === "image" && (effect === "fullpage-screenshot" || effect === "screenshot")) {
        return Object.assign({}, pending, { rect: screenCenterCaptureRect() });
      }
      return pending;
    }
    if (effect === "text-simple" && lastContextSelection && Date.now() - lastContextSelection.time < 16000) {
      return { effect, mediaType, rect: lastContextSelection.sourceRect || null, content: lastContextSelection.text || "" };
    }
    if (effect === "image-context" && lastContextImage && Date.now() - lastContextImage.time < 16000) {
      return { effect, mediaType, rect: lastContextImage.sourceRect || null, content: lastContextImage.payload?.thumbnailUrl || lastContextImage.payload?.imageUrl || "" };
    }
    if (mediaType === "image" && (effect === "fullpage-screenshot" || effect === "screenshot")) {
      return { effect, mediaType, rect: screenCenterCaptureRect(), content: pending?.content || "" };
    }
    return { effect, mediaType, rect: null, content: "" };
  }

  function triggerNewCaptureShine(card) {
    if (!card) return;
    ensureCaptureArrivalGhostStyle();
    card.querySelectorAll(":scope > .ucp-capture-shine-layer").forEach((node) => node.remove());
    const layer = document.createElement("span");
    layer.className = "ucp-capture-shine-layer";
    layer.setAttribute("aria-hidden", "true");
    const accent = state.settings?.accentColor || "#e50914";
    layer.style.setProperty("--ucp-arrival-accent", accent);
    Object.assign(layer.style, {
      position: "absolute",
      inset: "-34% -72%",
      zIndex: "30",
      pointerEvents: "none",
      borderRadius: "inherit",
      opacity: "0",
      background: [
        `radial-gradient(circle at 18% 50%, color-mix(in srgb, ${accent} 72%, #fff 26%), transparent 13%)`,
        `linear-gradient(105deg, transparent 28%, rgba(255,255,255,.16) 39%, color-mix(in srgb, ${accent} 70%, #fff 26%) 48%, rgba(255,255,255,.22) 57%, transparent 72%)`
      ].join(", "),
      mixBlendMode: "screen",
      filter: "blur(.2px)",
      transform: "translateX(-56%) skewX(-16deg) scale(.98)",
      willChange: "transform, opacity"
    });
    card.appendChild(layer);
    card.classList.remove("mcp-new-capture-shine");
    void card.offsetWidth;
    card.classList.add("mcp-new-capture-shine");
    const sweep = layer.animate([
      { opacity: 0, transform: "translateX(-56%) skewX(-16deg) scale(.98)" },
      { opacity: 0.98, transform: "translateX(-28%) skewX(-16deg) scale(1)", offset: 0.16 },
      { opacity: 0.88, transform: "translateX(14%) skewX(-16deg) scale(1.02)", offset: 0.64 },
      { opacity: 0, transform: "translateX(56%) skewX(-16deg) scale(1.02)" }
    ], {
      duration: 1180,
      easing: "cubic-bezier(.16, 1, .3, 1)",
      fill: "forwards"
    });
    sweep.onfinish = () => layer.remove();
    sweep.oncancel = sweep.onfinish;
    window.setTimeout(() => {
      card.classList.remove("mcp-new-capture-shine");
      layer.remove();
    }, 1800);
  }

  function playCaptureArrivalGhost(card, mediaType, source = {}, effect = "") {
    return new Promise((resolve) => {
      ensureCaptureArrivalGhostStyle();
      const targetRect = card.getBoundingClientRect();
      const sourceRect = (mediaType === "image" && (effect === "fullpage-screenshot" || effect === "screenshot"))
        ? screenCenterCaptureRect()
        : source?.rect || {
        left: Math.max(16, window.innerWidth - 76),
        top: Math.max(16, window.innerHeight * 0.42),
        width: 42,
        height: 24
      };
      const startX = sourceRect.left + sourceRect.width / 2;
      const startY = sourceRect.top + sourceRect.height / 2;
      const endX = targetRect.left + (targetRect.width < 48 ? targetRect.width / 2 : Math.min(Math.max(targetRect.width * 0.5, 22), targetRect.width - 18));
      const endY = targetRect.top + (targetRect.height < 48 ? targetRect.height / 2 : Math.min(Math.max(targetRect.height * 0.5, 22), targetRect.height - 18));
      const ghost = document.createElement("div");
      ghost.className = `ucp-capture-arrival-ghost ${mediaType === "image" ? "is-image" : "is-text"} ${(effect === "fullpage-screenshot" || effect === "screenshot") ? "is-screenshot" : ""}`;
      ghost.style.setProperty("--ucp-arrival-accent", state.settings?.accentColor || "#e50914");
      ghost.style.left = `${startX}px`;
      ghost.style.top = `${startY}px`;
      if (mediaType === "image" && effect === "image-context" && /^data:image\/|^https?:\/\//i.test(String(source?.content || ""))) {
        const image = document.createElement("img");
        image.src = source.content;
        image.alt = "";
        ghost.appendChild(image);
      } else {
        const label = document.createElement("span");
        const text = String(source?.content || "").replace(/\s+/g, " ").trim();
        label.textContent = text ? text.slice(0, 46) : "Tt";
        ghost.appendChild(label);
      }
      document.documentElement.appendChild(ghost);
      const dx = endX - startX;
      const dy = endY - startY;
      const midX = dx * 0.48;
      const midY = dy * 0.36 - Math.min(70, Math.max(18, Math.abs(dx) * 0.08));
      const animation = ghost.animate([
        { transform: "translate(-50%, -50%) scale(0.74)", opacity: 0, filter: "blur(5px) saturate(1.4)" },
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0.96, filter: "blur(0px) saturate(1.8)", offset: 0.14 },
        { transform: `translate(calc(-50% + ${midX}px), calc(-50% + ${midY}px)) scale(0.92)`, opacity: 0.88, filter: "blur(0.4px) saturate(1.9)", offset: 0.62 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.34)`, opacity: 0, filter: "blur(7px) saturate(2.1)" }
      ], {
        duration: 480,
        easing: "cubic-bezier(.16, 1, .3, 1)",
        fill: "forwards"
      });
      animation.onfinish = () => {
        ghost.remove();
        resolve();
      };
      animation.oncancel = animation.onfinish;
    });
  }

  function ensureCaptureArrivalGhostStyle() {
    if (document.getElementById("ucp-capture-arrival-style")) return;
    const style = document.createElement("style");
    style.id = "ucp-capture-arrival-style";
    style.textContent = `
      .ucp-capture-arrival-ghost {
        position: fixed;
        z-index: 2147483647;
        display: inline-grid;
        place-items: center;
        max-width: min(260px, 48vw);
        min-width: 58px;
        height: 34px;
        padding: 0 13px;
        border-radius: 999px;
        color: #fff;
        background:
          radial-gradient(circle at 34% 28%, rgba(255,255,255,.92), rgba(255,255,255,.12) 22%, transparent 34%),
          radial-gradient(circle at 64% 60%, color-mix(in srgb, var(--ucp-arrival-accent, #e50914) 96%, #fff 8%), color-mix(in srgb, var(--ucp-arrival-accent, #e50914) 42%, transparent) 48%, transparent 72%),
          linear-gradient(135deg, color-mix(in srgb, var(--ucp-arrival-accent, #e50914) 76%, #fff 24%), color-mix(in srgb, var(--ucp-arrival-accent, #e50914) 62%, #111 18%));
        box-shadow:
          0 0 18px color-mix(in srgb, var(--ucp-arrival-accent, #e50914) 80%, transparent),
          0 0 44px color-mix(in srgb, var(--ucp-arrival-accent, #e50914) 54%, transparent),
          0 18px 42px rgba(0,0,0,.28);
        font: 900 13px/1.1 Inter, Segoe UI, system-ui, sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
        opacity: .98;
        transform: translate(-50%, -50%) scale(.74);
        will-change: transform, opacity, filter;
      }
      .ucp-capture-arrival-ghost::before,
      .ucp-capture-arrival-ghost::after {
        content: "";
        position: absolute;
        inset: -16px -28px;
        border-radius: inherit;
        pointer-events: none;
      }
      .ucp-capture-arrival-ghost::before {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,.72), transparent);
        opacity: .72;
        transform: rotate(-16deg) translateX(-18%);
        mix-blend-mode: screen;
      }
      .ucp-capture-arrival-ghost::after {
        background: radial-gradient(circle, color-mix(in srgb, var(--ucp-arrival-accent, #e50914) 70%, #fff 20%), transparent 62%);
        filter: blur(10px);
        opacity: .78;
        z-index: -1;
      }
      .ucp-capture-arrival-ghost.is-image {
        width: 74px;
        height: 52px;
        min-width: 74px;
        padding: 4px;
        border-radius: 17px;
      }
      .ucp-capture-arrival-ghost.is-screenshot {
        width: 70px;
        height: 70px;
        min-width: 70px;
        padding: 0;
        border-radius: 999px;
      }
      .ucp-capture-arrival-ghost img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
        display: block;
      }
      .ucp-capture-arrival-ghost span {
        display: block;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ucp-capture-shine-layer {
        position: absolute;
        inset: -34% -72%;
        z-index: 30;
        pointer-events: none;
        border-radius: inherit;
        opacity: 0;
        background:
          radial-gradient(circle at 18% 50%, color-mix(in srgb, var(--ucp-arrival-accent, #e50914) 72%, #fff 26%), transparent 13%),
          linear-gradient(105deg, transparent 28%, rgba(255,255,255,.16) 39%, color-mix(in srgb, var(--ucp-arrival-accent, #e50914) 70%, #fff 26%) 48%, rgba(255,255,255,.22) 57%, transparent 72%);
        mix-blend-mode: screen;
        filter: blur(.2px);
        animation: ucpCaptureCardSpectralShine 1120ms cubic-bezier(.16, 1, .3, 1) 1 both;
      }
      @keyframes ucpCaptureCardSpectralShine {
        0% { opacity: 0; transform: translateX(-54%) skewX(-16deg) scale(.98); }
        15% { opacity: .98; }
        58% { opacity: .86; }
        100% { opacity: 0; transform: translateX(54%) skewX(-16deg) scale(1.02); }
      }
    `;
    document.documentElement.appendChild(style);
  }

  function findFloatingItemCard(itemId, mediaType = activeFloatingTab) {
    const selector = mediaType === "image" ? ".mcp-image-card" : ".mcp-item";
    const id = String(itemId);
    return [...(shadowRoot?.querySelectorAll(selector) || [])].find((card) => card.dataset.itemId === id) || null;
  }

  function animateFloatingLauncher() {
    const panel = shadowRoot?.querySelector(".mcp-panel");
    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    panel.classList.remove("mcp-launcher-pulse");
    void panel.offsetWidth;
    panel.classList.add("mcp-launcher-pulse");
    window.setTimeout(() => panel.classList.remove("mcp-launcher-pulse"), 620);
  }

  async function handlePanelClick(event) {
    const floatingMenu = shadowRoot?.querySelector("[data-role='floating-menu']");
    if (floatingMenu && !floatingMenu.hidden && !event.target.closest("[data-role='floating-menu']") && !event.target.closest("[data-action='open-floating-menu']")) {
      closeFloatingMenu();
    }
    const action = event.target.closest("[data-action]")?.dataset.action;
    const actionTarget = event.target.closest("[data-action]");
    if (IS_WELCOME_FLOATING_PREVIEW && action && !["set-floating-tab", "cycle-floating-version"].includes(action)) {
      event.preventDefault();
      event.stopPropagation();
      triggerMicroAnimation(actionTarget);
      return;
    }
    if (IS_WELCOME_FLOATING_PREVIEW && !action && event.target.closest(".mcp-item, .mcp-image-card")) {
      event.preventDefault();
      event.stopPropagation();
      triggerMicroAnimation(event.target.closest(".mcp-item, .mcp-image-card"));
      return;
    }
    if (shouldSuppressFloatingLauncherClick(action)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    const copyButton = event.target.closest("[data-copy-item-id]");
    if (IS_WELCOME_FLOATING_PREVIEW && copyButton) {
      event.preventDefault();
      event.stopPropagation();
      triggerMicroAnimation(copyButton.closest(".mcp-item") || copyButton);
      return;
    }
    const editorToggleButton = event.target.closest("[data-editor-toggle-category-id]");
    if (editorToggleButton && editingItem) {
      const categoryId = editorToggleButton.dataset.editorToggleCategoryId;
      const previousScroll = shadowRoot.querySelector("[data-role='editor-category-tree']")?.scrollTop || 0;
      if (editorExpandedCategories.has(categoryId)) editorExpandedCategories.delete(categoryId);
      else editorExpandedCategories.add(categoryId);
      triggerMicroAnimation(editorToggleButton);
      renderEditorCategories(editorCategorySelection);
      requestAnimationFrame(() => {
        const tree = shadowRoot.querySelector("[data-role='editor-category-tree']");
        if (tree) tree.scrollTop = previousScroll;
      });
      return;
    }
    const editorCategoryButton = event.target.closest("[data-editor-category-id]");
    if (editorCategoryButton && editingItem) {
      editorCategorySelection = editorCategoryButton.dataset.editorCategoryId;
      renderEditorCategories(editorCategorySelection);
      triggerMicroAnimation(editorCategoryButton, "mcp-success-pulse", 440);
      return;
    }
    if (action === "toggle") {
      if (IS_NATIVE_SIDE_PANEL) {
        triggerMicroAnimation(actionTarget);
        return;
      }
      if (IS_WEB_LAUNCHER) {
        runSafeAsync(() => markFloatingEntryPointUsed("floatingLauncherOpenedOnce"));
        actionTarget?.classList.remove("mcp-first-use-bounce");
        triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
        runSafeAsync(() => requestNativeSidePanelToggle(activeFloatingTab));
        return;
      }
      const panel = shadowRoot.querySelector(".mcp-panel");
      runSafeAsync(() => markFloatingEntryPointUsed("floatingLauncherOpenedOnce"));
      actionTarget?.classList.remove("mcp-first-use-bounce");
      const willOpen = panel.classList.contains("is-minimized");
      if (willOpen) clearFloatingPanelManualCloseGuard();
      panel.classList.toggle("is-minimized");
      runSafeAsync(() => setFloatingPanelOpen(!panel.classList.contains("is-minimized")));
      updateFloatingBrandProBadge();
      return;
    }

    if (action === "collapse-launcher") {
      runSafeAsync(() => setFloatingLauncherCollapsed(true));
      return;
    }

    if (action === "expand-launcher") {
      runSafeAsync(() => markFloatingEntryPointUsed("floatingLauncherOpenedOnce"));
      shadowRoot.querySelector(".mcp-brand")?.classList.remove("mcp-first-use-bounce");
      clearFloatingPanelManualCloseGuard();
      runSafeAsync(() => setFloatingLauncherCollapsed(false));
      return;
    }

    if (action === "capture-full-page") {
      if (state.settings?.showScreenshotFloatingButton === false) return;
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      runSafeAsync(() => captureFullPageScreenshot(actionTarget));
      return;
    }

    if (action === "open-sidepanel") {
      runSafeAsync(() => markFloatingEntryPointUsed("managerOpenedOnce"));
      runSafeAsync(() => requestManagerOpen(activeFloatingTab));
      triggerMicroAnimation(actionTarget);
      return;
    }

    if (action === "open-launcher-manager") {
      runSafeAsync(() => markFloatingEntryPointUsed("managerOpenedOnce"));
      runSafeAsync(() => requestManagerOpen(activeFloatingTab));
      triggerMicroAnimation(actionTarget);
      return;
    }

    if (action === "open-manager-tab") {
      runSafeAsync(() => markFloatingEntryPointUsed("managerOpenedOnce"));
      const mediaType = actionTarget.dataset.mediaType || activeFloatingTab;
      runSafeAsync(() => requestManagerOpen(mediaType));
      triggerMicroAnimation(actionTarget);
      return;
    }

    if (action === "open-search") {
      runSafeAsync(() => requestForegroundPageSurface(MESSAGE_TYPES.OPEN_SEARCH_OVERLAY, { mediaType: activeFloatingTab }));
      triggerMicroAnimation(actionTarget);
      return;
    }

    if (action === "open-floating-menu") {
      toggleFloatingMenu(actionTarget);
      return;
    }

    if (action === "open-tools") {
      triggerMicroAnimation(actionTarget);
      runSafeAsync(requestToolsOverlay);
      return;
    }

    if (action === "open-launcher-tools") {
      triggerMicroAnimation(actionTarget);
      runSafeAsync(requestToolsOverlay);
      return;
    }

    if (action === "open-launcher-recent-tool") {
      triggerMicroAnimation(actionTarget);
      runSafeAsync(() => openLauncherRecentTool(actionTarget));
      return;
    }

    if (action === "close-tool-workspace") {
      closeFloatingToolWorkspace();
      return;
    }

    if (action === "open-tool-info") {
      openFloatingToolInfoModal();
      return;
    }

    if (action === "tool-example") return loadFloatingToolExample();
    if (action === "tool-smart") return applyFloatingToolSmartPreset();
    if (action === "tool-swap") return swapFloatingToolInputs();
    if (action === "tool-undo") return restoreFloatingToolHistory(-1);
    if (action === "tool-redo") return restoreFloatingToolHistory(1);
    if (action === "tool-reset") return resetFloatingToolWorkspace();

    if (action === "copy-emoji") {
      copyFloatingEmoji(actionTarget.closest("[data-emoji]")?.dataset.emoji || "");
      return;
    }

    if (action === "copy-special-character") {
      copyFloatingSpecialCharacter(actionTarget.closest("[data-symbol]")?.dataset.symbol || "");
      return;
    }

    if (action === "start-color-pick") {
      startFloatingColorPick();
      return;
    }

    if (action === "start-image-text-capture") {
      startFloatingImageTextCapture();
      return;
    }

    if (action === "search-word-replacer") {
      searchFloatingWordReplacer();
      return;
    }

    if (action === "replace-word-replacer") {
      replaceFloatingWords();
      return;
    }

    if (action === "copy-color-format") {
      copyFloatingColorFormat(actionTarget);
      return;
    }

    if (action === "copy-tool-output") {
      copyFloatingToolOutput();
      return;
    }

    if (action === "use-tool-output") return useFloatingToolOutput();
    if (action === "export-tool-output") return exportFloatingToolOutput();

    if (action === "capture-tool-output") {
      captureFloatingToolOutput();
      return;
    }

    if (action === "floating-menu-about") {
      closeFloatingMenu();
      if (IS_NATIVE_SIDE_PANEL) runSafeAsync(() => requestForegroundPageSurface(MESSAGE_TYPES.SHOW_ABOUT));
      else openFloatingTextModal("popup.aboutTitle", FLOATING_ABOUT_SECTIONS);
      return;
    }

    if (action === "floating-menu-faq") {
      closeFloatingMenu();
      if (IS_NATIVE_SIDE_PANEL) runSafeAsync(() => requestForegroundPageSurface(MESSAGE_TYPES.SHOW_FAQ));
      else openFloatingTextModal("popup.faqTitle", FLOATING_FAQ_KEYS);
      return;
    }

    if (action === "floating-menu-search") {
      closeFloatingMenu();
      triggerMicroAnimation(actionTarget);
      if (IS_NATIVE_SIDE_PANEL) {
        runSafeAsync(() => requestForegroundPageSurface(MESSAGE_TYPES.OPEN_SEARCH_OVERLAY, { mediaType: activeFloatingTab }));
      } else {
        openSearchOverlay(activeFloatingTab);
      }
      return;
    }

    if (action === "floating-menu-settings") {
      closeFloatingMenu();
      triggerMicroAnimation(actionTarget);
      openExtensionSettings();
      return;
    }

    if (action === "floating-menu-privacy") {
      closeFloatingMenu();
      if (IS_NATIVE_SIDE_PANEL) runSafeAsync(() => requestForegroundPageSurface(MESSAGE_TYPES.SHOW_PRIVACY));
      else openFloatingTextModal("popup.privacyTitle", FLOATING_PRIVACY_KEYS);
      return;
    }

    if (action === "floating-menu-pro") {
      closeFloatingMenu();
      if (IS_NATIVE_SIDE_PANEL) {
        runSafeAsync(() => requestForegroundPageSurface(MESSAGE_TYPES.SHOW_PRO_UPGRADE, { reason: "pro" }));
      } else {
        openFloatingProUpgradeModal("pro");
      }
      return;
    }

    if (action === "floating-menu-pro-status") {
      closeFloatingMenu();
      safeRuntimeMessage({
        type: MESSAGE_TYPES.OPEN_OPTIONS,
        section: "license",
        fromNativeSidePanel: IS_NATIVE_SIDE_PANEL
      }).catch(() => {});
      return;
    }

    if (action === "floating-menu-support-developer") {
      closeFloatingMenu();
      window.open(DEVELOPER_SUPPORT_URL, "_blank", "noopener");
      return;
    }

    if (action === "floating-menu-contact") {
      closeFloatingMenu();
      window.location.href = "mailto:contact@arcawand-soft.com?subject=Ultimate%20Clipboard%20Pro";
      return;
    }

    if (action === "close-floating-text-modal") {
      closeFloatingTextModal();
      return;
    }

    if (action === "set-floating-tab") {
      const requestedTab = actionTarget.dataset.tab || "text";
      rememberFloatingPanelScroll(activeFloatingTab);
      activeFloatingTab = normalizeFloatingPanelTab(requestedTab);
      triggerMicroAnimation(actionTarget);
      renderPanel();
      return;
    }

    if (action === "close-panel") {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      if (IS_NATIVE_SIDE_PANEL) {
        triggerMicroAnimation(actionTarget);
        runSafeAsync(() => safeRuntimeMessage({ type: MESSAGE_TYPES.CLOSE_NATIVE_SIDE_PANEL }));
        window.setTimeout(() => {
          try {
            window.close();
          } catch {}
        }, 0);
        return;
      }
      markFloatingPanelManuallyClosed();
      runSafeAsync(() => setFloatingPanelOpen(false));
      updateFloatingBrandProBadge();
      triggerMicroAnimation(actionTarget);
      return;
    }

    if (action === "close-onboarding" || action === "complete-onboarding") {
      triggerMicroAnimation(actionTarget);
      runSafeAsync(() => completeOnboarding());
      return;
    }

    if (action === "select-onboarding-language") {
      const select = shadowRoot?.querySelector("[data-role='onboarding-language']");
      const nextLanguage = actionTarget.dataset.languageOption || "en";
      if (select && select.value !== nextLanguage) {
        select.value = nextLanguage;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      return;
    }

    if (action === "open-onboarding-shortcut") {
      triggerMicroAnimation(actionTarget);
      openOnboardingShortcutDialog();
      return;
    }

    if (action === "close-onboarding-shortcut") {
      triggerMicroAnimation(actionTarget);
      closeOnboardingShortcutDialog();
      return;
    }

    if (action === "save-onboarding-shortcut") {
      triggerMicroAnimation(actionTarget);
      saveOnboardingShortcut();
      return;
    }

    if (action === "reset-onboarding-shortcut") {
      triggerMicroAnimation(actionTarget);
      resetOnboardingShortcutCapture();
      return;
    }

    if (action === "select-onboarding-accent") {
      const accentColor = normalizeHexColor(actionTarget.dataset.accentColor || "#e50914");
      state.settings = Object.assign({}, state.settings, { accentColor });
      syncOnboardingAccentButtons(accentColor);
      applyThemeSettings(state.settings);
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      return;
    }

    if (action === "onboarding-import-backup") {
      triggerMicroAnimation(actionTarget);
      runSafeAsync(async () => {
        if (!globalThis.MCP.readBackupFile) {
          const response = await safeRuntimeMessage({ type: MESSAGE_TYPES.ENSURE_BACKUP_RUNTIME || "MCP_ENSURE_BACKUP_RUNTIME" });
          if (!response?.ok) throw new Error(response?.error || "Backup runtime unavailable.");
        }
        shadowRoot.querySelector("[data-role='onboarding-backup-file']")?.click();
      });
      return;
    }

    if (action === "onboarding-restore-drive") {
      triggerMicroAnimation(actionTarget);
      return;
    }

    if (action === "classify-item") {
      const mediaType = actionTarget.dataset.mediaType || activeFloatingTab;
      const item = mediaType === "dev"
        ? (state.devItems || []).find((current) => current.id === actionTarget.dataset.itemId)
        : state.items.find((current) => current.id === actionTarget.dataset.itemId);
      triggerMicroAnimation(actionTarget);
      if (item) showCategoryChooser(item, mediaType === "dev" ? "dev" : "text");
      return;
    }

    if (action === "cycle-floating-version") {
      cycleFloatingItemVersion(actionTarget);
      return;
    }

    if (action === "toggle-favorite") {
      const mediaType = actionTarget.dataset.mediaType || activeFloatingTab;
      const item = mediaType === "dev"
        ? (state.devItems || []).find((current) => current.id === actionTarget.dataset.itemId)
        : state.items.find((current) => current.id === actionTarget.dataset.itemId);
      if (!item) return;
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      updateTextLikeItemFromContent(mediaType, item.id, { isFavorite: !item.isFavorite }, item.isFavorite ? tr("common.favoriteRemove") : tr("common.favoriteAdd"));
      return;
    }

    if (action === "toggle-image-favorite") {
      const item = state.imageItems.find((current) => current.id === actionTarget.dataset.itemId);
      if (!item) return;
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      updateImageFromContent(item.id, { isFavorite: !item.isFavorite }, item.isFavorite ? tr("common.favoriteRemove") : tr("common.favoriteAdd"));
      return;
    }

    if (action === "toggle-image-pin") {
      const item = state.imageItems.find((current) => current.id === actionTarget.dataset.itemId);
      if (!item) return;
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      updateImageFromContent(item.id, { isPinned: !item.isPinned }, item.isPinned ? tr("common.unpin") : tr("common.pin"));
      return;
    }

    if (action === "delete-image") {
      const item = state.imageItems.find((current) => current.id === actionTarget.dataset.itemId);
      if (!item) return;
      clearImageCaptureDedupe();
      triggerMicroAnimation(actionTarget);
      deleteImageWithConfirm(item);
      return;
    }

    if (action === "classify-image") {
      const item = state.imageItems.find((current) => current.id === actionTarget.dataset.itemId);
      triggerMicroAnimation(actionTarget);
      if (item) showCategoryChooser(item, "image");
      return;
    }

    if (action === "image-info") {
      const item = state.imageItems.find((current) => current.id === actionTarget.dataset.itemId);
      triggerMicroAnimation(actionTarget);
      if (item) {
        if (IS_NATIVE_SIDE_PANEL) {
          runSafeAsync(() => requestForegroundPageSurface(MESSAGE_TYPES.OPEN_IMAGE_INFO, { itemId: item.id }));
        } else {
          openImageInfoModal(item);
        }
      }
      return;
    }

    if (action === "download-image") {
      const item = state.imageItems.find((current) => current.id === actionTarget.dataset.itemId);
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      if (item) downloadImageItem(item);
      return;
    }

    if (action === "open-image-source") {
      const item = state.imageItems.find((current) => current.id === actionTarget.dataset.itemId);
      if (!item?.sourceUrl && !item?.imageUrl) {
        showToast(tr("source.missing"));
        return;
      }
      safeRuntimeMessage({ type: MESSAGE_TYPES.OPEN_SOURCE_IMAGE, itemId: item.id }).catch(() => {});
      showToast(tr("source.opening"));
      triggerMicroAnimation(actionTarget);
      return;
    }

    if (action === "copy-image") {
      const item = state.imageItems.find((current) => current.id === actionTarget.dataset.itemId);
      if (!item) return;
      copyImageToClipboard(item, actionTarget.closest(".mcp-image-card"));
      return;
    }

    if (action === "toggle-pin") {
      const mediaType = actionTarget.dataset.mediaType || activeFloatingTab;
      const item = mediaType === "dev"
        ? (state.devItems || []).find((current) => current.id === actionTarget.dataset.itemId)
        : state.items.find((current) => current.id === actionTarget.dataset.itemId);
      if (!item) return;
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      updateTextLikeItemFromContent(mediaType, item.id, { isPinned: !item.isPinned }, item.isPinned ? tr("common.unpin") : tr("common.pin"));
      return;
    }

    if (action === "delete-item") {
      const mediaType = actionTarget.dataset.mediaType || activeFloatingTab;
      const item = mediaType === "dev"
        ? (state.devItems || []).find((current) => current.id === actionTarget.dataset.itemId)
        : state.items.find((current) => current.id === actionTarget.dataset.itemId);
      if (!item) return;
      triggerMicroAnimation(actionTarget);
      deleteActiveFloatingTextLikeCapture(item, mediaType, actionTarget.closest(".mcp-item")?.dataset.activeVersionId || "");
      return;
    }

    if (action === "edit-item") {
      const mediaType = actionTarget.dataset.mediaType || activeFloatingTab;
      const item = mediaType === "dev"
        ? (state.devItems || []).find((current) => current.id === actionTarget.dataset.itemId)
        : state.items.find((current) => current.id === actionTarget.dataset.itemId);
      if (item) openEditor(item, mediaType === "dev" ? "dev" : "text");
      return;
    }

    if (action === "open-source") {
      const mediaType = actionTarget.dataset.mediaType || activeFloatingTab;
      const item = mediaType === "dev"
        ? (state.devItems || []).find((current) => current.id === actionTarget.dataset.itemId)
        : state.items.find((current) => current.id === actionTarget.dataset.itemId);
      if (!item?.sourceUrl) {
        showToast(tr("source.missing"));
        return;
      }
      safeRuntimeMessage({ type: MESSAGE_TYPES.OPEN_SOURCE_ITEM, itemId: item.id }).catch(() => {});
      showToast(tr("source.opening"));
      triggerMicroAnimation(actionTarget);
      return;
    }

    if (action === "close-search") {
      closeSearchOverlay();
      return;
    }

    if (action === "open-search-date-calendar") {
      openOverlaySearchDateCalendar();
      return;
    }

    if (action === "close-search-date-calendar") {
      closeOverlaySearchDateCalendar();
      return;
    }

    if (action === "search-date-prev" || action === "search-date-next") {
      shiftOverlaySearchCalendarMonth(action === "search-date-prev" ? -1 : 1);
      return;
    }

    if (action === "close-image-info") {
      closeImageInfoModal();
      return;
    }

    if (action === "set-search-tab") {
      searchOverlayState.mediaType = actionTarget.dataset.tab || "text";
      searchOverlayState.selectedIndex = 0;
      clearOverlaySearchDateMode();
      triggerMicroAnimation(actionTarget);
      renderSearchOverlay();
      return;
    }

    if (action === "close-editor") {
      closeEditor();
      return;
    }

    if (action === "close-dev-suggestion") {
      triggerMicroAnimation(actionTarget);
      cancelOrCloseDevSuggestion();
      return;
    }

    if (action === "accept-dev-suggestion") {
      triggerMicroAnimation(actionTarget);
      const item = pendingDevSuggestionItem;
      closeDevSuggestion({ keepItem: true });
      if (item) showDevSubcategoryPrompt(item);
      return;
    }

    if (action === "choose-dev-language") {
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      const item = pendingDevSuggestionItem;
      closeDevSuggestion({ keepItem: true });
      if (item) {
        showCategoryChooser(item, "dev");
        showToast(tr("dev.chooseLanguageToast"));
      }
      return;
    }

    if (action === "capture-dev-as-text") {
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      const item = pendingDevSuggestionItem;
      if (item) showDevAsTextPrompt(item);
      return;
    }

    if (action === "capture-dev-text-general") {
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      const item = pendingDevSuggestionItem;
      closeDevSuggestion({ keepItem: true });
      if (item) captureDevSuggestionAsText(item, { classify: false });
      return;
    }

    if (action === "capture-dev-text-classify") {
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      const item = pendingDevSuggestionItem;
      closeDevSuggestion({ keepItem: true });
      if (item) captureDevSuggestionAsText(item, { classify: true });
      return;
    }

    if (action === "keep-dev-root") {
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      const item = pendingDevSuggestionItem;
      finalizeDevSuggestionAtRoot(item);
      return;
    }

    if (action === "choose-dev-subcategory") {
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      const item = pendingDevSuggestionItem;
      closeDevSuggestion({ keepItem: true });
      if (item) {
        chooserExpandedCategories.add(item.categoryId || item.languageId || "dev-general");
        showCategoryChooser(item, "dev");
        const list = shadowRoot?.querySelector("[data-role='category-list']");
        requestAnimationFrame(() => {
          const root = list?.querySelector(`[data-category-id="${CSS.escape(item.categoryId || item.languageId || "dev-general")}"]`);
          root?.scrollIntoView?.({ block: "center", behavior: "smooth" });
        });
      }
      return;
    }

    if (action === "reject-dev-suggestion") {
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      const item = pendingDevSuggestionItem;
      closeDevSuggestion();
      const general = (state.devCategories || []).find((category) => category.id === "dev-general");
      if (item && general) {
        updateDevFromContent(item.id, {
          categoryId: general.id,
          categoryName: general.name,
          languageId: general.id,
          languageName: general.name
        }, tr("dev.savedInGeneral"), { revealAfterSave: true, pendingItem: item });
      }
      return;
    }

    if (action === "add-subcategory") {
      pendingSubcategoryParentId = actionTarget.dataset.parentId;
      if (isGeneralCategoryId(pendingSubcategoryParentId)) return;
      showSubcategoryCreator();
      triggerMicroAnimation(actionTarget);
      return;
    }

    if (action === "confirm-subcategory") {
      createAndAssignSubcategory(shadowRoot.querySelector("[data-role='subcategory-name']"));
      triggerMicroAnimation(actionTarget, "mcp-success-pulse", 440);
      return;
    }

    if (copyButton) {
      const item = state.items.find((current) => current.id === copyButton.dataset.copyItemId);
      const mediaType = copyButton.dataset.mediaType || activeFloatingTab;
      const resolvedItem = mediaType === "dev"
        ? (state.devItems || []).find((current) => current.id === copyButton.dataset.copyItemId)
        : item;
      if (!resolvedItem) return;
      const card = copyButton.closest(".mcp-item");
      await copyFloatingTextLikeItemToClipboard(floatingItemDisplayVersion(resolvedItem, mediaType, card?.dataset.activeVersionId || ""), mediaType, card);
      return;
    }

    const readyPasteCard = event.target.closest(".mcp-panel:not(.is-minimized) .mcp-item[data-item-id], .mcp-panel:not(.is-minimized) .mcp-image-card[data-item-id]");
    if (readyPasteCard && !event.target.closest("button, a, input, textarea, select, [role='button'], [data-action], [data-copy-item-id]")) {
      const mediaType = readyPasteCard.dataset.mediaType || activeFloatingTab;
      if (mediaType === "image") {
        const item = state.imageItems.find((current) => current.id === readyPasteCard.dataset.itemId);
        if (item) copyImageToClipboard(item, readyPasteCard);
      } else {
        const item = mediaType === "dev"
          ? (state.devItems || []).find((current) => current.id === readyPasteCard.dataset.itemId)
          : state.items.find((current) => current.id === readyPasteCard.dataset.itemId);
        if (item) await copyFloatingTextLikeItemToClipboard(floatingItemDisplayVersion(item, mediaType, readyPasteCard.dataset.activeVersionId || ""), mediaType, readyPasteCard);
      }
      return;
    }

    const chooserToggle = event.target.closest("[data-toggle-category-id]");
    if (chooserToggle) {
      event.preventDefault();
      event.stopPropagation();
      const categoryId = chooserToggle.dataset.toggleCategoryId;
      const list = shadowRoot.querySelector("[data-role='category-list']");
      const previousScroll = list?.scrollTop || 0;
      if (chooserExpandedCategories.has(categoryId)) chooserExpandedCategories.delete(categoryId);
      else chooserExpandedCategories.add(categoryId);
      triggerMicroAnimation(chooserToggle);
      renderCategoryChooser();
      restoreChooserScroll(previousScroll, categoryId);
      return;
    }

    const categoryButton = event.target.closest(".mcp-category-choice[data-category-id]");
    if (categoryButton && pendingChooserItem) {
      const categoryId = categoryButton.dataset.categoryId;
      if (categoryId === "favorite") {
        triggerMicroAnimation(categoryButton, "mcp-success-pulse", 440);
        if (pendingChooserType === "image") updateImageFromContent(pendingChooserItem.id, { isFavorite: true }, tr("common.favoriteAdd"));
        else updateTextLikeItemFromContent(pendingChooserType, pendingChooserItem.id, { isFavorite: true }, tr("common.favoriteAdd"));
      } else {
        const category = chooserCategories().find((item) => item.id === categoryId);
        if (category && isTrashCategoryId(category.id)) {
          const item = pendingChooserItem;
          const mediaType = pendingChooserType;
          hideCategoryChooser();
          if (!canUseTrashManagement()) {
            openFloatingProUpgradeModal("trashManagement");
            showToast(tr("pro.trashRequired"));
            return;
          }
          await moveChooserItemToTrashWithConfirm(item, mediaType);
          return;
        }
        if (category) {
          if (isVaultCategoryId(category.id)) {
            if (!canUseVault()) {
              hideCategoryChooser();
              openFloatingProUpgradeModal("vault");
              showToast(tr("pro.vaultRequired"));
              return;
            }
            const unlocked = await ensureVaultUnlocked();
            if (!unlocked) return;
          }
          triggerMicroAnimation(categoryButton, "mcp-success-pulse", 440);
          const updates = {
            categoryId: category.id,
            categoryName: category.name
          };
          const feedback = tr("categories.classifiedIn", { path: categoryPath(category, pendingChooserType) });
          if (pendingChooserType === "image") updateImageFromContent(pendingChooserItem.id, updates, feedback);
          else updateTextLikeItemFromContent(pendingChooserType, pendingChooserItem.id, updates, feedback, { revealAfterSave: pendingChooserType === "dev" });
        }
      }
      hideCategoryChooser();
      return;
    }

    if (event.target.closest("[data-action='close-chooser']")) {
      hideCategoryChooser();
    }
  }

  function toggleFloatingMenu(button) {
    const menu = shadowRoot?.querySelector("[data-role='floating-menu']");
    if (!menu) return;
    triggerMicroAnimation(button);
    renderFloatingMenu();
    const shouldOpen = menu.hidden;
    menu.hidden = !shouldOpen;
    button?.setAttribute("aria-expanded", String(shouldOpen));
  }

  function closeFloatingMenu() {
    const menu = shadowRoot?.querySelector("[data-role='floating-menu']");
    if (menu) menu.hidden = true;
    shadowRoot?.querySelector("[data-role='floating-menu-button']")?.setAttribute("aria-expanded", "false");
  }

  function renderFloatingMenu() {
    const menu = shadowRoot?.querySelector("[data-role='floating-menu']");
    if (!menu) return;
    const isPro = globalThis.MCP.isProPlan ? globalThis.MCP.isProPlan(state.settings) : false;
    const entries = [
      ["floating-menu-about", tr("popup.about")],
      ["floating-menu-faq", tr("popup.faq")],
      ["floating-menu-search", tr("search.advanced")],
      ["floating-menu-settings", tr("ui.options")],
      ["floating-menu-quick-settings", tr("quickSettings.title")],
      ["floating-menu-privacy", tr("popup.privacy")],
      isPro ? ["floating-menu-pro-status", "", "pro-status"] : ["floating-menu-pro", tr("popup.pro"), "pro"],
      ...(isPro ? [["floating-menu-support-developer", tr("popup.supportDeveloper"), "support"]] : []),
      ["floating-menu-contact", tr("popup.contactDeveloper"), "contact"]
    ];
    menu.replaceChildren(...entries.map(([action, label, icon]) => {
      if (action === "floating-menu-quick-settings") {
        return globalThis.MCP.createQuickSettingsMenu({
          classPrefix: "mcp-floating",
          actionAttribute: "action",
          actionValue: action,
          t: tr,
          getSettings: () => state.settings || {},
          persistSetting: async (key, value) => saveSettingsPatch({ [key]: value })
        });
      }
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.action = action;
      button.setAttribute("role", "menuitem");
      if (action === "floating-menu-pro-status") {
        button.className = "mcp-floating-menu-pro-status";
        button.appendChild(createFloatingProLifetimeBadge());
        return button;
      }
      if (icon) button.appendChild(createFloatingMenuIcon(icon));
      const text = document.createElement("span");
      text.textContent = label;
      button.appendChild(text);
      return button;
    }));
  }

  function createFloatingMenuIcon(icon) {
    if (icon === "pro") {
      const img = document.createElement("img");
      img.className = "mcp-floating-menu-icon";
      img.src = chrome.runtime.getURL("assets/icons/pro-icon.png");
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      return img;
    }
    if (icon === "support") {
      const img = document.createElement("img");
      img.className = "mcp-floating-menu-icon";
      img.src = chrome.runtime.getURL("assets/icons/favorited.png");
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      return img;
    }
    const wrap = document.createElement("span");
    wrap.className = "mcp-floating-menu-icon-stack";
    [
      ["mcp-floating-menu-icon mcp-floating-menu-icon-mail-dark", "assets/icons/mail-to-dev-darkmod.png"],
      ["mcp-floating-menu-icon mcp-floating-menu-icon-mail-light", "assets/icons/mail-to-dev-lightmod.png"]
    ].forEach(([className, path]) => {
      const img = document.createElement("img");
      img.className = className;
      img.src = chrome.runtime.getURL(path);
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      wrap.appendChild(img);
    });
    return wrap;
  }

  function createFloatingProLifetimeBadge() {
    const badge = document.createElement("span");
    badge.className = "mcp-floating-menu-pro-lifetime";
    const icon = document.createElement("img");
    icon.src = chrome.runtime.getURL("assets/icons/pro-icon.png");
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "mcp-floating-menu-pro-lifetime-copy";
    const pro = document.createElement("strong");
    pro.textContent = "Pro";
    const lifetimeNode = document.createElement("small");
    const lifetime = tr("pro.lifetime");
    lifetimeNode.textContent = lifetime.charAt(0).toUpperCase() + lifetime.slice(1);
    label.append(pro, lifetimeNode);
    badge.append(icon, label);
    return badge;
  }

  function openFloatingTextModal(titleKey, paragraphKeys) {
    const modal = shadowRoot?.querySelector("[data-role='floating-text-modal']");
    if (!modal) return;
    modal.querySelector("[data-role='floating-text-title']").textContent = tr(titleKey);
    modal.querySelector("[data-role='floating-text-close']").setAttribute("aria-label", tr("common.close"));
    modal.querySelector(".mcp-floating-text-card")?.classList.remove("is-pro-upgrade", "is-capture-limit", "is-tool-help");
    const content = modal.querySelector("[data-role='floating-text-content']");
    content.scrollTop = 0;
    if (titleKey === "popup.faqTitle") {
      content.replaceChildren(createFloatingFaqContent(paragraphKeys));
    } else if (titleKey === "popup.aboutTitle") {
      content.replaceChildren(createFloatingAboutContent(paragraphKeys));
    } else {
      content.replaceChildren(...paragraphKeys.map((key) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = tr(key);
        return paragraph;
      }));
    }
    if (titleKey === "popup.aboutTitle") {
      content.prepend(createFloatingAboutBrandSignature());
    }
    modal.hidden = false;
    requestAnimationFrame(() => {
      content.scrollTop = 0;
    });
  }

  function createFloatingFaqContent(items) {
    const list = document.createElement("div");
    list.className = "mcp-faq-list";
    items.forEach(([questionKey, answerKey], index) => {
      const article = document.createElement("article");
      article.className = "mcp-faq-item";
      const isLicenseWarning = questionKey === "faq.76.q";
      if (isLicenseWarning) article.classList.add("is-license-warning");
      const badge = document.createElement("span");
      badge.className = "mcp-faq-number";
      badge.textContent = isLicenseWarning ? "⚠" : String(index + 1).padStart(2, "0");
      const copy = document.createElement("div");
      copy.className = "mcp-faq-copy";
      const question = document.createElement("h3");
      question.textContent = tr(questionKey);
      const answer = document.createElement("p");
      answer.textContent = tr(answerKey);
      copy.append(question, answer);
      article.append(badge, copy);
      list.appendChild(article);
    });
    return list;
  }

  function createFloatingAboutContent(sections) {
    const wrap = document.createElement("div");
    wrap.className = "mcp-about-content";
    sections.forEach((section) => {
      if (!section?.title || !Array.isArray(section.keys)) return;
      const article = document.createElement("section");
      article.className = "mcp-about-section";
      const heading = document.createElement("h3");
      heading.textContent = tr(section.title);
      const list = document.createElement("ul");
      section.keys.forEach((key) => {
        const item = document.createElement("li");
        item.textContent = tr(key);
        list.appendChild(item);
      });
      article.append(heading, list);
      wrap.appendChild(article);
    });
    return wrap;
  }

  function createFloatingAboutBrandSignature() {
    const signature = document.createElement("div");
    signature.className = "mcp-about-brand";
    const by = document.createElement("span");
    by.textContent = tr("brand.by");
    const logo = document.createElement("img");
    logo.src = chrome.runtime.getURL("assets/icons/Arcawand_Soft_Logo.png");
    logo.alt = "Arcawand Soft";
    wireArcawandLogoLink(logo);
    signature.append(by, logo);
    return signature;
  }

  async function openFloatingProUpgradeModal(context = "pro") {
    closeFloatingTextModal();
    const value = typeof context === "string" ? { reason: context } : (context && typeof context === "object" ? context : {});
    return safeRuntimeMessage({
      type: MESSAGE_TYPES.SHOW_PRO_UPGRADE,
      reason: value.reason || "pro",
      toolId: value.toolId || "",
      toolName: value.toolName || ""
    }).catch(() => null);
  }

  function openFloatingCaptureLimitModal(mediaType = "text", limit = 5) {
    const modal = shadowRoot?.querySelector("[data-role='floating-text-modal']");
    if (!modal) return;
    const isDev = mediaType === "dev" || mediaType === "code";
    const isImage = mediaType === "image";
    const card = modal.querySelector(".mcp-floating-text-card");
    card?.classList.remove("is-pro-upgrade");
    card?.classList.add("is-capture-limit");
    modal.querySelector("[data-role='floating-text-title']").textContent = tr("pro.captureLimitTitle");
    modal.querySelector("[data-role='floating-text-close']").setAttribute("aria-label", tr("common.close"));
    const content = modal.querySelector("[data-role='floating-text-content']");
    const summary = document.createElement("div");
    summary.className = "mcp-capture-limit-summary";
    const iconFrame = document.createElement("div");
    iconFrame.className = "mcp-capture-limit-icon-frame";
    iconFrame.setAttribute("aria-hidden", "true");
    const icon = document.createElement("img");
    icon.className = "mcp-capture-limit-icon";
    icon.src = chrome.runtime.getURL(isImage
      ? "assets/icons/images_icon.png"
      : isDev
        ? "assets/icons/dev.png"
        : "assets/icons/text_icon.png");
    icon.alt = "";
    iconFrame.append(icon);
    const copy = document.createElement("div");
    copy.className = "mcp-capture-limit-copy";
    const message = document.createElement("p");
    message.className = "mcp-capture-limit-message";
    message.textContent = tr(isImage ? "pro.imageLimitReached" : isDev ? "pro.codeLimitReached" : "pro.textLimitReached", { limit });
    const reserved = document.createElement("p");
    reserved.className = "mcp-capture-limit-reserved";
    reserved.textContent = tr("pro.captureLimitProReserved");
    copy.append(message, reserved);
    summary.append(iconFrame, copy);
    const actions = document.createElement("div");
    actions.className = "mcp-pro-actions mcp-capture-limit-actions";
    const more = document.createElement("button");
    more.type = "button";
    more.className = "primary";
    more.textContent = tr("pro.moreInfo");
    more.addEventListener("click", () => openFloatingProUpgradeModal(isImage ? "imageLimit" : isDev ? "codeLimit" : "textLimit"));
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = tr("common.cancel");
    cancel.addEventListener("click", closeFloatingTextModal);
    actions.append(cancel, more);
    content.replaceChildren(summary, actions);
    modal.hidden = false;
  }

  function closeFloatingTextModal() {
    if (restoreFloatingTextModalReturn()) return;
    const modal = shadowRoot?.querySelector("[data-role='floating-text-modal']");
    if (modal) modal.hidden = true;
  }

  function captureFloatingTextModalReturn() {
    const modal = shadowRoot?.querySelector("[data-role='floating-text-modal']");
    if (!modal || modal.hidden) return null;
    const card = modal.querySelector(".mcp-floating-text-card");
    if (card?.classList.contains("is-pro-upgrade")) return null;
    const content = modal.querySelector("[data-role='floating-text-content']");
    return {
      title: modal.querySelector("[data-role='floating-text-title']")?.textContent || "",
      closeLabel: modal.querySelector("[data-role='floating-text-close']")?.getAttribute("aria-label") || "Close",
      cardClassName: card?.className || "mcp-floating-text-card",
      contentNodes: content ? Array.from(content.childNodes) : []
    };
  }

  function restoreFloatingTextModalReturn() {
    const modal = shadowRoot?.querySelector("[data-role='floating-text-modal']");
    if (!floatingTextModalReturn || !modal) return false;
    const restore = floatingTextModalReturn;
    floatingTextModalReturn = null;
    const card = modal.querySelector(".mcp-floating-text-card");
    const title = modal.querySelector("[data-role='floating-text-title']");
    const close = modal.querySelector("[data-role='floating-text-close']");
    const content = modal.querySelector("[data-role='floating-text-content']");
    if (card) card.className = restore.cardClassName;
    if (title) title.textContent = restore.title;
    if (close) close.setAttribute("aria-label", restore.closeLabel);
    if (content) content.replaceChildren(...restore.contentNodes);
    modal.hidden = false;
    return true;
  }

  function openFloatingToolWorkspace(toolId) {
    const tool = globalThis.MCP.getTools(tr).find((item) => item.id === toolId);
    if (!tool) return;
    let modal = shadowRoot.querySelector("[data-role='tool-workspace']");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "mcp-tool-workspace-modal";
      modal.dataset.role = "tool-workspace";
      modal.hidden = true;
      modal.innerHTML = [
        "<div class=\"mcp-search-backdrop\" data-action=\"close-tool-workspace\"></div>",
        "<section class=\"mcp-tool-workspace-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"tool-title\"></strong><div class=\"mcp-tool-head-actions\"><button type=\"button\" class=\"mcp-tool-info-button\" data-action=\"open-tool-info\" aria-label=\"Info\">i</button><button type=\"button\" data-action=\"close-tool-workspace\" aria-label=\"Close\">&times;</button></div></header>",
        "<p data-role=\"tool-description\"></p>",
        "<section class=\"mcp-tool-command-deck\" data-role=\"tool-command-deck\"><div class=\"mcp-tool-command-actions\"><button type=\"button\" data-action=\"tool-example\"></button><button type=\"button\" class=\"is-smart\" data-action=\"tool-smart\"></button><button type=\"button\" data-action=\"tool-swap\"></button><button type=\"button\" data-action=\"tool-undo\" aria-label=\"Undo\">↶</button><button type=\"button\" data-action=\"tool-redo\" aria-label=\"Redo\">↷</button><button type=\"button\" data-action=\"tool-reset\"></button></div></section>",
        "<div class=\"mcp-tool-insights\" data-role=\"tool-insights\"></div>",
        "<div class=\"mcp-tool-options\" data-role=\"tool-options\"></div>",
        "<section class=\"mcp-emoji-browser\" data-role=\"emoji-browser\" hidden><input data-role=\"emoji-search\" type=\"search\"><div class=\"mcp-emoji-grid\" data-role=\"emoji-grid\"></div></section>",
        "<div class=\"mcp-tool-areas\">",
        "<label><span data-role=\"tool-input-label\"></span><textarea data-role=\"tool-input\"></textarea></label>",
        "<label data-role=\"tool-compare-panel\"><span data-role=\"tool-compare-label\"></span><textarea data-role=\"tool-compare-input\"></textarea></label>",
        "<label><span data-role=\"tool-output-label\"></span><textarea data-role=\"tool-output\" readonly></textarea></label>",
        "</div>",
        "<section class=\"mcp-tool-compare-visual\" data-role=\"tool-compare-visual\" hidden>",
        "<header><span data-role=\"compare-legend-remove\"></span><span data-role=\"compare-legend-add\"></span></header>",
        "<div class=\"mcp-tool-compare-visual-grid\">",
        "<article><strong data-role=\"compare-left-title\"></strong><div class=\"mcp-tool-compare-render\" data-role=\"compare-left-render\"></div></article>",
        "<article><strong data-role=\"compare-right-title\"></strong><div class=\"mcp-tool-compare-render\" data-role=\"compare-right-render\"></div></article>",
        "</div>",
        "</section>",
        "<footer><button type=\"button\" class=\"mcp-primary\" data-action=\"copy-tool-output\"></button><button type=\"button\" data-action=\"use-tool-output\"></button><button type=\"button\" data-action=\"export-tool-output\"></button><button type=\"button\" data-action=\"capture-tool-output\"></button><button type=\"button\" data-action=\"close-tool-workspace\"></button></footer>",
        "</section>"
      ].join("");
      shadowRoot.appendChild(modal);
      modal.querySelector("[data-role='tool-input']").addEventListener("input", () => {
        if (modal.dataset.toolId === "variableInjector") {
          updateFloatingWordReplacerHighlight(modal);
          scheduleFloatingToolStateSave(modal);
          return;
        }
        runFloatingTool({ silent: true });
      });
      modal.querySelector("[data-role='tool-compare-input']").addEventListener("input", () => runFloatingTool({ silent: true }));
      modal.querySelector("[data-role='tool-options']").addEventListener("input", (event) => {
        syncFloatingColorFields(modal, event.target);
        if (modal.dataset.toolId === "variableInjector") {
          updateFloatingWordReplacerHighlight(modal);
          scheduleFloatingToolStateSave(modal);
          return;
        }
        runFloatingTool({ silent: true });
      });
      modal.querySelector("[data-role='tool-options']").addEventListener("change", (event) => {
        syncFloatingColorFields(modal, event.target);
        if (modal.dataset.toolId === "variableInjector") {
          updateFloatingWordReplacerHighlight(modal);
          scheduleFloatingToolStateSave(modal);
          return;
        }
        runFloatingTool({ silent: true });
      });
      modal.querySelector("[data-role='emoji-search']").addEventListener("input", () => {
        if (modal.dataset.toolId === "longTextSplitter") renderFloatingSpecialCharacters(modal);
        else renderFloatingEmojiPicker(modal);
        scheduleFloatingToolStateSave(modal);
      });
      modal.querySelector(".mcp-tool-workspace-card").addEventListener("keydown", (event) => {
        if (!(event.ctrlKey || event.metaKey) || event.key !== "Enter") return;
        event.preventDefault();
        runFloatingTool({ silent: false });
      });
    }
    modal.dataset.toolId = tool.id;
    const card = modal.querySelector(".mcp-tool-workspace-card");
    card.dataset.toolLayout = tool.layout || "editor";
    card.dataset.toolId = tool.id;
    modal.querySelector("[data-role='tool-title']").textContent = tool.title;
    modal.querySelector("[data-action='open-tool-info']").setAttribute("aria-label", tr("tools.help.infoButton", { tool: tool.title }));
    modal.querySelector("[data-action='open-tool-info']").title = tr("tools.help.infoButton", { tool: tool.title });
    modal.querySelector("[data-role='tool-description']").textContent = tool.description;
    const exampleButton = modal.querySelector("[data-action='tool-example']");
    exampleButton.textContent = tr("tools.workbench.example");
    exampleButton.hidden = !globalThis.MCP.toolSupportsExample?.(tool.id);
    modal.dataset.exampleSignature = "";
    modal.dataset.exampleIndex = "0";
    const smartButton = modal.querySelector("[data-action='tool-smart']");
    smartButton.textContent = tr("tools.workbench.smart");
    smartButton.hidden = Object.keys(globalThis.MCP.toolSmartPreset?.(tool.id) || {}).length === 0;
    modal.querySelector("[data-action='tool-swap']").textContent = tr("tools.workbench.swap");
    modal.querySelector("[data-action='tool-reset']").textContent = tr("tools.workbench.reset");
    const undoButton = modal.querySelector("[data-action='tool-undo']");
    const redoButton = modal.querySelector("[data-action='tool-redo']");
    const closeButton = modal.querySelector("header [data-action='close-tool-workspace']");
    undoButton.title = tr("tools.workbench.undo");
    undoButton.setAttribute("aria-label", tr("tools.workbench.undo"));
    redoButton.title = tr("tools.workbench.redo");
    redoButton.setAttribute("aria-label", tr("tools.workbench.redo"));
    closeButton.setAttribute("aria-label", tr("common.close"));
    closeButton.title = tr("common.close");
    modal.querySelector("[data-role='tool-input-label']").textContent = tr("tools.input");
    modal.querySelector("[data-role='tool-compare-label']").textContent = tr("tools.options.compareText");
    modal.querySelector("[data-role='tool-output-label']").textContent = tr("tools.output");
    modal.querySelector("[data-role='compare-legend-remove']").textContent = tr("tools.compareLegendRemoved");
    modal.querySelector("[data-role='compare-legend-add']").textContent = tr("tools.compareLegendAdded");
    modal.querySelector("[data-role='compare-left-title']").textContent = tr("tools.compareLeft");
    modal.querySelector("[data-role='compare-right-title']").textContent = tr("tools.compareRight");
    modal.querySelector("[data-action='copy-tool-output']").textContent = tr("tools.copyOutput");
    modal.querySelector("[data-action='use-tool-output']").textContent = tr("tools.workbench.useResult");
    modal.querySelector("[data-action='export-tool-output']").textContent = tr("tools.workbench.export");
    modal.querySelector("[data-action='capture-tool-output']").textContent = tr("tools.captureOutput");
    modal.querySelector("footer [data-action='close-tool-workspace']").textContent = tr("common.close");
    const optionNodes = floatingToolOptionNodes(tool.id);
    const optionsNode = modal.querySelector("[data-role='tool-options']");
    optionsNode.replaceChildren(...optionNodes);
    optionsNode.hidden = optionNodes.length === 0;
    modal.querySelector("[data-role='tool-input']").value = "";
    modal.querySelector("[data-role='tool-compare-input']").value = "";
    const emojiSearch = modal.querySelector("[data-role='emoji-search']");
    if (emojiSearch) emojiSearch.value = "";
    resetFloatingToolWorkspaceMode(modal, tool.id);
    restoreFloatingToolState(modal, tool.id);
    modal.querySelector("[data-role='tool-input']").placeholder = tool.id === "loremGenerator" ? "" : tool.id === "variableInjector" ? tr("tools.wordReplacer.inputPlaceholder") : tr("tools.inputPlaceholder");
    modal.querySelector("[data-role='tool-output']").value = "";
    modal.querySelector("[data-role='tool-insights']").replaceChildren();
    modal.hidden = false;
    modal.querySelector("[data-action='tool-swap']").hidden = tool.id !== "textComparator";
    if (tool.id === "emojiPicker") renderFloatingEmojiPicker(modal);
    else if (tool.id === "longTextSplitter") renderFloatingSpecialCharacters(modal);
    else if (tool.id === "variableInjector") updateFloatingWordReplacerHighlight(modal);
    else runFloatingTool({ silent: true });
    resetFloatingToolHistory(modal);
  }

  function resetFloatingToolWorkspaceMode(modal, toolId) {
    const isComparator = toolId === "textComparator";
    const isDuplicateDetector = toolId === "duplicateDetector";
    const isEmojiPicker = toolId === "emojiPicker";
    const isSpecialCharacters = toolId === "longTextSplitter";
    const isColorPicker = toolId === "colorPicker";
    const isImageText = toolId === "imageText";
    const hasVisual = isComparator || isDuplicateDetector;
    const inputLabel = modal.querySelector("[data-role='tool-input-label']");
    const compareLabel = modal.querySelector("[data-role='tool-compare-label']");
    const comparePanel = modal.querySelector("[data-role='tool-compare-panel']");
    const areas = modal.querySelector(".mcp-tool-areas");
    const outputPanel = modal.querySelector("[data-role='tool-output']")?.closest("label");
    const compareVisual = modal.querySelector("[data-role='tool-compare-visual']");
    const emojiBrowser = modal.querySelector("[data-role='emoji-browser']");
    inputLabel.textContent = isComparator ? tr("tools.compareLeft") : tr("tools.input");
    compareLabel.textContent = isComparator ? tr("tools.compareRight") : tr("tools.options.compareText");
    if (comparePanel) comparePanel.hidden = !isComparator;
    if (areas) areas.hidden = isEmojiPicker || isSpecialCharacters;
    if (outputPanel) outputPanel.hidden = isComparator || isEmojiPicker;
    modal.querySelector("[data-role='tool-input']")?.closest("label")?.toggleAttribute("hidden", isEmojiPicker || isColorPicker || isImageText);
    if (outputPanel && isImageText) outputPanel.querySelector("span").textContent = tr("tools.imageText.extracted");
    if (emojiBrowser) {
      emojiBrowser.hidden = !(isEmojiPicker || isSpecialCharacters);
      const search = emojiBrowser.querySelector("[data-role='emoji-search']");
      if (search) {
        const placeholder = isSpecialCharacters ? tr("tools.specialCharacters.search") : tr("tools.emojiSearch");
        search.placeholder = placeholder;
        search.setAttribute("aria-label", placeholder);
      }
    }
    ["copy-tool-output", "capture-tool-output", "use-tool-output", "export-tool-output"].forEach((actionName) => {
      const button = modal.querySelector(`[data-action='${actionName}']`);
      if (button) button.hidden = isEmojiPicker || isSpecialCharacters;
    });
    const duplicateHighlight = modal.querySelector("[data-role='duplicate-source-highlight']");
    if (duplicateHighlight && !isDuplicateDetector) duplicateHighlight.remove();
    const wordReplacerHighlight = modal.querySelector("[data-role='word-replacer-highlight']");
    if (wordReplacerHighlight && toolId !== "variableInjector") wordReplacerHighlight.remove();
    modal.querySelector("[data-role='tool-input']")?.closest("label")?.classList.toggle("is-word-replacer-source", toolId === "variableInjector");
    if (compareVisual) {
      compareVisual.hidden = !hasVisual;
      const addedLegend = compareVisual.querySelector("[data-role='compare-legend-add']");
      const leftRender = compareVisual.querySelector("[data-role='compare-left-render']");
      if (leftRender) {
        leftRender.contentEditable = "false";
        delete leftRender.dataset.duplicateBound;
        leftRender.removeAttribute("role");
        leftRender.removeAttribute("aria-multiline");
        leftRender.removeAttribute("tabindex");
        leftRender.removeAttribute("data-placeholder");
      }
      if (isDuplicateDetector) {
        compareVisual.querySelector("[data-role='compare-legend-remove']").textContent = tr("tools.duplicateLegend");
        if (addedLegend) addedLegend.hidden = true;
        compareVisual.querySelector("[data-role='compare-left-title']").textContent = tr("tools.input");
        compareVisual.querySelector("[data-role='compare-right-title']").textContent = tr("tools.output");
      } else if (isComparator) {
        compareVisual.querySelector("[data-role='compare-legend-remove']").textContent = tr("tools.compareLegendRemoved");
        if (addedLegend) {
          addedLegend.hidden = false;
          addedLegend.textContent = tr("tools.compareLegendAdded");
        }
        compareVisual.querySelector("[data-role='compare-left-title']").textContent = tr("tools.compareLeft");
        compareVisual.querySelector("[data-role='compare-right-title']").textContent = tr("tools.compareRight");
      }
      if (!hasVisual) {
        compareVisual.querySelector("[data-role='compare-left-render']")?.replaceChildren();
        compareVisual.querySelector("[data-role='compare-right-render']")?.replaceChildren();
      }
    }
  }

  function closeFloatingToolWorkspace() {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (modal) modal.hidden = true;
  }

  function floatingToolSnapshot(modal) {
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

  function resetFloatingToolHistory(modal) {
    floatingToolHistory.set(modal.dataset.toolId, { entries: [floatingToolSnapshot(modal)], index: 0 });
    updateFloatingToolHistoryButtons(modal);
  }

  function recordFloatingToolHistory(modal, immediate = false) {
    if (!modal || modal.hidden || !modal.dataset.toolId) return;
    window.clearTimeout(modal._toolHistoryTimer);
    const commit = () => {
      const state = floatingToolHistory.get(modal.dataset.toolId) || { entries: [], index: -1 };
      const snapshot = floatingToolSnapshot(modal);
      if (state.index >= 0 && JSON.stringify(state.entries[state.index]) === JSON.stringify(snapshot)) return;
      state.entries = state.entries.slice(0, state.index + 1);
      state.entries.push(snapshot);
      if (state.entries.length > 30) state.entries.shift();
      state.index = state.entries.length - 1;
      floatingToolHistory.set(modal.dataset.toolId, state);
      updateFloatingToolHistoryButtons(modal);
    };
    if (immediate) commit();
    else modal._toolHistoryTimer = window.setTimeout(commit, 420);
  }

  function restoreFloatingToolHistory(direction) {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (!modal || modal.hidden) return;
    const state = floatingToolHistory.get(modal.dataset.toolId);
    if (!state) return;
    const next = Math.max(0, Math.min(state.entries.length - 1, state.index + direction));
    if (next === state.index) return;
    state.index = next;
    applyFloatingToolSnapshot(modal, state.entries[next]);
    updateFloatingToolHistoryButtons(modal);
  }

  function applyFloatingToolSnapshot(modal, snapshot = {}) {
    const input = modal.querySelector("[data-role='tool-input']");
    const compare = modal.querySelector("[data-role='tool-compare-input']");
    const search = modal.querySelector("[data-role='emoji-search']");
    if (input) input.value = snapshot.input || "";
    if (compare) compare.value = snapshot.compare || "";
    if (search) search.value = snapshot.emojiSearch || "";
    modal.querySelectorAll("[data-tool-option]").forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(snapshot.options || {}, field.dataset.toolOption)) field.value = snapshot.options[field.dataset.toolOption];
    });
    if (modal.dataset.toolId === "emojiPicker") renderFloatingEmojiPicker(modal);
    else if (modal.dataset.toolId === "longTextSplitter") renderFloatingSpecialCharacters(modal);
    else runFloatingTool({ silent: true, recordHistory: false });
  }

  function updateFloatingToolHistoryButtons(modal) {
    const state = floatingToolHistory.get(modal.dataset.toolId) || { entries: [], index: 0 };
    const undo = modal.querySelector("[data-action='tool-undo']");
    const redo = modal.querySelector("[data-action='tool-redo']");
    if (undo) undo.disabled = state.index <= 0;
    if (redo) redo.disabled = state.index >= state.entries.length - 1;
  }

  function loadFloatingToolExample() {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (!modal || modal.hidden) return;
    const options = collectFloatingToolOptions(modal);
    const exampleModeOptions = Object.fromEntries(Object.entries(options).filter(([key]) => !["locale", "compareText", "replaceFind", "replaceWith", "replaceCaseSensitive", "replaceWholeWord", "replaceRegex"].includes(key)));
    const signature = JSON.stringify([modal.dataset.toolId, exampleModeOptions]);
    const index = modal.dataset.exampleSignature === signature ? Number(modal.dataset.exampleIndex || 0) : 0;
    const example = globalThis.MCP.toolExample?.(modal.dataset.toolId, options, state.settings.language || "en", index);
    if (!example) return;
    modal.dataset.exampleSignature = signature;
    modal.dataset.exampleIndex = String(index + 1);
    modal.querySelectorAll("[data-tool-option]").forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(example.options || {}, field.dataset.toolOption)) field.value = example.options[field.dataset.toolOption];
    });
    const input = modal.querySelector("[data-role='tool-input']");
    const compare = modal.querySelector("[data-role='tool-compare-input']");
    if (input) input.value = example.input || "";
    if (compare) compare.value = example.compareText || "";
    if (modal.dataset.toolId === "variableInjector") updateFloatingWordReplacerHighlight(modal);
    runFloatingTool({ silent: true });
    recordFloatingToolHistory(modal, true);
  }

  function applyFloatingToolSmartPreset() {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (!modal || modal.hidden) return;
    if (modal.dataset.toolId === "emojiPicker" || modal.dataset.toolId === "longTextSplitter") {
      const search = modal.querySelector("[data-role='emoji-search']");
      if (search) search.value = "";
      if (modal.dataset.toolId === "emojiPicker") renderFloatingEmojiPicker(modal);
      else renderFloatingSpecialCharacters(modal);
      showToast(tr("tools.workbench.smartApplied"));
      return;
    }
    const preset = globalThis.MCP.toolSmartPreset?.(modal.dataset.toolId) || {};
    modal.querySelectorAll("[data-tool-option]").forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(preset, field.dataset.toolOption)) field.value = preset[field.dataset.toolOption];
    });
    runFloatingTool({ silent: true });
    recordFloatingToolHistory(modal, true);
    showToast(tr("tools.workbench.smartApplied"));
  }

  function swapFloatingToolInputs() {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (!modal || modal.dataset.toolId !== "textComparator") return;
    const input = modal.querySelector("[data-role='tool-input']");
    const compare = modal.querySelector("[data-role='tool-compare-input']");
    [input.value, compare.value] = [compare.value, input.value];
    runFloatingTool({ silent: true });
    recordFloatingToolHistory(modal, true);
  }

  function resetFloatingToolWorkspace() {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (!modal || modal.hidden) return;
    modal.querySelectorAll("textarea").forEach((field) => { field.value = ""; });
    const search = modal.querySelector("[data-role='emoji-search']");
    if (search) search.value = "";
    const preset = globalThis.MCP.toolSmartPreset?.(modal.dataset.toolId) || {};
    modal.querySelectorAll("[data-tool-option]").forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(preset, field.dataset.toolOption)) field.value = preset[field.dataset.toolOption];
    });
    applyFloatingToolSnapshot(modal, floatingToolSnapshot(modal));
    recordFloatingToolHistory(modal, true);
  }

  function useFloatingToolOutput() {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    const input = modal?.querySelector("[data-role='tool-input']");
    const output = modal?.querySelector("[data-role='tool-output']")?.value || "";
    if (!input || !output) return;
    input.value = output;
    runFloatingTool({ silent: true });
    recordFloatingToolHistory(modal, true);
  }

  function exportFloatingToolOutput() {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    const output = modal?.querySelector("[data-role='tool-output']")?.value || "";
    if (!output) return showToast(tr("tools.workbench.emptyResult"));
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ultimate-clipboard-${modal.dataset.toolId}-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function openFloatingToolInfoModal() {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    const toolId = modal?.dataset.toolId || "";
    const tool = globalThis.MCP.getTools(tr).find((item) => item.id === toolId);
    if (!tool) return;
    openFloatingTextModal("tools.help.title", []);
    const textModal = shadowRoot?.querySelector("[data-role='floating-text-modal']");
    textModal.querySelector("[data-role='floating-text-title']").textContent = tr("tools.help.title", { tool: tool.title });
    const content = textModal.querySelector("[data-role='floating-text-content']");
    content.replaceChildren(createFloatingToolHelpContent(tool));
    content.scrollTop = 0;
    requestAnimationFrame(() => {
      content.scrollTop = 0;
    });
    textModal.querySelector(".mcp-floating-text-card")?.classList.add("is-tool-help");
    shadowRoot.appendChild(textModal);
    textModal.querySelector("[data-role='floating-text-close']")?.focus({ preventScroll: true });
  }

  function createFloatingToolHelpContent(tool) {
    const wrapper = document.createElement("div");
    wrapper.className = "mcp-tool-help";
    const intro = document.createElement("p");
    intro.className = "mcp-tool-help-intro";
    intro.textContent = tool.description;
    wrapper.appendChild(intro);
    [
      ["problem", "tools.help.problem"],
      ["solution", "tools.help.solution"],
      ["how", "tools.help.how"],
      ["example", "tools.help.example"]
    ].forEach(([name, labelKey]) => {
      const section = document.createElement("section");
      section.className = "mcp-tool-help-section";
      const title = document.createElement("h3");
      title.textContent = tr(labelKey);
      const body = document.createElement("p");
      appendFloatingToolHelpText(body, tr(`tools.help.${tool.id}.${name}`));
      section.append(title, body);
      wrapper.appendChild(section);
    });
    return wrapper;
  }

  function appendFloatingToolHelpText(node, value) {
    String(value || "").split(/(\*\*[^*]+\*\*)/g).forEach((part) => {
      if (!part) return;
      if (part.startsWith("**") && part.endsWith("**")) {
        const strong = document.createElement("strong");
        strong.textContent = part.slice(2, -2);
        node.appendChild(strong);
        return;
      }
      node.appendChild(document.createTextNode(part));
    });
  }

  function getFloatingToolState(toolId) {
    const states = state.settings?.toolStates;
    return states && typeof states === "object" && states[toolId] && typeof states[toolId] === "object" ? states[toolId] : {};
  }

  function restoreFloatingToolState(modal, toolId) {
    const saved = getFloatingToolState(toolId);
    const input = modal.querySelector("[data-role='tool-input']");
    const compare = modal.querySelector("[data-role='tool-compare-input']");
    const emojiSearch = modal.querySelector("[data-role='emoji-search']");
    if (input && typeof saved.input === "string") input.value = saved.input;
    if (compare && typeof saved.compare === "string") compare.value = saved.compare;
    if (emojiSearch && typeof saved.emojiSearch === "string") emojiSearch.value = saved.emojiSearch;
    const options = saved.options && typeof saved.options === "object" ? saved.options : {};
    modal.querySelectorAll("[data-tool-option]").forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(options, field.dataset.toolOption)) {
        field.value = options[field.dataset.toolOption];
      }
    });
  }

  function collectFloatingToolState(modal) {
    const options = {};
    modal.querySelectorAll("[data-tool-option]").forEach((field) => {
      options[field.dataset.toolOption] = field.value;
    });
    return {
      input: modal.querySelector("[data-role='tool-input']")?.value || "",
      compare: modal.querySelector("[data-role='tool-compare-input']")?.value || "",
      emojiSearch: modal.querySelector("[data-role='emoji-search']")?.value || "",
      options
    };
  }

  function scheduleFloatingToolStateSave(modal) {
    if (!modal || modal.hidden || !modal.dataset.toolId) return;
    clearTimeout(floatingToolStateSaveTimer);
    floatingToolStateSaveTimer = window.setTimeout(() => saveFloatingToolState(modal), 280);
  }

  async function saveFloatingToolState(modal) {
    if (!modal || !modal.dataset.toolId) return;
    const toolId = modal.dataset.toolId;
    const nextToolState = collectFloatingToolState(modal);
    const settingsKey = globalThis.MCP?.STORAGE_KEYS?.SETTINGS || "mcp_settings";
    const stored = await safeStorageGet(settingsKey);
    const currentSettings = Object.assign({}, state.settings || {}, stored?.[settingsKey] || {});
    const nextToolStates = Object.assign({}, currentSettings.toolStates || {}, { [toolId]: nextToolState });
    state.settings = Object.assign({}, state.settings, { toolStates: nextToolStates });
    await saveSettingsPatch({ toolStates: nextToolStates }).catch(() => {});
  }

  function floatingToolOptionNodes(toolId) {
    const nodes = [];
    const select = (name, options) => {
      const label = document.createElement("label");
      const span = document.createElement("span");
      span.textContent = tr(`tools.options.${name}`);
      const field = document.createElement("select");
      field.dataset.toolOption = name;
      options.forEach(([value, key]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = tr(key);
        field.appendChild(option);
      });
      label.append(span, field);
      nodes.push(label);
    };
    const input = (name, value = "") => {
      const label = document.createElement("label");
      const span = document.createElement("span");
      span.textContent = tr(`tools.options.${name}`);
      const field = document.createElement("input");
      field.dataset.toolOption = name;
      field.value = value;
      label.append(span, field);
      nodes.push(label);
    };
    const area = (name) => {
      const label = document.createElement("label");
      const span = document.createElement("span");
      span.textContent = tr(`tools.options.${name}`);
      const field = document.createElement("textarea");
      field.dataset.toolOption = name;
      label.append(span, field);
      nodes.push(label);
    };
    const toggle = (name, enabled = false) => select(name, [[String(enabled), enabled ? "tools.workbench.on" : "tools.workbench.off"], [String(!enabled), enabled ? "tools.workbench.off" : "tools.workbench.on"]]);
    if (toolId === "textCleaner") select("cleanLevel", [["gentle", "tools.clean.gentle"], ["standard", "tools.clean.standard"], ["deep", "tools.clean.deep"]]);
    if (toolId === "typographyNormalizer") select("typographyMode", [["editorial", "tools.typography.editorial"], ["web", "tools.typography.web"], ["codeSafe", "tools.typography.codeSafe"]]);
    if (toolId === "caseConverter") select("caseMode", [["upper", "tools.case.upper"], ["lower", "tools.case.lower"], ["title", "tools.case.title"], ["sentence", "tools.case.sentence"], ["camel", "tools.case.camel"], ["snake", "tools.case.snake"], ["kebab", "tools.case.kebab"], ["pascal", "tools.case.pascal"]]);
    if (toolId === "advancedCounter") {
      input("readingSpeed", "220");
      input("targetLimit", "0");
    }
    if (toolId === "duplicateDetector") select("duplicateSensitivity", [["exact", "tools.duplicate.exact"], ["balanced", "tools.duplicate.balanced"], ["fuzzy", "tools.duplicate.fuzzy"]]);
    if (toolId === "promptTemplateManager") {
      select("promptPreset", [["general", "tools.promptPreset.general"], ["strategy", "tools.promptPreset.strategy"], ["marketing", "tools.promptPreset.marketing"], ["seo", "tools.promptPreset.seo"], ["social", "tools.promptPreset.social"], ["email", "tools.promptPreset.email"], ["sales", "tools.promptPreset.sales"], ["support", "tools.promptPreset.support"], ["product", "tools.promptPreset.product"], ["ux", "tools.promptPreset.ux"], ["code", "tools.promptPreset.code"], ["debug", "tools.promptPreset.debug"], ["data", "tools.promptPreset.data"], ["research", "tools.promptPreset.research"], ["summary", "tools.promptPreset.summary"], ["translation", "tools.promptPreset.translation"], ["teaching", "tools.promptPreset.teaching"], ["recruiting", "tools.promptPreset.recruiting"], ["project", "tools.promptPreset.project"], ["automation", "tools.promptPreset.automation"], ["imagePrompt", "tools.promptPreset.imagePrompt"]]);
      select("promptDepth", [["deep", "tools.promptDepth.deep"], ["fast", "tools.promptDepth.fast"], ["standard", "tools.promptDepth.standard"], ["exhaustive", "tools.promptDepth.exhaustive"]]);
      select("promptTone", [["expert", "tools.promptTone.expert"], ["neutral", "tools.promptTone.neutral"], ["concise", "tools.promptTone.concise"], ["premium", "tools.promptTone.premium"], ["persuasive", "tools.promptTone.persuasive"], ["friendly", "tools.promptTone.friendly"], ["formal", "tools.promptTone.formal"]]);
      select("promptFormat", [["structured", "tools.promptFormat.structured"], ["markdown", "tools.promptFormat.markdown"], ["table", "tools.promptFormat.table"], ["checklist", "tools.promptFormat.checklist"], ["stepByStep", "tools.promptFormat.stepByStep"], ["json", "tools.promptFormat.json"]]);
    }
    if (toolId === "snippetLibrary") {
      select("imagePromptEngine", [["midjourney", "tools.imagePrompt.engine.midjourney"], ["stableDiffusion", "tools.imagePrompt.engine.stableDiffusion"], ["dalle", "tools.imagePrompt.engine.dalle"], ["firefly", "tools.imagePrompt.engine.firefly"], ["leonardo", "tools.imagePrompt.engine.leonardo"]]);
      select("imagePromptSubject", [["premiumScene", "tools.imagePrompt.subject.premiumScene"], ["productHero", "tools.imagePrompt.subject.productHero"], ["characterPortrait", "tools.imagePrompt.subject.characterPortrait"], ["architecture", "tools.imagePrompt.subject.architecture"], ["fashion", "tools.imagePrompt.subject.fashion"], ["food", "tools.imagePrompt.subject.food"], ["tech", "tools.imagePrompt.subject.tech"], ["nature", "tools.imagePrompt.subject.nature"], ["abstract", "tools.imagePrompt.subject.abstract"], ["uiMockup", "tools.imagePrompt.subject.uiMockup"]]);
      select("imagePromptStyle", [["cinematic", "tools.imagePrompt.style.cinematic"], ["photoreal", "tools.imagePrompt.style.photoreal"], ["editorial", "tools.imagePrompt.style.editorial"], ["luxury", "tools.imagePrompt.style.luxury"], ["documentary", "tools.imagePrompt.style.documentary"], ["anime", "tools.imagePrompt.style.anime"], ["conceptArt", "tools.imagePrompt.style.conceptArt"], ["surreal", "tools.imagePrompt.style.surreal"], ["isometric", "tools.imagePrompt.style.isometric"], ["watercolor", "tools.imagePrompt.style.watercolor"], ["vector", "tools.imagePrompt.style.vector"], ["clay", "tools.imagePrompt.style.clay"]]);
      select("imagePromptComposition", [["ruleOfThirds", "tools.imagePrompt.composition.ruleOfThirds"], ["centered", "tools.imagePrompt.composition.centered"], ["closeCrop", "tools.imagePrompt.composition.closeCrop"], ["wideEpic", "tools.imagePrompt.composition.wideEpic"], ["diagonal", "tools.imagePrompt.composition.diagonal"], ["layeredDepth", "tools.imagePrompt.composition.layeredDepth"], ["minimal", "tools.imagePrompt.composition.minimal"], ["poster", "tools.imagePrompt.composition.poster"], ["grid", "tools.imagePrompt.composition.grid"], ["leadingLines", "tools.imagePrompt.composition.leadingLines"]]);
      select("imagePromptShot", [["macro", "tools.imagePrompt.shot.macro"], ["closeUp", "tools.imagePrompt.shot.closeUp"], ["portrait", "tools.imagePrompt.shot.portrait"], ["mediumWide", "tools.imagePrompt.shot.mediumWide"], ["wideAngle", "tools.imagePrompt.shot.wideAngle"], ["aerial", "tools.imagePrompt.shot.aerial"], ["lowAngle", "tools.imagePrompt.shot.lowAngle"], ["topDown", "tools.imagePrompt.shot.topDown"], ["overShoulder", "tools.imagePrompt.shot.overShoulder"], ["panoramic", "tools.imagePrompt.shot.panoramic"]]);
      select("imagePromptLens", [["cinemaLens", "tools.imagePrompt.lens.cinemaLens"], ["telephoto", "tools.imagePrompt.lens.telephoto"], ["wideLens", "tools.imagePrompt.lens.wideLens"], ["macroLens", "tools.imagePrompt.lens.macroLens"], ["anamorphic", "tools.imagePrompt.lens.anamorphic"], ["tiltShift", "tools.imagePrompt.lens.tiltShift"], ["cleanDigital", "tools.imagePrompt.lens.cleanDigital"]]);
      select("imagePromptLighting", [["softCinematic", "tools.imagePrompt.lighting.softCinematic"], ["goldenHour", "tools.imagePrompt.lighting.goldenHour"], ["neon", "tools.imagePrompt.lighting.neon"], ["studio", "tools.imagePrompt.lighting.studio"], ["rimLight", "tools.imagePrompt.lighting.rimLight"], ["chiaroscuro", "tools.imagePrompt.lighting.chiaroscuro"], ["overcast", "tools.imagePrompt.lighting.overcast"], ["volumetric", "tools.imagePrompt.lighting.volumetric"], ["backlit", "tools.imagePrompt.lighting.backlit"], ["highKey", "tools.imagePrompt.lighting.highKey"]]);
      select("imagePromptMood", [["premium", "tools.imagePrompt.mood.premium"], ["calm", "tools.imagePrompt.mood.calm"], ["dramatic", "tools.imagePrompt.mood.dramatic"], ["futuristic", "tools.imagePrompt.mood.futuristic"], ["warm", "tools.imagePrompt.mood.warm"], ["mysterious", "tools.imagePrompt.mood.mysterious"], ["playful", "tools.imagePrompt.mood.playful"], ["dark", "tools.imagePrompt.mood.dark"]]);
      select("imagePromptColor", [["richContrast", "tools.imagePrompt.color.richContrast"], ["monochrome", "tools.imagePrompt.color.monochrome"], ["pastel", "tools.imagePrompt.color.pastel"], ["vibrant", "tools.imagePrompt.color.vibrant"], ["muted", "tools.imagePrompt.color.muted"], ["tealOrange", "tools.imagePrompt.color.tealOrange"], ["blackGold", "tools.imagePrompt.color.blackGold"], ["natural", "tools.imagePrompt.color.natural"], ["cyberpunk", "tools.imagePrompt.color.cyberpunk"]]);
      select("imagePromptDetail", [["clean", "tools.imagePrompt.detail.clean"], ["detailed", "tools.imagePrompt.detail.detailed"], ["ultraDetailed", "tools.imagePrompt.detail.ultraDetailed"], ["hyperreal", "tools.imagePrompt.detail.hyperreal"], ["minimalDetail", "tools.imagePrompt.detail.minimalDetail"], ["ornate", "tools.imagePrompt.detail.ornate"]]);
      select("imagePromptQuality", [["high", "tools.imagePrompt.quality.high"], ["draft", "tools.imagePrompt.quality.draft"], ["ultra", "tools.imagePrompt.quality.ultra"], ["commercial", "tools.imagePrompt.quality.commercial"]]);
      select("imagePromptAspect", [["16:9", "tools.imagePrompt.aspect.16_9"], ["9:16", "tools.imagePrompt.aspect.9_16"], ["1:1", "tools.imagePrompt.aspect.1_1"], ["4:5", "tools.imagePrompt.aspect.4_5"], ["3:2", "tools.imagePrompt.aspect.3_2"], ["21:9", "tools.imagePrompt.aspect.21_9"]]);
      select("imagePromptStylize", [["balanced", "tools.imagePrompt.stylize.balanced"], ["low", "tools.imagePrompt.stylize.low"], ["high", "tools.imagePrompt.stylize.high"], ["extreme", "tools.imagePrompt.stylize.extreme"]]);
      select("imagePromptVersion", [["v7", "tools.imagePrompt.version.v7"], ["v6", "tools.imagePrompt.version.v6"], ["niji", "tools.imagePrompt.version.niji"]]);
      select("imagePromptNegative", [["standard", "tools.imagePrompt.negative.standard"], ["product", "tools.imagePrompt.negative.product"], ["portrait", "tools.imagePrompt.negative.portrait"], ["text", "tools.imagePrompt.negative.text"], ["none", "tools.imagePrompt.negative.none"]]);
    }
    if (toolId === "variableInjector") nodes.push(createFloatingWordReplacerPanel());
    if (toolId === "listTransformer") select("listMode", [["bullets", "tools.list.bullets"], ["numbered", "tools.list.numbered"], ["csv", "tools.list.csv"], ["markdownTable", "tools.list.table"], ["sort", "tools.list.sort"], ["unique", "tools.list.unique"], ["reverse", "tools.list.reverse"], ["jsonArray", "tools.list.jsonArray"], ["queryParams", "tools.list.queryParams"]]);
    if (toolId === "informationExtractor") select("extractFormat", [["report", "tools.extract.report"], ["json", "tools.extract.json"], ["csv", "tools.extract.csv"]]);
    if (toolId === "localAnonymizer") select("anonymizeMode", [["labels", "tools.anonymize.labels"], ["pseudonyms", "tools.anonymize.pseudonyms"], ["mask", "tools.anonymize.mask"]]);
    if (toolId === "universalEncoder") select("encodeMode", [["urlEncode", "tools.encode.urlEncode"], ["urlDecode", "tools.encode.urlDecode"], ["base64Encode", "tools.encode.base64Encode"], ["base64Decode", "tools.encode.base64Decode"], ["htmlEncode", "tools.encode.htmlEncode"], ["htmlDecode", "tools.encode.htmlDecode"], ["jwtDecode", "tools.encode.jwtDecode"], ["hexEncode", "tools.encode.hexEncode"], ["hexDecode", "tools.encode.hexDecode"], ["unicodeEscape", "tools.encode.unicodeEscape"], ["unicodeUnescape", "tools.encode.unicodeUnescape"], ["jsonString", "tools.encode.jsonString"], ["jsonUnstring", "tools.encode.jsonUnstring"]]);
    if (toolId === "colorPicker") nodes.push(createFloatingColorPickerPanel());
    if (toolId === "imageText") nodes.push(createFloatingImageTextPanel());
    if (toolId === "jsonFormatter") {
      select("jsonMode", [["pretty", "tools.json.pretty"], ["minify", "tools.json.minify"]]);
      toggle("sortJsonKeys", true);
    }
    if (toolId === "loremGenerator") {
      input("wordCount", "120");
      input("paragraphCount", "3");
    }
    if (toolId === "markdownToolkit") select("markdownMode", [["checklist", "tools.markdown.checklist"], ["html", "tools.markdown.html"], ["code", "tools.markdown.code"], ["headings", "tools.markdown.headings"]]);
    if (toolId === "textComparator") {
      toggle("ignoreWhitespace", true);
      toggle("compareCaseSensitive", false);
    }
    return nodes;
  }

  function createFloatingColorPickerPanel() {
    const panel = document.createElement("section");
    panel.className = "mcp-color-picker-panel";
    panel.innerHTML = [
      "<div class=\"mcp-color-picker-main\">",
      "<button type=\"button\" class=\"mcp-color-picker-start mcp-primary\" data-action=\"start-color-pick\"></button>",
      "<p></p>",
      "</div>",
      "<div class=\"mcp-color-picker-controls\">",
      "<label><span></span><input type=\"color\" data-tool-option=\"colorHex\" value=\"#e50914\"></label>",
      "<label><span></span><input type=\"text\" data-tool-option=\"colorText\" value=\"#E50914\" spellcheck=\"false\"></label>",
      "<div class=\"mcp-color-picker-preview\" data-role=\"color-preview\"></div>",
      "</div>",
      "<div class=\"mcp-color-copy-row\">",
      "<button type=\"button\" data-action=\"copy-color-format\" data-format=\"hex\"></button>",
      "<button type=\"button\" data-action=\"copy-color-format\" data-format=\"rgb\"></button>",
      "<button type=\"button\" data-action=\"copy-color-format\" data-format=\"hsl\"></button>",
      "<button type=\"button\" data-action=\"copy-color-format\" data-format=\"cssVariable\"></button>",
      "</div>",
      "<div class=\"mcp-color-palette\" data-role=\"color-palette\"></div>"
    ].join("");
    panel.querySelector("[data-action='start-color-pick']").textContent = tr("tools.colorPicker.start");
    panel.querySelector("p").textContent = tr("tools.colorPicker.instruction");
    const labels = panel.querySelectorAll("label span");
    labels[0].textContent = tr("tools.colorPicker.manual");
    labels[1].textContent = tr("tools.colorPicker.hex");
    panel.querySelector("[data-format='hex']").textContent = tr("tools.colorPicker.copyHex");
    panel.querySelector("[data-format='rgb']").textContent = tr("tools.colorPicker.copyRgb");
    panel.querySelector("[data-format='hsl']").textContent = tr("tools.colorPicker.copyHsl");
    panel.querySelector("[data-format='cssVariable']").textContent = tr("tools.colorPicker.copyCss");
    return panel;
  }

  function createFloatingImageTextPanel() {
    const panel = document.createElement("section");
    panel.className = "mcp-image-text-panel";
    panel.innerHTML = [
      "<div class=\"mcp-image-text-main\">",
      "<button type=\"button\" class=\"mcp-primary mcp-image-text-start\" data-action=\"start-image-text-capture\"></button>",
      "<p></p>",
      "</div>"
    ].join("");
    panel.querySelector("[data-action='start-image-text-capture']").textContent = tr("tools.imageText.start");
    panel.querySelector("p").textContent = tr("tools.imageText.instruction");
    return panel;
  }

  function createFloatingWordReplacerPanel() {
    const panel = document.createElement("section");
    panel.className = "mcp-word-replacer-panel";
    panel.innerHTML = [
      "<label><span></span><input type=\"text\" data-tool-option=\"replaceFind\"></label>",
      "<button type=\"button\" data-action=\"search-word-replacer\"></button>",
      "<label><span></span><input type=\"text\" data-tool-option=\"replaceWith\"></label>",
      "<button type=\"button\" class=\"mcp-primary\" data-action=\"replace-word-replacer\"></button>",
      "<label class=\"mcp-word-replacer-toggle\"><span></span><select data-tool-option=\"replaceCaseSensitive\"><option value=\"false\"></option><option value=\"true\"></option></select></label>",
      "<label class=\"mcp-word-replacer-toggle\"><span></span><select data-tool-option=\"replaceWholeWord\"><option value=\"false\"></option><option value=\"true\"></option></select></label>",
      "<label class=\"mcp-word-replacer-toggle\"><span></span><select data-tool-option=\"replaceRegex\"><option value=\"false\"></option><option value=\"true\"></option></select></label>"
    ].join("");
    const labels = panel.querySelectorAll("label span");
    labels[0].textContent = tr("tools.options.replaceFind");
    labels[1].textContent = tr("tools.options.replaceWith");
    panel.querySelector("[data-tool-option='replaceFind']").placeholder = tr("tools.wordReplacer.findPlaceholder");
    panel.querySelector("[data-tool-option='replaceWith']").placeholder = tr("tools.wordReplacer.replacePlaceholder");
    panel.querySelector("[data-action='search-word-replacer']").textContent = tr("tools.wordReplacer.search");
    panel.querySelector("[data-action='replace-word-replacer']").textContent = tr("tools.wordReplacer.replace");
    const toggles = panel.querySelectorAll(".mcp-word-replacer-toggle");
    ["replaceCaseSensitive", "replaceWholeWord", "replaceRegex"].forEach((name, index) => {
      toggles[index].querySelector("span").textContent = tr(`tools.options.${name}`);
      const options = toggles[index].querySelectorAll("option");
      options[0].textContent = tr("tools.workbench.off");
      options[1].textContent = tr("tools.workbench.on");
    });
    return panel;
  }

  function collectFloatingToolOptions(modal) {
    const options = [...modal.querySelectorAll("[data-tool-option]")].reduce((nextOptions, field) => {
      nextOptions[field.dataset.toolOption] = field.value;
      return nextOptions;
    }, { locale: state.settings.language || "en" });
    const compareText = modal.querySelector("[data-role='tool-compare-input']");
    if (compareText) options.compareText = compareText.value;
    return options;
  }

  function syncFloatingColorFields(modal, target) {
    if (modal?.dataset.toolId !== "colorPicker" || !target?.dataset?.toolOption) return;
    const colorInput = modal.querySelector("[data-tool-option='colorHex']");
    const textInput = modal.querySelector("[data-tool-option='colorText']");
    if (!colorInput || !textInput || !globalThis.MCP?.parseColorSafe || !globalThis.MCP?.colorFormats) return;
    if (target.dataset.toolOption === "colorHex") {
      textInput.value = String(colorInput.value || "#e50914").toUpperCase();
      return;
    }
    const color = globalThis.MCP.parseColorSafe(textInput.value);
    if (color) colorInput.value = globalThis.MCP.colorFormats(color, state.settings.language || "en").hex;
  }

  function renderFloatingColorPicker(modal, options = {}) {
    if (!globalThis.MCP?.parseColorSafe || !globalThis.MCP?.colorFormats) return;
    const color = globalThis.MCP.parseColorSafe(options.colorText || options.colorHex || "#e50914");
    if (!color) return;
    const formats = globalThis.MCP.colorFormats(color, state.settings.language || "en");
    const colorInput = modal.querySelector("[data-tool-option='colorHex']");
    const textInput = modal.querySelector("[data-tool-option='colorText']");
    if (colorInput && colorInput.value.toUpperCase() !== formats.hex) colorInput.value = formats.hex;
    if (textInput && !globalThis.MCP.parseColorSafe(textInput.value)) textInput.value = formats.hex;
    const preview = modal.querySelector("[data-role='color-preview']");
    if (preview) {
      preview.style.setProperty("--picked-color", formats.hex);
      preview.textContent = formats.hex;
    }
    const palette = modal.querySelector("[data-role='color-palette']");
    if (palette && globalThis.MCP.buildColorPalette) {
      palette.replaceChildren(...globalThis.MCP.buildColorPalette(color).map((hex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.action = "copy-color-format";
        button.dataset.color = hex;
        button.dataset.format = "custom";
        button.style.setProperty("--picked-color", hex);
        button.textContent = hex;
        return button;
      }));
    }
  }

  function requestColorPickerActivation() {
    return new Promise((resolve) => {
      document.querySelector("[data-ucp-color-picker-activation]")?.remove();
      const overlay = document.createElement("div");
      const card = document.createElement("div");
      const title = document.createElement("strong");
      const instruction = document.createElement("p");
      const actions = document.createElement("div");
      const start = document.createElement("button");
      const cancel = document.createElement("button");
      overlay.dataset.ucpColorPickerActivation = "true";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.style.cssText = [
        "position:fixed", "inset:0", "z-index:2147483647", "display:grid", "place-items:center",
        "padding:24px", "background:rgba(3,7,12,.62)", "backdrop-filter:blur(8px)",
        "font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"
      ].join(";");
      card.style.cssText = [
        "display:grid", "gap:16px", "width:min(460px,calc(100vw - 32px))", "padding:24px",
        "color:#f8fafc", "border:1px solid rgba(255,255,255,.18)", "border-radius:20px",
        "background:#151b25", "box-shadow:0 24px 70px rgba(0,0,0,.42)", "text-align:left"
      ].join(";");
      title.textContent = tr("tools.colorPicker.title");
      title.style.cssText = "font-size:22px;line-height:1.2";
      instruction.textContent = tr("tools.colorPicker.instruction");
      instruction.style.cssText = "margin:0;color:#c6cfdb;font-size:14px;line-height:1.55";
      actions.style.cssText = "display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap";
      for (const button of [cancel, start]) {
        button.type = "button";
        button.style.cssText = [
          "min-height:44px", "padding:0 18px", "border:1px solid rgba(255,255,255,.2)",
          "border-radius:12px", "color:#f8fafc", "background:#303b4d", "font:700 14px Inter,system-ui,sans-serif",
          "cursor:pointer"
        ].join(";");
      }
      start.textContent = tr("tools.colorPicker.start");
      start.style.background = state.settings?.accentColor || "#e50914";
      start.style.borderColor = "transparent";
      cancel.textContent = tr("common.cancel");
      actions.append(cancel, start);
      card.append(title, instruction, actions);
      overlay.append(card);
      const finish = (activated) => {
        overlay.remove();
        window.removeEventListener("keydown", onKeyDown, true);
        resolve(activated);
      };
      const onKeyDown = (event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        finish(false);
      };
      start.addEventListener("click", () => finish(true), { once: true });
      cancel.addEventListener("click", () => finish(false), { once: true });
      window.addEventListener("keydown", onKeyDown, true);
      document.documentElement.appendChild(overlay);
      start.focus({ preventScroll: true });
    });
  }

  async function syncGlobalToolSelectionMode() {
    const response = await safeRuntimeMessage({ type: MESSAGE_TYPES.GET_TOOL_SELECTION_MODE });
    if (response?.ok) applyGlobalToolSelectionMode(response.data?.mode || null);
  }

  let globalToolSelectionController = null;

  function getGlobalToolSelectionController() {
    if (globalToolSelectionController) return globalToolSelectionController;
    const factory = globalThis.MCP?.createGlobalToolSelectionController;
    if (typeof factory !== "function") return null;
    globalToolSelectionController = factory({
      MESSAGE_TYPES,
      safeRuntimeMessage,
      tr,
      getSettings: () => state.settings || {},
      extractImageTextFromSelectionRect,
      waitForCleanCaptureFrame
    });
    return globalToolSelectionController;
  }

  function applyGlobalToolSelectionMode(modeValue) {
    getGlobalToolSelectionController()?.apply(modeValue);
  }

  function rerenderActiveGlobalToolSelectionController() {
    globalToolSelectionController?.refresh();
  }

  async function startFloatingColorPick({ returnResult = false } = {}) {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (modal?.dataset.toolId === "colorPicker") await saveFloatingToolState(modal).catch(() => {});
    closeFloatingToolWorkspace();
    shadowRoot?.querySelector(".mcp-panel")?.classList.add("is-minimized");
    if (typeof EyeDropper !== "function") {
      if (!returnResult) {
        showToast(tr("tools.colorPicker.unsupported"));
        openFloatingToolWorkspace("colorPicker");
      }
      return { opened: false, unsupported: true };
    }
    const activated = await requestColorPickerActivation();
    if (!activated) {
      if (!returnResult) {
        openFloatingToolWorkspace("colorPicker");
        showToast(tr("tools.colorPicker.cancelled"));
      }
      return { opened: true, cancelled: true };
    }
    try {
      const result = await new EyeDropper().open();
      const hex = String(result?.sRGBHex || "#e50914").toUpperCase();
      if (!returnResult) {
        openFloatingToolWorkspace("colorPicker");
        const nextModal = shadowRoot?.querySelector("[data-role='tool-workspace']");
        nextModal?.querySelector("[data-tool-option='colorHex']")?.setAttribute("value", hex);
        const colorInput = nextModal?.querySelector("[data-tool-option='colorHex']");
        const textInput = nextModal?.querySelector("[data-tool-option='colorText']");
        if (colorInput) colorInput.value = hex;
        if (textInput) textInput.value = hex;
        runFloatingTool({ silent: true });
        showToast(`${tr("tools.colorPicker.picked")} ${hex}`);
      }
      return { opened: true, hex };
    } catch (error) {
      if (!returnResult) {
        openFloatingToolWorkspace("colorPicker");
        showToast(tr("tools.colorPicker.cancelled"));
      }
      return { opened: true, cancelled: true };
    }
  }

  async function copyFloatingColorFormat(button) {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (!modal || modal.dataset.toolId !== "colorPicker" || !globalThis.MCP?.parseColorSafe || !globalThis.MCP?.colorFormats) return;
    const format = button?.dataset?.format || "hex";
    const custom = button?.dataset?.color;
    const color = globalThis.MCP.parseColorSafe(custom || modal.querySelector("[data-tool-option='colorText']")?.value || modal.querySelector("[data-tool-option='colorHex']")?.value || "#e50914");
    if (!color) return;
    const formats = globalThis.MCP.colorFormats(color, state.settings.language || "en");
    const value = custom || formats[format] || formats.hex;
    await copyFloatingToolValue(value);
  }

  async function startFloatingImageTextCapture({ returnResult = false } = {}) {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (modal?.dataset.toolId === "imageText") await saveFloatingToolState(modal).catch(() => {});
    closeFloatingToolWorkspace();
    shadowRoot?.querySelector(".mcp-panel")?.classList.add("is-minimized");
    let selection;
    try {
      selection = await selectImageTextRegion();
    } catch (error) {
      if (!returnResult) {
        openFloatingToolWorkspace("imageText");
        showToast(tr("tools.imageText.cancelled"));
      }
      return { opened: true, cancelled: true };
    }
    if (!selection) {
      if (!returnResult) {
        openFloatingToolWorkspace("imageText");
        showToast(tr("tools.imageText.cancelled"));
      }
      return { opened: true, cancelled: true };
    }
    const finalText = await extractImageTextFromSelectionRect(selection.rect);
    if (!returnResult) {
      openFloatingToolWorkspace("imageText");
      const nextModal = shadowRoot?.querySelector("[data-role='tool-workspace']");
      if (nextModal) {
        const input = nextModal.querySelector("[data-role='tool-input']");
        if (input) input.value = finalText;
        runFloatingTool({ silent: true });
        await saveFloatingToolState(nextModal).catch(() => {});
      }
      showToast(finalText ? tr("tools.imageText.extracted") : tr("tools.imageText.noText"));
    }
    return { opened: true, text: finalText, extracted: Boolean(finalText) };
  }

  async function extractImageTextFromSelectionRect(rect) {
    let processingOverlay = showImageTextProcessingOverlay();
    let finalText = "";
    try {
      await waitForCleanCaptureFrame();
      const domRegionText = extractTextFromViewportRegion(rect, { includeMediaFallback: false });
      finalText = scoreDomRegionText(domRegionText) >= 42 ? normalizeScreenExtractionText(domRegionText) : "";
      if (!finalText) {
        const mediaFallbackText = extractTextFromViewportRegion(rect, { includeTextNodes: false, includeMediaFallback: true });
        processingOverlay?.remove();
        processingOverlay = null;
        await waitForCleanCaptureFrame();
        const response = await safeRuntimeMessage({ type: MESSAGE_TYPES.CAPTURE_VISIBLE_TAB });
        processingOverlay = showImageTextProcessingOverlay();
        if (!response?.ok || !response?.data?.dataUrl) {
          finalText = chooseScreenTextResult(mediaFallbackText, "");
        } else {
          const cropDataUrl = await cropVisibleTabDataUrl(response.data.dataUrl, rect).catch(() => "");
          const ocrText = cropDataUrl ? await detectTextFromImageDataUrl(cropDataUrl).catch(() => "") : "";
          finalText = chooseScreenTextResult(mediaFallbackText, ocrText, { preferOcr: true });
        }
      }
      return finalText;
    } finally {
      processingOverlay?.remove();
    }
  }

  function selectImageTextRegion() {
    return new Promise((resolve, reject) => {
      const overlay = document.createElement("div");
      const box = document.createElement("div");
      const label = document.createElement("div");
      overlay.style.cssText = [
        "position:fixed",
        "inset:0",
        "z-index:2147483647",
        "cursor:crosshair",
        "background:rgba(0,0,0,0.16)",
        "user-select:none",
        "touch-action:none"
      ].join(";");
      box.style.cssText = [
        "position:fixed",
        "display:none",
        "border:2px solid var(--ucp-selection-accent,#e50914)",
        "border-radius:10px",
        "background:rgba(229,9,20,0.12)",
        "box-shadow:none",
        "pointer-events:none"
      ].join(";");
      label.style.cssText = [
        "position:fixed",
        "left:50%",
        "top:22px",
        "transform:translateX(-50%)",
        "padding:10px 14px",
        "border-radius:999px",
        "color:#fff",
        "background:rgba(0,0,0,0.72)",
        "font:700 13px Inter,system-ui,sans-serif",
        "pointer-events:none"
      ].join(";");
      label.textContent = tr("tools.imageText.selecting");
      document.documentElement.style.setProperty("--ucp-selection-accent", state.settings?.accentColor || "#e50914");
      overlay.append(box, label);
      document.documentElement.appendChild(overlay);
      let startX = 0;
      let startY = 0;
      let active = false;
      const cleanup = () => {
        overlay.remove();
        window.removeEventListener("keydown", onKeyDown, true);
      };
      const draw = (x, y) => {
        const left = Math.min(startX, x);
        const top = Math.min(startY, y);
        const width = Math.abs(x - startX);
        const height = Math.abs(y - startY);
        box.style.display = "block";
        box.style.left = `${left}px`;
        box.style.top = `${top}px`;
        box.style.width = `${width}px`;
        box.style.height = `${height}px`;
      };
      const onKeyDown = (event) => {
        if (event.key !== "Escape") return;
        event.preventDefault();
        cleanup();
        reject(new Error("cancelled"));
      };
      overlay.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        active = true;
        startX = event.clientX;
        startY = event.clientY;
        overlay.setPointerCapture?.(event.pointerId);
        draw(startX, startY);
      });
      overlay.addEventListener("pointermove", (event) => {
        if (!active) return;
        event.preventDefault();
        draw(event.clientX, event.clientY);
      });
      overlay.addEventListener("pointerup", (event) => {
        if (!active) return;
        event.preventDefault();
        active = false;
        const left = Math.max(0, Math.min(startX, event.clientX));
        const top = Math.max(0, Math.min(startY, event.clientY));
        const right = Math.min(window.innerWidth, Math.max(startX, event.clientX));
        const bottom = Math.min(window.innerHeight, Math.max(startY, event.clientY));
        cleanup();
        if (right - left < 8 || bottom - top < 8) {
          reject(new Error("too-small"));
          return;
        }
        resolve({ rect: { left, top, right, bottom, width: right - left, height: bottom - top } });
      });
      window.addEventListener("keydown", onKeyDown, true);
    });
  }

  function showImageTextProcessingOverlay() {
    const accent = state.settings?.accentColor || "#e50914";
    const overlay = document.createElement("div");
    const style = document.createElement("style");
    const card = document.createElement("div");
    const orbit = document.createElement("div");
    const core = document.createElement("div");
    const text = document.createElement("div");
    style.textContent = `
      @keyframes ucpImageTextBackdropPulse {
        0%, 100% { opacity: .98; }
        50% { opacity: .92; }
      }
      @keyframes ucpImageTextSpin {
        to { transform: rotate(360deg); }
      }
      @keyframes ucpImageTextCore {
        0%, 100% { transform: scale(.72); opacity: .7; }
        50% { transform: scale(1); opacity: 1; }
      }
    `;
    overlay.setAttribute("data-ucp-image-text-processing", "true");
    overlay.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:2147483647",
      "display:grid",
      "place-items:center",
      "background:rgba(0,0,0,0.48)",
      "-webkit-backdrop-filter:blur(5px)",
      "backdrop-filter:blur(5px)",
      "pointer-events:none",
      "animation:ucpImageTextBackdropPulse 1.25s ease-in-out infinite",
      "user-select:none"
    ].join(";");
    card.style.cssText = [
      "display:grid",
      "justify-items:center",
      "gap:16px",
      "min-width:240px",
      "padding:26px 30px 24px",
      "border-radius:24px",
      "color:#fff",
      "background:linear-gradient(180deg,rgba(22,22,24,.88),rgba(10,10,12,.82))",
      "border:1px solid rgba(255,255,255,.14)",
      "box-shadow:0 22px 70px rgba(0,0,0,.42),0 0 42px color-mix(in srgb," + accent + " 30%,transparent)",
      "font-family:Inter,Segoe UI,system-ui,sans-serif"
    ].join(";");
    orbit.style.cssText = [
      "position:relative",
      "width:68px",
      "height:68px",
      "border-radius:50%",
      "background:conic-gradient(from 0deg," + accent + ",rgba(255,255,255,.92)," + accent + ",rgba(255,255,255,.1))",
      "animation:ucpImageTextSpin .74s linear infinite",
      "box-shadow:0 0 30px color-mix(in srgb," + accent + " 55%,transparent)"
    ].join(";");
    core.style.cssText = [
      "position:absolute",
      "inset:9px",
      "border-radius:50%",
      "background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.96),rgba(255,255,255,.2) 32%,rgba(8,8,10,.96) 34%)",
      "animation:ucpImageTextCore .92s ease-in-out infinite"
    ].join(";");
    text.style.cssText = [
      "font-size:15px",
      "font-weight:900",
      "letter-spacing:.01em",
      "text-align:center",
      "text-shadow:0 1px 12px rgba(0,0,0,.38)"
    ].join(";");
    text.textContent = tr("tools.imageText.processing");
    orbit.appendChild(core);
    card.append(orbit, text);
    overlay.append(style, card);
    document.documentElement.appendChild(overlay);
    return overlay;
  }

  function waitForCleanCaptureFrame() {
    return new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => window.setTimeout(resolve, 40)));
    });
  }

  async function cropVisibleTabDataUrl(dataUrl, rect) {
    const image = await loadImageElement(dataUrl);
    const scaleX = image.naturalWidth / Math.max(1, window.innerWidth);
    const scaleY = image.naturalHeight / Math.max(1, window.innerHeight);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(rect.width * scaleX));
    canvas.height = Math.max(1, Math.round(rect.height * scaleY));
    const context = canvas.getContext("2d", { willReadFrequently: false });
    context.drawImage(
      image,
      Math.round(rect.left * scaleX),
      Math.round(rect.top * scaleY),
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    return canvas.toDataURL("image/png");
  }

  function loadImageElement(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  async function detectTextFromImageDataUrl(dataUrl) {
    const offscreenText = await detectTextWithOffscreenOcr(dataUrl).catch(() => "");
    if (isUsefulOcrText(offscreenText) || scorePlainOcrText(offscreenText) >= 18) {
      return normalizeScreenExtractionText(offscreenText);
    }

    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const transientBitmaps = [];
    try {
      const candidates = [];
      if (typeof TextDetector === "function") {
        const detector = new TextDetector();
        const variants = await buildOcrImageVariants(bitmap);
        for (const variant of variants) {
          if (variant.close && variant !== bitmap) transientBitmaps.push(variant);
          const results = await detector.detect(variant).catch(() => []);
          const text = normalizeTextDetectorResults(results);
          if (text) candidates.push({ text, score: scoreOcrCandidate(text, results, variant) });
        }
      }
      const browserOcrText = chooseBestOcrCandidate(candidates);
      const tesseractText = await detectTextWithLocalTesseract(bitmap).catch(() => "");
      return chooseBestOcrCandidate([
        { text: browserOcrText, score: scorePlainOcrText(browserOcrText) },
        { text: tesseractText, score: scorePlainOcrText(tesseractText) + 80 }
      ]);
    } finally {
      transientBitmaps.forEach((item) => item.close?.());
      bitmap.close?.();
    }
  }

  async function detectTextWithOffscreenOcr(dataUrl) {
    const response = await safeRuntimeMessage({
      type: MESSAGE_TYPES.RUN_OCR,
      dataUrl,
      language: tesseractLanguageForCurrentSettings()
    });
    if (!response?.ok && response?.error) {
      console.warn("[Ultimate Clipboard Pro OCR]", response.error);
    }
    const text = response?.data?.text || response?.text || "";
    return normalizeTesseractText(text);
  }

  async function detectTextWithLocalTesseract(bitmap) {
    if (!globalThis.Tesseract?.recognize || !chrome?.runtime?.getURL) return "";
    const language = tesseractLanguageForCurrentSettings();
    const options = {
      workerPath: chrome.runtime.getURL("shared/vendor/tesseract/worker.min.js"),
      corePath: chrome.runtime.getURL("shared/vendor/tesseract/"),
      langPath: chrome.runtime.getURL("shared/vendor/tesseract/"),
      workerBlobURL: false,
      gzip: true,
      tessedit_pageseg_mode: "6",
      user_defined_dpi: "300",
      preserve_interword_spaces: "1",
      logger: () => {}
    };
    const variants = [
      { canvas: renderBitmapForOcr(bitmap, { scale: 2.2, mode: "raw" }), bonus: 26 },
      { canvas: renderBitmapForOcr(bitmap, { scale: 2.6, mode: "contrast" }), bonus: 14 },
      { canvas: renderBitmapForOcr(bitmap, { scale: 2.8, mode: "threshold-inverted" }), bonus: 8 }
    ];
    const candidates = [];
    for (const variant of variants) {
      const result = await globalThis.Tesseract.recognize(variant.canvas, language, options).catch(() => null);
      const text = normalizeTesseractText(result?.data?.text || "");
      const confidence = Number(result?.data?.confidence || 0);
      if (text && isUsefulOcrText(text)) {
        candidates.push({ text, score: scorePlainOcrText(text) + confidence * 3 + variant.bonus });
      }
      if (candidates.some((candidate) => candidate.score >= 260)) break;
    }
    return chooseBestOcrCandidate(candidates);
  }

  function tesseractLanguageForCurrentSettings() {
    const map = { fr: "fra", en: "eng", de: "deu", es: "spa", it: "ita" };
    const primary = map[state.settings?.language] || "eng";
    return primary === "eng" ? "eng" : `${primary}+eng`;
  }

  function normalizeTesseractText(value) {
    return normalizeRegionText(value)
      .split(/\n+/)
      .map((line) => line
        .replace(/[|\u00a6]{2,}/g, "")
        .replace(/(?:\b[\p{L}\p{N}]\b[\s,.;:!?-]*){6,}/gu, " ")
        .replace(/\s{2,}/g, " ")
        .trim())
      .filter(Boolean)
      .join("\n");
  }

  function scorePlainOcrText(text) {
    const clean = normalizeScreenExtractionText(text);
    if (!clean) return 0;
    const words = clean.split(/\s+/).filter(Boolean).length;
    const letters = (clean.match(/\p{L}/gu) || []).length;
    const digits = (clean.match(/\p{N}/gu) || []).length;
    const noise = (clean.match(/[\uFFFD\u25A1\u25A0\u25CF\u25C6\u25C7]{1}/g) || []).length;
    const singleTokens = (clean.match(/(?:^|\s)[\p{L}\p{N}](?=\s|$)/gu) || []).length;
    const wordCount = Math.max(1, words);
    const singleTokenPenalty = singleTokens / wordCount > 0.28 ? singleTokens * 22 : singleTokens * 3;
    return words * 9 + letters * 1.5 + digits - noise * 25 - singleTokenPenalty;
  }

  function isUsefulOcrText(text) {
    const clean = normalizeScreenExtractionText(text);
    if (clean.length < 3) return false;
    const tokens = clean.split(/\s+/).filter(Boolean);
    const meaningful = tokens.filter((token) => /[\p{L}\p{N}]{2,}/u.test(token)).length;
    const singleTokens = tokens.filter((token) => /^[\p{L}\p{N}]$/u.test(token)).length;
    if (meaningful < 2 && clean.length < 18) return false;
    if (tokens.length >= 8 && singleTokens / tokens.length > 0.34) return false;
    return scorePlainOcrText(clean) > 24;
  }

  function chooseScreenTextResult(domText, ocrText, options = {}) {
    const domClean = normalizeScreenExtractionText(domText);
    const ocrClean = normalizeScreenExtractionText(ocrText);
    const domScore = scoreDomRegionText(domClean);
    const ocrScore = isUsefulOcrText(ocrClean) ? scorePlainOcrText(ocrClean) : 0;
    if (options.preferOcr && (ocrScore >= 18 || scorePlainOcrText(ocrClean) >= 18)) {
      return ocrClean;
    }
    if (domScore >= 18) return domClean;
    if (ocrScore >= 26 || scorePlainOcrText(ocrClean) >= 18) return ocrClean;
    return "";
  }

  function scoreDomRegionText(text) {
    const clean = normalizeScreenExtractionText(text);
    if (!clean) return 0;
    const words = clean.split(/\s+/).filter(Boolean).length;
    const letters = (clean.match(/\p{L}/gu) || []).length;
    const lines = clean.split(/\n+/).filter(Boolean).length;
    return words * 14 + letters * 1.6 + lines * 4;
  }

  function normalizeScreenExtractionText(value) {
    return normalizeRegionText(value)
      .replace(/(?:\b[\p{L}\p{N}]\b[\s,.;:!?-]*){6,}/gu, " ")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/ ?\n ?/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  async function buildOcrImageVariants(bitmap) {
    const canvases = [
      renderBitmapForOcr(bitmap, { scale: 2.4, mode: "raw" }),
      renderBitmapForOcr(bitmap, { scale: 3, mode: "grayscale" }),
      renderBitmapForOcr(bitmap, { scale: 3.25, mode: "contrast" }),
      renderBitmapForOcr(bitmap, { scale: 3.25, mode: "adaptive" }),
      renderBitmapForOcr(bitmap, { scale: 3.25, mode: "threshold" }),
      renderBitmapForOcr(bitmap, { scale: 3.25, mode: "threshold-inverted" }),
      renderBitmapForOcr(bitmap, { scale: 4, mode: "sharpen" })
    ];
    const variants = [bitmap];
    for (const canvas of canvases) {
      variants.push(await createImageBitmap(canvas).catch(() => canvas));
    }
    return variants;
  }

  function renderBitmapForOcr(bitmap, options = {}) {
    const requestedScale = Math.max(1, Number(options.scale || 1));
    const maxDimensionScale = 2800 / Math.max(1, bitmap.width, bitmap.height);
    const scale = Math.max(1, Math.min(requestedScale, maxDimensionScale));
    const padding = Math.max(10, Math.round(12 * scale));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale) + padding * 2);
    canvas.height = Math.max(1, Math.round(bitmap.height * scale) + padding * 2);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, padding, padding, canvas.width - padding * 2, canvas.height - padding * 2);
    if (options.mode === "raw") return canvas;
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const grayscale = new Uint8ClampedArray(data.length / 4);
    for (let index = 0; index < data.length; index += 4) {
      const gray = Math.round(data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722);
      grayscale[index / 4] = gray;
    }
    const threshold = otsuThreshold(grayscale);
    for (let index = 0; index < data.length; index += 4) {
      const gray = grayscale[index / 4];
      let value = gray;
      if (options.mode === "threshold" || options.mode === "threshold-inverted") {
        value = gray > threshold ? 255 : 0;
        if (options.mode === "threshold-inverted") value = 255 - value;
      } else if (options.mode === "adaptive") {
        value = adaptiveOcrPixelValue(grayscale, canvas.width, canvas.height, index / 4, threshold);
      } else if (options.mode === "contrast" || options.mode === "sharpen") {
        value = Math.max(0, Math.min(255, (gray - 128) * 1.95 + 128));
      }
      data[index] = value;
      data[index + 1] = value;
      data[index + 2] = value;
    }
    context.putImageData(imageData, 0, 0);
    if (options.mode === "sharpen") sharpenCanvas(context, canvas.width, canvas.height);
    return canvas;
  }

  function adaptiveOcrPixelValue(grayscale, width, height, pixelIndex, globalThreshold) {
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const left = grayscale[y * width + Math.max(0, x - 2)];
    const right = grayscale[y * width + Math.min(width - 1, x + 2)];
    const top = grayscale[Math.max(0, y - 2) * width + x];
    const bottom = grayscale[Math.min(height - 1, y + 2) * width + x];
    const localThreshold = ((left + right + top + bottom + grayscale[pixelIndex]) / 5) - 9;
    const threshold = Math.max(72, Math.min(218, (localThreshold + globalThreshold) / 2));
    return grayscale[pixelIndex] > threshold ? 255 : 0;
  }

  function otsuThreshold(grayscale) {
    const histogram = new Array(256).fill(0);
    grayscale.forEach((value) => { histogram[value] += 1; });
    const total = grayscale.length;
    const sum = histogram.reduce((next, count, value) => next + value * count, 0);
    let sumBackground = 0;
    let weightBackground = 0;
    let maxVariance = 0;
    let threshold = 160;
    for (let value = 0; value < 256; value += 1) {
      weightBackground += histogram[value];
      if (!weightBackground) continue;
      const weightForeground = total - weightBackground;
      if (!weightForeground) break;
      sumBackground += value * histogram[value];
      const meanBackground = sumBackground / weightBackground;
      const meanForeground = (sum - sumBackground) / weightForeground;
      const variance = weightBackground * weightForeground * ((meanBackground - meanForeground) ** 2);
      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = value;
      }
    }
    return Math.max(96, Math.min(208, threshold));
  }

  function sharpenCanvas(context, width, height) {
    const source = context.getImageData(0, 0, width, height);
    const output = context.createImageData(width, height);
    const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const outputIndex = (y * width + x) * 4;
        for (let channel = 0; channel < 3; channel += 1) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky += 1) {
            for (let kx = -1; kx <= 1; kx += 1) {
              const px = Math.max(0, Math.min(width - 1, x + kx));
              const py = Math.max(0, Math.min(height - 1, y + ky));
              const sourceIndex = (py * width + px) * 4 + channel;
              sum += source.data[sourceIndex] * kernel[(ky + 1) * 3 + (kx + 1)];
            }
          }
          output.data[outputIndex + channel] = Math.max(0, Math.min(255, sum));
        }
        output.data[outputIndex + 3] = source.data[outputIndex + 3];
      }
    }
    context.putImageData(output, 0, 0);
  }

  function normalizeTextDetectorResults(results = []) {
    const entries = results
      .map((item) => {
        const text = normalizeRegionText(item.rawValue || item.text || "");
        const box = item.boundingBox || item.bounds || null;
        const geometry = normalizeOcrBox(box);
        return text ? { text, box: geometry } : null;
      })
      .filter(Boolean);
    if (!entries.length) return "";
    const boxedEntries = entries.filter((entry) => entry.box);
    if (!boxedEntries.length) return mergeExtractedText(entries.map((entry) => entry.text));
    const sorted = boxedEntries.slice().sort((a, b) => {
      return Math.abs(a.box.y - b.box.y) > Math.max(10, Math.min(a.box.height, b.box.height) * 0.62)
        ? a.box.y - b.box.y
        : a.box.x - b.box.x;
    });
    const lines = [];
    sorted.forEach((entry) => {
      const line = lines.find((candidate) => {
        const delta = Math.abs(candidate.center - entry.box.centerY);
        return delta <= Math.max(8, Math.min(candidate.height, entry.box.height) * 0.64);
      });
      if (line) {
        line.entries.push(entry);
        line.top = Math.min(line.top, entry.box.y);
        line.height = Math.max(line.height, entry.box.height);
        line.center = line.entries.reduce((total, item) => total + item.box.centerY, 0) / line.entries.length;
      } else {
        lines.push({ top: entry.box.y, center: entry.box.centerY, height: entry.box.height, entries: [entry] });
      }
    });
    return lines
      .sort((a, b) => a.top - b.top)
      .map((line) => line.entries
        .sort((a, b) => a.box.x - b.box.x)
        .map((entry) => entry.text)
        .join(" "))
      .join("\n")
      .trim();
  }

  function normalizeOcrBox(box) {
    if (!box) return null;
    const x = Number(box.x ?? box.left ?? 0);
    const y = Number(box.y ?? box.top ?? 0);
    const right = Number(box.right ?? x);
    const bottom = Number(box.bottom ?? y);
    const width = Number(box.width ?? Math.max(0, right - x) ?? 0);
    const height = Math.max(1, Number(box.height ?? Math.max(0, bottom - y) ?? 14));
    return { x, y, width, height, centerY: y + height / 2 };
  }

  function scoreOcrCandidate(text, results = [], source = null) {
    const clean = normalizeRegionText(text);
    if (!clean) return 0;
    const alphaNum = (clean.match(/[\p{L}\p{N}]/gu) || []).length;
    const replacement = (clean.match(/[\uFFFD\u00A1\u00BF\u00A0|]{1}/g) || []).length;
    const lines = clean.split(/\n+/).filter(Boolean);
    const words = clean.split(/\s+/).filter(Boolean);
    const punctuationNoise = (clean.match(/[~^`_=]{2,}/g) || []).length;
    const averageLineLength = lines.length ? clean.length / lines.length : clean.length;
    const sourceAreaBonus = source?.width && source?.height ? Math.min(120, Math.log10(source.width * source.height) * 16) : 0;
    return alphaNum * 2
      + words.length * 5
      + lines.length * 8
      + Math.min(80, averageLineLength)
      + results.length * 4
      + sourceAreaBonus
      - replacement * 20
      - punctuationNoise * 12
      - Math.max(0, lines.length - words.length) * 20
      - Math.max(0, clean.length - alphaNum * 4);
  }

  function chooseBestOcrCandidate(candidates = []) {
    if (!candidates.length) return "";
    const normalized = candidates
      .map((candidate) => ({ text: mergeExtractedText([candidate.text]), score: candidate.score }))
      .filter((candidate) => candidate.text);
    if (!normalized.length) return "";
    normalized.sort((a, b) => b.score - a.score || b.text.length - a.text.length);
    return normalized[0].text;
  }

  function extractTextFromViewportRegion(rect, options = {}) {
    const includeTextNodes = options.includeTextNodes !== false;
    const includeMediaFallback = options.includeMediaFallback !== false;
    const chunks = [];
    const seen = new Set();
    const add = (value, sourceRect, addOptions = {}) => {
      const text = normalizeRegionText(value);
      if (!text || seen.has(text)) return;
      if (sourceRect && !addOptions.allowPartial && !isRectStrictlySelected(rect, sourceRect)) return;
      if (sourceRect && addOptions.allowPartial && !isImageRegionSelectedForTextFallback(rect, sourceRect)) return;
      seen.add(text);
      chunks.push({ text, top: sourceRect?.top ?? rect.top, left: sourceRect?.left ?? rect.left });
    };
    if (includeTextNodes) {
      const nativeRangeText = extractNativeRangeTextFromRect(rect);
      if (scoreDomRegionText(nativeRangeText) >= 42) return nativeRangeText;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const value = normalizeRegionText(node.nodeValue);
          if (!value) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent || isHiddenForRegion(parent)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      while (walker.nextNode()) {
        extractSelectedTextFragments(walker.currentNode, rect).forEach((fragment) => add(fragment.text, fragment.rect));
      }
    }
    if (includeMediaFallback) {
      document.querySelectorAll("input, textarea, select, img, svg, canvas, [role='img'], [aria-label], [title], [alt]").forEach((element) => {
        if (isHiddenForRegion(element)) return;
        const bounds = element.getBoundingClientRect();
        const isImageLike = element.matches("img, svg, canvas, [role='img'], [alt]");
        if (isImageLike) {
          if (!isImageRegionSelectedForTextFallback(rect, bounds)) return;
        } else if (!isRectStrictlySelected(rect, bounds, 0.28)) return;
        const value = element.matches("input, textarea, select")
          ? element.value || element.placeholder || element.getAttribute("aria-label")
          : accessibleTextForRegionElement(element);
        add(value, bounds, { allowPartial: isImageLike });
      });
      collectAccessibleTextFromSelectionPoints(rect).forEach((entry) => add(entry.text, entry.rect, { allowPartial: true }));
    }
    return chunks
      .sort((a, b) => Math.abs(a.top - b.top) > 7 ? a.top - b.top : a.left - b.left)
      .reduce((lines, item) => {
        const current = lines[lines.length - 1];
        if (!current || Math.abs(current.top - item.top) > 9) {
          lines.push({ top: item.top, parts: [item] });
        } else {
          current.parts.push(item);
        }
        return lines;
      }, [])
      .map((line) => line.parts.sort((a, b) => a.left - b.left).map((item) => item.text).join(" "))
      .join("\n");
  }

  function extractSelectedTextFragments(textNode, selectionRect) {
    const value = String(textNode.nodeValue || "");
    const fragments = [];
    const tokens = [...value.matchAll(/\S+/g)];
    if (!tokens.length) return fragments;
    tokens.forEach((match) => {
      const word = match[0];
      const start = match.index;
      const end = start + word.length;
      const range = document.createRange();
      try {
        range.setStart(textNode, start);
        range.setEnd(textNode, end);
        const rects = [...range.getClientRects()].filter((item) => isRectStrictlySelected(selectionRect, item));
        rects.forEach((clientRect) => {
          fragments.push({ text: word, rect: clientRect });
        });
      } catch (error) {
        // Ignore unstable text nodes that changed during selection.
      } finally {
        range.detach?.();
      }
    });
    return fragments;
  }

  function extractNativeRangeTextFromRect(selectionRect) {
    const start = caretRangeFromClientPoint(selectionRect.left + 3, selectionRect.top + 3)
      || caretRangeFromClientPoint(selectionRect.left + selectionRect.width * 0.08, selectionRect.top + selectionRect.height * 0.5);
    const end = caretRangeFromClientPoint(selectionRect.right - 3, selectionRect.bottom - 3)
      || caretRangeFromClientPoint(selectionRect.left + selectionRect.width * 0.92, selectionRect.top + selectionRect.height * 0.5);
    if (!start || !end) return "";
    const range = document.createRange();
    try {
      const order = start.compareBoundaryPoints(Range.START_TO_START, end);
      const first = order <= 0 ? start : end;
      const last = order <= 0 ? end : start;
      range.setStart(first.startContainer, first.startOffset);
      range.setEnd(last.startContainer, last.startOffset);
      const text = normalizeScreenExtractionText(range.toString());
      return text;
    } catch (error) {
      return "";
    } finally {
      range.detach?.();
      start.detach?.();
      end.detach?.();
    }
  }

  function caretRangeFromClientPoint(x, y) {
    const safeX = Math.max(0, Math.min(window.innerWidth - 1, x));
    const safeY = Math.max(0, Math.min(window.innerHeight - 1, y));
    if (document.caretRangeFromPoint) return document.caretRangeFromPoint(safeX, safeY);
    if (document.caretPositionFromPoint) {
      const position = document.caretPositionFromPoint(safeX, safeY);
      if (!position) return null;
      const range = document.createRange();
      range.setStart(position.offsetNode, position.offset);
      range.collapse(true);
      return range;
    }
    return null;
  }

  function accessibleTextForRegionElement(element) {
    if (!element) return "";
    return [
      element.alt,
      element.title,
      element.getAttribute?.("aria-label"),
      element.getAttribute?.("data-alt"),
      element.getAttribute?.("data-tooltip-content"),
      element.getAttribute?.("aria-description")
    ].filter(Boolean).join("\n");
  }

  function collectAccessibleTextFromSelectionPoints(selectionRect) {
    const entries = [];
    const seenElements = new Set();
    const columns = 5;
    const rows = 5;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = selectionRect.left + selectionRect.width * ((column + 0.5) / columns);
        const y = selectionRect.top + selectionRect.height * ((row + 0.5) / rows);
        const stack = document.elementsFromPoint?.(x, y) || [];
        stack.slice(0, 8).forEach((element) => {
          let current = element;
          for (let depth = 0; current && depth < 5; depth += 1, current = current.parentElement) {
            if (seenElements.has(current) || isHiddenForRegion(current)) continue;
            const text = accessibleTextForRegionElement(current);
            if (!text) continue;
            const bounds = current.getBoundingClientRect();
            if (!isImageRegionSelectedForTextFallback(selectionRect, bounds)) continue;
            seenElements.add(current);
            entries.push({ text, rect: bounds });
          }
        });
      }
    }
    return entries;
  }

  function isHiddenForRegion(element) {
    if (element?.closest?.("[data-ucp-image-text-processing='true']")) return true;
    const style = window.getComputedStyle(element);
    return style.display === "none" || style.visibility === "hidden" || Number(style.opacity || 1) === 0;
  }

  function rectsIntersect(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  function isRectStrictlySelected(selectionRect, candidateRect, minimumRatio = 0.52) {
    if (!candidateRect || candidateRect.width <= 0 || candidateRect.height <= 0) return false;
    const intersectionLeft = Math.max(selectionRect.left, candidateRect.left);
    const intersectionRight = Math.min(selectionRect.right, candidateRect.right);
    const intersectionTop = Math.max(selectionRect.top, candidateRect.top);
    const intersectionBottom = Math.min(selectionRect.bottom, candidateRect.bottom);
    const intersectionWidth = Math.max(0, intersectionRight - intersectionLeft);
    const intersectionHeight = Math.max(0, intersectionBottom - intersectionTop);
    if (!intersectionWidth || !intersectionHeight) return false;
    const centerX = candidateRect.left + candidateRect.width / 2;
    const centerY = candidateRect.top + candidateRect.height / 2;
    const centerInside = centerX >= selectionRect.left && centerX <= selectionRect.right && centerY >= selectionRect.top && centerY <= selectionRect.bottom;
    const ratio = (intersectionWidth * intersectionHeight) / Math.max(1, candidateRect.width * candidateRect.height);
    return centerInside || ratio >= minimumRatio;
  }

  function isImageRegionSelectedForTextFallback(selectionRect, candidateRect) {
    if (!candidateRect || candidateRect.width <= 0 || candidateRect.height <= 0) return false;
    if (!rectsIntersect(selectionRect, candidateRect)) return false;
    const selectionCenterX = selectionRect.left + selectionRect.width / 2;
    const selectionCenterY = selectionRect.top + selectionRect.height / 2;
    const centerInsideImage = selectionCenterX >= candidateRect.left
      && selectionCenterX <= candidateRect.right
      && selectionCenterY >= candidateRect.top
      && selectionCenterY <= candidateRect.bottom;
    if (centerInsideImage) return true;
    const intersectionLeft = Math.max(selectionRect.left, candidateRect.left);
    const intersectionRight = Math.min(selectionRect.right, candidateRect.right);
    const intersectionTop = Math.max(selectionRect.top, candidateRect.top);
    const intersectionBottom = Math.min(selectionRect.bottom, candidateRect.bottom);
    const intersectionArea = Math.max(0, intersectionRight - intersectionLeft) * Math.max(0, intersectionBottom - intersectionTop);
    const selectionArea = Math.max(1, selectionRect.width * selectionRect.height);
    return intersectionArea / selectionArea > 0.18;
  }

  function normalizeRegionText(value) {
    return stripImageAltTextPrefix(String(value || ""))
      .replace(/\u00a0/g, " ")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  function stripImageAltTextPrefix(text) {
    const value = String(text || "").trim();
    const generic = [
      /^peut\s+(?:etre|\u00eatre|-?etre|-?\u00eatre)?\s*une\s+image\s+de\s+texte\s*$/i,
      /^may\s+be\s+an?\s+image\s+of\s+text\s*$/i,
      /^puede\s+ser\s+una\s+imagen\s+de\s+texto\s*$/i,
      /^potrebbe\s+essere\s+un['\u2019]?\s*immagine\s+di\s+testo\s*$/i,
      /^kann\s+ein\s+bild\s+mit\s+text\s+sein\s*$/i
    ];
    if (generic.some((pattern) => pattern.test(value))) return "";
    return value
      .replace(/^\s*(?:peut\s+\u00eatre|peut-\u00eatre|peut\s+etre|peut-etre)\s+une\s+image\s+(?:de\s+texte\s+)?(?:qui\s+dit|indiquant)\s*[\'"\u201c\u201d\u2018\u2019\u00ab\u00bb]?\s*/i, "")
      .replace(/^\s*may\s+be\s+an?\s+image\s+(?:of\s+text\s+)?(?:that\s+says|saying)\s*[\'"\u201c\u201d\u2018\u2019]?\s*/i, "")
      .replace(/^\s*puede\s+ser\s+una\s+imagen\s+(?:de\s+texto\s+)?que\s+dice\s*[\'"\u201c\u201d\u2018\u2019]?\s*/i, "")
      .replace(/^\s*potrebbe\s+essere\s+un['\u2019]?\s*immagine\s+(?:di\s+testo\s+)?che\s+dice\s*[\'"\u201c\u201d\u2018\u2019]?\s*/i, "")
      .replace(/^\s*kann\s+ein\s+bild\s+(?:mit\s+text\s+)?sein,\s*das\s+sagt\s*[\'"\u201c\u201d\u2018\u2019]?\s*/i, "");
  }
  function mergeExtractedText(values) {
    const lines = [];
    const seen = new Set();
    values.join("\n").split(/\n+/).forEach((line) => {
      const clean = normalizeRegionText(line);
      if (!clean) return;
      const key = clean.toLocaleLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      lines.push(clean);
    });
    return lines.join("\n").trim();
  }

  function runFloatingTool({ silent = false, recordHistory = true } = {}) {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (!modal || modal.hidden) return "";
    const input = modal.querySelector("[data-role='tool-input']").value;
    const options = collectFloatingToolOptions(modal);
    const output = globalThis.MCP.runTool(modal.dataset.toolId, input, options);
    modal.querySelector("[data-role='tool-output']").value = output;
    if (modal.dataset.toolId === "colorPicker") renderFloatingColorPicker(modal, options);
    if (modal.dataset.toolId === "textComparator") renderFloatingTextComparator(modal, input, options.compareText || "");
    else if (modal.dataset.toolId === "duplicateDetector") renderFloatingDuplicateDetector(modal, input, output, options);
    renderFloatingToolInsights(modal, input, output, options);
    scheduleFloatingToolStateSave(modal);
    if (recordHistory) recordFloatingToolHistory(modal);
    if (!silent) showToast(tr("tools.processed"));
    return output;
  }

  function searchFloatingWordReplacer() {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (!modal || modal.hidden) return;
    const input = modal.querySelector("[data-role='tool-input']")?.value || "";
    const needle = modal.querySelector("[data-tool-option='replaceFind']")?.value || "";
    if (!input.trim()) {
      showToast(tr("tools.wordReplacer.missingText"));
      return;
    }
    if (!needle) {
      showToast(tr("tools.wordReplacer.missingNeedle"));
      return;
    }
    const count = globalThis.MCP.countWordReplacerMatches ? globalThis.MCP.countWordReplacerMatches(input, needle, collectFloatingToolOptions(modal)) : 0;
    updateFloatingWordReplacerHighlight(modal);
    showToast(count ? tr("tools.wordReplacer.found", { count }) : tr("tools.wordReplacer.notFound"));
  }

  function replaceFloatingWords() {
    const modal = shadowRoot?.querySelector("[data-role='tool-workspace']");
    if (!modal || modal.hidden) return;
    const input = modal.querySelector("[data-role='tool-input']")?.value || "";
    const needle = modal.querySelector("[data-tool-option='replaceFind']")?.value || "";
    if (!input.trim()) {
      showToast(tr("tools.wordReplacer.missingText"));
      return;
    }
    if (!needle) {
      showToast(tr("tools.wordReplacer.missingNeedle"));
      return;
    }
    const count = globalThis.MCP.countWordReplacerMatches ? globalThis.MCP.countWordReplacerMatches(input, needle, collectFloatingToolOptions(modal)) : 0;
    runFloatingTool({ silent: true });
    updateFloatingWordReplacerHighlight(modal);
    showToast(count ? tr("tools.wordReplacer.replaced", { count }) : tr("tools.wordReplacer.notFound"));
  }

  function updateFloatingWordReplacerHighlight(modal) {
    if (!modal || modal.dataset.toolId !== "variableInjector") return;
    const input = modal.querySelector("[data-role='tool-input']");
    if (!input) return;
    const highlight = ensureFloatingWordReplacerHighlight(input);
    const needle = modal.querySelector("[data-tool-option='replaceFind']")?.value || "";
    highlight.innerHTML = globalThis.MCP.buildReplacementHighlightHtml(input.value, needle, collectFloatingToolOptions(modal));
    highlight.scrollTop = input.scrollTop;
    highlight.scrollLeft = input.scrollLeft;
  }

  function ensureFloatingWordReplacerHighlight(input) {
    const label = input.closest("label");
    let highlight = label?.querySelector("[data-role='word-replacer-highlight']");
    if (!label) return document.createElement("div");
    label.classList.add("is-word-replacer-source");
    if (!highlight) {
      highlight = document.createElement("div");
      highlight.className = "mcp-word-replacer-highlight";
      highlight.dataset.role = "word-replacer-highlight";
      highlight.setAttribute("aria-hidden", "true");
      label.appendChild(highlight);
      input.addEventListener("scroll", () => {
        highlight.scrollTop = input.scrollTop;
        highlight.scrollLeft = input.scrollLeft;
      });
    }
    return highlight;
  }

  function renderFloatingTextComparator(modal, leftText, rightText) {
    const left = String(leftText || "");
    const right = String(rightText || "");
    const leftNode = modal.querySelector("[data-role='compare-left-render']");
    const rightNode = modal.querySelector("[data-role='compare-right-render']");
    if (!leftNode || !rightNode) return;
    const visual = globalThis.MCP.buildTextCompareVisual(left, right);
    leftNode.innerHTML = visual.leftHtml;
    rightNode.innerHTML = visual.rightHtml;
    const insight = modal.querySelector("[data-role='tool-insights']");
    if (!insight) return;
    const cards = insight.querySelectorAll(".mcp-tool-insight-card strong");
    if (cards.length >= 4) {
      cards[0].textContent = String(visual.stats.addedTokens);
      cards[1].textContent = String(visual.stats.removedTokens);
      cards[2].textContent = String(visual.stats.changedLines);
      cards[3].textContent = String(visual.stats.sameLines);
    }
  }

  function renderFloatingDuplicateDetector(modal, input, output, options) {
    const leftNode = modal.querySelector("[data-role='compare-left-render']");
    const rightNode = modal.querySelector("[data-role='compare-right-render']");
    if (!leftNode || !rightNode || !globalThis.MCP.detectDuplicateText) return;
    const report = globalThis.MCP.detectDuplicateText(input, options.locale || state.settings.language || "en", options);
    updateFloatingDuplicateTextareaHighlight(modal, report);
    if (input.trim()) leftNode.innerHTML = buildFloatingDuplicateSourceHtml(input, report.groups);
    else leftNode.replaceChildren();
    rightNode.innerHTML = `<pre class="cleaned-output">${escapeFloatingHtml(output || report.cleanedText || "") || "&nbsp;"}</pre>`;
  }

  function updateFloatingDuplicateTextareaHighlight(modal, report) {
    const input = modal.querySelector("[data-role='tool-input']");
    if (!input) return;
    const highlight = ensureFloatingDuplicateTextareaHighlight(input);
    const duplicateKeys = new Set((report.groups || []).map((group) => group.key));
    highlight.innerHTML = (report.segments || []).map((segment) => {
      const key = normalizeFloatingDuplicateKey(segment.value);
      const raw = escapeFloatingHtml(segment.raw || "");
      if (!key || !duplicateKeys.has(key)) return raw;
      return `<span class="duplicate-hit">${raw}</span>`;
    }).join("") || "&nbsp;";
    highlight.scrollTop = input.scrollTop;
    highlight.scrollLeft = input.scrollLeft;
  }

  function ensureFloatingDuplicateTextareaHighlight(input) {
    const label = input.closest("label");
    let highlight = label?.querySelector("[data-role='duplicate-source-highlight']");
    if (!label) return document.createElement("div");
    label.classList.add("is-duplicate-source");
    if (!highlight) {
      highlight = document.createElement("div");
      highlight.className = "mcp-duplicate-source-highlight";
      highlight.dataset.role = "duplicate-source-highlight";
      highlight.setAttribute("aria-hidden", "true");
      label.appendChild(highlight);
      input.addEventListener("scroll", () => {
        highlight.scrollTop = input.scrollTop;
        highlight.scrollLeft = input.scrollLeft;
      });
    }
    return highlight;
  }

  function bindFloatingDuplicateSource(leftNode, modal) {
    if (leftNode.dataset.duplicateBound === "true") return;
    leftNode.dataset.duplicateBound = "true";
    leftNode.contentEditable = "true";
    leftNode.setAttribute("role", "textbox");
    leftNode.setAttribute("aria-multiline", "true");
    leftNode.setAttribute("tabindex", "0");
    leftNode.setAttribute("data-placeholder", tr("tools.inputPlaceholder"));
    leftNode.addEventListener("pointerdown", () => {
      window.setTimeout(() => {
        if (document.activeElement !== leftNode) leftNode.focus();
      }, 0);
    });
    leftNode.addEventListener("paste", (event) => {
      event.preventDefault();
      const text = event.clipboardData?.getData("text/plain") || "";
      insertFloatingPlainTextIntoEditable(leftNode, text);
      syncFloatingDuplicateSource(modal, leftNode);
      runFloatingTool({ silent: true });
    });
    leftNode.addEventListener("input", () => {
      syncFloatingDuplicateSource(modal, leftNode);
      runFloatingTool({ silent: true });
    });
    leftNode.addEventListener("blur", () => runFloatingTool({ silent: true }));
  }

  function getFloatingDuplicateSourceText(modal) {
    const leftNode = modal.querySelector("[data-role='compare-left-render']");
    const visibleText = leftNode ? getFloatingEditablePlainText(leftNode) : "";
    return visibleText.trim() ? visibleText : modal.querySelector("[data-role='tool-input']")?.value || "";
  }

  function syncFloatingDuplicateSource(modal, leftNode) {
    const input = modal.querySelector("[data-role='tool-input']");
    if (input) input.value = getFloatingEditablePlainText(leftNode);
  }

  function getFloatingEditablePlainText(node) {
    return String(node?.innerText || node?.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/^(?:[ \t]*\r?\n)+/, "");
  }

  function isFloatingDuplicateSourceFocused(node) {
    const root = node?.getRootNode?.();
    return document.activeElement === node || root?.activeElement === node || node?.matches?.(":focus");
  }

  function insertFloatingPlainTextIntoEditable(node, text) {
    const cleanText = normalizeFloatingDuplicatePastedText(text);
    node.focus();
    if (!getFloatingEditablePlainText(node).trim()) {
      node.textContent = cleanText;
      placeFloatingCaretAtEditableEnd(node);
      return;
    }
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || !node.contains(selection.anchorNode)) {
      const textNode = document.createTextNode(cleanText);
      node.appendChild(textNode);
      placeFloatingCaretAfterNode(textNode);
      return;
    }
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(cleanText);
    range.insertNode(textNode);
    placeFloatingCaretAfterNode(textNode);
  }

  function normalizeFloatingDuplicatePastedText(text) {
    return String(text || "")
      .replace(/\u00a0/g, " ")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/^(?:[ \t]*\n)+/, "");
  }

  function placeFloatingCaretAfterNode(node) {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function placeFloatingCaretAtEditableEnd(node) {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function buildFloatingDuplicateSourceHtml(input, groups = []) {
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e"];
    const colorByKey = new Map(groups.map((group, index) => [group.key, colors[index % colors.length]]));
    return floatingDuplicateVisualSegments(input).map((segment) => {
      const key = normalizeFloatingDuplicateKey(segment.value);
      const color = colorByKey.get(key);
      if (!color || !segment.value.trim()) return escapeFloatingHtml(segment.raw);
      return `<span class="duplicate-hit" style="--duplicate-color:${color}">${escapeFloatingHtml(segment.raw)}</span>`;
    }).join("") || "&nbsp;";
  }

  function floatingDuplicateVisualSegments(text) {
    const paragraphs = String(text || "").split(/(\n\s*\n+)/);
    const paragraphSegments = [];
    for (let index = 0; index < paragraphs.length; index += 2) {
      const value = paragraphs[index] || "";
      const separator = paragraphs[index + 1] || "";
      if (value.trim()) paragraphSegments.push({ raw: value + separator, value });
    }
    if (paragraphSegments.length >= 2 && paragraphSegments.some((segment) => segment.value.length > 80)) return paragraphSegments;
    const lines = String(text || "").split(/(\r?\n)/);
    const lineSegments = [];
    for (let index = 0; index < lines.length; index += 2) {
      lineSegments.push({ raw: (lines[index] || "") + (lines[index + 1] || ""), value: lines[index] || "" });
    }
    if (lineSegments.filter((segment) => segment.value.trim()).length >= 2) return lineSegments;
    const sentences = String(text || "").match(/[^.!?]+[.!?]+|\S[\s\S]*$/g) || [];
    if (sentences.length >= 2) return sentences.map((value) => ({ raw: value, value }));
    return String(text || "").split(/(\s+)/).filter((value) => value).map((value) => ({ raw: value, value: /\s+/.test(value) ? "" : value }));
  }

  function normalizeFloatingDuplicateKey(value) {
    return String(value || "")
      .normalize("NFKC")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/[“”]/g, "\"")
      .replace(/[‘’]/g, "'")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^[\s"'“”‘’([{]+|[\s"'“”‘’)\]}.,;:!?]+$/g, "")
      .toLocaleLowerCase();
  }

  function escapeFloatingHtml(text) {
    return globalThis.MCP.escapeHtml(text);
  }

  function renderFloatingToolInsights(modal, input, output, options) {
    const target = modal.querySelector("[data-role='tool-insights']");
    if (!target || !globalThis.MCP.inspectTool) return;
    const insight = globalThis.MCP.inspectTool(modal.dataset.toolId, input, output, options, tr);
    const cards = document.createElement("div");
    cards.className = "mcp-tool-insight-cards";
    (insight.cards || []).forEach((card) => {
      const node = document.createElement("article");
      node.className = card.tone ? `mcp-tool-insight-card is-${card.tone}` : "mcp-tool-insight-card";
      const value = document.createElement("strong");
      value.textContent = card.value;
      const name = document.createElement("span");
      name.textContent = card.name;
      node.append(value, name);
      cards.appendChild(node);
    });
    const sections = document.createElement("div");
    sections.className = "mcp-tool-sections";
    (insight.sections || []).slice(0, 3).forEach((section) => {
      const block = document.createElement("section");
      block.className = section.tone ? `is-${section.tone}` : "";
      const title = document.createElement("strong");
      title.textContent = section.title;
      const list = document.createElement("div");
      list.className = "mcp-tool-section-lines";
      section.lines.forEach((line) => {
        const item = document.createElement("span");
        item.textContent = line;
        list.appendChild(item);
      });
      block.append(title, list);
      sections.appendChild(block);
    });
    target.replaceChildren(cards, sections);
    target.hidden = !(insight.cards?.length || insight.sections?.length);
  }

  function renderFloatingEmojiPicker(modal) {
    const grid = modal.querySelector("[data-role='emoji-grid']");
    const search = modal.querySelector("[data-role='emoji-search']");
    if (!grid || !globalThis.MCP.getEmojiLibrary) return;
    const locale = String(state.settings.language || "en").slice(0, 2).toLowerCase();
    const query = normalizeFloatingEmojiQuery(search?.value || "");
    const items = globalThis.MCP.getEmojiLibrary().filter((item) => {
      if (!query) return true;
      return normalizeFloatingEmojiQuery([item.emoji, item.names?.[locale], item.names?.en, item.search].join(" ")).includes(query);
    });
    grid.replaceChildren(...items.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mcp-emoji-item";
      button.dataset.action = "copy-emoji";
      button.dataset.emoji = item.emoji;
      const emoji = document.createElement("span");
      emoji.className = "mcp-emoji-symbol";
      emoji.textContent = item.emoji;
      const name = document.createElement("strong");
      name.textContent = item.names?.[locale] || item.names?.en || item.emoji;
      const copy = document.createElement("span");
      copy.className = "mcp-emoji-copy";
      copy.textContent = tr("common.copy");
      button.append(emoji, name, copy);
      return button;
    }));
  }

  function renderFloatingSpecialCharacters(modal) {
    const grid = modal.querySelector("[data-role='emoji-grid']");
    const search = modal.querySelector("[data-role='emoji-search']");
    if (!grid || !globalThis.MCP.getSpecialCharacterLibrary) return;
    const locale = String(state.settings.language || "en").slice(0, 2).toLowerCase();
    const query = normalizeFloatingEmojiQuery(search?.value || "");
    const items = globalThis.MCP.getSpecialCharacterLibrary(locale).filter((item) => {
      if (!query) return true;
      return normalizeFloatingEmojiQuery([item.symbol, item.names?.[locale], item.names?.en, item.search].join(" ")).includes(query);
    });
    grid.replaceChildren(...items.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mcp-emoji-item mcp-special-character-item";
      button.dataset.action = "copy-special-character";
      button.dataset.symbol = item.symbol;
      const symbol = document.createElement("span");
      symbol.className = "mcp-emoji-symbol mcp-special-character-symbol";
      symbol.textContent = item.symbol;
      const name = document.createElement("strong");
      name.textContent = item.names?.[locale] || item.names?.en || item.symbol;
      const copy = document.createElement("span");
      copy.className = "mcp-emoji-copy";
      copy.textContent = tr("common.copy");
      button.append(symbol, name, copy);
      return button;
    }));
  }

  function normalizeFloatingEmojiQuery(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  async function copyFloatingToolValue(value) {
    if (!value) return false;
    try {
      await navigator.clipboard.writeText(value);
      showToast(tr("tools.workbench.itemCopied"));
      return true;
    } catch (_) {
      showToast(tr("clipboard.blocked"));
      return false;
    }
  }

  async function copyFloatingEmoji(emoji) {
    return copyFloatingToolValue(emoji);
  }

  async function copyFloatingSpecialCharacter(symbol) {
    return copyFloatingToolValue(symbol);
  }

  async function copyFloatingToolOutput() {
    const output = runFloatingTool({ silent: true });
    return copyFloatingToolValue(output);
  }

  async function captureFloatingToolOutput() {
    const output = runFloatingTool({ silent: true });
    if (!output) return;
    await sendTextCapture(output, { sourceTitle: tr("tools.title"), sourceDomain: "Ultimate Clipboard Pro", sourceUrl: location.href });
    showToast(tr("tools.captured"));
  }

  function openExtensionSettings() {
    safeRuntimeMessage({
      type: MESSAGE_TYPES.OPEN_OPTIONS,
      fromNativeSidePanel: IS_NATIVE_SIDE_PANEL
    }).catch(() => {});
  }

  function showCategoryChooser(item, mediaType = "text") {
    if (IS_WEB_LAUNCHER) {
      enforceWebLauncherOnlyMode();
      runSafeAsync(() => openNativeCategoryChooser(item, mediaType));
      return;
    }
    pendingChooserItem = item;
    pendingChooserType = mediaType;
    pendingSubcategoryParentId = null;
    const panel = shadowRoot.querySelector(".mcp-panel");
    const chooser = shadowRoot.querySelector("[data-role='chooser']");
    panel?.classList.remove("is-minimized");
    updateFloatingBrandProBadge();
    panel?.classList.add("is-classifying");
    chooser.hidden = false;
    shadowRoot.querySelector("[data-role='category-search']").value = "";
    hideSubcategoryCreator();
    renderCategoryChooser();
  }

  async function openNativeCategoryChooser(item, mediaType = "text") {
    if (!item?.id) return false;
    const resolvedMediaType = mediaType === "image" ? "image" : mediaType === "dev" ? "dev" : "text";
    const openResponse = await safeRuntimeMessage({
      type: MESSAGE_TYPES.OPEN_NATIVE_SIDE_PANEL,
      mediaType: resolvedMediaType
    }).catch(() => null);
    const requestId = createCaptureRequestId("classifier");
    const command = {
      type: MESSAGE_TYPES.OPEN_CLASSIFIER_FOR_ITEM,
      itemId: item.id,
      mediaType: resolvedMediaType,
      nativeSidePanelOnly: true,
      requestId,
      pendingItem: item.pendingCapture ? item : null
    };
    const response = await safeRuntimeMessage(command);
    if (openResponse?.data?.alreadyOpen !== true) {
      window.setTimeout(() => safeRuntimeMessage(command).catch(() => {}), 180);
      window.setTimeout(() => safeRuntimeMessage(command).catch(() => {}), 520);
    }
    return Boolean(response?.ok && response.data?.opened !== false);
  }

  function hideCategoryChooser() {
    if (!shadowRoot) return;
    const chooser = shadowRoot.querySelector("[data-role='chooser']");
    if (chooser) chooser.hidden = true;
    shadowRoot.querySelector(".mcp-panel")?.classList.remove("is-classifying");
    pendingChooserItem = null;
    pendingChooserType = "text";
    pendingSubcategoryParentId = null;
  }

  function renderCategoryChooser() {
    if (!shadowRoot) return;
    const list = shadowRoot.querySelector("[data-role='category-list']");
    const search = shadowRoot.querySelector("[data-role='category-search']");
    if (!list || !pendingChooserItem) return;
    const query = normalize(search.value);
    const categories = chooserCategories().filter((category) => !category.isHidden);
    const tree = buildCategoryTree(categories);

    const previousScroll = list.scrollTop;
    list.replaceChildren();
    const title = document.createElement("span");
    title.className = "mcp-category-section";
    title.textContent = tr("categories.all");
    list.appendChild(title);
    renderChooserTree(list, tree, 0, query);

    requestAnimationFrame(() => {
      if (document.activeElement !== search) list.scrollTop = previousScroll;
    });
  }

  function restoreChooserScroll(previousScroll, categoryId = "") {
    const restore = () => {
      const nextList = shadowRoot?.querySelector("[data-role='category-list']");
      if (!nextList) return;
      nextList.scrollTop = previousScroll;
      const nextToggle = categoryId ? nextList.querySelector(`[data-toggle-category-id="${CSS.escape(categoryId)}"]`) : null;
      nextToggle?.focus?.({ preventScroll: true });
    };
    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(restore);
      window.setTimeout(restore, 80);
    });
  }

  function buildCategoryTree(categories) {
    const byParent = new Map();
    categories.forEach((category) => {
      const parentId = category.parentId || null;
      byParent.set(parentId, (byParent.get(parentId) || []).concat(Object.assign({}, category, { children: [] })));
    });
    const attach = (parentId) => sortCategoriesForTree(byParent.get(parentId) || []).map((category) => Object.assign({}, category, {
      children: attach(category.id)
    }));
    return attach(null);
  }

  function sortCategoriesForTree(categories) {
    return [...categories].sort((left, right) => {
      const leftRank = categoryProtectedRank(left);
      const rightRank = categoryProtectedRank(right);
      if (leftRank !== rightRank) return leftRank - rightRank;
      return (left.order || 0) - (right.order || 0) || categoryLabel(left).localeCompare(categoryLabel(right), lang(), { sensitivity: "base" });
    });
  }

  function categoryProtectedRank(category) {
    if (category?.parentId) return 3;
    if (isGeneralCategoryId(category?.id)) return 0;
    if (isFavoriteCategoryId(category?.id)) return 1;
    if (isTrashCategoryId(category?.id)) return 2;
    return 3;
  }

  function renderChooserTree(list, nodes, depth, query = "") {
    nodes.forEach((category) => {
      const matchesQuery = !query || categoryMatchesQuery(category, query);
      const hasMatchingDescendant = Boolean(query && categoryHasMatchingDescendant(category, query));
      if (query && !matchesQuery && !hasMatchingDescendant) return;
      const expandForQuery = Boolean(query && (matchesQuery || hasMatchingDescendant));
      const row = document.createElement("div");
      row.className = "mcp-category-tree-row";
      row.style.setProperty("--depth", String(depth));
      row.dataset.categoryId = category.id;
      row.dataset.parentId = category.parentId || "";
      const canDrag = pendingChooserType === "dev"
        ? !category.isDefault && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id)
        : !category.isDefault && !category.isSystem && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id);
      row.draggable = canDrag;
      row.addEventListener("dragstart", (event) => startChooserCategoryDrag(event, category));
      row.addEventListener("dragover", handleChooserCategoryDragOver);
      row.addEventListener("dragleave", handleChooserCategoryDragLeave);
      row.addEventListener("drop", (event) => handleChooserCategoryDrop(event, category));
      row.addEventListener("dragend", handleChooserCategoryDragEnd);

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "mcp-category-toggle";
      toggle.dataset.toggleCategoryId = category.id;
      toggle.textContent = category.children?.length ? (chooserExpandedCategories.has(category.id) || expandForQuery ? "v" : ">") : "";

      const choice = createCategoryChoice(category);
      row.append(toggle, choice);
      if (depth === 0 && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id) && (pendingChooserType === "dev" || !category.isDefault)) {
        const addSub = document.createElement("button");
        addSub.type = "button";
        addSub.className = "mcp-add-sub";
        addSub.dataset.action = "add-subcategory";
        addSub.dataset.parentId = category.id;
        addSub.textContent = "+";
        addSub.title = tr("categories.createSubcategory");
        addSub.setAttribute("aria-label", tr("categories.createSubcategory"));
        row.appendChild(addSub);
      }
      list.appendChild(row);

      if ((chooserExpandedCategories.has(category.id) || expandForQuery) && category.children?.length) {
        renderChooserTree(list, category.children, depth + 1, query);
      }
    });
  }

  function categoryHasMatchingDescendant(category, query = "") {
    return Boolean(category?.children?.some((child) => categoryMatchesQuery(child, query) || categoryHasMatchingDescendant(child, query)));
  }

  function addCategorySection(list, title, categories) {
    const label = document.createElement("span");
    label.className = "mcp-category-section";
    label.textContent = title;
    list.appendChild(label);
    categories.forEach((category) => {
      list.appendChild(createCategoryChoice(category));
    });
  }

  function createCategoryChoice(category) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mcp-category-choice";
    button.dataset.categoryId = category.id;
    button.draggable = category.id !== "favorite" && (pendingChooserType === "dev"
      ? !category.isDefault && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id)
      : !category.isDefault && !category.isSystem && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id));
    button.addEventListener("dragstart", (event) => startChooserCategoryDrag(event, category));
    button.addEventListener("dragover", handleChooserCategoryDragOver);
    button.addEventListener("dragleave", handleChooserCategoryDragLeave);
    button.addEventListener("drop", (event) => handleChooserCategoryDrop(event, category));
    button.addEventListener("dragend", handleChooserCategoryDragEnd);
    const dot = document.createElement("span");
    let icon = null;
    if (category.id === "favorite" || isFavoriteCategoryId(category.id)) {
      dot.className = "category-heart";
      dot.textContent = "\u2665";
      dot.style.backgroundColor = "transparent";
      icon = dot;
    } else if (isTrashCategoryId(category.id)) {
      icon = createTrashCategoryIcon();
    } else if (isVaultCategoryId(category.id)) {
      icon = createVaultCategoryIcon();
    } else {
      dot.className = "category-dot";
      if (!category.parentId) icon = dot;
    }
    const count = categoryCountNode(category.id, pendingChooserType);
    const name = document.createElement("span");
    name.textContent = categoryLabel(category);
    if (icon) button.appendChild(icon);
    if (isTrashCategoryId(category.id) && !canUseTrashManagement()) button.appendChild(createCategoryProBadge());
    if (isVaultCategoryId(category.id) && !canUseVault()) button.appendChild(createCategoryProBadge());
    button.appendChild(name);
    if (count) button.appendChild(count);
    return button;
  }

  function createCategoryProBadge() {
    const img = document.createElement("img");
    img.className = "category-pro-badge";
    img.src = chrome.runtime.getURL("assets/icons/pro-icon.png");
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    return img;
  }

  function createTrashCategoryIcon() {
    const img = document.createElement("img");
    img.className = "category-button-trash";
    img.src = chrome.runtime.getURL(`assets/icons/${themedIconName("erase.png")}`);
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    return img;
  }

  function createVaultCategoryIcon() {
    const img = document.createElement("img");
    img.className = "category-button-vault";
    const suffix = resolvedThemeForIcons() === "light" ? "lightmod" : "darkmod";
    img.src = chrome.runtime.getURL(`assets/icons/locker-${suffix}.png`);
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    return img;
  }

  function categoryCountNode(categoryId, mediaType = pendingChooserType) {
    const categories = mediaType === "image" ? state.imageCategories : mediaType === "dev" ? state.devCategories || [] : state.categories;
    const items = mediaType === "image" ? state.imageItems : mediaType === "dev" ? state.devItems || [] : state.items;
    const count = globalThis.MCP.createCategoryItemCountMap(categories, items).get(categoryId) || 0;
    if (count <= 0) return null;
    const span = document.createElement("span");
    span.className = "category-count";
    span.textContent = `(${count})`;
    return span;
  }

  function startChooserCategoryDrag(event, category) {
    if (!event?.dataTransfer || !category || category.id === "favorite") return;
    if (isGeneralCategoryId(category.id)) return;
    if (isFavoriteCategoryId(category.id)) return;
    if (isTrashCategoryId(category.id)) return;
    if (pendingChooserType !== "dev" && (category.isDefault || category.isSystem)) return;
    if (pendingChooserType === "dev" && category.isDefault) return;
    chooserDragState = { id: category.id, parentId: category.parentId || null };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", category.id);
    event.currentTarget.classList.add("is-dragging");
    setCategoryDragImage(event);
  }

  function handleChooserCategoryDragOver(event) {
    if (!chooserDragState) return;
    const targetId = event.currentTarget?.dataset?.categoryId || event.currentTarget?.dataset?.editorCategoryId || "";
    if (isGeneralCategoryId(targetId) || isFavoriteCategoryId(targetId) || isTrashCategoryId(targetId)) {
      clearAllCategoryDragMarkers();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
      return;
    }
    event.preventDefault();
    markCategoryDropTarget(event.currentTarget, getDropPosition(event));
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  }

  function handleChooserCategoryDragLeave(event) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    clearCategoryDropMarkers(event.currentTarget);
  }

  async function handleChooserCategoryDrop(event, targetCategory) {
    event.preventDefault();
    const dropPosition = event.currentTarget.dataset.dropPosition || getDropPosition(event);
    clearCategoryDropMarkers(event.currentTarget);
    if (isGeneralCategoryId(targetCategory?.id) || isFavoriteCategoryId(targetCategory?.id) || isTrashCategoryId(targetCategory?.id)) {
      chooserDragState = null;
      return;
    }
    if (!chooserDragState) {
      chooserDragState = null;
      return;
    }
    const sourceId = chooserDragState.id;
    const categories = pendingChooserType === "image" ? state.imageCategories : pendingChooserType === "dev" ? state.devCategories : state.categories;
    const source = categories.find((category) => category.id === sourceId);
    if (!source || source.id === targetCategory.id) {
      chooserDragState = null;
      return;
    }
    const parentId = targetCategory.parentId || null;
    if ((source.parentId || null) !== parentId) {
      chooserDragState = null;
      return;
    }
    const siblings = categories
      .filter((category) => (category.parentId || null) === parentId)
      .sort((left, right) => (left.order || 0) - (right.order || 0) || categoryLabel(left).localeCompare(categoryLabel(right), lang(), { sensitivity: "base" }));
    const orderedIds = siblings.map((category) => category.id).filter((id) => id !== source.id);
    const targetIndex = orderedIds.indexOf(targetCategory.id);
    const insertBefore = dropPosition === "before";
    orderedIds.splice(Math.max(0, targetIndex + (insertBefore ? 0 : 1)), 0, source.id);
    try {
      if (pendingChooserType === "dev") await globalThis.MCP.reorderDevCategories(parentId, orderedIds);
      else if (pendingChooserType === "image") await globalThis.MCP.reorderImageCategories(parentId, orderedIds);
      else await globalThis.MCP.reorderCategories(parentId, orderedIds);
      await refreshState();
      renderCategoryChooser();
      showToast(tr("categories.reordered"));
    } catch (error) {
      showToast(error?.message || tr("common.error"));
    } finally {
      chooserDragState = null;
      clearAllCategoryDragMarkers();
    }
  }

  function handleChooserCategoryDragEnd(event) {
    event.currentTarget.classList.remove("is-dragging");
    chooserDragState = null;
    clearAllCategoryDragMarkers();
  }

  function getDropPosition(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2 ? "before" : "after";
  }

  function markCategoryDropTarget(node, position) {
    clearAllCategoryDropTargets();
    node.dataset.dropPosition = position;
    node.classList.add("is-drop-target", position === "before" ? "is-drop-before" : "is-drop-after");
  }

  function clearCategoryDropMarkers(node) {
    node.classList.remove("is-drop-target", "is-drop-before", "is-drop-after");
    delete node.dataset.dropPosition;
  }

  function clearAllCategoryDropTargets() {
    shadowRoot?.querySelectorAll(".is-drop-target, .is-drop-before, .is-drop-after").forEach(clearCategoryDropMarkers);
  }

  function clearAllCategoryDragMarkers() {
    shadowRoot?.querySelectorAll(".is-dragging").forEach((node) => node.classList.remove("is-dragging"));
    clearAllCategoryDropTargets();
  }

  function setCategoryDragImage(event) {
    const source = event.currentTarget.closest(".mcp-category-tree-row, .mcp-category-choice, .manager-category-row, .manager-category-choice") || event.currentTarget;
    const clone = source.cloneNode(true);
    clone.classList.add("category-drag-preview");
    clone.style.width = `${source.getBoundingClientRect().width}px`;
    clone.style.position = "fixed";
    clone.style.top = "-1000px";
    clone.style.left = "-1000px";
    clone.style.pointerEvents = "none";
    clone.style.display = "grid";
    clone.style.alignItems = "center";
    clone.style.borderRadius = "12px";
    clone.style.background = "var(--ucp-panel, #141414)";
    clone.style.color = "var(--ucp-text, #fff)";
    clone.style.outline = `2px solid ${state.settings?.accentColor || "#e50914"}`;
    clone.style.opacity = "0.94";
    document.body.appendChild(clone);
    event.dataTransfer.setDragImage(clone, Math.min(28, clone.offsetWidth / 2), Math.min(24, clone.offsetHeight / 2));
    window.setTimeout(() => clone.remove(), 0);
  }

  function isFavoriteCategoryId(id) {
    return id === "favorites" || id === "image-favorites" || id === "dev-favorites";
  }

  function isTrashCategoryId(id) {
    return id === "trash" || id === "image-trash" || id === "dev-trash";
  }

  function isVaultCategoryId(id) {
    return globalThis.MCP.isVaultCategoryId ? globalThis.MCP.isVaultCategoryId(id) : id === "vault" || id === "image-vault" || id === "dev-vault";
  }

  function canUseVault() {
    return globalThis.MCP.canUseFeature ? globalThis.MCP.canUseFeature("vault", state.settings) : true;
  }

  async function ensureVaultUnlocked() {
    if (vaultSessionUnlocked) return true;
    const configured = await globalThis.MCP.isVaultConfigured?.();
    return openVaultModal(Boolean(configured));
  }

  const VAULT_SECRET_QUESTION_IDS = Array.from({ length: 30 }, (_, index) => `vault.secretQuestion.${String(index + 1).padStart(2, "0")}`);

  function openVaultModal(configured) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "mcp-vault-modal";
      const card = document.createElement("section");
      card.className = "mcp-vault-card";
      card.setAttribute("role", "dialog");
      card.setAttribute("aria-modal", "true");
      const header = document.createElement("header");
      const title = document.createElement("h2");
      const dialogTitle = tr(configured ? "vault.unlockTitle" : "vault.setTitle");
      setVaultModalTitle(title, dialogTitle);
      card.setAttribute("aria-label", dialogTitle);
      const close = document.createElement("button");
      close.type = "button";
      close.className = "mcp-close";
      close.setAttribute("aria-label", tr("common.close"));
      close.innerHTML = "&times;";
      header.append(title, close);
      const info = document.createElement("p");
      info.className = "mcp-vault-info";
      info.textContent = tr("vault.localOnly");
      const fields = document.createElement("div");
      fields.className = "mcp-vault-fields";
      const password = vaultPasswordField(configured ? "vault.password" : "vault.newPassword", { showRequirement: !configured });
      fields.appendChild(password.wrap);
      let confirmField = null;
      let secretQuestion = null;
      let secretAnswer = null;
      if (!configured) {
        confirmField = vaultPasswordField("vault.confirmPassword");
        secretQuestion = vaultSecretQuestionField();
        secretAnswer = vaultPasswordField("vault.secretAnswer");
        fields.append(confirmField.wrap, secretQuestion.wrap, secretAnswer.wrap);
      }
      const error = document.createElement("p");
      error.className = "mcp-vault-error";
      error.setAttribute("role", "alert");
      error.setAttribute("aria-live", "polite");
      const actions = document.createElement("div");
      actions.className = "mcp-vault-actions";
      const forgot = document.createElement("button");
      forgot.type = "button";
      forgot.textContent = tr("vault.forgotPassword");
      const reset = document.createElement("button");
      reset.type = "button";
      reset.textContent = tr("vault.resetPassword");
      const primary = document.createElement("button");
      primary.type = "button";
      primary.className = "primary";
      primary.textContent = tr(configured ? "vault.unlock" : "vault.createPassword");
      if (configured) actions.append(forgot, reset);
      actions.appendChild(primary);
      card.append(header, info, fields, error, actions);
      overlay.appendChild(card);
      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      close.addEventListener("click", () => finish(false));
      overlay.addEventListener("click", (event) => {
        if (event.target === overlay) finish(false);
      });
      primary.addEventListener("click", async () => {
        try {
          error.textContent = "";
          if (!configured && password.input.value.length < 8) {
            password.wrap.classList.add("is-invalid");
            password.help?.classList.add("is-error");
            password.input.focus();
            return;
          }
          if (!configured && password.input.value !== confirmField.input.value) {
            error.textContent = tr("vault.passwordMismatch");
            return;
          }
          if (configured) {
            const ok = await globalThis.MCP.verifyVaultPassword(password.input.value);
            if (!ok) {
              error.textContent = tr("vault.invalidPassword");
              return;
            }
          } else {
            await globalThis.MCP.setVaultPassword(password.input.value, {
              questionId: secretQuestion.select.value,
              answer: secretAnswer.input.value
            });
          }
          vaultSessionUnlocked = true;
          showToast(tr(configured ? "vault.unlocked" : "vault.created"));
          finish(true);
        } catch (errorValue) {
          error.textContent = errorValue?.messageKey ? tr(errorValue.messageKey) : (errorValue?.message || tr("common.error"));
        }
      });
      forgot.addEventListener("click", async () => {
        const recovered = await openVaultRecoveryModal();
        if (!recovered) return;
        vaultSessionUnlocked = true;
        showToast(tr("vault.recoveryUnlocked"));
        finish(true);
      });
      reset.addEventListener("click", async () => {
        const confirmed = await openVaultResetConfirm();
        if (!confirmed) return;
        await globalThis.MCP.resetVaultPasswordAndItems();
        vaultSessionUnlocked = false;
        scheduleFloatingRefresh();
        showToast(tr("vault.resetDone"));
        finish(false);
      });
      shadowRoot.appendChild(overlay);
      password.input.focus();
    });
  }

  function vaultSecretQuestionField() {
    const wrap = document.createElement("label");
    const span = document.createElement("span");
    span.textContent = tr("vault.secretQuestion");
    const select = document.createElement("select");
    VAULT_SECRET_QUESTION_IDS.forEach((key, index) => {
      const option = document.createElement("option");
      option.value = String(index + 1);
      option.textContent = tr(key);
      select.appendChild(option);
    });
    wrap.append(span, select);
    return { wrap, select };
  }

  function openVaultRecoveryModal() {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "mcp-vault-modal is-nested";
      const card = vaultNestedCard(tr("vault.recoveryTitle"));
      const info = document.createElement("p");
      info.className = "mcp-vault-info";
      info.textContent = tr("vault.recoveryText");
      const fields = document.createElement("div");
      fields.className = "mcp-vault-fields";
      const question = vaultSecretQuestionField();
      const answer = vaultPasswordField("vault.secretAnswer");
      fields.append(question.wrap, answer.wrap);
      const error = document.createElement("p");
      error.className = "mcp-vault-error";
      const actions = document.createElement("div");
      actions.className = "mcp-vault-actions";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = tr("common.cancel");
      const primary = document.createElement("button");
      primary.type = "button";
      primary.className = "primary";
      primary.textContent = tr("vault.unlock");
      actions.append(cancel, primary);
      card.append(info, fields, error, actions);
      overlay.appendChild(card);
      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      card.querySelector("[data-role='vault-nested-close']")?.addEventListener("click", () => finish(false));
      cancel.addEventListener("click", () => finish(false));
      primary.addEventListener("click", async () => {
        try {
          error.textContent = "";
          const authorizationToken = await globalThis.MCP.verifyVaultRecovery(question.select.value, answer.input.value);
          if (!authorizationToken) {
            error.textContent = tr("vault.recoveryFailed");
            showToast(tr("vault.recoveryFailed"));
            return;
          }
          const changed = await openVaultRecoveryPasswordModal(question.select.value, answer.input.value, authorizationToken);
          if (changed) finish(true);
        } catch (errorValue) {
          error.textContent = errorValue?.message || tr("common.error");
        }
      });
      shadowRoot.appendChild(overlay);
      question.select.focus();
    });
  }

  function openVaultRecoveryPasswordModal(questionId, answerValue, authorizationToken) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "mcp-vault-modal is-nested";
      const card = vaultNestedCard(tr("vault.changePasswordTitle"));
      const info = document.createElement("p");
      info.className = "mcp-vault-info";
      info.textContent = tr("vault.changePasswordText");
      const fields = document.createElement("div");
      fields.className = "mcp-vault-fields";
      const password = vaultPasswordField("vault.newPassword", { showRequirement: true });
      const confirmField = vaultPasswordField("vault.confirmPassword");
      fields.append(password.wrap, confirmField.wrap);
      const error = document.createElement("p");
      error.className = "mcp-vault-error";
      error.setAttribute("role", "alert");
      error.setAttribute("aria-live", "polite");
      const actions = document.createElement("div");
      actions.className = "mcp-vault-actions";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = tr("common.cancel");
      const primary = document.createElement("button");
      primary.type = "button";
      primary.className = "primary";
      primary.textContent = tr("vault.changePassword");
      actions.append(cancel, primary);
      card.append(info, fields, error, actions);
      overlay.appendChild(card);
      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      card.querySelector("[data-role='vault-nested-close']")?.addEventListener("click", () => finish(false));
      cancel.addEventListener("click", () => finish(false));
      primary.addEventListener("click", async () => {
        try {
          error.textContent = "";
          if (password.input.value.length < 8) {
            password.wrap.classList.add("is-invalid");
            password.help?.classList.add("is-error");
            password.input.focus();
            return;
          }
          if (password.input.value !== confirmField.input.value) {
            error.textContent = tr("vault.passwordMismatch");
            return;
          }
          await globalThis.MCP.setVaultPassword(password.input.value, {
            questionId,
            answer: answerValue,
            authorizationToken
          });
          showToast(tr("vault.passwordUpdated"));
          finish(true);
        } catch (errorValue) {
          error.textContent = errorValue?.messageKey ? tr(errorValue.messageKey) : (errorValue?.message || tr("common.error"));
        }
      });
      shadowRoot.appendChild(overlay);
      password.input.focus();
    });
  }

  function openVaultResetConfirm() {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "mcp-vault-modal is-nested";
      const card = vaultNestedCard(tr("vault.resetConfirmTitle"));
      const info = document.createElement("p");
      info.className = "mcp-vault-info";
      info.textContent = tr("vault.resetWarning");
      const actions = document.createElement("div");
      actions.className = "mcp-vault-actions";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = tr("common.cancel");
      const primary = document.createElement("button");
      primary.type = "button";
      primary.className = "primary";
      primary.textContent = tr("vault.confirmReset");
      actions.append(cancel, primary);
      card.append(info, actions);
      overlay.appendChild(card);
      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      card.querySelector("[data-role='vault-nested-close']")?.addEventListener("click", () => finish(false));
      cancel.addEventListener("click", () => finish(false));
      primary.addEventListener("click", () => finish(true));
      shadowRoot.appendChild(overlay);
      primary.focus();
    });
  }

  function vaultNestedCard(titleText) {
    const card = document.createElement("section");
    card.className = "mcp-vault-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    const header = document.createElement("header");
    const title = document.createElement("h2");
    setVaultModalTitle(title, titleText);
    card.setAttribute("aria-label", titleText);
    const close = document.createElement("button");
    close.type = "button";
    close.className = "mcp-close";
    close.dataset.role = "vault-nested-close";
    close.setAttribute("aria-label", tr("common.close"));
    close.innerHTML = "&times;";
    header.append(title, close);
    card.appendChild(header);
    return card;
  }

  function setVaultModalTitle(title, text) {
    title.className = "mcp-vault-title";
    const icon = document.createElement("img");
    icon.className = "mcp-vault-title-icon";
    const suffix = resolvedThemeForIcons() === "light" ? "lightmod" : "darkmod";
    icon.src = chrome.runtime.getURL(`assets/icons/locker-${suffix}.png`);
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.textContent = text;
    title.replaceChildren(icon, label);
  }

  function vaultPasswordField(labelKey, { showRequirement = false } = {}) {
    const wrap = document.createElement("label");
    const span = document.createElement("span");
    span.textContent = tr(labelKey);
    const input = document.createElement("input");
    input.type = "password";
    input.autocomplete = showRequirement || labelKey === "vault.confirmPassword" ? "new-password" : "current-password";
    if (showRequirement || labelKey === "vault.confirmPassword") input.minLength = 8;
    wrap.append(span, input);
    let help = null;
    if (showRequirement) {
      help = document.createElement("small");
      help.className = "mcp-vault-field-help";
      help.textContent = tr("vault.passwordTooShort");
      wrap.appendChild(help);
      input.addEventListener("input", () => {
        wrap.classList.remove("is-invalid");
        help.classList.remove("is-error");
      });
    }
    return { wrap, input, help };
  }

  function isGeneralCategoryId(id) {
    return id === "general" || id === "image-general" || id === "dev-general";
  }

  function categoryMatchesQuery(category, query) {
    return normalize([category.name, ...(category.keywords || [])].join(" ")).includes(query);
  }

  function categoryPath(category, mediaType = "text") {
    const byId = new Map((mediaType === "image" ? state.imageCategories : mediaType === "dev" ? state.devCategories : state.categories).map((item) => [item.id, item]));
    const parts = [categoryLabel(category)];
    let parent = byId.get(category.parentId);
    while (parent) {
      parts.unshift(categoryLabel(parent));
      parent = byId.get(parent.parentId);
    }
    return parts.join(" > ");
  }

  function itemCategoryPath(item) {
    const category = state.categories.find((current) => current.id === item.categoryId);
    return category ? categoryPath(category) : item.categoryName;
  }

  function showDevSuggestion(item, detection = {}, options = {}) {
    const modal = shadowRoot?.querySelector("[data-role='dev-suggestion']");
    if (!modal || !item) return;
    pendingDevSuggestionItem = item;
    pendingDevSuggestionIsDuplicate = !!options.duplicate;
    modal.dataset.stage = "initial";
    modal.dataset.duplicate = pendingDevSuggestionIsDuplicate ? "true" : "false";
    const language = detection.languageName || item.languageName || item.categoryName || "General";
    const probability = Math.max(0, Math.min(100, Math.round(Number(detection.confidence || item.detectionConfidence || 0) * 100)));
    modal.querySelector("[data-role='dev-suggestion-title']").textContent = tr("dev.suggestionTitle");
    animateDevMatch(modal, probability, language);
    modal.querySelector("[data-role='dev-suggestion-preview']").textContent = String(item.content || "");
    modal.querySelector("[data-action='accept-dev-suggestion']").textContent = tr("dev.acceptSuggestion", { language });
    const other = modal.querySelector("[data-action='choose-dev-language']");
    if (other) {
      other.hidden = false;
      other.textContent = tr("dev.otherLanguage");
    }
    const asText = modal.querySelector("[data-action='capture-dev-as-text']");
    if (asText) {
      asText.hidden = false;
      asText.textContent = tr("dev.captureAsText");
    }
    modal.querySelector("[data-action='reject-dev-suggestion']").textContent = tr("dev.rejectSuggestion");
    modal.hidden = false;
  }

  function animateDevMatch(modal, probability, language) {
    window.clearTimeout(devMatchAnimationTimer);
    const match = modal.querySelector("[data-role='dev-match']");
    const fill = modal.querySelector("[data-role='dev-match-fill']");
    const value = modal.querySelector("[data-role='dev-match-value']");
    const languageNode = modal.querySelector("[data-role='dev-match-language']");
    const prompt = modal.querySelector("[data-role='dev-suggestion-text']");
    const actions = [...modal.querySelectorAll("footer button")];
    const primaryAction = modal.querySelector("[data-action='accept-dev-suggestion']");
    if (!match || !fill || !value || !languageNode || !prompt) return;
    match.hidden = false;
    match.setAttribute("aria-label", tr("dev.matchScore"));
    match.setAttribute("aria-valuenow", String(probability));
    modal.querySelector("[data-role='dev-match-label']").textContent = tr("dev.matchScore");
    fill.style.setProperty("--mcp-dev-match", "0%");
    value.textContent = "0%";
    languageNode.textContent = "";
    languageNode.classList.remove("is-revealed");
    prompt.textContent = "";
    actions.forEach((button) => { button.disabled = true; });
    if (primaryAction) primaryAction.hidden = true;
    const startedAt = performance.now();
    const duration = 900;
    const update = (now) => {
      if (modal.hidden) return;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(probability * eased);
      value.textContent = `${current}%`;
      fill.style.setProperty("--mcp-dev-match", `${current}%`);
      if (progress < 1) {
        requestAnimationFrame(update);
        return;
      }
      languageNode.textContent = language;
      languageNode.classList.add("is-revealed");
      prompt.textContent = tr("dev.suggestionText", { language });
      if (primaryAction) primaryAction.hidden = false;
      actions.forEach((button) => { button.disabled = false; });
    };
    requestAnimationFrame(update);
    devMatchAnimationTimer = window.setTimeout(() => {
      if (!prompt.textContent) {
        languageNode.textContent = language;
        languageNode.classList.add("is-revealed");
        prompt.textContent = tr("dev.suggestionText", { language });
        if (primaryAction) primaryAction.hidden = false;
        actions.forEach((button) => { button.disabled = false; });
      }
    }, duration + 120);
  }

  function showDevAsTextPrompt(item) {
    const modal = shadowRoot?.querySelector("[data-role='dev-suggestion']");
    if (!modal || !item) return;
    pendingDevSuggestionItem = item;
    const match = modal.querySelector("[data-role='dev-match']");
    if (match) match.hidden = true;
    modal.querySelectorAll("footer button").forEach((button) => { button.disabled = false; });
    modal.dataset.stage = "text-choice";
    modal.querySelector("[data-role='dev-suggestion-title']").textContent = tr("dev.captureAsTextTitle");
    modal.querySelector("[data-role='dev-suggestion-text']").textContent = tr("dev.captureAsTextText");
    modal.querySelector("[data-role='dev-suggestion-preview']").textContent = String(item.content || "");
    const primary = modal.querySelector("[data-action='accept-dev-suggestion'], [data-action='choose-dev-subcategory'], [data-action='capture-dev-text-general']");
    const other = modal.querySelector("[data-action='choose-dev-language'], [data-action='capture-dev-text-classify']");
    const asText = modal.querySelector("[data-action='capture-dev-as-text']");
    const secondary = modal.querySelector("[data-action='reject-dev-suggestion'], [data-action='keep-dev-root']");
    if (primary) {
      primary.dataset.action = "capture-dev-text-general";
      primary.textContent = tr("dev.captureTextGeneral");
    }
    if (other) {
      other.hidden = false;
      other.dataset.action = "capture-dev-text-classify";
      other.textContent = tr("dev.captureTextClassify");
    }
    if (asText) asText.hidden = true;
    if (secondary) {
      secondary.dataset.action = "reject-dev-suggestion";
      secondary.textContent = tr("common.cancel");
    }
    modal.hidden = false;
  }

  async function captureDevSuggestionAsText(item, options = {}) {
    if (!item?.content) return;
    const response = await safeRuntimeMessage({
      type: MESSAGE_TYPES.FORCE_TEXT_CAPTURE,
      payload: {
        content: item.content,
        sourceUrl: item.sourceUrl || "",
        sourceTitle: item.sourceTitle || "",
        removeDevItemId: item.pendingCapture ? "" : item.id
      }
    }).catch((error) => ({ ok: false, error: error.message || String(error) }));
    const textItem = response?.data?.item;
    if (!response?.ok || !textItem) {
      if (response?.data?.reason === "free-capture-limit") {
        openFloatingCaptureLimitModal(response.data.mediaType || "text", response.data.limit || 5);
        return;
      }
      showToast(tr("common.error"));
      return;
    }
    pendingDevSuggestionItem = null;
    activeFloatingTab = "text";
    await refreshState().catch(() => {});
    if (options.classify) {
      showCategoryChooser(textItem, "text");
      showToast(tr("dev.captureTextClassifyToast"));
    } else {
      revealFloatingPanel({ afterCopy: true, itemId: textItem.id, mediaType: "text" });
      showToast(tr("dev.capturedAsTextGeneral"));
    }
  }

  function showDevSubcategoryPrompt(item) {
    const modal = shadowRoot?.querySelector("[data-role='dev-suggestion']");
    if (!modal || !item) return;
    pendingDevSuggestionItem = item;
    const match = modal.querySelector("[data-role='dev-match']");
    if (match) match.hidden = true;
    modal.querySelectorAll("footer button").forEach((button) => { button.disabled = false; });
    modal.dataset.stage = "subcategory";
    const category = (state.devCategories || []).find((current) => current.id === (item.categoryId || item.languageId));
    const language = category ? categoryLabel(category) : item.languageName || item.categoryName || "General";
    modal.querySelector("[data-role='dev-suggestion-title']").textContent = tr("dev.subcategoryPromptTitle");
    modal.querySelector("[data-role='dev-suggestion-text']").textContent = tr("dev.subcategoryPromptText", { language });
    modal.querySelector("[data-role='dev-suggestion-preview']").textContent = String(item.content || "");
    const primary = modal.querySelector("[data-action='accept-dev-suggestion']");
    const secondary = modal.querySelector("[data-action='reject-dev-suggestion']");
    const other = modal.querySelector("[data-action='choose-dev-language']");
    const asText = modal.querySelector("[data-action='capture-dev-as-text']");
    primary.dataset.action = "keep-dev-root";
    primary.textContent = tr("dev.keepRoot");
    if (other) other.hidden = true;
    if (asText) asText.hidden = true;
    secondary.dataset.action = "choose-dev-subcategory";
    secondary.textContent = tr("dev.chooseSubcategory");
    modal.hidden = false;
  }

  function closeDevSuggestion(options = {}) {
    const modal = shadowRoot?.querySelector("[data-role='dev-suggestion']");
    if (modal) {
      window.clearTimeout(devMatchAnimationTimer);
      modal.hidden = true;
      modal.dataset.stage = "";
      modal.dataset.duplicate = "false";
      const footerButtons = [...modal.querySelectorAll("footer button")];
      const [primary, other, asText, secondary] = footerButtons;
      if (primary) primary.dataset.action = "accept-dev-suggestion";
      if (secondary) secondary.dataset.action = "reject-dev-suggestion";
      if (other) {
        other.dataset.action = "choose-dev-language";
        other.hidden = false;
      }
      if (asText) asText.hidden = false;
    }
    if (!options.keepItem) {
      pendingDevSuggestionItem = null;
      pendingDevSuggestionIsDuplicate = false;
    }
  }

  function finalizeDevSuggestionAtRoot(item, options = {}) {
    if (item?.pendingCapture) {
      closeDevSuggestion();
      commitPendingDevSuggestion(item, {}, tr("dev.saved"), options);
      return;
    }
    closeDevSuggestion();
    clearDevCaptureDedupe();
    if (!item?.id) return;
    activeFloatingTab = "dev";
    refreshState().then(() => {
      renderPanel();
      if (options.reveal !== false) {
        revealFloatingPanel({ afterCopy: true, itemId: item.id, mediaType: "dev" });
      }
    }).catch(() => {
      renderPanel();
      if (options.reveal !== false) {
        revealFloatingPanel({ afterCopy: true, itemId: item.id, mediaType: "dev" });
      }
    });
    if (options.toast !== false) showToast(tr("dev.saved"));
  }

  function cancelOrCloseDevSuggestion() {
    const modal = shadowRoot?.querySelector("[data-role='dev-suggestion']");
    const item = pendingDevSuggestionItem;
    const stage = modal?.dataset.stage || "";
    const isDuplicateSuggestion = pendingDevSuggestionIsDuplicate || modal?.dataset.duplicate === "true";
    const shouldCancelCapture = stage === "initial" || stage === "subcategory";
    closeDevSuggestion();
    if (!shouldCancelCapture || !item?.id) return;
    clearDevCaptureDedupe();
    if (item.pendingCapture) return;
    if (isDuplicateSuggestion) {
      scheduleFloatingRefresh();
      return;
    }
    safeRuntimeMessage({ type: MESSAGE_TYPES.DELETE_DEV_ITEM, itemId: item.id })
      .then(() => {
        scheduleFloatingRefresh();
      })
      .catch(() => {});
  }

  function devCategoryPath(item) {
    const category = (state.devCategories || []).find((current) => current.id === item.categoryId);
    return category ? categoryPath(category, "dev") : item.categoryName;
  }

  function imageCategoryPath(item) {
    const category = state.imageCategories.find((current) => current.id === item.categoryId);
    return category ? categoryPath(category, "image") : item.categoryName;
  }

  function chooserCategories() {
    return pendingChooserType === "image" ? state.imageCategories : pendingChooserType === "dev" ? state.devCategories || [] : state.categories;
  }

  function categoryLabel(category) {
    return globalThis.MCP.translateCategoryName(category, lang());
  }

  function showSubcategoryCreator() {
    const wrapper = shadowRoot.querySelector("[data-role='create-sub']");
    const input = shadowRoot.querySelector("[data-role='subcategory-name']");
    const parent = chooserCategories().find((category) => category.id === pendingSubcategoryParentId);
    if (!wrapper || !input || !parent || isGeneralCategoryId(parent.id) || isFavoriteCategoryId(parent.id) || isTrashCategoryId(parent.id)) return;
    wrapper.hidden = false;
    input.value = "";
    input.placeholder = `${tr("categories.createSubcategory")} - ${categoryPath(parent, pendingChooserType)}`;
    input.focus();
  }

  function hideSubcategoryCreator() {
    const wrapper = shadowRoot?.querySelector("[data-role='create-sub']");
    if (wrapper) wrapper.hidden = true;
  }

  async function createAndAssignSubcategory(input) {
    const name = String(input?.value || "").trim();
    const parent = chooserCategories().find((category) => category.id === pendingSubcategoryParentId);
    if (!name || !parent || isGeneralCategoryId(parent.id) || isFavoriteCategoryId(parent.id) || isTrashCategoryId(parent.id) || !pendingChooserItem) return;
    if (name.length > 20) {
      showToast(tr("categories.maxLength"));
      return;
    }
    try {
      const response = await safeRuntimeMessage({
        type: pendingChooserType === "image" ? MESSAGE_TYPES.CREATE_IMAGE_CATEGORY : pendingChooserType === "dev" ? MESSAGE_TYPES.CREATE_DEV_CATEGORY : MESSAGE_TYPES.CREATE_CATEGORY,
        category: {
          name,
          parentId: parent.id,
          icon: "folder",
          color: parent.color || state.settings?.accentColor || "#e50914"
        }
      });
      if (!response?.ok) throw new Error(response?.error || tr("categories.createFailed"));
      const responseCategories = pendingChooserType === "image" ? response?.data?.imageCategories : pendingChooserType === "dev" ? response?.data?.devCategories : response?.data?.categories;
      if (pendingChooserType === "image" && response?.data?.imageCategories) {
        state.imageCategories = response.data.imageCategories;
      } else if (pendingChooserType === "dev" && response?.data?.devCategories) {
        state.devCategories = response.data.devCategories;
      } else if (response?.data?.categories) {
        state.categories = response.data.categories;
      }
      const created = responseCategories?.find((category) => category.parentId === parent.id && category.name === name);
      if (!created) throw new Error(tr("categories.createFailed"));
      const updates = {
        categoryId: created.id,
        categoryName: created.name
      };
      const feedback = tr("categories.classifiedIn", { path: `${categoryPath(parent, pendingChooserType)} > ${categoryLabel(created)}` });
      if (pendingChooserType === "image") updateImageFromContent(pendingChooserItem.id, updates, feedback);
      else updateTextLikeItemFromContent(pendingChooserType, pendingChooserItem.id, updates, feedback, { revealAfterSave: pendingChooserType === "dev" });
      hideCategoryChooser();
    } catch (error) {
      showToast(tr("categories.createFailed"));
    }
  }

  function updateItemFromContent(itemId, updates, feedback = tr("clipboard.itemUpdated")) {
    suppressFloatingOptimisticRefresh(["mcp_clipboard_items", "mcp_settings"], 1100);
    safeRuntimeMessage({
      type: MESSAGE_TYPES.UPDATE_ITEM,
      itemId,
      updates
    }).then((response) => {
      showToast(feedback);
      if (!applyFloatingMutationResponse(response, "text", itemId, updates)) scheduleFloatingRefresh();
    }).catch(() => {});
  }

  function updateImageFromContent(itemId, updates, feedback = tr("images.updated")) {
    suppressFloatingOptimisticRefresh(["mcp_image_items", "mcp_settings"], 1100);
    safeRuntimeMessage({
      type: MESSAGE_TYPES.UPDATE_IMAGE_ITEM,
      itemId,
      updates
    }).then((response) => {
      showToast(feedback);
      if (!applyFloatingMutationResponse(response, "image", itemId, updates)) scheduleFloatingRefresh();
    }).catch(() => {});
  }

  function readyToPasteToastKey(mediaType = "text") {
    if (mediaType === "image") return "images.readyToPaste";
    if (mediaType === "dev") return "clipboard.codeReadyToPaste";
    return "clipboard.textReadyToPaste";
  }

  function playFloatingReadyPasteFeedback(card) {
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    card.querySelectorAll(":scope > .mcp-ready-paste-shine-layer").forEach((node) => node.remove());
    const layer = document.createElement("span");
    layer.className = "mcp-ready-paste-shine-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.style.setProperty("--mcp-ready-paste-accent", state.settings?.accentColor || "#e50914");
    card.appendChild(layer);
    card.classList.remove("mcp-ready-paste-feedback");
    void card.offsetWidth;
    card.classList.add("mcp-ready-paste-feedback");
    window.setTimeout(() => {
      card.classList.remove("mcp-ready-paste-feedback");
      layer.remove();
    }, 1180);
  }

  function clearFloatingReadyPasteFocus(card) {
    if (!card) return;
    const activeElement = shadowRoot?.activeElement || document.activeElement;
    if (activeElement && card.contains(activeElement) && typeof activeElement.blur === "function") {
      activeElement.blur();
    }
  }

  async function copyFloatingTextLikeItemToClipboard(item, mediaType = "text", feedbackCard = null) {
    try {
      await navigator.clipboard.writeText(item.content);
      const nextUsageCount = (item.usageCount || 0) + 1;
      const nextLastUsedAt = Date.now();
      item.usageCount = nextUsageCount;
      item.lastUsedAt = nextLastUsedAt;
      markFloatingReadyPasteUsageUpdate();
      playFloatingReadyPasteFeedback(feedbackCard);
      window.setTimeout(() => clearFloatingReadyPasteFocus(feedbackCard), 0);
      showToast(tr(readyToPasteToastKey(mediaType)));
      const messageType = mediaType === "dev" ? MESSAGE_TYPES.UPDATE_DEV_ITEM : MESSAGE_TYPES.UPDATE_ITEM;
      safeRuntimeMessage({
        type: messageType,
        itemId: item.id,
        updates: { usageCount: nextUsageCount, lastUsedAt: nextLastUsedAt }
      }).catch(() => {});
    } catch (error) {
      showToast(tr("clipboard.blocked"));
    }
  }

  async function copyImageToClipboard(item, feedbackCard = null) {
    try {
      const blob = await imageItemToBlob(item);
      if (!globalThis.ClipboardItem) throw new Error("ClipboardItem unavailable");
      await navigator.clipboard.write([new ClipboardItem({ [blob.type || "image/png"]: blob })]);
      const nextUsageCount = (item.usageCount || 0) + 1;
      const nextLastUsedAt = Date.now();
      item.usageCount = nextUsageCount;
      item.lastUsedAt = nextLastUsedAt;
      markFloatingReadyPasteUsageUpdate();
      playFloatingReadyPasteFeedback(feedbackCard);
      window.setTimeout(() => clearFloatingReadyPasteFocus(feedbackCard), 0);
      showToast(tr(readyToPasteToastKey("image")));
      safeRuntimeMessage({
        type: MESSAGE_TYPES.UPDATE_IMAGE_ITEM,
        itemId: item.id,
        updates: { usageCount: nextUsageCount, lastUsedAt: nextLastUsedAt }
      }).catch(() => {});
    } catch (error) {
      showToast(tr("images.copyFailed"));
    }
  }

  function updateDevFromContent(itemId, updates, feedback = tr("dev.updated"), options = {}) {
    const pendingItem = options.pendingItem
      || (pendingDevSuggestionItem?.id === itemId ? pendingDevSuggestionItem : null)
      || (pendingChooserItem?.id === itemId ? pendingChooserItem : null);
    if (pendingItem?.pendingCapture) {
      commitPendingDevSuggestion(pendingItem, updates, feedback, options);
      return;
    }
    suppressFloatingOptimisticRefresh("mcp_dev_items", 1100);
    safeRuntimeMessage({
      type: MESSAGE_TYPES.UPDATE_DEV_ITEM,
      itemId,
      updates
    }).then((response) => {
      showToast(feedback);
      clearDevCaptureDedupe();
      if (options.revealAfterSave) {
        if (pendingDevSuggestionItem?.id === itemId) pendingDevSuggestionItem = null;
        activeFloatingTab = "dev";
        const applied = applyFloatingMutationResponse(response, "dev", itemId, updates);
        Promise.resolve(applied || refreshState()).then(() => {
          renderPanel();
          revealFloatingPanel({ afterCopy: true, itemId, mediaType: "dev" });
        }).catch(() => scheduleFloatingRefresh());
      } else {
        if (!applyFloatingMutationResponse(response, "dev", itemId, updates)) scheduleFloatingRefresh();
      }
    }).catch(() => {});
  }

  async function commitPendingDevSuggestion(item, updates = {}, feedback = tr("dev.saved"), options = {}) {
    if (!item?.pendingCapture || !item.content) return;
    const response = await safeRuntimeMessage({
      type: MESSAGE_TYPES.COMMIT_DEV_CAPTURE,
      payload: Object.assign({}, item, updates, {
        id: undefined,
        pendingCapture: undefined,
        codeDetection: {
          isCode: true,
          languageId: updates.languageId || item.languageId,
          languageName: updates.languageName || item.languageName,
          confidence: item.detectionConfidence || 0
        }
      })
    }).catch((error) => ({ ok: false, error: error.message || String(error) }));
    const savedItem = response?.data?.item;
    if (!response?.ok || !savedItem) {
      if (response?.data?.reason === "free-capture-limit") {
        openFloatingCaptureLimitModal(response.data.mediaType || "dev", response.data.limit || 5);
      } else {
        showToast(tr("common.error"));
      }
      return;
    }
    pendingDevSuggestionItem = null;
    pendingDevSuggestionIsDuplicate = false;
    clearDevCaptureDedupe();
    activeFloatingTab = "dev";
    await refreshState().catch(() => {});
    renderPanel();
    if (options.revealAfterSave !== false && options.reveal !== false) {
      revealFloatingPanel({ afterCopy: true, itemId: savedItem.id, mediaType: "dev" });
    }
    if (feedback) showToast(feedback);
  }

  function updateTextLikeItemFromContent(mediaType, itemId, updates, feedback, options = {}) {
    if (mediaType === "dev") updateDevFromContent(itemId, updates, feedback || tr("dev.updated"), options);
    else updateItemFromContent(itemId, updates, feedback || tr("clipboard.itemUpdated"));
  }

  async function downloadImageItem(item) {
    try {
      const blob = await imageItemToBlob(item);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const name = item.imageFileName || fileNameFromUrl(item.originalImageUrl || item.imageUrl) || `ultimate-clipboard-image-${Date.now()}.png`;
      link.href = url;
      link.download = name.includes(".") ? name : `${name}.png`;
      document.documentElement.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1200);
      showToast(tr("images.downloaded"));
    } catch (error) {
      showToast(tr("images.downloadFailed"));
    }
  }

  async function imageItemToBlob(item) {
    const source = item.dataUrl || item.thumbnailUrl || item.imageUrl;
    if (String(source || "").startsWith("data:image/")) {
      return blobToClipboardPng(dataUrlToBlob(source));
    }
    const blob = await fetch(source, { mode: "cors" }).then((response) => {
      if (!response.ok) throw new Error("Image fetch failed.");
      return response.blob();
    }).catch(async () => {
      const response = await safeRuntimeMessage({ type: MESSAGE_TYPES.FETCH_IMAGE_AS_DATA_URL, itemId: item.id, url: item.imageUrl || source });
      if (!response?.ok || !response.data?.dataUrl) throw new Error(response?.error || "Image fetch failed.");
      safeRuntimeMessage({
        type: MESSAGE_TYPES.UPDATE_IMAGE_ITEM,
        itemId: item.id,
        updates: { dataUrl: response.data.dataUrl, thumbnailUrl: response.data.dataUrl }
      }).catch(() => {});
      return dataUrlToBlob(response.data.dataUrl);
    });
    return blobToClipboardPng(blob);
  }

  async function blobToClipboardPng(blob) {
    if (blob.type === "image/png") return blob;
    try {
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext("2d").drawImage(bitmap, 0, 0);
      bitmap.close?.();
      return await new Promise((resolve, reject) => canvas.toBlob((nextBlob) => nextBlob ? resolve(nextBlob) : reject(new Error("PNG conversion failed.")), "image/png"));
    } catch (error) {
      return blobToPngWithImage(blob).catch(() => blob);
    }
  }

  function blobToPngWithImage(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth || image.width;
          canvas.height = image.naturalHeight || image.height;
          canvas.getContext("2d").drawImage(image, 0, 0);
          URL.revokeObjectURL(url);
          canvas.toBlob((nextBlob) => nextBlob ? resolve(nextBlob) : reject(new Error("PNG conversion failed.")), "image/png");
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image decode failed."));
      };
      image.src = url;
    });
  }

  function dataUrlToBlob(dataUrl) {
    const [header, data] = String(dataUrl).split(",");
    const mime = /data:([^;]+)/.exec(header)?.[1] || "image/png";
    const binary = atob(data || "");
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: mime });
  }

  function openSearchOverlay(mediaType = activeFloatingTab) {
    if (!shadowRoot || !currentDisplayAllowed) return;
    closeFloatingPanelForForegroundWindow();
    const overlay = shadowRoot.querySelector("[data-role='search-overlay']");
    if (!overlay) return;
    overlay.hidden = false;
    searchOverlayState.mediaType = mediaType || "text";
    searchOverlayState.selectedIndex = 0;
    translateFloatingUi();
    renderSearchOverlay();
    shadowRoot?.querySelector("[data-role='overlay-query']")?.focus();
  }

  function closeSearchOverlay() {
    const overlay = shadowRoot?.querySelector("[data-role='search-overlay']");
    cancelSearchOverlayRenderJob();
    closeOverlaySearchDateCalendar();
    searchOverlayState.results = [];
    searchOverlaySelectedRow = null;
    searchOverlayVirtualState = null;
    if (overlay) {
      overlay.hidden = true;
      overlay.querySelector("[data-role='overlay-results']")?.replaceChildren();
      overlay.querySelector("[data-role='overlay-detail']")?.replaceChildren();
    }
  }

  function closeFloatingPanelForForegroundWindow() {
    closeFloatingToolWorkspace();
    markFloatingPanelManuallyClosed();
    runSafeAsync(() => setFloatingPanelOpen(false));
  }

  function isSearchOpen() {
    return !shadowRoot?.querySelector("[data-role='search-overlay']")?.hidden;
  }

  function scheduleOverlayRender() {
    clearTimeout(scheduleOverlayRender.timer);
    scheduleOverlayRender.timer = setTimeout(renderSearchOverlay, 120);
  }

  function renderSearchOverlay() {
    if (!shadowRoot || !currentDisplayAllowed) {
      cancelSearchOverlayRenderJob();
      cancelSearchOverlayDetailRender();
      return;
    }
    const resultsNode = shadowRoot.querySelector("[data-role='overlay-results']");
    const detailNode = shadowRoot.querySelector("[data-role='overlay-detail']");
    const filtersNode = shadowRoot.querySelector("[data-role='overlay-filters']");
    if (!resultsNode || !detailNode || !filtersNode) return;
    cancelSearchOverlayRenderJob();
    cancelSearchOverlayDetailRender();
    searchOverlaySelectedRow = null;
    shadowRoot.querySelectorAll("[data-action='set-search-tab']").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tab === searchOverlayState.mediaType);
      button.textContent = button.dataset.tab === "image" ? tr("images.tab") : button.dataset.tab === "dev" ? tr("tabs.dev") : tr("tabs.text");
    });
    renderSearchFilters(filtersNode);
    renderOverlaySearchDateCalendar();
    const results = getOverlayResults();
    searchOverlayState.results = results;
    resultsNode.replaceChildren();
    if (!results.length) {
      const empty = document.createElement("div");
      empty.className = "mcp-overlay-empty";
      empty.textContent = tr("search.noResults");
      resultsNode.appendChild(empty);
      detailNode.textContent = tr("search.trySimple");
      return;
    }
    searchOverlayState.selectedIndex = Math.min(searchOverlayState.selectedIndex, results.length - 1);
    if (searchOverlayState.mediaType === "image") renderImageSearchDetail(results[searchOverlayState.selectedIndex]);
    else renderSearchDetail(results[searchOverlayState.selectedIndex]);
    renderSearchOverlayResultsProgressively(resultsNode, results);
  }

  function renderSearchOverlayResultsProgressively(resultsNode, results) {
    const total = results.length;
    if (total > SEARCH_OVERLAY_LARGE_LIST_THRESHOLD) {
      renderSearchOverlayResultsVirtually(resultsNode, results);
      return;
    }
    if (total <= SEARCH_OVERLAY_LARGE_LIST_THRESHOLD) {
      const fragment = document.createDocumentFragment();
      results.forEach((item, index) => fragment.appendChild(renderSearchResult(item, index)));
      resultsNode.appendChild(fragment);
      return;
    }
    const job = {
      cancelled: false,
      index: 0,
      total,
      results,
      target: resultsNode,
      mediaType: searchOverlayState.mediaType,
      loader: renderSearchOverlayProgressNode(total)
    };
    searchOverlayRenderJob = job;
    resultsNode.appendChild(job.loader);
    const renderChunk = (deadline = null) => {
      if (job.cancelled || searchOverlayRenderJob !== job || !job.target.isConnected) return;
      const fragment = document.createDocumentFragment();
      const start = job.index;
      const chunkSize = job.mediaType === "image" ? SEARCH_OVERLAY_IMAGE_RENDER_CHUNK_SIZE : SEARCH_OVERLAY_RENDER_CHUNK_SIZE;
      const hardLimit = Math.min(job.total, start + chunkSize);
      while (job.index < hardLimit) {
        fragment.appendChild(renderSearchResult(job.results[job.index], job.index));
        job.index += 1;
        if (deadline?.timeRemaining && deadline.timeRemaining() < 4 && job.index - start >= 12) break;
      }
      job.target.insertBefore(fragment, job.loader);
      updateSearchOverlayProgressNode(job.loader, job.index, job.total);
      if (job.index < job.total) {
        scheduleSearchOverlayRenderChunk(renderChunk);
        return;
      }
      job.loader.remove();
      if (searchOverlayRenderJob === job) searchOverlayRenderJob = null;
    };
    renderChunk();
  }

  function scheduleSearchOverlayRenderChunk(callback) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 120 });
      return;
    }
    window.setTimeout(() => callback(), 16);
  }

  function cancelSearchOverlayRenderJob() {
    if (searchOverlayVirtualState?.raf) cancelAnimationFrame(searchOverlayVirtualState.raf);
    searchOverlayVirtualState = null;
    if (!searchOverlayRenderJob) return;
    searchOverlayRenderJob.cancelled = true;
    searchOverlayRenderJob.loader?.remove();
    searchOverlayRenderJob = null;
  }

  function renderSearchOverlayResultsVirtually(resultsNode, results) {
    const canvas = document.createElement("div");
    canvas.className = "mcp-virtual-list-canvas";
    const slice = document.createElement("div");
    slice.className = "mcp-virtual-list-slice";
    canvas.appendChild(slice);
    resultsNode.replaceChildren(canvas);
    searchOverlayVirtualState = {
      results,
      container: resultsNode,
      canvas,
      slice,
      rowHeight: SEARCH_OVERLAY_VIRTUAL_ROW_HEIGHT,
      start: -1,
      end: -1,
      raf: 0
    };
    updateSearchOverlayVirtualWindow(true);
  }

  function handleSearchOverlayVirtualScroll() {
    if (!searchOverlayVirtualState) return;
    if (searchOverlayVirtualState.raf) return;
    searchOverlayVirtualState.raf = requestAnimationFrame(() => {
      if (!searchOverlayVirtualState) return;
      searchOverlayVirtualState.raf = 0;
      updateSearchOverlayVirtualWindow(false);
    });
  }

  function updateSearchOverlayVirtualWindow(force = false) {
    const virtual = searchOverlayVirtualState;
    if (!virtual?.container?.isConnected) return;
    const total = virtual.results.length;
    const viewportHeight = Math.max(1, virtual.container.clientHeight || 1);
    const scrollTop = Math.max(0, virtual.container.scrollTop || 0);
    const visibleCount = Math.ceil(viewportHeight / virtual.rowHeight);
    const start = Math.max(0, Math.floor(scrollTop / virtual.rowHeight) - SEARCH_OVERLAY_VIRTUAL_OVERSCAN);
    const end = Math.min(total, start + visibleCount + SEARCH_OVERLAY_VIRTUAL_OVERSCAN * 2);
    if (!force && start === virtual.start && end === virtual.end) return;
    virtual.start = start;
    virtual.end = end;
    virtual.canvas.style.height = `${total * virtual.rowHeight}px`;
    virtual.slice.style.transform = `translate3d(0, ${start * virtual.rowHeight}px, 0)`;
    const fragment = document.createDocumentFragment();
    for (let index = start; index < end; index += 1) {
      fragment.appendChild(renderSearchResult(virtual.results[index], index));
    }
    virtual.slice.replaceChildren(fragment);
  }

  function scrollSearchOverlayVirtualIndexIntoView(index) {
    const virtual = searchOverlayVirtualState;
    if (!virtual) return null;
    const safeIndex = Math.max(0, Math.min(index, virtual.results.length - 1));
    const viewportHeight = virtual.container.clientHeight || 0;
    const currentTop = virtual.container.scrollTop || 0;
    const rowTop = safeIndex * virtual.rowHeight;
    const rowBottom = rowTop + virtual.rowHeight;
    if (rowTop < currentTop || rowBottom > currentTop + viewportHeight) {
      virtual.container.scrollTo({
        top: Math.max(0, rowTop - Math.max(0, viewportHeight - virtual.rowHeight) / 2),
        behavior: "auto"
      });
      updateSearchOverlayVirtualWindow(true);
    }
    return virtual.slice.querySelector(`.mcp-search-result[data-search-index="${CSS.escape(String(safeIndex))}"]`);
  }

  function renderSearchOverlayProgressNode(total) {
    const node = document.createElement("div");
    node.className = "mcp-search-progressive-loader";
    node.setAttribute("aria-live", "polite");
    updateSearchOverlayProgressNode(node, 0, total);
    return node;
  }

  function updateSearchOverlayProgressNode(node, rendered, total) {
    if (!node) return;
    const percent = Math.min(100, Math.round((rendered / Math.max(1, total)) * 100));
    node.style.setProperty("--progress", `${percent}%`);
    node.textContent = `${rendered} / ${total}`;
  }

  function getOverlayResults() {
    if (searchOverlayState.dateKey) {
      return overlayItemsForDate(searchOverlayState.dateKey);
    }
    if (searchOverlayState.mediaType === "dev") {
      return globalThis.MCP.searchItems(overlayVersionSearchEntries(state.devItems || [], "dev"), searchOverlayState.query, state.devCategories || [], searchOptions());
    }
    if (searchOverlayState.mediaType !== "image") {
      return globalThis.MCP.searchItems(overlayVersionSearchEntries(state.items || [], "text"), searchOverlayState.query, state.categories, searchOptions());
    }
    const now = Date.now();
    const f = searchOverlayState.filters;
    const images = filterImages(state.imageItems, searchOverlayState.query).filter((item) => {
      if (f.favorites && !item.isFavorite) return false;
      if (f.pinned && !item.isPinned) return false;
      if (f.dateRange === "today" && !isSameDay(item.createdAt, now)) return false;
      if (f.dateRange === "7d" && now - item.createdAt > 7 * 86400000) return false;
      if (f.dateRange === "30d" && now - item.createdAt > 30 * 86400000) return false;
      return true;
    });
    return images;
  }

  function overlayVersionSearchEntries(items = [], mediaType = "text") {
    if (mediaType === "image") return items || [];
    return (items || []).flatMap((item) => {
      const versions = floatingEmbeddedVersions(item);
      if (versions.length <= 1) return [overlayVersionSearchEntry(item, mediaType, null, 1, 1)];
      return versions.map((version, index) => overlayVersionSearchEntry(item, mediaType, version, index + 1, versions.length));
    });
  }

  function overlayVersionSearchEntry(item, mediaType = "text", version = null, number = 1, count = 1) {
    const display = version ? floatingItemDisplayVersion(item, mediaType, version.id) : item;
    return Object.assign({}, display, {
      id: item.id,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      sourceUrl: item.sourceUrl,
      sourceDomain: item.sourceDomain,
      sourceTitle: item.sourceTitle,
      faviconUrl: item.faviconUrl,
      faviconDataUrl: item.faviconDataUrl,
      isFavorite: item.isFavorite,
      isPinned: item.isPinned,
      usageCount: item.usageCount,
      lastUsedAt: item.lastUsedAt,
      lastCopiedAt: item.lastCopiedAt,
      tags: item.tags || [],
      __sourceItem: item,
      __sourceItemId: item.id,
      __mediaType: mediaType,
      __versionSearchResult: count > 1,
      __versionId: version?.id || "",
      __versionNumber: count > 1 ? number : 0,
      __versionCount: count
    });
  }

  function isSameDay(timestamp, reference) {
    const first = new Date(timestamp);
    const second = new Date(reference);
    return first.getFullYear() === second.getFullYear()
      && first.getMonth() === second.getMonth()
      && first.getDate() === second.getDate();
  }

  function overlayItemsForDate(dateKey) {
    if (searchOverlayState.mediaType === "image") {
      return (state.imageItems || [])
        .filter((item) => !isTrashCategoryId(item.categoryId))
        .filter((item) => searchLocalDateKey(item.createdAt) === dateKey)
        .sort((left, right) => (right.createdAt || 0) - (left.createdAt || 0));
    }
    const mediaType = searchOverlayState.mediaType === "dev" ? "dev" : "text";
    const sourceItems = mediaType === "dev" ? state.devItems || [] : state.items || [];
    return overlayVersionSearchEntries(sourceItems, mediaType)
      .filter((item) => !isTrashCategoryId(item.categoryId))
      .filter((item) => searchLocalDateKey(item.createdAt) === dateKey)
      .sort((left, right) => (right.createdAt || 0) - (left.createdAt || 0));
  }

  function searchLocalDateKey(timestamp) {
    const date = new Date(timestamp || 0);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function searchMonthKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function parseSearchMonthKey(value) {
    const match = /^(\d{4})-(\d{2})$/.exec(String(value || ""));
    if (!match) {
      const now = new Date();
      return [now.getFullYear(), now.getMonth()];
    }
    return [Number(match[1]), Number(match[2]) - 1];
  }

  function overlaySearchMaxMonthDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  function clampOverlaySearchMonth(year, month) {
    const minimum = new Date(1970, 0, 1);
    const maximum = overlaySearchMaxMonthDate();
    const candidate = new Date(year, month, 1);
    if (candidate < minimum) return minimum;
    if (candidate > maximum) return maximum;
    return candidate;
  }

  function isOverlaySearchCurrentOrFutureMonth(year, month) {
    const maximum = overlaySearchMaxMonthDate();
    return new Date(year, month, 1).getTime() >= maximum.getTime();
  }

  function openOverlaySearchDateCalendar() {
    searchOverlayState.calendarMonth = searchOverlayState.calendarMonth || searchMonthKey();
    const modal = shadowRoot.querySelector("[data-role='overlay-date-modal']");
    if (modal) modal.hidden = false;
    renderSearchOverlay();
  }

  function closeOverlaySearchDateCalendar() {
    const modal = shadowRoot.querySelector("[data-role='overlay-date-modal']");
    if (modal) modal.hidden = true;
  }

  function clearOverlaySearchDateMode() {
    searchOverlayState.dateKey = "";
  }

  function shiftOverlaySearchCalendarMonth(delta) {
    const [year, month] = parseSearchMonthKey(searchOverlayState.calendarMonth || searchMonthKey());
    const nextMonth = clampOverlaySearchMonth(year, month + delta);
    searchOverlayState.calendarMonth = searchMonthKey(nextMonth);
    renderOverlaySearchDateCalendar();
  }

  function setOverlaySearchCalendarMonth(month, year) {
    if (!Number.isFinite(month) || !Number.isFinite(year)) return;
    const safeYear = Math.max(1970, Math.min(9999, year));
    const safeMonth = Math.max(0, Math.min(11, month));
    searchOverlayState.calendarMonth = searchMonthKey(clampOverlaySearchMonth(safeYear, safeMonth));
    renderOverlaySearchDateCalendar();
  }

  function renderOverlaySearchDateCalendar() {
    const modal = shadowRoot.querySelector("[data-role='overlay-date-modal']");
    if (!modal) return;
    const [year, month] = parseSearchMonthKey(searchOverlayState.calendarMonth || searchMonthKey());
    searchOverlayState.calendarMonth = searchMonthKey(new Date(year, month, 1));
    modal.querySelector("[data-role='overlay-date-title']").textContent = tr("search.dateTitle");
    modal.querySelector("[data-role='overlay-date-subtitle']").textContent = tr("search.dateSubtitle");
    modal.querySelector("[data-role='overlay-date-close']")?.setAttribute("aria-label", tr("common.close"));
    const prev = modal.querySelector("[data-role='overlay-date-prev']");
    const next = modal.querySelector("[data-role='overlay-date-next']");
    if (prev) {
      prev.textContent = "<";
      prev.setAttribute("aria-label", tr("search.previousMonth"));
    }
    if (next) {
      next.textContent = ">";
      next.setAttribute("aria-label", tr("search.nextMonth"));
      next.disabled = isOverlaySearchCurrentOrFutureMonth(year, month);
    }
    renderSearchMonthSelect(modal.querySelector("[data-role='overlay-date-month']"), month, year);
    const yearInput = modal.querySelector("[data-role='overlay-date-year']");
    if (yearInput) {
      yearInput.value = String(year);
      yearInput.setAttribute("aria-label", tr("search.year"));
      yearInput.max = String(overlaySearchMaxMonthDate().getFullYear());
    }
    renderSearchWeekdays(modal.querySelector("[data-role='overlay-date-weekdays']"));
    renderOverlaySearchDays(modal.querySelector("[data-role='overlay-date-grid']"), year, month);
  }

  function renderSearchMonthSelect(select, selectedMonth, selectedYear) {
    if (!select) return;
    const maxMonth = overlaySearchMaxMonthDate();
    select.replaceChildren(...Array.from({ length: 12 }, (_, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = globalThis.MCP.formatLocalizedDatePart(new Date(2024, index, 1), { month: "long" }, lang());
      option.selected = index === selectedMonth;
      option.disabled = new Date(selectedYear, index, 1) > maxMonth;
      return option;
    }));
    select.setAttribute("aria-label", tr("search.month"));
  }

  function renderSearchWeekdays(node) {
    if (!node) return;
    node.replaceChildren(...Array.from({ length: 7 }, (_, index) => {
      const span = document.createElement("span");
      span.textContent = globalThis.MCP.formatLocalizedDatePart(new Date(2024, 0, index + 1), { weekday: "short" }, lang());
      return span;
    }));
  }

  function renderOverlaySearchDays(node, year, month) {
    if (!node) return;
    const counts = searchTextCaptureCountsByDate();
    const leading = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let index = 0; index < leading; index += 1) {
      const empty = document.createElement("span");
      empty.className = "mcp-search-calendar-empty";
      cells.push(empty);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const count = counts.get(dateKey) || 0;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `mcp-search-calendar-day ${searchOverlayState.dateKey === dateKey ? "is-selected" : ""} ${count ? "has-captures" : ""}`;
      button.textContent = String(day);
      button.addEventListener("click", () => {
        searchOverlayState.dateKey = dateKey;
        searchOverlayState.selectedIndex = 0;
        closeOverlaySearchDateCalendar();
        renderSearchOverlay();
      });
      if (count) {
        const badge = document.createElement("span");
        badge.className = "mcp-search-calendar-count";
        badge.textContent = String(count);
        button.appendChild(badge);
      }
      cells.push(button);
    }
    node.replaceChildren(...cells);
  }

  function searchTextCaptureCountsByDate() {
    const counts = new Map();
    const items = searchOverlayState.mediaType === "image"
      ? state.imageItems || []
      : overlayVersionSearchEntries(searchOverlayState.mediaType === "dev" ? state.devItems || [] : state.items || [], searchOverlayState.mediaType === "dev" ? "dev" : "text");
    (items || []).forEach((item) => {
      if (isTrashCategoryId(item.categoryId)) return;
      const key = searchLocalDateKey(item.createdAt);
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }

  function formatSearchDateLabel(dateKey) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateKey || ""));
    if (!match) return "";
    return globalThis.MCP.formatLocalizedDateOnly(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])), lang(), { dateFormat: "medium" });
  }

  function renderSearchFilters(node) {
    const filters = [
      ["all", tr("search.filters.all")],
      ["favorites", tr("search.filters.favorites")],
      ["pinned", tr("search.filters.pinned")],
      ["today", tr("search.filters.today")],
      ["7d", tr("search.filters.last7")],
      ["30d", tr("search.filters.last30")],
      ["date", searchOverlayState.dateKey ? `${tr("search.byDate")} - ${formatSearchDateLabel(searchOverlayState.dateKey)}` : tr("search.byDate")]
    ];
    node.replaceChildren();
    filters.forEach(([id, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = isFilterActive(id) ? "is-active" : "";
      button.dataset.filterId = id;
      button.textContent = label;
      button.addEventListener("click", () => {
        if (id === "date") openOverlaySearchDateCalendar();
        else toggleSearchFilter(id);
      });
      node.appendChild(button);
    });
  }

  function isFilterActive(id) {
    const f = searchOverlayState.filters;
    if (id === "date") return Boolean(searchOverlayState.dateKey);
    if (searchOverlayState.dateKey) return false;
    return id === "all" ? !Object.keys(f).filter((key) => f[key]).length : f[id] || f.dateRange === id;
  }

  function toggleSearchFilter(id) {
    clearOverlaySearchDateMode();
    if (id === "all") searchOverlayState.filters = {};
    else if (id === "favorites") searchOverlayState.filters.favorites = !searchOverlayState.filters.favorites;
    else if (id === "pinned") searchOverlayState.filters.pinned = !searchOverlayState.filters.pinned;
    else if (["today", "7d", "30d"].includes(id)) searchOverlayState.filters.dateRange = searchOverlayState.filters.dateRange === id ? null : id;
    renderSearchOverlay();
  }

  function searchOptions() {
    return {
      filters: searchOverlayState.filters,
      language: state.settings.language || "en"
    };
  }

  function renderSearchResult(item, index) {
    const article = document.createElement("article");
    article.className = `mcp-search-result ${index === searchOverlayState.selectedIndex ? "is-selected" : ""} ${item.isPinned ? "is-pinned" : ""}`;
    article.dataset.searchIndex = String(index);
    if (index === searchOverlayState.selectedIndex) searchOverlaySelectedRow = article;
    article.addEventListener("click", () => {
      selectSearchOverlayResult(index, article);
    });
    const heading = document.createElement("div");
    heading.className = "mcp-search-result-heading";
    const title = document.createElement("strong");
    title.textContent = searchOverlayState.mediaType === "image"
      ? item.title || item.altText || item.fileName || item.imageUrl
      : item.title || item.preview || item.content;
    heading.appendChild(title);
    if (item.__versionSearchResult) {
      const versionBadge = document.createElement("span");
      versionBadge.className = "mcp-search-version-badge";
      versionBadge.textContent = tr("versioning.shortLabel", { number: item.__versionNumber || 1 });
      versionBadge.title = `${tr("versioning.shortLabel", { number: item.__versionNumber || 1 })} / ${tr("versioning.shortLabel", { number: item.__versionCount || 1 })}`;
      heading.appendChild(versionBadge);
    }
    const meta = document.createElement("span");
    meta.className = "mcp-search-result-meta";
    renderSourceAwareMeta(meta, item, [
      searchOverlayState.mediaType === "image" ? imageCategoryPath(item) : searchOverlayState.mediaType === "dev" ? devCategoryPath(item) : itemCategoryPath(item),
      globalThis.MCP.formatLocalizedDate(item.createdAt, lang())
    ]);
    article.append(heading, meta);
    return article;
  }

  function selectSearchOverlayResult(index, row = null) {
    const results = Array.isArray(searchOverlayState.results) ? searchOverlayState.results : [];
    const nextIndex = Math.max(0, Math.min(index, results.length - 1));
    const item = results[nextIndex];
    if (!item) return;
    if (nextIndex === searchOverlayState.selectedIndex && row?.classList.contains("is-selected")) return;
    searchOverlayState.selectedIndex = nextIndex;
    searchOverlaySelectedRow?.classList.remove("is-selected");
    const nextRow = row
      || shadowRoot.querySelector(`.mcp-search-result[data-search-index="${CSS.escape(String(nextIndex))}"]`)
      || scrollSearchOverlayVirtualIndexIntoView(nextIndex);
    nextRow?.classList.add("is-selected");
    searchOverlaySelectedRow = nextRow || null;
    scheduleSearchOverlayDetailRender(item, nextIndex);
  }

  function cancelSearchOverlayDetailRender() {
    clearTimeout(searchOverlayDetailRenderTimer);
    searchOverlayDetailRenderTimer = 0;
    cancelAnimationFrame(searchOverlayDetailRenderRaf);
    searchOverlayDetailRenderRaf = 0;
  }

  function scheduleSearchOverlayDetailRender(item, index) {
    cancelSearchOverlayDetailRender();
    searchOverlayDetailRenderTimer = window.setTimeout(() => {
      searchOverlayDetailRenderTimer = 0;
      searchOverlayDetailRenderRaf = requestAnimationFrame(() => {
        searchOverlayDetailRenderRaf = requestAnimationFrame(() => {
          searchOverlayDetailRenderRaf = 0;
          if (searchOverlayState.selectedIndex !== index) return;
          if (searchOverlayState.mediaType === "image") renderImageSearchDetail(item);
          else renderSearchDetail(item);
        });
      });
    }, 72);
  }

  function renderSearchDetail(item) {
    const node = shadowRoot.querySelector("[data-role='overlay-detail']");
    node.replaceChildren();
    if (!item) return;
    const mediaType = searchOverlayState.mediaType === "dev" ? "dev" : "text";
    const sourceItem = overlaySearchSourceItem(item, mediaType);
    const displayItem = overlaySearchDisplayItem(item, mediaType);
    const sourceVersionActive = !item.__versionSearchResult
      || (sourceItem.sourceVersionId
        ? item.__versionId === sourceItem.sourceVersionId
        : (item.__versionNumber || 1) === 1);
    const versionHeader = overlaySearchVersionHeader(item);
    const content = document.createElement("p");
    content.textContent = displayItem.content;
    const actions = document.createElement("div");
    actions.className = "mcp-detail-actions";
    actions.append(
      overlayAction(tr("common.copy"), () => copyFloatingTextLikeItemToClipboard(displayItem, mediaType)),
      overlayAction(tr("common.edit"), () => openEditor(activateOverlaySearchVersion(item, mediaType), mediaType), "edit.png")
    );
    if (sourceVersionActive) {
      if (mediaType === "text" || mediaType === "dev") {
        actions.append(overlayAction(tr("source.open"), () => openSourceFromOverlay(sourceItem), "reverse.png"));
      }
      actions.append(
        overlayAction(sourceItem.isFavorite ? tr("common.favoriteRemove") : tr("common.favoriteAdd"), () => updateTextLikeItemFromContent(mediaType, sourceItem.id, { isFavorite: !sourceItem.isFavorite }), sourceItem.isFavorite ? "favorited.png" : "not_yet_favorited.png", sourceItem.isFavorite),
        overlayAction(sourceItem.isPinned ? tr("common.unpin") : tr("common.pin"), () => updateTextLikeItemFromContent(mediaType, sourceItem.id, { isPinned: !sourceItem.isPinned }), sourceItem.isPinned ? "go_unpin.png" : "go_pin.png", sourceItem.isPinned)
      );
    }
    actions.append(overlayAction(tr("common.delete"), () => deleteItemWithConfirm(sourceItem, mediaType), "erase.png"));
    node.append(...[versionHeader, content, actions].filter(Boolean));
  }

  function overlaySearchSourceItem(item, mediaType = "text") {
    if (item?.__sourceItem) return item.__sourceItem;
    const items = mediaType === "dev" ? state.devItems || [] : state.items || [];
    return items.find((candidate) => candidate.id === item?.id) || item;
  }

  function overlaySearchDisplayItem(item, mediaType = "text") {
    if (!item?.__versionSearchResult) return item;
    return floatingItemDisplayVersion(overlaySearchSourceItem(item, mediaType), mediaType, item.__versionId || "");
  }

  function activateOverlaySearchVersion(item, mediaType = "text") {
    const sourceItem = overlaySearchSourceItem(item, mediaType);
    if (item?.__versionId) sourceItem.activeVersionId = item.__versionId;
    return sourceItem;
  }

  function overlaySearchVersionHeader(item) {
    if (!item?.__versionSearchResult) return null;
    const header = document.createElement("div");
    header.className = "mcp-search-version-detail";
    const badge = document.createElement("span");
    badge.className = "mcp-search-version-badge";
    badge.textContent = tr("versioning.shortLabel", { number: item.__versionNumber || 1 });
    const label = document.createElement("strong");
    label.textContent = item.title || tr("versioning.sourceCapture");
    const meta = document.createElement("small");
    meta.textContent = globalThis.MCP.formatLocalizedDate(item.createdAt, lang());
    header.append(badge, label, meta);
    return header;
  }

  function renderImageSearchDetail(item) {
    const node = shadowRoot.querySelector("[data-role='overlay-detail']");
    node.replaceChildren();
    if (!item) return;
    const image = document.createElement("img");
    image.className = "mcp-overlay-image-preview";
    image.src = item.imageUrl;
    image.alt = item.altText || tr("images.image");
    const info = renderImageInfoRows(item, "mcp-image-info-list");
    const meta = document.createElement("p");
    renderSourceAwareMeta(meta, item, [imageCategoryPath(item), globalThis.MCP.formatLocalizedDate(item.createdAt, lang())]);
    const actions = document.createElement("div");
    actions.className = "mcp-detail-actions";
    actions.append(
      overlayAction(tr("common.copy"), () => copyImageToClipboard(item)),
      overlayAction(tr("source.open"), () => openImageSourceFromOverlay(item), "reverse.png"),
      overlayAction(tr("images.info"), () => openImageInfoModal(item)),
      overlayAction(tr("images.download"), () => downloadImageItem(item)),
      overlayAction(tr("categories.classify"), () => showCategoryChooser(item, "image")),
      overlayAction(item.isFavorite ? tr("common.favoriteRemove") : tr("common.favoriteAdd"), () => updateImageFromContent(item.id, { isFavorite: !item.isFavorite }), item.isFavorite ? "favorited.png" : "not_yet_favorited.png", item.isFavorite),
      overlayAction(item.isPinned ? tr("common.unpin") : tr("common.pin"), () => updateImageFromContent(item.id, { isPinned: !item.isPinned }), item.isPinned ? "go_unpin.png" : "go_pin.png", item.isPinned),
      overlayAction(tr("common.delete"), () => deleteImageWithConfirm(item), "erase.png")
    );
    node.append(image, meta, info, actions);
  }

  function overlayAction(label, onClick, iconName = "", isActive = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.title = label;
    button.setAttribute("aria-label", label);
    if (!iconName && label === tr("common.copy")) {
      decorateUseCaptureButton(button);
    } else if (iconName) {
      button.className = `mcp-icon-label-action ${isActive ? "is-state-active" : ""}`;
      button.appendChild(iconImage(iconName, label));
    } else {
      button.textContent = label;
    }
    button.addEventListener("click", onClick);
    return button;
  }

  function openImageInfoModal(item) {
    let modal = shadowRoot.querySelector("[data-role='image-info-modal']");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "mcp-image-info-modal";
      modal.dataset.role = "image-info-modal";
      modal.innerHTML = [
        "<div class=\"mcp-search-backdrop\" data-action=\"close-image-info\"></div>",
        "<section class=\"mcp-image-info-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"image-info-title\"></strong><button type=\"button\" data-action=\"close-image-info\" data-role=\"image-info-close\" aria-label=\"Close\">&times;</button></header>",
        "<div data-role=\"image-info-content\"></div>",
        "</section>"
      ].join("");
      shadowRoot.appendChild(modal);
    }
    modal.querySelector("[data-role='image-info-title']").textContent = tr("images.infoTitle");
    const content = modal.querySelector("[data-role='image-info-content']");
    content.replaceChildren(renderImageInfoRows(item, "mcp-image-info-list is-modal"));
    modal.hidden = false;
  }

  function closeImageInfoModal() {
    const modal = shadowRoot.querySelector("[data-role='image-info-modal']");
    if (modal) modal.hidden = true;
  }

  function renderImageInfoRows(item, className = "mcp-image-info-list") {
    const list = document.createElement("div");
    list.className = className;
    imageInfoFields(item).forEach(([label, value]) => {
      if (!value) return;
      const row = document.createElement("div");
      row.className = "mcp-image-info-row";
      const key = document.createElement("strong");
      key.textContent = label;
      const text = document.createElement("span");
      text.textContent = value;
      const copy = document.createElement("button");
      copy.type = "button";
      copy.textContent = tr("common.copy");
      copy.addEventListener("click", () => navigator.clipboard.writeText(value).catch(() => {}));
      row.append(key, text, copy);
      list.appendChild(row);
    });
    return list;
  }

  function imageInfoFields(item) {
    const storedIsData = String(item.imageUrl || "").startsWith("data:");
    const storedDataUrl = item.dataUrl || (storedIsData ? item.imageUrl : "");
    return [
      ...(storedIsData ? [] : [[tr("images.infoStoredUrl"), item.imageUrl]]),
      [tr("images.infoSourcePage"), item.sourceUrl],
      [tr("images.infoSourceDomain"), item.sourceDomain],
      [tr("images.infoSourceTitle"), item.sourceTitle || item.imagePageTitle],
      [tr("images.infoAlt"), item.altText],
      [tr("images.infoElementTitle"), item.imageElementTitle || item.title],
      [tr("images.infoFileName"), item.imageFileName || fileNameFromUrl(item.originalImageUrl || item.imageUrl)],
      [tr("images.infoDimensions"), item.width && item.height ? `${item.width} × ${item.height}` : ""],
      [tr("images.infoCategory"), imageCategoryPath(item)],
      [tr("images.infoCapturedAt"), globalThis.MCP.formatLocalizedDate(item.createdAt, lang())],
      [tr("images.infoCaptureKind"), item.isScreenshot ? tr("images.screenshot") : ""],
      [tr("images.infoCandidates"), Array.isArray(item.imageCandidates) ? item.imageCandidates.filter(Boolean).join("\n") : ""],
      [tr("images.infoOriginalUrl"), item.originalImageUrl || item.imageUrl],
      [tr("images.infoStoredUrl"), storedDataUrl]
    ];
  }

  function openSourceFromOverlay(item) {
    if (!item.sourceUrl) {
      showToast(tr("source.missing"));
      return;
    }
    safeRuntimeMessage({ type: MESSAGE_TYPES.OPEN_SOURCE_ITEM, itemId: item.id }).catch(() => {});
    showToast(tr("source.opening"));
  }

  function openImageSourceFromOverlay(item) {
    if (!item.sourceUrl && !item.imageUrl) {
      showToast(tr("source.missing"));
      return;
    }
    safeRuntimeMessage({ type: MESSAGE_TYPES.OPEN_SOURCE_IMAGE, itemId: item.id }).catch(() => {});
    showToast(tr("source.opening"));
  }

  function iconImage(fileName, alt, options = {}) {
    const image = document.createElement("img");
    image.src = chrome.runtime.getURL(`assets/icons/${themedIconName(fileName, options)}`);
    image.alt = alt;
    image.width = 18;
    image.height = 18;
    return image;
  }

  function decorateUseCaptureButton(button) {
    if (!button) return;
    const label = tr("common.useCapture");
    button.classList.add("mcp-use-capture-button");
    button.title = label;
    button.setAttribute("aria-label", label);
    button.replaceChildren();
    const image = document.createElement("img");
    image.src = chrome.runtime.getURL("assets/icons/copy.png");
    image.alt = "";
    image.width = 22;
    image.height = 22;
    image.setAttribute("aria-hidden", "true");
    button.appendChild(image);
  }

  function themedIconName(fileName, options = {}) {
    const themedIcons = new Set([
      "not_yet_favorited.png",
      "edit.png",
      "erase.png",
      "reverse.png",
      "go_pin.png",
      "go_unpin.png"
    ]);
    if (!themedIcons.has(fileName)) return fileName;
    const suffix = options.forceDarkIcon ? "darkmod" : resolvedThemeForIcons() === "light" ? "lightmod" : "darkmod";
    return fileName.replace(/\.png$/i, `_${suffix}.png`);
  }

  function resolvedThemeForIcons() {
    return shadowRoot?.host?.getAttribute("data-resolved-theme")
      || document.documentElement?.getAttribute("data-resolved-theme")
      || (globalThis.matchMedia?.("(prefers-color-scheme: light)")?.matches ? "light" : "dark");
  }

  function openEditor(item, mediaType = activeFloatingTab === "dev" ? "dev" : "text") {
    editingItem = item;
    editingItem.mediaType = mediaType;
    const editor = shadowRoot.querySelector("[data-role='editor']");
    editor.hidden = false;
    translateFloatingUi();
    shadowRoot.querySelector("[data-role='editor-title']").value = item.title || "";
    shadowRoot.querySelector("[data-role='editor-content']").value = item.content || "";
    shadowRoot.querySelector("[data-role='editor-note']").value = item.note || "";
    shadowRoot.querySelector("[data-role='editor-error']").textContent = "";
    editorCategorySelection = item.categoryId || (mediaType === "dev" ? "dev-general" : "general");
    editorExpandedCategories.clear();
    expandEditorCategoryPath(editorCategorySelection);
    renderEditorCategories(editorCategorySelection, mediaType);
  }

  function renderEditorCategories(selectedId, mediaType = editingItem?.mediaType || "text") {
    const tree = shadowRoot.querySelector("[data-role='editor-category-tree']");
    if (!tree) return;
    const previousScroll = tree.scrollTop;
    tree.replaceChildren();
    const sourceCategories = mediaType === "dev" ? state.devCategories || [] : state.categories;
    renderEditorCategoryNodes(buildCategoryTree(sourceCategories.filter((category) => !category.isHidden)), tree, 0, selectedId);
    requestAnimationFrame(() => {
      if (!editorCategoryDragState) tree.scrollTop = previousScroll;
    });
  }

  async function closeEditor() {
    const editor = shadowRoot.querySelector("[data-role='editor']");
    if (!editor || editor.hidden) return;
    if (state.settings.confirmUnsavedEdits && editingItem && editorHasChanges()) {
      const confirmed = await openFloatingConfirmDialog({
        title: tr("editor.heading"),
        message: tr("editor.unsavedConfirm"),
        confirmText: tr("common.close"),
        cancelText: tr("common.cancel")
      });
      if (!confirmed) return;
      showToast(tr("editor.discarded"));
    }
    editor.hidden = true;
    editingItem = null;
    editorCategorySelection = "";
    editorCategoryDragState = null;
    editorExpandedCategories.clear();
  }

  function editorHasChanges() {
    if (!editingItem) return false;
    return shadowRoot.querySelector("[data-role='editor-title']").value.trim() !== (editingItem.title || "")
      || shadowRoot.querySelector("[data-role='editor-content']").value !== (editingItem.content || "")
      || shadowRoot.querySelector("[data-role='editor-note']").value !== (editingItem.note || "");
  }

  async function saveEditor() {
    if (!editingItem) return;
    const content = shadowRoot.querySelector("[data-role='editor-content']").value.trim();
    const error = shadowRoot.querySelector("[data-role='editor-error']");
    if (!content) {
      error.textContent = tr("editor.emptyContent");
      return;
    }
    const mediaType = editingItem.mediaType === "dev" ? "dev" : "text";
    const categoryId = editorCategorySelection || editingItem.categoryId || (mediaType === "dev" ? "dev-general" : "general");
    const category = (mediaType === "dev" ? state.devCategories || [] : state.categories).find((item) => item.id === categoryId);
    const title = shadowRoot.querySelector("[data-role='editor-title']").value.trim();
    if (isTrashCategoryId(categoryId)) return;
    if (isVaultCategoryId(categoryId)) {
      if (!canUseVault()) {
        openFloatingProUpgradeModal("vault");
        showToast(tr("pro.vaultRequired"));
        return;
      }
      const unlocked = await ensureVaultUnlocked();
      if (!unlocked) return;
    }
    const updates = isFavoriteCategoryId(categoryId) ? {
      title,
      content,
      isFavorite: true,
      note: shadowRoot.querySelector("[data-role='editor-note']").value.trim()
    } : {
      title,
      content,
      categoryId,
      categoryName: category?.name || "General",
      languageId: mediaType === "dev" ? categoryId : undefined,
      languageName: mediaType === "dev" ? (category?.name || "General") : undefined,
      note: shadowRoot.querySelector("[data-role='editor-note']").value.trim()
    };
    await safeRuntimeMessage({
      type: mediaType === "dev" ? MESSAGE_TYPES.UPDATE_DEV_ITEM : MESSAGE_TYPES.UPDATE_ITEM,
      itemId: editingItem.id,
      updates
    });
    showToast(tr("editor.saved"));
    shadowRoot.querySelector("[data-role='editor']").hidden = true;
    editingItem = null;
    editorCategorySelection = "";
    editorCategoryDragState = null;
    editorExpandedCategories.clear();
    scheduleFloatingRefresh();
  }

  function renderEditorCategoryNodes(nodes, container, depth, selectedId) {
    nodes.forEach((category) => {
      if (depth > 0 && !editorExpandedCategories.has(category.parentId)) return;
      const editorIsDev = editingItem?.mediaType === "dev";
      const canDragCategory = editorIsDev
        ? !category.isDefault && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id)
        : !category.isDefault && !category.isSystem && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id);
      const row = document.createElement("div");
      row.className = `manager-category-row ${selectedId === category.id ? "is-active" : ""} ${canDragCategory ? "" : "is-locked"}`;
      row.style.setProperty("--depth", String(depth));
      row.dataset.editorCategoryId = category.id;
      row.dataset.parentId = category.parentId || "";
      row.draggable = canDragCategory;
      row.addEventListener("dragstart", (event) => startEditorCategoryDrag(event, category));
      row.addEventListener("dragover", handleEditorCategoryDragOver);
      row.addEventListener("dragleave", handleEditorCategoryDragLeave);
      row.addEventListener("drop", (event) => handleEditorCategoryDrop(event, category));
      row.addEventListener("dragend", handleEditorCategoryDragEnd);

      const dragHandle = canDragCategory ? document.createElement("button") : null;
      if (dragHandle) {
        dragHandle.type = "button";
        dragHandle.className = "manager-category-drag";
        dragHandle.textContent = "::";
        dragHandle.setAttribute("aria-label", tr("categories.drag"));
        dragHandle.draggable = true;
        dragHandle.addEventListener("dragstart", (event) => startEditorCategoryDrag(event, category));
        dragHandle.addEventListener("dragend", handleEditorCategoryDragEnd);
      }

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "manager-category-toggle";
      toggle.dataset.editorToggleCategoryId = category.id;
      toggle.textContent = category.children?.length ? (editorExpandedCategories.has(category.id) ? "v" : ">") : "";
      const displayName = editorCategoryLabel(category);
      toggle.setAttribute("aria-label", category.children?.length ? tr("categories.toggleNamed", { name: displayName }) : displayName);

      const choice = document.createElement("button");
      choice.type = "button";
      choice.className = "manager-category-choice";
      choice.dataset.editorCategoryId = category.id;
      choice.title = displayName;
      choice.setAttribute("aria-label", displayName);
      const dot = document.createElement("span");
      let icon = null;
      if (isFavoriteCategoryId(category.id)) {
        dot.className = "category-heart";
        dot.textContent = "\u2665";
        dot.style.backgroundColor = "transparent";
        icon = dot;
      } else if (isTrashCategoryId(category.id)) {
        icon = createTrashCategoryIcon();
      } else if (isVaultCategoryId(category.id)) {
        icon = createVaultCategoryIcon();
      } else {
        dot.className = "category-dot";
        if (!category.parentId) icon = dot;
      }
      const count = categoryCountNode(category.id, editingItem?.mediaType === "dev" ? "dev" : "text");
      const label = document.createElement("span");
      label.className = "manager-category-label-text";
      label.textContent = displayName;
      if (icon) choice.appendChild(icon);
      if (isTrashCategoryId(category.id) && !canUseTrashManagement()) choice.appendChild(createCategoryProBadge());
      if (isVaultCategoryId(category.id) && !canUseVault()) choice.appendChild(createCategoryProBadge());
      choice.appendChild(label);
      if (count) choice.appendChild(count);

      row.append(...[dragHandle, toggle, choice].filter(Boolean));
      container.appendChild(row);

      if (editorExpandedCategories.has(category.id) && category.children?.length) {
        renderEditorCategoryNodes(category.children, container, depth + 1, selectedId);
      }
    });
  }

  function expandEditorCategoryPath(categoryId) {
    const sourceCategories = editingItem?.mediaType === "dev" ? state.devCategories || [] : state.categories;
    const byId = new Map(sourceCategories.map((category) => [category.id, category]));
    let current = byId.get(categoryId);
    while (current?.parentId) {
      editorExpandedCategories.add(current.parentId);
      current = byId.get(current.parentId);
    }
  }

  function startEditorCategoryDrag(event, category) {
    if (!event?.dataTransfer || !category) return;
    if (isGeneralCategoryId(category.id)) return;
    if (isFavoriteCategoryId(category.id)) return;
    if (isTrashCategoryId(category.id)) return;
    if (isVaultCategoryId(category.id)) return;
    if (editingItem?.mediaType !== "dev" && (category.isDefault || category.isSystem)) return;
    if (editingItem?.mediaType === "dev" && category.isDefault) return;
    editorCategoryDragState = { id: category.id, parentId: category.parentId || null };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", category.id);
    event.currentTarget.classList.add("is-dragging");
    setCategoryDragImage(event);
  }

  function handleEditorCategoryDragOver(event) {
    if (!editorCategoryDragState) return;
    const targetId = event.currentTarget?.dataset?.editorCategoryId || "";
    if (isGeneralCategoryId(targetId) || isFavoriteCategoryId(targetId) || isTrashCategoryId(targetId)) {
      clearAllCategoryDragMarkers();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
      return;
    }
    event.preventDefault();
    markCategoryDropTarget(event.currentTarget, getDropPosition(event));
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  }

  function handleEditorCategoryDragLeave(event) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    clearCategoryDropMarkers(event.currentTarget);
  }

  async function handleEditorCategoryDrop(event, targetCategory) {
    event.preventDefault();
    const dropPosition = event.currentTarget.dataset.dropPosition || getDropPosition(event);
    clearCategoryDropMarkers(event.currentTarget);
    if (isGeneralCategoryId(targetCategory?.id) || isFavoriteCategoryId(targetCategory?.id) || isTrashCategoryId(targetCategory?.id)) {
      editorCategoryDragState = null;
      return;
    }
    if (!editorCategoryDragState) {
      editorCategoryDragState = null;
      return;
    }
    const sourceId = editorCategoryDragState.id;
    const sourceCategories = editingItem?.mediaType === "dev" ? state.devCategories || [] : state.categories;
    const source = sourceCategories.find((category) => category.id === sourceId);
    if (!source || source.id === targetCategory.id) {
      editorCategoryDragState = null;
      return;
    }
    const parentId = targetCategory.parentId || null;
    if ((source.parentId || null) !== parentId) {
      editorCategoryDragState = null;
      return;
    }
    const siblings = sourceCategories
      .filter((category) => (category.parentId || null) === parentId)
      .sort((left, right) => (left.order || 0) - (right.order || 0) || categoryLabel(left).localeCompare(categoryLabel(right), lang(), { sensitivity: "base" }));
    const orderedIds = siblings.map((category) => category.id).filter((id) => id !== source.id);
    const targetIndex = orderedIds.indexOf(targetCategory.id);
    const insertBefore = dropPosition === "before";
    orderedIds.splice(Math.max(0, targetIndex + (insertBefore ? 0 : 1)), 0, source.id);
    try {
      if (editingItem?.mediaType === "dev") await globalThis.MCP.reorderDevCategories(parentId, orderedIds);
      else await globalThis.MCP.reorderCategories(parentId, orderedIds);
      await refreshState();
      renderCategories();
      renderEditorCategories(editorCategorySelection);
      showToast(tr("categories.reordered"));
    } catch (error) {
      showToast(error?.message || tr("common.error"));
    } finally {
      editorCategoryDragState = null;
      clearAllCategoryDragMarkers();
    }
  }

  function handleEditorCategoryDragEnd(event) {
    event.currentTarget.classList.remove("is-dragging");
    editorCategoryDragState = null;
    clearAllCategoryDragMarkers();
  }

  function openFloatingConfirmDialog({ title, message, confirmText, cancelText }) {
    return new Promise((resolve) => {
      const confirmMarkup = [
        "<div class=\"manager-backdrop mcp-search-backdrop\" data-action=\"confirm-cancel\"></div>",
        "<section class=\"manager-confirm-card mcp-confirm-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"manager-category-dialog-head mcp-confirm-head\"><strong data-role=\"confirm-title\"></strong><button type=\"button\" class=\"prompt-close\" data-action=\"confirm-cancel\" aria-label=\"Close\">X</button></header>",
        "<p data-role=\"confirm-message\"></p>",
        "<footer><button type=\"button\" class=\"primary\" data-action=\"confirm-accept\"></button><button type=\"button\" data-action=\"confirm-cancel\"></button></footer>",
        "</section>"
      ].join("");
      let modal = shadowRoot.querySelector("[data-role='confirm-modal']");
      if (!modal) {
        modal = document.createElement("div");
        modal.dataset.role = "confirm-modal";
        modal.hidden = true;
        shadowRoot.appendChild(modal);
      }
      if (!modal.classList.contains("manager-confirm-modal") || !modal.querySelector(".mcp-confirm-head")) {
        modal.className = "manager-modal manager-confirm-modal mcp-confirm-modal";
        modal.innerHTML = confirmMarkup;
      }
      const cleanup = (value) => {
        modal.hidden = true;
        modal.querySelectorAll("[data-action='confirm-accept'], [data-action='confirm-cancel']").forEach((node) => { node.onclick = null; });
        resolve(value);
      };
      modal.querySelector("[data-role='confirm-title']").textContent = title || tr("common.confirm");
      modal.querySelector("[data-role='confirm-message']").textContent = message || "";
      modal.querySelector("[data-action='confirm-accept']").textContent = confirmText || tr("common.delete");
      modal.querySelector("footer [data-action='confirm-cancel']").textContent = cancelText || tr("common.cancel");
      modal.querySelector(".mcp-confirm-head [data-action='confirm-cancel']").setAttribute("aria-label", tr("common.close"));
      modal.querySelector("[data-action='confirm-accept']").onclick = () => cleanup(true);
      modal.querySelectorAll("[data-action='confirm-cancel']").forEach((node) => { node.onclick = () => cleanup(false); });
      modal.hidden = false;
    });
  }

  function editorCategoryLabel(category) {
    if (!category) return "";
    if (isGeneralCategoryId(category.id)) return tr("categories.general");
    if (isFavoriteCategoryId(category.id)) return tr("categories.favorites");
    if (isTrashCategoryId(category.id)) return tr("trash.title");
    if (isVaultCategoryId(category.id)) return tr("vault.title");
    return categoryLabel(category) || category.name || category.id || "";
  }

  async function deleteItemWithConfirm(item, mediaType = "text") {
    if (state.settings.confirmBeforeDelete) {
      const confirmed = await openFloatingConfirmDialog({
        title: tr("common.delete"),
        message: tr("editor.deleteConfirm"),
        confirmText: tr("common.delete"),
        cancelText: tr("common.cancel")
      });
      if (!confirmed) return;
    }
    const effectivePermanent = !canUseTrashManagement();
    const rollback = removeFloatingCaptureImmediately(item.id, mediaType);
    showToast(mediaType === "dev" ? tr("dev.deleted") : tr("clipboard.itemDeleted"));
    safeRuntimeMessage({ type: mediaType === "dev" ? MESSAGE_TYPES.DELETE_DEV_ITEM : MESSAGE_TYPES.DELETE_ITEM, itemId: item.id, permanent: effectivePermanent })
      .then((response) => {
        if (!response?.ok) throw new Error(response?.error || "delete-failed");
      })
      .catch(() => {
        rollback();
        showToast(tr("common.error"));
      });
  }

  function openCryptoSensitiveCaptureWarning(detection = {}) {
    return new Promise((resolve) => {
      const markup = `<div class="manager-backdrop mcp-search-backdrop" data-action="crypto-warning-cancel"></div>
        <section class="mcp-crypto-warning-card" role="alertdialog" aria-modal="true" aria-labelledby="mcp-crypto-warning-title">
        <header><span class="mcp-crypto-warning-icon" aria-hidden="true">!</span><div><small data-role="crypto-warning-eyebrow"></small><strong id="mcp-crypto-warning-title" data-role="crypto-warning-title"></strong></div></header>
        <p data-role="crypto-warning-message"></p><p class="mcp-crypto-warning-advice" data-role="crypto-warning-advice"></p>
        <footer><button type="button" data-action="crypto-warning-cancel"></button><button type="button" class="primary" data-action="crypto-warning-confirm"></button></footer></section>`;
      let modal = shadowRoot.querySelector("[data-role='crypto-warning-modal']");
      if (!modal) {
        modal = document.createElement("div");
        modal.dataset.role = "crypto-warning-modal";
        modal.className = "mcp-crypto-warning-modal";
        modal.innerHTML = markup;
        shadowRoot.appendChild(modal);
      }
      const cleanup = (confirmed) => {
        modal.hidden = true;
        modal.querySelectorAll("button, [data-action='crypto-warning-cancel']").forEach((node) => { node.onclick = null; });
        resolve(confirmed);
      };
      const copy = detection.copy || {};
      modal.querySelector("[data-role='crypto-warning-eyebrow']").textContent = copy.eyebrow;
      modal.querySelector("[data-role='crypto-warning-title']").textContent = copy.title;
      modal.querySelector("[data-role='crypto-warning-message']").textContent = copy.message;
      modal.querySelector("[data-role='crypto-warning-advice']").textContent = copy.advice;
      modal.querySelector("footer [data-action='crypto-warning-cancel']").textContent = copy.decline;
      modal.querySelector("[data-action='crypto-warning-confirm']").textContent = copy.confirm;
      modal.querySelector("[data-action='crypto-warning-confirm']").onclick = () => cleanup(true);
      modal.querySelectorAll("[data-action='crypto-warning-cancel']").forEach((node) => { node.onclick = () => cleanup(false); });
      modal.hidden = false;
      modal.querySelector("[data-action='crypto-warning-cancel']")?.focus();
    });
  }

  async function deleteActiveFloatingTextLikeCapture(item, mediaType = "text", activeVersionId = "") {
    const versions = floatingEmbeddedVersions(item);
    const versionId = activeVersionId && versions.some((version) => version.id === activeVersionId)
      ? activeVersionId
      : floatingCurrentVersionId(item, mediaType);
    if (versions.length > 1 && versionId) {
      await deleteFloatingEmbeddedVersionWithConfirm(item, mediaType, versionId);
      return;
    }
    await deleteItemWithConfirm(item, mediaType);
  }

  async function deleteFloatingEmbeddedVersionWithConfirm(item, mediaType = "text", versionId = "") {
    const versions = floatingEmbeddedVersions(item);
    const index = versions.findIndex((version) => version.id === versionId);
    if (!item?.id || index < 0 || versions.length <= 1) return;
    const number = index + 1;
    const effectivePermanent = !canUseTrashManagement();
    if (state.settings.confirmBeforeDelete || versions.length > 1) {
      const confirmed = await openFloatingConfirmDialog({
        title: tr("versioning.deleteVersionTitle"),
        message: tr(effectivePermanent ? "versioning.permanentVersionConfirm" : "versioning.trashVersionConfirm", { number }),
        confirmText: tr("common.delete"),
        cancelText: tr("common.cancel")
      });
      if (!confirmed) return;
    }
    const type = mediaType === "dev" ? MESSAGE_TYPES.DELETE_DEV_VERSION : MESSAGE_TYPES.DELETE_ITEM_VERSION;
    const response = await safeRuntimeMessage({ type, itemId: item.id, versionId, permanent: effectivePermanent }).catch(() => null);
    const nextActive = response?.data?.items?.find?.((candidate) => candidate.id === item.id)?.activeVersionId
      || response?.data?.devItems?.find?.((candidate) => candidate.id === item.id)?.activeVersionId
      || "";
    item.activeVersionId = nextActive;
    showToast(effectivePermanent ? tr("trash.permanentlyDeleted") : tr("trash.moved"));
    if (!applyFloatingStateResponse(response)) scheduleFloatingRefresh();
  }

  async function deleteImageWithConfirm(item) {
    if (state.settings.confirmBeforeDelete) {
      const confirmed = await openFloatingConfirmDialog({
        title: tr("common.delete"),
        message: tr("editor.deleteConfirm"),
        confirmText: tr("common.delete"),
        cancelText: tr("common.cancel")
      });
      if (!confirmed) return;
    }
    clearImageCaptureDedupe();
    const effectivePermanent = !canUseTrashManagement();
    const rollback = removeFloatingCaptureImmediately(item.id, "image");
    showToast(tr("images.deleted"));
    safeRuntimeMessage({ type: MESSAGE_TYPES.DELETE_IMAGE_ITEM, itemId: item.id, permanent: effectivePermanent })
      .then((response) => {
        if (!response?.ok) throw new Error(response?.error || "delete-failed");
      })
      .catch(() => {
        rollback();
        showToast(tr("common.error"));
      });
  }

  async function moveChooserItemToTrashWithConfirm(item, mediaType = "text") {
    if (!item) return;
    const confirmed = await openFloatingConfirmDialog({
      title: tr("common.delete"),
      message: tr("editor.deleteConfirm"),
      confirmText: tr("common.delete"),
      cancelText: tr("common.cancel")
    });
    if (!confirmed) return;
    if (mediaType === "image") clearImageCaptureDedupe();
    const type = mediaType === "image"
      ? MESSAGE_TYPES.DELETE_IMAGE_ITEM
      : mediaType === "dev"
        ? MESSAGE_TYPES.DELETE_DEV_ITEM
        : MESSAGE_TYPES.DELETE_ITEM;
    const rollback = removeFloatingCaptureImmediately(item.id, mediaType);
    showToast(tr("trash.moved"));
    safeRuntimeMessage({ type, itemId: item.id, permanent: false })
      .then((response) => {
        if (!response?.ok) throw new Error(response?.error || "delete-failed");
      })
      .catch(() => {
        rollback();
        showToast(tr("common.error"));
      });
  }

  function canUseTrashManagement() {
    return globalThis.MCP.canUseFeature ? globalThis.MCP.canUseFeature("trashManagement", state.settings) : true;
  }

  function translateFloatingUi() {
    globalThis.MCP.applyLanguageMetadata?.(shadowRoot?.host, state.settings?.language || "en");
    const panel = shadowRoot.querySelector(".mcp-panel");
    if (panel) panel.setAttribute("aria-label", tr("app.name"));
    const brand = shadowRoot.querySelector(".mcp-brand");
    if (brand) brand.setAttribute("aria-label", tr("app.name"));
    const brandImg = shadowRoot.querySelector(".mcp-brand img");
    if (brandImg) brandImg.alt = tr("app.name");
    updateFloatingBrandProBadge();
    const fullPageButton = shadowRoot.querySelector("[data-action='capture-full-page']");
    if (fullPageButton) {
      fullPageButton.setAttribute("aria-label", tr("capture.fullPageButton"));
      fullPageButton.title = tr("capture.fullPageButton");
      fullPageButton.classList.remove("is-pro-locked");
    }
    const launcherToolsButton = shadowRoot.querySelector("[data-action='open-launcher-tools']");
    if (launcherToolsButton) {
      launcherToolsButton.setAttribute("aria-label", tr("tools.title"));
      launcherToolsButton.title = tr("tools.title");
    }
    updateLauncherRecentTool(state.settings);
    const launcherManagerButton = shadowRoot.querySelector("[data-action='open-launcher-manager']");
    if (launcherManagerButton) {
      launcherManagerButton.setAttribute("aria-label", tr("ui.manager"));
      launcherManagerButton.title = tr("ui.manager");
    }
    const launcherCollapse = shadowRoot.querySelector("[data-action='collapse-launcher']");
    if (launcherCollapse) {
      launcherCollapse.setAttribute("aria-label", tr("common.close"));
      launcherCollapse.title = tr("common.close");
    }
    const launcherExpand = shadowRoot.querySelector("[data-action='expand-launcher']");
    if (launcherExpand) {
      launcherExpand.setAttribute("aria-label", tr("app.name"));
      launcherExpand.title = tr("app.name");
    }
    const appName = shadowRoot.querySelector("[data-role='app-name']");
    if (appName) appName.textContent = tr("app.name");
    const floatingMenuButton = shadowRoot.querySelector("[data-role='floating-menu-button']");
    if (floatingMenuButton) {
      floatingMenuButton.setAttribute("aria-label", tr("popup.menu"));
      floatingMenuButton.title = tr("popup.menu");
    }
    const toolsButton = shadowRoot.querySelector("[data-action='open-tools']");
    if (toolsButton) {
      toolsButton.setAttribute("aria-label", tr("tools.title"));
      toolsButton.title = tr("tools.title");
      forceToolsLauncherGlass();
    }
    const toolsLabel = shadowRoot.querySelector("[data-role='tools-label']");
    if (toolsLabel) toolsLabel.textContent = tr("tools.title");
    renderFloatingMenu();
    const quickSearch = shadowRoot.querySelector("[data-role='search']");
    if (quickSearch) updateFloatingSearchPlaceholder();
    const openSidepanel = shadowRoot.querySelector("[data-action='open-sidepanel']");
    if (openSidepanel) {
      openSidepanel.setAttribute("aria-label", tr("ui.manager"));
      openSidepanel.title = tr("ui.manager");
    }
    updateFirstUseButtonPrompts();
    const closePanel = shadowRoot.querySelector("[data-action='close-panel']");
    if (closePanel) {
      closePanel.setAttribute("aria-label", tr("common.close"));
      closePanel.title = tr("common.close");
    }
    const floatingTextTab = shadowRoot.querySelector("[data-role='floating-text-tab']");
    if (floatingTextTab) {
      floatingTextTab.setAttribute("aria-label", tr("tabs.text"));
      floatingTextTab.title = tr("tabs.text");
      const label = floatingTextTab.querySelector("[data-role='floating-text-label']");
      if (label) label.textContent = tr("tabs.text");
    }
    const floatingImageTab = shadowRoot.querySelector("[data-role='floating-image-tab']");
    const floatingDevTab = shadowRoot.querySelector("[data-role='floating-dev-tab']");
    if (floatingDevTab) {
      floatingDevTab.setAttribute("aria-label", tr("tabs.dev"));
      floatingDevTab.title = tr("tabs.dev");
      const label = floatingDevTab.querySelector("[data-role='floating-dev-label']");
      if (label) label.textContent = tr("tabs.dev");
    }
    if (floatingImageTab) {
      floatingImageTab.setAttribute("aria-label", tr("images.tab"));
      floatingImageTab.title = tr("images.tab");
      const label = floatingImageTab.querySelector("[data-role='floating-image-label']");
      if (label) label.textContent = tr("images.tab");
    }
    const categorySearch = shadowRoot.querySelector("[data-role='category-search']");
    if (categorySearch) {
      categorySearch.placeholder = tr("categories.search");
      categorySearch.setAttribute("aria-label", tr("categories.search"));
    }
    const chooserTitle = shadowRoot.querySelector("[data-role='chooser-title']");
    if (chooserTitle) chooserTitle.textContent = tr("categories.classify");
    const subName = shadowRoot.querySelector("[data-role='subcategory-name']");
    if (subName) {
      subName.placeholder = tr("categories.subcategoryName");
      subName.setAttribute("aria-label", tr("categories.subcategoryName"));
    }
    translateOnboarding();
    const confirmSub = shadowRoot.querySelector("[data-role='confirm-subcategory-label']");
    if (confirmSub) {
      confirmSub.textContent = "OK";
      confirmSub.setAttribute("aria-label", tr("categories.createAndClassify"));
      confirmSub.setAttribute("title", tr("categories.createAndClassify"));
    }
    const query = shadowRoot.querySelector("[data-role='overlay-query']");
    if (query) {
      query.placeholder = tr("search.placeholder");
      query.setAttribute("aria-label", tr("search.placeholder"));
    }
    const searchModal = shadowRoot.querySelector("[data-role='search-modal']");
    if (searchModal) searchModal.setAttribute("aria-label", tr("search.advanced"));
    const closeSearch = shadowRoot.querySelector("[data-role='close-search-button']");
    if (closeSearch) closeSearch.setAttribute("aria-label", tr("common.close"));
    const overlayTextTab = shadowRoot.querySelector("[data-role='overlay-text-tab']");
    if (overlayTextTab) overlayTextTab.textContent = tr("tabs.text");
    const overlayDevTab = shadowRoot.querySelector("[data-role='overlay-dev-tab']");
    if (overlayDevTab) overlayDevTab.textContent = tr("tabs.dev");
    const overlayImageTab = shadowRoot.querySelector("[data-role='overlay-image-tab']");
    if (overlayImageTab) overlayImageTab.textContent = tr("images.tab");
    const title = shadowRoot.querySelector("[data-role='overlay-title']");
    if (title) title.textContent = tr("search.advanced");
    const editorCard = shadowRoot.querySelector("[data-role='editor-card']");
    if (editorCard) editorCard.setAttribute("aria-label", tr("editor.heading"));
    const closeEditor = shadowRoot.querySelector("[data-role='close-editor-button']");
    if (closeEditor) closeEditor.setAttribute("aria-label", tr("common.close"));
    const editorHeading = shadowRoot.querySelector("[data-role='editor-heading']");
    if (editorHeading) editorHeading.textContent = tr("editor.heading");
    const editorSave = shadowRoot.querySelector("[data-role='editor-save']");
    if (editorSave) editorSave.textContent = tr("editor.saveChanges");
    const editorCancel = shadowRoot.querySelector("[data-role='editor-cancel']");
    if (editorCancel) editorCancel.textContent = tr("common.cancel");
    const labels = [
      ["editor-title-label", "editor.title"],
      ["editor-content-label", "editor.content"],
      ["editor-category-label", "editor.category"],
      ["editor-note-label", "editor.note"]
    ];
    labels.forEach(([role, key]) => {
      const node = shadowRoot.querySelector(`[data-role='${role}']`);
      if (node) node.textContent = tr(key);
    });
  }

  function updateFloatingBrandProBadge() {
    const badge = shadowRoot?.querySelector("[data-role='brand-pro-badge']");
    if (!badge) return;
    const panel = shadowRoot?.querySelector(".mcp-panel");
    const isReduced = Boolean(panel?.classList.contains("is-minimized"));
    const isPro = globalThis.MCP.isProPlan ? globalThis.MCP.isProPlan(state.settings) : false;
    badge.hidden = !isPro || isReduced;
  }

  function updateFirstUseButtonPrompts() {
    const brand = shadowRoot?.querySelector(".mcp-brand");
    const manager = shadowRoot?.querySelector("[data-action='open-sidepanel']");
    brand?.classList.remove("mcp-first-use-bounce");
    manager?.classList.remove("mcp-first-use-bounce");
  }

  function handleGlobalKeyboard(event) {
    if (isSearchOpen()) {
      if (event.key === "Escape") closeSearchOverlay();
      if (event.key === "ArrowDown") {
        event.preventDefault();
        selectSearchOverlayResult(searchOverlayState.selectedIndex + 1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        selectSearchOverlayResult(searchOverlayState.selectedIndex - 1);
      }
      if (event.key === "Enter") {
        const results = Array.isArray(searchOverlayState.results) ? searchOverlayState.results : getOverlayResults();
        const item = results[searchOverlayState.selectedIndex];
        if (item && searchOverlayState.mediaType === "image") copyImageToClipboard(item);
        else if (item) copyFloatingTextLikeItemToClipboard(overlaySearchDisplayItem(item, searchOverlayState.mediaType === "dev" ? "dev" : "text"), searchOverlayState.mediaType);
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
        const results = Array.isArray(searchOverlayState.results) ? searchOverlayState.results : getOverlayResults();
        const item = results[searchOverlayState.selectedIndex];
        if (item && searchOverlayState.mediaType !== "image") {
          const mediaType = searchOverlayState.mediaType === "dev" ? "dev" : "text";
          openEditor(activateOverlaySearchVersion(item, mediaType), mediaType);
        }
      }
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f") {
      return;
    } else if (event.key === "/" && !isTypingTarget(event.target)) {
      event.preventDefault();
      openSearchOverlay();
    }
  }

  async function openItemEditorById(itemId) {
    await refreshState();
    const item = state.items.find((current) => current.id === itemId) || (state.devItems || []).find((current) => current.id === itemId);
    if (!item) {
      showToast(tr("editor.notFound"));
      return;
    }
    revealFloatingPanel();
    openEditor(item, state.devItems?.some((current) => current.id === itemId) ? "dev" : "text");
  }

  async function openItemClassifierById(itemId, mediaType = "text", pendingItem = null) {
    if (IS_WEB_LAUNCHER) {
      enforceWebLauncherOnlyMode();
      await openNativeCategoryChooser(pendingItem || { id: itemId }, mediaType);
      return;
    }
    if (!pendingItem) await refreshState();
    const item = pendingItem || (mediaType === "image"
      ? state.imageItems.find((current) => current.id === itemId)
      : mediaType === "dev"
        ? (state.devItems || []).find((current) => current.id === itemId)
        : state.items.find((current) => current.id === itemId));
    if (!item) {
      showToast(tr("editor.notFound"));
      return;
    }
    activeFloatingTab = mediaType === "image" ? "image" : mediaType === "dev" ? "dev" : activeFloatingTab;
    revealFloatingPanel();
    showCategoryChooser(item, mediaType);
  }

  function buildTextSourceLocator(content, preferredElement = null, options = {}) {
    const selection = window.getSelection?.();
    const selectedRange = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
    const selectedElement = selectedRange
      ? (selectedRange.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? selectedRange.commonAncestorContainer
        : selectedRange.commonAncestorContainer.parentElement)
      : null;
    const preferred = preferredElement?.nodeType === Node.ELEMENT_NODE ? preferredElement : null;
    const range = selectedRange && (!preferred || preferred.contains(selectedElement) || selectedElement?.contains?.(preferred))
      ? selectedRange
      : null;
    const rangeElement = range
      ? (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? range.commonAncestorContainer
        : range.commonAncestorContainer.parentElement)
      : null;
    const element = preferred
      ? preferred
      : rangeElement || document.activeElement;
    const kind = options.kind === "code" ? "code" : "text";
    const sourceElement = kind === "code" ? sourceCodeContainer(element, content) || element : element;
    const quote = sourceTextQuote(range, content, sourceElement, kind === "code" ? 50000 : 1800);
    return buildBaseSourceLocator(kind, sourceElement, {
      textQuote: quote,
      code: kind === "code" ? buildCodeSourceFingerprint(content, sourceElement, options.codeDetection) : null,
      conversation: buildAiConversationSourceFingerprint(content, sourceElement)
    });
  }

  function aiConversationPlatform() {
    const host = location.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "chatgpt.com") return "chatgpt";
    if (host === "gemini.google.com") return "gemini";
    if (host === "claude.ai") return "claude";
    if (host === "grok.com" || host === "x.com") return "grok";
    return "";
  }

  function aiConversationTurnCandidates(platform = aiConversationPlatform()) {
    if (platform === "claude") {
      return [...document.querySelectorAll("[data-testid='user-message'], [class~='group/message-row']")]
        .filter((element) => element.offsetParent !== null)
        .filter((element) => element.matches("[data-testid='user-message']") || !element.querySelector("[data-testid='user-message']"));
    }
    const selectors = {
      chatgpt: "[data-message-author-role='user'], [data-message-author-role='assistant']",
      gemini: "[data-test-id='luminous-collapsed-bubble'], model-response",
      grok: "[data-testid='user-message'], [data-testid='assistant-message']"
    };
    const selector = selectors[platform];
    if (!selector) return [];
    return [...document.querySelectorAll(selector)].filter((element, index, list) => (
      element.offsetParent !== null
      && !list.some((other, otherIndex) => otherIndex !== index && other.contains(element) && aiConversationRole(other, platform) === aiConversationRole(element, platform))
    ));
  }

  function aiConversationTurnForElement(element, platform = aiConversationPlatform()) {
    if (!element?.closest || !platform) return null;
    if (platform === "chatgpt") {
      return element.closest("[data-message-author-role='user'], [data-message-author-role='assistant']");
    }
    if (platform === "gemini") {
      return element.closest("[data-test-id='luminous-collapsed-bubble'], model-response");
    }
    if (platform === "grok") {
      return element.closest("[data-testid='user-message'], [data-testid='assistant-message']");
    }
    if (platform === "claude") {
      const user = element.closest("[data-testid='user-message']");
      if (user) return user;
      const row = element.closest("[class~='group/message-row']");
      if (row && !row.querySelector("[data-testid='user-message']")) return row;
    }
    return null;
  }

  function aiConversationRole(turn, platform = aiConversationPlatform()) {
    if (!turn) return "";
    if (platform === "chatgpt") return turn.getAttribute("data-message-author-role") || "";
    if (platform === "gemini") return turn.matches("model-response") ? "assistant" : "user";
    if (platform === "grok") return turn.matches("[data-testid='assistant-message']") ? "assistant" : "user";
    if (platform === "claude") return turn.matches("[data-testid='user-message']") || turn.querySelector("[data-testid='user-message']") ? "user" : "assistant";
    return "";
  }

  function aiConversationContentElement(turn, platform = aiConversationPlatform(), role = aiConversationRole(turn, platform)) {
    if (!turn) return null;
    if (platform === "chatgpt") {
      return turn.querySelector(".markdown, [class*='message-content'], [class*='whitespace-pre-wrap']") || turn;
    }
    if (platform === "gemini") {
      return role === "assistant"
        ? turn.querySelector("structured-content-container.model-response-text")
          || turn.querySelector("message-content")?.parentElement
          || turn.querySelector("message-content")
          || turn.querySelector("[id^='message-content-id-']")
          || turn.querySelector(".markdown")
          || turn
        : turn;
    }
    if (platform === "grok") {
      return turn.querySelector(".response-content-markdown") || turn;
    }
    if (platform === "claude") {
      return role === "user"
        ? turn.querySelector(".whitespace-pre-wrap") || turn
        : turn.querySelector(".standard-markdown") || turn.querySelector(".font-claude-response") || turn.querySelector("[class*='font-claude-response']") || turn;
    }
    return turn;
  }

  function buildAiConversationSourceFingerprint(content, element) {
    const platform = aiConversationPlatform();
    const turn = aiConversationTurnForElement(element, platform);
    if (!turn) return null;
    const role = aiConversationRole(turn, platform);
    if (!role) return null;
    const candidates = aiConversationTurnCandidates(platform);
    const sameRole = candidates.filter((candidate) => aiConversationRole(candidate, platform) === role);
    const contentElement = aiConversationContentElement(turn, platform, role);
    const normalized = normalizeSearchText(content || contentElement?.innerText || contentElement?.textContent || "");
    let hash = 2166136261;
    for (let index = 0; index < normalized.length; index += 1) {
      hash ^= normalized.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return {
      platform,
      role,
      messageId: turn.getAttribute("data-message-id") || contentElement?.id || "",
      turnIndex: candidates.indexOf(turn),
      roleIndex: sameRole.indexOf(turn),
      signature: `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`,
      charCount: normalized.length,
      startAnchor: normalized.slice(0, 420),
      endAnchor: normalized.slice(-420),
      turnSelectors: stableElementSelectors(turn),
      contentSelectors: stableElementSelectors(contentElement),
      scrollSelectors: stableElementSelectors(aiConversationScrollContainer(turn, platform))
    };
  }

  function aiConversationScrollContainer(turn, platform = aiConversationPlatform()) {
    if (platform === "gemini") return turn?.closest("[data-test-id='chat-history-container']") || document.querySelector("[data-test-id='chat-history-container']");
    if (platform === "claude") return turn?.closest("[data-autoscroll-container='true']") || document.querySelector("[data-autoscroll-container='true']");
    let current = turn?.parentElement;
    while (current && current !== document.body) {
      const style = getComputedStyle(current);
      if (current.scrollHeight > current.clientHeight + 80 && /auto|scroll/.test(style.overflowY)) return current;
      current = current.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  function sourceCodeContainer(element, content = "") {
    const selector = [
      "pre", "code-block", "[data-testid='markdown-code-block']", "#code-block-viewer",
      "#wiggle-file-content", ".cm-editor", "[class*='code-block__code']"
    ].join(",");
    const direct = element?.closest?.(selector);
    if (direct) return direct;
    const wanted = normalizeSearchText(content);
    let current = element;
    while (current && current !== document.body && current !== document.documentElement) {
      const candidate = normalizeSearchText(current.innerText || current.textContent || "");
      if (wanted && candidate.includes(wanted) && candidate.length <= Math.max(1200, wanted.length * 1.5)) return current;
      current = current.parentElement;
    }
    return element;
  }

  function buildCodeSourceFingerprint(content, element, detection = {}) {
    const raw = String(content || "").replace(/\r\n?/g, "\n").trim();
    const lines = raw.split("\n");
    const meaningful = lines.map((line) => line.trim()).filter(Boolean);
    const anchors = [...new Set([
      ...meaningful.slice(0, 4),
      ...meaningful.slice(Math.max(0, Math.floor(meaningful.length / 2) - 1), Math.floor(meaningful.length / 2) + 2),
      ...meaningful.slice(-4)
    ].map((line) => line.slice(0, 500)).filter((line) => line.length >= 2))].slice(0, 12);
    let hash = 2166136261;
    for (let index = 0; index < raw.length; index += 1) {
      hash ^= raw.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return {
      languageId: String(detection?.languageId || ""),
      languageName: String(detection?.languageName || ""),
      signature: `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`,
      lineCount: lines.length,
      charCount: raw.length,
      anchors,
      classTokens: sourceElementClassTokens(element),
      ancestorTokens: sourceAncestorTokens(element),
      dataAttributes: sourceElementDataAttributes(element, element?.parentElement)
    };
  }

  function buildImageSourceLocator(imageUrl, element = null) {
    const image = element?.matches?.("img")
      ? element
      : element?.querySelector?.("img") || findLikelySourceImageElement(imageUrl);
    const target = image || element;
    const figure = target?.closest?.("figure");
    const anchor = target?.closest?.("a[href]");
    const nearby = imageSourceContextElement(target);
    const urls = target ? imageUrlCandidatesFromElement(target) : [imageUrl].filter(Boolean);
    const imageElements = [...document.images];
    const alt = image?.alt || target?.getAttribute?.("aria-label") || "";
    const sameAltImages = alt
      ? imageElements.filter((candidate) => normalizeSearchText(candidate.alt) === normalizeSearchText(alt))
      : [];
    const parentSelectors = [
      target?.parentElement,
      anchor,
      target?.closest?.("picture"),
      figure,
      nearby
    ].filter(Boolean).flatMap((candidate) => stableElementSelectors(candidate));
    return buildBaseSourceLocator("image", target, {
      image: {
        urls: [imageUrl, ...urls].filter(Boolean),
        alt,
        title: image?.title || target?.getAttribute?.("title") || "",
        caption: figure?.querySelector?.("figcaption")?.textContent || "",
        nearbyText: nearby?.innerText || nearby?.textContent || "",
        nearbyHeadings: nearbySourceHeadings(nearby),
        anchorHref: anchor?.href || "",
        anchorText: anchor?.innerText || anchor?.textContent || "",
        parentSelectors: [...new Set(parentSelectors)],
        classTokens: sourceElementClassTokens(target),
        ancestorTokens: sourceAncestorTokens(target),
        dataAttributes: sourceElementDataAttributes(target, anchor, nearby),
        documentIndex: image ? imageElements.indexOf(image) : -1,
        sameAltIndex: image && sameAltImages.length ? sameAltImages.indexOf(image) : -1,
        renderedWidth: image?.getBoundingClientRect?.().width || null,
        renderedHeight: image?.getBoundingClientRect?.().height || null,
        width: image?.naturalWidth || image?.width || null,
        height: image?.naturalHeight || image?.height || null
      }
    });
  }

  function imageSourceContextElement(element) {
    if (!element?.parentElement) return element || null;
    let fallback = element.closest?.("figure, picture, a[href]") || element.parentElement;
    let current = element.parentElement;
    for (let depth = 0; current && current !== document.body && depth < 8; depth += 1) {
      const text = String(current.innerText || current.textContent || "").replace(/\s+/g, " ").trim();
      const imageCount = current.querySelectorAll?.("img").length || 0;
      const hasCardIdentity = current.matches?.([
        "figure", "li", "article", "[role='article']",
        "[data-product-id]", "[data-item-id]", "[data-sku]",
        "[class*='product']", "[class*='card']", "[class*='item']"
      ].join(","));
      if (text.length >= 8 && text.length <= 2400 && imageCount <= 12 && hasCardIdentity) return current;
      if (text.length >= 16 && text.length <= 1400 && imageCount <= 6) return current;
      if (hasCardIdentity && imageCount <= 12) fallback = current;
      current = current.parentElement;
    }
    return fallback;
  }

  function nearbySourceHeadings(container) {
    if (!container?.querySelectorAll) return [];
    return [...container.querySelectorAll("h1, h2, h3, h4, [role='heading'], a[href]")]
      .map((element) => String(element.innerText || element.textContent || element.getAttribute?.("aria-label") || "").replace(/\s+/g, " ").trim())
      .filter((value) => value.length >= 4 && value.length <= 500)
      .filter((value, index, list) => list.indexOf(value) === index)
      .slice(0, 8);
  }

  function sourceElementClassTokens(element) {
    return [...(element?.classList || [])]
      .map((value) => String(value || "").trim())
      .filter((value) => /^[a-z_-][a-z0-9_-]{1,80}$/i.test(value))
      .slice(0, 20);
  }

  function sourceAncestorTokens(element) {
    const tokens = [];
    let current = element;
    for (let depth = 0; current?.matches && current !== document.body && depth < 8; depth += 1) {
      const identity = [
        current.tagName?.toLowerCase?.() || "",
        current.id ? `#${current.id}` : "",
        ...sourceElementClassTokens(current).slice(0, 4).map((name) => `.${name}`)
      ].join("");
      if (identity && !tokens.includes(identity)) tokens.push(identity);
      current = current.parentElement;
    }
    return tokens;
  }

  function sourceElementDataAttributes(...elements) {
    const record = {};
    elements.filter(Boolean).forEach((element, index) => {
      [...(element.attributes || [])].forEach((attribute) => {
        if (!/^(data-|id$|name$|role$|itemprop$|alt$|title$)/i.test(attribute.name)) return;
        const value = String(attribute.value || "").trim();
        if (!value || value.length > 1200) return;
        record[`${index}:${attribute.name}`] = value;
      });
    });
    return record;
  }

  function buildBaseSourceLocator(kind, element, extra = {}) {
    const target = element?.nodeType === Node.ELEMENT_NODE ? element : null;
    const canonicalUrl = document.querySelector("link[rel='canonical']")?.href || "";
    const rect = target?.getBoundingClientRect?.();
    const pageWidth = Math.max(1, document.documentElement.scrollWidth, window.innerWidth);
    const pageHeight = Math.max(1, document.documentElement.scrollHeight, window.innerHeight);
    const attributes = {};
    ["id", "name", "role", "aria-label", "data-testid", "data-test-id", "data-test", "data-qa", "data-message-id", "data-message-author-role", "itemprop"].forEach((name) => {
      const value = target?.getAttribute?.(name);
      if (value) attributes[name] = value;
    });
    return Object.assign({
      version: 2,
      kind,
      pageUrl: location.href,
      canonicalUrl,
      capturedAt: Date.now(),
      selectors: stableElementSelectors(target),
      containerSelectors: stableElementSelectors(sourceLocatorContainer(target)),
      tagName: target?.tagName?.toLowerCase?.() || "",
      attributes,
      geometry: rect ? {
        xRatio: Math.max(0, Math.min(1, (rect.left + window.scrollX) / pageWidth)),
        yRatio: Math.max(0, Math.min(1, (rect.top + window.scrollY) / pageHeight)),
        widthRatio: Math.max(0, Math.min(1, rect.width / pageWidth)),
        heightRatio: Math.max(0, Math.min(1, rect.height / pageHeight)),
        documentX: Math.max(0, rect.left + window.scrollX),
        documentY: Math.max(0, rect.top + window.scrollY),
        renderedWidth: Math.max(0, rect.width),
        renderedHeight: Math.max(0, rect.height),
        pageWidth,
        pageHeight,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        scrollX: Math.max(0, window.scrollX),
        scrollY: Math.max(0, window.scrollY)
      } : null
    }, extra);
  }

  function sourceTextQuote(range, content, element, exactLimit = 1800) {
    const exact = String(content || "").trim();
    let prefix = "";
    let suffix = "";
    if (range && range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
      const value = String(range.startContainer.nodeValue || "");
      prefix = value.slice(Math.max(0, range.startOffset - 220), range.startOffset);
      suffix = value.slice(range.endOffset, range.endOffset + 220);
    } else if (range) {
      const containerText = String((rangeElementForQuote(range) || element)?.textContent || "");
      const selected = String(range.toString() || "");
      const index = selected ? containerText.indexOf(selected) : -1;
      if (index >= 0) {
        prefix = containerText.slice(Math.max(0, index - 220), index);
        suffix = containerText.slice(index + selected.length, index + selected.length + 220);
      }
    }
    const container = rangeElementForQuote(range) || sourceLocatorContainer(element) || element;
    const heading = closestSourceHeading(container);
    return {
      exact: exact.slice(0, exactLimit),
      prefix: prefix.trim(),
      suffix: suffix.trim(),
      containerText: String(container?.innerText || container?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 1200),
      heading: String(heading?.innerText || heading?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 500)
    };
  }

  function rangeElementForQuote(range) {
    if (!range?.commonAncestorContainer) return null;
    return range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
      ? range.commonAncestorContainer
      : range.commonAncestorContainer.parentElement;
  }

  function sourceLocatorContainer(element) {
    return element?.closest?.("p, li, blockquote, pre, code-block, article, section, figure, picture, td, th, h1, h2, h3, h4, [role='article'], [data-message-id], [data-message-author-role], [data-testid='user-message'], [data-testid='assistant-message'], [data-test-id='luminous-collapsed-bubble'], model-response, [class~='group/message-row'], [data-testid='markdown-code-block'], #code-block-viewer, #wiggle-file-content, .cm-editor, [class*='code-block__code']")
      || element?.parentElement
      || null;
  }

  function closestSourceHeading(element) {
    const section = element?.closest?.("article, section, main, [role='article']");
    return section?.querySelector?.("h1, h2, h3, h4")
      || element?.closest?.("h1, h2, h3, h4")
      || null;
  }

  function stableElementSelectors(element) {
    if (!element?.matches) return [];
    const selectors = [];
    const add = (selector) => {
      if (!selector || selectors.includes(selector)) return;
      try {
        if (document.querySelector(selector)) selectors.push(selector);
      } catch (error) {}
    };
    if (element.id && document.querySelectorAll(`#${CSS.escape(element.id)}`).length === 1) {
      add(`#${CSS.escape(element.id)}`);
    }
    [
      "data-testid", "data-test-id", "data-test", "data-qa", "data-product-id", "data-item-id", "data-message-id", "data-message-author-role",
      "data-sku", "itemprop", "name", "aria-label",
      ...(element.matches("img") ? ["alt"] : []),
      ...(element.matches("a[href]") ? ["href"] : [])
    ].forEach((name) => {
      const value = element.getAttribute(name);
      if (!value || value.length > 500) return;
      const selector = `${element.tagName.toLowerCase()}[${name}="${cssAttributeValue(value)}"]`;
      try {
        if (document.querySelectorAll(selector).length === 1) add(selector);
      } catch (error) {}
    });
    add(compactCssPath(element, true));
    add(compactCssPath(element, false));
    return selectors.slice(0, 8);
  }

  function compactCssPath(element, preferClasses = true) {
    const parts = [];
    let current = element;
    for (let depth = 0; current?.matches && current !== document.documentElement && depth < 8; depth += 1) {
      if (current.id && document.querySelectorAll(`#${CSS.escape(current.id)}`).length === 1) {
        parts.unshift(`#${CSS.escape(current.id)}`);
        break;
      }
      let part = current.tagName.toLowerCase();
      if (preferClasses) {
        const classes = [...current.classList]
          .filter((name) => /^[a-z_-][a-z0-9_-]{1,48}$/i.test(name) && !/\d{4,}|active|selected|hover|focus|open|closed|loaded|loading|lazy|visible|hidden|current|disabled/i.test(name))
          .slice(0, 2);
        if (classes.length) part += classes.map((name) => `.${CSS.escape(name)}`).join("");
      }
      const siblings = current.parentElement
        ? [...current.parentElement.children].filter((sibling) => sibling.tagName === current.tagName)
        : [];
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
      parts.unshift(part);
      current = current.parentElement;
    }
    return parts.join(" > ");
  }

  function cssAttributeValue(value) {
    return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
  }

  function findLikelySourceImageElement(imageUrl) {
    const wanted = normalizeImageUrl(imageUrl);
    if (!wanted) return null;
    return [...document.images].find((image) => {
      const values = imageUrlCandidatesFromElement(image);
      return values.some((value) => imageCandidateMatchScore(value, [wanted]) >= 64);
    }) || null;
  }

  function highlightSourceText(content, sourceLocator = null) {
    const text = String(content || "").trim();
    const jobId = ++sourceHighlightJobId;
    if (!text) {
      showPageToast(tr("source.notFound"));
      return false;
    }
    let finished = false;
    const run = (isFinal = false) => {
      if (jobId !== sourceHighlightJobId) return true;
      if (finished) return true;
      const found = highlightTextFromSourceLocator(sourceLocator, text)
        || buildTextHighlightAttempts(text).some((value) => findAndHighlight(value));
      if (found) {
        finished = true;
        showPageToast(tr("source.found"));
        return true;
      }
      if (isFinal) showPageToast(tr("source.notFound"));
      return false;
    };
    const immediate = run(false);
    if (!immediate) [160, 480, 1100, 2200].forEach((delay, index, list) => {
      window.setTimeout(() => run(index === list.length - 1), delay);
    });
    return immediate;
  }

  function highlightTextFromSourceLocator(locator, content) {
    if (!locator || !["text", "code"].includes(locator.kind)) return false;
    // Preserve the dedicated code pipeline as the strongest signal. AI turn
    // metadata is a complementary fallback for code, never a replacement.
    if (locator.kind === "code") {
      const codeTarget = findCodeSourceTarget(locator, content);
      if (codeTarget) return highlightElement(codeTarget, "text");
    }
    const conversationTarget = findAiConversationSourceTarget(locator, content);
    if (conversationTarget) return highlightElement(conversationTarget, "text");
    const attempts = buildTextHighlightAttempts(locator.textQuote?.exact || content);
    const targets = sourceLocatorElements(locator);
    for (const target of targets) {
      for (const attempt of attempts) {
        const range = findNormalizedRange(attempt, target);
        if (range && highlightRange(range)) return true;
      }
      const wantedContainer = normalizeSearchText(locator.textQuote?.containerText || "");
      const targetText = normalizeSearchText(target.innerText || target.textContent || "");
      if (wantedContainer.length >= 24 && sourceTextSimilarity(targetText, wantedContainer) >= 0.78) {
        return highlightElement(aiConversationHighlightTargetFromElement(target) || compactHighlightElement(target));
      }
    }
    const quoteRange = findQuoteAnchoredRange(locator.textQuote || {}, content);
    if (quoteRange) return highlightRange(quoteRange);
    return false;
  }

  function findCodeSourceTarget(locator, fallbackContent = "") {
    const code = locator?.code || {};
    const exact = normalizeSearchText(locator?.textQuote?.exact || fallbackContent);
    const anchors = (Array.isArray(code.anchors) ? code.anchors : [])
      .map(normalizeSearchText)
      .filter((value) => value.length >= 2);
    const candidates = [...document.querySelectorAll([
      "pre", "code-block", "[data-testid='markdown-code-block']", "#code-block-viewer",
      "#wiggle-file-content", ".cm-editor", "[class*='code-block__code']"
    ].join(","))].filter((element) => element.offsetParent !== null);
    let best = { target: null, score: 0 };
    candidates.forEach((element) => {
      const text = normalizeSearchText(element.innerText || element.textContent || "");
      if (!text) return;
      let score = 0;
      if (exact && text === exact) score += 200;
      else if (exact && (text.includes(exact) || exact.includes(text))) {
        score += 110 * (Math.min(text.length, exact.length) / Math.max(text.length, exact.length));
      }
      if (anchors.length) score += anchors.filter((anchor) => text.includes(anchor)).length * 18;
      const language = normalizeSearchText(code.languageId || code.languageName || "");
      const identity = normalizeSearchText(`${element.className || ""} ${element.getAttribute?.("data-language") || ""}`);
      if (language && identity.includes(language)) score += 22;
      if (score > best.score) best = { target: sourceCodeContainer(element, fallbackContent), score };
    });
    const minimumScore = anchors.length >= 2 ? Math.min(54, anchors.length * 18) : 70;
    return best.score >= minimumScore ? best.target : null;
  }

  function findAiConversationSourceTarget(locator, fallbackContent = "") {
    const conversation = locator?.conversation;
    const platform = aiConversationPlatform();
    if (!conversation?.platform || conversation.platform !== platform) return null;
    const candidates = aiConversationTurnCandidates(platform);
    if (!candidates.length) return null;
    const wanted = normalizeSearchText(locator?.textQuote?.exact || fallbackContent);
    const startAnchor = normalizeSearchText(conversation.startAnchor || "");
    const endAnchor = normalizeSearchText(conversation.endAnchor || "");
    const roleCandidates = candidates.filter((candidate) => aiConversationRole(candidate, platform) === conversation.role);
    let best = { target: null, score: -Infinity };
    roleCandidates.forEach((turn, roleIndex) => {
      const contentElement = aiConversationContentElement(turn, platform, conversation.role);
      const text = normalizeSearchText(contentElement?.innerText || contentElement?.textContent || "");
      if (!text) return;
      let score = 0;
      const messageId = turn.getAttribute("data-message-id") || contentElement?.id || "";
      if (conversation.messageId && messageId === conversation.messageId) score += 500;
      if (wanted && text === wanted) score += 300;
      else if (wanted && (text.includes(wanted) || wanted.includes(text))) {
        score += 190 * (Math.min(text.length, wanted.length) / Math.max(text.length, wanted.length));
      } else if (wanted) {
        score += sourceTextSimilarity(text, wanted) * 120;
      }
      if (startAnchor) score += text.includes(startAnchor) ? 90 : sourceTextSimilarity(text.slice(0, startAnchor.length), startAnchor) * 35;
      if (endAnchor) score += text.includes(endAnchor) ? 70 : sourceTextSimilarity(text.slice(-endAnchor.length), endAnchor) * 30;
      if (Number.isInteger(conversation.roleIndex)) score += Math.max(0, 25 - Math.abs(roleIndex - conversation.roleIndex) * 5);
      const turnIndex = candidates.indexOf(turn);
      if (Number.isInteger(conversation.turnIndex)) score += Math.max(0, 20 - Math.abs(turnIndex - conversation.turnIndex) * 4);
      if (score > best.score) best = { target: contentElement || turn, score };
    });
    return best.score >= 72 ? best.target : null;
  }

  function aiConversationHighlightTargetFromElement(element) {
    if (!element?.closest) return null;
    const platform = aiConversationPlatform();
    if (!platform) return null;
    const turn = aiConversationTurnForElement(element, platform);
    if (!turn) return null;
    const role = aiConversationRole(turn, platform);
    if (!role) return null;
    const target = aiConversationContentElement(turn, platform, role) || turn;
    const rect = target.getBoundingClientRect?.();
    return isUsableSourceHighlightRect(rect, "text") ? target : null;
  }

  function sourceLocatorElements(locator) {
    const elements = [];
    [...(locator?.selectors || []), ...(locator?.containerSelectors || [])].forEach((selector) => {
      if (!selector) return;
      try {
        document.querySelectorAll(selector).forEach((element) => {
          if (!elements.includes(element) && element.offsetParent !== null) elements.push(element);
        });
      } catch (error) {}
    });
    if (elements.length) return elements;
    const attributes = locator?.attributes || {};
    Object.entries(attributes).forEach(([name, value]) => {
      if (!name || !value || !/^(id|name|role|aria-label|data-testid|data-test-id|data-test|data-qa|data-message-id|data-message-author-role|itemprop)$/.test(name)) return;
      const selector = `[${name}="${cssAttributeValue(value)}"]`;
      try {
        document.querySelectorAll(selector).forEach((element) => {
          if (!elements.includes(element) && element.offsetParent !== null) elements.push(element);
        });
      } catch (error) {}
    });
    return elements;
  }

  function findQuoteAnchoredRange(textQuote = {}, fallbackContent = "") {
    const exact = normalizeSearchText(textQuote.exact || fallbackContent);
    if (!exact || exact.length < 8) return null;
    const mapData = buildSearchableTextMap();
    const matches = [];
    let index = mapData.text.indexOf(exact);
    while (index >= 0 && matches.length < 80) {
      matches.push(index);
      index = mapData.text.indexOf(exact, index + Math.max(1, Math.floor(exact.length / 3)));
    }
    if (!matches.length) return null;
    const prefix = normalizeSearchText(textQuote.prefix || "");
    const suffix = normalizeSearchText(textQuote.suffix || "");
    const bestIndex = matches.map((start) => {
      const before = mapData.text.slice(Math.max(0, start - Math.max(240, prefix.length + 40)), start);
      const after = mapData.text.slice(start + exact.length, start + exact.length + Math.max(240, suffix.length + 40));
      let score = 1;
      if (prefix) score += before.endsWith(prefix) ? 8 : sourceTextSimilarity(before.slice(-prefix.length), prefix) * 4;
      if (suffix) score += after.startsWith(suffix) ? 8 : sourceTextSimilarity(after.slice(0, suffix.length), suffix) * 4;
      return { start, score };
    }).sort((left, right) => right.score - left.score)[0]?.start;
    return Number.isFinite(bestIndex) ? rangeFromSearchableTextMap(mapData, bestIndex, exact.length) : null;
  }

  function sourceTextSimilarity(left, right) {
    const a = normalizeSearchText(left);
    const b = normalizeSearchText(right);
    if (!a || !b) return 0;
    if (a === b) return 1;
    if (a.includes(b) || b.includes(a)) return Math.min(a.length, b.length) / Math.max(a.length, b.length);
    const words = new Set(a.split(" ").filter((word) => word.length > 2));
    const wanted = b.split(" ").filter((word) => word.length > 2);
    if (!wanted.length) return 0;
    return wanted.filter((word) => words.has(word)).length / wanted.length;
  }

  function highlightSourceImage(payload) {
    const candidates = buildImageNeedles(payload);
    if (!candidates.length) {
      showPageToast(tr("source.imageNotFound"));
      return false;
    }
    const signature = sourceImageHighlightSignature(payload, candidates);
    if (activeSourceImageHighlightJob?.signature === signature
      && Date.now() - activeSourceImageHighlightJob.startedAt < 12000) {
      if (activeSourceImageHighlightJob.finished && activeSourceImageHighlightJob.target?.isConnected) return true;
      if (activeSourceImageHighlightJob.finished && !activeSourceImageHighlightJob.target?.isConnected) {
        activeSourceImageHighlightJob.finished = false;
        activeSourceImageHighlightJob.target = null;
      }
      return activeSourceImageHighlightJob.run?.(false) || false;
    }
    const jobId = ++sourceHighlightJobId;
    ensureSourceHighlightStyle();
    const job = {
      signature,
      jobId,
      startedAt: Date.now(),
      finished: false,
      target: null,
      run: null
    };
    const run = (isFinal = false) => {
      if (jobId !== sourceHighlightJobId) return true;
      if (job.finished && job.target?.isConnected) return true;
      if (job.finished) {
        job.finished = false;
        job.target = null;
      }
      const match = findSourceImageElement(candidates, payload);
      if (match) {
        const target = resolveImageHighlightTarget(match);
        if (highlightElement(target, "image")) {
          job.finished = true;
          job.target = target;
          showPageToast(tr("source.imageFound"));
          return true;
        }
      }
      if (isFinal) showPageToast(tr("source.imageNotFound"));
      return false;
    };
    job.run = run;
    activeSourceImageHighlightJob = job;
    const immediate = run(false);
    if (!immediate) [160, 480, 1100, 2200].forEach((delay, index, list) => {
      window.setTimeout(() => run(index === list.length - 1), delay);
    });
    return immediate;
  }

  function sourceImageHighlightSignature(payload, candidates = []) {
    return [
      payload?.highlightRequestId || "",
      payload?.itemId || "",
      payload?.sourceUrl || location.href,
      payload?.altText || payload?.title || "",
      ...candidates.slice(0, 8).map((candidate) => candidate.full || candidate.noQuery || candidate.fileName || "")
    ].join("|");
  }

  function buildImageNeedles(payload) {
    const values = typeof payload === "string"
      ? [payload]
      : [
        payload?.imageUrl,
        payload?.originalImageUrl,
        payload?.thumbnailUrl,
        payload?.dataUrl,
        ...(Array.isArray(payload?.candidates) ? payload.candidates : []),
        ...(Array.isArray(payload?.sourceLocator?.image?.urls) ? payload.sourceLocator.image.urls : [])
      ].filter(Boolean);
    const needles = new Map();
    values.forEach((value) => {
      const normalized = normalizeImageUrl(value);
      if (!normalized) return;
      needles.set(normalized.full, normalized);
      if (normalized.noQuery) needles.set(normalized.noQuery, normalized);
      if (normalized.fileName) needles.set(normalized.fileName, normalized);
      if (normalized.pathName) needles.set(normalized.pathName, normalized);
      if (normalized.fileStem) needles.set(normalized.fileStem, normalized);
    });
    return [...needles.values()];
  }

  function findSourceImageElement(needles, payload = {}) {
    const candidates = collectSourceImageCandidates(needles);
    const directUrlMatch = findBestImageUrlMatch(candidates, needles);
    if (directUrlMatch) return directUrlMatch;
    const locatorMatch = findImageFromSourceLocator(payload?.sourceLocator, candidates, needles, payload);
    if (locatorMatch) return locatorMatch;

    let best = { element: null, score: 0 };
    candidates.forEach((candidate) => {
      const score = scoreImageCandidate(candidate, needles, payload);
      if (score > best.score) {
        best = { element: candidate, score };
      }
    });
    if (!best.element || best.score < 38) return null;
    return normalizeImageMatchElement(best.element);
  }

  function findImageFromSourceLocator(locator, candidates, needles, payload = {}) {
    if (!locator || locator.kind !== "image") return null;
    let best = { element: null, score: 0 };
    const exactSelectors = Array.isArray(locator.selectors) ? locator.selectors : [];
    const contextSelectors = [
      ...(Array.isArray(locator.image?.parentSelectors) ? locator.image.parentSelectors : []),
      ...(Array.isArray(locator.containerSelectors) ? locator.containerSelectors : [])
    ];
    const inspectSelectors = (selectors, exactSelector = false) => selectors.forEach((selector) => {
      if (!selector) return;
      try {
        document.querySelectorAll(selector).forEach((element) => {
          imageVisualCandidatesFromNode(element).forEach((candidate) => {
            const score = scoreImageLocatorCandidate(candidate, locator, needles, payload, exactSelector && candidate === element);
            if (score > best.score) best = { element: candidate, score };
          });
        });
      } catch (error) {}
    });
    inspectSelectors(exactSelectors, true);
    inspectSelectors(contextSelectors, false);
    if (best.score >= 100) return best.element;
    candidates.forEach((element) => {
      const candidate = normalizeImageMatchElement(element);
      if (!candidate) return;
      const score = scoreImageLocatorCandidate(candidate, locator, needles, payload, false);
      if (score > best.score) best = { element: candidate, score };
    });
    return best.score >= 46 ? best.element : null;
  }

  function scoreImageLocatorCandidate(candidate, locator, needles, payload = {}, exactSelector = false) {
    if (!candidate || !resolveImageHighlightTarget(candidate)) return 0;
    const imageMeta = locator.image || {};
    const directUrlScore = scoreImageUrlCandidate(candidate, needles);
    let score = directUrlScore >= 64 ? 110 + directUrlScore : directUrlScore * 0.35;
    if (exactSelector && candidate.matches?.("img")) score += 34;

    const candidateAlt = normalizeSearchText(candidate.alt || candidate.getAttribute?.("aria-label") || "");
    const wantedAlt = normalizeSearchText(imageMeta.alt || payload.altText || "");
    if (wantedAlt.length >= 5 && candidateAlt) {
      const similarity = sourceTextSimilarity(candidateAlt, wantedAlt);
      if (candidateAlt === wantedAlt) score += 72;
      else if (similarity >= 0.82) score += 54;
      else if (similarity >= 0.55) score += 28;
    }

    const wantedAnchor = normalizeImageUrl(imageMeta.anchorHref || "");
    const candidateAnchor = normalizeImageUrl(candidate.closest?.("a[href]")?.href || "");
    if (wantedAnchor && candidateAnchor) {
      if (candidateAnchor.full === wantedAnchor.full || candidateAnchor.noQuery === wantedAnchor.noQuery) score += 84;
      else if (candidateAnchor.pathName && candidateAnchor.pathName === wantedAnchor.pathName) score += 66;
    }

    const wantedClasses = new Set((imageMeta.classTokens || []).map((value) => String(value || "")));
    const classHits = sourceElementClassTokens(candidate).filter((value) => wantedClasses.has(value)).length;
    if (wantedClasses.size && classHits) score += Math.min(22, classHits * 8);

    const wantedAncestorTokens = new Set((imageMeta.ancestorTokens || []).map((value) => String(value || "")));
    if (wantedAncestorTokens.size) {
      const ancestorHits = sourceAncestorTokens(candidate).filter((value) => wantedAncestorTokens.has(value)).length;
      score += Math.min(24, ancestorHits * 5);
    }

    const context = imageSourceContextElement(candidate);
    const candidateContextText = normalizeSearchText([
      context?.innerText,
      context?.textContent,
      candidate.closest?.("a[href]")?.innerText
    ].filter(Boolean).join(" "));
    const wantedContextText = normalizeSearchText([
      imageMeta.nearbyText,
      imageMeta.anchorText,
      ...(Array.isArray(imageMeta.nearbyHeadings) ? imageMeta.nearbyHeadings : [])
    ].filter(Boolean).join(" "));
    if (wantedContextText.length >= 8 && candidateContextText) {
      const contextSimilarity = sourceTextSimilarity(candidateContextText, wantedContextText);
      if (contextSimilarity >= 0.8) score += 34;
      else if (contextSimilarity >= 0.5) score += 20;
    }

    const wantedWidth = Number(imageMeta.width || imageMeta.renderedWidth || payload.width || 0);
    const wantedHeight = Number(imageMeta.height || imageMeta.renderedHeight || payload.height || 0);
    const candidateWidth = Number(candidate.naturalWidth || candidate.clientWidth || 0);
    const candidateHeight = Number(candidate.naturalHeight || candidate.clientHeight || 0);
    if (wantedWidth && wantedHeight && candidateWidth && candidateHeight) {
      const wantedRatio = wantedWidth / wantedHeight;
      const candidateRatio = candidateWidth / candidateHeight;
      if (Math.abs(candidateRatio - wantedRatio) < 0.035) score += 16;
      else if (Math.abs(candidateRatio - wantedRatio) < 0.1) score += 8;
    }

    const geometry = locator.geometry;
    if (geometry && candidate.getBoundingClientRect) {
      const rect = candidate.getBoundingClientRect();
      const pageWidth = Math.max(1, document.documentElement.scrollWidth, window.innerWidth);
      const pageHeight = Math.max(1, document.documentElement.scrollHeight, window.innerHeight);
      const xRatio = (rect.left + window.scrollX) / pageWidth;
      const yRatio = (rect.top + window.scrollY) / pageHeight;
      const ratioDistance = Math.abs(xRatio - Number(geometry.xRatio || 0)) + Math.abs(yRatio - Number(geometry.yRatio || 0));
      score += Math.max(0, 26 - ratioDistance * 90);
      if (Number(geometry.documentY) > 0 && Number(geometry.pageHeight) > 0) {
        const normalizedDocumentDistance = Math.abs((rect.top + window.scrollY) - Number(geometry.documentY)) / Math.max(pageHeight, Number(geometry.pageHeight));
        score += Math.max(0, 12 - normalizedDocumentDistance * 70);
      }
    }
    return score;
  }

  function imageVisualCandidatesFromNode(element) {
    if (!element?.matches) return [];
    if (element.matches("img")) return [element];
    if (element.matches("source")) {
      const image = element.closest("picture")?.querySelector("img");
      return image ? [image] : [];
    }
    const candidates = [...element.querySelectorAll("img")].slice(0, 80);
    if (hasRenderableCssImage(element)) candidates.push(element);
    return [...new Set(candidates)];
  }

  function collectSourceImageCandidates(needles) {
    const candidates = new Set([...document.images]);
    document.querySelectorAll("source[srcset], source[data-srcset], source[data-lazy-srcset]").forEach((source) => {
      const image = source.closest("picture")?.querySelector("img");
      if (image) candidates.add(image);
    });
    document.querySelectorAll([
      "[data-bg]", "[data-background]", "[data-image]", "[data-full]",
      "[style*='background']", "[class*='background-image']", "[class*='hero-image']"
    ].join(",")).forEach((node) => {
      if (hasRenderableCssImage(node)) candidates.add(node);
    });
    return candidates;
  }

  function findBestImageUrlMatch(candidates, needles) {
    let best = { element: null, score: 0 };
    candidates.forEach((candidate) => {
      const score = scoreImageUrlCandidate(candidate, needles);
      if (score > best.score) {
        best = { element: candidate, score };
      }
    });
    if (!best.element || best.score < 64) return null;
    return normalizeImageMatchElement(best.element);
  }

  function normalizeImageMatchElement(element) {
    if (!element) return null;
    if (element.matches?.("img")) return element;
    if (element.matches?.("source")) return element.closest?.("picture")?.querySelector("img") || null;
    const images = element.querySelectorAll ? [...element.querySelectorAll("img")] : [];
    if (images.length === 1) return images[0];
    if (hasRenderableCssImage(element)) return element;
    return null;
  }

  function resolveImageHighlightTarget(element) {
    const normalized = normalizeImageMatchElement(element);
    if (isUsableImageHighlightTarget(normalized)) return normalized;
    const renderedImage = element?.querySelectorAll
      ? [...element.querySelectorAll("img")].find(isUsableImageHighlightTarget)
      : null;
    if (renderedImage) return renderedImage;
    if (hasRenderableCssImage(element) && isUsableImageHighlightTarget(element)) return element;
    return null;
  }

  function hasRenderableCssImage(element) {
    if (!element?.isConnected || !element.getBoundingClientRect) return false;
    const urls = extractCssUrls(window.getComputedStyle(element).backgroundImage || "");
    return urls.some((url) => /^data:image\/|^blob:|^https?:\/\//i.test(String(url || "")));
  }

  function isUsableImageHighlightTarget(element) {
    if (!element?.isConnected || !element.getBoundingClientRect) return false;
    if (element.matches?.("picture, source")) return false;
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.display === "contents" || style.visibility === "hidden") return false;
    const rect = element.getBoundingClientRect();
    return Number.isFinite(rect.width) && Number.isFinite(rect.height) && rect.width >= 8 && rect.height >= 8;
  }

  function elementMatchesImageNeedles(element, needles) {
    const values = collectImageCandidateValues(element);
    return values.some((value) => imageCandidateMatchesNeedles(value, needles));
  }

  function scoreImageCandidate(element, needles, payload = {}) {
    const values = collectImageCandidateValues(element);
    if (isDecorativeImageCandidate(element, values)) return 0;
    let score = scoreImageUrlCandidate(element, needles, values);
    const hasStrongUrl = score >= 64;
    const text = normalizeSearchText([
      element.alt,
      element.title,
      element.getAttribute?.("aria-label"),
      element.getAttribute?.("data-alt"),
      element.closest?.("figure")?.innerText,
      element.closest?.(".news-card, .news-card-full, .card, .entity-card, .roller-item")?.innerText,
      element.closest?.("a")?.getAttribute?.("href")
    ].filter(Boolean).join(" "));
    const wantedText = normalizeSearchText([payload.altText, payload.title].filter(Boolean).join(" "));
    if (wantedText && !hasStrongUrl) {
      if (text.includes(wantedText.slice(0, Math.min(80, wantedText.length)))) score += 22;
      const titleWords = wantedText.split(" ").filter((word) => word.length > 4);
      const hits = titleWords.filter((word) => text.includes(word)).length;
      if (titleWords.length && hits / titleWords.length >= 0.45) score += 26;
    }
    const wantedAnchor = normalizeImageUrl(payload?.sourceLocator?.image?.anchorHref || "");
    const candidateAnchor = normalizeImageUrl(element.closest?.("a[href]")?.href || "");
    if (wantedAnchor && candidateAnchor) {
      if (candidateAnchor.full === wantedAnchor.full || candidateAnchor.noQuery === wantedAnchor.noQuery) score += 78;
      else if (candidateAnchor.pathName && candidateAnchor.pathName === wantedAnchor.pathName) score += 60;
    }
    const wantedWidth = Number(payload.width || 0);
    const wantedHeight = Number(payload.height || 0);
    const elementWidth = Number(element.naturalWidth || element.width || element.clientWidth || 0);
    const elementHeight = Number(element.naturalHeight || element.height || element.clientHeight || 0);
    if (wantedWidth && wantedHeight && elementWidth && elementHeight && !hasStrongUrl) {
      if (Math.abs(elementWidth - wantedWidth) <= 3 && Math.abs(elementHeight - wantedHeight) <= 3) score += 34;
      else if (Math.abs((elementWidth / elementHeight) - (wantedWidth / wantedHeight)) < 0.04) score += 12;
    }
    return score;
  }

  function scoreImageUrlCandidate(element, needles, values = collectImageCandidateValues(element)) {
    if (isDecorativeImageCandidate(element, values)) return 0;
    return values.reduce((best, value) => Math.max(best, imageCandidateMatchScore(value, needles)), 0);
  }

  function isDecorativeImageCandidate(element, values = []) {
    const container = element.closest?.("header, nav, [role='banner'], [role='navigation']");
    const descriptor = normalizeSearchText([
      element.id,
      typeof element.className === "string" ? element.className : "",
      element.alt,
      element.title,
      element.getAttribute?.("aria-label"),
      element.closest?.("a")?.getAttribute?.("aria-label"),
      element.closest?.("a")?.getAttribute?.("title"),
      ...values
    ].filter(Boolean).join(" "));
    const looksDecorative = /\b(logo|favicon|sprite|brand|branding|avatar|icon|picto|placeholder)\b/.test(descriptor);
    const looksLikeContent = /\b(thumbnail|thumb|poster|news|article|card|media|photo|image|img|figure|picture|cover|hero)\b/.test(descriptor);
    const isTiny = (element.naturalWidth || element.width || element.clientWidth || 0) > 0
      && (element.naturalHeight || element.height || element.clientHeight || 0) > 0
      && ((element.naturalWidth || element.width || element.clientWidth || 0) < 80 || (element.naturalHeight || element.height || element.clientHeight || 0) < 80);
    return (container && looksDecorative && !looksLikeContent) || (looksDecorative && !looksLikeContent) || (isTiny && looksDecorative);
  }

  function collectImageCandidateValues(element) {
    const attributes = [
      "currentSrc",
      "src",
      "srcset",
      "data-src",
      "data-original",
      "data-lazy-src",
      "data-srcset",
      "data-lazy-srcset",
      "data-bg",
      "data-background",
      "data-full",
      "data-image",
      "data-url",
      "data-src-medium",
      "data-src-large",
      "data-src-xlarge",
      "data-webp",
      "data-lazy",
      "poster"
    ];
    const values = [];
    attributes.forEach((name) => {
      const value = name in element ? element[name] : element.getAttribute?.(name);
      if (value) values.push(...splitImageCandidates(value));
    });
    element.querySelectorAll?.("img, source, [src], [srcset], [data-src], [data-original], [data-lazy-src], [data-srcset], [data-lazy-srcset], [data-src-medium], [data-src-large], [data-src-xlarge], [data-webp], [data-lazy]").forEach((child) => {
      attributes.forEach((name) => {
        const value = name in child ? child[name] : child.getAttribute?.(name);
        if (value) values.push(...splitImageCandidates(value));
      });
    });
    if (element.attributes) {
      [...element.attributes].forEach((attribute) => {
        if (!/(src|image|img|thumb|photo|url|poster|background)/i.test(attribute.name)) return;
        values.push(...splitImageCandidates(attribute.value));
      });
    }
    const style = window.getComputedStyle(element);
    values.push(...extractCssUrls(style.backgroundImage || ""));
    return values;
  }

  function splitImageCandidates(value) {
    return String(value)
      .split(",")
      .map((part) => part.trim().split(/\s+/)[0])
      .filter(Boolean);
  }

  function extractCssUrls(value) {
    const urls = [];
    String(value || "").replace(/url\((['"]?)(.*?)\1\)/g, (match, quote, url) => {
      if (url) urls.push(url);
      return match;
    });
    return urls;
  }

  function imageCandidateMatchesNeedles(value, needles) {
    return imageCandidateMatchScore(value, needles) > 0;
  }

  function imageCandidateMatchScore(value, needles) {
    const candidate = normalizeImageUrl(value);
    if (!candidate) return 0;
    return needles.reduce((score, needle) => {
      if (candidate.full === needle.full) return Math.max(score, 100);
      if (candidate.noQuery && needle.noQuery && candidate.noQuery === needle.noQuery) return Math.max(score, 92);
      if (candidate.pathName && needle.pathName && candidate.pathName === needle.pathName) return Math.max(score, 76);
      if (candidate.fileName && needle.fileName && candidate.fileName === needle.fileName) return Math.max(score, 64);
      if (candidate.fileStem && needle.fileStem && candidate.fileStem.length > 5 && candidate.fileStem === needle.fileStem) return Math.max(score, 48);
      const comparablePaths = candidate.pathName && needle.pathName
        && candidate.pathName !== "/" && needle.pathName !== "/"
        && Math.min(candidate.pathName.length, needle.pathName.length) >= 10;
      if (comparablePaths
        && candidate.origin === needle.origin
        && (candidate.pathName.includes(needle.pathName) || needle.pathName.includes(candidate.pathName))) {
        return Math.max(score, 44);
      }
      if (comparablePaths && candidate.noQuery && needle.noQuery && candidate.noQuery.endsWith(needle.pathName)) return Math.max(score, 38);
      if (comparablePaths && candidate.noQuery && needle.noQuery && needle.noQuery.endsWith(candidate.pathName)) return Math.max(score, 38);
      if (candidate.fileStem && needle.fileStem && candidate.fileStem.length > 5 && (candidate.fileStem.includes(needle.fileStem) || needle.fileStem.includes(candidate.fileStem))) return Math.max(score, 28);
      return score;
    }, 0);
  }

  function normalizeImageUrl(value) {
    const raw = String(value || "").trim();
    if (!raw) return null;
    if (raw.startsWith("data:image/")) {
      return {
        full: raw.slice(0, 160),
        noQuery: raw.slice(0, 160),
        origin: "",
        pathName: "",
        fileName: "",
        fileStem: ""
      };
    }
    try {
      const url = new URL(raw, document.baseURI);
      const pathName = decodeURIComponent(url.pathname || "").replace(/\/+/g, "/");
      const fileName = pathName.split("/").filter(Boolean).pop() || "";
      const fileStem = fileName.replace(/\.[a-z0-9]{2,6}$/i, "");
      url.hash = "";
      const fullUrl = decodeURIComponent(url.href);
      url.search = "";
      const noQuery = decodeURIComponent(url.href);
      return {
        full: fullUrl.toLowerCase(),
        noQuery: noQuery.toLowerCase(),
        origin: url.origin.toLowerCase(),
        pathName: pathName.toLowerCase(),
        fileName: fileName.toLowerCase(),
        fileStem: fileStem.toLowerCase()
      };
    } catch (error) {
      const lowered = raw.toLowerCase();
      const withoutQuery = lowered.split("#")[0].split("?")[0];
      const fileName = withoutQuery.split("/").filter(Boolean).pop() || "";
      const fileStem = fileName.replace(/\.[a-z0-9]{2,6}$/i, "");
      return {
        full: lowered,
        noQuery: withoutQuery,
        origin: "",
        pathName: withoutQuery,
        fileName,
        fileStem
      };
    }
  }

  function buildTextHighlightAttempts(text) {
    const source = String(text || "").replace(/\s+/g, " ").trim();
    const segments = [
      source,
      source.slice(0, 1200),
      source.slice(0, 700),
      source.slice(0, 360),
      source.slice(0, 180),
      ...String(text || "")
        .split(/\n+|(?<=[.!?])\s+/)
        .map((part) => part.trim())
        .filter((part) => part.length >= 28)
        .sort((a, b) => b.length - a.length)
        .slice(0, 8)
    ];
    return segments
      .map((value) => value.trim())
      .filter((value, index, list) => value.length > 8 && list.indexOf(value) === index);
  }

  function findAndHighlight(text) {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    const found = window.find(text, false, false, true, false, false, false);
    if (found && selection?.rangeCount) {
      const range = selection.getRangeAt(0).cloneRange();
      selection.removeAllRanges();
      return highlightRange(range);
    }
    const normalizedRange = findNormalizedRange(text);
    if (normalizedRange) return highlightRange(normalizedRange);
    return findAndHighlightBlock(text);
  }

  function findAndHighlightBlock(text) {
    const needle = normalizeSearchText(text);
    if (!needle || needle.length < 8) return false;
    const blocks = [...document.body.querySelectorAll("p, li, blockquote, article, section, div, td, th, h1, h2, h3, h4, h5, h6")]
      .filter((element) => element.offsetParent !== null && normalizeSearchText(element.innerText || element.textContent).length >= 8);
    const exact = blocks.find((element) => normalizeSearchText(element.innerText || element.textContent).includes(needle));
    if (exact) {
      return highlightElement(aiConversationHighlightTargetFromElement(exact) || compactHighlightElement(exact));
    }
    const fragments = needle.split(" ").filter((word) => word.length > 3);
    const scored = blocks.map((element) => {
      const haystack = normalizeSearchText(element.innerText || element.textContent);
      const hits = fragments.reduce((count, word) => count + (haystack.includes(word) ? 1 : 0), 0);
      return { element, score: hits / Math.max(1, fragments.length) };
    }).sort((a, b) => b.score - a.score)[0];
    return scored?.score >= 0.72
      ? highlightElement(aiConversationHighlightTargetFromElement(scored.element) || compactHighlightElement(scored.element))
      : false;
  }

  function compactHighlightElement(element) {
    if (!element) return null;
    let current = element;
    while (current && current.parentElement && current.parentElement !== document.body) {
      const text = normalizeSearchText(current.innerText || current.textContent);
      const parentText = normalizeSearchText(current.parentElement.innerText || current.parentElement.textContent);
      if (!text || parentText.length > Math.max(280, text.length * 2.2)) break;
      current = current.parentElement;
    }
    return current || element;
  }

  function highlightElement(element, kind = "text") {
    const target = kind === "image" ? resolveImageHighlightTarget(element) : element;
    if (!target) return false;
    const initialRect = target.getBoundingClientRect?.();
    if (!isUsableSourceHighlightRect(initialRect, kind)) return false;
    ensureSourceHighlightStyle();
    removeExistingSourceHighlights();
    // Source navigation is a one-shot handoff. An instant final alignment avoids
    // a native smooth-scroll animation reclaiming the viewport after the user
    // has already started scrolling again.
    scrollElementIntoViewDeep(target, "auto");
    target.classList.add(kind === "image" ? "ucp-image-source-highlight" : "ucp-source-block-highlight");
    startSourceTargetingCountdown(() => target.getBoundingClientRect?.());
    window.clearTimeout(sourceHighlightOverlayCleanupTimer);
    sourceHighlightOverlayCleanupTimer = window.setTimeout(() => {
      removeExistingSourceHighlights();
    }, SOURCE_TARGETING_DURATION_SECONDS * 1000 + 120);
    if (kind === "image") {
      trackLazyImageHighlight(target, () => true);
    }
    const selection = window.getSelection();
    selection?.removeAllRanges();
    return true;
  }

  function trackLazyImageHighlight(target, renderOverlay) {
    let resizeFrame = 0;
    let observer = null;
    const sync = () => {
      if (!target?.isConnected) return false;
      requestAnimationFrame(renderOverlay);
      return true;
    };
    const scheduleSync = () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        sync();
      });
    };
    requestAnimationFrame(sync);
    [120, 360, 760, 1400, 2200].forEach((delay) => window.setTimeout(sync, delay));
    if (target.matches?.("img")) {
      target.addEventListener("load", scheduleSync, { once: true });
      if (typeof target.decode === "function") target.decode().then(scheduleSync).catch(() => {});
    }
    if (typeof ResizeObserver === "function") {
      observer = new ResizeObserver(scheduleSync);
      observer.observe(target);
      window.setTimeout(() => observer?.disconnect(), 2600);
    }
  }

  function isUsableSourceHighlightRect(rect, kind = "text") {
    const minimum = kind === "image" ? 8 : 2;
    return Boolean(rect
      && Number.isFinite(rect.left)
      && Number.isFinite(rect.top)
      && Number.isFinite(rect.width)
      && Number.isFinite(rect.height)
      && rect.width >= minimum
      && rect.height >= minimum);
  }

  function highlightRange(range) {
    ensureSourceHighlightStyle();
    const rects = usefulClientRects(range);
    if (!rects.length) return false;
    const stableTarget = stableSourceHighlightTarget(range);
    if (stableTarget) return highlightElement(stableTarget, "text");
    removeExistingSourceHighlights();
    scrollRectIntoViewDeep(rects[0]);
    window.setTimeout(() => createSourceOverlaysFromRects(
      mergedHighlightRects(usefulClientRects(range)),
      "text",
      () => mergedHighlightRects(usefulClientRects(range))
    ), 180);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    return true;
  }

  function stableSourceHighlightTarget(range) {
    const node = range?.commonAncestorContainer;
    let element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
    if (!element) return null;
    const codeSelector = [
      "pre",
      "code-block",
      "[data-testid='markdown-code-block']",
      "#code-block-viewer",
      "#wiggle-file-content",
      ".cm-editor",
      "[class*='code-block__code']"
    ].join(",");
    const directCodeBlock = element.closest?.(codeSelector);
    if (directCodeBlock) {
      if (directCodeBlock.matches?.("code") && directCodeBlock.parentElement?.matches?.("pre")) {
        return directCodeBlock.parentElement;
      }
      return directCodeBlock;
    }
    const conversationTarget = aiConversationHighlightTargetFromElement(element);
    if (conversationTarget) return conversationTarget;
    const selectedText = normalizeSearchText(range.toString());
    if (!selectedText) return null;
    let candidate = element;
    while (candidate && candidate !== document.body && candidate !== document.documentElement) {
      const candidateText = normalizeSearchText(candidate.innerText || candidate.textContent || "");
      const rect = candidate.getBoundingClientRect?.();
      if (candidateText.includes(selectedText)
        && candidateText.length <= Math.max(320, selectedText.length * 1.8)
        && isUsableSourceHighlightRect(rect, "text")) {
        if (candidate.matches?.("p, li, blockquote, article, section, [class*='artifact'], [data-testid*='artifact']")) {
          return candidate;
        }
      }
      candidate = candidate.parentElement;
    }
    return null;
  }

  function findNormalizedRange(text, root = document.body || document.documentElement) {
    const needle = normalizeSearchText(text);
    if (!needle || needle.length < 8) return null;
    const mapData = buildSearchableTextMap(root);
    const index = mapData.text.indexOf(needle);
    if (index < 0) return null;
    return rangeFromSearchableTextMap(mapData, index, needle.length);
  }

  function rangeFromSearchableTextMap(mapData, index, length) {
    const start = mapData.map[index];
    const end = mapData.map[index + length - 1];
    if (!start || !end) return null;
    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset + 1);
    return range;
  }

  function buildSearchableTextMap(root = document.body || document.documentElement) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || /^(script|style|noscript|textarea|input|select)$/i.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (!String(node.nodeValue || "").trim()) return NodeFilter.FILTER_REJECT;
        const style = window.getComputedStyle(parent);
        if (style.display === "none" || style.visibility === "hidden") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let text = "";
    const map = [];
    let previousWasSpace = true;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const value = String(node.nodeValue || "");
      for (let offset = 0; offset < value.length; offset += 1) {
        const normalized = normalizeCharForSearch(value[offset]);
        if (!normalized) continue;
        if (normalized === " ") {
          if (previousWasSpace) continue;
          text += " ";
          map.push({ node, offset });
          previousWasSpace = true;
          continue;
        }
        for (const char of normalized) {
          text += char;
          map.push({ node, offset });
        }
        previousWasSpace = false;
      }
      if (!previousWasSpace) {
        text += " ";
        map.push({ node, offset: Math.max(0, value.length - 1) });
        previousWasSpace = true;
      }
    }
    return { text: text.trim(), map };
  }

  function normalizeSearchText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeCharForSearch(char) {
    if (/\s/.test(char)) return " ";
    return char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function scrollElementIntoViewDeep(element, behavior = "auto") {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    scrollElementParentsIntoView(element, rect);
    element.scrollIntoView({ behavior, block: "center", inline: "center" });
  }

  function scrollElementParentsIntoView(element, rect) {
    let parent = element.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      const style = window.getComputedStyle(parent);
      const targetRect = element.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const outsideY = targetRect.top < parentRect.top || targetRect.bottom > parentRect.bottom;
      const outsideX = targetRect.left < parentRect.left || targetRect.right > parentRect.right;
      const canScrollY = /(auto|scroll|overlay|hidden|clip)/.test(style.overflowY)
        && parent.scrollHeight > parent.clientHeight
        && (outsideY || /(auto|scroll|overlay)/.test(style.overflowY));
      const canScrollX = /(auto|scroll|overlay|hidden|clip)/.test(style.overflowX)
        && parent.scrollWidth > parent.clientWidth
        && (outsideX || /(auto|scroll|overlay)/.test(style.overflowX));
      if (canScrollY || canScrollX) {
        if (canScrollY) parent.scrollTop += targetRect.top - parentRect.top - (parentRect.height / 2) + (targetRect.height / 2);
        if (canScrollX) parent.scrollLeft += targetRect.left - parentRect.left - (parentRect.width / 2) + (targetRect.width / 2);
      }
      parent = parent.parentElement;
    }
  }

  function scrollRectIntoViewDeep(rect) {
    const parents = [];
    let parent = document.elementFromPoint(
      Math.min(Math.max(rect.left + rect.width / 2, 0), window.innerWidth - 1),
      Math.min(Math.max(rect.top + rect.height / 2, 0), window.innerHeight - 1)
    )?.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      const style = window.getComputedStyle(parent);
      const canScrollY = /(auto|scroll|overlay)/.test(style.overflowY) && parent.scrollHeight > parent.clientHeight;
      const canScrollX = /(auto|scroll|overlay)/.test(style.overflowX) && parent.scrollWidth > parent.clientWidth;
      if (canScrollY || canScrollX) parents.push({ parent, canScrollY, canScrollX });
      parent = parent.parentElement;
    }
    parents.forEach(({ parent: scrollParent, canScrollY, canScrollX }) => {
      const parentRect = scrollParent.getBoundingClientRect();
      if (canScrollY) {
        scrollParent.scrollTop += rect.top - parentRect.top - (parentRect.height / 2) + (rect.height / 2);
      }
      if (canScrollX) {
        scrollParent.scrollLeft += rect.left - parentRect.left - (parentRect.width / 2) + (rect.width / 2);
      }
    });
    window.scrollBy({
      top: rect.top - (window.innerHeight / 2) + (rect.height / 2),
      left: rect.left - (window.innerWidth / 2) + (rect.width / 2),
      behavior: "smooth"
    });
  }

  function usefulClientRects(target) {
    const rects = Array.from(target?.getClientRects?.() || []);
    return rects
      .filter((rect) => rect.width > 2 && rect.height > 2)
      .slice(0, 24);
  }

  function mergedHighlightRects(rects) {
    const clean = (rects || []).filter((rect) => rect.width > 2 && rect.height > 2);
    if (!clean.length) return [];
    if (clean.length === 1) return [expandRect(clean[0], 7)];
    const left = Math.min(...clean.map((rect) => rect.left));
    const top = Math.min(...clean.map((rect) => rect.top));
    const right = Math.max(...clean.map((rect) => rect.right));
    const bottom = Math.max(...clean.map((rect) => rect.bottom));
    return [expandRect({
      left,
      top,
      right,
      bottom,
      width: right - left,
      height: bottom - top
    }, 9)];
  }

  function expandRect(rect, padding = 6) {
    const left = rect.left - padding;
    const top = rect.top - padding;
    const width = rect.width + padding * 2;
    const height = rect.height + padding * 2;
    return {
      left,
      top,
      right: left + width,
      bottom: top + height,
      width,
      height
    };
  }

  function createSourceOverlaysFromRects(rects, kind = "text", rectProvider = null) {
    removeSourceOverlayLayer();
    const cleanRects = (rects || []).filter((rect) => rect.width > 2 && rect.height > 2);
    if (!cleanRects.length) return false;
    const layer = document.createElement("div");
    layer.id = "ucp-source-overlay-layer";
    layer.setAttribute("aria-hidden", "true");
    document.documentElement.appendChild(layer);
    const overlays = [];
    cleanRects.slice(0, kind === "image" ? 1 : 3).forEach((rect) => {
      const overlay = document.createElement("div");
      overlay.className = `ucp-source-overlay ucp-source-overlay-${kind}`;
      layer.appendChild(overlay);
      overlays.push(overlay);
    });
    let syncFrame = 0;
    const sync = () => {
      syncFrame = 0;
      const nextRects = (typeof rectProvider === "function" ? rectProvider() : cleanRects)
        .filter((rect) => rect.width > 2 && rect.height > 2)
        .slice(0, overlays.length);
      overlays.forEach((overlay, index) => {
        const rect = nextRects[index];
        overlay.hidden = !rect;
        if (!rect) return;
        overlay.style.left = `${rect.left}px`;
        overlay.style.top = `${rect.top}px`;
        overlay.style.width = `${Math.max(8, rect.width)}px`;
        overlay.style.height = `${Math.max(8, rect.height)}px`;
      });
    };
    const scheduleSync = () => {
      if (syncFrame) return;
      syncFrame = window.requestAnimationFrame(sync);
    };
    sync();
    if (typeof rectProvider === "function") {
      document.addEventListener("scroll", scheduleSync, true);
      window.addEventListener("resize", scheduleSync, { passive: true });
      layer.__ucpOverlayCleanup = () => {
        document.removeEventListener("scroll", scheduleSync, true);
        window.removeEventListener("resize", scheduleSync);
        if (syncFrame) window.cancelAnimationFrame(syncFrame);
      };
    }
    startSourceTargetingCountdown(() => {
      const currentRects = (typeof rectProvider === "function" ? rectProvider() : cleanRects)
        .filter((rect) => rect.width > 2 && rect.height > 2);
      if (!currentRects.length) return null;
      const left = Math.min(...currentRects.map((rect) => rect.left));
      const top = Math.min(...currentRects.map((rect) => rect.top));
      const right = Math.max(...currentRects.map((rect) => rect.right));
      const bottom = Math.max(...currentRects.map((rect) => rect.bottom));
      return { left, top, right, bottom, width: right - left, height: bottom - top };
    });
    window.clearTimeout(sourceHighlightOverlayCleanupTimer);
    sourceHighlightOverlayCleanupTimer = window.setTimeout(() => {
      if (document.getElementById("ucp-source-overlay-layer") === layer) removeExistingSourceHighlights();
    }, SOURCE_TARGETING_DURATION_SECONDS * 1000 + 120);
    return true;
  }

  function startSourceTargetingCountdown(rectProvider) {
    removeSourceTargetingStatus();
    const status = document.createElement("div");
    status.id = "ucp-source-targeting-status";
    status.setAttribute("aria-live", "polite");
    status.setAttribute("role", "status");
    status.dir = "auto";
    document.documentElement.appendChild(status);
    let remaining = SOURCE_TARGETING_DURATION_SECONDS;
    const position = () => {
      const rect = typeof rectProvider === "function" ? rectProvider() : null;
      if (!isUsableSourceHighlightRect(rect, "text")) return;
      const center = Math.max(18, Math.min(window.innerWidth - 18, rect.left + rect.width / 2));
      const preferredTop = rect.bottom + 14;
      status.style.left = `${center}px`;
      status.style.top = `${Math.max(12, Math.min(window.innerHeight - 52, preferredTop))}px`;
    };
    const render = () => {
      status.textContent = tr(remaining === 1 ? "source.targetingEndsInOne" : "source.targetingEndsIn", { seconds: remaining });
      position();
    };
    const onViewportChange = () => window.requestAnimationFrame(position);
    document.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange, { passive: true });
    status.__ucpTargetingCleanup = () => {
      document.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
    render();
    sourceTargetingCountdownTimer = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        removeExistingSourceHighlights();
        return;
      }
      render();
    }, 1000);
  }

  function removeSourceTargetingStatus() {
    window.clearInterval(sourceTargetingCountdownTimer);
    sourceTargetingCountdownTimer = 0;
    const status = document.getElementById("ucp-source-targeting-status");
    status?.__ucpTargetingCleanup?.();
    status?.remove();
  }

  function removeSourceOverlayLayer() {
    const layer = document.getElementById("ucp-source-overlay-layer");
    layer?.__ucpOverlayCleanup?.();
    layer?.remove();
  }

  function ensureSourceHighlightStyle() {
    let style = document.getElementById("ucp-source-highlight-style");
    if (!style) {
      style = document.createElement("style");
      style.id = "ucp-source-highlight-style";
      document.documentElement.appendChild(style);
    }
    const accent = normalizeHexColor(state?.settings?.accentColor || "#e50914");
    const accentRgb = hexToRgbParts(accent);
    style.textContent = `
      @keyframes ucpSourceAccentPulse {
        0%, 100% { border-color: ${accent}; outline-color: ${accent}; box-shadow: inset 0 0 0 var(--ucp-source-frame-width, 5px) ${accent}, 0 0 0 2px rgba(255, 255, 255, .92), 0 0 24px 7px rgba(${accentRgb}, .58); opacity: 1; }
        50% { border-color: #ffffff; outline-color: #ffffff; box-shadow: inset 0 0 0 var(--ucp-source-frame-width, 5px) #ffffff, 0 0 0 8px rgba(${accentRgb}, .2), 0 0 30px 10px rgba(${accentRgb}, .68); opacity: .98; }
      }
      #ucp-source-overlay-layer {
        position: fixed !important;
        inset: 0 auto auto 0 !important;
        z-index: 2147483646 !important;
        pointer-events: none !important;
      }
      .ucp-source-overlay {
        position: absolute !important;
        box-sizing: border-box !important;
        border: 5px solid ${accent} !important;
        border-radius: 8px !important;
        background: transparent !important;
        pointer-events: none !important;
        animation: ucpSourceAccentPulse 720ms ease-in-out 3 !important;
      }
      .ucp-source-overlay-text {
        border-width: 4px !important;
        border-radius: 7px !important;
      }
      .ucp-source-overlay-image {
        border-width: 7px !important;
        border-radius: 12px !important;
      }
      .ucp-source-block-highlight,
      .ucp-image-source-highlight {
        --ucp-source-frame-width: 5px;
        outline: 5px solid ${accent} !important;
        outline-offset: 4px !important;
        border-radius: 8px !important;
        box-shadow: inset 0 0 0 5px ${accent}, 0 0 0 2px rgba(255, 255, 255, .92), 0 0 24px 7px rgba(${accentRgb}, .58) !important;
        animation: ucpSourceAccentPulse 720ms ease-in-out 3 !important;
      }
      .ucp-image-source-highlight {
        --ucp-source-frame-width: 7px;
        outline-width: 7px !important;
        outline-offset: 5px !important;
        border-radius: 12px !important;
      }
      #ucp-source-targeting-status {
        position: fixed !important;
        z-index: 2147483647 !important;
        transform: translateX(-50%) !important;
        width: max-content !important;
        max-width: min(560px, calc(100vw - 28px)) !important;
        padding: 8px 14px !important;
        border: 1px solid rgba(${accentRgb}, .62) !important;
        border-radius: 999px !important;
        color: ${accent} !important;
        background: rgba(15, 18, 26, .88) !important;
        box-shadow: 0 8px 26px rgba(0, 0, 0, .34) !important;
        font: 700 16px/1.25 Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        letter-spacing: .01em !important;
        text-align: center !important;
        white-space: normal !important;
        pointer-events: none !important;
      }
      @media (prefers-reduced-motion: reduce) {
        .ucp-source-overlay,
        .ucp-source-block-highlight,
        .ucp-image-source-highlight { animation: none !important; }
      }
    `;
  }

  function removeExistingSourceHighlights() {
    removeSourceTargetingStatus();
    removeSourceOverlayLayer();
    document.querySelectorAll(".ucp-source-block-highlight").forEach((node) => {
      node.classList.remove("ucp-source-block-highlight");
    });
    document.querySelectorAll(".ucp-image-source-highlight").forEach((node) => {
      node.classList.remove("ucp-image-source-highlight");
    });
    document.querySelectorAll(".ucp-source-highlight").forEach((node) => {
      const parent = node.parentNode;
      if (!parent) return;
      while (node.firstChild) parent.insertBefore(node.firstChild, node);
      parent.removeChild(node);
      parent.normalize();
    });
  }

  function showPageToast(text) {
    let toast = document.getElementById("ucp-source-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "ucp-source-toast";
      toast.style.cssText = [
        "position:fixed",
        "right:24px",
        "bottom:24px",
        "z-index:2147483647",
        "padding:10px 14px",
        "border-radius:999px",
        "color:#fff",
        "background:#111",
        "border:1px solid rgba(229,9,20,.55)",
        "box-shadow:0 16px 48px rgba(0,0,0,.5)",
        "font:13px Inter,system-ui,sans-serif"
      ].join(";");
      document.documentElement.appendChild(toast);
    }
    toast.textContent = text;
    toast.style.opacity = "1";
    clearTimeout(showPageToast.timer);
    showPageToast.timer = setTimeout(() => { toast.style.opacity = "0"; }, 3200);
  }

  function isTypingTarget(target) {
    return Boolean(target?.closest?.("input, textarea, [contenteditable='true']"));
  }

  function lang() {
    return state.settings?.language || "en";
  }

  function welcomePreviewTranslation(key, params = {}, language = "en") {
    if (!IS_WELCOME_FLOATING_PREVIEW) return "";
    const count = params?.count ?? 0;
    const number = params?.number ?? "";
    const labels = {
      en: {
        "app.name": "Ultimate Clipboard Pro",
        "clipboard.itemCount": `${count} text(s)`,
        "dev.itemCount": `${count} code(s)`,
        "images.itemCount": `${count} image(s)`,
        "search.placeholderTexts": "Search texts",
        "search.placeholderDev": "Search code",
        "search.placeholderImages": "Search images",
        "versioning.shortLabel": `V${number}`,
        "versioning.showNextVersion": "Show next version",
        "categories.classify": "Classify",
        "categories.general": "General",
        "source.open": "Open source",
        "common.useCapture": "Use capture",
        "tabs.text": "Text",
        "tabs.dev": "Code",
        "images.tab": "Images"
      },
      fr: {
        "app.name": "Ultimate Clipboard Pro",
        "clipboard.itemCount": `${count} texte(s)`,
        "dev.itemCount": `${count} code(s)`,
        "images.itemCount": `${count} image(s)`,
        "search.placeholderTexts": "Rechercher des textes",
        "search.placeholderDev": "Rechercher du code",
        "search.placeholderImages": "Rechercher des images",
        "versioning.shortLabel": `V${number}`,
        "versioning.showNextVersion": "Afficher la version suivante",
        "categories.classify": "Classer",
        "categories.general": "Général",
        "source.open": "Ouvrir la source",
        "common.useCapture": "Utiliser la capture",
        "tabs.text": "Texte",
        "tabs.dev": "Code",
        "images.tab": "Images"
      },
      es: {
        "app.name": "Ultimate Clipboard Pro",
        "clipboard.itemCount": `${count} texto(s)`,
        "dev.itemCount": `${count} código(s)`,
        "images.itemCount": `${count} imagen(es)`,
        "search.placeholderTexts": "Buscar textos",
        "search.placeholderDev": "Buscar código",
        "search.placeholderImages": "Buscar imágenes",
        "versioning.shortLabel": `V${number}`,
        "versioning.showNextVersion": "Mostrar la siguiente versión",
        "categories.classify": "Clasificar",
        "categories.general": "General",
        "source.open": "Abrir fuente",
        "common.useCapture": "Usar captura",
        "tabs.text": "Texto",
        "tabs.dev": "Código",
        "images.tab": "Imágenes"
      },
      it: {
        "app.name": "Ultimate Clipboard Pro",
        "clipboard.itemCount": `${count} testo/i`,
        "dev.itemCount": `${count} codice/i`,
        "images.itemCount": `${count} immagine/i`,
        "search.placeholderTexts": "Cerca testi",
        "search.placeholderDev": "Cerca codice",
        "search.placeholderImages": "Cerca immagini",
        "versioning.shortLabel": `V${number}`,
        "versioning.showNextVersion": "Mostra la versione successiva",
        "categories.classify": "Classifica",
        "categories.general": "Generale",
        "source.open": "Apri fonte",
        "common.useCapture": "Usa cattura",
        "tabs.text": "Testo",
        "tabs.dev": "Codice",
        "images.tab": "Immagini"
      },
      de: {
        "app.name": "Ultimate Clipboard Pro",
        "clipboard.itemCount": `${count} Text(e)`,
        "dev.itemCount": `${count} Code(s)`,
        "images.itemCount": `${count} Bild(er)`,
        "search.placeholderTexts": "Texte suchen",
        "search.placeholderDev": "Code suchen",
        "search.placeholderImages": "Bilder suchen",
        "versioning.shortLabel": `V${number}`,
        "versioning.showNextVersion": "Nächste Version anzeigen",
        "categories.classify": "Einordnen",
        "categories.general": "Allgemein",
        "source.open": "Quelle öffnen",
        "common.useCapture": "Capture verwenden",
        "tabs.text": "Text",
        "tabs.dev": "Code",
        "images.tab": "Bilder"
      }
    };
    return (labels[language] || labels.en)[key] || "";
  }

  function tr(key, params) {
    const translated = globalThis.MCP?.t ? globalThis.MCP.t(key, params, lang()) : key;
    if (IS_WELCOME_FLOATING_PREVIEW && translated === key) {
      return welcomePreviewTranslation(key, params, lang()) || key;
    }
    return translated;
  }

  function triggerMicroAnimation(element, className = "mcp-soft-bounce", duration = 280) {
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), duration);
  }

  function showToast(text) {
    if (!shadowRoot) return;
    const toast = shadowRoot.querySelector("[data-role='toast']");
    if (!toast || !text) return;
    shadowRoot.appendChild(toast);
    toast.hidden = false;
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => {
        if (!toast.classList.contains("is-visible")) toast.hidden = true;
      }, 180);
    }, 2600);
  }

  function filterItems(items, query) {
    const normalized = normalize(query);
    const sorted = [...items].filter((item) => !isTrashCategoryId(item.categoryId) && !isVaultCategoryId(item.categoryId) && !isVaultCategoryId(item.languageId)).sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return (b.lastCopiedAt || b.createdAt || 0) - (a.lastCopiedAt || a.createdAt || 0);
    });
    if (!normalized) return sorted;
    return sorted.filter((item) => normalize([
      item.title,
      item.content,
      item.preview,
      item.note,
      item.categoryName,
      item.sourceDomain,
      item.sourceUrl,
      item.sourceTitle,
      ...(item.tags || [])
    ].join(" ")).includes(normalized));
  }

  function filterImages(items, query) {
    const normalized = normalize(query);
    const sorted = [...items].filter((item) => !isTrashCategoryId(item.categoryId) && !isVaultCategoryId(item.categoryId) && !isVaultCategoryId(item.languageId)).sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return (b.lastCopiedAt || b.createdAt || 0) - (a.lastCopiedAt || a.createdAt || 0);
    });
    if (!normalized) return sorted;
    if (globalThis.MCP.searchItems) {
      const byId = new Map(sorted.map((item) => [item.id, item]));
      const searchable = sorted.map((item) => Object.assign({}, item, {
        content: [
          item.title,
          item.altText,
          item.categoryName,
          item.sourceDomain,
          item.sourceUrl,
          item.sourceTitle,
          item.originalImageUrl,
          item.imageUrl,
          item.thumbnailUrl,
          item.imagePageTitle,
          item.imageElementTitle,
          item.imageFileName,
          item.isScreenshot ? tr("images.screenshot") : "",
          ...(item.imageCandidates || []),
          ...(item.tags || [])
        ].filter(Boolean).join(" "),
        preview: item.altText || item.title || item.sourceTitle || item.imagePageTitle || ""
      }));
      return globalThis.MCP.searchItems(searchable, query, state.imageCategories || [], {
        language: state.settings.language || "en"
      }).map((item) => byId.get(item.id) || item);
    }
    return sorted.filter((item) => normalize([
      item.title,
      item.altText,
      item.categoryName,
      item.sourceDomain,
      item.sourceUrl,
      item.sourceTitle,
      item.originalImageUrl,
      item.imageUrl,
      item.thumbnailUrl,
      item.imagePageTitle,
      item.imageElementTitle,
      item.imageFileName,
      item.isScreenshot ? tr("images.screenshot") : "",
      ...(item.imageCandidates || []),
      ...(item.tags || [])
    ].join(" ")).includes(normalized));
  }

  function normalize(value) {
    return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
  }

  function makeDraggable(panel) {
    return;
  }

  window.addEventListener("focus", scheduleDisplayPermissionRefresh, { passive: true });
  window.addEventListener("resize", scheduleDisplayPermissionRefresh, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) scheduleDisplayPermissionRefresh();
  });
})();
