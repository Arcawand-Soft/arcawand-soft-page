import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup
from bs4.element import NavigableString


ROOT = Path(__file__).resolve().parents[1]
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

SKIP_PARENTS = {"script", "style", "noscript", "svg", "code", "pre", "textarea"}
DELIMITER = "\n###ARCAWAND_TRANSLATION_BREAK###\n"
CACHE_FILE = ROOT / "scripts" / ".translation-cache.json"

PROTECTED = {
    "ArcaWand Soft": "__ARC_PROTECT_ARCAWAND__",
    "Ultimate Clipboard Pro": "__ARC_PROTECT_UCP__",
    "Figgliz": "__ARC_PROTECT_FIGGLIZ__",
    "Google Drive": "__ARC_PROTECT_DRIVE__",
    "Dodo Payments": "__ARC_PROTECT_DODO__",
    "Buy Me a Coffee": "__ARC_PROTECT_BMAC__",
    "Chrome": "__ARC_PROTECT_CHROME__",
    "WebRTC": "__ARC_PROTECT_WEBRTC__",
    "VPS": "__ARC_PROTECT_VPS__",
    "FAQ": "__ARC_PROTECT_FAQ__",
    "Pro Lifetime": "__ARC_PROTECT_PRO_LIFETIME__",
    "Pro": "__ARC_PROTECT_PRO__",
    "Plus": "__ARC_PROTECT_PLUS__",
    "Free": "__ARC_PROTECT_FREE__",
    "Flappy Duo": "__ARC_PROTECT_FLAPPY__",
    "Air Hockey": "__ARC_PROTECT_AIR_HOCKEY__",
    "Ping Pong": "__ARC_PROTECT_PING_PONG__",
    "Connect 4": "__ARC_PROTECT_CONNECT4__",
}


def load_cache():
    if CACHE_FILE.exists():
        return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
    return {}


def save_cache(cache):
    CACHE_FILE.write_text(json.dumps(cache, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")


def protect(text):
    protected = text
    for source, token in sorted(PROTECTED.items(), key=lambda item: len(item[0]), reverse=True):
        protected = protected.replace(source, token)
    return protected


def unprotect(text):
    restored = text
    for source, token in PROTECTED.items():
        restored = restored.replace(token, source)
    return restored


def should_translate(text):
    stripped = text.strip()
    if not stripped:
        return False
    if stripped in PROTECTED:
        return False
    if stripped.startswith("http") or stripped.startswith("mailto:"):
        return False
    if "@" in stripped and " " not in stripped:
        return False
    if re.fullmatch(r"[\d\s.,€$:/+-]+", stripped):
        return False
    if re.fullmatch(r"[A-Z]{1,4}", stripped):
        return False
    return bool(re.search(r"[A-Za-z]", stripped))


def translate_batch(texts, target, cache):
    missing = []
    for text in texts:
        key = f"en:{target}:{text}"
        if key not in cache:
            missing.append(text)
    if not missing:
        return {text: cache[f"en:{target}:{text}"] for text in texts}

    chunk_size = 35
    for start in range(0, len(missing), chunk_size):
        chunk = missing[start:start + chunk_size]
        protected_chunk = [protect(item) for item in chunk]
        joined = DELIMITER.join(protected_chunk)
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
                    for item in protected_chunk:
                        single_url = (
                            "https://translate.googleapis.com/translate_a/single"
                            f"?client=gtx&sl=en&tl={urllib.parse.quote(target)}&dt=t&q={urllib.parse.quote(item)}"
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


def collect_text_nodes(soup):
    nodes = []
    for node in soup.find_all(string=True):
        parent = node.parent
        if not parent or parent.name in SKIP_PARENTS:
            continue
        if any(ancestor.name in SKIP_PARENTS for ancestor in parent.parents):
            continue
        text = str(node)
        if should_translate(text):
            nodes.append(node)
    return nodes


def translate_file(path, target, cache):
    html = path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    nodes = collect_text_nodes(soup)
    unique_texts = []
    seen = set()
    for node in nodes:
        stripped = str(node).strip()
        if stripped not in seen:
            seen.add(stripped)
            unique_texts.append(stripped)

    translations = translate_batch(unique_texts, target, cache)
    for node in nodes:
        original = str(node)
        stripped = original.strip()
        if stripped not in translations:
            continue
        leading = original[: len(original) - len(original.lstrip())]
        trailing = original[len(original.rstrip()):]
        node.replace_with(NavigableString(f"{leading}{translations[stripped]}{trailing}"))

    path.write_text(serialize_html(soup), encoding="utf-8")


def serialize_html(soup):
    html = str(soup).lstrip()
    html = re.sub(r"^(?:html|HTML)\s*", "", html, count=1)
    html = re.sub(r"^<!DOCTYPE html>", "<!doctype html>", html, count=1, flags=re.IGNORECASE)
    if not html.lower().startswith("<!doctype html>"):
        html = f"<!doctype html>\n{html}"
    return f"{html.rstrip()}\n"


def main():
    cache = load_cache()
    for code, target in TARGETS.items():
        root = ROOT / code
        files = sorted(root.rglob("index.html"))
        for file in files:
            translate_file(file, target, cache)
            print(f"{code}: {file.relative_to(ROOT)}")
    save_cache(cache)


if __name__ == "__main__":
    main()
