const YW_LIBRARY_URL = '/webdata/json/data_library.json';

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
  const thumb = item.Thumbnails ? `<img src="/${item.Thumbnails}" alt="" class="yw-forum-thumb">` : '';

  return `
    <a href="${detailsUrl}" class="yw-forum-row">
      ${thumb}
      <span class="yw-forum-row-text">
        <span class="yw-forum-row-title">${item.title}</span>
        <span class="yw-forum-row-date">${item.Date || ''}</span>
      </span>
    </a>
  `;
}

function yw_renderCategory(name, items) {
  return `
    <section class="yw-forum-category">
      <h2 class="yw-forum-category-title">${name}</h2>
      <div class="yw-forum-list">
        ${items.map(yw_renderForumRow).join('')}
      </div>
    </section>
  `;
}

function yw_showLibraryError() {
  const status = document.getElementById('library-status');
  const container = document.getElementById('library-content');
  container.innerHTML = '';
  status.innerHTML = `Whoops, the page failed to load. Report it on <a href="https://github.com/yakkaworks/yakkaworks.github.io/issues">Yakka Works GitHub</a> or email us below.`;
}

async function yw_loadLibrary() {
  const status = document.getElementById('library-status');
  const container = document.getElementById('library-content');
  status.textContent = 'Loading...';

  try {
    const response = await fetch(YW_LIBRARY_URL);
    if (!response.ok) throw new Error('Failed to load library data');
    const items = await response.json();

    if (!items || items.length === 0) {
      status.textContent = 'Nothing in the library yet. Check back soon.';
      container.innerHTML = '';
      return;
    }

    status.textContent = '';
    const grouped = yw_groupByCategory(items);
    container.innerHTML = Object.entries(grouped)
      .map(([name, groupItems]) => yw_renderCategory(name, groupItems))
      .join('');
  } catch (error) {
    yw_showLibraryError();
  }
}

document.addEventListener('DOMContentLoaded', yw_loadLibrary);
