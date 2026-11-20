# Catalog JSON

These datasets are authored on `y2k-dev` and copied into the generated site by `hooks/site_assets.py`. They are intentionally independent of the production branch.

Each file contains a JSON array of entries:

```json
[
  {
    "slug": "slug-name",
    "title": "Entry title",
    "date": "20-11-26",
    "thumbnail": "https://example.com/thumbnail.jpg",
    "description": "A short summary shown on the content card.",
    "category": "announcement",
    "urls": {
      "download": [
        {
          "url": "https://example.com/download",
          "ver": "1.0"
        }
      ],
      "details": "https://example.com/details",
      "Article": "https://example.com/article"
    }
  }
]
```

## Fields

- `slug`, `title`, and `date` identify the entry. Use `DD-MM-YY` for dates.
- `thumbnail` is optional; entries without one use the site's generic thumbnail.
- `description` is optional and should be kept short.
- `category` is optional; it is used by the store and blog category filters (for example `plugin`, `map`, `preset`, `announcement`, `devlog`, or `community`). It may also be an array of category strings.
- `urls.download` is an optional array. The first valid entry is treated as the latest download and its `ver` is displayed.
- `urls.details` is the optional details-page URL for store entries.
- `urls.Article` is the article URL for library and blog entries. Those cards are clickable as a whole and do not show a Details button.

## Files

- `data_theotown.json`: TheoTown plugins, maps, and presets.
- `data_kustom.json`: Kustom content.
- `data_mcb.json`: miscellaneous content.
- `data_library.json`: tutorials and library articles.
- `data_blogs.json`: announcements, devlogs, and community posts.
- `en/`: English-language equivalents, using the same schema.

Keep each dataset valid JSON (no comments or trailing commas).
