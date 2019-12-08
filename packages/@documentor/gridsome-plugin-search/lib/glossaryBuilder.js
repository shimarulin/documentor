const glossaryBuilder = (documentStringList) => {
  const glossary = []
  documentStringList.forEach(document => {
    const wordList = document
      .split(/\s+/)
      // normalize words and remove markdown patterns
      .map(word => word.toLowerCase().replace(/:|\.+|\*+|_+/g, ''))
      // filter markdown special patterns
      .filter((word) => word.search(/[`#>]/) === -1)
      // filter same words in current array
      .filter((word, index, array) => array.lastIndexOf(word) === index)
      // filter same words in glossary array
      .filter(word => !glossary.includes(word))
    glossary.push(...wordList)
  })

  return glossary.sort()
}

module.exports = glossaryBuilder
