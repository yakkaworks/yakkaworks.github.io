const YW_BLOGS_URL = '/webdata/json/data_blogs.json';

let yw_blogsItems = [];

function yw_applyBlogsFilters() {
  const category = document.getElementById('library-category').value;
  const query = document.getElementById('library-search').value.trim().toLowerCase();
  const container = document.getElementById('library-content');
  const status = document.getElementById('library-status');

  const filtered = yw_blogsItems.filter((item) => {
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

function yw_showBlogsError() {
  const status = document.getElementById('library-status');
  const container = document.getElementById('library-content');
  container.innerHTML = '';
  status.innerHTML = `Whoops, the page failed to load. Report it on <a href="https://github.com/yakkaworks/yakkaworks.github.io/issues">Yakka Works GitHub</a> or email us below.`;
}

async function yw_loadBlogs() {
  const status = document.getElementById('library-status');
  status.textContent = 'Loading...';

  try {
    const response = await fetch(YW_BLOGS_URL);
    if (!response.ok) throw new Error('Failed to load blogs data');
    yw_blogsItems = await response.json();

    if (!yw_blogsItems || yw_blogsItems.length === 0) {
      status.textContent = 'No posts yet. Check back soon.';
      document.getElementById('library-content').innerHTML = '';
      return;
    }

    yw_populateCategorySelect(yw_blogsItems);
    yw_applyBlogsFilters();
  } catch (error) {
    yw_showBlogsError();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('library-category').addEventListener('change', yw_applyBlogsFilters);
  document.getElementById('library-search').addEventListener('input', yw_applyBlogsFilters);
  yw_loadBlogs();
});
