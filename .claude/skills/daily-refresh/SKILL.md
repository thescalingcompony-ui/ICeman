---
name: daily-refresh
description: Run the scheduled data refresh of dashboard.html — re-pull current status from the six connected services, update every mirrored field plus the sync stamp, and commit with a "Daily refresh: …" message. Use whenever asked to refresh/sync the dashboard, when the daily trigger fires, or before reporting the board is up to date.
---

# daily-refresh

This is the core recurring job. The dashboard is a mirror; this skill re-syncs
the mirror to reality. Read `dashboard-anatomy` first if you have not — the
whole point is that one fact lives in five places.

## The loop

For each connected service, pull ground truth, then reconcile it into the file.
Exact tool-to-field mapping is in `service-sources`. In short:

1. **GitHub** — repo/PR/branch state → `iceman` project + GitHub service table.
2. **Supabase** — each project's DB status (`ACTIVE_HEALTHY` / `INACTIVE` / paused) and region → Supabase table, the "Active databases N/4" tile, and each project's `resources`.
3. **Netlify** — sites + whether each deploy is current → Netlify table + "Live sites" tile.
4. **Canva** — recent designs (share links **expire and must be rotated**, see below) → Canva table + relevant `PROJECTS.actions`.
5. **Google Calendar** — events in the next 14 days → "Events next 14 days" tile + Calendar table.
6. **Google Drive** — recent file activity → Drive table + Coach-Q / style-list `resources`.

## Reconcile (walk all five mirrors)

For every project whose real state moved:

- Flip its **pill** (class + label) and its **timeline bar color**.
- Rewrite its **card detail** and **`PROJECTS[id].summary`** to describe the new reality.
- Update **`resources[]` states** (`ok:true/false`, the `state` string).
- Fix the **service inventory** rows.
- Recompute the **four stat tiles** from scratch — don't increment by hand.

Then always:

- Update the **sync stamp** (`.sync .stamp`) to the run's UTC time and re-confirm the "Auto-refreshes daily at 07:00 UTC" line still matches the actual schedule.
- If the calendar window rolled past what the timeline covers (e.g. into a new month), re-check `timeline-geometry` — the `today` marker and the window may need rescaling.

## Commit convention

History uses terse, factual messages that say **what actually changed**:

```
Daily refresh: no status changes; rotate Canva links, update sync stamp
Daily refresh: Drive online, Coach Q outreach active, Canva links rotated
```

Match that style. If nothing material changed, say so ("no status changes")
rather than inventing motion. A refresh that only bumps the stamp is a valid,
honest commit — don't fabricate updates to look busy.

## Known recurring chores

- **Canva links rotate.** Canva share/edit URLs are not permanent; a refresh
  routinely re-fetches and swaps them in the Canva table and `PROJECTS.actions`.
  Don't assume a stale Canva link still resolves.
- **Supabase free-tier DBs auto-pause.** A project going `INACTIVE` is normal,
  not a bug — reflect it, don't try to "fix" it. Restoring is a human action.

## Verify before you commit

Run `verify-dashboard`. At minimum: the file still opens, both themes render,
a modal opens for at least one project, and the consistency checklist in
`dashboard-anatomy` passes.
