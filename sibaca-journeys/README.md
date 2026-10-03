# Sibaca Journeys website

Static, mobile-first marketing site for **Sibaca Journeys** (sibacajourneys.co.za).
No framework, no database, no build dependencies.

## Structure

```
build.mjs          Builds the pages. Shared header, footer, meta tags, schema and business details live here.
src/pages/*.html   Page content (one file per page). Edit these, not public/*.html.
public/            The deployable site. Upload or deploy this folder.
  assets/css/site.css
  assets/js/site.js   Mobile menu + quote form (sends to WhatsApp or email)
  assets/img/         Compressed photos (WebP + JPEG), logo, favicons, OG image
```

## Editing

1. Change a page in `src/pages/`, or the business details (phones, email, WhatsApp) at the top of `build.mjs`.
2. Run `node build.mjs` (Node 18+). It rewrites `public/*.html` and `public/sitemap.xml`.
3. Preview: `npx serve public` (or open `public/index.html` in a browser).

If the WhatsApp number or email changes, also update `WA_NUMBER` / `EMAIL` at the top of `public/assets/js/site.js`.

## Deploying

Deploy the `public/` folder to any static host (Netlify, Cloudflare Pages, GitHub Pages, cPanel hosting).
On Netlify: set the publish directory to `sibaca-journeys/public` with no build command, or drag the `public` folder onto the Netlify dashboard.
Point `sibacajourneys.co.za` at the host. Canonical URLs, Open Graph tags, the sitemap and the schema all assume `https://sibacajourneys.co.za`.

## Quote form

There is no backend. When a visitor submits, `site.js` builds a message from the form and opens either
WhatsApp (to 078 324 2012) or their email app (to info@sibacajourneys.co.za), with everything filled in.
The visitor still has to press send. Links such as `contact.html?type=airport#quote` preselect the journey type.

## Content rules followed

- **Fleet:** only the 3 × 22-seater Mercedes Sprinters are shown as owned, using the real photos. Sedans, SUVs and larger coaches appear as "available on request" through the partner network, with icons only and no vehicle photos.
- **Black-and-gold renders:** not used anywhere. They show a future livery, not the current fleet.
- **Photos left out:** the photo with a learner in it is cropped to remove the child. The photo of private cars at a house and the VW Kombi photo are not used.
- **No prices** and **no testimonials.** The home page has one placeholder line, marked with an HTML comment, to replace with real reviews.

## To do before launch

- [ ] Replace the review placeholder on the home page (`src/pages/index.html`) with real reviews.
- [ ] Have the client approve the mission statement and the "Our story" text on the About page. These were drafted from the business plan.
- [ ] Add a street address to the schema and footer if the client wants one shown (currently "Cape Town, Western Cape"). The Google Business Profile listing must use the same name and phone number.
- [ ] Once the site is live, add the Google Business Profile and social media URLs to `sameAs` in `build.mjs`.
- [ ] Make sure info@sibacajourneys.co.za is set up and receiving mail.
