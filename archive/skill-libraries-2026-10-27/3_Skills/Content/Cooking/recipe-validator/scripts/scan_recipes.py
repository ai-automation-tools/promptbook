#!/usr/bin/env python3
"""
scan_recipes.py — deterministic first pass for the recipe-validator skill.

Discovers recipe markdown files under a path, parses each (frontmatter,
ingredients, instructions, per-serving nutrition table, yield), and runs the
OBJECTIVE checks that don't need judgment — nutrition thresholds, allergen
cross-checks, food-safety keyword flags, and completeness. It prints a JSON
report to stdout (and optionally writes it with --out) so the model can review
the flags, apply culinary judgment (competing-recipe norms, technique
soundness, estimating nutrition when it isn't declared), and write the final
report.

This script is intentionally CONSERVATIVE: it flags things worth a human/LLM
look, not verdicts. Keyword matching over free text has false positives — every
finding carries a `confidence` so the model knows how hard to lean on it. The
model is the judge; this is the fast, consistent backbone across many recipes.

Usage:
  python scan_recipes.py <path-to-recipe.md-or-folder> [--out report.json]
  python scan_recipes.py <folder> --summary        # human-readable digest
"""
import argparse
import json
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Per-serving nutrition thresholds. Sources + rationale live in
# references/nutrition-and-quality.md — keep the two in sync. Cutoffs are the
# FDA %DV labeling model applied to a single dish: >=20% DV of the daily value
# in one serving = "high", plus a "very high" tier for egregious cases.
# ---------------------------------------------------------------------------
THRESHOLDS = {
    # nutrient: (daily_value, elevated_per_serving, high_per_serving, unit)
    "sodium_mg":       (2300, 460, 920, "mg"),   # 20% DV = 460; 40% DV = 920
    "sat_fat_g":       (20,   4,   8,   "g"),     # 20% DV = 4g;   40% DV = 8g
    "sugar_g":         (50,   10,  25,  "g"),     # added-sugars DV 50g; total-sugar proxy
    "calories_kcal":   (2000, 700, 1000, "kcal"),# rough "big single dish" flags
    "cholesterol_mg":  (300,  60,  120, "mg"),
}

# Allergen keyword map (FDA Big 9). Matched case-insensitively as whole-ish
# words against the ingredient block. Value = canonical allergen name used in
# the recipe frontmatter `allergens:` list.
ALLERGEN_KEYWORDS = {
    "dairy":     r"\b(milk|butter|cream|cheese|yogurt|ghee|buttermilk|parmesan|mozzarella|cheddar|ricotta|mascarpone|sour cream|half-and-half|crème fraîche|creme fraiche)\b",
    "egg":       r"\b(egg|eggs|egg yolk|egg white|mayonnaise|aioli|meringue)\b",
    "gluten":    r"\b(flour|wheat|bread|breadcrumb|panko|pasta|noodle|barley|rye|semolina|farro|couscous|cracker|soy sauce|beer|seitan|all-purpose)\b",
    "shellfish": r"\b(shrimp|prawn|crab|lobster|crawfish|crayfish|clam|mussel|oyster|scallop|squid|calamari|octopus)\b",
    "fish":      r"\b(fish|salmon|tuna|cod|halibut|anchovy|anchovies|sardine|trout|tilapia|mackerel|fish sauce|worcestershire)\b",
    "peanut":    r"\b(peanut|peanuts|peanut butter|groundnut)\b",
    "tree-nut":  r"\b(almond|walnut|pecan|cashew|pistachio|hazelnut|macadamia|pine nut|brazil nut|nut butter)\b",
    "soy":       r"\b(soy|soya|soybean|tofu|edamame|tempeh|miso|soy sauce|tamari)\b",
    "sesame":    r"\b(sesame|tahini)\b",
}

