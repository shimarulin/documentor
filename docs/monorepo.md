# Monorepository workflow

## Про скрипты и монорепы

- [Why you should always quote your globs in NPM scripts.](https://medium.com/@jakubsynowiec/you-should-always-quote-your-globs-in-npm-scripts-621887a2a784)
- [Monorepo scripts strategies & naming conventions - D.i.S - Medium](https://medium.com/disdj/monorepo-scripts-strategies-naming-conventions-691c64b51acb)

Экранирование кавычек для винды

```json
  "scripts": {
    "format:md": "prettier --ignore-path .gitignore --parser markdown --prose-wrap always \"**/*.md\" \"!**/CHANGELOG.md\" --write"
  }
```

## Инструменты

- [CLI Introduction \| Yarn](https://yarnpkg.com/en/docs/cli/)
- [GitHub - lerna/lerna: A tool for managing JavaScript projects with multiple packages.](https://github.com/lerna/lerna)
- [GitHub - typicode/husky: 🐶 Git hooks made easy](https://github.com/typicode/husky)
- [GitHub - okonet/lint-staged: 🚫💩 — Run linters on git staged files](https://github.com/okonet/lint-staged)
- [GitHub - camacho/format-package: Format and sort package.json in a sensible and configurable way](https://github.com/camacho/format-package)
- [Prettier · Opinionated Code Formatter](https://prettier.io/)

Script runners:

- Lerna
- [GitHub - Akryum/monorepo-run: Run scripts in monorepo with colors, streaming and separated panes](https://github.com/Akryum/monorepo-run)
- [GitHub - whoeverest/wsrun: Command runner for Yarn workspaces. Dependency aware.](https://github.com/whoeverest/wsrun)

Больше инструментов для монорепозиториев:
[GitHub - korfuri/awesome-monorepo: A curated list of awesome Monorepo tools, software and architectures.](https://github.com/korfuri/awesome-monorepo)

## Процессы

### Инициализация монорепозитория

Создаем и инициализируем новый проект с Yarn:

```bash
mkdir <project_name> && cd <project_name>
# Следующем этапом мы сразу инициализируем репозиторий
# и добавляем origin, чтобы yarn мог получить больше информации
git init && git remote add origin <remote_url>
yarn init --private
```

Добавляем _Yarn Workspaces_ в `packages.json`:

```json
{
  "workspaces": ["packages/@scope/*"]
}
```

Добавляем и инициализируем _Lerna_:

```bash
yarn add -D -W lerna
lerna init
```

Конфигурируем `lerna.json` для использования _Yarn Workspaces_:

```json
{
  "npmClient": "yarn",
  "useWorkspaces": true,
  "version": "0.1.0"
}
```

Добавляем и коммитим изменения в git.

### Создание пакета

Создать пакет в воркспейсе по умолчанию:

```bash
lerna create --license MIT @scope/package
```

Можно сконфигурировать параметры команды в `lerna.json`

```json
{
  "command": {
    "create": {
      "license": "MIT"
    }
  }
}
```

И тогда команда сокращается соответственно до:

```bash
lerna create @scope/package
```

### Установка внешних зависимостей

Добавляем зависимости в пакеты:

```bash
yarn workspace @scope/package add react react-dom --dev
```

или

```bash
cd packages/@scope/package/
yarn add react react-dom --dev
```

> Примечание: команда `lerna add` делает то же самое, но работает только с одним пакетом

### Добавление локальных пакетов в зависимости

Добавляем локальный пакет как зависимость в другой пакет:

```bash
lerna add @platr/eslint-config-base --scope=@platr/eslint-config-vue
```

и создаем локальные симлинки на пакеты в проекте

```bash
lerna link
```

Теперь мы можем использовать наши модули внутри монорепозитория

### Обновление зависимостей

Обновить до последних версий в интерактивном режиме включая пакеты в воркспейсах:

```bash
yarn upgrade-interactive --latest
```

К сожалению `yarn upgrade --latest` обновляет до последних версий в неинтерактивном режиме только корневые пакеты,
пакеты в воркспейсах обновлены не будут. То же самое происходит при запуске команды непосредственно в воркспейсах.

### Подтипы рабочих процессов

#### Manually publishing workflow

> Процесс с увеличением версии вручную и последующей публикацией также вручную, либо автоматически

В данном случае мы можем выпустить версию тогда, когда сочтем это необходимым и можем удерживать выпуск релиза
длительное время. Возможно настроить публикацию с использованием CI по наличию тега версии в репозитории. Для создания
версии используется команда `lerna version` (как `yarn version` в случае с обычным репозиторием)

#### Automated publishing workflow

> Процесс с автоматизированным увеличением версии и последующей публикацией

В данном случае за выпуск версии отвечает CI. При каждом мерж-коммите в `master`, кроме коммитов, имеющих тег версии,
запускается процесс публикации, который включает в себя увеличение версии, создание списка изменений, коммит изменений и
пуш в репозиторий, а так же публикация в NPM.

Настройку параметров команд lerna для автоматической публикации в соответствии с соглашениями Conventional Commits лучше
хранить в файле конфигурации. Параметр `"yes": true` обязателен при использовании CI:

```json
{
  "command": {
    "publish": {
      "allowBranch": ["master"],
      "conventionalCommits": true,
      "yes": true,
      "message": "chore(release): publish %s"
    }
  }
}
```

## Советы и рекомендации

### Форматирование Markdown

Я предпочитаю форматирование автоматическое Markdown файлов с Prettier. Однако файлы `CHANGELOG.md` должны при этом
игнорироваться - conventional-commits не сможет определить заголовок файла.

```json
  "scripts": {
    "format:md": "prettier --ignore-path .gitignore --parser markdown --prose-wrap always \"**/*.md\" \"!**/CHANGELOG.md\" --write"
  },
  "lint-staged": {
    "ignore": [
      "**/CHANGELOG.md"
    ],
    "linters": {
      "**/*.md": [
        "prettier --parser markdown --prose-wrap always --write",
        "git add"
      ]
    }
  },
```

### Установка зависимостей

При использовании Yarn Workspaces после `yarn` запускать `lerna bootstrap` необязательно - Yarn установит все
необходимое автоматически.

### Форматирование файлов `packages.json`

Используйте соглашения о порядке следования правил в файлах `packages.json` - так проще отслеживать изменения. Для этого
можно использовать `lint-staged` и `format-package`:

```json
{
  "lint-staged": {
    "linters": {
      "**/package.json": ["format-package --write", "git add"]
    }
  }
}
```

Небольшой список инструментов для форматирования `package.json`:

- [GitHub - camacho/format-package: Format and sort package.json in a sensible and configurable way](https://github.com/camacho/format-package) -
  пожалуй самый перспективный
- [GitHub - cameronhunter/prettier-package-json: Prettier formatter for package.json files](https://github.com/cameronhunter/prettier-package-json) -
  не хватает разумного конфигурирования, но может использоваться через API
- [GitHub - HenrikJoreteg/fixpack: A package.json file scrubber for the truly insane.](https://github.com/henrikjoreteg/fixpack) -
  самый старый и давно не обновлялся

См. также:

- неофициальный NPM Style Guide
  [GitHub - voorhoede/npm-style-guide: Opinionated npm Style Guide​ for teams.](https://github.com/voorhoede/npm-style-guide)
- [Overcoming Fear of package.json — Building Server-Side JavaScript Apps](https://medium.com/@js_tut/overcoming-fear-of-package-json-building-server-side-javascript-1c63f4bdf8e0)

### Использование нескольких Yarn Workspaces

Дополнительные воркспейсы:

```json
{
  "workspaces": ["packages/@scope/*", "packages/@second-scope/*", "packages/third-scope/*"]
}
```

Тогда создавать пакеты в них можно будет так:

```bash
lerna create @scope/package # создаст пакет в packages/@scope
lerna create @second-scope/package packages/@second-scope # создаст пакет в packages/@second-scope
lerna create --private third-package packages/third-scope # создаст пакет в  packages/third-scope
```

Но:

```bash
lerna create @second-scope/package # создаст пакет в packages/@scope
```

Lerna использует по-умолчанию первое сконфигурированное расположение, и от порядка следования в массиве "workspaces"
поведение не зависит. К сожалению, пока я не вижу способа переопределить это поведение.

### Linting

В `.eslintrc` в корне проекта указываем

```json
{
  "root": true
}
```

Если какой-то проект требует расширить стандартный конфиг, то добавляем ему свой `.eslintrc`

- https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy

### Коммиты

- https://conventionalcommits.org/
- https://github.com/conventional-changelog/conventional-changelog

### Версионирование

Lerna хранит текущую версию пакетов в `lerna.json`:

```json
{
  "version": "1.0.0"
}
```

Используйте значение `independent` если хотите использовать раздельное версионирование пакетов

### Передача аргументов

При использовании команд `lerna run` и `lerna exec` передача аргументов может быть весьма нетривиальна:

```json
{
  "scripts": {
    "lint": "lerna run lint"
  }
}
```

```bash
yarn lint -- -- --fix
```

Чтобы использовать нормальную передачу аргументов, нужно немного модифицировать корневой скрипт:

```json
{
  "scripts": {
    "lint": "lerna run lint --"
  }
}
```

### Вывод цвета в консоль

Дело в том, что когда `lerna run` выполняет скрипт npm, это подпроцесс, который технически не является TTY, и поэтому
почти любой исполняемый модуль автоматически отключит вывод цвета. Решается это только передачей опции для
принудительного включения цветного вывода.

```json
{
  "scripts": {
    "lint": "lerna run lint -- --color"
  }
}
```

### Дополнительно

- [npm-package.json \| npm Documentation](https://docs.npmjs.com/files/package.json)

---

- [GitHub - JamieMason/syncpack: Manage multiple package.json files, such as in Lerna Monorepos](https://github.com/JamieMason/syncpack)
- [GitHub - Updater/semantic-release-monorepo: Apply semantic-release's automatic publishing to a monorepo.](https://github.com/Updater/semantic-release-monorepo)

CircleCI

- [Known Hosts in Circle 2.0? - 2.0 Support - CircleCI Community Discussion](https://discuss.circleci.com/t/known-hosts-in-circle-2-0/18544/4)
- [Caching Dependencies - CircleCI](https://circleci.com/docs/2.0/caching/#source-caching)

- Для возможности `git push` из CircleCI необходимо создать пользовательский ключ и сохранять кеш ssh между задачами.
