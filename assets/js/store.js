const YW_MANIFEST_URL = '/webdata/json/manifest.json';

let yw_storeDomains = [];
let yw_storeItems = [];
let yw_currentDomainKey = '';

function yw_getCategories(items) {
  const categories = new Set();
  items.forEach((item) => {
    if (Array.isArray(item.category)) {
      item.category.forEach((c) => categories.add(c));
    }
  });
  return Array.from(categories).sort();
}

function yw_populateCategorySelect(items) {
  const select = document.getElementById('store-category');
  const categories = yw_getCategories(items);
  select.innerHTML = '<option value="">All categories</option>' +
    categories.map((c) => `<option value="${c}">${c}</option>`).join('');
}

function yw_populateDomainSelect(domains) {
  const select = document.getElementById('store-domain');
  select.innerHTML = domains.map((d) => `<option value="${d.file}">${d.label}</option>`).join('');
}

function yw_renderStoreCard(item) {
  const detailsUrl = item.urls && item.urls.Details ? `/${item.urls.Details}` : '#';
  const downloadUrl = item.urls && item.urls.download ? `/${item.urls.download}` : '#';
  const thumb = item.Thumbnails || 'assets/img/placeholder.jpg';
  const isKustom = yw_currentDomainKey.toLowerCase().includes('kustom');

  const linksRow = isKustom
    ? `<a href="/store/theotown_install.html" class="yw-store-card-link">How to install</a>`
    : `<a href="/store/theotown_install.html" class="yw-store-card-link">How to install</a>
       <span class="yw-store-card-sep">•</span>
       <a href="/store/commisions.html" class="yw-store-card-link">Customize</a>`;

  return `
    <div class="yw-store-card">
      <a href="${detailsUrl}" class="yw-store-card-thumb">
        <img src="/${thumb}" alt="" loading="lazy">
      </a>
      <div class="yw-store-card-body">
        <h3 class="yw-store-card-title">${item.title}</h3>
        <div class="yw-store-card-meta">
          <span>${item.Version ? 'v' + item.Version : ''}</span>
          <span>•</span>
          <span>${item.Date || ''}</span>
        </div>
        <p class="yw-store-card-desc">${item.Description || ''}</p>
        <div class="yw-store-card-links">
          ${linksRow}
        </div>
        <div class="yw-store-card-actions">
          <a href="${downloadUrl}" class="btn btn-primary btn-sm">Download latest</a>
          <a href="${detailsUrl}" class="btn btn-outline-secondary btn-sm">Details</a>
        </div>
      </div>
    </div>
  `;
}

function yw_applyStoreFilters() {
  const category = document.getElementById('store-category').value;
  const query = document.getElementById('store-search').value.trim().toLowerCase();

  const filtered = yw_storeItems.filter((item) => {
    const matchesCategory = !category || (Array.isArray(item.category) && item.category.includes(category));
    const matchesQuery = !query || (item.title && item.title.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  const grid = document.getElementById('store-grid');
  const status = document.getElementById('store-status');

  if (filtered.length === 0) {
    grid.innerHTML = '';
    status.innerHTML = `Can't find it? Try different keywords (only works in English). Otherwise try ordering a <a href="/store/commisions.html">commission</a>?`;
    return;
  }

  status.innerHTML = '';
  grid.innerHTML = filtered.map(yw_renderStoreCard).join('');
}

function yw_showLoadError() {
  const status = document.getElementById('store-status');
  const grid = document.getElementById('store-grid');
  grid.innerHTML = '';
  status.innerHTML = `Whoops, the page failed to load. Report it on <a href="https://github.com/yakkaworks/yakkaworks.github.io/issues">Yakka Works GitHub</a> or email us below.`;
}

async function yw_loadStoreDomain(fileName) {
  const status = document.getElementById('store-status');
  const grid = document.getElementById('store-grid');

  yw_currentDomainKey = fileName;
  status.textContent = 'Loading...';
  grid.innerHTML = '';

  try {
    const response = await fetch(`/webdata/json/${fileName}`);
    if (!response.ok) throw new Error('Failed to load store data');
    yw_storeItems = await response.json();
    yw_populateCategorySelect(yw_storeItems);
    yw_applyStoreFilters();
  } catch (error) {
    yw_showLoadError();
  }
}

async function yw_initStore() {
  try {
    const response = await fetch(YW_MANIFEST_URL);
    if (!response.ok) throw new Error('Failed to load manifest');
    const manifest = await response.json();
    yw_storeDomains = manifest.domains || [];

    if (yw_storeDomains.length === 0) {
      yw_showLoadError();
      return;
    }

    yw_populateDomainSelect(yw_storeDomains);
    yw_loadStoreDomain(yw_storeDomains[0].file);
  } catch (error) {
    yw_showLoadError();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('store-domain').addEventListener('change', (e) => yw_loadStoreDomain(e.target.value));
  document.getElementById('store-category').addEventListener('change', yw_applyStoreFilters);
  document.getElementById('store-search').addEventListener('input', yw_applyStoreFilters);

  yw_initStore();
});
