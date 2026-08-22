(function initPageMarkdownCapture(global) {
  "use strict";

  function createPageMarkdownCapture({ document, location, Node, viewport, onLocated = () => {}, faviconUrl = () => "" }) {
    function capture() {
      const source = readableRoot();
      const title = clean(document.title || source?.querySelector?.("h1,h2")?.textContent || location.hostname || "Untitled");
      const markdown = toMarkdown(source || document.body, { depth: 0 }).replace(/\n{3,}/g, "\n\n").trim();
      const content = [`# ${title}`, "", `> Source: ${location.href}`, "", markdown].filter(Boolean).join("\n").replace(/\n{3,}/g, "\n\n").trim();
      onLocated(sourceRect(source), title || markdown);
      return { content, sourceUrl: location.href, sourceTitle: document.title || title, sourceDomain: location.hostname || "", sourceFaviconUrl: faviconUrl(), title };
    }
    function readableRoot() {
      return document.querySelector("main, article, [role='main'], .post, .article, .content, #content") || document.body;
    }
    function sourceRect(source) {
      const candidate = source?.querySelector?.("h1,h2,p") || source || document.body;
      const rect = candidate?.getBoundingClientRect?.();
      if (!rect || rect.width <= 0 || rect.height <= 0) return null;
      return { left: Math.max(0, rect.left), top: Math.max(0, rect.top), right: Math.min(viewport.innerWidth, rect.right), bottom: Math.min(viewport.innerHeight, rect.bottom), width: Math.min(rect.width, viewport.innerWidth), height: Math.min(rect.height, viewport.innerHeight) };
    }
    function toMarkdown(node, context = {}) {
      if (!node) return "";
      if (node.nodeType === Node.TEXT_NODE) return clean(node.textContent || "");
      if (node.nodeType !== Node.ELEMENT_NODE) return "";
      const tag = node.tagName.toLowerCase();
      if (["script", "style", "noscript", "svg", "canvas", "iframe", "button", "input", "select", "textarea", "nav", "footer"].includes(tag)) return "";
      const children = () => Array.from(node.childNodes).map((child) => toMarkdown(child, context)).filter(Boolean).join(tag === "p" ? " " : "\n").replace(/[ \t]+\n/g, "\n").trim();
      if (/h[1-6]/.test(tag)) { const value = children(); return value ? `${"#".repeat(Math.min(6, Number(tag.slice(1)) + (context.depth || 0)))} ${value}\n` : ""; }
      if (tag === "p") return children();
      if (tag === "br") return "\n";
      if (tag === "strong" || tag === "b") return wrap(children(), "**");
      if (tag === "em" || tag === "i") return wrap(children(), "_");
      if (tag === "code") { const value = clean(node.textContent || ""); return value.includes("\n") ? `\`\`\`\n${value}\n\`\`\`` : `\`${value}\``; }
      if (tag === "pre") { const value = String(node.textContent || "").trim(); return value ? `\`\`\`\n${value}\n\`\`\`` : ""; }
      if (tag === "a") { const value = children() || clean(node.getAttribute("href") || ""); const href = node.href || node.getAttribute("href") || ""; return href && value ? `[${value}](${href})` : value; }
      if (tag === "img") { const alt = clean(node.getAttribute("alt") || node.getAttribute("title") || ""); const src = node.currentSrc || node.src || ""; return src ? `![${alt}](${src})` : ""; }
      if (tag === "li") { const value = children(); return value ? `- ${value.replace(/\n/g, "\n  ")}` : ""; }
      if (tag === "ul" || tag === "ol") return Array.from(node.children).map((child) => toMarkdown(child, context)).filter(Boolean).join("\n");
      if (tag === "blockquote") { const value = children(); return value ? value.split("\n").map((line) => `> ${line}`).join("\n") : ""; }
      const value = children();
      return value && ["div", "section", "article", "main", "header"].includes(tag) ? `${value}\n` : value;
    }
    const wrap = (text, marker) => text ? `${marker}${text}${marker}` : "";
    const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
    return Object.freeze({ capture, toMarkdown });
  }

  global.MCP = global.MCP || {};
  global.MCP.createPageMarkdownCapture = createPageMarkdownCapture;
})(globalThis);
