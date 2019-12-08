# Documentor

> Easily document your project

## Features and used plugins

- syntax highlighting: [PrismJS](https://prismjs.com/)

  - [Keep Markup](https://prismjs.com/plugins/keep-markup/) in search result
    (https://github.com/PrismJS/prism/issues/879)

- [gridsome-plugin-remark-codetitle](https://github.com/DavidCouronne/gridsome-plugin-remark-codetitle) - Adds a code
  title to code snippets

```js
const a = {
  stream: 2,
}
```

```css{numberLines: true}
@media <mark>screen</mark> {
  div {
    <mark>text</mark>-decoration: <mark><mark>under</mark>line</mark>;
    back<mark>ground: url</mark>('foo.png');
  }
}
```

<pre><code class="language-css">
@media <mark>screen</mark> {
	div {
		<mark>text</mark>-decoration: <mark><mark>under</mark>line</mark>;
		back<mark>ground: url</mark>('foo.png');
	}
}</code></pre>

```vue
<template>
  <div id="app">
    <h1>My Todo App!</h1>
    <TodoList />
  </div>
</template>

<script>
import TodoList from './components/TodoList.vue'

export default {
  components: {
    TodoList,
  },
}
</script>

<style lang="scss">
#app {
  max-width: 400px;
  margin: 0 auto;
  line-height: 1.4;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $vue-blue;

  h1 {
    text-align: center;
  }
}
</style>
```
