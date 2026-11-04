// "/" focuses the visible search field; the search plugin itself only binds mod+K.

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function isEditable(el) {
  return el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

if (ExecutionEnvironment.canUseDOM) {
  document.addEventListener('keydown', (event) => {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.defaultPrevented || isEditable(event.target)) return;
    const input = [...document.querySelectorAll('.navbar__search-input')].find((el) => el.offsetParent);
    if (!input) return;
    event.preventDefault();
    input.focus();
  });
}
