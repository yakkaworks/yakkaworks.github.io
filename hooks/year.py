"""Expose the current year to the footer template."""

from datetime import date


def on_config(config, **kwargs):
    config.extra["year"] = date.today().year
    return config
