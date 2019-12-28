# Расширения Markdown

## Контейнеры

https://github.com/Nevenall/remark-containers

## Типографика

### Emoji

Поддерживаются как UTF-8 emoji, так и сокращения Gemoji (GitHub Emoji). Есть два варианта отрисовки: "нативные" эмодзи и
картинки. Во втором случае можно выбрать, какой именно набор будет отображаться у пользователя.

- [remark-gemoji-to-emoji](https://github.com/jackycute/remark-gemoji-to-emoji) - парсинг Gemoji как UTF-8 emoji
- [remark-html-emoji-image](https://github.com/jackycute/remark-html-emoji-image) - преобразование в изображения (GitHub
  Emoji)
- [emoji-data](https://github.com/iamcal/emoji-data) - коллекция изображений emoji различных поставщиков

```js
const config = {
  emoji: 'native',
}
```

```js
const config = {
  emoji: 'github',
}
```

- [remark-emoji](https://github.com/rhysd/remark-emoji) - replace :emoji: to real UTF-8 emojis in text.
- https://github.com/remarkjs/remark-gemoji
- https://github.com/jackycute/remark-gemoji-to-emoji
- https://github.com/jackycute/remark-html-emoji-image
- https://github.com/iamcal/emoji-data
- https://github.com/iamcal/js-emoji
- https://github.com/bestiejs/punycode.js

- https://api.github.com/emojis (https://github-emoji-list.herokuapp.com/)
  https://github.com/docsifyjs/docsify/blob/develop/src/plugins/emoji.js#L1516
  - https://github.githubassets.com/images/icons/emoji/100.png ==
    https://github.githubassets.com/images/icons/emoji/unicode/1f4af.png?v8

see also https://github.com/markdown-it/markdown-it-emoji

- [remark-textr](https://github.com/remarkjs/remark-textr) — transform text with [Textr](https://github.com/A/textr)
