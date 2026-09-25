import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { newsAnchor, selectNews, freshnessMessage } from '../js/news-model.js';

const pages = ['index.html', 'themes.html', 'perspectives.html', 'news.html', 'three-windows-ai-safety.html', 'two-financing-paths.html'];
const assets = ['css/news-first.css', 'css/style.css', 'css/blog.css', 'css/news.css', 'css/editorial.css', 'js/main.js', 'js/perspectives.js', 'js/news.js', 'js/news-model.js', 'js/analytics.js', 'news.json', 'feed.xml'];
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

for (const width of [320,390,768,820,1440]) {
 test('news-first integration at '+width+'px',async()=>{
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await ctx.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  try {
   for(const file of pages){
    assert.equal((await p.goto(base+file)).status(),200);
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file+' overflow');
    assert.equal(await p.locator('a a').count(),0);
    if(!['index.html','themes.html'].includes(file)&&width<=768){await p.locator('#nav-toggle').click();assert.equal(await p.locator('#nav-toggle').getAttribute('aria-expanded'),'true');await p.keyboard.press('Escape');assert.equal(await p.locator('#nav-toggle').getAttribute('aria-expanded'),'false');}
    for(const href of new Set(await p.locator('a[href],link[rel="stylesheet"],script[src]').evaluateAll(es=>es.map(e=>e.href||e.src))))if(href.startsWith(base))assert.equal((await ctx.request.get(href.split('#')[0])).status(),200,href);
   }
   await p.goto(base);
   assert.equal(await p.locator('h1').textContent(),'What’s changing.Why it matters.');
   assert.equal(await p.locator('meta[name="robots"]').count(),0);
   assert.deepEqual(await p.locator('main > section').evaluateAll(es=>es.map(e=>e.id)),['developing','latest','perspectives','team','about','contact']);
   assert.ok(await p.locator('#developing .brief-card h3').first().evaluate(e=>e.getBoundingClientRect().top<innerHeight),'First briefing begins in first viewport');
   assert.equal(await p.locator('#developing .brief-map li').count(),9);
   const current=feed.items.filter(i=>i.digestDate===feed.digestDate);
   assert.equal(await p.locator('#latest article').count(),current.length);
   for(const item of current){
    const c=p.locator('#latest [data-digest-item-id="'+item.digestItemId+'"]');
    assert.equal(await c.locator('h3').textContent(),item.title);assert.equal(await c.locator('.news-summary').textContent(),item.summary);
    if(item.whyItMatters)assert.equal(await c.locator('.news-why').textContent(),item.whyItMatters);
    assert.equal(await c.locator('h3 a').getAttribute('href'),'https://usefulaiwerks.com/news.html#'+item.anchor);
   }
   assert.equal(await p.locator('#perspectives .essay-card').count(),4);assert.equal(await p.locator('#team article').count(),7);
   assert.equal(await p.locator('#speaking .speaking-list li').count(),3);
   assert.equal(await p.locator('[data-editorial-placeholder],.placeholder').count(),0);
   assert.equal(await p.locator('.contact-email').getAttribute('href'),'mailto:hello@usefulaiwerks.com');
   for(const href of await p.locator('a[href^="#"]').evaluateAll(es=>es.map(e=>e.getAttribute('href'))))assert.equal(await p.locator(href).count(),1,href);
   await p.screenshot({path:'test-results/news-first-home-'+width+'.png'});
   if(width===390||width===1440){for(const section of ['developing','team']){await p.locator('#'+section).scrollIntoViewIfNeeded();await p.screenshot({path:'test-results/news-first-'+section+'-'+width+'.png'});}}
   const theme=await p.locator('#developing [data-theme]').first().getAttribute('data-theme');
   await p.locator('#developing .brief-link').first().click();
   assert.equal(new URL(p.url()).hash,'#'+theme);
   assert.equal(await p.locator('.briefing').count(),3);
   assert.equal(await p.locator('.brief-timeline li').count(),9);
   assert.equal(await p.locator('.brief-map li').count(),9);
   await p.locator('#'+theme+' .brief-related summary').click();
   assert.equal(await p.locator('#'+theme+' .brief-related li:visible').count(),feed.items.filter(i=>i.themes?.some(t=>t.id===theme)).length);
   await p.locator('#'+theme).scrollIntoViewIfNeeded();
   await p.screenshot({path:'test-results/theme-briefing-'+width+'.png'});
   await p.goto(base+'news.html?theme='+theme);await p.locator('#news-theme').waitFor();
   assert.equal(await p.locator('#news-theme').inputValue(),theme);
   assert.equal(await p.locator('.news-card:visible').count(),feed.items.filter(i=>i.themes?.some(t=>t.id===theme)).length);
   assert.deepEqual(errors,[]);
  }finally{await ctx.close();}
 });
}

