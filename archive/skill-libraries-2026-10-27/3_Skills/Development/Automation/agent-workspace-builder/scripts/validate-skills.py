#!/usr/bin/env python3
"""Lint .claude/ config and the portable skills/ against the Agent Skills spec.

A malformed SKILL.md does not raise an error -- it just quietly fails to load, so
the skill is missing from the session and nothing says so. This catches that at
commit time instead. The root skills/ folder gets the same skill rules: it is what
other agents install, so a broken one fails somewhere you will never see.

    python scripts/validate-skills.py          # lint, exit non-zero on error
    python scripts/validate-skills.py --strict # warnings are errors too
    python scripts/validate-skills.py --self-check

Rules, from https://agentskills.io/specification.md :
  name         required, 1-64 chars, [a-z0-9-] only, must equal its directory name
  description  required, 1-1024 chars
  SKILL.md     under 500 lines

Commands and agents are checked too -- both need frontmatter with a description,
and an agent's `name` (when present) must match its filename.

ponytail: regex frontmatter parse, no YAML dependency. These files are hand-written
and shallow; if one ever needs nested YAML, reach for PyYAML then and not before.
"""
import argparse
import re
import sys
from pathlib import Path

NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
FRONTMATTER_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n", re.DOTALL)

MAX_NAME = 64
MAX_DESC = 1024
MAX_LINES = 500

errors: list[str] = []
warnings: list[str] = []


def err(path: Path, msg: str) -> None:
    errors.append(f"{path}: {msg}")


def warn(path: Path, msg: str) -> None:
    warnings.append(f"{path}: {msg}")


def frontmatter(text: str) -> dict[str, str] | None:
    """Return the top-level key/value pairs, or None when there is no frontmatter."""
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    out: dict[str, str] = {}
    key = None
    for line in m.group(1).splitlines():
        if not line.strip():
            continue
        # a continuation line is indented; fold it into the previous key
        if line[:1] in " \t" and key:
            out[key] += " " + line.strip()
            continue
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        out[key] = value.strip()
    return out


def check_skill(skill_md: Path) -> None:
    text = skill_md.read_text(encoding="utf-8", errors="replace")
    fm = frontmatter(text)
    if fm is None:
        err(skill_md, "no YAML frontmatter")
        return

    name = fm.get("name")
    if not name:
        err(skill_md, "frontmatter has no 'name'")
    else:
        if name != skill_md.parent.name:
            err(skill_md, f"name '{name}' != directory '{skill_md.parent.name}'")
        if len(name) > MAX_NAME:
            err(skill_md, f"name is {len(name)} chars, limit {MAX_NAME}")
        if not NAME_RE.match(name):
            err(skill_md, f"name '{name}' is not lowercase-with-hyphens")

    desc = fm.get("description")
    if not desc:
        err(skill_md, "frontmatter has no 'description'")
    elif len(desc) > MAX_DESC:
        err(skill_md, f"description is {len(desc)} chars, limit {MAX_DESC}")
    elif len(desc) < 40:
        warn(skill_md, f"description is only {len(desc)} chars -- too thin to trigger reliably")

    lines = text.count("\n") + 1
    if lines > MAX_LINES:
        err(skill_md, f"{lines} lines, limit {MAX_LINES}")
    elif lines > MAX_LINES * 0.8:
        warn(skill_md, f"{lines} lines, approaching the {MAX_LINES} limit")


def check_doc(path: Path, kind: str) -> None:
    """Commands and agents: frontmatter with a description, name matching filename."""
    text = path.read_text(encoding="utf-8", errors="replace")
    fm = frontmatter(text)
    if fm is None:
        warn(path, f"{kind} has no frontmatter")
        return
    if not fm.get("description"):
        warn(path, f"{kind} frontmatter has no 'description'")
    name = fm.get("name")
    if name and name != path.stem:
        err(path, f"name '{name}' != filename '{path.stem}'")


def run(root: Path) -> tuple[int, int]:
    claude = root / ".claude"
    if not claude.is_dir():
        err(root, "no .claude/ directory")
        return len(errors), len(warnings)

    skills = sorted((claude / "skills").glob("*/SKILL.md"))
    portable = sorted((root / "skills").glob("*/SKILL.md"))
    for base in (claude / "skills", root / "skills"):
        for d in sorted(p for p in base.glob("*") if p.is_dir()):
            if not (d / "SKILL.md").exists():
                err(d, "skill directory has no SKILL.md")
    for s in skills + portable:
        check_skill(s)
    for c in sorted((claude / "commands").glob("*.md")):
        check_doc(c, "command")
    for a in sorted((claude / "agents").glob("*.md")):
        check_doc(a, "agent")

    counts = (
        len(skills),
        len(list((claude / "commands").glob("*.md"))),
        len(list((claude / "agents").glob("*.md"))),
    )
    print(
        f"checked {counts[0]} skills, {counts[1]} commands, {counts[2]} agents, "
        f"{len(portable)} portable skills"
    )
    return len(errors), len(warnings)


def self_check() -> int:
    """Parse cases this has actually got wrong before."""
    assert frontmatter("no frontmatter here") is None
    assert frontmatter("---\nname: a\n---\n") == {"name": "a"}
    # a folded description must survive the line break
    fm = frontmatter("---\nname: a\ndescription: one\n  two\n---\n")
    assert fm["description"] == "one two", fm
    # CRLF files must parse -- .gitattributes checks out .md as LF, but an editor can save CRLF
    assert frontmatter("---\r\nname: a\r\n---\r\n") == {"name": "a"}
    assert NAME_RE.match("api-engineer") and not NAME_RE.match("Api_Engineer")
    assert not NAME_RE.match("trailing-")
    print("self-check ok")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--strict", action="store_true", help="treat warnings as errors")
    ap.add_argument("--self-check", action="store_true", help="run the parser self-check and exit")
    args = ap.parse_args()

    if args.self_check:
        return self_check()

    n_err, n_warn = run(Path(__file__).resolve().parent.parent)

    for w in warnings:
        print(f"  warn  {w}")
    for e in errors:
        print(f"  ERROR {e}")

    if n_err:
        print(f"\n{n_err} error(s), {n_warn} warning(s)")
        return 1
    if n_warn and args.strict:
        print(f"\n0 errors, {n_warn} warning(s) -- failing because --strict")
        return 1
    print(f"\nall clear ({n_warn} warning(s))")
    return 0


if __name__ == "__main__":
    sys.exit(main())
