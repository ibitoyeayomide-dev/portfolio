// Builds index.html and /projects/<slug>/index.html from data/projects.json.
// To add a project: add an object to data/projects.json (same fields as the others),
// put its images in assets/work/, then run:  node tools/build.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://ayomide-ibitoye.vercel.app";
const YEAR = 2026;
const projects = JSON.parse(fs.readFileSync(path.join(ROOT, "data/projects.json"), "utf8"));
const events = JSON.parse(fs.readFileSync(path.join(ROOT, "data/events.json"), "utf8")).events;

const EMAIL = "ibitoyeayomide087@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/ayomide-ibitoye-b1a594445";
const X = "https://x.com/_edimoya";
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pad = n => String(n).padStart(2, "0");
const arrow = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
const ext = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>`;
const tick = `<svg viewBox="0 0 12 12" fill="none" stroke="#F4F1EA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2 5 8.5l4.5-5"/></svg>`;
const approachLabel = a => ({ Rules: "Deterministic", Deterministic: "Deterministic", AI: "AI", Hybrid: "Hybrid" }[a] || a);

const head = ({ title, desc, url, og, type = "website" }) => `<!doctype html>
<html lang="en-NG">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#F4F1EA">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Ayomide Ibitoye">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:creator" content="@_Edimoya">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}${og}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/bricolage-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<script>document.documentElement.classList.add("js")</script>
`;

const nav = (home) => `<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="wrap">
    <a class="brand" href="${home ? "#top" : "/"}"><i aria-hidden="true"></i>Ayomide Ibitoye</a>
    <nav aria-label="Main">
      <ul>
        <li><a href="/#work">Projects</a></li>
        <li class="opt"><a href="/#events">Events</a></li>
        <li class="opt"><a href="/#about">About</a></li>
      </ul>
    </nav>
    <div class="nav-end">
      <a class="btn btn--ink" href="mailto:${EMAIL}">Email me</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Menu">
        <span class="nav-toggle-bars" aria-hidden="true"><span></span></span>
      </button>
    </div>
  </div>
  <div class="nav-panel" id="nav-menu" aria-hidden="true" inert>
    <nav aria-label="Sections">
      <ul>
        <li><a href="/#top">Home</a></li>
        <li><a href="/#work">Projects</a></li>
        <li><a href="/#events">Events</a></li>
        <li><a href="/#about">About</a></li>
        <li><a href="/#faq">FAQ</a></li>
      </ul>
    </nav>
  </div>
</header>`;

const contact = `<section class="contact sec" id="contact" aria-labelledby="contact-title">
  <div class="wrap">
    <div data-reveal>
      <h2 id="contact-title">Got work your team does by hand every week?</h2>
      <p>Tell me what it is and how it runs today. I'll tell you honestly whether it should be automated, and how.</p>
    </div>
    <ul class="links" data-reveal style="--d:.1s">
      <li><a href="mailto:${EMAIL}"><span>Email<small>${EMAIL}</small></span>${ext}</a></li>
      <li><a href="${LINKEDIN}" rel="noopener" target="_blank"><span>LinkedIn<small>Ayomide Ibitoye</small></span>${ext}</a></li>
      <li><a href="${X}" rel="noopener" target="_blank"><span>X<small>@_Edimoya</small></span>${ext}</a></li>
      <li><a href="/cv.pdf" download="Ibitoye_Ayomide_Paul_CV.pdf"><span>Download CV<small>PDF, 56 KB</small></span>${ext}</a></li>
    </ul>
  </div>
</section>`;

const footer = `<footer class="foot dark">
  <div class="wrap">
    <strong>Ibitoye Ayomide Paul</strong>
    <a href="mailto:${EMAIL}">${EMAIL}</a>
    <a href="${LINKEDIN}" rel="noopener" target="_blank">LinkedIn</a>
    <a href="${X}" rel="noopener" target="_blank">X</a>
    <span>&copy; ${YEAR}</span>
  </div>
</footer>
<script src="/assets/site.js" defer></script>
</body>
</html>
`;

const placeholder = (caption) => `<div class="slot" role="img" aria-label="${esc(caption)}">
  <div><div class="screens" aria-hidden="true"><b></b><b></b></div><p>${esc(caption)}</p></div>
