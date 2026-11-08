# Ayelet Shakovitzky – Portfolio

Personal portfolio site (plain HTML/CSS) with a Playwright end-to-end test suite.

![E2E tests](https://github.com/ayeletBinder/ayelet-portfolio/actions/workflows/e2e.yml/badge.svg)

## Run locally

```bash
npm install
npx playwright install chromium
npm start        # site on http://localhost:4173
npm test         # Playwright tests (desktop + mobile)
npm run report   # open the HTML report
```

## Edit the content

Everything is in `site/`: `index.html` (text), `style.css` (design), `assets/` (CV PDF).
Replace `site/assets/Ayelet_Shakovitzky_CV.pdf` whenever the CV changes.

## Publish (GitHub Pages)

1. Create a GitHub repository named `ayelet-portfolio` and push this folder to the `main` branch.
2. In the repository: Settings → Pages → Source: **GitHub Actions**.
3. The `Deploy to GitHub Pages` workflow publishes the `site/` folder. The URL is
   `https://<username>.github.io/ayelet-portfolio/`.
4. The `E2E tests` workflow runs the Playwright suite on every push; the badge above shows the result.

## Tests

`tests/portfolio.spec.js` checks the title and headings, all sections, project cards, navigation,
CV download, mailto link, safe external links, no horizontal scroll, and basic accessibility.
