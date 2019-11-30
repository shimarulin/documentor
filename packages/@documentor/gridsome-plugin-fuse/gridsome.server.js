const path = require('path')
const fs = require('fs')

function CreateSearchIndex (api, options) {
  // const { profile = 'default', ...flexoptions } = flexsearch

  // const collectionsToInclude = collections.map(({ typeName }) => typeName)

  // const search = new FlexSearch({
  //   profile,
  //   ...flexoptions,
  //   doc: {
  //     id: 'id',
  //     field: searchFields,
  //   },
  // })

  api.onCreateNode(node => {
    console.log(node)
    // ====>
    // {
    //   id: 'd0f7c8922de71007dd7e60d4e9fc1164',
    //   '$uid': 'af620439988db31ae27b5627af28ab64',
    //   internal: {
    //     typeName: 'Documentation',
    //     origin: '/home/shimarulin/Проекты/Личные/Core/documentor/docs/README.md',
    //     mimeType: null,
    //     content: null,
    //     timestamp: 1575043137475
    //   },
    //   path: '/',
    //   fileInfo: {
    //     extension: '.md',
    //     directory: '',
    //     path: 'README.md',
    //     name: 'README'
    //   },
    //   content: '\n# README test\n\n> some, some, some...\n\nWOW!!!\n',
    //   excerpt: null,
    //   title: 'README test'
    // }

    // if (collectionsToInclude.includes(node.internal.typeName)) {
    //   const collectionOptions = collections.find(({ typeName }) => typeName === node.internal.typeName)
    //   const index = {
    //     ...collectionOptions,
    //     fields: Array.isArray(searchFields) ? [
    //       ...searchFields,
    //       ...collectionOptions.fields,
    //     ] : collectionOptions.fields,
    //   }
    //   const docFields = index.fields.reduce((obj, key) => ({
    //     [key]: node[key], ...obj,
    //   }), {})
    //
    //   const doc = {
    //     index: index.indexName,
    //     id: node.id,
    //     path: node.path,
    //     ...docFields,
    //   }
    //
    //   search.add(doc)
    // }
  })

  api.configureServer(app => {
    console.log('Serving search index')
    // const searchConfig = {
    //   searchFields,
    //   index: search.export({
    //     serialize: false,
    //   }),
    // }
    // app.get('/flexsearch.json', (req, res) => {
    //   res.json(searchConfig)
    // })
  })

  api.afterBuild(({ queue, config }) => {
    console.log('Saving search index')
    // const filename = path.join(config.outputDir, 'flexsearch.json')
    // const searchConfig = {
    //   searchFields,
    //   index: search.export({
    //     serialize: false,
    //   }),
    // }
    // return fs.writeFileSync(filename, JSON.stringify(searchConfig))
    return true
  })
}

module.exports = CreateSearchIndex

module.exports.defaultOptions = () => ({
  collections: [],
})
