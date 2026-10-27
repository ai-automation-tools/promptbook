# Design system

The values and components the house style is made of. Written from the live
sites: the org landing page (`ai-automation-tools.dev`), Agent Chat's web UI,
Cronsole, Edge-Radar's public page, Edge Spectrum and Project Hub. Where they
disagree, the landing page wins: it is the newest and the one the others were
moved toward.

## 1. Tokens

Paste both blocks at the top of the stylesheet. Rules below them use only these
names. Add a token rather than a literal; give every new token a value in both
blocks.

```css
:root {
  color-scheme: dark;
  /* ground */
  --bg: #060606;            --bg-2: #0a0a0c;
  --dots: rgba(255,255,255,.035);
  /* surfaces */
  --surface: rgba(24,24,27,.45);   --surface-2: rgba(24,24,27,.8);   /* card rest / hover */
  --panel: rgba(10,10,12,.6);      --field: rgba(24,24,27,.4);
  --hover-bg: rgba(24,24,27,.7);   --hover-weak: rgba(63,63,70,.3);
  --bar: rgba(6,6,6,.72);          --bar-line: rgba(39,39,42,.7);   /* top bar, blurred */
  --rail-bg: #08080a;              --srcbar-bg: #0a0a0b;
  --menu-bg: #0a0a0c;   --pop-bg: #0c0c0f;  --pop-shadow: rgba(0,0,0,.8);
  --scrim: rgba(0,0,0,.6);
  --switch-bg: rgba(39,39,42,.6);
  --kbd-bg: #0e0e11;               --code-bg: rgba(6,6,6,.7);
  --thumb: #27272a;
  /* lines */
  --line: rgba(63,63,70,.45);  --line-2: rgba(63,63,70,.8);  --line-hover: #52525b;  --rule: rgba(39,39,42,.6);
  /* text, brightest to faintest */
  --fg: #f4f4f5;  --fg-2: #d4d4d8;  --fg-3: #a1a1aa;  --fg-4: #71717a;  --fg-5: #52525b;
  --fg-max: #fff;  --on-fg: #09090b;
  /* accent: the site's own hue, 400 weight (sky shown) */
  --accent: #38bdf8;  --accent-hover: #7dd3fc;  --accent-ink: #0b1220;
  --glow: rgba(56,189,248,.12);
  /* state */
  --ok: #34d399;  --warn: #f59e0b;  --bad: #ef4444;
  /* accent-tinted text: mix toward white in dark, toward black in light */
  --mix-ink: #fff;  --tint-k: 80%;
  /* type, shape, motion */
  --sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
  --r-lg: 12px;  --r-md: 8px;  --r-sm: 6px;
  --ease: cubic-bezier(.2,.7,.2,1);
  /* chrome sizes */
  --srcbar-h: 34px;  --topbar-h: 56px;
}

html.light {
  color-scheme: light;
  --bg: #fafafa;            --bg-2: #f4f4f5;
  --dots: rgba(0,0,0,.05);
  --surface: rgba(255,255,255,.75); --surface-2: #fff;
  --panel: rgba(255,255,255,.7);    --field: #fff;
  --hover-bg: #f4f4f5;              --hover-weak: rgba(228,228,231,.7);
  --bar: rgba(250,250,250,.8);      --bar-line: #e4e4e7;
  --rail-bg: #f4f4f5;               --srcbar-bg: #f4f4f5;
  --menu-bg: #fafafa; --pop-bg: #fff;  --pop-shadow: rgba(0,0,0,.18);
  --scrim: rgba(24,24,27,.35);
  --switch-bg: rgba(228,228,231,.6);
  --kbd-bg: #f4f4f5;                --code-bg: #f4f4f5;
  --thumb: #d4d4d8;
  --line: #e4e4e7;  --line-2: #d4d4d8;  --line-hover: #a1a1aa;  --rule: #e4e4e7;
  /* contrast on #fafafa: 19.1 · 14.3 · 7.4 · 5.7 · 4.3 */
  --fg: #09090b;  --fg-2: #27272a;  --fg-3: #52525b;  --fg-4: #63636b;  --fg-5: #76767f;
  --fg-max: #000;  --on-fg: #fff;
  /* accent: the 700 shade of the same hue (sky-700 = 5.7:1, white on it 5.9:1) */
  --accent: #0369a1;  --accent-hover: #075985;  --accent-ink: #fff;
  --glow: rgba(56,189,248,.10);
  --ok: #047857;  --warn: #b45309;  --bad: #b91c1c;
  --mix-ink: #000;  --tint-k: 55%;
}
```

