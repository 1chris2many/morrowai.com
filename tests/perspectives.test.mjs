import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const html = await readFile(new URL('../perspectives.html', import.meta.url), 'utf8');
const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const script = await readFile(new URL('../js/perspectives.js', import.meta.url), 'utf8');

test('Perspectives discovery survives digest regeneration and preserves the homepage preview anchor', async () => {
    for (const name of ['index.html', 'research.html', 'news.html', 'perspectives.html']) {
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

test('Perspectives serves only the two approved, attributed originals without JavaScript', () => {
    assert.equal((html.match(/class="essay-card" data-author-id="chris-morrow"/g) || []).length, 2);
    assert.equal((html.match(/class="perspectives-byline">By Chris Morrow/g) || []).length, 2);
    assert.match(html, /value="all">All authors/);
    assert.match(html, /<label for="perspectives-author">Browse by author<\/label>/);
    assert.match(html, /href="https:\/\/www.linkedin.com\/feed\/update\/urn:li:activity:7467678634808549376\/"/);
    assert.match(html, /href="https:\/\/www.linkedin.com\/posts\/cmorrow1_last-fall-openai-launched-instant-checkout-activity-7470339849124945920-c4ji"/);
    assert.match(home, /href="perspectives.html">Browse perspectives by author/);
});

test('author filter keeps All, matches Chris, and gives unknown authors an empty state', () => {
    const cards = [{ dataset: { authorId: 'chris-morrow' }, hidden: false }, { dataset: { authorId: 'chris-morrow' }, hidden: false }];
    const count = { textContent: '' };
    const empty = { hidden: true };
    const tools = { classList: { add(value) { assert.equal(value, 'enhanced'); } } };
    const selector = { value: 'all', closest() { return tools; }, addEventListener(event, fn) { assert.equal(event, 'change'); this.change = fn; } };
    const document = {
        getElementById(id) { return { 'perspectives-author': selector, 'perspectives-count': count, 'perspectives-empty': empty }[id]; },
        querySelectorAll() { return cards; }
    };
    runInNewContext(script, { document });
    assert.equal(count.textContent, '2 pieces');
    selector.value = 'chris-morrow'; selector.change();
    assert.equal(cards.filter(card => !card.hidden).length, 2);
    selector.value = 'unknown'; selector.change();
    assert.equal(count.textContent, '0 pieces');
    assert.equal(empty.hidden, false);
    selector.value = 'all'; selector.change();
    assert.equal(cards.filter(card => !card.hidden).length, 2);
    assert.equal(empty.hidden, true);
});
