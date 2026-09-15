// Pure local view logic: filtering does not fetch again or call a model.
export function newsAnchor(item) {
    return 'story-' + item.digestDate + '-' + item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export function selectNews(items, { topic = '', source = '', sort = 'newest' } = {}) {
    return items.filter(item => (!topic || item.tags.includes(topic)) && (!source || item.source === source))
        .sort((a, b) => {
            const title = a.title.localeCompare(b.title);
            if (sort === 'title') return title;
            const date = a.digestDate.localeCompare(b.digestDate);
            return (sort === 'oldest' ? date : -date) || title;
        });
}
