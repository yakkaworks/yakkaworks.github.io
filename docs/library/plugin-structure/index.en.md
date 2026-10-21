# Understanding Plugin File Structure

> Guides · 22-01-2026 · By Yakka Works

How TheoTown plugin folders and files are organized, and why it matters.

A plugin’s folder structure is part of how the game discovers and loads its content. Keep related configuration, textures, and supporting files together, and preserve the exact paths expected by the plugin format.

File names and paths should be consistent. A reference to a file that differs by a character, extension, or letter case may work in one environment and fail in another. Avoid unnecessary nesting unless the format or your project specifically requires it.

For maintainability, separate original editable assets from generated output, use descriptive names, and keep a small changelog when the plugin changes. When sharing a project, include only the files needed to install or develop it and make external dependencies clear.

If a plugin does not appear in-game, verify the install location and directory layout first, then check file syntax and the game’s logs or error messages.
