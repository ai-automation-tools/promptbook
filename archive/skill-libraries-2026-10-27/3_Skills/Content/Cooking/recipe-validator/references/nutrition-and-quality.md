# Nutrition & ingredient-quality reference

How to judge whether a recipe's **nutrition profile is within healthy/acceptable bounds** and whether its **ingredient quantities are within the standard of comparable recipes**. Unlike food-safety findings (which are pass/fail), most of this is *informational with judgment*: a rich braise or a dessert is *supposed* to be high in fat or sugar, so flag the number **and** say whether it's a problem for that kind of dish.

## 1. Per-serving nutrition thresholds

Cutoffs use the FDA's universal interpretive rule — **≤5% Daily Value per serving = "low," ≥20% DV = "high"** — applied to each nutrient's DV. All figures are current (FDA Nutrition Facts 2016 rule, Dietary Guidelines for Americans 2025–2030, WHO, AHA). Recipe nutrition tables are already per-serving, so compare directly.

| Nutrient | Daily Value | Acceptable (≤ ~10% DV) | Elevated (≥ 20% DV) | High / very high |
|---|---|---|---|---|
| **Sodium** | 2,300 mg | ≤ ~345 mg (FDA "healthy" main-dish bar) | ≥ 460 mg | ≥ 690 mg (30% DV, the FDA cap for a whole *meal*) / very high ≥ 920 mg |
| **Saturated fat** | 20 g | ≤ 2 g | ≥ 4 g | ≥ 8 g |
| **Added sugars** | 50 g | ≤ 5 g | ≥ 10 g | ≥ 25 g |
| **Cholesterol** | 300 mg | ≤ 60 mg | ≥ 60 mg | ≥ 120 mg |
| **Trans fat** | none | 0 g | — | **> 0 g = fail** (see §3) |

The `scan_recipes.py` thresholds mirror this table. The FDA "healthy" claim (final rule Dec 2024) is the most current per-serving "is this dish healthy" standard: a **main dish** qualifies at **≤ 345 mg sodium, ≤ 2 g sat fat, ≤ 5 g added sugars** per serving (a full plated **meal** gets ≤ 690 mg / ≤ 4 g / ≤ 10 g). Sat fat inherent in **nuts, seeds, soy, and seafood is exempt** from that limit.

**Two caveats the model must apply:**
- **Total vs added sugars.** Recipe nutrition tables usually report *total* sugar (no DV — includes fruit/dairy sugar), not *added* sugar. A high total-sugar number on a fruit- or dairy-forward dish may be fine; the same number on a sweetened dessert/drink is added sugar. Decide which before calling it a problem.
- **Dish type sets the bar.** ~460 mg sodium or 8 g sat fat is expected in a hearty braise, curry, or cheese dish and unremarkable there; the same in a "light salad" or a dish billed as "healthy"/"low-sodium" is a real inconsistency. Flag against the dish's own promise.

Daily-total context for messaging (not per-dish pass/fail): WHO sodium < 2,000 mg/day, AHA ideal < 1,500; sodium DGA < 2,300 mg; sat fat DGA < 10% of calories, AHA < 6% (~13 g); added sugars DGA ≤ 10 g per meal (and no amount recommended as part of a healthy diet), WHO < 10% (ideally < 5%) of energy, AHA ≤ 36 g men / ≤ 25 g women.

