---
name: service-sources
description: For each of the six connected services, the MCP tools that give ground truth and exactly which dashboard fields they feed. Use during a refresh, when adding a project/resource, or whenever you need to know "where does this number come from and how do I re-derive it."
---

# service-sources

The dashboard mirrors six services. This is the mapping from "what tool tells me
the truth" to "what on the dashboard it controls." Use `ToolSearch` to load a
tool's schema before calling it (e.g. `select:mcp__Supabase__list_projects`).

## GitHub — `mcp__github__*`
- **Truth:** `get_me`, `list_branches`, `list_pull_requests`, `list_commits`, `search_issues` for `thescalingcompony-ui/iceman`.
- **Feeds:** the `iceman` card + `PROJECTS.iceman` (default-branch-empty vs working-branch state, PR/issue counts), and the GitHub row in Service inventory ("empty · 0 PRs").
- **Note:** the repo name on GitHub is lowercase `iceman`; the project is styled `ICeman`. Keep both spellings where they already appear.

## Supabase — `mcp__Supabase__*`
- **Truth:** `list_projects` (status = `ACTIVE_HEALTHY` / `INACTIVE` / paused, region, Postgres version), `get_project` for detail. `list_organizations` first if needed.
- **Feeds:** the Supabase inventory table (one row per project with `status · region`), the **"Active databases N / 4"** tile (count of healthy vs total), and each project's Supabase `resources[]` entry (`state`, `ok`).
- **Rule:** `INACTIVE` DBs render with `ok:false` / `warn` and a "restore in Supabase" action. This is expected free-tier behavior, not a failure.

## Netlify — `mcp__Netlify__*`
- **Truth:** `netlify-project-services-reader` for sites and deploy status.
- **Feeds:** the Netlify inventory table (site → "deploy current"), the **"Live sites"** tile, and the `grub-vine` / `winter-wednesdays` cards + `PROJECTS`.
- **Note:** existing Netlify links use `http://` (as fetched). Winter Wednesdays has **no start date exposed** by Netlify — that's why it's omitted from the timeline; keep that footnote if it stays true.

## Canva — `mcp__Canva__*`
- **Truth:** `search-designs` / `list-folder-items` for recent designs, `get-design` for detail.
- **Feeds:** the Canva inventory table (design → date/page count) and `PROJECTS.*.actions` links (Vine AI decks, TSC social posts).
- **Rule:** **Canva URLs rotate** — re-fetch them every refresh and update everywhere the old link appeared. A "Canva links rotated" commit is routine.

## Google Calendar — `mcp__Google_Calendar__*`
- **Truth:** `list_events` over the next 14 days (and the window shown in the Calendar table).
- **Feeds:** the **"Events next 14 days"** tile and the Calendar inventory block ("No events scheduled …" when empty). Update the date range in that sentence to the actual window.

## Google Drive — `mcp__Google_Drive__*`
- **Truth:** `list_recent_files` / `search_files` for recently touched sheets and folders.
- **Feeds:** the Drive inventory table (file → last-touched date) and the Coach-Q / style-list `resources[]` (outreach sheets, STYLE product-photo folder).

## When a service has no data
Render the empty state that already exists (e.g. Calendar's `.empty`
paragraph) rather than deleting the block. The six chips at the top should keep
reflecting which services are *connected*, independent of whether they currently
have items.
