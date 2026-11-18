(() => {
  const controls = document.querySelector('.checklist-share');
  const button = controls.querySelector('button');
  const details = controls.querySelector('details');
  const link = controls.querySelector('input');
  const status = controls.querySelector('[role="status"]');
  const [copyLabel, copiedMessage] = controls.querySelector('template').content.children;
  const canShare = typeof navigator.share === 'function';
  const canCopy = typeof navigator.clipboard?.writeText === 'function';

  if (!canShare && !canCopy) return;
  if (!canShare) button.textContent = copyLabel.textContent;
  button.hidden = false;

  button.addEventListener('click', async () => {
    status.textContent = '';
    if (canShare) {
      try {
        await navigator.share({ title: document.title, url: link.value });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    if (canCopy) {
      try {
        await navigator.clipboard.writeText(link.value);
        status.textContent = copiedMessage.textContent;
        return;
      } catch {
        // The selectable link remains available when clipboard access is blocked.
      }
    }
    details.open = true;
    link.focus();
    link.select();
  });
})();
