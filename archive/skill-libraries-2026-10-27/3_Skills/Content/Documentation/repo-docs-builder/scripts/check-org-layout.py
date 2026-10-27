#!/usr/bin/env python3
"""Check ai-automation-tools repos against the org layout standard.

The standard is references/org-repo-layout.md. This reads what git tracks (not the
working tree, so Windows' case-insensitivity can't hide a `Docs/`), and prints one
`ISSUE:` line per drift. Org Upkeep runs it every Saturday; nothing else enforces it.

    python check-org-layout.py --root D:/.../Repos/AI-Automation-Tools   # every clone under it
    python check-org-layout.py --repo D:/.../Tools/agent-skills           # one repo
    python check-org-layout.py --root ... --json                          # for a report
    python check-org-layout.py --self-check

Exit 1 when any repo drifts, 0 when all are clean. A clone it can't read is an error,
never a pass.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

KEBAB = re.compile(r"^[a-z0-9]+(?:[-.][a-z0-9]+)*$")
# Folder names a tool dictates, so the spelling rule leaves them alone.
TOOL_NAMES = {"__tests__", "node_modules", "__pycache__"}
# Repos that serve a site from their root: only README.md is required of them.
PUBLISH_RE = re.compile(r"(\.github\.io|-site|-demo)$", re.IGNORECASE)
REQUIRED = ("README.md", "AGENTS.md", "CLAUDE.md", "docs/README.md", "docs/ROADMAP.md", "docs/CHANGELOG.md")
# Never committed, at the repo root (build output and scratch) or anywhere (secrets, venvs).
NEVER_AT_ROOT = {"artifacts", "logs", "temp", "output", "dist", "_site", ".next", "versions", "zip", ".archive"}
NEVER_ANYWHERE = {".venv", "venv"}
MCP_HINT = re.compile(r"(^|/)mcp-server/|(^|/)mcp/server\.[jt]s$|_mcp\.py$|(^|/)main/mcp\.js$")
IMPORT_RE = re.compile(r"^@AGENTS\.md\s*$", re.MULTILINE)
ASSIGN_RE = re.compile(r"^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=", re.MULTILINE)


def public_only(text: str) -> bool:
    """A Vite mode file (`.env.remote`) whose every setting is VITE_*: compiled into the
    page and served to every visitor, so committing it is the point, not a leak."""
    names = ASSIGN_RE.findall(text)
    return bool(names) and all(n.startswith("VITE_") for n in names)


def tracked(repo: Path) -> list[str]:
    out = subprocess.run(["git", "-C", str(repo), "ls-files", "-z"], capture_output=True, check=True)
    return [p for p in out.stdout.decode("utf-8", "replace").split("\0") if p]


def check_files(name: str, files: list[str], read=lambda rel: "") -> list[str]:
    """Drift for one repo, given its tracked paths. `read` returns a tracked file's text."""
    issues: list[str] = []
    present = set(files)
    if PUBLISH_RE.search(name):
        return [] if "README.md" in present else ["missing README.md"]

    for rel in REQUIRED:
        if rel not in present:
            issues.append(f"missing {rel}")
    if "AGENTS.md" in present and "CLAUDE.md" in present and not IMPORT_RE.search(read("CLAUDE.md")):
        issues.append("CLAUDE.md does not import AGENTS.md (a bare `@AGENTS.md` line)")

    dirs: set[str] = set()
    for f in files:
        parts = f.split("/")
        for i in range(1, len(parts)):
            dirs.add("/".join(parts[:i]))

    for d in sorted(dirs):
        parts = d.split("/")
        leaf = parts[-1]
        # Spelling: root folders, and everything under docs/ (where the outliers live).
        in_scope = len(parts) == 1 or parts[0].lower() == "docs"
        if in_scope and not leaf.startswith(".") and leaf not in TOOL_NAMES and not KEBAB.match(leaf):
            issues.append(f"folder not lowercase-kebab: {d}/")
        if leaf == "test" and "node_modules" not in parts:
            issues.append(f"`test/` should be `tests/`: {d}/")
        if len(parts) == 1 and leaf.lower() in NEVER_AT_ROOT:
            issues.append(f"tracked folder that should be ignored: {d}/")
        if leaf in NEVER_ANYWHERE:
            issues.append(f"tracked virtualenv: {d}/")
    if any(d.lower() == "docs/prompts" for d in dirs):
        issues.append("prompts live in `prompts/`, not `docs/prompts/`")
    if any(d.lower() == "docs/images" for d in dirs):
        issues.append("README images live in root `images/`, not `docs/images/`")

    for f in files:
        leaf = f.rsplit("/", 1)[-1]
        if leaf.startswith(".env") and not leaf.endswith(".example") and not public_only(read(f)):
            issues.append(f"tracked env file: {f}")
    if any(MCP_HINT.search(f) for f in files) and "docs/mcp-server.md" not in present:
        issues.append("has an MCP server but no docs/mcp-server.md")
    if "docs/mcp-server.md" in present and "README.md" in present and "docs/mcp-server.md" not in read("README.md"):
        issues.append("root README.md does not link docs/mcp-server.md")
    return issues


