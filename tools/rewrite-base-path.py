#!/usr/bin/env python3
"""
Rewrites root-absolute paths (href="/...", src="/...", data-*="/...")
in a built dist/ directory so the site works when deployed under a
subpath instead of true domain root.

Skips anything already absolute (http(s)://, //, mailto:, tel:, data:, #).

Usage: python3 tools/rewrite-base-path.py <dist_dir> <base_path>
Example: python3 tools/rewrite-base-path.py dist-tier1 /tier1
"""

import os
import re
import sys

DIST = sys.argv[1]
BASE = sys.argv[2].rstrip("/")

ATTR_RE = re.compile(
    r'((?:href|src|action|data-before|data-after|poster)=)(["\'])(/(?!/)[^"\']*)\2'
)
CSS_URL_RE = re.compile(r'url\((["\']?)(/(?!/)[^)"\']*)\1\)')

SKIP_PREFIXES = ("http://", "https://", "//", "mailto:", "tel:", "data:", "#")


def rewrite_path(p):
    if p.startswith(SKIP_PREFIXES):
        return p
    return BASE + p


def rewrite_html(text):
    def attr_sub(m):
        return f"{m.group(1)}{m.group(2)}{rewrite_path(m.group(3))}{m.group(2)}"
    return ATTR_RE.sub(attr_sub, text)


def rewrite_css(text):
    def url_sub(m):
        return f"url({m.group(1)}{rewrite_path(m.group(2))}{m.group(1)})"
    return CSS_URL_RE.sub(url_sub, text)


count = 0
for root, _dirs, files in os.walk(DIST):
    for fname in files:
        path = os.path.join(root, fname)
        if fname.endswith((".html", ".xml")):
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
            new_text = rewrite_html(text)
            new_text = rewrite_css(new_text)  # inline <style> blocks
            if new_text != text:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_text)
                count += 1
        elif fname.endswith(".css"):
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
            new_text = rewrite_css(text)
            if new_text != text:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_text)
                count += 1

print(f"Rewrote {count} file(s) under {DIST} with base path {BASE}")
