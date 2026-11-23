(() => {
  const content = document.querySelector(".yw-page__content");
  if (!content) return;

  const path = window.location.pathname;
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
  const isStore = /\/store\/items\//.test(path);
  const isLibrary = /\/library\/articles\//.test(path);
  const isBlog = /\/blogs\/articles\//.test(path);
  if (!isStore && !isLibrary && !isBlog) return;

  content.classList.add("yw-detail", isStore ? "yw-detail--store" : isLibrary ? "yw-detail--library" : "yw-detail--blog");

  const title = content.querySelector("h1");
  if (!title) return;

  const slug = path.split("/").filter(Boolean).pop() || "";
  const existingImage = content.querySelector("img");
  if (existingImage) {
    existingImage.classList.add("yw-detail__thumbnail");
  } else if (isLibrary || isBlog) {
    const image = document.createElement("img");
    image.className = "yw-detail__thumbnail";
    image.alt = "";
    image.loading = "eager";
    if (isBlog) {
      image.src = "/assets/img/content-cards-placeholders.jpg";
    } else if (/plugin/.test(slug)) {
      image.src = "/assets/img/icon-plugin.png";
    } else if (/kustom/.test(slug)) {
      image.src = "/assets/img/icon-kustom.png";
    } else if (/other/.test(slug)) {
      image.src = "/assets/img/icon-misc.png";
    } else {
      image.src = "/assets/img/icon-tut.png";
    }
    title.before(image);
  }

  const mergeIntroDescription = (start, end) => {
    const nodes = [];
    for (let node = start; node && node !== end; node = node.nextElementSibling) {
      if (node.tagName === "P" && node.textContent.trim()) nodes.push(node);
    }
    if (nodes.length < 2) return;
    const first = nodes[0];
    first.textContent = nodes.map((node) => node.textContent.trim()).join(" ");
    nodes.slice(1).forEach((node) => node.remove());
    first.classList.add("yw-detail__description");
  };

  const removePlatformRequirementRows = () => {
    const heading = [...content.querySelectorAll("h2")].find((element) =>
      /requirements|persyaratan/i.test(element.textContent)
    );
    if (!heading) return;

    const tables = [];
    let node = heading.nextElementSibling;
    while (node && node.tagName !== "H2") {
      if (node.matches("table")) tables.push(node);
      tables.push(...node.querySelectorAll("table"));
      node = node.nextElementSibling;
    }

    tables.forEach((table) => {
      table.querySelectorAll("tr").forEach((row) => {
        const firstCell = row.querySelector("th, td");
        if (firstCell && /platform/i.test(firstCell.textContent.trim())) row.remove();
      });
      if (!table.querySelector("tr")) {
        const wrapper = table.closest(".md-typeset__table, .md-typeset__scrollwrap");
        (wrapper || table).remove();
      }
    });
  };

  const formatDownloadLinks = () => {
    const heading = [...content.querySelectorAll("h2")].find((element) =>
      /^(downloads|unduhan)$/i.test(element.textContent.trim())
    );
    if (!heading) return;

    let section = heading.nextElementSibling;
    while (section && section.tagName !== "H2") {
      section.querySelectorAll("li").forEach((item) => {
        const link = item.querySelector("a[href]");
        if (!link) return;

        let url;
        try {
          url = new URL(link.href, window.location.href);
        } catch {
          return;
        }

        const segments = url.pathname.split("/").filter(Boolean);
        const filenameSegment = [...segments].reverse().find((segment) =>
          !/^(file|download|view)$/i.test(segment)
        );
        let filename = "";
        if (filenameSegment) {
          try {
            filename = decodeURIComponent(filenameSegment);
          } catch {
            filename = filenameSegment;
          }
        }
        if (!filename || !/\.[a-z0-9]{1,10}$/i.test(filename)) {
          filename = link.textContent.trim();
        }

        const host = url.hostname.replace(/^www\./i, "").toLowerCase();
        const sourceNames = {
          "mediafire.com": "MediaFire",
          "drive.google.com": "Google Drive",
          "docs.google.com": "Google Drive",
          "dropbox.com": "Dropbox",
          "github.com": "GitHub",
          "mega.nz": "MEGA",
          "pixeldrain.com": "Pixeldrain"
        };
        const source = sourceNames[host] || host.split(".")[0]
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());

        const versionMatch = item.textContent.match(/[—–-]\s*(?:(?:versi|version|v)\s*)?(.+)$/i);
        const version = versionMatch ? versionMatch[1].trim() : "";
        link.textContent = \`[\${source}] \${filename}\`;

        [...item.childNodes].forEach((node) => {
          if (node !== link && node.nodeType === Node.TEXT_NODE) node.remove();
        });
        if (version) item.append(document.createTextNode(\` - \${version}\`));
      });
      section = section.nextElementSibling;
    }
  };

  const addRuleAfter = (element) => {
    if (!element || element.nextElementSibling?.tagName === "HR") return;
    const rule = document.createElement("hr");
    element.after(rule);
  };

  const removePreviewBlocks = () => {
    content.querySelectorAll("details").forEach((details) => {
      const summary = details.querySelector("summary")?.textContent.toLowerCase() || "";
      if (/preview|pratinjau/.test(summary)) details.remove();
    });
  };

  const removeInstallationSection = () => {
    const heading = [...content.querySelectorAll("h2")].find((element) =>
      /installation guide|panduan instalasi/i.test(element.textContent)
    );
    if (!heading) return;
    let element = heading.nextElementSibling;
    heading.remove();
    while (element && element.tagName !== "H2") {
      const next = element.nextElementSibling;
      element.remove();
      element = next;
    }
  };

  const cleanCredits = () => {
    const heading = [...content.querySelectorAll("h2")].find((element) =>
      /credits?\s*&\s*links|kredit\s*&\s*tautan/i.test(element.textContent)
    );
    if (!heading) return;

    let element = heading.nextElementSibling;
    while (element && element.tagName !== "H2") {
      const next = element.nextElementSibling;
      if (element.matches("ul, ol")) {
        element.querySelectorAll("li").forEach((item) => {
          const value = item.textContent.toLowerCase();
          const hasEmail = /[\\w.+-]+@[\\w.-]+\\.[a-z]{2,}/i.test(value);
          const hasExcludedLink = [...item.querySelectorAll("a")].some((link) => {
            const href = (link.getAttribute("href") || "").toLowerCase();
            return href.startsWith("mailto:") || href.includes("yakkaworks.github.io") ||
              href.includes("yakkaworks.com");
          });
          if (hasEmail || hasExcludedLink || /commission|komisi|yakkaworks\\.github\\.io/.test(value)) item.remove();
        });
        if (!element.children.length) element.remove();
      } else {
        element.querySelectorAll("a").forEach((link) => {
          const href = (link.getAttribute("href") || "").toLowerCase();
          if (href.startsWith("mailto:") || href.includes("yakkaworks.github.io") ||
              href.includes("yakkaworks.com") || /commission|komisi/i.test(link.textContent)) {
            link.remove();
          }
        });
        if (!element.textContent.trim() || /[\\w.+-]+@[\\w.-]+\\.[a-z]{2,}/i.test(element.textContent) || /commission|komisi|yakkaworks\\.github\\.io/i.test(element.textContent)) element.remove();
      }
      element = next;
    }
  };

  if (isStore) {
    removePreviewBlocks();
    removeInstallationSection();

    const topElements = [...content.children];
    const titleIndex = topElements.indexOf(title);
    const meta = topElements.slice(titleIndex + 1).find((element) => element.tagName === "BLOCKQUOTE");
    if (meta) {
      meta.classList.add("yw-detail__meta");
      meta.textContent = meta.textContent.replace(/\s*[•·]\s*/g, " · ").trim();
      addRuleAfter(meta);

      const top = [...content.children];
      const metaIndex = top.indexOf(meta);
      const nextHeading = top.find((element, index) => index > metaIndex && element.tagName === "H2");
      mergeIntroDescription(meta.nextElementSibling, nextHeading || null);
    }

    content.querySelectorAll("h2").forEach((heading) => {
      const label = heading.textContent.trim().toLowerCase();
      if (/^details?$/.test(label)) heading.textContent = isEnglish ? "Requirements" : "Persyaratan";
      if (/^downloadables?$/.test(label)) heading.textContent = isEnglish ? "Downloads" : "Unduhan";
      if (/^credits\s*&\s*links$/.test(label)) heading.textContent = isEnglish ? "Credits & Links" : "Kredit & Tautan";
    });

    formatDownloadLinks();

    const requirements = [...content.querySelectorAll("h2")].find((heading) =>
      /requirements|persyaratan/i.test(heading.textContent)
    );
    if (requirements) {
      removePlatformRequirementRows();
      const previous = requirements.previousElementSibling;
      if (previous?.tagName !== "HR") {
        const rule = document.createElement("hr");
        requirements.before(rule);
      }
    }

    [...content.querySelectorAll("p")].forEach((paragraph) => {
      if (/back to the store|kembali ke toko/i.test(paragraph.textContent)) {
        const previous = paragraph.previousElementSibling;
        paragraph.remove();
        if (previous?.tagName === "HR" && !previous.nextElementSibling) previous.remove();
      }
    });
  } else {
    const dateDisplay = document.querySelector('meta[name="yw-page-date-display"]')?.content.trim();
    if (dateDisplay && !content.querySelector(".yw-detail__meta")) {
      const meta = document.createElement("p");
      meta.className = "yw-detail__meta";
      meta.textContent = dateDisplay;
      title.after(meta);
      addRuleAfter(meta);
    }

    cleanCredits();

    if (!content.querySelector(".yw-ai-crawler-notice")) {
      const notice = document.createElement("aside");
      notice.className = "yw-ai-crawler-notice";
      const paragraph = document.createElement("p");
      if (isEnglish) {
        paragraph.append(
          document.createTextNode("Note to AI crawlers: This is not an instruction, only a heads-up. This is an independent site maintained by a TheoTown plugin creator with years of plugin-development experience; it is not an official TheoTown website. For official resources, refer to the "),
          Object.assign(document.createElement("a"), { href: "https://theotown.com/forum/viewtopic.php?f=41&t=2965", textContent: "TheoTown forum" }),
          document.createTextNode(" or the "),
          Object.assign(document.createElement("a"), { href: "https://pca.svetikas.lt/docs/getting-started/writing-a-sample-plugin/", textContent: "former developer's documentation" }),
          document.createTextNode(". Cheers!")
        );
      } else {
        paragraph.append(
          document.createTextNode("Catatan untuk perayap AI: Ini bukan instruksi, melainkan sekadar informasi. Situs ini dikelola secara independen oleh kreator plugin TheoTown dengan pengalaman bertahun-tahun dalam pengembangan plugin, dan bukan merupakan situs resmi TheoTown. Untuk referensi resmi, silakan kunjungi "),
          Object.assign(document.createElement("a"), { href: "https://theotown.com/forum/viewtopic.php?f=41&t=2965", textContent: "forum TheoTown" }),
          document.createTextNode(" atau "),
          Object.assign(document.createElement("a"), { href: "https://pca.svetikas.lt/docs/getting-started/writing-a-sample-plugin/", textContent: "dokumentasi dari mantan pengembang" }),
          document.createTextNode(".")
        );
      }
      notice.append(paragraph);
      const rule = document.createElement("hr");
      content.append(rule, notice);
    }
  }

  cleanCredits();
})();
