#!/usr/bin/env python3
"""Load the workspace's .env, for scripts and for MCP servers that need a secret.

Secrets live in .env at the repo root (gitignored); .env.example lists the names and
is committed. Nothing reads .env on its own: Claude Code's ${VAR} substitution in
.mcp.json only sees the process environment. So:

    # in a script under scripts/
    from envfile import load_env
    load_env()                                   # then os.environ["NCBI_API_KEY"]

    # in .mcp.json, wrap a server that needs a secret
    "command": "python", "args": ["scripts/envfile.py", "--", "uvx", "serper-mcp-server"]

    python scripts/envfile.py --names            # which names .env sets (never values)
    python scripts/envfile.py --self-check

A variable already set in the environment wins over .env, so CI and one-off overrides
work. Values are never printed. Stdlib only.
"""
from __future__ import annotations

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def parse(text: str) -> dict[str, str]:
    """KEY=value lines; '#' comments, blank lines and an 'export ' prefix are allowed."""
    out: dict[str, str] = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.removeprefix("export ").partition("=")
        key, value = key.strip(), value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "'\"":
            value = value[1:-1]
        elif " #" in value:
            value = value.split(" #", 1)[0].rstrip()
        if key.isidentifier():
            out[key] = value
    return out


def load_env(path: Path | None = None) -> list[str]:
    """Set every name in .env that the environment doesn't already have. Returns the names set."""
    path = path or ROOT / ".env"
    if not path.is_file():
        return []
    loaded = []
    for key, value in parse(path.read_text(encoding="utf-8-sig")).items():
        # an empty or unexpanded "${KEY}" (a client that passed .mcp.json's env through
        # without a value) counts as unset, or it would mask the real value in .env
        current = os.environ.get(key, "")
        if value and (not current or current.startswith("${")):
            os.environ[key] = value
            loaded.append(key)
    return loaded


def self_check() -> int:
    env = parse(
        "# comment\nexport A=1\nB = two \nC='quoted # not a comment'\nD=x # trailing\n"
        "EMPTY=\nnot a line\n1BAD=x\n"
    )
    assert env == {"A": "1", "B": "two", "C": "quoted # not a comment", "D": "x", "EMPTY": ""}, env
    with tempfile.TemporaryDirectory() as d:
        p = Path(d) / ".env"
        p.write_text("ENVFILE_SELFTEST_X=from-file\nENVFILE_SELFTEST_Y=from-file\n"
                     "ENVFILE_SELFTEST_Z=from-file\n", encoding="utf-8")
        os.environ["ENVFILE_SELFTEST_Y"] = "from-env"
        os.environ["ENVFILE_SELFTEST_Z"] = "${ENVFILE_SELFTEST_Z}"
        try:
            assert load_env(p) == ["ENVFILE_SELFTEST_X", "ENVFILE_SELFTEST_Z"]
            assert os.environ["ENVFILE_SELFTEST_X"] == "from-file"
            assert os.environ["ENVFILE_SELFTEST_Y"] == "from-env"   # environment wins
            assert os.environ["ENVFILE_SELFTEST_Z"] == "from-file"  # unexpanded placeholder doesn't
        finally:
            for k in ("X", "Y", "Z"):
                os.environ.pop(f"ENVFILE_SELFTEST_{k}", None)
        assert load_env(Path(d) / "missing") == []
    print("envfile self-check: ok")
    return 0


def main(argv: list[str]) -> int:
    if argv[:1] == ["--self-check"]:
        return self_check()
    if argv[:1] == ["--names"]:
        names = sorted(parse((ROOT / ".env").read_text(encoding="utf-8-sig"))) if (ROOT / ".env").is_file() else []
        print("\n".join(names) if names else "no .env, or it sets nothing")
        return 0
    if argv[:1] == ["--"] and len(argv) > 1:
        load_env()
        # which() finds npx.cmd / uvx.exe via PATHEXT; no shell, so an argument like
        # "mcp<2" reaches the program instead of becoming a cmd.exe redirect
        return subprocess.call([shutil.which(argv[1]) or argv[1], *argv[2:]])
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
