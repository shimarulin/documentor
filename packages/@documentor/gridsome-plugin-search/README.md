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
      use: '@documentor/gridsome-plugin-search',
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

1. Create FlexSearch index
2. Create suggestions index
3. Find results by query with FlexSearch
4. get matches in founded documents with QuickScore
5. mark matches words/symbols
6. trim content around words/symbols
