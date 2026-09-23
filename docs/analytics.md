# Aggregate site analytics

The public Umami website ID is `45502ceb-6612-4753-82a7-11d449338391`.
`js/analytics.js` loads the cloud tracker only on the production HTTPS hostnames
and the five current public pages. Pageviews are sent manually, once per page
load; filter changes and anchor navigation do not create additional pageviews.

The payload contains only website ID, production hostname, an allowlisted page
path, and the external referrer's origin (scheme, hostname, optional port).
Internal referrers are omitted, as are IP address literals, bare intranet
hostnames, and localhost, `.local`, `.internal`, `.lan`, `.home`, or `.ts.net`
hostnames. The same private-host exclusion applies to outbound events.
It does not include referring paths, query
strings, fragments, page titles, screen size, language, contact addresses,
free text, user IDs, or session properties. The analytics service necessarily
receives connection information when a browser contacts it; this implementation
does not make a legal claim that no personal data is processed.

| Event | Allowed properties |
| --- | --- |
| `outbound_story_click` | destination hostname; digest, perspectives, or article surface; numeric `digest_item_id` for digest cards or allowlisted `story_id` for Chris's original posts |
| `theme_filter`, `theme_navigation` | Known theme ID, `all`, or `other` |
| `author_selection` | `all`, `chris-morrow`, or `persephone` |
| `navigation_click` | Current site page or the about/contact/essays homepage anchor |
| `rss_click` | None |
| `contact_click` | None; a mail link click, **not** a lead or conversion |

The numeric digest IDs already exist in the reviewed public `news.json` feed;
the generator and dynamic cards both retain them. Chris's original post IDs
are `ai-coding-costs` and `agentic-commerce-trust`. These identifiers distinguish
stories even when their destination hostname is the same. An outbound event
measures a click, not a confirmed read. For source links within a Persephone
article, the allowlisted page path identifies the referring article.

No identification, session replay, advertising, automatic events, or performance
collection is enabled. The before-send hook rebuilds payloads from an allowlist
and blocks non-event payload types. A blocked or failed tracker cannot prevent
normal site interactions. Events before the tracker is ready are dropped.

Do Not Track, Global Privacy Control, WebDriver, and obvious automation user
agents prevent the tracker from loading. Local, preview, and unknown pages do
not load it. `?analytics=off` and each page's opt-out link save an off preference
in session storage for the current tab. No visitor identifier is stored by this
code. A blocked session-storage API fails closed. Close the tab to end the
session preference; do not use a query parameter to force tracking past a
browser privacy signal. Operator and smoke-test visits should use the opt-out.

This is the approved minimal aggregate setup: eligible visitors are counted by
default, without a consent banner. Cookieless operation alone does not establish
a legal exemption from consent. If consent is required for this deployment,
gate loading `js/analytics.js` on the applicable consent state before collecting
any analytics. No jurisdiction inference or legal-compliance claim is made here.

Tests use a fake Umami object and no telemetry transport. Run `npm test` for the
site and analytics suites. Rebuild with `npm run build`; the digest generator
retains the notice and tracker, while existing article/feed copy stays intact.
When adding a new page, author, or developing-story category, review the
allowlists in `analytics.js` (unknown theme values are grouped as `other`).

Implementation references:
- https://docs.umami.is/docs/tracker-functions
- https://docs.umami.is/docs/tracker-configuration
