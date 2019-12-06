/**
 * https://github.com/unifiedjs/unified
 * https://github.com/remarkjs/remark-rehype
 * https://github.com/rehypejs/rehype-raw
 * https://github.com/rehypejs/rehype-sanitize
 * */

import unified from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize from 'rehype-sanitize'
import remarkTrimFirstHeading from './remark-trim-first-heading'
import setMarkContext from './rehype-mark-context'

export default function (Vue, options, context) {
  // console.log(Vue)
  console.log(options)
  console.log(context)

  Vue.prototype.$processor = unified()
    .use(remarkParse)
    .use(remarkTrimFirstHeading)
    .use(remarkRehype, {
      allowDangerousHTML: true,
    })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(setMarkContext)
    .use(rehypeStringify)
}
