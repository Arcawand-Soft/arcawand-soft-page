(function initFeatureGate(global) {
  const PRO_FEATURES = Object.freeze([
    "extendedHistory",
    "unlimitedCategories",
    "unlimitedSubcategories",
    "unlimitedFavorites",
    "unlimitedPinnedItems",
    "advancedImageCapture",
    "itemComposition",
    "reverseSearch",
    "advancedSearch",
    "exportImport",
    "premiumThemes",
    "allTools",
    "driveSync",
    "trashManagement",
    "vault",
    "pageMarkdownCapture",
    "captureVersioning"
  ]);

  const PRO_TOOL_IDS = Object.freeze([
    "imageText",
    "snippetLibrary",
    "promptTemplateManager",
    "emojiPicker",
    "informationExtractor",
    "duplicateDetector",
    "longTextSplitter",
    "variableInjector",
    "caseConverter",
    "advancedCounter"
  ]);
  const FREE_CAPTURE_LIMITS = Object.freeze({
    text: 5,
    dev: 5,
    image: 5
  });

  function currentPlan(settings = {}) {
    const currentEnv = global.MCP?.normalizeDodoEnv?.(settings.dodoEnv || global.MCP?.DODO_ENV || "live") || "live";
    const licenseEnv = global.MCP?.normalizeDodoEnv?.(settings.licenseDodoEnv || currentEnv) || currentEnv;
    const hasIntegrityProof = Boolean(settings.licenseProof && settings.licenseProofVersion === "v1");
    return settings.plan === "pro" && settings.licenseStatus === "active" && licenseEnv === currentEnv && hasIntegrityProof ? "pro" : "free";
  }

  function isPro(settings = {}) {
    return currentPlan(settings) === "pro";
  }

  function canUseFeature(feature, settings = {}) {
    if (!PRO_FEATURES.includes(feature)) return true;
    return isPro(settings);
  }

  function isProTool(toolId) {
    return PRO_TOOL_IDS.includes(toolId);
  }

  function canUseTool(toolId, settings = {}) {
    if (!isProTool(toolId)) return true;
    return isPro(settings);
  }

  function freeCaptureLimitFor(mediaType) {
    return FREE_CAPTURE_LIMITS[mediaType] || 0;
  }

  function canCreateCapture(mediaType, settings = {}, items = []) {
    const limit = freeCaptureLimitFor(mediaType);
    if (!limit || isPro(settings)) return true;
    return countActiveCaptures(items) < limit;
  }

  function countActiveCaptures(items = []) {
    const trashCategoryIds = new Set(["trash", "dev-trash", "image-trash"]);
    if (!Array.isArray(items)) return 0;
    return items.filter((item) => {
      if (!item) return false;
      if (item.trashedAt) return false;
      if (trashCategoryIds.has(String(item.categoryId || ""))) return false;
      if (trashCategoryIds.has(String(item.languageId || ""))) return false;
      return true;
    }).length;
  }

  function createCaptureLimitError(mediaType) {
    const limit = freeCaptureLimitFor(mediaType);
    const errorName = mediaType === "image"
      ? "free-image-capture-limit"
      : mediaType === "dev"
        ? "free-code-capture-limit"
        : "free-text-capture-limit";
    const errorCode = mediaType === "image"
      ? "FREE_IMAGE_CAPTURE_LIMIT"
      : mediaType === "dev"
        ? "FREE_CODE_CAPTURE_LIMIT"
        : "FREE_TEXT_CAPTURE_LIMIT";
    const error = new Error(errorName);
    error.code = errorCode;
    error.mediaType = mediaType;
    error.limit = limit;
    return error;
  }

  global.MCP = Object.assign(global.MCP || {}, {
    PRO_FEATURES,
    PRO_TOOL_IDS,
    FREE_CAPTURE_LIMITS,
    countActiveCaptures,
    currentPlan,
    canUseFeature,
    isProTool,
    canUseTool,
    freeCaptureLimitFor,
    canCreateCapture,
    createCaptureLimitError,
    isProPlan: isPro
  });
})(globalThis);
