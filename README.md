# Ayomide Ibitoye portfolio, v5

Static site. No framework, no build step needed to deploy: upload the folder to Vercel as-is.

## Add a project
1. Put its images in `assets/work/` (webp, about 1000 to 1400 px wide).
2. Add an object to `data/projects.json`, copying the fields of an existing project
   (slug, title, status, client, approach, metaDescription, hook, stack, card, challenge, actions, results, highlights, media, notes).
3. Run `node tools/build.mjs`. It rewrites `index.html`, `projects/<slug>/index.html` and `sitemap.xml`.
4. Optional: add `assets/og-<slug>.jpg` (1200x630) for link previews.

Project URLs: `/projects/<slug>` plus the home anchor `/#<slug>`.

## Add media to the AI OS card
In `data/projects.json`, replace the `placeholder` item in the `ai-os` media list with
`{ "type": "image", "src": "/assets/work/...", "w": ..., "h": ..., "alt": "...", "caption": "..." }`, then run the build.
The first media item is the card image and the lead image on the project page.
