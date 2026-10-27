---
title: "✍️ recipe-validator"
name: recipe-validator
description: >-
  Validate food recipes for quality and safety. Checks safe cooking
  temperatures and dangerous ingredients/techniques (food safety), per-serving
  sodium / saturated fat / added sugar against health standards, ingredient
  quantities and ratios versus comparable recipes, allergen labeling
  completeness, and recipe coherence — then reports findings ranked by severity
  with concrete fixes. Use this whenever the user wants to check, validate,
  review, audit, quality-check, or "sanity-check" one recipe or a whole folder
  of recipes, asks whether a recipe is safe, healthy, balanced, or well-made, or
  mentions reviewing recipe nutrition, salt/fat/sugar content, or food-safety
  issues — even if they don't use the word "validate." The recipe location is a
  parameter, so it works on a single file, a folder, or an entire recipe
  collection in any layout.
tags: ["skill","content","cooking","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/core/cooking/recipe-validator/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Recipe validator

Judge whether food recipes are **safe to cook, healthy within reason, and made to a competent standard** — then report exactly what's wrong and how to fix it. This is a *review*, not an edit: never rewrite the recipes unless the user explicitly asks. Recipes are just files; the value is a trustworthy, consistent second opinion across one recipe or hundreds.

The engine is a hybrid. A **script does the objective, repetitive checks** the same way every time (parsing, nutrition thresholds, allergen cross-checks, food-safety keyword flags, completeness). **You apply judgment** on the things a regex can't: is a quantity sane versus how this dish is normally made, is the technique sound, is a high-sodium number a real problem or just an honestly rich braise, and — when nutrition isn't declared — roughly what is it. Trust neither alone.

## Inputs

- **Location** — a recipe `.md` file, or a folder of them. If the user doesn't say, ask which recipe or folder to validate.
- **Output** — for a single recipe, report inline. For a folder, write the markdown report **into this skill's own `reports/` folder** — `skills/recipe-validator/reports/recipe-validation-report_<YYYY-MM-DD>.md` (create the folder if missing; it's gitignored, so run outputs stay local and never clutter the repo) — plus the raw `scan_<YYYY-MM-DD>.json` beside it, and give a short inline summary. Ask if the user wants a different destination. *(Don't confuse `reports/` — run output — with `evals/`, the tracked test-case definitions.)*

## Workflow

### 1. Scan (the deterministic backbone)

Run the scanner over the target — it discovers recipes, parses them, and emits JSON findings:

```bash
# write the scan into this skill's gitignored reports/ folder (mkdir if needed)
python skills/recipe-validator/scripts/scan_recipes.py <path> --out skills/recipe-validator/reports/scan_<YYYY-MM-DD>.json
# add --summary for a quick human digest instead of JSON
```

It flags: declared per-serving nutrition over threshold, ingredients that look like an undeclared allergen, raw meat/poultry/seafood/egg with no temperature or doneness cue, dangerous-ingredient keyword patterns (raw kidney beans + slow cooker, garlic-in-oil at room temp, reused marinade, toxic-if-raw plants…), and missing yield/times/sections. Read the scan JSON. The scanner is **conservative and keyword-based**, so every finding carries a `confidence` — treat it as "look here," not a verdict.

What the scanner already handles for you (so you don't re-flag it):
- **Three frontmatter formats** — YAML `---`, a `| **field** | value |` table, and bold `**Key:** value` lines are all parsed for allergens/yield/tags. If a recipe's metadata still looks unparsed, read it yourself.
- **Allergens** — per-allergen **warnings** only when an `allergens:` field *exists but omits* a detected Big-9; when there's **no field at all**, a single **note** instead (not a wall of warnings). Known keyword false friends (butter beans, plant milks, oyster mushroom, swap-suggestion lines) are masked; the judgment-call ones (worcestershire→fish, soy sauce→gluten, refined peanut oil) are left in for you — see food-safety.md §4.
- **Home-canning** is a **warning**, not a critical: the scanner can't measure pH, so *you* decide high-acid (water-bath-safe: pickles, fruit butters, acidified tomato/relish) vs low-acid (pressure-canner-only). See food-safety.md §3.

### 2. Load the standards

Read both references before judging, so your thresholds and rules match the authorities rather than vibes:

- **`references/food-safety.md`** — USDA safe cooking temps, the Danger Zone, dangerous ingredients + their safe-handling rules, the FDA Big-9 allergens, technique red flags.
- **`references/nutrition-and-quality.md`** — per-serving sodium/sat-fat/added-sugar cutoffs, how to estimate nutrition when it isn't declared, quantity/ratio norms vs comparable recipes, bad ingredients (trans fat / PHOs), and the severity model.

### 3. Judge each recipe

For a single recipe, read it in full. For a folder, you don't need to read all of them end to end — the scanner already parsed every one; **read in full any recipe the scanner flagged, plus a sample of the "clean" ones** to catch what keywords miss, and rely on the scan JSON for the rest. For each recipe:

- **Verify the scanner's flags.** Kill false positives (e.g., "worcestershire" matched *fish* but the allergen is declared elsewhere; a doneness cue exists that the regex missed). Keep and sharpen the real ones.
- **Add the judgment checks the scanner can't do:**
  - *Quantities vs comparable recipes* — are the amounts and key ratios in line with how this dish is normally made for this yield? (nutrition-and-quality §2). Flag salt-per-serving, leavening, and dough/batter ratios that are clearly off.
  - *Technique soundness* — do the steps actually work and stay safe? Missing/insufficient cook temps, unsafe cooling/thawing/marinating, dangerous-ingredient handling (food-safety §3, §5).
  - *Nutrition when undeclared* — estimate sodium/sat-fat/added-sugar per serving from the ingredients and place it against the thresholds; show the arithmetic (nutrition-and-quality §1).
  - *Coherence* — every ingredient used, every step's ingredients listed, yield present, times present.
- **Frame health honestly.** A dessert is supposed to be sweet and a braise salty — report the number and say whether it's a genuine problem *for that kind of dish* or expected. Only fail health when the dish contradicts its own billing ("light," "low-sodium," "healthy") or is extreme.

### 4. Assign a verdict + report

Severity (see nutrition-and-quality §4): 🔴 **critical** (food-safety / trans-fat) · 🟠 **health** (nutrition over threshold) · 🟡 **warning** (quantity/coherence/allergen) · 🔵 **note** (minor). Verdict per recipe:

- **✅ Pass** — no findings above a note.
- **⚠️ Pass with notes** — only 🟠/🟡/🔵; safe and sound, with things worth improving.
- **❌ Needs fixes** — any 🔴 (unsafe or unfit as written).

## Report format

For a batch, use this structure (a single recipe = just its section, inline):

```markdown
# Recipe validation report — <location>
_<N> recipes · <date> · <X> ❌ needs fixes · <Y> ⚠️ notes · <Z> ✅ pass_

## Summary
- 🔴 Critical (food safety): <count> — <recipe names>
- 🟠 Health (nutrition): <count>
- 🟡 Quality/coherence: <count>
- <1–3 sentences on the overall state and the top themes to fix>

## ❌ Needs fixes
### <Recipe title> — <relative path>
- 🔴 **food-safety** · <finding>. **Fix:** <concrete fix>.
- 🟡 **quality** · <finding>. **Fix:** <…>.

## ⚠️ Pass with notes
### <Recipe title> — <path>
- 🟠 **nutrition** · Sodium ~1,100 mg/serving (est.; ~48% DV) — high but expected for this Cajun braise. **Fix:** optional; could cut added salt to ½ tsp.

## ✅ Pass
- <Recipe title> — <path>
- <Recipe title> — <path>
```

Lead with the recipes that need fixes, group by verdict, and keep each finding to a line: what's wrong, why it matters (cite the standard when it adds weight), and the fix. The report should let someone fix the worst problems first without reading every recipe.

## Notes

- **Don't invent facts.** If you're unsure whether an ingredient is present or a temp is safe, say so and point to the reference rather than guessing. A validator that hallucinates problems is worse than none.
- **Scale gracefully.** Hundreds of recipes: batch the scan, prioritize by the scan's `max_severity`, and don't burn the context reading clean recipes you can trust from the parse.
- **General-purpose.** Point `scan_recipes.py` at any recipe folder. If a recipe format differs (no frontmatter, different nutrition layout), the scanner degrades gracefully and you fill the gaps by reading.
