import lunr from 'lunr'

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
    const text = (currentPrefix + currentRow[0])
      .replace(/\n{2}/g, '')
      .replace(/\n/g, '&hellip;')
      .trim()

    let heading = ''
    const isHeadingContext = currentRow[0].search(/\n*#/) !== -1
    if (isHeadingContext) {
      heading = currentRow[0].replace(/\n*/g, '')
    } else {
      const headings = wrapped
        .slice(0, exp.lastIndex)
        .match(/#{2,5}.+/g)

      heading = headings ? headings.pop() : ''
    }

    rowList.push({
      heading,
      text,
      pos: exp.lastIndex,
    })
    prevRow = currentRow
  }

  return rowList
}

// queryMetadata
export const getQueryMetadata = (query) => {
  const isAdvancedSearch = query.search(/[*~^]/) !== -1
  const isFuzzy = query.search(/~/) !== -1
  const hasEditDistance = query.search(/~\d+$/) !== -1

  return {
    isAdvancedSearch,
    isFuzzy,
    hasEditDistance,
  }
}

// rawResultList
export const getSearchResultList = (index, query, queryMetadata) => {
  if (query.length < 1) { return [] }

  const { isAdvancedSearch, isFuzzy, hasEditDistance } = queryMetadata

  const results = []

  if ((isAdvancedSearch && !isFuzzy) || (isAdvancedSearch && hasEditDistance)) {
    index && results.push(...index.search(query))
  } else if (!isAdvancedSearch) {
    const forwardSearchResults = index.search(`${query}*`)
    const containSearchResults = index.search(`*${query}*`)
    const fuzzySearchResults = index.search(`*${query}*~2`)

    results.push(...forwardSearchResults)
    forwardSearchResults.length < 1 && results.push(...containSearchResults)
    forwardSearchResults.length < 1 && containSearchResults.length < 1 && results.push(...fuzzySearchResults)
  }

  return results
}

// documentResultList
export const mergeDocumentListToSearchResultList = (resultList, documentList) => {
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

// contextResultList
export const makeContextToSearchResultList = (wrapTermFn, truncateTermContextFn, resultDocumentList) => {
  return resultDocumentList.map(({ ref, score, matchData: { metadata, document } }) => {
    const contextList = []

    Object.entries(metadata).forEach(([
      term,
      entry,
    ]) => {
      Object.entries(entry).forEach(([
        field,
        { position: positionList },
      ]) => {
        const wrappedTerm = wrapTermFn(document[field], positionList)
        const truncatedTermContextList = truncateTermContextFn(wrappedTerm).map(ctx => {
          return {
            ...ctx,
            term,
            id: `${ref} - '${term}' in ${field}(${score}, ${ctx.pos}): ${ctx.text}`,
          }
        })

        contextList.push(...truncatedTermContextList)
      })
    })

    return {
      ref,
      score,
      matchData: {
        metadata,
        document,
        contextList,
      },
    }
  })
}

export default class Search {
  constructor (index, documentList) {
    this.documentList = documentList
    this.index = lunr.Index.load(index)
  }

  search (query) {
    const queryMetadata = getQueryMetadata(query)
    const searchResultList = getSearchResultList(this.index, query, queryMetadata)
    const searchResultDocumentList = mergeDocumentListToSearchResultList(searchResultList, this.documentList)
    const searchResultContextList = makeContextToSearchResultList(wrapTerm, truncateTermContext, searchResultDocumentList)

    return {
      queryMetadata,
      resultList: searchResultContextList,
    }
  }
}
