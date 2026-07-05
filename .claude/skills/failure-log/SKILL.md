---
name: failure-log
description: The postmortems and recurring gotchas for dashboard.html — the mistakes that have cost time or would silently ship wrong. Skim this before a refresh or a non-trivial edit so you don't relearn them the expensive way.
---

# failure-log

Short, blunt entries. Each is a real trap in this file. When you hit a new one,
add it here — that is how this skill earns its keep after the model that wrote it
is gone.

## F1 — The half-updated project (most common)
**Symptom:** a card says "Paused" but the modal still reads "Active," or a URL is
fixed in the card but stale in `PROJECTS.actions`.
**Cause:** one project fact lives in five places (card, timeline, service table,
stat tiles, `PROJECTS`) and only some were updated.
**Fix:** run the consistency checklist in `dashboard-anatomy` before every commit.

## F2 — Stat tiles drift from reality
**Symptom:** "Active databases 1 / 4" while three DBs show healthy in the table.
**Cause:** editing a project's status without recomputing the derived tiles.
**Fix:** recompute all four tiles from the underlying cards/services, don't
increment by hand.

## F3 — Timeline bars slide off the grid
**Symptom:** a bar no longer lines up with its month, or extends past `today`.
**Cause:** guessing `left`/`width` instead of using the 1%-per-day formula, or
advancing `today` without re-widening the ongoing bars.
**Fix:** use `timeline-geometry`. Ongoing bars end exactly at `today%`.

## F4 — The window runs out of room
**Symptom:** `today` marker creeping toward 100% as the real date advances.
**Cause:** the timeline window is fixed ("April – July 2026"); it doesn't
auto-extend.
**Fix:** when the month rolls, extend the `<h2>` window, move the month markers,
and rescale every bar. See `timeline-geometry` → "Rolling into a new month."

## F5 — Stale Canva links
**Symptom:** a Canva action link 404s or opens the wrong design.
**Cause:** Canva share/edit URLs rotate; the dashboard cached an old one.
**Fix:** re-fetch Canva links every refresh and update all copies. Routine, not a bug.

## F6 — Treating a paused Supabase DB as broken
**Symptom:** trying to "fix" or restore an `INACTIVE` database.
**Cause:** Supabase auto-pauses free-tier DBs after inactivity — expected.
**Fix:** just reflect it (`ok:false`, "restore in Supabase" action). Restoring is
a human decision, not a refresh action.

## F7 — External resource silently blocked
**Symptom:** a font/icon/image doesn't load when viewed as an artifact.
**Cause:** artifact CSP blocks external hosts; the request fails quietly.
**Fix:** inline it or use a `data:` URI. Never depend on a remote asset. See
`change-rules`.

## F8 — Unescaped string breaks the modal
**Symptom:** modal renders garbled, or content after a `<`/quote disappears.
**Cause:** a new `PROJECTS` field injected into `innerHTML` without `esc()`.
**Fix:** wrap every interpolated value in `esc()`. See `change-rules` §2.

## F9 — Theme toggle half-applies
**Symptom:** page looks right in system dark but the manual toggle leaves stray
light-colored elements (or vice-versa).
**Cause:** a color token added to `:root`/media but not to the `[data-theme]`
override blocks.
**Fix:** add every token to all four `:root` blocks. See `theming-and-a11y`.
