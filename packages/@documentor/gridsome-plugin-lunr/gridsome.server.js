/**
 * https://gridsome.org/docs/server-api/
 */
const lunr = require('lunr')
require('lunr-languages/lunr.stemmer.support')(lunr)
require('lunr-languages/lunr.multi')(lunr)
const {
  DOCUMENT_FIELD_LIST,
  DOCUMENT_LIST_PATH,
  DOCUMENT_TYPE_NAME,
  SEARCH_INDEX_PATH,
} = require('./lib/constants')
const {
  getSaveFn,
  getServeFn,
} = require('./lib/utils')

const createIndex = ({
  documentList = [],
  fieldList = [
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
      serve(DOCUMENT_LIST_PATH, documentList)
      serve(SEARCH_INDEX_PATH, createIndex({
        documentList,
        languageList,
      }))
    })

    // https://gridsome.org/docs/server-api/#apiafterbuildfn
    api.afterBuild(({ queue, config }) => {
      const save = getSaveFn(config.outputDir)
      save(DOCUMENT_LIST_PATH, documentList)
      save(SEARCH_INDEX_PATH, createIndex({
        documentList,
        languageList,
      }))
    })
  }
}

module.exports = Search
