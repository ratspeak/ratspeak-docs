import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import '../css/hub.css';

const PATHS = [
  {
    to: '/docs',
    title: 'Docs',
    desc: 'Setup, everyday use, network configuration, and protocol references.',
    cta: 'Browse the docs',
  },
  {
    to: '/tutorials',
    title: 'Tutorials',
    desc: 'Step by step: flash a T-Deck Plus or a Heltec LoRa32, from the browser or from source.',
    cta: 'Start a tutorial',
  },
];

const START = [
  {to: '/docs/getting-started/choosing-your-setup', label: 'Choose your setup'},
  {to: '/docs/getting-started/install-and-platform-setup', label: 'Install Ratspeak'},
  {to: '/docs/getting-started/your-first-session', label: 'Your first session'},
  {to: '/docs/reference/faq', label: 'FAQ'},
];

const HELP = [
  {href: 'https://ratspeak.org/discord', label: 'Discord', desc: 'Ask the community, share what you built.'},
  {href: 'https://ratspeak.org/telegram', label: 'Telegram', desc: 'Updates and announcements.'},
  {href: 'https://github.com/ratspeak', label: 'GitHub', desc: 'Source, issues, and contributions.'},
];

export default function Hub() {
  return (
    <Layout description="Guides for Ratspeak, Reticulum, LoRa radios, and handhelds.">
      <main className="hub">
        <section className="hub-hero">
          <h1 className="hub-title">Guides &amp; technical<br />documentation</h1>
          <p className="hub-lede">Guides for the app and handhelds, developer documentation, and running your own nodes.</p>
        </section>

        <section className="hub-body">
          <div className="hub-paths">
            {PATHS.map(p => (
              <Link key={p.to} className="hub-path" to={p.to}>
                <h2>{p.title}</h2>
                <p>{p.desc}</p>
                <span className="hub-path-cta">{p.cta} <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>

          <nav className="hub-start" aria-labelledby="hub-start-title">
            <h2 id="hub-start-title">New here? Start with</h2>
            <ol>
              {START.map(s => (
                <li key={s.to}><Link to={s.to}>{s.label}</Link></li>
              ))}
            </ol>
          </nav>

          <section className="hub-help" aria-labelledby="hub-help-title">
            <h2 id="hub-help-title">Still stuck?</h2>
            <ul>
              {HELP.map(h => (
                <li key={h.href}>
                  <a href={h.href}>
                    <strong>{h.label} <span aria-hidden="true">↗</span></strong>
                    <span>{h.desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </main>
    </Layout>
  );
}
