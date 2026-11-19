(() => {
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
