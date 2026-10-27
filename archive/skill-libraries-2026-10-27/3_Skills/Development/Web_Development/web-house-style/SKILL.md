---
title: "💻 web-house-style"
name: web-house-style
description: >-
  Give a new or existing web page the shared look, feel and navigation of the
  ai-automation-tools sites: the near-black #060606 ground with a dot grid and zinc
  surfaces, one accent per site, Inter + JetBrains Mono, a Light | Dark switch in the
  top-right corner that defaults to dark and never flashes, a sticky blurred top bar
  or a fixed icon sidebar, the "View source" bar across the very top, the shared
  dark-tile app icon used as the favicon, and a phone
  pass (16px fields, 36px+ tap targets, dvh heights, drawer or icon-rail nav). Use
  when building a landing page, project page, demo, dashboard or app shell that
  should match the org's other sites, when adding a light/dark theme switch, a
  sidebar or a mobile layout to one, when restyling a page "like our other apps",
  or when auditing a page for drift from the house style. Works for single-file
  static HTML, server-rendered pages and React/Vite apps.
tags: ["skill","development","web-development","agent-skills"]
upstream:
  match: exact
  repo: ai-automation-tools/agent-skills
  path: skills/core/web/web-house-style/SKILL.md
  ref: 6f36b558eb82b55e9a68814da0941dd968dfe5f7
  checked: 2026-10-21
---

# Web house style

The sites in the `ai-automation-tools` org (the landing page, Agent Chat, Cronsole,
Edge-Radar, Edge Spectrum, Project Hub, the Agent Skills showcase) were moved onto
one design vocabulary on 2026-10-05, given a Light | Dark switch the same day, and
given a phone pass on 2026-10-13. This skill is that vocabulary written down, so
a new site starts on it instead of drifting toward it later.

Everything concrete lives in two places:

- [references/design-system.md](references/design-system.md) — the token blocks
  (dark and light), type, spacing, every shared component with its CSS, and the
  phone rules.
- Two starter pages that already implement all of it. Copy one, rename, fill in:
  - [assets/page.html](assets/page.html) — a **document page**: source bar in
    flow, sticky top bar with nav, hamburger sheet on phones. For landing,
    project and docs pages.
  - [assets/app-shell.html](assets/app-shell.html) — an **app shell**: fixed
    source bar, fixed icon sidebar that collapses, top bar beside it. For
    dashboards and tools with several destinations.

## Choose the layout

| The site is… | Use | Navigation |
|:---|:---|:---|
| One scrolling page of sections (landing, project page, showcase) | `page.html` | Links in the top bar; a sheet under the bar on phones |
| An app with 3+ destinations that a user moves between all session | `app-shell.html` | Icon sidebar (the rail); the top bar holds only a breadcrumb and actions |
| An app whose sidebar is *content* (a file tree, a list) rather than destinations | `app-shell.html`, sidebar swapped for the content panel | On phones the panel becomes a drawer over the page with a scrim (see *Sidebar → Drawer variant*) |

Don't put a sidebar on a document page just to have one. A single page with
five sections is a top-bar site.

## The non-negotiables

A page is not in the house style until every one of these holds.

1. **Tokens, not literals.** Every colour is a custom property on `:root`;
   `html.light` redefines the same names. A rule never hard-codes a colour
   (the one exception: the black GitHub button, which is black in both themes).
2. **Dark is the default, whatever the OS says.** The light theme is opt-in from
   the switch. Don't follow `prefers-color-scheme` unless the user picks a
   "system" option on purpose.
3. **The theme switch** is a Light | Dark segmented pill (sun, moon), the
   **last control at the right end of the top bar** (only the phone hamburger
   sits after it). Buttons carry `aria-pressed`, `aria-label` and `title`.
4. **No flash.** An inline script in `<head>`, before any stylesheet, reads
   `localStorage['<site>.theme']`, adds `light` or `dark` to `<html>`, and flips
   `<meta name="theme-color">` (`#060606` dark, `#fafafa` light). The page
   script's `THEME_DEFAULT` must equal the pre-paint default. Wrap every
   `localStorage` call in `try`.
5. **The source bar** — 34px, full width, across the very top, above every
   other piece of chrome: a one-line note left, GitHub mark + **View source**
   right. Every site built from a public repo has one; the org's index page
   (the landing page itself) is the one exception. The bar replaces any other
   repo link (corner chip, nav pill). In flow on a document page; `position:
   fixed` with the shell offset by `--srcbar-h` in an app shell.
6. **One accent per site.** Pick it from the per-tool list in the design
   system, set `--accent`, and derive every tint with `color-mix()` from it. In
   light mode use the 700 shade of the same hue so it passes contrast on
   `#fafafa`.
7. **Inter + JetBrains Mono** from Google Fonts — the only external stylesheet.
   Mono is for eyebrows, tags, domains, code, kbd and status text; never for
   body copy.
8. **One easing:** `--ease: cubic-bezier(.2,.7,.2,1)`. One glow behind the hero
   at most; nothing else lit at rest.
