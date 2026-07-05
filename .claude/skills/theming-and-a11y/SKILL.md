---
name: theming-and-a11y
description: The color-token system in dashboard.html (four :root blocks that must stay in sync for light, system-dark, and the manual theme toggle) and the accessibility patterns already built in. Use when adding a color, a status, or any interactive element, and before changing anything in the <style> block.
---

# theming-and-a11y

## The four `:root` blocks — keep them in sync

All color is driven by CSS custom properties. There are **four** declaration
blocks and a new token usually needs to appear in the ones that differ by theme:

1. `:root { … }` — the **light** defaults (base values).
2. `@media (prefers-color-scheme: dark) { :root { … } }` — auto dark for users who haven't toggled.
3. `:root[data-theme="dark"] { … }` — the **manual** dark override (viewer's toggle stamps `data-theme` on the root and must win over the media query).
4. `:root[data-theme="light"] { … }` — the manual light override (wins over auto-dark when a dark-preferring user forces light).

**Rule:** if you add or rename a color token, add it to the light `:root`, the
`@media` dark block, **and** both `[data-theme]` blocks — or the toggle will show
a half-themed page in one direction. The dashboard must look right in *both*
themes and honor the toggle *both* ways.

Token families: page/surface/surface-2, ink/ink-2/muted, hairline/grid, accent
(+soft), and the four status pairs `good` / `live` / `pending` / `paused`, each
with a `-soft` background and `-ink` text tuned per theme. Status pills, timeline
bars, and the legend all read from these — change the token, not the call sites.

## Accessibility patterns already in place — preserve them

The dashboard is keyboard- and screen-reader-friendly. When you touch these
areas, keep the pattern:

- **Modal:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"`.
  On open, focus moves to the close button; on close, focus returns to the
  triggering element (`lastFocus`). **Escape** closes it. Backdrop click closes.
- **Interactive cards/bars are real `<button>`s** (not clickable `<div>`s) so they
  are focusable and enter/space work. Keep them buttons.
- **`:focus-visible`** outlines exist on links, cards, bars, and the close button.
  Don't remove outlines without an equivalent visible focus state.
- **`prefers-reduced-motion`**: the card hover-lift is guarded by
  `@media (prefers-reduced-motion: no-preference)`. Any new motion must be too.
- **Decorative elements** (the legend swatches) carry `aria-hidden="true"`. The
  connected-services chip row has `aria-label`. Keep decorative-vs-semantic honest.
- **Contrast:** the `-ink` tokens are chosen to stay legible on their `-soft`
  backgrounds in both themes. If you introduce a color, check it in light and dark.

## Adding a new status

If a genuinely new status is ever needed, add a full token trio
(`--x` / `--x-soft` / `--x-ink`) to **all four** `:root` blocks, a `.pill.x`
rule, and a legend swatch — then it's usable by cards, pills, and timeline bars
consistently. Prefer reusing the existing four first.
