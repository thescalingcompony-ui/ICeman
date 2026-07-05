---
name: timeline-geometry
description: How the timeline bars and the "today" marker in dashboard.html are positioned — the date-to-percentage coordinate system, the formula, worked examples, and how to add/remove a row or roll the window into a new month. Use whenever you touch anything under the Timeline section or a project's start/end date changes.
---

# timeline-geometry

The timeline is hand-positioned with CSS percentages. There is no date library —
`left` and `width` are literal `%` values on each `.tl-bar`. Get them wrong and
bars drift off the month grid. This skill is the coordinate system.

## The coordinate system

The track spans the window in the `<h2>` ("April – July 2026"), mapped **0%–100%
left→right**, at roughly **1% per day** from April 1. The month markers are the
anchors (`.tl-months .m`):

| Marker | left |
|---|---|
| Apr | 0% |
| May | 30% |
| Jun | 61% |
| Jul | 91% |
| **today** | 94% *(currently Jul ~5)* |

Within a month, interpolate linearly by day. So:

```
left% ≈ month_anchor% + (day_of_month − 1) × ~1%
```

## The rule for an ongoing bar

Every currently-active project's bar **ends at the `today` marker**. So:

```
left  = start date's %       (from the formula above)
width = today% − left        (currently 94 − left)
```

Worked examples from the live file (all end at 94% = today):

| Project | Start | left | width | check |
|---|---|---|---|---|
| ScaleDesk | Apr 7 | 6% | 88% | 6+88 = 94 ✓ |
| Coach Q | Apr 29 | 28% | 66% | 28+66 = 94 ✓ |
| Grub & Vine | May 7 | 36% | 58% | 36+58 = 94 ✓ |
| style-list | Jul 1 | 91% | 3% | 91+3 = 94 ✓ |
| ICeman | Jul 2 | 92% | 2% | 92+2 = 94 ✓ |

Bar **color** = the project's status token (`--good`/`--live`/`--pending`/`--paused`),
and it must match the pill in the card. The `.tip` text is
`Name · <start> → now · <status phrase>`.

## Advancing "today"

On a refresh, move the `.tl-today` marker and **every ongoing bar's right edge**
to the new today%. Practically: bump `today` left%, then for each ongoing bar set
`width = today% − left`. Paused/ended bars keep their fixed end.

## Rolling into a new month (the real footgun)

The window is fixed at "April – July 2026" and `today` is near the right edge
(94%). Once the real date passes early July, `today` marches toward 100% and then
runs out of room. When that happens you must **extend the window**: update the
`<h2>`, add/shift the month markers, and **rescale every `left`/`width`** to the
new span. Don't just push `today` past 100%. This is a monthly maintenance beat,
not a daily one.

## Adding or removing a project row

- Add a `.tl-row` (name + `.tl-track` + `.tl-bar`) with a `data-project` that has
  a matching `PROJECTS` key, correct `left`/`width`/`background`, and a `.tip`.
- If a project genuinely has no start date (like Winter Wednesdays via Netlify),
  **omit it** and keep it named in the `.tl-note` footnote so the omission is
  intentional and documented — don't guess a date.
