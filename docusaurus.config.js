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
        defaultMode: 'dark',
        respectPrefersColorScheme: true,
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
            href: 'https://ratspeak.org/',
            label: 'Home',
            position: 'left',
          },
          {
            href: 'https://ratspeak.org/about.html',
            label: 'About',
            position: 'left',
          },
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://ratspeak.org/download.html',
            label: 'Download',
            position: 'left',
          },
          {
            href: 'https://ratspeak.org/discord',
            label: 'Discord',
            position: 'right',
          },
          {
            href: 'https://github.com/ratspeak',
            label: 'GitHub',
            position: 'right',
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