`--fg-5` in light is 4.3:1 — use it only for large or decorative text (hints,
counters). Body text is `--fg-2` or `--fg-3`.

### Accent per site

One hue per site, used for the page's own chrome. What the live sites use
(read from their stylesheets 2026-10-14), with each one's app icon colour
(see "The app icon" below):

| Site | Page accent, dark | Light | Icon colour |
|:---|:---|:---|:---|
| the org landing page | sky `#38bdf8` | `#0369a1` | blue `#60a5fa` |
| Edge Spectrum | sky `#38bdf8` | `#0369a1` | sky `#38bdf8` |
| My Prompt Library | sky `#38bdf8` | — | amber `#fbbf24` |
| Project Hub | sky `#38bdf8` (`--green` in its stylesheet) | its theme picker | green `#4ade80` |
| Agent Skills | amber `#f2b34b` | `#8a5200` | amber `#f2b34b` |
| Cronsole | violet `#a78bfa` (product site; the app's primary is `hsl(262 83% 58%)`) | `#6d28d9` | violet `#a78bfa` |
| Edge-Radar | emerald `#34d399` | `#047857` | emerald `#34d399` |
| Agent Chat | emerald `#10b981` | `#047857` | cyan `#22d3ee` |

Sky is shared by four pages, so the icon is what tells those tabs apart: an
icon keeps its own colour where the page's accent would repeat another
site's. Unused as a page accent: lime `#a3e635`/`#4d7c0f`, orange
`#fb923c`/`#c2410c`, fuchsia `#e879f9`/`#a21caf`, rose `#fb7185`/`#be123c`,
teal `#2dd4bf`/`#0f766e`. A new site takes one of these for both its page and
its icon, after checking no other app icon in the shared set already uses it.

Every tint derives from the accent, so changing it is a one-line edit:

```css
background: color-mix(in srgb, var(--accent) 14%, transparent);         /* soft fill */
border-color: color-mix(in srgb, var(--accent) 28%, transparent);       /* soft edge */
color: color-mix(in srgb, var(--accent) var(--tint-k), var(--mix-ink)); /* accent text on a tint */
```

### The app icon (favicon)

Every site has **one icon** (since 2026-10-14). It is the browser favicon, the
site's card on the org landing page, and the mark in the top bar or rail if the
page shows one. Never draw a separate logo, a letter tile or a one-off favicon.

- A near-black tile: `#0b0b0e`, 32×32 viewBox, `rx="7"`.
- A 2px ring just inside the edge in the icon colour darkened 45% (each RGB
  channel × 0.55), so the tile doesn't vanish into a dark tab strip.
- The app's line pictogram, drawn on a 24×24 grid (2–3 paths, no fills, no
  text), stroked in the icon colour at width 2.6 and scaled into the middle 20
  units.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>App Name</title><rect width="32" height="32" rx="7" fill="#0b0b0e"/><rect x="1" y="1" width="30" height="30" rx="6" fill="none" stroke="RING" stroke-width="2"/><g transform="translate(6 6) scale(0.8333)" fill="none" stroke="ICON" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">GLYPH</g></svg>
