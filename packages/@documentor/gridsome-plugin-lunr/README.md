# `@documentor/gridsome-plugin-search`

> Gridsome built-in markdown full-text search for Documentor

## Installation and setup

Install package via Yarn:

```bash
yarn add @documentor/gridsome-plugin-search
```

...or NPM

```bash
npm install @documentor/gridsome-plugin-search
```

...and add this plugin to `gridsome.config.js`:

```js
module.exports = {
  plugins: [
    {
      use: gridsome - plugin - lunr,
      options: {},
    },
  ],
}
```

## Usage

### Shortcuts

- <kbd>&uarr;</kbd> - access to queries history. If the query was typed part, the history of queries will be filtered
  according to the entered text.
- <kbd>Tab</kbd> - enter latest suggestion.
- <kbd><kbd>Tab</kbd> + <kbd>Tab</kbd></kbd> - access to queries suggestions.
- <kbd>&darr;</kbd> - access to search results.

## Development

### FlexSearch + QuickScore

- https://github.com/fwextensions/quick-score

- Create suggestions index
- Search results in suggestions by query with QuickScore or Fuse.js
- Search results in document(index) suggestions
- Mark matches words/symbols
- Trim content around words/symbols
