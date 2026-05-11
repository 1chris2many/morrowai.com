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
            window.scrollTo({ top: top, behavior: 'smooth' });
            // Close mobile menu if open
            var links = document.getElementById('nav-links');
            var toggle = document.getElementById('nav-toggle');
            if (links.classList.contains('open')) {
                links.classList.remove('open');
                toggle.classList.remove('active');
            }
        });
    });

    // --- Mobile menu toggle ---
    var navToggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');
    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
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
    var sections = document.querySelectorAll('.section, .hero');
    var navLinkEls = document.querySelectorAll('.nav-links a:not(.nav-cta)');

    function updateActiveNav() {
        var scrollPos = window.pageYOffset + 100;
        sections.forEach(function (section) {
            var top = section.offsetTop - 100;
            var bottom = top + section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < bottom) {
                navLinkEls.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

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

    // --- Contact form handling ---
    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            // Basic validation
            var name = form.querySelector('#name');
            var email = form.querySelector('#email');
            var message = form.querySelector('#message');
            var valid = true;

            [name, email, message].forEach(function (field) {
                if (!field.value.trim()) {
                    field.style.borderColor = '#e74c3c';
                    valid = false;
                } else {
                    field.style.borderColor = '';
                }
            });

            if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.style.borderColor = '#e74c3c';
                valid = false;
            }

            if (!valid) {
                e.preventDefault();
                return;
            }

            // If formspree placeholder, show success message instead of submitting
            if (form.action.indexOf('placeholder') !== -1) {
                e.preventDefault();
                var layout = document.querySelector('.contact-layout');
                layout.innerHTML =
                    '<div class="form-success">' +
                    '<h3>Message Received</h3>' +
                    '<p>Thanks for reaching out. I\'ll get back to you within a few business days.</p>' +
                    '</div>';
                return;
            }
        });

        // Clear error styling on input
        form.querySelectorAll('input, textarea').forEach(function (field) {
            field.addEventListener('input', function () {
                this.style.borderColor = '';
            });
        });
    }

})();
