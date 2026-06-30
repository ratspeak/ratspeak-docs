// The mobile navigation drawer is flattened (see custom.css) so that the
// primary panel (Home/About/Docs/Tutorials/Download) and the secondary panel
// (the documentation menu) are shown stacked together rather than as two
// sliding panels.
//
// Docusaurus, however, marks the *inactive* panel with the `inert` attribute
// whenever the drawer is in its "secondary" state (in the stock UI that panel
// is slid off-screen). `inert` keeps the panel visible but makes its whole
// subtree non-interactive — which is invisible to CSS — so the nav links looked
// fine but couldn't be tapped. Because we show both panels at once, neither
// should be inert. Strip it whenever React adds it.

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  const stripInert = (root) => {
    if (root.nodeType !== 1) return;
    if (root.matches?.('.navbar-sidebar__item[inert]')) root.removeAttribute('inert');
    root.querySelectorAll?.('.navbar-sidebar__item[inert]').forEach((el) => el.removeAttribute('inert'));
  };

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes') {
        const t = m.target;
        if (t.nodeType === 1 && t.matches?.('.navbar-sidebar__item') && t.hasAttribute('inert')) {
          t.removeAttribute('inert');
        }
      } else if (m.type === 'childList') {
        m.addedNodes.forEach(stripInert);
      }
    }
  });

  const start = () => {
    stripInert(document.body);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['inert'],
    });
  };

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start);
}
