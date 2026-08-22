(function initLicenseManager(global) {
  const LICENSE_VERIFY_INTERVAL_MS = 12 * 60 * 60 * 1000;
  const LICENSE_GRACE_PERIOD_MS = Number(global.MCP?.LICENSE_GRACE_PERIOD_MS) || 14 * 24 * 60 * 60 * 1000;
  const LICENSE_PROOF_VERSION = "v2";
  const LEGACY_LICENSE_PROOF_VERSION = "v1";
  const BILLING_API_BASE = "https://api.arcawand-soft.com";
  const LICENSE_AUTH_VERSION = "v3";
  const LICENSE_REQUEST_TIMEOUT_MS = 20000;
  const MAX_LICENSE_RESPONSE_BYTES = 1024 * 1024;
  let cachedUiAuthorization = null;

  function settingsLanguage(settings = {}) {
    return settings.language || "en";
  }

  function licenseKeyLast4(value = "") {
    const clean = String(value || "").trim();
    return clean.slice(-4);
  }

  function buildLicenseDeviceAlias(installationId = "") {
    const fingerprint = String(installationId || "")
      .replace(/^ucp_install_/i, "")
      .replace(/[^a-f0-9]/gi, "")
      .toLowerCase()
      .slice(0, 24);
    const readableId = fingerprint.length === 24
      ? [fingerprint.slice(0, 8), fingerprint.slice(8, 12), fingerprint.slice(12, 16), fingerprint.slice(16, 20), fingerprint.slice(20, 24)].join("-")
      : "device";
    return `Ultimate Clipboard Pro - Chrome - ${readableId}`.slice(0, 64);
  }

  function isProSettings(settings = {}) {
    return global.MCP.currentPlan?.(settings) === "pro";
  }

  function canonicalLicensePayload(settings = {}, installationId = "", proofVersion = LICENSE_PROOF_VERSION) {
    const currentEnv = global.MCP.normalizeDodoEnv?.(settings.licenseDodoEnv || settings.dodoEnv || global.MCP?.DODO_ENV || "live") || "live";
    const runtimeId = global.chrome?.runtime?.id || "unknown-extension";
    return [
      "ultimate-clipboard-pro-license-proof",
      proofVersion,
      runtimeId,
      installationId,
      currentEnv,
      String(settings.licenseKey || "").trim(),
      settings.licenseKeyLast4 || licenseKeyLast4(settings.licenseKey),
      settings.licenseKeyInstanceId || "",
      settings.licenseActivatedAt || "",
      settings.licenseLastSuccessfulVerifiedAt || "",
      settings.licensePlanId || "",
      ...(proofVersion === LEGACY_LICENSE_PROOF_VERSION ? [] : [settings.licenseProductId || ""])
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

  async function createLicenseProof(settings = {}, proofVersion = LICENSE_PROOF_VERSION) {
    const installationId = await getInstallationId();
    const digest = await sha256Hex(canonicalLicensePayload(settings, installationId, proofVersion));
    return `${proofVersion}:${digest}`;
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
    const proofVersion = settings.licenseProofVersion;
    if (!settings.licenseProof || ![LICENSE_PROOF_VERSION, LEGACY_LICENSE_PROOF_VERSION].includes(proofVersion)) return false;
    const expected = await createLicenseProof(settings, proofVersion);
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
    if (settings.licenseAuthVersion === LICENSE_AUTH_VERSION) {
      // UI surfaces deliberately do not own the refresh-token store. They still
      // verify the signed authorization, but cache unchanged claims so a normal
      // settings read stays pure and does not repeatedly run Ed25519.
      if (typeof global.MCP.getLicenseSecretState !== "function") {
        const verificationOptions = {
          installationId: settings.licenseInstallationId,
          allowGrace: true,
          maxSeenTime: Number(settings.licenseMaxSeenTime || 0)
        };
        const cacheKey = [authorizationCacheToken(settings), verificationOptions.installationId, verificationOptions.maxSeenTime].join("\n");
        try {
          if (
            cachedUiAuthorization?.key !== cacheKey
            || !global.MCP.isArcawandAuthorizationUsable?.(cachedUiAuthorization.claims, verificationOptions)
          ) {
            const claims = await global.MCP.verifyArcawandLicenseToken(settings.licenseAuthorizationToken, verificationOptions);
            cachedUiAuthorization = { key: cacheKey, claims };
          }
          return settings;
        } catch {
          if (cachedUiAuthorization?.key === cacheKey) cachedUiAuthorization = null;
          return downgradeIntegrityFailure(settings);
        }
      }
      const secretState = await global.MCP.getLicenseSecretState().catch(() => null);
      const authorizationToken = secretState?.authorizationToken || settings.licenseAuthorizationToken;
      const installationId = secretState?.installationId || settings.licenseInstallationId;
      if (!authorizationToken || !installationId) return downgradeIntegrityFailure(settings);
      try {
        const claims = await global.MCP.verifyArcawandLicenseToken(authorizationToken, {
          installationId,
          allowGrace: true,
          maxSeenTime: Number(secretState?.maxSeenTime || settings.licenseMaxSeenTime || 0)
        });
        return applyVerifiedClaims(settings, claims, Object.assign({}, secretState, { authorizationToken, installationId }));
      } catch {
        return downgradeIntegrityFailure(settings);
      }
    }
    // Local SHA proofs are migration hints only. They never authorize Premium.
    // The retained key is submitted to the Arcawand service by the worker on the
    // next validation attempt and is then removed from settings after activation.
    return downgradeIntegrityFailure(settings);
  }

  function authorizationCacheToken(settings = {}) {
    return String(settings.licenseAuthorizationToken || "");
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
      maskedLicenseKey: settings.licenseKey ? maskLicenseKey(settings.licenseKey) : (settings.licenseKeyLast4 ? `•••• ${settings.licenseKeyLast4}` : ""),
      licenseKeyInstanceId: settings.licenseKeyInstanceId || "",
      licenseKeyId: settings.licenseKeyId || "",
      customerId: settings.licenseCustomerId || "",
      productId: settings.licenseProductId || "pdt_0NeBVHHvl7TdkOznAvJOk",
      productName: settings.licenseProductName || "Ultimate Clipboard Pro - Lifetime License",
      activatedAt: settings.licenseActivatedAt || null,
      lastVerifiedAt: settings.licenseLastVerifiedAt || null,
      lastSuccessfulVerifiedAt: settings.licenseLastSuccessfulVerifiedAt || null,
      dodoEnv: settings.licenseDodoEnv || settings.dodoEnv || config.env,
      currentEnv: config.env,
      paymentLink: config.paymentLink,
      apiBase: config.apiBase,
      appId: config.appId,
      planId: config.planId
      , entitlementId: settings.licenseEntitlementId || ""
      , authorizationExpiresAt: settings.licenseAuthorizationExpiresAt || null
      , offlineGraceExpiresAt: settings.licenseOfflineGraceExpiresAt || null
      , authorizationVersion: settings.licenseAuthVersion || ""
    };
  }

  function maskLicenseKey(value = "") {
    const clean = String(value || "").trim();
    if (!clean) return "";
    if (clean.length <= 8) return `•••• ${clean.slice(-4)}`;
    return `${clean.slice(0, 4)}••••••••${clean.slice(-4)}`;
  }

  function sanitizeLicenseInspection(data = {}, extras = {}) {
    const safe = {
      valid: Boolean(data.valid),
      status: data.status || "",
      plan: data.plan || "",
      productId: data.productId || "",
      productName: data.productName || "",
      licenseKeyLast4: data.licenseKeyLast4 || "",
      licenseKeyId: data.licenseKeyId || "",
      licenseKeyInstanceId: data.licenseKeyInstanceId || "",
      customerId: data.customerId || "",
      customerName: data.customerName || "",
      customerEmail: data.customerEmail || "",
      customerPhone: data.customerPhone || "",
      customerCreatedAt: data.customerCreatedAt || "",
      instanceName: data.instanceName || "",
      businessId: data.businessId || "",
      entitlementId: data.entitlementId || "",
      grantId: data.grantId || "",
      activationsLimit: Number(data.activationsLimit || 0),
      instancesCount: Number(data.instancesCount || 0),
      paymentId: data.paymentId || "",
      subscriptionId: data.subscriptionId || "",
      source: data.source || "",
      purchasedAt: data.purchasedAt || "",
      activatedAt: data.activatedAt || "",
      expiresAt: data.expiresAt || "",
      renewsAt: data.renewsAt || "",
      updatedAt: data.updatedAt || "",
      activeLocalLicense: Boolean(data.activeLocalLicense),
      matchesCurrentLicense: Boolean(data.matchesCurrentLicense),
      sources: Object.assign({}, data.sources || {})
    };
    return Object.assign(safe, extras);
  }

  async function inspectDodoLicense(licenseKey = "") {
    const settings = await global.MCP.getSettings();
    const requestedKey = String(licenseKey || "").trim();
    const keyToInspect = requestedKey || String(settings.licenseKey || "").trim();
    if (!requestedKey && settings.licenseAuthVersion === LICENSE_AUTH_VERSION) {
      const secretState = await global.MCP.getLicenseSecretState?.().catch(() => null);
      if (secretState?.refreshToken) {
        const response = await licenseServicePost("/v1/inspect", { installationId: secretState.installationId, refreshToken: secretState.refreshToken, requestId: createRequestId() });
        return { inspection: sanitizeLicenseInspection(response.inspection || {}, { matchesCurrentLicense: true, inspectedAt: new Date().toISOString() }), status: await getLicenseStatus() };
      }
    }
    if (requestedKey && settings.licenseAuthVersion === LICENSE_AUTH_VERSION) {
      const secretState = await global.MCP.getLicenseSecretState?.().catch(() => null);
      if (secretState?.refreshToken && secretState?.installationId) {
        try {
          const response = await licenseServicePost("/v1/inspect-candidate", {
            installationId: secretState.installationId,
            refreshToken: secretState.refreshToken,
            requestId: createRequestId(),
            licenseKey: requestedKey
          });
          return {
            inspection: sanitizeLicenseInspection(response.inspection || {}, { inspectedAt: new Date().toISOString() }),
            status: await getLicenseStatus()
          };
        } catch (error) {
          if (String(error?.message || error) !== "license.invalid") throw error;
        }
      }
    }
    if (!keyToInspect) return { inspection: null, status: await getLicenseStatus() };
    const response = await licenseServicePost("/v1/inspect-key", {
      installationId: await getLicenseInstallationId(),
      licenseKey: keyToInspect
    });
    const inspection = sanitizeLicenseInspection(response.inspection || {}, { inspectedAt: new Date().toISOString() });
    inspection.matchesCurrentLicense = Boolean(
      inspection.valid
      && inspection.licenseKeyId
      && settings.licenseKeyId
      && inspection.licenseKeyId === settings.licenseKeyId
    );
    inspection.activeLocalLicense = inspection.matchesCurrentLicense && isProSettings(settings);
    return {
      inspection,
      status: await getLicenseStatus()
    };
  }

  async function openProCheckout(currency = "EUR", language = "") {
    const settings = await global.MCP.getSettings();
    const config = global.MCP.getDodoConfig(settings.dodoEnv || "live");
    let paymentLink = config.paymentLink;
    try {
      const response = await billingPost("/billing/checkout-session", {
        catalog: global.MCP.PREMIUM_CHECKOUT_CATALOG || "ultimate-clipboard-pro",
        plan: "pro",
        interval: "lifetime",
        currency,
        language: language || settingsLanguage(settings),
        returnUrl: "https://arcawand-soft.com/"
      });
      paymentLink = String(response.checkoutUrl || paymentLink);
    } catch {
      // The direct live product link remains a safe fallback if the billing service is unavailable.
    }
    const safePaymentLink = global.MCP.sanitizeUrlForPurpose(paymentLink, "billing");
    if (!safePaymentLink) throw new Error("license.checkoutError");
    if (chrome.tabs?.create) {
      await chrome.tabs.create({ url: safePaymentLink });
    } else if (global.open) {
      global.open(safePaymentLink, "_blank", "noopener");
    }
    return { opened: true, paymentLink: safePaymentLink, dodoEnv: config.env };
  }

  async function openCustomerPortal() {
    const settings = await global.MCP.getSettings();
    if (settings.licenseAuthVersion === LICENSE_AUTH_VERSION) {
      const secretState = await global.MCP.getLicenseSecretState?.().catch(() => null);
      if (!secretState?.refreshToken) throw new Error("license.empty");
      const response = await licenseServicePost("/v1/portal", { installationId: secretState.installationId, refreshToken: secretState.refreshToken, requestId: createRequestId() });
      const safePortalLink = global.MCP.sanitizeUrlForPurpose(String(response.portalUrl || ""), "billing");
      if (!safePortalLink) throw new Error("license.portalError");
      if (chrome.tabs?.create) await chrome.tabs.create({ url: safePortalLink });
      else if (global.open) global.open(safePortalLink, "_blank", "noopener");
      return { opened: true, portalLink: safePortalLink };
    }
    throw new Error("license.empty");
  }

  async function activateDodoLicense(licenseKey) {
    const cleanKey = String(licenseKey || "").trim();
    if (!cleanKey) throw new Error("license.empty");
    const settings = await global.MCP.getSettings();
    const config = global.MCP.getDodoConfig(settings.dodoEnv || "live");
    const installationId = await getLicenseInstallationId();
    const manifest = global.chrome?.runtime?.getManifest?.() || {};
    const existingSecretState = await global.MCP.getLicenseSecretState?.().catch(() => null);
    const replacingActiveLicense = Boolean(existingSecretState?.refreshToken && existingSecretState?.installationId === installationId);
    const response = await licenseServicePost(replacingActiveLicense ? "/v1/replace" : "/v1/activate", {
      licenseKey: cleanKey,
      installationId,
      deviceAlias: buildLicenseDeviceAlias(installationId),
      clientVersion: String(manifest.version || "unknown").slice(0, 32),
      ...(replacingActiveLicense ? { refreshToken: existingSecretState.refreshToken, requestId: createRequestId() } : {})
    });
    const claims = await verifyServiceAuthorization(response, installationId);
    const now = Date.now();
    const secretState = {
      schemaVersion: 3,
      installationId,
      authorizationToken: response.authorizationToken,
      refreshToken: response.refreshToken,
      refreshGeneration: Number(response.refreshGeneration || 1),
      maxSeenTime: Math.floor(now / 1000),
      lastRefreshAt: now
    };
    await global.MCP.saveLicenseSecretState(secretState);
    const nextSettings = applyVerifiedClaims(Object.assign({}, settings, {
      plan: "pro",
      licenseStatus: "active",
      licenseKey: "",
      licenseKeyLast4: licenseKeyLast4(cleanKey),
      licenseKeyInstanceId: claims.instance_id,
      licenseKeyId: claims.sub,
      licenseCustomerId: "",
      licenseActivatedAt: now,
      licenseLastVerifiedAt: now,
      licenseLastSuccessfulVerifiedAt: now,
      licenseDodoEnv: config.env,
      licenseProductName: "Ultimate Clipboard Pro - Lifetime License",
      licenseProductId: global.MCP.DODO_PRODUCT_ID,
      licensePlanId: config.planId,
      licenseProof: "",
      licenseProofVersion: ""
    }), claims, secretState);
    await global.MCP.saveSettings(nextSettings);
    return getLicenseStatus();
  }

  async function validateDodoLicense(options = {}) {
    const settings = await global.MCP.getSettings();
    if (settings.licenseAuthVersion !== LICENSE_AUTH_VERSION && settings.licenseKey) return activateDodoLicense(settings.licenseKey);
    const secretState = await global.MCP.getLicenseSecretState?.().catch(() => null);
    if (!secretState?.refreshToken || !secretState?.installationId) throw new Error("license.empty");
    const config = global.MCP.getDodoConfig(settings.licenseDodoEnv || settings.dodoEnv || "live");
    try {
      const refreshRequestId = secretState.pendingRefreshRequestId || createRequestId();
      if (!secretState.pendingRefreshRequestId) {
        secretState.pendingRefreshRequestId = refreshRequestId;
        await global.MCP.saveLicenseSecretState(secretState);
      }
      const response = await licenseServicePost("/v1/refresh", {
        installationId: secretState.installationId,
        refreshToken: secretState.refreshToken,
        requestId: refreshRequestId
      });
      const now = Date.now();
      const claims = await verifyServiceAuthorization(response, secretState.installationId);
      const nextSecretState = Object.assign({}, secretState, {
        authorizationToken: response.authorizationToken,
        refreshToken: response.refreshToken,
        refreshGeneration: Number(response.refreshGeneration || secretState.refreshGeneration + 1),
        maxSeenTime: Math.max(Number(secretState.maxSeenTime || 0), Math.floor(now / 1000)),
        lastRefreshAt: now
        , pendingRefreshRequestId: ""
      });
      await global.MCP.saveLicenseSecretState(nextSecretState);
      const nextSettings = applyVerifiedClaims(Object.assign({}, settings, {
        plan: "pro",
        licenseStatus: "active",
        licenseLastVerifiedAt: now,
        licenseLastSuccessfulVerifiedAt: now,
        licenseDodoEnv: config.env,
        licensePlanId: config.planId,
        licenseProductId: global.MCP.DODO_PRODUCT_ID,
        licenseProof: "",
        licenseProofVersion: "",
        licenseIntegrityLastCheckedAt: Date.now()
      }), claims, nextSecretState);
      await global.MCP.saveSettings(nextSettings);
      return Object.assign(await getLicenseStatus(), { valid: true });
    } catch (error) {
      if (!isNetworkLikeError(error) && ["license.invalid", "license_not_entitled", "invalid_authorization"].some((code) => String(error?.message || error).includes(code))) {
        await global.MCP.clearLicenseSecretState?.().catch(() => {});
        await global.MCP.saveSettings(Object.assign({}, settings, {
          plan: "free",
          licenseStatus: "invalid",
          licenseLastVerifiedAt: Date.now(),
          licenseProof: "",
          licenseProofVersion: "",
          licenseIntegrityLastCheckedAt: Date.now()
        }));
        return Object.assign(await getLicenseStatus(), { valid: false });
      }
      if (!options.forceFreeOnNetworkError) {
        let graceClaims = null;
        if (isNetworkLikeError(error)) {
          graceClaims = await global.MCP.verifyArcawandLicenseToken(secretState.authorizationToken, { installationId: secretState.installationId, allowGrace: true, maxSeenTime: Number(secretState.maxSeenTime || 0) }).catch(() => null);
        }
        if (graceClaims) {
          await global.MCP.saveSettings(applyVerifiedClaims(Object.assign({}, settings, {
            licenseLastVerifiedAt: Date.now(),
            licenseStatus: settings.licenseStatus || "active",
            plan: settings.plan || "pro"
          }), graceClaims, secretState));
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

  async function validateDodoLicenseIfDue(options = {}) {
    const settings = await global.MCP.getSettings();
    if (settings.licenseKey && settings.licenseAuthVersion !== LICENSE_AUTH_VERSION) return validateDodoLicense(options);
    if (!isProSettings(settings)) return getLicenseStatus();
    if (options.force) return validateDodoLicense(options);
    const lastVerifiedAt = Number(settings.licenseLastVerifiedAt || 0);
    if (lastVerifiedAt && Date.now() - lastVerifiedAt < LICENSE_VERIFY_INTERVAL_MS) return getLicenseStatus();
    return validateDodoLicense(options);
  }

  async function resetDodoLicense() {
    const settings = await global.MCP.getSettings();
    const secretState = await global.MCP.getLicenseSecretState?.().catch(() => null);
    if (!secretState?.refreshToken || !secretState?.installationId || !secretState?.authorizationToken) throw new Error("license.authorizationRequired");
    await licenseServicePost("/v1/deactivate", { installationId: secretState.installationId, refreshToken: secretState.refreshToken, authorizationToken: secretState.authorizationToken, requestId: createRequestId() });
    await global.MCP.clearLicenseSecretState?.();
    const nextSettings = Object.assign({}, settings, {
      plan: "free",
      licenseStatus: "free",
      licenseKey: "",
      licenseKeyLast4: "",
      licenseKeyInstanceId: "",
      licenseKeyId: "",
      licenseCustomerId: "",
      licenseActivatedAt: null,
      licenseLastVerifiedAt: null,
      licenseLastSuccessfulVerifiedAt: null,
      licenseDodoEnv: "",
      licenseProductName: "",
      licenseProductId: "",
      licensePlanId: "",
      licenseProof: "",
      licenseProofVersion: "",
      licenseAuthVersion: "",
      licenseAuthorizationToken: "",
      licenseInstallationId: "",
      licenseMaxSeenTime: 0,
      licenseEntitlementId: "",
      licenseAuthorizationExpiresAt: null,
      licenseOfflineGraceExpiresAt: null,
      licenseIntegrityLastCheckedAt: Date.now()
    });
    await global.MCP.saveSettings(nextSettings);
    return getLicenseStatus();
  }

  async function recoverDodoLicense(licenseKey) {
    const cleanKey = String(licenseKey || "").trim();
    if (!cleanKey) throw new Error("license.empty");
    return licenseServicePost("/v1/recover", { licenseKey: cleanKey, installationId: await getLicenseInstallationId() });
  }

  async function deactivateRecoveredDodoInstance(recoverySession, instanceId) {
    return licenseServicePost("/v1/recover/deactivate", { recoverySession: String(recoverySession || ""), instanceId: String(instanceId || "") });
  }

  async function billingPost(path, body) {
    let result;
    try {
      result = await postLicenseJson(`${BILLING_API_BASE}${path}`, body);
    } catch {
      throw new Error("license.network");
    }
    if (!result.response.ok || result.data?.ok === false) throw new Error(result.data?.error || "license.portalError");
    return result.data;
  }

  async function licenseServicePost(path, body) {
    let result;
    try {
      result = await postLicenseJson(`${global.MCP.LICENSE_SERVICE_BASE}${path}`, body);
    } catch {
      throw new Error("license.network");
    }
    if (result.response.status >= 500) throw new Error("license.network");
    if (!result.response.ok || result.data?.ok === false) {
      const code = String(result.data?.error || "");
      if (code === "activation_limit") throw new Error("license.activationLimit");
      if (["invalid_license", "license_not_entitled", "invalid_authorization"].includes(code)) throw new Error("license.invalid");
      if (code === "rate_limited") throw new Error("license.network");
      throw new Error(code || "license.network");
    }
    return result.data;
  }

  async function postLicenseJson(url, body) {
    let parsed;
    try {
      parsed = new URL(String(url || ""));
    } catch (error) {
      throw new Error("license.network");
    }
    const allowedEndpoints = new Set([
      `${BILLING_API_BASE}/billing/checkout-session`,
      , `${global.MCP.LICENSE_SERVICE_BASE}/v1/activate`
      , `${global.MCP.LICENSE_SERVICE_BASE}/v1/replace`
      , `${global.MCP.LICENSE_SERVICE_BASE}/v1/refresh`
      , `${global.MCP.LICENSE_SERVICE_BASE}/v1/deactivate`
      , `${global.MCP.LICENSE_SERVICE_BASE}/v1/recover`
      , `${global.MCP.LICENSE_SERVICE_BASE}/v1/recover/deactivate`
      , `${global.MCP.LICENSE_SERVICE_BASE}/v1/inspect`
      , `${global.MCP.LICENSE_SERVICE_BASE}/v1/inspect-candidate`
      , `${global.MCP.LICENSE_SERVICE_BASE}/v1/inspect-key`
      , `${global.MCP.LICENSE_SERVICE_BASE}/v1/portal`
    ]);
    if (!allowedEndpoints.has(`${parsed.origin}${parsed.pathname}`) || parsed.username || parsed.password || parsed.search || parsed.hash) {
      throw new Error("license.network");
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LICENSE_REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(parsed.href, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(body),
        credentials: "omit",
        redirect: "error",
        referrerPolicy: "no-referrer",
        signal: controller.signal
      });
      const declaredLength = Number(response.headers.get("content-length") || 0);
      if (declaredLength > MAX_LICENSE_RESPONSE_BYTES) throw new Error("license.network");
      const text = await readLicenseResponseTextWithLimit(response, MAX_LICENSE_RESPONSE_BYTES);
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("license.network");
      }
      return { response, data };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function readLicenseResponseTextWithLimit(response, maxBytes) {
    const reader = response?.body?.getReader?.();
    if (!reader) {
      const text = await response.text();
      if (new TextEncoder().encode(text).byteLength > maxBytes) throw new Error("license.network");
      return text;
    }
    const chunks = [];
    let totalBytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel("License response exceeded its byte budget.").catch(() => {});
          throw new Error("license.network");
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
    return new TextDecoder("utf-8").decode(bytes);
  }

  function mapDodoError(data = {}, status = 0) {
    return global.MCP.classifyDodoLicenseError?.(data, status) || "license.activationFailed";
  }

  function isNetworkLikeError(error) {
    return ["license.network", "Failed to fetch", "NetworkError", "AbortError", "timeout"].some((value) => String(error?.message || error).includes(value));
  }

  function isExpectedDodoProduct(response = {}) {
    const productId = response?.product?.product_id
      || response?.product?.id
      || response?.product_id
      || "";
    return String(productId) === String(global.MCP.DODO_PRODUCT_ID || "");
  }

  async function getLicenseInstallationId() {
    const existing = await global.MCP.getLicenseSecretState?.().catch(() => null);
    if (/^ucp_install_[a-f0-9]{32}$/.test(existing?.installationId || "")) return existing.installationId;
    const bytes = new Uint8Array(16);
    global.crypto.getRandomValues(bytes);
    return `ucp_install_${[...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  }

  function createRequestId() {
    const bytes = new Uint8Array(16);
    global.crypto.getRandomValues(bytes);
    return `ucp_req_${[...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  }

  async function verifyServiceAuthorization(response, installationId) {
    if (!response?.authorizationToken || !response?.refreshToken) throw new Error("license.integrity");
    return global.MCP.verifyArcawandLicenseToken(response.authorizationToken, { installationId });
  }

  function applyVerifiedClaims(settings, claims, secretState = {}) {
    const verifiedAt = Number(secretState.lastRefreshAt || settings.licenseLastSuccessfulVerifiedAt || claims.iat * 1000) || 0;
    const maxSeenTime = Number(secretState.maxSeenTime || settings.licenseMaxSeenTime || claims.iat) || 0;
    return Object.assign({}, settings, {
      plan: "pro",
      licenseStatus: "active",
      licenseAuthVersion: LICENSE_AUTH_VERSION,
      licenseAuthorizationToken: secretState.authorizationToken || settings.licenseAuthorizationToken || "",
      licenseInstallationId: secretState.installationId || claims.installation_id,
      licenseMaxSeenTime: maxSeenTime,
      licenseProductId: claims.product_id,
      licenseEntitlementId: claims.entitlement_id,
      licensePlanId: claims.plan_id,
      licenseKeyId: claims.sub,
      licenseKeyInstanceId: claims.instance_id,
      licenseAuthorizationExpiresAt: claims.authorization_expires_at * 1000,
      licenseOfflineGraceExpiresAt: claims.offline_grace_expires_at * 1000,
      licenseAuthorizationJti: claims.jti,
      licenseLastSuccessfulVerifiedAt: verifiedAt,
      licenseProof: "",
      licenseProofVersion: "",
      licenseIntegrityLastCheckedAt: verifiedAt
    });
  }

  global.MCP = Object.assign(global.MCP || {}, {
    LICENSE_VERIFY_INTERVAL_MS,
    LICENSE_GRACE_PERIOD_MS,
    LICENSE_PROOF_VERSION,
    LICENSE_AUTH_VERSION,
    getInstallationId,
    buildLicenseDeviceAlias,
    createLicenseProof,
    verifyLicenseProof,
    normalizeLicenseSettings,
    getLicenseStatus,
    inspectDodoLicense,
    openProCheckout,
    openCustomerPortal,
    activateDodoLicense,
    validateDodoLicense,
    validateDodoLicenseIfDue,
    resetDodoLicense,
    recoverDodoLicense,
    deactivateRecoveredDodoInstance,
    isExpectedDodoProduct,
    isProSettings
  });
})(globalThis);
