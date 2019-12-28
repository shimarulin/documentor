// TODO: Добавить резолвер для .documentorrc.js

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
        plugins: [],
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
