(() => {
  // Blog plugin-generated pages can bypass the normal Material content partial.
  // Put those pages in the same Yakka Works document frame as Markdown pages.
  const inner = document.querySelector(".md-content__inner");
  if (inner && !inner.querySelector(".yw-page")) {
    const page = document.createElement("div");
    page.className = "yw-page";

    const heading = inner.querySelector("h1");
    const title = heading?.textContent?.trim() ||
      document.title.replace(/\\s+-\\s+Yakka Works$/, "");

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
      if (date.getAttribute("datetime")) time.dateTime = date.getAttribute("datetime");
      time.textContent = date.textContent.trim();
      bar.append(time);
    }

    const content = document.createElement("div");
    content.className = "yw-page__content";
    while (inner.firstChild) content.append(inner.firstChild);

    page.append(bar, content);
    inner.append(page);
  }

  const searchInput = document.querySelector(".md-search__input");
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const editing = target instanceof HTMLElement &&
      (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
    if (event.key === "/" && !editing && searchInput) {
      event.preventDefault();
      const toggle = document.getElementById("__search");
      if (toggle && !toggle.checked) toggle.checked = true;
      window.setTimeout(() => searchInput.focus(), 0);
    }
  });
})();
