(function initCaptureDedupe(global) {
  "use strict";

  function createCaptureDedupe({ ttlMs = 6000, now = Date.now, onClear = () => {} } = {}) {
    const signatures = new Map();
    function remember(signature) {
      const timestamp = now();
      signatures.set(signature, timestamp);
      prune(timestamp);
    }
    function has(signature) {
      const timestamp = signatures.get(signature);
      if (!timestamp) return false;
      if (now() - timestamp <= ttlMs) return true;
      signatures.delete(signature);
      return false;
    }
    function clear(mediaType) {
      const prefixes = mediaType === "image" ? ["image:", "native-image:"] : mediaType === "dev" ? ["dev:", "text:"] : ["text:"];
      for (const key of signatures.keys()) if (prefixes.some((prefix) => String(key).startsWith(prefix))) signatures.delete(key);
      onClear(mediaType);
    }
    function prune(timestamp = now()) {
      for (const [key, savedAt] of signatures) if (timestamp - savedAt > ttlMs) signatures.delete(key);
    }
    return Object.freeze({ remember, has, clear, size: () => signatures.size });
  }

  global.MCP = global.MCP || {};
  global.MCP.createCaptureDedupe = createCaptureDedupe;
})(globalThis);
