---
name: change-rules
description: The non-negotiable constraints for editing dashboard.html — it stays one self-contained file with no external dependencies, and every dynamic string injected into the DOM must be escaped. Read before any edit; these are the rules that keep the file shippable as both a plain page and a Claude artifact.
---

# change-rules

These are the constitution for this repo. Everything in the other skills assumes
you are honoring these.

## 1. One file, self-contained, zero dependencies

`dashboard.html` is the whole product. It must keep working when opened directly
from disk and when rendered as a Claude artifact.

- **No** external scripts, stylesheets, fonts, CDN links, or remote images. A
  strict artifact CSP blocks external hosts — an external `<link>` or `fetch`
  will silently fail. Inline everything; embed any asset as a `data:` URI.
- **No** build step, bundler, package.json, or framework. Plain HTML/CSS/JS.
- **No** splitting into multiple files. If a change tempts you to add a file,
  it belongs inline or it doesn't belong.
- Fonts come from the system stack (`--sans` / `--mono`). Keep it that way.

## 2. Escape everything you inject

The modal is built with `innerHTML` from the `PROJECTS` data. The `esc()` helper
(escapes `& < > "`) exists for this. **Every** dynamic value written into markup —
`name`, `summary`, `sub`, `state`, labels, and especially **`url`** — must pass
through `esc()`. Look at `openProject()`: every interpolation is already wrapped.
If you add a field to the modal, wrap it too. Unescaped content (a stray `<`, a
quote in a URL) breaks the markup or opens an injection hole.

## 3. Keep the five mirrors in sync

Restated because it's the #1 defect source: a project's status/dates/URLs live in
the card, the timeline bar, the service table, the stat tiles, **and** the
`PROJECTS` object. Change one, change all. See `dashboard-anatomy`.

## 4. Be truthful; the board is a mirror

Numbers and statuses must reflect what the services actually report (see
`service-sources`). Don't round a paused DB up to "active," don't invent events,
don't fabricate activity to make a refresh look productive. "No status changes"
is a valid outcome.

## 5. Match the existing idiom

The file has a consistent voice and style: terse `--token` CSS, BEM-ish class
names, 2-space indent, sentence-case detail text, `mono` for metadata/dates.
New code should be indistinguishable from what's there. Don't introduce a new
naming scheme or reformat regions you aren't changing.

## 6. Preserve accessibility and theming

Don't regress the patterns in `theming-and-a11y`: real buttons, focus
management, both themes, reduced-motion guard, escaped content.
