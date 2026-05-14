(async function bootUltimateClipboardProRealDemo() {
  "use strict";

  const root = document.querySelector(".ucp-demo-root");
  if (!root || !window.location.pathname.includes("/ultimate-clipboard-pro/demo")) return;

  const runtimeBase = "/assets/extension-runtime/";
  let managerShell = null;
  let blockedDialog = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${src}`));
      document.head.appendChild(script);
    });
  }

  function showBlocked() {
    const runtime = window.UCP_DEMO_RUNTIME;
    const lang = runtime?.resolveLanguage?.() || "en";
    const copy = runtime?.copyByLang?.[lang] || runtime?.copyByLang?.en || {
      blockedTitle: "Demo mode",
      blocked: "This action is disabled in the website demo."
    };
    if (!blockedDialog) {
      blockedDialog = document.createElement("section");
      blockedDialog.className = "ucp-real-demo-dialog";
      blockedDialog.setAttribute("role", "dialog");
      blockedDialog.setAttribute("aria-modal", "false");

      const panel = document.createElement("div");
      panel.className = "ucp-real-demo-dialog__panel";

      const title = document.createElement("h2");
      title.className = "ucp-real-demo-dialog__title";
      title.dataset.role = "title";

      const text = document.createElement("p");
      text.className = "ucp-real-demo-dialog__text";
      text.dataset.role = "text";

      const close = document.createElement("button");
      close.className = "ucp-real-demo-dialog__close";
      close.type = "button";
      close.setAttribute("aria-label", "Close");
      close.textContent = "×";
      close.addEventListener("click", () => blockedDialog.classList.remove("is-visible"));

      panel.append(close, title, text);
      blockedDialog.append(panel);
      document.body.append(blockedDialog);
    }
    blockedDialog.querySelector('[data-role="title"]').textContent = copy.blockedTitle;
    blockedDialog.querySelector('[data-role="text"]').textContent = copy.blocked;
    blockedDialog.classList.add("is-visible");
    window.setTimeout(() => blockedDialog?.classList.remove("is-visible"), 3200);
  }

  function closeManager() {
    if (!managerShell) return;
    managerShell.classList.remove("is-visible");
    window.setTimeout(() => {
      managerShell?.remove();
      managerShell = null;
    }, 180);
  }

  function openManager(message = {}) {
    const lang = window.UCP_DEMO_RUNTIME?.resolveLanguage?.() || "en";
    if (!managerShell) {
      managerShell = document.createElement("section");
      managerShell.className = "ucp-real-demo-manager-shell";
      managerShell.setAttribute("aria-label", "Ultimate Clipboard Pro demo manager");

      const frame = document.createElement("iframe");
      frame.className = "ucp-real-demo-manager-frame";
      frame.title = "Ultimate Clipboard Pro demo manager";
      frame.src = `${runtimeBase}demo-sidepanel.html?lang=${encodeURIComponent(lang)}&tab=${encodeURIComponent(message.mediaType || "text")}`;
      managerShell.append(frame);
      document.body.append(managerShell);
      window.setTimeout(() => managerShell?.classList.add("is-visible"), 20);
      return;
    }
    const frame = managerShell.querySelector("iframe");
    if (frame) {
      frame.src = `${runtimeBase}demo-sidepanel.html?lang=${encodeURIComponent(lang)}&tab=${encodeURIComponent(message.mediaType || "text")}`;
    }
    managerShell.classList.add("is-visible");
  }

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin) return;
    if (event.data?.type === "UCP_DEMO_CLOSE_MANAGER") closeManager();
    if (event.data?.type === "UCP_DEMO_BLOCKED") showBlocked();
  });

  await loadScript(`${runtimeBase}demo-runtime.js?v=20260514-real-runtime`);
  const language = window.UCP_DEMO_RUNTIME.resolveLanguage();
  const bridge = window.UCP_DEMO_RUNTIME.makeStateBridge(language, {
    openManager,
    closeManager,
    showBlocked,
    openTools: showBlocked
  });
  bridge.installChromeMock();
  window.__UCP_DEMO_BRIDGE__ = bridge;

  await window.UCP_DEMO_RUNTIME.loadSharedScripts();
  await window.UCP_DEMO_RUNTIME.loadScript(`${runtimeBase}content/contentScript.js?v=20260514-real-runtime`);

  root.dataset.ucpDemoRuntime = "real-extension";
})();
