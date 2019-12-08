import axios from 'axios'

export default function (Vue, options) {
  Vue.prototype.$axios = axios.create({
    ...options,
  })
}
