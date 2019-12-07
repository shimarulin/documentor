import axios from 'axios'

export default function (Vue, options, context) {
  // console.log(Vue)
  console.log(options)
  console.log(context)
  Vue.prototype.$axios = axios.create({
    ...options,
  })
}
