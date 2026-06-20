import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "ultimate-clipboard-pro" / "assets" / "index-BRdfzjER.js"
OUT = ROOT / "assets" / "ucp-runtime-locales.js"
CACHE_FILE = ROOT / "scripts" / ".translation-cache.json"

TARGETS = {
    "ro": "ro",
    "pt": "pt",
    "ar": "ar",
    "zh": "zh-CN",
    "ja": "ja",
    "ru": "ru",
    "nl": "nl",
    "pl": "pl",
    "tr": "tr",
    "ko": "ko",
    "hi": "hi",
}

DELIMITER = "\n###ARCAWAND_UCP_BREAK###\n"
PROTECTED = {
    "ArcaWand Soft": "__ARC_ARCAWAND__",
    "Ultimate Clipboard Pro": "__ARC_UCP__",
    "Chrome": "__ARC_CHROME__",
    "Manifest V3": "__ARC_MV3__",
    "Google Drive": "__ARC_DRIVE__",
    "Pro": "__ARC_PRO__",
    "AI": "__ARC_AI__",
    "Markdown": "__ARC_MARKDOWN__",
    "ZIP": "__ARC_ZIP__",
    "FAQ": "__ARC_FAQ__",
}


def load_cache():
    if CACHE_FILE.exists():
        return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
    return {}


def save_cache(cache):
    CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")


def protect(text):
    out = text
    for source, token in sorted(PROTECTED.items(), key=lambda item: len(item[0]), reverse=True):
        out = out.replace(source, token)
    return out


def unprotect(text):
    out = text
    for source, token in PROTECTED.items():
        out = out.replace(token, source)
    return out


def translate_texts(texts, target, cache):
    missing = [text for text in texts if f"en:{target}:{text}" not in cache]
    for start in range(0, len(missing), 30):
        chunk = missing[start:start + 30]
        if not chunk:
            continue
        joined = DELIMITER.join(protect(text) for text in chunk)
        url = (
            "https://translate.googleapis.com/translate_a/single"
            f"?client=gtx&sl=en&tl={urllib.parse.quote(target)}&dt=t&q={urllib.parse.quote(joined)}"
        )
        for attempt in range(4):
            try:
                raw = urllib.request.urlopen(url, timeout=30).read().decode("utf-8")
                data = json.loads(raw)
                translated = "".join(part[0] for part in data[0])
                parts = translated.split(DELIMITER)
                if len(parts) != len(chunk):
                    parts = []
                    for text in chunk:
                        single_url = (
                            "https://translate.googleapis.com/translate_a/single"
                            f"?client=gtx&sl=en&tl={urllib.parse.quote(target)}&dt=t&q={urllib.parse.quote(protect(text))}"
                        )
                        single_raw = urllib.request.urlopen(single_url, timeout=30).read().decode("utf-8")
                        single_data = json.loads(single_raw)
                        parts.append("".join(part[0] for part in single_data[0]))
                        time.sleep(0.04)
                for original, translated_item in zip(chunk, parts):
                    cache[f"en:{target}:{original}"] = unprotect(translated_item.strip())
                save_cache(cache)
                time.sleep(0.08)
                break
            except Exception:
                if attempt == 3:
                    raise
                time.sleep(1.2 * (attempt + 1))
    return {text: cache[f"en:{target}:{text}"] for text in texts}


def extract_en_strings():
    js = BUNDLE.read_text(encoding="utf-8")
    en_start = js.find("en:{", js.find("const zv="))
    if en_start == -1:
        raise RuntimeError("Could not locate UCP English locale block.")
    brace = js.find("{", en_start)
    depth = 0
    end = None
    for index in range(brace, len(js)):
        char = js[index]
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                end = index + 1
                break
    if end is None:
        raise RuntimeError("Could not close UCP English locale block.")
    block = js[brace:end]
    strings = []
    for match in re.finditer(r'"((?:\\.|[^"\\])*)"', block):
        value = json.loads(f'"{match.group(1)}"')
        if not value.strip():
            continue
        if value.startswith("http") or "@" in value:
            continue
        if re.fullmatch(r"[\d\s.,€$:/+-]+", value):
            continue
        if value not in strings:
            strings.append(value)
    extras = [
        "Ultimate Clipboard Pro - Stop losing what you copy",
        "Ultimate Clipboard Pro captures everything you copy — text, code, images, screenshots — and organizes it into three dedicated workspaces. Never lose important information again.",
        "Stop losing what you copy",
        "Never lose what you copy again",
        "Open product page",
        "Install Extension",
        "Get Pro",
        "Change language",
    ]
    for item in extras:
        if item not in strings:
            strings.append(item)
    return strings


def main():
    cache = load_cache()
    source_strings = extract_en_strings()
    locales = {}
    for code, target in TARGETS.items():
        locales[code] = translate_texts(source_strings, target, cache)
        print(f"{code}: {len(locales[code])} strings")
    save_cache(cache)
    js = f"""(() => {{
  const locales = {json.dumps(locales, ensure_ascii=False, indent=2)};
  const supported = new Set(Object.keys(locales));

  function getLang() {{
    const explicit = window.__ARCAWAND_LANG__;
    if (supported.has(explicit)) return explicit;
    const first = window.location.pathname.split("/").filter(Boolean)[0];
    return supported.has(first) ? first : "";
  }}

  function translateTextNode(node, dictionary) {{
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (!trimmed || !dictionary[trimmed]) return;
    const leading = original.slice(0, original.length - original.trimStart().length);
    const trailing = original.slice(original.trimEnd().length);
    node.nodeValue = `${{leading}}${{dictionary[trimmed]}}${{trailing}}`;
  }}

  function translateAttributes(node, dictionary) {{
    if (!(node instanceof Element)) return;
    for (const attr of ["aria-label", "title", "placeholder", "alt"]) {{
      const value = node.getAttribute(attr);
      if (value && dictionary[value]) node.setAttribute(attr, dictionary[value]);
    }}
  }}

  function walk(root, dictionary) {{
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {{
      acceptNode(node) {{
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "CODE", "PRE"].includes(parent.tagName)) {{
          return NodeFilter.FILTER_REJECT;
        }}
        return NodeFilter.FILTER_ACCEPT;
      }}
    }});
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => translateTextNode(node, dictionary));
    root.querySelectorAll?.("*").forEach((node) => translateAttributes(node, dictionary));
  }}

  function apply() {{
    const lang = getLang();
    if (!lang) return;
    const dictionary = locales[lang];
    walk(document.body, dictionary);
    if (dictionary[document.title]) document.title = dictionary[document.title];
  }}

  let queued = false;
  function schedule() {{
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {{
      queued = false;
      apply();
    }});
  }}

  document.addEventListener("DOMContentLoaded", schedule);
  window.addEventListener("load", schedule, {{ once: true }});
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {{ childList: true, subtree: true }});
}})();
"""
    OUT.write_text(js, encoding="utf-8")


if __name__ == "__main__":
    main()
