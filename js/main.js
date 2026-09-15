/* ============================================================
   Morrow AI Consulting — Main JS
   ============================================================ */

(function () {
    'use strict';

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            var navHeight = document.getElementById('nav').offsetHeight;
            var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
            if (window.location.hash !== targetId) history.pushState(null, '', targetId);
            if (targetId === '#main') {
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
            // Close mobile menu if open
            var links = document.getElementById('nav-links');
            var toggle = document.getElementById('nav-toggle');
            if (links.classList.contains('open')) {
                links.classList.remove('open');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- Mobile menu toggle ---
    var navToggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');
    document.documentElement.classList.add('nav-ready');
    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', String(navLinks.classList.contains('open')));
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
    });

    // --- Sticky nav scroll state ---
    var nav = document.getElementById('nav');
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
        var scrollY = window.pageYOffset;
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }, { passive: true });

    // --- Active nav link highlighting ---
    var sections = document.querySelectorAll('.section[id], .hero[id], .editorial-section[id], .editorial-hero[id]');
    var navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)');
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        var url = new URL(link.href);
        if (!url.hash && url.pathname === window.location.pathname) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    function updateActiveNav() {
        var scrollPos = window.pageYOffset + 100;
        sections.forEach(function (section) {
            var top = section.offsetTop - 100;
            var bottom = top + section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < bottom) {
                navLinkEls.forEach(function (link) {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'location');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // --- Scroll-in animations (Intersection Observer) ---
    var scrollElements = document.querySelectorAll('.scroll-in');

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        scrollElements.forEach(function (el) {
            el.classList.add('reveal-ready');
            observer.observe(el);
        });
    } else {
        // Fallback: show everything
        scrollElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // --- Stagger scroll-in for grid children ---
    var grids = document.querySelectorAll('.services-grid, .cases-grid, .posts-grid');
    grids.forEach(function (grid) {
        var children = grid.querySelectorAll('.scroll-in');
        children.forEach(function (child, index) {
            child.style.transitionDelay = (index * 0.1) + 's';
        });
    });

})();
