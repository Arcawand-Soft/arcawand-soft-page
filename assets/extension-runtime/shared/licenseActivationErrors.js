(function initLicenseActivationErrors(global) {
  function flattenErrorPayload(value, output = [], depth = 0) {
    if (depth > 4 || value == null) return output;
    if (typeof value === "string" || typeof value === "number") {
      output.push(String(value));
      return output;
    }
    if (Array.isArray(value)) {
      value.forEach((entry) => flattenErrorPayload(entry, output, depth + 1));
      return output;
    }
    if (typeof value === "object") {
      ["code", "type", "error", "message", "detail", "reason", "description"].forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(value, key)) flattenErrorPayload(value[key], output, depth + 1);
      });
    }
    return output;
  }

  function classifyDodoLicenseError(data = {}, status = 0) {
    const raw = flattenErrorPayload(data).join(" ").toLowerCase().replace(/[._-]+/g, " ");
    const activationTerms = "(?:activation|activations|device|devices|instance|instances|seat|seats)";
    const limitTerms = "(?:limit|maximum|max|exceeded|remaining|reached|left|available|too many|quota)";
    const limitPattern = new RegExp(`(?:${activationTerms}.{0,40}${limitTerms}|${limitTerms}.{0,40}${activationTerms}|no.{0,20}${activationTerms}.{0,20}remaining)`);
    if (/license key limit reached/.test(raw) || limitPattern.test(raw)) return "license.activationLimit";

    const invalidPattern = /(?:invalid|inactive|disabled|expired|revoked|unknown|unrecognized|not\s+found|does\s+not\s+exist).{0,35}(?:license|key)|(?:license|key).{0,35}(?:invalid|inactive|disabled|expired|revoked|unknown|unrecognized|not\s+found|does\s+not\s+exist)/;
    if (invalidPattern.test(raw) || Number(status) === 404) return "license.invalid";
    return "license.activationFailed";
  }

  function normalizeLicenseActivationError(value) {
    const code = String(value || "").trim();
    return new Set([
      "license.activationLimit",
      "license.invalid",
      "license.network",
      "license.empty",
      "license.activationFailed"
    ]).has(code) ? code : "license.activationFailed";
  }

  global.MCP = Object.assign(global.MCP || {}, {
    classifyDodoLicenseError,
    normalizeLicenseActivationError
  });
})(globalThis);
