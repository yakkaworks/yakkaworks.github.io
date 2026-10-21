---
title: JSON Uni Tool
description: Periksa, format, minify, dan hapus komentar dari JSON atau plugin.manifest.
hide:
  - toc
---

# JSON Uni Tool

Alat sederhana untuk memeriksa validitas JSON, merapikan format, minify, atau menghapus komentar. Kamu bisa menempelkan teks, mengunggah file `.json` atau `plugin.manifest`, maupun mengunggah ZIP plugin yang berisi `plugin.manifest`.

<div class="yw-json-tool" id="json-uni-tool" data-locale="id">
  <div class="yw-json-tool__field">
    <label for="yw-json-input">Input JSON / plugin.manifest</label>
    <textarea id="yw-json-input" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder='Tempel JSON atau isi plugin.manifest di sini…'></textarea>
  </div>

  <div class="yw-json-tool__file-row">
    <label class="yw-json-tool__upload" for="yw-json-file">Pilih file JSON, plugin.manifest, atau ZIP plugin</label>
    <input id="yw-json-file" type="file" accept=".json,.manifest,.zip,application/json,application/zip">
    <p class="yw-json-tool__hint">Untuk ZIP plugin, alat mencari file yang bernama <code>plugin.manifest</code> di dalam arsip. Isi file ini adalah JSON meskipun ekstensi filenya bukan <code>.json</code>.</p>
  </div>

  <div class="yw-json-tool__actions" role="group" aria-label="Aksi JSON">
    <button class="md-button md-button--primary" type="button" data-json-action="validate">Periksa validitas</button>
    <button class="md-button" type="button" data-json-action="format">Format</button>
    <button class="md-button" type="button" data-json-action="minify">Minify</button>
    <button class="md-button" type="button" data-json-action="comments">Hapus komentar</button>
    <button class="md-button" type="button" data-json-action="clear">Bersihkan</button>
  </div>

  <p id="yw-json-status" class="yw-json-tool__status" role="status" aria-live="polite">Tempel JSON atau unggah file untuk memulai. Semua pemrosesan dilakukan di browser.</p>

  <div class="yw-json-tool__field">
    <label for="yw-json-output">Hasil</label>
    <textarea id="yw-json-output" spellcheck="false" readonly placeholder="Teks hasil transformasi akan muncul di sini…"></textarea>
  </div>

  <div class="yw-json-tool__actions">
    <button class="md-button" type="button" data-json-action="copy">Salin hasil</button>
    <button class="md-button" type="button" data-json-action="download">Unduh hasil</button>
  </div>
  <p class="yw-json-tool__hint">Catatan: komentar bukan bagian dari standar JSON. Jika file memakai komentar <code>//</code> atau <code>/* … */</code>, gunakan Hapus komentar terlebih dahulu, lalu periksa atau format hasilnya. Komentar di dalam string seperti URL tidak akan dihapus.</p>
</div>
