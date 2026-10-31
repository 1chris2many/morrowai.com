# Useful AI Werks

AI news, developing stories and perspectives from Morrow AI Consulting LLC.
The GitHub repository retains its original name, `morrowai.com`.

## Deployment

The live site is **https://usefulaiwerks.com/**. GitHub Pages publishes the root
of `main`, with `usefulaiwerks.com` configured as the custom domain and HTTPS
enforced. `CNAME` and the public canonical URLs use that domain.

The contact section links to **hello@usefulaiwerks.com** through `mailto:`.
It opens the visitor's email app; the site has no submission form or delivery
confirmation. Changing contact delivery requires an implemented, verified path.

Persephone owns site content. Codex supports technical integration, narration
and release verification. News revisions retain their source and exact-copy
review checks. The existing Rig publisher integrates reviewed content, builds
the static files and pushes through the governed release path. A successful
push must be followed by Pages deployment and live-content verification.

The static build uses `news.json` and the modules under `scripts/`. Run
`npm run build` to rebuild the digest, briefings and feed. Narration is bound to
the reviewed text and must be regenerated when that text changes; ordinary
builds use the existing audio cache.

## Regression checks

Requires Node.js and Google Chrome (or another installed Playwright browser
channel selected with `BROWSER_CHANNEL`).

```sh
npm ci
npm test
SITE_URL=https://usefulaiwerks.com/ npm test
```

Tests use an isolated browser profile, check desktop/mobile navigation, local
links and assets, contact honesty, canonical URLs, and JavaScript-disabled
content. Screenshots are saved under ignored `test-results/`.