9. **Accessibility is part of the page:** a skip link, `:focus-visible`
   outlines in the accent, `aria-pressed` / `aria-expanded` / `aria-current`
   on every toggle and nav item, and a `prefers-reduced-motion` block that
   stops every animation.
10. **The phone pass** (below) is done before the page ships, not after.
11. **One app icon** in the shared format: a near-black tile, a thin ring and
    the app's line pictogram in its icon colour (spec and template under "The
    app icon" in the design system). It is the favicon, the landing-page card
    and any in-app mark. Never a letter tile or a separate logo.

## The phone pass

Every rule sits inside `@media (max-width: 600px)`, `(hover: none)` or
`(pointer: coarse)`, so desktop renders byte-for-byte the same. Audit at
**390px** wide.

- `html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }`
- **16px text in every field** (`input`, `select`, `textarea`) — under 16px,
  iOS Safari zooms the page on focus.
- **Tap targets 36–40px**: theme-switch buttons 36×32, icon buttons and the
  hamburger 40×40, chips/segments/copy buttons 36px tall. Grow a tiny control's
  hit box with a `::after { inset:-8px }` rather than redrawing it.
- **`100dvh`, not `100vh`,** for anything sized to the viewport (Android's URL
  bar covers the bottom of a `vh` shell). Keep the `vh` line first as a fallback.
- **Nothing scrolls sideways.** Grids use `minmax(min(272px,100%),1fr)`; wide
  tables scroll inside their own `overflow-x:auto` wrapper or stack into
  cards; long paths get `overflow-wrap:anywhere`; a hidden tooltip still counts
  toward scroll width, so anchor it inside the column.
- **Hover-only controls are shown outright** under `(hover: none)`.
- **Navigation:** the top-bar links collapse into a hamburger sheet below
  760px; an icon sidebar shrinks to a fixed 56px icon rail below 720px with its
  toggle hidden; a content sidebar becomes a drawer capped at 50% of the page.
- The top bar sheds non-essentials (breadcrumb, palette label) before it can
  wrap to two lines. The source-bar note truncates with an ellipsis.

## Workflow

1. **Read the target first.** If the page exists, find its stylesheet, its
   current colours and any theme/nav code. Restyling means mapping its literals
   onto the token names, not adding a second system beside the first.
2. **Pick the layout** from the table above and the site's **accent** and
   **storage key prefix** (`<repo-name>.theme`, `<repo-name>.rail`).
3. **Start from the starter** for a new page; for an existing one, port the
   token blocks, the pre-paint script, the switch, the source bar and the nav
   pieces from the design system in that order.
4. **Match the stack.** Static HTML keeps the inline `<style>` and no build step.
   React keeps its own styling layer (Tailwind, CSS modules) but maps the same
   token names and uses a `useTheme` hook with the same storage key and the same
   pre-paint script in `index.html`. Don't add Tailwind or a framework to a page
   that has none.
5. **Do the phone pass** at 390px, then check 1400px is unchanged.
6. **Verify** with the checklist below.

## Verify

- [ ] Reload in light mode: no dark frame before paint; the address-bar colour follows.
- [ ] Both themes: every text colour readable (light `--fg-4` and up are ≥ 4.5:1 on `#fafafa`), icons with a black or white mark keep a visible edge.
- [ ] `grep -nE '#[0-9a-fA-F]{3,8}|rgba?\(' ` the rules below the token blocks: only token references remain (plus the GitHub button).
- [ ] The source bar is the first element in `<body>` and links the public repo.
- [ ] Keyboard: Tab from the top reaches the skip link first; every control shows a focus ring.
- [ ] Reduced motion on: nothing moves.
- [ ] 390px: no horizontal scroll, no field under 16px, nav reachable, no control under 32px.
- [ ] No console errors in either theme.
- [ ] The favicon is the app's icon in the shared format, readable at 16px in a dark and a light tab strip.

## Anti-patterns

- **Following the OS theme by default.** Every site here is designed dark-first;
  following a light OS shows a first paint nobody designed.
- **A sun/moon *toggle* button** that flips on click. The control is a two-segment
  switch that shows both options and which one is on.
- **The theme switch anywhere but the top-right**, or inside a settings menu only.
- **A second repo link** (corner chip, "GitHub" nav pill) beside the source bar.
- **Hard-coded hex in a rule**, or a light theme built by `filter: invert()`.
- **Tailwind CDN, a framework or a bundler** added to a single-file static page.
- **A hamburger in an app shell.** The icon rail *is* the phone navigation.
- **Phone fixes that change desktop.** If a rule isn't inside a phone, `hover:none`
  or `pointer:coarse` query, it needs a reason.
- **Several glows, gradients on every card, motion at rest.** One hero glow and a
  cursor-tracked spotlight on hover are the whole budget.
- **Colour as the only signal.** The active sidebar item also gets an edge marker;
  the pressed theme segment also gets a raised background.
