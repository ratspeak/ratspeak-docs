# Ratspeak Docs

Source for [docs.ratspeak.org](https://docs.ratspeak.org), the public documentation portal for Ratspeak.

This site is built with [Docusaurus](https://docusaurus.io/).

## Installation

Use Node.js 20 or later and npm. Run these commands from the repository root.

```bash
npm ci
```

## Local Development

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content in `build/`. Preview that output locally with:

```bash
npm run serve
```

The build checks internal links. Read the rendered pages as well, including tables and code blocks at a narrow screen width.

## Content

- `docs/` contains the guides and reference pages.
- `tutorials/` contains the walkthroughs.
- `src/pages/index.js` is the documentation hub.
- `docusaurus.config.js` supplies the shared navigation and site metadata.

The docs and tutorials have separate, automatically generated sidebars. Use each page's front matter and category metadata to control its title and position.

## License

Documentation content is licensed under [Creative Commons Attribution-ShareAlike 4.0 International](LICENSE-CONTENT) (CC BY-SA 4.0).
