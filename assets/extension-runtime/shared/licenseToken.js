(function initLicenseToken(global) {
  const REQUIRED_CLAIMS = Object.freeze([
    "iss", "aud", "sub", "installation_id", "instance_id", "product_id",
    "entitlement_id", "plan_id", "status", "iat", "authorization_expires_at",
    "offline_grace_expires_at", "jti", "schema_version"
  ]);
  const CLOCK_SKEW_SECONDS = 5 * 60;

  async function verifyArcawandLicenseToken(token, options = {}) {
    const parts = String(token || "").split(".");
    if (parts.length !== 3 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) throw new Error("license.integrity");
    const header = decodeStrictJson(parts[0]);
    if (!hasExactKeys(header, ["alg", "kid", "typ"]) || header.alg !== "EdDSA" || header.typ !== "JWT") throw new Error("license.integrity");
    const jwk = global.MCP?.LICENSE_PUBLIC_KEYS?.[header.kid];
    if (!jwk || jwk.kty !== "OKP" || jwk.crv !== "Ed25519" || !jwk.x) throw new Error("license.integrity");
    const message = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const signature = base64UrlToBytes(parts[2]);
    if (!await verifyEd25519(jwk, signature, message)) throw new Error("license.integrity");
    const claims = decodeStrictJson(parts[1]);
    validateClaims(claims, options);
    return claims;
  }

  function verifyArcawandLicenseTokenSync(token, options = {}) {
    const parts = String(token || "").split(".");
    if (parts.length !== 3 || parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))) throw new Error("license.integrity");
    const header = decodeStrictJson(parts[0]);
    if (!hasExactKeys(header, ["alg", "kid", "typ"]) || header.alg !== "EdDSA" || header.typ !== "JWT") throw new Error("license.integrity");
    const jwk = global.MCP?.LICENSE_PUBLIC_KEYS?.[header.kid];
    const nacl = global.nacl;
    if (!jwk || jwk.kty !== "OKP" || jwk.crv !== "Ed25519" || !jwk.x || !nacl?.sign?.detached?.verify) throw new Error("license.integrity");
    const message = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    if (!nacl.sign.detached.verify(message, base64UrlToBytes(parts[2]), base64UrlToBytes(jwk.x))) throw new Error("license.integrity");
    const claims = decodeStrictJson(parts[1]);
    validateClaims(claims, options);
    return claims;
  }

  function isArcawandAuthorizationUsable(claims, { nowSeconds = Math.floor(Date.now() / 1000), allowGrace = false, maxSeenTime = 0 } = {}) {
    if (!claims) return false;
    if (nowSeconds + CLOCK_SKEW_SECONDS < Number(maxSeenTime || 0)) return false;
    const deadline = allowGrace ? claims.offline_grace_expires_at : claims.authorization_expires_at;
    return Number.isSafeInteger(deadline) && nowSeconds <= deadline + CLOCK_SKEW_SECONDS;
  }

  async function verifyEd25519(jwk, signature, message) {
    if (global.crypto?.subtle) {
      try {
        const key = await global.crypto.subtle.importKey("jwk", jwk, { name: "Ed25519" }, false, ["verify"]);
        return await global.crypto.subtle.verify({ name: "Ed25519" }, key, signature, message);
      } catch {
        // Chrome before 137 has no native Ed25519; the audited local fallback preserves compatibility.
      }
    }
    const nacl = global.nacl;
    if (!nacl?.sign?.detached?.verify) return false;
    return nacl.sign.detached.verify(message, signature, base64UrlToBytes(jwk.x));
  }

  function validateClaims(claims, options) {
    if (!hasExactKeys(claims, REQUIRED_CLAIMS)) throw new Error("license.integrity");
    const expected = {
      iss: global.MCP?.LICENSE_ISSUER,
      aud: global.MCP?.DODO_APP_ID,
      product_id: global.MCP?.DODO_PRODUCT_ID,
      entitlement_id: global.MCP?.DODO_ENTITLEMENT_ID,
      plan_id: global.MCP?.DODO_PLAN_ID,
      status: "active"
    };
    for (const [name, value] of Object.entries(expected)) if (claims[name] !== value) throw new Error("license.integrity");
    if (claims.schema_version !== 1 || claims.installation_id !== options.installationId) throw new Error("license.integrity");
    for (const name of ["iat", "authorization_expires_at", "offline_grace_expires_at", "schema_version"]) if (!Number.isSafeInteger(claims[name])) throw new Error("license.integrity");
    if (claims.authorization_expires_at <= claims.iat || claims.offline_grace_expires_at < claims.authorization_expires_at) throw new Error("license.integrity");
    if (!isArcawandAuthorizationUsable(claims, options)) throw new Error(options.allowGrace ? "license.graceExpired" : "license.expired");
  }

  function decodeStrictJson(value) {
    try {
      const bytes = base64UrlToBytes(value);
      const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      if (bytesToBase64Url(new TextEncoder().encode(text)) !== value) throw new Error("noncanonical");
      const keys = [...text.matchAll(/(?:^|[,{}])\s*"([^"\\]+)"\s*:/g)].map((match) => match[1]);
      if (new Set(keys).size !== keys.length) throw new Error("duplicate");
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
      return parsed;
    } catch { throw new Error("license.integrity"); }
  }

  function hasExactKeys(value, keys) {
    const actual = Object.keys(value || {}).sort();
    const expected = [...keys].sort();
    return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
  }
  function base64UrlToBytes(value) { const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/"); const binary = atob(normalized + "=".repeat((4 - normalized.length % 4) % 4)); return Uint8Array.from(binary, (character) => character.charCodeAt(0)); }
  function bytesToBase64Url(bytes) { let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte); return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""); }

  global.MCP = Object.assign(global.MCP || {}, { verifyArcawandLicenseToken, verifyArcawandLicenseTokenSync, isArcawandAuthorizationUsable, base64UrlToBytes });
})(globalThis);
