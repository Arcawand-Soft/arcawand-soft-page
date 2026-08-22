(function initLicenseConfig(global) {
  const LICENSE_SERVICE_BASE = "https://licenses.arcawand-soft.com";
  global.MCP = Object.assign(global.MCP || {}, {
    DODO_ENTITLEMENT_ID: "ent_0NeBTnBGWCkhB0Harn6kj",
    LICENSE_SERVICE_BASE,
    LICENSE_ISSUER: LICENSE_SERVICE_BASE,
    LICENSE_PUBLIC_KEYS: Object.freeze({
      "ucp-2026-01": Object.freeze({ kty: "OKP", crv: "Ed25519", x: "cFpyFp-zyS8BUh-0LoWeAz3Fi6ObwP0jYwwK4rubSjA" })
    })
  });
})(globalThis);
