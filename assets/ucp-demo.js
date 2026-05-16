(async function bootUltimateClipboardProRealDemo() {
  "use strict";

  const root = document.querySelector(".ucp-demo-root");
  if (!root || !window.location.pathname.includes("/ultimate-clipboard-pro/demo")) return;

  const runtimeBase = "/assets/extension-runtime/";
  const demoFloatingHostId = "mcp-demo-floating-host";
  let managerShell = null;
  let blockedDialog = null;
  const desktopQuery = window.matchMedia("(min-width: 1100px) and (hover: hover) and (pointer: fine)");
  const localCopyByLang = {
    en: {
      blockedTitle: "Demo mode",
      blocked: "This is a visual demo of the extension. Please install the extension to access all features.",
      installLabel: "Install Extension",
      desktopOnlyTitle: "Demo available on PC only",
      desktopOnly: "Demo mode is available on PC only. Please open this page on a computer to try the visual demo.",
      closeLabel: "Close demo message"
    },
    fr: {
      blockedTitle: "Mode d\u00e9mo",
      blocked: "Ceci est une d\u00e9mo visuelle de l'extension. Merci d'installer l'extension pour acc\u00e9der \u00e0 l'int\u00e9gralit\u00e9 des fonctionnalit\u00e9s.",
      installLabel: "Installer l'extension",
      desktopOnlyTitle: "D\u00e9mo disponible sur PC uniquement",
      desktopOnly: "Le mode d\u00e9mo est disponible sur PC uniquement. Ouvrez cette page sur un ordinateur pour essayer la d\u00e9mo visuelle.",
      closeLabel: "Fermer le message de d\u00e9monstration"
    },
    es: {
      blockedTitle: "Modo demo",
      blocked: "Esta es una demo visual de la extensi\u00f3n. Instala la extensi\u00f3n para acceder a todas las funciones.",
      installLabel: "Instalar extensi\u00f3n",
      desktopOnlyTitle: "Demo disponible solo en PC",
      desktopOnly: "El modo demo est\u00e1 disponible solo en PC. Abre esta p\u00e1gina en un ordenador para probar la demo visual.",
      closeLabel: "Cerrar el mensaje de demostraci\u00f3n"
    },
    it: {
      blockedTitle: "Modalit\u00e0 demo",
      blocked: "Questa \u00e8 una demo visiva dell'estensione. Installa l'estensione per accedere a tutte le funzionalit\u00e0.",
      installLabel: "Installa estensione",
      desktopOnlyTitle: "Demo disponibile solo su PC",
      desktopOnly: "La modalit\u00e0 demo \u00e8 disponibile solo su PC. Apri questa pagina su un computer per provare la demo visiva.",
      closeLabel: "Chiudi il messaggio demo"
    },
    de: {
      blockedTitle: "Demo-Modus",
      blocked: "Dies ist eine visuelle Demo der Erweiterung. Bitte installieren Sie die Erweiterung, um auf alle Funktionen zuzugreifen.",
      installLabel: "Extension installieren",
      desktopOnlyTitle: "Demo nur auf PC verf\u00fcgbar",
      desktopOnly: "Der Demo-Modus ist nur auf PC verf\u00fcgbar. \u00d6ffnen Sie diese Seite auf einem Computer, um die visuelle Demo zu testen.",
      closeLabel: "Demo-Hinweis schlie\u00dfen"
    }
  };

  function resolvePageLanguage() {
    const attrLang = (root.dataset.ucpDemoLang || document.documentElement.lang || "").slice(0, 2).toLowerCase();
    if (localCopyByLang[attrLang]) return attrLang;
    const match = window.location.pathname.match(/^\/(fr|es|it|de)\//);
    return match?.[1] || "en";
  }

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

  function currentCopy() {
    const runtime = window.UCP_DEMO_RUNTIME;
    const lang = runtime?.resolveLanguage?.() || resolvePageLanguage();
    const localCopy = localCopyByLang[lang] || localCopyByLang.en;
    const runtimeCopy = runtime?.copyByLang?.[lang] || runtime?.copyByLang?.en || {};
    return { ...localCopy, ...runtimeCopy, installLabel: localCopy.installLabel };
  }

  function showBlocked(customCopy = null) {
    const copy = customCopy || currentCopy();
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
      close.setAttribute("aria-label", copy.closeLabel || "Close demo message");
      close.textContent = "\u00d7";
      close.addEventListener("click", () => blockedDialog.classList.remove("is-visible"));

      const install = document.createElement("button");
      install.className = "ucp-demo-install-cta ucp-real-demo-dialog__install";
      install.type = "button";
      install.dataset.ucpDemoInstall = "true";
      install.addEventListener("click", () => {
        blockedDialog.classList.remove("is-visible");
        window.ArcawandInstallExtensionModal?.open?.();
      });

      panel.append(close, title, text, install);
      blockedDialog.append(panel);
      document.body.append(blockedDialog);
    }
    blockedDialog.querySelector(".ucp-real-demo-dialog__close")?.setAttribute("aria-label", copy.closeLabel || "Close demo message");
    blockedDialog.querySelector('[data-role="title"]').textContent = copy.blockedTitle;
    blockedDialog.querySelector('[data-role="text"]').textContent = copy.blocked;
    blockedDialog.querySelector('[data-ucp-demo-install="true"]').textContent = copy.installLabel || "Install Extension";
    blockedDialog.classList.add("is-visible");
    window.setTimeout(() => blockedDialog?.classList.remove("is-visible"), 3200);
  }

  function renderDesktopOnlyMessage() {
    const copy = currentCopy();
    root.replaceChildren();
    const message = document.createElement("section");
    message.className = "ucp-demo-desktop-only";
    const title = document.createElement("h2");
    title.textContent = copy.desktopOnlyTitle || "Desktop demo only";
    const text = document.createElement("p");
    text.textContent = copy.desktopOnly || "Demo mode is available on desktop only.";
    message.append(title, text);
    root.appendChild(message);
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
    const floatingPanelRoot = document.getElementById(demoFloatingHostId)?.shadowRoot;
    floatingPanelRoot?.querySelector("[data-action='close-panel']")?.click();
    floatingPanelRoot?.querySelector(".mcp-panel")?.classList.add("is-minimized");
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

  if (!desktopQuery.matches) {
    renderDesktopOnlyMessage();
    return;
  }
  try {
    await loadScript(`${runtimeBase}demo-runtime.js?v=20260515-rich-dataset`);
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
    await window.UCP_DEMO_RUNTIME.loadScript(`${runtimeBase}content/contentScript.js?v=20260514-demo-isolated-host`);

    root.dataset.ucpDemoRuntime = "real-extension";
  } catch (error) {
    console.warn("Ultimate Clipboard Pro demo could not start.", error);
    root.dataset.ucpDemoRuntime = "unavailable";
    showBlocked();
  }
})();