test('equal-count author switches expose distinct atomic status in Chromium', async () => {
    for (const width of [390,1440]) {
        const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();
        try {
            await page.goto(base+'perspectives.html?author=chris-morrow&ref=night#main');
            const status=page.getByRole('status'),select=page.locator('#perspectives-author');
            assert.equal(await status.textContent(),'2 pieces by Chris Morrow');
            assert.equal(await status.getAttribute('aria-atomic'),'true');
            assert.equal(await select.getAttribute('aria-describedby'),'perspectives-count');
            await select.selectOption('persephone');
            assert.equal(await status.textContent(),'2 pieces by Persephone');
            assert.match(await status.ariaSnapshot(),/2 pieces by Persephone/);
            assert.equal(await page.locator('#perspectives-list .essay-card:visible').count(),2);
            assert.match(page.url(),/author=persephone&ref=night#main/);
            await select.selectOption('all');
            assert.equal(await status.textContent(),'4 pieces, all authors');
            assert.equal(await page.locator('#perspectives-list .essay-card:visible').count(),4);
            assert.equal(new URL(page.url()).search,'?ref=night');
            assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        } finally {await context.close();}
    }
});

test('edited digest, stable links, filters and RSS', async () => {
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
        for (const file of ['index.html', 'perspectives.html', 'news.html']) {
            await p.goto(base + file);
            assert.ok(await p.locator(file==='index.html'?'.site-header nav':'#nav-links').isVisible());
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

test('Perspectives is HTML-first with attributed cards and accessible author filtering', async () => {
    for (const javaScriptEnabled of [false, true]) {
        const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 390, height: 900 } });
        const page = await context.newPage();
        try {
            await page.goto(base + 'perspectives.html');
            const cards = page.locator('#perspectives-list .essay-card:visible');
            assert.equal(await cards.count(), 4);
            assert.deepEqual(await cards.evaluateAll(els => els.map(el => el.dataset.authorId)), ['persephone', 'persephone', 'chris-morrow', 'chris-morrow']);
            assert.deepEqual(await page.locator('.perspectives-byline').allTextContents(), ['By Persephone', 'By Persephone', 'By Chris Morrow', 'By Chris Morrow']);
            assert.equal(await page.locator('#perspectives-count').textContent(), javaScriptEnabled ? '4 pieces, all authors' : '4 pieces');
            for (const title of ['AI coding costs and product prioritization', 'Agentic commerce: trust and checkout']) {
                assert.equal(await page.getByRole('link', { name: title + ' (opens in a new tab)', exact: true }).count(), 1);
            }
            assert.equal(await page.locator('label[for="perspectives-author"]').textContent(), 'Browse by author');
            assert.equal(await page.locator('#perspectives-author').inputValue(), 'all');
            if (javaScriptEnabled) {
                await page.locator('#perspectives-author').focus();
                assert.ok(await page.locator('#perspectives-author').evaluate(el => el === document.activeElement));
                // Drive the native select portably; headless macOS popup key
                // synthesis does not reliably commit an option.
                await page.locator('#perspectives-author').selectOption('chris-morrow');
                assert.equal(await page.locator('#perspectives-author').inputValue(), 'chris-morrow');
                assert.equal(await cards.count(), 2);
                assert.equal(new URL(page.url()).searchParams.get('author'), 'chris-morrow');
                await page.reload();
                assert.equal(await page.locator('#perspectives-author').inputValue(), 'chris-morrow');
                await page.locator('#perspectives-author').evaluate(select => select.add(new Option('Unknown author', 'unknown')));
                await page.locator('#perspectives-author').selectOption('unknown');
                assert.equal(await cards.count(), 0);
                assert.equal(await page.locator('#perspectives-count').textContent(), '0 pieces by Unknown author');
                assert.ok(await page.locator('#perspectives-empty').isVisible());
                await page.locator('#perspectives-author').selectOption('persephone');
                assert.equal(await cards.count(), 2);
                assert.equal(await page.locator('#perspectives-count').textContent(), '2 pieces by Persephone');
                await page.reload();
                assert.equal(await cards.count(), 2);
                assert.equal(await page.locator('#perspectives-author').inputValue(), 'persephone');
                await page.locator('a[href="three-windows-ai-safety.html"]').click();
                assert.equal(await page.locator('h1').textContent(), 'Three new windows into AI safety claims.');
                assert.equal(await page.locator('.blog-author').textContent(), 'By Persephone');
                assert.equal(await page.locator('#article-body p').count(), 6);
                assert.equal(await page.locator('#article-body a').count(), 4);
                assert.match(await page.locator('.author-disclosure').textContent(), /Written by Persephone.*Source verification: Codex/);
                await page.screenshot({ path: 'test-results/three-windows-mobile.png', fullPage: true });
                await page.goto(base + 'perspectives.html');
                await page.locator('#perspectives-author').selectOption('all');
                assert.equal(await cards.count(), 4);
                assert.equal(new URL(page.url()).searchParams.has('author'), false);
                await page.goto(base + 'perspectives.html?author=bogus&ref=shared#main');
                assert.equal(await page.locator('#perspectives-author').inputValue(), 'all');
                assert.equal(await cards.count(), 4);
                assert.equal(new URL(page.url()).searchParams.has('author'), false);
                assert.equal(new URL(page.url()).searchParams.get('ref'), 'shared');
                assert.equal(new URL(page.url()).hash, '#main');
            }
        } finally { await context.close(); }
    }
});

test('stale feeds disclose delay even when the publishing machine is offline', () => {
    assert.match(freshnessMessage({digestDate:'2026-09-16',notice:'Snapshot'},new Date('2026-09-17T16:00:00Z')), /Update delayed/);
    assert.equal(freshnessMessage({digestDate:'2026-09-17',notice:'Current'},new Date('2026-09-17T16:00:00Z')), 'Current');
    assert.equal(selectNews([{tags:[],source:'x',digestDate:'2026-09-17',title:'x',themes:[{id:'a'}]}],{theme:'b'}).length,0);
});

test('Persephone article preserves the exact approved body and sources without JavaScript', async () => {
    // Author commit 81e936e; exact source file SHA256 65915195…08c67f88.
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    try {
        assert.equal((await page.goto(base + 'three-windows-ai-safety.html')).status(), 200);
        const paragraphs = await page.locator('#article-body p').allTextContents();
        assert.equal(createHash('sha256').update(paragraphs.join('\n\n')).digest('hex'), '6698525c1ca71fd26b6af6aa673455734586ea5370b0eab8ff7b136cac5f3e70');
        assert.equal(await page.locator('h1').textContent(), 'Three new windows into AI safety claims.');
        assert.equal(await page.locator('.blog-author').textContent(), 'By Persephone');
        assert.equal(await page.locator('.author-disclosure p').textContent(), "Written by Persephone, an AI author running on Anthropic's Claude; Anthropic is one of the companies discussed. Source verification: Codex.");
        assert.deepEqual(await page.locator('#article-body a').evaluateAll(es => es.map(e => e.href)), [
            'https://www.anthropic.com/aug-2026-risk-report', 'https://microsoft.ai/code-of-conduct/',
            'https://openai.com/index/model-misalignment-reporting-framework/', 'https://microsoft.ai/news/mai-code-of-conduct/'
        ]);
        assert.equal(await page.locator('time').getAttribute('datetime'), '2026-09-21');
        assert.equal(await page.locator('a[href="perspectives.html?author=persephone"]').count(), 1);
        await page.screenshot({ path: 'test-results/three-windows-desktop.png', fullPage: true });
    } finally { await context.close(); }
});

test('withdrawn pages are unavailable and public copy excludes operations boilerplate', async () => {
    const page = await browser.newPage();
    try {
        for (const path of ['research.html','blog/rag-wrong.html','blog/agentic-commerce-hype.html']) {
            assert.equal((await page.request.get(base + path)).status(), 404, path);
        }
        for (const file of pages) {
            await page.goto(base + file);
            assert.equal(await page.locator('a[href="research.html"]').count(), 0);
            const text = await page.locator('main').textContent();
            assert.doesNotMatch(text, /deterministic publisher|privacy checks|publication failures|reproduced verbatim|Snapshot published|next-best-alternative|recovery edition|backfill supplement/i);
        }
        assert.ok(feed.items.length >= 54);
        assert.equal(new Set(feed.items.map(newsAnchor)).size, feed.items.length);
        assert.ok(feed.items.find(i=>i.digestItemId===793).anchor);
        assert.match(feed.items.find(i=>i.digestItemId===793).title, /committee warns/);
        assert.doesNotMatch(feed.items.find(i=>i.digestItemId===793).title, /is causing/);
        assert.equal(selectNews([
            {title:'A',source:'Anthropic — September 17, 2026',tags:[],digestDate:'2026-09-18'},
            {title:'B',source:'Anthropic — September 18, 2026',tags:[],digestDate:'2026-09-19'}
        ],{source:'Anthropic'}).length,2);
    } finally { await page.close(); }
});

test('profile includes verified Ai4 talks without the canceled workshop', async () => {
    const page = await browser.newPage();
    try {
        await page.goto(base + '#speaking');
        const speaking = page.locator('#speaking');
        assert.equal(await speaking.locator('li').count(), 3);
        const text = await speaking.innerText();
        for (const title of ['The Replacement Trap', 'The Stochastic Product Manager', 'AI for Language Models']) assert.ok(text.includes(title));
        assert.ok(text.includes('Pouya Shahbazian'));
        assert.doesNotMatch(text, /Workshop on Evals|hospice|Speaker Resource Center|Access Key/i);
        assert.equal(await speaking.locator('a[href*="7361545251091615745"]').count(),1);
        assert.equal(await speaking.locator('a[href*="7417173701705748480"]').count(),1);
        assert.equal(await speaking.locator('a[href*="conferenceharvester"], a[href*="mail.google.com"]').count(),0);
        await page.setViewportSize({width:390,height:900});
        await speaking.scrollIntoViewIfNeeded();
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        await speaking.screenshot({path:'test-results/profile-speaking-390.png'});
    } finally { await page.close(); }
});

test('Financing brief preserves author396 exact text, attribution and sources', async () => {
    for (const width of [390, 1440]) {
        const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 1000 } });
        const page = await context.newPage();
        try {
            assert.equal((await page.goto(base + 'two-financing-paths.html')).status(), 200);
            const paragraphs = await page.locator('#article-body p').allTextContents();
            assert.equal(createHash('sha256').update(paragraphs.join('\n\n')).digest('hex'), '4e40b272894cf29303137d69e97bffec9d9a2e963c9f11b6ec958397b6f24c07');
            assert.equal(paragraphs.length, 6);
            assert.equal(await page.locator('h1').textContent(), 'Two financing paths for frontier AI');
            assert.equal(await page.locator('.blog-author').textContent(), 'By Persephone');
            assert.equal(await page.locator('.author-disclosure p').textContent(), "Written by Persephone, an AI author running on Anthropic's Claude; Anthropic is one of the companies discussed. Source verification: Codex.");
            assert.equal(await page.locator('time').getAttribute('datetime'), '2026-09-22');
            assert.deepEqual(await page.locator('#article-body a').allTextContents(), ['Reuters (via Investing.com)', 'Reuters (via Investing.com)', 'Reuters, citing FT (via Investing.com)']);
            assert.deepEqual(await page.locator('#article-body a').evaluateAll(es => es.map(e => e.href)), [
                'https://www.investing.com/news/stock-market-news/exclusiveanthropic-ipo-launch-shifts-toward-midoctober-sources-say-4890091',
                'https://www.investing.com/news/stock-market-news/openai-ipo-will-not-happen-in-2026-amid-ai-safety-fears-altman-says-4898687',
                'https://www.investing.com/news/stock-market-news/openai-mulls-funding-round-at-12-trillion-valuation-ahead-of-ipo-ft-reports-4902736'
            ]);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
            await page.screenshot({ path: 'test-results/financing-' + width + '.png', fullPage: true });
        } finally { await context.close(); }
    }
});
