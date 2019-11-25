/*
 * JetBrains IDE's helper to resolve aliases
 * */

const path = require('path')

module.exports = {
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.vue',
      '.ts',
      '.css',
      '.scss',
    ],
    root: path.resolve(__dirname, 'src'),
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'src'),
    },
  },
}
