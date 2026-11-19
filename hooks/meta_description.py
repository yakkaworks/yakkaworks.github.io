"""Use the first rendered paragraph of each page as its meta description."""

from html import unescape
import re


_PARAGRAPH = re.compile(r"<p\b[^>]*>(.*?)</p>", re.IGNORECASE | re.DOTALL)
_TAGS = re.compile(r"<[^>]+>")


def on_page_content(html_content, page, config, files):
    """Populate page.meta.description without requiring authors to duplicate it."""
    match = _PARAGRAPH.search(html_content)
    if match:
        paragraph = _TAGS.sub(" ", match.group(1))
        description = " ".join(unescape(paragraph).split())
        if description:
            page.meta["description"] = description[:320]

    return html_content
