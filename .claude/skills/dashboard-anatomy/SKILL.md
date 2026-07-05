---
name: dashboard-anatomy
description: The map of dashboard.html — the single file this repo is, its line-region layout, and the FIVE places every project fact is mirrored and must be kept in agreement. Use this before editing any project's status, count, date, or detail text, and whenever a change "looks like a one-liner" but touches a project.
---

# dashboard-anatomy

## What this repo is

The entire repo is one file: `dashboard.html`. No build step, no dependencies,
no framework. It opens directly in a browser and is also rendered as a Claude
artifact. If you ever find yourself reaching for npm, a bundler, or a second
file, stop and read `change-rules`.

It is a **status dashboard** ("Project Control — The Scaling Company") that
mirrors the live state of projects across six connected services. The recurring
job is the scheduled **Daily refresh** (see `daily-refresh`), which re-pulls
that state and rewrites the numbers.

## The file, top to bottom

| Region | Roughly | What lives there |
|---|---|---|
| `<style>` | top ~250 lines | All CSS. Four `:root` blocks of color tokens — see `theming-and-a11y`. |
| `header` + `.sync` | ~250–259 | Title and the **sync stamp** ("Data synced … UTC"). Bump this every refresh. |
| `.chips` | ~261–268 | The six connected-service badges. |
| `.stats` (4 tiles) | ~270–291 | Projects tracked / Live sites / Active databases / Events next 14 days. **Derived counts** — recompute, don't hand-edit blindly. |
| `.cards` × 3 sections | ~293–358 | Project cards: Current, Shipped & live, Past & paused. Status pill + detail text + source tags + meta line. |
| `.timeline` | ~360–402 | Timeline bars. Positions are percentages — see `timeline-geometry`. |
| `.services` | ~404–453 | Service inventory tables (one block per service). |
| `footer` | ~455–457 | Sources line. |
| `.overlay`/`.modal` | ~460–468 | The empty modal shell filled by JS. |
| `<script>` `PROJECTS` | ~471–574 | The **data model** for the detail modal: summary, resources, actions, meta, status per project. |
| `<script>` logic | ~576–622 | `esc()`, `openProject()`, `closeModal()`, event wiring. |

## THE golden rule: one project fact lives in five places

There is no single source of truth in this file. A single project (say
`grub-vine`) appears in **all** of these, and they must agree:

1. **Stat tiles** — if it changes the count of live sites / active DBs / events.
2. **Its card** — status pill class + label, detail paragraph, `.src` tags, `.meta`.
3. **Its timeline bar** — `data-project`, `left`/`width` %, `background` color, `.tip` text.
4. **Service inventory** — its row(s) in each relevant service table.
5. **`PROJECTS["id"]`** — `status`, `summary`, `resources[]`, `actions[]`, `meta`.

The IDs tie them together via `data-project="id"` (card + timeline bar) and the
`PROJECTS` key. **If you change a status, walk all five.** The most common defect
in this repo is updating the card but not the `PROJECTS` object (or vice-versa),
so the card says "Paused" and the modal still reads "Active."

## Consistency checklist (run before every commit)

- [ ] Status pill class **and** label match `PROJECTS[id].status` (e.g. `["paused","Dormant"]`).
- [ ] Timeline bar color matches the status (`--good`/`--live`/`--pending`/`--paused`).
- [ ] Every `data-project` and every `.tip`/`data-project` bar has a matching `PROJECTS` key.
- [ ] The four stat tiles still add up to what the cards/services show.
- [ ] Sync stamp reflects the current run.
- [ ] Any URL you changed is updated everywhere it appears (card, service table, `PROJECTS.actions`).

Status vocabulary is fixed: `active`, `live`, `pending`, `paused` (class names →
color tokens). Display labels can vary ("Paused" vs "Dormant") but the class must
be one of those four.
