# Carla Jen Sayson — Portfolio Website

A bold, editorial single-page portfolio for **Carla Jen Sayson**, IT Student at Cebu Eastern College.

## Stack
- **HTML5** · Semantic, accessible markup
- **Vanilla CSS** · Custom properties, CSS Grid/Flexbox, animations
- **Vanilla JavaScript** · No frameworks, no build step

## File Structure

```
jen/
├── index.html              ← Main page
├── css/
│   └── style.css           ← All styles (design system, animations, responsive)
├── js/
│   └── main.js             ← Navbar, scroll reveal, parallax, GitHub API, form
├── assets/
│   ├── images/
│   │   ├── portrait.png    ← Hero portrait (transparent PNG — place yours here)
│   │   ├── ojt-system.jpg  ← OJT project screenshot
│   │   └── time-chronicles.jpg ← Game project screenshot
│   └── resume.pdf          ← Downloadable résumé PDF
└── README.md
```

## Quick Start (Local)

No build tools required — just open the file:

```bash
# Option 1 — Direct browser open
# Double-click index.html  OR  drag into your browser

# Option 2 — Live reload with VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Option 3 — Python simple server
python -m http.server 5500
# then open http://localhost:5500
```

## Adding Your Images

Place the following images in `assets/images/`:

| File | Description |
|------|-------------|
| `portrait.png` | Hero cut-out portrait (transparent background PNG recommended) |
| `ojt-system.jpg` | Screenshot of the OJT Digital Record System |
| `time-chronicles.jpg` | Screenshot of Time Chronicles: Tower Defense |

> **Tip:** Convert images to WebP for ~30% smaller file sizes:
> ```bash
> # Using cwebp (Google's WebP encoder)
> cwebp portrait.png -o portrait.webp -q 85
> ```
> Then update the `src` in `index.html` to `.webp`.

## Deployment

### GitHub Pages (Free)

1. Push to a GitHub repository named `carlajen-portfolio` (or any name).
2. Go to **Settings → Pages → Source → Deploy from branch `main` / `/(root)`**.
3. Wait ~60 seconds — your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Netlify (Drag & Drop — Fastest)

1. Go to [netlify.com](https://netlify.com) and log in.
2. Drag the entire `jen/` folder onto the Netlify drop zone.
3. Done! You get a free `*.netlify.app` URL instantly.
4. *(Optional)* Connect to GitHub for continuous deployment on push.

### Vercel

```bash
npm install -g vercel
vercel --prod
```

## Customisation

| What | Where |
|------|-------|
| Color palette | `:root` block at the top of `css/style.css` |
| Hero name / tagline | `index.html` → `<section class="hero">` |
| Social links | `index.html` → `<aside class="hero__socials">` and `<ul class="contact__link-list">` |
| GitHub username | `js/main.js` → `const GITHUB_USERNAME` |
| Form submission | `js/main.js` → replace `setTimeout` in the submit handler with Formspree/EmailJS |
| Resume PDF | Replace `assets/resume.pdf` with your actual résumé |

## Accessibility

- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`, `<aside>`)
- All interactive elements have `aria-label` or visible label
- `aria-expanded` on hamburger button, `aria-hidden` on decorative elements
- `role="alert"` on form error messages, `aria-live="polite"` on dynamic regions
- WCAG AA contrast: cream `#F5E08E` on maroon `#3D080C` ≈ **8.5:1** ratio
- Focus rings visible on keyboard navigation

## Performance Tips

- Use WebP images (see above)
- Defer non-critical fonts with `font-display: swap` (already set via Google Fonts URL)
- Host on a CDN (Netlify / Vercel handle this automatically)
- Aim for Lighthouse score > 90 (this site has no JS frameworks or blocking resources)

---

Made with ♥ for Carla Jen Sayson · IT Student · Cebu Eastern College 2024
