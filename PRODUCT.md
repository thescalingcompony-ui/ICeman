# Product

<!-- impeccable:product-schema 1 -->

> Written by `/impeccable init` from repository evidence only; the owner declined the interview. Lines marked *(inferred)* are hypotheses to confirm, not approved facts.

## Platform

web

## Users

The owner of The Scaling Company, a small AI-automation agency, checking on their own portfolio of client and internal projects. *(inferred from the page title and the single-account service connections; whether teammates or clients also see it is undecided)*

## Product Purpose

Project Control (`dashboard.html`) is one page that brings together the state of every project the agency is running. Status is spread across GitHub, Supabase, Netlify, Canva, Google Calendar and Google Drive, so no single tool shows it. Success means the owner can see, in a single glance, what is active, what is live, what is paused or dormant, and what (if anything) is coming up. They shouldn't have to open each service. *(inferred)*

## Positioning

The page is built from the owner's actual connected accounts and refreshed every day by an automated Claude routine. Every status, date and count comes from a service, along with a stamp showing when it was synced. It is not a generic project-management board where people type in their own status.

## Operating Context

- An automated daily refresh (07:00 UTC) rewrites the data inside the HTML. It updates the sync stamp, project statuses, the "today" marker and calendar window, the timeline scale, and expiring Canva links. Commits are titled "Daily refresh: …".
- The status vocabulary in use is Active, Live, Pending, Paused and Dormant. Projects fall into three groups: Current, Shipped & live, and Past & paused.
- Projects tracked today: Coach Q — Nico, ICeman, Grub & Vine Events, Winter Wednesdays — Blue Room, style-list, vera, ScaleDesk, and TSC brand & social.
- Opening a project card or timeline bar shows a detail view.

## Capabilities and Constraints

- The whole page is one self-contained file, `dashboard.html`: inline CSS and JS, no build step, no framework, and system font stacks. The daily refresh edits this file directly, so future work must keep that editing reliable: data has to stay easy to find and edit by hand.
- It has a light and a dark theme (`prefers-color-scheme` plus a `data-theme` override) and respects `prefers-reduced-motion`.
- The timeline runs from each project's first recorded activity to today. A project whose start date its source doesn't provide is left off the timeline and noted in a footnote, rather than given a guessed date.
- **Undecided:** whether the page should ever fetch live data instead of storing it in the file; where it is hosted or shared; and whether it must support phone-sized screens as a primary use.

## Brand Commitments

- Name: "Project Control — The Scaling Company".
- Voice: plain, factual status sentences that state where data came from (for example, "Netlify doesn't expose its start date") and never pad them out.

## Evidence on Hand

- All content comes from the connected services and lives in `dashboard.html`.
- There are no testimonials, metrics or client quotes, and future work must not invent any. Counts and dates have to match what the sources report.

## Product Principles

1. **Truth over polish:** show only what a service actually reports, say when data is missing, and never fill gaps with guesses.
2. **Glanceable first:** the top of the page answers "what's going on" before anyone scrolls; detail stays one click away.
3. **Safe to automate:** structure and markup stay predictable so the daily refresh can update data without breaking the layout.
4. **Freshness is visible:** the sync time is always shown, and stale data should look stale.

## Accessibility & Inclusion

No product-specific standard has been set. The page already uses ARIA labels, an accessible modal dialog and reduced-motion handling, and future work should keep them.
