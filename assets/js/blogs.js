const YW_LIBRARY_URL = '/webdata/json/data_library.json';
const YW_PAGE_SIZE = 5;

let yw_libraryItems = [];
const yw_categoryState = {};

function yw_getCategoriesFlat(items) {
  const categories = new Set();
  items.forEach((item) => {
    if (Array.isArray(item.category)) {
      item.category.forEach((c) => categories.add(c));
    }
  });
  return Array.from(categories).sort();
}

function yw_populateCategorySelect(items) {
  const select = document.getElementById('library-category');
  const categories = yw_getCategoriesFlat(items);
  select.innerHTML = '<option value="">All categories</option>' +
    categories.map((c) => `<option value="${c}">${c}</option>`).join('');
}

function yw_groupByCategory(items) {
  const groups = {};
  items.forEach((item) => {
    const cats = Array.isArray(item.category) && item.category.length ? item.category : ['Uncategorized'];
    cats.forEach((cat) => {
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
  });
  return groups;
}

function yw_renderForumRow(item) {
  const detailsUrl = item.urls && item.urls.Details ? `/${item.urls.Details}` : '#';
  const thumb = item.Thumbnails || 'assets/img/placeholder.jpg';
  const author = item.author && item.author.trim() ? item.author.trim() : 'Yakka';

  return `
    <a href="${detailsUrl}" class="yw-forum-row">
      <img src="/${thumb}" alt="" class="yw-forum-row-thumb" loading="lazy">
      <span class="yw-forum-row-text">
        <span class="yw-forum-row-title">${item.title}</span>
        <span class="yw-forum-row-desc">${item.Description || ''}</span>
        <span class="yw-forum-row-meta">By ${author} • ${item.Date || ''}</span>
      </span>
    </a>
  `;
}

function yw_renderCategory(name, items) {
  const safeId = name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const visibleCount = yw_categoryState[safeId] || YW_PAGE_SIZE;
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = items.length > visibleCount;

  return `
    <section class="yw-forum-category">
      <h2 class="yw-forum-category-title">${name}</h2>
      <div class="yw-forum-list">
        ${visibleItems.map(yw_renderForumRow).join('')}
      </div>
      ${hasMore ? `<button type="button" class="btn btn-outline-secondary btn-sm yw-forum-more" data-category="${safeId}">Show more</button>` : ''}
    </section>
  `;
}

function yw_renderGrouped(grouped, container) {
  container.innerHTML = Object.entries(grouped)
    .map(([name, groupItems]) => yw_renderCategory(name, groupItems))
    .join('');
}

function yw_attachShowMoreHandler(grouped, container) {
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.yw-forum-more');
    if (!btn) return;
    const safeId = btn.dataset.category;
    yw_categoryState[safeId] = (yw_categoryState[safeId] || YW_PAGE_SIZE) + YW_PAGE_SIZE;
    yw_renderGrouped(grouped, container);
  });
}

function yw_applyLibraryFilters() {
  const category = document.getElementById('library-category').value;
  const query = document.getElementById('library-search').value.trim().toLowerCase();
  const container = document.getElementById('library-content');
  const status = document.getElementById('library-status');

  const filtered = yw_libraryItems.filter((item) => {
    const matchesCategory = !category || (Array.isArray(item.category) && item.category.includes(category));
    const matchesQuery = !query || (item.title && item.title.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = '';
    status.textContent = "Can't find it? Try different keywords.";
    return;
  }

  status.textContent = '';
  const grouped = yw_groupByCategory(filtered);
  yw_renderGrouped(grouped, container);
  yw_attachShowMoreHandler(grouped, container);
}

function yw_showLibraryError() {
  const status = document.getElementById('library-status');
  const container = document.getElementById('library-content');
  container.innerHTML = '';
  status.innerHTML = `Whoops, the page failed to load. Report it on <a href="https://github.com/yakkaworks/yakkaworks.github.io/issues">Yakka Works GitHub</a> or email us below.`;
}

async function yw_loadLibrary() {
  const status = document.getElementById('library-status');
  status.textContent = 'Loading...';

  try {
    const response = await fetch(YW_LIBRARY_URL);
    if (!response.ok) throw new Error('Failed to load library data');
    yw_libraryItems = await response.json();

    if (!yw_libraryItems || yw_libraryItems.length === 0) {
      status.textContent = 'Nothing in the library yet. Check back soon.';
      document.getElementById('library-content').innerHTML = '';
      return;
    }

    yw_populateCategorySelect(yw_libraryItems);
    yw_applyLibraryFilters();
  } catch (error) {
    yw_showLibraryError();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('library-category').addEventListener('change', yw_applyLibraryFilters);
  document.getElementById('library-search').addEventListener('input', yw_applyLibraryFilters);
  yw_loadLibrary();
});
