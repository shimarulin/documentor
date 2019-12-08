const path = require('path')
const fs = require('fs')

const serve = (app, filePath, data) => {
  // https://expressjs.com/en/api.html#res.json
  app.get(`/${filePath}`, (req, res) => {
    res.json(data)
  })
}
const save = (outputDir, filePath, data) => {
  fs.writeFileSync(
    path.join(outputDir, filePath),
    JSON.stringify(data),
  )
}
const getServeFn = (app) => {
  return serve.bind(null, app)
}
const getSaveFn = (outputDir) => {
  return save.bind(null, outputDir)
}

module.exports = {
  serve,
  save,
  getServeFn,
  getSaveFn,
}
