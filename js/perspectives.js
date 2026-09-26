(function () {
    'use strict';
    var selector = document.getElementById('perspectives-author');
    var cards = Array.from(document.querySelectorAll('#perspectives-list [data-author-id]'));
    var count = document.getElementById('perspectives-count');
    var empty = document.getElementById('perspectives-empty');
    if (!selector || !count || !empty) return;
    var baseTitle = document.title;
    selector.closest('.perspectives-tools').classList.add('enhanced');
    var requestedAuthor = new URLSearchParams(window.location.search).get('author');
    var validAuthor = requestedAuthor && Array.from(selector.options).some(function (option) { return option.value === requestedAuthor; });
    if (validAuthor) {
        selector.value = requestedAuthor;
    }

    function filter(historyMode) {
        var author = selector.value;
        var selectedOption = Array.from(selector.options).find(function (option) { return option.value === author; });
        var visible = 0;
        cards.forEach(function (card) {
            card.hidden = author !== 'all' && card.dataset.authorId !== author;
            if (!card.hidden) visible++;
        });
        count.textContent = visible + (visible === 1 ? ' piece' : ' pieces') +
            (author === 'all' ? ', all authors' : ' by ' + (selectedOption ? selectedOption.text : author));
        document.title = author === 'all' || !selectedOption ? baseTitle : selectedOption.text + ' — ' + baseTitle;
        empty.hidden = visible !== 0;
        if (historyMode) {
            var url = new URL(window.location.href);
            if (author === 'all') url.searchParams.delete('author');
            else url.searchParams.set('author', author);
            window.history[historyMode + 'State'](null, '', url.pathname + url.search + url.hash);
        }
    }
    selector.addEventListener('change', function () { filter('push'); });
    window.addEventListener('popstate', function () {
        var author = new URLSearchParams(window.location.search).get('author');
        selector.value = author && Array.from(selector.options).some(function (option) { return option.value === author; }) ? author : 'all';
        filter(false);
    });
    // Normalize only invalid/empty author queries; preserve other params/hash.
    filter(requestedAuthor !== null && !validAuthor ? 'replace' : false);
}());
