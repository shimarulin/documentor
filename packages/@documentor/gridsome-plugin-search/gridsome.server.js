/**
 * https://gridsome.org/docs/server-api/
 */
const {
  DOCUMENT_TYPE_NAME,
  DOCUMENT_FIELD_LIST,
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

class Search {
  static defaultOptions () {
    return {
      languages: [],
    }
  }

  constructor (api, options) {
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
      // console.log(documentList.map(document => document.content))

      // const idx = createIndex(collection.fieldList, documentList)
      //
      // // console.log(idx)
      //
      serve(SEARCH_SUGGESTIONS_PATH, glossaryMapper(documentList))
    })

    // https://gridsome.org/docs/server-api/#apiafterbuildfn
    api.afterBuild(({ queue, config }) => {
      const save = getSaveFn(config.outputDir)
      save(SEARCH_SUGGESTIONS_PATH, glossaryMapper(documentList))
    })
  }
}

module.exports = Search
