/**
 * */
const findMarkNode = (tree) => {
  // console.log(Array.isArray(tree.children))
  if (Array.isArray(tree.children) && tree.children.length > 0) {
    // console.log(tree.children)
    tree.children.forEach((node) => {
      const isMark = node.tagName === 'mark'
      if (isMark) {
        // console.log(tree)
      } else {
        findMarkNode(node)
      }
    })
  }
}

function setMarkContext (options) {
  return function transformer (tree) {
    // console.log(root)

    findMarkNode(tree)
  }
}

export default setMarkContext
