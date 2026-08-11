# Shawn Hassen — Resume Site

An interactive, single-page resume site. Dark, edgy, motion-forward — built with
static HTML, CSS, and vanilla JS. No build step, no framework.

This repo (`shassen/resume`) is the GitHub Pages source for the site.

## Files

- `index.html` — page structure and content
- `styles.css` — all styling (design tokens live at the top as CSS variables)
- `main.js` — scroll reveals, active-nav tracking, timeline draw-on-scroll,
  magnetic buttons, hero/cursor glow effects
- `shawn-hassen-resume-aug-2026.pdf` — the downloadable print resume

All motion effects respect `prefers-reduced-motion` and are disabled on
touch/coarse-pointer devices where they don't make sense (magnetic buttons,
cursor glow, mouse-reactive hero glow).

## Open locally

No build step required. Either:

```bash
open index.html
```

or serve it with any static server (recommended, since some browsers restrict
`fetch`/module behavior on `file://`):

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000` (or whatever port your server picks).

## Updating content

- **Experience bullets:** edit the `<ul class="timeline-list">` blocks in
  `index.html`. The Zoom and Solvvy entries currently have a single
  `<li class="placeholder">` — replace it with real `<li>` bullets (matching
  the WalkMe entries) once those achievements are written up. No CSS/layout
  changes needed.
- **Skills:** add/remove `<li class="chip">` items in the `#chip-grid` list.
- **Resume PDF:** replace `shawn-hassen-resume-aug-2026.pdf` with a newer
  export and update the two `href` references in `index.html` (hero CTA and
  nav "Résumé" link) if the filename changes.

## Deploy to GitHub Pages

This repo is already `github.com/shassen/resume`, so deploying just means
turning Pages on:

1. Push `main` to `origin` (`git push`).
2. In the repo on GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`.
4. Save. GitHub will publish at `https://shassen.github.io/resume/`.

All paths in this site are relative, so it works unmodified at that subpath.
