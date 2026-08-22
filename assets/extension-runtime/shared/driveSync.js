(function initDriveSync(global) {
  const DRIVE_FOLDER_NAME = "Ultimate Clipboard Pro";
  const DRIVE_IMAGES_FOLDER_NAME = "images";
  const DRIVE_FAVICONS_FOLDER_NAME = "favicons";
  const DRIVE_FILE_NAME = "ultimate-clipboard-pro-sync.json";
  const DRIVE_ALARM_NAME = "mcp_drive_sync_alarm";
  const DRIVE_PENDING_ALARM_NAME = "mcp_drive_pending_alarm";
  const DRIVE_LIVE_ALARM_NAME = "mcp_drive_live_alarm";
  const DRIVE_MANUAL_COOLDOWN_MS = 60000;
  const DRIVE_DEBOUNCE_MS = 1800;
  const DRIVE_REMOTE_CHECK_MIN_MS = 6000;
  const DRIVE_REQUEST_TIMEOUT_MS = 45000;
  const MAX_DRIVE_TEXT_RESPONSE_BYTES = 256 * 1024 * 1024;
  const MAX_DRIVE_ERROR_RESPONSE_BYTES = 1024 * 1024;
  const MAX_DRIVE_BINARY_ASSET_BYTES = 12 * 1024 * 1024;
  const DRIVE_FREQUENCIES = {
    "1h": 60,
    "6h": 360,
    "12h": 720
  };
  const syncedStorageKeys = [
    "SETTINGS",
    "ITEMS",
    "CATEGORIES",
    "DELETED_DEFAULT_CATEGORIES",
    "IMAGE_ITEMS",
    "IMAGE_CATEGORIES",
    "DELETED_DEFAULT_IMAGE_CATEGORIES",
    "DEV_ITEMS",
    "DEV_CATEGORIES",
    "SNIPPETS",
    "TEMPLATES",
    "PURGE_MARKERS",
    "DRIVE_TOMBSTONES",
    "MANAGER_VIEW_STATE",
    "PREMIUM_CURRENCY"
  ];
  let queuedSyncTimer = null;
  let pendingMetaWritePromise = null;
  let runningSyncPromise = null;
  let activeDriveOperation = null;
  let remoteCheckPromise = null;
  let lastRemoteCheckStartedAt = 0;
  let deleteChallenge = null;
  let localDeletionInProgress = false;
  let localChangeGeneration = 0;
  let pendingSyncRequestedWhileRunning = false;

  function keys() {
    return global.MCP?.STORAGE_KEYS || {};
  }

  function isOauthConfigured() {
    const manifest = chrome.runtime.getManifest?.() || {};
    const clientId = String(manifest.oauth2?.client_id || "");
    return Boolean(clientId && !clientId.includes("REPLACE_WITH_GOOGLE_OAUTH_CLIENT_ID"));
  }

  async function getMeta() {
    const storageKeys = keys();
    const data = await chrome.storage.local.get(storageKeys.DRIVE_SYNC_META);
    const stored = data[storageKeys.DRIVE_SYNC_META] || {};
    const meta = Object.assign({
      accountEmail: "",
      rootFolderId: "",
      workspaceId: "",
      workspaceFolderName: "",
      folderId: "",
      imagesFolderId: "",
      faviconsFolderId: "",
      fileId: "",
      lastSyncAt: null,
      lastStatus: "idle",
      lastError: "",
      cooldownUntil: null,
      remoteModifiedTime: "",
      remoteBackupAvailable: false,
      syncInitialized: false,
      pendingLocalChangeAt: null,
      localResetPending: null,
      lastRemoteCheckAt: null,
      initializedAt: Date.now()
    }, stored);
    if (!Object.prototype.hasOwnProperty.call(stored, "syncInitialized")) {
      meta.syncInitialized = Boolean(stored.lastSyncAt && stored.fileId);
    }
    if (!Object.prototype.hasOwnProperty.call(stored, "remoteBackupAvailable")) {
      meta.remoteBackupAvailable = Boolean(stored.fileId);
    }
    return meta;
  }

  async function saveMeta(meta) {
    const storageKeys = keys();
    const next = Object.assign(await getMeta(), meta || {});
    await chrome.storage.local.set({ [storageKeys.DRIVE_SYNC_META]: next });
    broadcastSyncUpdated(next);
    return next;
  }

  async function getStatus() {
    const [settings, meta] = await Promise.all([
      global.MCP.getSettings(),
      getMeta()
    ]);
    const linked = Boolean(meta.folderId);
    const enabled = Boolean(settings.driveSyncEnabled);
    const entitled = !global.MCP.canUseFeature || global.MCP.canUseFeature("driveSync", settings);
    let connected = Boolean(entitled && enabled && linked);
    const identity = connected && global.MCP.DriveWorkspace
      ? await global.MCP.DriveWorkspace.createIdentity(settings).catch(() => null)
      : null;
    const workspaceMatches = !meta.workspaceId || !global.MCP.DriveWorkspace || Boolean(identity?.id && identity.id === meta.workspaceId);
    connected = Boolean(connected && workspaceMatches);
    const frequency = normalizeFrequency(settings.driveSyncFrequency);
    const nextSyncAt = meta.lastSyncAt
      ? Number(meta.lastSyncAt) + (DRIVE_FREQUENCIES[frequency] || DRIVE_FREQUENCIES["6h"]) * 60000
      : null;
    return {
      configured: isOauthConfigured(),
      enabled,
      connected,
      frequency,
      accountEmail: meta.accountEmail || "",
      lastSyncAt: meta.lastSyncAt || null,
      nextSyncAt,
      lastStatus: meta.lastStatus || "idle",
      lastError: meta.lastError || "",
      cooldownUntil: meta.cooldownUntil || null,
      remoteBackupAvailable: Boolean(meta.remoteBackupAvailable),
      syncInitialized: Boolean(meta.syncInitialized),
      localResetPending: normalizeLocalResetPending(meta.localResetPending),
      initializationRequired: Boolean(connected && !meta.syncInitialized),
      operation: publicDriveOperation(activeDriveOperation),
      workspaceId: workspaceMatches ? meta.workspaceId : "",
      workspaceReady: Boolean(workspaceMatches && meta.folderId)
    };
  }

  function normalizeLocalResetPending(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const storageKeys = keys();
    const allowedKeys = new Set([
      storageKeys.ITEMS,
      storageKeys.DEV_ITEMS,
      storageKeys.IMAGE_ITEMS
    ].filter(Boolean));
    const captureKeys = [...new Set((Array.isArray(value.captureKeys) ? value.captureKeys : [])
      .map((key) => String(key || ""))
      .filter((key) => allowedKeys.has(key)))];
    if (!captureKeys.length) return null;
    const fallbackCutoff = Math.max(0, Number(value.createdAt) || Date.now());
    const rawCutoffs = value.cutoffs && typeof value.cutoffs === "object" && !Array.isArray(value.cutoffs)
      ? value.cutoffs
      : {};
    const cutoffs = Object.fromEntries(captureKeys.map((key) => [
      key,
      Math.max(0, Number(rawCutoffs[key]) || fallbackCutoff)
    ]));
    return {
      captureKeys,
      createdAt: Math.min(...Object.values(cutoffs)),
      cutoffs
    };
  }

  async function beginLocalCaptureDeletion(captureKeys = []) {
    if (activeDriveOperation && !["completed", "cancelled", "failed"].includes(activeDriveOperation.state)) {
      throw new Error("drive.operationBusy");
    }
    try {
      clearTimeout(queuedSyncTimer);
      queuedSyncTimer = null;
      await chrome.alarms?.clear?.(DRIVE_PENDING_ALARM_NAME);
      const settings = await global.MCP.getSettings();
      let meta = await getMeta();
      const driveEntitled = !global.MCP.canUseFeature || global.MCP.canUseFeature("driveSync", settings);
      // Do not let a capture made just before the bulk-local reset fall through
      // the debounce window. Flush real pending changes to Drive first; if that
      // safety backup fails, the destructive local action does not start.
      if (driveEntitled && settings.driveSyncEnabled && meta.pendingLocalChangeAt && meta.folderId && meta.syncInitialized) {
        await syncNow({ reason: "before-local-reset", force: true });
        meta = await getMeta();
      }
      localDeletionInProgress = true;
      const previous = normalizeLocalResetPending(meta.localResetPending);
      const resetAt = Date.now();
      const nextCutoffs = Object.assign({}, previous?.cutoffs || {});
      (captureKeys || []).forEach((key) => {
        nextCutoffs[key] = resetAt;
      });
      const next = normalizeLocalResetPending({
        captureKeys: [...(previous?.captureKeys || []), ...(captureKeys || [])],
        createdAt: previous?.createdAt || resetAt,
        cutoffs: nextCutoffs
      });
      await saveMeta({
        pendingLocalChangeAt: null,
        localResetPending: next,
        lastStatus: "local-reset-protected",
        lastError: ""
      });
      return next;
    } catch (error) {
      localDeletionInProgress = false;
      throw error;
    }
  }

  function finishLocalCaptureDeletion() {
    localDeletionInProgress = false;
  }

  function applyConfirmedLocalReset(storage = {}, pendingReset = null) {
    const reset = normalizeLocalResetPending(pendingReset);
    if (!reset) return storage;
    const storageKeys = keys();
    const purgeKey = storageKeys.PURGE_MARKERS || "mcp_purge_markers";
    const next = Object.assign({}, storage || {});
    const purgeMarkers = Object.assign({}, next[purgeKey] || {});
    const confirmedAt = Date.now();
    reset.captureKeys.forEach((key) => {
      purgeMarkers[key] = Math.max(Number(purgeMarkers[key]) || 0, confirmedAt);
    });
    next[purgeKey] = purgeMarkers;
    return next;
  }

  function applyProtectedLocalResetView(cloudStorage = {}, localStorage = {}, pendingReset = null) {
    const reset = normalizeLocalResetPending(pendingReset);
    if (!reset) return cloudStorage;
    const storageKeys = keys();
    const next = Object.assign({}, cloudStorage || {});
    reset.captureKeys.forEach((key) => {
      const localItems = Array.isArray(localStorage?.[key]) ? localStorage[key] : [];
      const localIds = new Set(localItems.map((item) => String(item?.id || "")).filter(Boolean));
      const cutoff = Number(reset.cutoffs?.[key]) || Number(reset.createdAt) || 0;
      next[key] = (Array.isArray(next[key]) ? next[key] : []).filter((item) => (
        localIds.has(String(item?.id || "")) || captureOriginTimestamp(item) > cutoff
      ));
    });

    const sourceLocatorPrefix = storageKeys.SOURCE_LOCATOR_PREFIX || "mcp_source_locator_";
    const visibleSourceItemIds = new Set([
      ...(Array.isArray(next[storageKeys.ITEMS]) ? next[storageKeys.ITEMS] : []),
      ...(Array.isArray(next[storageKeys.IMAGE_ITEMS]) ? next[storageKeys.IMAGE_ITEMS] : [])
    ].map((item) => String(item?.id || "")).filter(Boolean));
    Object.keys(next)
      .filter((key) => key.startsWith(sourceLocatorPrefix))
      .forEach((key) => {
        if (!visibleSourceItemIds.has(key.slice(sourceLocatorPrefix.length))) delete next[key];
      });
    return next;
  }

  function createDriveOperation(kind = "sync") {
    if (activeDriveOperation && !["completed", "cancelled", "failed"].includes(activeDriveOperation.state)) {
      throw new Error("drive.operationBusy");
    }
    const operation = {
      id: `drive-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
      kind,
      state: "running",
      phase: "starting",
      percent: 0,
      pauseRequested: false,
      cancelRequested: false,
      abortController: null,
      resumeOperation: null,
      localRollback: null,
      remoteBefore: null,
      remoteManifestTarget: null,
      createdRemoteFileIds: new Set(),
      token: "",
      previousMeta: null,
      startedAt: Date.now()
    };
    activeDriveOperation = operation;
    broadcastDriveOperation(operation);
    return operation;
  }

  function publicDriveOperation(operation = activeDriveOperation) {
    if (!operation) return { active: false, state: "idle" };
    return {
      active: !["completed", "cancelled", "failed"].includes(operation.state),
      id: operation.id,
      kind: operation.kind,
      state: operation.state,
      phase: operation.phase,
      percent: Math.round(Number(operation.percent || 0)),
      startedAt: operation.startedAt
    };
  }

  function broadcastDriveOperation(operation = activeDriveOperation) {
    chrome.runtime?.sendMessage?.({
      type: global.MCP?.MESSAGE_TYPES?.DRIVE_OPERATION_UPDATED || "MCP_DRIVE_OPERATION_UPDATED",
      operation: publicDriveOperation(operation)
    }).catch(() => {});
  }

  function driveOperationCancelledError() {
    const error = new Error("drive.cancelled");
    error.name = "DriveOperationCancelledError";
    return error;
  }

  function isDriveOperationCancelled(error) {
    return error?.name === "DriveOperationCancelledError" || String(error?.message || error) === "drive.cancelled";
  }

  async function driveOperationCheckpoint(operation, phase = "") {
    if (!operation) return;
    if (phase) operation.phase = phase;
    if (operation.cancelRequested) throw driveOperationCancelledError();
    if (!operation.pauseRequested) return;
    operation.state = "paused";
    broadcastDriveOperation(operation);
    await new Promise((resolve) => {
      operation.resumeOperation = resolve;
    });
    operation.resumeOperation = null;
    if (operation.cancelRequested) throw driveOperationCancelledError();
    operation.state = "running";
    broadcastDriveOperation(operation);
  }

  function wakeDriveOperation(operation) {
    const resume = operation?.resumeOperation;
    operation.resumeOperation = null;
    if (resume) resume();
  }

  async function controlDriveOperation(action = "status", operationId = "") {
    const operation = activeDriveOperation;
    if (!operation || (operationId && operation.id !== operationId)) return publicDriveOperation(null);
    if (action === "pause") {
      operation.pauseRequested = true;
      operation.state = "pause-requested";
      operation.abortController?.abort("pause-requested");
      broadcastDriveOperation(operation);
      return publicDriveOperation(operation);
    }
    if (action === "resume") {
      operation.pauseRequested = false;
      operation.state = "running";
      wakeDriveOperation(operation);
      broadcastDriveOperation(operation);
      return publicDriveOperation(operation);
    }
    if (action === "cancel") {
      operation.cancelRequested = true;
      operation.pauseRequested = false;
      operation.state = "cancelling";
      operation.abortController?.abort("cancel-requested");
      wakeDriveOperation(operation);
      broadcastDriveOperation(operation);
      return publicDriveOperation(operation);
    }
    return publicDriveOperation(operation);
  }

  function finishDriveOperation(operation, state = "completed") {
    if (!operation) return;
    operation.state = state;
    operation.abortController = null;
    wakeDriveOperation(operation);
    broadcastDriveOperation(operation);
    if (activeDriveOperation === operation) activeDriveOperation = null;
  }

  async function connectDrive() {
    if (!isOauthConfigured()) throw new Error("drive.notConfigured");
    await saveMeta({ lastStatus: "connecting", lastError: "" });
    try {
      const token = await getAuthToken(true);
      const profile = await driveFetch("https://www.googleapis.com/oauth2/v2/userinfo", { token });
      const previousMeta = await getMeta();
      const settings = await global.MCP.getSettings();
      const workspace = await resolveDriveWorkspace(token, previousMeta, settings);
      const folder = workspace.folder;
      let file = await resolveExistingDriveManifestFile(token, folder.id, workspace.meta);
      if (!file?.id && !previousMeta.workspaceId && previousMeta.fileId && previousMeta.syncInitialized) {
        const legacyPayload = await downloadDriveJson(token, previousMeta.fileId).catch((error) => {
          if (isDriveNotFoundError(error)) return null;
          throw error;
        });
        if (legacyPayload && global.MCP.DriveWorkspace.assertPayloadMatches(legacyPayload, workspace.identity, { allowLegacy: true })) {
          const migratedPayload = global.MCP.DriveWorkspace.attachToPayload(legacyPayload, workspace.identity, {
            writerId: String((await chrome.storage.local.get(keys().INSTALLATION_ID))[keys().INSTALLATION_ID] || "")
          });
          file = await uploadDriveJson(token, { folderId: folder.id, payload: migratedPayload });
        }
      }
      global.MCP.driveSyncApplying = true;
      try {
        await global.MCP.saveSettings(Object.assign({}, settings, {
          driveSyncEnabled: true,
          driveSyncFrequency: normalizeFrequency(settings.driveSyncFrequency)
        }));
      } finally {
        global.MCP.driveSyncApplying = false;
      }
      const nextMeta = await saveMeta({
        accountEmail: profile.email || "",
        rootFolderId: workspace.root.id,
        workspaceId: workspace.identity.id,
        workspaceFolderName: workspace.identity.folderName,
        folderId: folder.id,
        fileId: file?.id || "",
        lastStatus: "connected",
        lastError: "",
        remoteModifiedTime: file?.modifiedTime || "",
        remoteBackupAvailable: Boolean(file?.id),
        syncInitialized: Boolean(previousMeta.syncInitialized && previousMeta.workspaceId === workspace.identity.id && previousMeta.folderId === folder.id && (!file?.id || previousMeta.fileId === file.id))
      });
      await scheduleDriveSyncAlarm();
      return { status: await getStatus(), meta: nextMeta };
    } catch (error) {
      const normalizedError = normalizeDriveError(error);
      await saveMeta({ lastStatus: "error", lastError: normalizedError });
      throw new Error(normalizedError);
    }
  }

  async function disconnectDrive() {
    if (activeDriveOperation && !["completed", "cancelled", "failed"].includes(activeDriveOperation.state)) {
      activeDriveOperation.disconnectRequested = true;
      activeDriveOperation.cancelRequested = true;
      activeDriveOperation.pauseRequested = false;
      activeDriveOperation.state = "cancelling";
      activeDriveOperation.abortController?.abort("drive-disconnected");
      wakeDriveOperation(activeDriveOperation);
      broadcastDriveOperation(activeDriveOperation);
    }
    await chrome.alarms?.clear?.(DRIVE_ALARM_NAME);
    await chrome.alarms?.clear?.(DRIVE_LIVE_ALARM_NAME);
    const token = await getAuthToken(false).catch(() => "");
    if (token && chrome.identity?.removeCachedAuthToken) {
      await chrome.identity.removeCachedAuthToken({ token }).catch(() => {});
    }
    const meta = await saveMeta({
      accountEmail: "",
      rootFolderId: "",
      workspaceId: "",
      workspaceFolderName: "",
      folderId: "",
      imagesFolderId: "",
      faviconsFolderId: "",
      fileId: "",
      lastStatus: "disconnected",
      lastError: "",
      cooldownUntil: null,
      remoteModifiedTime: "",
      remoteBackupAvailable: false,
      syncInitialized: false,
      pendingLocalChangeAt: null,
      localResetPending: null
    });
    const settings = await global.MCP.getSettings();
    global.MCP.driveSyncApplying = true;
    try {
      await global.MCP.saveSettings(Object.assign({}, settings, { driveSyncEnabled: false }));
    } finally {
      global.MCP.driveSyncApplying = false;
    }
    return { status: await getStatus(), meta };
  }

  async function analyzeDriveRestoreFromDrive() {
    if (!isOauthConfigured()) throw new Error("drive.notConfigured");
    const token = await getAuthToken(true);
    const profile = await driveFetch("https://www.googleapis.com/oauth2/v2/userinfo", { token }).catch(() => ({}));
    const settings = await global.MCP.getSettings();
    global.MCP.driveSyncApplying = true;
    try {
      await global.MCP.saveSettings(Object.assign({}, settings, {
        driveSyncEnabled: true,
        driveSyncFrequency: normalizeFrequency(settings.driveSyncFrequency)
      }));
    } finally {
      global.MCP.driveSyncApplying = false;
    }
    const meta = await getMeta();
    const backup = await findDriveBackup(token, meta);
    const localStorage = await chrome.storage.local.get(null);
    const remotePayload = backup.payload || null;
    await saveMeta({
      accountEmail: profile.email || meta.accountEmail || "",
      folderId: backup.file?.parents?.[0] || backup.folder?.id || meta.folderId || "",
      fileId: backup.file?.id || meta.fileId || "",
      lastStatus: getDrivePayloadStorage(remotePayload) ? "analyzed" : "no-backup",
      lastError: "",
      remoteModifiedTime: backup.file?.modifiedTime || meta.remoteModifiedTime || "",
      remoteBackupAvailable: Boolean(getDrivePayloadStorage(remotePayload))
    });
    await scheduleDriveSyncAlarm();
    return createDriveRestoreAnalysis(localStorage, remotePayload, backup);
  }

  async function restoreDriveFromDrive(options = {}) {
    if (options.overwrite) return restoreDriveOverwrite();
    const status = await getStatus();
    if (!status.connected) throw new Error("drive.disabled");
    if (!status.remoteBackupAvailable) throw new Error("drive.restoreFromDriveNoJson");
    return syncNow({
      manual: true,
      interactive: true,
      force: true,
      reason: "restore-from-drive",
      restoreFromDrive: true
    });
  }

  async function restoreDriveOverwrite() {
    const operation = createDriveOperation("restore-overwrite");
    let finalState = "completed";
    try {
      return await performDriveOverwrite(operation);
    } catch (error) {
      if (isDriveOperationCancelled(error)) {
        finalState = "cancelled";
        await rollbackDriveOperation(operation);
        throw new Error("drive.cancelled");
      }
      finalState = "failed";
      await rollbackLocalDriveMutation(operation).catch(() => {});
      throw error;
    } finally {
      finishDriveOperation(operation, finalState);
    }
  }

  async function performDriveOverwrite(operation) {
    if (!isOauthConfigured()) throw new Error("drive.notConfigured");
    await driveOperationCheckpoint(operation, "authenticating");
    broadcastDriveProgress("drive.progressAuthenticating", 8);
    const token = await getAuthToken(true);
    operation.token = token;
    const profile = await driveFetch("https://www.googleapis.com/oauth2/v2/userinfo", { token }).catch(() => ({}));
    const meta = await getMeta();
    operation.previousMeta = meta;
    await driveOperationCheckpoint(operation, "reading-manifest");
    broadcastDriveProgress("drive.progressReadingManifest", 22, { filename: DRIVE_FILE_NAME });
    const backup = await findDriveBackup(token, meta);
    const localStorage = await chrome.storage.local.get(null);
    operation.remoteBefore = {
      file: backup.file || null,
      folderId: backup.file?.parents?.[0] || backup.folder?.id || meta.folderId || "",
      payload: backup.payload || null
    };
    const remotePayload = backup.payload || null;
    let remoteStorage = getDrivePayloadStorage(remotePayload);
    if (!remoteStorage) {
      await saveMeta({
        accountEmail: profile.email || meta.accountEmail || "",
        folderId: backup.file?.parents?.[0] || backup.folder?.id || meta.folderId || "",
        fileId: backup.file?.id || meta.fileId || "",
        lastStatus: "no-backup",
        lastError: "",
        remoteModifiedTime: backup.file?.modifiedTime || meta.remoteModifiedTime || ""
      });
      return {
        status: await getStatus(),
        remoteJsonFound: false,
        importSummary: summarizeRemoteImports(localStorage, {}),
        imageAssetCount: 0,
        faviconAssetCount: 0,
        imagesFolderId: backup.payloadImagesFolderId || "",
        faviconsFolderId: ""
      };
    }
    await driveOperationCheckpoint(operation, "hydrating-assets");
    remoteStorage = await hydrateDrivePayloadAssets(token, remotePayload, remoteStorage);
    broadcastDriveProgress("drive.progressMergingData", 48);
    const licenseSnapshot = global.MCP?.createLicenseRestoreSnapshot?.(localStorage) || null;
    const interfaceSnapshot = global.MCP?.createLocalInterfaceRestoreSnapshot?.(localStorage) || null;
    const restoredStorage = global.MCP?.preserveLocalInterfaceStateForRestore
      ? global.MCP.preserveLocalInterfaceStateForRestore(prepareDriveOverwriteStorage(localStorage, remoteStorage), localStorage, { interfaceSnapshot })
      : prepareDriveOverwriteStorage(localStorage, remoteStorage);
    const importSummary = global.MCP?.summarizeBackupStorage ? global.MCP.summarizeBackupStorage(restoredStorage) : {};
    operation.localRollback = {
      mode: "overwrite",
      before: localStorage,
      written: restoredStorage,
      applied: true
    };
    await driveOperationCheckpoint(operation, "writing-local");
    global.MCP.driveSyncApplying = true;
    try {
      broadcastDriveProgress("backup.progressClearingStorage", 66);
      broadcastDriveProgress("backup.progressWritingStorage", 78);
      if (global.MCP?.replaceLocalStorageForRestore) {
        await global.MCP.replaceLocalStorageForRestore(restoredStorage, localStorage);
      } else {
        await chrome.storage.local.set(restoredStorage);
      }
      await global.MCP?.reapplyLicenseSnapshotAfterRestore?.(licenseSnapshot);
      await global.MCP?.reapplyLocalInterfaceSnapshotAfterRestore?.(interfaceSnapshot);
    } finally {
      global.MCP.driveSyncApplying = false;
    }
    await driveOperationCheckpoint(operation, "finalizing");
    broadcastDriveProgress("drive.progressWritingLocalMirror", 90);
    const nextMeta = await saveMeta({
      accountEmail: profile.email || meta.accountEmail || "",
      folderId: backup.file?.parents?.[0] || backup.folder?.id || meta.folderId || "",
      imagesFolderId: remotePayload.assets?.imagesFolderId || meta.imagesFolderId || "",
      faviconsFolderId: remotePayload.assets?.faviconsFolderId || meta.faviconsFolderId || "",
      fileId: backup.file?.id || meta.fileId || "",
      lastSyncAt: Date.now(),
      lastStatus: "restored",
      lastError: "",
      remoteBackupAvailable: true,
      syncInitialized: true,
      pendingLocalChangeAt: null,
      localResetPending: null,
      remoteModifiedTime: backup.file?.modifiedTime || "",
      lastImageAssetCount: Array.isArray(remotePayload.assets?.images) ? remotePayload.assets.images.length : 0,
      lastFaviconAssetCount: Array.isArray(remotePayload.assets?.favicons) ? remotePayload.assets.favicons.length : 0
    });
    broadcastDriveProgress("drive.progressDone", 100);
    await scheduleDriveSyncAlarm();
    return {
      status: await getStatus(),
      meta: nextMeta,
      summary: importSummary,
      importSummary,
      remoteJsonFound: true,
      imageAssetCount: Array.isArray(remotePayload.assets?.images) ? remotePayload.assets.images.length : 0,
      faviconAssetCount: Array.isArray(remotePayload.assets?.favicons) ? remotePayload.assets.favicons.length : 0,
      imagesFolderId: remotePayload.assets?.imagesFolderId || "",
      faviconsFolderId: remotePayload.assets?.faviconsFolderId || ""
    };
  }

  async function syncNow(options = {}) {
    if (localDeletionInProgress) return { skipped: true, reason: "local-deletion" };
    if (runningSyncPromise) {
      pendingSyncRequestedWhileRunning = true;
      return runningSyncPromise;
    }
    const operation = createDriveOperation(options.restoreFromDrive ? "restore-merge" : "sync");
    let finalState = "completed";
    runningSyncPromise = performSyncNow(options, operation)
      .catch(async (error) => {
        if (isDriveOperationCancelled(error)) {
          finalState = "cancelled";
          await rollbackDriveOperation(operation);
          throw new Error("drive.cancelled");
        }
        finalState = "failed";
        throw error;
      })
      .finally(() => {
        finishDriveOperation(operation, finalState);
        runningSyncPromise = null;
        const shouldScheduleFollowUp = pendingSyncRequestedWhileRunning;
        pendingSyncRequestedWhileRunning = false;
        if (shouldScheduleFollowUp) schedulePendingDriveSyncAfterRun().catch(() => {});
      });
    return runningSyncPromise;
  }

  async function performSyncNow(options = {}, operation = activeDriveOperation) {
    const settings = await global.MCP.getSettings();
    const meta = await getMeta();
    const pendingLocalReset = normalizeLocalResetPending(meta.localResetPending);
    if (pendingLocalReset && options.manual && !options.restoreFromDrive && options.confirmLocalReset !== true) {
      throw new Error("drive.localResetConfirmationRequired");
    }
    const protectLocalReset = Boolean(
      pendingLocalReset
      && !options.restoreFromDrive
      && options.confirmLocalReset !== true
    );
    operation.previousMeta = operation.previousMeta || meta;
    const now = Date.now();
    if (!settings.driveSyncEnabled && !options.force) throw new Error("drive.disabled");
    if (!isOauthConfigured()) throw new Error("drive.notConfigured");
    if (!options.force && options.manual && meta.cooldownUntil && now < meta.cooldownUntil) {
      const seconds = Math.ceil((meta.cooldownUntil - now) / 1000);
      const error = new Error("drive.cooldown");
      error.cooldownSeconds = seconds;
      throw error;
    }
    await saveMeta({
      lastStatus: "syncing",
      lastError: "",
      cooldownUntil: options.manual ? now + DRIVE_MANUAL_COOLDOWN_MS : meta.cooldownUntil || null
    });
    try {
      await driveOperationCheckpoint(operation, "authenticating");
      broadcastDriveProgress("drive.progressAuthenticating", 8);
      const token = await getAuthToken(Boolean(options.interactive));
      operation.token = token;
      await driveOperationCheckpoint(operation, "ensuring-folder");
      broadcastDriveProgress("drive.progressEnsuringFolder", 14);
      const workspace = await resolveDriveWorkspace(token, meta, settings);
      const folder = workspace.folder;
      await driveOperationCheckpoint(operation, "reading-manifest");
      broadcastDriveProgress("drive.progressEnsuringManifest", 20);
      const file = await resolveExistingDriveManifestFile(token, folder.id, workspace.meta);
      broadcastDriveProgress("drive.progressReadingManifest", 26, { filename: DRIVE_FILE_NAME });
      const rawLocalStorage = await chrome.storage.local.get(null);
      const localStorage = pendingLocalReset && options.confirmLocalReset === true
        ? applyConfirmedLocalReset(rawLocalStorage, pendingLocalReset)
        : rawLocalStorage;
      // An existing manifest is authoritative. A network, parsing, or validation
      // failure must abort the sync instead of being mistaken for an empty cloud,
      // otherwise a temporarily offline device could overwrite the shared state.
      let remotePayload = file?.id ? await downloadDriveJson(token, file.id) : null;
      if (remotePayload) remotePayload = normalizeDrivePayloadForWorkspace(remotePayload, workspace.identity);
      operation.remoteBefore = {
        file: file || null,
        folderId: folder.id,
        payload: remotePayload
      };
      await driveOperationCheckpoint(operation, "hydrating-assets");
      const remoteStorage = await hydrateDrivePayloadAssets(token, remotePayload, getDrivePayloadStorage(remotePayload) || {});
      broadcastDriveProgress("drive.progressMergingData", 34);
      const importSummary = summarizeRemoteImports(localStorage, remoteStorage);
      const mergedStorage = preserveConnectedDriveSettings(
        mergeLocalPriorityStorage(localStorage, remoteStorage),
        settings
      );
      const imageSync = await syncDriveImageAssets(token, {
        parentFolderId: folder.id,
        imagesFolderId: workspace.meta.imagesFolderId,
        storage: mergedStorage,
        progressBase: 38,
        progressSpan: 24
      });
      const faviconSync = await syncDriveFaviconAssets(token, {
        parentFolderId: folder.id,
        faviconsFolderId: workspace.meta.faviconsFolderId,
        storage: imageSync.storage,
        progressBase: 62,
        progressSpan: 14
      });
      const storageForSync = faviconSync.storage;
      const latestManifest = file?.id
        ? await getDriveFileMeta(token, file.id, "id,name,modifiedTime,parents")
        : await findDriveFileByName(token, folder.id, DRIVE_FILE_NAME);
      const remoteChangedDuringSync = Boolean(
        (file?.id && latestManifest?.id && latestManifest.modifiedTime !== file.modifiedTime)
        || (!file?.id && latestManifest?.id)
      );
      if (remoteChangedDuringSync) {
        if (Number(options.conflictRetry || 0) < 2) {
          return performSyncNow(Object.assign({}, options, {
            force: true,
            conflictRetry: Number(options.conflictRetry || 0) + 1
          }), operation);
        }
        throw new Error("drive.remoteChanged");
      }
      await driveOperationCheckpoint(operation, "writing-local");
      broadcastDriveProgress("drive.progressWritingLocalMirror", 79);
      const committedLocalChangeGeneration = localChangeGeneration;
      const latestRawLocalStorage = await chrome.storage.local.get(null);
      const latestLocalStorage = pendingLocalReset && options.confirmLocalReset === true
        ? applyConfirmedLocalReset(latestRawLocalStorage, pendingLocalReset)
        : latestRawLocalStorage;
      const cloudStorageForCommit = preserveConnectedDriveSettings(
        mergeLocalPriorityStorage(latestLocalStorage, storageForSync),
        latestLocalStorage[keys().SETTINGS] || settings
      );
      const storageForCommit = protectLocalReset
        ? applyProtectedLocalResetView(cloudStorageForCommit, latestRawLocalStorage, pendingLocalReset)
        : cloudStorageForCommit;
      operation.localRollback = {
        mode: "merge",
        before: localStorage,
        written: storageForCommit,
        applied: true
      };
      global.MCP.driveSyncApplying = true;
      try {
        await chrome.storage.local.set(storageForCommit);
      } finally {
        global.MCP.driveSyncApplying = false;
      }
      const payload = createDrivePayload(cloudStorageForCommit, {
        workspaceIdentity: workspace.identity,
        writerId: String(storageForCommit[keys().INSTALLATION_ID] || ""),
        imagesFolderId: imageSync.imagesFolderId,
        imageAssets: imageSync.assets,
        faviconsFolderId: faviconSync.faviconsFolderId,
        faviconAssets: faviconSync.assets,
        transactionId: operation.id
      });
      await driveOperationCheckpoint(operation, "uploading-manifest");
      broadcastDriveProgress("drive.progressUploadingManifest", 88, { filename: DRIVE_FILE_NAME });
      const uploaded = await uploadDriveJson(token, {
        fileId: file?.id || "",
        folderId: folder.id,
        payload
      });
      const uploadedFileId = uploaded.id || file?.id || "";
      const uploadStillCurrent = await verifyUploadedDriveTransaction(token, uploadedFileId, operation.id);
      if (!uploadStillCurrent) {
        if (Number(options.conflictRetry || 0) < 2) {
          return performSyncNow(Object.assign({}, options, {
            force: true,
            conflictRetry: Number(options.conflictRetry || 0) + 1
          }), operation);
        }
        pendingSyncRequestedWhileRunning = true;
        throw new Error("drive.remoteChanged");
      }
      operation.remoteManifestTarget = {
        fileId: uploadedFileId,
        created: !file?.id,
        folderId: folder.id
      };
      await driveOperationCheckpoint(operation, "finalizing");
      const nextMeta = await saveMeta({
        rootFolderId: workspace.root.id,
        workspaceId: workspace.identity.id,
        workspaceFolderName: workspace.identity.folderName,
        folderId: folder.id,
        imagesFolderId: imageSync.imagesFolderId || meta.imagesFolderId || "",
        faviconsFolderId: faviconSync.faviconsFolderId || meta.faviconsFolderId || "",
        fileId: uploaded.id || file.id,
        lastSyncAt: Date.now(),
        lastStatus: "success",
        lastError: "",
        remoteBackupAvailable: true,
        syncInitialized: true,
        pendingLocalChangeAt: null,
        localResetPending: protectLocalReset
          ? pendingLocalReset
          : null,
        remoteModifiedTime: uploaded.modifiedTime || "",
        lastImageAssetCount: imageSync.assets.length,
        lastFaviconAssetCount: faviconSync.assets.length
      });
      if (localChangeGeneration !== committedLocalChangeGeneration) {
        await queueDriveSync("changes-during-sync");
      }
      broadcastDriveProgress("drive.progressDone", 100);
      await scheduleDriveSyncAlarm();
      return {
        status: await getStatus(),
        meta: nextMeta,
        summary: payload.summary,
        importSummary,
        remoteJsonFound: Boolean(getDrivePayloadStorage(remotePayload)),
        imageAssetCount: imageSync.assets.length,
        faviconAssetCount: faviconSync.assets.length,
        imagesFolderId: imageSync.imagesFolderId || "",
        faviconsFolderId: faviconSync.faviconsFolderId || ""
      };
    } catch (error) {
      const normalizedError = normalizeDriveError(error);
      await saveMeta({
        lastStatus: "error",
        lastError: normalizedError
      });
      throw new Error(normalizedError);
    }
  }

  async function queueDriveSync(reason = "local-change") {
    if (localDeletionInProgress) return { skipped: true, reason: "local-deletion" };
    localChangeGeneration += 1;
    if (!queuedSyncTimer) {
      if (!pendingMetaWritePromise) {
        pendingMetaWritePromise = saveMeta({ pendingLocalChangeAt: Date.now(), lastError: "" })
          .finally(() => { pendingMetaWritePromise = null; });
      }
      await pendingMetaWritePromise;
      chrome.alarms?.create?.(DRIVE_PENDING_ALARM_NAME, { delayInMinutes: minimumLiveAlarmMinutes() });
    }
    clearTimeout(queuedSyncTimer);
    queuedSyncTimer = setTimeout(async () => {
      queuedSyncTimer = null;
      const [settings, meta] = await Promise.all([global.MCP.getSettings(), getMeta()]);
      if (!settings.driveSyncEnabled || !meta.folderId || !meta.syncInitialized) return;
      syncNow({ reason }).catch(() => {});
    }, DRIVE_DEBOUNCE_MS);
  }

  async function schedulePendingDriveSyncAfterRun() {
    if (localDeletionInProgress || runningSyncPromise || queuedSyncTimer) return;
    const [settings, meta] = await Promise.all([global.MCP.getSettings(), getMeta()]);
    if (!settings.driveSyncEnabled || !meta.pendingLocalChangeAt || !meta.folderId || !meta.syncInitialized) return;
    queuedSyncTimer = setTimeout(() => {
      queuedSyncTimer = null;
      syncNow({ reason: "queued-follow-up" }).catch(() => {});
    }, 0);
  }

  async function syncIfOverdue(reason = "startup-overdue") {
    const settings = await global.MCP.getSettings();
    const meta = await getMeta();
    if (localDeletionInProgress) {
      await scheduleDriveSyncAlarm();
      return { skipped: true, reason: "local-deletion", status: await getStatus() };
    }
    if (!settings.driveSyncEnabled || !meta.folderId || !meta.syncInitialized) {
      await scheduleDriveSyncAlarm();
      return { skipped: true, reason: meta.folderId ? "not-initialized" : "not-connected", status: await getStatus() };
    }
    const frequency = normalizeFrequency(settings.driveSyncFrequency);
    const periodMs = (DRIVE_FREQUENCIES[frequency] || DRIVE_FREQUENCIES["6h"]) * 60000;
    const lastSyncAt = Number(meta.lastSyncAt || 0);
    const isDue = Boolean(meta.pendingLocalChangeAt) || !lastSyncAt || Date.now() >= lastSyncAt + periodMs;
    if (!isDue) {
      await scheduleDriveSyncAlarm();
      return { skipped: true, reason: "not-due", status: await getStatus() };
    }
    return syncNow({ reason, force: true });
  }

  async function scheduleDriveSyncAlarm() {
    if (!chrome.alarms) return;
    const [settings, meta] = await Promise.all([
      global.MCP.getSettings(),
      getMeta()
    ]);
    await chrome.alarms.clear(DRIVE_ALARM_NAME);
    await chrome.alarms.clear(DRIVE_LIVE_ALARM_NAME);
    if (!settings.driveSyncEnabled || !meta.folderId) return;
    const liveAlarmMinutes = minimumLiveAlarmMinutes();
    chrome.alarms.create(DRIVE_LIVE_ALARM_NAME, { periodInMinutes: liveAlarmMinutes, delayInMinutes: liveAlarmMinutes });
    if (!meta.syncInitialized) return;
    const periodInMinutes = DRIVE_FREQUENCIES[normalizeFrequency(settings.driveSyncFrequency)] || DRIVE_FREQUENCIES["6h"];
    const lastSyncAt = Number(meta.lastSyncAt || 0);
    const nextSyncAt = lastSyncAt ? lastSyncAt + periodInMinutes * 60000 : Date.now() + periodInMinutes * 60000;
    const delayInMinutes = Math.max(1, Math.ceil((nextSyncAt - Date.now()) / 60000));
    chrome.alarms.create(DRIVE_ALARM_NAME, { periodInMinutes, delayInMinutes });
  }

  function minimumLiveAlarmMinutes() {
    const major = Number.parseInt(String(global.navigator?.userAgent || "").match(/(?:Chrome|Chromium)\/(\d+)/)?.[1] || "0", 10);
    return major >= 120 ? 0.5 : 1;
  }

  function normalizeFrequency(value) {
    return Object.prototype.hasOwnProperty.call(DRIVE_FREQUENCIES, value) ? value : "6h";
  }

  async function getAuthToken(interactive) {
    if (!chrome.identity?.getAuthToken) throw new Error("drive.identityUnavailable");
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: Boolean(interactive) }, (token) => {
        const error = chrome.runtime.lastError;
        if (error || !token) {
          reject(new Error(error?.message || "drive.authFailed"));
          return;
        }
        resolve(token);
      });
    });
  }

  async function driveFetch(url, options = {}) {
    const safeUrl = assertGoogleApiUrl(url);
    const token = options.token || await getAuthToken(false);
    const fetchOptions = Object.assign({}, options, {
      headers: Object.assign({}, options.headers || {}, { Authorization: `Bearer ${token}` })
    });
    delete fetchOptions.token;
    const response = await controlledDriveFetch(safeUrl, fetchOptions);
    if (!response.ok) {
      const text = await readDriveResponseTextWithLimit(response, MAX_DRIVE_ERROR_RESPONSE_BYTES).catch(() => "");
      const error = new Error(text || `Drive API ${response.status}`);
      error.status = response.status;
      error.driveError = parseDriveApiError(text);
      if (response.status === 404 || error.driveError?.code === 404 || error.driveError?.error?.code === 404) {
        error.messageKey = "drive.remoteMissing";
      }
      throw error;
    }
    const contentType = response.headers.get("content-type") || "";
    const text = await readDriveResponseTextWithLimit(response, MAX_DRIVE_TEXT_RESPONSE_BYTES);
    if (contentType.includes("application/json")) return JSON.parse(text || "{}");
    return text;
  }

  async function controlledDriveFetch(url, options = {}) {
    const operation = activeDriveOperation;
    while (true) {
      await driveOperationCheckpoint(operation);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort("drive-request-timeout"), DRIVE_REQUEST_TIMEOUT_MS);
      if (operation) operation.abortController = controller;
      try {
        return await fetch(url, Object.assign({}, options, { signal: controller.signal }));
      } catch (error) {
        if (controller.signal.aborted && controller.signal.reason === "drive-request-timeout") {
          throw driveRequestTimeoutError();
        }
        const interruptedByControl = Boolean(
          operation
          && controller.signal.aborted
          && (operation.pauseRequested || operation.cancelRequested)
        );
        if (!interruptedByControl) throw error;
        if (operation.cancelRequested) throw driveOperationCancelledError();
        await driveOperationCheckpoint(operation);
      } finally {
        clearTimeout(timeoutId);
        if (operation?.abortController === controller) operation.abortController = null;
      }
    }
  }

  function driveRequestTimeoutError() {
    const error = new Error("drive.authFailed");
    error.messageKey = "drive.authFailed";
    error.code = "DRIVE_REQUEST_TIMEOUT";
    return error;
  }

  async function driveFetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort("drive-request-timeout"), DRIVE_REQUEST_TIMEOUT_MS);
    try {
      return await fetch(url, Object.assign({}, options, { signal: controller.signal }));
    } catch (error) {
      if (controller.signal.aborted && controller.signal.reason === "drive-request-timeout") {
        throw driveRequestTimeoutError();
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function readDriveResponseTextWithLimit(response, maxBytes = MAX_DRIVE_TEXT_RESPONSE_BYTES) {
    if (!response?.body?.getReader) {
      const text = await response.text();
      if (new TextEncoder().encode(text).byteLength > maxBytes) throw new Error("drive.responseTooLarge");
      return text;
    }
    const bytes = await readDriveResponseBytesWithLimit(response, maxBytes);
    return new TextDecoder("utf-8").decode(bytes);
  }

  async function readDriveResponseBytesWithLimit(response, maxBytes) {
    const declaredLength = Number(response?.headers?.get?.("content-length") || 0);
    if (declaredLength > maxBytes) throw new Error("drive.responseTooLarge");
    if (!response?.body?.getReader) {
      const bytes = typeof response?.arrayBuffer === "function"
        ? new Uint8Array(await response.arrayBuffer())
        : new TextEncoder().encode(await response.text());
      if (bytes.byteLength > maxBytes) throw new Error("drive.responseTooLarge");
      return bytes;
    }
    const reader = response.body.getReader();
    const chunks = [];
    let total = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > maxBytes) {
          await reader.cancel("drive.responseTooLarge").catch(() => {});
          throw new Error("drive.responseTooLarge");
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock?.();
    }
    const bytes = new Uint8Array(total);
    let offset = 0;
    chunks.forEach((chunk) => {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    });
    return bytes;
  }

  async function ensureDriveFolder(token) {
    return ensureFolderByName(token, DRIVE_FOLDER_NAME);
  }

  async function resolveDriveFolder(token, meta = {}) {
    if (meta.folderId) {
      const existing = await getDriveFileMeta(token, meta.folderId, "id,name,modifiedTime,mimeType").catch((error) => {
        if (isDriveNotFoundError(error)) return null;
        throw error;
      });
      if (existing?.id) return existing;
    }
    return ensureDriveFolder(token);
  }

  async function resolveDriveWorkspace(token, meta = {}, settings = null) {
    const currentSettings = settings || await global.MCP.getSettings();
    const identity = await global.MCP.DriveWorkspace.createIdentity(currentSettings);
    let root = null;
    if (meta.rootFolderId) root = await getDriveFileMeta(token, meta.rootFolderId, "id,name,parents,mimeType").catch((error) => {
      if (isDriveNotFoundError(error)) return null;
      throw error;
    });
    if (!root) root = await ensureDriveFolder(token);
    let folder = null;
    if (meta.workspaceId === identity.id && meta.folderId) {
      folder = await getDriveFileMeta(token, meta.folderId, "id,name,parents,mimeType").catch(() => null);
      if (folder && (folder.name !== identity.folderName || !folder.parents?.includes(root.id))) folder = null;
    }
    if (!folder) folder = await ensureChildDriveFolder(token, root.id, identity.folderName);
    return {
      root,
      folder,
      identity,
      meta: meta.workspaceId === identity.id ? meta : Object.assign({}, meta, {
        fileId: "", imagesFolderId: "", faviconsFolderId: "", remoteModifiedTime: ""
      })
    };
  }

  async function resolveExistingDriveManifestFile(token, folderId, meta = {}) {
    if (meta.fileId) {
      const existing = await getDriveFileMeta(token, meta.fileId, "id,name,modifiedTime,parents").catch((error) => {
        if (isDriveNotFoundError(error)) return null;
        throw error;
      });
      if (existing?.id && (!folderId || !Array.isArray(existing.parents) || existing.parents.includes(folderId))) return existing;
    }
    return findDriveFileByName(token, folderId, DRIVE_FILE_NAME);
  }

  async function ensureChildDriveFolder(token, parentFolderId, name) {
    return ensureFolderByName(token, name, parentFolderId);
  }

  async function ensureFolderByName(token, name, parentFolderId = "") {
    const escapedName = escapeDriveQuery(name);
    const parentClause = parentFolderId ? ` and '${parentFolderId}' in parents` : "";
    const query = encodeURIComponent(`name='${escapedName}' and mimeType='application/vnd.google-apps.folder' and trashed=false${parentClause}`);
    const list = await driveFetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,parents)&orderBy=modifiedTime desc&spaces=drive`, { token });
    if (list.files?.[0]) return list.files[0];
    const metadata = {
      name,
      mimeType: "application/vnd.google-apps.folder"
    };
    if (parentFolderId) metadata.parents = [parentFolderId];
    return driveFetch("https://www.googleapis.com/drive/v3/files?fields=id,name,modifiedTime", {
      token,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata)
    });
  }

  async function syncDriveImageAssets(token, { parentFolderId, imagesFolderId = "", storage = {}, progressBase = 40, progressSpan = 24 }) {
    const storageKeys = keys();
    const imageItems = Array.isArray(storage[storageKeys.IMAGE_ITEMS]) ? storage[storageKeys.IMAGE_ITEMS] : [];
    const imagesFolder = await resolveDriveChildFolder(token, parentFolderId, imagesFolderId, DRIVE_IMAGES_FOLDER_NAME);
    if (!imageItems.length) return { storage, imagesFolderId: imagesFolder.id || imagesFolderId || "", assets: [] };
    const assets = [];
    const nextImages = [];
    let processed = 0;
    const total = imageItems.filter((item) => !global.MCP?.isVaultItem?.(item) && imageAssetSource(item)).length || 1;
    for (const item of imageItems) {
      await driveOperationCheckpoint(activeDriveOperation, "uploading-images");
      if (global.MCP?.isVaultItem?.(item)) {
        nextImages.push(item);
        continue;
      }
      const assetSource = imageAssetSource(item);
      if (!assetSource) {
        nextImages.push(item);
        continue;
      }
      const sourceStamp = imageAssetStamp(item, assetSource.dataUrl);
      const fileName = imageAssetFileName(item, assetSource.mimeType, sourceStamp);
      processed += 1;
      broadcastDriveProgress("drive.progressUploadingImage", progressBase + (processed / total) * progressSpan, {
        filename: fileName,
        index: processed,
        total
      });
      const canReuse = item.driveImageFileId
        && item.driveImageSourceStamp === sourceStamp;
      let uploaded = canReuse ? {
        id: item.driveImageFileId,
        name: item.driveImageFileName,
        modifiedTime: item.driveImageUpdatedAt || ""
      } : null;
      let existingFileId = "";
      if (!uploaded && imagesFolder.id && fileName) {
        const existing = await findDriveFileByName(token, imagesFolder.id, fileName).catch(() => null);
        existingFileId = existing?.id || "";
      }
      if (!uploaded) {
        const blob = dataUrlToBlob(assetSource.dataUrl, assetSource.mimeType);
        uploaded = await uploadDriveBinary(token, {
          fileId: item.driveImageFileId || existingFileId,
          folderId: imagesFolder.id,
          name: fileName,
          mimeType: blob.type || assetSource.mimeType || "image/png",
          blob
        });
      }
      const nextItem = Object.assign({}, item, {
        driveImageFileId: uploaded.id || item.driveImageFileId || "",
        driveImageFileName: uploaded.name || fileName,
        driveImageMimeType: assetSource.mimeType,
        driveImageFolderId: imagesFolder.id,
        driveImageSourceStamp: sourceStamp,
        driveImageUpdatedAt: uploaded.modifiedTime || new Date().toISOString()
      });
      nextImages.push(nextItem);
      assets.push({
        itemId: nextItem.id,
        fileId: nextItem.driveImageFileId,
        fileName: nextItem.driveImageFileName,
        mimeType: nextItem.driveImageMimeType,
        folderId: imagesFolder.id,
        sourceStamp
      });
    }
    return {
      storage: Object.assign({}, storage, { [storageKeys.IMAGE_ITEMS]: nextImages }),
      imagesFolderId: imagesFolder.id,
      assets
    };
  }

  async function syncDriveFaviconAssets(token, { parentFolderId, faviconsFolderId = "", storage = {}, progressBase = 64, progressSpan = 14 }) {
    const storageKeys = keys();
    const itemKeys = [storageKeys.ITEMS, storageKeys.DEV_ITEMS, storageKeys.IMAGE_ITEMS].filter(Boolean);
    const uploadedBySource = new Map();
    const assets = [];
    const nextStorage = Object.assign({}, storage || {});
    let faviconsFolder = await resolveDriveChildFolder(token, parentFolderId, faviconsFolderId, DRIVE_FAVICONS_FOLDER_NAME);
    let changed = false;
    let processed = 0;
    const totalSources = new Set();
    itemKeys.forEach((itemKey) => {
      (Array.isArray(storage[itemKey]) ? storage[itemKey] : []).forEach((item) => {
        if (global.MCP?.isVaultItem?.(item)) return;
        const faviconUrl = String(item?.sourceFaviconUrl || "");
        if (faviconUrl) totalSources.add(item.sourceDomain || item.sourceUrl || faviconUrl);
      });
    });
    const total = totalSources.size || 1;
    for (const itemKey of itemKeys) {
      const items = Array.isArray(storage[itemKey]) ? storage[itemKey] : [];
      if (!items.length) continue;
      const nextItems = [];
      for (const item of items) {
        await driveOperationCheckpoint(activeDriveOperation, "uploading-favicons");
        if (global.MCP?.isVaultItem?.(item)) {
          nextItems.push(item);
          continue;
        }
        const faviconUrl = String(item?.sourceFaviconUrl || "");
        if (!faviconUrl) {
          nextItems.push(item);
          continue;
        }
        const sourceKey = item.sourceDomain || item.sourceUrl || faviconUrl;
        const sourceStamp = faviconAssetStamp(item, faviconUrl);
        const cached = uploadedBySource.get(sourceKey) || null;
        let uploaded = cached?.uploaded || null;
        const fileName = faviconAssetFileName(sourceKey, faviconUrl, sourceStamp);
        if (!cached) {
          processed += 1;
          broadcastDriveProgress("drive.progressUploadingFavicon", progressBase + (processed / total) * progressSpan, {
            filename: fileName,
            index: processed,
            total
          });
        }
        if (!uploaded && item.driveFaviconFileId && item.driveFaviconSourceStamp === sourceStamp) {
          uploaded = {
            id: item.driveFaviconFileId,
            name: item.driveFaviconFileName,
            mimeType: item.driveFaviconMimeType || "image/png",
            modifiedTime: item.driveFaviconUpdatedAt || ""
          };
        }
        if (!uploaded) {
          const assetSource = await faviconAssetSource(faviconUrl).catch(() => null);
          if (!assetSource) {
            nextItems.push(item);
            continue;
          }
          const existing = await findDriveFileByName(token, faviconsFolder.id, fileName).catch(() => null);
          uploaded = await uploadDriveBinary(token, {
            fileId: item.driveFaviconFileId || existing?.id || "",
            folderId: faviconsFolder.id,
            name: fileName,
            mimeType: assetSource.mimeType,
            blob: assetSource.blob
          });
          uploaded.mimeType = uploaded.mimeType || assetSource.mimeType;
        }
        uploadedBySource.set(sourceKey, { uploaded, sourceStamp });
        changed = true;
        const nextItem = Object.assign({}, item, {
          driveFaviconFileId: uploaded.id || item.driveFaviconFileId || "",
          driveFaviconFileName: uploaded.name || fileName,
          driveFaviconMimeType: uploaded.mimeType || item.driveFaviconMimeType || "image/png",
          driveFaviconFolderId: faviconsFolder?.id || item.driveFaviconFolderId || "",
          driveFaviconSourceStamp: sourceStamp,
          driveFaviconUpdatedAt: uploaded.modifiedTime || new Date().toISOString()
        });
        nextItems.push(nextItem);
      }
      if (changed) nextStorage[itemKey] = nextItems;
    }
    uploadedBySource.forEach((record, source) => {
      const uploaded = record.uploaded || {};
      assets.push({
        source,
        fileId: uploaded.id || "",
        fileName: uploaded.name || "",
        mimeType: uploaded.mimeType || "image/png",
        folderId: faviconsFolder?.id || "",
        sourceStamp: record.sourceStamp || ""
      });
    });
    return {
      storage: nextStorage,
      faviconsFolderId: faviconsFolder?.id || faviconsFolderId || "",
      assets
    };
  }

  function imageAssetSource(item = {}) {
    const source = [item.dataUrl, item.imageUrl, item.thumbnailUrl].find((value) => String(value || "").startsWith("data:image/"));
    if (!source) return null;
    return {
      dataUrl: source,
      mimeType: dataUrlMimeType(source) || item.mimeType || "image/png"
    };
  }

  function imageAssetStamp(item = {}, dataUrl = "") {
    return [
      item.id || "",
      String(dataUrl).length,
      stableStringHash(dataUrl)
    ].join(":");
  }

  function imageAssetFileName(item = {}, mimeType = "image/png", sourceStamp = "") {
    const extension = mimeExtension(mimeType);
    const base = String(item.id || item.imageFileName || `image-${Date.now()}`)
      .replace(/[^a-z0-9_-]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || `image-${Date.now()}`;
    return `${base}-${stableStringHash(sourceStamp).slice(0, 12)}.${extension}`;
  }

  async function faviconAssetSource(url = "") {
    const value = String(url || "");
    if (value.startsWith("data:image/")) {
      const mimeType = dataUrlMimeType(value) || "image/png";
      return { blob: dataUrlToBlob(value, mimeType), mimeType };
    }
    if (!/^(https?:|chrome-extension:)/i.test(value)) return null;
    const response = await controlledDriveFetch(value);
    if (!response.ok) return null;
    const mimeType = response.headers.get("content-type") || "image/png";
    if (!String(mimeType).toLowerCase().includes("image")) return null;
    return { blob: await response.blob(), mimeType };
  }

  function faviconAssetStamp(item = {}, faviconUrl = "") {
    return [
      item.sourceDomain || item.sourceUrl || "",
      String(faviconUrl || "").length,
      stableStringHash(faviconUrl)
    ].join(":");
  }

  function faviconAssetFileName(sourceKey = "", faviconUrl = "", sourceStamp = "") {
    const extension = mimeExtension(dataUrlMimeType(faviconUrl) || "image/png");
    const base = String(sourceKey || faviconUrl || `favicon-${Date.now()}`)
      .replace(/^https?:\/\//i, "")
      .replace(/[^a-z0-9_-]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || `favicon-${Date.now()}`;
    return `${base}-${stableStringHash(sourceStamp).slice(0, 12)}.${extension}`;
  }

  function mimeExtension(mimeType = "") {
    const normalized = String(mimeType || "").toLowerCase();
    if (normalized.includes("jpeg") || normalized.includes("jpg")) return "jpg";
    if (normalized.includes("webp")) return "webp";
    if (normalized.includes("gif")) return "gif";
    if (normalized.includes("svg")) return "svg";
    if (normalized.includes("bmp")) return "bmp";
    return "png";
  }

  function dataUrlMimeType(dataUrl = "") {
    return /^data:([^;]+);/i.exec(String(dataUrl))?.[1] || "";
  }

  function dataUrlToBlob(dataUrl = "", fallbackMimeType = "image/png") {
    const [header, payload] = String(dataUrl).split(",");
    const mimeType = dataUrlMimeType(header) || fallbackMimeType || "image/png";
    const binary = atob(payload || "");
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: mimeType });
  }

  async function uploadDriveBinary(token, { fileId = "", folderId, name, mimeType, blob }) {
    const metadata = {
      name,
      mimeType
    };
    if (!fileId && folderId) metadata.parents = [folderId];
    const boundary = `mcp_media_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    const body = new Blob([
      `--${boundary}\r\n`,
      "Content-Type: application/json; charset=UTF-8\r\n\r\n",
      JSON.stringify(metadata),
      `\r\n--${boundary}\r\n`,
      `Content-Type: ${mimeType || "application/octet-stream"}\r\n\r\n`,
      blob,
      `\r\n--${boundary}--`
    ], { type: `multipart/related; boundary=${boundary}` });
    const endpoint = fileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(fileId)}?uploadType=multipart&fields=id,name,modifiedTime`
      : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime";
    return driveFetch(endpoint, {
      token,
      method: fileId ? "PATCH" : "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body
    }).then((uploaded) => {
      if (!fileId && uploaded?.id && activeDriveOperation) activeDriveOperation.createdRemoteFileIds.add(uploaded.id);
      return uploaded;
    }).catch((error) => {
      if (!fileId || !isDriveNotFoundError(error)) throw error;
      return uploadDriveBinary(token, { fileId: "", folderId, name, mimeType, blob });
    });
  }

  async function resolveDriveChildFolder(token, parentFolderId, currentFolderId = "", name) {
    if (currentFolderId) {
      const existing = await getDriveFileMeta(token, currentFolderId, "id,name,modifiedTime,mimeType,parents").catch((error) => {
        if (isDriveNotFoundError(error)) return null;
        throw error;
      });
      if (existing?.id && (!parentFolderId || !Array.isArray(existing.parents) || existing.parents.includes(parentFolderId))) return existing;
    }
    return ensureChildDriveFolder(token, parentFolderId, name);
  }

  async function findDriveBackup(token, meta = {}) {
    const settings = await global.MCP.getSettings();
    const workspace = await resolveDriveWorkspace(token, meta, settings);
    const file = await resolveExistingDriveManifestFile(token, workspace.folder.id, workspace.meta);
    let payload = file?.id ? await downloadDriveJson(token, file.id) : null;
    if (payload) payload = normalizeDrivePayloadForWorkspace(payload, workspace.identity);
    return { folder: workspace.folder, file: file || null, payload: isDriveBackupPayload(payload) ? payload : null };
  }

  async function collectDriveBackupCandidates(token, meta = {}, folder = null) {
    const candidates = [];
    const seen = new Set();
    const add = (file) => {
      if (!file?.id || seen.has(file.id)) return;
      seen.add(file.id);
      candidates.push(file);
    };
    if (meta.fileId) add(await getDriveFileMeta(token, meta.fileId, "id,name,modifiedTime,parents").catch((error) => {
      if (isDriveNotFoundError(error)) return null;
      throw error;
    }));
    if (folder?.id) add(await findDriveFileByName(token, folder.id, DRIVE_FILE_NAME));
    (await findDriveFilesByExactName(token, DRIVE_FILE_NAME)).forEach(add);
    (await findDriveBackupJsonCandidates(token)).forEach(add);
    return candidates
      .filter(Boolean)
      .sort((a, b) => Date.parse(b.modifiedTime || "") - Date.parse(a.modifiedTime || ""));
  }

  function isDriveBackupPayload(payload) {
    return Boolean(getDrivePayloadStorage(payload));
  }

  function getDrivePayloadStorage(payload) {
    const storage = payload?.storage || payload?.storageData || payload?.data;
    if (!storage || typeof storage !== "object" || Array.isArray(storage)) return null;
    return validateDrivePayloadStorage(storage);
  }

  function normalizeDrivePayloadForWorkspace(payload, identity) {
    global.MCP.DriveWorkspace.assertPayloadMatches(payload, identity);
    try {
      getDrivePayloadStorage(payload);
      return payload;
    } catch (error) {
      if (String(error?.message || error) !== "drive.invalidBackup") throw error;
      const expectedApp = global.MCP?.BACKUP_APP || "Ultimate Clipboard Pro";
      if (payload?.app !== expectedApp || Number(payload?.syncVersion || 0) !== 3) throw error;
      const rawStorage = payload?.storage || payload?.storageData || payload?.data;
      if (!rawStorage || typeof rawStorage !== "object" || Array.isArray(rawStorage)) throw error;
      const settingsKey = keys().SETTINGS;
      if (!settingsKey || !Object.prototype.hasOwnProperty.call(rawStorage, settingsKey)) throw error;
      const portableStorage = cleanStorageForDrive(rawStorage);
      validateDrivePayloadStorage(portableStorage);
      return Object.assign({}, payload, {
        storage: portableStorage,
        storageData: undefined,
        data: undefined
      });
    }
  }

  function invalidDriveBackup() {
    return new Error("drive.invalidBackup");
  }

  function validateDrivePayloadStorage(storage) {
    if (!storage || typeof storage !== "object" || Array.isArray(storage)) throw invalidDriveBackup();
    let serializedLength = 0;
    try {
      serializedLength = JSON.stringify(storage).length;
    } catch (error) {
      throw invalidDriveBackup();
    }
    if (serializedLength > 64 * 1024 * 1024) throw invalidDriveBackup();

    const storageKeys = keys();
    const allowedKeys = new Set(syncedStorageKeys.map((name) => storageKeys[name]).filter(Boolean));
    const sourceLocatorPrefix = storageKeys.SOURCE_LOCATOR_PREFIX || "mcp_source_locator_";
    const collectionKeys = new Set([
      storageKeys.ITEMS,
      storageKeys.CATEGORIES,
      storageKeys.DELETED_DEFAULT_CATEGORIES,
      storageKeys.IMAGE_ITEMS,
      storageKeys.IMAGE_CATEGORIES,
      storageKeys.DELETED_DEFAULT_IMAGE_CATEGORIES,
      storageKeys.DEV_ITEMS,
      storageKeys.DEV_CATEGORIES,
      storageKeys.SNIPPETS,
      storageKeys.TEMPLATES
    ].filter(Boolean));
    const nowLimit = Date.now() + 24 * 60 * 60 * 1000;
    const budget = { nodes: 0 };
    const validateNode = (value, key = "", depth = 0) => {
      budget.nodes += 1;
      if (budget.nodes > 500000 || depth > 16) throw invalidDriveBackup();
      if (typeof value === "string") {
        if (value.length > 12 * 1024 * 1024) throw invalidDriveBackup();
        if (/At$/.test(key)) {
          const timestamp = /^\d+$/.test(value) ? Number(value) : Date.parse(value);
          if (Number.isFinite(timestamp) && timestamp > nowLimit) throw invalidDriveBackup();
        }
        return;
      }
      if (typeof value === "number") {
        if (!Number.isFinite(value)) throw invalidDriveBackup();
        if (/At$/.test(key) && value > nowLimit) throw invalidDriveBackup();
        return;
      }
      if (value === null || typeof value === "boolean") return;
      if (Array.isArray(value)) {
        if (value.length > 100000) throw invalidDriveBackup();
        value.forEach((entry) => validateNode(entry, key, depth + 1));
        return;
      }
      if (!value || typeof value !== "object") throw invalidDriveBackup();
      const entries = Object.entries(value);
      if (entries.length > 100000) throw invalidDriveBackup();
      for (const [childKey, childValue] of entries) {
        if (["__proto__", "prototype", "constructor"].includes(childKey) || childKey.length > 512) throw invalidDriveBackup();
        validateNode(childValue, childKey, depth + 1);
      }
    };

    for (const [key, value] of Object.entries(storage)) {
      const isLocator = key.startsWith(sourceLocatorPrefix) && key.length > sourceLocatorPrefix.length && key.length <= sourceLocatorPrefix.length + 256;
      if (!allowedKeys.has(key) && !isLocator) throw invalidDriveBackup();
      if (collectionKeys.has(key) && !Array.isArray(value)) throw invalidDriveBackup();
      if (key === storageKeys.SETTINGS && (!value || typeof value !== "object" || Array.isArray(value))) throw invalidDriveBackup();
      if (isLocator && (!value || typeof value !== "object" || Array.isArray(value))) throw invalidDriveBackup();
      validateNode(value, key, 0);
    }

    const settingsClocks = storage[storageKeys.SETTINGS]?.settingsFieldUpdatedAt;
    if (settingsClocks !== undefined) {
      if (!settingsClocks || typeof settingsClocks !== "object" || Array.isArray(settingsClocks) || Object.keys(settingsClocks).length > 256) {
        throw invalidDriveBackup();
      }
      for (const [field, timestamp] of Object.entries(settingsClocks)) {
        if (!field || field.length > 128 || !Number.isFinite(Number(timestamp)) || Number(timestamp) < 0 || Number(timestamp) > nowLimit) {
          throw invalidDriveBackup();
        }
      }
    }

    const purgeMarkers = storage[storageKeys.PURGE_MARKERS];
    if (purgeMarkers !== undefined) {
      if (!purgeMarkers || typeof purgeMarkers !== "object" || Array.isArray(purgeMarkers)) throw invalidDriveBackup();
      for (const [listKey, timestamp] of Object.entries(purgeMarkers)) {
        if (!collectionKeys.has(listKey) || !Number.isFinite(Number(timestamp)) || Number(timestamp) > nowLimit) throw invalidDriveBackup();
      }
    }
    const tombstones = storage[storageKeys.DRIVE_TOMBSTONES];
    if (tombstones !== undefined) {
      if (!tombstones || typeof tombstones !== "object" || Array.isArray(tombstones)) throw invalidDriveBackup();
      for (const [listKey, entries] of Object.entries(tombstones)) {
        if (!collectionKeys.has(listKey) || !entries || typeof entries !== "object" || Array.isArray(entries)) throw invalidDriveBackup();
        if (Object.keys(entries).length > 5000) throw invalidDriveBackup();
        for (const [itemId, deletedAt] of Object.entries(entries)) {
          if (!itemId || itemId.length > 256 || !Number.isFinite(Number(deletedAt)) || Number(deletedAt) > nowLimit) throw invalidDriveBackup();
        }
      }
    }
    return storage;
  }

  async function getDriveFileMeta(token, fileId, fields = "id,name,modifiedTime,mimeType") {
    if (!fileId) return null;
    return driveFetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=${encodeURIComponent(fields)}`, { token });
  }

  async function findFolderByName(token, name, parentFolderId = "") {
    const escapedName = escapeDriveQuery(name);
    const parentClause = parentFolderId ? ` and '${parentFolderId}' in parents` : "";
    const query = encodeURIComponent(`name='${escapedName}' and mimeType='application/vnd.google-apps.folder' and trashed=false${parentClause}`);
    const list = await driveFetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc&spaces=drive`, { token });
    return list.files?.[0] || null;
  }

  async function findDriveFileByName(token, folderId, name) {
    const escapedName = escapeDriveQuery(name);
    const query = encodeURIComponent(`name='${escapedName}' and '${folderId}' in parents and trashed=false`);
    const list = await driveFetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,parents)&orderBy=modifiedTime desc&spaces=drive`, { token });
    return list.files?.[0] || null;
  }

  async function findDriveFilesByExactName(token, name) {
    const escapedName = escapeDriveQuery(name);
    const query = encodeURIComponent(`name='${escapedName}' and trashed=false`);
    const list = await driveFetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,parents)&orderBy=modifiedTime desc&spaces=drive`, { token });
    return Array.isArray(list?.files) ? list.files : [];
  }

  async function findDriveBackupJsonCandidates(token) {
    const query = encodeURIComponent("name contains 'Ultimate Clipboard Pro' and name contains '.json' and trashed=false");
    const list = await driveFetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,parents)&orderBy=modifiedTime desc&spaces=drive`, { token });
    return Array.isArray(list?.files) ? list.files : [];
  }

  async function downloadDriveJson(token, fileId) {
    const payload = await driveFetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`, { token });
    if (payload && typeof payload === "object") return payload;
    return JSON.parse(String(payload || "{}"));
  }

  async function uploadDriveJson(token, { fileId = "", folderId, payload }) {
    const metadata = {
      name: DRIVE_FILE_NAME,
      mimeType: "application/json"
    };
    if (!fileId && folderId) metadata.parents = [folderId];
    const boundary = `mcp_drive_${Date.now()}`;
    const body = [
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(metadata),
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(payload, null, 2),
      `--${boundary}--`
    ].join("\r\n");
    const endpoint = fileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(fileId)}?uploadType=multipart&fields=id,name,modifiedTime`
      : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime";
    return driveFetch(endpoint, {
      token,
      method: fileId ? "PATCH" : "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body
    }).catch((error) => {
      if (!fileId || !isDriveNotFoundError(error)) throw error;
      return uploadDriveJson(token, { fileId: "", folderId, payload });
    });
  }

  async function verifyUploadedDriveTransaction(token, fileId, transactionId) {
    if (!fileId || !transactionId) return false;
    const payload = await downloadDriveJson(token, fileId);
    return String(payload?.syncTransactionId || "") === String(transactionId);
  }

  async function rollbackDriveOperation(operation) {
    if (!operation) return;
    operation.state = "rolling-back";
    operation.phase = "rolling-back";
    broadcastDriveOperation(operation);
    broadcastDriveProgress("drive.cancellingRollback", Math.max(4, Math.min(96, operation.percent || 4)));
    if (!operation.disconnectRequested) await rollbackLocalDriveMutation(operation).catch(() => {});
    await rollbackRemoteDriveMutation(operation).catch(() => {});
    const previousMeta = operation.previousMeta || {};
    const rollbackMeta = operation.disconnectRequested ? {
      accountEmail: "",
      folderId: "",
      imagesFolderId: "",
      faviconsFolderId: "",
      fileId: "",
      remoteModifiedTime: "",
      remoteBackupAvailable: false,
      syncInitialized: false
    } : previousMeta;
    await saveMeta(Object.assign({}, rollbackMeta, {
      lastStatus: operation.disconnectRequested ? "disconnected" : "cancelled",
      lastError: "",
      cooldownUntil: operation.disconnectRequested ? null : previousMeta.cooldownUntil || null
    })).catch(() => {});
    operation.phase = "cancelled";
    broadcastDriveProgress("drive.cancelledDone", 100);
  }

  async function rollbackLocalDriveMutation(operation) {
    const rollback = operation?.localRollback;
    if (!rollback?.applied || !rollback.before || !rollback.written) return;
    global.MCP.driveSyncApplying = true;
    try {
      if (rollback.mode === "overwrite") {
        if (global.MCP?.restoreLocalStorageSnapshot) await global.MCP.restoreLocalStorageSnapshot(rollback.before);
        else await chrome.storage.local.set(rollback.before);
        return;
      }
      const writtenKeys = Object.keys(rollback.written);
      const current = await chrome.storage.local.get(writtenKeys);
      const restore = {};
      const remove = [];
      writtenKeys.forEach((key) => {
        if (!sameDriveValue(current[key], rollback.written[key])) return;
        if (Object.prototype.hasOwnProperty.call(rollback.before, key)) restore[key] = rollback.before[key];
        else remove.push(key);
      });
      if (Object.keys(restore).length) await chrome.storage.local.set(restore);
      if (remove.length) await chrome.storage.local.remove(remove);
    } finally {
      global.MCP.driveSyncApplying = false;
    }
  }

  async function rollbackRemoteDriveMutation(operation) {
    const token = operation?.token;
    const folderId = operation?.remoteManifestTarget?.folderId || operation?.remoteBefore?.folderId || "";
    if (!token || !folderId) return;
    let manifestId = operation.remoteManifestTarget?.fileId || operation.remoteBefore?.file?.id || "";
    if (!manifestId) {
      const candidate = await findDriveFileByNameUncontrolled(token, folderId, DRIVE_FILE_NAME).catch(() => null);
      manifestId = candidate?.id || "";
    }
    let manifestSafeToCleanAssets = true;
    if (manifestId) {
      const currentPayload = await downloadDriveJsonUncontrolled(token, manifestId).catch(() => null);
      if (currentPayload?.syncTransactionId === operation.id) {
        manifestSafeToCleanAssets = false;
        const previousPayload = operation.remoteBefore?.payload;
        const previousFileId = operation.remoteBefore?.file?.id || "";
        if (previousPayload && previousFileId) {
          await uploadDriveJsonUncontrolled(token, {
            fileId: previousFileId,
            folderId,
            payload: previousPayload
          });
          manifestSafeToCleanAssets = true;
        } else {
          await deleteDriveFileUncontrolled(token, manifestId);
          manifestSafeToCleanAssets = true;
        }
      }
    }
    if (!manifestSafeToCleanAssets) return;
    const protectedIds = new Set([
      operation.remoteBefore?.file?.id || "",
      manifestId
    ].filter(Boolean));
    for (const fileId of operation.createdRemoteFileIds || []) {
      if (!fileId || protectedIds.has(fileId)) continue;
      await deleteDriveFileUncontrolled(token, fileId).catch(() => {});
    }
  }

  function sameDriveValue(first, second) {
    if (first === second) return true;
    try {
      return JSON.stringify(first) === JSON.stringify(second);
    } catch (error) {
      return false;
    }
  }

  async function driveFetchUncontrolled(url, options = {}) {
    const safeUrl = assertGoogleApiUrl(url);
    const token = options.token || "";
    const requestOptions = Object.assign({}, options, {
      headers: Object.assign({}, options.headers || {}, token ? { Authorization: `Bearer ${token}` } : {})
    });
    delete requestOptions.token;
    const response = await driveFetchWithTimeout(safeUrl, requestOptions);
    if (!response.ok) throw new Error(`Drive API ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    const text = await readDriveResponseTextWithLimit(response, MAX_DRIVE_TEXT_RESPONSE_BYTES);
    if (contentType.includes("application/json")) return JSON.parse(text || "{}");
    return text;
  }

  async function findDriveFileByNameUncontrolled(token, folderId, name) {
    const escapedName = escapeDriveQuery(name);
    const query = encodeURIComponent(`name='${escapedName}' and '${folderId}' in parents and trashed=false`);
    const list = await driveFetchUncontrolled(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,parents)&orderBy=modifiedTime desc&spaces=drive`, { token });
    return list.files?.[0] || null;
  }

  async function downloadDriveJsonUncontrolled(token, fileId) {
    const payload = await driveFetchUncontrolled(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`, { token });
    if (payload && typeof payload === "object") return payload;
    return JSON.parse(String(payload || "{}"));
  }

  async function uploadDriveJsonUncontrolled(token, { fileId = "", folderId, payload }) {
    const metadata = { name: DRIVE_FILE_NAME, mimeType: "application/json" };
    if (!fileId && folderId) metadata.parents = [folderId];
    const boundary = `mcp_rollback_${Date.now()}`;
    const body = [
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(metadata),
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(payload, null, 2),
      `--${boundary}--`
    ].join("\r\n");
    const endpoint = fileId
      ? `https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(fileId)}?uploadType=multipart&fields=id,name,modifiedTime`
      : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,modifiedTime";
    return driveFetchUncontrolled(endpoint, {
      token,
      method: fileId ? "PATCH" : "POST",
      headers: { "Content-Type": `multipart/related; boundary=${boundary}` },
      body
    });
  }

  async function deleteDriveFileUncontrolled(token, fileId) {
    const response = await driveFetchWithTimeout(assertGoogleApiUrl(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok && response.status !== 404) throw new Error(`Drive API ${response.status}`);
  }

  function parseDriveApiError(text = "") {
    try {
      return JSON.parse(String(text || "{}"));
    } catch (error) {
      return null;
    }
  }

  function isDriveNotFoundError(error) {
    if (!error) return false;
    if (error.messageKey === "drive.remoteMissing" || error.status === 404) return true;
    const message = String(error.message || error || "");
    if (/\b404\b/i.test(message) || /notFound|File not found|not found/i.test(message)) return true;
    return false;
  }

  function normalizeDriveError(error) {
    if (!error) return "drive.authFailed";
    if (error.messageKey) return error.messageKey;
    if (isDriveNotFoundError(error)) return "drive.remoteMissing";
    const message = String(error.message || error || "");
    if (message === "drive.notConfigured" || message === "drive.disabled" || message === "drive.cooldown" || message === "drive.authFailed" || message === "drive.identityUnavailable" || message === "drive.proRequired" || message === "drive.cancelled" || message === "drive.operationBusy") {
      return message;
    }
    return message;
  }

  function createDrivePayload(storage, assets = {}) {
    const baseStorage = cleanStorageForDrive(storage || {});
    const cleanStorage = global.MCP?.stripVaultStorageForPortableBackup
      ? global.MCP.stripVaultStorageForPortableBackup(baseStorage)
      : baseStorage;
    const storageKeys = keys();
    if (cleanStorage[storageKeys.SETTINGS]) {
      cleanStorage[storageKeys.SETTINGS] = global.MCP?.normalizePortableBackupSettings
        ? global.MCP.normalizePortableBackupSettings(cleanStorage[storageKeys.SETTINGS])
        : global.MCP?.normalizeBackupSettings
          ? global.MCP.normalizeBackupSettings(Object.assign({}, cleanStorage[storageKeys.SETTINGS], {
            driveSyncEnabled: false,
            floatingPanelOpen: false,
            floatingPanelOpenedAt: 0,
            floatingPanelManualClosedAt: 0
          }))
        : Object.assign({}, global.MCP?.DEFAULT_SETTINGS || {}, cleanStorage[storageKeys.SETTINGS], { dodoEnv: "live" });
      delete cleanStorage[storageKeys.SETTINGS].searchOpenAsOverlay;
      delete cleanStorage[storageKeys.SETTINGS].searchIncludeNotes;
      delete cleanStorage[storageKeys.SETTINGS].searchIncludeSourceUrls;
      delete cleanStorage[storageKeys.SETTINGS].askCategoryAfterCopy;
      cleanStorage[storageKeys.SETTINGS] = sanitizeRemoteSettingsForMerge(cleanStorage[storageKeys.SETTINGS]);
    }
    validateDrivePayloadStorage(cleanStorage);
    const payload = {
      app: global.MCP?.BACKUP_APP || "Ultimate Clipboard Pro",
      version: global.MCP?.BACKUP_VERSION || 2,
      syncVersion: 2,
      exportedAt: Date.now(),
      mergeStrategy: "newest-by-id-with-tombstones",
      syncTransactionId: assets.transactionId || "",
      assets: {
        imagesFolderId: assets.imagesFolderId || "",
        images: Array.isArray(assets.imageAssets) ? assets.imageAssets : [],
        faviconsFolderId: assets.faviconsFolderId || "",
        favicons: Array.isArray(assets.faviconAssets) ? assets.faviconAssets : []
      },
      storage: cleanStorage,
      summary: global.MCP?.summarizeBackupStorage ? global.MCP.summarizeBackupStorage(cleanStorage) : {}
    };
    return global.MCP.DriveWorkspace.attachToPayload(payload, assets.workspaceIdentity, { writerId: assets.writerId });
  }

  async function checkDriveRemoteChanges(reason = "visible-surface") {
    const now = Date.now();
    if (remoteCheckPromise) return remoteCheckPromise;
    if (now - lastRemoteCheckStartedAt < DRIVE_REMOTE_CHECK_MIN_MS) return { skipped: true, reason: "throttled" };
    lastRemoteCheckStartedAt = now;
    remoteCheckPromise = (async () => {
      const [settings, meta] = await Promise.all([global.MCP.getSettings(), getMeta()]);
      if (!settings.driveSyncEnabled || !meta.folderId) return { skipped: true, reason: "not-ready" };
      if (localDeletionInProgress) {
        return { skipped: true, reason: "local-deletion", status: await getStatus() };
      }
      if (meta.pendingLocalChangeAt && meta.syncInitialized) return syncNow({ reason: `${reason}-local`, force: true });
      const token = await getAuthToken(false);
      const workspace = await resolveDriveWorkspace(token, meta, settings);
      const file = await resolveExistingDriveManifestFile(token, workspace.folder.id, workspace.meta);
      if (!meta.syncInitialized) {
        const nextMeta = await saveMeta({
          fileId: file?.id || "",
          remoteModifiedTime: file?.modifiedTime || "",
          remoteBackupAvailable: Boolean(file?.id),
          lastRemoteCheckAt: Date.now()
        });
        return { changed: false, initializationRequired: true, status: await getStatus(), meta: nextMeta };
      }
      const changed = Boolean(file?.id && (file.id !== meta.fileId || file.modifiedTime !== meta.remoteModifiedTime));
      await saveMeta({ lastRemoteCheckAt: Date.now() });
      if (changed) return syncNow({ reason: `${reason}-remote`, force: true });
      return { changed: false, status: await getStatus() };
    })().finally(() => { remoteCheckPromise = null; });
    return remoteCheckPromise;
  }

  async function prepareDeleteDriveWorkspaceBackup() {
    const settings = await global.MCP.getSettings();
    const meta = await getMeta();
    if (!meta.folderId || !meta.workspaceId) throw new Error("drive.workspaceUnavailable");
    const identity = await global.MCP.DriveWorkspace.createIdentity(settings);
    if (identity.id !== meta.workspaceId) throw new Error("drive.workspaceMismatch");
    deleteChallenge = { token: crypto.randomUUID(), workspaceId: identity.id, expiresAt: Date.now() + 120000 };
    return { challenge: deleteChallenge.token, expiresAt: deleteChallenge.expiresAt };
  }

  async function deleteDriveWorkspaceBackup(challenge = "") {
    const proof = deleteChallenge;
    deleteChallenge = null;
    if (!proof || proof.token !== challenge || proof.expiresAt < Date.now()) throw new Error("drive.deleteChallengeInvalid");
    const [settings, meta] = await Promise.all([global.MCP.getSettings(), getMeta()]);
    const identity = await global.MCP.DriveWorkspace.createIdentity(settings);
    if (identity.id !== proof.workspaceId || identity.id !== meta.workspaceId) throw new Error("drive.workspaceMismatch");
    const token = await getAuthToken(true);
    const folder = await getDriveFileMeta(token, meta.folderId, "id,name,parents,mimeType");
    if (folder.name !== identity.folderName || !folder.parents?.includes(meta.rootFolderId)) throw new Error("drive.workspaceMismatch");
    await driveFetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(folder.id)}`, { token, method: "DELETE" });
    const replacement = await ensureChildDriveFolder(token, meta.rootFolderId, identity.folderName);
    const nextMeta = await saveMeta({
      folderId: replacement.id, fileId: "", imagesFolderId: "", faviconsFolderId: "",
      remoteModifiedTime: "", remoteBackupAvailable: false, syncInitialized: false,
      pendingLocalChangeAt: null, localResetPending: null, lastSyncAt: null, lastStatus: "connected", lastError: ""
    });
    return { deleted: true, status: await getStatus(), meta: nextMeta };
  }

  function cleanStorageForDrive(storage) {
    const storageKeys = keys();
    const source = storage && typeof storage === "object" && !Array.isArray(storage) ? storage : {};
    const clean = {};
    syncedStorageKeys.forEach((name) => {
      const key = storageKeys[name];
      if (key && Object.prototype.hasOwnProperty.call(source, key)) clean[key] = source[key];
    });
    const sourceLocatorPrefix = storageKeys.SOURCE_LOCATOR_PREFIX || "mcp_source_locator_";
    Object.keys(source).forEach((key) => {
      const isPortableLocator = key.startsWith(sourceLocatorPrefix)
        && key.length > sourceLocatorPrefix.length
        && key.length <= sourceLocatorPrefix.length + 256;
      if (isPortableLocator) clean[key] = source[key];
    });
    return clean;
  }

  function mergeLocalPriorityStorage(localStorage = {}, remoteStorage = {}) {
    const storageKeys = keys();
    const merged = cleanStorageForDrive(localStorage);
    const remoteBase = cleanStorageForDrive(remoteStorage);
    const remote = global.MCP?.stripVaultStorageForPortableBackup
      ? global.MCP.stripVaultStorageForPortableBackup(remoteBase)
      : remoteBase;
    const purgeKey = storageKeys.PURGE_MARKERS || "mcp_purge_markers";
    const purgeMarkers = mergePurgeMarkers(merged[purgeKey], remote[purgeKey]);
    merged[purgeKey] = purgeMarkers;
    const tombstoneKey = storageKeys.DRIVE_TOMBSTONES || "mcp_drive_tombstones";
    const tombstones = mergeDriveTombstones(merged[tombstoneKey], remote[tombstoneKey]);
    merged[tombstoneKey] = tombstones;
    const settingsKey = storageKeys.SETTINGS;
    if (remote[settingsKey]) {
      merged[settingsKey] = mergeSettings(sanitizeRemoteSettingsForMerge(remote[settingsKey]), merged[settingsKey]);
    } else if (merged[settingsKey]) {
      merged[settingsKey] = mergeSettings({}, merged[settingsKey]);
    }
    merged[settingsKey] = preserveConnectedDriveSettings(merged[settingsKey], localStorage[settingsKey]);
    mergeTimestampedPortableValue(merged, remote, storageKeys.MANAGER_VIEW_STATE, "savedAt");
    mergeTimestampedPortableValue(merged, remote, storageKeys.PREMIUM_CURRENCY, "updatedAt");
    [
      storageKeys.CATEGORIES,
      storageKeys.IMAGE_CATEGORIES,
      storageKeys.DEV_CATEGORIES,
      storageKeys.SNIPPETS,
      storageKeys.TEMPLATES
    ].forEach((key) => {
      merged[key] = mergeArrayById(
        filterItemsAfterTombstones(merged[key], tombstones[key]),
        filterItemsAfterTombstones(remote[key], tombstones[key])
      );
    });
    merged[storageKeys.ITEMS] = mergeItemArray(
      filterItemsAfterTombstones(merged[storageKeys.ITEMS], tombstones[storageKeys.ITEMS]),
      filterItemsAfterTombstones(filterRemoteItemsAfterPurge(remote[storageKeys.ITEMS], purgeMarkers[storageKeys.ITEMS]), tombstones[storageKeys.ITEMS])
    );
    merged[storageKeys.DEV_ITEMS] = mergeItemArray(
      filterItemsAfterTombstones(merged[storageKeys.DEV_ITEMS], tombstones[storageKeys.DEV_ITEMS]),
      filterItemsAfterTombstones(filterRemoteItemsAfterPurge(remote[storageKeys.DEV_ITEMS], purgeMarkers[storageKeys.DEV_ITEMS]), tombstones[storageKeys.DEV_ITEMS])
    );
    merged[storageKeys.IMAGE_ITEMS] = mergeItemArray(
      filterItemsAfterTombstones(merged[storageKeys.IMAGE_ITEMS], tombstones[storageKeys.IMAGE_ITEMS]),
      filterItemsAfterTombstones(filterRemoteItemsAfterPurge(remote[storageKeys.IMAGE_ITEMS], purgeMarkers[storageKeys.IMAGE_ITEMS]), tombstones[storageKeys.IMAGE_ITEMS])
    );
    [
      storageKeys.DELETED_DEFAULT_CATEGORIES,
      storageKeys.DELETED_DEFAULT_IMAGE_CATEGORIES
    ].forEach((key) => {
      merged[key] = mergePrimitiveArray(merged[key], remote[key]);
    });
    const sourceLocatorPrefix = storageKeys.SOURCE_LOCATOR_PREFIX || "mcp_source_locator_";
    Object.keys(remote).filter((key) => key.startsWith(sourceLocatorPrefix)).forEach((key) => {
      const localLocator = merged[key];
      const remoteLocator = remote[key];
      if (!localLocator || Number(remoteLocator?.capturedAt || 0) > Number(localLocator?.capturedAt || 0)) {
        merged[key] = remoteLocator;
      }
    });
    const sourceItemIds = new Set([
      ...(Array.isArray(merged[storageKeys.ITEMS]) ? merged[storageKeys.ITEMS] : []),
      ...(Array.isArray(merged[storageKeys.IMAGE_ITEMS]) ? merged[storageKeys.IMAGE_ITEMS] : [])
    ].map((item) => String(item?.id || "")).filter(Boolean));
    Object.keys(merged)
      .filter((key) => key.startsWith(sourceLocatorPrefix))
      .forEach((key) => {
        const itemId = key.slice(sourceLocatorPrefix.length);
        if (!sourceItemIds.has(itemId)) delete merged[key];
      });
    return merged;
  }

  function mergeTimestampedPortableValue(localTarget, remoteSource, key, timestampKey) {
    if (!key || !Object.prototype.hasOwnProperty.call(remoteSource, key)) return;
    const localValue = localTarget[key];
    const remoteValue = remoteSource[key];
    const localAt = Number(localValue?.[timestampKey]) || 0;
    const remoteAt = Number(remoteValue?.[timestampKey]) || 0;
    if (remoteAt > localAt || localValue === undefined) localTarget[key] = remoteValue;
  }

  function preserveConnectedDriveSettings(storageOrSettings = {}, localSettings = {}) {
    const storageKeys = keys();
    const hasSettingsStorage = Boolean(storageKeys.SETTINGS && storageOrSettings && Object.prototype.hasOwnProperty.call(storageOrSettings, storageKeys.SETTINGS));
    const settings = hasSettingsStorage ? storageOrSettings[storageKeys.SETTINGS] : storageOrSettings;
    const local = localSettings && typeof localSettings === "object" ? localSettings : {};
    if (!local.driveSyncEnabled) return storageOrSettings;
    const nextSettings = Object.assign({}, settings || {}, {
      driveSyncEnabled: true,
      driveSyncFrequency: normalizeFrequency(settings?.driveSyncFrequency || local.driveSyncFrequency)
    });
    if (!hasSettingsStorage) return nextSettings;
    return Object.assign({}, storageOrSettings, { [storageKeys.SETTINGS]: nextSettings });
  }

  function summarizeRemoteImports(localStorage = {}, remoteStorage = {}) {
    const storageKeys = keys();
    const purgeKey = storageKeys.PURGE_MARKERS || "mcp_purge_markers";
    const purgeMarkers = mergePurgeMarkers(localStorage[purgeKey], remoteStorage[purgeKey]);
    const tombstoneKey = storageKeys.DRIVE_TOMBSTONES || "mcp_drive_tombstones";
    const tombstones = mergeDriveTombstones(localStorage[tombstoneKey], remoteStorage[tombstoneKey]);
    const summary = {
      textItems: countRemoteOnlyItems(filterItemsAfterTombstones(localStorage[storageKeys.ITEMS], tombstones[storageKeys.ITEMS]), filterItemsAfterTombstones(filterRemoteItemsAfterPurge(remoteStorage[storageKeys.ITEMS], purgeMarkers[storageKeys.ITEMS]), tombstones[storageKeys.ITEMS]), textItemSignature),
      devItems: countRemoteOnlyItems(filterItemsAfterTombstones(localStorage[storageKeys.DEV_ITEMS], tombstones[storageKeys.DEV_ITEMS]), filterItemsAfterTombstones(filterRemoteItemsAfterPurge(remoteStorage[storageKeys.DEV_ITEMS], purgeMarkers[storageKeys.DEV_ITEMS]), tombstones[storageKeys.DEV_ITEMS]), devItemSignature),
      imageItems: countRemoteOnlyItems(filterItemsAfterTombstones(localStorage[storageKeys.IMAGE_ITEMS], tombstones[storageKeys.IMAGE_ITEMS]), filterItemsAfterTombstones(filterRemoteItemsAfterPurge(remoteStorage[storageKeys.IMAGE_ITEMS], purgeMarkers[storageKeys.IMAGE_ITEMS]), tombstones[storageKeys.IMAGE_ITEMS]), imageItemSignature),
      textCategories: countRemoteOnlyById(filterItemsAfterTombstones(localStorage[storageKeys.CATEGORIES], tombstones[storageKeys.CATEGORIES]), filterItemsAfterTombstones(remoteStorage[storageKeys.CATEGORIES], tombstones[storageKeys.CATEGORIES])),
      devCategories: countRemoteOnlyById(filterItemsAfterTombstones(localStorage[storageKeys.DEV_CATEGORIES], tombstones[storageKeys.DEV_CATEGORIES]), filterItemsAfterTombstones(remoteStorage[storageKeys.DEV_CATEGORIES], tombstones[storageKeys.DEV_CATEGORIES])),
      imageCategories: countRemoteOnlyById(filterItemsAfterTombstones(localStorage[storageKeys.IMAGE_CATEGORIES], tombstones[storageKeys.IMAGE_CATEGORIES]), filterItemsAfterTombstones(remoteStorage[storageKeys.IMAGE_CATEGORIES], tombstones[storageKeys.IMAGE_CATEGORIES])),
      snippets: countRemoteOnlyById(filterItemsAfterTombstones(localStorage[storageKeys.SNIPPETS], tombstones[storageKeys.SNIPPETS]), filterItemsAfterTombstones(remoteStorage[storageKeys.SNIPPETS], tombstones[storageKeys.SNIPPETS])),
      templates: countRemoteOnlyById(filterItemsAfterTombstones(localStorage[storageKeys.TEMPLATES], tombstones[storageKeys.TEMPLATES]), filterItemsAfterTombstones(remoteStorage[storageKeys.TEMPLATES], tombstones[storageKeys.TEMPLATES]))
    };
    summary.total = Object.values(summary).reduce((total, value) => total + Number(value || 0), 0);
    return summary;
  }

  function createDriveRestoreAnalysis(localStorage = {}, remotePayload = null, backup = {}) {
    const remoteStorage = getDrivePayloadStorage(remotePayload) || {};
    const storageKeys = keys();
    const tombstoneKey = storageKeys.DRIVE_TOMBSTONES || "mcp_drive_tombstones";
    const tombstones = mergeDriveTombstones(localStorage[tombstoneKey], remoteStorage[tombstoneKey]);
    const localForDecision = applyDriveTombstonesToStorage(localStorage, tombstones);
    const remoteForDecision = applyDriveTombstonesToStorage(remoteStorage, tombstones);
    const localSummary = summarizeStorageForDecision(localForDecision);
    const driveSummary = summarizeStorageForDecision(remoteForDecision, remotePayload);
    const deltas = {
      textItems: driveSummary.textItems - localSummary.textItems,
      devItems: driveSummary.devItems - localSummary.devItems,
      imageItems: driveSummary.imageItems - localSummary.imageItems,
      totalItems: driveSummary.totalItems - localSummary.totalItems,
      categories: driveSummary.categories - localSummary.categories
    };
    const hasBackup = Boolean(getDrivePayloadStorage(remotePayload));
    const driveNewer = Boolean(driveSummary.latestAt && (!localSummary.latestAt || driveSummary.latestAt > localSummary.latestAt));
    const localNewer = Boolean(localSummary.latestAt && (!driveSummary.latestAt || localSummary.latestAt > driveSummary.latestAt));
    let recommendation = "neutral";
    if (hasBackup && driveSummary.totalItems > localSummary.totalItems && driveNewer) recommendation = "drive-strong";
    else if (hasBackup && driveSummary.totalItems >= localSummary.totalItems) recommendation = "drive-ok";
    else if (hasBackup && localSummary.totalItems > driveSummary.totalItems && localNewer) recommendation = "local-caution";
    else if (!hasBackup) recommendation = "no-backup";
    return {
      hasBackup,
      backupFileName: backup.file?.name || DRIVE_FILE_NAME,
      backupModifiedTime: backup.file?.modifiedTime || "",
      backupExportedAt: remotePayload?.exportedAt || null,
      local: localSummary,
      drive: driveSummary,
      deltas,
      recommendation,
      importSummary: summarizeRemoteImports(localStorage, remoteStorage),
      imageAssetCount: Array.isArray(remotePayload?.assets?.images) ? remotePayload.assets.images.length : 0,
      faviconAssetCount: Array.isArray(remotePayload?.assets?.favicons) ? remotePayload.assets.favicons.length : 0
    };
  }

  function summarizeStorageForDecision(storage = {}, payload = null) {
    const summary = global.MCP?.summarizeBackupStorage ? global.MCP.summarizeBackupStorage(storage) : {};
    const storageKeys = keys();
    const textItems = Array.isArray(storage[storageKeys.ITEMS]) ? storage[storageKeys.ITEMS] : [];
    const devItems = Array.isArray(storage[storageKeys.DEV_ITEMS]) ? storage[storageKeys.DEV_ITEMS] : [];
    const imageItems = Array.isArray(storage[storageKeys.IMAGE_ITEMS]) ? storage[storageKeys.IMAGE_ITEMS] : [];
    const latestAt = latestStorageItemDate([textItems, devItems, imageItems]);
    return Object.assign({}, summary, {
      totalItems: (summary.textItems || 0) + (summary.devItems || 0) + (summary.imageItems || 0),
      categories: (summary.textCategories || 0) + (summary.devCategories || 0) + (summary.imageCategories || 0),
      latestAt,
      exportedAt: payload?.exportedAt || null,
      imageAssetCount: Array.isArray(payload?.assets?.images) ? payload.assets.images.length : 0,
      faviconAssetCount: Array.isArray(payload?.assets?.favicons) ? payload.assets.favicons.length : 0
    });
  }

  function latestStorageItemDate(lists = []) {
    return lists.flat().reduce((latest, item) => {
      const value = Date.parse(item?.updatedAt || item?.createdAt || item?.capturedAt || "");
      return Number.isFinite(value) && value > latest ? value : latest;
    }, 0) || null;
  }

  function prepareDriveOverwriteStorage(localStorage = {}, remoteStorage = {}) {
    const storageKeys = keys();
    const cleanRemote = applyDriveTombstonesToStorage(cleanStorageForDrive(remoteStorage));
    const next = global.MCP?.stripVaultStorageForPortableBackup
      ? global.MCP.stripVaultStorageForPortableBackup(cleanRemote)
      : cleanRemote;
    const localSettings = localStorage[storageKeys.SETTINGS] || {};
    next[storageKeys.SETTINGS] = normalizeRestoredDriveSettings(next[storageKeys.SETTINGS], localSettings);
    return global.MCP?.preserveLocalLicenseStateForRestore
      ? global.MCP.preserveLocalLicenseStateForRestore(next, localStorage)
      : next;
  }

  function applyDriveTombstonesToStorage(storage = {}, tombstonesOverride = null) {
    const storageKeys = keys();
    const tombstoneKey = storageKeys.DRIVE_TOMBSTONES || "mcp_drive_tombstones";
    const tombstones = tombstonesOverride || mergeDriveTombstones(storage[tombstoneKey], {});
    const next = Object.assign({}, storage || {}, { [tombstoneKey]: tombstones });
    [
      storageKeys.ITEMS,
      storageKeys.DEV_ITEMS,
      storageKeys.IMAGE_ITEMS,
      storageKeys.CATEGORIES,
      storageKeys.IMAGE_CATEGORIES,
      storageKeys.DEV_CATEGORIES,
      storageKeys.SNIPPETS,
      storageKeys.TEMPLATES
    ].filter(Boolean).forEach((itemKey) => {
      next[itemKey] = filterItemsAfterTombstones(next[itemKey], tombstones[itemKey]);
    });
    return next;
  }

  async function hydrateDrivePayloadAssets(token, payload = null, remoteStorage = {}) {
    if (!payload || !remoteStorage || typeof remoteStorage !== "object" || Array.isArray(remoteStorage)) return remoteStorage || {};
    const storageKeys = keys();
    const imageAssets = new Map((Array.isArray(payload.assets?.images) ? payload.assets.images : [])
      .filter((asset) => asset?.itemId && asset?.fileId)
      .map((asset) => [String(asset.itemId), asset]));
    const faviconAssets = new Map((Array.isArray(payload.assets?.favicons) ? payload.assets.favicons : [])
      .filter((asset) => asset?.source && asset?.fileId)
      .map((asset) => [String(asset.source), asset]));
    if (!imageAssets.size && !faviconAssets.size) return remoteStorage;
    const nextStorage = Object.assign({}, remoteStorage);
    const itemKeys = [storageKeys.ITEMS, storageKeys.DEV_ITEMS, storageKeys.IMAGE_ITEMS].filter(Boolean);
    for (const itemKey of itemKeys) {
      const items = Array.isArray(nextStorage[itemKey]) ? nextStorage[itemKey] : [];
      if (!items.length) continue;
      const isImageList = itemKey === storageKeys.IMAGE_ITEMS;
      const hydratedItems = [];
      let changed = false;
      for (const item of items) {
        const hydrated = await hydrateDriveItemAssets(token, item, { isImageList, imageAssets, faviconAssets });
        if (hydrated !== item) changed = true;
        hydratedItems.push(hydrated);
      }
      if (changed) nextStorage[itemKey] = hydratedItems;
    }
    return nextStorage;
  }

  async function hydrateDriveItemAssets(token, item = {}, { isImageList = false, imageAssets = new Map(), faviconAssets = new Map() } = {}) {
    if (!item || typeof item !== "object" || Array.isArray(item) || global.MCP?.isVaultItem?.(item)) return item;
    let next = item;
    if (isImageList && !imageAssetSource(item)) {
      const imageAsset = imageAssets.get(String(item.id || "")) || (item.driveImageFileId ? { fileId: item.driveImageFileId, mimeType: item.driveImageMimeType } : null);
      const imageDataUrl = imageAsset?.fileId ? await downloadDriveAssetAsDataUrl(token, imageAsset.fileId, imageAsset.mimeType || item.driveImageMimeType || "image/png").catch(() => "") : "";
      if (imageDataUrl) {
        next = Object.assign({}, next, {
          dataUrl: imageDataUrl,
          imageUrl: imageDataUrl,
          thumbnailUrl: imageDataUrl,
          mimeType: dataUrlMimeType(imageDataUrl) || next.mimeType || "image/png"
        });
      }
    }
    const faviconSource = next.sourceDomain || next.sourceUrl || next.sourceFaviconUrl || "";
    const faviconAsset = faviconAssets.get(String(faviconSource)) || (next.driveFaviconFileId ? { fileId: next.driveFaviconFileId, mimeType: next.driveFaviconMimeType } : null);
    if (faviconAsset?.fileId && !String(next.sourceFaviconUrl || "").startsWith("data:image/")) {
      const faviconDataUrl = await downloadDriveAssetAsDataUrl(token, faviconAsset.fileId, faviconAsset.mimeType || next.driveFaviconMimeType || "image/png").catch(() => "");
      if (faviconDataUrl) next = Object.assign({}, next, { sourceFaviconUrl: faviconDataUrl });
    }
    return next;
  }

  async function downloadDriveAssetAsDataUrl(token, fileId, fallbackMimeType = "application/octet-stream") {
    const { bytes, mimeType } = await driveFetchBinary(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`, {
      token,
      fallbackMimeType
    });
    return bytesToDataUrl(bytes, mimeType || fallbackMimeType);
  }

  async function driveFetchBinary(url, options = {}) {
    const safeUrl = assertGoogleApiUrl(url);
    const token = options.token || await getAuthToken(false);
    const response = await driveFetchWithTimeout(safeUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const text = await readDriveResponseTextWithLimit(response, MAX_DRIVE_ERROR_RESPONSE_BYTES).catch(() => "");
      throw new Error(text || `Drive API ${response.status}`);
    }
    const mimeType = response.headers.get("content-type") || options.fallbackMimeType || "application/octet-stream";
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_DRIVE_BINARY_ASSET_BYTES) throw new Error("drive.responseTooLarge");
    const bytes = await readDriveResponseBytesWithLimit(response, MAX_DRIVE_BINARY_ASSET_BYTES);
    return { bytes, mimeType };
  }

  function assertGoogleApiUrl(value) {
    let parsed;
    try {
      parsed = new URL(String(value || ""));
    } catch (error) {
      throw new Error("drive.invalidEndpoint");
    }
    if (parsed.protocol !== "https:" || parsed.origin !== "https://www.googleapis.com") {
      throw new Error("drive.invalidEndpoint");
    }
    return parsed.href;
  }

  function bytesToDataUrl(bytes, mimeType = "application/octet-stream") {
    let binary = "";
    const chunkSize = 0x8000;
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return `data:${mimeType || "application/octet-stream"};base64,${btoa(binary)}`;
  }

  function normalizeRestoredDriveSettings(remoteSettings = {}, localSettings = {}) {
    const restored = mergeSettings(sanitizeRemoteSettingsForMerge(remoteSettings), {});
    return Object.assign({}, restored, {
      driveSyncEnabled: true,
      driveSyncFrequency: normalizeFrequency(restored.driveSyncFrequency || localSettings.driveSyncFrequency)
    });
  }

  function sanitizeRemoteSettingsForMerge(settings = {}) {
    if (global.MCP?.stripPortableSettingsFromRemote) return global.MCP.stripPortableSettingsFromRemote(settings);
    const next = Object.assign({}, settings || {});
    [
      "searchOpenAsOverlay",
      "searchIncludeNotes",
      "searchIncludeSourceUrls",
      "askCategoryAfterCopy",
      "driveSyncEnabled",
      "floatingPanelOpen",
      "floatingPanelOpenedAt",
      "floatingPanelManualClosedAt",
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
    ].forEach((key) => {
      delete next[key];
    });
    return next;
  }

  function countRemoteOnlyById(localList, remoteList) {
    const localIds = new Set((Array.isArray(localList) ? localList : [])
      .map((item) => item?.id)
      .filter(Boolean));
    return (Array.isArray(remoteList) ? remoteList : [])
      .filter((item) => item?.id && !localIds.has(item.id))
      .length;
  }

  function mergeSettings(remoteSettings = {}, localSettings = {}) {
    const remote = remoteSettings && typeof remoteSettings === "object" ? remoteSettings : {};
    const local = localSettings && typeof localSettings === "object" ? localSettings : {};
    const remoteUpdatedAt = Number(remote.settingsUpdatedAt) || 0;
    const localUpdatedAt = Number(local.settingsUpdatedAt) || 0;
    const localIsNewer = localUpdatedAt >= remoteUpdatedAt;
    const primary = localIsNewer ? local : remote;
    const secondary = localIsNewer ? remote : local;
    const merged = Object.assign({}, secondary, primary);
    const remoteClocks = remote.settingsFieldUpdatedAt || {};
    const localClocks = local.settingsFieldUpdatedAt || {};
    const mergedClocks = Object.assign({}, remoteClocks, localClocks);
    const fieldNames = new Set([...Object.keys(remote), ...Object.keys(local)]);
    fieldNames.delete("settingsUpdatedAt");
    fieldNames.delete("settingsFieldUpdatedAt");
    fieldNames.forEach((key) => {
      const remoteAt = Number(remoteClocks[key]) || remoteUpdatedAt;
      const localAt = Number(localClocks[key]) || localUpdatedAt;
      if (remoteAt > localAt) merged[key] = remote[key];
      else if (Object.prototype.hasOwnProperty.call(local, key)) merged[key] = local[key];
      mergedClocks[key] = Math.max(remoteAt, localAt);
    });
    merged.settingsUpdatedAt = Math.max(remoteUpdatedAt, localUpdatedAt);
    merged.settingsFieldUpdatedAt = mergedClocks;
    merged.toolStates = Object.assign({}, secondary.toolStates || {}, primary.toolStates || {});
    if (!Array.isArray(primary.toolOrder) || !primary.toolOrder.length) merged.toolOrder = secondary.toolOrder || [];
    if (global.MCP?.normalizeBackupSettings) return global.MCP.normalizeBackupSettings(merged);
    const normalized = Object.assign({}, global.MCP?.DEFAULT_SETTINGS || {}, merged, { dodoEnv: "live" });
    delete normalized.searchOpenAsOverlay;
    delete normalized.searchIncludeNotes;
    delete normalized.searchIncludeSourceUrls;
    delete normalized.askCategoryAfterCopy;
    return normalized;
  }

  function mergeArrayById(localList, remoteList) {
    const result = [];
    const indexes = new Map();
    (Array.isArray(localList) ? localList : []).forEach((item) => {
      if (!item?.id) return;
      indexes.set(item.id, result.length);
      result.push(item);
    });
    (Array.isArray(remoteList) ? remoteList : []).forEach((item) => {
      if (!item?.id) return;
      if (indexes.has(item.id)) {
        const index = indexes.get(item.id);
        if (shouldReplaceByTimestampAndTieBreak(result[index], item)) result[index] = item;
        return;
      }
      indexes.set(item.id, result.length);
      result.push(item);
    });
    return result;
  }

  function mergeItemArray(localList, remoteList) {
    const result = [];
    const idIndexes = new Map();
    const remember = (item, index) => {
      idIndexes.set(item.id, index);
    };
    const replace = (index, item) => {
      const previous = result[index];
      if (previous?.id && idIndexes.get(previous.id) === index) idIndexes.delete(previous.id);
      result[index] = item;
      remember(item, index);
    };
    const add = (item) => {
      if (!item?.id) return;
      if (idIndexes.has(item.id)) {
        const index = idIndexes.get(item.id);
        if (shouldReplaceMergedItem(result[index], item)) replace(index, item);
        return;
      }
      const index = result.length;
      result.push(item);
      remember(item, index);
    };
    (Array.isArray(localList) ? localList : []).forEach(add);
    (Array.isArray(remoteList) ? remoteList : []).forEach(add);
    return result;
  }

  function shouldReplaceMergedItem(existing = {}, incoming = {}) {
    const existingTrashedAt = timestampValue(existing.trashedAt);
    const incomingTrashedAt = timestampValue(incoming.trashedAt);
    if (existingTrashedAt && !incomingTrashedAt) {
      return timestampValue(incoming.restoredAt) > existingTrashedAt;
    }
    if (incomingTrashedAt && !existingTrashedAt) {
      return timestampValue(existing.restoredAt) <= incomingTrashedAt;
    }
    return shouldReplaceByTimestampAndTieBreak(existing, incoming);
  }

  function shouldReplaceByTimestampAndTieBreak(existing = {}, incoming = {}) {
    const existingTimestamp = latestItemTimestamp(existing);
    const incomingTimestamp = latestItemTimestamp(incoming);
    if (incomingTimestamp !== existingTimestamp) return incomingTimestamp > existingTimestamp;
    // Equal wall-clock timestamps can occur on different offline devices. A
    // canonical tie-break makes the merge commutative, so every reconnection
    // order converges to the same value instead of preserving local priority.
    return stableMergeTieKey(incoming) > stableMergeTieKey(existing);
  }

  function stableMergeTieKey(value, depth = 0) {
    if (depth > 32) return '"[depth-limit]"';
    if (value === null || typeof value !== "object") return JSON.stringify(value) || "";
    if (Array.isArray(value)) return `[${value.map((entry) => stableMergeTieKey(entry, depth + 1)).join(",")}]`;
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableMergeTieKey(value[key], depth + 1)}`).join(",")}}`;
  }

  function mergePurgeMarkers(localMarkers = {}, remoteMarkers = {}) {
    const merged = {};
    [remoteMarkers, localMarkers].forEach((source) => {
      if (!source || typeof source !== "object" || Array.isArray(source)) return;
      Object.entries(source).forEach(([key, value]) => {
        const timestamp = Number(value) || 0;
        if (timestamp > (Number(merged[key]) || 0)) merged[key] = timestamp;
      });
    });
    return merged;
  }

  function mergeDriveTombstones(localTombstones = {}, remoteTombstones = {}) {
    const merged = {};
    [remoteTombstones, localTombstones].forEach((source) => {
      if (!source || typeof source !== "object" || Array.isArray(source)) return;
      Object.entries(source).forEach(([listKey, entries]) => {
        if (!entries || typeof entries !== "object" || Array.isArray(entries)) return;
        const target = merged[listKey] || (merged[listKey] = {});
        Object.entries(entries).forEach(([itemId, deletedAt]) => {
          const timestamp = Number(deletedAt) || 0;
          if (itemId && timestamp > (Number(target[itemId]) || 0)) target[itemId] = timestamp;
        });
      });
    });
    Object.keys(merged).forEach((listKey) => {
      const newest = Object.entries(merged[listKey])
        .sort((left, right) => Number(right[1]) - Number(left[1]))
        .slice(0, 5000);
      merged[listKey] = Object.fromEntries(newest);
    });
    return merged;
  }

  function filterItemsAfterTombstones(items, tombstones = {}) {
    const list = Array.isArray(items) ? items : [];
    if (!tombstones || typeof tombstones !== "object") return list;
    return list.filter((item) => {
      const deletedAt = Number(tombstones[item?.id]) || 0;
      return !deletedAt || latestItemTimestamp(item) > deletedAt;
    });
  }

  function filterRemoteItemsAfterPurge(remoteList, purgeAt = 0) {
    const list = Array.isArray(remoteList) ? remoteList : [];
    const cutoff = Number(purgeAt) || 0;
    if (!cutoff) return list;
    return list.filter((item) => latestItemTimestamp(item) > cutoff);
  }

  function latestItemTimestamp(item = {}) {
    const embeddedVersionTimestamp = Array.isArray(item.captureVersions)
      ? item.captureVersions.reduce((latest, version) => Math.max(
        latest,
        timestampValue(version?.createdAt),
        timestampValue(version?.updatedAt),
        timestampValue(version?.savedAt),
        timestampValue(version?.capturedAt)
      ), 0)
      : 0;
    return Math.max(
      timestampValue(item.createdAt),
      timestampValue(item.updatedAt),
      timestampValue(item.lastCopiedAt),
      timestampValue(item.trashedAt),
      timestampValue(item.restoredAt),
      timestampValue(item.capturedAt),
      timestampValue(item.savedAt),
      embeddedVersionTimestamp
    );
  }

  function captureOriginTimestamp(item = {}) {
    return Math.max(
      timestampValue(item.createdAt),
      timestampValue(item.capturedAt),
      timestampValue(item.savedAt),
      timestampValue(item.captureVersions?.[0]?.createdAt)
    ) || latestItemTimestamp(item);
  }

  function timestampValue(value) {
    const numeric = Number(value);
    if (Number.isFinite(numeric) && numeric > 0) return numeric;
    const parsed = Date.parse(String(value || ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function countRemoteOnlyItems(localList, remoteList, signatureFn) {
    const localIds = new Set();
    const localSignatures = new Set();
    (Array.isArray(localList) ? localList : []).forEach((item) => {
      if (item?.id) localIds.add(item.id);
      const signature = signatureFn(item);
      if (signature) localSignatures.add(signature);
    });
    return (Array.isArray(remoteList) ? remoteList : []).filter((item) => {
      if (!item?.id || localIds.has(item.id)) return false;
      const signature = signatureFn(item);
      return !signature || !localSignatures.has(signature);
    }).length;
  }

  function textItemSignature(item = {}) {
    if (Array.isArray(item.captureVersions) && item.captureVersions.length > 1) return embeddedVersionedItemSignature(item, "text");
    if (item.versionGroupId) return versionedItemSignature(item, "text");
    return normalizedContentSignature(item.text || item.content || item.value || "");
  }

  function devItemSignature(item = {}) {
    if (Array.isArray(item.captureVersions) && item.captureVersions.length > 1) return embeddedVersionedItemSignature(item, "dev");
    if (item.versionGroupId) return versionedItemSignature(item, "dev");
    return `${String(item.language || item.categoryId || "").toLowerCase()}::${normalizedContentSignature(item.code || item.text || item.content || "")}`;
  }

  function imageItemSignature(item = {}) {
    const source = item.dataUrl || item.imageUrl || item.thumbnailUrl || item.src || "";
    const normalized = normalizedContentSignature(source);
    return normalized ? `image::${normalized.length}::${stableStringHash(normalized)}` : "";
  }

  function stableStringHash(value = "") {
    let first = 0x811c9dc5;
    let second = 0x9e3779b9;
    const text = String(value || "");
    for (let index = 0; index < text.length; index += 1) {
      const code = text.charCodeAt(index);
      first = Math.imul(first ^ code, 0x01000193) >>> 0;
      second = Math.imul(second ^ (code + index), 0x85ebca6b) >>> 0;
    }
    return `${first.toString(36)}-${second.toString(36)}`;
  }

  function normalizedContentSignature(value = "") {
    return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function versionedItemSignature(item = {}, mediaType = "text") {
    return [
      "versioned",
      mediaType,
      item.versionGroupId || "",
      item.versionRootItemId || "",
      item.versionParentItemId || "",
      item.id || ""
    ].join("::");
  }

  function embeddedVersionedItemSignature(item = {}, mediaType = "text") {
    return [
      "embedded-versioned",
      mediaType,
      ...(Array.isArray(item.captureVersions) ? item.captureVersions : []).map((version) => [
        normalizedContentSignature(version?.title || ""),
        normalizedContentSignature(version?.content || version?.text || version?.code || version?.value || "")
      ].join("::"))
    ].join("||");
  }

  function mergePrimitiveArray(localList, remoteList) {
    return Array.from(new Set([
      ...(Array.isArray(remoteList) ? remoteList : []),
      ...(Array.isArray(localList) ? localList : [])
    ].filter(Boolean)));
  }

  function escapeDriveQuery(value) {
    return String(value || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
  }

  function broadcastSyncUpdated(meta) {
    chrome.runtime?.sendMessage?.({
      type: global.MCP?.MESSAGE_TYPES?.DRIVE_SYNC_UPDATED,
      meta
    }).catch(() => {});
  }

  function broadcastDriveProgress(messageKey, percent = 0, details = {}) {
    if (activeDriveOperation) {
      activeDriveOperation.percent = Math.max(activeDriveOperation.percent || 0, Number(percent || 0));
      broadcastDriveOperation(activeDriveOperation);
    }
    chrome.runtime?.sendMessage?.({
      type: "MCP_DRIVE_PROGRESS",
      progress: Object.assign({
        messageKey,
        percent
      }, details || {})
    }).catch(() => {});
  }

  function shouldQueueForStorageChange(changes = {}) {
    const storageKeys = keys();
    if (changes[storageKeys.DRIVE_SYNC_META]) return false;
    const sourceLocatorPrefix = storageKeys.SOURCE_LOCATOR_PREFIX || "mcp_source_locator_";
    const settingsKey = storageKeys.SETTINGS;
    const portableSettingsChanged = changes[settingsKey]
      ? havePortableSettingsChanged(changes[settingsKey].oldValue, changes[settingsKey].newValue)
      : false;
    return Object.keys(changes).some((key) => key.startsWith(sourceLocatorPrefix))
      || portableSettingsChanged
      || syncedStorageKeys
        .map((name) => storageKeys[name])
        .filter((key) => key && key !== settingsKey)
        .some((key) => Object.prototype.hasOwnProperty.call(changes, key));
  }

  function havePortableSettingsChanged(oldSettings = {}, newSettings = {}) {
    const clean = (settings) => {
      const next = sanitizeRemoteSettingsForMerge(settings || {});
      delete next.settingsUpdatedAt;
      return next;
    };
    return JSON.stringify(clean(oldSettings)) !== JSON.stringify(clean(newSettings));
  }

  global.MCP = Object.assign(global.MCP || {}, {
    DRIVE_ALARM_NAME,
    DRIVE_PENDING_ALARM_NAME,
    DRIVE_LIVE_ALARM_NAME,
    DRIVE_FREQUENCIES,
    DRIVE_MANUAL_COOLDOWN_MS,
    getDriveSyncStatus: getStatus,
    connectDrive,
    disconnectDrive,
    syncDriveNow: syncNow,
    analyzeDriveRestoreFromDrive,
    restoreDriveFromDrive,
    controlDriveOperation,
    getDriveOperationStatus: () => publicDriveOperation(activeDriveOperation),
    beginLocalCaptureDeletion,
    finishLocalCaptureDeletion,
    queueDriveSync,
    syncDriveIfOverdue: syncIfOverdue,
    checkDriveRemoteChanges,
    prepareDeleteDriveWorkspaceBackup,
    deleteDriveWorkspaceBackup,
    scheduleDriveSyncAlarm,
    shouldQueueDriveSyncForStorageChange: shouldQueueForStorageChange,
    normalizeDriveSyncFrequency: normalizeFrequency,
    filterStorageForDrive: cleanStorageForDrive,
    normalizeDrivePayloadForWorkspace,
    validateDrivePayloadStorage,
    mergeDriveSettings: mergeSettings
  });
})(globalThis);
