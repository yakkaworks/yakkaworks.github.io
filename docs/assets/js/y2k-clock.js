(() => {
  const clock = document.getElementById("yw-local-clock");
  if (!clock) return;

  const locale = document.documentElement.lang || "id";

  const update = () => {
    const now = new Date();
    const date = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit"
    }).format(now);
    const time = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(now);

    clock.dateTime = now.toISOString();
    clock.textContent = `${date} · ${time}`;
  };

  update();
  window.setInterval(update, 1000);
})();
