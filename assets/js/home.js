function yw_parseDMY(dateStr) {
  if (!dateStr) return new Date(0);
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date(0);
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
}

function yw_sortByDateDesc(items) {
  return [...items].sort((a, b) => yw_parseDMY(b.Date) - yw_parseDMY(a.Date));
}

function yw_renderRecentCard(item) {
  const detailsUrl = item.urls && item.urls.Details ? `/${item.urls.Details}` : '#';
  const thumb = item.Thumbnails || 'assets/img/placeholder.jpg';

  return `
    <a href="${detailsUrl}" class="yw-recent-card">
      <img src="/${thumb}" alt="" class="yw-recent-card-thumb" loading="lazy">
      <span class="yw-recent-card-body">
        <span class="yw-recent-card-title">${item.title}</span>
        <span class="yw-recent-card-desc">${item.Description || ''}</span>
      </span>
    </a>
  `;
}

function yw_renderRecentListRow(item) {
  const detailsUrl = item.urls && item.urls.Details ? `/${item.urls.Details}` : '#';
  const thumb = item.Thumbnails ? `<img src="/${item.Thumbnails}" alt="" class="yw-forum-thumb">` : '';

  return `
    <a href="${detailsUrl}" class="list-group-item list-group-item-action d-flex align-items-center gap-3">
      ${thumb}
      <span class="d-flex flex-column">
        <span class="fw-medium">${item.title}</span>
        <small class="text-body-secondary">${item.Date || ''}</small>
      </span>
    </a>
  `;
}

async function yw_loadRecentGrid(url, mountId, count) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load');
    const items = await response.json();
    if (!items || items.length === 0) {
      mount.innerHTML = '<p class="yw-recent-empty">Nothing here yet.</p>';
      return;
    }
    const recent = yw_sortByDateDesc(items).slice(0, count);
    mount.innerHTML = recent.map(yw_renderRecentCard).join('');
  } catch (error) {
    mount.innerHTML = '<p class="yw-recent-empty">Could not load right now.</p>';
  }
}

async function yw_loadRecentList(url, mountId, count) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load');
    const items = await response.json();
    if (!items || items.length === 0) {
      mount.innerHTML = '<p class="yw-recent-empty">Nothing here yet.</p>';
      return;
    }
    const recent = yw_sortByDateDesc(items).slice(0, count);
    mount.innerHTML = recent.map(yw_renderRecentListRow).join('');
  } catch (error) {
    mount.innerHTML = '<p class="yw-recent-empty">Could not load right now.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  yw_loadRecentGrid('/webdata/json/data_theotown.json', 'home-store-grid', 4);
  yw_loadRecentGrid('/webdata/json/data_tools.json', 'home-tools-grid', 4);
  yw_loadRecentList('/webdata/json/data_library.json', 'home-library-list', 3);
  yw_loadRecentList('/webdata/json/data_blogs.json', 'home-blogs-list', 3);
});
