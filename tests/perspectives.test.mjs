import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const html = await readFile(new URL('../perspectives.html', import.meta.url), 'utf8');
const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const script = await readFile(new URL('../js/perspectives.js', import.meta.url), 'utf8');

test('Perspectives script cache key matches its content hash', () => {
    const version = html.match(/js\/perspectives\.js\?v=([a-f0-9]{12})(?=["&])/);
    assert.ok(version, 'perspectives.html must carry a 12-character hexadecimal script version');
    assert.equal(version[1], createHash('sha256').update(script).digest('hex').slice(0, 12));
});

test('Perspectives discovery survives digest regeneration and preserves the homepage preview anchor', async () => {
    for (const name of ['index.html', 'news.html', 'perspectives.html']) {
        const page = await readFile(new URL('../' + name, import.meta.url), 'utf8');
        const nav = page.match(/<ul class="nav-links"[\s\S]*?<\/ul>/)?.[0];
        assert.match(nav, /href="perspectives.html">Perspectives<\/a>/, name);
    }
    const { nav } = await import('../scripts/site-layout.mjs');
    assert.match(nav, /href="perspectives.html">Perspectives<\/a>/);
    for (const name of ['news.html', 'scripts/build-digest.mjs']) {
        assert.match(await readFile(new URL('../' + name, import.meta.url), 'utf8'), /href="perspectives.html">Browse perspectives →/);
    }
    assert.match(home, /href="#essays">Explore the writing/);
    assert.match(home, /id="essays"/);
});

test('Perspectives serves two Chris originals and two approved Persephone pieces without JavaScript', () => {
    assert.equal((html.match(/class="essay-card" data-author-id="chris-morrow"/g) || []).length, 2);
    assert.equal((html.match(/class="perspectives-byline">By Chris Morrow/g) || []).length, 2);
    assert.match(html, /value="all">All authors/);
    assert.equal((html.match(/class="essay-card" data-author-id="persephone"/g) || []).length, 2);
    assert.match(html, /href="three-windows-ai-safety.html"/);
    assert.match(html, /value="persephone">Persephone/);
    assert.match(html, /<label for="perspectives-author">Browse by author<\/label>/);
    assert.match(html, /href="https:\/\/www.linkedin.com\/feed\/update\/urn:li:activity:7467678634808549376\/"/);
    assert.match(html, /href="https:\/\/www.linkedin.com\/posts\/cmorrow1_last-fall-openai-launched-instant-checkout-activity-7470339849124945920-c4ji"/);
    assert.match(home, /href="perspectives.html">Browse perspectives by author/);
});

test('author selector describes its current result count and announces changes politely', () => {
    const selector = html.match(/<select\b[^>]*id="perspectives-author"[^>]*>/)?.[0];
    assert.ok(selector);
    assert.match(selector, /aria-controls="perspectives-list"/);
    assert.match(selector, /aria-describedby="perspectives-count"/);
    assert.match(html, /<p id="perspectives-count" role="status" aria-live="polite">4 pieces<\/p>/);
});

function filterFixture(search = '') {
    const cards = [{ dataset: { authorId: 'chris-morrow' }, hidden: false }, { dataset: { authorId: 'chris-morrow' }, hidden: false }];
    const count = { textContent: '' };
    const empty = { hidden: true };
    const tools = { classList: { add(value) { assert.equal(value, 'enhanced'); } } };
    const selector = {
        value: 'all', options: [{ value: 'all' }, { value: 'chris-morrow' }],
        closest() { return tools; },
        addEventListener(event, fn) { assert.equal(event, 'change'); this.change = fn; }
    };
    const document = {
        getElementById(id) { return { 'perspectives-author': selector, 'perspectives-count': count, 'perspectives-empty': empty }[id]; },
        querySelectorAll() { return cards; }
    };
    const window = {
        location: { search, href: `https://usefulaiwerks.com/perspectives.html${search}` },
        history: { replaceState(_state, _title, address) { this.address = address; } }
    };
    runInNewContext(script, { document, window, URL, URLSearchParams });
    return { cards, count, empty, selector, window };
}

test('author filter keeps All, matches Chris, gives an empty state, and updates its shareable URL', () => {
    const { cards, count, empty, selector, window } = filterFixture();
    assert.equal(count.textContent, '2 pieces');
    selector.value = 'chris-morrow'; selector.change();
    assert.equal(cards.filter(card => !card.hidden).length, 2);
    assert.equal(window.history.address, '/perspectives.html?author=chris-morrow');
    selector.value = 'unknown'; selector.change();
    assert.equal(count.textContent, '0 pieces');
    assert.equal(empty.hidden, false);
    selector.value = 'all'; selector.change();
    assert.equal(cards.filter(card => !card.hidden).length, 2);
    assert.equal(empty.hidden, true);
    assert.equal(window.history.address, '/perspectives.html');
});

test('a valid author query opens the corresponding author view', () => {
    const { cards, count, selector, window } = filterFixture('?author=chris-morrow');
    assert.equal(selector.value, 'chris-morrow');
    assert.equal(cards.filter(card => !card.hidden).length, 2);
    assert.equal(count.textContent, '2 pieces');
    assert.equal(window.history.address, undefined);
});
test('invalid and empty author queries normalize to All while preserving unrelated parameters', () => {
    for (const author of ['bogus', '']) {
        const { selector, count, empty, window } = filterFixture('?author=' + author + '&ref=shared#top');
        assert.equal(selector.value, 'all');
        assert.equal(count.textContent, '2 pieces');
        assert.equal(empty.hidden, true);
        assert.equal(window.history.address, '/perspectives.html?ref=shared#top');
    }
    assert.equal(filterFixture().window.history.address, undefined);
});