```

Cronsole's, for example: `ICON` `#a78bfa`, `RING` `#5c4c8a`, `GLYPH`
`<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>`. An existing app
already has its icon; copy that file, don't redraw it. A new app's icon is
added to the shared icon set first, then shipped as `favicon.svg` (or a
framework's `icon.svg`) and as its card's `icons/tools/<id>.svg`. Check it at
16px on a dark and a light tab strip before shipping.

## 2. Type and page

| | Value |
|:---|:---|
| Fonts | `Inter:wght@400;500;600;700` + `JetBrains+Mono:wght@400;500`, `display=swap`, with `preconnect` to both Google hosts |
| Body | 15px / 1.6, `--fg`, `-webkit-font-smoothing: antialiased` |
| h1 | `clamp(34px, 4.6vw, 52px)`, line-height 1.04, letter-spacing −.035em, 700, `text-wrap: balance`. One `<em>` word may carry the accent gradient |
| h2 | 26px, −.025em, 650 |
| h3 (card) | 18px, −.015em, 600 |
| Lede / sub | 16.5px / 15px, `--fg-3`, `max-width: 54–58ch` |
| Eyebrow | mono 11.5px, `.14em`, uppercase, `--fg-4`; a `<b>` inside it in `--accent` |
| Tag | mono 11px, 3px 7px, 5px radius, 1px `--line` border, `--fg-4` |
| Column | `.wrap { max-width: 1120px; margin: 0 auto; padding-inline: 20px }` (app pages may go to 1400px) |
| Sections | `padding-block: 64px; border-top: 1px solid var(--rule); scroll-margin-top: 72px` |
| Ground | `background: var(--bg)` + `radial-gradient(var(--dots) 1.2px, transparent 0)` at `24px 24px`, `background-attachment: fixed` |
| Hero glow | one absolutely-positioned `.glow` with a radial in `--glow`, masked to fade out downward. Nothing else glows at rest |
| Scrollbar | 6px, thumb `--thumb`, radius 3px |
| Selection | accent at 30% |

## 3. Pre-paint script and theme switch

**In `<head>`, before the stylesheet.** The default here and `THEME_DEFAULT` in the
page script must match.

```html
<meta name="theme-color" content="#060606" />
<script>
  (function () {
    var t = 'dark';                                   // = THEME_DEFAULT
    try { var s = localStorage.getItem('SITE.theme'); if (s === 'light' || s === 'dark') t = s; } catch (e) {}
    document.documentElement.classList.add(t);
    if (t === 'light') document.querySelector('meta[name="theme-color"]').setAttribute('content', '#fafafa');
  })();
</script>
```

**Markup**, last in `.topbar-right` (only the phone menu button follows it). Icons
are Lucide `sun` and `moon` at 13px:

```html
<div class="theme-sw" id="themeSw" role="group" aria-label="Theme">
  <button type="button" data-theme="light" aria-pressed="false" aria-label="Light theme" title="Light theme">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  </button>
  <button type="button" data-theme="dark" aria-pressed="true" aria-label="Dark theme" title="Dark theme">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>
  </button>
</div>
```

```css
.theme-sw { display: inline-flex; align-items: center; gap: 2px; padding: 2px; border-radius: 12px; background: var(--switch-bg); flex: none; }
.theme-sw button { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 24px; padding: 0; border: 0; border-radius: 10px; background: transparent; color: var(--fg-4); cursor: pointer; transition: color .15s, background-color .15s; }
.theme-sw button:hover { color: var(--fg); }
.theme-sw button[aria-pressed="true"] { background: var(--bg); color: var(--fg); box-shadow: 0 1px 2px rgb(0 0 0 / .05); }
.theme-sw button:focus-visible { outline: 2px solid color-mix(in srgb, var(--accent) 60%, transparent); outline-offset: 0; }
.theme-sw svg { width: 13px; height: 13px; }
```

```js
const THEME_KEY = 'SITE.theme', THEME_DEFAULT = 'dark';
const themeBtns = document.querySelectorAll('#themeSw button');
function setTheme(t) {
  const r = document.documentElement; r.classList.remove('light', 'dark'); r.classList.add(t);
  themeBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.theme === t)));
  document.querySelector('meta[name="theme-color"]').setAttribute('content', t === 'light' ? '#fafafa' : '#060606');
}
setTheme(document.documentElement.classList.contains('light') ? 'light' : THEME_DEFAULT);
themeBtns.forEach(b => b.addEventListener('click', () => {
  setTheme(b.dataset.theme);
  try { localStorage.setItem(THEME_KEY, b.dataset.theme); } catch (e) {}
}));
```

**React.** Same storage key, same pre-paint script in `index.html`. A minimal hook:

```tsx
const KEY = 'SITE.theme';
type Theme = 'light' | 'dark';
export function useTheme() {
  const [theme, set] = useState<Theme>(() =>
    document.documentElement.classList.contains('light') ? 'light' : 'dark');
  useEffect(() => {
    const r = document.documentElement; r.classList.remove('light', 'dark'); r.classList.add(theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#fafafa' : '#060606');
    try { localStorage.setItem(KEY, theme); } catch {}
  }, [theme]);
  return [theme, set] as const;
}
```

With Tailwind, map the tokens in the theme (`colors: { bg: 'var(--bg)', fg: 'var(--fg)', … }`)
and let `html.light` swap them; don't write `dark:` variants per element.

A surface that must stay dark in both themes (a terminal, a code window) re-declares the
dark set on its own selector: `:root, html.light .term { …dark tokens… }`.

## 4. Source bar

```html
<div class="src-bar">
  <p class="src-note"><strong>Open source</strong> &middot; one short line about the project.</p>
  <a class="src-link" href="https://github.com/ai-automation-tools/REPO" target="_blank" rel="noopener">
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
    View source
  </a>
</div>
```

```css
.src-bar { display: flex; align-items: center; gap: 16px; height: var(--srcbar-h); padding: 0 16px;
           background: var(--srcbar-bg); border-bottom: 1px solid var(--bar-line); font-size: 12px; }
.src-note { margin: 0; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: var(--fg-4); }
.src-note strong { font-weight: 600; color: var(--accent); }
.src-link { margin-left: auto; flex: none; display: inline-flex; align-items: center; gap: 6px; color: var(--fg-3); font-weight: 500; }
.src-link:hover { color: var(--fg); }
```

- **Document page:** in flow, first child of `<body>`; the sticky top bar slides up under
  the viewport top once the bar scrolls away.
- **App shell:** `position: fixed; top: 0; left: 0; right: 0; z-index: 70`, `body { padding-top: var(--srcbar-h) }`,
  and every fixed or viewport-sized piece below it is offset by `--srcbar-h`.
- On a demo deployment the note becomes the demo notice; the link stays on every deployment.
- An optional hero button to the repo is allowed on a project page. Nothing else links the repo.

## 5. Top bar (document page)

```css
.topbar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 40; height: var(--topbar-h);
          background: var(--bar); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--bar-line); }
.topbar .wrap { height: 100%; display: flex; align-items: center; gap: 14px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14px; letter-spacing: -.01em; }
.brand svg, .brand img { width: 24px; height: 24px; flex: none; }
.nav { display: none; align-items: center; gap: 2px; margin-left: 14px; }
.nav a { padding: 6px 11px; font-size: 13.5px; color: var(--fg-3); border-radius: var(--r-sm); transition: color .2s; }
.nav a:hover, .nav a[aria-current="true"] { color: var(--fg); }
.topbar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.menu-btn { display: inline-flex; width: 32px; height: 32px; align-items: center; justify-content: center;
            border: 1px solid var(--line-2); border-radius: var(--r-md); background: transparent; color: var(--fg-2); cursor: pointer; }
.mobile-nav { display: none; border-bottom: 1px solid var(--line); background: var(--menu-bg); }
.mobile-nav.open { display: block; }
.mobile-nav a { display: block; padding: 12px 20px; font-size: 15px; color: var(--fg-2); border-top: 1px solid var(--rule); }
@media (min-width: 760px) { .nav { display: flex; } .menu-btn { display: none; } }
```

Right cluster order: optional ⌘K trigger, theme switch, menu button (phone only). The
menu button toggles `.open` on the sheet and its own `aria-expanded`; picking a link
closes it. A scroll-spy underline (2px, `--accent`) under the active nav link is optional.

## 6. Sidebar (app shell)

The pattern is Agent Chat's: a **fixed icon rail** that runs the full height under the
source bar, brand at the top, destinations below, collapsing to icons.

| Piece | Rule |
|:---|:---|
| Width | `--rail-open: 240px`, `--rail-shut: 64px`; `--rail-w` resolves from them. Collapsed state is `html.rail-collapsed`, persisted as `SITE.rail` and applied in the pre-paint script |
| Position | `position: fixed; top: var(--srcbar-h); left: 0; bottom: 0; width: var(--rail-w)`; `background: var(--rail-bg)`; `border-right: 1px solid var(--rule)`. `main` and `.topbar` take `margin-left: var(--rail-w)` and transition with it (.18s) |
| Brand row | `height: var(--topbar-h)`, mark (the favicon, 26px) + wordmark + collapse toggle; its bottom border lines up with the top bar's so one rule runs across the page. Collapsed: mark stacks over toggle |
| Items | 40px tall, 9px radius, 12px gap, 13px/500 label in `--fg`. **The colour lives in the icon** (18px Lucide, stroke 2), one hue per destination; labels stay one colour |
| Hover / current | background = the item's hue at 12% / 16%; current also gets a 3×20px marker on the rail's outer edge and `aria-current="page"` |
| Groups | a 1px separator, then an optional mono 10px uppercase group label (hidden when collapsed) |
| Collapsed | labels hidden, items centred, a tooltip from `data-tip` on hover/focus; the same string is always on `aria-label` |
| Toggle | 32×32 bordered button with one panel icon in both states (not a chevron that must flip) |
| Phone (≤720px) | `:root { --rail-open: 56px; --rail-shut: 56px }`, labels and toggle hidden. The rail **is** the phone nav: no hamburger |

Per-destination hue, as HSL parts so tints are one expression:

```css
.rail-btn svg { color: hsl(var(--h) var(--s) var(--l)); }
.rail-btn:hover { background: hsl(var(--h) var(--s) var(--l) / .12); }
.rail-btn[aria-current="page"] { background: hsl(var(--h) var(--s) var(--l) / .16); }
.nav-home { --h: 152; --s: 60%; --l: 50%; }   /* emerald */
.nav-runs { --h: 217; --s: 91%; --l: 60%; }   /* blue    */
```

**Drawer variant** (Project Hub) — for a sidebar that holds content, not destinations.
Width `min(var(--sbw, 284px), 50%)`, collapses to a 34px strip. Below 600px it floats
over the page (`position: absolute; z-index: 50`) with a shadow, the page behind gets a
`--scrim` overlay, a tap on the scrim only closes the drawer, and opening a leaf item
closes it. Use `%` of the layout for the cap, not `vw`.

## 7. Components

**Buttons** — 40px (hero) / 32px (toolbar), `--r-md`, 14px 600.

```css
.btn-primary { background: var(--accent); color: var(--accent-ink); }
.btn-primary:hover { background: var(--accent-hover); box-shadow: 0 0 24px -6px var(--accent); }
.btn-ghost { border: 1px solid var(--line-2); color: var(--fg-2); background: var(--field); }
.btn-ghost:hover { border-color: var(--line-hover); background: var(--hover-bg); color: var(--fg); }
.btn-gh { background: #000; color: #fff; border: 1px solid rgba(255,255,255,.16); }  /* black in both themes */
.btn:active { transform: translateY(1px); }
```

**Cards** — `--surface` → `--surface-2` on hover, 1px `--line`, `--r-lg`, lift `translateY(-2px)`.
The spotlight: a cursor-tracked ring (`::before`, masked to the 1px border) and a 9% inner wash
(`::after`) in the card's `--c`, driven by `--mx`/`--my` set from `pointermove`. Body padding
20px; actions row below a 1px rule.

**Chips** — 30px, pill, 1px `--line-2`, 12.5px 500. Pressed = `--fg` fill with `--on-fg` text,
`aria-pressed="true"`.

**Fields** — 32px, `--field`, 1px `--line-2`, `--r-md`; focus ring in the accent.

**Status dot** — 7px circle in `--ok` (or the item's hue) with a 2.4s pulse ring; static under
reduced motion.

**kbd** — mono 10.5px, 1px `--line-2` with a 2px bottom border, `--kbd-bg`.

**Icons** — Lucide, 2px stroke, `currentColor`. Favicons and tool marks are a 32×32 rounded tile
(`rx` 6–7) in the site's accent with a dark mark; every icon image gets
`outline: 1px solid var(--line-2); outline-offset: -1px` so it keeps an edge in both themes.

**⌘K palette** (optional, for sites with many destinations) — a `kbd-btn` in the top bar, a
centred `--pop-bg` panel over `--scrim`, arrow keys + Enter, Esc closes.

**Footer** — one row: the site's domain in mono on the left; GitHub, the org home
(`ai-automation-tools.dev`), *Cookies* and *Cookie settings* on the right; an optional
`.fine` disclaimer line under it in `--fg-5`.

**Consent** — public sites load the shared banner and expose its settings link:

```html
<a href="#" data-ail-consent="manage">Cookie settings</a>
<script src="https://ai-automation-tools.dev/consent.js" defer></script>
```

Any optional third-party script runs through `AILConsent.whenGranted(fn)`. No telemetry otherwise.

## 8. Accessibility and motion

```css
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
.skip { position: absolute; left: -9999px; top: 12px; z-index: 80; padding: 6px 12px; border-radius: 6px;
        background: var(--accent); color: var(--accent-ink); font-size: 14px; font-weight: 600; }
.skip:focus { left: 16px; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

Every toggle states its state (`aria-pressed`, `aria-expanded`, `aria-selected`,
`aria-current`); icon-only buttons have `aria-label`; colour is never the only signal.

## 9. Phone rules

```css
html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
@media (max-width: 600px) {
  input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]),
  select, textarea { font-size: 16px; }           /* stops iOS focus zoom */
  .theme-sw button { width: 36px; height: 32px; }
  .menu-btn, .icon-btn { width: 40px; height: 40px; }
  .chip, .seg button, .copy, .act { height: 36px; }
  .search, select { height: 40px; }
  footer a { display: inline-block; padding-block: 9px; }
}
@media (hover: none) { .reveal-on-hover { opacity: 1; visibility: visible; } }
@media (pointer: coarse) { .touch-hit { position: relative; } .touch-hit::after { content: ""; position: absolute; inset: -8px; } }
```

Also: `height: 100vh; height: 100dvh;` on viewport-sized shells; card grids on
`minmax(min(272px,100%),1fr)`; wide tables either scroll inside `overflow-x:auto` with a
phone `min-width`, or stack each row into a card; `overflow-wrap: anywhere` on paths and
IDs; the viewport meta is `width=device-width, initial-scale=1, viewport-fit=cover` and
the sticky top bar respects `env(safe-area-inset-top)`.
