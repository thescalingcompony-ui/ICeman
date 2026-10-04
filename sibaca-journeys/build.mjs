// Builds the static site: wraps each page in src/pages with the shared
// header, footer, meta tags and schema, and writes it to public/.
// Usage: node build.mjs   (Node 18+, no dependencies)
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const pagesDir = join(root, "src", "pages");
const outDir = join(root, "public");

// ---- Business details: change them here and rebuild; every page updates. ----
export const biz = {
  name: "Sibaca Journeys",
  url: "https://sibacajourneys.co.za",
  email: "info@sibacajourneys.co.za",
  phones: [
    { label: "073 669 0770", e164: "+27736690770" },
    { label: "065 711 5770", e164: "+27657115770" },
  ],
  whatsapp: { label: "078 324 2012", wa: "27783242012" },
  locality: "Cape Town",
  region: "Western Cape",
  country: "ZA",
  countryName: "South Africa",
  tagline: "People • Places • Possibilities",
  motto: "Driven by Legacy",
};

const nav = [
  ["index.html", "Home"],
  ["about.html", "About"],
  ["services.html", "Services"],
  ["corporate.html", "Corporate"],
  ["tours.html", "Tours"],
  ["fleet.html", "Fleet"],
  ["partnerships.html", "Partnerships"],
  ["contact.html", "Contact"],
];

const waLink = (text) =>
  `https://wa.me/${biz.whatsapp.wa}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

const icons = {
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  school: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2.5 9 2.5 12 0v-5"/>',
  bus: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 11h18M8 4v7M16 4v7"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>',
  plane: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  map: '<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/>',
  shuttle: '<path d="M2 17V7a2 2 0 0 1 2-2h11l5 5v7"/><path d="M2 12h20M15 5v7"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>',
  route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  user: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  handshake: '<path d="M11 17l2 2a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4L13 7"/><path d="M14 14l-3-3M17 11l-3-3"/><path d="M2 12l5-5 3 1 2-2"/><path d="M7 17l-5-5"/><path d="M22 12l-3-3"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  car: '<path d="M5 17h14M3 17v-4l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5v4"/><path d="M3 13h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  suv: '<path d="M2 16V9a2 2 0 0 1 2-2h12l4 4h0a2 2 0 0 1 2 2v3"/><path d="M2 12h20M10 7v5"/><circle cx="6.5" cy="16.5" r="2"/><circle cx="17.5" cy="16.5" r="2"/>',
  coach: '<rect x="2" y="5" width="20" height="12" rx="2"/><path d="M2 11h20M6 5v6M10 5v6M14 5v6M18 5v6"/><circle cx="6.5" cy="19" r="1.5"/><circle cx="17.5" cy="19" r="1.5"/>',
  mountain: '<path d="M8 3l4 8 5-5 5 15H2L8 3z"/>',
  wine: '<path d="M8 22h8M12 15v7M7 2h10l-1 6a4 4 0 0 1-8 0L7 2z"/>',
  wave: '<path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 6c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
  tree: '<path d="M12 22v-6"/><path d="M12 2l7 10h-4l4 6H5l4-6H5z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8"/>',
  ticket: '<path d="M2 9a3 3 0 0 0 0 6v3a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3a3 3 0 0 0 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
  receipt: '<path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 1 .7V2l-1 .7-3-2-3 2-3-2-3 2-3-2z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  whatsapp: '<path class="icon-fill" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3z"/>',
};

export const icon = (name, cls = "icon") => {
  if (!icons[name]) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
};

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${biz.url}/#business`,
  name: biz.name,
  slogan: `${biz.tagline} — ${biz.motto}`,
  description:
    "Cape Town transport company offering scholar transport, charters, corporate and staff transport, airport transfers, event transport, tours and shuttles across the Western Cape.",
  url: `${biz.url}/`,
  logo: `${biz.url}/assets/img/logo.jpg`,
  image: [`${biz.url}/assets/img/fleet-hero-1170.jpg`, `${biz.url}/assets/img/og-image.jpg`],
  email: biz.email,
  telephone: biz.phones[0].e164,
  address: {
    "@type": "PostalAddress",
    addressLocality: biz.locality,
    addressRegion: biz.region,
    addressCountry: biz.country,
  },
  areaServed: [
    { "@type": "City", name: "Cape Town" },
    { "@type": "AdministrativeArea", name: "Western Cape" },
  ],
  contactPoint: [
    { "@type": "ContactPoint", telephone: biz.phones[0].e164, contactType: "customer service", areaServed: "ZA", availableLanguage: ["English"] },
    { "@type": "ContactPoint", telephone: biz.phones[1].e164, contactType: "customer service", areaServed: "ZA" },
    { "@type": "ContactPoint", telephone: `+${biz.whatsapp.wa}`, contactType: "reservations", description: "WhatsApp" },
  ],
  sameAs: [],
};