def slug(repo: Path) -> str:
    """The GitHub name (`project-hub`), which can differ from the folder (`HTML-Project-Design`)."""
    out = subprocess.run(["git", "-C", str(repo), "remote", "get-url", "origin"], capture_output=True, text=True)
    url = out.stdout.strip().removesuffix(".git")
    return url.rsplit("/", 1)[-1] if url else repo.name


def check_repo(repo: Path) -> list[str]:
    files = tracked(repo)

    def read(rel: str) -> str:
        try:
            return (repo / rel).read_text(encoding="utf-8-sig", errors="replace")
        except OSError:
            return ""

    return check_files(slug(repo), files, read)


def find_repos(root: Path) -> list[Path]:
    """Clones up to three levels down (bucket/repo, Org_Agents/workspace), skipping Archive."""
    repos: list[Path] = []
    for git in sorted(root.glob("*/.git")) + sorted(root.glob("*/*/.git")) + sorted(root.glob("*/*/*/.git")):
        repo = git.parent
        if "Archive" not in repo.relative_to(root).parts and not any(r in repo.parents for r in repos):
            repos.append(repo)
    return repos


def self_check() -> int:
    good = ["README.md", "AGENTS.md", "CLAUDE.md", "docs/README.md", "docs/ROADMAP.md",
            "docs/CHANGELOG.md", "docs/diagrams/a.svg", "src/app.py", "tests/test_app.py",
            ".env.example", ".github/workflows/ci.yml", "src/server/__tests__/x.test.ts"]
    assert check_files("app", good, lambda rel: "@AGENTS.md\n") == [], check_files("app", good, lambda r: "@AGENTS.md\n")
    bad = ["README.md", "CLAUDE.md", "Docs/ROADMAP.md", "docs/Guides/x.md", "test/a.js", ".env",
           "artifacts/x.png", "venv/lib/x.py", "docs/prompts/p.md", "mcp-server/index.ts", ".env.local.example"]
    found = "\n".join(check_files("app", bad))
    assert ".env.local.example" not in found, found
    vite = {"frontend/.env.remote": "# c\nVITE_API_URL=same-origin\n", ".env.prod": "VITE_A=1\nSECRET=x\n"}
    vfound = "\n".join(check_files("app", list(vite), lambda rel: vite.get(rel, "")))
    assert ".env.remote" not in vfound and "tracked env file: .env.prod" in vfound, vfound
    for want in ("missing AGENTS.md", "missing docs/ROADMAP.md", "not lowercase-kebab: Docs/",
                 "not lowercase-kebab: docs/Guides/", "`test/` should be `tests/`", "tracked env file: .env",
                 "should be ignored: artifacts/", "tracked virtualenv: venv/", "docs/prompts/", "docs/mcp-server.md"):
        assert want in found, f"self-check expected {want!r} in:\n{found}"
    assert check_files("app", ["README.md", "AGENTS.md", "CLAUDE.md"], lambda r: "copied text")[-1].startswith("CLAUDE.md does not import")
    mcp = good + ["docs/mcp-server.md"]
    assert check_files("app", mcp, lambda r: "@AGENTS.md\n")[-1] == "root README.md does not link docs/mcp-server.md"
    assert check_files("app", mcp, lambda r: "@AGENTS.md\n[MCP setup](docs/mcp-server.md)") == []
    assert check_files("houston-site", ["index.html", "README.md", "Images/x.png"]) == []
    assert check_files("x.github.io", ["index.html"]) == ["missing README.md"]
    with tempfile.TemporaryDirectory() as d:
        root = Path(d)
        for rel in ("Live_Apps/a/.git", "Org_Agents/b/.git", "Archive/c/.git", "Live_Apps/a/sub/.git"):
            (root / rel).mkdir(parents=True)
        assert [p.name for p in find_repos(root)] == ["a", "b"], find_repos(root)
    print("self-check passed")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--root", type=Path, help="folder holding the org's clones")
    g.add_argument("--repo", type=Path, help="one repo")
    g.add_argument("--self-check", action="store_true")
    ap.add_argument("--json", action="store_true", help="print {repo: [issues]} instead of ISSUE lines")
    args = ap.parse_args()
    if args.self_check:
        return self_check()

    repos = [args.repo] if args.repo else find_repos(args.root)
    results: dict[str, list[str]] = {}
    for repo in repos:
        try:
            results[slug(repo)] = check_repo(repo)
        except (subprocess.CalledProcessError, OSError) as e:
            results[repo.name] = [f"could not read the clone: {e}"]

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        for name, issues in results.items():
            for issue in issues:
                print(f"ISSUE: {name}: {issue}")
        drifting = sum(1 for i in results.values() if i)
        total = sum(len(i) for i in results.values())
        print(f"{len(results)} repos checked, {drifting} drifting, {total} issues.")
    return 1 if any(results.values()) else 0


if __name__ == "__main__":
    sys.exit(main())