# "False friends": phrases that contain an allergen keyword but are NOT that
# allergen. Masked out of the ingredient text BEFORE the per-allergen search so
# the scanner stops flagging vegan/plant swaps and lookalike produce. Keep these
# specific — the goal is killing confirmed false positives (butter beans, plant
# milks, oyster mushrooms), not suppressing real ones. Judgment-call matches
# (worcestershire→fish trace, soy sauce→wheat, refined peanut/soy oil) are left
# in on purpose for the model to weigh; see references/food-safety.md §4.
ALLERGEN_FALSE_FRIENDS = {
    # "peanut/almond/oat/coconut… butter|milk|cream", "butter beans/lettuce",
    # "cream of tartar", non-dairy creamer — none are dairy.
    "dairy": r"\b(?:peanut|nut|almond|cashew|hazelnut|sunflower|soy|soya|oat|rice|hemp|coconut|cocoa|shea|apple|plant[- ]based|vegan)\s+(?:butter|milk|cream)\b"
             r"|\bbutter\s+(?:beans?|lettuce)\b|\bcream\s+of\s+tartar\b|\bnon[- ]?dairy\b|\bcreamer\b",
    # "oyster mushroom" is a fungus and "oyster crackers" are just crackers —
    # neither is a mollusk. (A bare "oyster" in a mushroom list, e.g. "cremini,
    # shiitake, or oyster", is left for the model to read in context.)
    "shellfish": r"\boyster\s+(?:mushrooms?|crackers?)\b",
}

# Raw-protein keywords → a dish that starts from these should give a cook temp
# or an unambiguous doneness cue somewhere in the instructions.
RAW_PROTEIN = r"\b(chicken|turkey|duck|poultry|beef|steak|pork|lamb|veal|ground (beef|pork|turkey|chicken|lamb)|sausage|bacon|shrimp|prawn|fish|salmon|tuna|cod|scallop|egg|eggs|burger|meatball|meatloaf)\b"

# Danger keywords → potential food-safety problems needing the safe-handling
# rule (see references/food-safety.md). Each is (regex, hazard, confidence,
# severity). Most are `critical` (a violated safe-handling rule = unsafe as
# written); home-canning is `warning` because the scanner can't tell high-acid
# (water-bath-safe: pickles, most fruit, acidified tomato) from low-acid
# (pressure-canner-only) — the model decides which after reading the method.
DANGER_PATTERNS = [
    (r"\b(kidney bean|red bean)s?\b.{0,80}\b(slow cook|slow-cook|crockpot|crock pot|raw|dried|soak)\b",
     "Raw/undercooked red kidney beans contain phytohaemagglutinin — must be boiled vigorously ≥10 min; slow-cooking from raw is unsafe.", "medium", "critical"),
    (r"\b(garlic|herb|basil|rosemary)s?\b.{0,40}\boil\b.{0,60}\b(room temperature|counter|store|keep|jar)\b",
     "Garlic/herbs in oil stored at room temperature is a botulism risk — refrigerate and use within days, or acidify.", "medium", "critical"),
    (r"\b(pressure canner|water[- ]bath canner|boiling[- ]water bath|process (?:the )?jars?|seal the (?:lids|jars)|home[- ]?canning)\b",
     "Home-canning/preserving recipe — verify the method matches the food's acidity: HIGH-acid (pickles/vinegar brines, most jams & fruit, properly acidified tomatoes) is safely water-bath canned; LOW-acid (plain vegetables, meats, poultry, fish, mixtures) requires a PRESSURE canner — a boiling-water bath won't prevent botulism. Confirm against a tested USDA/NCHFP recipe and adjust the process time for altitude.", "low", "warning"),
    (r"\breuse\b.{0,30}\bmarinade\b",
     "Reusing marinade that touched raw meat without boiling it first is unsafe.", "medium", "critical"),
    (r"\bmarinat\w+\b.{0,40}\b(room temperature|counter|overnight on the counter)\b",
     "Marinating meat at room temperature is unsafe — marinate in the refrigerator.", "medium", "critical"),
    (r"\b(rhubarb leaves|elderberr|raw cassava|ackee)\b",
     "Ingredient is toxic unless specially handled — verify safe preparation.", "medium", "critical"),
]

SKIP_NAMES = {"readme.md", "categories.md", "region-list.md"}
SKIP_DIRS = {"Images", "Templates", "Prompts", "PDFs", ".git"}


