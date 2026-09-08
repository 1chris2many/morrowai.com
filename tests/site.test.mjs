import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const pages = ['index.html', 'blog/rag-wrong.html', 'blog/agentic-commerce-hype.html'];
const assets = ['css/style.css', 'css/blog.css', 'js/main.js'];
const publicBase = 'https://1chris2many.github.io/morrowai.com/';
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
            const types = { html: 'text/html', css: 'text/css', js: 'text/javascript' };
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
    test(`pages, contact notice, links and navigation at ${width}px`, async () => {
        const context = await browser.newContext({ viewport: { width, height: 900 } });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        try {
            for (const file of pages) {
                const response = await page.goto(base + (file === 'index.html' ? '' : file));
                assert.equal(response.status(), 200);
                assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), publicBase + (file === 'index.html' ? '' : file));
                assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), publicBase + (file === 'index.html' ? '' : file));
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
                if (width < 768) {
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
            assert.equal(await page.locator('form, input, textarea').count(), 0, 'No nonfunctional form may collect inquiries');
            assert.equal(await page.locator('meta[property="og:image"]').count(), 0, 'No missing preview asset');
            assert.match(await page.locator('#contact').innerText(), /cannot currently send messages/);
            assert.doesNotMatch(await page.content(), /Message Received|formspree\.io\/f\/placeholder/);
            assert.equal(await page.locator('.posts-grid > .post-card').count(), 2);
            assert.equal(await page.locator('.post-source a').getAttribute('href'), 'https://www.deeplearning.ai/the-batch/');
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
