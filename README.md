# donutzzz

Fallin from the sky — a spinning glazed donut with purple icing and sprinkles.

This repo ships **two** versions of the same sketch:

| Path | Runtime | Use |
| --- | --- | --- |
| [`processing/donutzzz/`](processing/donutzzz/) | [Processing 4](https://processing.org/download) (desktop Java) | Open in the Processing IDE and hit Run |
| [`index.html`](index.html) + [`js/`](js/) | [p5.js](https://p5js.org/) in the browser | GitHub Pages / local static server |

## What “second tab” means

In the Processing IDE, every `.pde` file inside a sketch folder shows up as a **tab** along the top of the editor. They compile together as one program.

For this project:

- Tab 1 — [`donutzzz.pde`](processing/donutzzz/donutzzz.pde): `settings` / `setup` / `draw`, lighting, camera
- Tab 2 — [`Donut.pde`](processing/donutzzz/Donut.pde): the `Donut` (and `Sprinkle`) classes

The folder name must match the main tab: `processing/donutzzz/`.

## Run locally

### Processing 4 (desktop)

1. Install [Processing 4](https://processing.org/download).
2. File → Open → select `processing/donutzzz/donutzzz.pde`.
3. Run. (`size()` lives in `settings()`; the sketch uses `fullScreen(P3D)`.)

### p5.js (browser)

From the repo root:

```bash
python3 -m http.server 8080
```

Open http://localhost:8080

Works in current **Chrome**, Firefox, Safari, and Edge (WebGL required). The page loads p5.js from multiple CDNs and uses WebGL settings that also work when Chrome falls back to software rendering.

If you ever see a blank page in Chrome, enable **Settings → System → Use hardware acceleration when available**, then relaunch Chrome.
## GitHub Pages

Pages is served from the **root of `master`** (the `index.html` in this repo).

1. On GitHub: **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Branch: `master` / folder: `/ (root)` → Save.
4. Wait a minute, then check `https://mm6281726.github.io/donutzzz/`.

### Point `itsmischaelsown.com` at this site

A [`CNAME`](CNAME) file is already in the repo (`itsmischaelsown.com`).

1. In GitHub **Settings → Pages → Custom domain**, enter `itsmischaelsown.com` and save. Enable **Enforce HTTPS** once the certificate is ready.
2. At your DNS provider for `itsmischaelsown.com`, add records that GitHub shows (typically):

   | Type | Name | Value |
   | --- | --- | --- |
   | `CNAME` | `www` | `mm6281726.github.io` |
   | `A` | `@` (apex) | `185.199.108.153` |
   | `A` | `@` | `185.199.109.153` |
   | `A` | `@` | `185.199.110.153` |
   | `A` | `@` | `185.199.111.153` |

   Or, if your DNS supports apex CNAMEs/ALIAS/ANAME, alias `@` to `mm6281726.github.io`.

3. Wait for DNS to propagate; GitHub will show the custom domain as verified when it resolves.

Official docs: [Configuring a custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Visual notes

- Dough: warm gold torus
- Icing: purple cap on the top half of the tube
- Sprinkles: short multicolor rods scattered on the icing
