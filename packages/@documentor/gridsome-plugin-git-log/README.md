# `@documentor/gridsome-plugin-git-log`

TODO: rename to gridsome-plugin-git-log https://vuepress.github.io/en/plugins/git-log/#configs

Project to inspiration https://github.com/vuepress/vuepress-plugin-git-log/blob/master/lib/index.js

> Add extra info for a node from Git

## Installation and setup

Install package via Yarn:

```bash
yarn add @documentor/gridsome-plugin-git-log
```

...or NPM

```bash
npm install @documentor/gridsome-plugin-git-log
```

...and add this plugin to `gridsome.config.js`:

```js
module.exports = {
  plugins: [
    {
      use: '@documentor/gridsome-plugin-git-log',
    },
  ],
}
```

## Usage

You can use extra field `createdAt` and `updatedAt` in queries to get info about page history.
