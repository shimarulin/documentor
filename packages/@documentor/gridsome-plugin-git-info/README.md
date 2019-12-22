# `@documentor/gridsome-plugin-git-info`

> Add extra info for a node from Git

## Installation and setup

Install package via Yarn:

```bash
yarn add @documentor/gridsome-plugin-git-info
```

...or NPM

```bash
npm install @documentor/gridsome-plugin-git-info
```

...and add this plugin to `gridsome.config.js`:

```js
module.exports = {
  plugins: [
    {
      use: '@documentor/gridsome-plugin-git-info',
    },
  ],
}
```

## Usage

You can use extra field `createdAt` and `updatedAt` in queries to get info about page history.
