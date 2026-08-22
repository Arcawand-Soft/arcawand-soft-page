(function initSourceLocators(global) {
  "use strict";

  function sourceLocatorStorageKey(itemId, prefix = "") {
    const id = String(itemId || "").trim();
    const resolvedPrefix = prefix || global.MCP?.STORAGE_KEYS?.SOURCE_LOCATOR_PREFIX || "mcp_source_locator_";
    return id ? `${resolvedPrefix}${id}` : "";
  }

  function sanitizeSourceLocator(locator) {
    if (!locator || typeof locator !== "object") return null;
    const trim = (value, limit = 600) => String(value || "").trim().slice(0, limit);
    const stringList = (value, limit = 8) => [...new Set((Array.isArray(value) ? value : [])
      .map((entry) => trim(entry))
      .filter(Boolean))].slice(0, limit);
    const attributes = {};
    Object.entries(locator.attributes || {}).slice(0, 12).forEach(([name, value]) => {
      const safeName = trim(name, 80);
      const safeValue = trim(value, 300);
      if (safeName && safeValue) attributes[safeName] = safeValue;
    });
    const sanitizeRecord = (value, maxEntries = 20, valueLimit = 500) => {
      const record = {};
      Object.entries(value && typeof value === "object" ? value : {}).slice(0, maxEntries).forEach(([name, entry]) => {
        const safeName = trim(name, 100);
        const safeValue = trim(entry, valueLimit);
        if (safeName && safeValue) record[safeName] = safeValue;
      });
      return record;
    };
    const geometry = locator.geometry && typeof locator.geometry === "object"
      ? Object.assign(
        Object.fromEntries(["xRatio", "yRatio", "widthRatio", "heightRatio"].map((key) => [
          key,
          Math.max(0, Math.min(1, Number(locator.geometry[key]) || 0))
        ])),
        Object.fromEntries([
          "documentX", "documentY", "renderedWidth", "renderedHeight",
          "pageWidth", "pageHeight", "viewportWidth", "viewportHeight",
          "scrollX", "scrollY"
        ].map((key) => [key, Math.max(0, Number(locator.geometry[key]) || 0)]))
      )
      : null;
    return {
      version: Math.max(1, Math.min(2, Number(locator.version) || 1)),
      kind: locator.kind === "image" ? "image" : locator.kind === "code" ? "code" : "text",
      pageUrl: trim(locator.pageUrl, 3000),
      canonicalUrl: trim(locator.canonicalUrl, 3000),
      capturedAt: Number(locator.capturedAt) || Date.now(),
      selectors: stringList(locator.selectors),
      containerSelectors: stringList(locator.containerSelectors, 6),
      tagName: trim(locator.tagName, 40).toLowerCase(),
      attributes,
      textQuote: locator.textQuote && typeof locator.textQuote === "object" ? {
        exact: trim(locator.textQuote.exact, locator.kind === "code" ? 50000 : 1800),
        prefix: trim(locator.textQuote.prefix, 240),
        suffix: trim(locator.textQuote.suffix, 240),
        containerText: trim(locator.textQuote.containerText, 1200),
        heading: trim(locator.textQuote.heading, 500)
      } : null,
      code: locator.code && typeof locator.code === "object" ? {
        languageId: trim(locator.code.languageId, 100),
        languageName: trim(locator.code.languageName, 160),
        signature: trim(locator.code.signature, 160),
        lineCount: Math.max(0, Number(locator.code.lineCount) || 0),
        charCount: Math.max(0, Number(locator.code.charCount) || 0),
        anchors: stringList(locator.code.anchors, 12).map((entry) => trim(entry, 500)),
        classTokens: stringList(locator.code.classTokens, 20),
        ancestorTokens: stringList(locator.code.ancestorTokens, 36),
        dataAttributes: sanitizeRecord(locator.code.dataAttributes, 24, 600)
      } : null,
      conversation: locator.conversation && typeof locator.conversation === "object" ? {
        platform: trim(locator.conversation.platform, 40).toLowerCase(),
        role: ["user", "assistant"].includes(locator.conversation.role)
          ? locator.conversation.role
          : "",
        messageId: trim(locator.conversation.messageId, 500),
        signature: trim(locator.conversation.signature, 160),
        charCount: Math.max(0, Number(locator.conversation.charCount) || 0),
        turnIndex: Math.max(-1, Number.isFinite(Number(locator.conversation.turnIndex))
          ? Number(locator.conversation.turnIndex)
          : -1),
        roleIndex: Math.max(-1, Number.isFinite(Number(locator.conversation.roleIndex))
          ? Number(locator.conversation.roleIndex)
          : -1),
        startAnchor: trim(locator.conversation.startAnchor, 900),
        endAnchor: trim(locator.conversation.endAnchor, 900),
        turnSelectors: stringList(locator.conversation.turnSelectors, 8),
        contentSelectors: stringList(locator.conversation.contentSelectors, 8),
        scrollSelectors: stringList(locator.conversation.scrollSelectors, 6)
      } : null,
      image: locator.image && typeof locator.image === "object" ? {
        urls: stringList(locator.image.urls, 28),
        alt: trim(locator.image.alt, 700),
        title: trim(locator.image.title, 700),
        caption: trim(locator.image.caption, 900),
        nearbyText: trim(locator.image.nearbyText, 1800),
        nearbyHeadings: stringList(locator.image.nearbyHeadings, 8),
        anchorHref: trim(locator.image.anchorHref, 3000),
        anchorText: trim(locator.image.anchorText, 900),
        parentSelectors: stringList(locator.image.parentSelectors, 12),
        classTokens: stringList(locator.image.classTokens, 20),
        ancestorTokens: stringList(locator.image.ancestorTokens, 36),
        dataAttributes: sanitizeRecord(locator.image.dataAttributes, 24, 600),
        documentIndex: Math.max(-1, Number.isFinite(Number(locator.image.documentIndex)) ? Number(locator.image.documentIndex) : -1),
        sameAltIndex: Math.max(-1, Number.isFinite(Number(locator.image.sameAltIndex)) ? Number(locator.image.sameAltIndex) : -1),
        renderedWidth: Number(locator.image.renderedWidth) || null,
        renderedHeight: Number(locator.image.renderedHeight) || null,
        width: Number(locator.image.width) || null,
        height: Number(locator.image.height) || null
      } : null,
      geometry
    };
  }

  global.MCP = Object.assign(global.MCP || {}, {
    sourceLocatorStorageKey,
    sanitizeSourceLocator
  });
})(globalThis);