def parse_frontmatter(text):
    m = re.match(r"^﻿?---\r?\n(.*?)\r?\n---\r?\n", text, re.S)
    if not m:
        # No YAML block. ~40% of the library uses a leading "| **field** | value |"
        # metadata table instead (e.g. Regions "At a Glance"). Parse that so their
        # allergens/yield/tags aren't invisible (which mislabels a real allergen
        # gap as "no labeling"). Return text unchanged — the table lines aren't
        # `##` sections, so section-splitting and the `# Title` scan still work.
        return parse_table_frontmatter(text), text
    fields = {}
    for line in m.group(1).splitlines():
        kv = re.match(r"^([\w-]+):\s*(.*)$", line)
        if not kv:
            continue
        key, val = kv.group(1).lower(), kv.group(2).strip()
        if val.startswith("[") and val.endswith("]"):
            fields[key] = [x.strip().strip('"\'') for x in val[1:-1].split(",") if x.strip()]
        else:
            fields[key] = val.strip('"\'')
    return fields, text[m.end():]


def parse_table_frontmatter(text):
    """Extract metadata when there's no YAML `---` block. Handles the two other
    formats in the library, both scanned only near the top of the file:
      • a markdown table   `| **allergens** | gluten (tortillas) |`
      • bold inline lines  `**Allergens:** gluten, dairy`
    `servings` is aliased to `yield`."""
    fields = {}
    head = "\n".join(text.splitlines()[:50])
    # Table rows: | **key** | value |
    for row in re.finditer(r"^\|\s*\*{0,2}([\w /-]+?)\*{0,2}\s*\|\s*(.+?)\s*\|\s*$", head, re.M):
        key = re.sub(r"\s+", "_", row.group(1).strip().lower())
        val = row.group(2).strip()
        if key in ("field", "detail", "info") or set(val) <= set("-|: "):
            continue  # header ("| Field | Value |") or divider ("|---|---|") row
        fields.setdefault(key, val)
    # Bold inline lines: **Key:** value  (e.g. ClassicBurger)
    for row in re.finditer(r"^\*\*([\w /-]+?):?\*\*[:\s]*(.+?)\s*$", head, re.M):
        key = re.sub(r"\s+", "_", row.group(1).strip().lower())
        val = row.group(2).strip()
        if val:
            fields.setdefault(key, val)
    if "servings" in fields and "yield" not in fields:
        fields["yield"] = fields["servings"]
    return fields


def as_list(val):
    """Coerce a frontmatter value to a list. Bracketed lists (`[a, b]`) are
    already parsed to a Python list; an UNBRACKETED scalar (`allergens: a, b, c`)
    arrives as a string — split it on comma/semicolon rather than letting a
    caller iterate it character-by-character (which turned `gluten, soy, egg`
    into {'g','l','u',...} and broke the allergen check)."""
    if val is None:
        return []
    if isinstance(val, list):
        return val
    return [x.strip() for x in re.split(r"[;,]", str(val)) if x.strip()]


def split_sections(body):
    """Return {heading_lower: text} for `## ` sections, plus preamble under ''."""
    sections, heading, buf = {}, "", []
    for line in body.splitlines():
        h = re.match(r"^##\s+(.+?):?\s*$", line)
        if h:
            sections[heading.lower()] = "\n".join(buf).strip()
            heading, buf = h.group(1).strip(), []
        else:
            buf.append(line)
    sections[heading.lower()] = "\n".join(buf).strip()
    return sections


def parse_servings(yield_str, body=""):
    """Servings from the frontmatter `yield:`, else an inline
    `**Servings:** 4` / `Makes 4` / `Yield: 6-8` line (My-Recipes clippings)."""
    src = str(yield_str) if yield_str else ""
    if not src:
        # Inline meta lines: "**Servings:** 4", "Serves: 6", "Makes 12", "Yield: 6-8".
        m = re.search(r"\*{0,2}(?:Servings?|Serves|Yields?|Makes)\*{0,2}[:\s|]*\**\s*([\d]+(?:\s*[-–]\s*[\d]+)?)", body, re.I)
        if m:
            src = m.group(1)
    # An explicit range ("6-8 servings") → midpoint. Otherwise take the FIRST
    # number and ignore trailing counts like "4 servings (12 tacos)" → 4, not 8.
    rng = re.search(r"(\d+)\s*[-–]\s*(\d+)", src)
    if rng:
        return (int(rng.group(1)) + int(rng.group(2))) / 2
    m = re.search(r"\d+", src)
    return int(m.group(0)) if m else None


