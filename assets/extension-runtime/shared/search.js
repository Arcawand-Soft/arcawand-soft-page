(function initSearch(global) {
  function tokenize(query) {
    return global.MCP.normalizeContent(query)
      .split(" ")
      .map((token) => token.trim())
      .filter(Boolean);
  }

  function searchItems(items, query, categories = [], options = {}) {
    const tokens = tokenize(query);
    const filters = options.filters || {};
    const maxResults = Number(options.maxResults || 80);
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const now = Date.now();

    const normalized = global.MCP.sortItems(items)
      .filter((item) => !isVaultSearchItem(item))
      .map((item) => normalizeItemForSearch(item, categoryById, options.language || "en"))
      .filter((item) => passesFilters(item, filters, now));

    if (!tokens.length) {
      return normalized.slice(0, maxResults);
    }

    return normalized
      .map((item) => ({ item, score: scoreItem(item, tokens, options) }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score || (b.item.lastCopiedAt || b.item.createdAt || 0) - (a.item.lastCopiedAt || a.item.createdAt || 0))
      .slice(0, maxResults)
      .map((result) => result.item);
  }

  function normalizeItemForSearch(item, categoryById, language = "en") {
    const categoryPath = global.MCP.getCategoryPath(item.categoryId, [...categoryById.values()], language);
    return Object.assign({
      title: "",
      tags: [],
      note: "",
      updatedAt: item.createdAt || Date.now()
    }, item, { categoryPath });
  }

  function passesFilters(item, filters, now) {
    if (filters.favorites && !item.isFavorite) return false;
    if (filters.pinned && !item.isPinned) return false;
    if (filters.categoryId && item.categoryId !== filters.categoryId) return false;
    if (filters.dateRange === "today" && !isAfter(item.createdAt, now, 1)) return false;
    if (filters.dateRange === "7d" && !isAfter(item.createdAt, now, 7)) return false;
    if (filters.dateRange === "30d" && !isAfter(item.createdAt, now, 30)) return false;
    if (filters.length === "short" && String(item.content || "").length > 180) return false;
    if (filters.length === "long" && String(item.content || "").length <= 180) return false;
    return true;
  }

  function isAfter(timestamp, now, days) {
    return Number(timestamp || 0) >= now - days * 24 * 60 * 60 * 1000;
  }

  function scoreItem(item, tokens, options) {
    if (!tokens.length) return baseScore(item, options);
    const semanticTokens = expandSemanticTokens(tokens);
    const fields = [
      { value: item.title, weight: 18 },
      { value: item.content, weight: 12 },
      { value: (item.tags || []).join(" "), weight: 16 },
      { value: item.preview, weight: 8 },
      { value: item.categoryPath || item.categoryName, weight: 7 },
      { value: item.sourceDomain, weight: 5 },
      { value: item.sourceUrl, weight: 4 },
      { value: item.note, weight: 6 }
    ];
    const relevanceScore = tokens.reduce((total, token) => {
      return total + fields.reduce((fieldTotal, field) => {
        return fieldTotal + semanticFieldScore(field.value, token, field.weight, semanticTokens.get(token) || []);
      }, 0);
    }, 0);
    return relevanceScore > 0 ? relevanceScore + baseScore(item, options) : 0;
  }

  function semanticFieldScore(rawValue, token, weight, relatedTokens) {
    const value = global.MCP.normalizeContent(String(rawValue || "").slice(0, 8000));
    if (!value) return 0;
    if (value === token) return weight * 2;
    if (value.includes(token)) return weight;
    const valueTokens = value.split(" ").filter(Boolean);
    if (!valueTokens.length) return 0;
    if (valueTokens.some((candidate) => stemMatch(candidate, token))) return weight * 0.5;
    if (valueTokens.some((candidate) => diceCoefficient(candidate, token) >= 0.74)) return weight * 0.34;
    for (const related of relatedTokens) {
      if (related === token) continue;
      if (value.includes(related)) return weight * 0.42;
      if (valueTokens.some((candidate) => stemMatch(candidate, related) || diceCoefficient(candidate, related) >= 0.78)) return weight * 0.24;
    }
    return 0;
  }

  function expandSemanticTokens(tokens) {
    const groups = [
      ["email", "mail", "e-mail", "courriel", "correo", "posta"],
      ["invoice", "bill", "receipt", "facture", "rechnung", "factura", "fattura"],
      ["client", "customer", "prospect", "cliente", "kunde"],
      ["password", "pwd", "secret", "token", "api", "apikey", "key", "cle", "clave"],
      ["prompt", "ai", "ia", "chatgpt", "llm"],
      ["bug", "error", "exception", "erreur", "fehler", "errore"],
      ["meeting", "call", "appointment", "reunion", "termin", "riunione"],
      ["address", "adresse", "direccion", "indirizzo"],
      ["phone", "tel", "telephone", "telefono"],
      ["image", "photo", "screenshot", "capture", "picture"],
      ["code", "snippet", "function", "class", "css", "html", "sql", "json", "script"],
      ["payment", "checkout", "license", "licence", "lizenz", "licencia", "licenza"],
      ["drive", "cloud", "backup", "sync", "synchronisation", "sincronizacion", "sincronizzazione"],
      ["source", "url", "page", "site", "domain", "domaine", "dominio"]
    ];
    return new Map(tokens.map((token) => {
      const related = new Set([token]);
      groups.forEach((group) => {
        if (group.includes(token)) group.forEach((value) => related.add(value));
      });
      return [token, [...related]];
    }));
  }

  function stemMatch(left, right) {
    if (left.length < 4 || right.length < 4) return false;
    return left.startsWith(right) || right.startsWith(left)
      || stripCommonSuffix(left).startsWith(stripCommonSuffix(right))
      || stripCommonSuffix(right).startsWith(stripCommonSuffix(left));
  }

  function stripCommonSuffix(value) {
    return String(value || "").replace(/(?:ing|tion|ions|ement|ments|ungen|zione|zioni|idad|idades|es|s)$/i, "");
  }

  function diceCoefficient(left, right) {
    if (!left || !right || left.length < 3 || right.length < 3) return 0;
    if (left === right) return 1;
    const leftPairs = bigrams(left);
    const rightPairs = bigrams(right);
    if (!leftPairs.length || !rightPairs.length) return 0;
    const rightCounts = new Map();
    rightPairs.forEach((pair) => rightCounts.set(pair, (rightCounts.get(pair) || 0) + 1));
    let matches = 0;
    leftPairs.forEach((pair) => {
      const count = rightCounts.get(pair) || 0;
      if (count <= 0) return;
      matches += 1;
      rightCounts.set(pair, count - 1);
    });
    return (2 * matches) / (leftPairs.length + rightPairs.length);
  }

  function bigrams(value) {
    const pairs = [];
    for (let index = 0; index < value.length - 1; index += 1) pairs.push(value.slice(index, index + 2));
    return pairs;
  }

  function baseScore(item, options = {}) {
    let score = 0;
    if (item.isFavorite && options.favoritesFirst !== false) score += 8;
    if (item.isPinned) score += 10;
    if (item.lastUsedAt) score += 4;
    score += Math.min(Number(item.usageCount || 0), 10);
    return score;
  }

  function isVaultSearchItem(item) {
    if (global.MCP?.isVaultItem) return global.MCP.isVaultItem(item);
    const ids = new Set(["vault", "image-vault", "dev-vault"]);
    return ids.has(String(item?.categoryId || "")) || ids.has(String(item?.languageId || ""));
  }

  global.MCP = Object.assign(global.MCP || {}, { searchItems });
})(globalThis);
