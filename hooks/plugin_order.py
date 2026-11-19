"""Keep static-i18n file processing ahead of Material's blog plugin."""


def on_config(config, **kwargs):
    events = config.plugins.events.get("files", [])
    i18n = [
        callback
        for callback in events
        if type(getattr(callback, "__self__", None)).__module__.startswith(
            "mkdocs_static_i18n"
        )
    ]
    if i18n:
        for callback in i18n:
            events.remove(callback)
        for callback in reversed(i18n):
            events.insert(0, callback)
    return config


def on_env(env, config, files, **kwargs):
    """Provide language alternates for generated blog archive pages."""
    plugin = next(
        (
            plugin
            for plugin in config.plugins.values()
            if type(plugin).__module__.startswith("mkdocs_static_i18n")
        ),
        None,
    )
    if plugin is not None:
        for file in files:
            if not hasattr(file, "alternates"):
                file.alternates = {plugin.current_language: file}
    return env
