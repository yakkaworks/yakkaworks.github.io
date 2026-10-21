---
title: JSON Uni Tool
description: Validate, format, minify, and remove comments from JSON or plugin.manifest.
hide:
  - toc
---

# JSON Uni Tool

A simple utility to validate JSON, format it, minify it, or remove comments. Paste text, upload a `.json` or `plugin.manifest` file, or upload a plugin ZIP containing `plugin.manifest`.

<div class="yw-json-tool" id="json-uni-tool" data-locale="en">
  <div class="yw-json-tool__field">
    <label for="yw-json-input">JSON / plugin.manifest input</label>
    <textarea id="yw-json-input" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder='Paste JSON or plugin.manifest content here…'></textarea>
  </div>

  <div class="yw-json-tool__file-row">
    <label class="yw-json-tool__upload" for="yw-json-file">Choose a JSON file, plugin.manifest, or plugin ZIP</label>
    <input id="yw-json-file" type="file" accept=".json,.manifest,.zip,application/json,application/zip">
    <p class="yw-json-tool__hint">For plugin ZIPs, the tool searches the archive for a file named exactly <code>plugin.manifest</code>. It contains JSON even though the file extension is not <code>.json</code>.</p>
  </div>

  <div class="yw-json-tool__actions" role="group" aria-label="JSON actions">
    <button class="md-button md-button--primary" type="button" data-json-action="validate">Check validity</button>
    <button class="md-button" type="button" data-json-action="format">Format</button>
    <button class="md-button" type="button" data-json-action="minify">Minify</button>
    <button class="md-button" type="button" data-json-action="comments">Remove comments</button>
    <button class="md-button" type="button" data-json-action="clear">Clear</button>
  </div>

  <p id="yw-json-status" class="yw-json-tool__status" role="status" aria-live="polite">Paste JSON or upload a file to begin. Processing happens in your browser.</p>

  <div class="yw-json-tool__field">
    <label for="yw-json-output">Output</label>
    <textarea id="yw-json-output" spellcheck="false" readonly placeholder="Transformed text will appear here…"></textarea>
  </div>

  <div class="yw-json-tool__actions">
    <button class="md-button" type="button" data-json-action="copy">Copy output</button>
    <button class="md-button" type="button" data-json-action="download">Download output</button>
  </div>
  <p class="yw-json-tool__hint">Note: comments are not part of the JSON standard. If a file contains <code>//</code> or <code>/* … */</code> comments, use Remove comments first, then validate or format the result. Comment-like text inside strings, such as URLs, is preserved.</p>
</div>
