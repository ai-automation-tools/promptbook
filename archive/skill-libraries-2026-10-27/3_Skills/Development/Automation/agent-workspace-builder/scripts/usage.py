#!/usr/bin/env python3
"""Measure how much a workspace is actually used, from local Claude Code session logs.

Replaces the "the owner says it's in daily use" go-live gate with a number a scheduled job
can check. Claude Code keeps one .jsonl transcript per session under
~/.claude/projects/<the session's folder, every non-alphanumeric character as '-'>/.
Scheduled jobs run in their own worktrees (other folders), so only sessions opened in this
clone count.

    python scripts/usage.py                          # sessions and active days, last 30 days
    python scripts/usage.py --check --min-days 10    # exit 1 unless >= 10 active days in 30
    python scripts/usage.py --self-check

An "active day" is a calendar day (UTC) with at least one message in a session here. Only
timestamps are read; no transcript content is printed. Local-only: CI has no logs, so CI
never runs this. Stdlib only.
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
import tempfile
from datetime import UTC, date, datetime, timedelta
from pathlib import Path

TS_RE = re.compile(r'"timestamp":\s*"(\d{4}-\d{2}-\d{2})')


def repo_root() -> Path:
    """The main clone, even when run from a worktree (a job's worktree is not 'use')."""
    here = Path(__file__).resolve().parent.parent
    try:
        common = subprocess.run(["git", "rev-parse", "--path-format=absolute", "--git-common-dir"],
                                cwd=here, capture_output=True, text=True, check=True).stdout.strip()
        return Path(common).parent
    except (OSError, subprocess.CalledProcessError):
        return here


def log_dir(root: Path, projects: Path) -> Path:
    return projects / re.sub(r"[^A-Za-z0-9]", "-", str(root))


def measure(logs: Path, since: date) -> tuple[int, set[date]]:
    """(sessions with activity since `since`, the set of active days)."""
    sessions, days = 0, set()
    if not logs.is_dir():
        return 0, days
    for f in logs.glob("*.jsonl"):
        seen = set()
        with f.open(encoding="utf-8", errors="replace") as fh:
            for line in fh:
                m = TS_RE.search(line)
                if m:
                    d = date.fromisoformat(m.group(1))
                    if d >= since:
                        seen.add(d)
        if seen:
            sessions += 1
            days |= seen
    return sessions, days


def self_check() -> int:
    with tempfile.TemporaryDirectory() as tmp:
        projects = Path(tmp)
        root = Path(r"D:\Repos\Org_Agents\Claude_Science")
        logs = log_dir(root, projects)
        assert logs.name == "D--Repos-Org-Agents-Claude-Science", logs.name
        logs.mkdir()
        (logs / "a.jsonl").write_text(
            '{"timestamp":"2026-10-01T10:00:00Z"}\n{"timestamp":"2026-10-02T09:00:00Z"}\n', encoding="utf-8")
        (logs / "b.jsonl").write_text('{"timestamp":"2026-10-02T11:00:00Z"}\n', encoding="utf-8")
        (logs / "old.jsonl").write_text('{"timestamp":"2026-08-01T11:00:00Z"}\n', encoding="utf-8")
        s, d = measure(logs, date(2026, 9, 20))
        assert (s, len(d)) == (2, 2), (s, d)
        assert measure(projects / "missing", date(2026, 9, 20)) == (0, set())
    print("usage self-check: ok")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--days", type=int, default=30, help="window in days (default 30)")
    ap.add_argument("--min-days", type=int, default=10, help="active days needed for --check")
    ap.add_argument("--check", action="store_true", help="exit 1 below --min-days")
    ap.add_argument("--projects", type=Path, default=Path.home() / ".claude" / "projects")
    ap.add_argument("--self-check", action="store_true")
    args = ap.parse_args()
    if args.self_check:
        return self_check()

    root = repo_root()
    since = datetime.now(UTC).date() - timedelta(days=args.days)
    sessions, days = measure(log_dir(root, args.projects), since)
    print(f"{root.name}: {sessions} session(s) on {len(days)} active day(s) in the last {args.days} days")
    if args.check:
        ok = len(days) >= args.min_days
        print(f"{'PASS' if ok else 'not yet'}: need {args.min_days} active days")
        return 0 if ok else 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
