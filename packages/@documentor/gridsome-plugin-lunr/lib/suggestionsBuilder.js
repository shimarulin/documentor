const suggestionsBuilder = (documentStringList) => {
  const glossary = []
  documentStringList.forEach(document => {
    const wordList = document
      .split(/\s+/)
      /**
       * normalize words:
       * - remove dot(s) in string start if it is not followed by "/"
       * - remove dot(s) in string end
       * - remove all "*" in string
       * - remove all "_" in string
       * - remove "," and ":" in string end
       * */
      .map(word => word.toLowerCase().replace(/^\.+(?!\/)|\.+$|\*+|_+|[,:]$/g, ''))
      /**
       * filter strings with markdown special patterns:
       * - headings start,
       * - blockquote start,
       * - code block start/end
       * */
      .filter((word) => word.search(/[#>]|`{3}/) === -1)
      /**
       * Mark file path as inline code (url marked too)
       * */
    // .map(word => word.replace(/^(?![`[]).*\./g, '`$&').replace(/(\.[^`]*)(`*)/, '$1`'))
      /**
       * Filter same words in current array
       * */
      .filter((word, index, array) => array.lastIndexOf(word) === index)
      /**
       * Filter same words in glossary array
       * */
      .filter(word => !glossary.includes(word))

    glossary.push(...wordList)
  })

  return glossary.sort()
}

module.exports = suggestionsBuilder
