// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

const siteUrl = 'https://docs.ratspeak.org';
const siteDescription =
  'Guides for using Ratspeak, Reticulum, LoRa, hardware devices, deployment, and private mesh networking.';
const docsImage = 'https://ratspeak.org/assets/seo/og-docs.png';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Docs — Ratspeak',
  tagline: siteDescription,
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  markdown: {
    format: 'detect',
  },

  url: siteUrl,
  baseUrl: '/',

  onBrokenLinks: 'throw',

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#FAF7F3',
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
        content: '#FAF7F3',
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
        property: 'og:locale',
        content: 'en_US',
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
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
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
        title: 'Ratspeak',
        logo: {
          alt: 'Ratspeak Logo',
          src: 'img/ratspeak-512.png',
          srcDark: 'img/ratspeak-512-dark.png',
        },
        items: [
          {
            type: 'html',
            position: 'left',
            value: `
              <nav class="ratspeak-navbar-center" aria-label="Primary navigation">
                <a href="https://ratspeak.org/">Home</a>
                <a href="https://ratspeak.org/about.html">About</a>
                <a class="is-active" href="/">Docs</a>
                <a href="https://ratspeak.org/download.html">Download</a>
              </nav>
            `,
          },
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
            className: 'ratspeak-mobile-docs-link',
          },
          {
            type: 'html',
            position: 'right',
            value: `
              <a class="ratspeak-navbar-icon" href="https://github.com/ratspeak" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            `,
          },
          {
            type: 'html',
            position: 'right',
            value: `
              <a class="ratspeak-navbar-icon ratspeak-navbar-poll" href="https://ratspeak.org/poll.html" aria-label="Community poll" title="Community poll">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="7" r="3.2"/>
                  <path d="M6.5 20a5.5 5.5 0 0 1 11 0"/>
                  <circle cx="5.5" cy="10" r="2.4"/>
                  <path d="M2 20a4.5 4.5 0 0 1 4.5-4.5"/>
                  <circle cx="18.5" cy="10" r="2.4"/>
                  <path d="M22 20a4.5 4.5 0 0 0-4.5-4.5"/>
                </svg>
              </a>
            `,
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/',
              },
              {
                label: 'Build from Source',
                to: '/reference/building-from-source',
              },
              {
                label: 'Troubleshooting',
                to: '/reference/troubleshooting',
              },
            ],
          },
          {
            title: 'Ratspeak',
            items: [
              {
                label: 'Home',
                href: 'https://ratspeak.org/',
              },
              {
                label: 'About',
                href: 'https://ratspeak.org/about.html',
              },
              {
                label: 'Download',
                href: 'https://ratspeak.org/download.html',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://ratspeak.org/discord',
              },
              {
                label: 'Telegram',
                href: 'https://ratspeak.org/telegram',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/ratspeak',
              },
            ],
          },
        ],
        copyright: `Built with <a href="https://reticulum.network" target="_blank" rel="noopener noreferrer">Reticulum</a>. Documentation content is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
