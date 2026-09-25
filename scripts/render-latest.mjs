// Private integration candidate only; consumes the already-published reviewed feed.
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const latestSection = /    <section id="latest"(?=[\s>])[\s\S]*?    <\/section>/g;
function safeURL(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password) throw Error('Unsafe newsletter URL');
  return escape(url.href);
}
export function renderLatest(template, feed, {preview=true}={}) {
  if (preview && !/<meta name="robots" content="noindex,nofollow"(?: data-preview-robots)?\s*>/.test(template)) throw Error('Private preview marker required');
  if ([...template.matchAll(latestSection)].length !== 1) throw Error('Exactly one latest section required');
  if (feed.version !== 1 || !Array.isArray(feed.items) || !feed.items.length) throw Error('Nonempty version-one feed required');
  const anchors = new Set();
  const storyIds = new Set();
  for (const item of feed.items) {
    if (item.reviewed !== true) throw Error('Unreviewed item');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.digestDate) || !Number.isFinite(Date.parse(item.digestDate)) || new Date(item.digestDate).toISOString().slice(0,10) !== item.digestDate) throw Error('Invalid edition date');
    if (!/^story-[a-z0-9-]+$/.test(item.anchor || '') || anchors.has(item.anchor)) throw Error('Invalid or duplicate stable anchor');
    anchors.add(item.anchor);
    for (const key of ['title','summary','source']) if (typeof item[key] !== 'string' || !item[key].trim()) throw Error(`Missing ${key}`);
    if (!Number.isSafeInteger(item.digestItemId) || item.digestItemId < 1) throw Error('Invalid story ID');
    if (storyIds.has(item.digestItemId)) throw Error('Invalid or duplicate story ID');
    storyIds.add(item.digestItemId);
    for (const credit of item.newsletters || []) safeURL(credit.signupUrl);
  }
  const date = feed.items.map(i => i.digestDate).sort().at(-1);
  if (feed.digestDate !== date) throw Error('Feed edition does not match newest items');
  const selected = feed.items.filter(i => i.digestDate === date);
  const cards = selected.map((item, index) => `        <article class="${index === 0 ? 'lead-card' : 'news-card'}" data-digest-item-id="${item.digestItemId}">
          <p class="meta">${escape(item.source)}</p>
          <h3><a href="https://usefulaiwerks.com/news.html#${item.anchor}">${escape(item.title)}</a></h3>
          <p class="news-summary">${escape(item.summary)}</p>
${item.whyItMatters ? `          <p class="news-why">${escape(item.whyItMatters)}</p>\n` : ''}${item.editorialNote ? `          <p class="meta news-editorial-note">${escape(item.editorialNote)}</p>\n` : ''}${(item.newsletters || []).map(n => `          <p class="meta news-newsletter">${escape(n.name)} · <a href="${safeURL(n.signupUrl)}">Subscribe</a></p>\n`).join('')}        </article>`).join('\n');
  const section = `    <section id="latest" aria-labelledby="latest-heading">
      <div class="section-heading">
        <div><p class="kicker">Latest edition · <time datetime="${date}">${date}</time></p><h2 id="latest-heading">Latest stories</h2></div>
        <a href="https://usefulaiwerks.com/news.html">All stories →</a>
      </div>
      <p class="meta" role="status">${escape(feed.notice || `Edition ${date}`)}</p>
      <p><a href="https://usefulaiwerks.com/feed.xml">Follow with RSS →</a></p>
      <div class="latest-grid">
${cards}
      </div>
    </section>`;
  return template.replace(latestSection, () => section);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [templatePath, feedPath, outputPath] = process.argv.slice(2);
  if (!templatePath || !feedPath || !outputPath) throw Error('Usage: render-latest.mjs TEMPLATE FEED OUTPUT');
  const result = renderLatest(await readFile(templatePath, 'utf8'), JSON.parse(await readFile(feedPath, 'utf8')));
  await writeFile(outputPath, result);
  console.log(`Private preview rendered: ${outputPath}`);
}
