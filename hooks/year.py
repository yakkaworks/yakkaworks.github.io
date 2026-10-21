"""MkDocs hook: expose the current year so the footer's end year never goes stale."""

from datetime import date


def on_config(config, **kwargs):
    config.extra["year"] = date.today().year
    return config
