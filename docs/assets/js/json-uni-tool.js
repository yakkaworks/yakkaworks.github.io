(() => {
  'use strict';

  const initJsonTool = () => {
    const root = document.getElementById('json-uni-tool');
    if (!root || root.dataset.initialized === 'true') return;
    root.dataset.initialized = 'true';

    const $ = (id) => root.querySelector(`#${id}`);
    const input = $('yw-json-input');
    const output = $('yw-json-output');
    const fileInput = $('yw-json-file');
    const status = $('yw-json-status');
    const isId = root.dataset.locale === 'id';
    let outputFilename = 'json-output.json';

    const messages = {
      empty: isId ? 'Masukkan JSON terlebih dahulu.' : 'Enter JSON first.',
      valid: isId ? 'JSON valid.' : 'Valid JSON.',
      invalid: isId ? 'JSON tidak valid:' : 'Invalid JSON:',
      commentsHint: isId
        ? 'JSON standar tidak mendukung komentar. Coba Hapus komentar terlebih dahulu.'
        : 'Standard JSON does not support comments. Try Remove comments first.',
      formatted: isId ? 'JSON berhasil diformat.' : 'JSON formatted.',
      minified: isId ? 'JSON berhasil di-minify.' : 'JSON minified.',
      commentsRemoved: isId ? 'Komentar dihapus.' : 'Comments removed.',
      commentsInvalid: isId
        ? 'Komentar dihapus, tetapi hasilnya masih bukan JSON yang valid:'
        : 'Comments removed, but the result is still not valid JSON:',
      copied: isId ? 'Hasil disalin.' : 'Output copied.',
      copyFailed: isId ? 'Gagal menyalin. Pilih teks hasil lalu salin secara manual.' : 'Could not copy. Select the output text and copy it manually.',
      noOutput: isId ? 'Belum ada hasil untuk disalin atau diunduh.' : 'There is no output to copy or download yet.',
      readFail: isId ? 'File tidak dapat dibaca.' : 'Could not read the file.',
      zipLoading: isId ? 'Membuka ZIP plugin…' : 'Opening plugin ZIP…',
      zipMissing: isId ? 'Tidak menemukan file bernama plugin.manifest di dalam ZIP.' : 'No file named plugin.manifest was found inside the ZIP.',
      zipMultiple: isId ? 'Beberapa plugin.manifest ditemukan; menggunakan:' : 'Multiple plugin.manifest files found; using:',
      loaded: isId ? 'File dimuat:' : 'Loaded file:',
      clear: isId ? 'Input dan hasil dibersihkan.' : 'Input and output cleared.',
      zipLibFailed: isId ? 'Pustaka pembaca ZIP gagal dimuat. Periksa koneksi internet lalu coba lagi.' : 'Could not load the ZIP reader. Check your internet connection and try again.',
      tooLarge: isId ? 'File terlalu besar. Batas ukuran file input adalah 25 MB.' : 'File is too large. The input file size limit is 25 MB.'
    };

    const setStatus = (message, type = 'neutral') => {
      status.textContent = message;
      status.dataset.type = type;
    };

    const currentText = () => output.value.trim() ? output.value : input.value;

    const parseInput = () => {
      const text = currentText();
      if (!text.trim()) throw new Error(messages.empty);
      try {
        return JSON.parse(text);
      } catch (error) {
        const detail = error && error.message ? error.message : String(error);
        const wrapped = new Error(`${messages.invalid} ${detail}`);
        wrapped.isParseError = true;
        throw wrapped;
      }
    };

    // Strip // and /* */ only outside double-quoted JSON strings.
    // Newlines inside comments are retained for more useful parse-error line numbers.
    const stripComments = (source) => {
      let result = '';
      let inString = false;
      let escaped = false;
      let i = 0;

      while (i < source.length) {
        const ch = source[i];
        const next = source[i + 1];

        if (inString) {
          result += ch;
          if (escaped) escaped = false;
          else if (ch === '\\') escaped = true;
          else if (ch === '"') inString = false;
          i += 1;
          continue;
        }

        if (ch === '"') {
          inString = true;
          result += ch;
          i += 1;
          continue;
        }

        if (ch === '/' && next === '/') {
          i += 2;
          while (i < source.length && source[i] !== '\n' && source[i] !== '\r') i += 1;
          continue;
        }

        if (ch === '/' && next === '*') {
          i += 2;
          while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) {
            if (source[i] === '\n' || source[i] === '\r') result += source[i];
            i += 1;
          }
          if (i >= source.length) throw new Error(isId ? 'Komentar blok tidak ditutup (/* … */).' : 'Unterminated block comment (/* … */).');
          i += 2;
          continue;
        }

        result += ch;
        i += 1;
      }

      return result;
    };

    const showError = (error) => {
      setStatus(error.message || String(error), 'error');
      if (error.isParseError) {
        setStatus(`${error.message} ${messages.commentsHint}`, 'error');
      }
    };

    const runAction = (action) => {
      if (action === 'clear') {
        input.value = '';
        output.value = '';
        fileInput.value = '';
        outputFilename = 'json-output.json';
        setStatus(messages.clear);
        input.focus();
        return;
      }

      if (action === 'copy') {
        if (!output.value.trim()) return setStatus(messages.noOutput, 'error');
        output.focus();
        output.select();
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(output.value)
            .then(() => setStatus(messages.copied, 'success'))
            .catch(() => setStatus(messages.copyFailed, 'error'));
        } else {
          const copied = document.execCommand && document.execCommand('copy');
          setStatus(copied ? messages.copied : messages.copyFailed, copied ? 'success' : 'error');
        }
        return;
      }

      if (action === 'download') {
        if (!output.value.trim()) return setStatus(messages.noOutput, 'error');
        const blob = new Blob([output.value], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = outputFilename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus(isId ? `Hasil diunduh sebagai ${outputFilename}.` : `Output downloaded as ${outputFilename}.`, 'success');
        return;
      }

      try {
        if (action === 'comments') {
          if (!input.value.trim()) throw new Error(messages.empty);
          const source = currentText();
          if (!source.trim()) throw new Error(messages.empty);
          const clean = stripComments(source);
          output.value = clean.trim() ? `${clean.trim()}\n` : '';
          try {
            JSON.parse(clean);
            setStatus(messages.commentsRemoved + ' ' + messages.valid, 'success');
          } catch (error) {
            const detail = error && error.message ? error.message : String(error);
            setStatus(`${messages.commentsInvalid} ${detail}`, 'error');
          }
          return;
        }

        const value = parseInput();
        if (action === 'validate') {
          setStatus(messages.valid, 'success');
        } else if (action === 'format') {
          output.value = JSON.stringify(value, null, 2) + '\n';
          setStatus(messages.formatted, 'success');
        } else if (action === 'minify') {
          output.value = JSON.stringify(value);
          setStatus(messages.minified, 'success');
        }
      } catch (error) {
        showError(error);
      }
    };

    const loadJsZip = () => new Promise((resolve, reject) => {
      if (window.JSZip) return resolve(window.JSZip);
      const existing = document.querySelector('script[data-yw-jszip="true"]');
      if (existing) {
        existing.addEventListener('load', () => window.JSZip ? resolve(window.JSZip) : reject(new Error(messages.zipLibFailed)), { once: true });
        existing.addEventListener('error', () => reject(new Error(messages.zipLibFailed)), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
      script.async = true;
      script.dataset.ywJszip = 'true';
      script.onload = () => window.JSZip ? resolve(window.JSZip) : reject(new Error(messages.zipLibFailed));
      script.onerror = () => reject(new Error(messages.zipLibFailed));
      document.head.appendChild(script);
    });

    const loadFile = async (file) => {
      if (!file) return;
      if (file.size > 25 * 1024 * 1024) {
        setStatus(messages.tooLarge, 'error');
        fileInput.value = '';
        return;
      }
      try {
        const extension = file.name.toLowerCase();
        if (extension.endsWith('.zip')) {
          setStatus(messages.zipLoading);
          const JSZip = await loadJsZip();
          const zip = await JSZip.loadAsync(await file.arrayBuffer());
          const matches = Object.keys(zip.files).filter((path) => {
            const item = zip.files[path];
            return !item.dir && path.split('/').pop().toLowerCase() === 'plugin.manifest';
          });
          if (!matches.length) throw new Error(messages.zipMissing);
          matches.sort((a, b) => {
            const aDepth = a.split('/').length;
            const bDepth = b.split('/').length;
            if (aDepth !== bDepth) return aDepth - bDepth;
            return a.localeCompare(b);
          });
          const chosen = matches[0];
          input.value = await zip.file(chosen).async('string');
          output.value = '';
          outputFilename = 'plugin.manifest';
          const note = matches.length > 1 ? `${messages.zipMultiple} ${chosen}` : `${messages.loaded} ${chosen}`;
          setStatus(note, 'success');
        } else {
          input.value = await file.text();
          output.value = '';
          outputFilename = extension.endsWith('.manifest') || extension.split('/').pop() === 'plugin.manifest'
            ? 'plugin.manifest'
            : file.name;
          setStatus(`${messages.loaded} ${file.name}`, 'success');
        }
      } catch (error) {
        showError(error);
      }
    };

    root.querySelectorAll('[data-json-action]').forEach((button) => {
      button.addEventListener('click', () => runAction(button.dataset.jsonAction));
    });
    fileInput.addEventListener('change', () => loadFile(fileInput.files && fileInput.files[0]));
    input.addEventListener('input', () => {
      // Keep the user's input but avoid showing a stale transform as the current result.
      output.value = '';
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJsonTool, { once: true });
  } else {
    initJsonTool();
  }
})();
