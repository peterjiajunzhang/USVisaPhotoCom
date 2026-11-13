/* File checks run in this browser. Never send file contents or metadata. */
(() => {
  'use strict';
  const panel = document.querySelector('[data-file-check]');
  if (!panel) return;
  const input = panel.querySelector('input');
  const reset = panel.querySelector('[data-reset]');
  const result = panel.querySelector('[data-result]');
  const status = panel.querySelector('[data-status]');
  const messages = Object.fromEntries(Array.from(panel.querySelectorAll('[data-message]'), el => [el.dataset.message, el.textContent]));
  let sequence = 0;

  // Read JPEG frame dimensions before asking the browser to decode a file.
  function jpegFrame(bytes) {
    if (bytes.length < 4 || bytes[0] !== 255 || bytes[1] !== 216) return null;
    let offset = 2;
    while (offset + 3 < bytes.length) {
      if (bytes[offset++] !== 255) return null;
      while (bytes[offset] === 255) offset++;
      const marker = bytes[offset++];
      if (marker === 217 || marker === 218) return null;
      if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
      const length = (bytes[offset] << 8) | bytes[offset + 1];
      if (length < 2 || offset + length > bytes.length) return null;
      if ([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)) {
        if (length < 8) return null;
        return { height: (bytes[offset + 3] << 8) | bytes[offset + 4], width: (bytes[offset + 5] << 8) | bytes[offset + 6] };
      }
      offset += length;
    }
    return null;
  }
  function message(key) { status.textContent = messages[key]; }
  function row(name, value, passes) {
    const el = panel.querySelector('[data-row="' + name + '"]');
    el.querySelector('[data-value]').textContent = value;
    el.querySelector('[data-outcome]').textContent = messages[passes ? 'pass' : 'fail'];
    el.dataset.passes = String(passes);
  }
  reset.addEventListener('click', () => {
    sequence++;
    input.value = '';
    result.hidden = true;
    message('empty');
    input.focus();
  });
  input.addEventListener('change', async () => {
    const current = ++sequence;
    const file = input.files[0];
    result.hidden = true;
    if (!file) { message('empty'); return; }
    if (file.size > 10 * 1024 * 1024) { message('large'); return; }
    message('working');
    let objectURL;
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (current !== sequence) return;
      const frame = jpegFrame(bytes);
      if (!frame) { message('invalid'); return; }
      // Avoid decoding enormous images; this is a file inspector, not an editor.
      if (!frame.width || !frame.height || frame.width * frame.height > 32000000) { message('large'); return; }
      objectURL = URL.createObjectURL(file);
      const image = new Image();
      image.src = objectURL;
      await image.decode();
      if (current !== sequence) return;
      const width = image.naturalWidth, height = image.naturalHeight;
      row('format', 'JPEG', true);
      row('pixels', width + ' × ' + height + ' px', width === height && width >= 600 && width <= 1200);
      row('size', file.size.toLocaleString(document.documentElement.lang) + ' ' + messages.bytes, file.size <= 240000);
      result.hidden = false;
      message('done');
    } catch (_) {
      if (current === sequence) message('invalid');
    } finally {
      if (objectURL) URL.revokeObjectURL(objectURL);
    }
  });
  input.disabled = false;
  reset.hidden = false;
  message('empty');
})();