Sources: [FDA Daily Values](https://www.fda.gov/food/nutrition-facts-label/daily-value-nutrition-and-supplement-facts-labels) · [FDA Nutrition Facts label](https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label) · [FDA updated "healthy" claim](https://www.fda.gov/food/hfp-constituent-updates/fda-finalizes-updated-healthy-nutrient-content-claim) · [DGA 2025–2030](https://cdn.realfood.gov/DGA.pdf) · [WHO healthy diet](https://cdn.who.int/media/docs/default-source/healthy-diet/healthy-diet-fact-sheet-394.pdf) · [AHA sodium](https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sodium) / [added sugars](https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sugar/added-sugars) / [saturated fat](https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/fats/saturated-fats)

### When nutrition isn't declared

About half of library recipes have no Nutrition table. Don't skip the health check — **estimate** from the ingredients: total the big sodium sources (added salt, soy/fish sauce, broth, cured meats, cheese, canned goods — ~2,300 mg sodium per tsp of table salt, ~500–900 mg per tbsp soy sauce), the saturated-fat sources (butter, cream, cheese, fatty/cured meat, coconut, palm), and the added-sugar sources, then divide by servings. A rough estimate ("~1,100 mg sodium/serving, mostly from the andouille, bacon, and 1 tsp added salt") is enough to place it in the table above. Show your arithmetic so the estimate is auditable.

## 2. Ingredient quantities vs. comparable recipes

"Ingredients within the standard of competing recipes" means the amounts and ratios shouldn't be wildly off what a knowledgeable cook would expect for that dish and yield. Use culinary judgment plus these anchors.

**Seasoning per serving (added salt):** a typical main dish runs **~¼–½ tsp of added salt per serving** (~600–1,200 mg sodium from salt alone). **> ~1 tsp added salt per serving is suspicious**; several teaspoons per serving is almost certainly an error. (Brines/cures are the exception — much of the salt is discarded.)

**Leavening:** roughly **~1–1¼ tsp baking powder per cup of flour**, or **~¼ tsp baking soda per cup of flour** (soda needs an acid — buttermilk, yogurt, cocoa, vinegar). Far more reads as a metallic/soapy error; none in a cake/quick-bread that should rise is a red flag.

**Baker's ratios** (by weight — Michael Ruhlman's *Ratio*), useful for sanity-checking doughs/batters when amounts look off:
- Bread ≈ **5 : 3** flour : water · Pasta ≈ **3 : 2** flour : egg · Pie dough ≈ **3 : 2 : 1** flour : fat : water · Pancake/quick batter ≈ **2 : 2 : 1** flour : liquid : egg · Roux/sauce base ≈ **1 : 1** flour : fat · Cookie ≈ **3 : 2 : 1** flour : fat : sugar · Vinaigrette ≈ **3 : 1** oil : vinegar · Custard ≈ **2 : 1** liquid : egg.

A dough/batter that's dramatically outside its ratio (e.g., a "bread" that's 1:2 flour:water = batter, or a vinaigrette that's 1:1 oil:acid = mouth-puckering) is worth flagging.

**Implausible / mismatched amounts to watch for:**
- Quantities that don't match the stated yield (a "serves 4" using 3 lbs of pasta, or 8 cups of broth for 2 servings).
- A unit that's clearly wrong (tablespoons where teaspoons are meant for a potent spice — cayenne, clove, nutmeg; cups where tablespoons are meant for an extract).
- Metric and imperial in the same line that disagree (e.g., "5 g (1 cup)").
- A dominant ingredient with no quantity, or a quantity with no ingredient.

## 3. Bad / low-quality ingredients & sections

- **Trans fat / partially hydrogenated oils (PHOs).** PHOs lost GRAS status and are banned from the U.S. food supply. A recipe calling for PHOs, "partially hydrogenated [oil]," or shortening/margarine known to contain them, or any declared trans fat > 0 g, is a **bad-ingredient failure** — swap for butter, non-hydrogenated oil, or a modern trans-fat-free shortening.
- **Coherence problems** (quality, not safety): an ingredient listed but never used in the steps; a step that calls for something absent from the ingredient list; missing yield (blocks per-serving math); no cooking time; ingredients out of use-order.
- **Vague/unmeasurable** dominant quantities ("some flour," "a bit of chicken") in a recipe that's otherwise precise.
- **Over-reliance on ultra-processed shortcuts** where the recipe claims to be "from scratch"/"authentic" — a mismatch worth noting, not a failure.

## 4. Severity model (how to rank findings)

- 🔴 **critical** — food-safety: unsafe cook temp / missing doneness for raw protein, a dangerous-ingredient rule violated (§food-safety), PHOs/trans fat. These make the recipe unsafe or unfit as written.
- 🟠 **health** — nutrition profile beyond the thresholds in §1 (sodium/sat-fat/sugar high), judged against the dish type.
- 🟡 **warning** — quality/coherence: implausible quantity vs comparable recipes, off ratios, undeclared allergen, unused/undefined ingredient, missing yield/times.
- 🔵 **note** — minor/style: metric-imperial nits, vague wording, formatting.

A recipe with any 🔴 is **"needs fixes / unsafe as written."** Only 🟠/🟡 → **"pass with notes."** None → **"pass."** Health flags alone don't fail an intentionally indulgent dish — they inform.
