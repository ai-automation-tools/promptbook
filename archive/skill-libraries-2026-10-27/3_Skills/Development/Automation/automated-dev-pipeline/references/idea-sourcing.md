# Idea sourcing: feeding the ideate stage

Ideate is the only stage that looks outside the pipeline. It needs a steady supply of candidate
ideas, and every pipeline's supply is different. One person keeps idea notes in a vault,
another triages GitHub issues, a third runs a job that writes idea cards every night. This
file covers the part that stays the same: how to connect any source to ideate so it never
analyzes the same idea twice, never writes to the source, and never produces plans faster
than incubate can take them.

## What a source has to give you

Any place that holds ideas works, as long as it can give ideate these four things:

| Need | Why | If the source can't give it |
|:---|:---|:---|
| **A stable ID per idea** | The ledger's `Source` column is the pipeline's memory of what it has already analyzed. The ID has to survive renames and reorders | Derive one: a relative path, an issue number, a URL, or a hash of title + date |
| **Readable text** | The model reads each shortlisted idea: the problem, who has it, and any rough requirements | Export to markdown first. Don't make the model log in to anything |
| **A date** | Newest-first ordering, and a way to skip ideas that have gone stale | Use the file's creation date or the item's created-at time |
| **Read-only access** | Ideate runs unattended. A stage that can write to the source can corrupt it, and the source usually belongs to someone else | Mount or clone it read-only, or read an export |

A **stream** (a category, a label, a folder) is optional but useful. Shortlisting across
streams stops one prolific stream from crowding out the others.

## Common sources

| Source | Stable ID | Notes |
|:---|:---|:---|
| **A folder of notes** (Obsidian vault, docs repo, `ideas/` folder) | Path relative to the source root | The simplest option. One folder or file per idea, with a README-style summary |
| **GitHub issues or discussions** with an `idea` label | `owner/repo#123` | `gh issue list --label idea --json number,title,body,createdAt`. Close or relabel ideas by hand, never from ideate |
| **A database or board** (Notion, Airtable, Linear, a spreadsheet) | The row or page ID | Export on a schedule to markdown or JSON. Don't give ideate the API token |
| **An upstream idea generator** (a scheduled job that writes idea cards from news, trends or research) | The card's path or ID | The reference implementation's source: a personal library of idea cards, one folder per idea (README, requirements, sometimes a prototype), grouped into five streams by month. Ideate only reads it |
| **Feedback and requests** (support tickets, user interviews, feature requests from other projects) | The ticket or message ID | Strip personal data in the export step. A plan folder can end up public |
| **Your own backlogs** (the "Later" sections of existing roadmaps, parked plans) | Repo + heading, or the plan slug | Good for spin-off tools. Watch for ideas that belong in the existing repo rather than a new one |
| **Public feeds** (Show HN, subreddits, newsletters, trend reports) | The item's URL | Put a filter job in front that writes only the relevant items as cards. Raw feeds are too noisy to shortlist from |

A pipeline can read more than one source. Give each a prefix in the ledger's `Source`
column (`gh:org/repo#12`, `vault:ideas/foo.md`) so IDs can't collide.

## Put a script between the source and the model

