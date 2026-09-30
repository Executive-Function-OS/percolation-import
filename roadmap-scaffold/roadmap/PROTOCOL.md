# Roadmap Protocol — percolation-import / Executive Function OS

This directory is a self-pacing, human-gated development loop. Claude Code
sessions are stateless workers; all state lives here in git. The human
(Annika) is the only party who advances a proposal's status past `draft`.

## The One-Action Rule (quota governor)

Every `/next` session performs EXACTLY ONE of the following, then stops:

1. **DRAFT** — If no proposal has `status: accepted` with work remaining,
   draft exactly one new proposal into `proposals/NNN-slug.md` and stop.
   Do not begin implementing it.
2. **IMPLEMENT** — If a proposal has `status: accepted`, implement the
   single next unchecked item in its Chunks list, check it off, commit,
   and stop. If all chunks are checked, set `status: done` and stop.

Never draft and implement in the same session. Never implement more than
one chunk per session unless the human says "continue" explicitly in that
session.

## Proposal format

```yaml
---
id: 003
title: Short imperative title
status: draft            # draft | accepted | revise | rejected | done
effort: S                # S (one sitting) | M (2-3 sessions) | L (split it)
divergence: none         # none | requested — 'requested' authorizes ONE
                         # /adhd run for this proposal, nothing more
depends_on: []
---
```

Body sections: **Why now** (2-4 sentences), **Deliverable** (concrete,
verifiable), **Chunks** (checklist, each completable in one session),
**Risks/Traps** (what could make this wasted effort).

## Human review loop (zero quota cost)

- `status: accepted` — proceed on next `/next`
- `status: revise` + inline comments — next session redrafts, does not implement
- `status: rejected` — archived, never implemented; reason noted for the record

## Dispatches (session reports)

Every session ends by writing a one-screen dispatch to
`reports/NNN-YYYY-MM-DD.md` (see `reports/TEMPLATE.md`) and copying it
over `reports/LATEST.md`. The dispatch is the newsletter: TL;DR, what
changed, decisions awaiting the human, deadline countdowns, budget, and
what the next session will do. `roadmap-nudge.sh` (cron, zero quota)
surfaces LATEST.md as a desktop notification with click-to-open, and
adds a gentle staleness note if the loop hasn't moved in 3+ days.
Dispatches are append-only history; never rewritten.

## Pacing rules

- Proposals with `effort: L` must be split before acceptance.
- Max one `divergence: requested` execution per calendar week.
- ADHD-skill output is ideation only. No fact, statistic, citation, or
  claim from a divergence run enters any grant document or public page
  without independent verification. (House rule. Non-negotiable.)
- Prefer editing files over long conversational context. If a session
  needs background, it reads STATE.md and the relevant proposal — it does
  not ask the human to re-explain.

## Standing deadlines (verify before relying on)

- NSF SBIR Phase I full proposal: **Nov 4, 2026** (Project Pitch + NSF
  invitation required first; pitch review ~3 weeks; pitch by late August)
- NIH SBIR Parent NOFO standard due dates: Sep 5 / Jan 5 / Apr 5
  (Jan 5, 2027 is the realistic target)
- Entity prerequisites (LLC, SAM.gov, SBA registry) gate everything above.
