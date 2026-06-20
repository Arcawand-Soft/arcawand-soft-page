import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup


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
CACHE_FILE = ROOT / "scripts" / ".translation-cache.json"
DELIMITER = "\n###ARCAWAND_JSONLD_BREAK###\n"
PROTECTED = {
    "ArcaWand Soft": "__ARC_ARCAWAND__",
    "Ultimate Clipboard Pro": "__ARC_UCP__",
    "Figgliz": "__ARC_FIGGLIZ__",
    "Google Drive": "__ARC_DRIVE__",
    "Chrome": "__ARC_CHROME__",
    "Dodo Payments": "__ARC_DODO__",
    "Pro Lifetime": "__ARC_PRO_LIFETIME__",
    "Pro": "__ARC_PRO__",
    "Plus": "__ARC_PLUS__",
    "Free": "__ARC_FREE__",
    "FAQ": "__ARC_FAQ__",
    "VPS": "__ARC_VPS__",
    "WebRTC": "__ARC_WEBRTC__",
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


def should_translate(value):
    if not isinstance(value, str):
        return False
    stripped = value.strip()
    if not stripped or stripped.startswith("http") or "@" in stripped:
        return False
    if re.fullmatch(r"[\d\s.,€$:/+-]+", stripped):
        return False
    return bool(re.search(r"[A-Za-z]", stripped))


def translate(texts, target, cache):
    missing = [text for text in texts if f"en:{target}:{text}" not in cache]
    for start in range(0, len(missing), 8):
        chunk = missing[start:start + 8]
        if not chunk:
            continue
        for attempt in range(4):
            try:
                raw = request_translation(DELIMITER.join(protect(text) for text in chunk), target)
                data = json.loads(raw)
                translated = "".join(part[0] for part in data[0])
                parts = translated.split(DELIMITER)
                if len(parts) != len(chunk):
                    parts = []
                    for text in chunk:
                        single_raw = request_translation(protect(text), target)
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


def request_translation(text, target):
    data = urllib.parse.urlencode({
        "client": "gtx",
        "sl": "en",
        "tl": target,
        "dt": "t",
        "q": text,
    }).encode("utf-8")
    request = urllib.request.Request(
        "https://translate.googleapis.com/translate_a/single",
        data=data,
        headers={
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "User-Agent": "Mozilla/5.0",
        },
        method="POST",
    )
    return urllib.request.urlopen(request, timeout=30).read().decode("utf-8")


def collect_values(node, values):
    if isinstance(node, dict):
        for key, value in node.items():
            if key.startswith("@"):
                continue
            collect_values(value, values)
    elif isinstance(node, list):
        for item in node:
            collect_values(item, values)
    elif should_translate(node) and node not in values:
        values.append(node)


def replace_values(node, translations):
    if isinstance(node, dict):
        return {key: value if key.startswith("@") else replace_values(value, translations) for key, value in node.items()}
    if isinstance(node, list):
        return [replace_values(item, translations) for item in node]
    if isinstance(node, str) and node in translations:
        return translations[node]
    return node


def process_file(path, target, cache):
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    changed = False
    for script in soup.find_all("script", {"type": "application/ld+json"}):
        raw = script.string
        if not raw:
            continue
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue
        values = []
        collect_values(data, values)
        if not values:
            continue
        translations = translate(values, target, cache)
        script.string = json.dumps(replace_values(data, translations), ensure_ascii=False, separators=(",", ":"))
        changed = True
    if changed:
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
        for file in sorted((ROOT / code).rglob("index.html")):
            process_file(file, target, cache)
            print(f"{code}: {file.relative_to(ROOT)}")
    save_cache(cache)


if __name__ == "__main__":
    main()
