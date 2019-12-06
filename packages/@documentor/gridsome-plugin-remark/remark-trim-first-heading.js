/**
 * Based on https://github.com/laat/remark-first-heading/blob/master/src/remark-first-heading.js
 * */

module.exports = function trimFirstHeading () {
  return function transformer (root) {
    const first = root.children[0]
    if (first && first.type === 'heading') {
      root.children.shift()
    }
  }
}
