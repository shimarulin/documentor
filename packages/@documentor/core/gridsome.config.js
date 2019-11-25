// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Standard',
  plugins: [
    {
      use: '@gridsome/vue-remark',
      options: {
        typeName: 'Documentation',
        baseDir: '../../../docs',
        index: [
          'README',
        ],
        // pathPrefix: '/', // by default
        pathPrefix: '/',
        template: './src/templates/Documentation.vue',
        // plugins: [
        //   '@gridsome/remark-prismjs',
        // ],
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
    {
      use: 'gridsome-plugin-flexsearch',
      options: {
        collections: [
          {
            typeName: 'Documentation',
            indexName: 'DocumentationIndex',
            fields: [
              'title',
              'content',
            ],
          },
        ],
        searchFields: [
          'title',
          'content',
        ],
      },
    },
  ],
}
