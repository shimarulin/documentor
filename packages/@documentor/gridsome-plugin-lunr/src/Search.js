import lunr from 'lunr'
import pipe from 'ramda/src/pipe'

/**
 * Wraps the specified character ranges with the 'mark' tag
 * @param {string} source - Source string
 * @param {number[][]} positions - List of position: [start, length]
 * @return {string}
 */
export const wrapTerm = (source, positions) => positions.reduce((start, position, index) => {
  const cursor = index > 0 ? positions[index - 1][0] + positions[index - 1][1] : 0
  const begin = source.slice(cursor, position[0])
  const term = source.slice(position[0], position[0] + position[1])
  const end = index === positions.length - 1 ? source.slice(position[0] + position[1]) : ''
  return start + begin + '<mark>' + term + '</mark>' + end
}, '')

/**
 * Context metadata
 * @typedef {Object} ContextMetadata
 * @property {string} heading - The heading of the section contained matched term.
 * @property {string} text - The truncated context of the matched term.
 * */

/**
 * Truncate term context and get additional metadata like section heading
 * @param {string} wrapped - String with wrapped term(s)
 * @returns {ContextMetadata[]} - context metadata
 */
export const truncateTermContext = (wrapped) => {
  const exp = /(\n*)(.*<mark>.+<\/mark>.*)(\n*)/g
  const rowList = []

  let prevRow
  let currentRow
  while ((currentRow = exp.exec(wrapped)) !== null) {
    const currentPrefix = prevRow ? prevRow[3] : ''
    const contextString = (currentPrefix + currentRow[0])
      .replace(/\n{2}/g, '')
      .replace(/\n/g, '&hellip;')
      .trim()

    let headingString = ''
    const isHeadingContext = currentRow[0].search(/\n*#/) !== -1
    if (isHeadingContext) {
      headingString = currentRow[0].replace(/\n*/g, '')
    } else {
      const headings = wrapped
        .slice(0, exp.lastIndex)
        .match(/#{1,6}.+/g)

      headingString = headings ? headings.pop() : ''
    }

    const headingDepth = headingString.match(/#{1,6}/)[0].trim().length

    rowList.push({
      heading: headingString.replace(/#{1,6}\s/, ''),
      depth: headingDepth,
      context: contextString.replace(/#{1,6}\s/, ''),
    })
    prevRow = currentRow
  }

  return rowList
}

export const expandQuery = (query) => ([
  // exact search
  query,

  // forward search
  `${query}*`,

  // contain search
  `*${query}*`,

  // fuzzy search
  `*${query}*~2`,
])

export const walkSearch = (index, queryList) => {
  const results = []

  queryList.forEach(query => {
    results.length < 1 && results.push(...index.search(query))
  })

  return results
}

export const fillDocumentInfo = (documentList, resultList) => {
  return resultList.map(({ ref, score, matchData }) => {
    const document = documentList ? documentList.find(document => document.id === ref) : {}
    return {
      ref,
      score,
      matchData: {
        ...matchData,
        document,
      },
    }
  })
}

const simplifyResults = (resultList) => resultList.map(({ ref, score, matchData: { metadata, document } }) => {
  const fields = {}

  Object.values(metadata).forEach(entry => {
    Object.entries(entry).forEach(([
      field,
      { position: positionList },
    ]) => {
      if (!Object.prototype.hasOwnProperty.call(fields, field)) {
        fields[field] = {
          positions: [],
          content: document[field],
        }
      }

      fields[field].positions = [
        ...fields[field].positions,
        ...positionList,
      ].sort((a, b) => a[0] - b[0])
    })
  })

  return {
    ...fields.content,
    ref,
    score,
    headings: document.headings,
    path: document.path,
  }
})

export const groupContext = (contextItemList) => {
  const contextGroupList = []

  contextItemList.forEach(({ heading, depth, context }) => {
    const contextGroupItem = contextGroupList
      .find(contextGroup => contextGroup.heading === heading) ||
      (contextGroupList.push({
        heading,
        depth,
        contextList: [],
      }) &&
        contextGroupList.slice(-1)[0])

    context !== heading && contextGroupItem.contextList.push(context)
  })

  return contextGroupList
}

export default class Search {
  constructor (
    index,
    documentList,
    expandQueryFn = expandQuery,
    walkSearchFn = walkSearch,
    fillDocumentInfoFn = fillDocumentInfo,
    simplifyResultsFn = simplifyResults,
    wrapTermFn = wrapTerm,
    truncateTermContextFn = truncateTermContext,
    groupContextFn = groupContext,
  ) {
    this.documentList = documentList
    this.index = lunr.Index.load(index)
    this._expandQueryFn = expandQueryFn
    this._walkSearchFn = walkSearchFn
    this._fillDocumentInfoFn = fillDocumentInfoFn
    this._simplifyResultsFn = simplifyResultsFn
    this._wrapTermFn = wrapTermFn
    this._truncateTermContextFn = truncateTermContextFn
    this._groupContextFn = groupContextFn
  }

  search (query) {
    return pipe(
      q => this._expandQueryFn(q),
      qList => this._walkSearchFn(this.index, qList),
      rList => this._fillDocumentInfoFn(this.documentList, rList),
      rList => this._simplifyResultsFn(rList),
      rList => rList.map(({ content, headings, path, positions }) => ({
        content: this._wrapTermFn(content, positions),
        headings,
        path,
      })),
      rList => rList.map(({ content, headings, path }) => ({
        contextItemList: this._truncateTermContextFn(content),
        headings,
        path,
      })),
      rList => rList.map(({ contextItemList, headings, path }) => ({
        contextGroupList: this._groupContextFn(contextItemList),
        headings,
        path,
      })),
      rList => rList.map(({ contextGroupList, headings, path }) => {
        return {
          entries: contextGroupList.map(({
            heading,
            depth,
            contextList,
          }) => {
            const hText = new DOMParser().parseFromString(heading, 'text/html').body.innerText.trim()
            return {
              heading,
              depth,
              path: path + headings.find(h => h.value === hText).anchor,
              contextList,
            }
          }),
        }
      }),
    )(query)
  }
}
