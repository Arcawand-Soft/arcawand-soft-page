(function initMetaOverflowMarquee(global) {
  "use strict";

  global.MCP = global.MCP || {};
  if (global.MCP.createMetaOverflowMarqueeController) return;

  const TOKEN_CLASS = "ucp-overflow-token";
  const TRACK_CLASS = "ucp-overflow-token__track";

  function decorateMetaOverflowToken(element, role = "") {
    if (!element) return element;
    if (element.classList.contains(TOKEN_CLASS)) return element;
    const track = element.ownerDocument.createElement("span");
    track.className = TRACK_CLASS;
    track.append(...Array.from(element.childNodes));
    element.appendChild(track);
    element.classList.add(TOKEN_CLASS);
    if (role) element.dataset.metaRole = role;
    return element;
  }

  function createMetaOverflowMarqueeController(root) {
    if (!root?.addEventListener) return { disconnect() {} };
    let activeToken = null;
    let activeAnimation = null;
    const reducedMotion = global.matchMedia?.("(prefers-reduced-motion: reduce)");

    const stop = (token = activeToken) => {
      if (!token || token !== activeToken) return;
      activeAnimation?.cancel();
      activeAnimation = null;
      token.classList.remove("is-overflowing", "is-marquee-active");
      token.querySelector(`.${TRACK_CLASS}`)?.style.removeProperty("transform");
      resizeObserver.unobserve(token);
      activeToken = null;
    };

    const start = (token) => {
      if (!token || reducedMotion?.matches) return;
      if (activeToken && activeToken !== token) stop(activeToken);
      const track = token.querySelector(`.${TRACK_CLASS}`);
      if (!track) return;
      activeAnimation?.cancel();
      const overflow = Math.ceil(track.scrollWidth - token.clientWidth);
      token.classList.toggle("is-overflowing", overflow > 3);
      if (overflow <= 3) {
        activeToken = null;
        return;
      }
      activeToken = token;
      token.classList.add("is-marquee-active");
      resizeObserver.observe(token);
      const travelMs = Math.max(1800, Math.min(9000, overflow * 34));
      activeAnimation = track.animate([
        { transform: "translateX(0)", offset: 0 },
        { transform: `translateX(-${overflow}px)`, offset: 0.55 },
        { transform: `translateX(-${overflow}px)`, offset: 0.7 },
        { transform: "translateX(0)", offset: 0.93 },
        { transform: "translateX(0)", offset: 1 }
      ], {
        duration: travelMs + 2100,
        iterations: Infinity,
        easing: "linear"
      });
    };

    const resizeObserver = new ResizeObserver(() => {
      if (activeToken) global.requestAnimationFrame(() => start(activeToken));
    });
    const tokenFromEvent = (event) => event.target?.closest?.(`.${TOKEN_CLASS}`);
    const onPointerOver = (event) => {
      const token = tokenFromEvent(event);
      if (!token || token.contains(event.relatedTarget)) return;
      start(token);
    };
    const onPointerOut = (event) => {
      const token = tokenFromEvent(event);
      if (!token || token.contains(event.relatedTarget)) return;
      stop(token);
    };
    root.addEventListener("pointerover", onPointerOver);
    root.addEventListener("pointerout", onPointerOut);

    return {
      disconnect() {
        stop();
        resizeObserver.disconnect();
        root.removeEventListener("pointerover", onPointerOver);
        root.removeEventListener("pointerout", onPointerOut);
      }
    };
  }

  Object.assign(global.MCP, { decorateMetaOverflowToken, createMetaOverflowMarqueeController });
})(globalThis);
