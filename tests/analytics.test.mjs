import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile, mkdtemp, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const source = await readFile(new URL('js/analytics.js', root), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));

function setup(options = {}) {
    const scripts = [], events = [], listeners = {};
    const storage = options.storage || new Map();
    const optOut = { textContent: '' };
    const location = new URL(options.url || 'https://usefulaiwerks.com/news.html?email=secret@example.com#private');
    const navigator = { userAgent: 'Mozilla/5.0 Chrome/140 Safari/537.36', ...options.navigator };
    const document = {
        referrer: options.referrer ?? 'https://search.example/results?email=secret@example.com#private',
        querySelectorAll: () => [optOut],
        addEventListener: (type, listener) => { listeners[type] = listener; },
        createElement: () => ({ attrs: {}, setAttribute(key, value) { this.attrs[key] = value; } }),
        head: { append: script => scripts.push(script) },
    };
    const window = { document, location, navigator, doNotTrack: options.windowDNT };
    window.umami = { track(payload) {
        const clean = window.usefulAIAnalyticsBeforeSend('event', payload);
        if (clean) events.push(plain(clean));
    } };
    const sessionStorage = {
        getItem: key => { if (options.storageBlocked) throw Error('denied'); return storage.get(key); },
        setItem: (key, value) => { if (options.storageBlocked) throw Error('denied'); storage.set(key, value); },
    };
    runInNewContext(source, { window, document, navigator, location, sessionStorage, URL, URLSearchParams });
    if (options.load !== false) scripts[0]?.onload();
    return { scripts, events, listeners, window, navigator, storage, optOut };
}

function link(href, matches = []) {
    return {
        href, dataset: { digestItemId: '834', analyticsStory: 'ai-coding-costs' },
        hasAttribute: name => matches.includes('[' + name + ']'),
        closest(selector) { return selector === 'a[href]' || matches.includes(selector) ? this : null; },
    };
}
function click(env, target, overrides = {}) {
    env.listeners.click({ target, isTrusted: true, ...overrides });
}
function change(env, id, value) {
    env.listeners.change({ target: { id, value }, isTrusted: true });
}

test('manual pageview is single, sanitized, and configured without automatic collection', () => {
    const env = setup();
    assert.equal(env.scripts.length, 1);
    assert.equal(env.scripts[0].src, 'https://cloud.umami.is/script.js');
    assert.equal(env.scripts[0].referrerPolicy, 'no-referrer');
    assert.equal(env.scripts[0].attrs['data-auto-track'], 'false');
    assert.equal(env.scripts[0].attrs['data-performance'], 'false');
    assert.equal(env.scripts[0].attrs['data-do-not-track'], 'true');
    env.scripts[0].onload();
    assert.deepEqual(env.events, [{
        website: '45502ceb-6612-4753-82a7-11d449338391',
        hostname: 'usefulaiwerks.com', url: '/news.html', referrer: 'https://search.example',
    }]);
    assert.equal(setup({ url: 'https://usefulaiwerks.com/index.html' }).events[0].url, '/');
});

test('privacy signals, opt-out, automation, previews and unknown pages never load the tracker', () => {
    for (const options of [
        { navigator: { doNotTrack: '1' } }, { navigator: { doNotTrack: 1 } },
        { navigator: { msDoNotTrack: 'yes' } }, { windowDNT: '1' },
        { navigator: { globalPrivacyControl: true } }, { navigator: { webdriver: true } },
        { navigator: { userAgent: 'HeadlessChrome/140' } }, { navigator: { userAgent: 'ExampleBot' } },
        { url: 'https://usefulaiwerks.com/?analytics=off' }, { storageBlocked: true },
        { url: 'http://usefulaiwerks.com/' }, { url: 'http://localhost/news.html' },
        { url: 'https://preview.example/news.html' }, { url: 'https://usefulaiwerks.com/private' },
    ]) {
        const env = setup(options);
        assert.equal(env.scripts.length, 0, JSON.stringify(options));
        click(env, link('mailto:private@example.com'));
        assert.deepEqual(env.events, []);
    }
});

test('query and visible opt-out persist for later pages in the tab and stop pending sends', () => {
    const env = setup({ url: 'https://usefulaiwerks.com/?analytics=off' });
    assert.equal(env.optOut.textContent, 'Analytics is off for this tab.');
    assert.equal(setup({ storage: env.storage }).scripts.length, 0);
    const pending = setup({ load: false });
    click(pending, link('https://usefulaiwerks.com/?analytics=off', ['[data-analytics-opt-out]']));
    pending.scripts[0].onload();
    assert.deepEqual(pending.events, []);
    assert.equal(setup({ storage: pending.storage }).scripts.length, 0);
    const active = setup();
    active.navigator.globalPrivacyControl = true;
    click(active, link('mailto:private@example.com'));
    assert.equal(active.events.length, 1);
});

