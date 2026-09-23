import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

// All browser requests are fulfilled locally or aborted. Even the production
// hostname and tracker URL below never contact a real telemetry endpoint.
test('real DOM filters and links send the expected fake Umami events without changing behavior', async () => {
    const browser = await chromium.launch({ channel: 'chrome', chromiumSandbox: true });
    const context = await browser.newContext({ userAgent: 'Mozilla/5.0 Chrome/140 Safari/537.36' });
    const unexpected = [];
    let trackerLoads = 0;
    try {
        await context.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
        await context.route('**/*', async route => {
            const url = new URL(route.request().url());
            if (url.href === 'https://cloud.umami.is/script.js') {
                trackerLoads++;
                return route.fulfill({ contentType: 'text/javascript', body: `
                    window.analyticsEvents = [];
                    window.umami = { track(payload) {
                        const clean = window.usefulAIAnalyticsBeforeSend('event', payload);
                        if (clean) window.analyticsEvents.push(clean);
                    } };
                ` });
            }
            if (url.origin === 'https://usefulaiwerks.com') {
                const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
                if (/^(?:[\w-]+\.html|(?:js|css)\/[\w.-]+|news\.json|feed\.xml)$/.test(file)) {
                    const contentType = { html: 'text/html', js: 'text/javascript', css: 'text/css', json: 'application/json', xml: 'application/rss+xml' }[file.split('.').at(-1)];
                    return route.fulfill({ contentType, body: await readFile(new URL('../' + file, import.meta.url)) });
                }
            }
            unexpected.push(url.href);
            await route.abort();
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto('https://usefulaiwerks.com/news.html?email=private@example.com#private');
        await page.waitForFunction(() => window.analyticsEvents?.length === 1);
        await page.locator('#news-theme').waitFor();
        const allCards = await page.locator('.news-card').count();
        // selectOption dispatches a synthetic change event: filtering still
        // works, but analytics excludes it. Trusted changes have unit coverage.
        await page.selectOption('#news-theme', 'ai-regulation');
        assert.ok(await page.locator('.news-card').count() < allCards);
        assert.equal(await page.evaluate(() => window.analyticsEvents.length), 1);
        await page.locator('.news-clear').click();
        await page.locator('[data-analytics-theme]').first().click();
        // Prevent only the destination navigation during link tests. Tracking
        // remains the same trusted browser click, with no telemetry transport.
        await page.evaluate(() => document.addEventListener('click', event => {
            if (event.target.closest('a')) event.preventDefault();
        }));
        const digestItemId = Number(await page.locator('.news-card:has(h3 a)').first().getAttribute('data-digest-item-id'));
        await page.locator('.news-card h3 a').first().click();
        await page.locator('.digest-method a[href*="theme="]').first().evaluate(el => el.closest('details').open = true);
        await page.locator('.digest-method a[href*="theme="]').first().click();
        await page.locator('a[href="feed.xml"]').first().click();
        await page.locator('a[href^="mailto:"]').first().click();
        const events = await page.evaluate(() => window.analyticsEvents);
        assert.equal(events.filter(event => !event.name).length, 1);
        for (const name of ['theme_filter', 'theme_navigation', 'outbound_story_click', 'rss_click', 'contact_click']) {
            assert.ok(events.some(event => event.name === name), name);
        }
        assert.equal(events.filter(event => event.name === 'theme_filter').length, 1, JSON.stringify(events));
        assert.equal(events.find(event => event.name === 'outbound_story_click').data.digest_item_id, digestItemId);
        assert.doesNotMatch(JSON.stringify(events), /private|email|mailto|conversion/);

        await page.goto('https://usefulaiwerks.com/perspectives.html');
        await page.waitForFunction(() => window.analyticsEvents?.length === 1);
        await page.selectOption('#perspectives-author', 'persephone');
        assert.equal(await page.locator('#perspectives-list .essay-card:visible').count(), 2);
        assert.equal(new URL(page.url()).searchParams.get('author'), 'persephone');
        assert.deepEqual(await page.evaluate(() => window.analyticsEvents.map(e => e.name || 'pageview')), ['pageview']);

        await page.locator('[data-analytics-opt-out]').click();
        await page.waitForURL('**/perspectives.html?analytics=off');
        assert.equal(await page.locator('[data-analytics-opt-out]').textContent(), 'Analytics is off for this tab.');
        await page.goto('https://usefulaiwerks.com/');
        assert.equal(await page.locator('script[src="https://cloud.umami.is/script.js"]').count(), 0);
        assert.equal(trackerLoads, 2);
        assert.deepEqual(errors, []);
        assert.deepEqual(unexpected, []);
    } finally {
        await context.close();
        await browser.close();
    }
});
