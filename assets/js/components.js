/**
 * Yakka Works — Shared Component Injection
 *
 * Injects the shared navbar and footer into any page containing
 * <div id="yk-navbar"></div> and <div id="yk-footer"></div>.
 *
 * Depends on: assets/js/path-utils.js (must load first, defines window.YakkaPaths)
 */
(function () {
  'use strict';

  var P = window.YakkaPaths;
  if (!P) {
    console.error('YakkaPaths not found — ensure path-utils.js loads before components.js');
    return;
  }

  var NAV_ITEMS = [
    {
      id: 'home',
      href: P.page('index.html'),
      icon: 'bi-house-door',
      title: 'Home',
      desc: 'Yakka Works hub — plugins, tools, docs, and updates.'
    },
    {
      id: 'store',
      href: P.page('store/index.html'),
      icon: 'bi-bag',
      title: 'Store',
      desc: 'Free TheoTown & Kustom content, plus commission info.'
    },
    {
      id: 'tools',
      href: P.page('tools/index.html'),
      icon: 'bi-tools',
      title: 'Tools',
      desc: 'Tools to make TheoTown plugins very easily.'
    },
    {
      id: 'library',
      href: P.page('library/index.html'),
      icon: 'bi-book',
      title: 'Library',
      desc: 'Docs, tutorials, and tips for TheoTown plugins.'
    },
    {
      id: 'blogs',
      href: P.page('blogs/index.html'),
      icon: 'bi-journal-text',
      title: 'Blogs',
      desc: 'Announcements, news, and updates from Yakka Works.'
    }
  ];

  function detectActivePage() {
    var path = window.location.pathname.replace(/\/index\.html$/, '/');
    if (/\/store\//.test(path)) return 'store';
    if (/\/tools\//.test(path)) return 'tools';
    if (/\/library\//.test(path)) return 'library';
    if (/\/blogs\//.test(path)) return 'blogs';
    return 'home';
  }

  function buildNavbar() {
    var activeId = detectActivePage();

    var navItemsHtml = NAV_ITEMS.map(function (item) {
      var isActive = item.id === activeId;
      return (
        '<a href="' + item.href + '" ' +
          'class="list-group-item list-group-item-action' + (isActive ? ' active' : '') + '"' +
          (isActive ? ' aria-current="page"' : '') + '>' +
          '<i class="bi ' + item.icon + '" aria-hidden="true"></i>' +
          '<span>' +
            '<span class="nav-item-title d-block">' + item.title + '</span>' +
            '<span class="nav-item-desc d-block">' + item.desc + '</span>' +
          '</span>' +
        '</a>'
      );
    }).join('');

    return (
      '<nav class="navbar yk-navbar" aria-label="Main navigation">' +
        '<div class="container-fluid">' +
          '<a class="navbar-brand" href="' + P.page('index.html') + '">' +
            '<img src="' + P.asset('assets/img/logo.svg') + '" alt="Yakka Works logo">' +
            '<span class="navbar-brand-text">Yakka Works</span>' +
          '</a>' +
          '<button class="btn btn-hamburger" type="button" data-bs-toggle="offcanvas" ' +
            'data-bs-target="#ykOffcanvasNav" aria-controls="ykOffcanvasNav" ' +
            'aria-label="Open navigation menu">' +
            '<i class="bi bi-list fs-4" aria-hidden="true"></i>' +
          '</button>' +
        '</div>' +
      '</nav>' +

      '<div class="offcanvas offcanvas-end yk-offcanvas" tabindex="-1" id="ykOffcanvasNav" ' +
        'aria-labelledby="ykOffcanvasNavLabel">' +
        '<div class="offcanvas-header">' +
          '<h2 class="offcanvas-title h5 mb-0" id="ykOffcanvasNavLabel">Menu</h2>' +
          '<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>' +
        '</div>' +
        '<div class="offcanvas-body p-0">' +
          '<div class="list-group list-group-flush">' +
            navItemsHtml +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function buildFooter() {
    var year = new Date().getFullYear();
    var copyrightEndYear = year > 2026 ? year : 2026;

    // NOTE: Social/contact URLs below use the usernames specified in the
    // brand brief (yakkaworks on each platform). Replace SOCIAL_EMAIL with
    // the real contact address once confirmed — no address was provided.
    var SOCIAL_EMAIL = ''; // TODO: set real contact email

    return (
      '<footer class="yk-footer py-4 mt-auto">' +
        '<div class="container">' +
          '<div class="row gy-3 align-items-center">' +

            '<div class="col-12 col-md-4 text-center text-md-start">' +
              '<a href="' + P.page('index.html') + '" class="d-inline-flex align-items-center gap-2 fw-bold">' +
                '<img src="' + P.asset('assets/img/logo.svg') + '" alt="Yakka Works logo" style="height:1.75rem;width:1.75rem;">' +
                'Yakka Works' +
              '</a>' +
            '</div>' +

            '<div class="col-12 col-md-4 text-center">' +
              '<div class="yk-social-links d-flex justify-content-center flex-wrap gap-2">' +
                '<a href="https://facebook.com/yakkaworks" target="_blank" rel="noopener noreferrer" aria-label="Yakka Works on Facebook"><i class="bi bi-facebook" aria-hidden="true"></i></a>' +
                '<a href="https://youtube.com/@yakkaworks" target="_blank" rel="noopener noreferrer" aria-label="Yakka Works on YouTube"><i class="bi bi-youtube" aria-hidden="true"></i></a>' +
                '<a href="https://github.com/yakkaworks" target="_blank" rel="noopener noreferrer" aria-label="Yakka Works on GitHub"><i class="bi bi-github" aria-hidden="true"></i></a>' +
                '<a href="https://x.com/yakkaworks" target="_blank" rel="noopener noreferrer" aria-label="Yakka Works on X"><i class="bi bi-twitter-x" aria-hidden="true"></i></a>' +
                '<a href="https://instagram.com/yakkaworks" target="_blank" rel="noopener noreferrer" aria-label="Yakka Works on Instagram"><i class="bi bi-instagram" aria-hidden="true"></i></a>' +
                (SOCIAL_EMAIL
                  ? '<a href="mailto:' + SOCIAL_EMAIL + '" aria-label="Email Yakka Works"><i class="bi bi-envelope" aria-hidden="true"></i></a>'
                  : '<a href="#" aria-label="Email address not yet set" aria-disabled="true" tabindex="-1" style="opacity:.4;pointer-events:none;"><i class="bi bi-envelope" aria-hidden="true"></i></a>'
                ) +
              '</div>' +
            '</div>' +

            '<div class="col-12 col-md-4">' +
              '<ul class="yk-legal-links list-inline text-center text-md-end mb-0 small">' +
                '<li class="list-inline-item"><a href="' + P.page('terms.html') + '">Terms</a></li>' +
                '<li class="list-inline-item"><a href="' + P.page('privacy.html') + '">Privacy</a></li>' +
                '<li class="list-inline-item"><a href="' + P.page('license.html') + '">License</a></li>' +
                '<li class="list-inline-item"><a href="https://github.com/yakkaworks" target="_blank" rel="noopener noreferrer">Source Code</a></li>' +
              '</ul>' +
            '</div>' +

          '</div>' +

          '<hr>' +

          '<p class="yk-copyright text-center mb-0">Copyright Yakka Works 2019–' + copyrightEndYear + '</p>' +
        '</div>' +
      '</footer>'
    );
  }

  function init() {
    var navMount = document.getElementById('yk-navbar');
    var footerMount = document.getElementById('yk-footer');

    if (navMount) {
      navMount.innerHTML = buildNavbar();
    }
    if (footerMount) {
      footerMount.innerHTML = buildFooter();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
