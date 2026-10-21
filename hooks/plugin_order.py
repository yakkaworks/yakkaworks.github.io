"""MkDocs hook: make static-i18n and the Material blog plugin work together.

Problem: static-i18n's on_files (priority -100) runs AFTER the blog plugin's
on_files (priority -50) and replaces every File object. The blog plugin keeps
pointing at the old objects, so its posts stay "excluded" and are never built
(and its archive/category pages get dropped).

Fix: run static-i18n's on_files FIRST, so the blog plugin works on the final
File objects. Pinned versions are in requirements.txt; if a future plugin
update breaks the blog, this hook is the first suspect (delete it to compare).
"""


def on_config(config, **kwargs):
    events = config.plugins.events.get("files", [])
    i18n = [
        m
        for m in events
        if type(getattr(m, "__self__", None)).__module__.startswith("mkdocs_static_i18n")
    ]
    if i18n:
        for m in i18n:
            events.remove(m)
        for m in reversed(i18n):
            events.insert(0, m)
    return config


def on_env(env, config, files, **kwargs):
    """The blog's generated archive/category pages are created after static-i18n
    has finished, so they miss the attributes its sitemap template needs."""
    plugin = next(
        (p for p in config.plugins.values() if type(p).__module__.startswith("mkdocs_static_i18n")),
        None,
    )
    if plugin is None:
        return env
    for f in files:
        if not hasattr(f, "alternates"):
            f.alternates = {plugin.current_language: f}
    return env
