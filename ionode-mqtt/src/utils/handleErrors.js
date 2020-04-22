'use strict'

const chalk = require('chalk')

function handleFatalError(error) {
  console.error(chalk.red(`[fatal-error]: ${error.message}`))
  console.error(error.stack)
  process.exit(1)
}

function handleError(error) {
  console.error(`${chalk.red('[error]:')} ${error.message}`)
  console.error(error.stack)
}

module.exports = { handleFatalError, handleError }
