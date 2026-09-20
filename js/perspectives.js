(function () {
    'use strict';
    var selector = document.getElementById('perspectives-author');
    var cards = Array.from(document.querySelectorAll('#perspectives-list [data-author-id]'));
    var count = document.getElementById('perspectives-count');
    var empty = document.getElementById('perspectives-empty');
    if (!selector || !count || !empty) return;
    selector.closest('.perspectives-tools').classList.add('enhanced');
    var requestedAuthor = new URLSearchParams(window.location.search).get('author');
    var validAuthor = requestedAuthor && Array.from(selector.options).some(function (option) { return option.value === requestedAuthor; });
    if (validAuthor) {
        selector.value = requestedAuthor;
    }

    function filter(updateAddress) {
        var author = selector.value;
        var visible = 0;
        cards.forEach(function (card) {
            card.hidden = author !== 'all' && card.dataset.authorId !== author;
            if (!card.hidden) visible++;
        });
        count.textContent = visible + (visible === 1 ? ' piece' : ' pieces');
        empty.hidden = visible !== 0;
        if (updateAddress) {
            var url = new URL(window.location.href);
            if (author === 'all') url.searchParams.delete('author');
            else url.searchParams.set('author', author);
            window.history.replaceState(null, '', url.pathname + url.search + url.hash);
        }
    }
    selector.addEventListener('change', function () { filter(true); });
    // Normalize only invalid/empty author queries; preserve other params/hash.
    filter(requestedAuthor !== null && !validAuthor);
}());
