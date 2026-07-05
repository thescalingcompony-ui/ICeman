---
name: verify-dashboard
description: How to confirm a dashboard.html change actually renders and behaves before committing — the quick structural checks and the real browser check for interactivity/theming. Use after any edit and always before a "done"/committed claim.
---

# verify-dashboard

There are no unit tests here; the file *is* the deliverable, so verification means
actually looking at it. Two tiers — do tier 1 always, tier 2 for anything that
touches script, layout, or theming.

## Tier 1 — structural (always, fast)

- **Data checklist:** run the consistency checklist in `dashboard-anatomy` (five
  mirrors agree; tiles add up; every `data-project` has a `PROJECTS` key).
- **Escaping:** any new modal field is wrapped in `esc()` (`change-rules` §2).
- **Sanity grep:** confirm the set of `data-project` values matches the `PROJECTS`
  keys. Quick way:
  ```bash
  grep -o 'data-project="[^"]*"' dashboard.html | sort -u
  grep -oE '"[a-z-]+":\s*\{' dashboard.html   # PROJECTS keys
  ```
  Every card/bar id should have a matching object key and vice-versa.

## Tier 2 — behavioral (browser, for real changes)

Chromium + Playwright are preinstalled in this environment
(`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`; don't run `playwright install`).
Load the file and check the things that only break at runtime:

- Page renders with no console errors.
- Clicking a card **and** a timeline bar opens the modal with the right title,
  resources, and action links.
- Close works three ways: ✕ button, backdrop click, **Escape**.
- Focus moves to the close button on open and returns to the trigger on close.
- Toggle color scheme (emulate `prefers-color-scheme: dark`) — the whole page
  themes, including pills, timeline, and modal. If you changed tokens, also
  exercise the manual `data-theme` toggle both directions.

Minimal driver (adjust path):
```js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + process.cwd() + '/dashboard.html');
  await p.click('[data-project="grub-vine"]');
  await p.waitForSelector('.overlay.on');
  await p.keyboard.press('Escape');
  await p.emulateMedia({ colorScheme: 'dark' });
  await p.screenshot({ path: 'verify-dark.png', fullPage: true });
  console.log('console errors:', errs);
  await b.close();
})();
```
A screenshot in each theme is the cheapest proof the change looks right. When the
change is purely a data refresh with no structural edit, Tier 1 plus a spot-open
of one affected modal is enough.
