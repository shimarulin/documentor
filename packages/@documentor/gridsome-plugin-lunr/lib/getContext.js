/**
 * Wraps the specified character ranges with the 'mark' tag
 * @param {string} source - Source string
 * @param {number[][]} positions - List of position: [start, length]
 * @return {string}
 */
const wrapTerm = (source, positions) => positions.reduce((start, position, index) => {
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
 * @property {string} context - The truncated context of the matched term.
 * */

/**
 * Truncate term context and get additional metadata like section heading
 * @param {string} wrapped - String with wrapped term(s)
 * @returns {ContextMetadata[]} - context metadata
 */
const truncateTermContext = (wrapped) => {
  const exp = /(\n*)(.*<mark>.+<\/mark>.*)(\n*)/g
  const rowList = []

  let prevRow
  let currentRow
  while ((currentRow = exp.exec(wrapped)) !== null) {
    const currentPrefix = prevRow ? prevRow[3] : ''
    const context = (currentPrefix + currentRow[0])
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
      context,
    })
    prevRow = currentRow
  }

  return rowList
}

module.exports = {
  wrapTerm,
  truncateTermContext,
}
