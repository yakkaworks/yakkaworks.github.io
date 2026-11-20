(() => {
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
  const root = "/webdata/json/";
  const sources = {
    theotown: "data_theotown.json",
    kustom: "data_kustom.json",
    misc: "data_mcb.json",
    library: "data_library.json",
    blogs: "data_blogs.json"
  };
  const cache = new Map();

  async function load(name) {
    if (!cache.has(name)) {
      const file = sources[name];
      cache.set(name, (async () => {
        const localized = root + (isEnglish ? "en/" : "") + file;
        const response = await fetch(localized);
        if (!response.ok) throw new Error("Unable to load " + localized);
        const data = await response.json();
        if (!Array.isArray(data)) throw new TypeError(file + " must contain a JSON array");
        return data;
      })());
    }
    return cache.get(name);
  }

  const text = (value) => String(value ?? "").trim();
  const categories = (item) => (Array.isArray(item.category) ? item.category : [item.category || ""]).join(" ").toLowerCase();
  const haystack = (item) => [
    item.title, item.slug, item.description, item.desc, item.category,
    ...(Array.isArray(item.category) ? item.category : [])
  ].flat().join(" ").toLowerCase();

  function matches(item, filter, type) {
    const value = haystack(item);
    const category = categories(item);
    switch (filter) {
      case "maps": return /(^|[, ])maps?([, ]|$)|peta/.test(category) || item.type === "map";
      case "presets": return /preset/.test(category) || item.type === "preset";
      case "plugins": return type === "library" ? /plugin/.test(value) : !/(^|[, ])maps?([, ]|$)|peta|preset/.test(category);
      case "general": return !/plugin|kustom/.test(value);
      case "kustom": return /kustom|kwgt|klwp/.test(value);
      case "misc": return /misc|lainnya|other/.test(value);
      case "announcements": return /announcement|pengumuman|update|pembaruan/.test(category);
      case "devlogs": return /devlog|development|pengembangan/.test(category);
      case "communities": return /communit|komunitas/.test(category);
      default: return true;
    }
  }

  function resolveUrl(value) {
    const url = text(value);
    if (!url) return "";
    if (/^(https?:|mailto:|tel:)/i.test(url) || url.startsWith("/")) return url;
    return "/" + url.replace(/^\.\//, "");
  }

  function localAsset(value) {
    return resolveUrl(value) || "/assets/img/placeholder.jpg";
  }

  // Keep JSON dates available for chronological sorting only.
  function parseDate(value) {
    const [day, month, year] = text(value).split("-").map(Number);
    if (!day || !month || !year) return 0;
    return new Date(year < 100 ? 2000 + year : year, month - 1, day).getTime();
  }

  function makeCard(item, kind) {
    const urls = item.urls || {};
    const articleUrl = kind === "library" || kind === "blogs" ? resolveUrl(urls.Article || urls.article) : "";
    const card = document.createElement(articleUrl ? "a" : "article");
    card.className = "yw-content-card" + (articleUrl ? " yw-content-card--linked" : "");
    if (articleUrl) card.href = articleUrl;

    const thumb = document.createElement("img");
    thumb.className = "yw-content-card__thumb";
    thumb.src = localAsset(item.thumbnail);
    thumb.alt = "";
    thumb.loading = "lazy";
    thumb.onerror = () => { thumb.src = "/assets/img/placeholder.jpg"; };
    card.append(thumb);

    const body = document.createElement("div");
    body.className = "yw-content-card__body";
    const title = document.createElement("h3");
    title.className = "yw-content-card__title";
    title.textContent = text(item.title) || "Untitled";
    body.append(title);

    const description = text(item.description || item.desc);
    if (description) {
      const summary = document.createElement("p");
      summary.className = "yw-content-card__description";
      summary.textContent = description;
      body.append(summary);
    }

    const downloads = Array.isArray(urls.download) ? urls.download : [];
    const latest = downloads.find((entry) => entry && text(entry.url)) || null;
    const meta = document.createElement("p");
    meta.className = "yw-content-card__meta";
    const version = latest ? text(latest.ver) : "";
    // Content dates stay in JSON for sorting/metadata; publication dates belong in Markdown front matter.
    meta.textContent = version ? "v" + version : "";
    if (meta.textContent) body.append(meta);

    // Library and blog cards navigate as a whole; store cards retain explicit actions.
    if (kind !== "library" && kind !== "blogs") {
      const actions = document.createElement("div");
      actions.className = "yw-content-card__actions";
      if (latest) {
        const button = document.createElement("a");
        button.className = "yw-button yw-button--primary";
        button.href = resolveUrl(latest.url);
        button.textContent = isEnglish ? "Download Latest" : "Unduh Terbaru";
        if (/^https?:\/\//i.test(button.href)) { button.target = "_blank"; button.rel = "noopener noreferrer"; }
        actions.append(button);
      }
      const details = resolveUrl(urls.details);
      if (details) {
        const button = document.createElement("a");
        button.className = "yw-button yw-button--outline";
        button.href = details;
        button.textContent = isEnglish ? "Details" : "Detail";
        actions.append(button);
      }
      if (actions.childElementCount) body.append(actions);
    }

    card.append(body);
    return card;
  }

  async function render(grid) {
    const type = grid.dataset.ywGrid;
    const filter = grid.dataset.ywFilter || "";
    const limit = grid.dataset.ywLimit || "all";
    try {
      const items = await load(type);
      let selected = items.filter((item) => matches(item, filter, type));
      selected.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      const offset = Number(grid.dataset.ywOffset) || 0;
      if (offset) selected = selected.slice(offset);
      if (limit !== "all") selected = selected.slice(0, Number(limit) || 5);
      if (!selected.length) {
        grid.classList.add("yw-content-grid--empty");
        grid.textContent = isEnglish ? "Content for this category will be added here." : "Konten untuk kategori ini akan ditambahkan.";
        return;
      }
      selected.forEach((item) => grid.append(makeCard(item, type)));
    } catch (error) {
      grid.classList.add("yw-content-grid--empty");
      grid.textContent = isEnglish ? "Content could not be loaded yet. Please try again later." : "Konten belum dapat dimuat. Silakan coba lagi nanti.";
      console.warn("[Yakka Works] Content grid:", error);
    }
  }

  document.querySelectorAll("[data-yw-grid]").forEach(render);
})();
