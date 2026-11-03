// @ts-check
import {readFileSync} from 'node:fs';
import {themes as prismThemes} from 'prism-react-renderer';

const siteUrl = 'https://docs.ratspeak.org';
const siteDescription =
  'Guides for using Ratspeak, Reticulum, LoRa, hardware devices, deployment, and private mesh networking.';
const docsImage = 'https://ratspeak.org/assets/seo/og-docs.png';
const docsSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Docs — Ratspeak',
  url: siteUrl,
  description: siteDescription,
  isPartOf: {
    '@type': 'WebSite',
    name: 'Ratspeak',
    url: 'https://ratspeak.org',
  },
});
const site = 'https://ratspeak.org';
const ext = '<span aria-hidden="true">&nbsp;↗</span>';
const mark = readFileSync('static/img/ratspeak-mark-band.svg', 'utf8').trim()
  .replace('fill="#f1f5ff"', 'fill="currentColor" class="brand-mark" aria-hidden="true" focusable="false"');
const footerMarkup = `
  <div class="foot-main">
    <div class="foot-brand">
      <div class="brand"><a class="brand" href="${site}/letter.html" aria-label="A letter to the community">${mark}</a><a class="brand" href="${site}/" aria-label="Ratspeak home"><span class="brand-word">ratspeak</span></a></div>
      <p>Built on <a href="/docs/concepts/what-is-reticulum">Reticulum</a></p>
    </div>
    <nav class="foot-cols" aria-label="Footer">
      <div><h2>Product</h2><ul><li><a href="${site}/download.html">Download</a></li><li><a href="/" aria-current="page">Docs</a></li><li><a href="${site}/map.html">Map</a></li><li><a href="${site}/portal.html">Holder portal</a></li></ul></div>
      <div><h2>Source</h2><ul><li><a href="https://github.com/ratspeak">GitHub${ext}</a></li><li><a href="https://github.com/ratspeak/Ratspeak">Ratspeak app${ext}</a></li><li><a href="https://github.com/ratspeak/ratspeak-handheld">Handheld firmware${ext}</a></li><li><a href="https://github.com/ratspeak/ratspeak-docs">These docs${ext}</a></li></ul></div>
      <div><h2>Community</h2><ul><li><a href="${site}/discord">Discord${ext}</a></li><li><a href="${site}/telegram">Telegram${ext}</a></li><li><a href="${site}/community-guidelines.html">Guidelines</a></li><li><a href="${site}/community.html">Community token</a></li></ul></div>
      <div><h2>Help &amp; legal</h2><ul><li><a href="${site}/support.html">Support</a></li><li><a href="${site}/privacy.html">Privacy</a></li><li><a href="${site}/terms.html">Terms</a></li></ul></div>
    </nav>
  </div>
  <div class="foot-bar">
    <p>© 2026 Ratspeak LLC</p>
  </div>
`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Docs — Ratspeak',
  tagline: siteDescription,
  favicon: 'favicon.ico',

  future: {
    v4: true,
  },

  markdown: {
    format: 'detect',
  },

  url: siteUrl,
  baseUrl: '/',

  onBrokenLinks: 'throw',

  // Highlights Docs in the custom HTML navbar based on the current path, since
  // the navbar markup is static and shared.
  clientModules: [
    require.resolve('./src/js/navbarActive.js'),
    require.resolve('./src/js/mobileSidebar.js'),
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        href: '/favicon.ico',
        sizes: 'any',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        href: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'mask-icon',
        href: '/favicon.svg',
        color: '#1838ed',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#1838ed',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'application-name',
        content: 'Ratspeak',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'apple-mobile-web-app-title',
        content: 'Ratspeak',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'msapplication-TileColor',
        content: '#0a0f2e',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'msapplication-TileImage',
        content: '/assets/icons/windows/ratspeak-windows-light-150.png',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'color-scheme',
        content: 'light dark',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'Ratspeak',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:secure_url',
        content: docsImage,
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:width',
        content: '1200',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:height',
        content: '630',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:alt',
        content:
          'Ratspeak Docs — Guides for Reticulum, LoRa, hardware, deployment, and private mesh networking.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:site',
        content: '@ratspeakorg',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:image:alt',
        content:
          'Ratspeak Docs — Guides for Reticulum, LoRa, hardware, deployment, and private mesh networking.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:title',
        content: 'Docs — Ratspeak',
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: docsSchema,
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        htmlLang: 'en-US',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/docs',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'tutorials',
        path: 'tutorials',
        routeBasePath: 'tutorials',
        sidebarPath: './sidebars-tutorials.js',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      image: docsImage,
      metadata: [
        {
          name: 'description',
          content: siteDescription,
        },
        {
          name: 'twitter:description',
          content: siteDescription,
        },
      ],
      navbar: {
        title: 'ratspeak',
        logo: {alt: '', href: `${site}/`, target: '_self', src: 'img/ratspeak-mark-band.svg'},
        items: [
          {
            type: 'html',
            position: 'left',
            value: `<nav class="rs-nav" aria-label="Main navigation"><a href="${site}/map.html">Map</a><a href="/" aria-current="page">Docs</a><a href="${site}/#play">How it works</a></nav>`,
          },
          {type: 'html', position: 'right', className: 'rs-download-item', value: `<a class="header-download" href="${site}/download.html">Download</a>`},
        ],
      },
      footer: {
        style: 'light',
        copyright: footerMarkup,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.nightOwl,
      },
    }),
};

export default config;
