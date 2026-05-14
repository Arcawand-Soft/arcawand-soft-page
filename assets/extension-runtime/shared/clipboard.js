(function initClipboard(global) {
  async function readClipboardText() {
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      throw new Error("Chrome bloque la lecture du presse-papiers pour le moment.");
    }
  }

  async function writeClipboardText(text) {
    try {
      await navigator.clipboard.writeText(String(text || ""));
      return true;
    } catch (error) {
      throw new Error("Impossible d'écrire dans le presse-papiers. Réessayez après une action utilisateur.");
    }
  }

  async function copyItemToClipboard(itemId) {
    const items = await global.MCP.getClipboardItems();
    const item = items.find((current) => current.id === itemId);
    if (!item) throw new Error("Élément introuvable.");
    await writeClipboardText(item.content);
    await global.MCP.updateClipboardItem(itemId, {
      usageCount: (item.usageCount || 0) + 1,
      lastUsedAt: Date.now()
    });
    return item;
  }

  global.MCP = Object.assign(global.MCP || {}, {
    readClipboardText,
    writeClipboardText,
    copyItemToClipboard
  });
})(globalThis);
