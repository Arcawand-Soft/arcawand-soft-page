(function initPreviewAutoScroll(global) {
  global.MCP = global.MCP || {};
  if (global.MCP.createPreviewAutoScrollController) return;

  global.MCP.createPreviewAutoScrollController = function createPreviewAutoScrollController(options = {}) {
    const activeClass = "is-auto-scrolling";
    const scrollClass = "is-scrollable";
    const textSelector = options.textSelector || "";
    const animations = new WeakMap();

    function measure(container, inner) {
      const innerHeight = Math.ceil(inner.getBoundingClientRect().height || inner.scrollHeight || inner.offsetHeight || 0);
      return Math.max(0, innerHeight - Math.ceil(container.clientHeight || 0));
    }

    function cancel(container) {
      const state = animations.get(container);
      if (state && state.raf) cancelAnimationFrame(state.raf);
      animations.delete(container);
      return state || null;
    }

    function start(container, inner) {
      if (!container || !inner) return false;
      cancel(container);
      const maxScroll = measure(container, inner);
      container.classList.toggle(scrollClass, maxScroll > 4);
      if (maxScroll <= 4) return false;

      container.scrollTop = 0;
      container.classList.add(activeClass);
      inner.style.setProperty("transform", "translateY(0)", "important");
      const now = performance.now();
      const state = { raf: 0, inner, maxScroll, offset: 0, direction: 1, lastFrame: now, holdUntil: now + 180 };
      const downSpeed = Math.min(110, Math.max(48, maxScroll / 3.8));
      const upSpeed = Math.min(190, Math.max(82, maxScroll / 2.1));

      const step = (frameTime) => {
        if (animations.get(container) !== state) return;
        if (!container.isConnected || !inner.isConnected) {
          cancel(container);
          return;
        }
        if (frameTime < state.holdUntil) {
          state.raf = requestAnimationFrame(step);
          return;
        }
        const delta = Math.min(48, frameTime - state.lastFrame);
        state.lastFrame = frameTime;
        state.offset += state.direction * (state.direction > 0 ? downSpeed : upSpeed) * (delta / 1000);
        if (state.direction > 0 && state.offset >= state.maxScroll) {
          state.offset = state.maxScroll;
          state.direction = -1;
          state.holdUntil = frameTime + 640;
        } else if (state.direction < 0 && state.offset <= 1) {
          state.offset = 0;
          state.direction = 1;
          state.holdUntil = frameTime + 220;
        }
        inner.style.setProperty("transform", `translateY(-${state.offset}px)`, "important");
        state.raf = requestAnimationFrame(step);
      };

      animations.set(container, state);
      state.raf = requestAnimationFrame(step);
      return true;
    }

    function stop(container, reset = true) {
      if (!container) return;
      cancel(container);
      container.classList.remove(activeClass);
      if (reset) {
        container.scrollTop = 0;
        const inner = textSelector ? container.querySelector(textSelector) : null;
        if (inner) inner.style.removeProperty("transform");
      }
    }

    return { start, stop };
  };
})(globalThis);