test('referral discovery retains external origins only', () => {
    for (const [referrer, expected] of [
        ['https://search.example/private/path?secret=yes#token', 'https://search.example'],
        ['http://news.example:8080/article?q=private', 'http://news.example:8080'],
        ['https://www.usefulaiwerks.com/news.html?secret=yes', ''],
        ['https://usefulaiwerks.com/', ''], ['not a URL', ''], ['', ''],
        ['https://user:password@example.com/', ''], ['mailto:private@example.com', ''],
    ]) assert.equal(setup({ referrer }).events[0].referrer, expected);
});

test('referrers and outbound links never send private hostnames or address literals', () => {
    for (const host of ['localhost', 'loop.localhost', '127.0.0.1', '10.2.3.4', '172.16.4.2', '192.168.1.42',
        '169.254.169.254', '[::1]', '[fc00::1234]', 'pocket', 'pocket.local', 'pocket.internal',
        'pocket.lan', 'router.home', 'pocket.household.ts.net', 'POCKET.HOUSEHOLD.TS.NET.', '8.8.8.8']) {
        const env = setup({ referrer: 'https://' + host + '/private?secret=yes' });
        assert.equal(env.events[0].referrer, '', host);
        click(env, link('https://' + host + '/story', ['.news-card']));
        assert.equal(env.events.length, 1, host);
        assert.equal(env.window.usefulAIAnalyticsBeforeSend('event', {
            name: 'outbound_story_click', data: { destination: host, surface: 'digest' },
        }), false, host);
    }
});

test('interaction taxonomy includes only approved dimensions and never addresses or URL queries', () => {
    const env = setup();
    click(env, link('https://publisher.example/story?email=private@example.com#private', ['.news-card']));
    click(env, link('https://www.linkedin.com/some/post?private=yes', ['.essay-card']));
    click(env, link('https://source.example/report?private=yes', ['.blog-content']));
    click(env, link('https://newsletter.example/signup', ['.news-card', '.news-newsletter']));
    click(env, link('https://usefulaiwerks.com/news.html?theme=ai-regulation&email=private@example.com'));
    click(env, { dataset: { analyticsTheme: 'open-weights' }, closest: s => s === '[data-analytics-theme]' ? { dataset: { analyticsTheme: 'open-weights' } } : null });
    change(env, 'news-theme', 'agentic-commerce');
    change(env, 'news-theme', 'private@example.com');
    change(env, 'news-theme', '');
    change(env, 'perspectives-author', 'persephone');
    change(env, 'perspectives-author', 'private@example.com');
    click(env, link('https://usefulaiwerks.com/perspectives.html?author=chris-morrow&private=yes'));
    click(env, link('https://usefulaiwerks.com/feed.xml?private=yes'));
    click(env, link('mailto:private@example.com?subject=secret'));
    click(env, link('https://usefulaiwerks.com/#contact?private=yes'));
    click(env, link('https://usefulaiwerks.com/#about'));
    click(env, link('mailto:private@example.com'), { isTrusted: false });
    assert.deepEqual(env.events.slice(1).map(({ name, data }) => ({ name, data })), [
        { name: 'outbound_story_click', data: { destination: 'publisher.example', surface: 'digest', digest_item_id: 834 } },
        { name: 'outbound_story_click', data: { destination: 'www.linkedin.com', surface: 'perspectives', story_id: 'ai-coding-costs' } },
        { name: 'outbound_story_click', data: { destination: 'source.example', surface: 'article' } },
        { name: 'theme_navigation', data: { theme: 'ai-regulation' } },
        { name: 'theme_filter', data: { theme: 'open-weights' } },
        { name: 'theme_filter', data: { theme: 'agentic-commerce' } },
        { name: 'theme_filter', data: { theme: 'other' } },
        { name: 'theme_filter', data: { theme: 'all' } },
        { name: 'author_selection', data: { author: 'persephone' } },
        { name: 'author_selection', data: { author: 'chris-morrow' } },
        { name: 'rss_click', data: {} }, { name: 'contact_click', data: {} },
        { name: 'navigation_click', data: { destination: '/' } },
        { name: 'navigation_click', data: { destination: '/#about' } },
    ]);
    assert.doesNotMatch(JSON.stringify(env.events), /private|secret|email|subject|conversion/);
});

