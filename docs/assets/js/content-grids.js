(() => {
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
  const root = "https://raw.githubusercontent.com/yakkaworks/yakkaworks.github.io/main/webdata/json/";
  const imageRoot = "https://raw.githubusercontent.com/yakkaworks/yakkaworks.github.io/main/";
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
        const candidates = isEnglish ? [root + "en/" + file, root + file] : [root + file];
        for (const url of candidates) {
          const response = await fetch(url);
          if (response.ok) return response.json();
        }
        throw new Error("Unable to load " + file);
      })());
    }
    return cache.get(name);
  }

  const text = (value) => String(value ?? "").trim();
  const categories = (item) => (Array.isArray(item.category) ? item.category : [item.category || ""]).join(" ").toLowerCase();
  const haystack = (item) => [item.title, item.slug, item.Description, ...((item.category || []))].join(" ").toLowerCase();

  function matches(item, filter) {
    const value = haystack(item);
    switch (filter) {
      case "maps": return /\bmap(s)?\b|peta/.test(value);
      case "presets": return /preset/.test(value);
      case "plugins": return !/\bmap(s)?\b|peta|preset/.test(value);
      case "general": return !/plugin|kustom/.test(value);
      case "kustom": return /kustom|kwgt|klwp/.test(value);
      case "misc": return /misc|lainnya|other/.test(value) || (!/plugin|kustom|guide|tutorial/.test(value));
      case "announcements": return /announcement|pengumuman/.test(categories(item));
      case "devlogs": return /devlog|development|pengembangan/.test(categories(item));
      case "communities": return /communit|komunitas/.test(categories(item));
      default: return true;
    }
  }

  function localAsset(path) {
    const value = text(path);
    if (!value) return "/assets/img/placeholder.jpg";
    if (/^https?:\/\//i.test(value) || value.startsWith("/")) return value;
    if (value.startsWith("webdata/")) return imageRoot + value;
    return "/" + value.replace(/^\.\//, "");
  }

  function makeCard(item, kind) {
    const card = document.createElement("article");
    card.className = "yw-content-card";

    const thumb = document.createElement("img");
    thumb.className = "yw-content-card__thumb";
    thumb.src = localAsset(item.Thumbnails || item.thumbnail);
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

    const meta = document.createElement("p");
    meta.className = "yw-content-card__meta";
    const version = text(item.Version || item.version);
    const date = text(item.Date || item.date);
    meta.textContent = [version ? "v" + version : "", date].filter(Boolean).join(" · ");
    if (meta.textContent) body.append(meta);

    const actions = document.createElement("div");
    actions.className = "yw-content-card__actions";
    const urls = item.urls || {};
    const download = Array.isArray(urls.download) ? urls.download[0] : urls.download;
    const details = urls.Details || urls.details || urls.link;
    if (download && download !== "#") {
      const button = document.createElement("a");
      button.className = "yw-button yw-button--primary";
      button.href = download;
      button.textContent = "Download Latest";
      if (/^https?:\/\//i.test(download)) { button.target = "_blank"; button.rel = "noopener noreferrer"; }
      actions.append(button);
    }
    if (details && details !== "#") {
      const button = document.createElement("a");
      button.className = "yw-button yw-button--outline";
      button.href = /^https?:\/\//i.test(details) || details.startsWith("/") ? details : "/" + details.replace(/^\.\//, "");
      button.textContent = "Details";
      actions.append(button);
    }
    if (actions.childElementCount) body.append(actions);
    card.append(body);
    return card;
  }

  async function render(grid) {
    const type = grid.dataset.ywGrid;
    const filter = grid.dataset.ywFilter || "";
    const limit = grid.dataset.ywLimit || "all";
    try {
      const items = await load(type);
      let selected = items.filter((item) => matches(item, filter));
      selected.sort((a, b) => {
        const parse = (value) => {
          const [d, m, y] = text(value).split("-").map(Number);
          return y && m && d ? new Date(y, m - 1, d).getTime() : 0;
        };
        return parse(b.Date || b.date) - parse(a.Date || a.date);
      });
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