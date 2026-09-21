// Pure local view logic: filtering does not fetch again or call a model.
export function newsAnchor(item) {
    if (/^story-[a-z0-9-]+$/.test(item.anchor || '')) return item.anchor;
    return 'story-' + item.digestDate + '-' + item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export function freshnessMessage(feed, now = new Date()) {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(now);
    const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', hourCycle: 'h23' }).format(now));
    if (feed.digestDate < today && hour >= 8) return `Update delayed — latest edition: ${feed.digestDate}.`;
    return feed.notice;
}
export function selectNews(items, { topic = '', source = '', theme = '', sort = 'newest' } = {}) {
    return items.filter(item => (!topic || item.tags.includes(topic)) && (!source || sourceName(item.source) === source) && (!theme || (item.themes || []).some(t => t.id === theme)))
        .sort((a, b) => {
            const title = a.title.localeCompare(b.title);
            if (sort === 'title') return title;
            const date = a.digestDate.localeCompare(b.digestDate);
            return (sort === 'oldest' ? date : -date) || title;
        });
}

// Source dates belong on cards, not in the publisher filter.
export function sourceName(source) { return source.replace(/\s+—\s+.*$/, ''); }
