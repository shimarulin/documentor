import VueFuse from 'vue-fuse'
import highlight from './highlight'

export default function (Vue, options, context) {
  Vue.use(VueFuse)
  Vue.prototype.$highlight = highlight

  console.log(Vue)
  console.log(options)
  console.log(context)
  // Vue.mixin({
  //   async mounted () {
  //     const { searchFields, index } = await fetch('/flexsearch.json').then(r => r.json())
  //     this.$search.init({
  //       tokenize: 'strict',
  //       depth: 3,
  //       workers: 2,
  //       doc: {
  //         id: 'id',
  //         field: searchFields
  //       }
  //     })
  //     this.$search.import(index, { serialize: false })
  //   }
  // })
  // Vue.prototype.$search = new FlexSearch()
}
