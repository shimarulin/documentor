import { wrapTerm, truncateTermContext, groupContext } from './Search'

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
  const sourceString =
    '\n# test (duplicate header)\n\n### Вывод цвета в консоль\n\n```js\nconst a = 2\n```\n\nДело в том, что когда `lerna run` выполняет скрипт npm, это подпроцесс, который технически не является TTY, и поэтому\nпочти любой исполняемый модуль автоматически отключит вывод цвета. Решается это только передачей опции для\nпринудительного включения цветного вывода.\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint -- --color"\n  }\n}\n```\n\n### Версионирование\n\nLerna хранит текущую версию пакетов в `lerna.json`:\n\n```json\n{\n  "version": "1.0.0"\n}\n```\n\nИспользуйте значение `independent` если хотите использовать раздельное версионирование пакетов\n\n### Передача аргументов\n\nПри использовании команд `lerna run` и `lerna exec` передача аргументов может быть весьма\nнетривиальна:\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint"\n  }\n}\n```\n\n```bash\nyarn lint -- -- --fix\n```\n\nЧтобы использовать нормальную передачу аргументов, нужно немного модифицировать корневой скрипт:\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint --"\n  }\n}\n```\n'

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
  const expectedString =
    '\n# test (duplicate header)\n\n### Вывод цвета в консоль\n\n```js\nconst a = 2\n```\n\nДело в том, что когда `lerna run` выполняет скрипт npm, это подпроцесс, который технически не является TTY, и поэтому\nпочти любой исполняемый модуль автоматически отключит вывод цвета. Решается это только передачей опции для\nпринудительного включения цветного вывода.\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint -- --color"\n  }\n}\n```\n\n### Версионирование\n\nLerna хранит текущую версию пакетов в `lerna.json`:\n\n```json\n{\n  "version": "1.0.0"\n}\n```\n\nИспользуйте значение `independent` если хотите использовать раздельное версионирование пакетов\n\n### Передача <mark>аргументов</mark>\n\nПри использовании команд `lerna run` и `lerna exec` передача <mark>аргументов</mark> может быть весьма\nнетривиальна:\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint"\n  }\n}\n```\n\n```bash\nyarn lint -- -- --fix\n```\n\nЧтобы использовать нормальную передачу <mark>аргументов,</mark> нужно немного модифицировать корневой скрипт:\n\n```json\n{\n  "scripts": {\n    "lint": "lerna run lint --"\n  }\n}\n```\n'

  expect(wrapTerm(sourceString, positions)).toBe(expectedString)
})

test('Truncate term context in multiple strings', () => {
  const sourceString =
    '# Wraps the <mark>spec</mark>ified one <mark>char</mark>acter.\n\n## Heading 2\n\nWraps the <mark>spec</mark>ified one <mark>char</mark>acter. Wraps\nthe <mark>spec</mark>ified two <mark>char</mark>acters. Wraps\nthe <mark>spec</mark>ified three <mark>char</mark>acters.\n\n## Heading 2-1\nSome other text contain marked string\n\nSo, just another <mark>char</mark>acters.\n### Heading 3\nAnd more <mark>char</mark>acters.\n'
  const expectedResult = [
    {
      heading: 'Wraps the <mark>spec</mark>ified one <mark>char</mark>acter.',
      depth: 1,
      // pos: 75,
      context: 'Wraps the <mark>spec</mark>ified one <mark>char</mark>acter.',
    },
    {
      heading: 'Heading 2',
      depth: 2,
      // pos: 156,
      context: 'Wraps the <mark>spec</mark>ified one <mark>char</mark>acter. Wraps&hellip;',
    },
    {
      heading: 'Heading 2',
      depth: 2,
      // pos: 218,
      context: '&hellip;the <mark>spec</mark>ified two <mark>char</mark>acters. Wraps&hellip;',
    },
    {
      heading: 'Heading 2',
      depth: 2,
      // pos: 277,
      context: '&hellip;the <mark>spec</mark>ified three <mark>char</mark>acters.',
    },
    {
      heading: 'Heading 2-1',
      depth: 2,
      // pos: 373,
      context: 'So, just another <mark>char</mark>acters.&hellip;',
    },
    {
      heading: 'Heading 3',
      depth: 3,
      // pos: 421,
      context: 'And more <mark>char</mark>acters.&hellip;',
    },
  ]

  expect(truncateTermContext(sourceString)).toEqual(expectedResult)
})

// упростить результат
// промаркировать строку документа всеми вхождениями
// определить к какому заголовку относится строка с вхождением(и) (возможно сама строка и есть заголовок), обрезать, дополнить результат

test('Result grouping', () => {
  const input = [
    {
      heading: 'Wraps the <mark>spec</mark>ified one <mark>char</mark>acter.',
      depth: 1,
      // pos: 75,
      context: 'Wraps the <mark>spec</mark>ified one <mark>char</mark>acter.',
    },
    {
      heading: 'Heading 2',
      depth: 2,
      // pos: 156,
      context: 'Wraps the <mark>spec</mark>ified one <mark>char</mark>acter. Wraps&hellip;',
    },
    {
      heading: 'Heading 2',
      depth: 2,
      // pos: 218,
      context: '&hellip;the <mark>spec</mark>ified two <mark>char</mark>acters. Wraps&hellip;',
    },
    {
      heading: 'Heading 2',
      depth: 2,
      // pos: 277,
      context: '&hellip;the <mark>spec</mark>ified three <mark>char</mark>acters.',
    },
    {
      heading: 'Heading 2-1',
      depth: 2,
      // pos: 373,
      context: 'So, just another <mark>char</mark>acters.&hellip;',
    },
    {
      heading: 'Heading 3',
      depth: 3,
      // pos: 421,
      context: 'And more <mark>char</mark>acters.&hellip;',
    },
  ]
  const expected = [
    {
      heading: 'Wraps the <mark>spec</mark>ified one <mark>char</mark>acter.',
      depth: 1,
      contextList: [],
    },
    {
      heading: 'Heading 2',
      depth: 2,
      contextList: [
        'Wraps the <mark>spec</mark>ified one <mark>char</mark>acter. Wraps&hellip;',
        '&hellip;the <mark>spec</mark>ified two <mark>char</mark>acters. Wraps&hellip;',
        '&hellip;the <mark>spec</mark>ified three <mark>char</mark>acters.',
      ],
    },
    {
      heading: 'Heading 2-1',
      depth: 2,
      contextList: [
        'So, just another <mark>char</mark>acters.&hellip;',
      ],
    },
    {
      heading: 'Heading 3',
      depth: 3,
      contextList: [
        'And more <mark>char</mark>acters.&hellip;',
      ],
    },
  ]

  expect(groupContext(input)).toEqual(expected)
})
