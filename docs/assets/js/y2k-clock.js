(() => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Parse publication dates without relying on browser locale or timezone.
  // Supports ISO dates, dd-mm-yy front matter, and the dd/mmm/yyyy display form.
  const parseHeaderDate = (value) => {
    const source = String(value || "").trim();
    let year;
    let month;
    let day;
    let match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(source);

    if (match) {
      [, year, month, day] = match;
      year = Number(year);
      month = Number(month);
      day = Number(day);
    } else {
      match = /^(\d{1,2})-(\d{1,2})-(\d{2}|\d{4})$/.exec(source);
      if (match) {
        [, day, month, year] = match;
        day = Number(day);
        month = Number(month);
        year = Number(year);
        if (year < 100) year += 2000;
      } else {
        match = /^(\d{1,2})\/([A-Za-z]{3})\/(\d{4})$/.exec(source);
        if (!match) return null;
        day = Number(match[1]);
        month = monthNames.findIndex((name) => name.toLowerCase() === match[2].toLowerCase()) + 1;
        year = Number(match[3]);
      }
    }

    if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;

    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (
      parsed.getUTCFullYear() !== year ||
      parsed.getUTCMonth() !== month - 1 ||
      parsed.getUTCDate() !== day
    ) return null;

    return {
      iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      display: `${String(day).padStart(2, "0")}/${monthNames[month - 1]}/${year}`
    };
  };

  const formatHeaderDate = (value) => parseHeaderDate(value)?.display || null;

  // Blog plugin-generated pages can bypass the normal Material content partial.
  // Put those pages in the same Yakka Works document frame as Markdown pages.
  const inner = document.querySelector(".md-content__inner");
  if (inner && !inner.querySelector(".yw-page")) {
    const page = document.createElement("div");
    page.className = "yw-page";

    const heading = inner.querySelector("h1");
    const title = heading?.textContent?.replace(/\s*#\s*$/, "").trim() ||
      document.title.replace(/\s+-\s+Yakka Works$/, "");

    const bar = document.createElement("div");
    bar.className = "yw-page__bar";

    const label = document.createElement("span");
    label.className = "yw-page__title";
    label.textContent = title;
    bar.append(label);

    // Material's blog.html overrides the normal content container, so its
    // document bar is built here. Prefer this page's Markdown front matter date.
    const pageDateDisplay = document.querySelector('meta[name="yw-page-date-display"]')?.content.trim();
    const pageDateIso = document.querySelector('meta[name="yw-page-date-iso"]')?.content.trim();
    const blogDate = pageDateDisplay || pageDateIso
      ? null
      : inner.querySelector("time[datetime], .md-post__date, .md-blog__date");

    if (pageDateDisplay || pageDateIso || blogDate) {
      const time = document.createElement("time");
      time.className = "yw-page__date";

      const pageDate = parseHeaderDate(pageDateIso) || parseHeaderDate(pageDateDisplay);
      const blogDateValue = blogDate?.getAttribute("datetime") || blogDate?.textContent.trim();
      const parsedBlogDate = parseHeaderDate(blogDateValue);

      if (pageDate) time.dateTime = pageDate.iso;
      else if (parsedBlogDate) time.dateTime = parsedBlogDate.iso;
      else if (blogDate?.getAttribute("datetime")) time.dateTime = blogDate.getAttribute("datetime");

      time.textContent = pageDateDisplay
        ? (formatHeaderDate(pageDateDisplay) || pageDateDisplay)
        : pageDate?.display || parsedBlogDate?.display || blogDate?.textContent.trim() || "";

      bar.append(time);
    }

    const content = document.createElement("div");
    content.className = "yw-page__content";
    while (inner.firstChild) content.append(inner.firstChild);

    const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");

    const signature = document.createElement("div");
    signature.className = "yw-page__signature";

    const support = document.createElement("div");
    support.className = "yw-page__support";
    const supportText = document.createElement("span");
    supportText.textContent = isEnglish
      ? "Support Yakka Works through"
      : "Dukung Yakka Works melalui";
    support.append(supportText);

    [
      ["Saweria", "https://saweria.co/yakkaworks"],
      ["Patreon", "https://www.patreon.com/yakkaworks"]
    ].forEach(([name, href], index) => {
      if (index) {
        const separator = document.createElement("span");
        separator.setAttribute("aria-hidden", "true");
        separator.textContent = "·";
        support.append(separator);
      }
      const link = document.createElement("a");
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = name;
      support.append(link);
    });

    signature.append(support);
    page.append(bar, content, signature);
    inner.append(page);
  }

  // Also normalize dates rendered by the Markdown template when YAML front matter
  // was quoted and therefore loaded as a string instead of a date object.
  inner?.querySelectorAll(".yw-page__date[datetime]").forEach((time) => {
    const formattedDate = formatHeaderDate(time.getAttribute("datetime"));
    if (formattedDate) time.textContent = formattedDate;
  });

  const searchInput = document.querySelector(".md-search__input");
  const searchToggle = document.getElementById("__search");
  const searchRoot = document.querySelector(".yw-search-row");

  // Keep Material's native result panel in sync with the always-visible field.
  if (searchInput && searchToggle) {
    searchInput.addEventListener("focus", () => {
      searchToggle.checked = true;
    });

    searchInput.addEventListener("input", () => {
      searchToggle.checked = true;
    });

    document.addEventListener("pointerdown", (event) => {
      if (searchRoot && !searchRoot.contains(event.target)) {
        searchToggle.checked = false;
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        searchToggle.checked = false;
        searchInput.blur();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const editing = target instanceof HTMLElement &&
      (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
    if (event.key === "/" && !editing && searchInput) {
      event.preventDefault();
      if (searchToggle && !searchToggle.checked) searchToggle.checked = true;
      window.setTimeout(() => searchInput.focus(), 0);
    }
  });
})();
