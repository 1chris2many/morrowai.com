(function () {
    'use strict';
    var selector = document.getElementById('perspectives-author');
    var cards = Array.from(document.querySelectorAll('#perspectives-list [data-author-id]'));
    var count = document.getElementById('perspectives-count');
    var empty = document.getElementById('perspectives-empty');
    if (!selector || !count || !empty) return;
    selector.closest('.perspectives-tools').classList.add('enhanced');

    function filter() {
        var author = selector.value;
        var visible = 0;
        cards.forEach(function (card) {
            card.hidden = author !== 'all' && card.dataset.authorId !== author;
            if (!card.hidden) visible++;
        });
        count.textContent = visible + (visible === 1 ? ' piece' : ' pieces');
        empty.hidden = visible !== 0;
    }
    selector.addEventListener('change', filter);
    filter();
}());
