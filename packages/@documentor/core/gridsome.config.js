const { cosmiconfigSync } = require('cosmiconfig')

const explorerSync = cosmiconfigSync('documentor')
const documentorRc = explorerSync.search()

const remarkPlugins = []

if (documentorRc.config.emoji === 'native') {
  remarkPlugins.push('remark-gemoji-to-emoji')
} else if (documentorRc.config.emoji === 'github') {
  remarkPlugins.push(
    'remark-gemoji-to-emoji',
    [
      'remark-html-emoji-image',
      {
        base: 'https://github.githubassets.com/images/icons/emoji/',
      },
    ],
  )
}

console.log(documentorRc.config)

// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Standard',
  plugins: [
    {
      use: '@documentor/gridsome-plugin-git-log',
      options: {},
    },
    {
      use: '@documentor/gridsome-plugin-axios',
      options: {},
    },
    {
      use: '@gridsome/vue-remark',
      options: {
        typeName: 'Documentation',
        baseDir: '../../../docs',
        index: [
          'index',
          'README',
        ],
        // pathPrefix: '/', // by default
        pathPrefix: '/',
        template: './src/templates/Documentation.vue',
        plugins: remarkPlugins,
        // remark: {
        //   autolinkHeadings: {
        //     content: {
        //       type: 'text',
        //       value: '#',
        //     },
        //   },
        // },
      },
    },
    // {
    //   use: '@documentor/gridsome-plugin-remark',
    //   options: {},
    // },
    {
      use: '@documentor/gridsome-plugin-lunr',
      options: {
        languages: [
          'en',
          'ru',
        ],
      },
    },
  ],
}
