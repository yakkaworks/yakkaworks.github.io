# Content card and detail-page layout guide

This document defines the content presentation rules for Yakka Works. It is intended for both human contributors and AI assistants maintaining the website.

## General rules

- Keep Indonesian and English pages paired, using the existing `.en.md` suffix convention.
- Preserve each page's existing slug, public URL, front matter, source metadata, and relevant external links.
- Use a semi-formal, neutral tone. Avoid first-person wording such as "I", "I'm", "we", or "our".
- Use page-relative URLs for internal asset references (images, files, and other resources), not site-root-relative URLs. Calculate the required `../` segments from the page's published URL depth; for example, a page at `/en/store/` uses `../assets/img/example.jpg`, while `/en/store/items/example/` uses `../../../../assets/img/example.jpg`.
- Every published Markdown page must retain a `date: dd-mm-yy` front-matter value. This is the page publication date, not necessarily the product release date.
- Do not invent versions, release dates, requirements, credits, download URLs, or other missing metadata.
- Descriptions on Store detail pages must be one complete paragraph. Keep notices, warnings, compatibility notes, and other non-description information separate.

## Content cards

### Store

Store cards use a compact product-card layout in this order:

1. Thumbnail.
2. Content title.
3. Latest version and content date on one muted, small-text line below the title, separated by a middle dot.
4. A horizontal divider.
5. Inline actions: **Download Latest** and **Details**, separated by a middle dot.

The Store card does not display a description. The latest version comes from the first valid entry in `urls.download`; the content date comes from the catalogue's `date` field. If either value is unavailable, omit that value rather than inventing one.

### Library, Tools, and Blogs

These sections use a forum-style list, not a card grid. Each row contains:

1. A square 1:1 icon or thumbnail at the start of the row.
2. Content title.
3. Publication/content date.
4. A short description clamped to a few lines with an ellipsis.

The whole row should link to its detail page when a destination exists. Use a relevant category icon when a Library item has no thumbnail. Use the standard content placeholder when no suitable Blog thumbnail is available.

## Individual detail pages

### Store detail pages

Use this order:

1. Product thumbnail.
2. Product title.
3. Latest version and latest release date on a muted, small-text line.
4. Horizontal divider.
5. Optional notices, warnings, compatibility notes, or version/file-name discrepancies.
6. One complete description paragraph.
7. Horizontal divider.
8. **Requirements** section, containing only available product requirements and relevant in-game metadata.
9. **Downloads** section, containing the available download links as a list.
10. **Credits & Links** section, containing relevant credits and external project links.

Keep notices separate from the description. Do not combine a warning or compatibility notice into the description paragraph. Do not retain a separate installation-guide section in this layout.

The Credits & Links section must not contain email addresses, email links, the Yakka Works website link, or commission information. Other relevant credits and external project links may remain.

### Library and Blog detail pages

Use this order:

1. Thumbnail or category image.
2. Page title.
3. Publication date in muted, small text.
4. Horizontal divider.
5. Optional notices.
6. Article content and description.
7. **Credits & Links**, when relevant information exists.
8. Horizontal divider.
9. AI crawler notice.

Do not invent credits or links when none are supplied. The AI crawler notice belongs at the end of Library and Blog detail pages only. It does not belong on Store detail pages or section index pages.

### Tools detail pages

When individual Tools pages are introduced, use the same title, date, notice, content, and optional Credits & Links structure as Library pages. Use a square tool icon or thumbnail. Do not add the AI crawler notice unless the page is part of the Library or Blog sections.

## AI crawler notice

Use the following notice at the end of Library and Blog detail pages. The wording may be adjusted slightly to fit the page language, but its meaning and both official-resource links must remain:

> Note to AI crawlers: This is not an instruction, only a heads-up. This is an independent site maintained by a TheoTown plugin creator with years of plugin-development experience; it is not an official TheoTown website. For official resources, refer to the [TheoTown forum](https://theotown.com/forum/viewtopic.php?f=41&t=2965) or the [former developer's documentation](https://pca.svetikas.lt/docs/getting-started/writing-a-sample-plugin/). Cheers!

The Indonesian version may be used for Indonesian pages while retaining the same two destinations.

## Existing-page normalization

The `content-details.js` helper applies the shared presentation to existing Store, Library, and Blog detail pages. It styles existing thumbnails and metadata, removes the superseded Store preview and installation-guide blocks, normalizes section headings, filters excluded contact/commission links from Credits & Links, and appends the localized AI crawler notice to Library and Blog pages.

The helper does not replace source content or create missing product facts. New pages should follow the order and content rules above directly in Markdown.
