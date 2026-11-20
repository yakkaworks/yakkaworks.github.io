(() => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Format ISO dates consistently without relying on the browser's locale or timezone.
  const formatHeaderDate = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(String(value || "").trim());
    if (!match) return null;

    const [, year, month, day] = match;
    const monthIndex = Number(month) - 1;
    const yearNumber = Number(year);
    const dayNumber = Number(day);
    if (monthIndex < 0 || monthIndex > 11) return null;

    const parsed = new Date(Date.UTC(yearNumber, monthIndex, dayNumber));
    if (
      parsed.getUTCFullYear() !== yearNumber ||
      parsed.getUTCMonth() !== monthIndex ||
      parsed.getUTCDate() !== dayNumber
    ) return null;

    return `${day}/${monthNames[monthIndex]}/${year}`;
  };

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

    const date = inner.querySelector("time[datetime], .md-post__date, .md-blog__date");
    if (date) {
      const time = document.createElement("time");
      time.className = "yw-page__date";
      const dateValue = date.getAttribute("datetime");
      if (dateValue) time.dateTime = dateValue;
      time.textContent = formatHeaderDate(dateValue) || date.textContent.trim();
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
