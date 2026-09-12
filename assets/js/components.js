document.documentElement.setAttribute('data-bs-theme', 'dark');

const YW_NAV_ITEMS = [
  {
    href: '/store/',
    icon: 'bi-bag',
    title: 'Store',
    description: 'Free TheoTown and Kustom content, plus commissions.'
  },
  {
    href: '/tools/',
    icon: 'bi-tools',
    title: 'Tools',
    description: 'Utilities that make building TheoTown plugins easier.'
  },
  {
    href: '/library/',
    icon: 'bi-book',
    title: 'Library',
    description: 'Documentation, tutorials, and reference material.'
  },
  {
    href: '/blogs/',
    icon: 'bi-newspaper',
    title: 'Blogs',
    description: 'Announcements, news, and updates from Yakka Works.'
  }
];

function isActivePath(href) {
  const current = window.location.pathname;
  if (href === '/') return current === '/' || current === '/index.html';
  return current.startsWith(href);
}

function renderNavbar() {
  const mount = document.getElementById('navbar');
  if (!mount) return;

  const navLinks = YW_NAV_ITEMS.map((item) => `
    <a href="${item.href}" class="list-group-item list-group-item-action d-flex gap-3 py-3${isActivePath(item.href) ? ' active' : ''}">
      <i class="bi ${item.icon} fs-4"></i>
      <span>
        <span class="d-block fw-medium">${item.title}</span>
        <small class="text-body-secondary">${item.description}</small>
      </span>
    </a>
  `).join('');

  mount.innerHTML = `
    <nav class="navbar yw-navbar">
      <div class="container-fluid yw-navbar-inner">
        <a class="navbar-brand d-flex align-items-center gap-2" href="/">
          <img src="/assets/img/logo.svg" alt="Yakka Works" height="32" width="32">
          <span class="d-none d-sm-inline">Yakka Works</span>
        </a>
        <button class="btn btn-link p-0 border-0 yw-navbar-toggle" type="button"
          data-bs-toggle="offcanvas" data-bs-target="#yw-offcanvas"
          aria-controls="yw-offcanvas" aria-label="Open navigation menu">
          <i class="bi bi-list fs-2"></i>
        </button>
      </div>
    </nav>

    <div class="offcanvas offcanvas-top" tabindex="-1" id="yw-offcanvas" aria-labelledby="yw-offcanvas-label">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="yw-offcanvas-label">Yakka Works</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body p-0">
        <div class="list-group list-group-flush">
          ${navLinks}
        </div>
      </div>
    </div>
  `;
}

function renderFooter() {
  const mount = document.getElementById('footer');
  if (!mount) return;

  mount.innerHTML = `
    <footer class="yw-footer py-5 mt-3">
      <div class="container">
        <div class="row gy-4">
          <div class="col-12 col-md-4">
            <a href="/" class="d-flex align-items-center gap-2 text-decoration-none mb-2 yw-footer-brand">
              <img src="/assets/img/logo.svg" alt="Yakka Works" height="28" width="28">
              <span class="fw-medium">Yakka Works</span>
            </a>
            <address class="small mb-0" style="font-style: normal;">
              Yakka Works<br>
              Sidoluhur Hamlet, RT 02/RW 02<br>
              Sepanjang Village, Glenmore District<br>
              Banyuwangi Regency, East Java 68466<br>
              Indonesia
            </address>
          </div>

          <div class="col-6 col-md-4">
            <h6 class="text-uppercase small mb-3">Legal</h6>
            <ul class="list-unstyled small">
              <li class="mb-2"><a href="/terms.html" class="yw-footer-link">Terms</a></li>
              <li class="mb-2"><a href="/privacy.html" class="yw-footer-link">Privacy</a></li>
              <li class="mb-2"><a href="/license.html" class="yw-footer-link">License</a></li>
              <li class="mb-2"><a href="https://github.com/yakkaworks/yakkaworks.github.io" class="yw-footer-link">Source Code</a></li>
            </ul>
          </div>

          <div class="col-6 col-md-4">
            <h6 class="text-uppercase small mb-3">Connect</h6>
            <div class="d-flex gap-3 fs-5 mb-3">
              <a href="https://facebook.com/yakkaworks" class="yw-footer-link" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="https://youtube.com/@yakkaworks" class="yw-footer-link" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
              <a href="https://github.com/yakkaworks" class="yw-footer-link" aria-label="GitHub"><i class="bi bi-github"></i></a>
              <a href="https://x.com/yakkaworks" class="yw-footer-link" aria-label="X"><i class="bi bi-twitter-x"></i></a>
              <a href="https://instagram.com/yakkaworks" class="yw-footer-link" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
            </div>
            <a href="mailto:yakkaworks@gmail.com" class="yw-footer-link small d-block">
              <i class="bi bi-envelope me-1"></i>yakkaworks@gmail.com
            </a>
          </div>
        </div>

        <hr class="yw-footer-hr my-4">
        <p class="small mb-0">Copyright Yakka Works 2019-2026</p>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
});
