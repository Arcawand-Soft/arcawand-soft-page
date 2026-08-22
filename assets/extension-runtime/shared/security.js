(function initSecurityBoundaries(global) {
  const SAFE_SOURCE_PROTOCOLS = new Set(["https:", "http:", "file:"]);
  const SAFE_EXTERNAL_PROTOCOLS = new Set(["https:", "http:", "mailto:"]);
  const SAFE_RASTER_DATA_URL = /^data:image\/(?:png|jpe?g|gif|webp|avif|bmp|x-icon);base64,[a-z0-9+/=\s]+$/i;
  const BILLING_HOSTS = ["dodopayments.com", "arcawand-soft.com"];

  function normalizedUrl(value) {
    const candidate = String(value || "").trim();
    if (!candidate || /[\u0000-\u001f\u007f]/.test(candidate)) return null;
    try {
      return new URL(candidate);
    } catch {
      return null;
    }
  }

  function isHostOrSubdomain(hostname, allowedHost) {
    const host = String(hostname || "").toLowerCase();
    const allowed = String(allowedHost || "").toLowerCase();
    return host === allowed || host.endsWith(`.${allowed}`);
  }

  function sanitizeUrlForPurpose(value, purpose = "source") {
    const candidate = String(value || "").trim();
    if (purpose === "image-resource" && SAFE_RASTER_DATA_URL.test(candidate)) return candidate;
    const parsed = normalizedUrl(candidate);
    if (!parsed) return "";

    if (purpose === "billing") {
      if (parsed.protocol !== "https:") return "";
      return BILLING_HOSTS.some((host) => isHostOrSubdomain(parsed.hostname, host)) ? parsed.href : "";
    }
    if (purpose === "external") {
      return SAFE_EXTERNAL_PROTOCOLS.has(parsed.protocol) ? parsed.href : "";
    }
    if (purpose === "image-resource") {
      return SAFE_SOURCE_PROTOCOLS.has(parsed.protocol) ? parsed.href : "";
    }
    return SAFE_SOURCE_PROTOCOLS.has(parsed.protocol) ? parsed.href : "";
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function setSafeRichText(target, value, allowedTags = ["strong"]) {
    if (!target?.replaceChildren || !global.document?.createElement) return false;
    const allowed = new Set(allowedTags.map((tag) => String(tag || "").toUpperCase()));
    const template = global.document.createElement("template");
    template.innerHTML = String(value || "");
    const fragment = global.document.createDocumentFragment();

    const appendSafe = (source, destination) => {
      for (const child of source.childNodes) {
        if (child.nodeType === 3) {
          destination.appendChild(global.document.createTextNode(child.nodeValue || ""));
          continue;
        }
        if (child.nodeType !== 1) continue;
        if (!allowed.has(child.tagName)) {
          appendSafe(child, destination);
          continue;
        }
        const clean = global.document.createElement(child.tagName.toLowerCase());
        appendSafe(child, clean);
        destination.appendChild(clean);
      }
    };

    appendSafe(template.content, fragment);
    target.replaceChildren(fragment);
    return true;
  }

  global.MCP = Object.assign(global.MCP || {}, {
    sanitizeUrlForPurpose,
    escapeHtml,
    setSafeRichText
  });
})(globalThis);
