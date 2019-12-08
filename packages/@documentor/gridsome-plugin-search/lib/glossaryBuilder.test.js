const glossaryBuilder = require('./glossaryBuilder')

const document0 = `# Documentor

> Easily **document** your project

## Features and used plugins`
const document1 = `## Installation and setup

Install _package_ via __Yarn__:

\`\`\`bash
yarn add @documentor/gridsome-plugin-search
\`\`\`

...or NPM

## Features and *used* plugins`
const documents = [
  document0,
  document1,
]

const result = [
  '@documentor/gridsome-plugin-search',
  'add',
  'and',
  'document',
  'documentor',
  'easily',
  'features',
  'install',
  'installation',
  'npm',
  'or',
  'package',
  'plugins',
  'project',
  'setup',
  'used',
  'via',
  'yarn',
  'your',
]

test('create glossary', () => {
  expect(glossaryBuilder(documents)).toEqual(result)
})
