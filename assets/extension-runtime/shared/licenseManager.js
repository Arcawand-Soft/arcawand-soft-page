(function initLicenseManager(global) {
  const LICENSE_VERIFY_INTERVAL_MS = 24 * 60 * 60 * 1000;
  const LICENSE_GRACE_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;
  const LICENSE_PROOF_VERSION = "v1";

  function settingsLanguage(settings = {}) {
    return settings.language || "en";
  }

  function licenseKeyLast4(value = "") {
    const clean = String(value || "").trim();
    return clean.slice(-4);
  }

  function isProSettings(settings = {}) {
    const currentEnv = global.MCP.normalizeDodoEnv?.(settings.dodoEnv || global.MCP?.DODO_ENV || "live") || "live";
    const licenseEnv = global.MCP.normalizeDodoEnv?.(settings.licenseDodoEnv || currentEnv) || currentEnv;
    return settings.plan === "pro"
      && settings.licenseStatus === "active"
      && licenseEnv === currentEnv
      && Boolean(settings.licenseProof && settings.licenseProofVersion === LICENSE_PROOF_VERSION);
  }

  function canonicalLicensePayload(settings = {}, installationId = "") {
    const currentEnv = global.MCP.normalizeDodoEnv?.(settings.licenseDodoEnv || settings.dodoEnv || global.MCP?.DODO_ENV || "live") || "live";
    const runtimeId = global.chrome?.runtime?.id || "unknown-extension";
    return [
      "ultimate-clipboard-pro-license-proof",
      LICENSE_PROOF_VERSION,
      runtimeId,
      installationId,
      currentEnv,
      String(settings.licenseKey || "").trim(),
      settings.licenseKeyLast4 || licenseKeyLast4(settings.licenseKey),
      settings.licenseKeyInstanceId || "",
      settings.licenseActivatedAt || "",
      settings.licenseLastSuccessfulVerifiedAt || "",
      settings.licensePlanId || ""
    ].join("\n");
  }

  async function sha256Hex(value) {
    if (global.crypto?.subtle && global.TextEncoder) {
      const bytes = new TextEncoder().encode(String(value || ""));
      const digest = await global.crypto.subtle.digest("SHA-256", bytes);
      return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    let hash = 2166136261;
    const text = String(value || "");
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  async function createLicenseProof(settings = {}) {
    const installationId = await getInstallationId();
    const digest = await sha256Hex(canonicalLicensePayload(settings, installationId));
    return `${LICENSE_PROOF_VERSION}:${digest}`;
  }

  async function secureLicenseSettings(settings = {}) {
    const next = Object.assign({}, settings, {
      licenseProofVersion: LICENSE_PROOF_VERSION,
      licenseIntegrityLastCheckedAt: Date.now()
    });
    next.licenseProof = await createLicenseProof(next);
    return next;
  }

  async function verifyLicenseProof(settings = {}) {
    if (!settings.licenseProof || settings.licenseProofVersion !== LICENSE_PROOF_VERSION) return false;
    const expected = await createLicenseProof(settings);
    return expected === settings.licenseProof;
  }

  function downgradeIntegrityFailure(settings = {}) {
    return Object.assign({}, settings, {
      plan: "free",
      licenseStatus: "integrity_failed",
      licenseProof: "",
      licenseProofVersion: "",
      licenseIntegrityLastCheckedAt: Date.now()
    });
  }

  async function normalizeLicenseSettings(settings = {}) {
    const currentEnv = global.MCP.normalizeDodoEnv?.(settings.dodoEnv || global.MCP?.DODO_ENV || "live") || "live";
    const licenseEnv = global.MCP.normalizeDodoEnv?.(settings.licenseDodoEnv || currentEnv) || currentEnv;
    const active = settings.plan === "pro" && settings.licenseStatus === "active";
    if (!active) {
      if (!settings.licenseProof && !settings.licenseProofVersion) return settings;
      return Object.assign({}, settings, {
        licenseProof: "",
        licenseProofVersion: "",
        licenseIntegrityLastCheckedAt: Date.now()
      });
    }
    if (!settings.licenseKey || !settings.licenseLastSuccessfulVerifiedAt) {
      return downgradeIntegrityFailure(settings);
    }
    if (!settings.licenseProof) return downgradeIntegrityFailure(settings);
    if (!await verifyLicenseProof(settings)) return downgradeIntegrityFailure(settings);
    const lastIntegrityCheck = Number(settings.licenseIntegrityLastCheckedAt || 0);
    if (lastIntegrityCheck && Date.now() - lastIntegrityCheck < 60 * 60 * 1000) return settings;
    return Object.assign({}, settings, { licenseIntegrityLastCheckedAt: Date.now() });
  }

  async function getInstallationId() {
    const key = global.MCP.STORAGE_KEYS.INSTALLATION_ID;
    const data = await chrome.storage.local.get(key);
    if (data[key]) return data[key];
    const id = global.crypto?.randomUUID?.()
      || `ucp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
    await chrome.storage.local.set({ [key]: id });
    return id;
  }

  async function getLicenseStatus() {
    const settings = await global.MCP.getSettings();
    const config = global.MCP.getDodoConfig(settings.dodoEnv || "live");
    return {
      plan: settings.plan || "free",
      isPro: isProSettings(settings),
      licenseStatus: settings.licenseStatus || "free",
      licenseKeyLast4: settings.licenseKeyLast4 || "",
      licenseKeyInstanceId: settings.licenseKeyInstanceId || "",
      activatedAt: settings.licenseActivatedAt || null,
      lastVerifiedAt: settings.licenseLastVerifiedAt || null,
      lastSuccessfulVerifiedAt: settings.licenseLastSuccessfulVerifiedAt || null,
      dodoEnv: settings.licenseDodoEnv || settings.dodoEnv || config.env,
      currentEnv: config.env,
      paymentLink: config.paymentLink,
      apiBase: config.apiBase,
      appId: config.appId,
      planId: config.planId
    };
  }

  async function openProCheckout() {
    const settings = await global.MCP.getSettings();
    const config = global.MCP.getDodoConfig(settings.dodoEnv || "live");
    if (chrome.tabs?.create) {
      await chrome.tabs.create({ url: config.paymentLink });
    } else if (global.open) {
      global.open(config.paymentLink, "_blank", "noopener");
    }
    return { opened: true, paymentLink: config.paymentLink, dodoEnv: config.env };
  }

  async function activateDodoLicense(licenseKey) {
    const cleanKey = String(licenseKey || "").trim();
    if (!cleanKey) throw new Error("license.empty");
    const settings = await global.MCP.getSettings();
    const config = global.MCP.getDodoConfig(settings.dodoEnv || "live");
    const installationId = await getInstallationId();
    const response = await dodoPost(`${config.apiBase}/licenses/activate`, {
      license_key: cleanKey,
      name: `Ultimate Clipboard Pro - Chrome - ${installationId}`
    });
    const now = Date.now();
    const nextSettings = await secureLicenseSettings(Object.assign({}, settings, {
      plan: "pro",
      licenseStatus: "active",
      licenseKey: cleanKey,
      licenseKeyLast4: licenseKeyLast4(cleanKey),
      licenseKeyInstanceId: response.id || response.license_key_instance_id || "",
      licenseActivatedAt: now,
      licenseLastVerifiedAt: now,
      licenseLastSuccessfulVerifiedAt: now,
      licenseDodoEnv: config.env,
      licenseProductName: response.product?.name || "Ultimate Clipboard Pro - Lifetime License",
      licensePlanId: config.planId
    }));
    await global.MCP.saveSettings(nextSettings);
    return getLicenseStatus();
  }

  async function validateDodoLicense(options = {}) {
    const settings = await global.MCP.getSettings();
    if (!settings.licenseKey) throw new Error("license.empty");
    const config = global.MCP.getDodoConfig(settings.licenseDodoEnv || settings.dodoEnv || "live");
    const body = { license_key: settings.licenseKey };
    if (settings.licenseKeyInstanceId) body.license_key_instance_id = settings.licenseKeyInstanceId;
    try {
      const response = await dodoPost(`${config.apiBase}/licenses/validate`, body);
      const now = Date.now();
      const valid = response.valid === true;
      const nextSettings = Object.assign({}, settings, {
        plan: valid ? "pro" : "free",
        licenseStatus: valid ? "active" : "invalid",
        licenseLastVerifiedAt: now,
        licenseLastSuccessfulVerifiedAt: valid ? now : settings.licenseLastSuccessfulVerifiedAt,
        licenseDodoEnv: config.env,
        licensePlanId: valid ? config.planId : settings.licensePlanId,
        licenseProof: valid ? settings.licenseProof : "",
        licenseProofVersion: valid ? settings.licenseProofVersion : "",
        licenseIntegrityLastCheckedAt: Date.now()
      });
      await global.MCP.saveSettings(valid ? await secureLicenseSettings(nextSettings) : nextSettings);
      return Object.assign(await getLicenseStatus(), { valid });
    } catch (error) {
      if (!options.forceFreeOnNetworkError) {
        const lastGood = Number(settings.licenseLastSuccessfulVerifiedAt || settings.licenseLastVerifiedAt || 0);
        const withinGrace = lastGood && Date.now() - lastGood <= LICENSE_GRACE_PERIOD_MS;
        if (withinGrace && isNetworkLikeError(error)) {
          await global.MCP.saveSettings(await secureLicenseSettings(Object.assign({}, settings, {
            licenseLastVerifiedAt: Date.now(),
            licenseStatus: settings.licenseStatus || "active",
            plan: settings.plan || "pro"
          })));
          return Object.assign(await getLicenseStatus(), { valid: true, grace: true });
        }
        if (isNetworkLikeError(error)) {
          await global.MCP.saveSettings(Object.assign({}, settings, {
            plan: "free",
            licenseStatus: "invalid",
            licenseLastVerifiedAt: Date.now()
          }));
        }
      }
      throw error;
    }
  }

  async function validateDodoLicenseIfDue() {
    const settings = await global.MCP.getSettings();
    if (!isProSettings(settings) || !settings.licenseKey) return getLicenseStatus();
    const lastVerifiedAt = Number(settings.licenseLastVerifiedAt || 0);
    if (lastVerifiedAt && Date.now() - lastVerifiedAt < LICENSE_VERIFY_INTERVAL_MS) return getLicenseStatus();
    return validateDodoLicense();
  }

  async function resetDodoLicense() {
    const settings = await global.MCP.getSettings();
    const nextSettings = Object.assign({}, settings, {
      plan: "free",
      licenseStatus: "free",
      licenseKey: "",
      licenseKeyLast4: "",
      licenseKeyInstanceId: "",
      licenseActivatedAt: null,
      licenseLastVerifiedAt: null,
      licenseLastSuccessfulVerifiedAt: null,
      licenseDodoEnv: "",
      licenseProductName: "",
      licensePlanId: "",
      licenseProof: "",
      licenseProofVersion: "",
      licenseIntegrityLastCheckedAt: Date.now()
    });
    await global.MCP.saveSettings(nextSettings);
    return getLicenseStatus();
  }

  async function dodoPost(url, body) {
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(body)
      });
    } catch (error) {
      throw new Error("license.network");
    }
    let data = {};
    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }
    if (!response.ok) {
      throw new Error(mapDodoError(data, response.status));
    }
    return data;
  }

  function mapDodoError(data = {}, status = 0) {
    const raw = [
      data.error,
      data.message,
      data.detail,
      data.code,
      JSON.stringify(data)
    ].join(" ").toLowerCase();
    if (/activation|limit|maximum|exceeded/.test(raw)) return "license.activationLimit";
    if (/invalid|inactive|disabled|expired|not.*found/.test(raw) || status === 404 || status === 400) return "license.invalid";
    return "license.activationFailed";
  }

  function isNetworkLikeError(error) {
    return ["license.network", "Failed to fetch", "NetworkError"].some((value) => String(error?.message || error).includes(value));
  }

  global.MCP = Object.assign(global.MCP || {}, {
    LICENSE_VERIFY_INTERVAL_MS,
    LICENSE_GRACE_PERIOD_MS,
    LICENSE_PROOF_VERSION,
    getInstallationId,
    createLicenseProof,
    verifyLicenseProof,
    normalizeLicenseSettings,
    getLicenseStatus,
    openProCheckout,
    activateDodoLicense,
    validateDodoLicense,
    validateDodoLicenseIfDue,
    resetDodoLicense,
    isProSettings
  });
})(globalThis);
