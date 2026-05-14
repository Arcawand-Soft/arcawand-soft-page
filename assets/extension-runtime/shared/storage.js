(function initStorage(global) {
  const { STORAGE_KEYS, DEFAULT_SETTINGS, CATEGORY_GENERAL, DEFAULT_CATEGORIES = [CATEGORY_GENERAL], DEFAULT_IMAGE_CATEGORIES = [], DEFAULT_DEV_CATEGORIES = [], DEV_GENERAL_CATEGORY_ID = "dev-general", createId, normalizeContent, createPreview, sortItems } = global.MCP;
  const IMAGE_GENERAL_ID = "image-general";
  const TEXT_FAVORITE_ID = "favorites";
  const IMAGE_FAVORITE_ID = "image-favorites";
  const DEV_FAVORITE_ID = "dev-favorites";
  const TEXT_TRASH_ID = "trash";
  const IMAGE_TRASH_ID = "image-trash";
  const DEV_TRASH_ID = "dev-trash";
  const TEXT_VAULT_ID = "vault";
  const IMAGE_VAULT_ID = "image-vault";
  const DEV_VAULT_ID = "dev-vault";
  const PROTECTED_GENERAL_IDS = new Set([CATEGORY_GENERAL.id, IMAGE_GENERAL_ID, DEV_GENERAL_CATEGORY_ID]);
  const PROTECTED_FAVORITE_IDS = new Set([TEXT_FAVORITE_ID, IMAGE_FAVORITE_ID, DEV_FAVORITE_ID]);
  const PROTECTED_TRASH_IDS = new Set([TEXT_TRASH_ID, IMAGE_TRASH_ID, DEV_TRASH_ID]);
  const PROTECTED_VAULT_IDS = new Set([TEXT_VAULT_ID, IMAGE_VAULT_ID, DEV_VAULT_ID]);
  const FAVORITE_CATEGORY_IDS = new Set(["favorite", TEXT_FAVORITE_ID, IMAGE_FAVORITE_ID, DEV_FAVORITE_ID]);
  const TRASH_CATEGORY_IDS = new Set([TEXT_TRASH_ID, IMAGE_TRASH_ID, DEV_TRASH_ID]);
  const VAULT_CATEGORY_IDS = new Set([TEXT_VAULT_ID, IMAGE_VAULT_ID, DEV_VAULT_ID]);

  async function chromeGet(keys) {
    return chrome.storage.local.get(keys);
  }

  async function chromeSet(data) {
    return chrome.storage.local.set(await sanitizePurgedItemWrites(data));
  }

  async function chromeSetWithPurgeMarkers(data, purgedKeys = []) {
    const keysToMark = purgedKeys.filter(Boolean);
    if (!keysToMark.length) return chromeSet(data);
    const purgeKey = STORAGE_KEYS.PURGE_MARKERS || "mcp_purge_markers";
    const stored = await chromeGet(purgeKey).catch(() => ({}));
    const purgeMarkers = Object.assign({}, stored?.[purgeKey] || {});
    const purgeAt = Date.now();
    keysToMark.forEach((key) => {
      purgeMarkers[key] = Math.max(Number(purgeMarkers[key]) || 0, purgeAt);
    });
    return chromeSet(Object.assign({}, data, { [purgeKey]: purgeMarkers }));
  }

  async function sanitizePurgedItemWrites(data = {}) {
    const purgeKey = STORAGE_KEYS.PURGE_MARKERS || "mcp_purge_markers";
    const itemKeys = [STORAGE_KEYS.ITEMS, STORAGE_KEYS.DEV_ITEMS, STORAGE_KEYS.IMAGE_ITEMS].filter(Boolean);
    if (!itemKeys.some((key) => Array.isArray(data?.[key]))) return data;
    const markers = data[purgeKey] || (await chromeGet(purgeKey).catch(() => ({})))?.[purgeKey] || {};
    if (!markers || typeof markers !== "object") return data;
    const next = Object.assign({}, data);
    itemKeys.forEach((key) => {
      if (!Array.isArray(next[key])) return;
      const purgeAt = Number(markers[key]) || 0;
      if (!purgeAt) return;
      next[key] = next[key].filter((item) => latestItemTimestamp(item) > purgeAt);
    });
    return next;
  }

  function latestItemTimestamp(item = {}) {
    const embeddedVersionTimestamp = Array.isArray(item.captureVersions)
      ? item.captureVersions.reduce((latest, version) => Math.max(
        latest,
        Number(version?.createdAt) || 0,
        Number(version?.updatedAt) || 0,
        Number(version?.savedAt) || 0,
        Number(version?.capturedAt) || 0
      ), 0)
      : 0;
    return Math.max(
      Number(item.createdAt) || 0,
      Number(item.updatedAt) || 0,
      Number(item.lastCopiedAt) || 0,
      Number(item.trashedAt) || 0,
      Number(item.capturedAt) || 0,
      Number(item.savedAt) || 0,
      embeddedVersionTimestamp
    );
  }

  async function getSettings() {
    const data = await chromeGet(STORAGE_KEYS.SETTINGS);
    const settings = Object.assign({}, DEFAULT_SETTINGS, data[STORAGE_KEYS.SETTINGS] || {});
    settings.dodoEnv = "live";
    delete settings.searchOpenAsOverlay;
    delete settings.searchIncludeNotes;
    delete settings.searchIncludeSourceUrls;
    if (!data[STORAGE_KEYS.SETTINGS]?.accentColor || data[STORAGE_KEYS.SETTINGS]?.accentColor === "#6366f1") {
      settings.accentColor = DEFAULT_SETTINGS.accentColor;
    }
    if (settings.privateModeUntil && Date.now() > settings.privateModeUntil) {
      settings.privateMode = false;
      settings.privateModeUntil = null;
      await saveSettings(settings);
    }
    if (global.MCP?.normalizeLicenseSettings) {
      const normalizedSettings = await global.MCP.normalizeLicenseSettings(settings);
      if (normalizedSettings && JSON.stringify(normalizedSettings) !== JSON.stringify(settings)) {
        const stampedSettings = Object.assign({}, normalizedSettings, { settingsUpdatedAt: Date.now() });
        await chromeSet({ [STORAGE_KEYS.SETTINGS]: stampedSettings });
        global.MCP?.cacheThemeSettings?.(stampedSettings);
        return stampedSettings;
      }
      if (normalizedSettings) return normalizedSettings;
    }
    return settings;
  }

  async function saveSettings(settings) {
    const merged = Object.assign({}, DEFAULT_SETTINGS, settings || {}, { dodoEnv: "live", settingsUpdatedAt: Date.now() });
    delete merged.searchOpenAsOverlay;
    delete merged.searchIncludeNotes;
    delete merged.searchIncludeSourceUrls;
    await chromeSet({ [STORAGE_KEYS.SETTINGS]: merged });
    global.MCP?.cacheThemeSettings?.(merged);
    return merged;
  }

  function localizeCategoriesForLanguage(categories, language) {
    if (!language) return categories;
    return categories.map((category) => {
      const localizedName = global.MCP?.translateCategoryName ? global.MCP.translateCategoryName(category, language) : category.name;
      return Object.assign({}, category, {
        rawName: category.rawName || category.name,
        name: category.isSystem || category.isDefault || isDefaultLibraryCategory(category) ? localizedName : category.name
      });
    });
  }

  function isDefaultLibraryCategory(category) {
    return [
      ...(global.MCP?.DEFAULT_CATEGORIES || []),
      ...(global.MCP?.DEFAULT_IMAGE_CATEGORIES || []),
      ...(global.MCP?.DEFAULT_DEV_CATEGORIES || [])
    ].some((item) => item.id === category.id);
  }

  async function getCategories(language = "") {
    await ensureDefaultCategories();
    const data = await chromeGet(STORAGE_KEYS.CATEGORIES);
    return localizeCategoriesForLanguage(sortCategories(data[STORAGE_KEYS.CATEGORIES] || [CATEGORY_GENERAL]), language);
  }

  async function getImageCategories(language = "") {
    await ensureDefaultImageCategories();
    const data = await chromeGet(STORAGE_KEYS.IMAGE_CATEGORIES);
    return localizeCategoriesForLanguage(sortCategories(data[STORAGE_KEYS.IMAGE_CATEGORIES] || DEFAULT_IMAGE_CATEGORIES), language);
  }

  async function getDevCategories(language = "") {
    await ensureDefaultDevCategories();
    const data = await chromeGet(STORAGE_KEYS.DEV_CATEGORIES);
    return localizeCategoriesForLanguage(sortCategories(data[STORAGE_KEYS.DEV_CATEGORIES] || DEFAULT_DEV_CATEGORIES), language);
  }

  async function ensureDefaultDevCategories() {
    const data = await chromeGet(STORAGE_KEYS.DEV_CATEGORIES);
    const categories = data[STORAGE_KEYS.DEV_CATEGORIES] || [];
    const byId = new Map(categories.map((category) => [category.id, category]));
    let changed = false;
    DEFAULT_DEV_CATEGORIES.forEach((defaultCategory) => {
      const existing = byId.get(defaultCategory.id);
      const normalizedDefault = normalizeCategory(defaultCategory);
      const isProtectedDefault = isProtectedRootCategory(defaultCategory.id);
      if (!existing) {
        byId.set(defaultCategory.id, normalizedDefault);
        changed = true;
        return;
      }
      const merged = Object.assign({}, normalizedDefault, existing, {
        id: defaultCategory.id,
        name: isProtectedDefault ? defaultCategory.name : (existing.name || defaultCategory.name),
        rawName: isProtectedDefault ? defaultCategory.name : (existing.rawName || existing.name || defaultCategory.name),
        customName: isProtectedDefault ? false : Boolean(existing.customName),
        parentId: null,
        keywords: Array.isArray(existing.keywords) && existing.keywords.length ? existing.keywords : defaultCategory.keywords,
        isDefault: defaultCategory.id === DEV_GENERAL_CATEGORY_ID,
        isSystem: true,
        isHidden: false
      });
      if (JSON.stringify(merged) !== JSON.stringify(existing)) {
        byId.set(defaultCategory.id, merged);
        changed = true;
      }
    });
    changed = pruneProtectedRootDuplicates(byId) || changed;
    if (changed) await chromeSet({ [STORAGE_KEYS.DEV_CATEGORIES]: sortCategories([...byId.values()]) });
  }

  async function ensureDefaultImageCategories() {
    const data = await chromeGet([STORAGE_KEYS.IMAGE_CATEGORIES, STORAGE_KEYS.DELETED_DEFAULT_IMAGE_CATEGORIES]);
    const categories = data[STORAGE_KEYS.IMAGE_CATEGORIES] || [];
    const deletedDefaultIds = new Set(data[STORAGE_KEYS.DELETED_DEFAULT_IMAGE_CATEGORIES] || []);
    const byId = new Map(categories.map((category) => [category.id, category]));
    let changed = false;

    DEFAULT_IMAGE_CATEGORIES.forEach((defaultCategory) => {
      if (!isProtectedRootCategory(defaultCategory.id) && deletedDefaultIds.has(defaultCategory.id)) return;
      const existing = byId.get(defaultCategory.id);
      const isProtectedDefault = isProtectedRootCategory(defaultCategory.id);
      if (!existing) {
        byId.set(defaultCategory.id, normalizeCategory(defaultCategory));
        changed = true;
        return;
      }
      const merged = Object.assign({}, normalizeCategory(defaultCategory), existing, {
        id: defaultCategory.id,
        name: isProtectedDefault ? defaultCategory.name : (existing.name || defaultCategory.name),
        rawName: isProtectedDefault ? defaultCategory.name : (existing.rawName || existing.name || defaultCategory.name),
        customName: isProtectedDefault ? false : Boolean(existing.customName),
        parentId: isProtectedDefault ? null : (existing.parentId ?? defaultCategory.parentId ?? null),
        keywords: Array.isArray(existing.keywords) && existing.keywords.length ? existing.keywords : defaultCategory.keywords,
        isDefault: defaultCategory.id === IMAGE_GENERAL_ID,
        isSystem: isProtectedDefault ? true : Boolean(existing.isSystem ?? defaultCategory.isSystem),
        isHidden: isProtectedDefault ? false : Boolean(existing.isHidden ?? defaultCategory.isHidden)
      });
      if (JSON.stringify(merged) !== JSON.stringify(existing)) {
        byId.set(defaultCategory.id, merged);
        changed = true;
      }
    });

    if (!byId.has(IMAGE_GENERAL_ID) && DEFAULT_IMAGE_CATEGORIES.length) {
      byId.set(IMAGE_GENERAL_ID, normalizeCategory(DEFAULT_IMAGE_CATEGORIES[0]));
      changed = true;
    }

    changed = pruneProtectedRootDuplicates(byId) || changed;

    if (changed) {
      await chromeSet({ [STORAGE_KEYS.IMAGE_CATEGORIES]: sortCategories([...byId.values()]) });
    }
  }

  async function ensureDefaultCategories() {
    const data = await chromeGet([STORAGE_KEYS.CATEGORIES, STORAGE_KEYS.DELETED_DEFAULT_CATEGORIES]);
    const categories = data[STORAGE_KEYS.CATEGORIES] || [];
    const deletedDefaultIds = new Set(data[STORAGE_KEYS.DELETED_DEFAULT_CATEGORIES] || []);
    const byId = new Map(categories.map((category) => [category.id, category]));
    let changed = false;

    DEFAULT_CATEGORIES.forEach((defaultCategory) => {
      if (!isProtectedRootCategory(defaultCategory.id) && deletedDefaultIds.has(defaultCategory.id)) return;
      const existing = byId.get(defaultCategory.id);
      const isProtectedDefault = isProtectedRootCategory(defaultCategory.id);
      if (!existing) {
        byId.set(defaultCategory.id, normalizeCategory(defaultCategory));
        changed = true;
        return;
      }

      const merged = Object.assign({}, normalizeCategory(defaultCategory), existing, {
        id: defaultCategory.id,
        name: isProtectedDefault ? defaultCategory.name : (existing.name || defaultCategory.name),
        rawName: isProtectedDefault ? defaultCategory.name : (existing.rawName || existing.name || defaultCategory.name),
        customName: isProtectedDefault ? false : Boolean(existing.customName),
        parentId: isProtectedDefault ? null : (existing.parentId ?? defaultCategory.parentId ?? null),
        keywords: Array.isArray(existing.keywords) && existing.keywords.length ? existing.keywords : defaultCategory.keywords,
        isDefault: defaultCategory.id === CATEGORY_GENERAL.id,
        isSystem: isProtectedDefault ? true : Boolean(existing.isSystem ?? defaultCategory.isSystem),
        isHidden: isProtectedDefault ? false : Boolean(existing.isHidden ?? defaultCategory.isHidden)
      });
      if (JSON.stringify(merged) !== JSON.stringify(existing)) {
        byId.set(defaultCategory.id, merged);
        changed = true;
      }
    });

    if (!byId.has(CATEGORY_GENERAL.id)) {
      byId.set(CATEGORY_GENERAL.id, normalizeCategory(CATEGORY_GENERAL));
      changed = true;
    }

    changed = pruneProtectedRootDuplicates(byId) || changed;

    if (changed) {
      await chromeSet({ [STORAGE_KEYS.CATEGORIES]: sortCategories([...byId.values()]) });
    }
  }

  function pruneProtectedRootDuplicates(byId) {
    let changed = false;
    byId.forEach((category, id) => {
      if (!category || category.parentId || isProtectedRootCategory(id)) return;
      if (!isBlankRootName(category) && !isProtectedRootName(category.name) && !isProtectedRootName(category.rawName)) return;
      byId.delete(id);
      changed = true;
    });
    return changed;
  }

  function isBlankRootName(category) {
    return !String(category?.name || category?.rawName || "").trim();
  }

  function isProtectedRootName(name) {
    const normalized = String(name || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase();
    return [
      "general",
      "generale",
      "allgemein",
      "favoris",
      "favorites",
      "favoriten",
      "favoritos",
      "preferiti",
      "corbeille",
      "trash",
      "papierkorb",
      "papelera",
      "cestino",
      "vault",
      "safe",
      "coffre-fort",
      "coffre fort",
      "cassaforte",
      "boveda",
      "tresor"
    ].includes(normalized);
  }

  function normalizeCategory(category) {
    return Object.assign({
      id: createId("cat"),
      name: "Nouvelle catégorie",
      parentId: null,
      icon: "folder",
      color: "#e50914",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: 9999,
      isSystem: false,
      isDefault: false,
      isHidden: false,
      keywords: []
    }, category || {});
  }

  function isProtectedGeneralCategory(categoryOrId) {
    const id = typeof categoryOrId === "string" ? categoryOrId : categoryOrId?.id;
    return PROTECTED_GENERAL_IDS.has(id);
  }

  function isProtectedFavoriteCategory(categoryOrId) {
    const id = typeof categoryOrId === "string" ? categoryOrId : categoryOrId?.id;
    return PROTECTED_FAVORITE_IDS.has(id);
  }

  function isProtectedTrashCategory(categoryOrId) {
    const id = typeof categoryOrId === "string" ? categoryOrId : categoryOrId?.id;
    return PROTECTED_TRASH_IDS.has(id);
  }

  function isProtectedVaultCategory(categoryOrId) {
    const id = typeof categoryOrId === "string" ? categoryOrId : categoryOrId?.id;
    return PROTECTED_VAULT_IDS.has(id);
  }

  function isTrashItem(item) {
    return TRASH_CATEGORY_IDS.has(String(item?.categoryId || ""))
      || TRASH_CATEGORY_IDS.has(String(item?.languageId || ""));
  }

  function isVaultCategoryId(id) {
    return VAULT_CATEGORY_IDS.has(String(id || ""));
  }

  function isVaultItem(item) {
    return VAULT_CATEGORY_IDS.has(String(item?.categoryId || ""))
      || VAULT_CATEGORY_IDS.has(String(item?.languageId || ""));
  }

  function canUseTrashManagement(settings = {}) {
    return global.MCP?.canUseFeature ? global.MCP.canUseFeature("trashManagement", settings) : true;
  }

  function bytesToBase64(bytes) {
    let binary = "";
    new Uint8Array(bytes || []).forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  function base64ToBytes(value) {
    const binary = atob(String(value || ""));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  async function deriveVaultPasswordHash(password, salt, iterations = 250000) {
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(String(password || "")),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations },
      passwordKey,
      256
    );
    return bytesToBase64(bits);
  }

  function safeEqual(left, right) {
    const a = String(left || "");
    const b = String(right || "");
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let index = 0; index < a.length; index += 1) diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
    return diff === 0;
  }

  async function getVaultAuth() {
    const data = await chromeGet(STORAGE_KEYS.VAULT_AUTH);
    return data[STORAGE_KEYS.VAULT_AUTH] || null;
  }

  async function isVaultConfigured() {
    const auth = await getVaultAuth();
    return Boolean(auth?.hash && auth?.salt);
  }

  async function setVaultPassword(password, recoveryOptions = {}) {
    const value = String(password || "");
    if (value.length < 8) throw new Error(resolveLocalizedMessage("vault.passwordTooShort", "Use at least 8 characters."));
    const recoveryQuestionId = String(recoveryOptions?.questionId || "");
    const recoveryAnswer = String(recoveryOptions?.answer || "").trim();
    if (!recoveryQuestionId) throw new Error(resolveLocalizedMessage("vault.secretQuestionRequired", "Choose a secret question."));
    if (recoveryAnswer.length < 2) throw new Error(resolveLocalizedMessage("vault.secretAnswerRequired", "Enter a secret answer."));
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const recoverySalt = crypto.getRandomValues(new Uint8Array(16));
    const iterations = 250000;
    const hash = await deriveVaultPasswordHash(value, salt, iterations);
    const recoveryHash = await deriveVaultPasswordHash(normalizeVaultRecoveryAnswer(recoveryAnswer), recoverySalt, iterations);
    const auth = {
      version: 1,
      algorithm: "PBKDF2-SHA-256",
      iterations,
      salt: bytesToBase64(salt),
      hash,
      recovery: {
        questionId: recoveryQuestionId,
        iterations,
        salt: bytesToBase64(recoverySalt),
        hash: recoveryHash
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await chromeSet({ [STORAGE_KEYS.VAULT_AUTH]: auth });
    return { configured: true };
  }

  async function verifyVaultPassword(password) {
    const auth = await getVaultAuth();
    if (!auth?.hash || !auth?.salt) return false;
    const hash = await deriveVaultPasswordHash(password, base64ToBytes(auth.salt), Number(auth.iterations || 250000));
    return safeEqual(hash, auth.hash);
  }

  function normalizeVaultRecoveryAnswer(value) {
    return String(value || "").trim().normalize("NFKC").toLocaleLowerCase();
  }

  async function verifyVaultRecovery(questionId, answer) {
    const auth = await getVaultAuth();
    const recovery = auth?.recovery || null;
    if (!recovery?.hash || !recovery?.salt || String(recovery.questionId || "") !== String(questionId || "")) return false;
    const hash = await deriveVaultPasswordHash(normalizeVaultRecoveryAnswer(answer), base64ToBytes(recovery.salt), Number(recovery.iterations || auth.iterations || 250000));
    return safeEqual(hash, recovery.hash);
  }

  async function resetVaultPasswordAndItems() {
    const data = await chromeGet([STORAGE_KEYS.ITEMS, STORAGE_KEYS.IMAGE_ITEMS, STORAGE_KEYS.DEV_ITEMS]);
    await chromeSet({
      [STORAGE_KEYS.ITEMS]: (data[STORAGE_KEYS.ITEMS] || []).filter((item) => !isVaultItem(item)),
      [STORAGE_KEYS.IMAGE_ITEMS]: (data[STORAGE_KEYS.IMAGE_ITEMS] || []).filter((item) => !isVaultItem(item)),
      [STORAGE_KEYS.DEV_ITEMS]: (data[STORAGE_KEYS.DEV_ITEMS] || []).filter((item) => !isVaultItem(item)),
      [STORAGE_KEYS.VAULT_AUTH]: null
    });
  }

  function isProtectedRootCategory(categoryOrId) {
    return isProtectedGeneralCategory(categoryOrId) || isProtectedFavoriteCategory(categoryOrId) || isProtectedTrashCategory(categoryOrId) || isProtectedVaultCategory(categoryOrId);
  }

  function protectedRootRank(category) {
    if (category?.parentId) return 4;
    if (isProtectedGeneralCategory(category)) return 0;
    if (isProtectedFavoriteCategory(category)) return 1;
    if (isProtectedVaultCategory(category)) return 2;
    if (isProtectedTrashCategory(category)) return 3;
    return 4;
  }

  function sortCategories(categories) {
    return [...categories].sort((a, b) => {
      const aRank = protectedRootRank(a);
      const bRank = protectedRootRank(b);
      if (aRank !== bRank) return aRank - bRank;
      return (a.order || 0) - (b.order || 0) || String(a.name).localeCompare(String(b.name));
    });
  }

  async function saveCategory(category) {
    return createCategory(category || {});
  }

  async function createCategory({ name, parentId = null, icon = "folder", color = "#e50914", keywords = [] }) {
    const categories = await getCategories();
    const now = Date.now();
    if (parentId) {
      const parent = categories.find((category) => category.id === parentId);
      if (!parent) throw new Error("Catégorie parent introuvable.");
      if (isProtectedRootCategory(parent)) throw new Error(resolveLocalizedMessage("categories.protectedNoSubcategory", "This protected category cannot have subcategories."));
      if (parent.parentId) throw new Error("La V1 limite les catégories à deux niveaux.");
    }
    const resolvedName = validateCategoryName(name);
    const nextCategory = normalizeCategory({
      id: createId("cat"),
      name: resolvedName || "Nouvelle catégorie",
      parentId,
      icon,
      color,
      keywords,
      createdAt: now,
      updatedAt: now,
      order: nextCategoryOrder(categories, parentId, resolvedName || "Nouvelle catégorie")
    });
    const next = categories.filter((item) => item.id !== nextCategory.id).concat(nextCategory);
    await chromeSet({ [STORAGE_KEYS.CATEGORIES]: sortCategories(resequenceSiblingOrders(next, parentId)) });
    return nextCategory;
  }

  async function createSubcategory(parentId, name, options = {}) {
    return createCategory(Object.assign({}, options, { parentId, name }));
  }

  async function createImageCategory({ name, parentId = null, icon = "image", color = "#e50914", keywords = [] }) {
    const categories = await getImageCategories();
    const now = Date.now();
    if (parentId) {
      const parent = categories.find((category) => category.id === parentId);
      if (!parent) throw new Error("Image category parent not found.");
      if (isProtectedRootCategory(parent)) throw new Error(resolveLocalizedMessage("categories.protectedNoSubcategory", "This protected category cannot have subcategories."));
      if (parent.parentId) throw new Error("Image categories are limited to two levels.");
    }
    const resolvedName = validateCategoryName(name);
    const nextCategory = normalizeCategory({
      id: createId("imgcat"),
      name: resolvedName || "New image category",
      parentId,
      icon,
      color,
      keywords,
      createdAt: now,
      updatedAt: now,
      order: nextCategoryOrder(categories, parentId, resolvedName || "New image category")
    });
    await chromeSet({ [STORAGE_KEYS.IMAGE_CATEGORIES]: sortCategories(resequenceSiblingOrders(categories.concat(nextCategory), parentId)) });
    return nextCategory;
  }

  async function createImageSubcategory(parentId, name, options = {}) {
    return createImageCategory(Object.assign({}, options, { parentId, name }));
  }

  async function createDevSubcategory(parentId, name, options = {}) {
    await ensureDefaultDevCategories();
    const categories = await getDevCategories();
    const parent = categories.find((category) => category.id === parentId);
    if (!parent) throw new Error("Dev category parent not found.");
    if (isProtectedRootCategory(parent)) throw new Error(resolveLocalizedMessage("categories.protectedNoSubcategory", "This protected category cannot have subcategories."));
    if (parent.parentId) throw new Error("Dev categories are limited to two levels.");
    const resolvedName = validateCategoryName(name);
    const now = Date.now();
    const nextCategory = normalizeCategory(Object.assign({
      id: createId("devcat"),
      name: resolvedName || "New subcategory",
      parentId: parent.id,
      icon: "code",
      color: parent.color || options.color || "#e50914",
      keywords: [],
      createdAt: now,
      updatedAt: now,
      order: nextCategoryOrder(categories, parent.id, resolvedName || "New subcategory"),
      isSystem: false,
      isDefault: false,
      isHidden: false
    }, options || {}, {
      name: resolvedName || options?.name || "New subcategory",
      parentId: parent.id,
      isSystem: false,
      isDefault: false
    }));
    await chromeSet({ [STORAGE_KEYS.DEV_CATEGORIES]: sortCategories(resequenceSiblingOrders(categories.concat(nextCategory), parent.id)) });
    return nextCategory;
  }

  function nextCategoryOrder(categories, parentId, name = "") {
    const siblings = categories.filter((category) => (category.parentId || null) === (parentId || null));
    if (!name) {
      const maxOrder = siblings.reduce((max, category) => Math.max(max, Number(category.order || 0)), 0);
      return maxOrder + 1;
    }
    const ordered = [...siblings, { name }].sort((left, right) => String(left.name).localeCompare(String(right.name), undefined, { sensitivity: "base" }));
    return ordered.findIndex((category) => category.name === name) + 1 || siblings.length + 1;
  }

  async function deleteCategory(id) {
    if (id === CATEGORY_GENERAL.id) return false;
    const categories = await getCategories();
    const category = categories.find((item) => item.id === id);
    if (category?.isSystem) return false;
    const descendants = collectDescendantCategoryIds(categories, id);
    const idsToDelete = new Set([id, ...descendants]);
    const data = await chromeGet(STORAGE_KEYS.DELETED_DEFAULT_CATEGORIES);
    const defaultIds = new Set(DEFAULT_CATEGORIES.map((item) => item.id));
    const deletedDefaultIds = new Set(data[STORAGE_KEYS.DELETED_DEFAULT_CATEGORIES] || []);
    idsToDelete.forEach((categoryId) => {
      if (defaultIds.has(categoryId)) deletedDefaultIds.add(categoryId);
    });
    await chromeSet({
      [STORAGE_KEYS.CATEGORIES]: categories.filter((category) => !idsToDelete.has(category.id)),
      [STORAGE_KEYS.DELETED_DEFAULT_CATEGORIES]: [...deletedDefaultIds]
    });
    const items = await getClipboardItems();
    const fallbackCategory = category?.parentId
      ? categories.find((item) => item.id === category.parentId) || CATEGORY_GENERAL
      : CATEGORY_GENERAL;
    await chromeSet({
      [STORAGE_KEYS.ITEMS]: items.map((item) => idsToDelete.has(item.categoryId)
        ? Object.assign({}, item, { categoryId: fallbackCategory.id, categoryName: fallbackCategory.name })
        : item)
    });
    return true;
  }

  async function updateImageCategory(id, updates) {
    const categories = await getImageCategories();
    let updatedCategory = null;
    const next = categories.map((category) => {
      if (category.id !== id) return category;
      if (Object.prototype.hasOwnProperty.call(updates || {}, "name")) {
        updates = Object.assign({}, updates, { name: validateCategoryName(updates.name) });
      }
      const guarded = category.id === IMAGE_GENERAL_ID
        ? Object.assign({}, updates, { id, name: DEFAULT_IMAGE_CATEGORIES[0]?.name || "General", parentId: null, isDefault: true, isSystem: true, isHidden: false })
        : updates;
      if (category.id !== IMAGE_GENERAL_ID && Object.prototype.hasOwnProperty.call(guarded || {}, "name")) {
        guarded.customName = true;
      }
      updatedCategory = normalizeCategory(Object.assign({}, category, guarded, { updatedAt: Date.now() }));
      return updatedCategory;
    });
    const parentId = (updatedCategory?.parentId ?? categories.find((category) => category.id === id)?.parentId) || null;
    const reordered = Object.prototype.hasOwnProperty.call(updates || {}, "name")
      ? resequenceSiblingOrders(next, parentId)
      : next;
    await chromeSet({ [STORAGE_KEYS.IMAGE_CATEGORIES]: sortCategories(reordered) });
    return updatedCategory;
  }

  async function deleteImageCategory(id) {
    if (id === IMAGE_GENERAL_ID) return false;
    const categories = await getImageCategories();
    const category = categories.find((item) => item.id === id);
    if (category?.isSystem) return false;
    const descendants = collectDescendantCategoryIds(categories, id);
    const idsToDelete = new Set([id, ...descendants]);
    const data = await chromeGet(STORAGE_KEYS.DELETED_DEFAULT_IMAGE_CATEGORIES);
    const defaultIds = new Set(DEFAULT_IMAGE_CATEGORIES.map((item) => item.id));
    const deletedDefaultIds = new Set(data[STORAGE_KEYS.DELETED_DEFAULT_IMAGE_CATEGORIES] || []);
    idsToDelete.forEach((categoryId) => {
      if (defaultIds.has(categoryId)) deletedDefaultIds.add(categoryId);
    });
    await chromeSet({
      [STORAGE_KEYS.IMAGE_CATEGORIES]: categories.filter((item) => !idsToDelete.has(item.id)),
      [STORAGE_KEYS.DELETED_DEFAULT_IMAGE_CATEGORIES]: [...deletedDefaultIds]
    });
    const fallbackCategory = categories.find((item) => item.id === IMAGE_GENERAL_ID) || DEFAULT_IMAGE_CATEGORIES[0];
    const images = await getImageItems();
    await chromeSet({
      [STORAGE_KEYS.IMAGE_ITEMS]: images.map((item) => idsToDelete.has(item.categoryId)
        ? Object.assign({}, item, { categoryId: fallbackCategory.id, categoryName: fallbackCategory.name })
        : item)
    });
    return true;
  }

  function collectDescendantCategoryIds(categories, parentId) {
    const direct = categories.filter((category) => category.parentId === parentId).map((category) => category.id);
    return direct.flatMap((id) => [id, ...collectDescendantCategoryIds(categories, id)]);
  }

  async function updateCategory(id, updates) {
    const categories = await getCategories();
    let updatedCategory = null;
    const next = categories.map((category) => {
      if (category.id !== id) return category;
      if (Object.prototype.hasOwnProperty.call(updates || {}, "name")) {
        updates = Object.assign({}, updates, { name: validateCategoryName(updates.name) });
      }
      const guarded = category.id === CATEGORY_GENERAL.id
        ? Object.assign({}, updates, {
          id,
          name: CATEGORY_GENERAL.name,
          parentId: null,
          isDefault: true,
          isSystem: true,
          isHidden: false
        })
        : updates;
      if (category.id !== CATEGORY_GENERAL.id && Object.prototype.hasOwnProperty.call(guarded || {}, "name")) {
        guarded.customName = true;
      }
      updatedCategory = normalizeCategory(Object.assign({}, category, guarded, { updatedAt: Date.now() }));
      return updatedCategory;
    });
    const parentId = (updatedCategory?.parentId ?? categories.find((category) => category.id === id)?.parentId) || null;
    const reordered = Object.prototype.hasOwnProperty.call(updates || {}, "name")
      ? resequenceSiblingOrders(next, parentId)
      : next;
    await chromeSet({ [STORAGE_KEYS.CATEGORIES]: sortCategories(reordered) });
    return updatedCategory;
  }

  async function updateDevCategory(id, updates) {
    await ensureDefaultDevCategories();
    const categories = await getDevCategories();
    let updatedCategory = null;
    const next = categories.map((category) => {
      if (category.id !== id) return category;
      const isRoot = !category.parentId;
      const safeUpdates = Object.assign({}, updates || {});
      if (isRoot) {
        delete safeUpdates.name;
        delete safeUpdates.parentId;
        safeUpdates.id = id;
        safeUpdates.isSystem = true;
        safeUpdates.isDefault = category.id === DEV_GENERAL_CATEGORY_ID;
        safeUpdates.isHidden = false;
      } else if (Object.prototype.hasOwnProperty.call(safeUpdates, "name")) {
        safeUpdates.name = validateCategoryName(safeUpdates.name);
        safeUpdates.customName = true;
      }
      updatedCategory = normalizeCategory(Object.assign({}, category, safeUpdates, { updatedAt: Date.now() }));
      return updatedCategory;
    });
    const parentId = (updatedCategory?.parentId ?? categories.find((category) => category.id === id)?.parentId) || null;
    const reordered = Object.prototype.hasOwnProperty.call(updates || {}, "name") && updatedCategory?.parentId
      ? resequenceSiblingOrders(next, parentId)
      : next;
    await chromeSet({ [STORAGE_KEYS.DEV_CATEGORIES]: sortCategories(reordered) });
    return updatedCategory;
  }

  async function deleteDevCategory(id) {
    await ensureDefaultDevCategories();
    const categories = await getDevCategories();
    const category = categories.find((item) => item.id === id);
    if (!category || !category.parentId || category.isSystem || category.isDefault) return false;
    const descendants = collectDescendantCategoryIds(categories, id);
    const idsToDelete = new Set([id, ...descendants]);
    await chromeSet({
      [STORAGE_KEYS.DEV_CATEGORIES]: categories.filter((item) => !idsToDelete.has(item.id))
    });
    const fallbackCategory = categories.find((item) => item.id === category.parentId)
      || categories.find((item) => item.id === DEV_GENERAL_CATEGORY_ID)
      || DEFAULT_DEV_CATEGORIES[0];
    const items = await getDevItems();
    await chromeSet({
      [STORAGE_KEYS.DEV_ITEMS]: items.map((item) => idsToDelete.has(item.categoryId)
        ? Object.assign({}, item, {
          categoryId: fallbackCategory.id,
          categoryName: fallbackCategory.name,
          languageId: fallbackCategory.id,
          languageName: fallbackCategory.name
        })
        : item)
    });
    return true;
  }

  async function getCategoryTree(includeHidden = false) {
    const categories = await getCategories();
    return buildCategoryTree(categories, includeHidden);
  }

  async function getImageCategoryTree(includeHidden = false) {
    const categories = await getImageCategories();
    return buildCategoryTree(categories, includeHidden);
  }

  async function getDevCategoryTree(includeHidden = false) {
    const categories = await getDevCategories();
    return buildCategoryTree(categories, includeHidden);
  }

  function buildCategoryTree(categories, includeHidden = false) {
    const visible = includeHidden ? categories : categories.filter((category) => !category.isHidden);
    const byParent = new Map();
    visible.forEach((category) => {
      const parentId = category.parentId || null;
      byParent.set(parentId, (byParent.get(parentId) || []).concat(Object.assign({}, category, { children: [] })));
    });

    function attach(parentId) {
      return sortCategories(byParent.get(parentId) || []).map((category) => Object.assign({}, category, {
        children: attach(category.id)
      }));
    }

    return attach(null);
  }

  function resequenceSiblingOrders(categories, parentId) {
    const siblings = categories
      .filter((category) => (category.parentId || null) === (parentId || null))
      .sort((left, right) => {
        const leftRank = protectedRootRank(left);
        const rightRank = protectedRootRank(right);
        if (leftRank !== rightRank) return leftRank - rightRank;
        return String(left.name).localeCompare(String(right.name), undefined, { sensitivity: "base" });
      });
    const byId = new Map(categories.map((category) => [category.id, category]));
    siblings.forEach((category, index) => {
      byId.set(category.id, Object.assign({}, byId.get(category.id), { order: index + 1 }));
    });
    return [...byId.values()];
  }

  function validateCategoryName(name) {
    const value = String(name || "").trim();
    if (!value) return "";
    if (value.length > 20) throw new Error(resolveLocalizedMessage("categories.maxLength", "Maximum length reached"));
    return value;
  }

  function resolveLocalizedMessage(key, fallback) {
    try {
      return global.MCP?.t?.(key, {}, global.MCP?.DEFAULT_SETTINGS?.language || "en") || fallback || key;
    } catch (error) {
      return fallback || key;
    }
  }

  async function reorderCategories(parentId, orderedIds) {
    return reorderCategoryList(STORAGE_KEYS.CATEGORIES, parentId, orderedIds);
  }

  async function reorderImageCategories(parentId, orderedIds) {
    return reorderCategoryList(STORAGE_KEYS.IMAGE_CATEGORIES, parentId, orderedIds);
  }

  async function reorderDevCategories(parentId, orderedIds) {
    await ensureDefaultDevCategories();
    return reorderCategoryList(STORAGE_KEYS.DEV_CATEGORIES, parentId, orderedIds);
  }

  async function reorderCategoryList(storageKey, parentId, orderedIds) {
    const data = await chromeGet(storageKey);
    const categories = Array.isArray(data[storageKey]) ? data[storageKey] : [];
    const siblings = categories
      .filter((category) => (category.parentId || null) === (parentId || null))
      .sort((a, b) => {
        const aRank = protectedRootRank(a);
        const bRank = protectedRootRank(b);
        if (aRank !== bRank) return aRank - bRank;
        return (a.order || 0) - (b.order || 0) || String(a.name).localeCompare(String(b.name));
      });
    const byId = new Map(categories.map((category) => [category.id, category]));
    const lockedIds = siblings.filter((category) => protectedRootRank(category) < 3).map((category) => category.id);
    const ids = orderedIds.filter((id) => !lockedIds.includes(id) && siblings.some((category) => category.id === id));
    lockedIds.forEach((id, index) => {
      const category = byId.get(id);
      if (category) byId.set(id, Object.assign({}, category, { order: index + 1, updatedAt: Date.now() }));
    });
    ids.forEach((id, index) => {
      const category = byId.get(id);
      if (category) byId.set(id, Object.assign({}, category, { order: lockedIds.length + index + 1, updatedAt: Date.now() }));
    });
    siblings
      .filter((category) => !lockedIds.includes(category.id) && !ids.includes(category.id))
      .forEach((category, offset) => {
        byId.set(category.id, Object.assign({}, category, {
          order: lockedIds.length + ids.length + offset + 1,
          updatedAt: Date.now()
        }));
      });
    await chromeSet({ [storageKey]: sortCategories([...byId.values()]) });
    return [...byId.values()];
  }

  async function guessCategoryForCopiedText(text) {
    const categories = (await getCategories()).filter((category) => !category.isHidden);
    const normalized = normalizeContent(text);
    let best = null;

    categories.forEach((category) => {
      if (category.id === CATEGORY_GENERAL.id) return;
      const score = (category.keywords || []).reduce((total, keyword) => {
        const value = normalizeContent(keyword);
        if (!value) return total;
        return normalized.includes(value) ? total + Math.max(1, value.length / 8) : total;
      }, 0);
      if (score > 0 && (!best || score > best.score)) {
        best = { category, score };
      }
    });

    return best?.category || categories.find((category) => category.id === CATEGORY_GENERAL.id) || CATEGORY_GENERAL;
  }

  async function getClipboardItems() {
    const data = await chromeGet(STORAGE_KEYS.ITEMS);
    const items = (data[STORAGE_KEYS.ITEMS] || []).map(normalizeClipboardItem);
    return sortItems(items);
  }

  async function getImageItems() {
    const data = await chromeGet(STORAGE_KEYS.IMAGE_ITEMS);
    return sortItems((data[STORAGE_KEYS.IMAGE_ITEMS] || []).map(normalizeImageItem));
  }

  async function getDevItems() {
    const data = await chromeGet(STORAGE_KEYS.DEV_ITEMS);
    return sortItems((data[STORAGE_KEYS.DEV_ITEMS] || []).map(normalizeDevItem));
  }

  function normalizeDevItem(item) {
    const now = Date.now();
    const content = String(item?.content || "");
    return Object.assign({
      id: createId("dev"),
      title: "",
      content,
      plainContent: normalizeContent(content),
      preview: createPreview(content),
      type: "code",
      languageId: DEV_GENERAL_CATEGORY_ID,
      languageName: "General",
      detectionConfidence: 0,
      categoryId: DEV_GENERAL_CATEGORY_ID,
      categoryName: "General",
      sourceUrl: "",
      sourceDomain: "",
      sourceTitle: "",
      sourceFaviconUrl: "",
      createdAt: now,
      updatedAt: item?.createdAt || now,
      lastCopiedAt: item?.createdAt || now,
      isFavorite: false,
      isPinned: false,
      tags: [],
      note: "",
      usageCount: 0,
      lastUsedAt: null
    }, item || {}, {
      title: item?.title || "",
      content,
      plainContent: normalizeContent(content),
      preview: item?.preview || createPreview(content),
      languageId: item?.languageId || item?.categoryId || DEV_GENERAL_CATEGORY_ID,
      languageName: item?.languageName || item?.categoryName || "General",
      categoryId: item?.categoryId || item?.languageId || DEV_GENERAL_CATEGORY_ID,
      categoryName: item?.categoryName || item?.languageName || "General",
      sourceFaviconUrl: global.MCP?.createSourceFaviconUrl?.(item?.sourceUrl || "", item?.sourceFaviconUrl || "", item?.sourceDomain || "") || "",
      note: item?.note || "",
      tags: Array.isArray(item?.tags) ? item.tags : [],
      updatedAt: item?.updatedAt || item?.createdAt || now,
      lastCopiedAt: item?.lastCopiedAt || item?.createdAt || now
    });
  }

  async function saveDevItem(item) {
    const safeItem = preserveCategoryWhenTargetingFavorites(item);
    const settings = await getSettings();
    const items = await getDevItems();
    if (global.MCP?.canCreateCapture && !global.MCP.canCreateCapture("dev", settings, items)) {
      throw global.MCP.createCaptureLimitError?.("dev") || new Error("free-code-capture-limit");
    }
    const now = Date.now();
    const categories = await getDevCategories();
    const general = categories.find((category) => category.id === DEV_GENERAL_CATEGORY_ID) || DEFAULT_DEV_CATEGORIES[0];
    const category = categories.find((current) => current.id === (safeItem.categoryId || safeItem.languageId)) || general;
    const nextItem = normalizeDevItem(Object.assign({
      id: createId("dev"),
      content: "",
      type: "code",
      categoryId: category.id,
      categoryName: category.name,
      languageId: category.id,
      languageName: category.name,
      createdAt: now,
      updatedAt: now,
      lastCopiedAt: now
    }, safeItem, {
      categoryId: category.id,
      categoryName: category.name,
      languageId: category.id,
      languageName: category.name
    }));
    await chromeSet({ [STORAGE_KEYS.DEV_ITEMS]: sortItems([nextItem, ...items]) });
    return { item: nextItem, duplicate: false };
  }

  async function updateDevItem(id, updates) {
    const items = await getDevItems();
    const safeUpdates = preserveCategoryWhenTargetingFavorites(updates);
    let updatedItem = null;
    const next = items.map((item) => {
      if (item.id !== id) return item;
      updatedItem = normalizeDevItem(Object.assign({}, item, safeUpdates || {}, { updatedAt: Date.now() }));
      if (safeUpdates && Object.prototype.hasOwnProperty.call(safeUpdates, "content")) {
        updatedItem.plainContent = normalizeContent(safeUpdates.content);
        updatedItem.preview = createPreview(safeUpdates.content);
      }
      if (safeUpdates?.categoryId && !TRASH_CATEGORY_IDS.has(safeUpdates.categoryId)) {
        clearTrashMetadata(updatedItem);
      }
      return updatedItem;
    });
    await chromeSet({ [STORAGE_KEYS.DEV_ITEMS]: sortItems(next) });
    return updatedItem;
  }

  async function deleteDevItem(id, options = {}) {
    const items = await getDevItems();
    const settings = await getSettings();
    if (options?.permanent || !canUseTrashManagement(settings)) {
      await chromeSet({ [STORAGE_KEYS.DEV_ITEMS]: items.filter((item) => item.id !== id) });
      return null;
    }
    let movedItem = null;
    const next = items.map((item) => {
      if (item.id !== id) return item;
      movedItem = normalizeDevItem(Object.assign({}, item, {
        previousCategoryId: item.previousCategoryId || item.categoryId || DEV_GENERAL_CATEGORY_ID,
        previousCategoryName: item.previousCategoryName || item.categoryName || item.languageName || "General",
        previousLanguageId: item.previousLanguageId || item.languageId || item.categoryId || DEV_GENERAL_CATEGORY_ID,
        previousLanguageName: item.previousLanguageName || item.languageName || item.categoryName || "General",
        previousIsFavorite: Object.prototype.hasOwnProperty.call(item, "previousIsFavorite") ? item.previousIsFavorite : Boolean(item.isFavorite),
        previousIsPinned: Object.prototype.hasOwnProperty.call(item, "previousIsPinned") ? item.previousIsPinned : Boolean(item.isPinned),
        categoryId: DEV_TRASH_ID,
        categoryName: "Trash",
        languageId: DEV_TRASH_ID,
        languageName: "Trash",
        isFavorite: false,
        isPinned: false,
        trashedAt: Date.now(),
        updatedAt: Date.now()
      }));
      return movedItem;
    });
    await chromeSet({ [STORAGE_KEYS.DEV_ITEMS]: sortItems(next) });
    return movedItem;
  }

  async function deleteDevItems(ids = [], options = {}) {
    const idSet = new Set((ids || []).filter(Boolean));
    if (!idSet.size) return [];
    const items = await getDevItems();
    const settings = await getSettings();
    if (options?.permanent || !canUseTrashManagement(settings)) {
      await chromeSet({ [STORAGE_KEYS.DEV_ITEMS]: items.filter((item) => !idSet.has(item.id)) });
      return [];
    }
    const now = Date.now();
    const movedItems = [];
    const next = items.map((item) => {
      if (!idSet.has(item.id)) return item;
      const movedItem = normalizeDevItem(Object.assign({}, item, {
        previousCategoryId: item.previousCategoryId || item.categoryId || DEV_GENERAL_CATEGORY_ID,
        previousCategoryName: item.previousCategoryName || item.categoryName || item.languageName || "General",
        previousLanguageId: item.previousLanguageId || item.languageId || item.categoryId || DEV_GENERAL_CATEGORY_ID,
        previousLanguageName: item.previousLanguageName || item.languageName || item.categoryName || "General",
        previousIsFavorite: Object.prototype.hasOwnProperty.call(item, "previousIsFavorite") ? item.previousIsFavorite : Boolean(item.isFavorite),
        previousIsPinned: Object.prototype.hasOwnProperty.call(item, "previousIsPinned") ? item.previousIsPinned : Boolean(item.isPinned),
        categoryId: DEV_TRASH_ID,
        categoryName: "Trash",
        languageId: DEV_TRASH_ID,
        languageName: "Trash",
        isFavorite: false,
        isPinned: false,
        trashedAt: now,
        updatedAt: now
      }));
      movedItems.push(movedItem);
      return movedItem;
    });
    await chromeSet({ [STORAGE_KEYS.DEV_ITEMS]: sortItems(next) });
    return movedItems;
  }

  function normalizeImageItem(item) {
    const now = Date.now();
    const imageUrl = String(item?.imageUrl || item?.srcUrl || "");
    return Object.assign({
      id: createId("img"),
      title: "",
      imageUrl,
      thumbnailUrl: imageUrl,
      dataUrl: "",
      mimeType: "",
      width: null,
      height: null,
      originalImageUrl: "",
      imageCandidates: [],
      imagePageTitle: "",
      imageElementTitle: "",
      imageFileName: "",
      isScreenshot: false,
      captureKind: "",
      altText: "",
      categoryId: IMAGE_GENERAL_ID,
      categoryName: DEFAULT_IMAGE_CATEGORIES[0]?.name || "Images",
      sourceUrl: "",
      sourceDomain: "",
      sourceTitle: "",
      sourceFaviconUrl: "",
      createdAt: now,
      updatedAt: item?.createdAt || now,
      lastCopiedAt: item?.createdAt || now,
      isFavorite: false,
      isPinned: false,
      tags: [],
      note: "",
      usageCount: 0,
      lastUsedAt: null
    }, item || {}, {
      imageUrl,
      thumbnailUrl: item?.thumbnailUrl || item?.dataUrl || imageUrl,
      dataUrl: item?.dataUrl || "",
      title: item?.title || "",
      originalImageUrl: item?.originalImageUrl || "",
      imageCandidates: Array.isArray(item?.imageCandidates) ? item.imageCandidates : [],
      imagePageTitle: item?.imagePageTitle || "",
      imageElementTitle: item?.imageElementTitle || "",
      imageFileName: item?.imageFileName || "",
      isScreenshot: Boolean(item?.isScreenshot),
      captureKind: item?.captureKind || "",
      altText: item?.altText || "",
      sourceFaviconUrl: global.MCP?.createSourceFaviconUrl?.(item?.sourceUrl || "", item?.sourceFaviconUrl || "", item?.sourceDomain || "") || "",
      note: item?.note || "",
      tags: Array.isArray(item?.tags) ? item.tags : [],
      updatedAt: item?.updatedAt || item?.createdAt || now,
      lastCopiedAt: item?.lastCopiedAt || item?.createdAt || now
    });
  }

  async function saveImageItem(item) {
    const safeItem = preserveCategoryWhenTargetingFavorites(item);
    const settings = await getSettings();
    const images = await getImageItems();
    const now = Date.now();
    const imageUrl = String(safeItem?.imageUrl || safeItem?.srcUrl || "").trim();
    if (!imageUrl) throw new Error("Image URL missing.");
    const categories = await getImageCategories();
    const general = categories.find((category) => category.id === IMAGE_GENERAL_ID) || DEFAULT_IMAGE_CATEGORIES[0];
    const nextItem = normalizeImageItem(Object.assign({
      id: createId("img"),
      categoryId: general.id,
      categoryName: general.name,
      createdAt: now,
      updatedAt: now,
      lastCopiedAt: now
    }, safeItem, { imageUrl, thumbnailUrl: safeItem.thumbnailUrl || safeItem.dataUrl || imageUrl }));
    await chromeSet({ [STORAGE_KEYS.IMAGE_ITEMS]: sortItems([nextItem, ...images]) });
    return { item: nextItem, duplicate: false };
  }

  async function updateImageItem(id, updates) {
    const images = await getImageItems();
    const safeUpdates = preserveCategoryWhenTargetingFavorites(updates);
    let updatedItem = null;
    const next = images.map((item) => {
      if (item.id !== id) return item;
      updatedItem = normalizeImageItem(Object.assign({}, item, safeUpdates || {}, { updatedAt: Date.now() }));
      if (safeUpdates?.categoryId && !TRASH_CATEGORY_IDS.has(safeUpdates.categoryId)) {
        clearTrashMetadata(updatedItem);
      }
      return updatedItem;
    });
    await chromeSet({ [STORAGE_KEYS.IMAGE_ITEMS]: sortItems(next) });
    return updatedItem;
  }

  async function deleteImageItem(id, options = {}) {
    const images = await getImageItems();
    const settings = await getSettings();
    if (options?.permanent || !canUseTrashManagement(settings)) {
      await chromeSet({ [STORAGE_KEYS.IMAGE_ITEMS]: images.filter((item) => item.id !== id) });
      return null;
    }
    let movedItem = null;
    const next = images.map((item) => {
      if (item.id !== id) return item;
      movedItem = normalizeImageItem(Object.assign({}, item, {
        previousCategoryId: item.previousCategoryId || item.categoryId || IMAGE_GENERAL_ID,
        previousCategoryName: item.previousCategoryName || item.categoryName || DEFAULT_IMAGE_CATEGORIES[0]?.name || "General",
        previousIsFavorite: Object.prototype.hasOwnProperty.call(item, "previousIsFavorite") ? item.previousIsFavorite : Boolean(item.isFavorite),
        previousIsPinned: Object.prototype.hasOwnProperty.call(item, "previousIsPinned") ? item.previousIsPinned : Boolean(item.isPinned),
        categoryId: IMAGE_TRASH_ID,
        categoryName: "Trash",
        isFavorite: false,
        isPinned: false,
        trashedAt: Date.now(),
        updatedAt: Date.now()
      }));
      return movedItem;
    });
    await chromeSet({ [STORAGE_KEYS.IMAGE_ITEMS]: sortItems(next) });
    return movedItem;
  }

  async function deleteImageItems(ids = [], options = {}) {
    const idSet = new Set((ids || []).filter(Boolean));
    if (!idSet.size) return [];
    const images = await getImageItems();
    const settings = await getSettings();
    if (options?.permanent || !canUseTrashManagement(settings)) {
      await chromeSet({ [STORAGE_KEYS.IMAGE_ITEMS]: images.filter((item) => !idSet.has(item.id)) });
      return [];
    }
    const now = Date.now();
    const movedItems = [];
    const next = images.map((item) => {
      if (!idSet.has(item.id)) return item;
      const movedItem = normalizeImageItem(Object.assign({}, item, {
        previousCategoryId: item.previousCategoryId || item.categoryId || IMAGE_GENERAL_ID,
        previousCategoryName: item.previousCategoryName || item.categoryName || DEFAULT_IMAGE_CATEGORIES[0]?.name || "General",
        previousIsFavorite: Object.prototype.hasOwnProperty.call(item, "previousIsFavorite") ? item.previousIsFavorite : Boolean(item.isFavorite),
        previousIsPinned: Object.prototype.hasOwnProperty.call(item, "previousIsPinned") ? item.previousIsPinned : Boolean(item.isPinned),
        categoryId: IMAGE_TRASH_ID,
        categoryName: "Trash",
        isFavorite: false,
        isPinned: false,
        trashedAt: now,
        updatedAt: now
      }));
      movedItems.push(movedItem);
      return movedItem;
    });
    await chromeSet({ [STORAGE_KEYS.IMAGE_ITEMS]: sortItems(next) });
    return movedItems;
  }

  async function clearImageHistory() {
    const settings = await getSettings();
    const images = await getImageItems();
    const next = settings.keepImageFavoritesOnClear ? images.filter((item) => item.isFavorite) : [];
    await chromeSetWithPurgeMarkers({ [STORAGE_KEYS.IMAGE_ITEMS]: next }, [STORAGE_KEYS.IMAGE_ITEMS]);
  }

  function normalizeClipboardItem(item) {
    const now = Date.now();
    const content = String(item?.content || "");
    return Object.assign({
      id: createId("copy"),
      title: "",
      content,
      plainContent: normalizeContent(content),
      preview: createPreview(content),
      type: "text",
      categoryId: CATEGORY_GENERAL.id,
      categoryName: CATEGORY_GENERAL.name,
      sourceUrl: "",
      sourceDomain: "",
      sourceTitle: "",
      sourceFaviconUrl: "",
      createdAt: now,
      updatedAt: item?.createdAt || now,
      lastCopiedAt: item?.createdAt || now,
      isFavorite: false,
      isPinned: false,
      tags: [],
      note: "",
      usageCount: 0,
      lastUsedAt: null
    }, item || {}, {
      title: item?.title || "",
      sourceFaviconUrl: global.MCP?.createSourceFaviconUrl?.(item?.sourceUrl || "", item?.sourceFaviconUrl || "", item?.sourceDomain || "") || "",
      note: item?.note || "",
      tags: Array.isArray(item?.tags) ? item.tags : [],
      updatedAt: item?.updatedAt || item?.createdAt || now,
      lastCopiedAt: item?.lastCopiedAt || item?.createdAt || now
    });
  }

  async function saveClipboardItem(item) {
    const safeItem = preserveCategoryWhenTargetingFavorites(item);
    const settings = await getSettings();
    const items = await getClipboardItems();
    if (global.MCP?.canCreateCapture && !global.MCP.canCreateCapture("text", settings, items)) {
      throw global.MCP.createCaptureLimitError?.("text") || new Error("free-text-capture-limit");
    }
    const now = Date.now();
    const normalized = normalizeContent(safeItem.content);

    const nextItem = Object.assign({
      id: createId("copy"),
      title: "",
      content: "",
      plainContent: normalized,
      preview: createPreview(item.content),
      type: "text",
      categoryId: CATEGORY_GENERAL.id,
      categoryName: CATEGORY_GENERAL.name,
      sourceUrl: "",
      sourceDomain: "",
      sourceTitle: "",
      sourceFaviconUrl: "",
      createdAt: now,
      updatedAt: now,
      isFavorite: false,
      isPinned: false,
      tags: [],
      note: "",
      usageCount: 0,
      lastUsedAt: null
    }, safeItem, {
      plainContent: normalized,
      preview: createPreview(safeItem.content),
      sourceFaviconUrl: global.MCP?.createSourceFaviconUrl?.(safeItem.sourceUrl || "", safeItem.sourceFaviconUrl || "", safeItem.sourceDomain || "") || "",
      createdAt: safeItem.createdAt || now,
      updatedAt: now,
      lastCopiedAt: safeItem.lastCopiedAt || now
    });

    await chromeSet({ [STORAGE_KEYS.ITEMS]: sortItems([nextItem, ...items]) });
    if (nextItem.categoryId && nextItem.categoryId !== CATEGORY_GENERAL.id) {
      await rememberCategory(nextItem.categoryId);
    }
    return { item: nextItem, duplicate: false };
  }

  async function rememberCategory(categoryId) {
    return categoryId;
  }

  async function updateClipboardItem(id, updates) {
    const items = await getClipboardItems();
    const safeUpdates = preserveCategoryWhenTargetingFavorites(updates);
    let updatedItem = null;
    const next = items.map((item) => {
      if (item.id !== id) return item;
      updatedItem = Object.assign({}, item, safeUpdates || {}, { updatedAt: Date.now() });
      if (safeUpdates && Object.prototype.hasOwnProperty.call(safeUpdates, "content")) {
        updatedItem.plainContent = normalizeContent(safeUpdates.content);
        updatedItem.preview = createPreview(safeUpdates.content);
      }
      if (safeUpdates && Object.prototype.hasOwnProperty.call(safeUpdates, "tags") && !Array.isArray(safeUpdates.tags)) {
        updatedItem.tags = String(safeUpdates.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
      }
      if (safeUpdates?.categoryId && !TRASH_CATEGORY_IDS.has(safeUpdates.categoryId)) {
        clearTrashMetadata(updatedItem);
      }
      return updatedItem;
    });
    await chromeSet({ [STORAGE_KEYS.ITEMS]: sortItems(next) });
    return updatedItem;
  }

  function preserveCategoryWhenTargetingFavorites(updates) {
    const next = Object.assign({}, updates || {});
    if (!FAVORITE_CATEGORY_IDS.has(String(next.categoryId || ""))) return next;
    delete next.categoryId;
    delete next.categoryName;
    delete next.languageId;
    delete next.languageName;
    next.isFavorite = true;
    return next;
  }

  function clearTrashMetadata(item) {
    delete item.previousCategoryId;
    delete item.previousCategoryName;
    delete item.previousLanguageId;
    delete item.previousLanguageName;
    delete item.previousIsFavorite;
    delete item.previousIsPinned;
    delete item.trashedAt;
    return item;
  }

  async function deleteClipboardItem(id, options = {}) {
    const items = await getClipboardItems();
    const settings = await getSettings();
    if (options?.permanent || !canUseTrashManagement(settings)) {
      await chromeSet({ [STORAGE_KEYS.ITEMS]: items.filter((item) => item.id !== id) });
      return null;
    }
    let movedItem = null;
    const next = items.map((item) => {
      if (item.id !== id) return item;
      movedItem = Object.assign({}, item, {
        previousCategoryId: item.previousCategoryId || item.categoryId || CATEGORY_GENERAL.id,
        previousCategoryName: item.previousCategoryName || item.categoryName || CATEGORY_GENERAL.name,
        previousIsFavorite: Object.prototype.hasOwnProperty.call(item, "previousIsFavorite") ? item.previousIsFavorite : Boolean(item.isFavorite),
        previousIsPinned: Object.prototype.hasOwnProperty.call(item, "previousIsPinned") ? item.previousIsPinned : Boolean(item.isPinned),
        categoryId: TEXT_TRASH_ID,
        categoryName: "Corbeille",
        isFavorite: false,
        isPinned: false,
        trashedAt: Date.now(),
        updatedAt: Date.now()
      });
      return movedItem;
    });
    await chromeSet({ [STORAGE_KEYS.ITEMS]: sortItems(next) });
    return movedItem;
  }

  async function deleteClipboardItems(ids = [], options = {}) {
    const idSet = new Set((ids || []).filter(Boolean));
    if (!idSet.size) return [];
    const items = await getClipboardItems();
    const settings = await getSettings();
    if (options?.permanent || !canUseTrashManagement(settings)) {
      await chromeSet({ [STORAGE_KEYS.ITEMS]: items.filter((item) => !idSet.has(item.id)) });
      return [];
    }
    const now = Date.now();
    const movedItems = [];
    const next = items.map((item) => {
      if (!idSet.has(item.id)) return item;
      const movedItem = Object.assign({}, item, {
        previousCategoryId: item.previousCategoryId || item.categoryId || CATEGORY_GENERAL.id,
        previousCategoryName: item.previousCategoryName || item.categoryName || CATEGORY_GENERAL.name,
        previousIsFavorite: Object.prototype.hasOwnProperty.call(item, "previousIsFavorite") ? item.previousIsFavorite : Boolean(item.isFavorite),
        previousIsPinned: Object.prototype.hasOwnProperty.call(item, "previousIsPinned") ? item.previousIsPinned : Boolean(item.isPinned),
        categoryId: TEXT_TRASH_ID,
        categoryName: "Corbeille",
        isFavorite: false,
        isPinned: false,
        trashedAt: now,
        updatedAt: now
      });
      movedItems.push(movedItem);
      return movedItem;
    });
    await chromeSet({ [STORAGE_KEYS.ITEMS]: sortItems(next) });
    return movedItems;
  }

  async function restoreClipboardItem(id) {
    const items = await getClipboardItems();
    let restoredItem = null;
    const categories = await getCategories();
    const next = items.map((item) => {
      if (item.id !== id) return item;
      const category = categories.find((category) => category.id === item.previousCategoryId && !TRASH_CATEGORY_IDS.has(category.id)) || categories.find((category) => category.id === CATEGORY_GENERAL.id) || CATEGORY_GENERAL;
      restoredItem = Object.assign({}, item, {
        categoryId: category.id,
        categoryName: category.name,
        isFavorite: Boolean(item.previousIsFavorite),
        isPinned: Boolean(item.previousIsPinned),
        updatedAt: Date.now()
      });
      delete restoredItem.previousCategoryId;
      delete restoredItem.previousCategoryName;
      delete restoredItem.previousIsFavorite;
      delete restoredItem.previousIsPinned;
      delete restoredItem.trashedAt;
      return restoredItem;
    });
    await chromeSet({ [STORAGE_KEYS.ITEMS]: sortItems(next) });
    return restoredItem;
  }

  async function restoreDevItem(id) {
    const items = await getDevItems();
    const categories = await getDevCategories();
    let restoredItem = null;
    const next = items.map((item) => {
      if (item.id !== id) return item;
      const category = categories.find((category) => category.id === item.previousCategoryId && !TRASH_CATEGORY_IDS.has(category.id))
        || categories.find((category) => category.id === DEV_GENERAL_CATEGORY_ID)
        || DEFAULT_DEV_CATEGORIES[0];
      const language = categories.find((category) => category.id === item.previousLanguageId && !TRASH_CATEGORY_IDS.has(category.id)) || category;
      restoredItem = normalizeDevItem(Object.assign({}, item, {
        categoryId: category.id,
        categoryName: category.name,
        languageId: language.id,
        languageName: language.name,
        isFavorite: Boolean(item.previousIsFavorite),
        isPinned: Boolean(item.previousIsPinned),
        updatedAt: Date.now()
      }));
      delete restoredItem.previousCategoryId;
      delete restoredItem.previousCategoryName;
      delete restoredItem.previousLanguageId;
      delete restoredItem.previousLanguageName;
      delete restoredItem.previousIsFavorite;
      delete restoredItem.previousIsPinned;
      delete restoredItem.trashedAt;
      return restoredItem;
    });
    await chromeSet({ [STORAGE_KEYS.DEV_ITEMS]: sortItems(next) });
    return restoredItem;
  }

  async function restoreImageItem(id) {
    const images = await getImageItems();
    const categories = await getImageCategories();
    let restoredItem = null;
    const next = images.map((item) => {
      if (item.id !== id) return item;
      const category = categories.find((category) => category.id === item.previousCategoryId && !TRASH_CATEGORY_IDS.has(category.id))
        || categories.find((category) => category.id === IMAGE_GENERAL_ID)
        || DEFAULT_IMAGE_CATEGORIES[0];
      restoredItem = normalizeImageItem(Object.assign({}, item, {
        categoryId: category.id,
        categoryName: category.name,
        isFavorite: Boolean(item.previousIsFavorite),
        isPinned: Boolean(item.previousIsPinned),
        updatedAt: Date.now()
      }));
      delete restoredItem.previousCategoryId;
      delete restoredItem.previousCategoryName;
      delete restoredItem.previousIsFavorite;
      delete restoredItem.previousIsPinned;
      delete restoredItem.trashedAt;
      return restoredItem;
    });
    await chromeSet({ [STORAGE_KEYS.IMAGE_ITEMS]: sortItems(next) });
    return restoredItem;
  }

  async function emptyTrash(mediaType = "text") {
    if (mediaType === "image") {
      const images = await getImageItems();
      await chromeSet({ [STORAGE_KEYS.IMAGE_ITEMS]: images.filter((item) => item.categoryId !== IMAGE_TRASH_ID) });
      return;
    }
    if (mediaType === "dev") {
      const items = await getDevItems();
      await chromeSet({ [STORAGE_KEYS.DEV_ITEMS]: items.filter((item) => item.categoryId !== DEV_TRASH_ID) });
      return;
    }
    const items = await getClipboardItems();
    await chromeSet({ [STORAGE_KEYS.ITEMS]: items.filter((item) => item.categoryId !== TEXT_TRASH_ID) });
  }

  async function clearHistory() {
    const settings = await getSettings();
    const items = await getClipboardItems();
    const next = settings.keepFavoritesOnClear ? items.filter((item) => item.isFavorite) : [];
    await chromeSetWithPurgeMarkers({ [STORAGE_KEYS.ITEMS]: next }, [STORAGE_KEYS.ITEMS]);
  }

  async function getSnippets() {
    const data = await chromeGet(STORAGE_KEYS.SNIPPETS);
    return data[STORAGE_KEYS.SNIPPETS] || [];
  }

  async function saveSnippet(snippet) {
    const snippets = await getSnippets();
    const now = Date.now();
    const nextSnippet = Object.assign({ id: createId("snippet"), tags: [], createdAt: now, updatedAt: now, usageCount: 0 }, snippet || {}, { updatedAt: now });
    await chromeSet({ [STORAGE_KEYS.SNIPPETS]: snippets.filter((item) => item.id !== nextSnippet.id).concat(nextSnippet) });
    return nextSnippet;
  }

  async function deleteSnippet(id) {
    const snippets = await getSnippets();
    await chromeSet({ [STORAGE_KEYS.SNIPPETS]: snippets.filter((item) => item.id !== id) });
  }

  async function getTemplates() {
    const data = await chromeGet(STORAGE_KEYS.TEMPLATES);
    return data[STORAGE_KEYS.TEMPLATES] || [];
  }

  async function saveTemplate(template) {
    const templates = await getTemplates();
    const now = Date.now();
    const nextTemplate = Object.assign({ id: createId("template"), createdAt: now, updatedAt: now }, template || {}, { updatedAt: now });
    await chromeSet({ [STORAGE_KEYS.TEMPLATES]: templates.filter((item) => item.id !== nextTemplate.id).concat(nextTemplate) });
    return nextTemplate;
  }

  async function deleteTemplate(id) {
    const templates = await getTemplates();
    await chromeSet({ [STORAGE_KEYS.TEMPLATES]: templates.filter((item) => item.id !== id) });
  }

  global.MCP = Object.assign(global.MCP || {}, {
    getSettings,
    saveSettings,
    getClipboardItems,
    saveClipboardItem,
    updateClipboardItem,
    deleteClipboardItem,
    deleteClipboardItems,
    restoreClipboardItem,
    clearHistory,
    getCategories,
    getCategoryTree,
    getImageCategories,
    getImageCategoryTree,
    getDevCategories,
    getDevCategoryTree,
    reorderCategories,
    reorderImageCategories,
    reorderDevCategories,
    guessCategoryForCopiedText,
    createCategory,
    createSubcategory,
    createImageCategory,
    createImageSubcategory,
    createDevSubcategory,
    saveCategory,
    updateCategory,
    deleteCategory,
    updateImageCategory,
    deleteImageCategory,
    updateDevCategory,
    deleteDevCategory,
    getImageItems,
    saveImageItem,
    updateImageItem,
    deleteImageItem,
    deleteImageItems,
    restoreImageItem,
    clearImageHistory,
    getDevItems,
    saveDevItem,
    updateDevItem,
    deleteDevItem,
    deleteDevItems,
    restoreDevItem,
    emptyTrash,
    isProtectedTrashCategory,
    isProtectedVaultCategory,
    isProtectedRootCategory,
    isVaultCategoryId,
    isVaultItem,
    TEXT_TRASH_ID,
    IMAGE_TRASH_ID,
    DEV_TRASH_ID,
    TEXT_VAULT_ID,
    IMAGE_VAULT_ID,
    DEV_VAULT_ID,
    getVaultAuth,
    isVaultConfigured,
    setVaultPassword,
    verifyVaultPassword,
    verifyVaultRecovery,
    resetVaultPasswordAndItems,
    getSnippets,
    saveSnippet,
    deleteSnippet,
    getTemplates,
    saveTemplate,
    deleteTemplate
  });
})(globalThis);