</div>`;

const cardMedia = (p) => {
  const m = p.thumb ? { type: "image", ...p.thumb } : p.media[0];
  if (!m) return "";
  if (m.type === "placeholder") return `<div class="media">${placeholder(m.caption)}</div>`;
  const src = m.type === "video" ? m.poster : m.src;
  const alt = m.type === "video" ? `Still from the ${p.title} walkthrough video` : m.alt;
 return `<div class="media${m.fit ? " media--" + m.fit : ""}"><img src="${src}" alt="${esc(alt)}" width="${m.w}" height="${m.h}" loading="lazy" decoding="async"></div>`;
};

const card = (p, i) => `<article class="card${p.flagship ? " card--flag" : ""}" id="${p.slug}" data-reveal${i ? ` style="--d:${(i % 2) * 0.08}s"` : ""}>
  ${p.flagship ? "" : cardMedia(p)}
  <div class="body">
    <div class="tags"><span class="num">${pad(i + 1)}</span><span class="tag tag--live">${esc(p.status)}</span><span class="tag">${esc(approachLabel(p.approach))}</span>${p.flagship ? `<span class="flag-label">Flagship</span>` : ""}</div>
    <h3><a href="/projects/${p.slug}">${esc(p.title)}</a></h3>
    <p class="hook hook--home">${esc(p.homeLine || p.hook)}</p>
    <span class="more" aria-hidden="true"><span>Read the full story</span>${arrow}</span>
  </div>
  ${p.flagship ? cardMedia(p) : ""}
