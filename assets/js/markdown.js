function yw_parseInline(text) {
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  escaped = escaped.replace(/!\[(.*?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="img-fluid">');
  escaped = escaped.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
  escaped = escaped.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\*(.+?)\*/g, '<em>$1</em>');

  return escaped;
}

function yw_parseMarkdown(text) {
  const lines = text.split('\n');
  let html = '';
  let inList = false;
  let inQuote = false;

  function closeList() {
    if (inList) { html += '</ul>'; inList = false; }
  }
  function closeQuote() {
    if (inQuote) { html += '</blockquote>'; inQuote = false; }
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      closeList();
      closeQuote();
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      closeList();
      closeQuote();
      const level = headingMatch[1].length;
      html += `<h${level}>${yw_parseInline(headingMatch[2])}</h${level}>`;
      return;
    }

    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      closeList();
      if (!inQuote) { html += '<blockquote>'; inQuote = true; }
      html += `<p>${yw_parseInline(quoteMatch[1])}</p>`;
      return;
    }
    closeQuote();

    const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${yw_parseInline(listMatch[1])}</li>`;
      return;
    }
    closeList();

    html += `<p>${yw_parseInline(trimmed)}</p>`;
  });

  closeList();
  closeQuote();
  return html;
}

async function yw_loadMarkdownInto(slug, mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  const section = yw_getSectionFromPath();
  const lang = (navigator.language || 'en').slice(0, 2).toLowerCase();
  const preferredPath = `/webdata/${lang}/${section}/${slug}.md`;
  const fallbackPath = `/webdata/en/${section}/${slug}.md`;

  async function tryFetch(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error('not found');
    return response.text();
  }

  try {
    let text;
    let usedFallback = false;

    if (lang !== 'en') {
      try {
        text = await tryFetch(preferredPath);
      } catch (error) {
        text = await tryFetch(fallbackPath);
        usedFallback = true;
      }
    } else {
      text = await tryFetch(fallbackPath);
    }

    mount.innerHTML = yw_parseMarkdown(text);

    if (usedFallback) {
      mount.insertAdjacentHTML('beforebegin', `
        <div class="alert alert-warning yw-md-warning" role="alert">
          This page isn't available in your language yet. Showing the English version instead.
        </div>
      `);
    }
  } catch (error) {
    mount.innerHTML = '';
    mount.insertAdjacentHTML('beforebegin', `
      <div class="alert alert-danger yw-md-error" role="alert">
        This content failed to load. Please report it on <a href="https://github.com/yakkaworks/yakkaworks.github.io/issues">Yakka Works GitHub</a> or email us below.
      </div>
    `);
  }
}

function yw_getSectionFromPath() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  return segments.length > 0 ? segments[0] : '';
        }
