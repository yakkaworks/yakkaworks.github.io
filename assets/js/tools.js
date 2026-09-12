const YW_TOOLS_URL = '/webdata/json/data_tools.json';

let yw_toolsItems = [];

function yw_renderToolCard(item) {
  const link = item.urls && item.urls.link ? item.urls.link : '#';
  const icon = item.icon || 'bi-wrench-adjustable';

  return `
    <div class="col-6 col-lg-4">
      <a href="${link}" class="yw-tool-card">
        <span class="yw-tool-card-icon"><i class="bi ${icon}"></i></span>
        <span class="yw-tool-card-text">
          <span class="yw-tool-card-title">${item.title}</span>
          <span class="yw-tool-card-desc">${item.Description || ''}</span>
        </span>
      </a>
    </div>
  `;
}

function yw_applyToolsFilter() {
  const query = document.getElementById('tools-search').value.trim().toLowerCase();
  const grid = document.getElementById('tools-grid');
  const status = document.getElementById('tools-status');

  const filtered = yw_toolsItems.filter((item) =>
    !query || (item.title && item.title.toLowerCase().includes(query))
  );

  if (filtered.length === 0) {
    grid.innerHTML = '';
    status.textContent = "Can't find it? Try different keywords.";
    return;
  }

  status.textContent = '';
  grid.innerHTML = filtered.map(yw_renderToolCard).join('');
}

function yw_showToolsError() {
  const status = document.getElementById('tools-status');
  const grid = document.getElementById('tools-grid');
  grid.innerHTML = '';
  status.innerHTML = `Whoops, the page failed to load. Report it on <a href="https://github.com/yakkaworks/yakkaworks.github.io/issues">Yakka Works GitHub</a> or email us below.`;
}

async function yw_loadTools() {
  const status = document.getElementById('tools-status');
  status.textContent = 'Loading...';

  try {
    const response = await fetch(YW_TOOLS_URL);
    if (!response.ok) throw new Error('Failed to load tools data');
    yw_toolsItems = await response.json();

    if (!yw_toolsItems || yw_toolsItems.length === 0) {
      status.textContent = 'No tools available yet. Check back soon.';
      document.getElementById('tools-grid').innerHTML = '';
      return;
    }

    status.textContent = '';
    yw_applyToolsFilter();
  } catch (error) {
    yw_showToolsError();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tools-search').addEventListener('input', yw_applyToolsFilter);
  yw_loadTools();
});
