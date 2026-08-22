(function initBackup(global) {
  const BACKUP_VERSION = 2;
  const BACKUP_APP = "Ultimate Clipboard Pro";
  const MAX_BACKUP_FILE_BYTES = 512 * 1024 * 1024;
  const MAX_BACKUP_MANIFEST_BYTES = 256 * 1024 * 1024;
  const MAX_BACKUP_ZIP_ENTRY_BYTES = 32 * 1024 * 1024;
  const MAX_BACKUP_ZIP_ENTRIES = 20000;
  const DEVICE_LOCAL_STORAGE_KEYS = new Set([
    "ucp_guided_tours_v2"
  ]);

  function backupTimestamp(date = new Date()) {
    const pad = (value) => String(value).padStart(2, "0");
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate())
    ].join("-") + "_" + [
      pad(date.getHours()),
      pad(date.getMinutes()),
      pad(date.getSeconds())
    ].join("-");
  }

  function backupFileName(date = new Date()) {
    return `${BACKUP_APP}_${backupTimestamp(date)}.json`;
  }

  function backupZipFileName(date = new Date()) {
    return `${BACKUP_APP}_${backupTimestamp(date)}.zip`;
  }

  const DEPRECATED_SETTINGS_KEYS = [
    "searchOpenAsOverlay",
    "searchIncludeNotes",
    "searchIncludeSourceUrls",
    "askCategoryAfterCopy"
  ];

  const PORTABLE_SESSION_SETTINGS_KEYS = [
    "floatingPanelOpen",
    "floatingPanelOpenedAt",
    "floatingPanelManualClosedAt"
  ];

  const PORTABLE_DRIVE_SETTINGS_KEYS = [
    "driveSyncEnabled"
  ];

  const LOCAL_INTERFACE_RESTORE_KEYS = [
    "floatingLauncherOpenedOnce",
    "managerOpenedOnce"
  ];

  const LICENSE_RESTORE_KEYS = [
    "plan",
    "licenseKey",
    "licenseKeyLast4",
    "licenseKeyInstanceId",
    "licenseKeyId",
    "licenseCustomerId",
    "licenseStatus",
    "licenseActivatedAt",
    "licenseLastVerifiedAt",
    "licenseLastSuccessfulVerifiedAt",
    "licenseDodoEnv",
    "licenseProductName",
    "licenseProductId",
    "licensePlanId",
    "licenseProof",
    "licenseProofVersion",
    "licenseIntegrityLastCheckedAt"
    , "licenseAuthVersion"
    , "licenseEntitlementId"
    , "licenseAuthorizationExpiresAt"
    , "licenseOfflineGraceExpiresAt"
    , "licenseAuthorizationJti"
    , "licenseAuthorizationToken"
    , "licenseInstallationId"
    , "licenseMaxSeenTime"
  ];

  function normalizeBackupSettings(settings = {}) {
    const defaultSettings = global.MCP?.DEFAULT_SETTINGS || {};
    const normalizeShortcutValue = global.MCP?.normalizeShortcutValue || ((value) => value || "ctrl_alt_c");
    const launcherBottom = Number(settings?.floatingLauncherBottom ?? defaultSettings.floatingLauncherBottom ?? 94);
    const normalized = Object.assign({}, defaultSettings, settings || {}, {
      textCaptureShortcut: normalizeShortcutValue(settings?.textCaptureShortcut || defaultSettings.textCaptureShortcut || "ctrl_alt_c"),
      managerImageViewMode: normalizeManagerImageViewMode(settings?.managerImageViewMode || defaultSettings.managerImageViewMode || "medium"),
      managerTextViewMode: normalizeManagerTextViewMode(settings?.managerTextViewMode || defaultSettings.managerTextViewMode || "card"),
      managerDevViewMode: normalizeManagerTextViewMode(settings?.managerDevViewMode || defaultSettings.managerDevViewMode || "card"),
      floatingPanelOpen: Boolean(settings?.floatingPanelOpen ?? defaultSettings.floatingPanelOpen ?? false),
      floatingLauncherCollapsed: Boolean(settings?.floatingLauncherCollapsed ?? defaultSettings.floatingLauncherCollapsed ?? false),
      floatingLauncherModeUpdatedAt: Math.max(0, Number(settings?.floatingLauncherModeUpdatedAt) || 0),
      floatingLauncherBottom: Number.isFinite(launcherBottom)
        ? Math.min(900, Math.max(24, Math.round(launcherBottom)))
        : (defaultSettings.floatingLauncherBottom || 94),
      floatingLauncherPositionUpdatedAt: Math.max(0, Number(settings?.floatingLauncherPositionUpdatedAt) || 0),
      dodoEnv: "live"
    });
    return stripDeprecatedSettings(normalized);
  }

  function stripDeprecatedSettings(settings = {}) {
    const next = Object.assign({}, settings || {});
    DEPRECATED_SETTINGS_KEYS.forEach((key) => {
      delete next[key];
    });
    return next;
  }

  function normalizePortableBackupSettings(settings = {}) {
    const normalized = normalizeBackupSettings(settings);
    const next = Object.assign({}, normalized, {
      plan: global.MCP?.PLAN?.FREE || "free",
      licenseKey: "",
      licenseKeyLast4: "",
      licenseKeyInstanceId: "",
      licenseKeyId: "",
      licenseCustomerId: "",
      licenseStatus: "free",
      licenseActivatedAt: null,
      licenseLastVerifiedAt: null,
      licenseLastSuccessfulVerifiedAt: null,
      licenseDodoEnv: "",
      licenseProductName: "",
      licenseProductId: "",
      licensePlanId: "",
      licenseProof: "",
      licenseProofVersion: "",
      licenseIntegrityLastCheckedAt: null,
      licenseAuthVersion: "",
      licenseEntitlementId: "",
      licenseAuthorizationExpiresAt: null,
      licenseOfflineGraceExpiresAt: null,
      licenseAuthorizationJti: "",
      licenseAuthorizationToken: "",
      licenseInstallationId: "",
      licenseMaxSeenTime: 0,
      driveSyncEnabled: false,
      floatingPanelOpen: false,
      floatingPanelOpenedAt: 0,
      floatingPanelManualClosedAt: 0
    });
    return stripDeprecatedSettings(next);
  }

  function stripPortableSettingsFromRemote(settings = {}) {
    const next = stripDeprecatedSettings(settings);
    LICENSE_RESTORE_KEYS.forEach((key) => {
      delete next[key];
    });
    PORTABLE_DRIVE_SETTINGS_KEYS.forEach((key) => {
      delete next[key];
    });
    PORTABLE_SESSION_SETTINGS_KEYS.forEach((key) => {
      delete next[key];
    });
    return next;
  }

  function hasActiveLicenseState(settings = {}) {
    return settings?.plan === "pro"
      && settings?.licenseStatus === "active"
      && (settings?.licenseAuthVersion === "v3" || (Boolean(settings?.licenseKey) && Boolean(settings?.licenseProof)));
  }

  function isWelcomeSetupCompleted(settings = {}) {
    return settings?.welcomePageCompleted === true || settings?.onboardingCompleted === true;
  }

  function createLocalInterfaceRestoreSnapshot(storage = {}) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const settingsKey = storageKeys.SETTINGS;
    const settings = storage?.[settingsKey] || storage?.settings || {};
    if (!settingsKey || !settings || typeof settings !== "object") return null;
    const snapshotSettings = {};
    if (isWelcomeSetupCompleted(settings)) {
      snapshotSettings.welcomePageCompleted = true;
      snapshotSettings.onboardingCompleted = true;
    }
    LOCAL_INTERFACE_RESTORE_KEYS.forEach((key) => {
      if (settings[key] === true) snapshotSettings[key] = true;
    });
    return Object.keys(snapshotSettings).length ? { settings: snapshotSettings } : null;
  }

  function applyLocalInterfaceSnapshotToStorage(restoredStorage = {}, snapshot = null) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const settingsKey = storageKeys.SETTINGS;
    if (!settingsKey || !snapshot?.settings) return restoredStorage;
    const nextStorage = Object.assign({}, restoredStorage || {});
    nextStorage[settingsKey] = normalizeBackupSettings(Object.assign({}, nextStorage[settingsKey] || {}, snapshot.settings));
    return nextStorage;
  }

  function preserveLocalInterfaceStateForRestore(restoredStorage = {}, localStorage = {}, options = {}) {
    const snapshot = options.interfaceSnapshot || createLocalInterfaceRestoreSnapshot(localStorage);
    return applyLocalInterfaceSnapshotToStorage(restoredStorage, snapshot);
  }

  async function reapplyLocalInterfaceSnapshotAfterRestore(snapshot = null) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const settingsKey = storageKeys.SETTINGS;
    if (!settingsKey || !snapshot?.settings) return;
    const stored = await chrome.storage.local.get(settingsKey).catch(() => ({}));
    const patched = applyLocalInterfaceSnapshotToStorage(stored, snapshot);
    await chrome.storage.local.set(patched);
  }

  function createLicenseRestoreSnapshot(storage = {}) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const settingsKey = storageKeys.SETTINGS;
    const installationKey = storageKeys.INSTALLATION_ID;
    const settings = storage?.[settingsKey] || storage?.settings || {};
    if (!settingsKey || !settings || typeof settings !== "object" || Array.isArray(settings)) return null;
    const hasLocalLicenseIdentity = settings.plan === "pro"
      || settings.licenseStatus === "active"
      || Boolean(settings.licenseKey)
      || Boolean(settings.licenseProof)
      || Boolean(settings.licenseKeyInstanceId);
    if (!hasLocalLicenseIdentity) return null;
    const licenseSettings = {};
    LICENSE_RESTORE_KEYS.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(settings, key)) {
        licenseSettings[key] = settings[key];
      }
    });
    return {
      settings: licenseSettings,
      installationId: storage?.[installationKey] || storage?.installationId || ""
    };
  }

  function applyLicenseSnapshotToStorage(restoredStorage = {}, snapshot = null) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const settingsKey = storageKeys.SETTINGS;
    const installationKey = storageKeys.INSTALLATION_ID;
    if (!settingsKey || !snapshot?.settings) return restoredStorage;

    const nextStorage = Object.assign({}, restoredStorage || {});
    nextStorage[settingsKey] = normalizeBackupSettings(Object.assign({}, nextStorage[settingsKey] || {}, snapshot.settings));

    if (installationKey && snapshot.installationId) {
      nextStorage[installationKey] = snapshot.installationId;
    }
    return nextStorage;
  }

  function preserveLocalLicenseStateForRestore(restoredStorage = {}, localStorage = {}, options = {}) {
    const snapshot = options.licenseSnapshot
      || createLicenseRestoreSnapshot(localStorage)
      || (hasActiveLicenseState(global.MCP?.recentActivatedLicenseSnapshot?.settings) ? global.MCP.recentActivatedLicenseSnapshot : null);
    return applyLicenseSnapshotToStorage(restoredStorage, snapshot);
  }

  async function reapplyLicenseSnapshotAfterRestore(snapshot = null) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const settingsKey = storageKeys.SETTINGS;
    const installationKey = storageKeys.INSTALLATION_ID;
    if (!settingsKey || !snapshot?.settings) return;
    const stored = await chrome.storage.local.get([settingsKey, installationKey].filter(Boolean)).catch(() => ({}));
    const patched = applyLicenseSnapshotToStorage(stored, snapshot);
    await chrome.storage.local.set(patched);
  }

  function preserveLocalDriveStateForRestore(restoredStorage = {}, localStorage = {}) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const settingsKey = storageKeys.SETTINGS;
    const metaKey = storageKeys.DRIVE_SYNC_META;
    const localSettings = localStorage?.[settingsKey] || {};
    const localMeta = localStorage?.[metaKey] || {};
    const isLocalDriveConnected = Boolean(
      localSettings.driveSyncEnabled
      && localMeta.folderId
      && localMeta.lastStatus !== "disconnected"
    );
    if (!settingsKey || !metaKey || !isLocalDriveConnected) return restoredStorage;

    const nextStorage = Object.assign({}, restoredStorage || {});
    const restoredSettings = normalizeBackupSettings(nextStorage[settingsKey] || {});
    nextStorage[settingsKey] = Object.assign({}, restoredSettings, {
      driveSyncEnabled: true,
      driveSyncFrequency: localSettings.driveSyncFrequency || restoredSettings.driveSyncFrequency || "6h"
    });
    nextStorage[metaKey] = Object.assign({}, localMeta, {
      lastStatus: localMeta.lastStatus || "connected",
      lastError: ""
    });
    return nextStorage;
  }

  function normalizeManagerImageViewMode(value) {
    return ["small", "medium", "large"].includes(String(value || "")) ? String(value) : "medium";
  }

  function normalizeManagerTextViewMode(value) {
    return String(value || "") === "list" ? "list" : "card";
  }

  function shortcutBackupInfo(storage = {}) {
    const keys = global.MCP?.STORAGE_KEYS || {};
    const settings = normalizeBackupSettings(storage[keys.SETTINGS] || {});
    const options = ["ctrl_shift_c", "ctrl_alt_c"];
    if (settings.textCaptureShortcut?.startsWith?.("custom:") && !options.includes(settings.textCaptureShortcut)) {
      options.push(settings.textCaptureShortcut);
    }
    return {
      textCaptureShortcut: settings.textCaptureShortcut,
      textCaptureShortcutOptions: options
    };
  }

  function prepareBackupStorage(storage = {}, overrides = {}) {
    const keys = global.MCP?.STORAGE_KEYS || {};
    const nextStorage = normalizePortableBackupStorage(stripVaultStorageForPortableBackup(Object.assign({}, storage || {})));
    const settingsOverride = overrides.settings || {};
    nextStorage[keys.SETTINGS] = normalizePortableBackupSettings(Object.assign({}, nextStorage[keys.SETTINGS] || {}, settingsOverride));
    return nextStorage;
  }

  function isVaultItem(item) {
    if (global.MCP?.isVaultItem) return global.MCP.isVaultItem(item);
    const ids = new Set(["vault", "image-vault", "dev-vault"]);
    return ids.has(String(item?.categoryId || "")) || ids.has(String(item?.languageId || ""));
  }

  function stripVaultStorageForPortableBackup(storage = {}) {
    const keys = global.MCP?.STORAGE_KEYS || {};
    const nextStorage = Object.assign({}, storage || {});
    const sourceLocatorPrefix = keys.SOURCE_LOCATOR_PREFIX || "mcp_source_locator_";
    const vaultItemIds = new Set([
      ...(Array.isArray(nextStorage[keys.ITEMS]) ? nextStorage[keys.ITEMS] : []),
      ...(Array.isArray(nextStorage[keys.IMAGE_ITEMS]) ? nextStorage[keys.IMAGE_ITEMS] : []),
      ...(Array.isArray(nextStorage[keys.DEV_ITEMS]) ? nextStorage[keys.DEV_ITEMS] : [])
    ].filter(isVaultItem).map((item) => String(item?.id || "")).filter(Boolean));
    delete nextStorage[keys.VAULT_AUTH];
    if (Array.isArray(nextStorage[keys.ITEMS])) nextStorage[keys.ITEMS] = nextStorage[keys.ITEMS].filter((item) => !isVaultItem(item));
    if (Array.isArray(nextStorage[keys.IMAGE_ITEMS])) nextStorage[keys.IMAGE_ITEMS] = nextStorage[keys.IMAGE_ITEMS].filter((item) => !isVaultItem(item));
    if (Array.isArray(nextStorage[keys.DEV_ITEMS])) nextStorage[keys.DEV_ITEMS] = nextStorage[keys.DEV_ITEMS].filter((item) => !isVaultItem(item));
    vaultItemIds.forEach((id) => delete nextStorage[`${sourceLocatorPrefix}${id}`]);
    return normalizePortableBackupStorage(nextStorage);
  }

  function normalizePortableBackupStorage(storage = {}) {
    const keys = global.MCP?.STORAGE_KEYS || {};
    const nextStorage = Object.assign({}, storage || {});
    [
      keys.DRIVE_SYNC_META,
      keys.INSTALLATION_ID,
      keys.VAULT_AUTH
    ].filter(Boolean).forEach((key) => {
      delete nextStorage[key];
    });
    [
      keys.ITEMS,
      keys.IMAGE_ITEMS,
      keys.DEV_ITEMS
    ].filter(Boolean).forEach((key) => {
      if (Array.isArray(nextStorage[key])) nextStorage[key] = nextStorage[key].map(normalizeBackupItemSource);
    });
    return nextStorage;
  }

  function normalizeBackupItemSource(item) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return item;
    const sourceFaviconUrl = global.MCP?.createSourceFaviconUrl?.(
      item.sourceUrl || "",
      item.sourceFaviconUrl || "",
      item.sourceDomain || ""
    ) || "";
    return Object.assign({}, item, { sourceFaviconUrl });
  }

  async function createBackupPayload(overrides = {}) {
    const storage = await chrome.storage.local.get(null);
    const preparedStorage = prepareBackupStorage(storage, overrides);
    return {
      app: BACKUP_APP,
      version: BACKUP_VERSION,
      exportedAt: Date.now(),
      packageFormat: "json",
      shortcuts: shortcutBackupInfo(preparedStorage),
      storage: preparedStorage,
      summary: summarizeBackupStorage(preparedStorage)
    };
  }

  async function createBackupZipBlob(overrides = {}, options = {}) {
    const payload = await createBackupPayload(overrides);
    const archive = await createBackupArchive(payload, options);
    return createZipBlob(archive.files, options);
  }

  async function createBackupArchive(payload, options = {}) {
    const archivePayload = cloneJson(payload);
    archivePayload.packageFormat = "zip";
    archivePayload.assets = Object.assign({ images: [], favicons: [] }, archivePayload.assets || {});
    const files = [];
    const usedPaths = new Set(["backup.json"]);
    const assetPlan = backupAssetPlan(archivePayload);
    emitProgress(options, {
      phase: "prepare",
      percent: 8,
      messageKey: "backup.progressPreparingArchive",
      total: assetPlan.total
    });
    await externalizeImageAssets(archivePayload, files, usedPaths, options, assetPlan);
    await externalizeFaviconAssets(archivePayload, files, usedPaths, options, assetPlan);
    files.unshift({
      path: "backup.json",
      bytes: encodeText(JSON.stringify(archivePayload, null, 2)),
      mimeType: "application/json"
    });
    emitProgress(options, {
      phase: "manifest",
      percent: 74,
      messageKey: "backup.progressWritingFile",
      path: "backup.json",
      index: files.length,
      total: files.length
    });
    await yieldToUi();
    return { payload: archivePayload, files };
  }

  function summarizeBackupStorage(storage = {}) {
    const keys = global.MCP?.STORAGE_KEYS || {};
    const settings = storage[keys.SETTINGS] && typeof storage[keys.SETTINGS] === "object" ? storage[keys.SETTINGS] : {};
    const textItems = Array.isArray(storage[keys.ITEMS]) ? storage[keys.ITEMS] : [];
    const imageItems = Array.isArray(storage[keys.IMAGE_ITEMS]) ? storage[keys.IMAGE_ITEMS] : [];
    const devItems = Array.isArray(storage[keys.DEV_ITEMS]) ? storage[keys.DEV_ITEMS] : [];
    const knownStorageKeys = new Set(Object.values(keys).filter(Boolean));
    return {
      settings: storage[keys.SETTINGS] && typeof storage[keys.SETTINGS] === "object" ? 1 : 0,
      textItems: textItems.length,
      imageItems: imageItems.length,
      devItems: devItems.length,
      textCategories: Array.isArray(storage[keys.CATEGORIES]) ? storage[keys.CATEGORIES].length : 0,
      imageCategories: Array.isArray(storage[keys.IMAGE_CATEGORIES]) ? storage[keys.IMAGE_CATEGORIES].length : 0,
      devCategories: Array.isArray(storage[keys.DEV_CATEGORIES]) ? storage[keys.DEV_CATEGORIES].length : 0,
      deletedDefaultTextCategories: Array.isArray(storage[keys.DELETED_DEFAULT_CATEGORIES]) ? storage[keys.DELETED_DEFAULT_CATEGORIES].length : 0,
      deletedDefaultImageCategories: Array.isArray(storage[keys.DELETED_DEFAULT_IMAGE_CATEGORIES]) ? storage[keys.DELETED_DEFAULT_IMAGE_CATEGORIES].length : 0,
      snippets: Array.isArray(storage[keys.SNIPPETS]) ? storage[keys.SNIPPETS].length : 0,
      templates: Array.isArray(storage[keys.TEMPLATES]) ? storage[keys.TEMPLATES].length : 0,
      trashTextItems: textItems.filter((item) => item?.categoryId === "trash").length,
      trashImageItems: imageItems.filter((item) => item?.categoryId === "image-trash").length,
      trashDevItems: devItems.filter((item) => item?.categoryId === "dev-trash").length,
      textVersionedItems: textItems.filter(hasEmbeddedVersions).length,
      textVersions: textItems.reduce(countEmbeddedVersions, 0),
      devVersionedItems: devItems.filter(hasEmbeddedVersions).length,
      devVersions: devItems.reduce(countEmbeddedVersions, 0),
      managerImageViewMode: settings.managerImageViewMode || "",
      managerTextViewMode: settings.managerTextViewMode || "",
      managerDevViewMode: settings.managerDevViewMode || "",
      floatingPanelOpen: Boolean(settings.floatingPanelOpen),
      floatingLauncherBottom: Number(settings.floatingLauncherBottom) || 0,
      floatingLauncherCollapsed: Boolean(settings.floatingLauncherCollapsed),
      toolOrder: Array.isArray(settings.toolOrder) ? settings.toolOrder.length : 0,
      toolStates: settings.toolStates && typeof settings.toolStates === "object" ? Object.keys(settings.toolStates).length : 0,
      extraStorageKeys: Object.keys(storage || {}).filter((key) => !knownStorageKeys.has(key)).length
    };
  }

  function hasEmbeddedVersions(item = {}) {
    return Array.isArray(item.captureVersions) && item.captureVersions.length > 1;
  }

  function countEmbeddedVersions(total, item = {}) {
    return total + (Array.isArray(item.captureVersions) ? item.captureVersions.length : 0);
  }

  function downloadJsonFile(payload, filename = backupFileName()) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    downloadBlob(blob, filename);
  }

  async function downloadZipBackup(overrides = {}, filename = backupZipFileName(), options = {}) {
    const blob = await createBackupZipBlob(overrides, options);
    downloadBlob(blob, filename);
  }

  async function downloadBackupArchive(payload, filename = backupZipFileName(), options = {}) {
    const archive = await createBackupArchive(payload, options);
    downloadBlob(await createZipBlob(archive.files, options), filename);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  async function readBackupFile(file, options = {}) {
    assertBackupFileSize(file);
    emitProgress(options, {
      phase: "read",
      percent: 8,
      messageKey: "backup.progressReadingFile",
      path: file?.name || ""
    });
    const bytes = new Uint8Array(await readFileAsArrayBuffer(file));
    if (bytes.byteLength > MAX_BACKUP_FILE_BYTES) throw new Error("Backup file is too large.");
    if (isZipBytes(bytes) || /\.zip$/i.test(file?.name || "")) {
      const entries = await readZipEntries(bytes, options);
      const manifest = entries.get("backup.json") || entries.get("manifest.json") || [...entries.values()].find((entry) => /\.json$/i.test(entry.path));
      if (!manifest) throw new Error("Invalid backup archive.");
      emitProgress(options, {
        phase: "manifest",
        percent: 62,
        messageKey: "backup.progressReadingFile",
        path: manifest.path
      });
      if (manifest.bytes.byteLength > MAX_BACKUP_MANIFEST_BYTES) throw new Error("Backup manifest is too large.");
      const payload = JSON.parse(decodeText(manifest.bytes));
      return hydrateBackupPayloadFromZip(payload, entries, options);
    }
    emitProgress(options, {
      phase: "manifest",
      percent: 74,
      messageKey: "backup.progressReadingFile",
      path: file?.name || ""
    });
    if (bytes.byteLength > MAX_BACKUP_MANIFEST_BYTES) throw new Error("Backup manifest is too large.");
    return JSON.parse(decodeText(bytes));
  }

  function assertBackupFileSize(file) {
    const size = Number(file?.size || 0);
    if (!Number.isFinite(size) || size < 0 || size > MAX_BACKUP_FILE_BYTES) {
      throw new Error("Backup file is too large.");
    }
    return true;
  }

  function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("File read failed."));
      reader.readAsArrayBuffer(file);
    });
  }

  function extractBackupStorage(payload) {
    if (!payload || typeof payload !== "object") throw new Error("Invalid backup file.");
    const storage = payload.storage || payload.storageData || payload.data;
    if (!storage || typeof storage !== "object" || Array.isArray(storage)) throw new Error("Invalid backup storage.");
    return storage;
  }

  function sameStoredValue(first, second) {
    if (first === second) return true;
    if (typeof first !== typeof second || first === null || second === null) return false;
    if (Array.isArray(first) || Array.isArray(second)) {
      return Array.isArray(first)
        && Array.isArray(second)
        && first.length === second.length
        && first.every((value, index) => sameStoredValue(value, second[index]));
    }
    if (typeof first !== "object") return Object.is(first, second);
    const firstKeys = Object.keys(first).sort();
    const secondKeys = Object.keys(second).sort();
    return firstKeys.length === secondKeys.length
      && firstKeys.every((key, index) => key === secondKeys[index] && sameStoredValue(first[key], second[key]));
  }

  async function restoreLocalStorageSnapshot(snapshot = {}) {
    const safeSnapshot = snapshot && typeof snapshot === "object" && !Array.isArray(snapshot) ? snapshot : {};
    await chrome.storage.local.set(safeSnapshot);
    const current = await chrome.storage.local.get(null);
    const extraKeys = Object.keys(current).filter((key) => !Object.prototype.hasOwnProperty.call(safeSnapshot, key));
    if (extraKeys.length) await chrome.storage.local.remove(extraKeys);
    const verified = await chrome.storage.local.get(Object.keys(safeSnapshot));
    if (Object.keys(safeSnapshot).some((key) => !sameStoredValue(verified[key], safeSnapshot[key]))) {
      throw new Error("Storage rollback verification failed.");
    }
  }

  async function replaceLocalStorageForRestore(nextStorage = {}, beforeSnapshot = null) {
    if (!nextStorage || typeof nextStorage !== "object" || Array.isArray(nextStorage)) {
      throw new Error("Invalid backup storage.");
    }
    const before = beforeSnapshot || await chrome.storage.local.get(null);
    const restoredStorage = Object.assign({}, nextStorage);
    DEVICE_LOCAL_STORAGE_KEYS.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(before, key)) restoredStorage[key] = before[key];
      else delete restoredStorage[key];
    });
    try {
      const staleKeys = Object.keys(before).filter((key) => !Object.prototype.hasOwnProperty.call(restoredStorage, key));
      if (staleKeys.length) await chrome.storage.local.remove(staleKeys);
      await chrome.storage.local.set(restoredStorage);
      const written = await chrome.storage.local.get(Object.keys(restoredStorage));
      if (Object.keys(restoredStorage).some((key) => !sameStoredValue(written[key], restoredStorage[key]))) {
        throw new Error("Storage write verification failed.");
      }
    } catch (error) {
      try {
        await restoreLocalStorageSnapshot(before);
      } catch (rollbackError) {
        error.rollbackError = rollbackError;
      }
      throw error;
    }
  }

  function createRestoreTransactionId() {
    if (global.crypto?.randomUUID) return global.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (value) => {
      const random = Math.floor(Math.random() * 16);
      return (value === "x" ? random : (random & 0x3) | 0x8).toString(16);
    });
  }

  async function beginRestoreTransaction() {
    if (global.MCP?.driveSyncApplying || !chrome.runtime?.sendMessage) return "";
    const transactionId = createRestoreTransactionId();
    const response = await chrome.runtime.sendMessage({
      type: global.MCP.MESSAGE_TYPES.RESTORE_TRANSACTION_BEGIN,
      transactionId
    });
    if (!response?.ok) throw new Error(response?.error || "Unable to prepare backup restore.");
    return transactionId;
  }

  async function endRestoreTransaction(transactionId) {
    if (!transactionId) return;
    const response = await chrome.runtime.sendMessage({
      type: global.MCP.MESSAGE_TYPES.RESTORE_TRANSACTION_END,
      transactionId
    });
    if (!response?.ok) throw new Error(response?.error || "Unable to finalize backup restore.");
  }

  async function restoreBackupPayload(payload, options = {}) {
    emitProgress(options, {
      phase: "restore",
      percent: 84,
      messageKey: "backup.progressApplyingStorage"
    });
    await yieldToUi();
    const keys = global.MCP?.STORAGE_KEYS || {};
    const localStorage = await chrome.storage.local.get(null);
    const licenseSnapshot = createLicenseRestoreSnapshot(localStorage)
      || (hasActiveLicenseState(global.MCP?.recentActivatedLicenseSnapshot?.settings) ? global.MCP.recentActivatedLicenseSnapshot : null);
    const interfaceSnapshot = createLocalInterfaceRestoreSnapshot(localStorage);
    const preparedStorage = prepareBackupStorage(extractBackupStorage(payload), {
      settings: payload?.shortcuts?.textCaptureShortcut ? { textCaptureShortcut: payload.shortcuts.textCaptureShortcut } : {}
    });
    const storage = preserveLocalDriveStateForRestore(
      preserveLocalInterfaceStateForRestore(
        preserveLocalLicenseStateForRestore(preparedStorage, localStorage, { licenseSnapshot }),
        localStorage,
        { interfaceSnapshot }
      ),
      localStorage
    );
    emitProgress(options, {
      phase: "restore",
      percent: 88,
      messageKey: "backup.progressClearingStorage"
    });
    await yieldToUi();
    emitProgress(options, {
      phase: "restore",
      percent: 92,
      messageKey: "backup.progressWritingStorage"
    });
    await yieldToUi();
    const restoreTransactionId = await beginRestoreTransaction();
    try {
      await replaceLocalStorageForRestore(storage, localStorage);
      await reapplyLicenseSnapshotAfterRestore(licenseSnapshot);
      await reapplyLocalInterfaceSnapshotAfterRestore(interfaceSnapshot);
    } catch (error) {
      try {
        await restoreLocalStorageSnapshot(localStorage);
      } catch (rollbackError) {
        error.rollbackError = rollbackError;
      }
      throw error;
    } finally {
      await endRestoreTransaction(restoreTransactionId);
    }
    return {
      app: payload.app || BACKUP_APP,
      version: payload.version || 0,
      exportedAt: payload.exportedAt || null,
      summary: summarizeBackupStorage(storage)
    };
  }

  async function externalizeImageAssets(payload, files, usedPaths = new Set(), options = {}, assetPlan = null) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const storage = payload.storage || {};
    const images = Array.isArray(storage[storageKeys.IMAGE_ITEMS]) ? storage[storageKeys.IMAGE_ITEMS] : [];
    const nextImages = [];
    let processed = 0;
    for (const item of images) {
      const dataUrl = imageDataUrl(item);
      if (!dataUrl) {
        nextImages.push(item);
        continue;
      }
      processed += 1;
      const mimeType = dataUrlMimeType(dataUrl) || item.mimeType || "image/png";
      const path = uniqueAssetPath(`images/${safeAssetName(item.id || item.imageFileName || "image")}.${mimeExtension(mimeType)}`, usedPaths);
      emitProgress(options, assetProgress("image", path, processed, assetPlan));
      await yieldToUi();
      const source = await dataImageAssetSource(item, dataUrl);
      if (!source) {
        nextImages.push(item);
        continue;
      }
      files.push({ path, bytes: source.bytes, mimeType: source.mimeType });
      const nextItem = Object.assign({}, item, {
        backupImageAssetPath: path,
        backupImageMimeType: source.mimeType
      });
      if (String(nextItem.dataUrl || "").startsWith("data:image/")) nextItem.dataUrl = "";
      if (String(nextItem.imageUrl || "").startsWith("data:image/")) nextItem.imageUrl = "";
      if (String(nextItem.thumbnailUrl || "").startsWith("data:image/")) nextItem.thumbnailUrl = "";
      nextImages.push(nextItem);
      payload.assets.images.push({
        itemId: nextItem.id || "",
        path,
        mimeType: source.mimeType,
        bytes: source.bytes.length
      });
    }
    if (images.length) storage[storageKeys.IMAGE_ITEMS] = nextImages;
  }

  async function externalizeFaviconAssets(payload, files, usedPaths = new Set(), options = {}, assetPlan = null) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const storage = payload.storage || {};
    const keysToScan = [storageKeys.ITEMS, storageKeys.DEV_ITEMS, storageKeys.IMAGE_ITEMS].filter(Boolean);
    const faviconAssets = new Map();
    let processed = assetPlan?.images || 0;
    for (const key of keysToScan) {
      const items = Array.isArray(storage[key]) ? storage[key] : [];
      const nextItems = [];
      for (const item of items) {
        const faviconUrl = String(item?.sourceFaviconUrl || "");
        if (!faviconUrl) {
          nextItems.push(item);
          continue;
        }
        const sourceKey = item.sourceDomain || item.sourceUrl || faviconUrl;
        let asset = faviconAssets.get(sourceKey);
        if (!asset) {
          processed += 1;
          const plannedPath = `favicons/${safeAssetName(sourceKey)}.${mimeExtension(dataUrlMimeType(faviconUrl) || "image/png")}`;
          emitProgress(options, assetProgress("favicon", plannedPath, processed, assetPlan));
          await yieldToUi();
          const fetched = await readImageLikeAsset(faviconUrl).catch(() => null);
          if (fetched) {
            const path = uniqueAssetPath(`favicons/${safeAssetName(sourceKey)}.${mimeExtension(fetched.mimeType)}`, usedPaths);
            asset = { path, mimeType: fetched.mimeType, bytes: fetched.bytes };
            faviconAssets.set(sourceKey, asset);
            files.push({ path, bytes: fetched.bytes, mimeType: fetched.mimeType });
            payload.assets.favicons.push({
              source: sourceKey,
              path,
              mimeType: fetched.mimeType,
              bytes: fetched.bytes.length
            });
          }
        }
        nextItems.push(asset ? Object.assign({}, item, { sourceFaviconAssetPath: asset.path }) : item);
      }
      if (items.length) storage[key] = nextItems;
    }
  }

  function hydrateBackupPayloadFromZip(payload, entries, options = {}) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const storage = extractBackupStorage(payload);
    const total = [storageKeys.ITEMS, storageKeys.DEV_ITEMS, storageKeys.IMAGE_ITEMS]
      .filter(Boolean)
      .reduce((count, key) => count + (Array.isArray(storage[key]) ? storage[key].length : 0), 0) || 1;
    let processed = 0;
    [storageKeys.ITEMS, storageKeys.DEV_ITEMS, storageKeys.IMAGE_ITEMS].filter(Boolean).forEach((key) => {
      if (!Array.isArray(storage[key])) return;
      storage[key] = storage[key].map((item) => {
        processed += 1;
        if (processed === 1 || processed === total || processed % 20 === 0) {
          emitProgress(options, {
            phase: "hydrate",
            percent: 74 + (processed / total) * 12,
            messageKey: "backup.progressRestoringItem",
            index: processed,
            total
          });
        }
        return hydrateBackupItemAssets(item, key === storageKeys.IMAGE_ITEMS, entries);
      });
    });
    return payload;
  }

  function hydrateBackupItemAssets(item, isImageItem, entries) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return item;
    const next = Object.assign({}, item);
    if (isImageItem && next.backupImageAssetPath) {
      const entry = entries.get(normalizeZipPath(next.backupImageAssetPath));
      if (entry) {
        const dataUrl = bytesToDataUrl(entry.bytes, next.backupImageMimeType || entry.mimeType || "image/png");
        next.dataUrl = dataUrl;
        next.imageUrl = dataUrl;
        next.thumbnailUrl = dataUrl;
      }
    }
    if (next.sourceFaviconAssetPath) {
      const entry = entries.get(normalizeZipPath(next.sourceFaviconAssetPath));
      if (entry) next.sourceFaviconUrl = bytesToDataUrl(entry.bytes, entry.mimeType || "image/png");
    }
    return normalizeBackupItemSource(next);
  }

  async function dataImageAssetSource(item = {}, knownDataUrl = "") {
    const dataUrl = knownDataUrl || imageDataUrl(item);
    if (!dataUrl) return null;
    const mimeType = dataUrlMimeType(dataUrl) || item.mimeType || "image/png";
    return { bytes: await dataUrlToBytesAsync(dataUrl), mimeType };
  }

  function imageDataUrl(item = {}) {
    return [item.dataUrl, item.imageUrl, item.thumbnailUrl].find((value) => String(value || "").startsWith("data:image/")) || "";
  }

  async function readImageLikeAsset(url = "") {
    const value = String(url || "");
    if (value.startsWith("data:image/")) {
      return { bytes: await dataUrlToBytesAsync(value), mimeType: dataUrlMimeType(value) || "image/png" };
    }
    if (!/^(https?:|chrome-extension:)/i.test(value)) return null;
    const response = await fetchWithTimeout(value, 1800);
    if (!response.ok) return null;
    const mimeType = response.headers.get("content-type") || "image/png";
    if (!String(mimeType).toLowerCase().includes("image")) return null;
    return { bytes: new Uint8Array(await response.arrayBuffer()), mimeType };
  }

  async function createZipBlob(files = [], options = {}) {
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    for (let fileIndex = 0; fileIndex < files.length; fileIndex += 1) {
      const file = files[fileIndex];
      const pathBytes = encodeText(normalizeZipPath(file.path));
      const data = file.bytes instanceof Uint8Array ? file.bytes : encodeText(String(file.bytes || ""));
      emitProgress(options, {
        phase: "zip",
        percent: 76 + ((fileIndex + 1) / Math.max(1, files.length)) * 20,
        messageKey: "backup.progressPackingFile",
        path: file.path,
        index: fileIndex + 1,
        total: files.length
      });
      await yieldToUi();
      const crc = await crc32Async(data, options, {
        path: file.path,
        index: fileIndex + 1,
        total: files.length,
        basePercent: 76 + (fileIndex / Math.max(1, files.length)) * 20,
        spanPercent: 20 / Math.max(1, files.length)
      });
      const localHeader = concatBytes(
        uint32(0x04034b50),
        uint16(20),
        uint16(0x0800),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(crc),
        uint32(data.length),
        uint32(data.length),
        uint16(pathBytes.length),
        uint16(0),
        pathBytes
      );
      localParts.push(localHeader, data);
      centralParts.push(concatBytes(
        uint32(0x02014b50),
        uint16(20),
        uint16(20),
        uint16(0x0800),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(crc),
        uint32(data.length),
        uint32(data.length),
        uint16(pathBytes.length),
        uint16(0),
        uint16(0),
        uint16(0),
        uint16(0),
        uint32(0),
        uint32(offset),
        pathBytes
      ));
      offset += localHeader.length + data.length;
    }
    const centralDirectory = concatBytes(...centralParts);
    const end = concatBytes(
      uint32(0x06054b50),
      uint16(0),
      uint16(0),
      uint16(files.length),
      uint16(files.length),
      uint32(centralDirectory.length),
      uint32(offset),
      uint16(0)
    );
    emitProgress(options, {
      phase: "zip",
      percent: 98,
      messageKey: "backup.progressArchiveReady"
    });
    await yieldToUi();
    return new Blob([...localParts, centralDirectory, end], { type: "application/zip" });
  }

  async function readZipEntries(bytes, options = {}) {
    if (!bytes || bytes.byteLength < 22 || bytes.byteLength > MAX_BACKUP_FILE_BYTES) throw new Error("Invalid ZIP archive.");
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    let eocdOffset = -1;
    for (let index = bytes.length - 22; index >= Math.max(0, bytes.length - 65557); index -= 1) {
      if (view.getUint32(index, true) === 0x06054b50) {
        eocdOffset = index;
        break;
      }
    }
    if (eocdOffset < 0) throw new Error("Invalid ZIP archive.");
    const entryCount = view.getUint16(eocdOffset + 10, true);
    if (entryCount > MAX_BACKUP_ZIP_ENTRIES) throw new Error("Backup archive has too many entries.");
    let centralOffset = view.getUint32(eocdOffset + 16, true);
    const entries = new Map();
    let totalUncompressedBytes = 0;
    for (let index = 0; index < entryCount; index += 1) {
      if (centralOffset < 0 || centralOffset + 46 > bytes.byteLength) throw new Error("Invalid ZIP directory.");
      if (view.getUint32(centralOffset, true) !== 0x02014b50) throw new Error("Invalid ZIP directory.");
      const method = view.getUint16(centralOffset + 10, true);
      const compressedSize = view.getUint32(centralOffset + 20, true);
      const uncompressedSize = view.getUint32(centralOffset + 24, true);
      const nameLength = view.getUint16(centralOffset + 28, true);
      const extraLength = view.getUint16(centralOffset + 30, true);
      const commentLength = view.getUint16(centralOffset + 32, true);
      const localOffset = view.getUint32(centralOffset + 42, true);
      if (centralOffset + 46 + nameLength + extraLength + commentLength > bytes.byteLength) throw new Error("Invalid ZIP directory.");
      const path = normalizeZipPath(decodeText(bytes.slice(centralOffset + 46, centralOffset + 46 + nameLength)));
      if (!path || path.includes("\0") || path.split("/").includes("..") || entries.has(path)) throw new Error("Invalid ZIP entry path.");
      if (![0, 8].includes(method)) throw new Error("Unsupported compressed backup archive.");
      const entryBudget = /(?:backup|manifest)\.json$/i.test(path) ? MAX_BACKUP_MANIFEST_BYTES : MAX_BACKUP_ZIP_ENTRY_BYTES;
      if (uncompressedSize > entryBudget) throw new Error("Backup archive entry is too large.");
      totalUncompressedBytes += uncompressedSize;
      if (totalUncompressedBytes > MAX_BACKUP_FILE_BYTES) throw new Error("Backup archive expands beyond its allowed size.");
      if (localOffset < 0 || localOffset + 30 > bytes.byteLength || view.getUint32(localOffset, true) !== 0x04034b50) throw new Error("Invalid ZIP entry.");
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      if (dataStart < 0 || dataStart + compressedSize > bytes.byteLength) throw new Error("Invalid ZIP entry.");
      const compressed = bytes.slice(dataStart, dataStart + compressedSize);
      let data = compressed;
      if (method === 8) {
        data = await inflateZipDeflateEntry(compressed, Math.min(uncompressedSize, entryBudget));
      } else if (method !== 0) {
        throw new Error("Unsupported compressed backup archive.");
      }
      if (data.byteLength !== uncompressedSize || data.byteLength > entryBudget) throw new Error("Invalid ZIP entry size.");
      entries.set(path, { path, bytes: data, mimeType: mimeTypeFromPath(path) });
      emitProgress(options, {
        phase: "read",
        percent: 12 + ((index + 1) / Math.max(1, entryCount)) * 46,
        messageKey: "backup.progressReadingFile",
        path,
        index: index + 1,
        total: entryCount
      });
      if (index % 4 === 0) await yieldToUi();
      centralOffset += 46 + nameLength + extraLength + commentLength;
    }
    return entries;
  }

  async function inflateZipDeflateEntry(compressed, maxBytes) {
    if (typeof DecompressionStream === "undefined") {
      throw new Error("Unsupported compressed backup archive.");
    }
    const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    const reader = stream.getReader();
    const chunks = [];
    let totalBytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel("Backup archive entry exceeded its byte budget.").catch(() => {});
          throw new Error("Backup archive entry is too large.");
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock?.();
    }
    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return bytes;
  }

  function backupAssetPlan(payload = {}) {
    const storageKeys = global.MCP?.STORAGE_KEYS || {};
    const storage = payload.storage || {};
    const imageItems = Array.isArray(storage[storageKeys.IMAGE_ITEMS]) ? storage[storageKeys.IMAGE_ITEMS] : [];
    const images = imageItems.filter(imageDataUrl).length;
    const faviconSources = new Set();
    [storageKeys.ITEMS, storageKeys.DEV_ITEMS, storageKeys.IMAGE_ITEMS].filter(Boolean).forEach((key) => {
      (Array.isArray(storage[key]) ? storage[key] : []).forEach((item) => {
        const faviconUrl = String(item?.sourceFaviconUrl || "");
        if (!faviconUrl) return;
        faviconSources.add(item.sourceDomain || item.sourceUrl || faviconUrl);
      });
    });
    return { images, favicons: faviconSources.size, total: images + faviconSources.size || 1 };
  }

  function assetProgress(type, path, processed, plan = null) {
    const total = plan?.total || 1;
    return {
      phase: type,
      percent: 10 + (processed / total) * 60,
      messageKey: type === "image" ? "backup.progressWritingImage" : "backup.progressWritingFavicon",
      path,
      index: processed,
      total
    };
  }

  function emitProgress(options = {}, event = {}) {
    const reporter = typeof options.onProgress === "function"
      ? options.onProgress
      : typeof options.progress === "function"
        ? options.progress
        : null;
    if (!reporter) return;
    reporter(Object.assign({}, event, {
      percent: Math.min(99, Math.max(0, Number(event.percent || 0)))
    }));
  }

  function yieldToUi() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  function isZipBytes(bytes) {
    return bytes?.[0] === 0x50 && bytes?.[1] === 0x4b && bytes?.[2] === 0x03 && bytes?.[3] === 0x04;
  }

  function safeAssetName(value = "") {
    return String(value || "asset")
      .replace(/^https?:\/\//i, "")
      .replace(/[^a-z0-9_-]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 96) || `asset-${Date.now()}`;
  }

  function uniqueAssetPath(path, usedPaths) {
    const normalized = normalizeZipPath(path);
    if (!usedPaths.has(normalized)) {
      usedPaths.add(normalized);
      return normalized;
    }
    const dotIndex = normalized.lastIndexOf(".");
    const base = dotIndex >= 0 ? normalized.slice(0, dotIndex) : normalized;
    const extension = dotIndex >= 0 ? normalized.slice(dotIndex) : "";
    let index = 2;
    let candidate = `${base}-${index}${extension}`;
    while (usedPaths.has(candidate)) {
      index += 1;
      candidate = `${base}-${index}${extension}`;
    }
    usedPaths.add(candidate);
    return candidate;
  }

  function normalizeZipPath(path = "") {
    return String(path || "").replace(/\\/g, "/").replace(/^\/+/, "");
  }

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function encodeText(value) {
    return new TextEncoder().encode(String(value || ""));
  }

  function decodeText(bytes) {
    return new TextDecoder("utf-8").decode(bytes).replace(/^\uFEFF/, "");
  }

  function uint16(value) {
    const bytes = new Uint8Array(2);
    new DataView(bytes.buffer).setUint16(0, value, true);
    return bytes;
  }

  function uint32(value) {
    const bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setUint32(0, value >>> 0, true);
    return bytes;
  }

  function concatBytes(...parts) {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    parts.forEach((part) => {
      out.set(part, offset);
      offset += part.length;
    });
    return out;
  }

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (let index = 0; index < bytes.length; index += 1) crc = crcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  async function crc32Async(bytes, options = {}, meta = {}) {
    let crc = 0xffffffff;
    const chunkSize = 512 * 1024;
    const total = bytes.length || 1;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      const end = Math.min(bytes.length, offset + chunkSize);
      for (let index = offset; index < end; index += 1) crc = crcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
      emitProgress(options, {
        phase: "crc",
        percent: (meta.basePercent || 0) + ((end / total) * (meta.spanPercent || 0)),
        messageKey: "backup.progressPackingFile",
        path: meta.path || "",
        index: meta.index || 0,
        total: meta.total || 0
      });
      await yieldToUi();
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function dataUrlMimeType(dataUrl = "") {
    return /^data:([^;]+);/i.exec(String(dataUrl))?.[1] || "";
  }

  function dataUrlToBytes(dataUrl = "") {
    const payload = String(dataUrl).split(",")[1] || "";
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  async function dataUrlToBytesAsync(dataUrl = "") {
    const payload = String(dataUrl).split(",")[1] || "";
    const binary = atob(payload);
    const bytes = new Uint8Array(binary.length);
    const chunkSize = 512 * 1024;
    for (let offset = 0; offset < binary.length; offset += chunkSize) {
      const end = Math.min(binary.length, offset + chunkSize);
      for (let index = offset; index < end; index += 1) bytes[index] = binary.charCodeAt(index);
      await yieldToUi();
    }
    return bytes;
  }

  async function fetchWithTimeout(url, timeoutMs = 1800) {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      return await fetch(url, controller ? { signal: controller.signal } : {});
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function bytesToDataUrl(bytes, mimeType = "image/png") {
    let binary = "";
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return `data:${mimeType || "image/png"};base64,${btoa(binary)}`;
  }

  function mimeExtension(mimeType = "") {
    const normalized = String(mimeType || "").toLowerCase();
    if (normalized.includes("jpeg") || normalized.includes("jpg")) return "jpg";
    if (normalized.includes("webp")) return "webp";
    if (normalized.includes("gif")) return "gif";
    if (normalized.includes("svg")) return "svg";
    if (normalized.includes("bmp")) return "bmp";
    if (normalized.includes("ico") || normalized.includes("icon")) return "ico";
    return "png";
  }

  function mimeTypeFromPath(path = "") {
    const lower = String(path || "").toLowerCase();
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".gif")) return "image/gif";
    if (lower.endsWith(".svg")) return "image/svg+xml";
    if (lower.endsWith(".ico")) return "image/x-icon";
    if (lower.endsWith(".json")) return "application/json";
    return "image/png";
  }

  global.MCP = Object.assign(global.MCP || {}, {
    BACKUP_APP,
    BACKUP_VERSION,
    MAX_BACKUP_FILE_BYTES,
    assertBackupFileSize,
    backupFileName,
    backupZipFileName,
    createBackupPayload,
    createBackupZipBlob,
    downloadJsonFile,
    downloadZipBackup,
    downloadBackupArchive,
    readBackupFile,
    restoreBackupPayload,
    replaceLocalStorageForRestore,
    restoreLocalStorageSnapshot,
    summarizeBackupStorage,
    normalizeBackupSettings,
    normalizePortableBackupSettings,
    stripPortableSettingsFromRemote,
    createLicenseRestoreSnapshot,
    preserveLocalLicenseStateForRestore,
    reapplyLicenseSnapshotAfterRestore,
    createLocalInterfaceRestoreSnapshot,
    preserveLocalInterfaceStateForRestore,
    reapplyLocalInterfaceSnapshotAfterRestore,
    preserveLocalDriveStateForRestore,
    normalizePortableBackupStorage,
    stripVaultStorageForPortableBackup
  });
})(globalThis);
