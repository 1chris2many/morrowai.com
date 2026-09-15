import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const pages = ['index.html', 'blog/rag-wrong.html', 'blog/agentic-commerce-hype.html', 'news.html'];
const assets = ['css/style.css', 'css/blog.css', 'css/news.css', 'js/main.js', 'js/news.js', 'js/news-model.js', 'news.json'];
const publicBase = 'https://usefulaiwerks.com/';
let server, browser, base;

before(async () => {
    if (process.env.SITE_URL) {
        base = process.env.SITE_URL.replace(/\/?$/, '/');
    } else {
        server = createServer(async (req, res) => {
            const path = new URL(req.url, 'http://localhost').pathname;
            const file = path.replace(/^\/morrowai.com\//, '') || 'index.html';
            if (!path.startsWith('/morrowai.com/') || ![...pages, ...assets].includes(file)) {
                res.writeHead(404).end();
                return;
            }
            const types = { html: 'text/html', css: 'text/css', js: 'text/javascript', json: 'application/json' };
            res.setHeader('Content-Type', types[file.split('.').pop()]);
            res.end(await readFile(new URL('../' + file, import.meta.url)));
        });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        base = `http://127.0.0.1:${server.address().port}/morrowai.com/`;
    }
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', chromiumSandbox: true });
    await mkdir(new URL('../test-results/', import.meta.url), { recursive: true });
});

after(async () => {
    await browser?.close();
    if (server) await new Promise(resolve => server.close(resolve));
});

for (const width of [390, 1440]) {
    test(`pages, contact email, links and navigation at ${width}px`, async () => {
        const context = await browser.newContext({ viewport: { width, height: 900 } });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        try {
            for (const file of pages) {
                const response = await page.goto(base + (file === 'index.html' ? '' : file));
                assert.equal(response.status(), 200);
                const canonicalBase = file.startsWith('blog/') ? 'https://1chris2many.github.io/morrowai.com/' : publicBase;
                assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), canonicalBase + (file === 'index.html' ? '' : file));
                if (file !== 'news.html') assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), canonicalBase + (file === 'index.html' ? '' : file));
                assert.equal(await page.locator('a a').count(), 0);
                assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${file} overflows`);
                const urls = await page.locator('a[href], link[rel="stylesheet"], script[src]').evaluateAll(elements => elements.map(el => el.href || el.src));
                for (const href of new Set(urls)) {
                    if (!href.startsWith(base)) continue;
                    const target = await context.request.get(href.split('#')[0]);
                    assert.equal(target.status(), 200, href);
                    if (href.includes('#') && href.split('#')[0] === page.url().split('#')[0]) {
                        assert.equal(await page.locator('#' + href.split('#')[1]).count(), 1, href);
                    }
                }
                if (width < 768 && file !== 'news.html') {
                    const toggle = page.locator('#nav-toggle');
                    await toggle.click();
                    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
                    assert.ok(await page.locator('#nav-links').isVisible());
                    await page.keyboard.press('Escape');
                    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
                    assert.ok(await toggle.evaluate(el => el === document.activeElement));
                }
            }
            await page.goto(base);
            await page.waitForFunction(() => getComputedStyle(document.querySelector('.hero-sub')).opacity === '1');
            await page.screenshot({ path: `test-results/home-${width}.png` });
            assert.equal(await page.locator('form, input, textarea').count(), 0, 'No nonfunctional form may collect inquiries');
            assert.equal(await page.locator('meta[property="og:image"]').count(), 0, 'No missing preview asset');
            assert.equal(await page.locator('#contact .contact-email').getAttribute('href'), 'mailto:hello@usefulaiwerks.com');
            assert.doesNotMatch(await page.locator('body').innerText(), /temporarily unavailable|founded Amazon Rufus|Case Studies|currently Meta|8\+ voice/);
            assert.doesNotMatch(await page.content(), /Message Received|formspree\.io\/f\/placeholder/);
            assert.equal(await page.locator('.posts-grid > .post-card').count(), 2);
            assert.equal(await page.locator('.linkedin-posts a[href^="https://www.linkedin.com/"]').count(), 2);
            assert.equal(await page.locator('#ai-news a').getAttribute('href'), 'news.html');
            assert.match(await page.locator('h1').innerText(), /Useful AI Werks/);
            if (width < 768) await page.locator('#nav-toggle').click();
            await page.locator('#nav-links a[href="#contact"]').click();
            assert.equal(await page.locator('#nav-toggle').getAttribute('aria-expanded'), 'false');
            await page.locator('.contact-notice').scrollIntoViewIfNeeded();
            await page.waitForFunction(() => getComputedStyle(document.querySelector('.contact-layout')).opacity === '1');
            await page.screenshot({ path: `test-results/contact-${width}.png` });
            assert.deepEqual(errors, []);
        } finally {
            await context.close();
        }
    });
}

test('content and mobile navigation work without JavaScript', async () => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const page = await context.newPage();
    try {
        await page.goto(base);
        assert.ok(await page.locator('#nav-links').isVisible());
        assert.equal(await page.locator('#nav-toggle').isVisible(), false);
        for (const element of await page.locator('.scroll-in').all()) {
            assert.equal(await element.evaluate(el => getComputedStyle(el).opacity), '1');
        }
        await page.locator('#nav-links a[href="#contact"]').click();
        assert.ok(page.url().endsWith('#contact'));
        assert.ok(await page.locator('.contact-notice').isVisible());
        await page.screenshot({ path: 'test-results/contact-no-js.png' });
    } finally {
        await context.close();
    }
});

test('all 24 approved digest stories remain verbatim, including without JavaScript', async () => {
    const feed = JSON.parse(await readFile(new URL('../news.json', import.meta.url)));
    assert.equal(feed.items.length, 24);
    for (const javaScriptEnabled of [true, false]) {
        const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 390, height: 900 } });
        try {
            const page = await context.newPage();
            await page.goto(base + 'news.html');
            if (javaScriptEnabled) await page.locator('.news-controls').waitFor();
            const cards = page.locator('.news-card');
            assert.equal(await cards.count(), 24);
            for (const item of feed.items) {
                const card = cards.filter({ has: page.locator('h3', { hasText: item.title }) });
                assert.equal(await card.count(), 1);
                assert.equal(await card.locator('h3').innerText(), item.title);
                assert.equal(await card.locator('.news-summary').first().textContent(), item.summary);
                assert.equal(await card.locator('.news-why').textContent(), item.whyItMatters);
            }
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            await page.screenshot({ path: 'test-results/news-' + javaScriptEnabled + '.png' });
            if (javaScriptEnabled) {
                const select = page.locator('.news-controls select').first();
                const value = await select.locator('option').nth(1).getAttribute('value');
                await select.selectOption(value);
                assert.ok(await cards.count() < 24);
                await page.locator('.news-clear').click();
                assert.equal(await cards.count(), 24);
            }
        } finally { await context.close(); }
    }
});
