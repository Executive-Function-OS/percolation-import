Read roadmap/PROTOCOL.md and roadmap/STATE.md, then scan
roadmap/proposals/ frontmatter.

Apply the One-Action Rule:

1. If any proposal has `status: accepted` with unchecked Chunks:
   implement ONLY the first unchecked chunk of the lowest-numbered such
   proposal. Check it off. Update STATE.md (session log row, next action).
   Commit with message "roadmap: <id> chunk — <chunk summary>". STOP.

2. Else if any proposal has `status: revise`: redraft it per the human's
   inline comments, set `status: draft`, update STATE.md, commit. STOP.

3. Else: draft exactly ONE new proposal (next number) drawing from the
   STATE.md parking lot or PROTOCOL.md standing deadlines, whichever is
   more time-sensitive. Set `status: draft`. Update STATE.md. Commit with
   message "roadmap: propose <id> <title>". STOP.

Mandatory final step (part of EVERY action, before the STOP):
Write a dispatch to roadmap/reports/NNN-YYYY-MM-DD.md following
roadmap/reports/TEMPLATE.md exactly (NNN = session number from STATE.md
log). Compute the Deadline watch day-counts from today's actual date.
Copy the finished dispatch over roadmap/reports/LATEST.md. Include both
files in the session's commit. A session without a dispatch is an
incomplete session.

Constraints:
- One action per invocation. Do not continue past the STOP.
- Only run /adhd if the active proposal has `divergence: requested` AND
  STATE.md shows divergence budget available; then mark the budget used.
- If a chunk turns out bigger than one session, do NOT push through:
  split it into sub-chunks in the proposal file, complete the first,
  and stop.
- Never place unverified facts, statistics, or citations into grant
  documents or public-facing pages.