function layout(page, content) {
  const canonical = page.file === "index.html" ? `${biz.url}/` : `${biz.url}/${page.file}`;
  const title = page.file === "index.html" ? page.title : `${page.title} | ${biz.name}`;
  const navItems = nav
    .map(([href, label]) =>
      `<li><a href="${href === "index.html" ? "./" : href}"${href === page.file ? ' aria-current="page"' : ""}>${label}</a></li>`)
    .join("");
  const phoneLinks = biz.phones
    .map((p) => `<a href="tel:${p.e164}">${icon("phone")}${p.label}</a>`)
    .join("\n          ");

  return `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${page.description}">
<link rel="canonical" href="${canonical}">
${page.noindex ? '<meta name="robots" content="noindex">\n<base href="/">\n' : ""}
<meta name="theme-color" content="#0b0b0c">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${biz.name}">
<meta property="og:locale" content="en_ZA">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${biz.url}/assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Sibaca Journeys logo — People, Places, Possibilities">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap">
<link rel="stylesheet" href="assets/css/site.css">
${page.preload || ""}<script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <div class="header-bar">
      <a class="brand" href="./" aria-label="${biz.name} — home">
        <span class="brand-mark"><img src="assets/img/brand-mark.webp" width="44" height="44" alt=""></span>
        <span class="brand-text"><span class="brand-name">SIBACA</span><span class="brand-sub">JOURNEYS</span></span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">
        ${icon("menu", "icon icon-open")}${icon("close", "icon icon-close")}
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul>${navItems}</ul>
        <div class="nav-cta"><a class="btn btn-gold" href="contact.html#quote">Request a quote</a></div>
      </nav>
    </div>
  </div>
</header>

<main id="main">
${content.trim()}
</main>

<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="./">
          <span class="brand-mark"><img src="assets/img/brand-mark.webp" width="44" height="44" alt="" loading="lazy"></span>
          <span class="brand-text"><span class="brand-name">SIBACA</span><span class="brand-sub">JOURNEYS</span></span>
        </a>
        <p class="footer-tagline">${biz.tagline}</p>
        <p class="footer-script">${biz.motto}.</p>
        <p>Safe, reliable passenger transport for schools, businesses, tourists and communities across Cape Town and the Western Cape.</p>
      </div>
      <div>
        <h2>Explore</h2>
        <ul>
          ${nav.map(([href, label]) => `<li><a href="${href === "index.html" ? "./" : href}">${label}</a></li>`).join("\n          ")}
        </ul>
      </div>
      <div>
        <h2>Services</h2>
        <ul>
          <li><a href="services.html#scholar">Scholar transport</a></li>
          <li><a href="services.html#charter">Charter services</a></li>
          <li><a href="corporate.html">Corporate transport</a></li>
          <li><a href="services.html#airport">Airport transfers</a></li>
          <li><a href="services.html#events">Events &amp; functions</a></li>
          <li><a href="tours.html">Tours &amp; day trips</a></li>
          <li><a href="services.html#long-distance">Long-distance travel</a></li>
        </ul>
      </div>
      <div>
        <h2>Contact</h2>
        <address class="nap">
          <strong style="color:#fff">${biz.name}</strong>
          <span style="display:inline-flex;gap:10px;align-items:center">${icon("pin")}${biz.locality}, ${biz.region}, ${biz.countryName}</span>
          ${phoneLinks}
          <a href="${waLink()}" rel="noopener">${icon("whatsapp")}WhatsApp: ${biz.whatsapp.label}</a>
          <a href="mailto:${biz.email}">${icon("mail")}${biz.email}</a>
        </address>
      </div>
    </div>
    <div class="footer-base">
      <span>&copy; <span data-year>2026</span> ${biz.name}. All rights reserved.</span>
      <span>Safe transport. Stronger futures.</span>
    </div>
  </div>
</footer>

<a class="wa-float" href="${waLink("Hi Sibaca Journeys, I'd like to ask about transport.")}" rel="noopener" aria-label="Chat with us on WhatsApp">${icon("whatsapp")}<span>WhatsApp us</span></a>
<script src="assets/js/site.js" defer></script>
</body>
</html>
`;
}

// Pages are HTML fragments with a JSON header comment: <!--page {...} -->
// Fragments may use {{icon:name}}, {{wa:message}}, {{email}}, {{phone1}}, {{phone2}}, {{whatsapp}}.
function expand(html) {
  return html
    .replace(/\{\{icon:([a-z-]+)\}\}/g, (_, n) => icon(n))
    .replace(/\{\{wa:([^}]*)\}\}/g, (_, msg) => waLink(msg.trim()))
    .replace(/\{\{email\}\}/g, biz.email)
    .replace(/\{\{phone1\}\}/g, biz.phones[0].label)
    .replace(/\{\{phone1tel\}\}/g, biz.phones[0].e164)
    .replace(/\{\{phone2\}\}/g, biz.phones[1].label)
    .replace(/\{\{phone2tel\}\}/g, biz.phones[1].e164)
    .replace(/\{\{whatsapp\}\}/g, biz.whatsapp.label)
    .replace(/\{\{whatsappNumber\}\}/g, biz.whatsapp.wa);
}

const built = [];
for (const file of readdirSync(pagesDir).filter((f) => f.endsWith(".html")).sort()) {
  const src = readFileSync(join(pagesDir, file), "utf8");
  const m = src.match(/^<!--page\s+([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file}: missing <!--page {...} --> header`);
  const page = { file, ...JSON.parse(m[1]) };
  const html = layout(page, expand(src.slice(m[0].length)));
  const leftover = html.match(/\{\{[^}]*\}\}/);
  if (leftover) throw new Error(`${file}: unexpanded placeholder ${leftover[0]}`);
  writeFileSync(join(outDir, file), html);
  if (!page.noindex) built.push(file);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(outDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${built
  .map((f) => `  <url><loc>${biz.url}/${f === "index.html" ? "" : f}</loc><lastmod>${today}</lastmod></url>`)
  .join("\n")}
</urlset>
`,
);
console.log(`Built ${built.length} pages → public/`);
