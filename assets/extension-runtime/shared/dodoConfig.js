(function initDodoConfig(global) {
  const DODO_ENV = "live";
  const DODO_PAYMENT_LINK_LIVE = "https://checkout.dodopayments.com/buy/pdt_0NeBVHHvl7TdkOznAvJOk?quantity=1";
  const DODO_PRODUCT_ID = "pdt_0NeBVHHvl7TdkOznAvJOk";
  const APP_ID = "ultimate_clipboard_pro";
  const PLAN_ID = "pro_lifetime";

  function normalizeDodoEnv(value) {
    return "live";
  }

  function getDodoConfig(envOverride = "") {
    const env = normalizeDodoEnv(envOverride || global.MCP?.currentDodoEnv || DODO_ENV);
    return {
      env,
      paymentLink: DODO_PAYMENT_LINK_LIVE,
      appId: APP_ID,
      planId: PLAN_ID
    };
  }

  global.MCP = Object.assign(global.MCP || {}, {
    DODO_ENV,
    DODO_PAYMENT_LINK_LIVE,
    DODO_PRODUCT_ID,
    DODO_APP_ID: APP_ID,
    DODO_PLAN_ID: PLAN_ID,
    normalizeDodoEnv,
    getDodoConfig
  });
})(globalThis);
