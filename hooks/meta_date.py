"""Normalize page publication dates for the Yakka Works document header."""

from datetime import date, datetime
import re


_MONTHS = (
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
)
_DMY_RE = re.compile(r"^(\d{1,2})-(\d{1,2})-(\d{2}|\d{4})$")
_ISO_RE = re.compile(r"^(\d{4})-(\d{2})-(\d{2})$")


def _parse_publication_date(value):
    """Accept dd-mm-yy (preferred), dd-mm-yyyy, ISO dates, or YAML date objects."""
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if not isinstance(value, str):
        return None

    value = value.strip()
    match = _DMY_RE.fullmatch(value)
    if match:
        day, month, year = (int(part) for part in match.groups())
        if year < 100:
            year += 2000
    else:
        match = _ISO_RE.fullmatch(value)
        if not match:
            return None
        year, month, day = (int(part) for part in match.groups())

    try:
        return date(year, month, day)
    except ValueError:
        return None


def on_page_markdown(markdown, page, config, files):
    """Add display and machine-readable forms of the page's publication date."""
    if not page or not getattr(page, "meta", None):
        return markdown

    published = _parse_publication_date(page.meta.get("date"))
    if published:
        page.meta["date_iso"] = published.isoformat()
        page.meta["date_display"] = (
            f"{published.day:02d}/{_MONTHS[published.month - 1]}/{published.year:04d}"
        )

    return markdown
