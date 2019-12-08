class Search {
  static defaultOptions () {
    return {
      optionRC: 'value1',
    }
  }

  constructor (api, options) {
    // console.log(api)
    const gridsomeVueRemarkPluginConfig = api._app.config.plugins.find(plugin => plugin.use === '@gridsome/vue-remark')
    if (gridsomeVueRemarkPluginConfig) {
      const { remark: remarkOptions, plugins: remarkPlugins } = gridsomeVueRemarkPluginConfig.options
      console.log(remarkOptions, remarkPlugins)
    }

    api.setClientOptions({
      ...options,
      customOption: 'test',
    })
  }
}

module.exports = Search
