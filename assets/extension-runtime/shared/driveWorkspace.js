(function initDriveWorkspace(global) {
  const WORKSPACE_VERSION = 1;
  const WORKSPACE_PREFIX = "ucp-license-";

  function licenseSubject(settings = {}) {
    const status = String(settings.licenseStatus || "").toLowerCase();
    const plan = String(settings.plan || "").toLowerCase();
    const isActivePro = plan === "pro" && ["active", "valid", "licensed"].includes(status);
    if (!isActivePro) throw new Error("drive.proRequired");
    const subject = String(settings.licenseKeyId || settings.licenseKey || "").trim();
    if (!subject) throw new Error("drive.workspaceUnavailable");
    return subject;
  }

  async function createIdentity(settings = {}) {
    const subject = licenseSubject(settings);
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`ucp-drive-workspace:v${WORKSPACE_VERSION}:${subject}`));
    const fingerprint = Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("").slice(0, 24);
    return Object.freeze({
      version: WORKSPACE_VERSION,
      id: `${WORKSPACE_PREFIX}${fingerprint}`,
      folderName: `${WORKSPACE_PREFIX}${fingerprint}`
    });
  }

  function attachToPayload(payload = {}, identity, metadata = {}) {
    if (!identity?.id) throw new Error("drive.workspaceUnavailable");
    return Object.assign({}, payload, {
      syncVersion: 3,
      workspace: {
        version: WORKSPACE_VERSION,
        id: identity.id,
        writerId: String(metadata.writerId || ""),
        writtenAt: Date.now()
      }
    });
  }

  function isLegacyPayload(payload = {}) {
    return Boolean(payload && typeof payload === "object" && !payload.workspace?.id && Number(payload.syncVersion || 0) < 3);
  }

  function assertPayloadMatches(payload = {}, identity, options = {}) {
    if (!identity?.id) throw new Error("drive.workspaceUnavailable");
    const remoteId = String(payload?.workspace?.id || "");
    if (!remoteId) {
      if (options.allowLegacy && isLegacyPayload(payload)) return true;
      throw new Error("drive.workspaceMissing");
    }
    if (remoteId !== identity.id) throw new Error("drive.workspaceMismatch");
    return true;
  }

  global.MCP = Object.assign(global.MCP || {}, {
    DriveWorkspace: Object.freeze({
      WORKSPACE_VERSION,
      createIdentity,
      attachToPayload,
      assertPayloadMatches,
      isLegacyPayload
    })
  });
})(globalThis);