Following design rule 1, the listing is deterministic. A small adapter script (or a
paragraph in the runner's pre-check) turns whatever the source is into one list:

```
id | stream | date | title | where to read it
```

Then it drops every ID already in the ledger. The model gets that list and never crawls
the source itself. That has three effects:

- The **pre-check can count** unanalyzed candidates. Zero means skip the session.
- **Deduplication is exact.** The model doesn't have to remember what it has seen.
- **Changing sources** means rewriting the adapter, not the prompt.

With a single folder source, the "adapter" can be one paragraph in the prompt: list the
folders, drop the ones in the ledger, newest first. Move it into a script once there's a
second source or the list gets long.

## The ideate procedure, generically

1. **Throttle first.** The runner's pre-check skips the whole run while the number of
   `proposed` plus `planned` rows in the ledger is at or above the ideate threshold (5 in
   the reference, with ideate twice a week, so incubate always has a choice when a slot
   frees).
   More plans than incubate can take is wasted research.
2. **List and dedupe** through the adapter.
3. **Shortlist up to ten**, newest first, spread across as many streams as possible. Read
   each one's summary. Skim, don't analyze.
4. **Pick one** against your fit criteria (below). Record each passed-over idea with a
   one-line reason in the run summary, **not** in the ledger. A passed-over idea stays
   eligible for a later run, and only analyzed ideas count as seen.
5. **Plan it** with a business-plan skill that does real web research and ends in a verdict
   (`business-plan-builder` in this library does). Pose the decision as "should we
   build this as our next project, ahead of the other candidates?", and model
   the build estimate on one agent-built roadmap item per sweep.
6. **Score it 1–10** on how strongly it should be the next repo: the verdict, how strong the
   key assumption is, whether weekly agent work can build it, and how demo-able it is. A
   non-BUILD verdict scores 3 at most.
7. **Write one ledger row**: `proposed` if BUILD and the score clears the bar (6 in the
   reference), otherwise `rejected`, saying in the run summary when the score alone
   rejected it. The runner, not the session, then opens a plan-approval issue and emails
   the owner; closing it as Completed moves the row to `planned`, Not planned to
   `rejected`. Rejected ideas stay in the ledger so they're never analyzed again. To
   reconsider one, edit its row by hand.

One idea per run. With time left over, stop anyway: the throttle decides the pace, not the
session length.

**When the source already did the research**, skip steps 5–6. Some sources are themselves
the output of a research job: a weekly card generator that has already checked demand, the
competing listings and a spec. Re-running a business plan on that repeats paid work. Import
several ideas per run (with a cap), and spend the model's judgment on picking which ones to
move forward instead. The single-repo variant in `architecture.md` works this way.

**Web research as a fallback, not a feed.** If the pipeline may look at what people share
or sell (marketplaces, forums, blogs) when the source runs dry, the brief it writes has to be
**original**: it names the gap the existing listings leave and links them as inspiration.
It never copies a file, a model or a listing, and never builds on a trademark. Cap it lower
than the main source.

## Fit criteria

Write these down before the first run. They're what makes ideate pick the
right idea from a shortlist, and they're the part that varies most between orgs. The
reference implementation builds open-source developer tools for a GitHub organization, so its criteria are:

- An unattended agent can build and verify it in weekly increments. It has tests, a CLI or
  a library surface, and no step that needs a human in the loop.
- It can ship a demo on static hosting (client-side, sample data, no secrets).
- It's useful to the intended audience (here, developers and automation practitioners).
- There's a plausible route from a public repo to real users.

**Rank low:** ideas that need a licensed data feed, a regulated activity, paid accounts, a
hardware purchase, or a deadline that will have passed before a repo could ship.

Change the audience and the demo rule to match what you build. A game studio wants "playable in
the browser", and a data-tools org wants "runs against a public dataset". Keep the
agent-buildable rule in any case. An idea the roadmap routine can't make progress on
takes up an incubation slot and stalls.

## If you don't have a source yet

Start with a folder and a template. One file per idea:

```markdown
# <working title>

- **Problem:** who has it, and what they do today instead
- **Idea:** what the tool does, in two sentences
- **Audience:** who would install it
- **Why now:** what changed (a new API, a new model, a new rule)
- **Rough requirements:** the three to five things v1 must do
- **Source:** where the idea came from (link)
```

Add to it by hand, or point a weekly job at news or trend sources to draft cards into it.
Ideate only needs the folder to have more unanalyzed cards than it consumes, which with a
throttle of 2 is about one a week.

## Anti-patterns

- **Ideate writes to the source** ("mark as analyzed"). Use the ledger instead. The source
  isn't the pipeline's to change.
- **Letting the model browse a live board or inbox.** It isn't repeatable and can't be
  deduplicated, and it hands the stage credentials it doesn't need.
- **Recording shortlist rejects in the ledger.** They were only skimmed, and they fall out of
  the running for good.
- **No throttle.** An ideate job that runs three times a week fills the ledger with plans
  that go stale before incubate reaches them.
