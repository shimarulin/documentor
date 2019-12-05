import VueFuse from 'vue-fuse'
import highlight from './highlight'

export default function (Vue) {
  Vue.use(VueFuse)
  Vue.prototype.$highlight = highlight
}
