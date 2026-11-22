// Renders data/projects.json into index.html between the PROJECTS markers.
// Usage (from the site root): node tools/render-projects.mjs
// No dependencies. Not part of the deployed site's runtime.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(join(root, "data/projects.json"), "utf8"));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tagClass = { Deterministic: "det", AI: "ai", Hybrid: "hyb" };

const hub = (h) => {
  const n = h.jobs.length;
  const pts = h.jobs.map((j, i) => { const t = -Math.PI / 2 + (i * 2 * Math.PI) / n; return { j, x: +(50 + 38 * Math.cos(t)).toFixed(2), y: +(50 + 38 * Math.sin(t)).toFixed(2) }; });
  return `<figure class="hub" aria-label="${esc(h.centre)} connected to: ${esc(h.jobs.join(", "))}">
      <svg class="hub__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${pts.map((p, i) => `<line x1="50" y1="50" x2="${p.x}" y2="${p.y}" style="--i:${i}"/>`).join("")}</svg>
      <span class="hub__core" aria-hidden="true">${esc(h.centre)}</span>
      <ul class="hub__jobs" aria-hidden="true">${pts.map((p, i) => `<li style="left:${p.x}%;top:${p.y}%;--i:${i}">${esc(p.j)}</li>`).join("")}</ul>
    </figure>`;
};

const card = (p, i) => `
<article class="case${p.featured ? " case--lead" : ""}" id="${esc(p.id)}" data-case>
  <div class="case__manual">
    <div class="case__cover" aria-hidden="true"></div>
    <div class="case__sticky">
      <p class="case__context">${p.featured ? '<span class="flag">Flagship</span>' : ""}${esc(p.context)}</p>
      <h3 class="case__title">${esc(p.title)}</h3>
      <div class="case__body">
        <p class="label">The problem</p>
        <p class="case__problem">${esc(p.problem)}</p>
        <p class="case__handed" aria-hidden="true"><span><i class="case__ring"></i>Handed over.</span> ${esc(p.handover)}</p>
      </div>
      <div class="grip-wrap">
        <span class="grip-hint" aria-hidden="true">Drag to hand it over</span>
        <input class="grip" type="range" min="0" max="100" value="100" aria-label="Hand ${esc(p.title)} over to the system">
        <button class="handit" type="button" aria-pressed="false" aria-label="Hand ${esc(p.title)} over to the system"><span>Hand it over</span></button>
      </div>
    </div>
  </div>
  <div class="case__auto">
    <p class="case__meta"><span class="tag tag--${tagClass[p.tag] || "det"}">${esc(p.tag)}</span><span class="status">${esc(p.status)}</span><span class="status-note">${esc(p.statusNote)}</span></p>
    <p class="label label--auto">What I built</p>
    <ul class="case__built">${p.built.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
    ${p.steps ? `<ol class="case__steps" aria-label="How it runs">${p.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}
    <p class="label label--auto">Result</p>
    <p class="case__result">${esc(p.result)}</p>
    <ul class="case__stack" aria-label="Stack">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    ${p.hub ? hub(p.hub) : ""}
    ${(p.media || []).map((m, j) => `<figure class="case__media${j ? " case__media--second" : ""}"><img src="${esc(m.src)}" width="${m.w}" height="${m.h}" alt="${esc(m.alt)}" loading="lazy" decoding="async"></figure>`).join("")}
  </div>
</article>`;

const html = readFileSync(join(root, "index.html"), "utf8");
const start = "<!-- PROJECTS:START (generated from data/projects.json, do not edit by hand) -->";
const end = "<!-- PROJECTS:END -->";
const a = html.indexOf(start), b = html.indexOf(end);
if (a < 0 || b < 0) throw new Error("Project markers not found in index.html");
const out = html.slice(0, a + start.length) + data.projects.map(card).join("\n") + "\n" + html.slice(b);
writeFileSync(join(root, "index.html"), out);
console.log(`Rendered ${data.projects.length} projects.`);
