#!/usr/bin/env python3
"""Check an agent workspace repo against the workspace standard.

The standard is a handful of yes/no facts: these files exist, docs/ holds only its
three root documents, CLAUDE.md imports AGENTS.md instead of copying it. A prompt
that says "keep the layout" is a request; this is the exit code that enforces it.

    python scripts/check-structure.py              # check the repo this script sits in
    python scripts/check-structure.py --root PATH  # check another repo
    python scripts/check-structure.py --self-check

Errors fail the run. Warnings (a RESOURCES.md nobody has refreshed in a while) do not,
so a skipped upkeep week never turns CI red.
"""
import argparse
import re
import sys
import tempfile
from datetime import UTC, date, datetime
from pathlib import Path

REQUIRED_FILES = (
    "README.md",
    "AGENTS.md",
    "CLAUDE.md",
    "SECURITY.md",
    "docs/README.md",
    "docs/ROADMAP.md",
    "docs/CHANGELOG.md",
    "docs/reference/CAPABILITIES.md",
    "docs/reference/RESOURCES.md",
    "docs/intel/README.md",
    "skills/README.md",
    ".claude/settings.json",
    ".github/workflows/ci.yml",
    ".env.example",
    "scripts/envfile.py",
    "scripts/usage.py",
    "scripts/gen-vendor-configs.py",
    "docs/reference/OTHER-CLIS.md",
)
# The only files allowed directly in docs/. Everything else lives in a subfolder.
DOCS_ROOT_FILES = {"README.md", "ROADMAP.md", "CHANGELOG.md"}
IMPORT_RE = re.compile(r"^@AGENTS\.md\s*$", re.MULTILINE)
UPDATED_RE = re.compile(r"Last updated:\s*(\d{4}-\d{2}-\d{2})")
STALE_DAYS = 21
MCP_VAR_RE = re.compile(r"\$\{([A-Za-z_][A-Za-z0-9_]*)\}")
SECRET_NAME_RE = re.compile(r"KEY|TOKEN|SECRET|PASSWORD|CREDENTIAL|_PAT\b", re.IGNORECASE)
CLIENT_VARS = {"CLAUDE_PROJECT_DIR"}  # set by the client itself, never by .env


def check(root: Path, today: date | None = None) -> tuple[list[str], list[str]]:
    today = today or datetime.now(UTC).date()
    errors: list[str] = []
    warnings: list[str] = []

    for rel in REQUIRED_FILES:
        if not (root / rel).is_file():
            errors.append(f"missing {rel}")

    # Exact-case names: Windows and macOS forgive Docs/ vs docs/, Linux CI does not.
    top = {p.name for p in root.iterdir()}
    for wrong in ("Docs", "DOCS", "Skills"):
        if wrong in top:
            errors.append(f"'{wrong}/' must be lowercase")

    docs = root / "docs"
    if docs.is_dir():
        for f in sorted(p for p in docs.iterdir() if p.is_file()):
            if f.name not in DOCS_ROOT_FILES and f.name != ".gitkeep":
                errors.append(
                    f"docs/{f.name} sits at the docs root -- only README, ROADMAP and "
                    "CHANGELOG belong there; move it into a docs/ subfolder"
                )

    claude = root / "CLAUDE.md"
    if claude.is_file():
        text = claude.read_text(encoding="utf-8", errors="replace")
        if not IMPORT_RE.search(text):
            errors.append("CLAUDE.md has no bare '@AGENTS.md' import line")
        if len(text.splitlines()) > 60:
            warnings.append(
                "CLAUDE.md is over 60 lines -- doctrine belongs in AGENTS.md, "
                "CLAUDE.md holds the import plus Claude-only notes"
            )

    resources = root / "docs/reference/RESOURCES.md"
    if resources.is_file():
        m = UPDATED_RE.search(resources.read_text(encoding="utf-8", errors="replace"))
        if not m:
            errors.append("docs/reference/RESOURCES.md has no 'Last updated: YYYY-MM-DD' line")
        else:
            age = (today - date.fromisoformat(m.group(1))).days
            if age > STALE_DAYS:
                warnings.append(f"docs/reference/RESOURCES.md last updated {age} days ago")

    errors += check_env(root)
    return errors, warnings


def env_names(text: str) -> dict[str, str]:
    out = {}
    for line in text.splitlines():
        line = line.strip().removeprefix("export ")
        if line and not line.startswith("#") and "=" in line:
            k, _, v = line.partition("=")
            out[k.strip()] = v.split(" #", 1)[0].strip()
    return out