def parse_nutrition(sections):
    """Parse a `| Nutrient | Amount |` table (per serving) into numbers."""
    text = sections.get("nutrition", "")
    if not text:
        return {}
    out = {}
    keymap = {
        "sodium": "sodium_mg", "saturated fat": "sat_fat_g", "sugar": "sugar_g",
        "sugars": "sugar_g", "added sugar": "sugar_g", "calories": "calories_kcal",
        "energy": "calories_kcal", "cholesterol": "cholesterol_mg",
        "total fat": "fat_g", "fat": "fat_g", "protein": "protein_g",
        "carbohydrate": "carb_g", "carbohydrates": "carb_g", "fiber": "fiber_g",
    }
    for row in re.finditer(r"^\|\s*([A-Za-z][A-Za-z /]*?)\s*\|\s*([\d.,]+)\s*(\w+)?", text, re.M):
        name = row.group(1).strip().lower()
        if name in keymap:
            try:
                out.setdefault(keymap[name], float(row.group(2).replace(",", "")))
            except ValueError:
                pass
    return out


def check_recipe(path, text):
    fields, body = parse_frontmatter(text)
    sections = split_sections(body)
    title = (re.search(r"^#\s+(.+)$", body, re.M) or [None, path.stem])[1]
    if isinstance(title, str):
        title = title.strip()

    # Ingredient sections, but NOT "Ingredient Substitutions / Swaps / Variations"
    # — swap suggestions ("king oyster mushroom", "dairy butter if not vegan")
    # are not ingredients in the dish and produce phantom allergen/protein flags.
    ing_text = "\n".join(v for k, v in sections.items()
                         if "ingredient" in k and not re.search(r"substitut|swap|variation|instead|note", k))
    # Drop inline swap/substitution bullets ("oyster mushrooms -> king oyster",
    # "plant-based butter -> dairy butter") that sit inside an ingredient list as
    # `###` subsections split_sections can't isolate — they aren't in the dish.
    ing_text = "\n".join(l for l in ing_text.splitlines()
                         if not re.search(r"->|→|\bor\b.{0,30}\bif (?:a |you|not|vegan|dairy)", l, re.I))
    instr_text = "\n".join(v for k, v in sections.items() if "instruction" in k or "method" in k or "direction" in k)
    servings = parse_servings(fields.get("yield"), body)
    nutrition = parse_nutrition(sections)
    # Inline nutrition (My-Recipes clippings: "**Calories:** 238", "Sodium 959 mg")
    if "sodium_mg" not in nutrition:
        for label, key in [("sodium", "sodium_mg"), ("saturated fat", "sat_fat_g"),
                           ("calories", "calories_kcal"), ("cholesterol", "cholesterol_mg")]:
            m = re.search(rf"\b{label}\b[:\s|]*\**\s*([\d.,]+)\s*(mg|g|kcal)?", body, re.I)
            if m:
                try:
                    nutrition.setdefault(key, float(m.group(1).replace(",", "")))
                except ValueError:
                    pass
    findings = []

    def add(severity, category, message, confidence="high", fix=""):
        findings.append({"severity": severity, "category": category,
                         "message": message, "confidence": confidence, "fix": fix})

    # --- completeness -----------------------------------------------------
    if not ing_text.strip():
        add("warning", "completeness", "No Ingredients section found.", fix="Add an Ingredients section.")
    if not instr_text.strip():
        add("warning", "completeness", "No Instructions/Method section found.", fix="Add step-by-step instructions.")
    if servings is None:
        add("note", "completeness", "No parseable yield/servings (needed for per-serving checks).", fix="Add a `yield:` like \"6 servings\".")
    # Times can be a frontmatter field, an inline meta line ("**Total:** 4 hr",
    # "Cook: 3½–4 hours"), or a duration anywhere in the steps.
    has_time = (fields.get("active_time_min") or fields.get("total_time_min")
                or re.search(r"[\d½¼¾]+\s*(?:min(?:ute)?s?|h(?:ou)?rs?)\b", body, re.I)
                or re.search(r"\*{0,2}(?:Prep|Cook|Total|Time)\*{0,2}[:\s]", body, re.I))
    if not has_time:
        add("note", "completeness", "No cooking times given.", "medium", "Add active/total time.")

    # --- nutrition (only when the recipe declares a per-serving table) -----
    for nut, val in nutrition.items():
        if nut in THRESHOLDS:
            dv, elevated, high, unit = THRESHOLDS[nut]
            label = nut.replace("_mg", "").replace("_g", "").replace("_kcal", "").replace("_", " ")
            if val >= high:
                add("health", "nutrition",
                    f"Very high {label}: {val:g}{unit}/serving (≥{high}{unit}, ~{round(val/dv*100)}% DV).",
                    "high", "Expected for indulgent/rich dishes; flag only if the dish shouldn't be this heavy.")
            elif val >= elevated:
                add("health", "nutrition",
                    f"Elevated {label}: {val:g}{unit}/serving (≥{elevated}{unit}, ~{round(val/dv*100)}% DV).",
                    "high", "")
    if not nutrition:
        add("note", "nutrition", "No declared per-serving nutrition — estimate sodium/sat-fat/sugar from ingredients to judge healthfulness.", "high")

    # --- allergen cross-check --------------------------------------------
    # Detect Big-9 allergens in the ingredients, masking known false friends
    # first (butter beans, plant milks, oyster mushrooms). How we REPORT depends
    # on whether the recipe even has an `allergens:` field:
    #   • field present  → per-allergen WARNING for anything detected-not-declared
    #     (a genuine labeling gap; `allergens: none` counts as present).
    #   • field absent   → a single NOTE listing what's present. You can't be
    #     "missing" from a list that doesn't exist, so N warnings would be noise
    #     (these are recipe-clipping formats that carry no allergen labeling).
    # Normalize declared tokens: strip parenthetical notes ("gluten (tortillas)"
    # → "gluten") so table-format declarations match the keyword names.
    declared = {re.sub(r"\(.*?\)", "", a).strip().lower() for a in as_list(fields.get("allergens"))}
    declared = {a for a in declared if a and a not in ("none", "n/a")}
    allergen_field_present = "allergens" in fields
    ing_low = ing_text.lower()
    detected = []
    for allergen, pattern in ALLERGEN_KEYWORDS.items():
        scan_text = ing_low
        ff = ALLERGEN_FALSE_FRIENDS.get(allergen)
        if ff:
            scan_text = re.sub(ff, " ", scan_text)
        hit = re.search(pattern, scan_text)
        if hit:
            detected.append((allergen, hit.group(0)))
    if allergen_field_present:
        for allergen, hit in detected:
            if allergen in declared or (allergen == "gluten" and "wheat" in declared):
                continue
            add("warning", "allergen",
                f"Ingredients appear to contain {allergen} (\"{hit}\") but it isn't in the declared allergens.",
                "medium", f"Add \"{allergen}\" to the allergens list, or confirm the ingredient is allergen-free.")
    elif detected:
        names = ", ".join(sorted({a for a, _ in detected}))
        add("note", "allergen",
            f"No allergens field declared; ingredients suggest: {names}. Informational — this recipe format carries no allergen labeling to complete.",
            "medium", "If this collection should label allergens, add an `allergens:` field covering the Big-9 present.")

    # --- food safety: raw protein cooked without a doneness cue -----------
    # Only count proteins that are actually cooked from raw. Skip ones already
    # qualified as pre-cooked (cooked/rotisserie/smoked/canned/deli/leftover,
    # cured meats) and flavorings (fish sauce, worcestershire, anchovy) — those
    # aren't a "cook this to temp" hazard. This stays a soft "verify" warning;
    # the model escalates to critical when it confirms a genuinely raw-protein
    # dish with no safe endpoint.
    PRECOOKED = r"(cooked|pre-cooked|precooked|rotisserie|leftover|smoked|canned|deli|cured|roasted|grilled|shredded)"
    raw_cook = False
    for m in re.finditer(RAW_PROTEIN, ing_low):
        pre = ing_low[max(0, m.start() - 22):m.start()]
        post = ing_low[m.end():m.end() + 16]
        word = m.group(0)
        if re.search(PRECOOKED + r"\s+\w*\s*$", pre):
            continue  # "cooked chicken", "smoked salmon"
        if re.match(r"\s+(?:broth|stock|base|bouillon|consomm|paste|bouillion)", post):
            continue  # "chicken stock", "beef broth" — a liquid, not raw meat to cook to temp
        if word in ("fish",) and re.search(r"fish\s+sauce", ing_low):
            continue
        if word in ("bacon", "sausage", "pepperoni", "salami", "prosciutto", "ham"):
            continue  # cured; cooked as flavor, not a temp-critical primary
        raw_cook = True
        break
    if raw_cook:
        has_temp = re.search(r"\d{2,3}\s*°?\s*[FfCc]\b|\binternal temp|thermometer", instr_text, re.I)
        has_doneness = re.search(r"\b(cooked through|no (?:longer )?pink|opaque|golden brown|until done|fully cooked|reaches?|springs? back|firm to the touch|flakes?)\b", instr_text, re.I)
        no_cook = re.search(r"\bno[- ]cook\b", " ".join(str(t) for t in as_list(fields.get("tags"))).lower() + " " + title.lower())
        if not has_temp and not has_doneness and not no_cook:
            add("warning", "food-safety",
                "Cooks raw meat/poultry/seafood/egg but no explicit internal temperature or doneness cue was found — verify a safe endpoint is given.",
                "medium", "Add the USDA safe minimum internal temp (poultry 165°F, ground meat 160°F, whole cuts 145°F+rest, fish 145°F) or a clear doneness cue. Escalate to critical if it's genuinely missing.")

    # --- danger keyword patterns -----------------------------------------
    full_low = (ing_text + "\n" + instr_text).lower()
    for pattern, hazard, conf, sev in DANGER_PATTERNS:
        if re.search(pattern, full_low, re.S):
            add(sev, "food-safety", hazard, conf, "Verify against a food-safety source (USDA/NCHFP) before trusting this recipe.")

    return {
        "path": str(path),
        "title": title,
        "region": fields.get("region", ""),
        "tags": as_list(fields.get("tags")),
        "servings": servings,
        "declared_nutrition": nutrition,
        "declared_allergens": sorted(declared),
        "num_findings": len(findings),
        "max_severity": _max_sev(findings),
        "findings": findings,
    }


