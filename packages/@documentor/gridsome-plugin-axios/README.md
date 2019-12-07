# `@documentor/gridsome-plugin-axios`

> Gridsome plugin for [Axios](https://github.com/axios/axios)

## Installation and setup

Install package via Yarn:

```bash
yarn add @documentor/gridsome-plugin-axios
```

...or NPM

```bash
npm install @documentor/gridsome-plugin-axios
```

...and add this plugin to `gridsome.config.js`:

```js
module.exports = {
  plugins: [
    {
      use: '@documentor/gridsome-plugin-axios',
      options: {
        // axios instance config options
      },
    },
  ],
}
```

For read more about possible options please see [axios config](https://github.com/axios/axios#request-config).

## Usage

You can use preconfigured axios instance in Vue components via `$axios` property:

```vue
<template>
  <div class="remote-data">
    <ul>
      <li v-for="user in users" :key="user.id">Name: {{ user.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data: () => ({
    users: [],
  }),
  mounted() {
    this.$axios
      .request({
        url: 'users',
        method: 'get',
        baseURL: 'https://jsonplaceholder.typicode.com/',
      })
      .then((response) => {
        this.users = response.data
      })
  },
}
</script>
```