</article>`;

const bySlug = Object.fromEntries(projects.map(p => [p.slug, p]));
const link = (slug, text) => bySlug[slug] ? `<a href="/projects/${slug}">${text}</a>` : text;

// ---------- events ----------
const eventsHtml = events.filter(e => !(e.hideIfEmpty && !e.photos.length)).map(e => {
  const photos = e.photos.slice(0, e.maxPhotos || e.photos.length).filter(ph => ph.src);
  const note = e.note ? `<p>${esc(e.note).replace("the certificate system", e.link ? link(e.link, "the certificate system") : "the certificate system")}</p>` : "";
  return `<li class="ev-item${photos.length ? "" : " ev-item--text"}" data-reveal>
        <div class="ev-meta"><time datetime="${e.datetime}">${esc(e.when)}</time>${e.place ? `<span>${esc(e.place)}</span>` : ""}</div>
        <div class="ev-body"><h3>${esc(e.name)}</h3>${note}${photos.length ? `<div class="ev-photos">${photos.map(ph => `<figure style="--ar:${(ph.w/ph.h).toFixed(3)}"><img src="${ph.src}" width="${ph.w}" height="${ph.h}" alt="${esc(ph.alt)}" loading="lazy" decoding="async">${ph.caption ? `<figcaption>${esc(ph.caption)}</figcaption>` : ""}</figure>`).join("")}</div>${e.groupCaption ? `<p class="ev-cap">${esc(e.groupCaption)}</p>` : ""}` : ""}</div>
      </li>`;
}).join("\n      ");

const faqs = JSON.parse(fs.readFileSync(path.join(ROOT, "data/faq.json"), "utf8"));
const faqLd = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) })}</script>`;
// ---------- home ----------
const home = head({
  title: "Ayomide Ibitoye | AI automation engineer",
  desc: "Repetitive work is a bug. Ibitoye Ayomide Paul automates the fix: AI agents, automated workflows and an office AI operating system, plus a certificate system used for over 400 participants.",
  url: `${SITE}/`,
  og: "/assets/og.jpg",
}) + `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Person", name: "Ibitoye Ayomide Paul", alternateName: "Ayomide Ibitoye", jobTitle: "AI Automation and Cloud Engineer", email: `mailto:${EMAIL}`, url: `${SITE}/`, sameAs: [LINKEDIN, X], alumniOf: "Clifford University" })}</script>
${faqLd}
</head>
<body id="top">
${nav(true)}
<main id="main">
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap">
    <div>
      <p class="eyebrow fade" style="--d:.05s">AI automation engineer</p>
      <h1 id="hero-title"><span class="ln"><span style="--i:0">Repetitive work</span></span> <span class="ln"><span style="--i:1">is a bug.</span></span> <span class="ln"><span style="--i:2"><span class="mark">I automate the fix.</span></span></span></h1>
      <p class="lede fade" style="--d:.55s">I build AI agents, automated workflows and AI operating systems that cut manual work and speed up operations. Computer Science graduate skilled in workflow automation, AI integration, cloud deployment and IT support, helping businesses in Africa and beyond run on AI and cloud.</p>
      <div class="actions fade" style="--d:.65s">
        <a class="btn btn--ink" href="#work">See projects I&rsquo;m proud of ${arrow}</a>
        <a class="btn btn--ghost" href="mailto:${EMAIL}">Email me</a>
      </div>
    </div>
    <div class="portrait">
      <div class="plate par" data-speed="0.04"></div>
      <div class="disc par" data-speed="0.09" aria-hidden="true"></div>
      <div class="cut par" data-speed="0.02">
        <picture>
          <source media="(max-width:720px)" srcset="/assets/hero-cutout-m.webp" width="520" height="641">
          <img src="/assets/hero-cutout.webp" width="820" height="1010" alt="Ayomide Ibitoye in a navy suit, arms folded" fetchpriority="high">
        </picture>
      </div>
      <div class="chip par" data-speed="-0.06">
        <header><span>Office AI OS</span></header>
        <ol>
          <li class="done"><i>${tick}</i>Morning briefing sent</li>
          <li class="done"><i>${tick}</i>Inbox sorted into 8 labels</li>
          <li class="done ok"><i>${tick}</i><span>Minutes filed to Drive<span class="who">Logged, with who did what</span></span></li>
        </ol>
      </div>
    </div>
  </div>
</section>

<section class="sec" id="work" aria-labelledby="work-title" style="padding-top:clamp(40px,6vw,80px)">
  <div class="wrap">
    <div class="sec-head" data-reveal>
      <h2 id="work-title">Projects that I'm proud&nbsp;of.</h2>
    </div>
    <div class="cards">
      ${projects.map(card).join("\n      ")}
    </div>
  </div>
</section>

<section class="sec dark approach" aria-labelledby="how-title">
  <div class="wrap">
    <div class="sec-head" data-reveal>
      <h2 id="how-title">Rules where rules work. AI where it pays.</h2>
      <p>Before I build, I decide which kind of system the job needs. Most office work does not need a model.</p>
    </div>
    <div class="trio">
      <article data-reveal><h3><i aria-hidden="true"></i>Deterministic</h3><p>Rules only. Same input, same output, every time. Cheapest to run and easiest to trust.</p><p class="used">Used in the ${link("certificate-system", "certificate system")} and the ${link("hangout-registration", "event registration system")}.</p></article>
      <article data-reveal style="--d:.08s"><h3><i aria-hidden="true"></i>AI</h3><p>The model makes the call. For the messy work rules can't read: unstructured email, research, first drafts.</p><p class="used">Used inside the ${link("ai-os", "office OS")} to sort email and draft replies.</p></article>
      <article data-reveal style="--d:.16s"><h3><i aria-hidden="true"></i>Hybrid</h3><p>Rules carry the pipeline, AI handles the judgment calls, and a person approves what matters.</p><p class="used">How the ${link("ai-os", "office AI operating system")} runs.</p></article>
    </div>
  </div>
</section>

<section class="sec events" id="events" aria-labelledby="events-title">
  <div class="wrap">
    <div class="sec-head" data-reveal>
      <h2 id="events-title">Events and conferences</h2>
      <p>Conferences and summits from the past year.</p>
    </div>
    <ol class="ev">
      ${eventsHtml}
    </ol>
  </div>
</section>

<section class="sec about" id="about" aria-labelledby="about-title" style="padding-top:0">
  <div class="wrap">
    <figure data-reveal><img src="/assets/about.webp" width="720" height="820" alt="Portrait of Ayomide Ibitoye" loading="lazy" decoding="async"></figure>
    <div class="copy" data-reveal style="--d:.08s">
      <h2 id="about-title">About me</h2>
      <p>I'm Ibitoye Ayomide Paul. I studied Computer Science at Clifford University, and I work as IT and administrative assistant at RIIC, a university Office of Research, Innovation and International Collaboration, where I'm finishing my national service year (NYSC). Most of the work on this page was built there.</p>
      <p>Before that I kept 20+ computers and the network running at Osogbo Window on America. Now I build AI agents, workflows and AI operating systems, and I want to help businesses in Africa and beyond run their operations with AI and cloud tools.</p>
      <dl class="facts">
        <div><dt>Education</dt><dd>B.Sc. (Hons) Computer Science, Second Class Upper, Clifford University, 2024</dd></div>
        <div><dt>Open to</dt><dd>AI automation roles, contract work and projects</dd></div>
        <div><dt>Leadership</dt><dd>President, Digital Innovation Technology group (about 50 members), 2026</dd></div>
        <div><dt>Before</dt><dd>IT support, Osogbo Window on America, 2022 to 2024</dd></div>
        <div style="grid-column:1/-1"><dt>Tools I use</dt><dd class="chips"><span>Nod</span><span>n8n</span><span>Google Apps Script</span><span>Airtable</span><span>Google Workspace</span><span>OpenRouter</span><span>DeepSeek</span><span>Ollama</span><span>Docker</span><span>Cloudflare Tunnel</span><span>Vercel</span><span>JavaScript</span></dd></div>
      </dl>
    </div>
  </div>
</section>
<section class="sec faq" id="faq" aria-labelledby="faq-title" style="padding-top:0">
  <div class="wrap">
    <h2 id="faq-title" data-reveal>Questions people ask</h2>
    <div class="faq-list" data-reveal>
      ${faqs.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("\n      ")}
    </div>
  </div>
</section>
</main>
${contact}
${footer}`;
fs.writeFileSync(path.join(ROOT, "index.html"), home);

