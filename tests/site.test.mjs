import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { newsAnchor, selectNews, freshnessMessage } from '../js/news-model.js';

const pages = ['index.html', 'research.html', 'news.html', 'blog/rag-wrong.html', 'blog/agentic-commerce-hype.html'];
const assets = ['css/style.css', 'css/blog.css', 'css/news.css', 'css/editorial.css', 'js/main.js', 'js/news.js', 'js/news-model.js', 'news.json', 'feed.xml'];
let server, browser, base;
const feed = JSON.parse(await readFile(new URL('../news.json', import.meta.url)));
before(async () => {
    if (process.env.SITE_URL) base = process.env.SITE_URL.replace(/\/?$/, '/');
    else {
        server = createServer(async (req, res) => {
            const path = new URL(req.url, 'http://localhost').pathname;
            const file = path.replace(/^\/morrowai.com\//, '') || 'index.html';
            if (!path.startsWith('/morrowai.com/') || ![...pages, ...assets].includes(file)) return res.writeHead(404).end();
            res.setHeader('Content-Type', { html: 'text/html', css: 'text/css', js: 'text/javascript', json: 'application/json', xml: 'application/rss+xml' }[file.split('.').pop()]);
            res.end(await readFile(new URL('../' + file, import.meta.url)));
        });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        base = `http://127.0.0.1:${server.address().port}/morrowai.com/`;
    }
    browser = await chromium.launch({ channel: 'chrome', chromiumSandbox: true });
    await mkdir(new URL('../test-results/', import.meta.url), { recursive: true });
});
after(async () => { await browser?.close(); if (server) await new Promise(resolve => server.close(resolve)); });

for (const width of [320, 390, 768, 820, 1440]) {
    test(`v0.2 pages, navigation and layout at ${width}px`, async () => {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        try {
            for (const file of pages) {
                const r = await page.goto(base + (file === 'index.html' ? '' : file));
                assert.equal(r.status(), 200);
                const canonicalBase = file.startsWith('blog/') ? 'https://1chris2many.github.io/morrowai.com/' : 'https://usefulaiwerks.com/';
                assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), canonicalBase + (file === 'index.html' ? '' : file));
                assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), file + ' overflow');
                assert.equal(await page.locator('a a').count(), 0);
                if (width <= 768) {
                    const toggle = page.locator('#nav-toggle');
                    await toggle.click();
                    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
                    await page.keyboard.press('Escape');
                    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
                    assert.ok(await toggle.evaluate(el => el === document.activeElement));
                } else {
                    assert.ok(await page.evaluate(() => document.querySelector('.nav-logo').getBoundingClientRect().right < document.querySelector('#nav-links').getBoundingClientRect().left));
                }
                if (!file.startsWith('blog/')) {
                    const links = await page.locator('a[href],link[rel="stylesheet"],script[src]').evaluateAll(els => els.map(e => e.href || e.src));
                    for (const href of new Set(links)) {
                        if (!href.startsWith(base)) continue;
                        const response = await context.request.get(href.split('#')[0]);
                        assert.equal(response.status(), 200, href);
                    }
                }
            }
            await page.goto(base);
            assert.equal(await page.locator('#hero .btn-primary').getAttribute('href'), '#essays');
            assert.equal(await page.locator('#hero a[href="#contact"]').count(), 0);
            assert.equal(await page.locator('#nav-links a[href="news.html"]').count(), 1);
            assert.equal(await page.locator('.essay-card').count(), 2);
            assert.equal(await page.locator('.digest-preview li').count(), 3);
            assert.equal(await page.locator('.contact-email').getAttribute('href'), 'mailto:hello@usefulaiwerks.com');
            assert.equal(await page.locator('form, input, textarea').count(), 0);
            assert.ok(await page.locator('#essays').evaluate(el => el.getBoundingClientRect().top < innerHeight), 'Writing must begin in first viewport');
            assert.ok(await page.evaluate(() => document.querySelector('#research').offsetTop < document.querySelector('#contact').offsetTop));
            await page.screenshot({ path: `test-results/v02-home-${width}.png` });
            await page.locator('#hero .btn-primary').click();
            await page.waitForFunction(() => document.querySelector('#nav-links a[href="#essays"]').getAttribute('aria-current') === 'location');
            if (width === 390 || width === 1440) {
                await page.locator('#essays').scrollIntoViewIfNeeded();
                await page.screenshot({ path: `test-results/v02-essays-${width}.png` });
                await page.goto(base + 'research.html');
                assert.equal(await page.locator('#nav-links a[href="research.html"]').getAttribute('aria-current'), 'page');
                assert.match(await page.locator('main').innerText(), /No research papers or findings have been published/);
                await page.screenshot({ path: `test-results/v02-research-${width}.png` });
            }
            assert.deepEqual(errors, []);
        } finally { await context.close(); }
    });
}

