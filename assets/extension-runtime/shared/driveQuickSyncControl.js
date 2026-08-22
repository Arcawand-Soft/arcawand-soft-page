(function initDriveQuickSyncControl(global) {
  const MCP = global.MCP = global.MCP || {};

  function createDriveQuickSyncMarkup(doc = global.document) {
    const section = doc.createElement("section");
    section.className = "ucp-drive-quick-sync";
    section.dataset.role = "drive-quick-sync";
    section.setAttribute("aria-live", "polite");
    section.innerHTML = [
      '<span class="ucp-drive-quick-brand" data-role="drive-quick-brand">',
      '<img data-role="drive-quick-brand-image" alt="Google Drive">',
      "</span>",
      '<button class="ucp-drive-quick-action" data-role="drive-quick-action" type="button">',
      '<img data-role="sync-icon" alt="" aria-hidden="true">',
      '<span data-role="sync-wait-label"></span>',
      "</button>"
    ].join("");
    return section;
  }

  function createDriveQuickSyncControl(options = {}) {
    const doc = options.document || global.document;
    const root = options.root || createDriveQuickSyncMarkup(doc);
    const mount = options.mount || null;
    if (mount && !root.isConnected) mount.appendChild(root);

    const brand = root.querySelector("[data-role='drive-quick-brand']");
    const brandImage = root.querySelector("[data-role='drive-quick-brand-image']") || brand?.querySelector("img");
    const action = root.querySelector("[data-role='drive-quick-action']") || root.querySelector("button");
    const syncIcon = action?.querySelector("[data-role='sync-icon']");
    const waitLabel = action?.querySelector("[data-role='sync-wait-label']");
    let status = {};
    let pending = false;
    let destroyed = false;

    const getSettings = typeof options.getSettings === "function" ? options.getSettings : () => ({});
    const t = (key, params = {}) => MCP.t?.(key, params, getSettings()?.language || "en") || key;
    const asset = (path) => global.chrome?.runtime?.getURL?.(path) || path;
    const openPremium = typeof options.openPremium === "function" ? options.openPremium : () => {};
    const showToast = typeof options.showToast === "function" ? options.showToast : () => {};
    const onStatusChange = typeof options.onStatusChange === "function" ? options.onStatusChange : () => {};

    function isLightTheme() {
      const node = root.getRootNode?.();
      const hostTheme = node?.host?.dataset?.resolvedTheme;
      return (hostTheme || doc.documentElement?.dataset?.resolvedTheme || "") === "light";
    }

    function setSyncIcon(syncing) {
      if (!syncIcon) return;
      syncIcon.src = asset(syncing ? "assets/icons/sync-in-progess.gif" : "assets/icons/sync-fixed.png");
    }

    function updateProBadge(locked) {
      if (!action) return;
      let badge = root.querySelector("[data-role='drive-pro-badge']");
      if (!locked) {
        badge?.remove();
        return;
      }
      if (!badge) {
        badge = doc.createElement("img");
        badge.className = "ucp-drive-quick-pro-badge popup-drive-pro-badge";
        badge.dataset.role = "drive-pro-badge";
        badge.src = asset("assets/icons/pro-icon.png");
        badge.alt = "";
        badge.setAttribute("aria-hidden", "true");
      }
      if (badge.parentElement !== action) action.appendChild(badge);
    }

    function render() {
      if (destroyed || !action) return;
      const configured = status.configured !== false;
      const connected = Boolean(status.connected);
      const drivePro = MCP.canUseFeature ? MCP.canUseFeature("driveSync", getSettings()) : true;
      if (brandImage) {
        brandImage.src = asset(isLightTheme() ? "assets/icons/drive-sync-light-mode.png" : "assets/icons/drive-sync.png");
      }
      if (brand) {
        brand.title = !configured
          ? t("drive.notConfigured")
          : connected
            ? t("drive.popupConnected")
            : t("drive.popupDisconnected");
      }
      const actionLabel = drivePro
        ? (connected ? t("drive.syncNow") : t("drive.connect"))
        : t("license.getPro");
      action.setAttribute("aria-label", actionLabel);
      action.title = drivePro ? actionLabel : t("pro.driveRequired");
      action.classList.toggle("is-pro-locked", !drivePro);
      root.classList.toggle("is-pro-locked", !drivePro);
      root.classList.toggle("is-connected", connected);
      updateProBadge(!drivePro);
      if (waitLabel) waitLabel.textContent = t("drive.pleaseWait");
      if (!pending) setSyncIcon(false);
      const coolingDown = connected && Number(status.cooldownUntil) > Date.now();
      action.disabled = pending || (drivePro && (!configured || coolingDown));
    }

    async function getStatus() {
      const response = await global.chrome.runtime.sendMessage({
        type: MCP.MESSAGE_TYPES.DRIVE_GET_STATUS
      }).catch(() => null);
      return response?.data || {};
    }

    function readableError(error) {
      const raw = String(error || "");
      const known = new Map([
        ["drive.notConfigured", "drive.notConfigured"],
        ["drive.disabled", "drive.disabled"],
        ["drive.cooldown", "drive.cooldownShort"],
        ["drive.authFailed", "drive.authFailed"],
        ["drive.identityUnavailable", "drive.identityUnavailable"],
        ["drive.remoteMissing", "drive.remoteMissing"],
        ["drive.remoteChanged", "drive.remoteChanged"],
        ["drive.proRequired", "pro.driveRequired"]
      ]);
      const key = known.get(raw);
      return key ? t(key) : (raw || t("common.error"));
    }

    async function refresh() {
      status = await getStatus();
      render();
      onStatusChange(Object.assign({}, status));
      return status;
    }

    async function activate() {
      if (pending) return;
      const drivePro = MCP.canUseFeature ? MCP.canUseFeature("driveSync", getSettings()) : true;
      if (!drivePro) {
        openPremium("driveSync");
        return;
      }
      pending = true;
      action?.classList.add("is-loading");
      setSyncIcon(true);
      render();
      try {
        const wasConnected = Boolean(status.connected);
        const type = wasConnected ? MCP.MESSAGE_TYPES.DRIVE_SYNC_NOW : MCP.MESSAGE_TYPES.DRIVE_CONNECT;
        const response = await global.chrome.runtime.sendMessage({ type });
        if (!response?.ok) throw new Error(response?.error || "drive.authFailed");
        status = await getStatus();
        showToast(wasConnected ? t("drive.syncDone") : t("drive.connectedNoSyncToast"));
      } catch (error) {
        showToast(readableError(error?.message || error));
      } finally {
        pending = false;
        action?.classList.remove("is-loading");
        setSyncIcon(false);
        status = await getStatus();
        render();
        onStatusChange(Object.assign({}, status));
      }
    }

    function handleClick(event) {
      event.preventDefault();
      event.stopPropagation();
      activate();
    }

    action?.addEventListener("click", handleClick);
    render();

    return {
      element: root,
      activate,
      refresh,
      render,
      setStatus(nextStatus = {}) {
        status = nextStatus || {};
        render();
        onStatusChange(Object.assign({}, status));
      },
      getStatus: () => Object.assign({}, status),
      destroy() {
        destroyed = true;
        action?.removeEventListener("click", handleClick);
      }
    };
  }

  MCP.createDriveQuickSyncMarkup = createDriveQuickSyncMarkup;
  MCP.createDriveQuickSyncControl = createDriveQuickSyncControl;
})(globalThis);
