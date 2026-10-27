# The roadmap standard

Every project keeps one roadmap, at `docs/ROADMAP.md`, in this shape. People read it to see
where a project stands; scheduled agents (a project's roadmap routine, the Road Map Sweep,
the org pipeline's graduate stage) parse it to decide what to build next and whether the
project can go live. The parsing is why the details below are rules, not taste.

Two reference roadmaps follow it: Collector (`ai-automation-tools/collector`, a project still
before release) and Houston (`ai-automation-tools/houston`, one already
public). When this page and a roadmap disagree, this page wins.

## The rules

1. **Location.** `docs/ROADMAP.md`, upper-case file name. Never the repo root, never a
   sub-folder. The changelog sits beside it at `docs/CHANGELOG.md`.
2. **Phases.** Work is grouped under `## <emoji> Phase N: <name>` headings, in the order the
   project moves through them. A project with its own established unit may name it
   (`Slice 3`, `Milestone 2`); the heading level and order rules still hold. A finished phase
   says so in its heading, `(done YYYY-MM-DD)`; an estimate reads `(~YYYY-MM-DD)` and is only
   written when it comes from a real plan.
3. **Checkboxes.** Every work item is one list line with a marker. Nothing else counts as an
   item: prose, tables and bold labels are invisible to the agents.

   | Marker | Means |
   |:---|:---|
   | `- [ ]` | open |
   | `- [-]` | claimed by a run in progress (a dated note says by what) |
   | `- [x]` | done |
   | `- [!]` | blocked; the reason follows on the same line |

4. **Done means written down.** Ticking an item appends ` — done YYYY-MM-DD: <what landed,
   where>` to the line, and **in the same commit** adds the matching line to
   `docs/CHANGELOG.md` (tagged with the phase in italics) and updates any doc the change made
   stale: README usage, architecture notes, setup guides. A tick without its changelog line
   is not done.
5. **Pre-go-live and post-go-live.** One `##` heading splits the file:

   - `## After public release` for a project that goes (or went) public;
   - `## After go-live` for one that stays private but goes into real use.

   Every item **above** that heading is a go-live gate. The last phase above it is the
   go-live checklist itself, `## 🚦 Public release` or `## 🚦 Go-live`: CI green, docs
   verified against the code, secret scan, licence, the live URL. The project goes live when
   every gate is `- [x]` and the owner says so. Below the heading go `###` groups of
   post-go-live work: promotion, distribution, revenue, later features. The line under the
   heading says *"Nothing below blocks go-live."*
6. **Tags.** Right after the marker, `` `small` `` (in backticks) marks an item a CI check or named command
   verifies (docs, config, assets), so a routine can batch up to four of them. At the end of
   the line, `🔒 Needs Mike` marks work only the owner can do; routines skip it and the sweep
   reports it.
7. **Items are checkable by someone else.** `- [ ] Stripe checkout live in test mode, one plan,
   receipt email sends`, not `- [ ] Payments`. The text says what "done" looks like and, where
   one exists, the test or command that proves it.
8. **Order is priority.** Phases top to bottom, items top to bottom within a phase. Routines
   take the first open item that isn't `🔒 Needs Mike`, gates first.
9. **Check, don't delete.** Done items stay as `- [x]` with their note. A phase that is
   entirely done may be collapsed to its heading plus one line pointing at the changelog,
   once it's more than a screen long. An item that became obsolete is removed in a commit
   whose changelog line says why.

## The skeleton

Copy this and fill every `⟨…⟩`. The badges follow the house style (`for-the-badge`):
amber for where the project is now, green for its stage, grey for the way back.

```markdown
<h1 align="center">🗺️ Roadmap</h1>

<p align="center">
  <em>⟨One line: from where the project is to where it's going.⟩</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/now-⟨phase_N:_name⟩-F59E0B?style=for-the-badge" alt="Now: ⟨phase⟩">
  <img src="https://img.shields.io/badge/stage-⟨private | incubating | public_since_YYYY--MM--DD⟩-2ea44f?style=for-the-badge" alt="Stage: ⟨stage⟩">
  <a href="README.md"><img src="https://img.shields.io/badge/↩-docs_home-6B7280?style=for-the-badge" alt="Back to docs"></a>
</p>

---

⟨Who works this file and when: "The ⟨name⟩ roadmap routine works this file top to bottom
every ⟨day⟩", or "Worked by hand".⟩ **Every item above `## ⟨After public release | After
go-live⟩` is a go-live gate.** Ticking an item adds its line to the [changelog](CHANGELOG.md)
and updates any doc it made stale, in the same commit.

Markers: `- [ ]` open, `- [-]` claimed by a run in progress, `- [x]` done, `- [!]` blocked
(the reason follows on the line). `small` marks an item a check verifies; `🔒 Needs Mike`
marks one only Mike can do.

> [!NOTE]
> **Where we are, ⟨YYYY-MM-DD⟩.** ⟨Two or three sentences: what's done, what's next, what's
> waiting on whom. Optional; keep it current or delete it.⟩

## 🧭 Phase 0: ⟨decide⟩ (done ⟨YYYY-MM-DD⟩)

- [x] ⟨Requirements ranked must / should / later⟩ — done ⟨YYYY-MM-DD⟩: ⟨where it landed⟩

## 🔨 Phase 1: ⟨build the core⟩

- [ ] ⟨Feature, with what proves it: "(unit test for …; smoke test on both profiles)"⟩
- [ ] `small` ⟨Config or doc change a check verifies⟩
- [ ] ⟨A decision only Mike can make⟩ 🔒 Needs Mike

## 🚦 ⟨Public release | Go-live⟩

- [ ] CI green on push and PR: lint, typecheck, tests
- [ ] README usage verified against the real code from a clean clone
- [ ] `SECURITY.md`, and a full-history secret scan that comes back clean
- [ ] Licence chosen and `LICENSE` added 🔒 Needs Mike
- [ ] ⟨Live at its URL / installed where it runs⟩

## ⟨After public release | After go-live⟩

Nothing below blocks go-live.

### 📣 Publish and promote

- [ ] ⟨Landing-page tile, launch post, listings⟩

### 💰 Revenue

- [ ] ⟨Pricing, billing, terms — or delete this group if it will never earn⟩

### 🔭 Later

- [ ] ⟨Real but unscheduled⟩

---

<p align="center">
  <a href="README.md">← Docs home</a> ·
  <a href="CHANGELOG.md">Changelog →</a>
</p>
```

## Phase sets that fit most projects

Pick the ones the project really moves through; rename them to what the project calls them.

| Phase | Holds |
|:---|:---|
| 🧭 Decide | Requirements, architecture options, ADRs |
| 🧱 Walking skeleton | The thinnest end-to-end path, deployed or runnable |
| 🔨 Build | Features in risk order, one per item |
| 🧪 Harden | Tests, error handling, accessibility, security pass |
| 🚦 Go-live / Public release | The checklist above. Always the last gate phase |
| 📣 Publish and promote | After the line: domain, tile, listings, launch post |
| 💰 Revenue | After the line: pricing, billing, terms |
| 🔭 Later | After the line: real but unscheduled |

## Checking a roadmap

A roadmap meets the standard when all of these hold. The Road Map Sweep checks the same list
every week and reports any that fail:

- the file is `docs/ROADMAP.md`;
- it has the centred header, the intro paragraph and the footer;
- it has at least one `## … Phase` (or the project's unit) heading above the go-live line;
- exactly one `## After public release` or `## After go-live` heading, preceded by a
  `## 🚦` go-live phase;
- every work item is a `- [ ]`, `- [-]`, `- [x]` or `- [!]` line, and every `- [!]` gives a reason;
- every `- [x]` added since the file was standardised has a `— done YYYY-MM-DD` note and a
  changelog line.

## Moving an existing roadmap onto the standard

Keep every item and its state; change only the shape. Tables become checkbox lines,
`✅ Name` becomes `- [x] Name`, bold labels become `###` groups, `TASK-…` ids stay in the
item text. Move the file to `docs/ROADMAP.md` and fix every link to the old path. If a
scheduled job reads the roadmap, update its prompt in the same change, or it reads an empty
file and goes quiet.