def check_env(root: Path) -> list[str]:
    """Secrets live in a gitignored .env; .env.example names them and holds no secret value."""
    errors = []
    ignore = root / ".gitignore"
    lines = {x.strip() for x in ignore.read_text(encoding="utf-8").splitlines()} if ignore.is_file() else set()
    if not lines & {".env", ".env*"}:
        errors.append(".gitignore must list '.env' so secrets never reach git")
    if lines & {".env.*", ".env*"} and "!.env.example" not in lines:
        errors.append(".gitignore ignores .env.example too -- add '!.env.example' after '.env.*'")
    example = root / ".env.example"
    if not example.is_file():
        return errors  # already reported as missing
    names = env_names(example.read_text(encoding="utf-8"))
    for k, v in names.items():
        if v and SECRET_NAME_RE.search(k):
            errors.append(f".env.example gives {k} a value -- names only; real values go in .env")
    mcp = root / ".mcp.json"
    if mcp.is_file():
        for var in sorted(set(MCP_VAR_RE.findall(mcp.read_text(encoding="utf-8"))) - CLIENT_VARS):
            if var not in names:
                errors.append(f".mcp.json uses ${{{var}}} but .env.example doesn't list it")
    return errors


def self_check() -> int:
    """Build a conforming repo, then break it the ways that have actually happened."""
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        for rel in REQUIRED_FILES:
            (root / rel).parent.mkdir(parents=True, exist_ok=True)
            (root / rel).write_text("x\n", encoding="utf-8")
        (root / "CLAUDE.md").write_text("<!-- note -->\n\n@AGENTS.md\n", encoding="utf-8")
        (root / ".gitignore").write_text(".env\n.env.*\n!.env.example\n", encoding="utf-8")
        (root / ".env.example").write_text(
            "# names only\nNCBI_API_KEY=\nCONTACT_EMAIL=me@example.org\n", encoding="utf-8"
        )
        (root / ".mcp.json").write_text(
            '{"env": {"K": "${NCBI_API_KEY}", "D": "${CLAUDE_PROJECT_DIR}"}}', encoding="utf-8"
        )
        (root / "docs/reference/RESOURCES.md").write_text(
            "> Last updated: 2026-10-01.\n", encoding="utf-8"
        )
        e, w = check(root, today=date(2026, 10, 10))
        assert e == [] and w == [], (e, w)

        # a resources list nobody refreshed warns but does not fail
        e, w = check(root, today=date(2026, 12, 1))
        assert e == [] and len(w) == 1, (e, w)

        # a stray doc at the docs root, prose instead of an import, a missing file
        (root / "docs/CAPABILITIES.md").write_text("x\n", encoding="utf-8")
        (root / "CLAUDE.md").write_text("Read AGENTS.md first.\n", encoding="utf-8")
        (root / "SECURITY.md").unlink()
        e, _ = check(root, today=date(2026, 10, 10))
        assert any("docs/CAPABILITIES.md" in x for x in e), e
        assert any("@AGENTS.md" in x for x in e), e
        assert "missing SECURITY.md" in e, e
        assert len(e) == 3, e

        # a real key in the example, an MCP secret it doesn't name, .env not ignored
        (root / ".env.example").write_text("NCBI_API_KEY=abc123\n", encoding="utf-8")
        (root / ".mcp.json").write_text('{"env": {"T": "${GITHUB_TOKEN}"}}', encoding="utf-8")
        (root / ".gitignore").write_text("node_modules/\n", encoding="utf-8")
        e = check_env(root)
        assert any("gives NCBI_API_KEY a value" in x for x in e), e
        assert any("${GITHUB_TOKEN}" in x for x in e), e
        assert any(".gitignore" in x for x in e), e
        assert len(e) == 3, e
        # '.env.*' without the negation hides the example from git
        (root / ".gitignore").write_text(".env\n.env.*\n", encoding="utf-8")
        assert any("!.env.example" in x for x in check_env(root))

    # capital Docs/ is caught by name, whatever the filesystem's case rules
    # (a fresh dir: on Windows, Docs/ and docs/ cannot both exist)
    with tempfile.TemporaryDirectory() as tmp:
        (Path(tmp) / "Docs").mkdir()
        e, _ = check(Path(tmp), today=date(2026, 10, 10))
        assert any("'Docs/'" in x for x in e), e
    print("self-check ok")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--root", type=Path, help="repo to check (default: this script's repo)")
    ap.add_argument("--self-check", action="store_true", help="run the self-check and exit")
    args = ap.parse_args()
    if args.self_check:
        return self_check()

    root = (args.root or Path(__file__).resolve().parent.parent).resolve()
    errors, warnings = check(root)
    for w in warnings:
        print(f"  warn  {w}")
    for e in errors:
        print(f"  ERROR {e}")
    if errors:
        print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
        return 1
    print(f"workspace standard: all clear ({len(warnings)} warning(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
