(function registerRecentTextPaletteTheme(global) {
  "use strict";

  global.MCP_RECENT_TEXT_PALETTE_STYLES = `
    :host{all:initial;--ucp-accent:#e50914;--ucp-bg:#111317;--ucp-raised:#1c2027;--ucp-line:#343b47;--ucp-text:#f8fafc;--ucp-muted:#aab2c0;--ucp-shadow:0 18px 48px rgba(0,0,0,.38);--ucp-launcher-opacity:.9;--ucp-launcher-hover-opacity:.96;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color-scheme:dark}
    :host([data-theme="light"]){--ucp-bg:#fff;--ucp-raised:#f2f5f8;--ucp-line:#cbd3dd;--ucp-text:#17202b;--ucp-muted:#5c6876;--ucp-shadow:0 18px 48px rgba(31,41,55,.22);--ucp-launcher-opacity:.88;color-scheme:light}
    *,*::before,*::after{box-sizing:border-box}
    button{font:inherit}
    .launcher{position:fixed;z-index:2147483646;width:28px;height:28px;padding:2px;border:1px solid color-mix(in srgb,var(--ucp-accent) 62%,var(--ucp-line));border-radius:9px;background:color-mix(in srgb,var(--ucp-bg) 88%,transparent);box-shadow:0 5px 16px rgba(0,0,0,.24);display:block;direction:ltr;pointer-events:none;opacity:0;visibility:hidden;transform:scale(.9);transition:opacity .22s ease,visibility 0s linear .22s,transform .22s ease,box-shadow .16s ease,border-color .16s ease;backdrop-filter:blur(7px)}
    .launcher[data-visible="true"]{pointer-events:auto;opacity:var(--ucp-launcher-opacity);visibility:visible;transform:scale(1);transition-delay:0s;animation:ucp-field-icon-arrive .32s cubic-bezier(.2,.9,.3,1.25)}
    .launcher:hover,.launcher:focus-within{opacity:var(--ucp-launcher-hover-opacity);border-color:var(--ucp-accent);box-shadow:0 7px 20px color-mix(in srgb,var(--ucp-accent) 24%,transparent)}
    .launcher-open{width:22px;height:22px;padding:1px;border:0;border-radius:7px;background:transparent;display:grid;place-items:center;color:var(--ucp-text);cursor:pointer}
    .launcher-open:focus-visible{outline:2px solid var(--ucp-accent);outline-offset:2px}
    .launcher-icon{position:relative;width:20px;height:20px;display:grid;place-items:center;overflow:hidden;border-radius:6px;background:linear-gradient(145deg,color-mix(in srgb,var(--ucp-accent) 74%,#fff),var(--ucp-accent));background-position:center;background-repeat:no-repeat;background-size:cover;color:#fff;font-size:12px;font-weight:900;line-height:1;text-shadow:0 1px 2px rgba(0,0,0,.35)}
    .palette{position:fixed;z-index:2147483647;width:min(360px,calc(100vw - 20px));max-height:min(420px,calc(100vh - 20px));display:none;flex-direction:column;overflow:hidden;border:1px solid var(--ucp-line);border-radius:16px;background:var(--ucp-bg);box-shadow:var(--ucp-shadow);pointer-events:auto;color:var(--ucp-text)}
    .palette[data-open="true"]{display:flex;animation:ucp-arrive .17s ease-out}
    .head{display:grid;grid-template-columns:1fr auto;gap:4px 12px;padding:14px 14px 11px;border-bottom:1px solid var(--ucp-line)}
    .brand{font-size:14px;font-weight:760;line-height:1.25;letter-spacing:-.01em}
    .hint{font-size:11px;line-height:1.3;color:var(--ucp-muted)}
    .close{grid-column:2;grid-row:1 / span 2;align-self:center;width:30px;height:30px;padding:0;border:1px solid transparent;border-radius:9px;background:var(--ucp-raised);color:var(--ucp-text);cursor:pointer}
    .close:hover,.close:focus-visible{border-color:var(--ucp-accent);outline:none}
    .list{display:flex;flex-direction:column;gap:6px;margin:0;padding:8px;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--ucp-line) transparent}
    .row{position:relative;display:grid;grid-template-columns:24px minmax(0,1fr);align-items:center;gap:8px;width:100%;min-height:42px;padding:7px 9px;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--ucp-text);text-align:start;cursor:pointer;overflow:hidden}
    .row:hover,.row:focus-visible{background:var(--ucp-raised);border-color:color-mix(in srgb,var(--ucp-accent) 46%,var(--ucp-line));outline:none}
    .index{display:grid;place-items:center;width:22px;height:22px;border-radius:7px;background:color-mix(in srgb,var(--ucp-accent) 16%,var(--ucp-raised));color:var(--ucp-accent);font-size:10px;font-weight:800;font-variant-numeric:tabular-nums}
    .viewport{min-width:0;overflow:hidden;mask-image:linear-gradient(90deg,#000 0,#000 calc(100% - 12px),transparent 100%)}
    .rail{display:block;width:max-content;max-width:none;white-space:nowrap;font-size:12px;font-weight:620;line-height:1.45;unicode-bidi:plaintext;will-change:transform;transform:translateX(0)}
    .empty{padding:24px 16px;text-align:center;color:var(--ucp-muted);font-size:12px}
    @keyframes ucp-arrive{from{opacity:0;transform:translateY(4px) scale(.985)}to{opacity:1;transform:none}}
    @keyframes ucp-field-icon-arrive{0%{opacity:0;transform:scale(.82)}58%{opacity:var(--ucp-launcher-opacity);transform:scale(1.06)}100%{opacity:var(--ucp-launcher-opacity);transform:scale(1)}}
    @media(prefers-reduced-motion:reduce){.launcher,.palette{animation:none!important;transition:none}.rail{transform:none!important}}
  `;
  global.MCP_RECENT_TEXT_SCROLL_DURATION = function recentTextScrollDuration(distance, textLength) {
    const overflow = Math.max(0, Number(distance) || 0);
    const length = Math.max(0, Number(textLength) || 0);
    const lengthFactor = Math.min(1, Math.max(0, (length - 60) / 1140));
    const pixelsPerSecond = 22 + (78 * Math.sqrt(lengthFactor));
    return Math.min(14000, Math.max(2200, Math.round((overflow / pixelsPerSecond) * 1000)));
  };
  global.MCP_ADD_RECENT_TEXT_HOVER_MOTION = function addRecentTextHoverMotion(row, viewport, rail) {
    let animation = null;
    const reset = () => {
      animation?.cancel();
      animation = null;
      rail.style.transform = "translateX(0)";
    };
    row.addEventListener("pointerenter", () => {
      reset();
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const distance = Math.ceil(rail.scrollWidth - viewport.clientWidth);
      if (distance <= 0) return;
      animation = rail.animate([
        { transform: "translateX(0)" },
        { transform: `translateX(-${distance}px)` }
      ], {
        duration: global.MCP_RECENT_TEXT_SCROLL_DURATION(distance, rail.textContent.length),
        delay: 420,
        easing: "linear",
        fill: "forwards"
      });
    });
    row.addEventListener("pointerleave", reset);
    row.addEventListener("blur", reset);
  };
})(globalThis);
