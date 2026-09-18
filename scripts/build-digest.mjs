// Generate only public artifacts from the reviewed public feed. No private sources.
import { readFile, writeFile } from 'node:fs/promises';
import { newsAnchor, selectNews } from '../js/news-model.js';
import { nav, footer } from './site-layout.mjs';

const root = new URL('../', import.meta.url);
const feed = JSON.parse(await readFile(new URL('news.json', root), 'utf8'));
if (feed.version !== 1 || !feed.items.length || feed.items.some(item => item.reviewed !== true)) throw Error('Only reviewed public items may be built');
const items = selectNews(feed.items);
if (new Set(items.map(newsAnchor)).size !== items.length) throw Error('Duplicate story anchors');
const e = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const publicURL = item => 'https://usefulaiwerks.com/news.html#' + newsAnchor(item);
function safeURL(raw) {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password) throw Error('Unsafe public URL');
    return e(url.href);
}
function credits(item) {
    return ((item.newsletters || []).length > 1 ? `<p class="small-note">This summary draws on ${item.newsletters.length} newsletter sources. The links below are optional subscriptions to those sources, not links to the underlying articles.</p>` : '') + (item.newsletters || []).map(n => `<p class="reading-note news-newsletter">Newsletter source: ${e(n.name)} · <a href="${safeURL(n.signupUrl)}" target="_blank" rel="noopener noreferrer">Sign up for ${e(n.name)} ↗</a></p>`).join('\n');
}
function card(item) {
    return `<article class="news-card" id="${newsAnchor(item)}" data-date="${e(item.digestDate)}">
<p class="post-meta">${e(item.source)} · In digest ${e(item.digestDate)}</p>
<h3>${item.linkKind === 'newsletter' ? e(item.title) : `<a href="${safeURL(item.url)}" target="_blank" rel="noopener noreferrer">${e(item.title)}</a>`}</h3>
${item.linkKind === 'newsletter' ? '<p class="newsletter-only">Newsletter-sourced · No direct article link available in this snapshot. Signup links are below.</p>' : ''}
<p class="news-summary">${e(item.summary)}</p>
${item.whyItMatters ? `<p class="reading-note">Why it matters</p><p class="news-summary news-why">${e(item.whyItMatters)}</p>` : ''}
${item.editorialNote ? `<p class="small-note">${e(item.editorialNote)}</p>` : ''}
${(item.themes || []).map(t => `<p class="reading-note"><a href="news.html?theme=${encodeURIComponent(t.id)}">Follow: ${e(t.name)} →</a></p>`).join('')}
<p class="reading-note">${item.tags.map(e).join(' · ')}</p>
${credits(item)}</article>`;
}
const latest = items.map(i => i.digestDate).sort().at(-1);
const themes = [...new Map(items.flatMap(i => (i.themes || []).map(t => [t.id,t]))).values()];
const threadIndex = `<details class="digest-method"><summary id="threads-title">Developing stories — ${themes.length} threads</summary><p class="small-note">Follow related coverage across digest editions. Topic tags group broad subjects; these threads track a continuing story. Grouping is editorial and does not establish causation.</p><ul>${themes.map(t => {const related=items.filter(i=>(i.themes||[]).some(x=>x.id===t.id));const dates=related.map(i=>i.digestDate).sort();return `<li><a href="news.html?theme=${encodeURIComponent(t.id)}">${e(t.name)}</a> · ${related.length} stories · ${dates[0]}–${dates.at(-1)}</li>`;}).join('')}</ul></details>`;
const snapshot = feed.notice.match(/Snapshot published (\d{4}-\d{2}-\d{2})/)?.[1];
if (!snapshot) throw Error('Snapshot publication date must be explicit');
const news = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI Digest — Useful AI Werks</title><meta name="description" content="Source-linked AI news, full digest summaries, topic filters, and an RSS feed from Useful AI Werks.">
<link rel="canonical" href="https://usefulaiwerks.com/news.html"><meta property="og:url" content="https://usefulaiwerks.com/news.html"><meta property="og:title" content="AI Digest — Useful AI Werks"><meta property="og:type" content="website">
<link rel="alternate" type="application/rss+xml" title="Useful AI Werks — AI Digest" href="feed.xml">
<link rel="stylesheet" href="css/style.css?v=20260915"><link rel="stylesheet" href="css/news.css"><link rel="stylesheet" href="css/editorial.css?v=20260915">
</head><body class="editorial">${nav}
<main class="container news-main" id="main"><header class="digest-intro"><p class="eyebrow">The reading list</p><h1>AI Digest</h1><p>AI news from our daily reading list, usually prepared by Raven. Full summaries, source links, and context. Recovery editions are labeled.</p>
<div class="section-actions"><a class="text-link" href="feed.xml">Follow with RSS ↗</a><a class="text-link" href="./#essays">Read Chris’s essays →</a></div>
<p id="news-status" class="small-note" role="status">${e(feed.notice)}</p>
<details class="digest-method"><summary>How this digest is prepared</summary><p class="small-note">Top Stories summaries are reproduced verbatim from the morning digest. A deterministic publisher checks source links, digest provenance and privacy before updating this page and RSS. Personal commentary is withheld rather than silently rewritten. Held items do not block other valid stories. Updates are targeted each morning by 8 AM Pacific; delayed editions are labeled and publication failures alert the operator. No system can guarantee uninterrupted delivery.</p></details></header>
${threadIndex}
<div class="digest-tools"><noscript><p>All stories are available below. Enable JavaScript for topic/source filters and sorting.</p></noscript></div>
<div id="news-items" class="news-grid">${items.map(card).join('\n')}</div></main>${footer}<script src="js/main.js?v=20260915"></script><script type="module" src="js/news.js"></script></body></html>\n`;

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Useful AI Werks — AI Digest</title><link>https://usefulaiwerks.com/news.html</link><description>Top Stories from the daily AI digest, reproduced verbatim with sources. Commentary is separate from Chris Morrow’s essays. Dates identify digest editions. Recovery editions are labeled. Snapshot published ${snapshot}.</description><language>en-us</language><atom:link href="https://usefulaiwerks.com/feed.xml" rel="self" type="application/rss+xml"/>
${items.map(item => {
    const body = `<p>In digest ${e(item.digestDate)} · ${e(item.source)}</p><p>${e(item.summary)}</p>` + (item.whyItMatters ? `<p><strong>Why it matters</strong></p><p>${e(item.whyItMatters)}</p>` : '') + (item.editorialNote ? `<p>${e(item.editorialNote)}</p>` : '') + (item.linkKind === 'newsletter' ? '<p>Newsletter-sourced; no direct article link available in this snapshot.</p>' : `<p><a href="${safeURL(item.url)}">Read the source article</a></p>`) + credits(item);
    return `<item><title>${e(item.title)}</title><link>${item.linkKind === 'newsletter' ? e(publicURL(item)) : safeURL(item.url)}</link><guid isPermaLink="true">${e(publicURL(item))}</guid><description>${e(body)}</description>${item.tags.map(tag => `<category>${e(tag)}</category>`).join('')}</item>`;
}).join('\n')}</channel></rss>\n`;
const indexPath = new URL('index.html', root);
const index = await readFile(indexPath, 'utf8');
const marker = /<!-- DIGEST_PREVIEW_START -->[\s\S]*?<!-- DIGEST_PREVIEW_END -->/;
if (!marker.test(index)) throw Error('Homepage digest preview markers missing');
// Headlines only are navigation; full approved text remains visible on the digest.
const preview = `<!-- DIGEST_PREVIEW_START -->\n<p class="small-note">Latest included digest: <time datetime="${latest}">${latest}</time> · Snapshot published ${snapshot}</p><ol class="digest-preview">${items.slice(0, 3).map(item => `<li><a href="news.html#${newsAnchor(item)}">${e(item.title)}</a><p class="small-note">${e(item.source)} · ${e(item.digestDate)}${item.linkKind === 'newsletter' ? ' · Newsletter-sourced' : ''}</p></li>`).join('')}</ol>\n<!-- DIGEST_PREVIEW_END -->`;
await writeFile(new URL('news.html', root), news);
await writeFile(new URL('feed.xml', root), rss);
await writeFile(indexPath, index.replace(marker, preview));
console.log(`Built ${items.length} reviewed stories, RSS entries and homepage headlines; digest ${latest}, snapshot ${snapshot}.`);