SEV_ORDER = {"critical": 4, "health": 3, "warning": 2, "note": 1}


def _max_sev(findings):
    return max((f["severity"] for f in findings), key=lambda s: SEV_ORDER.get(s, 0), default="ok")


def discover(root):
    root = Path(root)
    if root.is_file():
        return [root]
    out = []
    for p in sorted(root.rglob("*.md")):
        if p.name.lower() in SKIP_NAMES:
            continue
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        out.append(p)
    return out


def main():
    # UTF-8 stdout/stderr so °F, ≥, • render on any console (Windows cp1252).
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass
    ap = argparse.ArgumentParser()
    ap.add_argument("path", help="recipe .md file or a folder of recipes")
    ap.add_argument("--out", help="write JSON here")
    ap.add_argument("--summary", action="store_true", help="print a human digest instead of JSON")
    args = ap.parse_args()

    files = discover(args.path)
    if not files:
        print(f"No recipe .md files found under {args.path}", file=sys.stderr)
        sys.exit(1)

    results = []
    for f in files:
        try:
            results.append(check_recipe(f, f.read_text(encoding="utf-8", errors="replace")))
        except Exception as e:  # never let one bad file kill the batch
            results.append({"path": str(f), "title": f.stem, "error": str(e), "findings": [], "max_severity": "error"})

    report = {
        "scanned": len(results),
        "counts_by_severity": {s: sum(1 for r in results for fi in r.get("findings", []) if fi["severity"] == s)
                               for s in SEV_ORDER},
        "recipes_with_critical": [r["title"] for r in results if r.get("max_severity") == "critical"],
        "recipes": sorted(results, key=lambda r: SEV_ORDER.get(r.get("max_severity"), 0), reverse=True),
    }

    if args.out:
        Path(args.out).write_text(json.dumps(report, indent=2), encoding="utf-8")

    if args.summary:
        print(f"Scanned {report['scanned']} recipes.")
        print("Findings by severity:", report["counts_by_severity"])
        if report["recipes_with_critical"]:
            print("Critical:", ", ".join(report["recipes_with_critical"][:20]))
        for r in report["recipes"][:15]:
            if r.get("findings"):
                print(f"\n• {r['title']}  [{r.get('max_severity')}]  ({r['path']})")
                for fi in r["findings"]:
                    print(f"    {fi['severity']:8} {fi['category']:12} {fi['message']}")
    else:
        print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
