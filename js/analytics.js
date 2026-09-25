/* Small, explicit Umami event set. Public configuration; no credentials. */
(function () {
    'use strict';

    var website = '45502ceb-6612-4753-82a7-11d449338391';
    var hosts = ['usefulaiwerks.com', 'www.usefulaiwerks.com'];
    var pages = ['/', '/news.html', '/themes.html', '/perspectives.html', '/two-financing-paths.html', '/three-windows-ai-safety.html'];
    var themes = ['ai-regulation', 'ai-infrastructure', 'workplace-agents', 'open-weights', 'recursive-ai', 'safety-vs-capability', 'agentic-commerce', 'openai-ipo', 'us-china', 'agent-economics'];
    var authors = ['all', 'chris-morrow', 'persephone'];
    var stories = ['ai-coding-costs', 'agentic-commerce-trust'];
    var optOutKey = 'usefulaiwerks.analytics.off';
    var stopped = false;
    var ready = false;
    var page = location.pathname === '/index.html' ? '/' : location.pathname;

    function optedOut() {
        try {
            if (new URLSearchParams(location.search).get('analytics') === 'off') {
                sessionStorage.setItem(optOutKey, '1');
                stopped = true;
            }
            return stopped || sessionStorage.getItem(optOutKey) === '1';
        } catch (_) { return true; } // Fail closed if the preference cannot be read.
    }

    function permitted() {
        var dnt = [navigator.doNotTrack, navigator.msDoNotTrack, window.doNotTrack];
        return !optedOut() && !navigator.globalPrivacyControl && !navigator.webdriver
            && !dnt.some(function (value) { return value === '1' || value === 1 || value === 'yes'; })
            && !/bot|crawler|spider|headless|playwright|puppeteer/i.test(navigator.userAgent || '')
            && location.protocol === 'https:' && hosts.includes(location.hostname) && pages.includes(page);
    }

    function publicHostname(value) {
        var host = value.toLowerCase().replace(/\.$/, '');
        // Exclude address literals and common private/intranet naming schemes,
        // including tailnet device names. Referral discovery needs public sites.
        return host.includes('.') && !host.includes(':') && !/^[\d.]+$/.test(host)
            && !/(^|\.)(localhost|local|internal|lan|home|ts\.net)$/.test(host);
    }

    function referrerOrigin() {
        try {
            var url = new URL(document.referrer);
            if (/^https?:$/.test(url.protocol) && !url.username && !url.password && !hosts.includes(url.hostname)
                && publicHostname(url.hostname)) return url.origin;
        } catch (_) { /* No referring site. */ }
        return '';
    }

    function basePayload() {
        return { website: website, hostname: location.hostname, url: page, referrer: referrerOrigin() };
    }

    function themeId(value) {
        return value === '' ? 'all' : themes.includes(value) ? value : 'other';
    }

    // Rebuild payloads from an allowlist, including events: Umami's string form
    // would otherwise add the document title and full referring URL by default.
    window.usefulAIAnalyticsBeforeSend = function (type, payload) {
        if (type !== 'event' || !permitted()) return false;
        var clean = basePayload();
        if (!payload.name) return clean;
        var data = payload.data || {};
        var dimensions;
        switch (payload.name) {
        case 'outbound_story_click':
            if (!['digest', 'perspectives', 'article'].includes(data.surface)) return false;
            try {
                var destination = new URL('https://' + data.destination);
                if (destination.hostname !== data.destination || destination.username || destination.password
                    || !publicHostname(destination.hostname)) return false;
            } catch (_) { return false; }
            dimensions = { destination: destination.hostname, surface: data.surface };
            if (data.surface === 'digest') {
                if (!Number.isSafeInteger(data.digest_item_id) || data.digest_item_id <= 0) return false;
                dimensions.digest_item_id = data.digest_item_id;
            }
            if (data.surface === 'perspectives') {
                if (!stories.includes(data.story_id)) return false;
                dimensions.story_id = data.story_id;
            }
            break;
        case 'theme_filter':
        case 'theme_navigation':
            dimensions = { theme: data.theme === 'all' ? 'all' : themeId(data.theme) };
            break;
        case 'author_selection':
            if (!authors.includes(data.author)) return false;
            dimensions = { author: data.author };
            break;
        case 'navigation_click':
            if (!pages.includes(data.destination) && !['/#about', '/#contact', '/#essays', '/#latest', '/#developing', '/#perspectives', '/#team'].includes(data.destination)) return false;
            dimensions = { destination: data.destination };
            break;
        case 'rss_click':
        case 'contact_click':
            dimensions = {};
            break;
        default: return false;
        }
        clean.name = payload.name;
        clean.data = dimensions;
        return clean;
    };

    function track(name, data) {
        if (!ready || !permitted() || !window.umami) return;
        var payload = basePayload();
        if (name) { payload.name = name; payload.data = data || {}; }
        // Analytics is optional; failure must not interfere with navigation.
        try {
            var result = window.umami.track(payload);
            if (result && result.catch) result.catch(function () {});
        } catch (_) { /* Site behavior does not depend on analytics. */ }
    }

    function showOptOut() {
        document.querySelectorAll('[data-analytics-opt-out]').forEach(function (link) {
            link.textContent = 'Analytics is off for this tab.';
        });
    }

    document.addEventListener('click', function (event) {
        if (!event.target.closest) return;
        var link = event.target.closest('a[href]');
        if (link && link.hasAttribute('data-analytics-opt-out')) {
            stopped = true;
            try { sessionStorage.setItem(optOutKey, '1'); } catch (_) { /* URL also opts out. */ }
            showOptOut();
            return;
        }
        if (event.isTrusted === false || !permitted()) return;
        var theme = event.target.closest('[data-analytics-theme]');
        if (theme) return track('theme_filter', { theme: themeId(theme.dataset.analyticsTheme) });
        if (!link) return;
        var url;
        try { url = new URL(link.href, location.href); } catch (_) { return; }
        if (url.protocol === 'mailto:') return track('contact_click');
        if (!/^https?:$/.test(url.protocol)) return;
        if (url.origin === location.origin) {
            if (url.pathname === '/feed.xml') return track('rss_click');
            if (url.pathname === '/themes.html' && themes.includes(url.hash.slice(1))) {
                return track('theme_navigation', { theme: url.hash.slice(1) });
            }
            if (url.pathname === '/news.html' && url.searchParams.has('theme')) {
                return track('theme_navigation', { theme: themeId(url.searchParams.get('theme')) });
            }
            if (url.pathname === '/perspectives.html' && authors.includes(url.searchParams.get('author'))) {
                return track('author_selection', { author: url.searchParams.get('author') });
            }
            var destination = url.pathname === '/index.html' ? '/' : url.pathname;
            if (destination === '/' && ['#about', '#contact', '#essays', '#latest', '#developing', '#perspectives', '#team'].includes(url.hash)) destination += url.hash;
            if (pages.includes(destination) || ['/#about', '/#contact', '/#essays', '/#latest', '/#developing', '/#perspectives', '/#team'].includes(destination)) {
                track('navigation_click', { destination: destination });
            }
        } else {
            var card = link.closest('.news-card');
            var essay = link.closest('.essay-card');
            var surface = card && !link.closest('.news-newsletter') ? 'digest'
                : essay ? 'perspectives' : (link.closest('.blog-content') || link.closest('.brief-timeline')) ? 'article' : '';
            if (surface && publicHostname(url.hostname)) {
                var data = { destination: url.hostname, surface: surface };
                if (surface === 'digest') data.digest_item_id = Number(card.dataset.digestItemId);
                if (surface === 'perspectives') data.story_id = essay.dataset.analyticsStory;
                track('outbound_story_click', data);
            }
        }
    });

    document.addEventListener('change', function (event) {
        if (event.isTrusted === false) return;
        if (event.target.id === 'news-theme') track('theme_filter', { theme: themeId(event.target.value) });
        if (event.target.id === 'perspectives-author' && authors.includes(event.target.value)) {
            track('author_selection', { author: event.target.value });
        }
    });

    if (optedOut()) showOptOut();
    if (!permitted()) return;
    var script = document.createElement('script');
    script.src = 'https://cloud.umami.is/script.js';
    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.setAttribute('data-website-id', website);
    script.setAttribute('data-domains', hosts.join(','));
    script.setAttribute('data-auto-track', 'false');
    script.setAttribute('data-performance', 'false');
    script.setAttribute('data-do-not-track', 'true');
    script.setAttribute('data-exclude-search', 'true');
    script.setAttribute('data-exclude-hash', 'true');
    script.setAttribute('data-before-send', 'usefulAIAnalyticsBeforeSend');
    script.onload = function () {
        if (ready) return;
        ready = true;
        track();
    };
    document.head.append(script);
}());
