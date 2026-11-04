import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import '../css/hub.css';

const Arrow = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocArt = () => (
  <svg className="hub-art" viewBox="0 0 64 64" aria-hidden="true">
    <rect x="12.75" y="4.75" width="38.5" height="54.5" fill="var(--art-body)" stroke="currentColor" strokeWidth="1.5" />
    <path d="M19 13h18M19 19h26M19 24h22M19 41h26M19 46h20M19 51h24" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".7" />
    <rect x="18.5" y="28.5" width="27" height="8" fill="var(--cta)" stroke="var(--ink)" strokeWidth=".75" />
    <path d="M21.5 32.5h12" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const Device = ({id}) => (
  <svg className="hub-art" viewBox="0 0 64 64" aria-hidden="true">
    <use href={`/img/devices.svg#${id}`} />
  </svg>
);

const PATHS = [
  {
    to: '/docs',
    title: 'Docs',
    desc: 'Setup, everyday use, network configuration, and protocol references.',
    cta: 'Browse the docs',
    art: <DocArt />,
  },
  {
    to: '/tutorials',
    title: 'Tutorials',
    desc: 'Step by step: flash a T‑Deck Plus or a Heltec LoRa32, from the browser or from source.',
    cta: 'Start a tutorial',
    art: <><Device id="device-tdeck" /><Device id="device-board" /></>,
    duo: true,
  },
];

const START = [
  {to: '/docs/getting-started/choosing-your-setup', label: 'Choose your setup', desc: 'App only, a LoRa radio, or a handheld.'},
  {to: '/docs/getting-started/install-and-platform-setup', label: 'Install Ratspeak', desc: 'Desktop, Android, and iOS.'},
  {to: '/docs/getting-started/your-first-session', label: 'Your first session', desc: 'Create an identity and send a message.'},
];

const HELP = [
  {href: 'https://ratspeak.org/discord', label: 'Discord', desc: 'Ask the community and share what you built.'},
  {href: 'https://ratspeak.org/telegram', label: 'Telegram', desc: 'Updates and announcements.'},
  {href: 'https://github.com/ratspeak', label: 'GitHub', desc: 'Source, issues, and contributions.'},
];

export default function Hub() {
  return (
    <Layout description="Guides for Ratspeak, Reticulum, LoRa radios, and handhelds.">
      <main className="hub">
        <section className="hub-hero">
          <div className="hub-in">
            <h1 className="hub-title">Guides &amp; technical<br /><span className="hub-nowrap">documentation.</span></h1>
            <p className="hub-lede">Guides for the app and handhelds, developer documentation, and running your own nodes.</p>
          </div>
        </section>

        <div className="hub-in">
          <div className="hub-paths">
            {PATHS.map(p => (
              <Link key={p.to} className="hub-path" to={p.to}>
                <span className={p.duo ? 'hub-path-art duo' : 'hub-path-art'}>{p.art}</span>
                <span className="hub-path-copy">
                  <span className="hub-path-title">{p.title}</span>
                  <span>{p.desc}</span>
                  <span className="hub-path-cta">{p.cta}<Arrow /></span>
                </span>
              </Link>
            ))}
          </div>

          <nav className="hub-start" aria-labelledby="hub-start-title">
            <h2 id="hub-start-title" className="hub-h2">New here?</h2>
            <ol>
              {START.map((s, i) => (
                <li key={s.to}>
                  <Link to={s.to}>
                    <span className="hub-n" aria-hidden="true">{i + 1}</span>
                    <strong>{s.label}</strong>
                    <span>{s.desc}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          <section className="hub-help" aria-labelledby="hub-help-title">
            <h2 id="hub-help-title" className="hub-h2">Still stuck?</h2>
            <ul>
              {HELP.map(h => (
                <li key={h.href}>
                  <a href={h.href}>
                    <strong>{h.label}<span aria-hidden="true">&nbsp;↗</span></strong>
                    <span>{h.desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </Layout>
  );
}
