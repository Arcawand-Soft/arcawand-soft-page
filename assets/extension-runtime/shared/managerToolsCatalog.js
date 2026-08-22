(function initManagerToolsCatalog(global) {
  "use strict";

  function createManagerToolsCatalogController(options = {}) {
    const {
      t = (key) => key,
      getSettings = () => ({}),
      updateSettings = () => {},
      showToast = () => {},
      onOpened = () => {},
      getRuntimeUrl = (path) => path,
      toolApi = global.MCP || {}
    } = options;
    let managerToolDragState = null;
    let managerToolSuppressClickUntil = 0;
    let managerToolsRuntimePromise = null;

    function renderManagerToolsGrid(grid) {
      if (!grid) return;
      const tools = toolApi.getTools(t, getSettings()?.toolOrder);
      grid.replaceChildren(...tools.map(createManagerToolTile));
    }

    function createManagerToolTile(tool) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "manager-tool-tile";
      button.dataset.managerAction = "open-tool";
      button.dataset.toolId = tool.id;
      button.dataset.toolCategory = tool.category || "organize";
      button.draggable = true;
      button.setAttribute("aria-label", tool.title);
      button.title = tool.description;
      button.setAttribute("aria-grabbed", "false");
      const locked = toolApi.canUseTool ? !toolApi.canUseTool(tool.id, getSettings()) : false;
      if (locked) {
        button.classList.add("is-pro-locked");
        button.draggable = false;
        button.dataset.proLocked = "true";
        button.title = t("pro.toolsLocked");
      }
      if (tool.icon) {
        const iconShell = document.createElement("span");
        iconShell.className = "manager-tool-tile-icon-shell";
        iconShell.setAttribute("aria-hidden", "true");
        const icon = document.createElement("img");
        icon.className = "manager-tool-tile-icon";
        icon.src = getRuntimeUrl(tool.icon);
        icon.alt = "";
        icon.setAttribute("aria-hidden", "true");
        iconShell.appendChild(icon);
        button.appendChild(iconShell);
      }
      const copy = document.createElement("span");
      copy.className = "manager-tool-tile-copy";
      const label = document.createElement("strong");
      label.className = "manager-tool-tile-title";
      label.textContent = tool.title;
      const description = document.createElement("span");
      description.className = "manager-tool-tile-description";
      description.textContent = tool.description;
      copy.append(label, description);
      button.appendChild(copy);
      const grip = document.createElement("span");
      grip.className = "manager-tool-tile-grip";
      grip.textContent = "⋮⋮";
      grip.setAttribute("aria-hidden", "true");
      button.appendChild(grip);
      const openCue = document.createElement("span");
      openCue.className = "manager-tool-tile-open-cue";
      openCue.setAttribute("aria-hidden", "true");
      openCue.append(document.createElement("span"), Object.assign(document.createElement("span"), { textContent: "↗" }));
      button.appendChild(openCue);
      if (locked) button.appendChild(createManagerProLockIcon());
      return button;
    }

    function createManagerProLockIcon() {
      const icon = document.createElement("img");
      icon.className = "manager-pro-lock-icon";
      icon.src = "../assets/icons/pro-icon.png";
      icon.alt = t("license.getPro");
      return icon;
    }

    function setupManagerToolsDrag(grid) {
      if (!grid || grid.dataset.dragReady === "true") return;
      grid.dataset.dragReady = "true";
      grid.addEventListener("dragstart", handleManagerToolDragStart);
      grid.addEventListener("dragenter", handleManagerToolDragHover);
      grid.addEventListener("dragover", handleManagerToolDragHover);
      grid.addEventListener("drop", handleManagerToolDrop);
      grid.addEventListener("dragend", handleManagerToolDragEnd);
      grid.addEventListener("keydown", handleManagerToolKeydown);
    }

    function handleManagerToolKeydown(event) {
      if (!event.altKey || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      const tile = event.target.closest(".manager-tool-tile[data-tool-id]");
      const grid = event.currentTarget;
      if (!tile || !grid.contains(tile) || tile.dataset.proLocked === "true") return;
      const tiles = Array.from(grid.querySelectorAll(".manager-tool-tile[data-tool-id]"));
      const currentIndex = tiles.indexOf(tile);
      const direction = ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1;
      const nextIndex = Math.max(0, Math.min(tiles.length - 1, currentIndex + direction));
      if (nextIndex === currentIndex) return;
      event.preventDefault();
      const target = tiles[nextIndex];
      if (direction < 0) grid.insertBefore(tile, target);
      else grid.insertBefore(tile, target.nextSibling);
      persistManagerToolGridOrder(grid);
      tile.focus({ preventScroll: true });
    }

    function handleManagerToolDragStart(event) {
      const tile = event.target.closest(".manager-tool-tile[data-tool-id]");
      if (!tile) return;
      managerToolDragState = { id: tile.dataset.toolId, moved: false };
      tile.classList.add("is-dragging");
      tile.setAttribute("aria-grabbed", "true");
      tile.closest(".manager-tools-grid")?.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", tile.dataset.toolId);
    }

    function handleManagerToolDragHover(event) {
      const grid = event.currentTarget;
      const target = event.target.closest(".manager-tool-tile[data-tool-id]");
      if (!managerToolDragState || !target || !grid.contains(target)) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      const source = grid.querySelector(`.manager-tool-tile[data-tool-id="${CSS.escape(managerToolDragState.id)}"]`);
      if (!source || source === target) return;
      swapSiblingNodes(source, target);
      managerToolDragState.moved = true;
      target.classList.add("is-swap-target");
      setTimeout(() => target.classList.remove("is-swap-target"), 160);
    }

    function swapSiblingNodes(first, second) {
      const parent = first.parentNode;
      const marker = document.createTextNode("");
      parent.insertBefore(marker, first);
      parent.insertBefore(first, second);
      parent.insertBefore(second, marker);
      parent.removeChild(marker);
    }

    function handleManagerToolDrop(event) {
      if (!managerToolDragState) return;
      event.preventDefault();
      persistManagerToolGridOrder(event.currentTarget);
    }

    function handleManagerToolDragEnd(event) {
      const grid = event.currentTarget;
      grid.querySelectorAll(".manager-tool-tile").forEach((tile) => {
        tile.classList.remove("is-dragging", "is-swap-target");
        tile.setAttribute("aria-grabbed", "false");
      });
      grid.classList.remove("is-dragging");
      if (managerToolDragState?.moved) persistManagerToolGridOrder(grid);
      managerToolDragState = null;
      managerToolSuppressClickUntil = Date.now() + 450;
    }

    async function persistManagerToolGridOrder(grid) {
      const order = Array.from(grid.querySelectorAll(".manager-tool-tile[data-tool-id]")).map((tile) => tile.dataset.toolId);
      const normalized = toolApi.normalizeToolOrder ? toolApi.normalizeToolOrder(order) : order;
      if (JSON.stringify(normalized) === JSON.stringify(toolApi.normalizeToolOrder?.(getSettings()?.toolOrder || []) || getSettings()?.toolOrder || [])) return;
      const currentSettings = await toolApi.getSettings().catch(() => getSettings() || {});
      const nextSettings = Object.assign({}, currentSettings, { toolOrder: normalized });
      updateSettings({ toolOrder: normalized });
      await toolApi.saveSettings(nextSettings).catch(() => {});
    }

    function ensureManagerToolsRuntime() {
      if (typeof toolApi.getTools === "function" && typeof toolApi.runTool === "function") return Promise.resolve(true);
      if (managerToolsRuntimePromise) return managerToolsRuntimePromise;
      const inject = (path) => new Promise((resolve, reject) => {
        const url = getRuntimeUrl(path);
        const existing = document.querySelector(`script[src="${url}"]`);
        if (existing?.dataset.loaded === "true") return resolve(true);
        const script = existing || document.createElement("script");
        script.src = url;
        script.async = false;
        script.addEventListener("load", () => {
          script.dataset.loaded = "true";
          resolve(true);
        }, { once: true });
        script.addEventListener("error", () => reject(new Error(`runtime_unavailable:${path}`)), { once: true });
        if (!existing) document.head.appendChild(script);
      });
      managerToolsRuntimePromise = inject("shared/toolUpgradeLocales.js")
        .then(() => inject("shared/emojiUnicodeCatalog.js"))
        .then(() => inject("shared/specialCharacterCatalog.js"))
        .then(() => inject("shared/tools.js")).finally(() => {
        if (typeof toolApi.getTools !== "function" || typeof toolApi.runTool !== "function") managerToolsRuntimePromise = null;
      });
      return managerToolsRuntimePromise;
    }

    function openManagerToolsModal() {
      if (typeof toolApi.getTools !== "function" || typeof toolApi.runTool !== "function") {
        ensureManagerToolsRuntime().then(openManagerToolsModal).catch(() => showToast(t("common.error")));
        return;
      }
      let modal = document.getElementById("managerToolsModal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "managerToolsModal";
        modal.className = "manager-modal manager-tools-modal";
        modal.innerHTML = [
          "<div class=\"manager-backdrop\" data-manager-action=\"close-tools\"></div>",
          "<section class=\"manager-tools-card\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"managerToolsTitle\">",
          "<header class=\"mcp-search-head manager-tools-head\"><strong id=\"managerToolsTitle\" data-role=\"tools-title\"></strong><button type=\"button\" data-manager-action=\"close-tools\"></button></header>",
          "<div class=\"manager-tools-grid\" data-role=\"tools-grid\"></div>",
          "</section>"
        ].join("");
        document.body.appendChild(modal);
        setupManagerToolsDrag(modal.querySelector("[data-role='tools-grid']"));
      }
      modal.querySelector("[data-role='tools-title']").textContent = t("tools.title");
      const close = modal.querySelector("[data-manager-action='close-tools']:not(.manager-backdrop)");
      if (close) {
        close.textContent = "X";
        close.setAttribute("aria-label", t("common.close"));
        close.title = t("common.close");
      }
      renderManagerToolsGrid(modal.querySelector("[data-role='tools-grid']"));
      modal.hidden = false;
      requestAnimationFrame(() => close?.focus({ preventScroll: true }));
      onOpened(modal);
    }

    function closeToolsModal() {
      const modal = document.getElementById("managerToolsModal");
      if (modal) modal.hidden = true;
    }

    return {
      open: openManagerToolsModal,
      close: closeToolsModal,
      renderGrid: renderManagerToolsGrid,
      ensureRuntime: ensureManagerToolsRuntime,
      isClickSuppressed: () => Date.now() < managerToolSuppressClickUntil
    };
  }

  global.MCP = Object.assign(global.MCP || {}, {
    createManagerToolsCatalogController
  });
})(globalThis);
