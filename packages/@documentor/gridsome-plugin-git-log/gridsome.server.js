const { execSync } = require('child_process')

module.exports = function (api, { nodeTypeList }) {
  api.onCreateNode((node) => {
    if (nodeTypeList.includes(node.internal.typeName)) {
      const createdAt = execSync(`git log --pretty=format:%cd -n 1 --date=iso --diff-filter=A -- ${node.internal.origin}`).toString()
      const updatedAt = execSync(`git log --pretty=format:%cd -n 1 --date=iso -- ${node.internal.origin}`).toString()

      return {
        ...node,
        git: {
          createdAt: createdAt !== '' ? new Date(createdAt) : new Date(),
          updatedAt: updatedAt !== '' ? new Date(updatedAt) : new Date(),
        },
      }
    }
  })
}

module.exports.defaultOptions = () => ({
  nodeTypeList: [
    'Documentation',
  ],
})
