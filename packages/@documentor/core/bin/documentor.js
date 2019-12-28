#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const pkg = require('../package')

const context = path.resolve(__dirname, '../')
const info = `Documentor v${pkg.version}`
const label = 'based on'

require('gridsome')({
  context, program,
})

console.log(chalk.cyan.bold(info))
console.log(label)
// console.log(chalk.bgCyan.bold(info))
// console.log(chalk.bgCyan(label))

program.parse(process.argv)
