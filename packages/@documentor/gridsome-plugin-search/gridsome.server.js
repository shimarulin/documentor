/**
 * https://gridsome.org/docs/server-api/
 */
const lunr = require('lunr')
require('lunr-languages/lunr.stemmer.support')(lunr)
require('lunr-languages/lunr.multi')(lunr)
const {
  DOCUMENT_TYPE_NAME,
  DOCUMENT_FIELD_LIST,
  SEARCH_INDEX_PATH,
  SEARCH_SUGGESTIONS_PATH,
} = require('./lib/constants')
const glossaryBuilder = require('./lib/suggestionsBuilder')
const {
  getSaveFn,
  getServeFn,
} = require('./lib/data2file')

const glossaryMapper = (documentList) => {
  return glossaryBuilder(documentList.map(document => document.content))
}

const createIndex = ({
  documentList = [],
  fieldList = [
    'title',
    'content',
  ],
  languageList = [
    'en',
  ],
}) => {
  return lunr(function () {
    this.use(lunr.multiLanguage(...languageList))
    this.ref('id')
    this.metadataWhitelist = [
      'position',
    ]

    fieldList.forEach(function (field) {
      this.field(field)
    }, this)

    documentList.forEach(function (doc) {
      this.add(doc)
    }, this)
  })
}

class Search {
  static defaultOptions () {
    return {
      languages: [
        'en',
      ],
    }
  }

  constructor (api, { languages: languageList }) {
    languageList
      .filter(lang => lang !== 'en')
      .forEach(lang => {
        require(`lunr-languages/lunr.${lang}`)(lunr)
      })

    const documentList = []
    // console.log(api)
    // const gridsomeVueRemarkPluginConfig = api._app.config.plugins.find(plugin => plugin.use === '@gridsome/vue-remark')
    // if (gridsomeVueRemarkPluginConfig) {
    //   const { remark: remarkOptions, plugins: remarkPlugins } = gridsomeVueRemarkPluginConfig.options
    //   console.log(remarkOptions, remarkPlugins)
    // }
    //
    // api.setClientOptions({
    //   ...options,
    //   customOption: 'test',
    // })

    api.onCreateNode(node => {
      if (node.internal.typeName === DOCUMENT_TYPE_NAME) {
        const doc = DOCUMENT_FIELD_LIST.reduce((obj, key) => ({
          [key]: node[key], ...obj,
        }), {})

        documentList.push(doc)
      }
    })

    // https://gridsome.org/docs/server-api/#apiconfigureserverfn
    api.configureServer(app => {
      const serve = getServeFn(app)
      serve(SEARCH_SUGGESTIONS_PATH, glossaryMapper(documentList))
      serve(SEARCH_INDEX_PATH, createIndex({
        documentList,
        languageList,
      }))
    })

    // https://gridsome.org/docs/server-api/#apiafterbuildfn
    api.afterBuild(({ queue, config }) => {
      const save = getSaveFn(config.outputDir)
      save(SEARCH_SUGGESTIONS_PATH, glossaryMapper(documentList))
      save(SEARCH_INDEX_PATH, createIndex({
        documentList,
        languageList,
      }))
    })
  }
}

module.exports = Search