// ---------- project pages ----------
const mediaFig = (m, p, lead) => {
  if (m.type === "placeholder") return `<div class="lead-media ph">${placeholder(m.caption)}</div>`;
  if (m.type === "video") return `<figure style="margin:0"><div class="lead-media"><video controls muted playsinline preload="none" poster="${m.poster}" width="${m.w}" height="${m.h}" aria-label="${esc(p.title)} walkthrough"><source src="${m.src}" type="video/mp4"></video></div><figcaption>${esc(m.caption)}</figcaption></figure>`;
  const img = `<img src="${m.src}" alt="${esc(m.alt)}" width="${m.w}" height="${m.h}" ${lead ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
  if (lead) return `<figure style="margin:0"><div class="lead-media" style="background:var(--paper)">${img}</div><figcaption>${esc(m.caption)}</figcaption></figure>`;
  const cls = m.cls || (m.tall ? "tall" : (m.w / m.h > 2.2 ? "wide" : ""));
  return `<figure${cls ? ` class="${cls}"` : ""} data-reveal><div class="frame">${img}</div><figcaption>${esc(m.caption)}</figcaption></figure>`;
};

projects.forEach((p, i) => {
  const next = projects[(i + 1) % projects.length];
  const url = `${SITE}/projects/${p.slug}`;
  const [lead, ...rest] = p.media.map(m => ({ ...m }));
  const halves = rest.filter(m => !(m.w / m.h > 2.2));
  if (halves.length % 2 === 1) halves[halves.length - 1].cls = "solo";
  const section = (id, label, title, paras, cls = "") => `<div class="part${cls}" id="${id}" data-reveal><h2><span>${label}</span>${title}</h2>${paras.map(t => `<p>${esc(t)}</p>`).join("")}</div>`;
  const html = head({ title: `${p.title} | Ayomide Ibitoye`, desc: p.metaDescription, url, og: `/assets/og-${p.slug}.jpg`, type: "article" }) + `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: p.metaDescription, url, author: { "@type": "Person", name: "Ibitoye Ayomide Paul", url: `${SITE}/` } })}</script>
</head>
<body>
${nav(false)}
<main id="main">
<article>
<header class="p-hero">
  <div class="wrap">
    <p class="crumb"><a href="/#work">Projects</a><span aria-hidden="true">/</span><span>${pad(i + 1)} of ${pad(projects.length)}</span></p>
    <h1>${esc(p.title)}</h1>
    <p class="hook">${esc(p.hook)}</p>
    <dl class="meta">
      <div><dt>Status</dt><dd>${esc(p.status)}</dd></div>
      <div><dt>For</dt><dd>${esc(p.client)}</dd></div>
      <div><dt>Approach</dt><dd>${esc(approachLabel(p.approach))}</dd></div>
      <div class="stack"><dt>Stack</dt><dd>${p.stack.map(esc).join(", ")}</dd></div>
    </dl>
  </div>
</header>
<div class="wrap">
  ${lead ? mediaFig(lead, p, true) : ""}
  <ul class="hl" aria-label="At a glance">${p.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>
  <div class="story">
    <nav class="rail" aria-label="Sections"><ol><span class="bar" aria-hidden="true"></span><li><a href="#challenge">Challenge</a></li><li><a href="#actions">Actions</a></li><li><a href="#results">Results</a></li></ol></nav>
    <div>
      ${section("challenge", "Challenge", "The problem", p.challenge)}
      ${section("actions", "Actions", "What I built", p.actions)}
      ${section("results", "Results", "Where it stands", p.results, " res")}
    </div>
  </div>
  ${rest.length ? `<div class="gallery">${rest.map(m => mediaFig(m, p, false)).join("")}</div>` : ""}
  ${p.notes.length ? `<div class="notes-wrap" data-reveal><h2>Build notes on X</h2><div class="notes">${p.notes.map(n => `<a href="${n.href}" rel="noopener" target="_blank">${esc(n.label)}${ext.replace('aria-hidden="true"', 'aria-hidden="true" width="14" height="14"')}</a>`).join("")}</div></div>` : ""}
  <a class="next" href="/projects/${next.slug}"><span>Next project</span><strong><em>${esc(next.title)}</em>${arrow}</strong></a>
</div>
</article>
</main>
${contact}
${footer}`;
  const dir = path.join(ROOT, "projects", p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
});

// sitemap
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc></url>
${projects.map(p => `  <url><loc>${SITE}/projects/${p.slug}</loc></url>`).join("\n")}
</urlset>
`);
console.log(`built index.html + ${projects.length} project pages`);
