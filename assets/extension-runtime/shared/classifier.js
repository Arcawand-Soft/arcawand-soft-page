(function initClassifier(global) {
  const { CONTENT_TYPES, CATEGORY_GENERAL } = global.MCP;

  function classifyContent(content) {
    const text = String(content || "").trim();
    const lower = text.toLowerCase();
    let type = CONTENT_TYPES.TEXT;
    let suggestedCategory = CATEGORY_GENERAL;
    const tags = [];

    if (!text) {
      return { type: CONTENT_TYPES.UNKNOWN, suggestedCategory, tags };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^https?:\/\/[^\s]+$/i;
    const phoneRegex = /^\+?[0-9\s().-]{7,}$/;
    const htmlRegex = /<\/?(div|p|span|a|section|article|br|ul|li|strong|em|html|body)\b/i;

    if (emailRegex.test(text)) {
      type = CONTENT_TYPES.EMAIL;
      suggestedCategory = { id: "emails", name: "Emails", icon: "mail", color: "#0891b2" };
      tags.push("email");
    } else if (urlRegex.test(text)) {
      type = CONTENT_TYPES.URL;
      suggestedCategory = { id: "links", name: "Liens", icon: "link", color: "#2563eb" };
      tags.push("url");
    } else if (htmlRegex.test(text)) {
      type = CONTENT_TYPES.HTML;
      suggestedCategory = { id: "code", name: "Code", icon: "code", color: "#16a34a" };
      tags.push("html");
    } else if (looksLikeJson(text) || looksLikeCode(text)) {
      type = CONTENT_TYPES.CODE;
      suggestedCategory = { id: "code", name: "Code", icon: "code", color: "#16a34a" };
      tags.push(looksLikeJson(text) ? "json" : "code");
    } else if (phoneRegex.test(text)) {
      type = CONTENT_TYPES.PHONE;
      suggestedCategory = { id: "phones", name: "Téléphones", icon: "phone", color: "#0f766e" };
      tags.push("telephone");
    } else if (looksLikeAddress(lower)) {
      type = CONTENT_TYPES.ADDRESS;
      suggestedCategory = { id: "addresses", name: "Adresses", icon: "map-pin", color: "#9333ea" };
      tags.push("adresse");
    }

    if (/(agis comme|tu es un expert|génère|genere|prompt|chatgpt)/i.test(text)) {
      tags.push("prompt");
    }

    if (/(bonjour|cordialement|merci pour votre retour|bien à vous|suite à votre message)/i.test(text)) {
      tags.push("reponse");
    }

    return { type, suggestedCategory, tags: [...new Set(tags)] };
  }

  function looksLikeJson(text) {
    if (!/^\s*[\[{]/.test(text)) return false;
    try {
      JSON.parse(text);
      return true;
    } catch (error) {
      return false;
    }
  }

  function looksLikeCode(text) {
    return /(?:function\s+\w+|const\s+\w+|let\s+\w+|class\s+\w+|=>|<\/\w+>|;\s*$|\{[\s\S]*\})/.test(text);
  }

  function looksLikeAddress(lower) {
    return /\d{1,5}\s+[\w\s'-]+/.test(lower) && /(rue|avenue|boulevard|impasse|chemin|route|street|road|paris|france)/.test(lower);
  }

  global.MCP = Object.assign(global.MCP || {}, { classifyContent });
})(globalThis);
