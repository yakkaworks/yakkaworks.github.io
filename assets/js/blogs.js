const YW_BLOGS_URL = '/webdata/json/data_blogs.json';

function yw_showBlogsError() {
  const status = document.getElementById('library-status');
  const container = document.getElementById('library-content');
  container.innerHTML = '';
  status.innerHTML = `Whoops, the page failed to load. Report it on <a href="https://github.com/yakkaworks/yakkaworks.github.io/issues">Yakka Works GitHub</a> or email us below.`;
}

async function yw_loadBlogs() {
  const status = document.getElementById('library-status');
  const container = document.getElementById('library-content');
  status.textContent = 'Loading...';

  try {
    const response = await fetch(YW_BLOGS_URL);
    if (!response.ok) throw new Error('Failed to load blogs data');
    const items = await response.json();

    if (!items || items.length === 0) {
      status.textContent = 'No posts yet. Check back soon.';
      container.innerHTML = '';
      return;
    }

    status.textContent = '';
    const grouped = yw_groupByCategory(items);
    container.innerHTML = Object.entries(grouped)
      .map(([name, groupItems]) => yw_renderCategory(name, groupItems))
      .join('');
  } catch (error) {
    yw_showBlogsError();
  }
}

document.addEventListener('DOMContentLoaded', yw_loadBlogs);