test('different stories on the same destination host keep stable identifiers', () => {
    const env = setup();
    for (const id of ['834', '835']) {
        const story = link('https://publisher.example/article', ['.news-card']);
        story.dataset.digestItemId = id;
        click(env, story);
    }
    for (const id of ['ai-coding-costs', 'agentic-commerce-trust']) {
        const story = link('https://www.linkedin.com/post', ['.essay-card']);
        story.dataset.analyticsStory = id;
        click(env, story);
    }
    assert.deepEqual(env.events.slice(1, 3).map(event => event.data.digest_item_id), [834, 835]);
    assert.deepEqual(env.events.slice(3).map(event => event.data.story_id), ['ai-coding-costs', 'agentic-commerce-trust']);
    const invalid = link('https://publisher.example/article', ['.news-card']);
    invalid.dataset.digestItemId = 'private@example.com';
    click(env, invalid);
    const unknown = link('https://www.linkedin.com/post', ['.essay-card']);
    unknown.dataset.analyticsStory = 'private@example.com';
    click(env, unknown);
    assert.equal(env.events.length, 5);
});

test('before-send rejects unapproved events, identification and performance; strips extra metadata', () => {
    const { window } = setup();
    const send = window.usefulAIAnalyticsBeforeSend;
    for (const type of ['identify', 'performance', 'replay']) assert.equal(send(type, {}), false);
    for (const payload of [
        { name: 'newsletter_signup' }, { name: 'author_selection', data: { author: 'private' } },
        { name: 'navigation_click', data: { destination: '/secret?email=private' } },
        { name: 'outbound_story_click', data: { destination: 'example.com/path', surface: 'digest' } },
        { name: 'outbound_story_click', data: { destination: 'private@example.com', surface: 'digest' } },
        { name: 'outbound_story_click', data: { destination: 'example.com', surface: 'private' } },
    ]) assert.equal(send('event', payload), false);
    const clean = plain(send('event', { name: 'contact_click', url: '/secret', referrer: 'https://evil.test/secret', title: 'secret', screen: 'secret', id: 'private', data: { email: 'private@example.com' } }));
    assert.deepEqual(Object.keys(clean).sort(), ['website', 'hostname', 'url', 'referrer', 'name', 'data'].sort());
    assert.deepEqual(clean.data, {});
    assert.doesNotMatch(JSON.stringify(clean), /secret|private/);
});

test('tracker failures do not throw or prevent navigation', () => {
    const env = setup({ load: false });
    click(env, link('mailto:private@example.com'));
    assert.deepEqual(env.events, []);
    env.window.umami.track = () => { throw Error('blocked'); };
    assert.doesNotThrow(() => env.scripts[0].onload());
    assert.doesNotThrow(() => click(env, link('mailto:private@example.com')));
});

test('all public pages carry notice and script; digest rebuild preserves analytics, verification and feed', async () => {
    const pages = ['index.html', 'news.html', 'perspectives.html', 'three-windows-ai-safety.html', 'two-financing-paths.html'];
    for (const file of pages) {
        const html = await readFile(new URL(file, root), 'utf8');
        assert.equal((html.match(/src="js\/analytics.js\?v=20260923"/g) || []).length, 1, file);
        assert.equal((html.match(/data-analytics-opt-out/g) || []).length, 1, file);
        if (file === 'index.html' || file === 'perspectives.html') {
            assert.equal((html.match(/data-analytics-story=/g) || []).length, 2, file);
            for (const id of ['ai-coding-costs', 'agentic-commerce-trust']) assert.ok(html.includes('data-analytics-story="' + id + '"'));
        }
    }
    const feed = JSON.parse(await readFile(new URL('news.json', root), 'utf8'));
    const news = await readFile(new URL('news.html', root), 'utf8');
    for (const item of feed.items) assert.ok(news.includes('data-digest-item-id="' + item.digestItemId + '"'));
    const fixture = await mkdtemp(join(tmpdir(), 'analytics-build-test-'));
    for (const file of ['index.html', 'news.html', 'feed.xml', 'news.json', 'scripts', 'js']) {
        await cp(new URL(file, root), join(fixture, file), { recursive: true });
    }
    await promisify(execFile)(process.execPath, [join(fixture, 'scripts/build-digest.mjs')]);
    for (const file of ['index.html', 'news.html', 'feed.xml']) {
        assert.equal(await readFile(join(fixture, file), 'utf8'), await readFile(new URL(file, root), 'utf8'), file + ' rebuild drift');
    }
    assert.match(await readFile(join(fixture, 'index.html'), 'utf8'), /<meta name="google-site-verification" content="Gi1Rhk4SdFHOEY-OUPuQZnoOpq0iUDHMZmSGSKCvluc" \/>/);
});
