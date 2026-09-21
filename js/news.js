import { selectNews, newsAnchor, freshnessMessage, sourceName } from './news-model.js?v=20260920';

const status = document.getElementById('news-status');
const list = document.getElementById('news-items');

async function loadNews() {
    try {
        const response = await fetch('news.json', { cache: 'no-store', signal: AbortSignal.timeout(8000) });
        if (!response.ok) throw new Error('unavailable');
        const feed = await response.json();
        if (feed.version !== 1 || !Array.isArray(feed.items)) throw new Error('invalid');
        status.textContent = freshnessMessage(feed);
        const items = feed.items.filter(item => {
            try {
                const url = new URL(item.url);
                return url.protocol === 'https:' && !url.username && !url.password
                    && typeof item.summary === 'string' && item.summary.trim()
                    && typeof item.title === 'string' && typeof item.source === 'string'
                    && /^\d{4}-\d{2}-\d{2}$/.test(item.digestDate)
                    && Array.isArray(item.tags) && item.tags.length > 0 && item.tags.every(tag => typeof tag === 'string');
            } catch { return false; }
        });
        const controls = document.createElement('div');
        controls.className = 'news-controls';
        controls.setAttribute('role', 'group');
        controls.setAttribute('aria-label', 'Filter and sort articles');
        function select(id, labelText, options) {
            const wrapper = document.createElement('div');
            wrapper.className = 'news-control';
            const label = document.createElement('label');
            label.htmlFor = id;
            label.textContent = labelText;
            const field = document.createElement('select');
            field.id = id;
            for (const [value, text] of options) {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = text;
                field.append(option);
            }
            wrapper.append(label, field);
            controls.append(wrapper);
            return field;
        }
        const topics = [...new Set(items.flatMap(item => item.tags))].sort();
        const sources = [...new Set(items.map(item => sourceName(item.source)))].sort();
        const topic = select('news-topic', 'Topic', [['', 'All topics'], ...topics.map(tag => [tag, tag])]);
        const source = select('news-source', 'Source', [['', 'All sources'], ...sources.map(name => [name, name])]);
        const themes = [...new Map(items.flatMap(item => (item.themes || []).map(t => [t.id, t]))).values()].sort((a,b) => a.name.localeCompare(b.name));
        const theme = select('news-theme', 'Developing story', [['', 'All developing stories'], ...themes.map(t => [t.id, t.name])]);
        const sort = select('news-sort', 'Sort by', [['newest', 'Newest digest first'], ['oldest', 'Oldest digest first'], ['title', 'Title A–Z']]);
        const clear = document.createElement('button');
        clear.type = 'button';
        clear.className = 'news-clear';
        clear.textContent = 'Clear filters';
        controls.append(clear);
        const count = document.createElement('p');
        count.id = 'news-count';
        count.className = 'reading-note';
        count.setAttribute('role', 'status');
        list.before(controls, count);
        function render() {
            const visible = selectNews(items, { topic: topic.value, source: source.value, theme: theme.value, sort: sort.value });
            list.replaceChildren();
            count.textContent = 'Showing ' + visible.length + ' of ' + items.length + ' articles from recent digests.';
            clear.disabled = !topic.value && !source.value && !theme.value && sort.value === 'newest';
            if (theme.value && visible.length) {
                const dates = visible.map(i => i.digestDate).sort();
                count.textContent += ` Thread spans ${dates[0]} to ${dates.at(-1)}. Choose “Oldest digest first” to follow its development.`;
            }
            if (!visible.length) {
                const empty = document.createElement('p');
                empty.className = 'news-empty';
                empty.textContent = items.length ? 'No articles match these filters. Try another topic or clear the filters.' : 'The first edition is coming soon.';
                list.append(empty);
            }
            for (const item of visible) {
                const card = document.createElement('article');
                card.className = 'news-card';
                card.id = newsAnchor(item);
                card.dataset.date = item.digestDate;
                const meta = document.createElement('p');
                meta.className = 'post-meta';
                meta.textContent = item.source + ' · Edition ' + item.digestDate;
                const heading = document.createElement('h3');
                const link = document.createElement('a');
                link.href = item.url;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = item.title;
                if (item.linkKind === 'newsletter') heading.textContent = item.title;
                else heading.append(link);
                const summary = document.createElement('p');
                summary.className = 'news-summary';
                summary.textContent = item.summary;
                const tags = document.createElement('div');
                tags.className = 'news-tags';
                tags.setAttribute('aria-label', 'Article topics');
                for (const tag of item.tags) {
                    const button = document.createElement('button');
                    button.type = 'button';
                    button.className = 'news-tag';
                    button.textContent = tag;
                    button.setAttribute('aria-label', 'Filter by ' + tag);
                    button.addEventListener('click', () => {
                        topic.value = tag;
                        render();
                        topic.focus({ preventScroll: true });
                        controls.scrollIntoView({ block: 'center' });
                    });
                    tags.append(button);
                }
                const note = document.createElement('p');
                note.className = 'reading-note';
                note.textContent = item.linkKind === 'newsletter' ? 'From newsletters' : 'Read the original ↗';
                card.append(meta, heading, summary);
                if (item.linkKind === 'newsletter') {
                    const disclosure = document.createElement('p');
                    disclosure.className = 'newsletter-only';
                    disclosure.textContent = 'From newsletters · Subscription links below.';
                    heading.after(disclosure);
                }
                if (item.whyItMatters) {
                    const whyLabel = document.createElement('p');
                    whyLabel.className = 'reading-note';
                    whyLabel.textContent = 'Why it matters';
                    const why = document.createElement('p');
                    why.className = 'news-summary news-why';
                    why.textContent = item.whyItMatters;
                    card.append(whyLabel, why);
                }
                if (item.editorialNote) {
                    const editorial = document.createElement('p');
                    editorial.className = 'small-note'; editorial.textContent = item.editorialNote; card.append(editorial);
                }
                for (const t of item.themes || []) {
                    const follow = document.createElement('button'); follow.type = 'button'; follow.className = 'news-tag';
                    follow.textContent = 'More: ' + t.name;
                    follow.addEventListener('click', () => { topic.value = source.value = ''; theme.value = t.id; render(); theme.focus(); });
                    card.append(follow);
                }
                card.append(tags);
                if (item.linkKind !== 'newsletter') {
                    const read = document.createElement('a'); read.href = item.url; read.target = '_blank'; read.rel = 'noopener noreferrer'; read.textContent = 'Read the original ↗'; note.replaceChildren(read); card.append(note);
                }
                for (const newsletter of item.newsletters || []) {
                    const attribution = document.createElement('p');
                    attribution.className = 'reading-note news-newsletter';
                    attribution.append(document.createTextNode(newsletter.name + ' · '));
                    const signup = document.createElement('a');
                    const signupUrl = new URL(newsletter.signupUrl);
                    if (signupUrl.protocol !== 'https:' || signupUrl.username || signupUrl.password || signupUrl.search || signupUrl.hash) continue;
                    signup.href = signupUrl.href;
                    signup.target = '_blank';
                    signup.rel = 'noopener noreferrer';
                    signup.textContent = 'Subscribe ↗';
                    attribution.append(signup);
                    card.append(attribution);
                }
                list.append(card);
            }
        }
        [topic, source, theme, sort].forEach(field => field.addEventListener('change', render));
        const selectedTheme = new URLSearchParams(location.search).get('theme');
        if (themes.some(t => t.id === selectedTheme)) theme.value = selectedTheme;
        clear.addEventListener('click', () => {
            topic.value = source.value = theme.value = '';
            sort.value = 'newest';
            render();
            topic.focus();
        });
        render();
        if (location.hash.startsWith('#story-')) {
            document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' });
        }
    } catch {
        status.textContent = 'The reading list is temporarily unavailable. Please try again later; the articles above are still available.';
    }
}
if (status && list) loadNews();
