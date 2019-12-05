import { clone } from 'ramda'

// https://github.com/krisk/Fuse/issues/6
// modified version of
// https://gist.github.com/evenfrost/1ba123656ded32fb7a0cd4651efd4db0
export const highlight = (fuseSearchResult, highlightClassName, tagName = 'mark') => {
  // Use deep clone from Rambda to avoid mutation origin results
  const _fuseSearchResult = clone(fuseSearchResult)
  const set = (obj, path, value) => {
    const pathValue = path.split('.')
    let i

    for (i = 0; i < pathValue.length - 1; i++) {
      obj = obj[pathValue[i]]
    }

    obj[pathValue[i]] = value
  }

  const generateHighlightedText = (inputText, regions = []) => {
    let content = ''
    let nextUnhighlightedRegionStartingIndex = 0

    regions.forEach(region => {
      const lastRegionNextIndex = region[1] + 1
      const startSubString = inputText.substring(nextUnhighlightedRegionStartingIndex, region[0])
      const endSubString = inputText.substring(region[0], lastRegionNextIndex)
      const hasCodeBlockMath = startSubString.search(/```[a-z]*$/g) !== -1

      if (hasCodeBlockMath) {
        content += [
          startSubString,
          endSubString,
        ].join('')
      } else {
        content += [
          startSubString,
          `<${tagName}${highlightClassName ? ` class="${highlightClassName}"` : ''}>`,
          endSubString,
          `</${tagName}>`,
        ].join('')
      }

      nextUnhighlightedRegionStartingIndex = lastRegionNextIndex
    })

    content += inputText.substring(nextUnhighlightedRegionStartingIndex)

    return content
  }

  return _fuseSearchResult
    .filter(({ matches }) => matches && matches.length)
    .map(({ item, matches }) => {
      const highlightedItem = {
        ...item,
      }

      matches.forEach((match) => {
        set(highlightedItem, match.key, generateHighlightedText(match.value, match.indices))
      })

      return highlightedItem
    })
}

export default highlight
