import { wrapTerm, truncateTermContext } from './getContext'

test('Wrap terms in single string', () => {
  const sourceString = 'Wraps the specified character'
  const positions = [
    [
      10,
      4,
    ],
    [
      20,
      4,
    ],
  ]
  const expectedString = 'Wraps the <mark>spec</mark>ified <mark>char</mark>acter'

  expect(wrapTerm(sourceString, positions)).toBe(expectedString)
})

test('Wrap terms in multiple strings', () => {
  const sourceString = '\n# test (duplicate header)\n\n### Вывод цвета в консоль\n\n```js\nconst a = 2\n```\n\nДело в том, что когда `lerna run` выполняет скрипт npm, это подпроцесс, который технически не является TTY, и поэтому\nпочти любой исполняемый модуль автоматически отключит вывод цвета. Решается это только передачей опции для\nпринудительного включения цветного вывода.\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint -- --color"\n  }\n}\n```\n\n### Версионирование\n\nLerna хранит текущую версию пакетов в `lerna.json`:\n\n```json\n{\n  "version": "1.0.0"\n}\n```\n\nИспользуйте значение `independent` если хотите использовать раздельное версионирование пакетов\n\n### Передача аргументов\n\nПри использовании команд `lerna run` и `lerna exec` передача аргументов может быть весьма\nнетривиальна:\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint"\n  }\n}\n```\n\n```bash\nyarn lint -- -- --fix\n```\n\nЧтобы использовать нормальную передачу аргументов, нужно немного модифицировать корневой скрипт:\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint --"\n  }\n}\n```\n'

  const positions = [
    [
      644,
      10,
    ],
    [
      717,
      10,
    ],
    [
      900,
      11,
    ],
  ]
  const expectedString = '\n# test (duplicate header)\n\n### Вывод цвета в консоль\n\n```js\nconst a = 2\n```\n\nДело в том, что когда `lerna run` выполняет скрипт npm, это подпроцесс, который технически не является TTY, и поэтому\nпочти любой исполняемый модуль автоматически отключит вывод цвета. Решается это только передачей опции для\nпринудительного включения цветного вывода.\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint -- --color"\n  }\n}\n```\n\n### Версионирование\n\nLerna хранит текущую версию пакетов в `lerna.json`:\n\n```json\n{\n  "version": "1.0.0"\n}\n```\n\nИспользуйте значение `independent` если хотите использовать раздельное версионирование пакетов\n\n### Передача <mark>аргументов</mark>\n\nПри использовании команд `lerna run` и `lerna exec` передача <mark>аргументов</mark> может быть весьма\nнетривиальна:\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint"\n  }\n}\n```\n\n```bash\nyarn lint -- -- --fix\n```\n\nЧтобы использовать нормальную передачу <mark>аргументов,</mark> нужно немного модифицировать корневой скрипт:\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint --"\n  }\n}\n```\n'

  expect(wrapTerm(sourceString, positions)).toBe(expectedString)
})

test('Truncate term context in multiple strings', () => {
  const sourceString = '# Heading 1\n## Heading 2\n\nWraps the <mark>spec</mark>ified one <mark>char</mark>acter. Wraps\nthe <mark>spec</mark>ified two <mark>char</mark>acters. Wraps\nthe <mark>spec</mark>ified three <mark>char</mark>acters.\n\n## Heading 2-1\nSome other text contain marked string\n\nSo, just another <mark>char</mark>acters.\n### Heading 3\nAnd more <mark>char</mark>acters.\n'
  const expectedResult = [
    {
      heading: '## Heading 2',
      text: 'Wraps the <mark>spec</mark>ified one <mark>char</mark>acter. Wraps&hellip;',
    },
    {
      heading: '## Heading 2',
      text: '&hellip;the <mark>spec</mark>ified two <mark>char</mark>acters. Wraps&hellip;',
    },
    {
      heading: '## Heading 2',
      text: '&hellip;the <mark>spec</mark>ified three <mark>char</mark>acters.',
    },
    {
      heading: '## Heading 2-1',
      text: 'So, just another <mark>char</mark>acters.&hellip;',
    },
    {
      heading: '### Heading 3',
      text: 'And more <mark>char</mark>acters.&hellip;',
    },
  ]

  expect(truncateTermContext(sourceString)).toEqual(expectedResult)
})
