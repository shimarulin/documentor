const suggestionsBuilder = require('./suggestionsBuilder')

const document0 = `# Documentor

> Easily **document** your project

## Features and used plugins`
const document1 = `## Installation and setup

Install _packages_ via __Yarn__:

\`\`\`bash
yarn add @documentor/gridsome-plugin-search
\`\`\`

...or NPM

## Features and *used* plugins

Some files: \`package.json\`, \`README.md\`, \`/index.js\`, \`./test/main.js\`, ./raw.js`
const documents = [
  document0,
  document1,
]

const result = [
  './raw.js',
  '@documentor/gridsome-plugin-search',
  '`./test/main.js`',
  '`/index.js`',
  '`package.json`',
  '`readme.md`',
  'add',
  'and',
  'document',
  'documentor',
  'easily',
  'features',
  'files',
  'install',
  'installation',
  'npm',
  'or',
  'packages',
  'plugins',
  'project',
  'setup',
  'some',
  'used',
  'via',
  'yarn',
  'your',
]

test('create glossary', () => {
  expect(suggestionsBuilder(documents)).toEqual(result)
})
