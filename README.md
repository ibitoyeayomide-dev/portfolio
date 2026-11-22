# Ayomide Paul · AI automation portfolio

Personal site for Ibitoye Ayomide Paul, AI Automation Specialist (n8n, Google Apps Script, AI agents).

Plain static site. No build step, no framework, no dependencies.

## Deploy on Vercel

1. Import this repo in Vercel.
2. Framework preset: **Other**. Leave the build command and output directory empty.
3. Deploy. `index.html` sits at the repo root and is served as is.

`vercel.json` only sets clean URLs and cache headers.

After the first deploy, change the two `og:image` / `twitter:image` tags in `index.html` to the full URL (for example `https://your-domain.vercel.app/assets/og.jpg`) so link previews show the image on X and WhatsApp.

## Files

- `index.html`: the whole page (HTML, CSS and a small script).
- `assets/`: WebP images, the OG image.
- `cv.pdf`: the CV behind every "Download CV" button. Replace the file to update it.
- `favicon.svg`
- `data/projects.json`: the case studies in "Some of the projects I'm proud of".
- `tools/render-projects.mjs`: writes `data/projects.json` into `index.html`.

## Update the projects

Edit `data/projects.json`, then run:

```bash
node tools/render-projects.mjs
```

It rewrites only the block between `PROJECTS:START` and `PROJECTS:END` in `index.html`. Each project has: title, context, tag (`Deterministic`, `AI` or `Hybrid`), status, problem, what was built, stack, result, the line shown when the handle is dragged, and optional images or steps. Only put numbers in a result if a real source backs them up.

## Contact links

Email, X (https://x.com/_Edimoya) and LinkedIn (https://www.linkedin.com/in/ayomide-ibitoye-b1a594445) appear in the About section, the contact section and the footer. There are matching `rel="me"` links in the `<head>`. Search `index.html` for the URL to change any of them.
