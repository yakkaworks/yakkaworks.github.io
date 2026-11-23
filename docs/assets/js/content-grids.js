(() => {
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
  const root = "/webdata/json/";
  const sources = {
    theotown: "data_theotown.json",
    kustom: "data_kustom.json",
    misc: "data_mcb.json",
    library: "data_library.json",
    blogs: "data_blogs.json",
    tools: "data_tools.json"
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

  function fallbackAsset(item, kind) {
    if (kind === "library") {
      const category = categories(item);
      if (/plugin/.test(category)) return "/assets/img/icon-plugin.png";
      if (/kustom/.test(category)) return "/assets/img/icon-kustom.png";
      if (/misc|other|lainnya/.test(category)) return "/assets/img/icon-misc.png";
      return "/assets/img/icon-tut.png";
    }
    if (kind === "blogs" || kind === "tools") return "/assets/img/icon-misc.png";
    return "/assets/img/content-cards-placeholders.jpg";
  }

  function parseDate(value) {
    const [day, month, year] = text(value).split("-").map(Number);
    if (!day || !month || !year) return 0;
    return new Date(year < 100 ? 2000 + year : year, month - 1, day).getTime();
  }

  function makeStoreCard(item, kind) {
    const urls = item.urls || {};
    const downloads = Array.isArray(urls.download) ? urls.download : [];
    const latest = downloads.find((entry) => entry && text(entry.url)) || null;
    const card = document.createElement("article");
    card.className = "yw-content-card";

    const thumb = document.createElement("img");
    thumb.className = "yw-content-card__thumb";
    thumb.src = resolveUrl(item.thumbnail) || fallbackAsset(item, kind);
    thumb.alt = "";
    thumb.loading = "lazy";
    thumb.onerror = () => { thumb.src = "/assets/img/content-cards-placeholders.jpg"; };
    card.append(thumb);

    const body = document.createElement("div");
    body.className = "yw-content-card__body";

    const title = document.createElement("h3");
    title.className = "yw-content-card__title";
    title.textContent = text(item.title) || "Untitled";
    body.append(title);

    const version = latest ? text(latest.ver) : "";
    const date = text(item.date);
    const metaParts = [];
    if (version) metaParts.push((isEnglish ? "v" : "v") + version);
    if (date) metaParts.push(date);
    if (metaParts.length) {
      const meta = document.createElement("p");
      meta.className = "yw-content-card__meta";
      meta.textContent = metaParts.join(" · ");
      body.append(meta);
    }

    const divider = document.createElement("hr");
    divider.className = "yw-content-card__divider";
    body.append(divider);

    const actions = document.createElement("div");
    actions.className = "yw-content-card__actions";
    if (latest) {
      const download = document.createElement("a");
      download.className = "yw-button yw-button--primary";
      download.href = resolveUrl(latest.url);
      download.textContent = isEnglish ? "Download Latest" : "Unduh Terbaru";
      if (/^https?:\/\//i.test(download.href)) {
        download.target = "_blank";
        download.rel = "noopener noreferrer";
      }
      actions.append(download);
    }
    const detailsUrl = resolveUrl(urls.details);
    if (detailsUrl) {
      const details = document.createElement("a");
      details.className = "yw-button yw-button--outline";
      details.href = detailsUrl;
      details.textContent = isEnglish ? "Details" : "Detail";
      actions.append(details);
    }
    if (actions.childElementCount) body.append(actions);

    card.append(body);
    return card;
  }

  function makeListItem(item, kind) {
    const urls = item.urls || {};
    const articleUrl = resolveUrl(urls.Article || urls.article);
    const itemElement = document.createElement(articleUrl ? "a" : "article");
    itemElement.className = "yw-content-list__item";
    if (articleUrl) itemElement.href = articleUrl;

    const image = document.createElement("img");
    image.className = "yw-content-list__thumb";
    const suppliedThumbnail = resolveUrl(item.thumbnail);
    image.src = suppliedThumbnail || fallbackAsset(item, kind);
    if (!suppliedThumbnail) image.classList.add("yw-content-list__thumb--icon");
    image.alt = "";
    image.loading = "lazy";
    image.onerror = () => {
      image.src = "/assets/img/icon-misc.png";
      image.classList.add("yw-content-list__thumb--icon");
    };
    itemElement.append(image);

    const body = document.createElement("div");
    body.className = "yw-content-list__body";

    const title = document.createElement("h3");
    title.className = "yw-content-list__title";
    title.textContent = text(item.title) || "Untitled";
    body.append(title);

    if (text(item.date)) {
      const date = document.createElement("time");
      date.className = "yw-content-list__date";
      date.textContent = text(item.date);
      body.append(date);
    }

    const description = text(item.description || item.desc);
    if (description) {
      const summary = document.createElement("p");
      summary.className = "yw-content-list__description";
      summary.textContent = description;
      body.append(summary);
    }

    itemElement.append(body);
    return itemElement;
  }

  async function render(container) {
    const type = container.dataset.ywGrid;
    const filter = container.dataset.ywFilter || "";
    const limit = container.dataset.ywLimit || "all";
    const listStyle = type === "library" || type === "tools" || type === "blogs";

    if (listStyle) {
      container.classList.remove("yw-content-grid");
      container.classList.add("yw-content-list");
    }

    try {
      const items = await load(type);
      let selected = items.filter((item) => matches(item, filter, type));
      selected.sort((a, b) => parseDate(b.date) - parseDate(a.date));
      const offset = Number(container.dataset.ywOffset) || 0;
      if (offset) selected = selected.slice(offset);
      if (limit !== "all") selected = selected.slice(0, Number(limit) || 5);

      if (!selected.length) {
        container.classList.add("yw-content-grid--empty");
        container.textContent = isEnglish
          ? "Content for this category will be added here."
          : "Konten untuk kategori ini akan ditambahkan.";
        return;
      }

      selected.forEach((item) => {
        container.append(listStyle ? makeListItem(item, type) : makeStoreCard(item, type));
      });
    } catch (error) {
      container.classList.add("yw-content-grid--empty");
      container.textContent = isEnglish
        ? "Content could not be loaded yet. Please try again later."
        : "Konten belum dapat dimuat. Silakan coba lagi nanti.";
      console.warn("[Yakka Works] Content list:", error);
    }
  }

  document.querySelectorAll("[data-yw-grid]").forEach(render);
})();
