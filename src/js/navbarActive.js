// Reflects the current docs section (Docs vs Tutorials) onto an attribute on
// <html>, so the custom HTML navbar can highlight the matching link via CSS.
//
// The navbar markup is a single static HTML block shared across every page, so
// the active link can't be determined at build time. We can't reliably toggle a
// class on the navbar links either, because React owns that markup and wipes
// our changes when it (re)renders. Setting an attribute on <html> sidesteps
// that: React doesn't manage it (it's where the theme attribute lives too), and
// the CSS in custom.css reads it live whenever the navbar paints.

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

function sectionFor(pathname) {
  if (pathname === '/tutorials' || pathname.startsWith('/tutorials/')) return 'tutorials';
  if (pathname === '/docs' || pathname.startsWith('/docs/')) return 'docs';
  return '';
}

function updateSection(pathname) {
  const section = sectionFor(pathname);
  if (section) {
    document.documentElement.setAttribute('data-rs-section', section);
  } else {
    document.documentElement.removeAttribute('data-rs-section');
  }
}

// Fires on client-side (SPA) route changes.
export function onRouteDidUpdate({ location }) {
  updateSection(location.pathname);
}

// Handle the initial load, where onRouteDidUpdate doesn't fire.
if (ExecutionEnvironment.canUseDOM) {
  updateSection(window.location.pathname);
}
