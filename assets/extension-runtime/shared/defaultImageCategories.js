(function initDefaultImageCategories(global) {
  const DEFAULT_IMAGE_CATEGORIES = [
    {
      id: "image-general",
      name: "General",
      parentId: null,
      icon: "image",
      color: "#64748b",
      order: 1,
      isSystem: true,
      isDefault: true,
      keywords: ["image", "photo", "visuel", "illustration", "asset"]
    },
    {
      id: "image-favorites",
      name: "Favorites",
      parentId: null,
      icon: "star",
      color: "#f59e0b",
      order: 2,
      isSystem: true,
      isDefault: false,
      keywords: ["favorite", "important", "reference"]
    },
    {
      id: "image-trash",
      name: "Trash",
      parentId: null,
      icon: "trash",
      color: "#6b7280",
      order: 4,
      isSystem: true,
      isDefault: false,
      keywords: ["trash", "deleted", "corbeille"]
    },
    {
      id: "image-vault",
      name: "Vault",
      parentId: null,
      icon: "vault",
      color: "#111827",
      order: 3,
      isSystem: true,
      isDefault: false,
      keywords: ["vault", "private", "protected", "secret"]
    },
    {
      id: "image-ai",
      name: "AI images",
      parentId: null,
      icon: "sparkles",
      color: "#8b5cf6",
      order: 10,
      isSystem: false,
      isDefault: false,
      keywords: ["ai", "ia", "midjourney", "dall-e", "stable diffusion", "flux", "prompt"]
    },
    { id: "image-ai-prompts", name: "Prompt results", parentId: "image-ai", icon: "wand", color: "#a855f7", order: 11, isSystem: false, isDefault: false, keywords: ["prompt", "generation", "render"] },
    { id: "image-ai-portraits", name: "AI portraits", parentId: "image-ai", icon: "user", color: "#ec4899", order: 12, isSystem: false, isDefault: false, keywords: ["portrait", "face", "avatar", "headshot"] },
    { id: "image-ai-products", name: "AI products", parentId: "image-ai", icon: "package", color: "#22c55e", order: 13, isSystem: false, isDefault: false, keywords: ["product", "packshot", "mockup"] },
    { id: "image-ai-backgrounds", name: "AI backgrounds", parentId: "image-ai", icon: "landmark", color: "#0ea5e9", order: 14, isSystem: false, isDefault: false, keywords: ["background", "wallpaper", "scene"] },
    {
      id: "image-design",
      name: "Design",
      parentId: null,
      icon: "palette",
      color: "#e50914",
      order: 20,
      isSystem: false,
      isDefault: false,
      keywords: ["design", "ui", "brand", "logo", "inspiration"]
    },
    { id: "image-design-ui", name: "UI references", parentId: "image-design", icon: "layout", color: "#f97316", order: 21, isSystem: false, isDefault: false, keywords: ["ui", "interface", "app", "dashboard"] },
    { id: "image-design-branding", name: "Branding", parentId: "image-design", icon: "badge", color: "#eab308", order: 22, isSystem: false, isDefault: false, keywords: ["logo", "brand", "identity", "colors"] },
    { id: "image-design-ads", name: "Ads creatives", parentId: "image-design", icon: "megaphone", color: "#ef4444", order: 23, isSystem: false, isDefault: false, keywords: ["ad", "creative", "banner", "campaign"] },
    {
      id: "image-web",
      name: "Web images",
      parentId: null,
      icon: "globe",
      color: "#06b6d4",
      order: 30,
      isSystem: false,
      isDefault: false,
      keywords: ["web", "site", "article", "thumbnail", "cover"]
    },
    { id: "image-web-headers", name: "Headers & hero", parentId: "image-web", icon: "panel-top", color: "#38bdf8", order: 31, isSystem: false, isDefault: false, keywords: ["hero", "header", "cover"] },
    { id: "image-web-icons", name: "Icons", parentId: "image-web", icon: "icons", color: "#94a3b8", order: 32, isSystem: false, isDefault: false, keywords: ["icon", "pictogram", "svg"] },
    { id: "image-web-screenshots", name: "Screenshots", parentId: "image-web", icon: "monitor", color: "#64748b", order: 33, isSystem: false, isDefault: false, keywords: ["screenshot", "capture", "screen"] },
    {
      id: "image-social",
      name: "Social media",
      parentId: null,
      icon: "share-2",
      color: "#f43f5e",
      order: 40,
      isSystem: false,
      isDefault: false,
      keywords: ["instagram", "tiktok", "linkedin", "youtube", "post", "thumbnail"]
    },
    { id: "image-social-instagram", name: "Instagram", parentId: "image-social", icon: "instagram", color: "#e1306c", order: 41, isSystem: false, isDefault: false, keywords: ["instagram", "reel", "story"] },
    { id: "image-social-youtube", name: "YouTube thumbnails", parentId: "image-social", icon: "youtube", color: "#ff0000", order: 42, isSystem: false, isDefault: false, keywords: ["youtube", "thumbnail", "cover"] },
    { id: "image-social-linkedin", name: "LinkedIn", parentId: "image-social", icon: "linkedin", color: "#0a66c2", order: 43, isSystem: false, isDefault: false, keywords: ["linkedin", "b2b", "post"] },
    {
      id: "image-commerce",
      name: "E-commerce",
      parentId: null,
      icon: "shopping-cart",
      color: "#16a34a",
      order: 50,
      isSystem: false,
      isDefault: false,
      keywords: ["product", "shop", "ecommerce", "woocommerce", "catalog"]
    },
    { id: "image-commerce-products", name: "Product photos", parentId: "image-commerce", icon: "package", color: "#22c55e", order: 51, isSystem: false, isDefault: false, keywords: ["product", "sku", "catalog"] },
    { id: "image-commerce-mockups", name: "Mockups", parentId: "image-commerce", icon: "box", color: "#84cc16", order: 52, isSystem: false, isDefault: false, keywords: ["mockup", "packaging", "preview"] },
    {
      id: "image-documents",
      name: "Documents",
      parentId: null,
      icon: "file-image",
      color: "#2563eb",
      order: 60,
      isSystem: false,
      isDefault: false,
      keywords: ["document", "scan", "pdf", "invoice", "receipt"]
    },
    { id: "image-documents-scans", name: "Scans", parentId: "image-documents", icon: "scan", color: "#3b82f6", order: 61, isSystem: false, isDefault: false, keywords: ["scan", "document", "paper"] },
    { id: "image-documents-receipts", name: "Receipts & invoices", parentId: "image-documents", icon: "receipt", color: "#0ea5e9", order: 62, isSystem: false, isDefault: false, keywords: ["receipt", "invoice", "bill"] }
  ];

  global.MCP = Object.assign(global.MCP || {}, { DEFAULT_IMAGE_CATEGORIES });
})(globalThis);