test('verbatim digest, stable links, filters and RSS', async () => {
    assert.ok(feed.items.length >= 24);
    for (const javaScriptEnabled of [true, false]) {
        const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 390, height: 900 } });
        const page = await context.newPage();
        try {
            await page.goto(base + 'news.html');
            if (javaScriptEnabled) await page.locator('.news-controls').waitFor();
            const cards = page.locator('.news-card');
            assert.equal(await cards.count(), feed.items.length);
            for (const item of feed.items) {
                const card = page.locator('#' + newsAnchor(item));
                assert.equal(await card.locator('h3').textContent(), item.title);
                assert.equal(await card.locator('.news-summary').first().textContent(), item.summary);
                if (item.whyItMatters) assert.equal(await card.locator('.news-why').textContent(), item.whyItMatters);
                for (const n of item.newsletters || []) assert.equal(await card.locator(`a[href="${n.signupUrl}"]`).count(), 1);
            }
            assert.equal(await page.locator('.newsletter-only').count(), feed.items.filter(i => i.linkKind === 'newsletter').length);
            await page.screenshot({ path: `test-results/v02-news-${javaScriptEnabled}.png` });
            if (javaScriptEnabled) {
                await page.locator('#news-topic').selectOption('Agents');
                assert.ok(await cards.count() < feed.items.length);
                await page.locator('.news-clear').click();
                assert.equal(await cards.count(), feed.items.length);
                await page.locator('#news-source').selectOption({ index: 1 });
                assert.ok(await cards.count() < feed.items.length);
                await page.locator('.news-clear').click();
                const options = await page.locator('#news-theme option').count();
                if (options > 1) {
                    await page.locator('#news-theme').selectOption({index:1});
                    assert.ok(await cards.count() > 0);
                    assert.match(await page.locator('#news-count').textContent(), /Thread spans/);
                    await page.locator('.news-clear').click();
                }
                await page.locator('#news-sort').selectOption('oldest');
                const dates = await cards.evaluateAll(els => els.map(e => e.dataset.date));
                assert.deepEqual(dates, [...dates].sort());
            }
        } finally { await context.close(); }
    }
    const page = await browser.newPage();
    try {
        await page.goto(base);
        const response = await page.request.get(base + 'feed.xml');
        assert.equal(response.status(), 200);
        const rss = await page.evaluate(xml => {
            const doc = new DOMParser().parseFromString(xml, 'text/xml');
            return { errors: doc.querySelectorAll('parsererror').length, items: [...doc.querySelectorAll('item')].map(el => ({
                title: el.querySelector('title').textContent,
                guid: el.querySelector('guid').textContent,
                body: new DOMParser().parseFromString(el.querySelector('description').textContent, 'text/html').body.textContent
            })) };
        }, await response.text());
        assert.equal(rss.errors, 0);
        assert.equal(rss.items.length, feed.items.length);
        assert.equal(new Set(rss.items.map(i => i.guid)).size, feed.items.length);
        for (const item of feed.items) {
            const entry = rss.items.find(i => i.title === item.title);
            assert.ok(entry.body.includes(item.summary));
            assert.ok(entry.body.includes(item.whyItMatters));
            assert.ok(entry.guid.endsWith('#' + newsAnchor(item)));
        }
    } finally { await page.close(); }
});

test('no-JS navigation, failure fallback, and accessible skip link', async () => {
    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const p = await nojs.newPage();
    try {
        for (const file of ['index.html', 'research.html', 'news.html']) {
            await p.goto(base + file);
            assert.ok(await p.locator('#nav-links').isVisible());
            assert.equal(await p.locator('#nav-toggle').isVisible(), false);
            assert.ok(await p.locator('main').isVisible());
        }
    } finally { await nojs.close(); }
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    try {
        await page.route('**/news.json', route => route.abort());
        await page.goto(base + 'news.html');
        await page.waitForFunction(() => document.querySelector('#news-status').textContent.includes('temporarily unavailable'));
        assert.equal(await page.locator('.news-card').count(), feed.items.length);
        await page.goto(base);
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true);
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('main').evaluate(el => el === document.activeElement), true);
    } finally { await page.close(); }
});

test('stale feeds disclose delay even when the publishing machine is offline', () => {
    assert.match(freshnessMessage({digestDate:'2026-09-16',notice:'Snapshot'},new Date('2026-09-17T16:00:00Z')), /Update delayed/);
    assert.equal(freshnessMessage({digestDate:'2026-09-17',notice:'Current'},new Date('2026-09-17T16:00:00Z')), 'Current');
    assert.equal(selectNews([{tags:[],source:'x',digestDate:'2026-09-17',title:'x',themes:[{id:'a'}]}],{theme:'b'}).length,0);
});
