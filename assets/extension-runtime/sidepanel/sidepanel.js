(function initSidePanel() {
  const { MESSAGE_TYPES } = window.MCP;
  const REFRESH_EVENTS = new Set([
    MESSAGE_TYPES.ITEM_CREATED,
    MESSAGE_TYPES.ITEM_UPDATED,
    MESSAGE_TYPES.ITEM_DELETED,
    MESSAGE_TYPES.ITEM_CATEGORY_CHANGED,
    MESSAGE_TYPES.ITEM_FAVORITE_CHANGED,
    MESSAGE_TYPES.ITEM_PINNED_CHANGED,
    MESSAGE_TYPES.ITEM_TAGS_CHANGED,
    MESSAGE_TYPES.IMAGE_SAVED,
    MESSAGE_TYPES.IMAGE_CREATED,
    MESSAGE_TYPES.IMAGE_UPDATED,
    MESSAGE_TYPES.IMAGE_DELETED,
    MESSAGE_TYPES.IMAGE_CATEGORY_CHANGED,
    MESSAGE_TYPES.IMAGE_FAVORITE_CHANGED,
    MESSAGE_TYPES.IMAGE_PINNED_CHANGED,
    MESSAGE_TYPES.IMAGE_CATEGORIES_UPDATED,
    MESSAGE_TYPES.DEV_SAVED,
    MESSAGE_TYPES.DEV_CREATED,
    MESSAGE_TYPES.DEV_UPDATED,
    MESSAGE_TYPES.DEV_DELETED,
    MESSAGE_TYPES.DEV_CATEGORY_CHANGED,
    MESSAGE_TYPES.DEV_FAVORITE_CHANGED,
    MESSAGE_TYPES.DEV_PINNED_CHANGED,
    MESSAGE_TYPES.DEV_CATEGORIES_UPDATED,
    MESSAGE_TYPES.CATEGORIES_UPDATED,
    MESSAGE_TYPES.LANGUAGE_CHANGED,
    MESSAGE_TYPES.SEARCH_INDEX_UPDATED,
    MESSAGE_TYPES.STORAGE_REFRESH_REQUIRED
  ]);
  const LOCAL_STORAGE_KEYS = new Set([
    window.MCP.STORAGE_KEYS.ITEMS,
    window.MCP.STORAGE_KEYS.CATEGORIES,
    window.MCP.STORAGE_KEYS.IMAGE_ITEMS,
    window.MCP.STORAGE_KEYS.IMAGE_CATEGORIES,
    window.MCP.STORAGE_KEYS.DEV_ITEMS,
    window.MCP.STORAGE_KEYS.DEV_CATEGORIES,
    window.MCP.STORAGE_KEYS.SETTINGS,
    window.MCP.STORAGE_KEYS.SNIPPETS,
    window.MCP.STORAGE_KEYS.TEMPLATES
  ]);
  let state = { settings: {}, items: [], categories: [], imageItems: [], imageCategories: [], devItems: [], devCategories: [] };
  let selectedCategory = "all";
  let selectedIndex = 0;
  let favoritesOnly = false;
  let activeTab = "text";
  let imageViewMode = "medium";
  let textViewMode = "card";
  let devViewMode = "card";
  let editingItem = null;
  let editorCategorySelection = "";
  let editorVersionSelection = "";
  let editorCategoryDragState = null;
  let managerSearchState = { query: "", selectedIndex: 0, filters: {}, mediaType: "text", dateKey: "", calendarMonth: "", results: [] };
  let managerSearchSelectedRow = null;
  let managerClassifyState = { item: null, mediaType: "text", query: "" };
  let montageState = { query: "", itemIds: [], versionIds: {}, edits: {}, format: "plain", finalDraft: "", draggingId: "" };
  let montageEditingId = "";
  let montageEditingVersionId = "";
  let createCodeMismatchState = null;
  let categoryDragState = null;
  let managerMenu = null;
  let managerTextModal = null;
  let managerTextModalReturn = null;
  let managerToolDragState = null;
  let managerToolSuppressClickUntil = 0;
  let managerToolStateSaveTimer = null;
  let itemDragState = null;
  let customItemDrag = null;
  let suppressManagerReadyPasteClickUntil = 0;
  let suppressManagerReadyPasteRefreshUntil = 0;
  let itemDragExpandTimer = null;
  let itemDragHoverRootId = "";
  let itemRenderJob = null;
  let virtualItemsState = null;
  let managerBulkSelection = createEmptyBulkSelectionState();
  let currentViewItems = [];
  const managerItemVersionSelection = new Map();
  const managerSearchVersionManualSelection = new Map();
  let managerSearchRenderJob = null;
  let virtualSearchState = null;
  let vaultSessionUnlocked = false;
  let renderCountMaps = new Map();
  let categoryPathCache = null;
  const itemDragAutoExpanded = new Set();
  let stateLoaded = false;
  let openedInitialSearch = false;
  const ITEM_RENDER_CHUNK_SIZE = 36;
  const ITEM_RENDER_LARGE_LIST_THRESHOLD = 80;
  const IMAGE_RENDER_CHUNK_SIZE = 16;
  const IMAGE_RENDER_LARGE_LIST_THRESHOLD = 36;
  const SEARCH_RENDER_CHUNK_SIZE = 54;
  const SEARCH_IMAGE_RENDER_CHUNK_SIZE = 18;
  const SEARCH_RENDER_LARGE_LIST_THRESHOLD = 90;
  const SOURCE_TIMELINE_RENDER_CHUNK_SIZE = 36;
  const SOURCE_TIMELINE_LARGE_LIST_THRESHOLD = 72;
  const VIRTUAL_TEXT_ITEM_HEIGHT = 224;
  const VIRTUAL_IMAGE_ROW_HEIGHT = 306;
  const VIRTUAL_OVERSCAN = 7;
  const VIRTUAL_IMAGE_OVERSCAN_ROWS = 3;
  const MAX_CAPTURE_VERSIONS = 10;
  const ARCAWAND_SITE_URL = "https://arcawand-soft.com/";
  const DEVELOPER_SUPPORT_URL = "https://checkout.dodopayments.com/buy/pdt_0NeUVWCjgZlrNxssj70uo?quantity=1";
  const MANAGER_VIEW_STATE_STORAGE_KEY = "ucp_manager_view_state_v1";
  const MANAGER_FAST_STATE_STORAGE_KEY = "ucp_manager_fast_state_v1";
  const MANAGER_FAST_STATE_MAX_ITEMS = 260;
  const MANAGER_FAST_TEXT_LIMIT = 6000;
  const MANAGER_FAST_IMAGE_URL_LIMIT = 160000;
  const MANAGER_VIEW_STATE_SOURCE_ID = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const previewScrollAnimations = new WeakMap();
  const previewOverflowQueue = new Set();
  const inlineTitleSaveTimers = new Map();
  let previewOverflowRaf = 0;
  let previewOverflowTimer = 0;
  let loadStateInFlight = null;
  let loadStateRerunRequested = false;
  let managerViewStateSaveTimer = 0;
  let managerFastStateSaveTimer = 0;
  let restoredFastState = false;
  let restoredManagerViewState = false;
  let fullStateLoaded = false;
  let pendingManagerItemsScrollTop = 0;
  let pendingManagerCategoryScrollTop = 0;
  let managerViewStateSavedAt = 0;
  let applyingManagerViewState = false;
  const managerItemsScrollTops = { text: 0, dev: 0, image: 0 };
  const managerCategoryScrollTops = { text: 0, dev: 0, image: 0 };
  let itemSearchRenderRaf = 0;
  let categorySearchRenderRaf = 0;
  let managerSearchDetailRenderRaf = 0;
  let managerSearchDetailRenderTimer = 0;
  let suppressInlineTitleRefreshUntil = 0;
  let sourceTimelineSortMode = "date";
  let sourceTimelineMediaType = "text";
  let sourceTimelineRenderJob = null;
  let managerJumpToken = 0;
  let managerJumpState = null;
  const expandedCategories = new Set(["general"]);
  const editorExpandedCategories = new Set(["general"]);
  const managerClassifierExpanded = new Set(["general", "image-general"]);

  function isDemoMode() {
    return Boolean(state.settings?.demoMode);
  }

  function showDemoBlockedNotice() {
    chrome.runtime.sendMessage({ type: "MCP_DEMO_BLOCKED" }).catch(() => {
      showManagerToast(t("common.error"));
    });
  }

  function blockDemoAction(event) {
    if (!isDemoMode()) return false;
    event?.preventDefault?.();
    event?.stopPropagation?.();
    showDemoBlockedNotice();
    return true;
  }

  const DEMO_BLOCKED_MANAGER_ACTIONS = new Set([
    "bulk-enable",
    "bulk-select-all",
    "bulk-deselect-all",
    "bulk-delete",
    "open-tool",
    "copy-emoji",
    "copy-special-character",
    "start-color-pick",
    "start-image-text-capture",
    "search-word-replacer",
    "replace-word-replacer",
    "copy-color-format",
    "copy-tool-output",
    "capture-tool-output",
    "empty-trash",
    "save-editor",
    "open-editor-classifier",
    "save-create-version",
    "create-current-item",
    "save-create-item",
    "save-create-code-detected",
    "save-create-code-current",
    "copy-montage",
    "clear-montage",
    "save-montage-as-text",
    "add-all-montage",
    "polish-montage",
    "copy-montage-final-editor",
    "save-montage-final-editor",
    "save-montage-edit",
    "add-montage-item",
    "remove-montage-item",
    "edit-montage-item",
    "move-montage-up",
    "move-montage-down"
  ]);

  function createEmptyBulkSelectionState() {
    return {
      active: false,
      mediaType: "",
      selectedIds: new Set()
    };
  }

  const elements = {
    search: document.getElementById("searchInput"),
    categoryTreeSearch: document.getElementById("categoryTreeSearch"),
    categories: document.getElementById("categoryList"),
    items: document.getElementById("itemsList"),
    status: document.getElementById("statusBanner"),
    openMontage: document.getElementById("openMontage"),
    openCreateItemFloating: document.getElementById("openCreateItemFloating"),
    newCategory: document.getElementById("newCategory"),
    textTab: document.getElementById("textTab"),
    devTab: document.getElementById("devTab"),
    imageTab: document.getElementById("imageTab"),
    closeManager: document.getElementById("closeManager"),
    openSourceTimeline: document.getElementById("openSourceTimeline"),
    openTools: document.getElementById("openTools"),
    imageViewModes: document.getElementById("imageViewModes"),
    textViewModes: document.getElementById("textViewModes"),
    currentViewTitleSlot: document.getElementById("currentViewTitleSlot"),
    categoryPaneTitle: document.getElementById("categoryPaneTitle"),
    openManagerMenu: document.getElementById("openManagerMenu")
  };
  const ABOUT_KEYS = [
    "popup.aboutIntro",
    "popup.aboutCapture",
    "popup.aboutImages",
    "popup.aboutSearch",
    "popup.aboutSecurity",
    "popup.aboutBackup",
    "popup.aboutDrive",
    "popup.aboutLicense"
  ];
  const PRIVACY_KEYS = [
    "popup.privacyIntro",
    "popup.privacyLocal",
    "popup.privacyData",
    "popup.privacyNoSale",
    "popup.privacyNoAds",
    "popup.privacyPermissions",
    "popup.privacyControl",
    "popup.privacyDodo",
    "popup.privacyContact"
  ];
  const PRO_KEYS = [
    "popup.proIntro"
  ];
  const FAQ_IDS = [
    "01", "02", "05", "06", "07", "10", "12", "15",
    "17", "18", "20", "24", "34", "41", "42", "43",
    "45", "50", "61", "63", "64", "65", "66", "75"
  ];
  const FAQ_KEYS = FAQ_IDS.map((id) => [`faq.${id}.q`, `faq.${id}.a`]);

  restoreManagerViewState();
  restoreManagerFastState();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", loadState, { once: true });
  else loadState();
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === MESSAGE_TYPES.ITEM_SAVED || REFRESH_EVENTS.has(message?.type)) {
      if (Date.now() < suppressInlineTitleRefreshUntil && (message?.type === MESSAGE_TYPES.ITEM_UPDATED || message?.type === MESSAGE_TYPES.DEV_UPDATED)) return;
      if (shouldSuppressManagerReadyPasteRefresh(message)) return;
      scheduleSidePanelRefresh();
    }
  });
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    const managerViewStateChange = changes[MANAGER_VIEW_STATE_STORAGE_KEY];
    if (managerViewStateChange?.newValue && applyManagerViewStateSnapshot(managerViewStateChange.newValue, { external: true })) {
      render();
      return;
    }
    const settingsChange = changes[window.MCP.STORAGE_KEYS.SETTINGS];
    if (settingsChange?.newValue && isVisualSettingsOnlyChange(settingsChange.oldValue || {}, settingsChange.newValue || {})) {
      const viewModeChanged = managerViewModeSettingsChanged(settingsChange.oldValue || {}, settingsChange.newValue || {});
      state.settings = Object.assign({}, state.settings || {}, settingsChange.newValue || {});
      applyManagerViewModeSettings(state.settings);
      applyTheme();
      if (viewModeChanged) render();
      return;
    }
    const changedKeys = Object.keys(changes);
    if (isSourceFaviconOnlyStorageChange(changes, changedKeys)) return;
    if (Date.now() < suppressInlineTitleRefreshUntil
      && changedKeys.length === 1
      && (changedKeys[0] === window.MCP.STORAGE_KEYS.ITEMS || changedKeys[0] === window.MCP.STORAGE_KEYS.DEV_ITEMS)) return;
    if (shouldSuppressManagerReadyPasteStorageRefresh(changedKeys)) return;
    if (changedKeys.some((key) => LOCAL_STORAGE_KEYS.has(key))) {
      scheduleSidePanelRefresh();
    }
  });

  elements.search.addEventListener("input", () => {
    selectedIndex = 0;
    resetManagerBulkSelection({ renderControls: false });
    scheduleManagerViewStateSave();
    scheduleItemSearchRender();
  });
  elements.categoryTreeSearch?.addEventListener("input", () => {
    scheduleManagerViewStateSave();
    scheduleCategorySearchRender();
  });
  elements.openMontage.addEventListener("click", openMontage);
  elements.newCategory.addEventListener("click", (event) => {
    if (blockDemoAction(event)) return;
    createCategory(event);
  });
  elements.openManagerMenu?.addEventListener("click", toggleManagerMenu);
  elements.openSourceTimeline?.addEventListener("click", openSourceTimelineModal);
  elements.openTools?.addEventListener("click", openToolsFromManager);
  elements.textTab.addEventListener("click", () => setActiveTab("text"));
  elements.devTab.addEventListener("click", () => setActiveTab("dev"));
  elements.imageTab.addEventListener("click", () => setActiveTab("image"));
  elements.closeManager.addEventListener("click", () => {
    persistManagerViewState();
    cacheManagerFastState();
    window.close();
  });
  elements.imageViewModes.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view-mode]");
    if (!button) return;
    imageViewMode = normalizeManagerImageViewMode(button.dataset.viewMode || "medium");
    saveManagerViewModeSetting({ managerImageViewMode: imageViewMode });
    scheduleManagerViewStateSave();
    render();
  });
  elements.textViewModes?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-text-view-mode]");
    if (!button) return;
    const nextMode = normalizeManagerTextViewMode(button.dataset.textViewMode || "card");
    if (activeTab === "dev") {
      devViewMode = nextMode;
      saveManagerViewModeSetting({ managerDevViewMode: devViewMode });
    } else {
      textViewMode = nextMode;
      saveManagerViewModeSetting({ managerTextViewMode: textViewMode });
    }
    scheduleManagerViewStateSave();
    render();
  });
  elements.items?.addEventListener("scroll", () => {
    if (applyingManagerViewState) return;
    rememberCurrentManagerScrollPositions();
    scheduleManagerViewStateSave();
  }, { passive: true });
  elements.categories?.addEventListener("scroll", () => {
    if (applyingManagerViewState) return;
    rememberCurrentManagerScrollPositions();
    scheduleManagerViewStateSave();
  }, { passive: true });
  window.addEventListener("beforeunload", () => {
    persistManagerViewState();
    cacheManagerFastState();
  });
  document.addEventListener("keydown", handleKeyboard);
  document.addEventListener("keydown", cancelManagerJumpFromNavigationKey, { capture: true });
  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("dragover", handleGlobalItemDragOver);
  document.addEventListener("wheel", handleDocumentWheelDuringItemDrag, { passive: false, capture: true });
  document.addEventListener("wheel", cancelManagerJumpFromUserInput, { passive: true, capture: true });
  document.addEventListener("touchstart", cancelManagerJumpFromUserInput, { passive: true, capture: true });
  document.addEventListener("pointerdown", cancelManagerJumpFromUserInput, { passive: true, capture: true });
  elements.categories.addEventListener("wheel", handleCategoryWheelDuringItemDrag, { passive: false });
  elements.items.addEventListener("scroll", handleVirtualItemsScroll, { passive: true });
  elements.items.addEventListener("scroll", handleManagerJumpUserScroll, { passive: true });
  elements.items.addEventListener("wheel", cancelManagerJumpFromUserInput, { passive: true });
  elements.items.addEventListener("touchstart", cancelManagerJumpFromUserInput, { passive: true });
  elements.items.addEventListener("pointerdown", cancelManagerJumpFromUserInput, { passive: true });

  function openArcawandSite() {
    chrome.tabs.create({ url: ARCAWAND_SITE_URL, active: true }).catch(() => {
      window.open(ARCAWAND_SITE_URL, "_blank", "noopener");
    });
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

  function restoreManagerViewState() {
    const raw = localStorage.getItem(MANAGER_VIEW_STATE_STORAGE_KEY);
    if (!raw) return;
    try {
      applyManagerViewStateSnapshot(JSON.parse(raw), { force: true });
    } catch (_) {
      localStorage.removeItem(MANAGER_VIEW_STATE_STORAGE_KEY);
    }
  }

  async function restoreSharedManagerViewState() {
    const stored = await chrome.storage.local.get(MANAGER_VIEW_STATE_STORAGE_KEY).catch(() => ({}));
    const shared = stored?.[MANAGER_VIEW_STATE_STORAGE_KEY];
    if (!shared || typeof shared !== "object") return false;
    const applied = applyManagerViewStateSnapshot(shared);
    if (applied) {
      try {
        localStorage.setItem(MANAGER_VIEW_STATE_STORAGE_KEY, JSON.stringify(shared));
      } catch (_) {}
    }
    return applied;
  }

  function applyManagerViewStateSnapshot(saved, options = {}) {
    if (!saved || typeof saved !== "object") return false;
    const savedAt = Math.max(0, Number(saved.savedAt) || 0);
    if (!options.force && savedAt && managerViewStateSavedAt && savedAt <= managerViewStateSavedAt) return false;
    if (options.external && saved.sourceId && saved.sourceId === MANAGER_VIEW_STATE_SOURCE_ID) return false;
    applyingManagerViewState = true;
    restoredManagerViewState = true;
    managerViewStateSavedAt = savedAt || Date.now();
    if (["text", "dev", "image"].includes(saved.activeTab)) activeTab = saved.activeTab;
    selectedCategory = String(saved.selectedCategory || "all");
    selectedIndex = Math.max(0, Number(saved.selectedIndex) || 0);
    favoritesOnly = Boolean(saved.favoritesOnly);
    imageViewMode = normalizeManagerImageViewMode(saved.imageViewMode || imageViewMode);
    textViewMode = normalizeManagerTextViewMode(saved.textViewMode || textViewMode);
    devViewMode = normalizeManagerTextViewMode(saved.devViewMode || devViewMode);
    if (typeof saved.searchQuery === "string") elements.search.value = saved.searchQuery;
    if (typeof saved.categoryQuery === "string" && elements.categoryTreeSearch) elements.categoryTreeSearch.value = saved.categoryQuery;
    if (Array.isArray(saved.expandedCategories)) {
      expandedCategories.clear();
      saved.expandedCategories.filter(Boolean).forEach((id) => expandedCategories.add(String(id)));
      if (!expandedCategories.size) expandedCategories.add("general");
    }
    if (Array.isArray(saved.versionSelections)) {
      managerItemVersionSelection.clear();
      saved.versionSelections.forEach((entry) => {
        if (!entry || !entry.itemId || !entry.versionId) return;
        managerItemVersionSelection.set(String(entry.itemId), String(entry.versionId));
      });
    }
    applyManagerScrollSnapshot(saved);
    requestAnimationFrame(() => {
      applyingManagerViewState = false;
    });
    return true;
  }

  function applyManagerScrollSnapshot(saved = {}) {
    restoreScrollTopMap(managerItemsScrollTops, saved.itemsScrollTops);
    restoreScrollTopMap(managerCategoryScrollTops, saved.categoryScrollTops);
    if (!managerItemsScrollTops[activeTab]) managerItemsScrollTops[activeTab] = Math.max(0, Number(saved.itemsScrollTop) || 0);
    if (!managerCategoryScrollTops[activeTab]) managerCategoryScrollTops[activeTab] = Math.max(0, Number(saved.categoryScrollTop) || 0);
    pendingManagerItemsScrollTop = Math.max(0, Number(managerItemsScrollTops[activeTab]) || 0);
    pendingManagerCategoryScrollTop = Math.max(0, Number(managerCategoryScrollTops[activeTab]) || 0);
  }

  function restoreScrollTopMap(target, source) {
    if (!source || typeof source !== "object") return;
    ["text", "dev", "image"].forEach((key) => {
      target[key] = Math.max(0, Number(source[key]) || 0);
    });
  }

  function scheduleManagerViewStateSave() {
    if (applyingManagerViewState) return;
    clearTimeout(managerViewStateSaveTimer);
    managerViewStateSaveTimer = window.setTimeout(persistManagerViewState, 80);
  }

  function persistManagerViewState() {
    if (applyingManagerViewState) return;
    clearTimeout(managerViewStateSaveTimer);
    managerViewStateSaveTimer = 0;
    try {
      rememberCurrentManagerScrollPositions();
      const snapshot = {
        activeTab,
        selectedCategory,
        selectedIndex,
        favoritesOnly,
        imageViewMode,
        textViewMode,
        devViewMode,
        searchQuery: elements.search?.value || "",
        categoryQuery: elements.categoryTreeSearch?.value || "",
        expandedCategories: [...expandedCategories],
        versionSelections: managerVersionSelectionSnapshot(),
        itemsScrollTop: managerItemsScrollTops[activeTab] || 0,
        categoryScrollTop: managerCategoryScrollTops[activeTab] || 0,
        itemsScrollTops: Object.assign({}, managerItemsScrollTops),
        categoryScrollTops: Object.assign({}, managerCategoryScrollTops),
        sourceId: MANAGER_VIEW_STATE_SOURCE_ID,
        savedAt: Date.now()
      };
      managerViewStateSavedAt = snapshot.savedAt;
      localStorage.setItem(MANAGER_VIEW_STATE_STORAGE_KEY, JSON.stringify(snapshot));
      chrome.storage.local.set({ [MANAGER_VIEW_STATE_STORAGE_KEY]: snapshot }).catch(() => {});
    } catch (_) {}
  }

  function managerVersionSelectionSnapshot() {
    const entries = [];
    managerItemVersionSelection.forEach((versionId, itemId) => {
      if (!itemId || !versionId) return;
      entries.push({ itemId, versionId });
    });
    return entries.slice(-500);
  }

  function restoreManagerFastState() {
    const raw = localStorage.getItem(MANAGER_FAST_STATE_STORAGE_KEY);
    if (!raw) return;
    try {
      const cached = JSON.parse(raw);
      if (!cached || cached.version !== 1 || !cached.data) return;
      if (cached.activeTab && cached.activeTab !== activeTab) return;
      restoredFastState = true;
      applyStateData(cached.data);
      applyTheme();
      translateSidePanel();
      stateLoaded = true;
      render();
    } catch (_) {
      localStorage.removeItem(MANAGER_FAST_STATE_STORAGE_KEY);
    }
  }

  function scheduleManagerFastStateCache() {
    if (!fullStateLoaded) return;
    clearTimeout(managerFastStateSaveTimer);
    managerFastStateSaveTimer = window.setTimeout(cacheManagerFastState, 240);
  }

  function cacheManagerFastState() {
    clearTimeout(managerFastStateSaveTimer);
    managerFastStateSaveTimer = 0;
    if (!fullStateLoaded || restoredFastState) return;
    try {
      localStorage.setItem(MANAGER_FAST_STATE_STORAGE_KEY, JSON.stringify({
        version: 1,
        activeTab,
        savedAt: Date.now(),
        data: fastStateSnapshot()
      }));
    } catch (_) {
      localStorage.removeItem(MANAGER_FAST_STATE_STORAGE_KEY);
    }
  }

  function rememberCurrentManagerScrollPositions(tab = activeTab) {
    if (!["text", "dev", "image"].includes(tab)) return;
    managerItemsScrollTops[tab] = Math.max(0, Math.round(elements.items?.scrollTop || 0));
    managerCategoryScrollTops[tab] = Math.max(0, Math.round(elements.categories?.scrollTop || 0));
  }

  function preparePendingManagerScrollPositions(tab = activeTab) {
    pendingManagerItemsScrollTop = Math.max(0, Number(managerItemsScrollTops[tab]) || 0);
    pendingManagerCategoryScrollTop = Math.max(0, Number(managerCategoryScrollTops[tab]) || 0);
  }

  function restoreManagerScrollPositions(attempts = 5) {
    restoreManagerItemsScrollPosition(attempts);
    restoreManagerCategoryScrollPosition(attempts);
  }

  function restoreManagerItemsScrollPosition(attempts = 5) {
    if (!pendingManagerItemsScrollTop || !elements.items) return;
    const targetTop = pendingManagerItemsScrollTop;
    const apply = (remaining) => {
      if (!elements.items?.isConnected) return;
      elements.items.scrollTop = targetTop;
      if (remaining <= 0 || Math.abs((elements.items.scrollTop || 0) - targetTop) < 3) {
        pendingManagerItemsScrollTop = 0;
        return;
      }
      requestAnimationFrame(() => apply(remaining - 1));
    };
    requestAnimationFrame(() => apply(attempts));
  }

  function restoreManagerCategoryScrollPosition(attempts = 5) {
    if (!pendingManagerCategoryScrollTop || !elements.categories) return;
    const targetTop = pendingManagerCategoryScrollTop;
    const apply = (remaining) => {
      if (!elements.categories?.isConnected) return;
      elements.categories.scrollTop = targetTop;
      if (remaining <= 0 || Math.abs((elements.categories.scrollTop || 0) - targetTop) < 3) {
        pendingManagerCategoryScrollTop = 0;
        return;
      }
      requestAnimationFrame(() => apply(remaining - 1));
    };
    requestAnimationFrame(() => apply(attempts));
  }

  function fastStateSnapshot() {
    const base = { settings: state.settings || {} };
    if (activeTab === "image") {
      base.imageCategories = state.imageCategories || [];
      base.imageCategoryTree = state.imageCategoryTree || [];
      base.imageItems = prioritizedFastItems(state.imageItems || []).map(fastImageItemSnapshot);
      base.items = [];
      base.categories = [];
      base.devItems = [];
      base.devCategories = [];
      return base;
    }
    if (activeTab === "dev") {
      base.devCategories = state.devCategories || [];
      base.devCategoryTree = state.devCategoryTree || [];
      base.devItems = prioritizedFastItems(state.devItems || []).map(fastTextItemSnapshot);
      base.items = [];
      base.categories = [];
      base.imageItems = [];
      base.imageCategories = [];
      return base;
    }
    base.categories = state.categories || [];
    base.categoryTree = state.categoryTree || [];
    base.items = prioritizedFastItems(state.items || []).map(fastTextItemSnapshot);
    base.devItems = [];
    base.devCategories = [];
    base.imageItems = [];
    base.imageCategories = [];
    return base;
  }

  function prioritizedFastItems(allItems = []) {
    const seen = new Set();
    const ordered = [];
    const push = (item) => {
      if (!item?.id || seen.has(item.id) || ordered.length >= MANAGER_FAST_STATE_MAX_ITEMS) return;
      seen.add(item.id);
      ordered.push(item);
    };
    (currentViewItems || []).forEach(push);
    (allItems || []).forEach(push);
    return ordered;
  }

  function fastTextItemSnapshot(item = {}) {
    const snapshot = Object.assign({}, item);
    snapshot.content = trimFastText(snapshot.content);
    snapshot.preview = trimFastText(snapshot.preview);
    snapshot.note = trimFastText(snapshot.note, 1200);
    if (Array.isArray(snapshot.versions)) {
      snapshot.versions = snapshot.versions.map((version) => Object.assign({}, version, {
        content: trimFastText(version.content),
        preview: trimFastText(version.preview),
        note: trimFastText(version.note, 1200)
      }));
    }
    return snapshot;
  }

  function fastImageItemSnapshot(item = {}) {
    const snapshot = Object.assign({}, item);
    ["dataUrl", "imageUrl", "thumbnailUrl"].forEach((key) => {
      const value = String(snapshot[key] || "");
      if (value.length > MANAGER_FAST_IMAGE_URL_LIMIT) snapshot[key] = "";
    });
    return snapshot;
  }

  function trimFastText(value, limit = MANAGER_FAST_TEXT_LIMIT) {
    const text = String(value || "");
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  }

  async function loadState() {
    if (loadStateInFlight) {
      loadStateRerunRequested = true;
      return loadStateInFlight;
    }
    loadStateInFlight = loadStateOnce();
    try {
      await loadStateInFlight;
    } finally {
      loadStateInFlight = null;
      if (loadStateRerunRequested) {
        loadStateRerunRequested = false;
        await loadState();
      }
    }
  }

  async function loadStateOnce() {
    await restoreSharedManagerViewState();
    const response = await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.GET_STATE }).catch(() => null);
    if (response?.ok) {
      applyStateData(response.data);
    } else {
      const settings = await window.MCP.getSettings();
      applyStateData({
        settings,
        items: await window.MCP.getClipboardItems(),
        categories: await window.MCP.getCategories(settings.language || "en"),
        imageItems: await window.MCP.getImageItems(),
        imageCategories: await window.MCP.getImageCategories(settings.language || "en"),
        devItems: await window.MCP.getDevItems(),
        devCategories: await window.MCP.getDevCategories(settings.language || "en")
      });
    }
    fullStateLoaded = true;
    restoredFastState = false;
    applyTheme();
    translateSidePanel();
    const shouldRepeatInitialRender = !stateLoaded;
    stateLoaded = true;
    render();
    if (shouldRepeatInitialRender) requestAnimationFrame(render);
    applyInitialUrlState();
    scheduleManagerFastStateCache();
  }

  function applyInitialUrlState() {
    if (openedInitialSearch) return;
    if (restoredManagerViewState) {
      openedInitialSearch = true;
      return;
    }
    const requestedMediaType = new URLSearchParams(window.location.search).get("mediaType");
    if (requestedMediaType !== "image" && requestedMediaType !== "text" && requestedMediaType !== "dev") return;
    openedInitialSearch = true;
    activeTab = requestedMediaType;
    selectedCategory = "all";
    favoritesOnly = false;
    render();
  }

  function applyStateData(data = {}) {
    state.settings = data.settings || {};
    applyManagerViewModeSettings(state.settings);
    state.items = Array.isArray(data.items) ? data.items : [];
    state.categories = Array.isArray(data.categories) ? data.categories : [];
    state.categoryTree = Array.isArray(data.categoryTree) && data.categoryTree.length
      ? data.categoryTree
      : buildTreeFromCategories(state.categories);
    state.imageItems = Array.isArray(data.imageItems) ? data.imageItems : [];
    state.imageCategories = Array.isArray(data.imageCategories) ? data.imageCategories : [];
    state.imageCategoryTree = Array.isArray(data.imageCategoryTree) && data.imageCategoryTree.length
      ? data.imageCategoryTree
      : buildTreeFromCategories(state.imageCategories);
    state.devItems = Array.isArray(data.devItems) ? data.devItems : [];
    state.devCategories = Array.isArray(data.devCategories) ? data.devCategories : [];
    state.devCategoryTree = buildTreeFromCategories(state.devCategories);
  }

  function normalizeManagerImageViewMode(value) {
    return ["small", "medium", "large"].includes(String(value || "")) ? String(value) : "medium";
  }

  function normalizeManagerTextViewMode(value) {
    return String(value || "") === "list" ? "list" : "card";
  }

  function applyManagerViewModeSettings(settings = {}) {
    imageViewMode = normalizeManagerImageViewMode(settings.managerImageViewMode || imageViewMode);
    textViewMode = normalizeManagerTextViewMode(settings.managerTextViewMode || textViewMode);
    devViewMode = normalizeManagerTextViewMode(settings.managerDevViewMode || devViewMode);
  }

  async function saveManagerViewModeSetting(updates = {}) {
    state.settings = Object.assign({}, state.settings || {}, updates);
    try {
      const currentSettings = await window.MCP.getSettings();
      await window.MCP.saveSettings(Object.assign({}, currentSettings || {}, updates));
    } catch (error) {
      console.warn("[Ultimate Clipboard Pro] Manager view mode save failed", error);
    }
  }

  function buildTreeFromCategories(categories) {
    const visible = (categories || []).filter((category) => !category.isHidden);
    const byParent = new Map();
    visible.forEach((category) => {
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
      return (left.order || 0) - (right.order || 0) || categoryLabel(left).localeCompare(categoryLabel(right), state.settings.language || "en", { sensitivity: "base" });
    });
  }

  function categoryProtectedRank(category) {
    if (category?.parentId) return 3;
    if (isGeneralCategoryId(category?.id)) return 0;
    if (isFavoriteCategoryId(category?.id)) return 1;
    if (isTrashCategoryId(category?.id)) return 2;
    return 3;
  }

  function scheduleSidePanelRefresh() {
    clearTimeout(scheduleSidePanelRefresh.timer);
    scheduleSidePanelRefresh.timer = setTimeout(refreshSidePanel, 140);
  }

  function markManagerReadyPasteUsageUpdate() {
    suppressManagerReadyPasteRefreshUntil = Date.now() + 1800;
    clearTimeout(scheduleSidePanelRefresh.timer);
  }

  function isReadyPasteUsageUpdate(updates = {}) {
    const keys = Object.keys(updates || {});
    return keys.length > 0 && keys.every((key) => key === "usageCount" || key === "lastUsedAt");
  }

  function shouldSuppressManagerReadyPasteRefresh(message) {
    if (Date.now() > suppressManagerReadyPasteRefreshUntil) return false;
    if (message?.type === MESSAGE_TYPES.STORAGE_REFRESH_REQUIRED || message?.type === MESSAGE_TYPES.SEARCH_INDEX_UPDATED) return true;
    if (
      message?.type === MESSAGE_TYPES.ITEM_UPDATED ||
      message?.type === MESSAGE_TYPES.DEV_UPDATED ||
      message?.type === MESSAGE_TYPES.IMAGE_UPDATED
    ) {
      return isReadyPasteUsageUpdate(message.updates || {});
    }
    return false;
  }

  function shouldSuppressManagerReadyPasteStorageRefresh(changedKeys = []) {
    if (Date.now() > suppressManagerReadyPasteRefreshUntil) return false;
    const readyPasteStorageKeys = new Set([
      window.MCP.STORAGE_KEYS.ITEMS,
      window.MCP.STORAGE_KEYS.IMAGE_ITEMS,
      window.MCP.STORAGE_KEYS.DEV_ITEMS
    ]);
    return changedKeys.length > 0 && changedKeys.every((key) => readyPasteStorageKeys.has(key));
  }

  function isSourceFaviconOnlyStorageChange(changes = {}, changedKeys = []) {
    const itemKeys = new Set([
      window.MCP.STORAGE_KEYS.ITEMS,
      window.MCP.STORAGE_KEYS.IMAGE_ITEMS,
      window.MCP.STORAGE_KEYS.DEV_ITEMS
    ]);
    const relevantKeys = changedKeys.filter((key) => itemKeys.has(key));
    if (!relevantKeys.length || relevantKeys.length !== changedKeys.length) return false;
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

  async function refreshSidePanel() {
    const searchValue = elements.search.value;
    await loadState();
    if (elements.search.value !== searchValue) {
      elements.search.value = searchValue;
      render();
    }
  }

  function render() {
    cancelItemRenderJob();
    renderCountMaps = new Map();
    categoryPathCache = null;
    elements.textTab.classList.toggle("is-active", activeTab === "text");
    elements.devTab.classList.toggle("is-active", activeTab === "dev");
    elements.imageTab.classList.toggle("is-active", activeTab === "image");
    updateManagerImageProLock();
    updateManagerMontageProLock();
    elements.imageViewModes.hidden = activeTab !== "image";
    elements.imageViewModes.style.display = activeTab === "image" ? "inline-flex" : "none";
    if (elements.textViewModes) {
      const textModeVisible = activeTab === "text" || activeTab === "dev";
      const currentTextMode = currentTextViewMode();
      elements.textViewModes.hidden = !textModeVisible;
      elements.textViewModes.style.display = textModeVisible ? "inline-flex" : "none";
      elements.textViewModes.querySelectorAll("[data-text-view-mode]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.textViewMode === currentTextMode);
      });
    }
    elements.imageViewModes.querySelectorAll("[data-view-mode]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.viewMode === imageViewMode);
    });
    elements.openMontage.hidden = activeTab !== "text";
    updateFloatingCreateItemButton();
    elements.newCategory.hidden = false;
    elements.categoryPaneTitle.textContent = activeTab === "image" ? t("manager.imagePaneTitle") : activeTab === "dev" ? t("dev.codeCategories") : t("manager.textPaneTitle");
    updateManagerSearchPlaceholder();
    updateManagerBrandProBadge();
    renderCategories();
    renderStatus();
    renderItems();
    restoreManagerScrollPositions();
    scheduleManagerViewStateSave();
    scheduleManagerFastStateCache();
  }

  function scheduleItemSearchRender() {
    cancelAnimationFrame(itemSearchRenderRaf);
    itemSearchRenderRaf = requestAnimationFrame(() => {
      itemSearchRenderRaf = 0;
      renderItems();
    });
  }

  function scheduleCategorySearchRender() {
    cancelAnimationFrame(categorySearchRenderRaf);
    categorySearchRenderRaf = requestAnimationFrame(() => {
      categorySearchRenderRaf = 0;
      renderCategories();
    });
  }

  function updateManagerBrandProBadge() {
    const badge = document.querySelector("[data-role='brand-pro-badge']");
    if (!badge) return;
    badge.hidden = !(window.MCP.isProPlan ? window.MCP.isProPlan(state.settings) : false);
  }

  function renderCurrentViewTitle() {
    const shell = document.createElement("div");
    shell.className = "current-view-title-shell";
    if (isTrashSelected()) shell.classList.add("is-trash-view");
    const bulkControls = renderManagerBulkControls();
    const title = document.createElement("div");
    title.className = "current-view-title";
    if (isTrashSelected()) {
      title.textContent = t("trash.title");
    } else if (isVaultSelected()) {
      const icon = createVaultCategoryIcon();
      const label = document.createElement("span");
      label.textContent = t("vault.title");
      title.append(icon, label);
    } else if (favoritesOnly) {
      const heart = document.createElement("span");
      heart.textContent = "\u2665";
      heart.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.textContent = t("categories.favorites");
      title.append(heart, label);
    } else if (selectedCategory === "all") {
      title.textContent = activeTab === "image" ? t("categories.allImages") : activeTab === "dev" ? t("dev.all") : t("categories.allTexts");
    } else {
      title.textContent = translatedCategoryPath(selectedCategory) || (activeTab === "image" ? t("categories.allImages") : activeTab === "dev" ? t("dev.all") : t("categories.allTexts"));
    }
    shell.append(bulkControls, title);
    if (isTrashSelected()) {
      const emptyButton = document.createElement("button");
      emptyButton.type = "button";
      emptyButton.className = "empty-trash-button";
      emptyButton.dataset.managerAction = "empty-trash";
      emptyButton.textContent = t("trash.emptyButton");
      emptyButton.title = t("trash.emptyButton");
      shell.appendChild(emptyButton);
    } else {
      const rightSpacer = document.createElement("span");
      rightSpacer.className = "current-view-title-spacer";
      shell.appendChild(rightSpacer);
    }
    return shell;
  }

  function renderManagerBulkControls() {
    const wrap = document.createElement("div");
    wrap.className = "manager-bulk-controls";
    const modeMatches = managerBulkSelection.active && managerBulkSelection.mediaType === activeTab;
    const selectedCount = modeMatches ? managerBulkSelection.selectedIds.size : 0;
    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.className = "manager-bulk-button manager-bulk-select";
    const allSelected = modeMatches && currentViewItems.length > 0 && selectedCount === currentViewItems.length;
    selectButton.dataset.managerAction = modeMatches ? allSelected ? "bulk-deselect-all" : "bulk-select-all" : "bulk-enable";
    selectButton.textContent = modeMatches ? allSelected ? t("bulk.none") : t("bulk.all") : t("bulk.selection");
    selectButton.title = modeMatches ? allSelected ? t("bulk.deselectAll") : t("bulk.selectAll") : t("bulk.selection");
    wrap.appendChild(selectButton);
    if (selectedCount > 0) {
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "manager-bulk-button manager-bulk-delete";
      deleteButton.dataset.managerAction = "bulk-delete";
      deleteButton.title = t("bulk.deleteSelected", { count: selectedCount });
      deleteButton.setAttribute("aria-label", deleteButton.title);
      const icon = document.createElement("img");
      icon.src = "../assets/icons/erase_darkmod.png";
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      deleteButton.appendChild(icon);
      wrap.appendChild(deleteButton);
    }
    if (modeMatches) {
      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "manager-bulk-button manager-bulk-cancel";
      cancelButton.dataset.managerAction = "bulk-cancel";
      cancelButton.textContent = t("common.cancel");
      cancelButton.title = t("bulk.cancel");
      wrap.appendChild(cancelButton);
    }
    return wrap;
  }

  function setCurrentViewItems(items = []) {
    currentViewItems = Array.isArray(items) ? items : [];
    if (!managerBulkSelection.active || managerBulkSelection.mediaType !== activeTab) return;
    const currentIds = new Set(currentViewItems.map((item) => item.id));
    let changed = false;
    managerBulkSelection.selectedIds.forEach((id) => {
      if (!currentIds.has(id)) {
        managerBulkSelection.selectedIds.delete(id);
        changed = true;
      }
    });
    if (changed) renderCurrentViewTitleSlot();
  }

  function enableManagerBulkSelection() {
    managerBulkSelection = { active: true, mediaType: activeTab, selectedIds: new Set() };
    renderCurrentViewTitleSlot();
    renderItems();
  }

  function currentTextViewMode(mediaType = activeTab) {
    return mediaType === "dev" ? devViewMode : textViewMode;
  }

  function isTextCardView(mediaType = activeTab) {
    return currentTextViewMode(mediaType) === "card";
  }

  function resetManagerBulkSelection(options = {}) {
    const wasActive = managerBulkSelection.active;
    managerBulkSelection = createEmptyBulkSelectionState();
    if (options.renderControls !== false && wasActive) {
      renderCurrentViewTitleSlot();
      renderItems();
    }
  }

  async function loadStatePreservingManagerScroll(scrollTop = elements.items?.scrollTop || 0) {
    pendingManagerItemsScrollTop = Math.max(0, Math.round(Number(scrollTop) || 0));
    pendingManagerCategoryScrollTop = Math.max(0, Math.round(elements.categories?.scrollTop || 0));
    await loadState();
    restoreManagerScrollPositions(8);
  }

  function selectAllManagerBulkItems() {
    if (!managerBulkSelection.active || managerBulkSelection.mediaType !== activeTab) enableManagerBulkSelection();
    managerBulkSelection.selectedIds = new Set(currentViewItems.map((item) => item.id));
    renderCurrentViewTitleSlot();
    renderItems();
    showManagerToast(t("bulk.allSelected", { count: managerBulkSelection.selectedIds.size }));
  }

  function deselectAllManagerBulkItems() {
    if (!isManagerBulkSelectionMode()) return;
    managerBulkSelection.selectedIds.clear();
    renderCurrentViewTitleSlot();
    updateVisibleManagerBulkCheckboxes();
  }

  function isManagerBulkSelectionMode(mediaType = activeTab) {
    return managerBulkSelection.active && managerBulkSelection.mediaType === mediaType;
  }

  function isManagerBulkSelected(itemId) {
    return isManagerBulkSelectionMode() && managerBulkSelection.selectedIds.has(itemId);
  }

  function toggleManagerBulkItem(itemId) {
    if (!itemId) return;
    if (!isManagerBulkSelectionMode()) enableManagerBulkSelection();
    if (managerBulkSelection.selectedIds.has(itemId)) managerBulkSelection.selectedIds.delete(itemId);
    else managerBulkSelection.selectedIds.add(itemId);
    renderCurrentViewTitleSlot();
    updateVisibleManagerBulkCheckboxes();
  }

  function updateVisibleManagerBulkCheckboxes() {
    elements.items.querySelectorAll(".manager-bulk-checkbox[data-item-id]").forEach((button) => {
      const selected = managerBulkSelection.selectedIds.has(button.dataset.itemId);
      button.classList.toggle("is-checked", selected);
      button.setAttribute("aria-pressed", String(selected));
      const card = button.closest(".item-card, .image-card");
      card?.classList.toggle("is-bulk-selected", selected);
    });
  }

  async function deleteSelectedManagerBulkItems() {
    if (!isManagerBulkSelectionMode() || managerBulkSelection.selectedIds.size <= 0) return;
    const ids = Array.from(managerBulkSelection.selectedIds);
    const confirmed = state.settings.confirmBeforeDelete
      ? await openManagerConfirmDialog({
        title: t("bulk.deleteTitle"),
        message: t("bulk.deleteConfirm", { count: ids.length }),
        confirmText: t("common.delete"),
        cancelText: t("common.cancel")
      })
      : true;
    if (!confirmed) return;
    const effectivePermanent = isTrashSelected() || !canUseTrashManagement();
    if (activeTab === "image") await window.MCP.deleteImageItems(ids, { permanent: effectivePermanent });
    else if (activeTab === "dev") await window.MCP.deleteDevItems(ids, { permanent: effectivePermanent });
    else await window.MCP.deleteClipboardItems(ids, { permanent: effectivePermanent });
    resetManagerBulkSelection({ renderControls: false });
    await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.STORAGE_REFRESH_REQUIRED }).catch(() => null);
    await loadState();
    showManagerToast(t(effectivePermanent ? "bulk.permanentlyDeleted" : "bulk.deleted", { count: ids.length }));
  }

  function renderManagerBulkCheckbox(item) {
    if (!isManagerBulkSelectionMode()) return null;
    const selected = managerBulkSelection.selectedIds.has(item.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `manager-bulk-checkbox ${selected ? "is-checked" : ""}`;
    button.dataset.itemId = item.id;
    button.setAttribute("aria-label", selected ? t("bulk.unselectItem") : t("bulk.selectItem"));
    button.setAttribute("aria-pressed", String(selected));
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleManagerBulkItem(item.id);
    });
    button.appendChild(document.createElement("span"));
    return button;
  }

  function renderCurrentViewTitleSlot() {
    if (!elements.currentViewTitleSlot) return;
    elements.currentViewTitleSlot.replaceChildren(renderCurrentViewTitle());
    updateFloatingCreateItemButton();
  }

  async function handleDocumentClick(event) {
    if (managerMenu && !managerMenu.hidden && !managerMenu.contains(event.target) && !elements.openManagerMenu?.contains(event.target)) {
      closeManagerMenu();
    }
    const action = event.target.closest("[data-manager-action]")?.dataset.managerAction;
    const editorToggleButton = event.target.closest("[data-editor-toggle-category-id]");
    if (editorToggleButton) {
      const categoryId = editorToggleButton.dataset.editorToggleCategoryId;
      const modal = editorToggleButton.closest("#managerEditorCategoryModal") || document.getElementById("managerEditorModal");
      if (editorExpandedCategories.has(categoryId)) editorExpandedCategories.delete(categoryId);
      else editorExpandedCategories.add(categoryId);
      renderEditorCategoryTree(modal, editorCategorySelection);
      return;
    }
    const editorCategoryButton = event.target.closest("[data-editor-category-id]");
    if (editorCategoryButton) {
      editorCategorySelection = editorCategoryButton.dataset.editorCategoryId;
      updateEditorCategorySummary();
      closeEditorCategoryChooser();
      return;
    }
    const toggleButton = event.target.closest("[data-manager-toggle-category-id]");
    if (toggleButton) {
      event.preventDefault();
      event.stopPropagation();
      const categoryId = toggleButton.dataset.managerToggleCategoryId;
      if (managerClassifierExpanded.has(categoryId)) managerClassifierExpanded.delete(categoryId);
      else managerClassifierExpanded.add(categoryId);
      renderManagerCategoryChooser();
      return;
    }
    const categoryButton = event.target.closest(".manager-category-choice[data-manager-category-id]");
    if (categoryButton) {
      if (blockDemoAction(event)) return;
      assignManagerCategory(categoryButton.dataset.managerCategoryId);
      return;
    }
    if (!action) return;
    if (DEMO_BLOCKED_MANAGER_ACTIONS.has(action) && blockDemoAction(event)) return;
    if (action === "close-search") closeManagerSearch();
    if (action === "close-source-timeline") closeSourceTimelineModal();
    if (action === "close-versioning") closeVersioningModal();
    if (action === "source-timeline-sort") {
      const modal = document.getElementById("managerSourceTimelineModal");
      sourceTimelineSortMode = event.target.closest("[data-source-timeline-sort]")?.dataset.sourceTimelineSort || "date";
      if (modal) renderSourceTimeline(modal);
    }
    if (action === "source-timeline-tab") {
      const modal = document.getElementById("managerSourceTimelineModal");
      sourceTimelineMediaType = event.target.closest("[data-source-timeline-tab]")?.dataset.sourceTimelineTab || "text";
      if (modal) renderSourceTimeline(modal);
    }
    if (action === "open-search-date-calendar") openManagerSearchDateCalendar();
    if (action === "close-search-date-calendar") closeManagerSearchDateCalendar();
    if (action === "search-date-prev" || action === "search-date-next") shiftManagerSearchCalendarMonth(action === "search-date-prev" ? -1 : 1);
    if (action === "bulk-enable") return enableManagerBulkSelection();
    if (action === "bulk-select-all") return selectAllManagerBulkItems();
    if (action === "bulk-deselect-all") return deselectAllManagerBulkItems();
    if (action === "bulk-cancel") return resetManagerBulkSelection();
    if (action === "bulk-delete") return deleteSelectedManagerBulkItems();
    if (action === "close-image-info") closeImageInfo();
    if (action === "close-tools") closeToolsModal();
    if (action === "open-tool") {
      if (Date.now() < managerToolSuppressClickUntil) return;
      const toolButton = event.target.closest("[data-tool-id]");
      if (toolButton?.dataset.proLocked === "true") {
        openManagerProUpgradeModal({ reason: "tool", toolName: toolButton.getAttribute("aria-label") || toolButton.textContent?.trim() || "" });
        showManagerToast(t("pro.toolsLocked"));
        return;
      }
      openToolWorkspace(toolButton?.dataset.toolId || "");
    }
    if (action === "close-tool-workspace") closeToolWorkspace();
    if (action === "open-tool-info") openManagerToolInfoModal();
    if (action === "copy-emoji") copyManagerEmoji(event.target.closest("[data-emoji]")?.dataset.emoji || "");
    if (action === "copy-special-character") copyManagerSpecialCharacter(event.target.closest("[data-symbol]")?.dataset.symbol || "");
    if (action === "start-color-pick") startManagerColorPick();
    if (action === "start-image-text-capture") startManagerImageTextCapture();
    if (action === "search-word-replacer") searchManagerWordReplacer();
    if (action === "replace-word-replacer") replaceManagerWords();
    if (action === "copy-color-format") copyManagerColorFormat(event.target.closest("[data-format]"));
    if (action === "copy-tool-output") copyToolOutput();
    if (action === "capture-tool-output") captureToolOutput();
    if (action === "empty-trash") emptyCurrentTrash();
    if (action === "close-editor") closeEditor();
    if (action === "save-editor") saveEditor();
    if (action === "open-editor-classifier") openEditorCategoryChooser();
    if (action === "close-editor-classifier") closeEditorCategoryChooser();
    if (action === "close-create-version") closeCreateVersionModal();
    if (action === "save-create-version") saveCreateVersionModal();
    if (action === "create-current-item") openCreateCurrentItemModal();
    if (action === "close-create-item") closeCreateCurrentItemModal();
    if (action === "save-create-item") saveCreateCurrentItem();
    if (action === "close-create-code-mismatch") closeCreateCodeMismatchModal();
    if (action === "save-create-code-detected") saveCreateCodeMismatchChoice("detected");
    if (action === "save-create-code-current") saveCreateCodeMismatchChoice("current");
    if (action === "close-classifier") closeManagerClassifier();
    if (action === "close-montage") closeMontage();
    if (action === "copy-montage") copyMontage();
    if (action === "clear-montage") clearMontage();
    if (action === "save-montage-as-text") saveCurrentMontageAsText();
    if (action === "add-all-montage") addAllMontageItems();
    if (action === "polish-montage") polishMontage();
    if (action === "open-montage-final-editor") openMontageFinalEditor();
    if (action === "close-montage-final-editor") closeMontageFinalEditor();
    if (action === "copy-montage-final-editor") copyMontageFinalDraft();
    if (action === "save-montage-final-editor") saveMontageFinalDraftAsText();
    if (action === "save-montage-edit") saveMontageSandboxEdit();
    if (action === "close-montage-edit") closeMontageSandboxEditor();
    if (action === "add-montage-item") {
      const row = event.target.closest("[data-item-id]");
      addMontageItem(row?.dataset.itemId, row?.dataset.activeVersionId || "");
    }
    if (action === "remove-montage-item") removeMontageItem(event.target.closest("[data-entry-key]")?.dataset.entryKey || event.target.closest("[data-item-id]")?.dataset.itemId);
    if (action === "edit-montage-item") {
      const row = event.target.closest("[data-entry-key]") || event.target.closest("[data-item-id]");
      openMontageSandboxEditor(row?.dataset.itemId, row?.dataset.activeVersionId || montageEntryVersionId(row?.dataset.entryKey || ""));
    }
    if (action === "move-montage-up") moveMontageItem(event.target.closest("[data-entry-key]")?.dataset.entryKey || event.target.closest("[data-item-id]")?.dataset.itemId, -1);
    if (action === "move-montage-down") moveMontageItem(event.target.closest("[data-entry-key]")?.dataset.entryKey || event.target.closest("[data-item-id]")?.dataset.itemId, 1);
  }

  function toggleManagerMenu(event) {
    event.stopPropagation();
    triggerMicroAnimation(elements.openManagerMenu);
    renderManagerMenu();
    const isOpen = !managerMenu.hidden;
    managerMenu.hidden = isOpen;
    elements.openManagerMenu.setAttribute("aria-expanded", String(!isOpen));
  }

  function closeManagerMenu() {
    if (managerMenu) managerMenu.hidden = true;
    elements.openManagerMenu?.setAttribute("aria-expanded", "false");
  }

  function renderManagerMenu() {
    if (!managerMenu) {
      managerMenu = document.createElement("section");
      managerMenu.id = "managerMoreMenu";
      managerMenu.className = "manager-menu-popover";
      managerMenu.hidden = true;
      managerMenu.setAttribute("role", "menu");
      document.body.appendChild(managerMenu);
    }
    const isPro = window.MCP.isProPlan ? window.MCP.isProPlan(state.settings) : false;
    const menuItems = [
      ["about", t("popup.about")],
      ["faq", t("popup.faq")],
      ["advanced-search", t("search.advanced")],
      ["settings", t("ui.options")],
      ["privacy", t("popup.privacy")],
      isPro ? ["pro-status", "", "pro-status"] : ["pro", t("popup.pro"), "pro"],
      ...(isPro && !state.settings?.demoMode ? [["support-developer", t("popup.supportDeveloper"), "support"]] : []),
      ["contact", t("popup.contactDeveloper"), "contact"]
    ];
    managerMenu.replaceChildren(...menuItems.map(([action, label, icon]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.managerMenuAction = action;
      button.setAttribute("role", "menuitem");
      if (action === "pro-status") {
        button.className = "manager-menu-pro-status";
        button.appendChild(createManagerProLifetimeBadge());
        button.addEventListener("click", handleManagerMenuAction);
        return button;
      }
      if (icon) button.appendChild(createManagerMenuIcon(icon));
      const text = document.createElement("span");
      text.textContent = label;
      button.appendChild(text);
      button.addEventListener("click", handleManagerMenuAction);
      return button;
    }));
  }

  function createManagerMenuIcon(icon) {
    if (icon === "pro") {
      const img = document.createElement("img");
      img.className = "manager-menu-icon";
      img.src = "../assets/icons/pro-icon.png";
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      return img;
    }
    if (icon === "support") {
      const img = document.createElement("img");
      img.className = "manager-menu-icon";
      img.src = "../assets/icons/favorited.png";
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      return img;
    }
    const wrap = document.createElement("span");
    wrap.className = "manager-menu-icon-stack";
    [
      ["manager-menu-icon manager-menu-icon-mail-dark", "../assets/icons/mail-to-dev-darkmod.png"],
      ["manager-menu-icon manager-menu-icon-mail-light", "../assets/icons/mail-to-dev-lightmod.png"]
    ].forEach(([className, src]) => {
      const img = document.createElement("img");
      img.className = className;
      img.src = src;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      wrap.appendChild(img);
    });
    return wrap;
  }

  function createManagerProLifetimeBadge() {
    const badge = document.createElement("span");
    badge.className = "manager-menu-pro-lifetime";
    const icon = document.createElement("img");
    icon.src = "../assets/icons/pro-icon.png";
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "manager-menu-pro-lifetime-copy";
    const pro = document.createElement("strong");
    pro.textContent = "Pro";
    const lifetimeNode = document.createElement("small");
    const lifetime = t("pro.lifetime");
    lifetimeNode.textContent = lifetime.charAt(0).toUpperCase() + lifetime.slice(1);
    label.append(pro, lifetimeNode);
    badge.append(icon, label);
    return badge;
  }

  function handleManagerMenuAction(event) {
    const action = event.currentTarget.dataset.managerMenuAction;
    closeManagerMenu();
    if (action === "about") return openManagerTextModal("popup.aboutTitle", ABOUT_KEYS);
    if (action === "faq") return openManagerTextModal("popup.faqTitle", FAQ_KEYS);
    if (action === "advanced-search") return openUnifiedAdvancedSearch();
    if (action === "privacy") return openManagerTextModal("popup.privacyTitle", PRIVACY_KEYS);
    if (isDemoMode() && ["pro", "pro-status", "settings", "support-developer"].includes(action)) return showDemoBlockedNotice();
    if (action === "pro") return openManagerProUpgradeModal("pro");
    if (action === "pro-status") return chrome.runtime.sendMessage({ type: MESSAGE_TYPES.OPEN_OPTIONS, section: "license" }).catch(() => {});
    if (action === "settings") return chrome.runtime.sendMessage({ type: MESSAGE_TYPES.OPEN_OPTIONS }).catch(() => {});
    if (action === "support-developer") return chrome.tabs.create({ url: DEVELOPER_SUPPORT_URL, active: true }).catch(() => window.open(DEVELOPER_SUPPORT_URL, "_blank", "noopener"));
    if (action === "contact") window.location.href = "mailto:contact@arcawand-soft.com?subject=Ultimate%20Clipboard%20Pro";
  }

  async function openUnifiedAdvancedSearch() {
    closeManagerSearch();
    triggerMicroAnimation(elements.openManagerMenu || elements.openMontage, "success-pulse", 440);
    if (isDemoMode()) return openManagerSearch();
    const response = await chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.OPEN_SEARCH_OVERLAY,
      mediaType: activeTab
    }).catch(() => null);
    if (response?.opened || response?.ok || response?.data?.opened || response?.data?.ok) return;
    showManagerToast(t("common.error"));
  }

  function openManagerTextModal(titleKey, paragraphKeys) {
    if (!managerTextModal) {
      managerTextModal = document.createElement("div");
      managerTextModal.className = "manager-text-modal";
      managerTextModal.hidden = true;
      managerTextModal.innerHTML = [
        "<section class=\"manager-text-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header><h2 data-role=\"manager-text-title\"></h2><button type=\"button\" class=\"manager-text-close\" data-role=\"manager-text-close\" aria-label=\"Close\">&times;</button></header>",
        "<div class=\"manager-text-content\" data-role=\"manager-text-content\"></div>",
        "</section>"
      ].join("");
      document.body.appendChild(managerTextModal);
      managerTextModal.querySelector("[data-role='manager-text-close']").addEventListener("click", closeManagerTextModal);
      managerTextModal.addEventListener("click", (event) => {
        if (event.target === managerTextModal) closeManagerTextModal();
      });
    }
    managerTextModal.querySelector("[data-role='manager-text-title']").textContent = t(titleKey);
    managerTextModal.querySelector("[data-role='manager-text-close']").setAttribute("aria-label", t("common.close"));
    managerTextModal.querySelector(".manager-text-card")?.classList.remove("is-pro-upgrade", "is-tool-help");
    const content = managerTextModal.querySelector("[data-role='manager-text-content']");
    content.scrollTop = 0;
    if (titleKey === "popup.faqTitle") {
      content.replaceChildren(createManagerFaqContent(paragraphKeys));
    } else {
      content.replaceChildren(...paragraphKeys.map((key) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = t(key);
        return paragraph;
      }));
    }
    if (titleKey === "popup.aboutTitle") {
      content.prepend(createManagerAboutBrandSignature());
    }
    managerTextModal.hidden = false;
    requestAnimationFrame(() => {
      content.scrollTop = 0;
    });
  }

  function createManagerFaqContent(items) {
    const list = document.createElement("div");
    list.className = "manager-faq-list";
    items.forEach(([questionKey, answerKey], index) => {
      const article = document.createElement("article");
      article.className = "manager-faq-item";
      const badge = document.createElement("span");
      badge.className = "manager-faq-number";
      badge.textContent = String(index + 1).padStart(2, "0");
      const copy = document.createElement("div");
      copy.className = "manager-faq-copy";
      const question = document.createElement("h3");
      question.textContent = t(questionKey);
      const answer = document.createElement("p");
      answer.textContent = t(answerKey);
      copy.append(question, answer);
      article.append(badge, copy);
      list.appendChild(article);
    });
    return list;
  }

  function createManagerAboutBrandSignature() {
    const signature = document.createElement("div");
    signature.className = "manager-about-brand";
    const by = document.createElement("span");
    by.textContent = t("brand.by");
    const logo = document.createElement("img");
    logo.src = "../assets/icons/Arcawand_Soft_Logo.png";
    logo.alt = "Arcawand Soft";
    wireArcawandLogoLink(logo);
    signature.append(by, logo);
    return signature;
  }

  function openManagerProUpgradeModal(context = "pro") {
    managerTextModalReturn = captureManagerTextModalReturn();
    openManagerTextModal("popup.proTitle", PRO_KEYS);
    const content = managerTextModal?.querySelector("[data-role='manager-text-content']");
    if (!content) return;
    renderManagerProModalBrand();
    managerTextModal.querySelector(".manager-text-card")?.classList.add("is-pro-upgrade");
    const contextNode = createManagerProContextNode(context);
    if (contextNode) content.prepend(contextNode);
    content.appendChild(createManagerProPlanComparison());
    const actions = document.createElement("div");
    actions.className = "manager-pro-actions";
    const getPro = document.createElement("button");
    getPro.type = "button";
    getPro.className = "primary";
    getPro.textContent = t("license.buy");
    getPro.addEventListener("click", async () => {
      const response = await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.DODO_OPEN_CHECKOUT }).catch(() => null);
      showManagerToast(response?.ok ? t("license.checkoutOpened") : t("common.error"));
    });
    actions.append(getPro);
    content.append(createManagerProUpgradeFooter(actions));
  }

  function createManagerProContextNode(context = "pro") {
    const resolved = resolveManagerProUpgradeContext(context);
    const text = t(resolved.key, resolved.params);
    if (!text) return null;
    const paragraph = document.createElement("p");
    paragraph.className = "manager-pro-context";
    paragraph.textContent = text;
    return paragraph;
  }

  function resolveManagerProUpgradeContext(context = "pro") {
    const value = typeof context === "string" ? { reason: context } : (context && typeof context === "object" && !("target" in context) ? context : {});
    const reason = value.reason || "pro";
    if (reason === "tool") return { key: "pro.context.tool", params: { tool: value.toolName || t("tools.title") } };
    const keys = {
      imageCapture: "pro.context.imageCapture",
      fullPageScreenshot: "pro.context.fullPageScreenshot",
      pageMarkdownCapture: "pro.context.pageMarkdownCapture",
      driveSync: "pro.context.driveSync",
      itemComposition: "pro.context.itemComposition",
      trashManagement: "pro.context.trashManagement",
      vault: "pro.context.vault",
      captureVersioning: "pro.context.captureVersioning",
      textLimit: "pro.context.textLimit",
      codeLimit: "pro.context.codeLimit",
      allTools: "pro.context.allTools",
      pro: "pro.context.default"
    };
    return { key: keys[reason] || keys.pro, params: {} };
  }

  function renderManagerProModalBrand() {
    const title = managerTextModal?.querySelector("[data-role='manager-text-title']");
    if (!title) return;
    title.replaceChildren(createManagerProModalBrand());
  }

  function createManagerProModalBrand() {
    const brand = document.createElement("span");
    brand.className = "pro-modal-brand";
    const icon = createProModalAppIcon("../assets/icons/icon128.png", "../assets/icons/pro-icon.png");
    const copy = document.createElement("span");
    copy.className = "pro-modal-brand-copy";
    const name = document.createElement("strong");
    name.textContent = t("app.name");
    const signature = document.createElement("span");
    signature.className = "pro-modal-brand-signature";
    const by = document.createElement("span");
    by.textContent = t("brand.by");
    const logo = document.createElement("img");
    logo.src = "../assets/icons/Arcawand_Soft_Logo.png";
    logo.alt = "Arcawand Soft";
    wireArcawandLogoLink(logo);
    signature.append(by, logo);
    copy.append(name, signature);
    brand.append(icon, copy);
    return brand;
  }

  function createProModalAppIcon(iconSrc, badgeSrc) {
    const wrap = document.createElement("span");
    wrap.className = "pro-modal-app-icon-wrap";
    const icon = document.createElement("img");
    icon.className = "pro-modal-app-icon";
    icon.src = iconSrc;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    const badge = document.createElement("span");
    badge.className = "brand-pro-badge";
    badge.setAttribute("aria-hidden", "true");
    const badgeIcon = document.createElement("img");
    badgeIcon.src = badgeSrc;
    badgeIcon.alt = "";
    badge.appendChild(badgeIcon);
    wrap.append(icon, badge);
    return wrap;
  }

  function createManagerProUpgradeFooter(actions) {
    const footer = document.createElement("div");
    footer.className = "manager-pro-upgrade-footer";
    const payment = document.createElement("img");
    payment.className = "manager-pro-payment-methods";
    payment.src = "../assets/icons/way-pay.png";
    payment.alt = "";
    payment.setAttribute("aria-hidden", "true");
    footer.append(payment, actions);
    return footer;
  }

  function createManagerProPlanComparison() {
    const wrap = document.createElement("div");
    wrap.className = "manager-pro-plans";
    wrap.append(
      createManagerProPlanCard("free", "pro.freeTitle", [
        ["text_icon.png", "pro.freeTextLimit"],
        ["dev.png", "pro.freeCodeLimit"],
        ["images_icon.png", "pro.freeImageLimit"],
        ["screen_full_page_png.png", "pro.proScreenshotCapture"],
        ["tootls.png", "pro.freeToolsLimit"],
        ["computer.png", "pro.freeLocalBackup"]
      ]),
      createManagerProPlanCard("pro", "pro.proTitle", [
        ["text_icon.png", "pro.proTextUnlimited"],
        ["dev.png", "pro.proCodeUnlimited"],
        ["images_icon.png", "pro.proImageUnlimited"],
        ["locker-darkmod.png", "pro.proVault"],
        ["screen_full_page_png.png", "pro.proScreenshotCapture"],
        ["webpage-markdown.png", "pro.proMarkdownCapture"],
        ["erase.png", "pro.proTrash"],
        ["montage-lightmod.png", "pro.proMontage"],
        ["versioning-darkmode.png", "pro.proVersioning"],
        ["tootls.png", "pro.proToolsLimit"],
        ["drive-logo.png", "pro.proDriveSync"]
      ])
    );
    return wrap;
  }

  function createManagerProPlanCard(variant, titleKey, rows) {
    const card = document.createElement("section");
    card.className = `manager-pro-plan-card is-${variant}`;
    const head = document.createElement("div");
    head.className = "manager-pro-plan-head";
    const title = document.createElement("strong");
    if (variant === "pro") {
      const titleText = document.createElement("span");
      titleText.textContent = t(titleKey);
      const titleCopy = document.createElement("span");
      titleCopy.className = "manager-pro-plan-title-copy";
      const lifetime = document.createElement("small");
      lifetime.textContent = t("pro.lifetime");
      titleCopy.append(titleText, lifetime);
      title.append(titleCopy);
    } else {
      title.textContent = t(titleKey);
    }
    const price = document.createElement("div");
    price.className = "manager-pro-plan-price";
    const amount = document.createElement("strong");
    if (variant === "pro") {
      const badge = document.createElement("span");
      badge.className = "manager-pro-launch-badge";
      badge.textContent = t("pro.launchPriceBadge");
      const oldPrice = document.createElement("s");
      oldPrice.className = "manager-pro-old-price";
      oldPrice.textContent = t("pro.regularPrice");
      amount.textContent = t("pro.proPrice");
      price.append(badge, oldPrice, amount);
    } else {
      amount.textContent = t("pro.freePrice");
      price.appendChild(amount);
    }
    head.append(title, price);
    const list = document.createElement("ul");
    rows.forEach(([iconName, key]) => {
      const item = document.createElement("li");
      const icon = document.createElement("img");
      icon.src = `../assets/icons/${themedIconName(iconName, { forceDarkIcon: key === "pro.proTrash" || key === "pro.proVault" || key === "pro.proVersioning" })}`;
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      if (key === "pro.proTrash" || key === "pro.proVault" || key === "pro.proScreenshotCapture" || key === "pro.proMarkdownCapture" || key === "pro.proMontage" || key === "pro.proVersioning") icon.classList.add("is-compact-benefit-icon");
      const label = document.createElement("span");
      appendProBenefitLabel(label, t(key));
      item.append(icon, label);
      list.appendChild(item);
    });
    if (variant === "free") appendManagerEmptyProBenefitRows(list);
    card.append(head, list);
    return card;
  }

  function appendManagerEmptyProBenefitRows(list) {
    for (let index = 0; index < 5; index += 1) {
      const item = document.createElement("li");
      item.className = "is-empty-benefit";
      item.setAttribute("aria-hidden", "true");
      const icon = document.createElement("span");
      const label = document.createElement("span");
      label.textContent = "\u00a0";
      item.append(icon, label);
      list.appendChild(item);
    }
  }

  function appendProBenefitLabel(label, text) {
    const patterns = [
      /Unlimited|Unbegrenzte|illimit[\w\u00e0-\u017f]*|ilimitad[\w\u00e0-\u017f]*/i,
      /20\s+(?:outils|tools|Werkzeuge|herramientas|strumenti)/i,
      /(?:Synchro Google Drive|Google Drive Sync|Google-Drive-Sync|Sincronizaci\u00f3n Google Drive|Sincronizzazione Google Drive)\s+\(Cloud\)/i
    ];
    appendHighlightedText(label, text, patterns);
  }

  function appendHighlightedText(node, text, patterns) {
    const value = String(text || "");
    const matches = [];
    patterns.forEach((pattern) => {
      const match = pattern.exec(value);
      if (match) matches.push({ start: match.index, end: match.index + match[0].length });
    });
    matches.sort((left, right) => left.start - right.start);
    const ranges = [];
    matches.forEach((match) => {
      const previous = ranges.at(-1);
      if (previous && match.start < previous.end) return;
      ranges.push(match);
    });
    let cursor = 0;
    ranges.forEach((range) => {
      if (range.start > cursor) node.appendChild(document.createTextNode(value.slice(cursor, range.start)));
      const strong = document.createElement("strong");
      strong.className = "pro-benefit-highlight";
      strong.textContent = value.slice(range.start, range.end);
      node.appendChild(strong);
      cursor = range.end;
    });
    if (cursor < value.length) node.appendChild(document.createTextNode(value.slice(cursor)));
  }

  function closeManagerTextModal() {
    if (restoreManagerTextModalReturn()) return;
    if (managerTextModal) managerTextModal.hidden = true;
  }

  function captureManagerTextModalReturn() {
    if (!managerTextModal || managerTextModal.hidden) return null;
    const card = managerTextModal.querySelector(".manager-text-card");
    if (card?.classList.contains("is-pro-upgrade")) return null;
    const content = managerTextModal.querySelector("[data-role='manager-text-content']");
    return {
      title: managerTextModal.querySelector("[data-role='manager-text-title']")?.textContent || "",
      closeLabel: managerTextModal.querySelector("[data-role='manager-text-close']")?.getAttribute("aria-label") || "Close",
      cardClassName: card?.className || "manager-text-card",
      contentNodes: content ? Array.from(content.childNodes) : []
    };
  }

  function restoreManagerTextModalReturn() {
    if (!managerTextModalReturn || !managerTextModal) return false;
    const restore = managerTextModalReturn;
    managerTextModalReturn = null;
    const card = managerTextModal.querySelector(".manager-text-card");
    const title = managerTextModal.querySelector("[data-role='manager-text-title']");
    const close = managerTextModal.querySelector("[data-role='manager-text-close']");
    const content = managerTextModal.querySelector("[data-role='manager-text-content']");
    if (card) card.className = restore.cardClassName;
    if (title) title.textContent = restore.title;
    if (close) close.setAttribute("aria-label", restore.closeLabel);
    if (content) content.replaceChildren(...restore.contentNodes);
    managerTextModal.hidden = false;
    return true;
  }

  async function openToolsFromManager() {
    triggerMicroAnimation(elements.openTools);
    let modal = document.getElementById("managerToolsModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerToolsModal";
      modal.className = "manager-modal manager-tools-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-tools\"></div>",
        "<section class=\"manager-tools-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"tools-title\"></strong><button type=\"button\" data-manager-action=\"close-tools\" aria-label=\"Close\">X</button></header>",
        "<div class=\"manager-tools-grid\" data-role=\"manager-tools-grid\"></div>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
      setupManagerToolsDrag(modal.querySelector("[data-role='manager-tools-grid']"));
    }
    modal.querySelector("[data-role='tools-title']").textContent = t("tools.title");
    modal.querySelector("[data-manager-action='close-tools']").setAttribute("aria-label", t("common.close"));
    renderManagerToolsGrid(modal.querySelector("[data-role='manager-tools-grid']"));
    modal.hidden = false;
  }

  function destroyLegacyManagerToolsWindows() {
    document.getElementById("managerToolsModal")?.remove();
    document.getElementById("managerToolWorkspaceModal")?.remove();
  }

  function renderManagerToolsGrid(grid) {
    if (!grid) return;
    const tools = window.MCP.getTools(t, state.settings?.toolOrder);
    grid.replaceChildren(...tools.map(createManagerToolTile));
  }

  function createManagerToolTile(tool) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "manager-tool-tile";
    button.dataset.managerAction = "open-tool";
    button.dataset.toolId = tool.id;
    button.draggable = true;
    button.setAttribute("aria-label", tool.title);
    button.title = tool.description;
    button.setAttribute("aria-grabbed", "false");
    const locked = window.MCP.canUseTool ? !window.MCP.canUseTool(tool.id, state.settings) : false;
    if (locked) {
      button.classList.add("is-pro-locked");
      button.draggable = false;
      button.dataset.proLocked = "true";
      button.title = t("pro.toolsLocked");
    }
    if (tool.icon) {
      const icon = document.createElement("img");
      icon.className = "manager-tool-tile-icon";
      icon.src = chrome.runtime.getURL(tool.icon);
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      button.appendChild(icon);
    }
    const label = document.createElement("span");
    label.className = "manager-tool-tile-title";
    label.textContent = tool.title;
    button.appendChild(label);
    if (locked) button.appendChild(createManagerProLockIcon());
    return button;
  }

  function createManagerProLockIcon() {
    const icon = document.createElement("img");
    icon.className = "manager-pro-lock-icon";
    icon.src = "../assets/icons/pro-icon.png";
    icon.alt = t("license.getPro");
    return icon;
  }

  function setupManagerToolsDrag(grid) {
    if (!grid || grid.dataset.dragReady === "true") return;
    grid.dataset.dragReady = "true";
    grid.addEventListener("dragstart", handleManagerToolDragStart);
    grid.addEventListener("dragenter", handleManagerToolDragHover);
    grid.addEventListener("dragover", handleManagerToolDragHover);
    grid.addEventListener("drop", handleManagerToolDrop);
    grid.addEventListener("dragend", handleManagerToolDragEnd);
  }

  function handleManagerToolDragStart(event) {
    const tile = event.target.closest(".manager-tool-tile[data-tool-id]");
    if (!tile) return;
    managerToolDragState = { id: tile.dataset.toolId, moved: false };
    tile.classList.add("is-dragging");
    tile.setAttribute("aria-grabbed", "true");
    tile.closest(".manager-tools-grid")?.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", tile.dataset.toolId);
  }

  function handleManagerToolDragHover(event) {
    const grid = event.currentTarget;
    const target = event.target.closest(".manager-tool-tile[data-tool-id]");
    if (!managerToolDragState || !target || !grid.contains(target)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const source = grid.querySelector(`.manager-tool-tile[data-tool-id="${CSS.escape(managerToolDragState.id)}"]`);
    if (!source || source === target) return;
    swapSiblingNodes(source, target);
    managerToolDragState.moved = true;
    target.classList.add("is-swap-target");
    setTimeout(() => target.classList.remove("is-swap-target"), 160);
  }

  function swapSiblingNodes(first, second) {
    const parent = first.parentNode;
    const marker = document.createTextNode("");
    parent.insertBefore(marker, first);
    parent.insertBefore(first, second);
    parent.insertBefore(second, marker);
    parent.removeChild(marker);
  }

  function handleManagerToolDrop(event) {
    if (!managerToolDragState) return;
    event.preventDefault();
    persistManagerToolGridOrder(event.currentTarget);
  }

  function handleManagerToolDragEnd(event) {
    const grid = event.currentTarget;
    grid.querySelectorAll(".manager-tool-tile").forEach((tile) => {
      tile.classList.remove("is-dragging", "is-swap-target");
      tile.setAttribute("aria-grabbed", "false");
    });
    grid.classList.remove("is-dragging");
    if (managerToolDragState?.moved) persistManagerToolGridOrder(grid);
    managerToolDragState = null;
    managerToolSuppressClickUntil = Date.now() + 450;
  }

  async function persistManagerToolGridOrder(grid) {
    const order = Array.from(grid.querySelectorAll(".manager-tool-tile[data-tool-id]")).map((tile) => tile.dataset.toolId);
    const normalized = window.MCP.normalizeToolOrder ? window.MCP.normalizeToolOrder(order) : order;
    if (JSON.stringify(normalized) === JSON.stringify(window.MCP.normalizeToolOrder?.(state.settings?.toolOrder || []) || state.settings?.toolOrder || [])) return;
    const currentSettings = await window.MCP.getSettings().catch(() => state.settings || {});
    const nextSettings = Object.assign({}, currentSettings, { toolOrder: normalized });
    state.settings = Object.assign({}, state.settings, { toolOrder: normalized });
    await window.MCP.saveSettings(nextSettings).catch(() => {});
  }

  function closeToolsModal() {
    const modal = document.getElementById("managerToolsModal");
    if (modal) modal.hidden = true;
  }

  function openToolWorkspace(toolId) {
    const tool = window.MCP.getTools(t).find((item) => item.id === toolId);
    if (!tool) return;
    let modal = document.getElementById("managerToolWorkspaceModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerToolWorkspaceModal";
      modal.className = "manager-modal manager-tool-workspace-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-tool-workspace\"></div>",
        "<section class=\"manager-tool-workspace-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"tool-title\"></strong><div class=\"manager-tool-head-actions\"><button type=\"button\" class=\"manager-tool-info-button\" data-manager-action=\"open-tool-info\" aria-label=\"Info\">i</button><button type=\"button\" data-manager-action=\"close-tool-workspace\" aria-label=\"Close\">X</button></div></header>",
        "<p data-role=\"tool-description\"></p>",
        "<div class=\"manager-tool-insights\" data-role=\"tool-insights\"></div>",
        "<div class=\"manager-tool-options\" data-role=\"tool-options\"></div>",
        "<section class=\"manager-emoji-browser\" data-role=\"emoji-browser\" hidden><input data-role=\"emoji-search\" type=\"search\"><div class=\"manager-emoji-grid\" data-role=\"emoji-grid\"></div></section>",
        "<div class=\"manager-tool-areas\">",
        "<label><span data-role=\"tool-input-label\"></span><textarea data-role=\"tool-input\"></textarea></label>",
        "<label data-role=\"tool-compare-panel\"><span data-role=\"tool-compare-label\"></span><textarea data-role=\"tool-compare-input\"></textarea></label>",
        "<label><span data-role=\"tool-output-label\"></span><textarea data-role=\"tool-output\" readonly></textarea></label>",
        "</div>",
        "<section class=\"manager-tool-compare-visual\" data-role=\"tool-compare-visual\" hidden>",
        "<header><span data-role=\"compare-legend-remove\"></span><span data-role=\"compare-legend-add\"></span></header>",
        "<div class=\"manager-tool-compare-visual-grid\">",
        "<article><strong data-role=\"compare-left-title\"></strong><div class=\"manager-tool-compare-render\" data-role=\"compare-left-render\"></div></article>",
        "<article><strong data-role=\"compare-right-title\"></strong><div class=\"manager-tool-compare-render\" data-role=\"compare-right-render\"></div></article>",
        "</div>",
        "</section>",
        "<footer>",
        "<button type=\"button\" class=\"primary\" data-manager-action=\"copy-tool-output\"></button>",
        "<button type=\"button\" data-manager-action=\"capture-tool-output\"></button>",
        "<button type=\"button\" data-manager-action=\"close-tool-workspace\"></button>",
        "</footer>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
      modal.querySelector("[data-role='tool-input']").addEventListener("input", () => {
        if (modal.dataset.toolId === "variableInjector") {
          updateManagerWordReplacerHighlight(modal);
          scheduleManagerToolStateSave(modal);
          return;
        }
        runActiveTool({ silent: true });
      });
      modal.querySelector("[data-role='tool-compare-input']").addEventListener("input", () => runActiveTool({ silent: true }));
      modal.querySelector("[data-role='tool-options']").addEventListener("input", (event) => {
        syncManagerColorFields(modal, event.target);
        if (modal.dataset.toolId === "variableInjector") {
          updateManagerWordReplacerHighlight(modal);
          scheduleManagerToolStateSave(modal);
          return;
        }
        runActiveTool({ silent: true });
      });
      modal.querySelector("[data-role='tool-options']").addEventListener("change", (event) => {
        syncManagerColorFields(modal, event.target);
        if (modal.dataset.toolId === "variableInjector") {
          updateManagerWordReplacerHighlight(modal);
          scheduleManagerToolStateSave(modal);
          return;
        }
        runActiveTool({ silent: true });
      });
      modal.querySelector("[data-role='emoji-search']").addEventListener("input", () => {
        if (modal.dataset.toolId === "longTextSplitter") renderManagerSpecialCharacters(modal);
        else renderManagerEmojiPicker(modal);
        scheduleManagerToolStateSave(modal);
      });
    }
    modal.dataset.toolId = tool.id;
    const card = modal.querySelector(".manager-tool-workspace-card");
    card.dataset.toolLayout = tool.layout || "editor";
    card.dataset.toolId = tool.id;
    modal.querySelector("[data-role='tool-title']").textContent = tool.title;
    modal.querySelector("[data-manager-action='open-tool-info']").setAttribute("aria-label", t("tools.help.infoButton", { tool: tool.title }));
    modal.querySelector("[data-manager-action='open-tool-info']").title = t("tools.help.infoButton", { tool: tool.title });
    modal.querySelector("[data-role='tool-description']").textContent = tool.description;
    modal.querySelector("[data-role='tool-input-label']").textContent = t("tools.input");
    modal.querySelector("[data-role='tool-compare-label']").textContent = t("tools.options.compareText");
    modal.querySelector("[data-role='tool-output-label']").textContent = t("tools.output");
    modal.querySelector("[data-role='compare-legend-remove']").textContent = t("tools.compareLegendRemoved");
    modal.querySelector("[data-role='compare-legend-add']").textContent = t("tools.compareLegendAdded");
    modal.querySelector("[data-role='compare-left-title']").textContent = t("tools.compareLeft");
    modal.querySelector("[data-role='compare-right-title']").textContent = t("tools.compareRight");
    modal.querySelector("[data-manager-action='copy-tool-output']").textContent = t("tools.copyOutput");
    modal.querySelector("[data-manager-action='capture-tool-output']").textContent = t("tools.captureOutput");
    modal.querySelector("footer [data-manager-action='close-tool-workspace']").textContent = t("common.close");
    const optionNodes = toolOptionNodes(tool.id);
    const optionsNode = modal.querySelector("[data-role='tool-options']");
    optionsNode.replaceChildren(...optionNodes);
    optionsNode.hidden = optionNodes.length === 0;
    modal.querySelector("[data-role='tool-input']").value = "";
    modal.querySelector("[data-role='tool-compare-input']").value = "";
    const emojiSearch = modal.querySelector("[data-role='emoji-search']");
    if (emojiSearch) emojiSearch.value = "";
    resetManagerToolWorkspaceMode(modal, tool.id);
    restoreManagerToolState(modal, tool.id);
    modal.querySelector("[data-role='tool-input']").placeholder = tool.id === "loremGenerator" ? "" : tool.id === "variableInjector" ? t("tools.wordReplacer.inputPlaceholder") : t("tools.inputPlaceholder");
    modal.querySelector("[data-role='tool-output']").value = "";
    modal.querySelector("[data-role='tool-insights']").replaceChildren();
    modal.hidden = false;
    if (tool.id === "emojiPicker") renderManagerEmojiPicker(modal);
    else if (tool.id === "longTextSplitter") renderManagerSpecialCharacters(modal);
    else if (tool.id === "variableInjector") updateManagerWordReplacerHighlight(modal);
    else runActiveTool({ silent: true });
  }

  function resetManagerToolWorkspaceMode(modal, toolId) {
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
    const areas = modal.querySelector(".manager-tool-areas");
    const outputPanel = modal.querySelector("[data-role='tool-output']")?.closest("label");
    const compareVisual = modal.querySelector("[data-role='tool-compare-visual']");
    const emojiBrowser = modal.querySelector("[data-role='emoji-browser']");
    inputLabel.textContent = isComparator ? t("tools.compareLeft") : t("tools.input");
    compareLabel.textContent = isComparator ? t("tools.compareRight") : t("tools.options.compareText");
    if (comparePanel) comparePanel.hidden = !isComparator;
    if (areas) areas.hidden = isEmojiPicker || isSpecialCharacters;
    if (outputPanel) outputPanel.hidden = isComparator || isEmojiPicker;
    modal.querySelector("[data-role='tool-input']")?.closest("label")?.toggleAttribute("hidden", isEmojiPicker || isColorPicker || isImageText);
    if (outputPanel && isImageText) outputPanel.querySelector("span").textContent = t("tools.imageText.extracted");
    if (emojiBrowser) {
      emojiBrowser.hidden = !(isEmojiPicker || isSpecialCharacters);
      const search = emojiBrowser.querySelector("[data-role='emoji-search']");
      if (search) {
        const placeholder = isSpecialCharacters ? t("tools.specialCharacters.search") : t("tools.emojiSearch");
        search.placeholder = placeholder;
        search.setAttribute("aria-label", placeholder);
      }
    }
    ["copy-tool-output", "capture-tool-output"].forEach((managerAction) => {
      const button = modal.querySelector(`[data-manager-action='${managerAction}']`);
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
        compareVisual.querySelector("[data-role='compare-legend-remove']").textContent = t("tools.duplicateLegend");
        if (addedLegend) addedLegend.hidden = true;
        compareVisual.querySelector("[data-role='compare-left-title']").textContent = t("tools.input");
        compareVisual.querySelector("[data-role='compare-right-title']").textContent = t("tools.output");
      } else if (isComparator) {
        compareVisual.querySelector("[data-role='compare-legend-remove']").textContent = t("tools.compareLegendRemoved");
        if (addedLegend) {
          addedLegend.hidden = false;
          addedLegend.textContent = t("tools.compareLegendAdded");
        }
        compareVisual.querySelector("[data-role='compare-left-title']").textContent = t("tools.compareLeft");
        compareVisual.querySelector("[data-role='compare-right-title']").textContent = t("tools.compareRight");
      }
      if (!hasVisual) {
        compareVisual.querySelector("[data-role='compare-left-render']")?.replaceChildren();
        compareVisual.querySelector("[data-role='compare-right-render']")?.replaceChildren();
      }
    }
  }

  function closeToolWorkspace() {
    const modal = document.getElementById("managerToolWorkspaceModal");
    if (modal) modal.hidden = true;
  }

  function openManagerToolInfoModal() {
    const modal = document.getElementById("managerToolWorkspaceModal");
    const toolId = modal?.dataset.toolId || "";
    const tool = window.MCP.getTools(t).find((item) => item.id === toolId);
    if (!tool) return;
    openManagerTextModal("tools.help.title", []);
    managerTextModal.querySelector("[data-role='manager-text-title']").textContent = t("tools.help.title", { tool: tool.title });
    const content = managerTextModal.querySelector("[data-role='manager-text-content']");
    content.replaceChildren(createManagerToolHelpContent(tool));
    content.scrollTop = 0;
    requestAnimationFrame(() => {
      content.scrollTop = 0;
    });
    managerTextModal.querySelector(".manager-text-card")?.classList.add("is-tool-help");
  }

  function createManagerToolHelpContent(tool) {
    const wrapper = document.createElement("div");
    wrapper.className = "manager-tool-help";
    const intro = document.createElement("p");
    intro.className = "manager-tool-help-intro";
    intro.textContent = tool.description;
    wrapper.appendChild(intro);
    [
      ["problem", "tools.help.problem"],
      ["solution", "tools.help.solution"],
      ["how", "tools.help.how"],
      ["example", "tools.help.example"]
    ].forEach(([name, labelKey]) => {
      const section = document.createElement("section");
      section.className = "manager-tool-help-section";
      const title = document.createElement("h3");
      title.textContent = t(labelKey);
      const body = document.createElement("p");
      appendManagerToolHelpText(body, t(`tools.help.${tool.id}.${name}`));
      section.append(title, body);
      wrapper.appendChild(section);
    });
    return wrapper;
  }

  function appendManagerToolHelpText(node, value) {
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

  function getManagerToolState(toolId) {
    const states = state.settings?.toolStates;
    return states && typeof states === "object" && states[toolId] && typeof states[toolId] === "object" ? states[toolId] : {};
  }

  function restoreManagerToolState(modal, toolId) {
    const saved = getManagerToolState(toolId);
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

  function collectManagerToolState(modal) {
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

  function scheduleManagerToolStateSave(modal) {
    if (!modal || modal.hidden || !modal.dataset.toolId) return;
    clearTimeout(managerToolStateSaveTimer);
    managerToolStateSaveTimer = window.setTimeout(() => saveManagerToolState(modal), 280);
  }

  async function saveManagerToolState(modal) {
    if (!modal || !modal.dataset.toolId) return;
    const toolId = modal.dataset.toolId;
    const nextToolState = collectManagerToolState(modal);
    const currentSettings = await window.MCP.getSettings().catch(() => state.settings || {});
    const nextToolStates = Object.assign({}, currentSettings.toolStates || {}, { [toolId]: nextToolState });
    const nextSettings = Object.assign({}, currentSettings, { toolStates: nextToolStates });
    state.settings = Object.assign({}, state.settings, { toolStates: nextToolStates });
    await window.MCP.saveSettings(nextSettings).catch(() => {});
  }

  function toolOptionNodes(toolId) {
    const nodes = [];
    const select = (name, options) => {
      const label = document.createElement("label");
      const span = document.createElement("span");
      span.textContent = t(`tools.options.${name}`);
      const field = document.createElement("select");
      field.dataset.toolOption = name;
      options.forEach(([value, key]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = t(key);
        field.appendChild(option);
      });
      label.append(span, field);
      nodes.push(label);
    };
    const input = (name, value = "") => {
      const label = document.createElement("label");
      const span = document.createElement("span");
      span.textContent = t(`tools.options.${name}`);
      const field = document.createElement("input");
      field.dataset.toolOption = name;
      field.value = value;
      label.append(span, field);
      nodes.push(label);
    };
    const area = (name) => {
      const label = document.createElement("label");
      const span = document.createElement("span");
      span.textContent = t(`tools.options.${name}`);
      const field = document.createElement("textarea");
      field.dataset.toolOption = name;
      label.append(span, field);
      nodes.push(label);
    };
    if (toolId === "caseConverter") select("caseMode", [["upper", "tools.case.upper"], ["lower", "tools.case.lower"], ["title", "tools.case.title"], ["sentence", "tools.case.sentence"], ["camel", "tools.case.camel"], ["snake", "tools.case.snake"], ["kebab", "tools.case.kebab"], ["pascal", "tools.case.pascal"]]);
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
    if (toolId === "variableInjector") nodes.push(createManagerWordReplacerPanel());
    if (toolId === "listTransformer") select("listMode", [["bullets", "tools.list.bullets"], ["numbered", "tools.list.numbered"], ["csv", "tools.list.csv"], ["markdownTable", "tools.list.table"], ["sort", "tools.list.sort"], ["unique", "tools.list.unique"], ["reverse", "tools.list.reverse"]]);
    if (toolId === "universalEncoder") select("encodeMode", [["urlEncode", "tools.encode.urlEncode"], ["urlDecode", "tools.encode.urlDecode"], ["base64Encode", "tools.encode.base64Encode"], ["base64Decode", "tools.encode.base64Decode"], ["htmlEncode", "tools.encode.htmlEncode"], ["htmlDecode", "tools.encode.htmlDecode"], ["jwtDecode", "tools.encode.jwtDecode"]]);
    if (toolId === "colorPicker") nodes.push(createManagerColorPickerPanel());
    if (toolId === "imageText") nodes.push(createManagerImageTextPanel());
    if (toolId === "jsonFormatter") select("jsonMode", [["pretty", "tools.json.pretty"], ["minify", "tools.json.minify"]]);
    if (toolId === "loremGenerator") input("wordCount", "120");
    if (toolId === "markdownToolkit") select("markdownMode", [["checklist", "tools.markdown.checklist"], ["html", "tools.markdown.html"], ["code", "tools.markdown.code"], ["headings", "tools.markdown.headings"]]);
    return nodes;
  }

  function createManagerColorPickerPanel() {
    const panel = document.createElement("section");
    panel.className = "manager-color-picker-panel";
    panel.innerHTML = [
      "<div class=\"manager-color-picker-main\">",
      "<button type=\"button\" class=\"primary manager-color-picker-start\" data-manager-action=\"start-color-pick\"></button>",
      "<p></p>",
      "</div>",
      "<div class=\"manager-color-picker-controls\">",
      "<label><span></span><input type=\"color\" data-tool-option=\"colorHex\" value=\"#e50914\"></label>",
      "<label><span></span><input type=\"text\" data-tool-option=\"colorText\" value=\"#E50914\" spellcheck=\"false\"></label>",
      "<div class=\"manager-color-picker-preview\" data-role=\"color-preview\"></div>",
      "</div>",
      "<div class=\"manager-color-copy-row\">",
      "<button type=\"button\" data-manager-action=\"copy-color-format\" data-format=\"hex\"></button>",
      "<button type=\"button\" data-manager-action=\"copy-color-format\" data-format=\"rgb\"></button>",
      "<button type=\"button\" data-manager-action=\"copy-color-format\" data-format=\"hsl\"></button>",
      "<button type=\"button\" data-manager-action=\"copy-color-format\" data-format=\"cssVariable\"></button>",
      "</div>",
      "<div class=\"manager-color-palette\" data-role=\"color-palette\"></div>"
    ].join("");
    panel.querySelector("[data-manager-action='start-color-pick']").textContent = t("tools.colorPicker.start");
    panel.querySelector("p").textContent = t("tools.colorPicker.instruction");
    const labels = panel.querySelectorAll("label span");
    labels[0].textContent = t("tools.colorPicker.manual");
    labels[1].textContent = t("tools.colorPicker.hex");
    panel.querySelector("[data-format='hex']").textContent = t("tools.colorPicker.copyHex");
    panel.querySelector("[data-format='rgb']").textContent = t("tools.colorPicker.copyRgb");
    panel.querySelector("[data-format='hsl']").textContent = t("tools.colorPicker.copyHsl");
    panel.querySelector("[data-format='cssVariable']").textContent = t("tools.colorPicker.copyCss");
    return panel;
  }

  function createManagerImageTextPanel() {
    const panel = document.createElement("section");
    panel.className = "manager-image-text-panel";
    panel.innerHTML = [
      "<div class=\"manager-image-text-main\">",
      "<button type=\"button\" class=\"primary manager-image-text-start\" data-manager-action=\"start-image-text-capture\"></button>",
      "<p></p>",
      "</div>"
    ].join("");
    panel.querySelector("[data-manager-action='start-image-text-capture']").textContent = t("tools.imageText.start");
    panel.querySelector("p").textContent = t("tools.imageText.instruction");
    return panel;
  }

  function createManagerWordReplacerPanel() {
    const panel = document.createElement("section");
    panel.className = "manager-word-replacer-panel";
    panel.innerHTML = [
      "<label><span></span><input type=\"text\" data-tool-option=\"replaceFind\"></label>",
      "<button type=\"button\" data-manager-action=\"search-word-replacer\"></button>",
      "<label><span></span><input type=\"text\" data-tool-option=\"replaceWith\"></label>",
      "<button type=\"button\" class=\"primary\" data-manager-action=\"replace-word-replacer\"></button>"
    ].join("");
    const labels = panel.querySelectorAll("label span");
    labels[0].textContent = t("tools.options.replaceFind");
    labels[1].textContent = t("tools.options.replaceWith");
    panel.querySelector("[data-tool-option='replaceFind']").placeholder = t("tools.wordReplacer.findPlaceholder");
    panel.querySelector("[data-tool-option='replaceWith']").placeholder = t("tools.wordReplacer.replacePlaceholder");
    panel.querySelector("[data-manager-action='search-word-replacer']").textContent = t("tools.wordReplacer.search");
    panel.querySelector("[data-manager-action='replace-word-replacer']").textContent = t("tools.wordReplacer.replace");
    return panel;
  }

  function collectToolOptions(modal) {
    const options = [...modal.querySelectorAll("[data-tool-option]")].reduce((nextOptions, field) => {
      nextOptions[field.dataset.toolOption] = field.value;
      return nextOptions;
    }, { locale: state.settings.language || "en" });
    const compareText = modal.querySelector("[data-role='tool-compare-input']");
    if (compareText) options.compareText = compareText.value;
    return options;
  }

  function syncManagerColorFields(modal, target) {
    if (modal?.dataset.toolId !== "colorPicker" || !target?.dataset?.toolOption) return;
    const colorInput = modal.querySelector("[data-tool-option='colorHex']");
    const textInput = modal.querySelector("[data-tool-option='colorText']");
    if (!colorInput || !textInput || !window.MCP?.parseColorSafe || !window.MCP?.colorFormats) return;
    if (target.dataset.toolOption === "colorHex") {
      textInput.value = String(colorInput.value || "#e50914").toUpperCase();
      return;
    }
    const color = window.MCP.parseColorSafe(textInput.value);
    if (color) colorInput.value = window.MCP.colorFormats(color, state.settings.language || "en").hex;
  }

  function renderManagerColorPicker(modal, options = {}) {
    if (!window.MCP?.parseColorSafe || !window.MCP?.colorFormats) return;
    const color = window.MCP.parseColorSafe(options.colorText || options.colorHex || "#e50914");
    if (!color) return;
    const formats = window.MCP.colorFormats(color, state.settings.language || "en");
    const colorInput = modal.querySelector("[data-tool-option='colorHex']");
    const textInput = modal.querySelector("[data-tool-option='colorText']");
    if (colorInput && colorInput.value.toUpperCase() !== formats.hex) colorInput.value = formats.hex;
    if (textInput && !window.MCP.parseColorSafe(textInput.value)) textInput.value = formats.hex;
    const preview = modal.querySelector("[data-role='color-preview']");
    if (preview) {
      preview.style.setProperty("--picked-color", formats.hex);
      preview.textContent = formats.hex;
    }
    const palette = modal.querySelector("[data-role='color-palette']");
    if (palette && window.MCP.buildColorPalette) {
      palette.replaceChildren(...window.MCP.buildColorPalette(color).map((hex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.managerAction = "copy-color-format";
        button.dataset.format = "custom";
        button.dataset.color = hex;
        button.style.setProperty("--picked-color", hex);
        button.textContent = hex;
        return button;
      }));
    }
  }

  async function startManagerColorPick() {
    const modal = document.getElementById("managerToolWorkspaceModal");
    if (modal?.dataset.toolId === "colorPicker") await saveManagerToolState(modal).catch(() => {});
    closeToolWorkspace();
    closeToolsModal();
    const response = await chrome.runtime.sendMessage({ type: window.MCP?.MESSAGE_TYPES?.START_COLOR_PICKER || "MCP_START_COLOR_PICKER" }).catch((error) => ({ ok: false, error: error.message }));
    if (!response?.ok || response?.data?.opened === false) showManagerToast(t("tools.colorPicker.unsupported"));
  }

  async function startManagerImageTextCapture() {
    const modal = document.getElementById("managerToolWorkspaceModal");
    if (modal?.dataset.toolId === "imageText") await saveManagerToolState(modal).catch(() => {});
    closeToolWorkspace();
    closeToolsModal();
    const response = await chrome.runtime.sendMessage({ type: window.MCP?.MESSAGE_TYPES?.START_IMAGE_TEXT_CAPTURE || "MCP_START_IMAGE_TEXT_CAPTURE" }).catch((error) => ({ ok: false, error: error.message }));
    if (!response?.ok || response?.data?.opened === false) showManagerToast(t("tools.imageText.unsupported"));
  }

  async function copyManagerColorFormat(button) {
    const modal = document.getElementById("managerToolWorkspaceModal");
    if (!modal || modal.dataset.toolId !== "colorPicker" || !window.MCP?.parseColorSafe || !window.MCP?.colorFormats) return;
    const format = button?.dataset?.format || "hex";
    const custom = button?.dataset?.color;
    const color = window.MCP.parseColorSafe(custom || modal.querySelector("[data-tool-option='colorText']")?.value || modal.querySelector("[data-tool-option='colorHex']")?.value || "#e50914");
    if (!color) return;
    const formats = window.MCP.colorFormats(color, state.settings.language || "en");
    const value = custom || formats[format] || formats.hex;
    await navigator.clipboard.writeText(value).catch(() => {});
    showManagerToast(t("tools.colorPicker.copied"));
  }

  function runActiveTool({ silent = false } = {}) {
    const modal = document.getElementById("managerToolWorkspaceModal");
    if (!modal || modal.hidden) return "";
    const input = modal.querySelector("[data-role='tool-input']").value;
    const options = collectToolOptions(modal);
    const output = window.MCP.runTool(modal.dataset.toolId, input, options);
    modal.querySelector("[data-role='tool-output']").value = output;
    if (modal.dataset.toolId === "colorPicker") renderManagerColorPicker(modal, options);
    if (modal.dataset.toolId === "textComparator") renderManagerTextComparator(modal, input, options.compareText || "");
    else if (modal.dataset.toolId === "duplicateDetector") renderManagerDuplicateDetector(modal, input, output, options);
    renderToolInsights(modal, input, output, options);
    scheduleManagerToolStateSave(modal);
    if (!silent) showManagerToast(t("tools.processed"));
    return output;
  }

  function searchManagerWordReplacer() {
    const modal = document.getElementById("managerToolWorkspaceModal");
    if (!modal || modal.hidden) return;
    const input = modal.querySelector("[data-role='tool-input']")?.value || "";
    const needle = modal.querySelector("[data-tool-option='replaceFind']")?.value || "";
    if (!input.trim()) {
      showManagerToast(t("tools.wordReplacer.missingText"));
      return;
    }
    if (!needle) {
      showManagerToast(t("tools.wordReplacer.missingNeedle"));
      return;
    }
    const count = window.MCP.countWordReplacerMatches ? window.MCP.countWordReplacerMatches(input, needle) : 0;
    updateManagerWordReplacerHighlight(modal);
    showManagerToast(count ? t("tools.wordReplacer.found", { count }) : t("tools.wordReplacer.notFound"));
  }

  function replaceManagerWords() {
    const modal = document.getElementById("managerToolWorkspaceModal");
    if (!modal || modal.hidden) return;
    const input = modal.querySelector("[data-role='tool-input']")?.value || "";
    const needle = modal.querySelector("[data-tool-option='replaceFind']")?.value || "";
    if (!input.trim()) {
      showManagerToast(t("tools.wordReplacer.missingText"));
      return;
    }
    if (!needle) {
      showManagerToast(t("tools.wordReplacer.missingNeedle"));
      return;
    }
    const count = window.MCP.countWordReplacerMatches ? window.MCP.countWordReplacerMatches(input, needle) : 0;
    runActiveTool({ silent: true });
    updateManagerWordReplacerHighlight(modal);
    showManagerToast(count ? t("tools.wordReplacer.replaced", { count }) : t("tools.wordReplacer.notFound"));
  }

  function updateManagerWordReplacerHighlight(modal) {
    if (!modal || modal.dataset.toolId !== "variableInjector") return;
    const input = modal.querySelector("[data-role='tool-input']");
    if (!input) return;
    const highlight = ensureManagerWordReplacerHighlight(input);
    const needle = modal.querySelector("[data-tool-option='replaceFind']")?.value || "";
    highlight.innerHTML = buildManagerWordReplacerHighlightHtml(input.value, needle);
    highlight.scrollTop = input.scrollTop;
    highlight.scrollLeft = input.scrollLeft;
  }

  function ensureManagerWordReplacerHighlight(input) {
    const label = input.closest("label");
    let highlight = label?.querySelector("[data-role='word-replacer-highlight']");
    if (!label) return document.createElement("div");
    label.classList.add("is-word-replacer-source");
    if (!highlight) {
      highlight = document.createElement("div");
      highlight.className = "manager-word-replacer-highlight";
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

  function buildManagerWordReplacerHighlightHtml(text, needle) {
    const source = String(text || "");
    const search = String(needle || "");
    if (!source) return "&nbsp;";
    if (!search) return escapeHtml(source);
    const regex = new RegExp(escapeManagerRegExp(search), "gi");
    let cursor = 0;
    let html = "";
    let match;
    while ((match = regex.exec(source))) {
      if (match.index > cursor) html += escapeHtml(source.slice(cursor, match.index));
      html += `<mark>${escapeHtml(match[0])}</mark>`;
      cursor = match.index + match[0].length;
      if (match[0].length === 0) regex.lastIndex += 1;
    }
    if (cursor < source.length) html += escapeHtml(source.slice(cursor));
    return html || "&nbsp;";
  }

  function escapeManagerRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function renderManagerTextComparator(modal, leftText, rightText) {
    const left = String(leftText || "");
    const right = String(rightText || "");
    const leftNode = modal.querySelector("[data-role='compare-left-render']");
    const rightNode = modal.querySelector("[data-role='compare-right-render']");
    if (!leftNode || !rightNode) return;
    const visual = buildTextCompareVisual(left, right);
    leftNode.innerHTML = visual.leftHtml;
    rightNode.innerHTML = visual.rightHtml;
    const insight = modal.querySelector("[data-role='tool-insights']");
    if (!insight) return;
    const cards = insight.querySelectorAll(".manager-tool-insight-card strong");
    if (cards.length >= 4) {
      cards[0].textContent = String(visual.stats.addedTokens);
      cards[1].textContent = String(visual.stats.removedTokens);
      cards[2].textContent = String(visual.stats.changedLines);
      cards[3].textContent = String(visual.stats.sameLines);
    }
  }

  function renderManagerDuplicateDetector(modal, input, output, options) {
    const leftNode = modal.querySelector("[data-role='compare-left-render']");
    const rightNode = modal.querySelector("[data-role='compare-right-render']");
    if (!leftNode || !rightNode || !window.MCP.detectDuplicateText) return;
    const report = window.MCP.detectDuplicateText(input, options.locale || state.settings.language || "en");
    updateManagerDuplicateTextareaHighlight(modal, report);
    if (input.trim()) leftNode.innerHTML = buildManagerDuplicateSourceHtml(input, report.groups);
    else leftNode.replaceChildren();
    rightNode.innerHTML = `<pre class="cleaned-output">${escapeHtml(output || report.cleanedText || "") || "&nbsp;"}</pre>`;
  }

  function updateManagerDuplicateTextareaHighlight(modal, report) {
    const input = modal.querySelector("[data-role='tool-input']");
    if (!input) return;
    const highlight = ensureManagerDuplicateTextareaHighlight(input);
    const duplicateKeys = new Set((report.groups || []).map((group) => group.key));
    highlight.innerHTML = (report.segments || []).map((segment) => {
      const key = normalizeManagerDuplicateKey(segment.value);
      const raw = escapeHtml(segment.raw || "");
      if (!key || !duplicateKeys.has(key)) return raw;
      return `<span class="duplicate-hit">${raw}</span>`;
    }).join("") || "&nbsp;";
    highlight.scrollTop = input.scrollTop;
    highlight.scrollLeft = input.scrollLeft;
  }

  function ensureManagerDuplicateTextareaHighlight(input) {
    const label = input.closest("label");
    let highlight = label?.querySelector("[data-role='duplicate-source-highlight']");
    if (!label) return document.createElement("div");
    label.classList.add("is-duplicate-source");
    if (!highlight) {
      highlight = document.createElement("div");
      highlight.className = "manager-duplicate-source-highlight";
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

  function bindManagerDuplicateSource(leftNode, modal) {
    if (leftNode.dataset.duplicateBound === "true") return;
    leftNode.dataset.duplicateBound = "true";
    leftNode.contentEditable = "true";
    leftNode.setAttribute("role", "textbox");
    leftNode.setAttribute("aria-multiline", "true");
    leftNode.setAttribute("tabindex", "0");
    leftNode.setAttribute("data-placeholder", t("tools.inputPlaceholder"));
    leftNode.addEventListener("pointerdown", () => {
      window.setTimeout(() => {
        if (document.activeElement !== leftNode) leftNode.focus();
      }, 0);
    });
    leftNode.addEventListener("paste", (event) => {
      event.preventDefault();
      const text = event.clipboardData?.getData("text/plain") || "";
      insertPlainTextIntoEditable(leftNode, text);
      syncManagerDuplicateSource(modal, leftNode);
      runActiveTool({ silent: true });
    });
    leftNode.addEventListener("input", () => {
      syncManagerDuplicateSource(modal, leftNode);
      runActiveTool({ silent: true });
    });
    leftNode.addEventListener("blur", () => runActiveTool({ silent: true }));
  }

  function getManagerDuplicateSourceText(modal) {
    const leftNode = modal.querySelector("[data-role='compare-left-render']");
    const visibleText = leftNode ? getEditablePlainText(leftNode) : "";
    return visibleText.trim() ? visibleText : modal.querySelector("[data-role='tool-input']")?.value || "";
  }

  function syncManagerDuplicateSource(modal, leftNode) {
    const input = modal.querySelector("[data-role='tool-input']");
    if (input) input.value = getEditablePlainText(leftNode);
  }

  function getEditablePlainText(node) {
    return String(node?.innerText || node?.textContent || "")
      .replace(/\u00a0/g, " ")
      .replace(/^(?:[ \t]*\r?\n)+/, "");
  }

  function isManagerDuplicateSourceFocused(node) {
    return document.activeElement === node || node?.matches?.(":focus");
  }

  function insertPlainTextIntoEditable(node, text) {
    const cleanText = normalizeDuplicatePastedText(text);
    node.focus();
    if (!getEditablePlainText(node).trim()) {
      node.textContent = cleanText;
      placeCaretAtEditableEnd(node);
      return;
    }
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || !node.contains(selection.anchorNode)) {
      const textNode = document.createTextNode(cleanText);
      node.appendChild(textNode);
      placeCaretAfterNode(textNode);
      return;
    }
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(cleanText);
    range.insertNode(textNode);
    placeCaretAfterNode(textNode);
  }

  function normalizeDuplicatePastedText(text) {
    return String(text || "")
      .replace(/\u00a0/g, " ")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/^(?:[ \t]*\n)+/, "");
  }

  function placeCaretAfterNode(node) {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function placeCaretAtEditableEnd(node) {
    const selection = window.getSelection();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function buildManagerDuplicateSourceHtml(input, groups = []) {
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e"];
    const colorByKey = new Map(groups.map((group, index) => [group.key, colors[index % colors.length]]));
    const segments = window.MCP.detectDuplicateText ? duplicateVisualSegments(input) : [];
    return segments.map((segment) => {
      const key = normalizeManagerDuplicateKey(segment.value);
      const color = colorByKey.get(key);
      if (!color || !segment.value.trim()) return escapeHtml(segment.raw);
      return `<span class="duplicate-hit" style="--duplicate-color:${color}">${escapeHtml(segment.raw)}</span>`;
    }).join("") || "&nbsp;";
  }

  function duplicateVisualSegments(text) {
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

  function normalizeManagerDuplicateKey(value) {
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

  function buildTextCompareVisual(leftText, rightText) {
    const leftLines = String(leftText || "").split("\n");
    const rightLines = String(rightText || "").split("\n");
    const max = Math.max(leftLines.length, rightLines.length);
    const leftHtml = [];
    const rightHtml = [];
    let addedTokens = 0;
    let removedTokens = 0;
    let sameLines = 0;
    let changedLines = 0;
    for (let index = 0; index < max; index += 1) {
      const left = leftLines[index] ?? "";
      const right = rightLines[index] ?? "";
      if (left === right) {
        sameLines += 1;
        leftHtml.push(`<div class="same">${escapeHtml(left) || "&nbsp;"}</div>`);
        rightHtml.push(`<div class="same">${escapeHtml(right) || "&nbsp;"}</div>`);
        continue;
      }
      changedLines += 1;
      const diff = wordDiff(left, right);
      leftHtml.push(`<div class="changed">${diff.left}</div>`);
      rightHtml.push(`<div class="changed">${diff.right}</div>`);
      removedTokens += diff.removed;
      addedTokens += diff.added;
    }
    return {
      leftHtml: leftHtml.join(""),
      rightHtml: rightHtml.join(""),
      stats: { addedTokens, removedTokens, changedLines, sameLines }
    };
  }

  function wordDiff(leftLine, rightLine) {
    const leftTokens = tokenizeWithSpaces(leftLine);
    const rightTokens = tokenizeWithSpaces(rightLine);
    const common = new Set(rightTokens.filter((token) => token.trim()));
    let removed = 0;
    const left = leftTokens.map((token) => {
      if (!token.trim()) return escapeHtml(token);
      if (common.has(token)) return escapeHtml(token);
      removed += 1;
      return `<span class="removed">${escapeHtml(token)}</span>`;
    }).join("");
    const commonLeft = new Set(leftTokens.filter((token) => token.trim()));
    let added = 0;
    const right = rightTokens.map((token) => {
      if (!token.trim()) return escapeHtml(token);
      if (commonLeft.has(token)) return escapeHtml(token);
      added += 1;
      return `<span class="added">${escapeHtml(token)}</span>`;
    }).join("");
    return { left, right, added, removed };
  }

  function tokenizeWithSpaces(text) {
    return String(text || "").split(/(\s+)/);
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderToolInsights(modal, input, output, options) {
    const target = modal.querySelector("[data-role='tool-insights']");
    if (!target || !window.MCP.inspectTool) return;
    const insight = window.MCP.inspectTool(modal.dataset.toolId, input, output, options, t);
    const cards = document.createElement("div");
    cards.className = "manager-tool-insight-cards";
    (insight.cards || []).forEach((card) => {
      const node = document.createElement("article");
      node.className = card.tone ? `manager-tool-insight-card is-${card.tone}` : "manager-tool-insight-card";
      const value = document.createElement("strong");
      value.textContent = card.value;
      const name = document.createElement("span");
      name.textContent = card.name;
      node.append(value, name);
      cards.appendChild(node);
    });
    const sections = document.createElement("div");
    sections.className = "manager-tool-sections";
    (insight.sections || []).slice(0, 3).forEach((section) => {
      const block = document.createElement("section");
      block.className = section.tone ? `is-${section.tone}` : "";
      const title = document.createElement("strong");
      title.textContent = section.title;
      const list = document.createElement("div");
      list.className = "manager-tool-section-lines";
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

  function renderManagerEmojiPicker(modal) {
    const grid = modal.querySelector("[data-role='emoji-grid']");
    const search = modal.querySelector("[data-role='emoji-search']");
    if (!grid || !window.MCP.getEmojiLibrary) return;
    const locale = String(state.settings.language || "en").slice(0, 2).toLowerCase();
    const query = normalizeEmojiQuery(search?.value || "");
    const items = window.MCP.getEmojiLibrary().filter((item) => {
      if (!query) return true;
      return normalizeEmojiQuery([item.emoji, item.names?.[locale], item.names?.en, item.search].join(" ")).includes(query);
    });
    grid.replaceChildren(...items.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "manager-emoji-item";
      button.dataset.managerAction = "copy-emoji";
      button.dataset.emoji = item.emoji;
      const emoji = document.createElement("span");
      emoji.className = "manager-emoji-symbol";
      emoji.textContent = item.emoji;
      const name = document.createElement("strong");
      name.textContent = item.names?.[locale] || item.names?.en || item.emoji;
      const copy = document.createElement("span");
      copy.className = "manager-emoji-copy";
      copy.textContent = t("common.copy");
      button.append(emoji, name, copy);
      return button;
    }));
  }

  function renderManagerSpecialCharacters(modal) {
    const grid = modal.querySelector("[data-role='emoji-grid']");
    const search = modal.querySelector("[data-role='emoji-search']");
    if (!grid || !window.MCP.getSpecialCharacterLibrary) return;
    const locale = String(state.settings.language || "en").slice(0, 2).toLowerCase();
    const query = normalizeEmojiQuery(search?.value || "");
    const items = window.MCP.getSpecialCharacterLibrary(locale).filter((item) => {
      if (!query) return true;
      return normalizeEmojiQuery([item.symbol, item.names?.[locale], item.names?.en, item.search].join(" ")).includes(query);
    });
    grid.replaceChildren(...items.map((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "manager-emoji-item manager-special-character-item";
      button.dataset.managerAction = "copy-special-character";
      button.dataset.symbol = item.symbol;
      const symbol = document.createElement("span");
      symbol.className = "manager-emoji-symbol manager-special-character-symbol";
      symbol.textContent = item.symbol;
      const name = document.createElement("strong");
      name.textContent = item.names?.[locale] || item.names?.en || item.symbol;
      const copy = document.createElement("span");
      copy.className = "manager-emoji-copy";
      copy.textContent = t("common.copy");
      button.append(symbol, name, copy);
      return button;
    }));
  }

  function normalizeEmojiQuery(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  async function copyManagerEmoji(emoji) {
    if (!emoji) return;
    await navigator.clipboard.writeText(emoji);
    showManagerToast(t("tools.emojiCopied"));
  }

  async function copyManagerSpecialCharacter(symbol) {
    if (!symbol) return;
    await navigator.clipboard.writeText(symbol);
    showManagerToast(t("tools.specialCharacters.copied"));
  }

  async function copyToolOutput() {
    const output = runActiveTool({ silent: true });
    if (!output) return;
    await navigator.clipboard.writeText(output);
    showManagerToast(t("clipboard.readyToPaste"));
  }

  async function captureToolOutput() {
    const output = runActiveTool({ silent: true });
    if (!output) return;
    await window.MCP.saveClipboardItem({ content: output, categoryId: "general", categoryName: "General", sourceTitle: t("tools.title"), sourceDomain: "Ultimate Clipboard Pro" });
    await loadState();
    showManagerToast(t("tools.captured"));
  }

  function renderCategories() {
    elements.categories.replaceChildren();
    elements.categories.className = "category-list category-tree";
    const categoryTreeQuery = window.MCP.normalizeContent(elements.categoryTreeSearch?.value || "");

    const quick = document.createElement("div");
    quick.className = "category-quick";
    if (!categoryTreeQuery) {
      quick.append(
        categoryButton("all", activeTab === "image" ? t("categories.allImages") : activeTab === "dev" ? t("dev.all") : t("categories.allTexts"), selectedCategory === "all")
      );

      elements.categories.appendChild(quick);
    }
    renderCategoryNodes(activeCategoryTree(), elements.categories, 0, categoryTreeQuery);
  }

  function categoryButton(id, label, active) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = active ? "is-active" : "";
    button.dataset.buttonId = id;
    if (isFavoriteCategoryId(id) || isTrashCategoryId(id) || isVaultCategoryId(id)) {
      const heart = isTrashCategoryId(id) ? createTrashCategoryIcon() : isVaultCategoryId(id) ? createVaultCategoryIcon() : document.createElement("span");
      if (!isTrashCategoryId(id) && !isVaultCategoryId(id)) {
        heart.className = "category-button-heart";
        heart.textContent = "\u2665";
        heart.setAttribute("aria-hidden", "true");
      }
      const count = categoryCountNode(id);
      const text = document.createElement("span");
      text.textContent = label;
      button.append(heart);
      if (isTrashCategoryId(id) && !canUseTrashManagement()) button.appendChild(createCategoryProBadge());
      if (isVaultCategoryId(id) && !canUseVault()) button.appendChild(createCategoryProBadge());
      button.appendChild(text);
      if (count) button.appendChild(count);
    } else {
      const text = document.createElement("span");
      text.textContent = label;
      button.appendChild(text);
      if (id === "all") {
        const count = totalCountNode();
        if (count) button.appendChild(count);
      }
    }
    button.addEventListener("click", async () => {
      if (isTrashCategoryId(id) && !canUseTrashManagement()) {
        openManagerProUpgradeModal("trashManagement");
        showManagerToast(t("pro.trashRequired"));
        return;
      }
      if (isVaultCategoryId(id)) {
        if (!canUseVault()) {
          openManagerProUpgradeModal("vault");
          showManagerToast(t("pro.vaultRequired"));
          return;
        }
        const unlocked = await ensureManagerVaultUnlocked();
        if (!unlocked) return;
      }
      resetManagerBulkSelection({ renderControls: false });
      favoritesOnly = isFavoriteCategoryId(id);
      selectedCategory = favoritesOnly ? "all" : id;
      selectedIndex = 0;
      persistManagerViewState();
      render();
    });
    const category = activeCategories().find((item) => item.id === id);
    if (category) {
      button.addEventListener("dragover", (event) => handleCategoryDragOver(event, category));
      button.addEventListener("dragleave", handleCategoryDragLeave);
      button.addEventListener("drop", (event) => handleCategoryDrop(event, category, activeTab === "image" ? "image" : activeTab === "dev" ? "dev" : "category"));
    }
    return button;
  }

  function createCategoryProBadge() {
    const img = document.createElement("img");
    img.className = "category-pro-badge";
    img.src = "../assets/icons/pro-icon.png";
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    return img;
  }

  function createTrashCategoryIcon() {
    const img = document.createElement("img");
    img.className = "category-button-trash";
    img.src = `../assets/icons/${themedIconName("erase.png")}`;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    return img;
  }

  function createVaultCategoryIcon() {
    const img = document.createElement("img");
    img.className = "category-button-vault";
    const suffix = document.documentElement.getAttribute("data-resolved-theme") === "light" ? "lightmod" : "darkmod";
    img.src = `../assets/icons/locker-${suffix}.png`;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    return img;
  }

  function renderCategoryNodes(nodes, container, depth, query = "") {
    nodes.forEach((category) => {
      const matchesQuery = !query || categoryMatchesQuery(category, query);
      if (query && !matchesQuery) return;
      const expandForQuery = Boolean(query && category.children?.some((child) => categoryMatchesQuery(child, query)));
      if (!category.isDefault && depth > 0 && !query && !expandedCategories.has(category.parentId)) return;

      const isActiveCategory = selectedCategory === category.id || (favoritesOnly && isFavoriteCategoryId(category.id));
      const dragMode = activeTab === "image" ? "image" : activeTab === "dev" ? "dev" : "category";
      const canDragCategory = activeTab === "dev"
        ? !category.isDefault && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id)
        : !category.isDefault && !category.isSystem && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id);
      const row = document.createElement("div");
      row.className = `category-node ${isActiveCategory ? "is-active" : ""} ${canDragCategory ? "" : "is-locked"}`;
      row.style.setProperty("--depth", String(depth));
      row.dataset.categoryId = category.id;
      row.dataset.parentId = category.parentId || "";
      row.draggable = canDragCategory;
      row.addEventListener("dragstart", (event) => startCategoryDrag(event, category, dragMode));
      row.addEventListener("dragover", (event) => handleCategoryDragOver(event, category));
      row.addEventListener("dragleave", handleCategoryDragLeave);
      row.addEventListener("drop", (event) => handleCategoryDrop(event, category, dragMode));
      row.addEventListener("dragend", handleCategoryDragEnd);

      const dragHandle = canDragCategory ? document.createElement("button") : null;
      if (dragHandle) {
        dragHandle.type = "button";
        dragHandle.className = "category-drag-handle";
        dragHandle.textContent = "::";
        dragHandle.setAttribute("aria-label", t("categories.drag"));
        dragHandle.draggable = true;
        dragHandle.addEventListener("dragstart", (event) => startCategoryDrag(event, category, dragMode));
        dragHandle.addEventListener("dragend", handleCategoryDragEnd);
      }

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "category-toggle";
      toggle.textContent = category.children?.length ? (expandedCategories.has(category.id) || expandForQuery ? "v" : ">") : "";
      const displayName = categoryLabel(category);
      toggle.setAttribute("aria-label", category.children?.length ? t("categories.toggleNamed", { name: displayName }) : displayName);
      toggle.addEventListener("click", () => {
        if (!category.children?.length) return;
        if (expandedCategories.has(category.id)) expandedCategories.delete(category.id);
        else expandedCategories.add(category.id);
        scheduleManagerViewStateSave();
        renderCategories();
      });

      const button = categoryButton(category.id, categoryLabel(category), isActiveCategory);
      button.classList.add("category-name-button");
      if (!isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id)) {
        const label = button.querySelector("span:last-child") || button.firstChild;
        if (!category.parentId) {
          const dot = document.createElement("span");
          dot.className = "category-dot";
          button.prepend(dot);
        }
        const count = categoryCountNode(category.id);
        if (count) button.appendChild(count);
      }

      row.append(...[dragHandle, toggle, button].filter(Boolean));
      if (!isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id) && ((activeTab !== "dev" && !category.isDefault) || (activeTab === "dev" && category.parentId))) {
        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "category-edit-button";
        edit.title = t("common.edit");
        edit.setAttribute("aria-label", t("common.edit"));
        const editIcon = document.createElement("img");
        editIcon.src = chrome.runtime.getURL(`assets/icons/${themedIconName("edit.png")}`);
        editIcon.alt = "";
        editIcon.setAttribute("aria-hidden", "true");
        edit.appendChild(editIcon);
        edit.addEventListener("click", (event) => {
          event.stopPropagation();
          editCategory(category);
        });
        row.appendChild(edit);
      }
      if (depth === 0 && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id) && (activeTab === "dev" || !category.isDefault)) {
        const addSub = document.createElement("button");
        addSub.type = "button";
        addSub.className = "category-sub-button";
        addSub.textContent = "+";
        addSub.title = t("categories.createSubcategory");
        addSub.setAttribute("aria-label", t("categories.createSubcategory"));
        addSub.addEventListener("click", (event) => {
          event.stopPropagation();
          createSubcategory(category);
        });
        row.appendChild(addSub);
      }
      container.appendChild(row);

      if ((expandedCategories.has(category.id) || expandForQuery) && category.children?.length) {
        renderCategoryNodes(category.children, container, depth + 1, query);
      }
    });
  }

  function startCategoryDrag(event, category, mode) {
    if (!event?.dataTransfer || !category) return;
    if (isGeneralCategoryId(category.id)) return;
    if (isFavoriteCategoryId(category.id)) return;
    if (isTrashCategoryId(category.id)) return;
    if (mode !== "dev" && (category.isDefault || category.isSystem)) return;
    if (mode === "dev" && category.isDefault) return;
    categoryDragState = { id: category.id, parentId: category.parentId || null, mode };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", category.id);
    event.currentTarget.classList.add("is-dragging");
    setCategoryDragImage(event);
  }

  function handleCategoryDragOver(event, category = null) {
    if (itemDragState) {
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
      autoScrollCategoryPaneDuringDrag(event);
      markItemCategoryDropTarget(event.currentTarget);
      scheduleItemDragCategoryExpand(category);
      return;
    }
    if (!categoryDragState) return;
    if (isGeneralCategoryId(category?.id) || isFavoriteCategoryId(category?.id) || isTrashCategoryId(category?.id)) {
      clearAllCategoryDragMarkers();
      if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
      return;
    }
    event.preventDefault();
    markCategoryDropTarget(event.currentTarget, getDropPosition(event));
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  }

  function handleForbiddenItemCategoryDragOver(event) {
    if (!itemDragState) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
    clearAllCategoryDropTargets();
    event.currentTarget.classList.add("is-item-drop-forbidden");
  }

  function handleGlobalItemDragOver(event) {
    if (!itemDragState || customItemDrag?.active) return;
    const inCategoryPane = elements.categories.contains(event.target);
    if (inCategoryPane) {
      autoScrollCategoryPaneDuringDrag(event);
      const overCategory = event.target.closest("[data-category-id], [data-button-id]");
      if (!overCategory || !elements.categories.contains(overCategory)) {
        clearPendingItemDragExpansion();
        collapseAutoExpandedExcept("");
        clearAllCategoryDropTargets();
      }
      return;
    }
    clearPendingItemDragExpansion();
    collapseAutoExpandedExcept("");
    clearAllCategoryDropTargets();
  }

  function handleCategoryWheelDuringItemDrag(event) {
    if (!itemDragState) return;
    event.preventDefault();
    event.stopPropagation();
    elements.categories.scrollTop += event.deltaY;
    refreshCustomItemDragHover();
  }

  function handleDocumentWheelDuringItemDrag(event) {
    if (!itemDragState) return;
    const rect = elements.categories.getBoundingClientRect();
    const isInsideCategoryPane = event.clientX >= rect.left
      && event.clientX <= rect.right
      && event.clientY >= rect.top
      && event.clientY <= rect.bottom;
    if (!isInsideCategoryPane) return;
    event.preventDefault();
    event.stopPropagation();
    elements.categories.scrollTop += event.deltaY;
    refreshCustomItemDragHover();
  }

  function autoScrollCategoryPaneDuringDrag(event) {
    if (!itemDragState) return;
    const rect = elements.categories.getBoundingClientRect();
    const edge = 56;
    const maxStep = 28;
    if (event.clientY < rect.top + edge) {
      const ratio = Math.max(0, (rect.top + edge - event.clientY) / edge);
      elements.categories.scrollTop -= Math.ceil(maxStep * ratio);
    } else if (event.clientY > rect.bottom - edge) {
      const ratio = Math.max(0, (event.clientY - (rect.bottom - edge)) / edge);
      elements.categories.scrollTop += Math.ceil(maxStep * ratio);
    }
  }

  function handleCategoryDragLeave(event) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    clearCategoryDropMarkers(event.currentTarget);
    if (itemDragState && event.relatedTarget && !elements.categories.contains(event.relatedTarget)) {
      clearPendingItemDragExpansion();
      collapseAutoExpandedExcept("");
    }
  }

  async function handleCategoryDrop(event, targetCategory, mode) {
    event.preventDefault();
    if (itemDragState) {
      if (blockDemoAction(event)) return;
      clearCategoryDropMarkers(event.currentTarget);
      await dropItemOnCategory(targetCategory);
      return;
    }
    const dropPosition = event.currentTarget.dataset.dropPosition || getDropPosition(event);
    clearCategoryDropMarkers(event.currentTarget);
    if (isGeneralCategoryId(targetCategory?.id) || isFavoriteCategoryId(targetCategory?.id) || isTrashCategoryId(targetCategory?.id)) {
      categoryDragState = null;
      return;
    }
    if (!categoryDragState || categoryDragState.mode !== mode) {
      categoryDragState = null;
      return;
    }
    const sourceCategoryId = categoryDragState.id;
    const categories = mode === "image" ? state.imageCategories : mode === "dev" ? state.devCategories || [] : state.categories;
    const sourceCategory = categories.find((category) => category.id === sourceCategoryId);
    if (!sourceCategory || sourceCategory.id === targetCategory.id) {
      categoryDragState = null;
      return;
    }
    const parentId = targetCategory.parentId || null;
    if ((sourceCategory.parentId || null) !== parentId) {
      categoryDragState = null;
      return;
    }
    const siblings = categories
      .filter((category) => (category.parentId || null) === parentId)
      .sort((left, right) => (left.order || 0) - (right.order || 0) || categoryLabel(left).localeCompare(categoryLabel(right), state.settings.language || "en", { sensitivity: "base" }));
    const orderedIds = siblings.map((category) => category.id).filter((id) => id !== sourceCategory.id);
    const targetIndex = orderedIds.indexOf(targetCategory.id);
    const insertBefore = dropPosition === "before";
    orderedIds.splice(Math.max(0, targetIndex + (insertBefore ? 0 : 1)), 0, sourceCategory.id);
    try {
      if (mode === "image") await window.MCP.reorderImageCategories(parentId, orderedIds);
      else if (mode === "dev") await window.MCP.reorderDevCategories(parentId, orderedIds);
      else await window.MCP.reorderCategories(parentId, orderedIds);
      await loadState();
      if (!document.getElementById("managerClassifierModal")?.hidden) renderManagerCategoryChooser();
      showManagerToast(t("categories.reordered"));
    } catch (error) {
      showManagerToast(error?.message || t("common.error"));
    } finally {
      categoryDragState = null;
      clearAllCategoryDragMarkers();
    }
  }

  function handleCategoryDragEnd(event) {
    event.currentTarget.classList.remove("is-dragging");
    categoryDragState = null;
    clearAllCategoryDragMarkers();
  }

  function markItemCategoryDropTarget(node) {
    clearAllCategoryDropTargets();
    node.classList.add("is-item-drop-target");
  }

  function scheduleItemDragCategoryExpand(category) {
    const resolved = activeCategories().find((candidate) => candidate.id === category?.id);
    const root = rootCategoryFor(resolved);
    collapseAutoExpandedExcept(root?.id || "");
    if (!root || isFavoriteCategoryId(root.id) || isTrashCategoryId(root.id)) {
      clearPendingItemDragExpansion();
      return;
    }
    if (itemDragHoverRootId === root.id && itemDragExpandTimer) return;
    clearPendingItemDragExpansion();
    itemDragHoverRootId = root.id;
    if (expandedCategories.has(root.id)) return;
    const hasChildren = activeCategories().some((candidate) => candidate.parentId === root.id && !candidate.isHidden);
    if (!hasChildren) return;
    itemDragExpandTimer = window.setTimeout(() => {
      if (!itemDragState || itemDragHoverRootId !== root.id) return;
      expandedCategories.add(root.id);
      itemDragAutoExpanded.add(root.id);
      itemDragExpandTimer = null;
      renderCategories();
      requestAnimationFrame(() => {
        if (customItemDrag?.active) {
          processCustomItemDragHover(customItemDrag.lastX, customItemDrag.lastY);
          return;
        }
        const row = elements.categories.querySelector(`[data-category-id="${CSS.escape(root.id)}"]`);
        row?.classList.add("is-item-drop-target");
      });
    }, 1000);
  }

  async function dropItemOnCategory(category) {
    if (!itemDragState || !category) {
      clearItemDragState();
      return;
    }
    const item = getDraggedItem();
    if (!item) {
      clearItemDragState();
      return;
    }
    const path = translatedCategoryPath(category.id) || categoryLabel(category);
    try {
      if (isTrashCategoryId(category.id)) {
        if (!canUseTrashManagement()) {
          clearItemDragState();
          openManagerProUpgradeModal("trashManagement");
          showManagerToast(t("pro.trashRequired"));
          return;
        }
        await moveManagerItemToTrash(item, itemDragState.mediaType);
        return;
      }
      if (isVaultCategoryId(category.id)) {
        if (!canUseVault()) {
          clearItemDragState();
          openManagerProUpgradeModal("vault");
          showManagerToast(t("pro.vaultRequired"));
          return;
        }
        const unlocked = await ensureManagerVaultUnlocked();
        if (!unlocked) {
          clearItemDragState();
          return;
        }
      }
      if (isFavoriteCategoryId(category.id)) {
        if (itemDragState.mediaType === "image") await updateImage(item.id, { isFavorite: true });
        else if (itemDragState.mediaType === "dev") await updateDev(item.id, { isFavorite: true });
        else await updateItem(item.id, { isFavorite: true });
      } else {
        const updates = { categoryId: category.id, categoryName: category.name };
        if (itemDragState.mediaType === "image") {
          await updateImage(item.id, updates);
        } else if (itemDragState.mediaType === "dev") {
          const language = resolveDevLanguageCategory(category);
          await updateDev(item.id, Object.assign({}, updates, {
            languageId: language.id,
            languageName: language.name
          }));
        } else {
          await updateItem(item.id, updates);
        }
      }
      const keepRootId = rootCategoryFor(category)?.id || "";
      selectedCategory = isFavoriteCategoryId(category.id) ? "all" : category.id;
      favoritesOnly = isFavoriteCategoryId(category.id);
      selectedIndex = 0;
      if (category.parentId) expandedCategories.add(category.parentId);
      render();
      showManagerToast(isFavoriteCategoryId(category.id) ? t("common.favoriteAdd") : t("categories.classifiedIn", { path }));
    } catch (error) {
      showManagerToast(error?.message || t("common.error"));
    } finally {
      clearItemDragState({ keepExpandedRootId: category.parentId ? keepRootId : "" });
    }
  }

  async function moveManagerItemToTrash(item, mediaType = "text") {
    if (!item) return false;
    const versionCount = embeddedVersions(item).length;
    const hasEmbeddedVersionSet = mediaType !== "image" && versionCount > 1;
    const confirmed = await openManagerConfirmDialog({
      title: hasEmbeddedVersionSet ? t("versioning.deleteAllVersionsTitle") : t("common.delete"),
      message: hasEmbeddedVersionSet ? t("versioning.deleteAllVersionsTrashConfirm", { count: versionCount }) : t("editor.deleteConfirm"),
      confirmText: t("common.delete"),
      cancelText: t("common.cancel")
    });
    if (!confirmed) return false;
    if (mediaType === "image") {
      await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.DELETE_IMAGE_ITEM, itemId: item.id, permanent: false }).catch(() => {});
    } else if (mediaType === "dev") {
      await window.MCP.deleteDevItem(item.id, { permanent: false });
    } else {
      await window.MCP.deleteClipboardItem(item.id, { permanent: false });
    }
    await loadState();
    showManagerToast(t("trash.moved"));
    return true;
  }

  function rootCategoryFor(category) {
    if (!category) return null;
    const categories = activeCategories();
    let current = category;
    while (current?.parentId) {
      const parent = categories.find((candidate) => candidate.id === current.parentId);
      if (!parent) break;
      current = parent;
    }
    return current || category;
  }

  function collapseAutoExpandedExcept(rootId = "") {
    let changed = false;
    [...itemDragAutoExpanded].forEach((id) => {
      if (id === rootId) return;
      expandedCategories.delete(id);
      itemDragAutoExpanded.delete(id);
      changed = true;
    });
    if (changed) renderCategories();
  }

  function clearPendingItemDragExpansion() {
    clearTimeout(itemDragExpandTimer);
    itemDragExpandTimer = null;
    itemDragHoverRootId = "";
  }

  function getDraggedItem() {
    if (!itemDragState) return null;
    const source = itemDragState.mediaType === "image"
      ? state.imageItems
      : itemDragState.mediaType === "dev"
        ? state.devItems || []
        : state.items;
    return source.find((item) => item.id === itemDragState.itemId) || null;
  }

  function resolveDevLanguageCategory(category) {
    const categories = state.devCategories || [];
    let current = category;
    while (current?.parentId) {
      current = categories.find((candidate) => candidate.id === current.parentId);
    }
    return current || category;
  }

  function clearItemDragState(options = {}) {
    itemDragState = null;
    clearPendingItemDragExpansion();
    const keepExpandedRootId = options.keepExpandedRootId || "";
    [...itemDragAutoExpanded].forEach((id) => {
      if (id !== keepExpandedRootId) expandedCategories.delete(id);
      itemDragAutoExpanded.delete(id);
    });
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
    node.classList.remove("is-drop-target", "is-drop-before", "is-drop-after", "is-item-drop-target", "is-item-drop-forbidden");
    delete node.dataset.dropPosition;
  }

  function clearAllCategoryDropTargets() {
    document.querySelectorAll(".is-drop-target, .is-drop-before, .is-drop-after, .is-item-drop-target, .is-item-drop-forbidden").forEach(clearCategoryDropMarkers);
  }

  function clearAllCategoryDragMarkers() {
    document.querySelectorAll(".is-dragging").forEach((node) => node.classList.remove("is-dragging"));
    clearAllCategoryDropTargets();
  }

  function setCategoryDragImage(event) {
    const source = event.currentTarget.closest(".category-node, .manager-category-row, .manager-category-choice") || event.currentTarget;
    const clone = source.cloneNode(true);
    clone.classList.add("category-drag-preview");
    clone.style.width = `${source.getBoundingClientRect().width}px`;
    clone.style.position = "fixed";
    clone.style.top = "-1000px";
    clone.style.left = "-1000px";
    clone.style.pointerEvents = "none";
    document.body.appendChild(clone);
    event.dataTransfer.setDragImage(clone, Math.min(28, clone.offsetWidth / 2), Math.min(24, clone.offsetHeight / 2));
    window.setTimeout(() => clone.remove(), 0);
  }

  function categoryMatchesQuery(category, query) {
    const ownMatch = window.MCP.normalizeContent([categoryLabel(category), category.name, ...(category.keywords || [])].join(" ")).includes(query);
    return ownMatch || (category.children || []).some((child) => categoryMatchesQuery(child, query));
  }

  function categoryLabel(category) {
    return window.MCP.translateCategoryName(category, state.settings.language || "en");
  }

  function activeCategories() {
    return activeTab === "image" ? state.imageCategories : activeTab === "dev" ? state.devCategories || [] : state.categories;
  }

  function activeItems() {
    return activeTab === "image" ? state.imageItems : activeTab === "dev" ? state.devItems || [] : state.items;
  }

  function countMapFor(mediaType = activeTab) {
    if (renderCountMaps.has(mediaType)) return renderCountMaps.get(mediaType);
    const categories = mediaType === "image" ? state.imageCategories : mediaType === "dev" ? state.devCategories || [] : state.categories;
    const items = mediaType === "image" ? state.imageItems : mediaType === "dev" ? state.devItems || [] : state.items;
    const map = window.MCP.createCategoryItemCountMap(categories, items);
    renderCountMaps.set(mediaType, map);
    return map;
  }

  function categoryCountNode(categoryId, mediaType = activeTab) {
    const count = countMapFor(mediaType).get(categoryId) || 0;
    if (count <= 0) return null;
    const span = document.createElement("span");
    span.className = "category-count";
    span.textContent = `(${count})`;
    return span;
  }

  function totalCountNode(mediaType = activeTab) {
    const total = (mediaType === "image" ? state.imageItems : mediaType === "dev" ? state.devItems || [] : state.items || [])
      .filter((item) => !isTrashCategoryId(item.categoryId) && !isVaultCategoryId(item.categoryId) && !isVaultCategoryId(item.languageId)).length;
    if (total <= 0) return null;
    const span = document.createElement("span");
    span.className = "category-count";
    span.textContent = `(${total})`;
    return span;
  }

  function activeCategoryTree() {
    return buildTreeFromCategories(activeCategories());
  }

  function setActiveTab(nextTab) {
    if (activeTab === nextTab) return;
    rememberCurrentManagerScrollPositions(activeTab);
    resetManagerBulkSelection();
    activeTab = nextTab;
    selectedCategory = "all";
    favoritesOnly = false;
    selectedIndex = 0;
    preparePendingManagerScrollPositions(activeTab);
    render();
  }

  function translatedCategoryPath(categoryId) {
    if (!categoryId) return "";
    const cacheKey = `${activeTab}:${state.settings.language || "en"}`;
    if (!categoryPathCache || categoryPathCache.key !== cacheKey) {
      const categories = activeCategories();
      const byId = new Map(categories.map((category) => [category.id, category]));
      const paths = new Map();
      categories.forEach((category) => {
        const parts = [categoryLabel(category)];
        let parent = byId.get(category.parentId);
        while (parent) {
          parts.unshift(categoryLabel(parent));
          parent = byId.get(parent.parentId);
        }
        paths.set(category.id, parts.join(" > "));
      });
      categoryPathCache = { key: cacheKey, paths };
    }
    return categoryPathCache.paths.get(categoryId) || "";
  }

  function renderStatus() {
    elements.status.hidden = true;
    elements.status.textContent = "";
  }

  function renderItems() {
    cancelItemRenderJob();
    const query = elements.search.value;
    ensureValidSelectedCategory();
    elements.items.classList.remove("is-text-list-view", "is-text-card-view", "is-dev-card-view");
    if (activeTab === "image") {
      renderImageItems(query);
      return;
    }
    elements.items.classList.add(isTextCardView(activeTab) ? "is-text-card-view" : "is-text-list-view");
    if (activeTab === "dev" && isTextCardView(activeTab)) elements.items.classList.add("is-dev-card-view");
    let items = filterManagerTextItems(activeTab === "dev" ? state.devItems || [] : state.items, query, activeTab);
    applySearchVersionFocus(items, query, activeTab);
    if (!isTrashSelected()) items = items.filter((item) => !isTrashCategoryId(item.categoryId));
    if (!isVaultSelected()) items = items.filter((item) => !isVaultCategoryId(item.categoryId) && !isVaultCategoryId(item.languageId));
    if (selectedCategory !== "all") {
      const categoryIds = collectCategoryIds(selectedCategory);
      items = items.filter((item) => categoryIds.has(item.categoryId));
    }
    if (favoritesOnly) {
      items = items.filter((item) => item.isFavorite);
    }
    setCurrentViewItems(items);

    elements.items.replaceChildren();
    renderCurrentViewTitleSlot();
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      renderManagerEmptyState(empty, query ? t("search.noResults") : isTrashSelected() ? t("trash.empty") : managerEmptyMessage(activeTab));
      elements.items.appendChild(empty);
      return;
    }

    selectedIndex = Math.min(selectedIndex, items.length - 1);
    renderTextItemsProgressively(items, activeTab);
  }

  function renderTextItemsProgressively(items, mediaType) {
    const total = items.length;
    if (total > ITEM_RENDER_LARGE_LIST_THRESHOLD) {
      renderVirtualTextItems(items, mediaType);
      return;
    }
    if (total <= ITEM_RENDER_LARGE_LIST_THRESHOLD) {
      const fragment = document.createDocumentFragment();
      items.forEach((item, index) => {
        try {
          fragment.appendChild(renderItem(item, index, mediaType));
        } catch (error) {
          console.warn("Ultimate Clipboard Pro item render failed", error);
        }
      });
      elements.items.appendChild(fragment);
      return;
    }

    const job = {
      cancelled: false,
      index: 0,
      total,
      items,
      mediaType,
      loader: renderListLoadingNode(total)
    };
    itemRenderJob = job;
    elements.items.appendChild(job.loader);

    const renderChunk = (deadline = null) => {
      if (job.cancelled || itemRenderJob !== job) return;
      const fragment = document.createDocumentFragment();
      const start = job.index;
      const hardLimit = Math.min(job.total, start + renderChunkSizeForMediaType(job.mediaType));
      while (job.index < hardLimit) {
        try {
          fragment.appendChild(renderItem(job.items[job.index], job.index, job.mediaType));
        } catch (error) {
          console.warn("Ultimate Clipboard Pro item render failed", error);
        }
        job.index += 1;
        if (deadline?.timeRemaining && deadline.timeRemaining() < 4 && job.index - start >= 12) break;
      }
      elements.items.insertBefore(fragment, job.loader);
      updateListLoadingNode(job.loader, job.index, job.total);
      if (job.index < job.total) {
        scheduleItemRenderChunk(renderChunk);
        return;
      }
      job.loader.remove();
      if (itemRenderJob === job) itemRenderJob = null;
    };

    renderChunk();
  }

  function scheduleItemRenderChunk(callback) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 120 });
      return;
    }
    window.setTimeout(() => callback(), 16);
  }

  function renderChunkSizeForMediaType(mediaType) {
    return mediaType === "image" ? IMAGE_RENDER_CHUNK_SIZE : ITEM_RENDER_CHUNK_SIZE;
  }

  function cancelItemRenderJob() {
    previewOverflowQueue.clear();
    virtualItemsState = null;
    if (!itemRenderJob) return;
    itemRenderJob.cancelled = true;
    itemRenderJob.loader?.remove();
    itemRenderJob = null;
  }

  function renderListLoadingNode(total, mediaType = "text") {
    const node = document.createElement("div");
    node.className = `items-progressive-loader is-${mediaType}`;
    node.setAttribute("aria-live", "polite");
    updateListLoadingNode(node, 0, total);
    return node;
  }

  function updateListLoadingNode(node, rendered, total) {
    if (!node) return;
    const percent = Math.min(100, Math.round((rendered / Math.max(1, total)) * 100));
    node.style.setProperty("--progress", `${percent}%`);
    node.textContent = `${rendered} / ${total}`;
  }

  function renderVirtualTextItems(items, mediaType) {
    const canvas = document.createElement("div");
    canvas.className = `virtual-list-canvas ${isTextCardView(mediaType) ? "is-card-view" : "is-list-view"}`;
    const slice = document.createElement("div");
    slice.className = `virtual-list-slice ${isTextCardView(mediaType) ? "is-card-view" : "is-list-view"}`;
    const itemHeight = virtualTextItemHeight(items, mediaType);
    slice.style.setProperty("--virtual-text-item-height", `${itemHeight}px`);
    canvas.appendChild(slice);
    elements.items.replaceChildren(canvas);
    virtualItemsState = {
      type: "text",
      mediaType,
      items,
      container: elements.items,
      canvas,
      slice,
      itemHeight,
      start: -1,
      end: -1,
      raf: 0
    };
    updateVirtualItemsWindow(true);
  }

  function virtualTextItemHeight(items = [], mediaType = activeTab) {
    return isTextCardView(mediaType) ? 560 : VIRTUAL_TEXT_ITEM_HEIGHT;
  }

  function renderVirtualImageItems(images, gallery) {
    const canvas = document.createElement("div");
    canvas.className = "virtual-gallery-canvas";
    const slice = document.createElement("div");
    slice.className = `virtual-gallery-slice is-${imageViewMode}`;
    canvas.appendChild(slice);
    gallery.replaceChildren(canvas);
    virtualItemsState = {
      type: "image",
      mediaType: "image",
      items: images,
      container: elements.items,
      gallery,
      canvas,
      slice,
      itemHeight: VIRTUAL_IMAGE_ROW_HEIGHT,
      start: -1,
      end: -1,
      raf: 0
    };
    updateVirtualItemsWindow(true);
  }

  function handleVirtualItemsScroll() {
    if (!virtualItemsState) return;
    if (virtualItemsState.raf) return;
    virtualItemsState.raf = requestAnimationFrame(() => {
      if (!virtualItemsState) return;
      virtualItemsState.raf = 0;
      updateVirtualItemsWindow(false);
    });
  }

  function updateVirtualItemsWindow(force = false) {
    const stateRef = virtualItemsState;
    if (!stateRef?.container?.isConnected) return;
    if (stateRef.type === "image") updateVirtualImageWindow(stateRef, force);
    else updateVirtualTextWindow(stateRef, force);
  }

  function updateVirtualTextWindow(stateRef, force = false) {
    const total = stateRef.items.length;
    const columns = textVirtualColumnCount(stateRef.mediaType);
    stateRef.itemHeight = virtualTextItemHeight(stateRef.items, stateRef.mediaType);
    const totalRows = Math.ceil(total / columns);
    const viewportHeight = Math.max(1, stateRef.container.clientHeight || 1);
    const scrollTop = Math.max(0, stateRef.container.scrollTop || 0);
    const visibleRows = Math.ceil(viewportHeight / stateRef.itemHeight);
    const startRow = Math.max(0, Math.floor(scrollTop / stateRef.itemHeight) - VIRTUAL_OVERSCAN);
    const endRow = Math.min(totalRows, startRow + visibleRows + VIRTUAL_OVERSCAN * 2);
    const start = startRow * columns;
    const end = Math.min(total, endRow * columns);
    if (!force && start === stateRef.start && end === stateRef.end) return;
    stateRef.start = start;
    stateRef.end = end;
    stateRef.canvas.style.height = `${totalRows * stateRef.itemHeight}px`;
    stateRef.slice.className = `virtual-list-slice ${isTextCardView(stateRef.mediaType) ? "is-card-view" : "is-list-view"}`;
    stateRef.slice.style.setProperty("--virtual-text-item-height", `${stateRef.itemHeight}px`);
    stateRef.slice.style.transform = `translate3d(0, ${startRow * stateRef.itemHeight}px, 0)`;
    const fragment = document.createDocumentFragment();
    for (let index = start; index < end; index += 1) {
      try {
        fragment.appendChild(renderItem(stateRef.items[index], index, stateRef.mediaType));
      } catch (error) {
        console.warn("Ultimate Clipboard Pro virtual item render failed", error);
      }
    }
    stateRef.slice.replaceChildren(fragment);
  }

  function textVirtualColumnCount(mediaType = activeTab) {
    return isTextCardView(mediaType) ? 2 : 1;
  }

  function updateVirtualImageWindow(stateRef, force = false) {
    const total = stateRef.items.length;
    const columns = imageVirtualColumnCount();
    stateRef.itemHeight = imageVirtualRowHeight(columns);
    const totalRows = Math.ceil(total / columns);
    const viewportHeight = Math.max(1, stateRef.container.clientHeight || 1);
    const scrollTop = Math.max(0, stateRef.container.scrollTop || 0);
    const visibleRows = Math.ceil(viewportHeight / stateRef.itemHeight);
    const startRow = Math.max(0, Math.floor(scrollTop / stateRef.itemHeight) - VIRTUAL_IMAGE_OVERSCAN_ROWS);
    const endRow = Math.min(totalRows, startRow + visibleRows + VIRTUAL_IMAGE_OVERSCAN_ROWS * 2);
    const start = startRow * columns;
    const end = Math.min(total, endRow * columns);
    if (!force && start === stateRef.start && end === stateRef.end) return;
    stateRef.start = start;
    stateRef.end = end;
    stateRef.canvas.style.height = `${totalRows * stateRef.itemHeight}px`;
    stateRef.slice.className = `virtual-gallery-slice is-${imageViewMode}`;
    stateRef.slice.style.transform = `translate3d(0, ${startRow * stateRef.itemHeight}px, 0)`;
    const fragment = document.createDocumentFragment();
    for (let index = start; index < end; index += 1) {
      try {
        fragment.appendChild(renderImageItem(stateRef.items[index]));
      } catch (error) {
        console.warn("Ultimate Clipboard Pro virtual image render failed", error);
      }
    }
    stateRef.slice.replaceChildren(fragment);
  }

  function imageVirtualColumnCount() {
    if (imageViewMode === "small") return 4;
    if (imageViewMode === "large") return 2;
    return 3;
  }

  function imageVirtualRowHeight(columns = imageVirtualColumnCount()) {
    const gap = 18;
    const width = Math.max(320, virtualItemsState?.gallery?.clientWidth || elements.items.clientWidth || 900);
    const cardWidth = Math.max(180, (width - gap * Math.max(0, columns - 1)) / Math.max(1, columns));
    const imageHeight = cardWidth * 9 / 16;
    return Math.ceil(imageHeight + 118 + gap);
  }

  function scrollVirtualItemsToItem(itemId, mediaType = activeTab) {
    if (!virtualItemsState || virtualItemsState.mediaType !== mediaType) return false;
    const index = virtualItemsState.items.findIndex((item) => item.id === itemId);
    if (index < 0) return false;
    const rowIndex = virtualItemsState.type === "image"
      ? Math.floor(index / imageVirtualColumnCount())
      : Math.floor(index / textVirtualColumnCount(mediaType));
    const targetTop = Math.max(0, rowIndex * virtualItemsState.itemHeight - (virtualItemsState.container.clientHeight || 0) / 2);
    virtualItemsState.container.scrollTo({ top: targetTop, behavior: "auto" });
    updateVirtualItemsWindow(true);
    return true;
  }

  function renderImageItems(query) {
    cancelItemRenderJob();
    let images = filterImages(state.imageItems, query);
    if (!isTrashSelected()) images = images.filter((item) => !isTrashCategoryId(item.categoryId));
    if (!isVaultSelected()) images = images.filter((item) => !isVaultCategoryId(item.categoryId) && !isVaultCategoryId(item.languageId));
    if (selectedCategory !== "all") {
      const categoryIds = collectCategoryIds(selectedCategory);
      images = images.filter((item) => categoryIds.has(item.categoryId));
    }
    if (favoritesOnly) images = images.filter((item) => item.isFavorite);
    setCurrentViewItems(images);
    elements.items.replaceChildren();
    renderCurrentViewTitleSlot();
    if (!images.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      renderManagerEmptyState(empty, query ? t("search.noResults") : isTrashSelected() ? t("trash.empty") : managerEmptyMessage("image"));
      elements.items.appendChild(empty);
      return;
    }
    const gallery = document.createElement("div");
    gallery.className = `image-gallery is-${imageViewMode}`;
    elements.items.appendChild(gallery);
    renderImageItemsProgressively(images, gallery);
  }

  function managerCaptureShortcutLabel() {
    return window.MCP?.shortcutLabel
      ? window.MCP.shortcutLabel(state.settings?.textCaptureShortcut || "ctrl_alt_c")
      : "Ctrl + Alt + C";
  }

  function managerEmptyMessage(mediaType = "text") {
    const shortcut = managerCaptureShortcutLabel();
    if (mediaType === "dev") return t("dev.emptyFloatingHint", { shortcut });
    if (mediaType === "image") return t("images.emptyFloatingHint");
    return t("clipboard.emptyFloatingHint", { shortcut });
  }

  function renderManagerEmptyState(node, message = "") {
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
      if (index > 0) line.className = "empty-state-help";
      return line;
    }));
  }

  function renderImageItemsProgressively(images, gallery) {
    const total = images.length;
    if (total > IMAGE_RENDER_LARGE_LIST_THRESHOLD) {
      renderVirtualImageItems(images, gallery);
      return;
    }
    if (total <= IMAGE_RENDER_LARGE_LIST_THRESHOLD) {
      const fragment = document.createDocumentFragment();
      images.forEach((item) => {
        try {
          fragment.appendChild(renderImageItem(item));
        } catch (error) {
          console.warn("Ultimate Clipboard Pro image render failed", error);
        }
      });
      gallery.appendChild(fragment);
      return;
    }

    const job = {
      cancelled: false,
      index: 0,
      total,
      items: images,
      mediaType: "image",
      target: gallery,
      loader: renderListLoadingNode(total, "image")
    };
    itemRenderJob = job;
    elements.items.appendChild(job.loader);

    const renderChunk = (deadline = null) => {
      if (job.cancelled || itemRenderJob !== job || !job.target.isConnected) return;
      const fragment = document.createDocumentFragment();
      const start = job.index;
      const hardLimit = Math.min(job.total, start + IMAGE_RENDER_CHUNK_SIZE);
      while (job.index < hardLimit) {
        try {
          fragment.appendChild(renderImageItem(job.items[job.index]));
        } catch (error) {
          console.warn("Ultimate Clipboard Pro image render failed", error);
        }
        job.index += 1;
        if (deadline?.timeRemaining && deadline.timeRemaining() < 5 && job.index - start >= 8) break;
      }
      job.target.appendChild(fragment);
      updateListLoadingNode(job.loader, job.index, job.total);
      if (job.index < job.total) {
        scheduleItemRenderChunk(renderChunk);
        return;
      }
      job.loader.remove();
      if (itemRenderJob === job) itemRenderJob = null;
    };

    renderChunk();
  }

  function ensureValidSelectedCategory() {
    if (selectedCategory === "all" || selectedCategory === "favorites") return;
    if (activeCategories().some((category) => category.id === selectedCategory)) return;
    selectedCategory = "all";
    favoritesOnly = false;
  }

  function collectCategoryIds(categoryId) {
    const ids = new Set([categoryId]);
    const collect = (parentId) => {
      activeCategories()
        .filter((category) => category.parentId === parentId)
        .forEach((category) => {
          ids.add(category.id);
          collect(category.id);
        });
    };
    collect(categoryId);
    return ids;
  }

  function renderItem(item, index, mediaType = "text") {
    const inTrash = isTrashCategoryId(item.categoryId);
    const article = document.createElement("article");
    article.className = `item-card ${isTextCardView(mediaType) ? "is-card-layout" : "is-list-layout"} ${index === selectedIndex ? "is-selected" : ""} ${item.isPinned ? "is-pinned" : ""} ${isManagerBulkSelected(item.id) ? "is-bulk-selected" : ""} ${isManagerBulkSelectionMode(mediaType) ? "is-bulk-mode" : ""}`;
    article.draggable = false;
    article.dataset.itemId = item.id;
    article.dataset.mediaType = mediaType;
    if (!inTrash && !isManagerBulkSelectionMode(mediaType)) article.addEventListener("pointerdown", (event) => prepareItemPointerDrag(event, item, mediaType));
    const bulkCheckbox = renderManagerBulkCheckbox(item);
    const displayItem = itemDisplayVersion(item, mediaType);
    article.dataset.activeVersionId = displayItem?.activeVersionId || "";
    const resolveDisplayItem = () => itemDisplayVersionById(item, mediaType, article.dataset.activeVersionId || "");
    const inlineTitleField = renderEmbeddedTitleField(item, mediaType);
    const versionTabs = renderEmbeddedVersionTabs(item, mediaType);
    if (versionTabs) article.classList.add("has-version-tabs");
    const sourceVersionActive = isEmbeddedSourceVersionActive(item, mediaType);

    const preview = document.createElement("div");
    preview.className = "item-preview";
    const previewText = document.createElement("div");
    previewText.className = "item-preview-text";
    previewText.textContent = fullTextForPreview(displayItem);
    preview.appendChild(previewText);

    const meta = document.createElement("div");
    meta.className = "item-meta";
    [
      item.isFavorite ? `\u2605 ${t("categories.favorites")}` : null,
      translatedCategoryPath(item.categoryId) || item.categoryName || t("categories.general"),
      mediaType === "dev" ? item.languageName : null
    ].filter(Boolean).forEach((value) => {
      const span = document.createElement("span");
      span.textContent = value;
      meta.appendChild(span);
    });
    appendSourceMeta(meta, item);
    const dateMeta = document.createElement("span");
    dateMeta.textContent = window.MCP.formatLocalizedDate(displayItem.createdAt || item.createdAt, state.settings.language || "en");
    meta.appendChild(dateMeta);

    const actions = document.createElement("div");
    actions.className = "item-actions";
    actions.append(actionButton(t("common.useCapture"), "primary use-capture-action", () => copyItem(resolveDisplayItem(), mediaType, article)));
    if (sourceVersionActive) {
      actions.append(
        actionButton(t("categories.classify"), "", () => mediaType === "dev" ? classifyDev(item) : classifyText(item)),
        actionButton(t("source.open"), "icon-only", () => openSource(item), "reverse.png")
      );
    }
    if (!inTrash && (mediaType === "text" || mediaType === "dev")) {
      actions.append(actionButton(t("versioning.addButtonLabel"), "version-create-action", () => openCreateVersionModal(item, mediaType, article.dataset.activeVersionId || "")));
    }

    const quickActions = document.createElement("div");
    quickActions.className = "item-quick-actions";
    if (inTrash) {
      quickActions.append(
        actionButton(t("trash.restore"), "restore-action", () => restoreItem(item, mediaType)),
        actionButton(t("trash.permanentDelete"), "icon-only", () => mediaType === "dev" ? deleteDev(item.id, true) : deleteItem(item.id, true), "erase.png")
      );
    } else {
      quickActions.append(
        actionButton(t("common.edit"), "icon-only", () => editItem(item), "edit.png")
      );
      if (sourceVersionActive) {
        quickActions.append(
          actionButton(item.isFavorite ? t("common.favoriteRemove") : t("common.favoriteAdd"), item.isFavorite ? "is-active icon-only" : "icon-only", async () => {
          if (mediaType === "dev") await updateDev(item.id, { isFavorite: !item.isFavorite });
          else await updateItem(item.id, { isFavorite: !item.isFavorite });
          showManagerToast(t(item.isFavorite ? "common.favoriteRemove" : "common.favoriteAdd"));
          render();
          }, item.isFavorite ? "favorited.png" : "not_yet_favorited.png"),
          actionButton(item.isPinned ? t("common.unpin") : t("common.pin"), item.isPinned ? "is-active icon-only" : "icon-only", async () => {
          if (mediaType === "dev") await updateDev(item.id, { isPinned: !item.isPinned });
          else await updateItem(item.id, { isPinned: !item.isPinned });
          showManagerToast(t(item.isPinned ? "common.unpin" : "common.pin"));
          render();
          }, item.isPinned ? "go_unpin.png" : "go_pin.png")
        );
      }
      quickActions.append(actionButton(t("common.delete"), "icon-only", () => mediaType === "dev" ? deleteDev(item.id) : deleteItem(item.id), "erase.png"));
    }

    article.append(...[bulkCheckbox, inlineTitleField, versionTabs, preview, meta, actions, quickActions].filter(Boolean));
    article.addEventListener("click", (event) => handleManagerReadyPasteCardClick(event, item, mediaType, article));
    schedulePreviewOverflowCheck(preview, previewText);
    article.addEventListener("mouseenter", () => startPreviewAutoScroll(preview, previewText));
    article.addEventListener("mouseleave", () => stopPreviewAutoScroll(preview));
    article.addEventListener("focusin", () => startPreviewAutoScroll(preview, previewText));
    article.addEventListener("focusout", () => stopPreviewAutoScroll(preview));
    return article;
  }

  function fullTextForPreview(item) {
    const content = String(item?.content || "");
    return content.trim() ? content : String(item?.preview || "").replace(/(?:\u2026|\.{3})\s*$/, "").trimEnd();
  }

  function startPreviewAutoScroll(container, inner) {
    if (!container || !inner) return;
    stopPreviewAutoScroll(container, false);
    const maxScroll = Math.max(0, Math.ceil((inner.getBoundingClientRect?.().height || inner.scrollHeight || inner.offsetHeight || 0) - container.clientHeight));
    container.classList.toggle("is-scrollable", maxScroll > 4);
    if (maxScroll <= 4) return;
    container.classList.add("is-auto-scrolling");
    inner.style.setProperty("transform", "translateY(0)", "important");
    let direction = 1;
    let lastFrame = performance.now();
    let holdUntil = lastFrame + 160;
    const downSpeed = Math.min(110, Math.max(48, maxScroll / 3.8));
    const upSpeed = Math.min(190, Math.max(82, maxScroll / 2.1));
    let offset = 0;
    const step = (now) => {
      const state = previewScrollAnimations.get(container);
      if (!state) return;
      if (now < holdUntil) {
        state.raf = requestAnimationFrame(step);
        return;
      }
      const delta = Math.min(48, now - lastFrame);
      lastFrame = now;
      offset += direction * (direction > 0 ? downSpeed : upSpeed) * (delta / 1000);
      offset = Math.max(0, Math.min(maxScroll, offset));
      inner.style.setProperty("transform", `translateY(-${offset}px)`, "important");
      if (direction > 0 && offset >= maxScroll - 1) {
        offset = maxScroll;
        inner.style.setProperty("transform", `translateY(-${maxScroll}px)`, "important");
        direction = -1;
        holdUntil = now + 300;
      } else if (direction < 0 && offset <= 1) {
        offset = 0;
        inner.style.setProperty("transform", "translateY(0)", "important");
        direction = 1;
        holdUntil = now + 220;
      }
      state.raf = requestAnimationFrame(step);
    };
    previewScrollAnimations.set(container, { raf: requestAnimationFrame(step) });
  }

  function stopPreviewAutoScroll(container, reset = true) {
    const state = previewScrollAnimations.get(container);
    if (state?.raf) cancelAnimationFrame(state.raf);
    previewScrollAnimations.delete(container);
    container?.classList.remove("is-auto-scrolling");
    if (reset) container?.querySelector(".item-preview-text")?.style?.removeProperty("transform");
  }

  function schedulePreviewOverflowCheck(container, inner) {
    if (!container || !inner) return;
    previewOverflowQueue.add({ container, inner });
    if (!previewOverflowRaf) {
      previewOverflowRaf = requestAnimationFrame(flushPreviewOverflowChecks);
    }
    clearTimeout(previewOverflowTimer);
    previewOverflowTimer = window.setTimeout(flushPreviewOverflowChecks, 180);
  }

  function flushPreviewOverflowChecks() {
    if (previewOverflowRaf) {
      cancelAnimationFrame(previewOverflowRaf);
      previewOverflowRaf = 0;
    }
    if (previewOverflowTimer) {
      clearTimeout(previewOverflowTimer);
      previewOverflowTimer = 0;
    }
    const entries = [...previewOverflowQueue];
    previewOverflowQueue.clear();
    entries.forEach(({ container, inner }) => {
      if (!container.isConnected || !inner.isConnected) return;
      updatePreviewOverflowState(container, inner);
    });
  }

  function updatePreviewOverflowState(container, inner) {
    if (!container || !inner) return;
    const innerHeight = Math.ceil(inner.getBoundingClientRect?.().height || inner.scrollHeight || inner.offsetHeight || 0);
    const visibleHeight = Math.ceil(container.clientHeight || 0);
    container.classList.toggle("is-scrollable", innerHeight - visibleHeight > 4);
  }

  function prepareItemPointerDrag(event, item, mediaType) {
    if (blockDemoAction(event)) return;
    if (event.button !== 0 || event.target.closest("button, input, textarea, select, a")) return;
    event.preventDefault();
    window.getSelection?.()?.removeAllRanges?.();
    if (customItemDrag) {
      cleanupCustomItemPointerDrag();
      clearItemDragState();
    }
    customItemDrag = {
      item,
      mediaType,
      source: event.currentTarget,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      active: false,
      currentCategoryId: "",
      pointerId: Number.isFinite(event.pointerId) ? event.pointerId : null,
      ghost: null
    };
    customItemDrag.source.style.userSelect = "none";
    try {
      if (Number.isFinite(event.pointerId) && customItemDrag.source.setPointerCapture) {
        customItemDrag.source.setPointerCapture(event.pointerId);
      }
    } catch (_) {}
    document.addEventListener("pointermove", handleCustomItemPointerMove, true);
    document.addEventListener("pointerup", handleCustomItemPointerUp, true);
    document.addEventListener("pointercancel", handleCustomItemPointerCancel, true);
    window.addEventListener("pointermove", handleCustomItemPointerMove, true);
    window.addEventListener("pointerup", handleCustomItemPointerUp, true);
    window.addEventListener("pointercancel", handleCustomItemPointerCancel, true);
  }

  function isCustomItemDragPointer(event) {
    if (!customItemDrag) return false;
    return customItemDrag.pointerId === null || !Number.isFinite(event.pointerId) || event.pointerId === customItemDrag.pointerId;
  }

  function handleCustomItemPointerMove(event) {
    if (!isCustomItemDragPointer(event)) return;
    customItemDrag.lastX = event.clientX;
    customItemDrag.lastY = event.clientY;
    const moved = Math.hypot(event.clientX - customItemDrag.startX, event.clientY - customItemDrag.startY);
    if (!customItemDrag.active) {
      if (moved < 7) return;
      startCustomItemDrag(event);
    }
    event.preventDefault();
    moveCustomItemGhost(event.clientX, event.clientY);
    autoScrollCategoryPaneDuringDrag(event);
    processCustomItemDragHover(event.clientX, event.clientY);
  }

  async function handleCustomItemPointerUp(event) {
    if (!isCustomItemDragPointer(event)) return;
    event.preventDefault();
    event.stopPropagation();
    const dragWasActive = customItemDrag.active;
    const source = customItemDrag.source;
    const item = customItemDrag.item;
    const mediaType = customItemDrag.mediaType;
    const targetCategory = customItemDrag.active && customItemDrag.currentCategoryId
      ? activeCategories().find((category) => category.id === customItemDrag.currentCategoryId)
      : null;
    if (dragWasActive) suppressManagerReadyPasteClickUntil = Date.now() + 900;
    cleanupCustomItemPointerDrag();
    if (targetCategory) {
      await dropItemOnCategory(targetCategory);
    } else {
      clearItemDragState();
      if (!dragWasActive && source?.isConnected && !isManagerBulkSelectionMode(mediaType)) {
        suppressManagerReadyPasteClickUntil = Date.now() + 360;
        if (mediaType === "image") copyImage(item, source);
        else copyItem(itemDisplayVersionById(item, mediaType, source.dataset.activeVersionId || ""), mediaType, source);
      }
    }
  }

  function handleCustomItemPointerCancel(event) {
    if (!isCustomItemDragPointer(event)) return;
    if (customItemDrag.active) suppressManagerReadyPasteClickUntil = Date.now() + 900;
    cleanupCustomItemPointerDrag();
    clearItemDragState();
  }

  function startCustomItemDrag(event) {
    if (!customItemDrag) return;
    window.getSelection?.()?.removeAllRanges?.();
    itemDragState = { itemId: customItemDrag.item.id, mediaType: customItemDrag.mediaType };
    customItemDrag.active = true;
    document.documentElement.classList.add("is-custom-item-dragging");
    customItemDrag.source.classList.add("is-item-dragging");
    customItemDrag.ghost = createCustomItemDragGhost(customItemDrag.source, customItemDrag.mediaType);
    moveCustomItemGhost(event.clientX, event.clientY);
  }

  function createCustomItemDragGhost(source, mediaType) {
    const item = customItemDrag?.item;
    const versions = mediaType === "image" ? [] : embeddedVersions(item);
    const hasMultipleVersions = versions.length > 1;
    const displayItem = hasMultipleVersions ? itemDisplayVersionById(item, mediaType, versions[0]?.id || "") : itemDisplayVersion(item, mediaType);
    const titleText = (displayItem?.title || item?.title || item?.sourceTitle || item?.sourceDomain || "").trim();
    const ghost = document.createElement("div");
    ghost.className = `item-drag-preview item-drag-preview-card is-${mediaType}`;
    if (hasMultipleVersions) ghost.classList.add("is-versioned");
    ghost.dataset.mediaType = mediaType;
    ghost.style.setProperty("--item-drag-accent", state.settings?.accentColor || "#e50914");

    const header = document.createElement("div");
    header.className = "item-drag-preview-head";

    const badge = document.createElement("span");
    badge.className = "item-drag-preview-badge";
    badge.textContent = mediaType === "image" ? t("images.tab") : mediaType === "dev" ? t("tabs.dev") : t("tabs.text");
    header.appendChild(badge);

    const title = document.createElement("strong");
    title.className = "item-drag-preview-title";
    title.textContent = titleText || (mediaType === "image" ? t("images.image") : t("versioning.sourceCapture"));
    header.appendChild(title);

    if (hasMultipleVersions) {
      const versionBadge = document.createElement("span");
      versionBadge.className = "item-drag-preview-badge item-drag-preview-version-badge";
      versionBadge.textContent = t("versioning.versionCount", { count: versions.length });
      header.appendChild(versionBadge);
    }

    ghost.appendChild(header);

    if (mediaType === "image") {
      const image = document.createElement("img");
      image.className = "item-drag-preview-image";
      image.src = item?.thumbnailUrl || item?.dataUrl || item?.imageUrl || "";
      image.alt = item?.altText || item?.title || t("images.image");
      ghost.appendChild(image);
    } else {
      const preview = document.createElement("div");
      preview.className = "item-drag-preview-text";
      preview.textContent = fullTextForPreview(displayItem).slice(0, mediaType === "dev" ? 240 : 280);
      ghost.appendChild(preview);
    }

    const meta = document.createElement("div");
    meta.className = "item-drag-preview-meta";
    const category = translatedCategoryPath(item?.categoryId) || item?.categoryName || t("categories.general");
    const sourceLabel = !hasMultipleVersions
      ? (item?.sourceDomain || window.MCP.getDomain?.(item?.sourceUrl || "") || item?.sourceUrl || item?.sourceTitle || "")
      : "";
    [category, sourceLabel].filter(Boolean).forEach((value) => {
      const span = document.createElement("span");
      span.textContent = value;
      meta.appendChild(span);
    });
    ghost.appendChild(meta);

    document.documentElement.appendChild(ghost);
    return ghost;
  }

  function moveCustomItemGhost(clientX, clientY) {
    if (!customItemDrag?.ghost) return;
    customItemDrag.ghost.style.transform = `translate3d(${clientX + 14}px, ${clientY + 14}px, 0)`;
  }

  function processCustomItemDragHover(clientX, clientY) {
    if (!customItemDrag?.active || !itemDragState) return;
    const node = document.elementFromPoint(clientX, clientY);
    if (!node || !elements.categories.contains(node)) {
      if (!keepExpandedCategoryBlockUnderPointer(clientX, clientY)) {
        customItemDrag.currentCategoryId = "";
        clearPendingItemDragExpansion();
        collapseAutoExpandedExcept("");
        clearAllCategoryDropTargets();
      }
      return;
    }
    const target = node.closest(".category-node, .category-list button[data-button-id]");
    if (!target || !elements.categories.contains(target)) {
      if (!keepExpandedCategoryBlockUnderPointer(clientX, clientY)) {
        customItemDrag.currentCategoryId = "";
        clearPendingItemDragExpansion();
        collapseAutoExpandedExcept("");
        clearAllCategoryDropTargets();
      }
      return;
    }
    const categoryId = target.dataset.categoryId || target.dataset.buttonId || "";
    const category = activeCategories().find((candidate) => candidate.id === categoryId);
    if (!category) {
      customItemDrag.currentCategoryId = "";
      clearPendingItemDragExpansion();
      collapseAutoExpandedExcept("");
      clearAllCategoryDropTargets();
      return;
    }
    const marker = target.closest(".category-node") || target;
    customItemDrag.currentCategoryId = category.id;
    markItemCategoryDropTarget(marker);
    scheduleItemDragCategoryExpand(category);
  }

  function keepExpandedCategoryBlockUnderPointer(clientX, clientY) {
    const rootId = itemDragHoverRootId || [...itemDragAutoExpanded].at(-1) || "";
    if (!rootId || !expandedCategories.has(rootId)) return false;
    const block = expandedRootCategoryBlock(rootId);
    if (!block) return false;
    const rect = elements.categories.getBoundingClientRect();
    const insideX = clientX >= rect.left && clientX <= rect.right;
    const insideY = clientY >= block.top - 8 && clientY <= block.bottom + 8;
    if (!insideX || !insideY) return false;
    collapseAutoExpandedExcept(rootId);
    const row = categoryRowAtPoint(clientX, clientY) || block.rootRow;
    const categoryId = row?.dataset.categoryId || rootId;
    const category = activeCategories().find((candidate) => candidate.id === categoryId);
    if (!category || isFavoriteCategoryId(category.id) || isTrashCategoryId(category.id)) return false;
    customItemDrag.currentCategoryId = category.id;
    markItemCategoryDropTarget(row);
    scheduleItemDragCategoryExpand(category);
    return true;
  }

  function expandedRootCategoryBlock(rootId) {
    const rows = [...elements.categories.querySelectorAll(".category-node[data-category-id]")];
    const rootRow = rows.find((row) => row.dataset.categoryId === rootId);
    if (!rootRow) return null;
    const ids = collectCategoryIds(rootId);
    const visibleRows = rows.filter((row) => ids.has(row.dataset.categoryId));
    if (!visibleRows.length) return null;
    const rects = visibleRows.map((row) => row.getBoundingClientRect());
    return {
      rootRow,
      top: Math.min(...rects.map((rect) => rect.top)),
      bottom: Math.max(...rects.map((rect) => rect.bottom))
    };
  }

  function categoryRowAtPoint(clientX, clientY) {
    return [...elements.categories.querySelectorAll(".category-node[data-category-id]")]
      .find((row) => {
        const rect = row.getBoundingClientRect();
        return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      }) || null;
  }

  function refreshCustomItemDragHover() {
    if (!customItemDrag?.active) return;
    processCustomItemDragHover(customItemDrag.lastX, customItemDrag.lastY);
    requestAnimationFrame(() => {
      if (!customItemDrag?.active) return;
      processCustomItemDragHover(customItemDrag.lastX, customItemDrag.lastY);
    });
  }

  function cleanupCustomItemPointerDrag() {
    if (!customItemDrag) return;
    document.removeEventListener("pointermove", handleCustomItemPointerMove, true);
    document.removeEventListener("pointerup", handleCustomItemPointerUp, true);
    document.removeEventListener("pointercancel", handleCustomItemPointerCancel, true);
    window.removeEventListener("pointermove", handleCustomItemPointerMove, true);
    window.removeEventListener("pointerup", handleCustomItemPointerUp, true);
    window.removeEventListener("pointercancel", handleCustomItemPointerCancel, true);
    document.documentElement.classList.remove("is-custom-item-dragging");
    try {
      if (customItemDrag.pointerId !== null && customItemDrag.source?.releasePointerCapture) {
        customItemDrag.source.releasePointerCapture(customItemDrag.pointerId);
      }
    } catch (_) {}
    customItemDrag.source?.style?.removeProperty("user-select");
    customItemDrag.source?.classList.remove("is-item-dragging");
    customItemDrag.ghost?.remove();
    customItemDrag = null;
  }

  function renderImageItem(item) {
    const inTrash = isTrashCategoryId(item.categoryId);
    const article = document.createElement("article");
    article.className = `image-card ${item.isPinned ? "is-pinned" : ""} ${isManagerBulkSelected(item.id) ? "is-bulk-selected" : ""} ${isManagerBulkSelectionMode("image") ? "is-bulk-mode" : ""}`;
    article.draggable = false;
    article.dataset.itemId = item.id;
    article.dataset.mediaType = "image";
    if (!inTrash && !isManagerBulkSelectionMode("image")) article.addEventListener("pointerdown", (event) => prepareItemPointerDrag(event, item, "image"));
    const bulkCheckbox = renderManagerBulkCheckbox(item);
    const titleField = renderImageInlineTitleField(item);
    const frame = document.createElement("div");
    frame.className = "image-frame";
    const image = document.createElement("img");
    image.src = item.thumbnailUrl || item.imageUrl;
    image.alt = item.altText || item.title || t("images.image");
    image.loading = "lazy";
    if (item.isScreenshot) frame.appendChild(screenBadge());
    const overlayActions = document.createElement("div");
    overlayActions.className = "image-overlay-actions";
    if (inTrash) {
      overlayActions.append(
        actionButton(t("trash.restore"), "restore-action", () => restoreItem(item, "image")),
        actionButton(t("images.info"), "icon-only image-info-action", () => openImageInfo(item)),
        actionButton(t("images.download"), "icon-only image-download-action", () => downloadImage(item)),
        actionButton(t("trash.permanentDelete"), "icon-only", () => deleteImage(item.id, true), "erase.png", { forceDarkIcon: true })
      );
    } else {
      overlayActions.append(
        actionButton(item.isFavorite ? t("common.favoriteRemove") : t("common.favoriteAdd"), item.isFavorite ? "is-active icon-only" : "icon-only", () => updateImage(item.id, { isFavorite: !item.isFavorite }), item.isFavorite ? "favorited.png" : "not_yet_favorited.png", { forceDarkIcon: true }),
        actionButton(item.isPinned ? t("common.unpin") : t("common.pin"), item.isPinned ? "is-active icon-only" : "icon-only", () => updateImage(item.id, { isPinned: !item.isPinned }), item.isPinned ? "go_unpin.png" : "go_pin.png", { forceDarkIcon: true }),
        actionButton(t("images.info"), "icon-only image-info-action", () => openImageInfo(item)),
        actionButton(t("images.download"), "icon-only image-download-action", () => downloadImage(item)),
        actionButton(t("common.delete"), "icon-only", () => deleteImage(item.id), "erase.png", { forceDarkIcon: true })
      );
    }
    frame.append(image, overlayActions);
    const meta = document.createElement("div");
    meta.className = "image-meta";
    [translatedCategoryPath(item.categoryId)]
      .filter(Boolean)
      .forEach((value) => {
        const span = document.createElement("span");
        span.textContent = value;
        meta.appendChild(span);
      });
    appendSourceMeta(meta, item);
    const dateMeta = document.createElement("span");
    dateMeta.textContent = window.MCP.formatLocalizedDate(item.createdAt, state.settings.language || "en");
    meta.appendChild(dateMeta);
    const actions = document.createElement("div");
    actions.className = "image-actions";
    actions.append(
      actionButton(t("common.useCapture"), "primary use-capture-action", () => copyImage(item, article)),
      actionButton(t("categories.classify"), "", () => classifyImage(item)),
      actionButton(t("source.open"), "icon-only", () => openImageSource(item), "reverse.png")
    );
    article.append(...[bulkCheckbox, titleField, frame, meta, actions].filter(Boolean));
    article.addEventListener("click", (event) => handleManagerReadyPasteCardClick(event, item, "image", article));
    return article;
  }

  function renderImageInlineTitleField(item) {
    if (!item?.id) return null;
    const wrap = document.createElement("label");
    wrap.className = "image-inline-title-field";
    wrap.title = t("versioning.inlineTitlePlaceholder");
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 80;
    input.value = String(item.title || "").slice(0, 80);
    input.placeholder = t("versioning.inlineTitlePlaceholder");
    input.dataset.itemId = item.id;
    const stop = (event) => event.stopPropagation();
    ["pointerdown", "mousedown", "click", "dblclick"].forEach((type) => input.addEventListener(type, stop));
    input.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.key === "Enter") {
        event.preventDefault();
        input.blur();
      } else if (event.key === "Escape") {
        input.value = String(item.title || "").slice(0, 80);
        input.blur();
      }
    });
    input.addEventListener("input", () => {
      if (input.value.length > 80) input.value = input.value.slice(0, 80);
      scheduleInlineImageTitleSave(item, input.value);
    });
    input.addEventListener("blur", () => {
      stopInlineImageTitleMarquee(input);
      flushInlineImageTitleSave(item, input.value);
    });
    input.addEventListener("mouseenter", () => startInlineImageTitleMarquee(input));
    input.addEventListener("mouseleave", () => stopInlineImageTitleMarquee(input));
    wrap.appendChild(input);
    return wrap;
  }

  function handleManagerReadyPasteCardClick(event, item, mediaType, card) {
    if (blockDemoAction(event)) return;
    if (!item || !card || isManagerBulkSelectionMode(mediaType)) return;
    if (Date.now() < suppressManagerReadyPasteClickUntil) return;
    if (card.classList.contains("is-item-dragging")) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.target.closest("button, a, input, textarea, select, [role='button'], [data-manager-action], [data-action]")) return;
    if (mediaType === "image") copyImage(item, card);
    else copyItem(itemDisplayVersionById(item, mediaType, card.dataset.activeVersionId || ""), mediaType, card);
  }

  function screenBadge() {
    const badge = document.createElement("span");
    badge.className = "screen-badge";
    badge.textContent = t("images.screenshot");
    return badge;
  }

  function actionButton(label, className, onClick, iconName = "", options = {}) {
    const button = document.createElement("button");
    const isUseCapture = String(className || "").split(/\s+/).includes("use-capture-action");
    const resolvedLabel = isUseCapture ? t("common.useCapture") : label;
    button.type = "button";
    button.className = className;
    button.title = resolvedLabel;
    button.setAttribute("aria-label", resolvedLabel);
    if (isUseCapture) {
      const image = document.createElement("img");
      image.src = "../assets/icons/copy.png";
      image.alt = "";
      image.width = 22;
      image.height = 22;
      image.setAttribute("aria-hidden", "true");
      button.appendChild(image);
    } else if (iconName) {
      const image = document.createElement("img");
      image.src = `../assets/icons/${themedIconName(iconName, options)}`;
      image.alt = label;
      image.width = 18;
      image.height = 18;
      button.appendChild(image);
    } else {
      button.textContent = className.includes("image-info-action") ? "i" : className.includes("image-download-action") ? "\u21e9" : label;
    }
    button.addEventListener("click", (event) => {
      if (blockDemoAction(event)) return;
      onClick(event);
    });
    return button;
  }

  function embeddedVersions(item) {
    return Array.isArray(item?.captureVersions)
      ? item.captureVersions
        .filter((version) => version && version.id && typeof version.content === "string")
        .sort((left, right) => Number(left.createdAt || 0) - Number(right.createdAt || 0) || String(left.id).localeCompare(String(right.id)))
      : [];
  }

  function currentEmbeddedVersionId(item, mediaType = "text") {
    const versions = embeddedVersions(item);
    if (!versions.length || mediaType === "image") return "";
    const remembered = managerItemVersionSelection.get(item.id);
    if (remembered && versions.some((version) => version.id === remembered)) return remembered;
    if (item.activeVersionId && versions.some((version) => version.id === item.activeVersionId)) return item.activeVersionId;
    return versions[versions.length - 1]?.id || "";
  }

  function itemDisplayVersion(item, mediaType = "text") {
    const versions = embeddedVersions(item);
    if (!versions.length || mediaType === "image") return item;
    const activeId = currentEmbeddedVersionId(item, mediaType);
    return itemDisplayVersionById(item, mediaType, activeId);
  }

  function itemDisplayVersionById(item, mediaType = "text", versionId = "") {
    const versions = embeddedVersions(item);
    if (!versions.length || mediaType === "image") return item;
    const activeId = versionId && versions.some((candidate) => candidate.id === versionId)
      ? versionId
      : currentEmbeddedVersionId(item, mediaType);
    const version = versions.find((candidate) => candidate.id === activeId) || versions[versions.length - 1];
    return Object.assign({}, item, {
      title: version.title || "",
      content: version.content || "",
      note: version.note || "",
      createdAt: version.createdAt || item.createdAt,
      updatedAt: version.updatedAt || item.updatedAt || version.createdAt || item.createdAt,
      preview: createLocalPreview(version.content || item.content || ""),
      activeVersionId: version.id
    });
  }

  function filterManagerTextItems(items, query, mediaType = "text") {
    const normalizedQuery = window.MCP.normalizeContent(query || "");
    if (!normalizedQuery) return window.MCP.sortItems(items || []);
    return window.MCP.sortItems(items || []).filter((item) => managerTextItemMatchesQuery(item, mediaType, normalizedQuery));
  }

  function managerTextItemMatchesQuery(item, mediaType = "text", normalizedQuery = "") {
    if (!normalizedQuery) return true;
    const baseHaystack = [
      item?.title,
      item?.content,
      item?.preview,
      item?.note,
      item?.categoryName,
      item?.sourceDomain,
      item?.sourceUrl,
      ...(item?.tags || [])
    ].join(" ");
    if (window.MCP.normalizeContent(baseHaystack).includes(normalizedQuery)) return true;
    return Boolean(findSearchMatchingVersionId(item, mediaType, normalizedQuery));
  }

  function findSearchMatchingVersionId(item, mediaType = "text", normalizedQuery = "") {
    if (!normalizedQuery || mediaType === "image") return "";
    const versions = embeddedVersions(item);
    if (versions.length <= 1) return "";
    const match = versions.find((version) => {
      const haystack = [
        version.title,
        version.content,
        version.note,
        version.label
      ].join(" ");
      return window.MCP.normalizeContent(haystack).includes(normalizedQuery);
    });
    return match?.id || "";
  }

  function applySearchVersionFocus(items, query, mediaType = "text") {
    const normalizedQuery = window.MCP.normalizeContent(query || "");
    if (!normalizedQuery || mediaType === "image") return;
    (items || []).forEach((item) => {
      const versions = embeddedVersions(item);
      const manualVersionId = managerSearchVersionManualSelection.get(searchVersionManualSelectionKey(item, mediaType, normalizedQuery));
      if (manualVersionId && versions.some((version) => version.id === manualVersionId)) {
        managerItemVersionSelection.set(item.id, manualVersionId);
        item.activeVersionId = manualVersionId;
        return;
      }
      const versionId = findSearchMatchingVersionId(item, mediaType, normalizedQuery);
      if (!versionId) return;
      managerItemVersionSelection.set(item.id, versionId);
      item.activeVersionId = versionId;
    });
  }

  function searchVersionManualSelectionKey(item, mediaType = "text", normalizedQuery = "") {
    return `${mediaType}:${item?.id || ""}:${normalizedQuery || ""}`;
  }

  function isEmbeddedSourceVersionActive(item, mediaType = "text") {
    const versions = embeddedVersions(item);
    if (mediaType === "image" || versions.length <= 1) return true;
    return currentEmbeddedVersionId(item, mediaType) === versions[0]?.id;
  }

  function createLocalPreview(content = "") {
    return String(content || "").replace(/\s+/g, " ").trim().slice(0, 220);
  }

  function versionSnapshotFromItem(item, label = "", createdAt = null) {
    const now = createdAt || Date.now();
    return {
      id: generateVersionId(),
      label,
      title: item?.title || "",
      content: item?.content || "",
      note: item?.note || "",
      createdAt: item?.createdAt || now,
      updatedAt: item?.updatedAt || now
    };
  }

  function versionSnapshotFromUpdates(updates = {}, label = "") {
    const now = Date.now();
    return {
      id: generateVersionId(),
      label,
      title: String(updates.title || "").slice(0, 30),
      content: updates.content || "",
      note: updates.note || "",
      createdAt: now,
      updatedAt: now
    };
  }

  function generateVersionId() {
    const cryptoApi = globalThis.crypto;
    if (cryptoApi?.randomUUID) return `v_${cryptoApi.randomUUID()}`;
    return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  }

  function renderEmbeddedVersionTabs(item, mediaType = "text") {
    const versions = embeddedVersions(item);
    if (mediaType === "image" || versions.length <= 1) return null;
    const tabs = document.createElement("div");
    tabs.className = "embedded-version-tabs";
    tabs.setAttribute("aria-label", t("versioning.tabsLabel"));
    const activeId = currentEmbeddedVersionId(item, mediaType);
    versions.forEach((version, index) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = `embedded-version-tab ${version.id === activeId ? "is-active" : ""}`;
      tab.textContent = t("versioning.shortLabel", { number: index + 1 });
      tab.title = t("versioning.selectVersion", { number: index + 1 });
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        selectEmbeddedVersion(item, mediaType, version.id);
      });
      if (versions.length > 1) {
        const remove = document.createElement("span");
        remove.className = "embedded-version-remove";
        remove.textContent = "×";
        remove.title = t("versioning.deleteVersion", { number: index + 1 });
        remove.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          deleteEmbeddedVersion(item, mediaType, version.id, index + 1);
        });
        tab.appendChild(remove);
      }
      tabs.appendChild(tab);
    });
    return tabs;
  }

  function renderEmbeddedTitleField(item, mediaType = "text") {
    if (mediaType === "image" || !item?.id) return null;
    const displayItem = itemDisplayVersion(item, mediaType);
    const activeVersionId = displayItem?.activeVersionId || "";
    const wrap = document.createElement("label");
    wrap.className = "embedded-version-title-field";
    wrap.title = t("versioning.inlineTitlePlaceholder");
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 30;
    input.value = String(displayItem?.title || "").slice(0, 30);
    input.placeholder = t("versioning.inlineTitlePlaceholder");
    input.dataset.itemId = item.id;
    input.dataset.mediaType = mediaType;
    input.dataset.activeVersionId = activeVersionId;
    const stop = (event) => {
      event.stopPropagation();
    };
    ["pointerdown", "mousedown", "click", "dblclick"].forEach((type) => input.addEventListener(type, stop));
    input.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.key === "Enter") {
        event.preventDefault();
        input.blur();
      } else if (event.key === "Escape") {
        input.value = String(itemDisplayVersionById(item, mediaType, activeVersionId)?.title || "").slice(0, 30);
        input.blur();
      }
    });
    input.addEventListener("input", () => {
      if (input.value.length > 30) input.value = input.value.slice(0, 30);
      scheduleInlineTitleSave(item, mediaType, input.value, activeVersionId);
    });
    input.addEventListener("blur", () => flushInlineTitleSave(item, mediaType, input.value, activeVersionId));
    wrap.appendChild(input);
    return wrap;
  }

  function inlineTitleSaveKey(item, mediaType, versionId = "") {
    return `${mediaType}:${item?.id || ""}:${versionId || "base"}`;
  }

  function scheduleInlineTitleSave(item, mediaType, title, versionId = "") {
    const key = inlineTitleSaveKey(item, mediaType, versionId);
    clearTimeout(inlineTitleSaveTimers.get(key));
    inlineTitleSaveTimers.set(key, window.setTimeout(() => {
      inlineTitleSaveTimers.delete(key);
      saveInlineCaptureTitle(item, mediaType, title, versionId).catch(() => null);
    }, 220));
  }

  function flushInlineTitleSave(item, mediaType, title, versionId = "") {
    const key = inlineTitleSaveKey(item, mediaType, versionId);
    clearTimeout(inlineTitleSaveTimers.get(key));
    inlineTitleSaveTimers.delete(key);
    return saveInlineCaptureTitle(item, mediaType, title, versionId).catch(() => null);
  }

  async function saveInlineCaptureTitle(item, mediaType, rawTitle, versionId = "") {
    if (isDemoMode()) return;
    if (!item?.id || mediaType === "image") return;
    const title = String(rawTitle || "").trim().slice(0, 30);
    const versions = embeddedVersions(item);
    let updates = { title };
    if (versions.length && versionId) {
      const nextVersions = versions.map((version) => version.id === versionId
        ? Object.assign({}, version, { title, updatedAt: Date.now() })
        : version);
      const activeVersion = nextVersions.find((version) => version.id === versionId);
      updates = cleanSharedVersionUpdates({
        title: activeVersion?.title || title,
        captureVersions: nextVersions,
        activeVersionId: versionId
      });
      item.captureVersions = nextVersions;
      item.activeVersionId = versionId;
      managerItemVersionSelection.set(item.id, versionId);
      persistManagerViewState();
    }
    item.title = title;
    suppressInlineTitleRefreshUntil = Date.now() + 700;
    if (mediaType === "dev") await window.MCP.updateDevItem(item.id, updates);
    else await window.MCP.updateClipboardItem(item.id, updates);
  }

  function scheduleInlineImageTitleSave(item, title) {
    const key = inlineTitleSaveKey(item, "image", "title");
    clearTimeout(inlineTitleSaveTimers.get(key));
    inlineTitleSaveTimers.set(key, window.setTimeout(() => {
      inlineTitleSaveTimers.delete(key);
      saveInlineImageTitle(item, title).catch(() => null);
    }, 240));
  }

  function flushInlineImageTitleSave(item, title) {
    const key = inlineTitleSaveKey(item, "image", "title");
    clearTimeout(inlineTitleSaveTimers.get(key));
    inlineTitleSaveTimers.delete(key);
    return saveInlineImageTitle(item, title).catch(() => null);
  }

  async function saveInlineImageTitle(item, rawTitle) {
    if (isDemoMode()) return;
    if (!item?.id) return;
    const title = String(rawTitle || "").trim().slice(0, 80);
    if (title === String(item.title || "")) return;
    item.title = title;
    await chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.UPDATE_IMAGE_ITEM,
      itemId: item.id,
      updates: { title }
    }).catch(() => {});
  }

  function startInlineImageTitleMarquee(input) {
    if (!input || input.matches(":focus")) return;
    stopInlineImageTitleMarquee(input, false);
    const maxScroll = Math.max(0, input.scrollWidth - input.clientWidth);
    if (maxScroll <= 4) return;
    input.dataset.marqueeActive = "true";
    let direction = 1;
    let lastFrame = performance.now();
    let holdUntil = lastFrame + 260;
    const step = (now) => {
      if (input.dataset.marqueeActive !== "true" || input.matches(":focus")) return;
      if (now < holdUntil) {
        input._imageTitleMarqueeFrame = requestAnimationFrame(step);
        return;
      }
      const delta = Math.min(34, now - lastFrame);
      lastFrame = now;
      input.scrollLeft += direction * delta * 0.08;
      if (input.scrollLeft >= maxScroll - 1) {
        input.scrollLeft = maxScroll;
        direction = -1;
        holdUntil = now + 420;
      } else if (input.scrollLeft <= 1) {
        input.scrollLeft = 0;
        direction = 1;
        holdUntil = now + 420;
      }
      input._imageTitleMarqueeFrame = requestAnimationFrame(step);
    };
    input._imageTitleMarqueeFrame = requestAnimationFrame(step);
  }

  function stopInlineImageTitleMarquee(input, reset = true) {
    if (!input) return;
    input.dataset.marqueeActive = "false";
    if (input._imageTitleMarqueeFrame) cancelAnimationFrame(input._imageTitleMarqueeFrame);
    input._imageTitleMarqueeFrame = 0;
    if (reset) input.scrollLeft = 0;
  }

  async function selectEmbeddedVersion(item, mediaType, versionId) {
    if (!item?.id || !versionId) return;
    const normalizedQuery = window.MCP.normalizeContent(elements.search?.value || "");
    if (normalizedQuery && mediaType !== "image") {
      managerSearchVersionManualSelection.set(searchVersionManualSelectionKey(item, mediaType, normalizedQuery), versionId);
    }
    managerItemVersionSelection.set(item.id, versionId);
    item.activeVersionId = versionId;
    persistManagerViewState();
    const scrollTop = elements.items?.scrollTop || 0;
    renderItems();
    requestAnimationFrame(() => {
      if (elements.items) elements.items.scrollTop = scrollTop;
    });
  }

  async function deleteEmbeddedVersion(item, mediaType, versionId, number = 1) {
    if (blockDemoAction()) return;
    const versions = embeddedVersions(item);
    if (!item?.id || versions.length <= 1) return;
    const confirmed = await openManagerConfirmDialog({
      title: t("versioning.deleteVersionTitle"),
      message: t("versioning.deleteVersionConfirm", { number }),
      confirmText: t("common.delete"),
      cancelText: t("common.cancel")
    });
    if (!confirmed) return;
    const nextVersions = versions.filter((version) => version.id !== versionId);
    const nextActive = nextVersions[Math.min(number - 1, nextVersions.length - 1)] || nextVersions[nextVersions.length - 1];
    const updates = {
      captureVersions: nextVersions,
      activeVersionId: nextActive?.id || "",
      title: nextActive?.title || "",
      content: nextActive?.content || "",
      note: nextActive?.note || ""
    };
    const updater = mediaType === "dev" ? updateDev : updateItem;
    await updater(item.id, updates);
    managerItemVersionSelection.set(item.id, updates.activeVersionId);
    persistManagerViewState();
    render();
    showManagerToast(t("versioning.deleted"));
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
    const suffix = options.forceDarkIcon ? "darkmod" : document.documentElement.getAttribute("data-resolved-theme") === "light" ? "lightmod" : "darkmod";
    return fileName.replace(/\.png$/i, `_${suffix}.png`);
  }

  function openImageInfo(item) {
    let modal = document.getElementById("managerImageInfoModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerImageInfoModal";
      modal.className = "manager-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-image-info\"></div>",
        "<section class=\"manager-image-info-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"image-info-title\"></strong><button type=\"button\" data-manager-action=\"close-image-info\" aria-label=\"Close\">&times;</button></header>",
        "<div data-role=\"image-info-content\"></div>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
    }
    modal.querySelector("[data-role='image-info-title']").textContent = t("images.infoTitle");
    const content = modal.querySelector("[data-role='image-info-content']");
    content.replaceChildren(renderImageInfoRows(item));
    modal.hidden = false;
  }

  function closeImageInfo() {
    const modal = document.getElementById("managerImageInfoModal");
    if (modal) modal.hidden = true;
  }

  function renderImageInfoRows(item) {
    const list = document.createElement("div");
    list.className = "manager-image-info-list";
    imageInfoFields(item).forEach(([label, value]) => {
      if (!value) return;
      const row = document.createElement("div");
      row.className = "manager-image-info-row";
      const key = document.createElement("strong");
      key.textContent = label;
      const text = document.createElement("span");
      text.textContent = value;
      const copy = actionButton(t("common.copy"), "", () => navigator.clipboard.writeText(value).catch(() => {}));
      row.append(key, text, copy);
      list.appendChild(row);
    });
    return list;
  }

  function imageInfoFields(item) {
    const storedIsData = String(item.imageUrl || "").startsWith("data:");
    const storedDataUrl = item.dataUrl || (storedIsData ? item.imageUrl : "");
    return [
      ...(storedIsData ? [] : [[t("images.infoStoredUrl"), item.imageUrl]]),
      [t("images.infoSourcePage"), item.sourceUrl],
      [t("images.infoSourceDomain"), item.sourceDomain],
      [t("images.infoSourceTitle"), item.sourceTitle || item.imagePageTitle],
      [t("images.infoAlt"), item.altText],
      [t("images.infoElementTitle"), item.imageElementTitle || item.title],
      [t("images.infoFileName"), item.imageFileName || fileNameFromUrl(item.originalImageUrl || item.imageUrl)],
      [t("images.infoDimensions"), item.width && item.height ? `${item.width} × ${item.height}` : ""],
      [t("images.infoCategory"), translatedCategoryPath(item.categoryId)],
      [t("images.infoCapturedAt"), window.MCP.formatLocalizedDate(item.createdAt, state.settings.language || "en")],
      [t("images.infoCaptureKind"), item.isScreenshot ? t("images.screenshot") : ""],
      [t("images.infoCandidates"), Array.isArray(item.imageCandidates) ? item.imageCandidates.filter(Boolean).join("\n") : ""],
      [t("images.infoOriginalUrl"), item.originalImageUrl || item.imageUrl],
      [t("images.infoStoredUrl"), storedDataUrl]
    ];
  }

  function fileNameFromUrl(value) {
    try {
      return decodeURIComponent(new URL(value, location.href).pathname.split("/").filter(Boolean).pop() || "");
    } catch (error) {
      return String(value || "").split("?")[0].split("/").filter(Boolean).pop() || "";
    }
  }

  function readyToPasteToastKey(mediaType = "text") {
    if (mediaType === "image") return "images.readyToPaste";
    if (mediaType === "dev") return "clipboard.codeReadyToPaste";
    return "clipboard.textReadyToPaste";
  }

  function playManagerReadyPasteFeedback(card) {
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    card.querySelectorAll(":scope > .manager-ready-paste-shine-layer").forEach((node) => node.remove());
    const layer = document.createElement("span");
    layer.className = "manager-ready-paste-shine-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.style.setProperty("--manager-ready-paste-accent", state.settings?.accentColor || "#e50914");
    card.appendChild(layer);
    card.classList.remove("manager-ready-paste-feedback");
    void card.offsetWidth;
    card.classList.add("manager-ready-paste-feedback");
    window.setTimeout(() => {
      card.classList.remove("manager-ready-paste-feedback");
      layer.remove();
    }, 1180);
  }

  async function copyItem(item, mediaType = "text", feedbackCard = null) {
    try {
      const isDev = (state.devItems || []).some((current) => current.id === item.id);
      const resolvedMediaType = mediaType === "dev" || isDev ? "dev" : "text";
      playManagerReadyPasteFeedback(feedbackCard);
      markManagerReadyPasteUsageUpdate();
      await window.MCP.writeClipboardText(item.content);
      const nextUsageCount = (item.usageCount || 0) + 1;
      const nextLastUsedAt = Date.now();
      item.usageCount = nextUsageCount;
      item.lastUsedAt = nextLastUsedAt;
      showManagerToast(t(readyToPasteToastKey(resolvedMediaType)));
      (isDev ? window.MCP.updateDevItem : window.MCP.updateClipboardItem)(item.id, {
        usageCount: nextUsageCount,
        lastUsedAt: nextLastUsedAt
      }).catch(() => {});
    } catch (error) {
      showManagerToast(t("clipboard.writeFailed"));
    }
  }

  async function toggleFavorite(item) {
    await updateItem(item.id, { isFavorite: !item.isFavorite });
  }

  async function editItem(item) {
    openEditor(item, (state.devItems || []).some((current) => current.id === item.id) ? "dev" : "text");
  }

  function classifyText(item) {
    openManagerClassifier(item, "text");
  }

  function classifyDev(item) {
    openManagerClassifier(item, "dev");
  }

  async function openSource(item) {
    if (!item.sourceUrl) {
      showStatus(t("source.missing"));
      return;
    }
    await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.OPEN_SOURCE_ITEM, itemId: item.id }).catch(() => {});
    showStatus(t("source.opening"));
  }

  async function updateItem(id, updates) {
    await window.MCP.updateClipboardItem(id, updates);
    await loadState();
  }

  async function updateDev(id, updates) {
    await window.MCP.updateDevItem(id, updates);
    await loadState();
  }

  function cleanSharedVersionUpdates(updates = {}) {
    return Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined));
  }

  async function deleteItem(id, permanent = false) {
    const item = (state.items || []).find((candidate) => candidate.id === id);
    const versionCount = embeddedVersions(item).length;
    const hasEmbeddedVersionSet = versionCount > 1;
    const effectivePermanent = permanent || !canUseTrashManagement();
    if (state.settings.confirmBeforeDelete || hasEmbeddedVersionSet) {
      const confirmed = await openManagerConfirmDialog({
        title: hasEmbeddedVersionSet ? t("versioning.deleteAllVersionsTitle") : t("common.delete"),
        message: hasEmbeddedVersionSet
          ? t(effectivePermanent ? "versioning.deleteAllVersionsPermanentConfirm" : "versioning.deleteAllVersionsTrashConfirm", { count: versionCount })
          : t("editor.deleteConfirm"),
        confirmText: t("common.delete"),
        cancelText: t("common.cancel")
      });
      if (!confirmed) return;
    }
    await window.MCP.deleteClipboardItem(id, { permanent: effectivePermanent });
    await loadState();
    showManagerToast(effectivePermanent ? t("trash.permanentlyDeleted") : t("trash.moved"));
  }

  async function deleteDev(id, permanent = false) {
    const item = (state.devItems || []).find((candidate) => candidate.id === id);
    const versionCount = embeddedVersions(item).length;
    const hasEmbeddedVersionSet = versionCount > 1;
    const effectivePermanent = permanent || !canUseTrashManagement();
    if (state.settings.confirmBeforeDelete || hasEmbeddedVersionSet) {
      const confirmed = await openManagerConfirmDialog({
        title: hasEmbeddedVersionSet ? t("versioning.deleteAllVersionsTitle") : t("common.delete"),
        message: hasEmbeddedVersionSet
          ? t(effectivePermanent ? "versioning.deleteAllVersionsPermanentConfirm" : "versioning.deleteAllVersionsTrashConfirm", { count: versionCount })
          : t("editor.deleteConfirm"),
        confirmText: t("common.delete"),
        cancelText: t("common.cancel")
      });
      if (!confirmed) return;
    }
    await window.MCP.deleteDevItem(id, { permanent: effectivePermanent });
    await loadState();
    showManagerToast(effectivePermanent ? t("trash.permanentlyDeleted") : t("trash.moved"));
  }

  async function updateImage(id, updates) {
    await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.UPDATE_IMAGE_ITEM, itemId: id, updates }).catch(() => {});
    await loadState();
  }

  async function copyImage(item, feedbackCard = null) {
    try {
      playManagerReadyPasteFeedback(feedbackCard);
      markManagerReadyPasteUsageUpdate();
      const blob = await imageItemToBlob(item);
      if (!window.ClipboardItem) throw new Error("ClipboardItem unavailable");
      await navigator.clipboard.write([new ClipboardItem({ [blob.type || "image/png"]: blob })]);
      const nextUsageCount = (item.usageCount || 0) + 1;
      const nextLastUsedAt = Date.now();
      item.usageCount = nextUsageCount;
      item.lastUsedAt = nextLastUsedAt;
      showManagerToast(t(readyToPasteToastKey("image")));
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.UPDATE_IMAGE_ITEM,
        itemId: item.id,
        updates: { usageCount: nextUsageCount, lastUsedAt: nextLastUsedAt }
      }).catch(() => {});
    } catch (error) {
      showManagerToast(t("images.copyFailed"));
    }
  }

  async function downloadImage(item) {
    try {
      const blob = await imageItemToBlob(item);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const name = item.imageFileName || fileNameFromUrl(item.originalImageUrl || item.imageUrl) || `ultimate-clipboard-image-${Date.now()}.png`;
      link.href = url;
      link.download = name.includes(".") ? name : `${name}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1200);
      showStatus(t("images.downloaded"));
    } catch (error) {
      showStatus(t("images.downloadFailed"));
    }
  }

  async function imageItemToBlob(item) {
    const source = item.dataUrl || item.thumbnailUrl || item.imageUrl;
    if (String(source || "").startsWith("data:image/")) {
      return blobToClipboardPng(await dataUrlToBlob(source));
    }
    const blob = await fetch(source, { mode: "cors" }).then((response) => {
      if (!response.ok) throw new Error("Image fetch failed.");
      return response.blob();
    }).catch(async () => {
      const response = await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.FETCH_IMAGE_AS_DATA_URL, url: item.imageUrl || source });
      if (!response?.ok || !response.data?.dataUrl) throw new Error(response?.error || "Image fetch failed.");
      chrome.runtime.sendMessage({
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
      const png = await new Promise((resolve, reject) => canvas.toBlob((nextBlob) => nextBlob ? resolve(nextBlob) : reject(new Error("PNG conversion failed.")), "image/png"));
      return png;
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

  async function deleteImage(id, permanent = false) {
    if (state.settings.confirmBeforeDelete) {
      const confirmed = await openManagerConfirmDialog({
        title: t("common.delete"),
        message: t("editor.deleteConfirm"),
        confirmText: t("common.delete"),
        cancelText: t("common.cancel")
      });
      if (!confirmed) return;
    }
    const effectivePermanent = permanent || !canUseTrashManagement();
    await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.DELETE_IMAGE_ITEM, itemId: id, permanent: effectivePermanent }).catch(() => {});
    await loadState();
    showManagerToast(effectivePermanent ? t("trash.permanentlyDeleted") : t("trash.moved"));
  }

  function canUseTrashManagement() {
    return window.MCP.canUseFeature ? window.MCP.canUseFeature("trashManagement", state.settings) : true;
  }

  async function restoreItem(item, mediaType = activeTab) {
    if (!item) return;
    if (mediaType === "image") await window.MCP.restoreImageItem(item.id);
    else if (mediaType === "dev") await window.MCP.restoreDevItem(item.id);
    else await window.MCP.restoreClipboardItem(item.id);
    await loadState();
    showManagerToast(t("trash.restored"));
  }

  async function emptyCurrentTrash() {
    if (!isTrashSelected()) return;
    await window.MCP.emptyTrash(activeTab);
    await loadState();
    showManagerToast(t("trash.emptied"));
  }

  async function openImageSource(item) {
    if (!item.sourceUrl && !item.imageUrl) {
      showStatus(t("source.missing"));
      return;
    }
    await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.OPEN_SOURCE_IMAGE, itemId: item.id }).catch(() => {});
    showStatus(t("source.opening"));
  }

  async function classifyImage(item) {
    openManagerClassifier(item, "image");
  }

  function openMontage() {
    if (activeTab !== "text") return;
    if (window.MCP.canUseFeature && !window.MCP.canUseFeature("itemComposition", state.settings)) {
      openManagerProUpgradeModal("itemComposition");
      showManagerToast(t("pro.montageRequired"));
      return;
    }
    triggerMicroAnimation(elements.openMontage, "success-pulse", 440);
    let modal = document.getElementById("managerMontageModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerMontageModal";
      modal.className = "manager-modal manager-montage-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-montage\"></div>",
        "<section class=\"manager-montage-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><div><strong data-role=\"montage-title\"></strong><p data-role=\"montage-subtitle\"></p></div><button type=\"button\" data-manager-action=\"close-montage\" aria-label=\"Close\">&times;</button></header>",
        "<div class=\"manager-montage-layout\">",
        "<aside class=\"manager-montage-source\"><div class=\"manager-montage-section-head\"><strong data-role=\"montage-available\"></strong><button type=\"button\" data-manager-action=\"add-all-montage\"></button></div><input id=\"managerMontageSearch\" class=\"manager-modal-search\" type=\"search\"><div id=\"managerMontageAvailable\" class=\"manager-montage-list\"></div></aside>",
        "<section class=\"manager-montage-chain\"><div class=\"manager-montage-section-head\"><strong data-role=\"montage-chain\"></strong><span data-role=\"montage-count\"></span></div><div class=\"manager-montage-tools\"><label><span data-role=\"montage-format-label\"></span><select id=\"managerMontageFormat\"><option value=\"plain\"></option><option value=\"numbered\"></option><option value=\"bullets\"></option><option value=\"sections\"></option><option value=\"markdown\"></option><option value=\"spaced\"></option></select></label><button type=\"button\" data-manager-action=\"open-montage-final-editor\"></button><button type=\"button\" data-manager-action=\"polish-montage\"></button></div><div id=\"managerMontageChain\" class=\"manager-montage-list is-chain\"></div><footer><button type=\"button\" data-manager-action=\"clear-montage\"></button><button type=\"button\" data-manager-action=\"close-montage\"></button><button type=\"button\" data-manager-action=\"save-montage-as-text\"></button><button type=\"button\" class=\"primary\" data-manager-action=\"copy-montage\"></button></footer></section>",
        "</div>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
      modal.querySelector("#managerMontageSearch").addEventListener("input", (event) => {
        montageState.query = event.target.value;
        renderMontage();
      });
      const chain = modal.querySelector("#managerMontageChain");
      chain.addEventListener("dragover", handleMontageChainDragOver);
      chain.addEventListener("drop", handleMontageChainDrop);
      modal.querySelector("#managerMontageFormat").addEventListener("change", (event) => {
        montageState.format = event.target.value || "plain";
        montageState.finalDraft = "";
        const copyButton = modal.querySelector("[data-manager-action='copy-montage']");
        if (copyButton) copyButton.textContent = t("montage.copyCombined");
        triggerMicroAnimation(event.target, "success-pulse", 440);
      });
    }
    modal.hidden = false;
    translateMontageModal(modal);
    renderMontage();
    const input = modal.querySelector("#managerMontageSearch");
    input.value = montageState.query;
    input.focus();
  }

  function translateMontageModal(modal) {
    modal.querySelector("[data-role='montage-title']").textContent = t("montage.title");
    modal.querySelector("[data-role='montage-subtitle']").textContent = t("montage.subtitle");
    modal.querySelector("[data-role='montage-available']").textContent = t("montage.available");
    modal.querySelector("[data-role='montage-chain']").textContent = t("montage.chain");
    modal.querySelector("#managerMontageSearch").placeholder = t("montage.searchPlaceholder");
    modal.querySelector("[data-manager-action='add-all-montage']").textContent = t("montage.addAll");
    modal.querySelector("[data-role='montage-format-label']").textContent = t("montage.format");
    modal.querySelector("#managerMontageFormat").value = montageState.format || "plain";
    modal.querySelector("#managerMontageFormat option[value='plain']").textContent = t("montage.formatPlain");
    modal.querySelector("#managerMontageFormat option[value='numbered']").textContent = t("montage.formatNumbered");
    modal.querySelector("#managerMontageFormat option[value='bullets']").textContent = t("montage.formatBullets");
    modal.querySelector("#managerMontageFormat option[value='sections']").textContent = t("montage.formatSections");
    modal.querySelector("#managerMontageFormat option[value='markdown']").textContent = t("montage.formatMarkdown");
    modal.querySelector("#managerMontageFormat option[value='spaced']").textContent = t("montage.formatSpaced");
    modal.querySelector("[data-manager-action='open-montage-final-editor']").textContent = t("montage.editFinal");
    modal.querySelector("[data-manager-action='polish-montage']").textContent = t("montage.polish");
    modal.querySelector("[data-manager-action='clear-montage']").textContent = t("montage.clear");
    modal.querySelector(".manager-montage-chain footer [data-manager-action='close-montage']").textContent = t("common.cancel");
    modal.querySelector("[data-manager-action='save-montage-as-text']").textContent = t("montage.copyToGeneral");
    modal.querySelector("[data-manager-action='copy-montage']").textContent = t("montage.copyCombined");
  }

  function renderMontage() {
    const modal = document.getElementById("managerMontageModal");
    if (!modal) return;
    const available = modal.querySelector("#managerMontageAvailable");
    const chain = modal.querySelector("#managerMontageChain");
    const count = modal.querySelector("[data-role='montage-count']");
    const itemsById = new Map((state.items || []).map((item) => [item.id, item]));
    available.replaceChildren();
    chain.replaceChildren();
    const selected = new Set(montageState.itemIds);
    const availableItems = montageAvailableItems(selected)
      .slice(0, 80);
    if (!availableItems.length) {
      available.appendChild(emptyMontage(t("montage.noAvailable")));
    } else {
      const availableFragment = document.createDocumentFragment();
      availableItems.forEach((entry) => availableFragment.appendChild(montageAvailableRow(entry.item, entry.versionId)));
      available.appendChild(availableFragment);
    }
    const chainItems = montageState.itemIds
      .map((entryKey) => {
        const item = itemsById.get(montageEntryItemId(entryKey));
        return item ? { item, entryKey, versionId: montageEntryVersionId(entryKey) } : null;
      })
      .filter(Boolean);
    count.textContent = t("montage.count", { count: chainItems.length });
    if (!chainItems.length) {
      chain.appendChild(emptyMontage(t("montage.emptyChain")));
    } else {
      const chainFragment = document.createDocumentFragment();
      chainItems.forEach((entry, index) => chainFragment.appendChild(montageChainRow(entry.item, index, chainItems.length, entry.entryKey, entry.versionId)));
      chain.appendChild(chainFragment);
    }
  }

  function emptyMontage(text) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = text;
    return empty;
  }

  function montageAvailableRow(item, versionId = "") {
    const entryKey = montageEntryKey(item.id, versionId);
    const row = montageBaseRow(item, "available", versionId, entryKey);
    row.draggable = true;
    row.dataset.source = "available";
    row.dataset.itemId = item.id;
    row.dataset.entryKey = entryKey;
    row.addEventListener("dragstart", (event) => startMontageDrag(event, item.id, "available", entryKey));
    row.addEventListener("dragend", () => row.classList.remove("is-dragging"));
    const add = document.createElement("button");
    add.type = "button";
    add.dataset.managerAction = "add-montage-item";
    add.dataset.itemId = item.id;
    add.textContent = t("montage.add");
    row.appendChild(add);
    return row;
  }

  function montageChainRow(item, index, total, entryKey = "", versionId = "") {
    const resolvedEntryKey = entryKey || montageEntryKey(item.id, versionId);
    const row = montageBaseRow(item, "chain", versionId, resolvedEntryKey);
    row.draggable = true;
    row.dataset.source = "chain";
    row.dataset.itemId = item.id;
    row.dataset.entryKey = resolvedEntryKey;
    row.addEventListener("dragstart", (event) => startMontageDrag(event, item.id, "chain", resolvedEntryKey));
    row.addEventListener("dragend", () => row.classList.remove("is-dragging"));
    row.addEventListener("dragover", (event) => event.preventDefault());
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      const sourceKey = montageState.draggingId || event.dataTransfer.getData("text/plain");
      insertMontageItemAt(sourceKey, insertionIndexFromDrop(row, event));
    });
    const actions = document.createElement("div");
    actions.className = "manager-montage-actions";
    actions.append(
      montageSmallButton(t("common.edit"), "edit-montage-item", item.id, false, t("common.edit"), resolvedEntryKey),
      montageSmallButton("\u2191", "move-montage-up", item.id, index === 0, t("montage.moveUp"), resolvedEntryKey),
      montageSmallButton("\u2193", "move-montage-down", item.id, index === total - 1, t("montage.moveDown"), resolvedEntryKey),
      montageSmallButton("X", "remove-montage-item", item.id, false, t("montage.remove"), resolvedEntryKey)
    );
    row.appendChild(actions);
    return row;
  }

  function isMontageAvailableItem(item, selectedIds = new Set()) {
    if (!item) return false;
    if (isTrashCategoryId(item.categoryId) || item.trashedAt) return false;
    return true;
  }

  function montageAvailableItems(selectedIds = new Set()) {
    const normalizedQuery = window.MCP.normalizeContent(montageState.query || "");
    const available = window.MCP.sortItems(state.items || [])
      .filter((item) => isMontageAvailableItem(item, selectedIds));
    const selectedKeys = new Set([...selectedIds].map((key) => String(key || "")));
    const selectedLegacyIds = new Set([...selectedKeys].filter((key) => !key.includes("::")));
    const entries = [];
    const pushEntry = (item, versionId = "") => {
      const key = montageEntryKey(item.id, versionId);
      if (selectedKeys.has(key) || (!versionId && selectedLegacyIds.has(item.id))) return;
      entries.push({ item, versionId });
    };
    if (!normalizedQuery) {
      available.forEach((item) => pushEntry(item, montageActiveVersionId(item)));
      return entries;
    }
    available.forEach((item) => {
      const versions = embeddedVersions(item);
      if (versions.length > 1) {
        versions.forEach((version) => {
          const haystack = [
            version.title,
            version.content,
            version.note,
            version.label,
            item?.categoryName,
            item?.sourceDomain,
            item?.sourceUrl,
            ...(item?.tags || [])
          ].join(" ");
          if (window.MCP.normalizeContent(haystack).includes(normalizedQuery)) pushEntry(item, version.id);
        });
        return;
      }
      const haystack = [
        item?.title,
        item?.content,
        item?.preview,
        item?.note,
        item?.categoryName,
        item?.sourceDomain,
        item?.sourceUrl,
        ...(item?.tags || [])
      ].join(" ");
      if (window.MCP.normalizeContent(haystack).includes(normalizedQuery)) pushEntry(item, "");
    });
    return entries;
  }

  function montageBaseRow(item, context = "chain", forcedVersionId = "", entryKey = "") {
    const row = document.createElement("article");
    row.className = `manager-montage-item is-${context}`;
    const displayItem = montageDisplayItem(item, forcedVersionId);
    const activeVersionId = displayItem?.activeVersionId || "";
    row.dataset.activeVersionId = activeVersionId;
    if (entryKey) row.dataset.entryKey = entryKey;
    const title = String(displayItem?.title || item.title || "").trim();
    if (title) {
      const titleNode = document.createElement("strong");
      titleNode.className = "manager-montage-item-title";
      titleNode.textContent = title;
      row.appendChild(titleNode);
    }
    const versionBadge = context === "available" ? montageVersionBadge(item, forcedVersionId) : null;
    if (versionBadge) row.appendChild(versionBadge);
    const preview = document.createElement("div");
    preview.className = "manager-montage-preview";
    const previewText = document.createElement("div");
    previewText.className = "manager-montage-preview-text";
    previewText.textContent = montageEditedContent(item, forcedVersionId) || fullTextForPreview(displayItem) || title;
    preview.appendChild(previewText);
    const meta = document.createElement("span");
    meta.className = "manager-montage-meta";
    renderInlineSourceMeta(meta, item, [
      montageEditedContent(item, forcedVersionId) ? t("montage.sandboxEdited") : "",
      translatedCategoryPath(item.categoryId),
      window.MCP.formatLocalizedDate(displayItem.createdAt || item.createdAt, state.settings.language || "en")
    ]);
    row.append(preview, meta);
    row.addEventListener("mouseenter", () => {
      updatePreviewOverflowState(preview, previewText);
      startPreviewAutoScroll(preview, previewText);
    });
    row.addEventListener("mouseleave", () => stopPreviewAutoScroll(preview));
    row.addEventListener("focusin", () => {
      updatePreviewOverflowState(preview, previewText);
      startPreviewAutoScroll(preview, previewText);
    });
    row.addEventListener("focusout", () => stopPreviewAutoScroll(preview));
    return row;
  }

  function montageVersionBadge(item, forcedVersionId = "") {
    const versions = embeddedVersions(item);
    if (versions.length <= 1) return null;
    const activeId = forcedVersionId || montageActiveVersionId(item);
    const activeIndex = Math.max(0, versions.findIndex((version) => version.id === activeId));
    const button = document.createElement("button");
    button.type = "button";
    button.className = "manager-montage-version-badge";
    button.textContent = t("versioning.shortLabel", { number: activeIndex + 1 });
    button.title = t("versioning.showNextVersion");
    button.setAttribute("aria-label", t("versioning.showNextVersion"));
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const nextVersion = versions[(activeIndex + 1) % versions.length];
      montageState.versionIds[item.id] = nextVersion?.id || versions[0]?.id || "";
      montageState.finalDraft = "";
      renderMontage();
    });
    return button;
  }

  function montageActiveVersionId(item) {
    const versions = embeddedVersions(item);
    if (!versions.length) return "";
    const remembered = montageState.versionIds[item.id];
    if (remembered && versions.some((version) => version.id === remembered)) return remembered;
    return versions[0]?.id || "";
  }

  function montageDisplayItem(item, forcedVersionId = "") {
    const versionId = forcedVersionId || montageActiveVersionId(item);
    return versionId ? itemDisplayVersionById(item, "text", versionId) : item;
  }

  function montageEditKey(item, forcedVersionId = "") {
    return `${item?.id || ""}:${forcedVersionId || montageActiveVersionId(item) || "base"}`;
  }

  function montageEditedContent(item, forcedVersionId = "") {
    return montageState.edits[montageEditKey(item, forcedVersionId)]?.content || "";
  }

  function montageSmallButton(label, action, itemId, disabled = false, title = label, entryKey = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.managerAction = action;
    button.dataset.itemId = itemId;
    if (entryKey) button.dataset.entryKey = entryKey;
    button.textContent = label;
    button.title = title;
    button.disabled = disabled;
    return button;
  }

  function montageEntryKey(itemId = "", versionId = "") {
    return `${itemId || ""}::${versionId || "base"}`;
  }

  function montageEntryItemId(entryKey = "") {
    const value = String(entryKey || "");
    return value.includes("::") ? value.split("::")[0] : value;
  }

  function montageEntryVersionId(entryKey = "") {
    const value = String(entryKey || "");
    if (!value.includes("::")) return "";
    const versionId = value.split("::").slice(1).join("::");
    return versionId === "base" ? "" : versionId;
  }

  function startMontageDrag(event, itemId, source, entryKey = "") {
    const activeVersionId = event.currentTarget?.dataset?.activeVersionId || "";
    const dragKey = entryKey || montageEntryKey(itemId, activeVersionId);
    montageState.draggingId = dragKey;
    if (activeVersionId) montageState.versionIds[itemId] = activeVersionId;
    event.currentTarget.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", dragKey);
    event.dataTransfer.setData("application/x-ucp-source", source);
    event.dataTransfer.setData("application/x-ucp-version-id", activeVersionId);
  }

  function addMontageItem(itemId, versionId = "") {
    const entryKey = montageEntryKey(itemId, versionId);
    if (!itemId || montageState.itemIds.includes(entryKey) || montageState.itemIds.includes(itemId)) return;
    if (versionId) montageState.versionIds[itemId] = versionId;
    montageState.itemIds.push(entryKey);
    montageState.finalDraft = "";
    renderMontage();
    showManagerToast(t("montage.added"));
  }

  function addAllMontageItems() {
    const selected = new Set(montageState.itemIds);
    const additions = montageAvailableItems(selected).map((entry) => montageEntryKey(entry.item.id, entry.versionId));
    if (!additions.length) {
      showManagerToast(t("montage.noAvailable"));
      return;
    }
    montageState.itemIds = [...montageState.itemIds, ...additions];
    montageState.finalDraft = "";
    renderMontage();
    showManagerToast(t("montage.addedAll", { count: additions.length }));
  }

  function removeMontageItem(entryKey) {
    const itemId = montageEntryItemId(entryKey);
    montageState.itemIds = montageState.itemIds.filter((id) => id !== entryKey && id !== itemId);
    const editKey = `${itemId}:${montageEntryVersionId(entryKey) || "base"}`;
    delete montageState.edits[editKey];
    montageState.finalDraft = "";
    renderMontage();
  }

  function moveMontageItem(entryKey, direction) {
    const index = montageState.itemIds.indexOf(entryKey);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= montageState.itemIds.length) return;
    const ids = [...montageState.itemIds];
    [ids[index], ids[nextIndex]] = [ids[nextIndex], ids[index]];
    montageState.itemIds = ids;
    montageState.finalDraft = "";
    renderMontage();
  }

  function reorderMontage(sourceKey, targetKey) {
    if (!sourceKey || !targetKey || sourceKey === targetKey) return;
    const ids = montageState.itemIds.filter((id) => id !== sourceKey);
    const targetIndex = ids.indexOf(targetKey);
    ids.splice(Math.max(0, targetIndex), 0, sourceKey);
    montageState.itemIds = ids;
    montageState.finalDraft = "";
    montageState.draggingId = "";
    renderMontage();
  }

  function handleMontageChainDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleMontageChainDrop(event) {
    event.preventDefault();
    const sourceId = montageState.draggingId || event.dataTransfer.getData("text/plain");
    const targetRow = event.target.closest(".manager-montage-item");
    if (targetRow?.dataset.itemId) {
      insertMontageItemAt(sourceId, insertionIndexFromDrop(targetRow, event));
    } else {
      insertMontageItemAt(sourceId, montageState.itemIds.length);
    }
  }

  function insertionIndexFromDrop(row, event) {
    const targetId = row.dataset.entryKey || row.dataset.itemId;
    const baseIndex = montageState.itemIds.indexOf(targetId);
    if (baseIndex < 0) return montageState.itemIds.length;
    const rect = row.getBoundingClientRect();
    return event.clientY > rect.top + rect.height / 2 ? baseIndex + 1 : baseIndex;
  }

  function insertMontageItemAt(entryKey, index) {
    const itemId = montageEntryItemId(entryKey);
    if (!itemId || !state.items.some((item) => item.id === itemId)) return;
    const normalizedKey = entryKey.includes("::") ? entryKey : montageEntryKey(itemId, montageEntryVersionId(entryKey) || montageState.versionIds[itemId] || "");
    const nextIds = montageState.itemIds.filter((id) => id !== normalizedKey && id !== entryKey);
    nextIds.splice(Math.max(0, Math.min(index, nextIds.length)), 0, normalizedKey);
    montageState.itemIds = nextIds;
    montageState.draggingId = "";
    montageState.finalDraft = "";
    renderMontage();
  }

  function getMontageItemContent(item, versionId = "") {
    return montageEditedContent(item, versionId) || montageDisplayItem(item, versionId)?.content || "";
  }

  function buildMontageContent() {
    if (montageState.finalDraft.trim()) return montageState.finalDraft;
    const itemsById = new Map((state.items || []).map((item) => [item.id, item]));
    const pieces = montageState.itemIds
      .map((entryKey) => {
        const item = itemsById.get(montageEntryItemId(entryKey));
        return item ? { item, versionId: montageEntryVersionId(entryKey) } : null;
      })
      .filter(Boolean)
      .map((entry, index) => {
        const content = getMontageItemContent(entry.item, entry.versionId).trim();
        if (!content) return "";
        if (montageState.format === "numbered") return `${index + 1}. ${content}`;
        if (montageState.format === "bullets") return `- ${content}`;
        if (montageState.format === "sections") return `--- ${t("montage.section")} ${index + 1} ---\n${content}`;
        if (montageState.format === "markdown") return `## ${t("montage.section")} ${index + 1}\n\n${content}`;
        return content;
      })
      .filter(Boolean);
    if (montageState.format === "spaced") return pieces.join("\n\n---\n\n");
    return pieces.join("\n\n");
  }

  function polishMontage() {
    const itemsById = new Map((state.items || []).map((item) => [item.id, item]));
    montageState.itemIds.forEach((entryKey) => {
      const item = itemsById.get(montageEntryItemId(entryKey));
      if (!item) return;
      const versionId = montageEntryVersionId(entryKey);
      const content = getMontageItemContent(item, versionId)
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      montageState.edits[montageEditKey(item, versionId)] = { content };
    });
    montageState.finalDraft = "";
    renderMontage();
    showManagerToast(t("montage.polished"));
  }

  async function copyMontage() {
    const content = buildMontageContent();
    if (!content.trim()) {
      showManagerToast(t("montage.emptyCopy"));
      return;
    }
    await window.MCP.writeClipboardText(content);
    const copyButton = document.querySelector("#managerMontageModal [data-manager-action='copy-montage']");
    if (copyButton) {
      copyButton.textContent = t("montage.copyButtonReady");
      triggerMicroAnimation(copyButton, "success-pulse", 440);
    }
    showManagerToast(t("montage.readyToPaste"));
  }

  async function saveCurrentMontageAsText() {
    const content = buildMontageContent();
    if (!content.trim()) {
      showManagerToast(t("montage.emptyCopy"));
      return;
    }
    await saveMontageAsText(content);
  }

  async function saveMontageAsText(content) {
    const general = state.categories.find((category) => category.id === "general") || window.MCP.CATEGORY_GENERAL;
    await window.MCP.saveClipboardItem({
      title: t("montage.title"),
      content,
      type: "text",
      categoryId: general.id,
      categoryName: general.name,
      sourceTitle: t("montage.title"),
      tags: ["montage"]
    });
    await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.STORAGE_REFRESH_REQUIRED }).catch(() => null);
    await loadState();
    showManagerToast(t("montage.savedAsText"));
  }

  function clearMontage() {
    montageState.itemIds = [];
    montageState.versionIds = {};
    montageState.edits = {};
    montageState.finalDraft = "";
    renderMontage();
    const copyButton = document.querySelector("#managerMontageModal [data-manager-action='copy-montage']");
    if (copyButton) copyButton.textContent = t("montage.copyCombined");
  }

  function closeMontage() {
    const modal = document.getElementById("managerMontageModal");
    if (modal) modal.hidden = true;
  }

  function openMontageFinalEditor() {
    const content = buildMontageContent();
    if (!content.trim()) {
      showManagerToast(t("montage.emptyCopy"));
      return;
    }
    let modal = document.getElementById("managerMontageFinalModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerMontageFinalModal";
      modal.className = "mcp-editor-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-montage-final-editor\"></div>",
        "<section class=\"manager-montage-final-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><div><strong data-role=\"montage-final-title\"></strong><p data-role=\"montage-final-subtitle\"></p></div><button type=\"button\" data-manager-action=\"close-montage-final-editor\" aria-label=\"Close\">&times;</button></header>",
        "<textarea id=\"managerMontageFinalContent\" spellcheck=\"true\"></textarea>",
        "<footer><button type=\"button\" data-manager-action=\"close-montage-final-editor\"></button><button type=\"button\" data-manager-action=\"save-montage-final-editor\"></button><button type=\"button\" class=\"primary\" data-manager-action=\"copy-montage-final-editor\"></button></footer>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
      modal.querySelector("#managerMontageFinalContent")?.addEventListener("input", () => {
        const copyButton = modal.querySelector("[data-manager-action='copy-montage-final-editor']");
        if (copyButton) copyButton.textContent = t("montage.copyCombined");
      });
    }
    modal.hidden = false;
    translateMontageFinalEditor(modal);
    modal.querySelector("#managerMontageFinalContent").value = content;
    modal.querySelector("#managerMontageFinalContent").focus();
    triggerMicroAnimation(modal.querySelector(".manager-montage-final-card"), "success-pulse", 440);
  }

  function translateMontageFinalEditor(modal) {
    modal.querySelector("[data-role='montage-final-title']").textContent = t("montage.finalEditor");
    modal.querySelector("[data-role='montage-final-subtitle']").textContent = t("montage.finalEditorSubtitle");
    modal.querySelector("footer [data-manager-action='close-montage-final-editor']").textContent = t("common.cancel");
    modal.querySelector("[data-manager-action='save-montage-final-editor']").textContent = t("montage.copyToGeneral");
    modal.querySelector("[data-manager-action='copy-montage-final-editor']").textContent = t("montage.copyCombined");
  }

  function montageFinalTextarea() {
    return document.getElementById("managerMontageFinalContent");
  }

  function currentFinalEditorContent() {
    return String(montageFinalTextarea()?.value || "").trim();
  }

  async function copyMontageFinalDraft() {
    const content = currentFinalEditorContent();
    if (!content) {
      showManagerToast(t("editor.emptyContent"));
      return;
    }
    montageState.finalDraft = content;
    await window.MCP.writeClipboardText(content);
    const copyButton = document.querySelector("[data-manager-action='copy-montage-final-editor']");
    if (copyButton) {
      copyButton.textContent = t("montage.copyButtonReady");
      triggerMicroAnimation(copyButton, "success-pulse", 440);
    }
    showManagerToast(t("montage.readyToPaste"));
  }

  async function saveMontageFinalDraftAsText() {
    const content = currentFinalEditorContent();
    if (!content) {
      showManagerToast(t("editor.emptyContent"));
      return;
    }
    montageState.finalDraft = content;
    await saveMontageAsText(content);
  }

  function closeMontageFinalEditor() {
    const modal = document.getElementById("managerMontageFinalModal");
    if (modal) modal.hidden = true;
  }

  function openMontageSandboxEditor(itemId, versionId = "") {
    const item = state.items.find((current) => current.id === itemId);
    if (!item) return;
    montageEditingId = itemId;
    montageEditingVersionId = versionId;
    let modal = document.getElementById("managerMontageEditModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerMontageEditModal";
      modal.className = "manager-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-montage-edit\"></div>",
        "<section class=\"manager-editor-card manager-montage-edit-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"montage-edit-title\"></strong><button type=\"button\" data-manager-action=\"close-montage-edit\" aria-label=\"Close\">&times;</button></header>",
        "<p class=\"manager-montage-edit-note\" data-role=\"montage-edit-note\"></p>",
        "<textarea id=\"managerMontageEditContent\" rows=\"14\"></textarea>",
        "<footer><button type=\"button\" data-manager-action=\"close-montage-edit\"></button><button type=\"button\" class=\"primary\" data-manager-action=\"save-montage-edit\"></button></footer>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
    }
    modal.hidden = false;
    modal.querySelector("[data-role='montage-edit-title']").textContent = t("montage.editSandbox");
    modal.querySelector("[data-role='montage-edit-note']").textContent = t("montage.sandboxNotice");
    modal.querySelector("footer [data-manager-action='close-montage-edit']").textContent = t("common.cancel");
    modal.querySelector("[data-manager-action='save-montage-edit']").textContent = t("common.save");
    const textarea = modal.querySelector("#managerMontageEditContent");
    textarea.value = getMontageItemContent(item, versionId);
    textarea.focus();
    triggerMicroAnimation(modal.querySelector(".manager-montage-edit-card"), "success-pulse", 440);
  }

  function saveMontageSandboxEdit() {
    const modal = document.getElementById("managerMontageEditModal");
    const item = state.items.find((current) => current.id === montageEditingId);
    if (!modal || !item) return;
    const content = modal.querySelector("#managerMontageEditContent").value.trim();
    if (!content) {
      showManagerToast(t("editor.emptyContent"));
      return;
    }
    montageState.edits[montageEditKey(item, montageEditingVersionId)] = { content };
    closeMontageSandboxEditor();
    renderMontage();
    showManagerToast(t("montage.sandboxSaved"));
  }

  function closeMontageSandboxEditor() {
    const modal = document.getElementById("managerMontageEditModal");
    if (modal) modal.hidden = true;
    montageEditingId = "";
    montageEditingVersionId = "";
  }

  async function openManagerSearch() {
    if (!isDemoMode()) await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.CLOSE_FLOATING_PANEL }).catch(() => null);
    triggerMicroAnimation(elements.openManagerMenu || elements.openMontage, "success-pulse", 440);
    managerSearchState = { query: "", selectedIndex: 0, filters: {}, mediaType: activeTab, dateKey: "", calendarMonth: "", results: [] };
    let modal = document.getElementById("managerSearchModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerSearchModal";
      modal.className = "manager-modal manager-search-modal";
      modal.innerHTML = [
        "<div class=\"mcp-search-backdrop\" data-manager-action=\"close-search\"></div>",
        "<section class=\"manager-search-card manager-search-advanced-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"search-title\"></strong><button type=\"button\" data-manager-action=\"close-search\" aria-label=\"Close\">X</button></header>",
        "<div class=\"manager-search-tabs\" data-role=\"search-tabs\"></div>",
        "<input id=\"managerSearchInput\" class=\"manager-modal-search\" type=\"search\">",
        "<div class=\"manager-search-filters\" data-role=\"search-filters\"></div>",
        "<div class=\"manager-search-layout\">",
        "<div id=\"managerSearchResults\" class=\"manager-search-results\" data-role=\"search-results\"></div>",
        "<div id=\"managerSearchDetail\" class=\"manager-search-detail\" data-role=\"search-detail\"></div>",
        "</div>",
        "<div class=\"manager-search-date-modal\" data-role=\"manager-search-date-modal\" hidden>",
        "<div class=\"manager-search-date-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"manager-search-date-head\"><div><strong data-role=\"manager-search-date-title\"></strong><p data-role=\"manager-search-date-subtitle\"></p></div><button type=\"button\" data-manager-action=\"close-search-date-calendar\" data-role=\"manager-search-date-close\" aria-label=\"Close\">&times;</button></header>",
        "<div class=\"manager-search-date-controls\"><button type=\"button\" data-manager-action=\"search-date-prev\" data-role=\"manager-search-date-prev\"></button><select data-role=\"manager-search-date-month\"></select><input type=\"number\" data-role=\"manager-search-date-year\" min=\"1970\" max=\"9999\"><button type=\"button\" data-manager-action=\"search-date-next\" data-role=\"manager-search-date-next\"></button></div>",
        "<div class=\"manager-search-calendar-weekdays\" data-role=\"manager-search-date-weekdays\"></div>",
        "<div class=\"manager-search-calendar-grid\" data-role=\"manager-search-date-grid\"></div>",
        "</div>",
        "</div>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
      modal.querySelector("#managerSearchInput").addEventListener("input", (event) => {
        managerSearchState.query = event.target.value;
        managerSearchState.selectedIndex = 0;
        renderManagerSearch();
      });
      modal.querySelector("#managerSearchResults").addEventListener("scroll", handleVirtualManagerSearchScroll, { passive: true });
      modal.querySelector("[data-role='manager-search-date-month']").addEventListener("change", (event) => {
        setManagerSearchCalendarMonth(Number(event.target.value), Number(modal.querySelector("[data-role='manager-search-date-year']")?.value));
      });
      modal.querySelector("[data-role='manager-search-date-year']").addEventListener("change", (event) => {
        setManagerSearchCalendarMonth(Number(modal.querySelector("[data-role='manager-search-date-month']")?.value), Number(event.target.value));
      });
    }
    translateManagerSearch(modal);
    modal.hidden = false;
    renderManagerSearch();
    modal.querySelector("#managerSearchInput")?.focus();
  }

  function translateManagerSearch(modal) {
    modal.querySelector("[data-role='search-title']").textContent = t("search.advanced");
    const close = modal.querySelector("[data-manager-action='close-search']");
    if (close) close.setAttribute("aria-label", t("common.close"));
    const input = modal.querySelector("#managerSearchInput");
    if (input) {
      input.placeholder = t("search.placeholder");
      input.setAttribute("aria-label", t("search.placeholder"));
    }
  }

  function openManagerClassifier(item, mediaType = "text") {
    managerClassifyState = { item, mediaType, query: "" };
    let modal = document.getElementById("managerClassifierModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerClassifierModal";
      modal.className = "manager-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-classifier\"></div>",
        "<section class=\"manager-category-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"classifier-title\"></strong><button type=\"button\" data-manager-action=\"close-classifier\" aria-label=\"Close\">&times;</button></header>",
        "<input id=\"managerCategorySearch\" class=\"manager-modal-search\" type=\"search\">",
        "<div class=\"manager-category-results\" id=\"managerCategoryResults\"></div>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
      modal.querySelector("#managerCategorySearch").addEventListener("input", (event) => {
        managerClassifyState.query = event.target.value;
        renderManagerCategoryChooser();
      });
    }
    modal.hidden = false;
    modal.querySelector("[data-role='classifier-title']").textContent = t("categories.classify");
    const input = modal.querySelector("#managerCategorySearch");
    input.placeholder = t("categories.search");
    input.value = "";
    renderManagerCategoryChooser();
    input.focus();
  }

  function renderManagerCategoryChooser() {
    const modal = document.getElementById("managerClassifierModal");
    if (!modal || !managerClassifyState.item) return;
    const node = modal.querySelector("#managerCategoryResults");
    const query = window.MCP.normalizeContent(managerClassifyState.query);
    const categories = managerClassifyState.mediaType === "image" ? state.imageCategories : managerClassifyState.mediaType === "dev" ? state.devCategories || [] : state.categories;
    const tree = buildTreeFromCategories(categories);
    node.replaceChildren();
    const quick = categories.find((category) => category.id === (managerClassifyState.mediaType === "image" ? "image-general" : managerClassifyState.mediaType === "dev" ? "dev-general" : "general"));
    if (quick && !query) {
      node.appendChild(managerCategoryChoice(quick, 0));
    }
    renderManagerCategoryTree(tree, node, 0, query);
  }

  function renderManagerCategoryTree(nodes, container, depth, query = "") {
    nodes.forEach((category) => {
      if (category.isDefault && !query) return;
      const matchesQuery = !query || categoryMatchesQuery(category, query);
      if (query && !matchesQuery) return;
      const expandForQuery = Boolean(query && category.children?.some((child) => categoryMatchesQuery(child, query)));
      const classifierDragMode = managerClassifyState.mediaType === "image" ? "image" : managerClassifyState.mediaType === "dev" ? "dev" : "category";
      const canDragCategory = managerClassifyState.mediaType === "dev"
        ? !category.isDefault && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id)
        : !category.isSystem && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id);
      const row = document.createElement("div");
      row.className = `manager-category-row ${canDragCategory ? "" : "is-locked"}`;
      row.style.setProperty("--depth", String(depth));
      row.dataset.categoryId = category.id;
      row.dataset.parentId = category.parentId || "";
      row.draggable = canDragCategory;
      row.addEventListener("dragstart", (event) => startCategoryDrag(event, category, classifierDragMode));
      row.addEventListener("dragover", (event) => handleCategoryDragOver(event, category));
      row.addEventListener("dragleave", handleCategoryDragLeave);
      row.addEventListener("drop", (event) => handleCategoryDrop(event, category, classifierDragMode));
      row.addEventListener("dragend", handleCategoryDragEnd);
      const dragHandle = canDragCategory ? document.createElement("button") : null;
      if (dragHandle) {
        dragHandle.type = "button";
        dragHandle.className = "manager-category-drag";
        dragHandle.textContent = "::";
        dragHandle.setAttribute("aria-label", t("categories.drag"));
        dragHandle.draggable = true;
        dragHandle.addEventListener("dragstart", (event) => startCategoryDrag(event, category, classifierDragMode));
        dragHandle.addEventListener("dragend", handleCategoryDragEnd);
      }
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "manager-category-toggle";
      toggle.dataset.managerToggleCategoryId = category.id;
      toggle.textContent = category.children?.length ? (managerClassifierExpanded.has(category.id) || expandForQuery ? "v" : ">") : "";
      const choice = managerCategoryChoice(category, depth);
      row.append(...[dragHandle, toggle, choice].filter(Boolean));
      container.appendChild(row);
      if ((managerClassifierExpanded.has(category.id) || expandForQuery) && category.children?.length) {
        renderManagerCategoryTree(category.children, container, depth + 1, query);
      }
    });
  }

  function managerCategoryChoice(category, depth) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "manager-category-choice";
    button.dataset.managerCategoryId = category.id;
    button.style.setProperty("--depth", String(depth));
    const classifierDragMode = managerClassifyState.mediaType === "image" ? "image" : managerClassifyState.mediaType === "dev" ? "dev" : "category";
    button.draggable = managerClassifyState.mediaType === "dev"
      ? !category.isDefault && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id)
      : !category.isDefault && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id) && !isVaultCategoryId(category.id);
    button.addEventListener("dragstart", (event) => startCategoryDrag(event, category, classifierDragMode));
    button.addEventListener("dragover", (event) => handleCategoryDragOver(event, category));
    button.addEventListener("dragleave", handleCategoryDragLeave);
    button.addEventListener("drop", (event) => handleCategoryDrop(event, category, classifierDragMode));
    button.addEventListener("dragend", handleCategoryDragEnd);
    const dot = document.createElement("span");
    let icon = null;
    if (isTrashCategoryId(category.id)) {
      icon = createTrashCategoryIcon();
    } else if (isFavoriteCategoryId(category.id)) {
      dot.className = "category-heart";
      dot.textContent = "\u2665";
      dot.style.backgroundColor = "transparent";
      icon = dot;
    } else if (isVaultCategoryId(category.id)) {
      icon = createVaultCategoryIcon();
    } else {
      dot.className = "category-dot";
      if (!category.parentId) icon = dot;
    }
    const count = categoryCountNode(category.id, managerClassifyState.mediaType);
    const label = document.createElement("span");
    label.textContent = categoryPathFor(category, managerClassifyState.mediaType === "image" ? state.imageCategories : managerClassifyState.mediaType === "dev" ? state.devCategories || [] : state.categories);
    if (icon) button.appendChild(icon);
    if (isTrashCategoryId(category.id) && !canUseTrashManagement()) button.appendChild(createCategoryProBadge());
    if (isVaultCategoryId(category.id) && !canUseVault()) button.appendChild(createCategoryProBadge());
    button.appendChild(label);
    if (count) button.appendChild(count);
    return button;
  }

  async function assignManagerCategory(categoryId) {
    const item = managerClassifyState.item;
    const mediaType = managerClassifyState.mediaType;
    const categories = mediaType === "image" ? state.imageCategories : mediaType === "dev" ? state.devCategories || [] : state.categories;
    const category = categories.find((current) => current.id === categoryId);
    if (!item || !category) return;
    if (isTrashCategoryId(category.id)) {
      if (!canUseTrashManagement()) {
        openManagerProUpgradeModal("trashManagement");
        showManagerToast(t("pro.trashRequired"));
        return;
      }
      const moved = await moveManagerItemToTrash(item, mediaType);
      if (moved) closeManagerClassifier();
      return;
    }
    if (isVaultCategoryId(category.id)) {
      if (!canUseVault()) {
        openManagerProUpgradeModal("vault");
        showManagerToast(t("pro.vaultRequired"));
        return;
      }
      const unlocked = await ensureManagerVaultUnlocked();
      if (!unlocked) return;
    }
    if (isTrashCategoryId(item.categoryId) && isFavoriteCategoryId(category.id)) {
      showManagerToast(t("trash.restoreFirst"));
      return;
    }
    if (isFavoriteCategoryId(category.id)) {
      if (mediaType === "image") await updateImage(item.id, { isFavorite: true });
      else if (mediaType === "dev") await updateDev(item.id, { isFavorite: true });
      else await updateItem(item.id, { isFavorite: true });
    } else {
      const updates = { categoryId: category.id, categoryName: category.name };
      if (mediaType === "image") {
        await updateImage(item.id, updates);
      } else if (mediaType === "dev") {
        await updateDev(item.id, Object.assign({}, updates, { languageId: category.id, languageName: category.name }));
      } else {
        await updateItem(item.id, updates);
      }
    }
    closeManagerClassifier();
    showStatus(isFavoriteCategoryId(category.id) ? t("common.favoriteAdd") : t("categories.classifiedIn", { path: categoryPathFor(category, categories) }));
  }

  function closeManagerClassifier() {
    const modal = document.getElementById("managerClassifierModal");
    if (modal) modal.hidden = true;
    managerClassifyState = { item: null, mediaType: "text", query: "" };
  }

  function closeManagerSearch() {
    const modal = document.getElementById("managerSearchModal");
    cancelManagerSearchRenderJob();
    closeManagerSearchDateCalendar();
    if (modal) modal.hidden = true;
  }

  function openSourceTimelineModal() {
    sourceTimelineMediaType = ["text", "dev", "image"].includes(activeTab) ? activeTab : sourceTimelineMediaType || "text";
    let modal = document.getElementById("managerSourceTimelineModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerSourceTimelineModal";
      modal.className = "manager-modal manager-source-timeline-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-source-timeline\"></div>",
        "<section class=\"manager-source-timeline-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"source-timeline-title\"></strong><button type=\"button\" data-manager-action=\"close-source-timeline\" aria-label=\"Close\">X</button></header>",
        "<div class=\"manager-source-timeline-toolbar\"><div class=\"manager-source-timeline-summary\" data-role=\"source-timeline-summary\"></div><div class=\"manager-source-timeline-tabs\" data-role=\"source-timeline-tabs\"></div><div class=\"manager-source-timeline-sort\" data-role=\"source-timeline-sort\"></div></div>",
        "<div class=\"manager-source-timeline-body\"><aside class=\"manager-source-timeline-list\" data-role=\"source-timeline-list\"></aside><section class=\"manager-source-timeline-detail\" data-role=\"source-timeline-detail\"></section></div>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
    }
    const toolbar = modal.querySelector(".manager-source-timeline-toolbar");
    const sort = modal.querySelector("[data-role='source-timeline-sort']");
    let tabs = modal.querySelector("[data-role='source-timeline-tabs']");
    if (!tabs) {
      tabs = document.createElement("div");
      tabs.className = "manager-source-timeline-tabs";
      tabs.dataset.role = "source-timeline-tabs";
      toolbar?.insertBefore(tabs, sort || null);
    } else if (toolbar && tabs.parentElement !== toolbar) {
      toolbar.insertBefore(tabs, sort || null);
    }
    modal.querySelector("[data-role='source-timeline-title']").textContent = t("sourceTimeline.title");
    renderSourceTimeline(modal);
    modal.hidden = false;
    triggerMicroAnimation(modal.querySelector(".manager-source-timeline-card"), "soft-bounce", 280);
  }

  function closeSourceTimelineModal() {
    cancelSourceTimelineRenderJob();
    const modal = document.getElementById("managerSourceTimelineModal");
    if (modal) modal.hidden = true;
  }

  function renderSourceTimeline(modal) {
    cancelSourceTimelineRenderJob();
    renderSourceTimelineTabs(modal.querySelector("[data-role='source-timeline-tabs']"));
    const items = sourceTimelineItems();
    const groups = sortSourceTimelineGroups(groupSourceTimelineItems(items));
    modal.querySelector("[data-role='source-timeline-summary']").textContent = t("sourceTimeline.summary", { count: items.length, domains: groups.length });
    renderSourceTimelineSortControls(modal.querySelector("[data-role='source-timeline-sort']"));
    const list = modal.querySelector("[data-role='source-timeline-list']");
    const detail = modal.querySelector("[data-role='source-timeline-detail']");
    if (!groups.length) {
      list.replaceChildren();
      renderSourceTimelineToolbarSummary(modal, null, items.length, groups.length);
      detail.textContent = t("sourceTimeline.empty");
      return;
    }
    renderSourceTimelineToolbarSummary(modal, groups[0], items.length, groups.length);
    list.replaceChildren(...groups.map((group, index) => sourceTimelineGroupButton(group, index === 0)));
    renderSourceTimelineDetail(detail, groups[0]);
  }

  function renderSourceTimelineTabs(node) {
    if (!node) return;
    const tabs = [
      ["text", t("tabs.text"), "../assets/icons/text_icon.png"],
      ["dev", t("tabs.dev"), "../assets/icons/dev.png"],
      ["image", t("images.tab"), "../assets/icons/images_icon.png"]
    ];
    node.replaceChildren(...tabs.map(([id, label, iconSrc]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.managerAction = "source-timeline-tab";
      button.dataset.sourceTimelineTab = id;
      button.setAttribute("aria-label", label);
      button.title = label;
      button.className = sourceTimelineMediaType === id ? "is-active" : "";
      const icon = document.createElement("img");
      icon.className = "tab-icon";
      icon.src = iconSrc;
      icon.alt = "";
      icon.setAttribute("aria-hidden", "true");
      const text = document.createElement("span");
      text.className = "sr-only";
      text.textContent = label;
      button.append(icon, text);
      return button;
    }));
  }

  function renderSourceTimelineToolbarSummary(modal, group, itemCount = 0, groupCount = 0) {
    const node = modal?.querySelector("[data-role='source-timeline-summary']");
    if (!node) return;
    if (!group) {
      node.textContent = t("sourceTimeline.summary", { count: itemCount, domains: groupCount });
      return;
    }
    const title = document.createElement("strong");
    const favicon = window.MCP.createSourceFaviconImage?.(group.faviconItem || { sourceUrl: group.sourceUrl, sourceDomain: group.domain });
    if (favicon) title.appendChild(favicon);
    title.append(document.createTextNode(group.domain));
    const subtitle = document.createElement("span");
    subtitle.textContent = t("sourceTimeline.detailSubtitle", { count: group.count });
    node.replaceChildren(title, subtitle);
  }

  function renderSourceTimelineSortControls(node) {
    if (!node) return;
    const modes = [
      ["date", "sourceTimeline.sortDate"],
      ["url", "sourceTimeline.sortUrl"],
      ["count", "sourceTimeline.sortCount"]
    ];
    node.replaceChildren(...modes.map(([mode, key]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.managerAction = "source-timeline-sort";
      button.dataset.sourceTimelineSort = mode;
      button.className = sourceTimelineSortMode === mode ? "is-active" : "";
      button.textContent = t(key);
      return button;
    }));
  }

  function sourceTimelineItems() {
    const items = sourceTimelineMediaType === "image"
      ? (state.imageItems || []).map((item) => Object.assign({ mediaType: "image" }, item))
      : sourceTimelineMediaType === "dev"
        ? (state.devItems || []).map((item) => Object.assign({ mediaType: "dev" }, item))
        : (state.items || []).map((item) => Object.assign({ mediaType: "text" }, item));
    return items.filter((item) => !isVaultCategoryId(item.categoryId) && !isVaultCategoryId(item.languageId) && (item.sourceUrl || item.sourceDomain || item.sourceTitle))
      .sort((left, right) => Number(right.createdAt || 0) - Number(left.createdAt || 0));
  }

  function groupSourceTimelineItems(items) {
    const map = new Map();
    items.forEach((item) => {
      const key = item.sourceDomain || window.MCP.getDomain?.(item.sourceUrl || "") || t("sourceTimeline.localSource");
      if (!map.has(key)) map.set(key, { domain: key, sourceUrl: item.sourceUrl || "", faviconItem: item, count: 0, lastAt: 0, items: [] });
      const group = map.get(key);
      group.count += 1;
      group.lastAt = Math.max(group.lastAt, Number(item.createdAt || 0));
      if (!group.sourceUrl && item.sourceUrl) group.sourceUrl = item.sourceUrl;
      if (!group.faviconItem?.sourceFaviconUrl && (item.sourceFaviconUrl || item.sourceUrl)) group.faviconItem = item;
      group.items.push(item);
    });
    return [...map.values()].sort((left, right) => right.lastAt - left.lastAt);
  }

  function sortSourceTimelineGroups(groups) {
    const collator = new Intl.Collator(state.settings.language || "en", { sensitivity: "base", numeric: true });
    return [...groups].sort((left, right) => {
      if (sourceTimelineSortMode === "count") {
        return right.count - left.count || right.lastAt - left.lastAt || collator.compare(left.domain, right.domain);
      }
      if (sourceTimelineSortMode === "url") {
        return collator.compare(left.domain, right.domain) || right.lastAt - left.lastAt;
      }
      return right.lastAt - left.lastAt || right.count - left.count || collator.compare(left.domain, right.domain);
    });
  }

  function sourceTimelineGroupButton(group, selected = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `manager-source-timeline-domain ${selected ? "is-active" : ""}`;
    const title = document.createElement("strong");
    title.title = group.domain;
    if (String(group.domain || "").length > 24) title.classList.add("is-marquee-ready");
    const titleText = document.createElement("span");
    const favicon = window.MCP.createSourceFaviconImage?.(group.faviconItem || { sourceUrl: group.sourceUrl, sourceDomain: group.domain });
    if (favicon) title.appendChild(favicon);
    titleText.textContent = group.domain;
    title.appendChild(titleText);
    const meta = document.createElement("span");
    meta.textContent = t("sourceTimeline.domainMeta", { count: group.count, date: window.MCP.formatLocalizedDate(group.lastAt, state.settings.language || "en") });
    button.append(title, meta);
    button.addEventListener("click", () => {
      document.querySelectorAll(".manager-source-timeline-domain").forEach((node) => node.classList.toggle("is-active", node === button));
      renderSourceTimelineToolbarSummary(document.getElementById("managerSourceTimelineModal"), group);
      renderSourceTimelineDetail(document.querySelector("[data-role='source-timeline-detail']"), group);
    });
    return button;
  }

  function isVersioningEnabled() {
    return window.MCP.canUseFeature ? window.MCP.canUseFeature("captureVersioning", state.settings) : window.MCP.isProPlan?.(state.settings);
  }

  function closeVersioningModal() {
    document.getElementById("managerVersioningModal")?.setAttribute("hidden", "");
  }

  function versioningIconName(forceDark = false) {
    if (forceDark) return "versioning-darkmode.png";
    return document.documentElement.getAttribute("data-resolved-theme") === "light" ? "versioning-lightmode.png" : "versioning-darkmode.png";
  }

  function versionableEditorChanged(modal) {
    if (!editingItem || !modal) return false;
    const content = modal.querySelector("#managerEditorContent").value.trim();
    const note = modal.querySelector("#managerEditorNote").value.trim();
    const reference = itemDisplayVersion(editingItem, editingItem.mediaType === "dev" ? "dev" : "text");
    return content !== (reference.content || "")
      || note !== (reference.note || "");
  }

  async function askCreateCaptureVersion() {
    return openManagerConfirmDialog({
      title: t("versioning.title"),
      message: t("versioning.createQuestion"),
      confirmText: t("versioning.yes"),
      cancelText: t("versioning.saveOnly")
    });
  }

  async function createEmbeddedCaptureVersion(updates, isDev) {
    await createEmbeddedCaptureVersionForItem(editingItem, isDev ? "dev" : "text", updates, editorVersionSelection || currentEmbeddedVersionId(editingItem, isDev ? "dev" : "text"));
  }

  async function createEmbeddedCaptureVersionForItem(sourceItem, mediaType, updates, activeVersionId = "") {
    if (!sourceItem?.id) return;
    const isDev = mediaType === "dev";
    const itemForVersion = sourceItem;
    const scrollTop = elements.items?.scrollTop || 0;
    const existingVersions = embeddedVersions(itemForVersion);
    const versions = existingVersions.length
      ? existingVersions
      : [versionSnapshotFromItem(itemForVersion, t("versioning.sourceCapture"), itemForVersion.createdAt || Date.now())];
    if (versions.length >= MAX_CAPTURE_VERSIONS) {
      await saveEmbeddedCaptureEditForItem(itemForVersion, mediaType, updates, activeVersionId || currentEmbeddedVersionId(itemForVersion, mediaType));
      await openManagerConfirmDialog({
        title: t("versioning.maxVersionsTitle"),
        message: t("versioning.maxVersionsMessage", { count: MAX_CAPTURE_VERSIONS }),
        confirmText: t("common.close"),
        cancelText: null,
        icon: versioningIconName()
      });
      showStatus(t("versioning.maxVersionsSaved"));
      showManagerToast(t("versioning.maxVersionsSaved"));
      return;
    }
    const nextVersion = versionSnapshotFromUpdates(updates, t("versioning.versionLabel", { number: versions.length + 1 }));
    const nextVersions = [...versions, nextVersion];
    const itemUpdates = cleanSharedVersionUpdates(Object.assign({}, updates, {
      captureVersions: nextVersions,
      activeVersionId: nextVersion.id
    }));
    managerItemVersionSelection.set(itemForVersion.id, nextVersion.id);
    itemForVersion.captureVersions = nextVersions;
    itemForVersion.activeVersionId = nextVersion.id;
    itemForVersion.title = nextVersion.title || "";
    itemForVersion.content = nextVersion.content || "";
    itemForVersion.note = nextVersion.note || "";
    if (isDev) await window.MCP.updateDevItem(itemForVersion.id, itemUpdates);
    else await window.MCP.updateClipboardItem(itemForVersion.id, itemUpdates);
    await loadStatePreservingManagerScroll(scrollTop);
    managerItemVersionSelection.set(itemForVersion.id, nextVersion.id);
    pendingManagerItemsScrollTop = Math.max(0, Math.round(Number(scrollTop) || 0));
    pendingManagerCategoryScrollTop = Math.max(0, Math.round(elements.categories?.scrollTop || 0));
    renderItems();
    restoreManagerScrollPositions(8);
    persistManagerViewState();
    showStatus(t("versioning.created"));
    showManagerToast(t("versioning.created"));
  }

  async function saveEmbeddedCaptureEditForItem(sourceItem, mediaType, updates, activeVersionId = "") {
    if (!sourceItem?.id) return;
    const isDev = mediaType === "dev";
    const existing = embeddedVersions(sourceItem);
    const activeId = activeVersionId || currentEmbeddedVersionId(sourceItem, mediaType);
    if (!existing.length || !activeId) {
      if (isDev) await updateDev(sourceItem.id, updates);
      else await updateItem(sourceItem.id, updates);
      return;
    }
    const nextVersions = existing.map((version) => version.id === activeId
      ? Object.assign({}, version, {
        title: String(updates.title || "").slice(0, 30),
        content: updates.content || "",
        note: updates.note || "",
        updatedAt: Date.now()
      })
      : version);
    const nextActive = nextVersions.find((version) => version.id === activeId) || nextVersions[nextVersions.length - 1];
    const itemUpdates = cleanSharedVersionUpdates(Object.assign({}, updates, {
      title: nextActive.title || "",
      content: nextActive.content || "",
      note: nextActive.note || "",
      captureVersions: nextVersions,
      activeVersionId: nextActive.id
    }));
    if (isDev) await updateDev(sourceItem.id, itemUpdates);
    else await updateItem(sourceItem.id, itemUpdates);
    managerItemVersionSelection.set(sourceItem.id, nextActive.id);
    persistManagerViewState();
  }

  async function saveEmbeddedCaptureEdit(updates, isDev) {
    const existing = embeddedVersions(editingItem);
    const activeId = editorVersionSelection || currentEmbeddedVersionId(editingItem, isDev ? "dev" : "text");
    if (!existing.length || !activeId) {
      if (isDev) await updateDev(editingItem.id, updates);
      else await updateItem(editingItem.id, updates);
      return;
    }
    const nextVersions = existing.map((version) => version.id === activeId
      ? Object.assign({}, version, {
        title: String(updates.title || "").slice(0, 30),
        content: updates.content || "",
        note: updates.note || "",
        updatedAt: Date.now()
      })
      : version);
    const nextActive = nextVersions.find((version) => version.id === activeId) || nextVersions[nextVersions.length - 1];
    const itemUpdates = cleanSharedVersionUpdates(Object.assign({}, updates, {
      title: nextActive.title || "",
      content: nextActive.content || "",
      note: nextActive.note || "",
      captureVersions: nextVersions,
      activeVersionId: nextActive.id
    }));
    if (isDev) await updateDev(editingItem.id, itemUpdates);
    else await updateItem(editingItem.id, itemUpdates);
    managerItemVersionSelection.set(editingItem.id, nextActive.id);
    persistManagerViewState();
  }

  function timelineMediaType(item) {
    return item?.mediaType === "image" ? "image" : item?.mediaType === "dev" ? "dev" : "text";
  }

  function jumpToTimelineCapture(item) {
    if (!item?.id) return;
    const mediaType = timelineMediaType(item);
    const jumpToken = startManagerJump(item.id, mediaType);
    if (mediaType !== "image" && item.__timelineVersionId) {
      const sourceItems = mediaType === "dev" ? state.devItems || [] : state.items || [];
      const sourceItem = sourceItems.find((candidate) => candidate.id === item.id);
      if (sourceItem) {
        managerItemVersionSelection.set(sourceItem.id, item.__timelineVersionId);
        sourceItem.activeVersionId = item.__timelineVersionId;
        persistManagerViewState();
      }
    }
    closeSourceTimelineModal();
    activeTab = mediaType;
    selectedCategory = isTrashCategoryId(item.categoryId) ? item.categoryId : "all";
    favoritesOnly = false;
    selectedIndex = 0;
    if (elements.search) elements.search.value = "";
    render();
    waitForManagerItemCard(item.id, mediaType).then((card) => {
      if (!isManagerJumpActive(jumpToken)) return;
      if (!card) {
        showManagerToast(t("editor.notFound"));
        finishManagerJump(jumpToken);
        return;
      }
      const targetCard = card.closest(".item-card, .image-card") || card;
      prepareManagerJumpCard(targetCard);
      centerManagerCardWithoutNativeAnimation(targetCard, jumpToken);
      window.setTimeout(() => {
        if (isManagerJumpActive(jumpToken)) highlightManagerJumpTarget(targetCard, item.id, mediaType);
      }, mediaType === "image" ? 420 : 720);
      waitForManagerCardReadyForHighlight(targetCard, mediaType, 84, jumpToken).then((ready) => {
        if (!ready || !isManagerJumpActive(jumpToken)) return;
        const currentCard = currentRenderedManagerCard(item.id, mediaType) || targetCard;
        currentCard.classList.add("is-selected");
        highlightManagerJumpTarget(currentCard, item.id, mediaType);
        window.setTimeout(() => finishManagerJump(jumpToken), 1400);
      });
    });
  }

  function startManagerJump(itemId = "", mediaType = "text") {
    managerJumpToken += 1;
    managerJumpState = {
      token: managerJumpToken,
      itemId: String(itemId || ""),
      mediaType,
      cancelled: false,
      programmaticUntil: performance.now() + 1200,
      recenterCount: 0
    };
    return managerJumpToken;
  }

  function isManagerJumpActive(token) {
    return Boolean(managerJumpState && managerJumpState.token === token && !managerJumpState.cancelled);
  }

  function markManagerJumpProgrammaticScroll(token, duration = 700) {
    if (!isManagerJumpActive(token)) return;
    managerJumpState.programmaticUntil = performance.now() + duration;
  }

  function canManagerJumpRecenter(token) {
    if (!isManagerJumpActive(token)) return false;
    return (managerJumpState.recenterCount || 0) < 2;
  }

  function noteManagerJumpRecenter(token) {
    if (!isManagerJumpActive(token)) return;
    managerJumpState.recenterCount = (managerJumpState.recenterCount || 0) + 1;
  }

  function finishManagerJump(token) {
    if (!managerJumpState || managerJumpState.token !== token) return;
    managerJumpState = null;
  }

  function cancelManagerJumpFromUserInput() {
    if (!managerJumpState) return;
    managerJumpState.cancelled = true;
  }

  function cancelManagerJumpFromNavigationKey(event) {
    if (!managerJumpState) return;
    const navigationKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
    if (!navigationKeys.has(event.key)) return;
    const active = document.activeElement;
    const isTyping = active?.matches?.("input, textarea, select, [contenteditable='true']");
    if (isTyping) return;
    managerJumpState.cancelled = true;
  }

  function handleManagerJumpUserScroll() {
    if (!managerJumpState || managerJumpState.cancelled) return;
    if (performance.now() <= managerJumpState.programmaticUntil) return;
    managerJumpState.cancelled = true;
  }

  function prepareManagerJumpCard(card) {
    if (!card) return;
    card.classList.remove("manager-jump-highlight");
    if (!card.classList.contains("item-card")) return;
    const preview = card.querySelector(".item-preview");
    const previewText = card.querySelector(".item-preview-text");
    stopPreviewAutoScroll(preview);
    updatePreviewOverflowState(preview, previewText);
    const expectedHeight = expectedManagerJumpCardHeight(card, card.dataset.mediaType || "text");
    if (expectedHeight > 0) {
      card.dataset.managerJumpPreviousMinHeight = card.style.minHeight || "";
      card.style.minHeight = `${expectedHeight}px`;
    }
  }

  function centerManagerCardWithoutNativeAnimation(card, jumpToken = 0) {
    const scroller = elements.items;
    if (!card?.isConnected || !scroller || (jumpToken && !isManagerJumpActive(jumpToken))) return;
    if (jumpToken && !canManagerJumpRecenter(jumpToken)) return;
    const cardRect = card.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    const targetTop = scroller.scrollTop
      + (cardRect.top - scrollerRect.top)
      - Math.max(0, (scroller.clientHeight - cardRect.height) / 2);
    noteManagerJumpRecenter(jumpToken);
    markManagerJumpProgrammaticScroll(jumpToken, 760);
    scroller.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
  }

  function waitForManagerCardReadyForHighlight(card, mediaType = "text", attempts = 84, jumpToken = 0) {
    return new Promise((resolve) => {
      let stableFrames = 0;
      let previousTop = Number.NaN;
      let previousHeight = Number.NaN;
      let previousWidth = Number.NaN;
      const startedAt = performance.now();
      const check = (remaining) => {
        if (jumpToken && !isManagerJumpActive(jumpToken)) {
          resolve(false);
          return;
        }
        if (!card?.isConnected) {
          window.setTimeout(() => resolve(false), 180);
          return;
        }
        if (remaining <= 0) {
          window.setTimeout(() => resolve(isManagerJumpActive(jumpToken) || !jumpToken), 260);
          return;
        }
        const rect = card.getBoundingClientRect();
        const viewport = managerItemsViewportRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        const usableTop = viewport ? viewport.top : 12;
        const usableBottom = viewport ? viewport.bottom : viewportHeight - 12;
        const usableHeight = Math.max(1, usableBottom - usableTop);
        const renderedHeight = Math.max(rect.height, card.offsetHeight || 0, card.scrollHeight || 0);
        const renderedWidth = Math.max(rect.width, card.offsetWidth || 0, card.scrollWidth || 0);
        const minExpectedHeight = mediaType === "image" || card.classList.contains("image-card") ? 120 : 104;
        const structuralHeight = expectedManagerJumpCardHeight(card, mediaType);
        const fullyVisible = rect.top >= usableTop && rect.bottom <= usableBottom;
        const targetCenter = usableTop + usableHeight / 2;
        const centeredEnough = Math.abs((rect.top + rect.height / 2) - targetCenter) < Math.max(44, usableHeight * 0.12);
        const hasRealHeight = renderedHeight >= Math.max(minExpectedHeight, structuralHeight - 1);
        const minimumDelay = mediaType === "image" ? 380 : 680;
        const hadTimeToPaint = performance.now() - startedAt >= minimumDelay;
        if (hasRealHeight && hadTimeToPaint && (!fullyVisible || !centeredEnough)) {
          if (jumpToken && !canManagerJumpRecenter(jumpToken)) {
            resolve(false);
            return;
          }
          centerManagerCardWithoutNativeAnimation(card, jumpToken);
          stableFrames = 0;
          previousTop = Number.NaN;
          previousHeight = Number.NaN;
          previousWidth = Number.NaN;
          window.setTimeout(() => check(remaining - 1), 100);
          return;
        }
        const stable = Math.abs(rect.top - previousTop) < 0.55
          && Math.abs(renderedHeight - previousHeight) < 0.55
          && Math.abs(renderedWidth - previousWidth) < 0.55;
        stableFrames = stable ? stableFrames + 1 : 0;
        previousTop = rect.top;
        previousHeight = renderedHeight;
        previousWidth = renderedWidth;
        if (fullyVisible && centeredEnough && hasRealHeight && hadTimeToPaint && stableFrames >= 8) {
          waitForNextManagerPaints(4).then(() => window.setTimeout(() => resolve(isManagerJumpActive(jumpToken) || !jumpToken), 190));
          return;
        }
        window.setTimeout(() => check(remaining - 1), 90);
      };
      window.setTimeout(() => check(attempts), 320);
    });
  }

  function managerItemsViewportRect() {
    const rect = elements.items?.getBoundingClientRect?.();
    if (!rect) return null;
    const fade = Math.min(42, Math.max(16, Math.round((parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--manager-scroll-fade-size")) || 28) * 0.82)));
    return {
      top: Math.max(12, rect.top + fade),
      bottom: Math.min(window.innerHeight || document.documentElement.clientHeight || rect.bottom, rect.bottom - fade)
    };
  }

  function expectedManagerJumpCardHeight(card, mediaType = "text") {
    if (!card || mediaType === "image" || card.classList.contains("image-card")) {
      return 0;
    }
    const styles = getComputedStyle(card);
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const paddingBottom = parseFloat(styles.paddingBottom) || 0;
    const borderTop = parseFloat(styles.borderTopWidth) || 0;
    const borderBottom = parseFloat(styles.borderBottomWidth) || 0;
    const rowGap = parseFloat(styles.rowGap || styles.gap) || 0;
    const preview = card.querySelector(".item-preview");
    const previewText = card.querySelector(".item-preview-text");
    const meta = card.querySelector(".item-meta");
    const actions = card.querySelector(".item-actions");
    const quickActions = card.querySelector(".item-quick-actions");
    const previewStyles = preview ? getComputedStyle(preview) : null;
    const previewMaxHeight = previewStyles ? parseFloat(previewStyles.maxHeight) || Infinity : Infinity;
    const previewContentHeight = Math.ceil(previewText?.scrollHeight || previewText?.getBoundingClientRect?.().height || 0);
    const previewHeight = Math.min(previewMaxHeight, Math.max(preview?.clientHeight || 0, previewContentHeight));
    const leftColumnHeight = previewHeight
      + Math.ceil(meta?.getBoundingClientRect?.().height || meta?.offsetHeight || 0)
      + Math.ceil(actions?.getBoundingClientRect?.().height || actions?.offsetHeight || 0)
      + rowGap * 2;
    const quickHeight = Math.ceil(quickActions?.getBoundingClientRect?.().height || quickActions?.offsetHeight || 0);
    return Math.ceil(Math.max(leftColumnHeight, quickHeight) + paddingTop + paddingBottom + borderTop + borderBottom);
  }

  function waitForNextManagerPaints(count = 2) {
    return new Promise((resolve) => {
      const step = (remaining) => {
        if (remaining <= 0) {
          resolve();
          return;
        }
        requestAnimationFrame(() => step(remaining - 1));
      };
      step(count);
    });
  }

  function highlightManagerJumpTarget(card, itemId = "", mediaType = "text") {
    const target = currentRenderedManagerCard(itemId || card?.dataset?.itemId, mediaType) || card;
    if (!target?.isConnected) return;
    if (target.dataset.managerJumpHighlighting === "true") return;
    target.dataset.managerJumpHighlighting = "true";
    target.classList.remove("manager-jump-highlight");
    target.querySelector(":scope > .manager-jump-shine-layer")?.remove();
    const previousMinHeight = target.dataset.managerJumpPreviousMinHeight !== undefined
      ? target.dataset.managerJumpPreviousMinHeight
      : target.style.minHeight || "";
    delete target.dataset.managerJumpPreviousMinHeight;
    const lockedHeight = Math.ceil(target.getBoundingClientRect?.().height || target.offsetHeight || 0);
    if (lockedHeight > 0) target.style.minHeight = `${lockedHeight}px`;
    const shine = document.createElement("span");
    shine.className = "manager-jump-shine-layer";
    shine.setAttribute("aria-hidden", "true");
    target.appendChild(shine);
    void target.offsetWidth;
    target.classList.add("manager-jump-highlight");
    window.setTimeout(() => {
      target.classList.remove("manager-jump-highlight");
      target.style.minHeight = previousMinHeight;
      target.querySelector(":scope > .manager-jump-shine-layer")?.remove();
      delete target.dataset.managerJumpHighlighting;
    }, 1250);
  }

  function currentRenderedManagerCard(itemId = "", mediaType = "text") {
    const id = String(itemId || "");
    if (!id || !elements.items) return null;
    const selector = mediaType === "image" ? ".image-card" : ".item-card";
    return [...elements.items.querySelectorAll(selector)].find((node) => node.dataset.itemId === id) || null;
  }

  function waitForManagerItemCard(itemId, mediaType, attempts = 44) {
    const selector = mediaType === "image" ? ".image-card" : ".item-card";
    const id = String(itemId);
    let virtualScrollAttempted = false;
    return new Promise((resolve) => {
      const find = (remaining) => {
        const node = [...elements.items.querySelectorAll(selector)].find((card) => card.dataset.itemId === id);
        if (node || remaining <= 0) {
          resolve(node || null);
          return;
        }
        if (!virtualScrollAttempted) {
          virtualScrollAttempted = scrollVirtualItemsToItem(id, mediaType);
        }
        window.setTimeout(() => find(remaining - 1), 35);
      };
      find(attempts);
    });
  }

  function renderSourceTimelineDetail(node, group) {
    cancelSourceTimelineRenderJob();
    const rail = document.createElement("div");
    rail.className = "manager-source-timeline-rail";
    node.replaceChildren(rail);
    renderSourceTimelineCapturesProgressively(rail, group.items || []);
  }

  function renderSourceTimelineCapturesProgressively(rail, items) {
    const total = items.length;
    if (total <= SOURCE_TIMELINE_LARGE_LIST_THRESHOLD) {
      const fragment = document.createDocumentFragment();
      items.forEach((item) => fragment.appendChild(sourceTimelineCaptureNode(item)));
      rail.replaceChildren(fragment);
      return;
    }

    const job = {
      cancelled: false,
      index: 0,
      total,
      items,
      target: rail,
      loader: renderListLoadingNode(total, "source-timeline")
    };
    sourceTimelineRenderJob = job;
    rail.appendChild(job.loader);

    const renderChunk = (deadline = null) => {
      if (job.cancelled || sourceTimelineRenderJob !== job || !job.target.isConnected) return;
      const fragment = document.createDocumentFragment();
      const start = job.index;
      const hardLimit = Math.min(job.total, start + SOURCE_TIMELINE_RENDER_CHUNK_SIZE);
      while (job.index < hardLimit) {
        fragment.appendChild(sourceTimelineCaptureNode(job.items[job.index]));
        job.index += 1;
        if (deadline?.timeRemaining && deadline.timeRemaining() < 4 && job.index - start >= 12) break;
      }
      job.target.insertBefore(fragment, job.loader);
      updateListLoadingNode(job.loader, job.index, job.total);
      if (job.index < job.total) {
        scheduleItemRenderChunk(renderChunk);
        return;
      }
      job.loader.remove();
      if (sourceTimelineRenderJob === job) sourceTimelineRenderJob = null;
    };

    renderChunk();
  }

  function cancelSourceTimelineRenderJob() {
    if (!sourceTimelineRenderJob) return;
    sourceTimelineRenderJob.cancelled = true;
    sourceTimelineRenderJob.loader?.remove();
    sourceTimelineRenderJob = null;
  }

  function sourceTimelineCaptureNode(item) {
    const article = document.createElement("article");
    article.className = `manager-source-timeline-capture is-${item.mediaType}`;
    article.dataset.itemId = item.id || "";
    article.dataset.mediaType = timelineMediaType(item);
    const dot = document.createElement("span");
    dot.className = "manager-source-timeline-dot";
    const copy = document.createElement("div");
    copy.className = "manager-source-timeline-capture-copy";
    const mediaType = timelineMediaType(item);
    const versions = mediaType === "image" ? [] : embeddedVersions(item);
    const initialVersionId = versions.length > 1 ? versions[0].id : "";
    renderSourceTimelineCaptureCopy(copy, article, item, initialVersionId);
    article.append(dot, copy);
    return article;
  }

  function renderSourceTimelineCaptureCopy(copy, article, item, versionId = "") {
    const mediaType = timelineMediaType(item);
    const versions = mediaType === "image" ? [] : embeddedVersions(item);
    const hasVersions = versions.length > 1;
    const activeVersionId = hasVersions && versions.some((version) => version.id === versionId) ? versionId : hasVersions ? versions[0].id : "";
    const versionIndex = hasVersions ? Math.max(0, versions.findIndex((version) => version.id === activeVersionId)) : 0;
    const displayItem = hasVersions ? itemDisplayVersionById(item, mediaType, activeVersionId) : item;
    article.dataset.activeVersionId = activeVersionId;
    const title = document.createElement("strong");
    title.textContent = displayItem.title || item.sourceTitle || item.sourceUrl || t("sourceTimeline.untitled");
    const head = document.createElement("div");
    head.className = "manager-source-timeline-capture-head";
    head.appendChild(title);
    if (hasVersions) head.appendChild(sourceTimelineVersionTabs(item, activeVersionId, (nextVersionId) => {
      renderSourceTimelineCaptureCopy(copy, article, item, nextVersionId);
    }));
    const imagePreview = mediaType === "image" ? sourceTimelineImagePreview(item) : null;
    const meta = document.createElement("span");
    meta.textContent = [
      item.mediaType === "image" ? t("images.tab") : item.mediaType === "dev" ? t("dev.tab") : t("tabs.text"),
      window.MCP.formatLocalizedDate(displayItem.createdAt, state.settings.language || "en")
    ].filter(Boolean).join(" - ");
    const preview = document.createElement("p");
    preview.textContent = String(displayItem.preview || displayItem.content || item.altText || "").slice(0, 180);
    const actions = document.createElement("div");
    actions.className = "manager-source-timeline-actions";
    if (item.sourceUrl && (!hasVersions || versionIndex === 0)) {
      const open = document.createElement("button");
      open.type = "button";
      open.textContent = t("source.open");
      open.addEventListener("click", (event) => {
        if (blockDemoAction(event)) return;
        chrome.tabs.create({ url: item.sourceUrl }).catch(() => window.open(item.sourceUrl, "_blank"));
      });
      actions.appendChild(open);
    }
    const jump = document.createElement("button");
    jump.type = "button";
    jump.className = "is-secondary";
    jump.textContent = t("sourceTimeline.goToCapture");
    jump.addEventListener("click", () => jumpToTimelineCapture(Object.assign({}, item, activeVersionId ? { __timelineVersionId: activeVersionId } : {})));
    actions.appendChild(jump);
    copy.replaceChildren(...[head, imagePreview, meta, preview, actions].filter(Boolean));
  }

  function sourceTimelineImagePreview(item) {
    const imageUrl = item.thumbnailUrl || item.imageUrl || item.dataUrl || "";
    if (!imageUrl) return null;
    const frame = document.createElement("div");
    frame.className = "manager-source-timeline-image-frame";
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = item.altText || item.title || t("images.image");
    image.loading = "lazy";
    frame.appendChild(image);
    return frame;
  }

  function sourceTimelineVersionTabs(item, activeVersionId, onSelect) {
    const tabs = document.createElement("div");
    tabs.className = "manager-source-timeline-version-tabs";
    tabs.setAttribute("aria-label", t("versioning.tabsLabel"));
    embeddedVersions(item).forEach((version, index) => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = `manager-source-timeline-version-tab ${version.id === activeVersionId ? "is-active" : ""}`;
      tab.textContent = t("versioning.shortLabel", { number: index + 1 });
      tab.title = t("versioning.selectVersion", { number: index + 1 });
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        onSelect(version.id);
      });
      tabs.appendChild(tab);
    });
    return tabs;
  }

  function renderManagerSearch() {
    const modal = document.getElementById("managerSearchModal");
    if (!modal) return;
    cancelManagerSearchRenderJob();
    cancelManagerSearchDetailRender();
    renderManagerSearchTabs(modal.querySelector("[data-role='search-tabs']"));
    renderManagerSearchFilters(modal.querySelector("[data-role='search-filters']"));
    const resultsNode = modal.querySelector("#managerSearchResults");
    const detailNode = modal.querySelector("#managerSearchDetail");
    managerSearchSelectedRow = null;
    resultsNode.replaceChildren();
    detailNode.replaceChildren();
    renderManagerSearchDateCalendar();
    const results = getManagerSearchResults();
    managerSearchState.results = results;
    if (!results.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = t("search.noResults");
      resultsNode.appendChild(empty);
      detailNode.textContent = t("search.trySimple");
      return;
    }
    managerSearchState.selectedIndex = Math.min(managerSearchState.selectedIndex, results.length - 1);
    if (managerSearchState.mediaType === "image") renderManagerImageSearchDetail(detailNode, results[managerSearchState.selectedIndex]);
    else renderManagerTextSearchDetail(detailNode, results[managerSearchState.selectedIndex]);
    renderManagerSearchResultsProgressively(resultsNode, results);
  }

  function renderManagerSearchResultsProgressively(resultsNode, results) {
    const total = results.length;
    if (total > SEARCH_RENDER_LARGE_LIST_THRESHOLD) {
      renderManagerSearchResultsVirtually(resultsNode, results);
      return;
    }
    if (total <= SEARCH_RENDER_LARGE_LIST_THRESHOLD) {
      const fragment = document.createDocumentFragment();
      results.forEach((item, index) => fragment.appendChild(renderManagerSearchResult(item, index)));
      resultsNode.appendChild(fragment);
      return;
    }
    const job = {
      cancelled: false,
      index: 0,
      total,
      results,
      target: resultsNode,
      mediaType: managerSearchState.mediaType,
      loader: renderListLoadingNode(total, "search")
    };
    managerSearchRenderJob = job;
    resultsNode.appendChild(job.loader);
    const renderChunk = (deadline = null) => {
      if (job.cancelled || managerSearchRenderJob !== job || !job.target.isConnected) return;
      const fragment = document.createDocumentFragment();
      const start = job.index;
      const chunkSize = job.mediaType === "image" ? SEARCH_IMAGE_RENDER_CHUNK_SIZE : SEARCH_RENDER_CHUNK_SIZE;
      const hardLimit = Math.min(job.total, start + chunkSize);
      while (job.index < hardLimit) {
        fragment.appendChild(renderManagerSearchResult(job.results[job.index], job.index));
        job.index += 1;
        if (deadline?.timeRemaining && deadline.timeRemaining() < 4 && job.index - start >= 12) break;
      }
      job.target.insertBefore(fragment, job.loader);
      updateListLoadingNode(job.loader, job.index, job.total);
      if (job.index < job.total) {
        scheduleItemRenderChunk(renderChunk);
        return;
      }
      job.loader.remove();
      if (managerSearchRenderJob === job) managerSearchRenderJob = null;
    };
    renderChunk();
  }

  function cancelManagerSearchRenderJob() {
    if (virtualSearchState?.raf) cancelAnimationFrame(virtualSearchState.raf);
    virtualSearchState = null;
    if (!managerSearchRenderJob) return;
    managerSearchRenderJob.cancelled = true;
    managerSearchRenderJob.loader?.remove();
    managerSearchRenderJob = null;
  }

  function renderManagerSearchResultsVirtually(resultsNode, results) {
    const canvas = document.createElement("div");
    canvas.className = "manager-search-virtual-canvas";
    const slice = document.createElement("div");
    slice.className = "manager-search-virtual-slice";
    canvas.appendChild(slice);
    resultsNode.replaceChildren(canvas);
    virtualSearchState = {
      results,
      container: resultsNode,
      canvas,
      slice,
      rowHeight: managerSearchState.mediaType === "image" ? 82 : 72,
      start: -1,
      end: -1,
      raf: 0
    };
    updateVirtualManagerSearchWindow(true);
  }

  function handleVirtualManagerSearchScroll() {
    if (!virtualSearchState) return;
    if (virtualSearchState.raf) return;
    virtualSearchState.raf = requestAnimationFrame(() => {
      if (!virtualSearchState) return;
      virtualSearchState.raf = 0;
      updateVirtualManagerSearchWindow(false);
    });
  }

  function updateVirtualManagerSearchWindow(force = false) {
    const current = virtualSearchState;
    if (!current?.container?.isConnected) return;
    const total = current.results.length;
    const viewportHeight = Math.max(1, current.container.clientHeight || 1);
    const scrollTop = Math.max(0, current.container.scrollTop || 0);
    const visibleCount = Math.ceil(viewportHeight / current.rowHeight);
    const start = Math.max(0, Math.floor(scrollTop / current.rowHeight) - VIRTUAL_OVERSCAN);
    const end = Math.min(total, start + visibleCount + VIRTUAL_OVERSCAN * 2);
    if (!force && start === current.start && end === current.end) return;
    current.start = start;
    current.end = end;
    current.canvas.style.height = `${total * current.rowHeight}px`;
    current.slice.style.transform = `translate3d(0, ${start * current.rowHeight}px, 0)`;
    const fragment = document.createDocumentFragment();
    for (let index = start; index < end; index += 1) {
      fragment.appendChild(renderManagerSearchResult(current.results[index], index));
    }
    current.slice.replaceChildren(fragment);
  }

  function scrollVirtualManagerSearchIndexIntoView(index) {
    if (!virtualSearchState) return null;
    const safeIndex = Math.max(0, Math.min(index, virtualSearchState.results.length - 1));
    const viewportHeight = virtualSearchState.container.clientHeight || 0;
    const currentTop = virtualSearchState.container.scrollTop || 0;
    const rowTop = safeIndex * virtualSearchState.rowHeight;
    const rowBottom = rowTop + virtualSearchState.rowHeight;
    if (rowTop < currentTop || rowBottom > currentTop + viewportHeight) {
      virtualSearchState.container.scrollTo({
        top: Math.max(0, rowTop - Math.max(0, viewportHeight - virtualSearchState.rowHeight) / 2),
        behavior: "auto"
      });
      updateVirtualManagerSearchWindow(true);
    }
    return virtualSearchState.slice.querySelector(`.manager-search-result[data-search-index="${CSS.escape(String(safeIndex))}"]`);
  }

  function renderManagerSearchTabs(node) {
    if (!node) return;
    const tabs = [
      ["text", t("tabs.text")],
      ["dev", t("tabs.dev")],
      ["image", t("images.tab")]
    ];
    node.replaceChildren(...tabs.map(([id, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = id === managerSearchState.mediaType ? "is-active" : "";
      button.textContent = label;
      button.addEventListener("click", () => {
        managerSearchState.mediaType = id;
        managerSearchState.selectedIndex = 0;
        clearManagerSearchDateMode();
        renderManagerSearch();
      });
      return button;
    }));
  }

  function renderManagerSearchFilters(node) {
    if (!node) return;
    const filters = [
      ["all", t("search.filters.all")],
      ["favorites", t("search.filters.favorites")],
      ["pinned", t("search.filters.pinned")],
      ["today", t("search.filters.today")],
      ["7d", t("search.filters.last7")],
      ["30d", t("search.filters.last30")],
      ["date", managerSearchState.dateKey ? `${t("search.byDate")} - ${formatManagerSearchDateLabel(managerSearchState.dateKey)}` : t("search.byDate")]
    ];
    node.replaceChildren(...filters.map(([id, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = isManagerSearchFilterActive(id) ? "is-active" : "";
      button.textContent = label;
      button.addEventListener("click", () => {
        if (id === "date") openManagerSearchDateCalendar();
        else toggleManagerSearchFilter(id);
        renderManagerSearch();
      });
      return button;
    }));
  }

  function isManagerSearchFilterActive(id) {
    const filters = managerSearchState.filters || {};
    if (id === "date") return Boolean(managerSearchState.dateKey);
    if (managerSearchState.dateKey) return false;
    return id === "all" ? !Object.keys(filters).some((key) => filters[key]) : Boolean(filters[id] || filters.dateRange === id);
  }

  function toggleManagerSearchFilter(id) {
    clearManagerSearchDateMode();
    const filters = Object.assign({}, managerSearchState.filters || {});
    if (id === "all") managerSearchState.filters = {};
    else if (id === "favorites") filters.favorites = !filters.favorites;
    else if (id === "pinned") filters.pinned = !filters.pinned;
    else if (["today", "7d", "30d"].includes(id)) filters.dateRange = filters.dateRange === id ? null : id;
    if (id !== "all") managerSearchState.filters = filters;
    managerSearchState.selectedIndex = 0;
  }

  function getManagerSearchResults() {
    if (managerSearchState.dateKey) {
      return managerTextItemsForDate(managerSearchState.dateKey);
    }
    const showAllCaptures = shouldShowAllManagerSearchCaptures();
    const options = {
      filters: managerSearchState.filters || {},
      favoritesFirst: state.settings.searchFavoritesFirst,
      maxResults: showAllCaptures ? Number.MAX_SAFE_INTEGER : state.settings.searchMaxResults || 80,
      language: state.settings.language || "en"
    };
    if (managerSearchState.mediaType === "dev") {
      return window.MCP.searchItems(state.devItems || [], managerSearchState.query, state.devCategories || [], options);
    }
    if (managerSearchState.mediaType !== "image") {
      return window.MCP.searchItems(state.items || [], managerSearchState.query, state.categories || [], options);
    }
    const now = Date.now();
    const filters = managerSearchState.filters || {};
    const images = filterImages(state.imageItems || [], managerSearchState.query).filter((item) => {
      if (filters.favorites && !item.isFavorite) return false;
      if (filters.pinned && !item.isPinned) return false;
      if (filters.dateRange === "today" && !isSameManagerSearchDay(item.createdAt, now)) return false;
      if (filters.dateRange === "7d" && now - (item.createdAt || 0) > 7 * 86400000) return false;
      if (filters.dateRange === "30d" && now - (item.createdAt || 0) > 30 * 86400000) return false;
      return true;
    });
    return showAllCaptures ? images : images.slice(0, state.settings.searchMaxResults || 80);
  }

  function shouldShowAllManagerSearchCaptures() {
    const hasQuery = Boolean(window.MCP.normalizeContent(managerSearchState.query || ""));
    const filters = managerSearchState.filters || {};
    const hasActiveFilter = Object.keys(filters).some((key) => Boolean(filters[key]));
    return !hasQuery && !hasActiveFilter;
  }

  function isSameManagerSearchDay(timestamp, reference) {
    const first = new Date(timestamp || 0);
    const second = new Date(reference || Date.now());
    return first.getFullYear() === second.getFullYear()
      && first.getMonth() === second.getMonth()
      && first.getDate() === second.getDate();
  }

  function managerTextItemsForDate(dateKey) {
    return (state.items || [])
      .filter((item) => !isTrashCategoryId(item.categoryId))
      .filter((item) => managerSearchLocalDateKey(item.createdAt) === dateKey)
      .sort((left, right) => (right.createdAt || 0) - (left.createdAt || 0));
  }

  function managerSearchLocalDateKey(timestamp) {
    const date = new Date(timestamp || 0);
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function managerSearchMonthKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  }

  function parseManagerSearchMonthKey(value) {
    const match = /^(\d{4})-(\d{2})$/.exec(String(value || ""));
    if (!match) {
      const now = new Date();
      return [now.getFullYear(), now.getMonth()];
    }
    return [Number(match[1]), Number(match[2]) - 1];
  }

  function managerSearchMaxMonthDate() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  function clampManagerSearchMonth(year, month) {
    const minimum = new Date(1970, 0, 1);
    const maximum = managerSearchMaxMonthDate();
    const candidate = new Date(year, month, 1);
    if (candidate < minimum) return minimum;
    if (candidate > maximum) return maximum;
    return candidate;
  }

  function isManagerSearchCurrentOrFutureMonth(year, month) {
    const maximum = managerSearchMaxMonthDate();
    return new Date(year, month, 1).getTime() >= maximum.getTime();
  }

  function openManagerSearchDateCalendar() {
    managerSearchState.mediaType = "text";
    managerSearchState.calendarMonth = managerSearchState.calendarMonth || managerSearchMonthKey();
    const modal = document.querySelector("[data-role='manager-search-date-modal']");
    if (modal) modal.hidden = false;
    renderManagerSearch();
  }

  function closeManagerSearchDateCalendar() {
    const modal = document.querySelector("[data-role='manager-search-date-modal']");
    if (modal) modal.hidden = true;
  }

  function clearManagerSearchDateMode() {
    managerSearchState.dateKey = "";
  }

  function shiftManagerSearchCalendarMonth(delta) {
    const [year, month] = parseManagerSearchMonthKey(managerSearchState.calendarMonth || managerSearchMonthKey());
    const nextMonth = clampManagerSearchMonth(year, month + delta);
    managerSearchState.calendarMonth = managerSearchMonthKey(nextMonth);
    renderManagerSearchDateCalendar();
  }

  function setManagerSearchCalendarMonth(month, year) {
    if (!Number.isFinite(month) || !Number.isFinite(year)) return;
    const safeYear = Math.max(1970, Math.min(9999, year));
    const safeMonth = Math.max(0, Math.min(11, month));
    managerSearchState.calendarMonth = managerSearchMonthKey(clampManagerSearchMonth(safeYear, safeMonth));
    renderManagerSearchDateCalendar();
  }

  function renderManagerSearchDateCalendar() {
    const modal = document.querySelector("[data-role='manager-search-date-modal']");
    if (!modal) return;
    const [year, month] = parseManagerSearchMonthKey(managerSearchState.calendarMonth || managerSearchMonthKey());
    managerSearchState.calendarMonth = managerSearchMonthKey(new Date(year, month, 1));
    modal.querySelector("[data-role='manager-search-date-title']").textContent = t("search.dateTitle");
    modal.querySelector("[data-role='manager-search-date-subtitle']").textContent = t("search.dateSubtitle");
    modal.querySelector("[data-role='manager-search-date-close']")?.setAttribute("aria-label", t("common.close"));
    const prev = modal.querySelector("[data-role='manager-search-date-prev']");
    const next = modal.querySelector("[data-role='manager-search-date-next']");
    if (prev) {
      prev.textContent = "<";
      prev.setAttribute("aria-label", t("search.previousMonth"));
    }
    if (next) {
      next.textContent = ">";
      next.setAttribute("aria-label", t("search.nextMonth"));
      next.disabled = isManagerSearchCurrentOrFutureMonth(year, month);
    }
    renderManagerSearchMonthSelect(modal.querySelector("[data-role='manager-search-date-month']"), month, year);
    const yearInput = modal.querySelector("[data-role='manager-search-date-year']");
    if (yearInput) {
      yearInput.value = String(year);
      yearInput.setAttribute("aria-label", t("search.year"));
      yearInput.max = String(managerSearchMaxMonthDate().getFullYear());
    }
    renderManagerSearchWeekdays(modal.querySelector("[data-role='manager-search-date-weekdays']"));
    renderManagerSearchDays(modal.querySelector("[data-role='manager-search-date-grid']"), year, month);
  }

  function renderManagerSearchMonthSelect(select, selectedMonth, selectedYear) {
    if (!select) return;
    const formatter = new Intl.DateTimeFormat(state.settings.language || "en", { month: "long" });
    const maxMonth = managerSearchMaxMonthDate();
    select.replaceChildren(...Array.from({ length: 12 }, (_, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = formatter.format(new Date(2024, index, 1));
      option.selected = index === selectedMonth;
      option.disabled = new Date(selectedYear, index, 1) > maxMonth;
      return option;
    }));
    select.setAttribute("aria-label", t("search.month"));
  }

  function renderManagerSearchWeekdays(node) {
    if (!node) return;
    const formatter = new Intl.DateTimeFormat(state.settings.language || "en", { weekday: "short" });
    node.replaceChildren(...Array.from({ length: 7 }, (_, index) => {
      const span = document.createElement("span");
      span.textContent = formatter.format(new Date(2024, 0, index + 1));
      return span;
    }));
  }

  function renderManagerSearchDays(node, year, month) {
    if (!node) return;
    const counts = managerTextCaptureCountsByDate();
    const leading = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let index = 0; index < leading; index += 1) {
      const empty = document.createElement("span");
      empty.className = "manager-search-calendar-empty";
      cells.push(empty);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const count = counts.get(dateKey) || 0;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `manager-search-calendar-day ${managerSearchState.dateKey === dateKey ? "is-selected" : ""} ${count ? "has-captures" : ""}`;
      button.textContent = String(day);
      button.addEventListener("click", () => {
        managerSearchState.dateKey = dateKey;
        managerSearchState.mediaType = "text";
        managerSearchState.selectedIndex = 0;
        closeManagerSearchDateCalendar();
        renderManagerSearch();
      });
      if (count) {
        const badge = document.createElement("span");
        badge.className = "manager-search-calendar-count";
        badge.textContent = String(count);
        button.appendChild(badge);
      }
      cells.push(button);
    }
    node.replaceChildren(...cells);
  }

  function managerTextCaptureCountsByDate() {
    const counts = new Map();
    (state.items || []).forEach((item) => {
      if (isTrashCategoryId(item.categoryId)) return;
      const key = managerSearchLocalDateKey(item.createdAt);
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }

  function formatManagerSearchDateLabel(dateKey) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateKey || ""));
    if (!match) return "";
    return new Intl.DateTimeFormat(state.settings.language || "en", { dateStyle: "medium" }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  }

  function renderManagerSearchResult(item, index) {
    const row = document.createElement("article");
    row.className = `manager-search-result ${index === managerSearchState.selectedIndex ? "is-selected" : ""} ${item.isPinned ? "is-pinned" : ""}`;
    row.dataset.searchIndex = String(index);
    if (index === managerSearchState.selectedIndex) managerSearchSelectedRow = row;
    row.addEventListener("click", () => {
      selectManagerSearchResult(index, row);
    });
    const title = document.createElement("strong");
    const displayItem = managerSearchState.mediaType === "image" ? item : itemDisplayVersion(item, managerSearchState.mediaType === "dev" ? "dev" : "text");
    title.textContent = managerSearchState.mediaType === "image"
      ? item.title || item.altText || item.imageFileName || item.fileName || item.imageUrl || t("images.image")
      : displayItem.title || displayItem.preview || displayItem.content || "";
    const meta = document.createElement("span");
    renderInlineSourceMeta(meta, item, [managerSearchItemCategoryPath(item), window.MCP.formatLocalizedDate(item.createdAt, state.settings.language || "en")]);
    row.append(title, meta);
    return row;
  }

  function selectManagerSearchResult(index, row = null) {
    const modal = document.getElementById("managerSearchModal");
    if (!modal) return;
    const results = Array.isArray(managerSearchState.results) ? managerSearchState.results : [];
    const nextIndex = Math.max(0, Math.min(index, results.length - 1));
    const item = results[nextIndex];
    if (!item) return;
    if (nextIndex === managerSearchState.selectedIndex && row?.classList.contains("is-selected")) return;
    managerSearchState.selectedIndex = nextIndex;
    managerSearchSelectedRow?.classList.remove("is-selected");
    const nextRow = row
      || modal.querySelector(`.manager-search-result[data-search-index="${CSS.escape(String(nextIndex))}"]`)
      || scrollVirtualManagerSearchIndexIntoView(nextIndex);
    nextRow?.classList.add("is-selected");
    managerSearchSelectedRow = nextRow || null;
    const detailNode = modal.querySelector("#managerSearchDetail");
    if (!detailNode) return;
    scheduleManagerSearchDetailRender(detailNode, item, nextIndex);
  }

  function cancelManagerSearchDetailRender() {
    cancelAnimationFrame(managerSearchDetailRenderRaf);
    managerSearchDetailRenderRaf = 0;
    clearTimeout(managerSearchDetailRenderTimer);
    managerSearchDetailRenderTimer = 0;
  }

  function scheduleManagerSearchDetailRender(detailNode, item, index) {
    cancelManagerSearchDetailRender();
    managerSearchDetailRenderTimer = window.setTimeout(() => {
      managerSearchDetailRenderTimer = 0;
      requestAnimationFrame(() => {
        managerSearchDetailRenderRaf = requestAnimationFrame(() => {
          managerSearchDetailRenderRaf = 0;
          renderScheduledManagerSearchDetail(detailNode, item, index);
        });
      });
    }, 72);
  }

  function renderScheduledManagerSearchDetail(detailNode, item, index) {
    if (managerSearchState.selectedIndex !== index) return;
    detailNode.replaceChildren();
    if (managerSearchState.mediaType === "image") renderManagerImageSearchDetail(detailNode, item);
    else renderManagerTextSearchDetail(detailNode, item);
  }

  function managerSearchItemCategoryPath(item) {
    return translatedCategoryPath(item.categoryId) || item.categoryName || "";
  }

  function renderManagerTextSearchDetail(node, item) {
    if (!item) return;
    const mediaType = managerSearchState.mediaType === "dev" ? "dev" : "text";
    const displayItem = itemDisplayVersion(item, mediaType);
    const sourceVersionActive = isEmbeddedSourceVersionActive(item, mediaType);
    const content = document.createElement("p");
    content.className = "manager-search-detail-text";
    content.textContent = displayItem.content || displayItem.preview || "";
    const actions = document.createElement("div");
    actions.className = "manager-search-detail-actions";
    actions.append(
      actionButton(t("common.useCapture"), "primary use-capture-action", () => copyItem(displayItem, mediaType)),
      actionButton(t("common.edit"), "icon-only", () => openEditor(item, mediaType), "edit.png")
    );
    actions.append(actionButton(t("versioning.addButtonLabel"), "version-create-action", () => openCreateVersionModal(item, mediaType, displayItem?.activeVersionId || "")));
    if (sourceVersionActive) {
      actions.append(
        actionButton(t("source.open"), "icon-only", () => openSource(item), "reverse.png"),
        actionButton(t("categories.classify"), "", () => managerSearchState.mediaType === "dev" ? classifyDev(item) : classifyText(item)),
        actionButton(item.isFavorite ? t("common.favoriteRemove") : t("common.favoriteAdd"), item.isFavorite ? "is-active icon-only" : "icon-only", async () => {
        if (mediaType === "dev") await updateDev(item.id, { isFavorite: !item.isFavorite });
        else await updateItem(item.id, { isFavorite: !item.isFavorite });
        renderManagerSearch();
        }, item.isFavorite ? "favorited.png" : "not_yet_favorited.png"),
        actionButton(item.isPinned ? t("common.unpin") : t("common.pin"), item.isPinned ? "is-active icon-only" : "icon-only", async () => {
        if (mediaType === "dev") await updateDev(item.id, { isPinned: !item.isPinned });
        else await updateItem(item.id, { isPinned: !item.isPinned });
        renderManagerSearch();
        }, item.isPinned ? "go_unpin.png" : "go_pin.png")
      );
    }
    actions.append(
      actionButton(t("common.delete"), "icon-only", async () => {
        if (managerSearchState.mediaType === "dev") await deleteDev(item.id);
        else await deleteItem(item.id);
        renderManagerSearch();
      }, "erase.png")
    );
    node.append(content, actions);
  }

  function renderManagerImageSearchDetail(node, item) {
    if (!item) return;
    const image = document.createElement("img");
    image.className = "manager-search-image-preview";
    image.src = item.thumbnailUrl || item.imageUrl || item.dataUrl || "";
    image.alt = item.altText || t("images.image");
    const meta = document.createElement("p");
    meta.className = "manager-search-detail-meta";
    renderInlineSourceMeta(meta, item, [managerSearchItemCategoryPath(item), window.MCP.formatLocalizedDate(item.createdAt, state.settings.language || "en")]);
    const info = renderImageInfoRows(item);
    const actions = document.createElement("div");
    actions.className = "manager-search-detail-actions";
    actions.append(
      actionButton(t("common.useCapture"), "primary use-capture-action", () => copyImage(item)),
      actionButton(t("source.open"), "icon-only", () => openImageSource(item), "reverse.png"),
      actionButton(t("images.info"), "image-info-action", () => openImageInfo(item)),
      actionButton(t("images.download"), "image-download-action", () => downloadImage(item)),
      actionButton(t("categories.classify"), "", () => classifyImage(item)),
      actionButton(item.isFavorite ? t("common.favoriteRemove") : t("common.favoriteAdd"), item.isFavorite ? "is-active icon-only" : "icon-only", async () => {
        await updateImage(item.id, { isFavorite: !item.isFavorite });
        renderManagerSearch();
      }, item.isFavorite ? "favorited.png" : "not_yet_favorited.png"),
      actionButton(item.isPinned ? t("common.unpin") : t("common.pin"), item.isPinned ? "is-active icon-only" : "icon-only", async () => {
        await updateImage(item.id, { isPinned: !item.isPinned });
        renderManagerSearch();
      }, item.isPinned ? "go_unpin.png" : "go_pin.png"),
      actionButton(t("common.delete"), "icon-only", async () => {
        await deleteImage(item.id);
        renderManagerSearch();
      }, "erase.png")
    );
    node.append(image, meta, info, actions);
  }

  function openCreateVersionModal(item, mediaType = "text", versionId = "") {
    if (!item?.id || mediaType === "image") return;
    if (!isVersioningEnabled()) {
      openManagerProUpgradeModal("captureVersioning");
      showManagerToast(t("pro.versioningRequired"));
      return;
    }
    closeManagerSearch();
    const sourceItem = itemDisplayVersionById(item, mediaType, versionId || currentEmbeddedVersionId(item, mediaType));
    const editorVersion = "create-version-editor-v1";
    let modal = document.getElementById("managerCreateVersionModal");
    if (modal && modal.dataset.editorVersion !== editorVersion) {
      modal.remove();
      modal = null;
    }
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerCreateVersionModal";
      modal.className = "mcp-editor-modal manager-create-version-modal";
      modal.dataset.editorVersion = editorVersion;
      modal.innerHTML = [
        "<div class=\"mcp-search-backdrop\" data-manager-action=\"close-create-version\"></div>",
        "<section class=\"manager-editor-card unified-text-editor-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"create-version-heading\"></strong><button type=\"button\" data-manager-action=\"close-create-version\">X</button></header>",
        "<div class=\"manager-editor-layout\">",
        "<div class=\"manager-editor-form-pane\">",
        "<label><span data-role=\"create-version-title-label\"></span><input id=\"managerCreateVersionTitle\" type=\"text\" maxlength=\"30\"></label>",
        "<label class=\"manager-editor-content-field\"><span data-role=\"create-version-content-label\"></span><div class=\"manager-editor-code-wrap\"><pre class=\"manager-editor-line-numbers\" data-role=\"create-version-lines\" aria-hidden=\"true\">1</pre><textarea id=\"managerCreateVersionContent\" rows=\"10\" wrap=\"soft\"></textarea></div></label>",
        "<label><span data-role=\"create-version-note-label\"></span><textarea id=\"managerCreateVersionNote\" rows=\"3\"></textarea></label>",
        "<p id=\"managerCreateVersionError\" class=\"editor-error\"></p>",
        "<footer><button type=\"button\" class=\"primary\" data-manager-action=\"save-create-version\"></button><button type=\"button\" data-manager-action=\"close-create-version\"></button></footer>",
        "</div>",
        "</div>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
      const textarea = modal.querySelector("#managerCreateVersionContent");
      textarea.addEventListener("input", () => updateCreateVersionModalState(modal));
      textarea.addEventListener("scroll", () => syncCreateVersionLineNumberScroll(modal));
    }
    modal.dataset.itemId = item.id;
    modal.dataset.mediaType = mediaType;
    modal.dataset.versionId = sourceItem?.activeVersionId || "";
    modal.dataset.baseContent = sourceItem?.content || "";
    modal.hidden = false;
    modal.querySelector(".manager-editor-card").classList.toggle("is-code-editor", mediaType === "dev");
    modal.querySelector("[data-role='create-version-heading']").textContent = t(mediaType === "dev" ? "versioning.createCodeTitle" : "versioning.createTextTitle");
    modal.querySelector("[data-role='create-version-title-label']").textContent = t("editor.title");
    modal.querySelector("[data-role='create-version-content-label']").textContent = t("editor.content");
    modal.querySelector("[data-role='create-version-note-label']").textContent = t("editor.note");
    modal.querySelector("[data-manager-action='save-create-version']").textContent = t("versioning.createVersionButton");
    modal.querySelector("footer [data-manager-action='close-create-version']").textContent = t("common.cancel");
    modal.querySelector("[data-manager-action='close-create-version']").setAttribute("aria-label", t("common.close"));
    modal.querySelector("#managerCreateVersionTitle").value = String(sourceItem?.title || "").slice(0, 30);
    modal.querySelector("#managerCreateVersionContent").value = sourceItem?.content || "";
    modal.querySelector("#managerCreateVersionContent").setAttribute("wrap", mediaType === "dev" ? "off" : "soft");
    modal.querySelector("#managerCreateVersionNote").value = sourceItem?.note || "";
    modal.querySelector("#managerCreateVersionError").textContent = "";
    updateCreateVersionModalState(modal);
    requestAnimationFrame(() => modal.querySelector("#managerCreateVersionContent")?.focus());
  }

  function updateCreateVersionModalState(modal) {
    if (!modal) return;
    const textarea = modal.querySelector("#managerCreateVersionContent");
    const button = modal.querySelector("[data-manager-action='save-create-version']");
    const lines = modal.querySelector("[data-role='create-version-lines']");
    if (lines && textarea) {
      const count = Math.max(1, textarea.value.split("\n").length);
      lines.textContent = Array.from({ length: count }, (_, index) => String(index + 1)).join("\n");
      syncCreateVersionLineNumberScroll(modal);
    }
    const wrap = modal.querySelector(".manager-editor-code-wrap");
    if (textarea && wrap) {
      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 19;
      const linesCount = Math.max(4, Math.min(22, textarea.value.split("\n").length + 2));
      const naturalHeight = Math.max(linesCount * lineHeight + 28, Math.min(textarea.scrollHeight + 2, Math.round(window.innerHeight * 0.32)));
      const maxHeight = Math.max(170, Math.min(340, Math.round(window.innerHeight * 0.34)));
      wrap.style.setProperty("--editor-content-height", `${Math.min(maxHeight, Math.max(140, naturalHeight))}px`);
    }
    const base = String(modal.dataset.baseContent || "").trim();
    const content = String(textarea?.value || "").trim();
    const canCreate = Boolean(content) && content !== base;
    if (button) {
      button.disabled = !canCreate;
      button.classList.toggle("is-disabled", !canCreate);
      button.setAttribute("aria-disabled", String(!canCreate));
      button.title = canCreate ? "" : t("versioning.contentRequired");
    }
  }

  function syncCreateVersionLineNumberScroll(modal) {
    const textarea = modal?.querySelector("#managerCreateVersionContent");
    const lines = modal?.querySelector("[data-role='create-version-lines']");
    if (!textarea || !lines) return;
    lines.scrollTop = textarea.scrollTop;
  }

  function closeCreateVersionModal() {
    const modal = document.getElementById("managerCreateVersionModal");
    if (modal) modal.hidden = true;
  }

  async function saveCreateVersionModal() {
    const modal = document.getElementById("managerCreateVersionModal");
    if (!modal || modal.hidden) return;
    const mediaType = modal.dataset.mediaType === "dev" ? "dev" : "text";
    const itemId = modal.dataset.itemId || "";
    const item = (mediaType === "dev" ? state.devItems || [] : state.items || []).find((candidate) => candidate.id === itemId);
    if (!item) return;
    const content = modal.querySelector("#managerCreateVersionContent")?.value.trim() || "";
    const base = String(modal.dataset.baseContent || "").trim();
    if (!content || content === base) {
      updateCreateVersionModalState(modal);
      return;
    }
    const updates = {
      title: (modal.querySelector("#managerCreateVersionTitle")?.value.trim() || "").slice(0, 30),
      content,
      note: modal.querySelector("#managerCreateVersionNote")?.value.trim() || ""
    };
    await createEmbeddedCaptureVersionForItem(item, mediaType, updates, modal.dataset.versionId || "");
    closeCreateVersionModal();
    render();
  }

  function openEditor(item, mediaType = "text") {
    closeManagerSearch();
    editingItem = item;
    editingItem.mediaType = mediaType;
    editorVersionSelection = currentEmbeddedVersionId(item, mediaType);
    const editorItem = itemDisplayVersion(item, mediaType);
    const editorVersion = "unified-text-editor-v8";
    let modal = document.getElementById("managerEditorModal");
    if (modal && modal.dataset.editorVersion !== editorVersion) {
      modal.remove();
      modal = null;
    }
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerEditorModal";
      modal.className = "mcp-editor-modal";
      modal.dataset.editorVersion = editorVersion;
      modal.innerHTML = [
        "<div class=\"mcp-search-backdrop\" data-manager-action=\"close-editor\"></div>",
        "<section class=\"manager-editor-card unified-text-editor-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"editor-heading\"></strong><button type=\"button\" data-manager-action=\"close-editor\">X</button></header>",
        "<div class=\"manager-editor-layout\">",
        "<div class=\"manager-editor-form-pane\">",
        "<div class=\"manager-editor-category-summary\" data-role=\"editor-category-summary\"></div>",
        "<label><span data-role=\"editor-title-label\"></span><input id=\"managerEditorTitle\" type=\"text\" maxlength=\"30\"></label>",
        "<label class=\"manager-editor-content-field\"><span data-role=\"editor-content-label\"></span><div class=\"manager-editor-code-wrap\"><pre class=\"manager-editor-line-numbers\" aria-hidden=\"true\">1</pre><textarea id=\"managerEditorContent\" rows=\"10\" wrap=\"soft\"></textarea></div></label>",
        "<label><span data-role=\"editor-note-label\"></span><textarea id=\"managerEditorNote\" rows=\"3\"></textarea></label>",
        "<p id=\"managerEditorError\" class=\"editor-error\"></p>",
        "<footer><button type=\"button\" class=\"primary\" data-manager-action=\"save-editor\"></button><button type=\"button\" data-manager-action=\"open-editor-classifier\"></button><button type=\"button\" data-manager-action=\"close-editor\"></button></footer>",
        "</div>",
        "</div>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
      const textarea = modal.querySelector("#managerEditorContent");
      textarea.addEventListener("input", () => {
        syncEditorLineNumbers(modal);
        resizeEditorContentField(modal);
      });
      textarea.addEventListener("scroll", () => syncEditorLineNumberScroll(modal));
    }
    translateEditorModal(modal);
    resetEditorActionFooter(modal);
    modal.hidden = false;
    modal.querySelector(".manager-editor-card").classList.toggle("is-code-editor", mediaType === "dev");
    modal.querySelector("#managerEditorContent").setAttribute("wrap", mediaType === "dev" ? "off" : "soft");
    modal.querySelector("#managerEditorTitle").value = editorItem.title || "";
    modal.querySelector("#managerEditorContent").value = editorItem.content || "";
    modal.querySelector("#managerEditorNote").value = editorItem.note || "";
    modal.querySelector("#managerEditorError").textContent = "";
    editorCategorySelection = item.categoryId || (mediaType === "dev" ? "dev-general" : "general");
    editorExpandedCategories.clear();
    expandEditorCategoryPath(editorCategorySelection);
    updateEditorCategorySummary();
    syncEditorLineNumbers(modal);
    requestAnimationFrame(() => {
      resizeEditorContentField(modal);
      modal.querySelector("#managerEditorContent")?.focus();
    });
  }

  function resetEditorActionFooter(modal) {
    const formPane = modal?.querySelector(".manager-editor-form-pane");
    let footer = formPane?.querySelector(":scope > footer");
    if (!formPane) return;
    if (!footer) {
      footer = document.createElement("footer");
      formPane.appendChild(footer);
    }
    const ensureButton = (action, className = "") => {
      let button = footer.querySelector(`[data-manager-action="${action}"]`);
      if (!button) {
        button = document.createElement("button");
        button.type = "button";
        button.dataset.managerAction = action;
        if (className) button.className = className;
        footer.appendChild(button);
      }
      button.hidden = false;
      button.disabled = false;
      button.removeAttribute("aria-hidden");
      button.style.removeProperty("display");
      button.style.removeProperty("visibility");
      button.style.removeProperty("opacity");
      return button;
    };
    ensureButton("save-editor", "primary");
    ensureButton("open-editor-classifier");
    ensureButton("close-editor");
    footer.hidden = false;
    footer.removeAttribute("aria-hidden");
    footer.style.removeProperty("display");
    footer.style.removeProperty("visibility");
    footer.style.removeProperty("opacity");
    translateEditorModal(modal);
  }

  function translateEditorModal(modal) {
    modal.querySelector("[data-role='editor-heading']").textContent = t("editor.heading");
    modal.querySelector("[data-role='editor-title-label']").textContent = t("editor.title");
    modal.querySelector("[data-role='editor-content-label']").textContent = t("editor.content");
    modal.querySelector("[data-role='editor-note-label']").textContent = t("editor.note");
    modal.querySelector("[data-manager-action='save-editor']").textContent = t("editor.saveChanges");
    modal.querySelector("[data-manager-action='open-editor-classifier']").textContent = t("categories.classify");
    modal.querySelector("footer [data-manager-action='close-editor']").textContent = t("common.cancel");
  }

  async function saveEditor() {
    const modal = document.getElementById("managerEditorModal");
    if (!editingItem || !modal) return;
    const content = modal.querySelector("#managerEditorContent").value.trim();
    if (!content) {
      modal.querySelector("#managerEditorError").textContent = t("editor.emptyContent");
      return;
    }
    const isDev = editingItem.mediaType === "dev";
    const categoryId = editorCategorySelection || editingItem.categoryId || (isDev ? "dev-general" : "general");
    const category = (isDev ? state.devCategories || [] : state.categories).find((item) => item.id === categoryId);
    const title = modal.querySelector("#managerEditorTitle").value.trim().slice(0, 30);
    if (isVaultCategoryId(categoryId)) {
      if (!canUseVault()) {
        openManagerProUpgradeModal("vault");
        showManagerToast(t("pro.vaultRequired"));
        return;
      }
      const unlocked = await ensureManagerVaultUnlocked();
      if (!unlocked) return;
    }
    const updates = isFavoriteCategoryId(categoryId) ? {
      title,
      content,
      isFavorite: true,
      note: modal.querySelector("#managerEditorNote").value.trim()
    } : {
      title,
      content,
      categoryId,
      categoryName: category?.name || "General",
      languageId: isDev ? categoryId : undefined,
      languageName: isDev ? (category?.name || "General") : undefined,
      note: modal.querySelector("#managerEditorNote").value.trim()
    };
    if (isVersioningEnabled() && versionableEditorChanged(modal)) {
      const shouldCreateVersion = await askCreateCaptureVersion();
      if (shouldCreateVersion) {
        await createEmbeddedCaptureVersion(updates, isDev);
        closeEditor({ force: true });
        return;
      }
    }
    await saveEmbeddedCaptureEdit(updates, isDev);
    render();
    showStatus(t("editor.saved"));
    closeEditor({ force: true });
  }

  async function closeEditor(options = {}) {
    const modal = document.getElementById("managerEditorModal");
    if (!options.force && state.settings.confirmUnsavedEdits && editingItem && editorHasUnsavedChanges(modal)) {
      const confirmed = await openManagerConfirmDialog({
        title: t("editor.heading"),
        message: t("editor.unsavedConfirm"),
        confirmText: t("common.close"),
        cancelText: t("common.cancel")
      });
      if (!confirmed) return;
      showManagerToast(t("editor.discarded"));
    }
    if (modal) modal.hidden = true;
    closeEditorCategoryChooser();
    editingItem = null;
    editorCategorySelection = "";
    editorVersionSelection = "";
    editorCategoryDragState = null;
    editorExpandedCategories.clear();
  }

  function updateEditorCategorySummary() {
    const modal = document.getElementById("managerEditorModal");
    const node = modal?.querySelector("[data-role='editor-category-summary']");
    if (!node || !editingItem) return;
    const path = editorSelectedCategoryPath(editorCategorySelection || editingItem.categoryId) || t("categories.general");
    node.textContent = `${t("editor.category")} : ${path}`;
    node.title = path;
  }

  function editorSelectedCategoryPath(categoryId) {
    const sourceCategories = editingItem?.mediaType === "dev" ? state.devCategories || [] : state.categories || [];
    const category = sourceCategories.find((current) => current.id === categoryId);
    if (!category) return "";
    const parts = [editorCategoryLabel(category)];
    let parent = sourceCategories.find((current) => current.id === category.parentId);
    while (parent) {
      parts.unshift(editorCategoryLabel(parent));
      parent = sourceCategories.find((current) => current.id === parent.parentId);
    }
    return parts.join(" > ");
  }

  function openEditorCategoryChooser() {
    if (!editingItem) return;
    let modal = document.getElementById("managerEditorCategoryModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerEditorCategoryModal";
      modal.className = "manager-modal manager-editor-category-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-editor-classifier\"></div>",
        "<section class=\"manager-category-card manager-editor-category-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"editor-classifier-title\"></strong><button type=\"button\" data-manager-action=\"close-editor-classifier\" aria-label=\"Close\">&times;</button></header>",
        "<div id=\"managerEditorCategoryTree\" class=\"category-list category-tree manager-editor-category-list\" data-role=\"editor-category-tree\"></div>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
    }
    modal.querySelector("[data-role='editor-classifier-title']").textContent = t("categories.classify");
    modal.querySelector("[data-manager-action='close-editor-classifier']").setAttribute("aria-label", t("common.close"));
    editorExpandedCategories.clear();
    expandEditorCategoryPath(editorCategorySelection || editingItem.categoryId);
    renderEditorCategoryTree(modal, editorCategorySelection);
    modal.hidden = false;
    requestAnimationFrame(() => modal.querySelector("#managerEditorCategoryTree")?.scrollTo({ top: 0, behavior: "instant" }));
  }

  function closeEditorCategoryChooser() {
    const modal = document.getElementById("managerEditorCategoryModal");
    if (modal) modal.hidden = true;
  }

  function resizeEditorContentField(modal) {
    const textarea = modal?.querySelector("#managerEditorContent");
    const wrap = modal?.querySelector(".manager-editor-code-wrap");
    if (!textarea || !wrap) return;
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 19;
    const lines = Math.max(4, Math.min(22, textarea.value.split("\n").length + 2));
    const naturalHeight = Math.max(lines * lineHeight + 28, Math.min(textarea.scrollHeight + 2, Math.round(window.innerHeight * 0.32)));
    const maxHeight = Math.max(170, Math.min(340, Math.round(window.innerHeight * 0.34)));
    const height = Math.min(maxHeight, Math.max(140, naturalHeight));
    wrap.style.setProperty("--editor-content-height", `${height}px`);
    syncEditorLineNumberScroll(modal);
  }

  function editorHasUnsavedChanges(modal) {
    if (!editingItem || !modal) return false;
    const title = modal.querySelector("#managerEditorTitle")?.value.trim() || "";
    const content = modal.querySelector("#managerEditorContent")?.value || "";
    const note = modal.querySelector("#managerEditorNote")?.value || "";
    const originalCategory = editingItem.categoryId || (editingItem.mediaType === "dev" ? "dev-general" : "general");
    const reference = itemDisplayVersion(editingItem, editingItem.mediaType === "dev" ? "dev" : "text");
    return title !== (reference.title || "")
      || content !== (reference.content || "")
      || note !== (reference.note || "")
      || (editorCategorySelection || originalCategory) !== originalCategory;
  }

  function openManagerConfirmDialog({ title, message, confirmText, cancelText, icon = "" }) {
    return new Promise((resolve) => {
      let modal = document.getElementById("managerConfirmModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "managerConfirmModal";
        modal.className = "manager-modal manager-confirm-modal";
        modal.hidden = true;
        modal.innerHTML = [
          "<div class=\"manager-backdrop\" data-manager-action=\"confirm-cancel\"></div>",
          "<section class=\"manager-confirm-card\" role=\"dialog\" aria-modal=\"true\">",
          "<header class=\"manager-category-dialog-head\"><strong data-role=\"confirm-title\"></strong><button type=\"button\" class=\"prompt-close\" data-manager-action=\"confirm-cancel\" aria-label=\"Close\">X</button></header>",
          "<p data-role=\"confirm-message\"></p>",
          "<footer><button type=\"button\" class=\"primary\" data-manager-action=\"confirm-accept\"></button><button type=\"button\" data-manager-action=\"confirm-cancel\"></button></footer>",
          "</section>"
        ].join("");
        document.body.appendChild(modal);
      }
      const cleanup = (value) => {
        modal.hidden = true;
        modal.querySelectorAll("[data-manager-action='confirm-accept'], [data-manager-action='confirm-cancel']").forEach((node) => { node.onclick = null; });
        resolve(value);
      };
      const titleNode = modal.querySelector("[data-role='confirm-title']");
      titleNode.replaceChildren();
      if (icon) {
        const img = document.createElement("img");
        img.className = "manager-confirm-title-icon";
        img.src = `../assets/icons/${icon}`;
        img.alt = "";
        img.setAttribute("aria-hidden", "true");
        titleNode.appendChild(img);
      }
      titleNode.append(document.createTextNode(title || t("common.confirm")));
      modal.querySelector("[data-role='confirm-message']").textContent = message || "";
      modal.querySelector("[data-manager-action='confirm-accept']").textContent = confirmText || t("common.confirm");
      const footerCancel = modal.querySelector("footer [data-manager-action='confirm-cancel']");
      footerCancel.textContent = cancelText || t("common.cancel");
      footerCancel.hidden = cancelText === null;
      modal.querySelector(".prompt-close").setAttribute("aria-label", t("common.close"));
      modal.querySelector("[data-manager-action='confirm-accept']").onclick = () => cleanup(true);
      modal.querySelectorAll("[data-manager-action='confirm-cancel']").forEach((node) => { node.onclick = () => cleanup(false); });
      modal.hidden = false;
      triggerMicroAnimation(modal.querySelector(".manager-confirm-card"), "soft-bounce", 280);
    });
  }

  function syncEditorLineNumbers(modal) {
    const textarea = modal?.querySelector("#managerEditorContent");
    const lines = modal?.querySelector(".manager-editor-line-numbers");
    if (!textarea || !lines) return;
    const count = Math.max(1, textarea.value.split("\n").length);
    lines.textContent = Array.from({ length: count }, (_, index) => String(index + 1)).join("\n");
    syncEditorLineNumberScroll(modal);
  }

  function syncEditorLineNumberScroll(modal) {
    const textarea = modal?.querySelector("#managerEditorContent");
    const lines = modal?.querySelector(".manager-editor-line-numbers");
    if (!textarea || !lines) return;
    lines.scrollTop = textarea.scrollTop;
  }

  function canCreateItemInCurrentView() {
    if (activeTab !== "text" && activeTab !== "dev") return false;
    if (favoritesOnly || isFavoriteCategoryId(selectedCategory) || isTrashCategoryId(selectedCategory)) return false;
    if (selectedCategory === "all") return true;
    return activeCategories().some((category) => category.id === selectedCategory && !category.isHidden);
  }

  function createTargetCategoryIdForCurrentView() {
    if (activeTab === "dev") return selectedCategory === "all" ? "dev-general" : selectedCategory;
    return selectedCategory === "all" ? "general" : selectedCategory;
  }

  function updateFloatingCreateItemButton() {
    const button = elements.openCreateItemFloating;
    if (!button) return;
    const visible = canCreateItemInCurrentView();
    button.hidden = !visible;
    if (!visible) return;
    const title = activeTab === "dev" ? t("creator.createCode") : t("creator.createText");
    button.title = title;
    button.setAttribute("aria-label", title);
  }

  function openCreateCurrentItemModal() {
    if (!canCreateItemInCurrentView()) return;
    const isDev = activeTab === "dev";
    const targetCategoryId = createTargetCategoryIdForCurrentView();
    const category = activeCategories().find((item) => item.id === targetCategoryId);
    let modal = document.getElementById("managerCreateItemModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerCreateItemModal";
      modal.className = "mcp-editor-modal";
      modal.innerHTML = [
        "<div class=\"mcp-search-backdrop\" data-manager-action=\"close-create-item\"></div>",
        "<section class=\"manager-create-item-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"mcp-search-head\"><strong data-role=\"create-heading\"></strong><button type=\"button\" data-manager-action=\"close-create-item\">X</button></header>",
        "<div class=\"manager-create-target\" data-role=\"create-target\"></div>",
        "<label><span data-role=\"create-title-label\"></span><input id=\"managerCreateTitle\" type=\"text\" maxlength=\"30\"></label>",
        "<label class=\"manager-create-content-field\"><span data-role=\"create-content-label\"></span><div class=\"manager-create-editor-wrap\"><pre class=\"manager-create-line-numbers\" aria-hidden=\"true\">1</pre><textarea id=\"managerCreateContent\" rows=\"14\"></textarea></div></label>",
        "<label><span data-role=\"create-note-label\"></span><textarea id=\"managerCreateNote\" rows=\"3\"></textarea></label>",
        "<p id=\"managerCreateError\" class=\"editor-error\"></p>",
        "<footer><button type=\"button\" class=\"primary\" data-manager-action=\"save-create-item\"></button><button type=\"button\" data-manager-action=\"close-create-item\"></button></footer>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
      const textarea = modal.querySelector("#managerCreateContent");
      textarea.addEventListener("input", () => syncCreateLineNumbers(modal));
      textarea.addEventListener("scroll", () => syncCreateLineNumberScroll(modal));
    }
    modal.dataset.mediaType = isDev ? "dev" : "text";
    modal.dataset.categoryId = category?.id || (isDev ? "dev-general" : "general");
    modal.querySelector(".manager-create-item-card").classList.toggle("is-code-create", isDev);
    modal.querySelector("[data-role='create-heading']").textContent = isDev ? t("creator.createCode") : t("creator.createText");
    modal.querySelector("[data-role='create-target']").textContent = t("creator.createIn", { path: translatedCategoryPath(modal.dataset.categoryId) || categoryLabel(category) || "General" });
    modal.querySelector("[data-role='create-title-label']").textContent = t("editor.title");
    modal.querySelector("[data-role='create-content-label']").textContent = t("editor.content");
    modal.querySelector("[data-role='create-note-label']").textContent = t("editor.note");
    modal.querySelector("[data-manager-action='save-create-item']").textContent = t("common.save");
    modal.querySelector("footer [data-manager-action='close-create-item']").textContent = t("common.cancel");
    modal.querySelector("#managerCreateTitle").value = "";
    modal.querySelector("#managerCreateContent").value = "";
    modal.querySelector("#managerCreateNote").value = "";
    modal.querySelector("#managerCreateError").textContent = "";
    modal.hidden = false;
    syncCreateLineNumbers(modal);
    requestAnimationFrame(() => modal.querySelector("#managerCreateContent")?.focus());
  }

  function closeCreateCurrentItemModal() {
    const modal = document.getElementById("managerCreateItemModal");
    if (modal) modal.hidden = true;
  }

  function syncCreateLineNumbers(modal) {
    const textarea = modal?.querySelector("#managerCreateContent");
    const lines = modal?.querySelector(".manager-create-line-numbers");
    if (!textarea || !lines) return;
    const count = Math.max(1, textarea.value.split("\n").length);
    lines.textContent = Array.from({ length: count }, (_, index) => String(index + 1)).join("\n");
    syncCreateLineNumberScroll(modal);
  }

  function syncCreateLineNumberScroll(modal) {
    const textarea = modal?.querySelector("#managerCreateContent");
    const lines = modal?.querySelector(".manager-create-line-numbers");
    if (!textarea || !lines) return;
    lines.scrollTop = textarea.scrollTop;
  }

  async function saveCreateCurrentItem() {
    const modal = document.getElementById("managerCreateItemModal");
    if (!modal) return;
    const content = modal.querySelector("#managerCreateContent").value.trim();
    if (!content) {
      modal.querySelector("#managerCreateError").textContent = t("editor.emptyContent");
      return;
    }
    const isDev = modal.dataset.mediaType === "dev";
    const categoryId = modal.dataset.categoryId || (isDev ? "dev-general" : "general");
    const category = (isDev ? state.devCategories || [] : state.categories).find((item) => item.id === categoryId);
    const categoryName = category?.name || "General";
    const title = modal.querySelector("#managerCreateTitle")?.value.trim().slice(0, 30) || "";
    const note = modal.querySelector("#managerCreateNote").value.trim();
    try {
      let result;
      if (isDev) {
        const detection = window.MCP.detectCodeLanguage(content);
        const detectedCategory = (state.devCategories || []).find((item) => item.id === detection.languageId);
        const currentRootId = rootCategoryIdFor(categoryId, state.devCategories || []);
        if (detection.isCode && detectedCategory && detectedCategory.id !== currentRootId) {
          openCreateCodeMismatchModal({ title, content, note, currentCategoryId: categoryId, detectedCategoryId: detectedCategory.id, detection });
          return;
        }
        result = await saveCreatedDevItem({ title, content, note, categoryId, detection });
      } else {
        result = await saveCreatedTextItem({ title, content, note, categoryId });
      }
      await finishCreateItemSave(result, categoryId, isDev ? t("creator.codeSaved") : t("creator.textSaved"));
    } catch (error) {
      if (handleCreateCaptureLimitError(error, modal)) return;
      modal.querySelector("#managerCreateError").textContent = error?.message || t("common.error");
    }
  }

  function handleCreateCaptureLimitError(error, sourceModal = null) {
    const mediaType = captureLimitMediaTypeFromError(error);
    if (!mediaType) return false;
    const limit = Number(error?.limit || window.MCP?.freeCaptureLimitFor?.(mediaType) || 5);
    const key = mediaType === "dev" ? "pro.codeLimitReached" : "pro.textLimitReached";
    const context = mediaType === "dev" ? "codeLimit" : "textLimit";
    const errorNode = sourceModal?.querySelector(".editor-error");
    if (errorNode) errorNode.textContent = t(key, { limit });
    showManagerToast(t(key, { limit }));
    openManagerProUpgradeModal(context);
    return true;
  }

  function captureLimitMediaTypeFromError(error) {
    if (!error) return "";
    if (error.mediaType === "dev" || error.code === "FREE_CODE_CAPTURE_LIMIT" || error.message === "free-code-capture-limit") return "dev";
    if (error.mediaType === "text" || error.code === "FREE_TEXT_CAPTURE_LIMIT" || error.message === "free-text-capture-limit") return "text";
    return "";
  }

  function rootCategoryIdFor(categoryId, categories) {
    const byId = new Map((categories || []).map((category) => [category.id, category]));
    let current = byId.get(categoryId);
    while (current?.parentId && byId.has(current.parentId)) {
      current = byId.get(current.parentId);
    }
    return current?.id || categoryId;
  }

  async function saveCreatedTextItem({ title = "", content, note, categoryId }) {
    const category = state.categories.find((item) => item.id === categoryId);
    const categoryName = category?.name || "General";
    const classification = window.MCP.classifyContent(content);
    return window.MCP.saveClipboardItem({
      title,
      content,
      type: classification.type,
      categoryId,
      categoryName,
      note,
      tags: classification.tags || []
    });
  }

  async function saveCreatedDevItem({ title = "", content, note, categoryId, detection }) {
    const category = (state.devCategories || []).find((item) => item.id === categoryId);
    const categoryName = category?.name || "General";
    const rootId = rootCategoryIdFor(categoryId, state.devCategories || []);
    const rootCategory = (state.devCategories || []).find((item) => item.id === rootId) || category;
    return window.MCP.saveDevItem({
      title,
      content,
      type: "code",
      categoryId,
      categoryName,
      languageId: rootCategory?.id || categoryId,
      languageName: rootCategory?.name || categoryName,
      detectionConfidence: detection?.confidence || 0,
      note,
      tags: ["code", rootCategory?.name || categoryName].filter(Boolean)
    });
  }

  async function finishCreateItemSave(result, categoryId, toastText) {
    await chrome.runtime.sendMessage({ type: MESSAGE_TYPES.STORAGE_REFRESH_REQUIRED }).catch(() => null);
    selectedCategory = categoryId;
    favoritesOnly = false;
    await loadState();
    showManagerToast(toastText);
    closeCreateCodeMismatchModal();
    closeCreateCurrentItemModal();
    if (result?.item?.id) {
      selectedIndex = Math.max(0, activeItems().findIndex((item) => item.id === result.item.id));
      render();
    }
  }

  function openCreateCodeMismatchModal({ title = "", content, note, currentCategoryId, detectedCategoryId, detection }) {
    const currentCategory = (state.devCategories || []).find((item) => item.id === currentCategoryId);
    const detectedCategory = (state.devCategories || []).find((item) => item.id === detectedCategoryId);
    let modal = document.getElementById("managerCreateCodeMismatchModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "managerCreateCodeMismatchModal";
      modal.className = "manager-modal create-code-mismatch-modal";
      modal.innerHTML = [
        "<div class=\"manager-backdrop\" data-manager-action=\"close-create-code-mismatch\"></div>",
        "<section class=\"manager-category-dialog-card create-code-mismatch-card\" role=\"dialog\" aria-modal=\"true\">",
        "<header class=\"manager-category-dialog-head\"><strong data-role=\"mismatch-title\"></strong><button type=\"button\" class=\"prompt-close\" data-manager-action=\"close-create-code-mismatch\" aria-label=\"Close\">X</button></header>",
        "<div class=\"create-code-mismatch-body\">",
        "<p data-role=\"mismatch-text\"></p>",
        "<dl><div><dt data-role=\"mismatch-current-label\"></dt><dd data-role=\"mismatch-current-value\"></dd></div><div><dt data-role=\"mismatch-detected-label\"></dt><dd data-role=\"mismatch-detected-value\"></dd></div></dl>",
        "<pre data-role=\"mismatch-preview\"></pre>",
        "</div>",
        "<footer><button type=\"button\" class=\"primary\" data-manager-action=\"save-create-code-detected\"></button><button type=\"button\" data-manager-action=\"save-create-code-current\"></button><button type=\"button\" data-manager-action=\"close-create-code-mismatch\"></button></footer>",
        "</section>"
      ].join("");
      document.body.appendChild(modal);
    }
    createCodeMismatchState = { title, content, note, currentCategoryId, detectedCategoryId, detection };
    const currentPath = translatedCategoryPath(currentCategoryId) || categoryLabel(currentCategory) || "General";
    const detectedName = categoryLabel(detectedCategory) || detection?.languageName || "General";
    modal.querySelector("[data-role='mismatch-title']").textContent = t("creator.codeMismatchTitle");
    modal.querySelector("[data-role='mismatch-text']").textContent = t("creator.codeMismatchText");
    modal.querySelector("[data-role='mismatch-current-label']").textContent = t("creator.currentCategory");
    modal.querySelector("[data-role='mismatch-current-value']").textContent = currentPath;
    modal.querySelector("[data-role='mismatch-detected-label']").textContent = t("creator.detectedCode");
    modal.querySelector("[data-role='mismatch-detected-value']").textContent = detectedName;
    modal.querySelector("[data-role='mismatch-preview']").textContent = content.slice(0, 900);
    modal.querySelector("[data-manager-action='save-create-code-detected']").textContent = t("creator.saveAsDetected", { language: detectedName });
    modal.querySelector("[data-manager-action='save-create-code-current']").textContent = t("creator.saveAsCurrent", { category: currentPath });
    modal.querySelector("footer [data-manager-action='close-create-code-mismatch']").textContent = t("common.cancel");
    modal.hidden = false;
  }

  function closeCreateCodeMismatchModal() {
    const modal = document.getElementById("managerCreateCodeMismatchModal");
    if (modal) modal.hidden = true;
    createCodeMismatchState = null;
  }

  async function saveCreateCodeMismatchChoice(choice) {
    if (!createCodeMismatchState) return;
    const targetCategoryId = choice === "detected" ? createCodeMismatchState.detectedCategoryId : createCodeMismatchState.currentCategoryId;
    try {
      const result = await saveCreatedDevItem({
        title: createCodeMismatchState.title || "",
        content: createCodeMismatchState.content,
        note: createCodeMismatchState.note,
        categoryId: targetCategoryId,
        detection: createCodeMismatchState.detection
      });
      await finishCreateItemSave(result, targetCategoryId, t("creator.codeSaved"));
    } catch (error) {
      if (handleCreateCaptureLimitError(error, document.getElementById("managerCreateCodeMismatchModal"))) return;
      showManagerToast(error?.message || t("common.error"));
    }
  }

  function renderEditorCategoryTree(modal, selectedId) {
    const tree = modal?.querySelector("#managerEditorCategoryTree");
    if (!tree) return;
    const sourceCategories = editingItem?.mediaType === "dev" ? state.devCategories || [] : state.categories || [];
    const rootNodes = buildTreeFromCategories(sourceCategories);
    const previousScroll = tree.scrollTop;
    tree.replaceChildren();
    renderEditorCategoryNodes(rootNodes, tree, 0, selectedId);
    requestAnimationFrame(() => {
      if (!editorCategoryDragState) tree.scrollTop = previousScroll;
    });
  }

  function renderEditorCategoryNodes(nodes, container, depth, selectedId) {
    nodes.forEach((category) => {
      if (depth > 0 && !editorExpandedCategories.has(category.parentId)) return;
      const editorIsDev = editingItem?.mediaType === "dev";
      const canDragCategory = editorIsDev
        ? !category.isDefault && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id)
        : !category.isDefault && !category.isSystem && !isGeneralCategoryId(category.id) && !isFavoriteCategoryId(category.id) && !isTrashCategoryId(category.id);
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
        dragHandle.setAttribute("aria-label", t("categories.drag"));
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
      toggle.setAttribute("aria-label", category.children?.length ? t("categories.toggleNamed", { name: displayName }) : displayName);

      const choice = document.createElement("button");
      choice.type = "button";
      choice.className = "manager-category-choice";
      choice.dataset.editorCategoryId = category.id;
      const isEditorSystemChoice = isGeneralCategoryId(category.id) || isFavoriteCategoryId(category.id) || isTrashCategoryId(category.id) || isVaultCategoryId(category.id);
      choice.dataset.label = displayName;
      choice.style.setProperty("--depth", String(depth));
      choice.title = displayName;
      choice.setAttribute("aria-label", displayName);
      if (isEditorSystemChoice) {
        choice.classList.add("is-editor-system-choice");
      }
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
      const label = document.createElement(isEditorSystemChoice ? "strong" : "span");
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

  function editorCategoryLabel(category) {
    if (!category) return "";
    if (isGeneralCategoryId(category.id)) return t("categories.general");
    if (isFavoriteCategoryId(category.id)) return t("categories.favorites");
    if (isTrashCategoryId(category.id)) return t("trash.title");
    if (isVaultCategoryId(category.id)) return t("vault.title");
    return categoryLabel(category) || category.name || category.id || "";
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
      .sort((left, right) => (left.order || 0) - (right.order || 0) || categoryLabel(left).localeCompare(categoryLabel(right), state.settings.language || "en", { sensitivity: "base" }));
    const orderedIds = siblings.map((category) => category.id).filter((id) => id !== source.id);
    const targetIndex = orderedIds.indexOf(targetCategory.id);
    const insertBefore = dropPosition === "before";
    orderedIds.splice(Math.max(0, targetIndex + (insertBefore ? 0 : 1)), 0, source.id);
    try {
      if (editingItem?.mediaType === "dev") await window.MCP.reorderDevCategories(parentId, orderedIds);
      else await window.MCP.reorderCategories(parentId, orderedIds);
      await loadState();
      renderEditorCategoryTree(document.getElementById("managerEditorModal"), editorCategorySelection);
      renderCategories();
      showManagerToast(t("categories.reordered"));
    } catch (error) {
      showManagerToast(error?.message || t("common.error"));
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

  function categoryPathFor(category, sourceCategories) {
    const parts = [window.MCP.translateCategoryName(category, state.settings.language || "en")];
    let parent = sourceCategories.find((current) => current.id === category.parentId);
    while (parent) {
      parts.unshift(window.MCP.translateCategoryName(parent, state.settings.language || "en"));
      parent = sourceCategories.find((current) => current.id === parent.parentId);
    }
    return parts.join(" > ");
  }

  async function createCategory() {
    const name = await openCategoryDialog({
      title: t("categories.create"),
      label: t("categories.categoryName"),
      placeholder: t("categories.categoryName"),
      confirmText: t("common.save")
    });
    if (!name) return;
    try {
      const data = await createCategoryViaBackground({
        name,
        icon: "folder",
        color: state.settings.accentColor || "#e50914"
      });
      if (data) applyStateData(data);
      await loadState();
      showManagerToast(t("categories.created"));
    } catch (error) {
      showManagerToast(error?.message || t("common.error"));
    }
  }

  async function createSubcategory(parent) {
    if (!parent || isGeneralCategoryId(parent.id) || isFavoriteCategoryId(parent.id) || isTrashCategoryId(parent.id)) return;
    const name = await openCategoryDialog({
      title: t("categories.createSubcategory"),
      label: `${t("categories.subcategoryName")} - ${categoryLabel(parent)}`,
      placeholder: `${t("categories.subcategoryName")} - ${categoryLabel(parent)}`,
      confirmText: t("categories.createAndClassify")
    });
    if (!name) return;
    try {
      const data = await createCategoryViaBackground({
        name,
        parentId: parent.id,
        icon: "folder",
        color: parent.color || state.settings.accentColor || "#e50914"
      });
      expandedCategories.add(parent.id);
      if (data) applyStateData(data);
      await loadState();
      showManagerToast(t("categories.created"));
    } catch (error) {
      showManagerToast(error?.message || t("common.error"));
    }
  }

  function isFavoriteCategoryId(id) {
    return id === "favorites" || id === "image-favorites" || id === "dev-favorites";
  }

  function isTrashCategoryId(id) {
    return id === "trash" || id === "image-trash" || id === "dev-trash";
  }

  function isTrashSelected() {
    return !favoritesOnly && isTrashCategoryId(selectedCategory);
  }

  function isVaultCategoryId(id) {
    return window.MCP.isVaultCategoryId ? window.MCP.isVaultCategoryId(id) : id === "vault" || id === "image-vault" || id === "dev-vault";
  }

  function isVaultSelected() {
    return !favoritesOnly && isVaultCategoryId(selectedCategory);
  }

  function canUseVault() {
    return window.MCP.canUseFeature ? window.MCP.canUseFeature("vault", state.settings) : true;
  }

  async function ensureManagerVaultUnlocked() {
    if (vaultSessionUnlocked) return true;
    const configured = await window.MCP.isVaultConfigured?.();
    return openManagerVaultModal(Boolean(configured));
  }

  function appendSourceMeta(meta, item) {
    if (!meta || !item?.sourceDomain) return;
    const span = document.createElement("span");
    span.className = "source-domain-with-favicon";
    const favicon = window.MCP.createSourceFaviconImage?.(item);
    if (favicon) span.appendChild(favicon);
    span.append(document.createTextNode(item.sourceDomain));
    meta.appendChild(span);
  }

  function renderInlineSourceMeta(node, item, parts = []) {
    if (!node) return;
    node.replaceChildren();
    const cleanParts = parts.filter(Boolean);
    const first = cleanParts.slice(0, 1);
    const rest = cleanParts.slice(1);
    first.forEach((part, index) => {
      if (index > 0) node.append(document.createTextNode(" - "));
      node.append(document.createTextNode(part));
    });
    if (item?.sourceDomain) {
      if (node.childNodes.length) node.append(document.createTextNode(" - "));
      const source = document.createElement("span");
      source.className = "source-domain-with-favicon";
      const favicon = window.MCP.createSourceFaviconImage?.(item);
      if (favicon) source.appendChild(favicon);
      source.append(document.createTextNode(item.sourceDomain));
      node.appendChild(source);
    }
    rest.forEach((part) => {
      if (node.childNodes.length) node.append(document.createTextNode(" - "));
      node.append(document.createTextNode(part));
    });
  }

  const VAULT_SECRET_QUESTION_IDS = Array.from({ length: 30 }, (_, index) => `vault.secretQuestion.${String(index + 1).padStart(2, "0")}`);

  function openManagerVaultModal(configured) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "manager-vault-modal";
      const card = document.createElement("section");
      card.className = "manager-vault-card";
      card.setAttribute("role", "dialog");
      card.setAttribute("aria-modal", "true");
      const header = document.createElement("header");
      const title = document.createElement("h2");
      setVaultModalTitle(title, t(configured ? "vault.unlockTitle" : "vault.setTitle"));
      const close = document.createElement("button");
      close.type = "button";
      close.className = "manager-text-close";
      close.setAttribute("aria-label", t("common.close"));
      close.innerHTML = "&times;";
      header.append(title, close);
      const info = document.createElement("p");
      info.className = "manager-vault-info";
      info.textContent = t("vault.localOnly");
      const fields = document.createElement("div");
      fields.className = "manager-vault-fields";
      const password = vaultPasswordField(configured ? "vault.password" : "vault.newPassword");
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
      error.className = "manager-vault-error";
      const actions = document.createElement("div");
      actions.className = "manager-vault-actions";
      const forgot = document.createElement("button");
      forgot.type = "button";
      forgot.textContent = t("vault.forgotPassword");
      const primary = document.createElement("button");
      primary.type = "button";
      primary.className = "primary";
      primary.textContent = t(configured ? "vault.unlock" : "vault.createPassword");
      const reset = document.createElement("button");
      reset.type = "button";
      reset.textContent = t("vault.resetPassword");
      if (configured) actions.append(forgot, reset);
      actions.append(primary);
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
      primary.addEventListener("click", async (event) => {
        if (blockDemoAction(event)) return;
        try {
          error.textContent = "";
          if (!configured && password.input.value !== confirmField.input.value) {
            error.textContent = t("vault.passwordMismatch");
            return;
          }
          if (configured) {
            const ok = await window.MCP.verifyVaultPassword(password.input.value);
            if (!ok) {
              error.textContent = t("vault.invalidPassword");
              return;
            }
            vaultSessionUnlocked = true;
            showManagerToast(t("vault.unlocked"));
            finish(true);
            return;
          }
          await window.MCP.setVaultPassword(password.input.value, {
            questionId: secretQuestion.select.value,
            answer: secretAnswer.input.value
          });
          vaultSessionUnlocked = true;
          showManagerToast(t("vault.created"));
          finish(true);
        } catch (err) {
          error.textContent = err?.message || t("common.error");
        }
      });
      forgot.addEventListener("click", async (event) => {
        if (blockDemoAction(event)) return;
        const recovered = await openManagerVaultRecoveryModal();
        if (!recovered) return;
        vaultSessionUnlocked = true;
        showManagerToast(t("vault.recoveryUnlocked"));
        finish(true);
      });
      reset.addEventListener("click", async (event) => {
        if (blockDemoAction(event)) return;
        const confirmed = await openManagerVaultResetConfirm();
        if (!confirmed) return;
        await window.MCP.resetVaultPasswordAndItems();
        vaultSessionUnlocked = false;
        await loadState();
        showManagerToast(t("vault.resetDone"));
        finish(false);
      });
      document.body.appendChild(overlay);
      password.input.focus();
    });
  }

  function vaultSecretQuestionField() {
    const wrap = document.createElement("label");
    const span = document.createElement("span");
    span.textContent = t("vault.secretQuestion");
    const select = document.createElement("select");
    VAULT_SECRET_QUESTION_IDS.forEach((key, index) => {
      const option = document.createElement("option");
      option.value = String(index + 1);
      option.textContent = t(key);
      select.appendChild(option);
    });
    wrap.append(span, select);
    return { wrap, select };
  }

  function openManagerVaultRecoveryModal() {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "manager-vault-modal is-nested";
      const card = vaultNestedCard(t("vault.recoveryTitle"));
      const info = document.createElement("p");
      info.className = "manager-vault-info";
      info.textContent = t("vault.recoveryText");
      const fields = document.createElement("div");
      fields.className = "manager-vault-fields";
      const question = vaultSecretQuestionField();
      const answer = vaultPasswordField("vault.secretAnswer");
      fields.append(question.wrap, answer.wrap);
      const error = document.createElement("p");
      error.className = "manager-vault-error";
      const actions = document.createElement("div");
      actions.className = "manager-vault-actions";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = t("common.cancel");
      const primary = document.createElement("button");
      primary.type = "button";
      primary.className = "primary";
      primary.textContent = t("vault.unlock");
      actions.append(cancel, primary);
      card.append(info, fields, error, actions);
      overlay.appendChild(card);
      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      card.querySelector("[data-role='vault-nested-close']")?.addEventListener("click", () => finish(false));
      cancel.addEventListener("click", () => finish(false));
      primary.addEventListener("click", async (event) => {
        if (blockDemoAction(event)) return;
        try {
          error.textContent = "";
          const ok = await window.MCP.verifyVaultRecovery(question.select.value, answer.input.value);
          if (!ok) {
            error.textContent = t("vault.recoveryFailed");
            showManagerToast(t("vault.recoveryFailed"));
            return;
          }
          const changed = await openManagerVaultRecoveryPasswordModal(question.select.value, answer.input.value);
          if (changed) finish(true);
        } catch (err) {
          error.textContent = err?.message || t("common.error");
        }
      });
      document.body.appendChild(overlay);
      question.select.focus();
    });
  }

  function openManagerVaultRecoveryPasswordModal(questionId, answerValue) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "manager-vault-modal is-nested";
      const card = vaultNestedCard(t("vault.changePasswordTitle"));
      const info = document.createElement("p");
      info.className = "manager-vault-info";
      info.textContent = t("vault.changePasswordText");
      const fields = document.createElement("div");
      fields.className = "manager-vault-fields";
      const password = vaultPasswordField("vault.newPassword");
      const confirmField = vaultPasswordField("vault.confirmPassword");
      fields.append(password.wrap, confirmField.wrap);
      const error = document.createElement("p");
      error.className = "manager-vault-error";
      const actions = document.createElement("div");
      actions.className = "manager-vault-actions";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = t("common.cancel");
      const primary = document.createElement("button");
      primary.type = "button";
      primary.className = "primary";
      primary.textContent = t("vault.changePassword");
      actions.append(cancel, primary);
      card.append(info, fields, error, actions);
      overlay.appendChild(card);
      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      card.querySelector("[data-role='vault-nested-close']")?.addEventListener("click", () => finish(false));
      cancel.addEventListener("click", () => finish(false));
      primary.addEventListener("click", async (event) => {
        if (blockDemoAction(event)) return;
        try {
          error.textContent = "";
          if (password.input.value !== confirmField.input.value) {
            error.textContent = t("vault.passwordMismatch");
            return;
          }
          await window.MCP.setVaultPassword(password.input.value, {
            questionId,
            answer: answerValue
          });
          showManagerToast(t("vault.passwordUpdated"));
          finish(true);
        } catch (err) {
          error.textContent = err?.message || t("common.error");
        }
      });
      document.body.appendChild(overlay);
      password.input.focus();
    });
  }

  function openManagerVaultResetConfirm() {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "manager-vault-modal is-nested";
      const card = vaultNestedCard(t("vault.resetConfirmTitle"));
      const info = document.createElement("p");
      info.className = "manager-vault-info";
      info.textContent = t("vault.resetWarning");
      const actions = document.createElement("div");
      actions.className = "manager-vault-actions";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.textContent = t("common.cancel");
      const primary = document.createElement("button");
      primary.type = "button";
      primary.className = "primary";
      primary.textContent = t("vault.confirmReset");
      actions.append(cancel, primary);
      card.append(info, actions);
      overlay.appendChild(card);
      const finish = (value) => {
        overlay.remove();
        resolve(value);
      };
      card.querySelector("[data-role='vault-nested-close']")?.addEventListener("click", () => finish(false));
      cancel.addEventListener("click", () => finish(false));
      primary.addEventListener("click", (event) => {
        if (blockDemoAction(event)) return;
        finish(true);
      });
      document.body.appendChild(overlay);
      primary.focus();
    });
  }

  function vaultNestedCard(titleText) {
    const card = document.createElement("section");
    card.className = "manager-vault-card";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-modal", "true");
    const header = document.createElement("header");
    const title = document.createElement("h2");
    setVaultModalTitle(title, titleText);
    const close = document.createElement("button");
    close.type = "button";
    close.className = "manager-text-close";
    close.dataset.role = "vault-nested-close";
    close.setAttribute("aria-label", t("common.close"));
    close.innerHTML = "&times;";
    header.append(title, close);
    card.appendChild(header);
    return card;
  }

  function setVaultModalTitle(title, text) {
    title.className = "manager-vault-title";
    const icon = document.createElement("img");
    icon.className = "manager-vault-title-icon";
    const suffix = document.documentElement.getAttribute("data-resolved-theme") === "light" ? "lightmod" : "darkmod";
    icon.src = `../assets/icons/locker-${suffix}.png`;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.textContent = text;
    title.replaceChildren(icon, label);
  }

  function vaultPasswordField(labelKey) {
    const wrap = document.createElement("label");
    const span = document.createElement("span");
    span.textContent = t(labelKey);
    const input = document.createElement("input");
    input.type = "password";
    input.autocomplete = "current-password";
    wrap.append(span, input);
    return { wrap, input };
  }

  function isGeneralCategoryId(id) {
    return id === "general" || id === "image-general" || id === "dev-general";
  }

  async function editCategory(category) {
    if (!category || category.isDefault) return;
    const labelKey = category.parentId ? "categories.subcategoryName" : "categories.categoryName";
    const name = await openCategoryDialog({
      title: t("common.edit"),
      label: t(labelKey),
      placeholder: t(labelKey),
      confirmText: t("common.save"),
      value: category.name
    });
    if (!name || name === category.name) return;
    try {
      const data = await updateCategoryViaBackground(category.id, { name });
      if (data) applyStateData(data);
      await loadState();
      selectedCategory = category.id;
      render();
      showManagerToast(t("categories.updated"));
    } catch (error) {
      showManagerToast(error?.message || t("common.error"));
    }
  }

  async function createCategoryViaBackground(category) {
    const response = await chrome.runtime.sendMessage({
      type: activeTab === "image" ? MESSAGE_TYPES.CREATE_IMAGE_CATEGORY : activeTab === "dev" ? MESSAGE_TYPES.CREATE_DEV_CATEGORY : MESSAGE_TYPES.CREATE_CATEGORY,
      category
    });
    if (!response?.ok) throw new Error(response?.error || "Category creation failed.");
    return response.data;
  }

  async function updateCategoryViaBackground(categoryId, updates) {
    const response = await chrome.runtime.sendMessage({
      type: activeTab === "image" ? MESSAGE_TYPES.UPDATE_IMAGE_CATEGORY : activeTab === "dev" ? MESSAGE_TYPES.UPDATE_DEV_CATEGORY : MESSAGE_TYPES.UPDATE_CATEGORY,
      categoryId,
      updates
    });
    if (!response?.ok) throw new Error(response?.error || t("common.error"));
    return response.data;
  }

  function openCategoryDialog({ title, label, placeholder, confirmText, value = "" }) {
    return new Promise((resolve) => {
      let modal = document.getElementById("managerPromptModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "managerPromptModal";
        modal.className = "manager-modal";
        modal.innerHTML = [
          "<div class=\"manager-backdrop\" data-manager-action=\"close-prompt\"></div>",
          "<section class=\"manager-category-dialog-card\" role=\"dialog\" aria-modal=\"true\">",
          "<header class=\"manager-category-dialog-head\"><strong data-role=\"prompt-title\"></strong><button type=\"button\" class=\"prompt-close\" data-manager-action=\"close-prompt\" aria-label=\"Close\">x</button></header>",
          "<label class=\"manager-category-dialog-field\"><span data-role=\"prompt-label\"></span><input id=\"managerPromptInput\" type=\"text\" maxlength=\"20\" autocomplete=\"off\" spellcheck=\"false\"></label>",
          "<p class=\"manager-category-dialog-error\" data-role=\"prompt-error\"></p>",
          "<footer><button type=\"button\" class=\"primary\" data-manager-action=\"confirm-prompt\"></button><button type=\"button\" data-manager-action=\"close-prompt\"></button></footer>",
          "</section>"
        ].join("");
        document.body.appendChild(modal);
      }
      const input = modal.querySelector("#managerPromptInput");
      modal.querySelector("[data-role='prompt-title']").textContent = title;
      modal.querySelector("[data-role='prompt-label']").textContent = label;
      modal.querySelector("[data-role='prompt-error']").textContent = "";
      modal.querySelector("[data-manager-action='confirm-prompt']").textContent = confirmText;
      modal.querySelector("footer [data-manager-action='close-prompt']").textContent = t("common.cancel");
      modal.querySelector(".prompt-close").setAttribute("aria-label", t("common.close"));
      input.value = value;
      input.removeAttribute("placeholder");
      const finalize = (value) => {
        modal.hidden = true;
        input.onkeydown = null;
        modal.querySelector("[data-manager-action='confirm-prompt']").onclick = null;
        modal.querySelectorAll("[data-manager-action='close-prompt']").forEach((node) => {
          node.onclick = null;
        });
        resolve(value);
      };
      const confirm = () => {
        const value = input.value.trim();
        const errorNode = modal.querySelector("[data-role='prompt-error']");
        if (!value) {
          errorNode.textContent = t("categories.createFailed");
          return;
        }
        if (value.length > 20) {
          errorNode.textContent = t("categories.maxLength");
          showManagerToast(t("categories.maxLength"));
          return;
        }
        finalize(value);
      };
      const close = () => finalize("");
      modal.querySelector("[data-manager-action='confirm-prompt']").onclick = confirm;
      modal.querySelectorAll("[data-manager-action='close-prompt']").forEach((node) => {
        node.onclick = close;
      });
      input.onkeydown = (event) => {
        if (event.key === "Enter") confirm();
        if (event.key === "Escape") close();
      };
      modal.hidden = false;
      triggerMicroAnimation(modal.querySelector(".manager-category-dialog-card"), "soft-bounce", 280);
      input.focus();
      input.select();
    });
  }

  function showStatus(text) {
    elements.status.hidden = false;
    elements.status.textContent = text;
    clearTimeout(showStatus.timer);
    showStatus.timer = setTimeout(() => {
      elements.status.hidden = true;
      elements.status.textContent = "";
    }, 2400);
  }

  function showManagerToast(text) {
    let toast = document.getElementById("managerToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "managerToast";
      toast.className = "manager-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(showManagerToast.timer);
    showManagerToast.timer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2600);
  }

  function handleKeyboard(event) {
    if (shouldIgnoreManagerKeyboard(event)) return;
    const visibleItems = activeTab === "image"
      ? filterImages(state.imageItems, elements.search.value)
      : filterManagerTextItems(activeTab === "dev" ? state.devItems || [] : state.items, elements.search.value, activeTab);
    if (event.key === "/" && document.activeElement !== elements.search) {
      event.preventDefault();
      elements.search.focus();
    }
    if (event.key === "Escape") {
      elements.search.value = "";
      elements.search.blur();
      render();
    }
    if (event.key === "ArrowDown") {
      selectedIndex = Math.min(selectedIndex + 1, Math.max(0, visibleItems.length - 1));
      render();
    }
    if (event.key === "ArrowUp") {
      selectedIndex = Math.max(0, selectedIndex - 1);
      render();
    }
    if (event.key === "Enter" && visibleItems[selectedIndex]) {
      if (activeTab === "image") copyImage(visibleItems[selectedIndex]);
      else copyItem(itemDisplayVersion(visibleItems[selectedIndex], activeTab), activeTab);
    }
  }

  function shouldIgnoreManagerKeyboard(event) {
    const target = event.target;
    if (!target) return false;
    const tagName = String(target.tagName || "").toLowerCase();
    if (tagName === "input" || tagName === "textarea" || tagName === "select") return true;
    if (target.isContentEditable) return true;
    return Boolean(target.closest?.(".mcp-editor-modal:not([hidden]), .manager-modal:not([hidden])"));
  }

  function filterImages(items, query) {
    const normalized = window.MCP.normalizeContent(query);
    const sorted = [...items].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return (b.lastCopiedAt || b.createdAt || 0) - (a.lastCopiedAt || a.createdAt || 0);
    });
    if (!normalized) return sorted;
    if (window.MCP.searchItems) {
      const byId = new Map(sorted.map((item) => [item.id, item]));
      const searchable = sorted.map((item) => Object.assign({}, item, {
        content: [
          item.title,
          item.altText,
          item.categoryName,
          item.sourceDomain,
          item.sourceUrl,
          item.sourceTitle,
          item.fileName,
          item.mimeType
        ].filter(Boolean).join(" "),
        preview: item.altText || item.title || item.sourceTitle || ""
      }));
      return window.MCP.searchItems(searchable, query, state.imageCategories || [], {
        maxResults: Number.MAX_SAFE_INTEGER,
        language: state.settings.language || "en"
      }).map((item) => byId.get(item.id) || item);
    }
    return sorted.filter((item) => window.MCP.normalizeContent([
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
      item.isScreenshot ? t("images.screenshot") : "",
      ...(item.imageCandidates || []),
      ...(item.tags || [])
    ].join(" ")).includes(normalized));
  }

  function applyTheme() {
    window.MCP.applyThemeSettings(state.settings);
  }

  function isVisualSettingsOnlyChange(previousSettings = {}, nextSettings = {}) {
    const visualKeys = new Set(["theme", "accentColor", "managerImageViewMode", "managerTextViewMode", "managerDevViewMode"]);
    const keys = new Set([
      ...Object.keys(previousSettings || {}),
      ...Object.keys(nextSettings || {})
    ]);
    for (const key of keys) {
      if (previousSettings?.[key] === nextSettings?.[key]) continue;
      if (!visualKeys.has(key)) return false;
    }
    return true;
  }

  function managerViewModeSettingsChanged(previousSettings = {}, nextSettings = {}) {
    return ["managerImageViewMode", "managerTextViewMode", "managerDevViewMode"].some((key) => previousSettings?.[key] !== nextSettings?.[key]);
  }

  function translateSidePanel() {
    document.querySelector(".topbar h1").textContent = t("app.name");
    document.querySelector(".topbar p").textContent = t("privacy.local");
    updateManagerSearchPlaceholder();
    elements.search.setAttribute("aria-label", t("common.search"));
    elements.categories.setAttribute("aria-label", t("settings.categories"));
    elements.items.setAttribute("aria-label", t("ui.copyHistory"));
    renderMontageButton();
    if (elements.categoryTreeSearch) {
      elements.categoryTreeSearch.placeholder = t("categories.search");
      elements.categoryTreeSearch.setAttribute("aria-label", t("categories.search"));
    }
    elements.newCategory.textContent = "+";
    elements.newCategory.title = t("categories.create");
    elements.newCategory.setAttribute("aria-label", t("categories.create"));
    elements.categoryPaneTitle.textContent = activeTab === "image" ? t("manager.imagePaneTitle") : activeTab === "dev" ? t("dev.codeCategories") : t("manager.textPaneTitle");
    elements.closeManager.setAttribute("aria-label", t("common.close"));
    if (elements.openManagerMenu) {
      elements.openManagerMenu.setAttribute("aria-label", t("popup.menu"));
      elements.openManagerMenu.title = t("popup.menu");
    }
    if (elements.openTools) {
      elements.openTools.setAttribute("aria-label", t("tools.title"));
      elements.openTools.title = t("tools.title");
    }
    if (elements.openSourceTimeline) {
      elements.openSourceTimeline.setAttribute("aria-label", t("sourceTimeline.button"));
      elements.openSourceTimeline.title = t("sourceTimeline.button");
    }
    elements.textTab.setAttribute("aria-label", t("tabs.text"));
    elements.textTab.title = t("tabs.text");
    const textLabel = elements.textTab.querySelector(".media-tab-label");
    if (textLabel) textLabel.textContent = t("tabs.text");
    elements.devTab?.setAttribute("aria-label", t("tabs.dev"));
    if (elements.devTab) elements.devTab.title = t("tabs.dev");
    const devLabel = elements.devTab?.querySelector(".media-tab-label");
    if (devLabel) devLabel.textContent = t("tabs.dev");
    elements.imageTab.setAttribute("aria-label", t("images.tab"));
    elements.imageTab.title = t("images.tab");
    const imageLabel = elements.imageTab.querySelector(".media-tab-label");
    if (imageLabel) imageLabel.textContent = t("images.tab");
    updateManagerImageProLock();
    updateManagerMontageProLock();
    elements.imageViewModes.querySelector("[data-view-mode='small']").textContent = t("images.viewSmall");
    elements.imageViewModes.querySelector("[data-view-mode='medium']").textContent = t("images.viewMedium");
    elements.imageViewModes.querySelector("[data-view-mode='large']").textContent = t("images.viewLarge");
    if (elements.textViewModes) {
      elements.textViewModes.setAttribute("aria-label", t("view.textCodeModes"));
      elements.textViewModes.querySelector("[data-text-view-mode='list']").textContent = t("view.list");
      elements.textViewModes.querySelector("[data-text-view-mode='card']").textContent = t("view.cards");
    }
  }

  function t(key, params = {}) {
    return window.MCP.t(key, params, state.settings.language || "en");
  }

  function updateManagerImageProLock() {
    if (!elements.imageTab) return;
    elements.imageTab.classList.remove("is-pro-locked");
    elements.imageTab.title = t("images.tab");
    elements.imageTab.querySelector(".media-tab-pro-icon")?.remove();
  }

  function renderMontageButton() {
    if (!elements.openMontage) return;
    let picture = elements.openMontage.querySelector(".floating-montage-icon");
    if (!picture) {
      picture = document.createElement("img");
      picture.className = "floating-montage-icon";
      picture.alt = "";
      picture.setAttribute("aria-hidden", "true");
    }
    picture.src = "../assets/icons/montage-lightmod.png";
    let label = elements.openMontage.querySelector("[data-role='montage-button-label']");
    if (!label) {
      label = document.createElement("span");
      label.dataset.role = "montage-button-label";
    }
    label.textContent = t("montage.button");
    const proBadge = elements.openMontage.querySelector(".floating-montage-pro-icon");
    elements.openMontage.replaceChildren(picture, label);
    if (proBadge) elements.openMontage.appendChild(proBadge);
    updateManagerMontageProLock();
  }

  function updateManagerMontageProLock() {
    if (!elements.openMontage) return;
    const locked = window.MCP.canUseFeature ? !window.MCP.canUseFeature("itemComposition", state.settings) : false;
    elements.openMontage.classList.toggle("is-pro-locked", locked);
    elements.openMontage.title = locked ? t("pro.montageRequired") : t("montage.button");
    let icon = elements.openMontage.querySelector(".floating-montage-pro-icon");
    if (!locked) {
      icon?.remove();
      return;
    }
    if (!icon) {
      icon = document.createElement("img");
      icon.className = "floating-montage-pro-icon";
      icon.src = "../assets/icons/pro-icon.png";
      icon.alt = t("license.getPro");
      elements.openMontage.appendChild(icon);
    }
  }

  function updateManagerSearchPlaceholder() {
    if (!elements.search) return;
    const key = activeTab === "image" ? "search.placeholderImageSingular" : activeTab === "dev" ? "search.placeholderCodeSingular" : "search.placeholderTextSingular";
    const placeholder = t(key);
    elements.search.placeholder = placeholder;
    elements.search.setAttribute("aria-label", placeholder);
  }

  function triggerMicroAnimation(element, className = "soft-bounce", duration = 280) {
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), duration);
  }
})();
