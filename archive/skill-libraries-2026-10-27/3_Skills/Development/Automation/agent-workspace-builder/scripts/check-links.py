#!/usr/bin/env python3
"""Check that every relative markdown link in the repo resolves.

These repos are mostly documentation pointing at other documentation, so a moved
or renamed file breaks navigation silently -- the link still renders, it just goes
nowhere. Run it in CI and the break shows up in the PR instead of six months later.

    python scripts/check-links.py
    python scripts/check-links.py --self-check

Absolute URLs, mailto:, vscode:// and bare anchors are skipped -- this only checks
links that point at a path inside the repo.

ponytail: resolves the path and checks existence. It does NOT verify that a
'#heading' anchor exists in the target; that needs a markdown parse for a much
smaller class of break.
"""
import argparse
import re
import sys
from pathlib import Path

# [text](target) and href="target"
LINK_RE = re.compile(r'\]\(([^)\s]+)(?:\s+"[^"]*")?\)|href="([^"]+)"')
SKIP_PREFIX = ("http://", "https://", "mailto:", "vscode://", "#", "data:")
SKIP_DIRS = {".git", ".venv", "node_modules", "__pycache__", "artifacts"}
COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
# A path containing a placeholder is a shape to copy, not a link to follow.
PLACEHOLDER_RE = re.compile(r"NNNN|YYYY|MM-DD|\.\.\.|<[^>]+>|\[[^\]]+\]|\{|\$")


def targets(text: str):
    """Link targets, with HTML comments stripped -- a commented-out example is not
    a link, and the two example rows in decisions/README.md are exactly that."""
    for m in LINK_RE.finditer(COMMENT_RE.sub("", text)):
        yield (m.group(1) or m.group(2)).strip()


def check(root: Path) -> list[str]:
    broken = []
    for f in sorted(root.rglob("*.md")):
        if SKIP_DIRS & set(f.parts):
            continue
        # A TEMPLATE is a shape to copy. Its links point at files you have not
        # created yet, and that is the correct state for them to be in.
        is_template = "TEMPLATE" in f.stem.upper()
        for t in targets(f.read_text(encoding="utf-8", errors="replace")):
            if t.startswith(SKIP_PREFIX):
                continue
            path = t.split("#")[0]
            if not path:
                continue
            if is_template and PLACEHOLDER_RE.search(path):
                continue
            if not (f.parent / path).exists():
                broken.append(f"{f.relative_to(root)} -> {t}")
    return broken


def self_check() -> int:
    got = list(targets('see [a](./x.md) and [b](../y.md#z) and <a href="q.md">'))
    assert got == ["./x.md", "../y.md#z", "q.md"], got
    # a title after the target must not be swallowed into the path
    assert list(targets('[a](x.md "Title")')) == ["x.md"]
    # bare anchors and absolute urls are left for the caller to skip
    assert list(targets("[a](#top) [b](https://e.com)")) == ["#top", "https://e.com"]
    # a commented-out example row is not a link
    assert list(targets('<!-- [ex](nope.md) -->\n[real](yes.md)')) == ["yes.md"]
    assert list(targets('before\n<!--\n[ex](nope.md)\n-->\nafter [r](y.md)')) == ["y.md"]
    # placeholder paths, only skipped inside a TEMPLATE
    for p in ("adr-NNNN-....md", "../decisions/YYYY-MM-DD-name.md", "<name>.md", "[id].md"):
        assert PLACEHOLDER_RE.search(p), p
    assert not PLACEHOLDER_RE.search("../README.md")
    assert not PLACEHOLDER_RE.search("docs/verification-recipes.md")
    print("self-check ok")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--self-check", action="store_true")
    args = ap.parse_args()
    if args.self_check:
        return self_check()

    root = Path(__file__).resolve().parent.parent
    broken = check(root)
    n = len(list(root.rglob("*.md")))
    if broken:
        print(f"{len(broken)} broken relative link(s):")
        for b in broken:
            print(f"  {b}")
        return 1
    print(f"all relative links resolve ({n} markdown files)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
