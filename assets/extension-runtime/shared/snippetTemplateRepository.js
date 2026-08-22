(function initSnippetTemplateRepository(global) {
  "use strict";

  function createSnippetTemplateRepository({ keys, createId, read, write, removeItems, now = Date.now }) {
    async function getCollection(key) {
      const data = await read(key);
      return Array.isArray(data?.[key]) ? data[key] : [];
    }
    async function saveCollectionItem(key, prefix, value, defaults = {}) {
      const items = await getCollection(key);
      const timestamp = now();
      const item = Object.assign({ id: createId(prefix), createdAt: timestamp }, defaults, value || {}, { updatedAt: timestamp });
      await write({ [key]: items.filter((entry) => entry.id !== item.id).concat(item) });
      return item;
    }
    const getSnippets = () => getCollection(keys.SNIPPETS);
    const saveSnippet = (snippet) => saveCollectionItem(keys.SNIPPETS, "snippet", snippet, { tags: [], usageCount: 0 });
    const deleteSnippet = (id) => removeItems(keys.SNIPPETS, id);
    const getTemplates = () => getCollection(keys.TEMPLATES);
    const saveTemplate = (template) => saveCollectionItem(keys.TEMPLATES, "template", template);
    const deleteTemplate = (id) => removeItems(keys.TEMPLATES, id);
    return Object.freeze({ getSnippets, saveSnippet, deleteSnippet, getTemplates, saveTemplate, deleteTemplate });
  }

  global.MCP = global.MCP || {};
  global.MCP.createSnippetTemplateRepository = createSnippetTemplateRepository;
})(globalThis);
