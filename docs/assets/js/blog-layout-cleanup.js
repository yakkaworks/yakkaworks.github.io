(() => {
  // Legacy cached blog scripts may still inject the old thank-you and EOF rows.
  // Keep the document-end signature consistent with the current main template.
  const isBlogRoute = /\/blogs(?:\/|$)/i.test(window.location.pathname);
  if (!isBlogRoute) return;

  const removeLegacySignatureBits = () => {
    document.querySelectorAll(".yw-page__thanks, .yw-page__eof").forEach((element) => {
      element.remove();
    });

    // Also remove the old standalone star/thanks text if an older script
    // inserted it without the current class names.
    const signature = document.querySelector(".yw-page__signature");
    if (!signature) return;

    Array.from(signature.children).forEach((element) => {
      const text = element.textContent || "";
      if (/Terima kasih telah membaca|Thank you for reading|\[\s*EOF\s*\]/i.test(text)) {
        element.remove();
      }
    });
  };

  removeLegacySignatureBits();
  document.addEventListener("DOMContentLoaded", removeLegacySignatureBits, { once: true });
})();
