# ICeman — Project Control dashboard

## What this repo is (read this first)

The **entire repo is one file: `dashboard.html`** — a self-contained status board
("Project Control — The Scaling Company") that mirrors the live state of projects
across six connected services: GitHub, Supabase, Netlify, Canva, Google Calendar,
Google Drive. No build, no dependencies, no framework. It opens directly in a
browser and renders as a Claude artifact.

The real recurring work is the scheduled **Daily refresh**: an AI session re-pulls
status from those services and rewrites the numbers, statuses, and sync stamp.

## The one thing that will bite you

A single project's facts are **mirrored in five places** that must always agree:
its card, its timeline bar, its service-inventory rows, the stat tiles, and the
`PROJECTS` object in the `<script>`. Change one, change all. This is the #1 source
of defects here.

## Skills — the playbooks left for whoever maintains this

Reach for these in `.claude/skills/`:

| Skill | Use when |
|---|---|
| **daily-refresh** | Running the scheduled sync — the core recurring job. |
| **dashboard-anatomy** | Before editing any project fact; the file map + the five-mirrors rule. |
| **service-sources** | Which MCP tool gives truth for each service and what field it feeds. |
| **timeline-geometry** | Touching timeline bars / the today marker / a project's dates. |
| **theming-and-a11y** | Adding a color, status, or interactive element; the four `:root` blocks. |
| **change-rules** | Any edit — the single-file, no-deps, escape-everything constitution. |
| **failure-log** | Skim before non-trivial work; the traps that cost time. |
| **verify-dashboard** | After any change, before claiming done. |

## Non-negotiables (full detail in change-rules)

1. Stay one self-contained file — no external scripts/styles/fonts/images, no build.
2. Escape every dynamic string injected into the DOM (`esc()`).
3. Keep the five mirrors in sync.
4. The board is a mirror — report what the services actually say; "no change" is valid.
5. Preserve the theming and accessibility patterns already in place.
