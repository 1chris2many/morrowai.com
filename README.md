# morrowai.com
Morrow AI Consulting — AI product strategy from someone who builds it every day

## Deployment

The live site is https://1chris2many.github.io/morrowai.com/ . GitHub Pages
publishes the root of `main`. No custom domain is configured.

Online inquiries are temporarily disabled: the previous placeholder form never
sent messages. Before enabling contact, confirm the public business email with
the owner or configure and verify a real form delivery service. Never display a
delivery confirmation without a successful server response.

Before connecting morrowai.com, confirm ownership and DNS administrator access.
Verify the domain with GitHub, coordinate Pages configuration and DNS changes,
then check apex/www resolution, HTTPS, both articles and contact. Update the
canonical and Open Graph URLs in all three HTML pages at cutover. Do not set
`CNAME` while DNS is unavailable; this can redirect the working Pages URL to a
broken address. Follow [GitHub's custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Regression checks

Requires Node.js and Google Chrome (or another installed Playwright browser
channel selected with `BROWSER_CHANNEL`).

```sh
npm ci
npm test
SITE_URL=https://1chris2many.github.io/morrowai.com/ npm test
```

Tests use an isolated browser profile, check desktop/mobile navigation, local
links and assets, contact honesty, canonical URLs, and JavaScript-disabled
content. Screenshots are saved under ignored `test-results/`.
