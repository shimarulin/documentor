import lunr from 'lunr'
import Search from './Search'

require('lunr-languages/lunr.stemmer.support')(lunr)

export default function (Vue, { languages: languageList }, context) {
  // console.log(options)
  // console.log(context)
  languageList
    .filter(lang => lang !== 'en')
    .forEach(lang => {
      require(`lunr-languages/lunr.${lang}`)(lunr)
    })

  Vue.prototype.$lunr = lunr
  Vue.component('Search', Search)
}
