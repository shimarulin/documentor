# Dev notes

## i18n

- https://nuxt-community.github.io/nuxt-i18n/routing.html
- https://vuepress.vuejs.org/guide/i18n.html#site-level-i18n-config

## Libs and plugins

- https://gridsome.org/plugins/@gridsome/vue-remark . Uses:
  - https://gridsome.org/plugins/@gridsome/source-filesystem
  - https://gridsome.org/plugins/@gridsome/transformer-remark
- https://github.com/egoist/vue-feather-icons
- https://github.com/maoberlehner/vue-lazy-hydration

Remark plugins https://github.com/remarkjs/remark/blob/master/doc/plugins.md#list-of-plugins

### Search

- https://github.com/thetre97/gridsome-plugin-flexsearch
  - https://github.com/nextapps-de/flexsearch
  - https://github.com/nextapps-de/flexsearch/issues/99
- https://fusejs.io/
- https://github.com/olivernn/lunr.js
  - https://github.com/olivernn/moonwalkers/blob/master/src/wrapper.js
  - https://github.com/nuxt-community/lunr-module
  - https://docs.snipline.io/desktop/advanced/search/

## Roadmap

- [ ] Tags support
- [ ] Use `rc` config for setup
- [ ] Create independent theme
- [ ] Translate with vuettext!!!
- [x] Move to stand-alone project

## Поисковый алгоритм

- кликнуть по иконке поиска
- заголовок переходит в режим поиска, курсор устанавливается в поисковое поле, выпадает (или можно выбрать?) история
  запросов
- происходит набор, остальные элементы заголовка скрываются, страница скрывается, появляется кнопка возврата из поиска
- по мере набора на странице появляются результаты поиска, в результатах отображается обрезанная часть контента с
  подсвеченным найденным словом, блоки кода обрезаются внутри кавычек
- для одной страницы может быть более одного результата
- при клике по результату происходит переход на страницу с прокруткой до искомого слова, слово при этом подсвечивается
  (возможно временно), заголовок выходит из состояния поиска
