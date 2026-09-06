const YW_TOOLS_URL = '/webdata/json/data_tools.json';

function yw_renderToolCard(item) {
  const link = item.urls && item.urls.link ? item.urls.link : '#';

  return `
    <div class="yw-tool-card">
      <h3 class="yw-tool-card-title">${item.title}</h3>
      <p class="yw-tool-card-desc">${item.Description || ''}</p>
      <a href="${link}" class="btn btn-primary btn-sm">Visit</a>
    </div>
  `;
}

function yw_showToolsError() {
  const status = document.getElementById('tools-status');
  const grid = document.getElementById('tools-grid');
  grid.innerHTML = '';
  status.innerHTML = `Whoops, the page failed to load. Report it on <a href="https://github.com/yakkaworks/yakkaworks.github.io/issues">Yakka Works GitHub</a> or email us below.`;
}

async function yw_loadTools() {
  const status = document.getElementById('tools-status');
  const grid = document.getElementById('tools-grid');
  status.textContent = 'Loading...';

  try {
    const response = await fetch(YW_TOOLS_URL);
    if (!response.ok) throw new Error('Failed to load tools data');
    const items = await response.json();

    if (!items || items.length === 0) {
      status.textContent = 'No tools available yet. Check back soon.';
      grid.innerHTML = '';
      return;
    }

    status.textContent = '';
    grid.innerHTML = items.map(yw_renderToolCard).join('');
  } catch (error) {
    yw_showToolsError();
  }
}

document.addEventListener('DOMContentLoaded', yw_loadTools);
